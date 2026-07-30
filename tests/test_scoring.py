"""Scoring boundaries, wrapper/penalty logic, and platform risk."""

from __future__ import annotations

from sourcing.aggregate import aggregate
from sourcing.filters import extract
from sourcing.models import ComponentScores
from sourcing.platform_risk import assess_platform_risk, replication_test
from sourcing.scoring import extract_features, score_company
from tests.conftest import make_post, make_user


def _company_from(post, user):
    ex = extract(post, user)
    companies = aggregate([ex], {user.id: user} if user else {})
    return companies[0], ex


def test_component_scores_never_exceed_maxima():
    # Stuff every possible positive signal into one post.
    text = (
        "Just launched Acme, our AI code review agent in production. "
        "First customer onboarded, 1000 users, we open-sourced it. "
        "Deep integration with GitHub, proprietary data flywheel, end-to-end workflow. "
        "Founder, ex-Datadog. Docs and pricing live."
    )
    post = make_post(
        "1", text,
        urls=["https://github.com/acme/agent", "https://acme.ai/pricing", "https://docs.acme.ai"],
        query_groups=["A", "B"],
    )
    user = make_user(description="Founder building AI dev tools")
    comp, _ = _company_from(post, user)
    sc = score_company(comp, text)
    c = sc.components
    assert 0 <= c.role_thesis_fit <= 20
    assert 0 <= c.founder_startup_fit <= 15
    assert 0 <= c.product_technical_evidence <= 20
    assert 0 <= c.customer_pull <= 15
    assert 0 <= c.workflow_depth <= 15
    assert 0 <= c.defensibility <= 10
    assert 0 <= c.shipping_momentum <= 5
    assert 0 <= sc.total_score <= 100


def test_total_score_floored_at_zero():
    # A buzzword-heavy services post with no product should not go negative.
    text = (
        "Revolutionary game-changing next-gen synergy! We build MVPs for you, "
        "done for you, hire us. Seamless frictionless world-class."
    )
    post = make_post("2", text)
    user = make_user(description="")
    comp, _ = _company_from(post, user)
    sc = score_company(comp, text)
    assert sc.total_score == 0.0
    assert sc.total_penalty > 0


def test_wrapper_penalty_and_platform_risk():
    text = "Our AI coding assistant is basically a GPT wrapper. Try it: https://thin.ai"
    post = make_post("3", text, urls=["https://thin.ai"], query_groups=["B"])
    user = make_user(description="indie hacker")
    comp, _ = _company_from(post, user)
    features = extract_features(comp, text)
    risk = assess_platform_risk(comp, features, text)
    # Thin wrapper => high absorption risk and prompt+API factor fires.
    assert "core_value_is_prompt_plus_api" in risk.factors_triggered
    assert risk.score >= 50
    rep = replication_test(features)
    assert rep.difficulty.value in {"very_low", "low"}
    assert rep.disclaimer  # disclaimer always present


def test_founder_fit_ignores_followers():
    text = "Building an AI security agent. Founder, ex-CrowdStrike. https://sec.ai"
    post = make_post("4", text, urls=["https://sec.ai"])
    low_followers = make_user("u1", "alice", description="Founder in AI security", followers=10)
    high_followers = make_user("u2", "bob", description="Founder in AI security", followers=500000)
    comp_low, _ = _company_from(post, low_followers)
    comp_high, _ = _company_from(make_post("5", text, urls=["https://sec.ai"], author_id="u2"), high_followers)
    sc_low = score_company(comp_low, text)
    sc_high = score_company(comp_high, text)
    # Follower count must NOT change Founder-Startup Fit.
    assert sc_low.components.founder_startup_fit == sc_high.components.founder_startup_fit


def test_customer_pull_never_exceeds_and_labels_evidence():
    text = "We have 50 paying customers and 10000 users in production!"
    post = make_post("6", text, query_groups=["C"])
    user = make_user(description="Founder")
    comp, _ = _company_from(post, user)
    features = extract_features(comp, text)
    # All customer inputs are founder-reported (Level B) here, none Level A.
    assert features.customer_level_a == 0
    assert features.customer_level_b >= 1
    sc = score_company(comp, text)
    assert sc.components.customer_pull <= 15
