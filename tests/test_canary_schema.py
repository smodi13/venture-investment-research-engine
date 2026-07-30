"""Canary canonical request schema v2 + fail-closed validator + window resolve."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from sourcing.approval import (
    OLD_Q1_CANARY_FINGERPRINT_V1,
    CanaryCanonicalRequest,
    CanonicalRequestSchemaError,
    build_canary_request,
    resolve_canary_window,
    validate_canary_canonical_request,
)
from sourcing.config import load_queries
from sourcing.pipeline import RunConfig, build_query_specs


def _q1():
    spec = next(s for s in build_query_specs(None) if s.id == "q1_artifact_infra")
    return build_canary_request(spec, RunConfig(page_size=10).clamp(), load_queries().get("config_version", 1))


def _req(**wp_overrides) -> CanaryCanonicalRequest:
    wp = {
        "mode": "recent_relative",
        "lookback_days": 7,
        "start_guard_seconds": 300,
        "end_guard_seconds": 30,
        "resolve_once_at_execution": True,
    }
    wp.update(wp_overrides)
    return CanaryCanonicalRequest(
        query_id="q1_artifact_infra", query="Q", tweet_fields="created_at",
        expansions="", user_fields="", max_results=10, sort_order="recency",
        paginate=False, query_config_version="1", window_policy=wp,
    )


def _valid_dict() -> dict:
    return _req().canonical_dict()


# --- shape ----------------------------------------------------------------
def test_canonical_request_is_schema_version_2():
    assert _q1().canonical_dict()["canonical_request_schema_version"] == 2


def test_canonical_request_has_complete_window_policy():
    wp = _q1().canonical_dict()["window_policy"]
    assert wp == {
        "mode": "recent_relative",
        "lookback_days": 7,
        "start_guard_seconds": 300,
        "end_guard_seconds": 30,
        "resolve_once_at_execution": True,
    }


def test_legacy_keys_absent():
    d = _q1().canonical_dict()
    assert "start_time_policy" not in d
    assert "end_time_policy" not in d


# --- validator rejections -------------------------------------------------
def test_validator_rejects_start_time_policy():
    d = _valid_dict(); d["start_time_policy"] = "x"
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_end_time_policy():
    d = _valid_dict(); d["end_time_policy"] = "now"
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_both_legacy_fields():
    d = _valid_dict(); d["start_time_policy"] = "x"; d["end_time_policy"] = "now"
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_window_policy_with_legacy_field():
    d = _valid_dict(); d["start_time_policy"] = "x"  # window_policy present + legacy
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_missing_schema_version():
    d = _valid_dict(); del d["canonical_request_schema_version"]
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_schema_version_1():
    d = _valid_dict(); d["canonical_request_schema_version"] = 1
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_missing_window_policy():
    d = _valid_dict(); del d["window_policy"]
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


@pytest.mark.parametrize("drop", ["mode", "lookback_days", "start_guard_seconds", "end_guard_seconds", "resolve_once_at_execution"])
def test_validator_rejects_missing_window_policy_fields(drop):
    d = _valid_dict(); d["window_policy"] = {k: v for k, v in d["window_policy"].items() if k != drop}
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


def test_validator_rejects_unsupported_mode_and_bad_values():
    for wp in (
        {"mode": "absolute"}, {"lookback_days": 0}, {"lookback_days": -1},
        {"start_guard_seconds": -1}, {"end_guard_seconds": -1},
        {"resolve_once_at_execution": False}, {"start_guard_seconds": True},
    ):
        d = _req(**wp).canonical_dict()
        with pytest.raises(CanonicalRequestSchemaError):
            validate_canary_canonical_request(d)


def test_validator_rejects_unknown_window_policy_fields():
    d = _valid_dict(); d["window_policy"]["extra_field"] = 1
    with pytest.raises(CanonicalRequestSchemaError):
        validate_canary_canonical_request(d)


# --- window resolution ----------------------------------------------------
ANCHOR = datetime(2026, 7, 19, 12, 0, 0, tzinfo=timezone.utc)


def test_end_time_is_anchor_minus_30_seconds():
    from sourcing.timeutil import parse_rfc3339

    w = resolve_canary_window(ANCHOR, _valid_dict()["window_policy"])
    assert parse_rfc3339(w["resolved_end_time_utc"]) == ANCHOR - timedelta(seconds=30)


def test_start_time_is_anchor_minus_7d_plus_300s():
    from sourcing.timeutil import parse_rfc3339

    w = resolve_canary_window(ANCHOR, _valid_dict()["window_policy"])
    assert parse_rfc3339(w["resolved_start_time_utc"]) == ANCHOR - timedelta(days=7) + timedelta(seconds=300)


def test_effective_window_seconds_is_exactly_604470():
    w = resolve_canary_window(ANCHOR, _valid_dict()["window_policy"])
    assert w["effective_window_seconds"] == 604470
    assert w["effective_window_human_readable"] == "6 days, 23 hours, 54 minutes, 30 seconds"


# --- fingerprint sensitivity ----------------------------------------------
def test_changing_start_guard_changes_fingerprint():
    assert _req(start_guard_seconds=300).fingerprint() != _req(start_guard_seconds=301).fingerprint()


def test_changing_end_guard_changes_fingerprint():
    assert _req(end_guard_seconds=30).fingerprint() != _req(end_guard_seconds=31).fingerprint()


def test_changing_lookback_days_changes_fingerprint():
    assert _req(lookback_days=7).fingerprint() != _req(lookback_days=8).fingerprint()


def test_preview_anchor_change_does_not_change_fingerprint():
    req = _q1()
    fp = req.fingerprint()
    w1 = resolve_canary_window(ANCHOR, req.canonical_dict()["window_policy"])
    w2 = resolve_canary_window(ANCHOR + timedelta(hours=3), req.canonical_dict()["window_policy"])
    assert w1["resolved_end_time_utc"] != w2["resolved_end_time_utc"]  # temporary times differ
    assert req.fingerprint() == fp                                      # fingerprint stable


def test_canonical_serialization_is_insertion_order_independent():
    wp_a = {"mode": "recent_relative", "lookback_days": 7, "start_guard_seconds": 300, "end_guard_seconds": 30, "resolve_once_at_execution": True}
    wp_b = {"resolve_once_at_execution": True, "end_guard_seconds": 30, "start_guard_seconds": 300, "lookback_days": 7, "mode": "recent_relative"}
    assert _req(**wp_a).fingerprint() == _req(**wp_b).fingerprint()


def test_two_v2_requests_with_different_guards_differ():
    assert _req(start_guard_seconds=300, end_guard_seconds=30).fingerprint() != \
        _req(start_guard_seconds=120, end_guard_seconds=15).fingerprint()


def test_new_q1_fingerprint_is_not_the_old_v1_fingerprint():
    assert _q1().fingerprint() != OLD_Q1_CANARY_FINGERPRINT_V1
