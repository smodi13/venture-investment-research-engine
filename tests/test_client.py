"""X client: cache hits, duplicate authors, rate limits, missing token."""

from __future__ import annotations

import pytest

from sourcing.config import ConfigError, Secrets, load_secrets
from sourcing.x_client import (
    CreditsExhaustedError,
    RateLimitError,
    XAPIError,
    XClient,
)
from tests.conftest import FakeResponse, FakeSession


def _secrets(token="AAAA-fake-token-value"):
    return Secrets(x_bearer_token=token)


SEARCH_PAYLOAD = {
    "data": [
        {"id": "1", "text": "Acme AI agent", "author_id": "u1", "created_at": "2026-07-01T00:00:00.000Z"},
        {"id": "2", "text": "Beta AI tool", "author_id": "u2", "created_at": "2026-07-01T00:00:00.000Z"},
    ],
    "includes": {
        "users": [
            {"id": "u1", "username": "alice", "public_metrics": {"followers_count": 10}},
            {"id": "u2", "username": "bob", "public_metrics": {"followers_count": 20}},
        ]
    },
    "meta": {"result_count": 2},
}


def test_live_base_url_defaults_to_x_com(fake_cache):
    # Production config must default to https://api.x.com/2 and NOT api.twitter.com.
    from sourcing.x_client import BASE_URL

    assert BASE_URL == "https://api.x.com/2"
    assert "api.twitter.com" not in BASE_URL
    client = XClient(_secrets(), fake_cache)
    assert client.base_url == "https://api.x.com/2"
    assert "api.twitter.com" not in client.base_url


def test_custom_base_url_allowed_for_tests_and_mocks(fake_cache):
    # Custom base URLs remain available for tests / local mocks only.
    client = XClient(_secrets(), fake_cache, base_url="http://localhost:8123/2")
    assert client.base_url == "http://localhost:8123/2"


def test_missing_token_raises_configerror(monkeypatch):
    monkeypatch.delenv("X_BEARER_TOKEN", raising=False)
    # Stop load_dotenv from repopulating the env from the real .env file.
    monkeypatch.setattr("sourcing.config.load_dotenv", lambda *a, **k: None)
    with pytest.raises(ConfigError):
        load_secrets(require_x=True)


def test_client_requires_token(fake_cache):
    with pytest.raises(XAPIError):
        XClient(Secrets(x_bearer_token=""), fake_cache)


def test_search_caches_and_does_not_refetch(fake_cache):
    session = FakeSession([FakeResponse(200, SEARCH_PAYLOAD)])
    client = XClient(_secrets(), fake_cache, session=session)
    posts1 = client.search_recent("q", max_results=10, query_groups=["A"])
    assert len(posts1) == 2
    assert len(session.calls) == 1
    # Identical request within the run must be a cache hit (no new call).
    posts2 = client.search_recent("q", max_results=10, query_groups=["A"])
    assert len(posts2) == 2
    assert len(session.calls) == 1  # unchanged => cache hit


def test_duplicate_authors_fetched_once(fake_cache):
    # Author payloads were cached during search; get_users should not refetch.
    session = FakeSession([FakeResponse(200, SEARCH_PAYLOAD)])
    client = XClient(_secrets(), fake_cache, session=session)
    client.search_recent("q", max_results=10)
    calls_after_search = len(session.calls)
    users = client.get_users(["u1", "u2", "u1", "u2"])  # duplicates
    assert {u.username for u in users} == {"alice", "bob"}
    # All authors already cached => no additional network calls.
    assert len(session.calls) == calls_after_search


def test_rate_limit_then_success(fake_cache):
    session = FakeSession([
        FakeResponse(429, {}, headers={"x-rate-limit-reset": "0"}),
        FakeResponse(200, SEARCH_PAYLOAD),
    ])
    client = XClient(_secrets(), fake_cache, session=session, sleep_fn=lambda s: None)
    posts = client.search_recent("q", max_results=10)
    assert len(posts) == 2
    assert len(session.calls) == 2  # retried after 429


def test_rate_limit_exhausted_raises(fake_cache):
    session = FakeSession([FakeResponse(429, {}, headers={"x-rate-limit-reset": "0"})])
    client = XClient(_secrets(), fake_cache, session=session, max_retries=1, sleep_fn=lambda s: None)
    with pytest.raises(RateLimitError):
        client.search_recent("q", max_results=10)


def test_rate_limit_exhausted_stop_reason(fake_cache):
    # One bounded retry, then another 429 => fail closed with the typed reason.
    session = FakeSession([
        FakeResponse(429, {}, headers={"x-rate-limit-reset": "0"}),
        FakeResponse(429, {}, headers={"x-rate-limit-reset": "0"}),
    ])
    client = XClient(_secrets(), fake_cache, session=session, sleep_fn=lambda s: None)
    with pytest.raises(RateLimitError) as exc:
        client.search_recent("q", max_results=10)
    assert exc.value.stop_reason == "rate_limit_retry_exhausted"


def test_relative_window_reresolved_before_allowed_retry(fake_cache):
    from sourcing.ratelimit import RetryContext

    flags = {"reresolved": False, "budget_checked": False}

    def reresolve():
        flags["reresolved"] = True

    def budget_ok():
        flags["budget_checked"] = True
        return True

    ctx = RetryContext(approval_expiry_epoch=None, budget_ok=budget_ok, reresolve_window=reresolve)
    session = FakeSession([
        FakeResponse(429, {}, headers={"x-rate-limit-reset": "0"}),
        FakeResponse(200, SEARCH_PAYLOAD),
    ])
    client = XClient(_secrets(), fake_cache, session=session, sleep_fn=lambda s: None)
    posts = client.search_recent("q", max_results=10, retry_context=ctx)
    assert len(posts) == 2
    assert flags["reresolved"] is True   # window re-resolved before retry
    assert flags["budget_checked"] is True


def test_missing_reset_header_fails_closed(fake_cache):
    session = FakeSession([FakeResponse(429, {}, headers={})])  # no reset header
    client = XClient(_secrets(), fake_cache, session=session, sleep_fn=lambda s: None)
    with pytest.raises(RateLimitError) as exc:
        client.search_recent("q", max_results=10)
    assert exc.value.stop_reason == "rate_limit_reset_missing"


def test_response_metadata_captured_and_sanitized(fake_cache):
    session = FakeSession([FakeResponse(
        200, SEARCH_PAYLOAD,
        headers={"x-rate-limit-limit": "450", "x-rate-limit-remaining": "1", "x-rate-limit-reset": "1000"},
    )])
    client = XClient(_secrets(), fake_cache, session=session)
    client.search_recent("q", max_results=10)
    meta = client.last_response_meta
    assert meta["http_status"] == 200
    assert meta["x_rate_limit_limit"] == 450
    assert meta["retry_count"] == 0
    assert "authorization" not in str(meta).lower()


def test_preemptive_state_is_in_memory_only_not_persisted(fake_cache):
    # A fresh client starts with empty preemptive state (no cross-process load).
    client = XClient(_secrets(), fake_cache, session=FakeSession([FakeResponse(200, SEARCH_PAYLOAD)]))
    assert client._rl_state == {}
    client.search_recent("q", max_results=10)
    # State is now populated for THIS process only.
    assert any("search/recent" in scope for scope in client._rl_state)
    # A brand-new client (new process analogue) does not inherit it.
    client2 = XClient(_secrets(), fake_cache, session=FakeSession([FakeResponse(200, SEARCH_PAYLOAD)]))
    assert client2._rl_state == {}


def test_counts_state_does_not_delay_search(fake_cache):
    from sourcing.ratelimit import RateLimitHeaders, endpoint_scope

    session = FakeSession([FakeResponse(200, SEARCH_PAYLOAD)])
    slept = []
    client = XClient(_secrets(), fake_cache, session=session, sleep_fn=lambda s: slept.append(s))
    # Seed an EXHAUSTED counts scope with a far-future reset.
    client._rl_state[endpoint_scope("GET", "/tweets/counts/recent")] = RateLimitHeaders(
        limit=1, remaining=0, reset_epoch=9999999999.0
    )
    posts = client.search_recent("q", max_results=10)  # different endpoint scope
    assert len(posts) == 2
    assert slept == []  # search was NOT delayed by the counts throttle


def test_credits_exhausted_raises(fake_cache):
    session = FakeSession([FakeResponse(403, {}, text="Usage cap exceeded for this month")])
    client = XClient(_secrets(), fake_cache, session=session)
    with pytest.raises(CreditsExhaustedError):
        client.search_recent("q", max_results=10)


def test_malformed_response_raises(fake_cache):
    bad = FakeResponse(200, None)  # .json() raises ValueError
    session = FakeSession([bad])
    client = XClient(_secrets(), fake_cache, session=session)
    from sourcing.x_client import MalformedResponseError

    with pytest.raises(MalformedResponseError):
        client.search_recent("q", max_results=10)
