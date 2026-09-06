# Data Explorer

A standalone local workspace for importing, profiling, filtering and visualizing tabular business data. It replaces the original machine-specific demo with a configurable Flask application. No MongoDB, camera, account, internet connection at runtime, or external chart service is required.

## Run locally

Use **Python 3.12** (the tested runtime):

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.lock
python app.py
```

On Windows, activate with `.venv\Scripts\activate`. On Debian/Ubuntu, install the matching `python3.12-venv` package if Python reports that `ensurepip` is unavailable.

Open **http://127.0.0.1:5012**. Choose a file, then click **Import dataset**. Try `examples/operations.csv` first; a download link is also available in the dashboard. Select the dimension, measures, calculation and chart style, then click **Apply & visualize**. The preview and CSV export use the same applied filter. Changing controls does not apply changes until you click the button.

Datasets survive restarts. The default storage location is `instance/datasets.sqlite3`, relative to the project directory regardless of your shell's current directory. Delete datasets through the UI when no longer needed. The imported source files are not modified or retained; normalized data and its profile are stored.

## Supported data

| Format | Expected structure | Import options |
| --- | --- | --- |
| CSV / TSV | One header record, consistent field count | UTF-8, Windows-1252 or Latin-1; comma, semicolon, tab or pipe; decimal point or comma |
| Excel `.xlsx` | Header row followed by records | Worksheet name; first worksheet by default |
| JSON | Array of objects, or `{"data": [...]}` | Nested objects/arrays retained as JSON text |
| JSON Lines `.jsonl` / `.ndjson` | One object per non-empty line | UTF-8 |
| Parquet | One tabular file | Embedded types read automatically |

Each customer can use different column names. No predefined machine schema is required. Choose columns as dimensions and numeric measures in the dashboard. Data should have one record per row, unique non-empty headers and consistent units within each measure. A shared schema is helpful only when you need to combine customers' datasets; combining datasets is not part of this version.

- Blank cells and JSON nulls are missing values. Literal text such as `NA` is preserved.
- Numeric columns are inferred only when all non-empty values can be parsed. Mixed columns remain text with a warning.
- Leading-zero values such as `00123` remain text. Values beyond JavaScript's safe numeric range (±9,007,199,254,740,991) remain text with a warning.
- ISO dates (`YYYY-MM-DD`, optionally with a time) are inferred; timestamps normalize to UTC. Ambiguous dates remain text unless explicitly mapped.
- Under **Import options**, use **Column types** to override inference, for example `{"customer_id":"text","revenue":"number","invoice_date":"datetime"}`. For dates such as `31/12/2025`, also set **Date format** to `%d/%m/%Y`. Invalid explicit conversions reject the upload instead of dropping values.
- Currency symbols and thousands separators must be cleaned before import. Decimal comma is supported; it does not imply thousands-separator parsing.
- Excel files should contain plain tables. Merged report layouts, password-protected files, `.xls`, and formulas without cached results are not supported. Formula expressions are never evaluated.
- Floating-point arithmetic is used for charts, not exact decimal accounting. Keep currency units consistent. Explicit text mappings are appropriate for identifiers.

## Visualizations and quality

- Line, grouped bar and numeric scatter charts, with up to six measures.
- Average, sum, minimum, maximum, row count and raw-value calculations.
- Numeric/time axes use value spacing for line and scatter charts. Bar charts group discrete dimension values. Line charts sort by the chosen dimension.
- Case-insensitive literal substring filtering on one column; it is not a regular expression.
- A 50-row paginated preview; the API supports page sizes up to 200.
- Column types, missing-cell counts, unique-value counts and duplicate-row counts. Duplicate rows are reported and retained.
- Missing measure values are ignored during aggregation; a group with no measure values stays missing even for sum. Missing dimensions are omitted from charts and the omitted count is shown.
- Charts display the first 1,000 resulting points sorted by dimension. A visible notice reports truncation; calculations use all matching rows before this display limit. Exports include every matching row.
- CSV exports neutralize text cells/headers that could be interpreted as spreadsheet formulas by adding an apostrophe. The export contains normalized values, not the original file bytes.

## Configuration

Set environment variables before starting the process. `.env.example` documents these settings; the application does **not** automatically load `.env` files.

| Variable | Default | Purpose |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Development listener |
| `PORT` | `5012` | Development port |
| `DATA_DIR` | Project `instance/` | Writable local dataset directory |
| `MAX_UPLOAD_MB` | `25` | Maximum request size, including multipart overhead |
| `MAX_ROWS` | `100000` | Maximum rows per dataset |
| `MAX_COLUMNS` | `100` | Maximum columns per dataset |
| `MAX_DATASETS` | `100` | Maximum saved datasets per workspace |
| `TRUSTED_HOSTS` | `localhost,127.0.0.1,[::1]` | Allowed HTTP Host values; add the server hostname for deployment |

Excel/Parquet expanded content has an additional 100 MB limit. These bounds are intended for local analytical files, not a streaming warehouse or hostile-file sandbox. Imports and queries operate in memory; higher limits and simultaneous imports require more memory. There is no automatic expiration. Monitor disk space and delete unused datasets.

## API integration

The UI uses the same API that a customer's export job can call. Mutation requests require `X-Requested-With: DataExplorer`; browser writes must also be same-origin. This is a cross-origin request defense, **not authentication**.

```bash
# File upload. Response includes the dataset id.
curl -H 'X-Requested-With: DataExplorer' \
  -F 'file=@examples/operations.csv' http://127.0.0.1:5012/api/datasets

# JSON ingestion from a record export.
curl -H 'X-Requested-With: DataExplorer' -H 'Content-Type: application/json' \
  --data '[{"region":"North","units":42}]' http://127.0.0.1:5012/api/datasets

# Use the id returned by the upload.
curl 'http://127.0.0.1:5012/api/datasets/DATASET_ID/chart?x=region&y=units&aggregation=sum'
```

| Method | Route | Result |
| --- | --- | --- |
| GET | `/api/health` | Storage connectivity check |
| GET | `/api/datasets` | Saved dataset profiles and upload limits |
| POST | `/api/datasets` | Multipart file or JSON records → profile and id (201) |
| GET | `/api/datasets/<id>` | Profile and rows; `offset`, `limit`, `filter_column`, `filter_value` |
| GET | `/api/datasets/<id>/chart` | `x`, repeated `y`, `aggregation`, optional filter parameters |
| GET | `/api/datasets/<id>/export` | Normalized CSV with optional filter parameters |
| DELETE | `/api/datasets/<id>` | Delete a dataset (204) |
| GET | `/api/example` | Download sample operations data |

For multipart imports, send `encoding`, `delimiter`, `decimal`, `sheet`, `column_types` and `date_format` as additional form fields. For JSON-body imports, pass options as URL query parameters. Validation errors return `{"error":"..."}` with HTTP 400; missing datasets return 404, oversized requests 413, and unavailable storage 503. Unhandled errors are logged server-side and return a generic 500 response.

## Future server deployment

This is a **single trusted workspace**, not a multi-tenant SaaS product. Everyone who can reach the service can view, upload, export and delete every dataset. Use a separate deployment/data directory for each customer. Before exposing it beyond localhost, put it behind an authenticated HTTPS reverse proxy, restrict network access and set proxy upload limits consistently. Authentication and customer isolation are not implemented here.

Use Waitress instead of Flask's development server:

```bash
source .venv/bin/activate
waitress-serve --host=127.0.0.1 --port=5012 --call dashboard:create_app
```

Or run the included container configuration:

```bash
docker compose up --build -d
```

Compose publishes only on localhost and stores data in a named volume. The container runs as an unprivileged user with a health check. Container tooling must be installed separately. The Docker recipe is provided for deployment; see the validation notes below for what was tested in this environment.

SQLite uses transactions, a busy timeout and WAL mode. It supports a modest single-host deployment; do not put the database on a network filesystem or scale it across server replicas. Back up the data directory while the service is stopped, or use SQLite's backup API while running. Include the WAL/SHM files when making a stopped filesystem backup. Deletion removes the logical record; it is not a secure erase of storage or backups.

For larger deployments, replace `DatasetStore` with object storage plus a database/catalog, move ingestion into workers and push queries into an analytical engine. Connector authentication, scheduled refresh, streaming data, multi-user permissions and cross-dataset joins are future extensions, not current capabilities.

## Development and validation

```bash
python -m pip install -r requirements-dev.txt
python -m pytest -q
ruff check app.py dashboard tests
ruff format --check app.py dashboard tests
node --check dashboard/static/app.js
```

The implementation was validated with Python 3.12, 54 automated tests, Ruff and JavaScript syntax checking. Tests cover every supported file format, restart persistence, filters/aggregations/exports, malformed inputs, row/column/upload limits, precision-sensitive identifiers and type overrides. The local HTTP endpoint was also checked. Docker Compose configuration validation passed. Browser interaction tests and a Docker image build were not run.

Runtime packages are frozen in `requirements.lock`; `requirements.txt` records allowed upgrade ranges. Revalidate tests when updating the lock. Development tools are additional dependencies and are not shipped in the container.

### Structure

```text
app.py                       Local entry point
 dashboard/__init__.py       Application factory, routes, limits and error handling
 dashboard/data.py           Import adapters, normalization, profiles and queries
 dashboard/storage.py        SQLite-backed dataset repository
 dashboard/templates/        Dashboard HTML
 dashboard/static/           Offline JavaScript and CSS
 examples/operations.csv     Small runnable example
 tests/test_app.py           Ingestion and HTTP integration tests
```

The original root-level demo modules and `templates/` remain for historical reference. They are not imported by the new application, are not included in its container, and are excluded from the new test suite. Old demo routes are replaced by the documented API. No legacy MongoDB data is automatically migrated; export it to a supported format and import it.
