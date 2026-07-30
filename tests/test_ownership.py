"""Deterministic ownership / attribution / disposition layer (mandate sections 1-13)."""

from __future__ import annotations

import json
from pathlib import Path

from sourcing.filters import extract
from sourcing.models import RawPost
from sourcing.ownership import analyze
from sourcing.urlutil import build_url_info
from sourcing.x_client import parse_post


def _mk(text, entities=None, role_fit=None):
    details = [build_url_info(e) for e in (entities or [])]
    post = RawPost(
        id="t", text=text, author_id="a", url_details=details,
        expanded_urls=[d["selected_canonical_url"] for d in details if d["selected_canonical_url"]],
    )
    ex = extract(post, None)
    rf = bool(ex.matched_categories) if role_fit is None else role_fit
    return analyze(ex, rf), ex


GH = lambda owner_repo: {"url": "https://t.co/x", "expanded_url": f"https://github.com/{owner_repo}"}
DOM = lambda host: {"url": "https://t.co/x", "expanded_url": f"https://{host}/product"}
XMEDIA = {"url": "https://t.co/x", "expanded_url": "https://x.com/u/status/1/photo/1"}
XQUOTE = {"url": "https://t.co/x", "expanded_url": "https://twitter.com/u/status/2"}


# --- Section 14 regression cases ------------------------------------------
def test_1_we_launched_unregistered_domain_keep_verified():
    o, _ = _mk("We launched our AI agent runtime", [DOM("synapsedev.io")])
    assert o.announcement_attribution == "direct_builder_claim"
    assert o.artifact_owner_scope == "unregistered"
    assert o.lead_disposition == "keep_verified"


def test_2_we_launched_registry_domain_archive_established_org():
    o, _ = _mk("We launched our AI agent runtime", [DOM("microsoft.com")])
    assert o.lead_disposition == "archive_established_org"
    assert o.artifact_owner_entity == "Microsoft"


def test_3_first_person_unrelated_to_launch_action():
    o, _ = _mk("I love AI agent runtimes. Reuters launched an MCP server.")
    assert o.announcement_attribution == "third_party_announcement"
    assert o.actor_project_relation == "third_party"


def test_4_third_party_linking_established_repo_archive_third_party():
    o, _ = _mk("Microsoft open-sourced their new AI agent tool", [GH("microsoft/agent")])
    assert o.lead_disposition == "archive_third_party"
    assert "A" in o.artifact_evidence_level               # Level A retained
    assert o.artifact_owner_scope == "established_organization"


def test_5_direct_builder_unregistered_github_keep_verified():
    o, _ = _mk("Just launched Synapse, our AI agent indexer", [GH("nrkoka786/synapse")])
    assert o.lead_disposition == "keep_verified"
    assert o.github_owner == "nrkoka786"
    assert o.artifact_owner_scope == "unregistered"


def test_6_7_8_github_owner_matching():
    o_exact, _ = _mk("Microsoft open-sourced a runtime for AI agents", [GH("microsoft/x")])
    assert o_exact.github_owner_registry_match is True
    o_ci, _ = _mk("MICROSOFT open-sourced a runtime for AI agents", [GH("MICROSOFT/x")])
    assert o_ci.github_owner_registry_match is True
    o_sub, _ = _mk("we launched an AI agent tool", [GH("microsoft-labs/x")])
    assert o_sub.github_owner_registry_match is False     # no substring


def test_9_10_domain_subdomain_and_substring():
    from sourcing.registry import match_domain
    assert match_domain("api.stripe.com") is not None     # valid subdomain
    assert match_domain("notstripe.com") is None          # substring rejected


def test_11_12_level_a_retained_and_archive_independent_of_level_a():
    # Level A retained for an established-company artifact.
    o1, _ = _mk("ByteDance open-sourced DeerFlow, an AI agent harness", [GH("bytedance/deerflow")])
    assert "A" in o1.artifact_evidence_level
    # archive_established_org applies even with NO Level A (explicit text tie).
    o2, _ = _mk("We at Microsoft just launched a new AI agent runtime")
    assert o2.lead_disposition == "archive_established_org"


def test_13_archive_third_party_precedence_over_org_scope():
    o, _ = _mk("Microsoft open-sourced this AI agent tool", [GH("microsoft/agent")])
    assert o.lead_disposition == "archive_third_party"    # not archive_established_org


def test_14_15_x_links_not_external_artifacts():
    o_media, ex1 = _mk("We just launched our AI agent runtime", [XMEDIA])
    assert "A" not in o_media.artifact_evidence_level and ex1.artifacts == []
    o_quote, ex2 = _mk("We just launched our AI agent runtime", [XQUOTE])
    assert ex2.artifacts == []


def test_16_17_unregistered_owner_not_a_startup():
    o, _ = _mk("We launched our AI agent runtime", [GH("nrkoka786/synapse")])
    assert o.artifact_owner_scope == "unregistered"       # unregistered, never auto-"startup"
    assert "startup" not in o.artifact_owner_scope


def test_18_alias_match_not_employment():
    o, _ = _mk("I love using Microsoft tools for AI agents")
    assert o.lead_disposition != "archive_established_org"
    assert o.actor_project_relation != "self_organization"


def test_19_i_used_but_other_company_is_actor():
    o, _ = _mk("Epic just shipped a plugin and I used it for my AI agent")
    assert o.actor_project_relation == "third_party"


def test_20_mixed_first_person_and_third_party_launch():
    o, _ = _mk("We think this is huge. ByteDance open-sourced DeerFlow for AI agents.")
    assert o.announcement_attribution == "third_party_announcement"


def test_21_22_23_24_project_name_source():
    o_ext, _ = _mk("Just launched Synapse for AI agents", [GH("nrkoka786/synapse")])
    assert o_ext.project_name_source == "external_artifact" and o_ext.verified_project_name == "nrkoka786/synapse"
    o_self, _ = _mk("We just launched Comfy MCP for AI agents")
    assert o_self.project_name_source == "explicit_self_claim" and o_self.claimed_project_name == "Comfy MCP"
    o_tp, _ = _mk("ByteDance open-sourced DeerFlow for AI agents")
    assert o_tp.project_name_source == "third_party_mention"
    o_vague, _ = _mk("we are building something in the AI agent space")
    assert o_vague.verified_project_name is None


def test_25_precedence_not_overwritten_by_later_keywords():
    # Commentary with a github link still archives as commentary (rule 1 wins).
    o, _ = _mk("Every serious organization is converging. Stripe built X, Ramp built Y, Coinbase built Z.",
               [GH("acme/agent")])
    assert o.lead_disposition == "archive_commentary"


# --- Section 13 canary expectations (from saved fixture) -------------------
def test_canary_fixture_dispositions():
    data = json.loads(Path("tests/fixtures/live_schema_canary.json").read_text())["data"]
    exp = {
        "2078706198921331073": ("unclear", "manual_review"),
        "2078688196926316737": ("third_party_announcement", "archive_third_party"),
        "2078687429293129950": ("direct_builder_claim", "keep_verified"),
        "2078644992684490954": ("industry_commentary", "archive_commentary"),
        "2078633875123949976": ("third_party_announcement", "archive_third_party"),
        "2078603336912134633": ("third_party_announcement", "archive_third_party"),
        "2078586648296882363": ("direct_builder_claim", "keep_for_enrichment"),
        "2078564905410818281": ("third_party_announcement", "archive_third_party"),
        "2078543777090904569": ("direct_builder_claim", "keep_for_enrichment"),
        "2078510859307897316": ("third_party_announcement", "archive_third_party"),
    }
    for t in data:
        post = parse_post(t)
        ex = extract(post, None)
        o = analyze(ex, bool(ex.matched_categories))
        want_attr, want_disp = exp[post.id]
        assert o.announcement_attribution == want_attr, (post.id, o.announcement_attribution)
        assert o.lead_disposition == want_disp, (post.id, o.lead_disposition)


def test_canary_synapse_verified_and_unregistered():
    data = json.loads(Path("tests/fixtures/live_schema_canary.json").read_text())["data"]
    t = next(x for x in data if x["id"] == "2078687429293129950")
    o = analyze(extract(parse_post(t), None), True)
    assert o.verified_project_name == "nrkoka786/synapse"
    assert o.github_owner == "nrkoka786" and o.github_repository == "synapse"
    assert o.artifact_owner_scope == "unregistered"        # not auto-startup, not established
    assert "A" in o.artifact_evidence_level
    assert "DIRECT_BUILDER_WITH_VERIFIED_ARTIFACT" in o.reason_codes
