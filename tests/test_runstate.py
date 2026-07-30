"""Run-state classification: empty, partial, error states + sanitized metadata."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sourcing.runstate import (
    RunStatus,
    interpret_response,
    sanitized_response_metadata,
)

POST = {"id": "1", "text": "hi", "author_id": "u1"}


def test_missing_data_zero_results():
    r = interpret_response(200, {"meta": {"result_count": 0}})
    assert r["run_status"] == RunStatus.SUCCESS_ZERO_RESULTS.value
    assert r["run_complete"] is True
    assert r["zero_results_found"] is True
    assert r["actual_posts_returned"] == 0
    assert r["estimated_post_cost_usd"] == 0.00
    assert r["posts"] == []


def test_empty_data_array():
    r = interpret_response(200, {"data": []})
    assert r["run_status"] == RunStatus.SUCCESS_ZERO_RESULTS.value
    assert r["run_complete"] is True
    assert r["zero_results_found"] is True


def test_data_plus_errors_is_partial():
    r = interpret_response(200, {"data": [POST], "errors": [{"title": "x"}]})
    assert r["run_status"] == RunStatus.PARTIAL_API_SUCCESS.value
    assert r["run_complete"] is False
    assert r["partial_results_valid"] is True
    assert r["actual_posts_returned"] == 1
    assert len(r["errors"]) == 1  # full errors array preserved


def test_errors_without_data():
    r = interpret_response(200, {"errors": [{"title": "not found"}]})
    assert r["run_status"] == RunStatus.PARTIAL_API_SUCCESS.value
    assert r["run_complete"] is False
    assert r["partial_results_valid"] is False
    assert r["actual_posts_returned"] == 0
    assert len(r["errors"]) == 1


def test_success_with_posts():
    r = interpret_response(200, {"data": [POST, POST]}, post_read_cost_usd=0.01)
    assert r["run_status"] == RunStatus.SUCCESS.value
    assert r["run_complete"] is True
    assert r["actual_posts_returned"] == 2
    assert r["estimated_post_cost_usd"] == 0.02  # cost from billable posts only


def test_zero_posts_zero_cost_even_with_rate():
    r = interpret_response(200, {"data": []}, post_read_cost_usd=0.99)
    assert r["actual_posts_returned"] == 0
    assert r["estimated_post_cost_usd"] == 0.00


def test_rate_limited_never_complete():
    r = interpret_response(429, {})
    assert r["run_status"] == RunStatus.RATE_LIMITED.value
    assert r["run_complete"] is False


def test_client_and_server_errors():
    assert interpret_response(400, {"errors": [{}]})["run_status"] == RunStatus.CLIENT_ERROR.value
    assert interpret_response(500, {})["run_status"] == RunStatus.SERVER_ERROR.value
    assert interpret_response(400, {})["run_complete"] is False
    assert interpret_response(500, {})["run_complete"] is False


def test_sanitized_metadata_excludes_secrets():
    reset = datetime(2026, 7, 18, 20, 0, 0, tzinfo=timezone.utc).timestamp()
    headers = {
        "x-rate-limit-limit": "450",
        "x-rate-limit-remaining": "12",
        "x-rate-limit-reset": str(int(reset)),
        "Authorization": "Bearer SECRET-TOKEN",
        "set-cookie": "sess=abc",
    }
    req_ts = datetime(2026, 7, 18, 19, 59, 59, tzinfo=timezone.utc)
    resp_ts = req_ts + timedelta(milliseconds=250)
    # duration_ms now comes from a MONOTONIC clock, passed in explicitly.
    meta = sanitized_response_metadata(headers, 200, req_ts, resp_ts, retry_count=1, duration_ms=250.0)

    assert meta["http_status"] == 200
    assert meta["x_rate_limit_limit"] == 450
    assert meta["x_rate_limit_remaining"] == 12
    assert meta["x_rate_limit_reset_utc"].startswith("2026-07-18T20:00:00")
    assert meta["x_rate_limit_reset_utc"].endswith("Z")   # RFC 3339 Z suffix
    assert meta["request_timestamp_utc"].endswith("Z")
    assert meta["response_timestamp_utc"].endswith("Z")
    assert meta["response_duration_ms"] == 250.0
    assert meta["retry_count"] == 1
    # No secrets anywhere in the metadata.
    blob = str(meta).lower()
    assert "authorization" not in blob
    assert "secret-token" not in blob
    assert "cookie" not in blob


def test_network_timeout_state():
    from sourcing.runstate import network_timeout_state

    st = network_timeout_state("ConnectTimeout", 5001.5, request_ts_utc="2026-07-19T00:00:00Z")
    assert st["run_status"] == "network_timeout"
    assert st["run_complete"] is False
    assert st["partial_results_valid"] is False
    assert st["retry_attempted"] is False
    assert st["billing_status"] == "manual_reconciliation_required"
    assert st["sanitized_exception_type"] == "ConnectTimeout"
    assert st["estimated_post_cost_usd"] == "0.000"
    # No message/credentials, only the type name.
    assert "token" not in str(st).lower()
