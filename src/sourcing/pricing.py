"""Pricing reference + staleness gate (cost control).

The engine never hardcodes live prices. ``config/pricing.yaml`` is a
reviewer-owned reference. When it is stale, a live search must fail closed unless
the reviewer explicitly acknowledges the staleness.
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from functools import lru_cache
from typing import Any

from .config import CONFIG_DIR, ConfigError

import yaml


@lru_cache(maxsize=1)
def load_pricing() -> dict[str, Any]:
    path = CONFIG_DIR / "pricing.yaml"
    if not path.exists():
        raise ConfigError(f"Missing pricing config: {path}")
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh) or {}
    return data


def _parse_date(value: Any) -> date | None:
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value).date()
        except ValueError:
            try:
                return datetime.strptime(value, "%Y-%m-%d").date()
            except ValueError:
                return None
    return None


def pricing_age_days(now: date | None = None) -> int | None:
    p = load_pricing()
    updated = _parse_date(p.get("updated_at"))
    if updated is None:
        return None
    now = now or datetime.now(timezone.utc).date()
    return (now - updated).days


def is_pricing_stale(now: date | None = None) -> bool:
    p = load_pricing()
    age = pricing_age_days(now)
    if age is None:
        return True  # unknown age => treat as stale (fail closed)
    return age > int(p.get("staleness_days", 30))


# NOTE: volume-assessment lives in sourcing.analysis (config/query_analysis.yaml),
# not here — pricing.py holds only cost/pricing assumptions.
