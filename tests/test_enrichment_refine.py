"""Refinements: executive role, circular self-handle, combined disposition."""

from __future__ import annotations

import json
from pathlib import Path

from sourcing.enrichment import (
    CANDIDATES, account_type, candidate_project_match, combined_disposition,
    extract_profile, profile_role_signal,
)


def _u(**kw):
    base = {"id": "1", "name": "", "username": "", "description": "", "entities": {},
            "protected": False, "public_metrics": {"followers_count": 0}}
    base.update(kw)
    return base


AOS = CANDIDATES["15963134"]
COMFY = CANDIDATES["2061874923639836672"]
SYN = CANDIDATES["2063311066294054912"]


# --- Refinement 1: executive role -----------------------------------------
def test_ceo_is_executive_not_founder():
    sig, ev = profile_role_signal("CEO Unicity Labs @unicity_labs")
    assert sig == "explicit_executive"
    assert ev["matched_role_title"] == "CEO"
    assert ev["matched_organization"] == "Unicity Labs"
    assert account_type("CEO Unicity Labs")[0] == "individual"


def test_cto_is_executive_and_founder_is_founder():
    assert profile_role_signal("CTO at Acme")[0] == "explicit_executive"
    assert profile_role_signal("Founder of Synapse")[0] == "explicit_founder"
    assert profile_role_signal("Cofounder & CEO")[0] == "explicit_cofounder"  # founder wins over CEO


def test_executive_without_org_incomplete():
    sig, ev = profile_role_signal("CEO. building cool things")
    assert sig == "explicit_executive" and ev["matched_organization"] in (None, "")


# --- Refinement 2: circular self-handle -----------------------------------
def test_own_handle_is_circular_and_not_corroboration():
    u = _u(username="NeurainX", description="Exploring the world for fun and benefit")
    m = candidate_project_match(u, extract_profile(u, COMFY), COMFY)
    assert m["evidence"]["is_source_author_handle"] is True
    assert m["evidence"]["handle_evidence_independence"] == "circular_self_identity"
    assert m["match"] == "unclear"                       # circular handle != evidence
    assert "PROFILE_MATCHING_PROJECT_HANDLE" not in m["reason_codes"]


def test_distinct_company_handle_with_role_is_independent():
    u = _u(username="mgault", description="CEO Unicity Labs @unicity_labs",
           entities={"description": {"mentions": [{"username": "unicity_labs"}]}})
    m = candidate_project_match(u, extract_profile(u, AOS), AOS)
    assert m["evidence"]["is_candidate_project_handle"] is True
    assert m["evidence"]["handle_evidence_independence"] == "independent"
    assert m["match"] == "likely"                        # org-affiliation, project name not in bio


# --- Refinement 3: combined disposition -----------------------------------
def _combined(post_level, m, role, registry_match=False):
    return combined_disposition(post_level, m, role, registry_match)["combined_candidate_disposition"]


def test_verified_artifact_survives_empty_profile():
    u = _u(description="")  # empty profile
    m = candidate_project_match(u, extract_profile(u, SYN), SYN)
    post = {"lead_disposition": "keep_verified", "has_level_a": True,
            "announcement_attribution": "direct_builder_claim"}
    assert _combined(post, m, "unclear") == "advance_for_diligence"


def test_builder_claim_plus_executive_org_advances():
    u = _u(username="mgault", description="CEO Unicity Labs @unicity_labs",
           entities={"description": {"mentions": [{"username": "unicity_labs"}]}})
    m = candidate_project_match(u, extract_profile(u, AOS), AOS)
    post = {"lead_disposition": "keep_for_enrichment", "has_level_a": False,
            "announcement_attribution": "direct_builder_claim"}
    assert _combined(post, m, "explicit_executive") == "advance_for_diligence"


def test_builder_claim_plus_empty_profile_is_manual_research():
    u = _u(username="NeurainX", description="Exploring the world for fun and benefit")
    m = candidate_project_match(u, extract_profile(u, COMFY), COMFY)
    post = {"lead_disposition": "keep_for_enrichment", "has_level_a": False,
            "announcement_attribution": "direct_builder_claim"}
    assert _combined(post, m, "no_explicit_signal") == "retain_for_manual_research"


def test_contradiction_overrides_verified_post():
    u = _u(description="Engineer at Microsoft")
    m = candidate_project_match(u, extract_profile(u, SYN), SYN)
    post = {"lead_disposition": "keep_verified", "has_level_a": True,
            "announcement_attribution": "direct_builder_claim"}
    assert _combined(post, m, "explicit_employee", registry_match=True) == "archive_contradicted"


def test_established_org_overrides_actionable():
    u = _u(description="Founder at Microsoft, building Synapse")
    m = candidate_project_match(u, extract_profile(u, SYN), SYN)
    post = {"lead_disposition": "keep_for_enrichment", "has_level_a": False,
            "announcement_attribution": "direct_builder_claim"}
    # named + registry employer -> established_org_tie
    assert m["evidence"].get("established_org_tie") is True
    assert _combined(post, m, "explicit_founder", registry_match=True) == "archive_established_org"


def test_vanity_metrics_do_not_affect_combined():
    base = _u(username="mgault", description="CEO Unicity Labs @unicity_labs",
              entities={"description": {"mentions": [{"username": "unicity_labs"}]}})
    hi = dict(base, public_metrics={"followers_count": 9_000_000}, verified=True, created_at="2007-01-01T00:00:00Z")
    post = {"lead_disposition": "keep_for_enrichment", "has_level_a": False,
            "announcement_attribution": "direct_builder_claim"}
    m1 = candidate_project_match(base, extract_profile(base, AOS), AOS)
    m2 = candidate_project_match(hi, extract_profile(hi, AOS), AOS)
    assert _combined(post, m1, "explicit_executive") == _combined(post, m2, "explicit_executive")


# --- integrity: saved raw responses + lock + cost unchanged ---------------
def test_raw_and_lock_and_cost_unchanged():
    # raw enrichment + raw canary present and NOT among regenerated derived files
    assert Path("data/output/targeted_enrichment/raw_user_response.json").exists()
    assert Path("data/output/canary/raw_response.json").exists()
    ledger = json.loads(Path("data/output/targeted_enrichment/enrichment_cost_ledger.json").read_text())
    assert ledger["billing_status"] == "estimated_only"
    assert ledger["observed_console_cost_usd"] is None
    # durable lock still present
    locks = list(Path("data/state/enrichment_execution_locks").glob("*.lock"))
    assert len(locks) >= 1
