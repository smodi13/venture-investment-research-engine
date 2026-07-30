"""Time-decay calculation and enduring-fact exemption."""

from __future__ import annotations

from sourcing.evidence import apply_time_decay, decay_weight_for_age
from sourcing.models import EvidenceLevel, Signal, SignalType


def test_decay_weight_bands():
    assert decay_weight_for_age(0) == 1.0
    assert decay_weight_for_age(7) == 1.0
    assert decay_weight_for_age(8) == 0.9
    assert decay_weight_for_age(30) == 0.9
    assert decay_weight_for_age(31) == 0.7
    assert decay_weight_for_age(90) == 0.7
    assert decay_weight_for_age(120) == 0.3
    assert decay_weight_for_age(200) == 0.1


def test_time_decay_applied_to_decayable_signal(days_ago):
    sig = Signal(
        type=SignalType.LAUNCH,
        evidence_level=EvidenceLevel.B,
        description="launch",
        source_post_id="1",
        created_at=days_ago(20),
    )
    apply_time_decay(sig)
    assert sig.decay_weight == 0.9


def test_enduring_fact_not_decayed(days_ago):
    sig = Signal(
        type=SignalType.FOUNDER_BACKGROUND,
        evidence_level=EvidenceLevel.B,
        description="ex-Stripe founder",
        source_post_id="1",
        created_at=days_ago(400),
    )
    apply_time_decay(sig)
    assert sig.decay_weight == 1.0  # enduring facts never decay


def test_product_category_not_decayed(days_ago):
    sig = Signal(
        type=SignalType.PRODUCT_CATEGORY,
        evidence_level=EvidenceLevel.D,
        description="category:security",
        source_post_id="1",
        created_at=days_ago(365),
    )
    apply_time_decay(sig)
    assert sig.decay_weight == 1.0
