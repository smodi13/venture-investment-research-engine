"""Query-analysis helpers (NON-pricing).

Volume-assessment thresholds live in ``config/query_analysis.yaml`` (not in
pricing config). Labels describe VOLUME ONLY and never set a human decision.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Any

import yaml

from .config import CONFIG_DIR, ConfigError


@lru_cache(maxsize=1)
def load_query_analysis() -> dict[str, Any]:
    path = CONFIG_DIR / "query_analysis.yaml"
    if not path.exists():
        raise ConfigError(f"Missing query-analysis config: {path}")
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def volume_label(count: int | None) -> str:
    """Config-driven volume label (VOLUME ONLY; never sets a human decision).

    empty=0, very_low=1-15, manageable=16-500, broad=501-2000, very_broad=2001+.
    """
    if count is None:
        return "unknown"
    bands = load_query_analysis().get("volume_bands", {})
    if count <= bands.get("empty_max", 0):
        return "empty"
    if count <= bands.get("very_low_max", 15):
        return "very_low"
    if count <= bands.get("manageable_max", 500):
        return "manageable"
    if count <= bands.get("broad_max", 2000):
        return "broad"
    return "very_broad"


def volume_assessment(count: int | None) -> str:
    if count is None:
        return "unknown (no counts probe available)"
    return f"{volume_label(count)} (~{count} recent posts)"
