"""SQLite-backed cache and deduplication.

Guarantees (mandate section 1): every X API response is cached; the same
resource is never refetched within a run. Also used to dedup posts and authors.

Tables
------
posts        : raw post payloads keyed by post id
users        : raw user payloads keyed by user id
timelines    : marker rows recording that a user's timeline was fetched
http_cache   : generic response cache keyed by request signature (search pages,
               enrichment GETs) so a repeated request in the same run is a hit.
"""

from __future__ import annotations

import json
import sqlite3
import time
from contextlib import closing
from pathlib import Path
from typing import Any, Optional

_SCHEMA = """
CREATE TABLE IF NOT EXISTS posts (
    id          TEXT PRIMARY KEY,
    payload     TEXT NOT NULL,
    fetched_at  REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    payload     TEXT NOT NULL,
    fetched_at  REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS timelines (
    user_id     TEXT PRIMARY KEY,
    payload     TEXT NOT NULL,
    fetched_at  REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS http_cache (
    signature   TEXT PRIMARY KEY,
    payload     TEXT NOT NULL,
    fetched_at  REAL NOT NULL
);
"""


class Cache:
    """Thin wrapper around a SQLite database used for caching + dedup.

    Not thread-safe; the engine is single-threaded by design.
    """

    def __init__(self, path: str | Path):
        self.path = str(path)
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(self.path)
        self._conn.row_factory = sqlite3.Row
        with closing(self._conn.cursor()) as cur:
            cur.executescript(_SCHEMA)
        self._conn.commit()

    # -- generic helpers ---------------------------------------------------
    def close(self) -> None:
        self._conn.close()

    def __enter__(self) -> "Cache":
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def _get(self, table: str, key_col: str, key: str) -> Optional[dict[str, Any]]:
        with closing(self._conn.cursor()) as cur:
            cur.execute(
                f"SELECT payload FROM {table} WHERE {key_col} = ?", (key,)
            )
            row = cur.fetchone()
        return json.loads(row["payload"]) if row else None

    def _put(self, table: str, key_col: str, key: str, payload: dict[str, Any]) -> None:
        with closing(self._conn.cursor()) as cur:
            cur.execute(
                f"INSERT OR REPLACE INTO {table} ({key_col}, payload, fetched_at) "
                f"VALUES (?, ?, ?)",
                (key, json.dumps(payload), time.time()),
            )
        self._conn.commit()

    def _has(self, table: str, key_col: str, key: str) -> bool:
        with closing(self._conn.cursor()) as cur:
            cur.execute(
                f"SELECT 1 FROM {table} WHERE {key_col} = ? LIMIT 1", (key,)
            )
            return cur.fetchone() is not None

    # -- posts -------------------------------------------------------------
    def has_post(self, post_id: str) -> bool:
        return self._has("posts", "id", post_id)

    def get_post(self, post_id: str) -> Optional[dict[str, Any]]:
        return self._get("posts", "id", post_id)

    def put_post(self, post_id: str, payload: dict[str, Any]) -> None:
        self._put("posts", "id", post_id, payload)

    # -- users -------------------------------------------------------------
    def has_user(self, user_id: str) -> bool:
        return self._has("users", "id", user_id)

    def get_user(self, user_id: str) -> Optional[dict[str, Any]]:
        return self._get("users", "id", user_id)

    def put_user(self, user_id: str, payload: dict[str, Any]) -> None:
        self._put("users", "id", user_id, payload)

    # -- timelines ---------------------------------------------------------
    def has_timeline(self, user_id: str) -> bool:
        return self._has("timelines", "user_id", user_id)

    def get_timeline(self, user_id: str) -> Optional[dict[str, Any]]:
        return self._get("timelines", "user_id", user_id)

    def put_timeline(self, user_id: str, payload: dict[str, Any]) -> None:
        self._put("timelines", "user_id", user_id, payload)

    # -- generic http cache (search pages, enrichment) ---------------------
    def get_http(self, signature: str) -> Optional[dict[str, Any]]:
        return self._get("http_cache", "signature", signature)

    def put_http(self, signature: str, payload: dict[str, Any]) -> None:
        self._put("http_cache", "signature", signature, payload)

    def has_http(self, signature: str) -> bool:
        return self._has("http_cache", "signature", signature)

    # -- stats -------------------------------------------------------------
    def counts(self) -> dict[str, int]:
        out: dict[str, int] = {}
        with closing(self._conn.cursor()) as cur:
            for table in ("posts", "users", "timelines", "http_cache"):
                cur.execute(f"SELECT COUNT(*) AS n FROM {table}")
                out[table] = cur.fetchone()["n"]
        return out
