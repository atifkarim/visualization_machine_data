import io

import pandas as pd
import pytest

from dashboard import create_app

HEADERS = {"X-Requested-With": "DataExplorer"}


@pytest.fixture()
def app(tmp_path):
    return create_app({"TESTING": True, "DATA_DIR": str(tmp_path)})


@pytest.fixture()
def client(app):
    return app.test_client()


def upload(client, raw=b"region,value\nNorth,10\nSouth,20\nNorth,30\n", name="data.csv", **options):
    return client.post(
        "/api/datasets", data={"file": (io.BytesIO(raw), name), **options}, headers=HEADERS
    )


def test_complete_lifecycle_and_persistence(client, app):
    assert client.get("/").status_code == 200
    assert client.get("/static/app.js").status_code == 200
    assert client.get("/api/health").json == {"status": "ok"}
    response = upload(client)
    assert response.status_code == 201
    dataset_id = response.json["id"]
    base = f"/api/datasets/{dataset_id}"
    assert client.get("/api/datasets").json["datasets"][0]["rows"] == 3
    chart = client.get(base + "/chart?x=region&y=value&aggregation=mean").json
    assert chart["labels"] == ["North", "South"]
    assert chart["series"][0]["values"] == [20, 20]
    assert client.get(base + "?offset=1&limit=1").json["rows"] == [{"region": "South", "value": 20}]
    restarted = create_app({"TESTING": True, "DATA_DIR": app.config["DATA_DIR"]}).test_client()
    assert restarted.get(base).json["total_rows"] == 3
    assert client.delete(base, headers=HEADERS).status_code == 204
    assert client.get(base).status_code == 404


@pytest.mark.parametrize(
    "name,raw",
    [
        ("data.tsv", b"region\tvalue\nNorth\t10\n"),
        ("data.json", b'[{"region":"North","value":10}]'),
        ("data.json", b'{"data":[{"region":"North","value":10}]}'),
        ("data.jsonl", b'{"region":"North","value":10}\n'),
        ("data.ndjson", b'{"region":"North","value":10}\n'),
    ],
)
def test_text_formats(client, name, raw):
    response = upload(client, raw, name)
    assert response.status_code == 201, response.json
    assert response.json["rows"] == 1
    assert response.json["columns"][1]["type"] == "number"


@pytest.mark.parametrize("suffix", ["xlsx", "parquet"])
def test_binary_formats(client, suffix):
    frame = pd.DataFrame({"region": ["North", None], "value": [10, 20]})
    buffer = io.BytesIO()
    if suffix == "xlsx":
        frame.to_excel(buffer, index=False)
    else:
        frame.to_parquet(buffer, index=False)
    response = upload(client, buffer.getvalue(), f"data.{suffix}")
    assert response.status_code == 201, response.json
    assert response.json["rows"] == 2
    assert response.json["missing_cells"] == 1


@pytest.mark.parametrize(
    "raw,name",
    [
        (b"", "empty.csv"),
        (b"a,b\n", "empty.csv"),
        (b"a,a\n1,2\n", "duplicates.csv"),
        (b" a ,a\n1,2\n", "duplicates.csv"),
        (b"a,\n1,2\n", "blank.csv"),
        (b"a,b\n1,2,3\n", "ragged.csv"),
        (b"a,b\n1\n", "ragged.csv"),
        (b"hello", "data.exe"),
        (b"{bad", "data.json"),
        (b"[1,2]", "data.json"),
        (b"{}", "data.json"),
        (b"garbage", "data.parquet"),
        (b"garbage", "data.xlsx"),
    ],
)
def test_bad_imports_are_actionable(client, raw, name):
    response = upload(client, raw, name)
    assert response.status_code == 400, response.json
    assert response.json["error"]
    assert client.get("/api/datasets").json["datasets"] == []


def test_encoding_decimal_and_identifier_preservation(client):
    response = upload(
        client, "id;city;value\n001;München;12,5\n".encode("cp1252"), encoding="cp1252", decimal=","
    )
    assert response.status_code == 201, response.json
    result = client.get(f"/api/datasets/{response.json['id']}").json
    assert result["rows"] == [{"id": "001", "city": "München", "value": 12.5}]


def test_dates_missing_and_mixed_types(client):
    response = upload(client, b"date,value,code\n2026-01-01,1,10\n2026-01-02,,bad\n")
    assert response.status_code == 201, response.json
    assert [column["type"] for column in response.json["columns"]] == ["datetime", "number", "text"]
    assert response.json["missing_cells"] == 1
    assert "mixed" in response.json["warnings"][0]


def test_filters_aggregation_and_export_agree(client):
    dataset_id = upload(client).json["id"]
    base = f"/api/datasets/{dataset_id}"
    query = "filter_column=region&filter_value=nOr"
    assert client.get(base + "?" + query).json["total_rows"] == 2
    chart = client.get(base + "/chart?x=region&y=value&aggregation=sum&" + query).json
    assert chart["matched_rows"] == 2
    assert chart["series"][0]["values"] == [40]
    exported = client.get(base + "/export?" + query).data.decode("utf-8-sig")
    assert "South" not in exported and exported.count("North") == 2


@pytest.mark.parametrize(
    "query",
    ["x=no&y=value", "x=region&y=region", "x=region&y=value&aggregation=bad", "x=value&y=value"],
)
def test_invalid_chart_configuration(client, query):
    dataset_id = upload(client).json["id"]
    assert client.get(f"/api/datasets/{dataset_id}/chart?{query}").status_code == 400


def test_count_without_measures_and_raw_values(client):
    dataset_id = upload(client).json["id"]
    base = f"/api/datasets/{dataset_id}/chart"
    assert client.get(base + "?x=region&aggregation=count").json["series"][0]["values"] == [2, 1]
    assert client.get(base + "?x=value&y=value&aggregation=none").json["series"][0]["values"] == [
        10,
        20,
        30,
    ]


def test_null_sum_and_missing_dimension(client):
    dataset_id = upload(client, b"group,value\nA,\nB,1\n,2\n").json["id"]
    result = client.get(f"/api/datasets/{dataset_id}/chart?x=group&y=value&aggregation=sum").json
    assert result["series"][0]["values"] == [None, 1]
    assert result["omitted_dimension_rows"] == 1


def test_mutations_require_header_and_same_origin(client):
    assert client.post("/api/datasets").status_code == 403
    assert (
        client.post(
            "/api/datasets", headers={**HEADERS, "Origin": "https://evil.example"}
        ).status_code
        == 403
    )
    assert client.post("/api/datasets", headers=HEADERS).status_code == 400


def test_json_api_and_nested_records(client):
    response = client.post(
        "/api/datasets", json=[{"id": "001", "nested": {"a": 1}, "value": 4}], headers=HEADERS
    )
    assert response.status_code == 201
    result = client.get(f"/api/datasets/{response.json['id']}").json
    assert result["rows"][0]["nested"] == '{"a": 1}'


def test_limits_reject_without_truncating(client, app):
    app.config["MAX_ROWS"] = 2
    assert upload(client).status_code == 400
    app.config["MAX_ROWS"] = 100
    app.config["MAX_COLUMNS"] = 1
    assert upload(client).status_code == 400
    app.config["MAX_CONTENT_LENGTH"] = 10
    assert upload(client).status_code == 413


def test_dataset_limit(client, app):
    app.extensions["datasets"].max_datasets = 1
    assert upload(client).status_code == 201
    assert upload(client).status_code == 400


def test_chart_truncation_is_explicit(client):
    data = "x,value\n" + "\n".join(f"{i},{i}" for i in range(1005))
    dataset_id = upload(client, data.encode()).json["id"]
    result = client.get(f"/api/datasets/{dataset_id}/chart?x=x&y=value").json
    assert result["truncated"] is True
    assert result["total_points"] == 1005
    assert result["shown_points"] == 1000


def test_csv_formula_injection(client):
    dataset_id = upload(client, b"name,value\n=1+2,3\n@SUM(A1),4\n").json["id"]
    text = client.get(f"/api/datasets/{dataset_id}/export").data.decode("utf-8-sig")
    assert "'=1+2" in text and "'@SUM(A1)" in text


@pytest.mark.parametrize(
    "query", ["offset=-1", "limit=0", "limit=201", "offset=no", "filter_column=bad"]
)
def test_bad_preview_parameters(client, query):
    dataset_id = upload(client).json["id"]
    assert client.get(f"/api/datasets/{dataset_id}?{query}").status_code == 400


def test_explicit_types_and_date_format(client):
    response = upload(
        client,
        b"id,date,value\n123,31/12/2025,2\n",
        column_types='{"id":"text","date":"datetime"}',
        date_format="%d/%m/%Y",
    )
    assert response.status_code == 201, response.json
    row = client.get(f"/api/datasets/{response.json['id']}").json["rows"][0]
    assert row["id"] == "123"
    assert row["date"].startswith("2025-12-31")


@pytest.mark.parametrize(
    "types", ["{bad", "[]", '{"missing":"text"}', '{"value":"invalid"}', '{"region":"number"}']
)
def test_invalid_type_overrides(client, types):
    assert upload(client, column_types=types).status_code == 400


def test_null_strings_do_not_become_literal_nan(client):
    response = client.post("/api/datasets", json=[{"a": "test", "b": 1}, {"b": 2}], headers=HEADERS)
    assert response.status_code == 201
    assert response.json["missing_cells"] == 1
    assert client.get(f"/api/datasets/{response.json['id']}").json["rows"][1]["a"] is None


def test_large_identifiers_preserved_exactly(client):
    identifier = "123456789012345678901234567890"
    response = upload(client, f"id,value\n{identifier},1\n".encode())
    assert response.status_code == 201, response.json
    assert response.json["columns"][0]["type"] == "text"
    assert client.get(f"/api/datasets/{response.json['id']}").json["rows"][0]["id"] == identifier


def test_excel_duplicate_headers_and_sheet_selection(client):
    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer) as writer:
        pd.DataFrame([["a", "a"], [1, 2]]).to_excel(
            writer, sheet_name="Bad", header=False, index=False
        )
        pd.DataFrame({"good": [42]}).to_excel(writer, sheet_name="Good", index=False)
    assert upload(client, buffer.getvalue(), "workbook.xlsx").status_code == 400
    assert upload(client, buffer.getvalue(), "workbook.xlsx", sheet="Good").status_code == 201
    assert upload(client, buffer.getvalue(), "workbook.xlsx", sheet="Missing").status_code == 400


def test_excel_expansion_limit(client):
    import zipfile

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("expanded.xml", b"0" * (100 * 1024 * 1024 + 1))
    result = upload(client, buffer.getvalue(), "compressed.xlsx")
    assert result.status_code == 400
    assert "Expanded" in result.json["error"]


def test_non_finite_values_and_nulls(client):
    response = client.post(
        "/api/datasets",
        data='[{"x":"A","value":Infinity},{"x":"B","value":1}]',
        content_type="application/json",
        headers=HEADERS,
    )
    assert response.status_code == 201
    assert response.json["missing_cells"] == 1
    assert response.json["warnings"]


def test_untrusted_host_rejected(client):
    assert client.get("/api/datasets", headers={"Host": "attacker.example"}).status_code == 400


def test_multi_measure_and_all_aggregations(client):
    response = upload(client, b"group,a,b\nX,1,10\nX,3,30\nY,5,50\n")
    base = f"/api/datasets/{response.json['id']}/chart?x=group&y=a&y=b"
    for operation, expected in [
        ("min", [1, 5]),
        ("max", [3, 5]),
        ("sum", [4, 5]),
        ("mean", [2, 5]),
    ]:
        result = client.get(base + "&aggregation=" + operation)
        assert result.status_code == 200
        assert result.json["series"][0]["values"] == expected
        assert result.json["series"][1]["values"] == [value * 10 for value in expected]
