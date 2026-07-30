"""Founder detection, evidence-level tagging, and agency exclusion."""

from __future__ import annotations

from sourcing.filters import classify_exclusion, extract
from sourcing.models import ArtifactType, EvidenceLevel, SignalType
from tests.conftest import make_post, make_user


def test_founder_detection():
    post = make_post("1", "I'm building an AI agent runtime for sandboxed execution.")
    user = make_user(description="Founder & CTO, ex-Stripe infra")
    ex = extract(post, user)
    assert ex.has_founder_language is True
    assert any(s.type == SignalType.FOUNDER_BACKGROUND for s in ex.signals)


def test_evidence_level_tagging_artifact_is_level_a():
    post = make_post(
        "2",
        "Just shipped our observability agent. Docs here:",
        urls=["https://docs.acme.ai/quickstart"],
    )
    ex = extract(post)
    artifact_signals = [s for s in ex.signals if s.type == SignalType.PRODUCT_ARTIFACT]
    assert artifact_signals, "expected a product-artifact signal"
    assert all(s.evidence_level == EvidenceLevel.A for s in artifact_signals)
    assert any(a.type == ArtifactType.DOCS for a in ex.artifacts)


def test_evidence_level_tagging_founder_claim_is_level_b():
    post = make_post("3", "We just onboarded our first customer and hit 500 users!")
    ex = extract(post)
    # customer/usage textual signals are founder-reported => Level B
    b_signals = [s for s in ex.signals if s.evidence_level == EvidenceLevel.B]
    assert b_signals
    # quantitative claim captured as a Level B claim
    assert ex.claims and all(c.evidence_level == EvidenceLevel.B for c in ex.claims)


def test_evidence_level_tagging_third_party_is_level_c():
    post = make_post("4", "We've been using Acme in production for months, huge fan.")
    ex = extract(post)
    c_signals = [s for s in ex.signals if s.evidence_level == EvidenceLevel.C]
    assert c_signals
    assert ex.has_third_party_language is True


def test_agency_exclusion():
    post = make_post("5", "Our software agency helps you build MVPs fast. Book a consultation!")
    user = make_user(description="We build apps for you")
    ex = extract(post, user)
    excluded, reason = classify_exclusion(post, ex, user)
    assert excluded is True
    assert reason and "consulting" in reason


def test_crypto_exclusion():
    post = make_post("6", "🚀 Our new NFT presale is live! Mint now, whitelist open. $SOL")
    ex = extract(post)
    excluded, reason = classify_exclusion(post, ex)
    assert excluded is True
    assert "crypto" in reason


def test_retweet_excluded():
    post = make_post("7", "RT some AI news", is_retweet=True)
    ex = extract(post)
    excluded, reason = classify_exclusion(post, ex)
    assert excluded is True
    assert reason == "retweet"


def test_stealth_founder_not_excluded_by_agency_bank():
    # A founder building a real product should survive even if a soft bank word appears.
    post = make_post(
        "8",
        "Building in stealth: an AI SRE agent for incident response. Ex-Datadog. WIP.",
    )
    user = make_user(description="Founder, building an AI observability agent")
    ex = extract(post, user)
    excluded, reason = classify_exclusion(post, ex, user)
    assert excluded is False, f"stealth founder wrongly excluded: {reason}"
