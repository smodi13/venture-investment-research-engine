"""Evidence-level helpers and time-decay weighting (mandate sections 5 & 6).

Time decay applies ONLY to time-sensitive signals (launch, customer, usage,
design-partner, hiring, shipping). Enduring facts -- founder background, product
category, technical architecture -- are never decayed.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Iterable, Optional

from .config import load_scoring
from .models import Signal, SignalType

# Signals subject to time decay. Everything else is an enduring fact.
DECAYABLE_SIGNALS = {
    SignalType.LAUNCH,
    SignalType.CUSTOMER,
    SignalType.USAGE,
    SignalType.DESIGN_PARTNER,
    SignalType.HIRING,
    SignalType.SHIPPING,
}

ENDURING_SIGNALS = {
    SignalType.FOUNDER_BACKGROUND,
    SignalType.PRODUCT_CATEGORY,
    SignalType.TECHNICAL_ARCHITECTURE,
    SignalType.PRODUCT_ARTIFACT,
}


def _decay_config() -> dict:
    return load_scoring().get("time_decay", {})


def decay_weight_for_age(age_days: float) -> float:
    """Return the recency weight for a signal `age_days` old.

    0-7 -> full (1.0), 8-30 -> 0.9, 31-90 -> 0.7, 91-180 -> 0.3 (context only),
    >180 -> 0.1 (background only). Bands/weights come from scoring.yaml.
    """
    cfg = _decay_config()
    w = cfg.get("weights", {})
    if age_days < 0:
        age_days = 0.0
    if age_days <= cfg.get("full_weight_days", 7):
        return w.get("full", 1.0)
    if age_days <= cfg.get("high_weight_days", 30):
        return w.get("high", 0.9)
    if age_days <= cfg.get("medium_weight_days", 90):
        return w.get("medium", 0.7)
    if age_days <= cfg.get("context_only_days", 180):
        return w.get("context_only", 0.3)
    return w.get("background", 0.1)


def apply_time_decay(signal: Signal, now: Optional[datetime] = None) -> Signal:
    """Set ``signal.decay_weight`` in place and return the signal.

    Enduring facts keep weight 1.0 regardless of age.
    """
    if signal.type not in DECAYABLE_SIGNALS:
        signal.decay_weight = 1.0
        return signal
    if signal.created_at is None:
        # No timestamp -> treat as context only, not full weight.
        signal.decay_weight = _decay_config().get("weights", {}).get("context_only", 0.3)
        return signal

    now = now or datetime.now(timezone.utc)
    created = signal.created_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)
    age_days = (now - created).total_seconds() / 86400.0
    signal.decay_weight = decay_weight_for_age(age_days)
    return signal


def decay_all(signals: Iterable[Signal], now: Optional[datetime] = None) -> list[Signal]:
    return [apply_time_decay(s, now=now) for s in signals]


def has_level(signals: Iterable[Signal], level) -> bool:
    return any(s.evidence_level == level for s in signals)
