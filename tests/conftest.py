"""Shared pytest fixtures and factories.

Fictional API payloads live ONLY here / in tests (never in production code).
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from sourcing.models import RawPost, RawUser


def make_post(
    post_id: str,
    text: str,
    *,
    author_id: str = "u1",
    created_at: datetime | None = None,
    urls: list[str] | None = None,
    is_retweet: bool = False,
    query_groups: list[str] | None = None,
    query_lanes: list[str] | None = None,
    like_count: int = 0,
    retweet_count: int = 0,
    reply_count: int = 0,
    quote_count: int = 0,
) -> RawPost:
    return RawPost(
        id=post_id,
        text=text,
        author_id=author_id,
        created_at=created_at or datetime.now(timezone.utc),
        expanded_urls=urls or [],
        is_retweet=is_retweet,
        query_groups=query_groups or ["A"],
        query_lanes=query_lanes or ["product_artifact"],
        like_count=like_count,
        retweet_count=retweet_count,
        reply_count=reply_count,
        quote_count=quote_count,
    )


def make_user(
    user_id: str = "u1",
    username: str = "alice",
    *,
    description: str = "",
    followers: int = 100,
) -> RawUser:
    return RawUser(
        id=user_id,
        username=username,
        name=username.title(),
        description=description,
        followers_count=followers,
    )


@pytest.fixture
def now() -> datetime:
    return datetime.now(timezone.utc)


@pytest.fixture
def days_ago():
    def _days_ago(n: float) -> datetime:
        return datetime.now(timezone.utc) - timedelta(days=n)

    return _days_ago


# ------------------------------------------------------------------ fakes --
_MISSING = object()


class FakeResponse:
    def __init__(self, status_code=200, json_data=_MISSING, headers=None, text=""):
        self.status_code = status_code
        # Explicit None => .json() raises (simulates malformed body).
        self._json = {} if json_data is _MISSING else json_data
        self.headers = headers or {}
        self.text = text

    def json(self):
        if self._json is None:
            raise ValueError("no json")
        return self._json


class FakeSession:
    """Records GET calls and returns queued responses."""

    def __init__(self, responses: list[FakeResponse]):
        self._responses = responses
        self.calls: list[dict] = []
        self.headers: dict = {}

    def get(self, url, params=None, timeout=None):
        self.calls.append({"url": url, "params": params or {}, "timeout": timeout})
        idx = min(len(self.calls) - 1, len(self._responses) - 1)
        resp = self._responses[idx]
        if isinstance(resp, Exception):
            raise resp
        return resp


@pytest.fixture
def fake_cache(tmp_path):
    from sourcing.cache import Cache

    c = Cache(tmp_path / "cache.db")
    yield c
    c.close()
