"""Count-preflight helpers: volume vocabulary, operators, frozen window."""

from __future__ import annotations

from datetime import datetime, timezone

from sourcing.preflight import (
    RENAME_MAP,
    extract_operators,
    freeze_window,
)
from sourcing.analysis import volume_label


def test_volume_label_thresholds():
    assert volume_label(0) == "empty"
    assert volume_label(1) == "very_low"
    assert volume_label(15) == "very_low"
    assert volume_label(16) == "manageable"
    assert volume_label(500) == "manageable"
    assert volume_label(501) == "broad"
    assert volume_label(2000) == "broad"
    assert volume_label(2001) == "very_broad"
    assert volume_label(None) == "unknown"


def test_volume_label_matches_recorded_counts():
    # The six preserved counts map to the corrected vocabulary.
    assert volume_label(186) == "manageable"
    assert volume_label(20) == "manageable"
    assert volume_label(4) == "very_low"
    assert volume_label(3) == "very_low"


def test_extract_operators_lists_used_operators():
    q = '("AI agent" OR "MCP server") ("just launched") lang:en -is:retweet'
    ops = extract_operators(q)
    assert any("exact phrase" in o for o in ops)
    assert "Boolean OR" in ops
    assert "lang:en" in ops
    assert "-is:retweet" in ops


def test_frozen_window_is_seven_days_minus_start_guard():
    now = datetime(2026, 7, 18, 19, 37, 6, tzinfo=timezone.utc)
    win = freeze_window(now=now)
    # end anchored 15s back; start nudged +120s from the 7-day mark.
    assert win.effective_window_seconds == 7 * 86400 - win.start_guard_seconds
    assert win.effective_window_seconds == 604680
    assert win.effective_window_human_readable == "6 days, 23 hours, 58 minutes"
    # request_anchor is the execution time (not the start date).
    assert win.request_anchor_utc.startswith("2026-07-18")
    assert win.start_time_utc.startswith("2026-07-11")


def test_rename_map_targets_founder_workflows():
    assert RENAME_MAP["q6_founder_artifact_workflows"] == "q6_founder_workflows"
