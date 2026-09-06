"""Tabular ingestion and profiling. No customer-specific column names."""

import csv
import io
import json
import math
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import pyarrow.parquet as pq

FORMATS = {".csv", ".tsv", ".json", ".jsonl", ".ndjson", ".xlsx", ".parquet"}


def validate_headers(columns):
    if any(pd.isna(column) for column in columns):
        raise ValueError("Every column needs a non-empty header.")
    names = [str(column).strip() for column in columns]
    if not names or any(not name for name in names):
        raise ValueError("Every column needs a non-empty header.")
    if len(set(names)) != len(names):
        raise ValueError("Column headers must be unique, including after trimming whitespace.")
    if any(len(name) > 200 for name in names):
        raise ValueError("Column headers must be at most 200 characters long.")
    return names


def records_frame(records):
    if not isinstance(records, list) or not all(isinstance(row, dict) for row in records):
        raise ValueError('JSON must be an array of objects or an object with a "data" array.')
    # Preserve nested structures as JSON strings rather than flattening ambiguous paths.
    return pd.DataFrame(
        [
            {
                key: json.dumps(value, ensure_ascii=False)
                if isinstance(value, (dict, list))
                else value
                for key, value in record.items()
            }
            for record in records
        ]
    )


def read_upload(raw, filename, options, max_rows, max_columns):
    suffix = Path(filename).suffix.lower()
    if suffix not in FORMATS:
        raise ValueError("Unsupported format. Use CSV, TSV, JSON, JSONL, XLSX, or Parquet.")
    stream = io.BytesIO(raw)
    if suffix in {".csv", ".tsv"}:
        encoding = options.get("encoding", "utf-8-sig")
        if encoding not in {"utf-8-sig", "cp1252", "latin-1"}:
            raise ValueError("Unsupported text encoding.")
        text = raw.decode(encoding)
        delimiter = options.get("delimiter") or ("\t" if suffix == ".tsv" else None)
        if delimiter is None:
            try:
                delimiter = csv.Sniffer().sniff(text[:65536], delimiters=",;\t|").delimiter
            except csv.Error:
                delimiter = ","
        if delimiter not in {",", ";", "\t", "|"}:
            raise ValueError("Delimiter must be comma, semicolon, tab, or pipe.")
        reader = csv.reader(io.StringIO(text), delimiter=delimiter, strict=True)
        headers = validate_headers(next(reader, []))
        if len(headers) > max_columns:
            raise ValueError(f"Limit exceeded: at most {max_columns} columns.")
        rows = []
        for number, row in enumerate(reader, start=2):
            if not row:
                continue
            if len(row) != len(headers):
                raise ValueError(
                    f"CSV record {number} has {len(row)} fields; expected {len(headers)}."
                )
            rows.append(row)
            if len(rows) > max_rows:
                raise ValueError(f"Limit exceeded: at most {max_rows:,} rows.")
        frame = pd.DataFrame(rows, columns=headers)
    elif suffix == ".xlsx":
        with zipfile.ZipFile(stream) as archive:
            if sum(info.file_size for info in archive.infolist()) > 100 * 1024 * 1024:
                raise ValueError("Expanded Excel workbook exceeds the 100 MB limit.")
        stream.seek(0)
        sheet = options.get("sheet") or 0
        # Read headers as data so duplicate/blank names are not silently rewritten.
        table = pd.read_excel(
            stream,
            sheet_name=sheet,
            header=None,
            nrows=max_rows + 2,
            keep_default_na=False,
            engine="openpyxl",
        )
        if table.empty:
            raise ValueError("The selected worksheet is empty.")
        frame = table.iloc[1:].copy()
        frame.columns = validate_headers(table.iloc[0])
        frame.reset_index(drop=True, inplace=True)
    elif suffix == ".parquet":
        parquet = pq.ParquetFile(stream)
        if parquet.metadata.num_rows > max_rows or len(parquet.schema_arrow.names) > max_columns:
            raise ValueError("Parquet exceeds the configured row or column limit.")
        if (
            sum(
                parquet.metadata.row_group(i).total_byte_size
                for i in range(parquet.metadata.num_row_groups)
            )
            > 100 * 1024 * 1024
        ):
            raise ValueError("Expanded Parquet data exceeds the 100 MB limit.")
        frame = parquet.read().to_pandas()
    else:
        text = raw.decode("utf-8-sig")
        if suffix in {".jsonl", ".ndjson"}:
            records = [json.loads(line) for line in text.splitlines() if line.strip()]
        else:
            records = json.loads(text)
            if isinstance(records, dict):
                records = records.get("data")
        if isinstance(records, list) and len(records) > max_rows:
            raise ValueError(f"Limit exceeded: at most {max_rows:,} rows.")
        frame = records_frame(records)
    return normalize(frame, filename, options, max_rows, max_columns)


def normalize(frame, filename, options, max_rows, max_columns):
    if frame.empty:
        raise ValueError("The dataset must contain at least one row and one column.")
    if len(frame) > max_rows or len(frame.columns) > max_columns:
        raise ValueError(f"Limit exceeded: at most {max_rows:,} rows and {max_columns} columns.")
    frame.columns = validate_headers(frame.columns)
    warnings = []
    try:
        overrides = json.loads(options.get("column_types") or "{}")
    except (ValueError, TypeError) as error:
        raise ValueError('Column types must be JSON, for example {"id": "text"}.') from error
    if not isinstance(overrides, dict) or any(
        name not in frame.columns or kind not in {"text", "number", "datetime"}
        for name, kind in overrides.items()
    ):
        raise ValueError("Column types must map existing columns to text, number, or datetime.")
    decimal = options.get("decimal", ".")
    if decimal not in {".", ","}:
        raise ValueError("Decimal separator must be a period or comma.")
    for name in frame.columns:
        series = frame[name]
        override = overrides.get(name)
        if override or (
            not pd.api.types.is_numeric_dtype(series)
            and not pd.api.types.is_datetime64_any_dtype(series)
        ):
            series = (
                series.map(
                    lambda value: (
                        None
                        if pd.api.types.is_scalar(value) and pd.isna(value)
                        else str(value).strip()
                    )
                )
                .replace("", None)
                .astype("string")
            )
        if override == "text":
            frame[name] = series
            continue
        if override in {"number", "datetime"}:
            converted = (
                pd.to_numeric(
                    series.str.replace(",", ".", regex=False) if decimal == "," else series,
                    errors="coerce",
                )
                if override == "number"
                else pd.to_datetime(
                    series,
                    errors="coerce",
                    utc=True,
                    format=options.get("date_format") or "mixed",
                )
            )
            invalid = int((series.notna() & converted.isna()).sum())
            if invalid:
                raise ValueError(f"{name}: {invalid} values cannot be converted to {override}.")
            series = converted
        if not pd.api.types.is_numeric_dtype(series) and not pd.api.types.is_datetime64_any_dtype(
            series
        ):
            present = series.dropna()
            if len(present):
                numeric = pd.to_numeric(
                    present.str.replace(",", ".", regex=False) if decimal == "," else present,
                    errors="coerce",
                )
                leading_zero = present.str.match(r"^[+-]?0\d+").any()
                if numeric.notna().all() and not leading_zero:
                    if (numeric.abs() > 2**53 - 1).any():
                        frame[name] = series
                        warnings.append(
                            f"{name}: large numbers kept as text to avoid browser precision loss."
                        )
                        continue
                    series = pd.to_numeric(
                        series.str.replace(",", ".", regex=False) if decimal == "," else series,
                        errors="coerce",
                    )
                elif present.str.match(r"^\d{4}-\d{2}-\d{2}(?:[T ].*)?$").all():
                    dates = pd.to_datetime(series, errors="coerce", utc=True, format="mixed")
                    if dates.notna().sum() == len(present):
                        series = dates
                    else:
                        warnings.append(f"{name}: invalid dates; kept as text.")
                elif numeric.notna().any() and not leading_zero:
                    warnings.append(f"{name}: mixed numeric and text values; kept as text.")
        frame[name] = series
        if pd.api.types.is_datetime64_any_dtype(series):
            frame[name] = pd.to_datetime(series, utc=True)
        if pd.api.types.is_numeric_dtype(frame[name]):
            finite = frame[name].map(lambda value: pd.isna(value) or math.isfinite(value))
            if not finite.all():
                frame.loc[~finite, name] = float("nan")
                warnings.append(f"{name}: non-finite values converted to missing values.")
            if (frame[name].abs() > 2**53 - 1).any():
                if override == "number":
                    raise ValueError(
                        f"{name}: values exceed the safe chart numeric range (2^53 - 1)."
                    )
                frame[name] = frame[name].astype("string")
                warnings.append(
                    f"{name}: large numbers kept as text to avoid browser precision loss."
                )
    columns = []
    for name in frame.columns:
        series = frame[name]
        kind = (
            "number"
            if pd.api.types.is_numeric_dtype(series) and not pd.api.types.is_bool_dtype(series)
            else "datetime"
            if pd.api.types.is_datetime64_any_dtype(series)
            else "text"
        )
        columns.append(
            {
                "name": name,
                "type": kind,
                "missing": int(series.isna().sum()),
                "unique": int(series.nunique()),
            }
        )
    metadata = {
        "name": Path(filename).name[:200],
        "rows": len(frame),
        "columns": columns,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "warnings": warnings,
        "missing_cells": int(frame.isna().sum().sum()),
        "duplicate_rows": int(frame.duplicated().sum()),
    }
    return frame, metadata


def json_records(frame):
    return json.loads(frame.to_json(orient="records", date_format="iso", double_precision=15))


def filtered(frame, args):
    column = args.get("filter_column")
    value = args.get("filter_value", "")
    if column:
        if column not in frame.columns:
            raise ValueError("Unknown filter column.")
        frame = frame[
            frame[column].astype("string").str.contains(value, case=False, regex=False, na=False)
        ]
    return frame


def chart(frame, metadata, args):
    x = args.get("x")
    ys = args.getlist("y")
    aggregation = args.get("aggregation", "mean")
    if x not in frame.columns:
        raise ValueError("Select a valid dimension.")
    if aggregation not in {"mean", "sum", "min", "max", "count", "none"}:
        raise ValueError("Unknown aggregation.")
    numeric = {column["name"] for column in metadata["columns"] if column["type"] == "number"}
    if aggregation != "count" and (not ys or len(ys) > 6 or any(y not in numeric for y in ys)):
        raise ValueError("Select between one and six numeric measures.")
    ys = list(dict.fromkeys(ys))
    frame = filtered(frame, args)
    omitted = int(frame[x].isna().sum())
    source = frame.dropna(subset=[x])
    if aggregation == "none":
        result = source[[x] + [y for y in ys if y != x]].sort_values(x, kind="stable")
    elif aggregation == "count":
        name = "Row count" if x != "Row count" else "Count"
        result = source.groupby(x, sort=True).size().rename(name).reset_index()
        ys = [name]
    else:
        if x in ys:
            raise ValueError("For aggregation, choose measures different from the dimension.")
        # Floating aggregation avoids int64 sum overflow for large groups.
        source = source.copy()
        source[ys] = source[ys].astype("float64")
        grouped = source.groupby(x, sort=True)[ys]
        result = (
            grouped.sum(min_count=1) if aggregation == "sum" else grouped.agg(aggregation)
        ).reset_index()
    total = len(result)
    result = result.head(1000)
    rows = json_records(result)
    return {
        "labels": [row[x] for row in rows],
        "series": [{"name": y, "values": [row[y] for row in rows]} for y in ys],
        "total_points": total,
        "shown_points": len(result),
        "matched_rows": len(frame),
        "omitted_dimension_rows": omitted,
        "truncated": total > len(result),
    }


def safe_csv(frame):
    frame = frame.copy()
    for name in frame.columns:
        if not pd.api.types.is_numeric_dtype(frame[name]):
            frame[name] = frame[name].map(
                lambda value: (
                    "'" + value
                    if isinstance(value, str) and re.match(r"^[\s]*[=+@-]", value)
                    else value
                )
            )
    frame.columns = [
        "'" + name if re.match(r"^[\s]*[=+@-]", name) else name for name in frame.columns
    ]
    return frame.to_csv(index=False)
