"""Timezone-aware UTC helpers + a monotonic clock abstraction.

Rules enforced here:
  * All wall-clock datetimes are timezone-aware UTC. Naive datetimes are rejected
    at module boundaries — never silently assigned a timezone.
  * UTC timestamps serialize as RFC 3339 with a ``Z`` suffix.
  * Elapsed time / durations / waits / backoff use ``time.monotonic()`` via
    :class:`Stopwatch`, never wall-clock subtraction.
"""

from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Callable


class NaiveDatetimeError(ValueError):
    """Raised when a naive (timezone-unaware) datetime crosses a boundary."""


def now_utc() -> datetime:
    """Current time as a timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)


def ensure_aware_utc(dt: datetime, *, field: str = "datetime") -> datetime:
    """Return ``dt`` normalized to UTC, rejecting naive datetimes.

    Never assumes or attaches a timezone to a naive value — it fails closed.
    """
    if not isinstance(dt, datetime):
        raise NaiveDatetimeError(f"{field}: expected a datetime, got {type(dt).__name__}")
    if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
        raise NaiveDatetimeError(f"{field}: naive datetime is not allowed; use timezone-aware UTC")
    return dt.astimezone(timezone.utc)


def to_rfc3339(dt: datetime, *, field: str = "datetime") -> str:
    """Serialize an aware UTC datetime as RFC 3339 with a ``Z`` suffix."""
    aware = ensure_aware_utc(dt, field=field)
    return aware.isoformat().replace("+00:00", "Z")


def parse_rfc3339(value: str, *, field: str = "timestamp") -> datetime:
    """Parse an RFC 3339 timestamp into an aware UTC datetime."""
    if not isinstance(value, str) or not value:
        raise NaiveDatetimeError(f"{field}: empty/invalid timestamp")
    dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return ensure_aware_utc(dt, field=field)


def epoch_from_rfc3339(value: str, *, field: str = "timestamp") -> float:
    """POSIX epoch seconds for an RFC 3339 UTC timestamp."""
    return parse_rfc3339(value, field=field).timestamp()


def reset_epoch_to_rfc3339(reset_epoch: float | None) -> str | None:
    """Convert an x-rate-limit-reset epoch to an aware-UTC RFC 3339 ``Z`` string."""
    if reset_epoch is None:
        return None
    return to_rfc3339(datetime.fromtimestamp(reset_epoch, tz=timezone.utc), field="rate_limit_reset")


class Stopwatch:
    """Monotonic elapsed-time measurement (never wall-clock subtraction)."""

    def __init__(self, clock: Callable[[], float] = time.monotonic):
        self._clock = clock
        self._start = clock()

    def elapsed_seconds(self) -> float:
        return self._clock() - self._start

    def elapsed_ms(self) -> float:
        return round(self.elapsed_seconds() * 1000, 2)
