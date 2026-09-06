"""Application factory and HTTP API for the standalone data explorer."""

import io
import os
import sqlite3
from pathlib import Path
from urllib.parse import urlsplit

from flask import Flask, jsonify, render_template, request, send_file
from werkzeug.exceptions import HTTPException
from werkzeug.utils import secure_filename

from .data import chart, filtered, json_records, read_upload, safe_csv
from .storage import DatasetStore


def create_app(config=None):
    app = Flask(__name__)
    app.config.from_mapping(
        TRUSTED_HOSTS=os.getenv("TRUSTED_HOSTS", "localhost,127.0.0.1,[::1]").split(","),
        MAX_CONTENT_LENGTH=int(os.getenv("MAX_UPLOAD_MB", "25")) * 1024 * 1024,
        MAX_ROWS=int(os.getenv("MAX_ROWS", "100000")),
        MAX_COLUMNS=int(os.getenv("MAX_COLUMNS", "100")),
        MAX_DATASETS=int(os.getenv("MAX_DATASETS", "100")),
        DATA_DIR=os.getenv("DATA_DIR", str(Path(__file__).resolve().parent.parent / "instance")),
    )
    if config:
        app.config.update(config)
    directory = Path(app.config["DATA_DIR"])
    directory.mkdir(parents=True, exist_ok=True)
    store = DatasetStore(directory / "datasets.sqlite3", app.config["MAX_DATASETS"])
    app.extensions["datasets"] = store

    @app.before_request
    def same_origin_writes():
        if request.method in {"POST", "DELETE", "PUT", "PATCH"}:
            if request.headers.get("X-Requested-With") != "DataExplorer":
                return jsonify(error="Set the X-Requested-With: DataExplorer header."), 403
            origin = request.headers.get("Origin")
            if origin and urlsplit(origin).netloc != request.host:
                return jsonify(error="Cross-origin writes are not allowed."), 403

    @app.after_request
    def security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "same-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self'; "
            "img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; "
            "base-uri 'self'; form-action 'self'"
        )
        if request.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.errorhandler(HTTPException)
    def http_error(error):
        message = (
            "Upload exceeds the configured size limit." if error.code == 413 else error.description
        )
        return jsonify(error=message), error.code

    @app.errorhandler(ValueError)
    def validation_error(error):
        return jsonify(error=str(error)), 400

    @app.errorhandler(KeyError)
    def missing_dataset(error):
        return jsonify(error="Dataset not found. It may have been deleted."), 404

    @app.errorhandler(Exception)
    def unexpected_error(error):
        app.logger.exception("Request failed")
        if isinstance(error, sqlite3.OperationalError):
            return jsonify(error="Storage unavailable. Check disk space and permissions."), 503
        return jsonify(error="Unable to complete the request. See the server log for details."), 500

    @app.get("/")
    def index():
        return render_template("index.html")

    @app.get("/api/health")
    def health():
        with store.connect() as db:
            db.execute("SELECT 1")
        return jsonify(status="ok")

    @app.get("/api/datasets")
    def datasets():
        return jsonify(
            datasets=store.list(),
            limits={
                "upload_mb": app.config["MAX_CONTENT_LENGTH"] // (1024 * 1024),
                "rows": app.config["MAX_ROWS"],
                "columns": app.config["MAX_COLUMNS"],
            },
        )

    @app.post("/api/datasets")
    def upload():
        if request.is_json:
            raw = request.get_data()
            filename = "API dataset.json"
            options = request.args
        else:
            file = request.files.get("file")
            if file is None or not file.filename:
                raise ValueError("Choose a data file to import.")
            raw, filename, options = file.read(), file.filename, request.form
        try:
            frame, metadata = read_upload(
                raw, filename, options, app.config["MAX_ROWS"], app.config["MAX_COLUMNS"]
            )
        except ValueError:
            raise
        except Exception as error:
            app.logger.info("Rejected import: %s", type(error).__name__)
            raise ValueError(
                "Could not read this file. Check its format, encoding and contents."
            ) from error
        return jsonify(store.save(frame, metadata)), 201

    @app.get("/api/datasets/<dataset_id>")
    def dataset(dataset_id):
        metadata, frame = store.get(dataset_id)
        frame = filtered(frame, request.args)
        try:
            offset = int(request.args.get("offset", "0"))
            limit = int(request.args.get("limit", "50"))
        except ValueError as error:
            raise ValueError("Offset and limit must be integers.") from error
        if offset < 0 or not 1 <= limit <= 200:
            raise ValueError("Offset must be nonnegative; limit must be between 1 and 200.")
        return jsonify(
            metadata=metadata,
            rows=json_records(frame.iloc[offset : offset + limit]),
            total_rows=len(frame),
            offset=offset,
            limit=limit,
        )

    @app.get("/api/datasets/<dataset_id>/chart")
    def dataset_chart(dataset_id):
        metadata, frame = store.get(dataset_id)
        return jsonify(chart(frame, metadata, request.args))

    @app.get("/api/datasets/<dataset_id>/export")
    def export(dataset_id):
        metadata, frame = store.get(dataset_id)
        frame = filtered(frame, request.args)
        name = secure_filename(Path(metadata["name"]).stem) or "dataset"
        return send_file(
            io.BytesIO(safe_csv(frame).encode("utf-8-sig")),
            mimetype="text/csv",
            as_attachment=True,
            download_name=f"{name}.csv",
        )

    @app.delete("/api/datasets/<dataset_id>")
    def delete(dataset_id):
        store.delete(dataset_id)
        return "", 204

    @app.get("/api/example")
    def example():
        return send_file(
            Path(__file__).resolve().parent.parent / "examples" / "operations.csv",
            mimetype="text/csv",
            as_attachment=True,
        )

    return app
