"""Explicit connect/read timeouts + fail-closed network-timeout handling."""

from __future__ import annotations

import pytest
import requests

from sourcing.config import ConfigError
from sourcing.x_client import (
    HttpTimeouts,
    NetworkTimeoutError,
    XClient,
    load_http_timeouts,
)
from tests.conftest import FakeResponse, FakeSession

SEARCH_PAYLOAD = {"data": [{"id": "1", "text": "x", "author_id": "u1"}], "meta": {"result_count": 1}}


def _secrets():
    from sourcing.config import Secrets

    return Secrets(x_bearer_token="AAAA-fake")


def _client(session, cache, **kw):
    return XClient(_secrets(), cache, session=session, sleep_fn=lambda s: None,
                   http_timeouts=HttpTimeouts(connect_seconds=5, read_seconds=30), **kw)


def test_connect_and_read_timeouts_from_config():
    ht = load_http_timeouts({"http": {"connect_timeout_seconds": 5, "read_timeout_seconds": 30}})
    assert ht.connect_seconds == 5.0
    assert ht.read_seconds == 30.0
    assert ht.as_tuple() == (5.0, 30.0)


@pytest.mark.parametrize("cfg", [
    {"http": {"read_timeout_seconds": 30}},                                  # missing connect
    {"http": {"connect_timeout_seconds": 5}},                               # missing read
    {"http": {"connect_timeout_seconds": 0, "read_timeout_seconds": 30}},   # nonpositive
    {"http": {"connect_timeout_seconds": -1, "read_timeout_seconds": 30}},  # negative
    {"http": {"connect_timeout_seconds": "x", "read_timeout_seconds": 30}}, # non-numeric
    {"http": {"connect_timeout_seconds": 5, "read_timeout_seconds": 100000}}, # exceeds max
    {"http": {"connect_timeout_seconds": True, "read_timeout_seconds": 30}}, # boolean
])
def test_invalid_timeout_configs_fail_closed(cfg):
    with pytest.raises(ConfigError):
        load_http_timeouts(cfg)


def test_timeouts_passed_to_http_client_as_separate_tuple(fake_cache):
    session = FakeSession([FakeResponse(200, SEARCH_PAYLOAD)])
    client = _client(session, fake_cache)
    client.search_recent("q", max_results=10)
    assert session.calls[0]["timeout"] == (5.0, 30.0)  # separate connect+read, not one value


def test_connect_timeout_produces_network_timeout_no_retry(fake_cache):
    session = FakeSession([requests.ConnectTimeout("connect timed out")])
    client = _client(session, fake_cache)
    with pytest.raises(NetworkTimeoutError) as exc:
        client.search_recent("q", max_results=10)
    assert exc.value.exception_type == "ConnectTimeout"
    assert len(session.calls) == 1  # NO automatic retry


def test_read_timeout_produces_network_timeout_no_retry(fake_cache):
    session = FakeSession([requests.ReadTimeout("read timed out")])
    client = _client(session, fake_cache)
    with pytest.raises(NetworkTimeoutError) as exc:
        client.search_recent("q", max_results=10)
    assert exc.value.exception_type == "ReadTimeout"
    assert len(session.calls) == 1


def test_timeout_output_requires_manual_billing_reconciliation():
    from sourcing.runstate import network_timeout_state

    st = network_timeout_state("ReadTimeout", 30000.0)
    assert st["billing_status"] == "manual_reconciliation_required"
    assert st["run_complete"] is False


def test_credentials_absent_from_timeout_error(fake_cache):
    session = FakeSession([requests.ConnectTimeout("Bearer AAAA-fake leaked?")])
    client = _client(session, fake_cache)
    with pytest.raises(NetworkTimeoutError) as exc:
        client.search_recent("q", max_results=10)
    blob = f"{exc.value} {exc.value.exception_type} {getattr(exc.value, 'request_ts_utc', '')}".lower()
    assert "bearer" not in blob
    assert "aaaa-fake" not in blob
    assert "authorization" not in blob
