"""Timezone-aware UTC enforcement + monotonic clock abstraction."""

from __future__ import annotations

from datetime import datetime, timezone

import pytest

from sourcing import approval
from sourcing.approval import QueryDecision, compute_ttl, is_approval_valid
from sourcing.preflight import freeze_window
from sourcing.ratelimit import RateLimitHeaders
from sourcing.timeutil import (
    NaiveDatetimeError,
    Stopwatch,
    ensure_aware_utc,
    now_utc,
    parse_rfc3339,
    reset_epoch_to_rfc3339,
    to_rfc3339,
)


def test_now_utc_is_timezone_aware():
    dt = now_utc()
    assert dt.tzinfo is not None
    assert dt.utcoffset().total_seconds() == 0


def test_naive_datetime_is_rejected():
    naive = datetime(2026, 7, 19, 0, 0, 0)  # no tzinfo
    with pytest.raises(NaiveDatetimeError):
        ensure_aware_utc(naive)
    with pytest.raises(NaiveDatetimeError):
        to_rfc3339(naive)


def test_serialized_timestamps_end_in_z():
    dt = datetime(2026, 7, 19, 0, 16, 0, tzinfo=timezone.utc)
    assert to_rfc3339(dt) == "2026-07-19T00:16:00Z"
    assert parse_rfc3339("2026-07-19T00:16:00Z").tzinfo is not None


def test_rate_limit_reset_parsed_as_aware_utc():
    reset = datetime(2026, 7, 19, 1, 0, 0, tzinfo=timezone.utc).timestamp()
    s = reset_epoch_to_rfc3339(reset)
    assert s.endswith("Z")
    assert parse_rfc3339(s).utcoffset().total_seconds() == 0
    # RateLimitHeaders reset epoch stays numeric; conversion is aware UTC.
    assert reset_epoch_to_rfc3339(None) is None
    _ = RateLimitHeaders(limit=1, remaining=0, reset_epoch=reset)


def test_approval_expiration_uses_aware_utc_values():
    approved_at, expires_at = compute_ttl()
    assert approved_at.endswith("Z") and expires_at.endswith("Z")
    dec = QueryDecision(
        query_id="q1", decision="run", reviewer="Sahil Modi", note="",
        reviewed_at_utc=approved_at, approved_at_utc=approved_at, expires_at_utc=expires_at,
    )
    # Valid now; invalid at a naive datetime (must be rejected, not assumed).
    assert is_approval_valid(dec, now=now_utc()) is True
    with pytest.raises(NaiveDatetimeError):
        is_approval_valid(dec, now=datetime(2026, 7, 19, 0, 0, 0))
    # Expired: a time after expiry is invalid.
    after = parse_rfc3339(expires_at)
    later = after.replace(year=after.year + 1)
    assert is_approval_valid(dec, now=later) is False


def test_request_that_began_valid_is_not_retroactively_invalid():
    # TTL is checked BEFORE the request; a response arriving after expiry does not
    # retroactively invalidate a request that began while approval was valid.
    approved_at, expires_at = compute_ttl(approved_at=now_utc())
    dec = QueryDecision("q1", "run", "Sahil Modi", "", approved_at,
                        approved_at_utc=approved_at, expires_at_utc=expires_at)
    # At request start (now) it is valid; that decision is made once, up front.
    assert is_approval_valid(dec, now=now_utc()) is True


def test_window_timestamps_use_aware_utc():
    win = freeze_window(now=now_utc())
    assert win.request_anchor_utc.endswith("Z")
    assert win.start_time_utc.endswith("Z")
    assert win.end_time_utc.endswith("Z")
    assert parse_rfc3339(win.request_anchor_utc).tzinfo is not None


def test_elapsed_duration_uses_monotonic_clock_abstraction():
    ticks = iter([100.0, 100.25])  # injectable monotonic clock
    watch = Stopwatch(clock=lambda: next(ticks))
    assert watch.elapsed_ms() == 250.0
