"""Offline re-derivation of the 14-author profile evidence. Zero-network."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest

from sourcing import broad_market_enrichment14_rederive as RD


@pytest.fixture(scope="module")
def result():
    return RD.rederive()


def ctx(**kw):
    base = {"project_or_company_name": None, "post_text": "", "post_artifact_domains": [],
            "post_github_owners": [], "post_github_repos": [], "post_actor_project_relation": None,
            "pre_enrichment_disposition": "keep_for_enrichment", "verified_project_name": None}
    base.update(kw)
    return base


def rel(user, c, role):
    return RD.profile_company_relation(user, c, role)


# --- context join passes the data the first pass lacked --------------------
def test_artifact_domains_and_github_passed(result):
    join = RD.join_context()
    daustin = next(r for r in join if r["author_id"] == "1565332434509778946")
    assert daustin["post_github_owners"] == ["Danau5tin"]
    assert "github.com/Danau5tin/ai-trains-ai" in " ".join(daustin["post_artifact_urls"])


def test_join_is_by_exact_author_id():
    join = RD.join_context()
    assert len(join) == 14
    assert all(r["author_id"].isdigit() for r in join)


# --- role rules ------------------------------------------------------------
def test_ceo_alone_not_founder():
    r, _ = RD.profile_role_classification({"name": "X", "description": "CEO of Acme"})
    assert r == "explicit_executive_not_founder"


def test_founder_cofounder():
    assert RD.profile_role_classification({"description": "Founder of Plexor Labs"})[0] == "explicit_founder"
    assert RD.profile_role_classification({"description": "Co-Founder and CTO @scaledown_team"})[0] == "explicit_cofounder"


def test_employee_at_microsoft():
    r, _ = RD.profile_role_classification({"description": "I drink tea and work on AI. Building at: @Microsoft"})
    assert r == "explicit_employee"


def test_reviewer_and_services_roles():
    assert RD.profile_role_classification({"description": "Hands-on AI & tech reviews and comparisons"})[0] == "analyst_or_reviewer"
    assert RD.profile_role_classification({"description": "I help home service businesses with ad creatives"})[0] == "services_operator"


# --- relation + advance rules ---------------------------------------------
def test_founder_plus_exact_domain_advances():
    c = ctx(project_or_company_name="acme", post_artifact_domains=["acme.com"])
    u = {"name": "A", "description": "Founder of Acme", "url": "https://acme.com", "entities": {}}
    rl = rel(u, c, "explicit_founder")
    assert "explicit_founder_alignment" in rl["profile_company_relation"]
    biz = RD.business_type(u, c, "explicit_founder", rl["profile_company_relation"], {"employment_project_relation": "founder_of_project", "current_employer": None})
    comb = RD.combined_disposition(u, c, "explicit_founder", rl,
                                   {"employment_project_relation": "founder_of_project", "current_employer": None}, biz)
    assert comb["combined_disposition"] == "advance_for_diligence"


def test_cofounder_plus_domain_advances():
    c = ctx(pre_enrichment_disposition="keep_verified", project_or_company_name="scaledown", post_artifact_domains=["docs.scaledown.ai"])
    u = {"description": "Co-Founder and CTO @scaledown_team", "url": "https://scaledown.ai", "entities": {}}
    rl = rel(u, c, "explicit_cofounder")
    assert "explicit_cofounder_alignment" in rl["profile_company_relation"]
    comb = RD.combined_disposition(u, c, "explicit_cofounder", rl,
                                   {"employment_project_relation": "founder_of_project", "current_employer": None},
                                   "venture_scale_company_candidate")
    assert comb["combined_disposition"] == "advance_for_diligence"


def test_org_account_plus_domain_advances_identity():
    c = ctx(project_or_company_name="verifyr", post_text="Integrity Engine verifyr")
    u = {"name": "VRFYRAInk", "description": "Integrity Engine. We catch pixel fraud.",
         "url": "https://verifyr.online", "entities": {}}
    role = "organization_account"
    rl = rel(u, c, role)
    biz = RD.business_type(u, c, role, rl["profile_company_relation"], {"employment_project_relation": "organization_account", "current_employer": None})
    comb = RD.combined_disposition(u, c, role, rl, {"employment_project_relation": "organization_account", "current_employer": None}, biz)
    assert comb["combined_disposition"] == "advance_company_identity_confirmed"


def test_profile_resolves_company_from_post_text():
    # candidate name None + post text names "Plexor Labs" + profile links plexorlabs.com
    c = ctx(project_or_company_name=None, post_text="first customer success story at Plexor Labs today plexorlabs.com")
    u = {"description": "founder of Plexor Labs", "url": "https://www.plexorlabs.com", "entities": {}}
    rl = rel(u, c, "explicit_founder")
    assert "exact_product_domain_match" in rl["profile_company_relation"]
    assert "explicit_founder_alignment" in rl["profile_company_relation"]


# --- employer / student / OSS rules ----------------------------------------
def test_microsoft_employee_personal_oss_not_archived():
    c = ctx(pre_enrichment_disposition="keep_verified", project_or_company_name="ai-trains-ai",
            post_github_owners=["Danau5tin"], post_actor_project_relation="self")
    u = {"description": "work on AI. Building at: @Microsoft", "url": "https://danaustin.ai", "entities": {}}
    role, _ = RD.profile_role_classification(u)
    rl = rel(u, c, role)
    emp = RD.employment_project_relation(u, c, role, rl["profile_company_relation"])
    biz = RD.business_type(u, c, role, rl["profile_company_relation"], emp)
    comb = RD.combined_disposition(u, c, role, rl, emp, biz)
    assert comb["combined_disposition"] == "watch_open_source_side_project"
    assert not comb["combined_disposition"].startswith("archive")


def test_student_age_not_archived():
    c = ctx(pre_enrichment_disposition="keep_verified", project_or_company_name="acorn",
            post_github_owners=["Anthony-Pan"])
    u = {"description": "14 y/o indie dev building Feedii & FillMate | Onyx founder",
         "url": "https://onyx-lab.com", "entities": {}}
    role, _ = RD.profile_role_classification(u)
    rl = rel(u, c, role)
    emp = RD.employment_project_relation(u, c, role, rl["profile_company_relation"])
    biz = RD.business_type(u, c, role, rl["profile_company_relation"], emp)
    comb = RD.combined_disposition(u, c, role, rl, emp, biz)
    assert comb["combined_disposition"] == "watch_independent_builder"


def test_reviewer_unrelated_archives():
    c = ctx(pre_enrichment_disposition="manual_review", project_or_company_name="drive")
    u = {"name": "Isaac", "description": "Author, 1200+ articles @InfoWorld. Leads @Star_CIO", "entities": {}}
    role, _ = RD.profile_role_classification(u)
    rl = rel(u, c, role)
    comb = RD.combined_disposition(u, c, role, rl, {"employment_project_relation": "unclear", "current_employer": None}, "media_or_reviewer")
    assert comb["combined_disposition"] == "archive_third_party_or_reviewer"


def test_services_business_archives():
    c = ctx(project_or_company_name=None)
    u = {"description": "I help home service businesses with ad creatives, Meta ads", "entities": {}}
    role, _ = RD.profile_role_classification(u)
    rl = rel(u, c, role)
    comb = RD.combined_disposition(u, c, role, rl, {"employment_project_relation": "no_employment_signal", "current_employer": None}, "agency_or_services")
    assert comb["combined_disposition"] == "archive_services_business"


def test_established_company_marketing_archives():
    c = ctx(pre_enrichment_disposition="manual_review", project_or_company_name="monday")
    u = {"name": "Mandy Monday", "username": "MandyMondayAI",
         "description": "AI agent with a real job at monday.com. Part of the team. Agents can sign up now.",
         "url": "https://monday.com/agents-signup", "entities": {}}
    role, _ = RD.profile_role_classification(u)
    rl = rel(u, c, role)
    emp = RD.employment_project_relation(u, c, role, rl["profile_company_relation"])
    biz = RD.business_type(u, c, role, rl["profile_company_relation"], emp)
    comb = RD.combined_disposition(u, c, role, rl, emp, biz)
    assert comb["combined_disposition"] == "archive_established_company_product"


def test_circular_username_not_independent():
    c = ctx(project_or_company_name="meikuio")
    u = {"username": "meikuio", "name": "Meikuio", "description": "AI & tech reviews", "entities": {}}
    rl = rel(u, c, "analyst_or_reviewer")
    # reviewer archives regardless, but circular flag must not be treated as corroboration
    assert "circular_self_identity_only" in rl["profile_company_relation"] or "no_match" in rl["profile_company_relation"]


def test_github_username_suggestive_not_definitive():
    c = ctx(project_or_company_name="hashcortx", post_github_owners=["Hash-7777"])
    u = {"username": "Hash7777s", "description": "Pharmacist, Angler, Ai enthusiast",
         "url": "https://github.com/Hash-7777", "entities": {}}
    rl = rel(u, c, "independent_hobby_builder")
    assert "exact_github_owner_match" in rl["profile_company_relation"]  # identity match
    # but NOT company verification -> only a watch outcome
    biz = RD.business_type(u, c, "independent_hobby_builder", rl["profile_company_relation"], {"employment_project_relation": "unclear", "current_employer": None})
    comb = RD.combined_disposition(u, c, "independent_hobby_builder", rl, {"employment_project_relation": "unclear", "current_employer": None}, biz)
    assert comb["combined_disposition"] == "watch_open_source_side_project"


def test_empty_profile_unresolved():
    c = ctx(project_or_company_name=None)
    u = {"description": "", "entities": {}}
    role, _ = RD.profile_role_classification(u)
    rl = rel(u, c, role)
    comb = RD.combined_disposition(u, c, role, rl, {"employment_project_relation": "no_employment_signal", "current_employer": None}, "unclear")
    assert comb["combined_disposition"] == "retain_for_manual_research"


def test_missing_user_insufficient():
    comb = RD.combined_disposition(None, ctx(), "unclear",
                                   {"profile_company_relation": ["no_match"], "profile_domains": [], "profile_github_owner": None, "relation_basis": {}},
                                   {"employment_project_relation": "unclear", "current_employer": None}, "unclear")
    assert comb["combined_disposition"] == "insufficient_total_evidence"


# --- disposition preserved + integrity -------------------------------------
def test_pre_enrichment_disposition_preserved(result):
    for r in result["rows"]:
        assert r["pre_enrichment_disposition"] in ("keep_for_enrichment", "keep_verified", "manual_review")


def test_all_14_reprocessed(result):
    assert len(result["rows"]) == 14


def test_write_leaves_raw_and_originals_unchanged():
    raw = Path("data/output/broad_market_4000/profile_enrichment_14/raw_user_response.json")
    orig = Path("data/output/broad_market_4000/profile_enrichment_14/combined_candidate_results.json")
    rb, ob = hashlib.sha256(raw.read_bytes()).hexdigest(), hashlib.sha256(orig.read_bytes()).hexdigest()
    w = RD.write_rederivation(RD.rederive())
    assert w["raw_unchanged"] and w["originals_unchanged"]
    assert hashlib.sha256(raw.read_bytes()).hexdigest() == rb
    assert hashlib.sha256(orig.read_bytes()).hexdigest() == ob


def test_outputs_only_under_rederived_v2(tmp_path, monkeypatch):
    w = RD.write_rederivation(RD.rederive())
    assert w["output_dir"].endswith("rederived_v2")
    for f in Path(w["output_dir"]).glob("*"):
        assert "rederived_v2" in str(f)


def test_no_network_client_constructed(monkeypatch):
    import sourcing.x_client as xc
    monkeypatch.setattr(xc.XClient, "__init__",
                        lambda *a, **k: (_ for _ in ()).throw(AssertionError("no network")))
    assert len(RD.rederive()["rows"]) == 14
