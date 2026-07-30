"""Classification routing, including the Stealth Founder Lead bucket."""

from __future__ import annotations

from sourcing.aggregate import aggregate
from sourcing.classify import classify
from sourcing.evidence import decay_all
from sourcing.filters import extract
from sourcing.models import Classification
from sourcing.platform_risk import assess_platform_risk, replication_test
from sourcing.scoring import extract_features, score_company
from tests.conftest import make_post, make_user


def _score(post, user):
    ex = extract(post, user)
    decay_all(ex.signals)
    companies = aggregate([ex], {user.id: user})
    comp = companies[0]
    text = post.text + "\n" + (user.description if user else "")
    sc = score_company(comp, text)
    features = extract_features(comp, text)
    sc.platform_risk = assess_platform_risk(comp, features, text)
    sc.replication = replication_test(features)
    sc.classification = classify(sc, features)
    return sc


def test_stealth_founder_lead():
    post = make_post(
        "1",
        "Building in stealth: an AI agent runtime with sandboxing and MCP support. "
        "Ex-infra lead. WIP, more soon.",
    )
    user = make_user(description="Founder, previously staff eng on agent infrastructure")
    sc = _score(post, user)
    assert sc.company.is_stealth is True
    assert sc.classification == Classification.STEALTH_FOUNDER_LEAD


def test_contact_now_requires_level_a_and_signals():
    post = make_post(
        "2",
        "Launched Acme AI security agent. First customer in production. "
        "Deep integration with our proprietary data flywheel. Founder, ex-Wiz.",
        urls=["https://github.com/acme/sec", "https://acme.ai/docs"],
        query_groups=["B"],
    )
    # Second post so evidence is beyond a single promo.
    user = make_user(description="Founder building AI security, ex-Wiz")
    ex1 = extract(post, user)
    ex2 = extract(
        make_post("3", "New changelog: Acme now supports SAML. https://acme.ai/changelog",
                  urls=["https://acme.ai/changelog"]),
        user,
    )
    decay_all(ex1.signals)
    decay_all(ex2.signals)
    companies = aggregate([ex1, ex2], {user.id: user})
    comp = companies[0]
    text = post.text + " Acme changelog SAML " + user.description
    sc = score_company(comp, text)
    features = extract_features(comp, text)
    sc.platform_risk = assess_platform_risk(comp, features, text)
    sc.replication = replication_test(features)
    sc.classification = classify(sc, features)
    assert comp.independent_artifact_count >= 1
    assert sc.classification in {
        Classification.CONTACT_NOW,
        Classification.INVESTIGATE_MOAT,  # if defensibility/risk flags it
    }


def test_thin_wrapper_routes_to_investigate_or_feature_not_archive():
    post = make_post(
        "4",
        "My AI coding autocomplete is a thin GPT wrapper. Founder here. https://thin.ai",
        urls=["https://thin.ai"],
        query_groups=["B"],
    )
    user = make_user(description="Founder building AI coding tools")
    sc = _score(post, user)
    # High platform risk / low replication must NOT auto-archive.
    assert sc.classification != Classification.ARCHIVE
    assert sc.classification in {
        Classification.INVESTIGATE_MOAT,
        Classification.LIKELY_FEATURE,
        Classification.WATCHLIST,
    }


def test_non_lead_archived():
    post = make_post("5", "Good morning everyone, thoughts on the weather today?")
    user = make_user(description="just a person")
    ex = extract(post, user)
    companies = aggregate([ex], {user.id: user})
    comp = companies[0]
    text = post.text
    sc = score_company(comp, text)
    features = extract_features(comp, text)
    sc.platform_risk = assess_platform_risk(comp, features, text)
    sc.replication = replication_test(features)
    sc.classification = classify(sc, features)
    assert sc.classification == Classification.ARCHIVE
