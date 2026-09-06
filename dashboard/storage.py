"""Atomic, process-safe local persistence without a database service."""

import io
import json
import sqlite3
from contextlib import contextmanager
from uuid import uuid4

import pandas as pd


class DatasetStore:
    def __init__(self, path, max_datasets=100):
        self.path = path
        self.max_datasets = max_datasets
        with self.connect() as db:
            db.execute("PRAGMA journal_mode=WAL")
            db.execute("""CREATE TABLE IF NOT EXISTS datasets (
                id TEXT PRIMARY KEY, metadata TEXT NOT NULL, data BLOB NOT NULL
            )""")

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=30)
        try:
            with db:
                yield db
        finally:
            db.close()

    def list(self):
        with self.connect() as db:
            return [
                json.loads(row[0])
                for row in db.execute("SELECT metadata FROM datasets ORDER BY rowid DESC")
            ]

    def save(self, frame, metadata):
        metadata = {**metadata, "id": uuid4().hex}
        data = frame.to_parquet(index=False)
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            if db.execute("SELECT COUNT(*) FROM datasets").fetchone()[0] >= self.max_datasets:
                raise ValueError(
                    "Dataset limit reached. Delete an unused dataset before importing."
                )
            db.execute(
                "INSERT INTO datasets VALUES (?, ?, ?)",
                (metadata["id"], json.dumps(metadata, allow_nan=False), data),
            )
        return metadata

    def get(self, dataset_id):
        with self.connect() as db:
            row = db.execute(
                "SELECT metadata, data FROM datasets WHERE id = ?", (dataset_id,)
            ).fetchone()
        if row is None:
            raise KeyError(dataset_id)
        return json.loads(row[0]), pd.read_parquet(io.BytesIO(row[1]))

    def delete(self, dataset_id):
        with self.connect() as db:
            if not db.execute("DELETE FROM datasets WHERE id = ?", (dataset_id,)).rowcount:
                raise KeyError(dataset_id)
