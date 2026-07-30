"""Deterministic local broad-market processing. Zero-network."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest

from sourcing import broad_market_process as P
from sourcing import broad_market_process_run as R


def mk(text, *, entities=None, refs=None, qid="q06_b2b_saas_launch", pid="1", author="9",
       lang="en", metrics=None):
    raw = {"id": pid, "author_id": author, "text": text, "lang": lang,
           "created_at": "2026-07-19T00:00:00.000Z",
           "public_metrics": metrics or {"like_count": 0, "retweet_count": 0, "reply_count": 0, "quote_count": 0}}
    if entities is not None:
        raw["entities"] = entities
    if refs is not None:
        raw["referenced_tweets"] = refs
    return P.process_post(raw, [qid], [1])


def ent(expanded, url="https://t.co/x", unwound=None):
    return {"urls": [{"url": url, "expanded_url": expanded, "unwound_url": unwound or expanded, "status": 200}]}


# --- broad-market relevance is not AI-gated --------------------------------
def test_broad_market_relevance_does_not_require_ai():
    r = mk("We launched our B2B SaaS for warehouse teams", entities=ent("https://warely.com"),
           qid="q06_b2b_saas_launch")
    assert r.broad_market_relevance == "in_scope"
    assert r.sector_bucket in P._NON_AI_SOFTWARE_SECTORS | {"industrial_manufacturing"}


def test_non_ai_saas_can_advance():
    r = mk("We launched our enterprise workflow software; first customer signed",
           entities=ent("https://flowdesk.io"), qid="q06_b2b_saas_launch")
    assert r.lead_disposition == "keep_verified"
    assert r.headline_mandate_fit in ("medium", "high")


def test_robotics_can_advance():
    r = mk("We built an autonomous warehouse robot; first units deployed",
           entities=ent("https://roboxle.com"), qid="q14_robotics_and_drones")
    assert r.sector_bucket == "hardware_deeptech"
    assert r.lead_disposition == "keep_verified"


def test_semiconductor_hardware_can_advance():
    r = mk("We taped-out our photonics chip; first units back from the fab",
           entities=ent("https://photonchip.com"), qid="q15_semiconductors_photonics_sensors")
    assert r.sector_bucket == "hardware_deeptech"
    assert r.lead_disposition == "keep_verified"


def test_climate_hardware_can_advance():
    r = mk("We built a grid-scale battery; first installation live at a utility",
           entities=ent("https://voltcell.com"), qid="q16_energy_and_climate_hardware")
    assert r.sector_bucket == "climate_energy"
    assert r.lead_disposition == "keep_verified"


def test_medical_devices_can_advance():
    r = mk("We built a surgical diagnostics device; clinical pilot started",
           entities=ent("https://medscope.com"), qid="q17_medical_devices")
    assert r.sector_bucket == "medical_device"
    assert r.lead_disposition == "keep_verified"


def test_industrial_technology_can_advance():
    r = mk("We launched our manufacturing software; first customer in production",
           entities=ent("https://factoryos.com"), qid="q13_supply_chain_industrial_software")
    assert r.sector_bucket == "industrial_manufacturing"
    assert r.lead_disposition == "keep_verified"


def test_consumer_hardware_can_advance():
    r = mk("We built our own smart home camera; shipping first units to customers",
           entities=ent("https://homelens.com"), qid="q19_consumer_hardware")
    assert r.sector_bucket == "consumer_hardware"
    assert r.lead_disposition == "keep_verified"


def test_low_headline_fit_does_not_auto_archive():
    r = mk("We built a drone; first units deployed", entities=ent("https://dronewerks.com"),
           qid="q14_robotics_and_drones")
    assert r.headline_mandate_fit == "low"       # hardware = low mandate fit
    assert not r.lead_disposition.startswith("archive")  # but NOT archived


# --- separation of non-scalable business types -----------------------------
def test_services_business_separated():
    r = mk("We are a software agency; we build custom apps for clients. Hire us!",
           entities=ent("https://buildshop.dev"), qid="q06_b2b_saas_launch")
    assert r.lead_disposition == "archive_services_business"
    assert "SERVICES_BUSINESS_SIGNAL" in r.reason_codes


def test_marketplace_reseller_separated():
    r = mk("Our gadget is now available on Amazon, use code SAVE10 affiliate link",
           entities=ent("https://shopitem.com"), qid="q19_consumer_hardware")
    assert r.lead_disposition == "archive_marketplace_or_reseller"
    assert "MARKETPLACE_OR_RESELLER_SIGNAL" in r.reason_codes


# --- attribution guardrails ------------------------------------------------
def test_third_party_announcement_not_builder_claim():
    r = mk("Google open-sourced a new agent framework today", entities=ent("https://github.com/google/x"),
           qid="q02_ai_devtools_artifact")
    assert r.announcement_attribution == "third_party_announcement"
    assert r.actor_project_relation == "third_party"
    assert r.lead_disposition == "archive_third_party"


def test_prototype_not_commercial_readiness():
    r = mk("We built a working prototype of our robot", entities=ent("https://protorobo.com"),
           qid="q14_robotics_and_drones")
    assert "functioning_prototype" in r.hardware_evidence
    assert "PROTOTYPE_NOT_COMMERCIAL" not in r.reason_codes or r.has_level_a  # has artifact -> not flagged
    # without an external artifact the prototype must not read as commercial
    r2 = mk("We built a working prototype of our robot", qid="q14_robotics_and_drones")
    assert "PROTOTYPE_NOT_COMMERCIAL" in r2.reason_codes
    assert r2.lead_disposition != "keep_verified"


def test_preorder_not_revenue():
    r = mk("Preorder our new smart speaker now", entities=ent("https://speakerco.com"),
           qid="q19_consumer_hardware")
    assert "preorder_claim" in r.hardware_evidence
    assert "PREORDER_NOT_REVENUE" in r.reason_codes


def test_crowdfunding_not_recurring_revenue():
    r = mk("We built it; back us on Kickstarter, 500 backers already",
           entities=ent("https://gadgetco.com"), qid="q19_consumer_hardware")
    assert "crowdfunding_claim" in r.hardware_evidence
    assert "CROWDFUNDING_NOT_RECURRING_REVENUE" in r.reason_codes


def test_pilot_claims_unverified():
    r = mk("We built it; first installation at a utility, pilot install underway",
           entities=ent("https://gridco.com"), qid="q16_energy_and_climate_hardware")
    assert "PILOT_STATUS_UNVERIFIED" in r.reason_codes


def test_fda_mention_not_approval():
    r = mk("We built a diagnostics device; FDA submission filed (510(k))",
           entities=ent("https://dxco.com"), qid="q17_medical_devices")
    assert "regulatory_approval" not in r.hardware_evidence
    assert "REGULATORY_STATUS_UNVERIFIED" in r.reason_codes


def test_purchase_order_reported_unless_supported():
    r = mk("We built it; we received our first purchase order", entities=ent("https://indco.com"),
           qid="q18_advanced_manufacturing_materials")
    assert "purchase_order_claim" in r.hardware_evidence
    assert "PURCHASE_ORDER_UNVERIFIED" in r.reason_codes


# --- scoring / consolidation integrity -------------------------------------
def test_duplicate_evidence_does_not_increase_score():
    single = ent("https://dupco.com")
    doubled = {"urls": single["urls"] + single["urls"]}  # same URL twice
    a = mk("We launched our tool", entities=single, pid="1")
    b = mk("We launched our tool", entities=doubled, pid="2")
    assert a.research_score == b.research_score           # repeated evidence must not inflate


def test_consolidation_requires_deterministic_evidence():
    a = mk("We launched", entities=ent("https://sameco.com"), pid="1", author="1")
    b = mk("We shipped", entities=ent("https://sameco.com"), pid="2", author="2")
    c = mk("We built a generic tool", pid="3", author="3")  # no artifact, no name -> no key
    comps = P.consolidate([a, b, c])
    keyed = [x for x in comps if x["consolidation_basis"] == "domain"]
    assert any(len(x["source_posts"]) == 2 for x in keyed)   # a+b merged on exact domain
    # generic descriptions never merge
    singles = [x for x in comps if x["consolidation_basis"] == "unconsolidated_single_post"]
    assert any(x["source_posts"] == ["3"] for x in singles)


def test_consolidated_score_is_best_not_sum():
    a = mk("We launched our tool; first customer in production", entities=ent("https://mergeco.com"), pid="1", author="1")
    b = mk("We shipped", entities=ent("https://mergeco.com"), pid="2", author="1")
    comp = [c for c in P.consolidate([a, b]) if c["post_count"] == 2][0]
    assert comp["research_score"] == max(a.research_score, b.research_score)


# --- safe handling of missing fields ---------------------------------------
def test_missing_entities_handled_safely():
    r = mk("We launched something", entities=None)
    assert r.artifacts == [] and r.has_level_a is False
    assert r.entities_present is False


def test_missing_referenced_tweets_handled_safely():
    r = mk("We launched something", refs=None)
    assert r.is_retweet is False and r.is_reply is False
    assert r.referenced_tweets_present is False


def test_referenced_tweets_used_for_attribution_flags():
    r = mk("nice", refs=[{"type": "retweeted", "id": "5"}])
    assert r.is_retweet is True and r.referenced_tweets_present is True


def test_lang_preserved():
    assert mk("x", lang="de").lang == "de"


def test_public_metrics_do_not_change_disposition():
    base = "We launched our tool"
    e = ent("https://metco.com")
    lo = mk(base, entities=e, metrics={"like_count": 0, "retweet_count": 0, "reply_count": 0, "quote_count": 0})
    hi = mk(base, entities=e, metrics={"like_count": 99999, "retweet_count": 8000, "reply_count": 7000, "quote_count": 6000})
    assert lo.lead_disposition == hi.lead_disposition
    assert lo.research_score == hi.research_score


# --- provenance ------------------------------------------------------------
def test_all_source_query_provenance_preserved():
    raw = {"id": "1", "author_id": "9", "text": "we launched", "lang": "en",
           "public_metrics": {}, "entities": ent("https://provco.com")}
    r = P.process_post(raw, ["q01_ai_infra_artifact", "q05_ai_hardware"], [1, 2])
    assert r.source_queries == ["q01_ai_infra_artifact", "q05_ai_hardware"]
    assert r.source_pages == [1, 2]
    assert r.source_run == "broad_market_4000_post_run"


# --- integrity: prior files, no network, outputs isolated ------------------
def test_prior_raw_files_unchanged(tmp_path):
    raw = Path("data/output/broad_market_4000/parsed_posts.json")
    before = hashlib.sha256(raw.read_bytes()).hexdigest()
    R.run_processing(output_dir=tmp_path / "processed")
    assert hashlib.sha256(raw.read_bytes()).hexdigest() == before


def test_no_client_constructed_during_processing(monkeypatch):
    import sourcing.x_client as xc
    def boom(*a, **k):
        raise AssertionError("network client must not be constructed during local processing")
    monkeypatch.setattr(xc.XClient, "__init__", boom)
    recs, errors = P.process_all()      # reads files only
    assert len(recs) > 0 and errors == []


def test_outputs_written_only_under_processed_dir(tmp_path):
    out = tmp_path / "processed"
    R.run_processing(output_dir=out)
    files = list(out.glob("*"))
    assert len(files) >= 40
    for f in files:
        assert str(f).startswith(str(out))
    # raw retrieval files still present and outside the processed dir
    assert Path("data/output/broad_market_4000/parsed_posts.json").exists()


def test_profile_enrichment_remains_unapproved(tmp_path):
    out = tmp_path / "processed"
    R.run_processing(output_dir=out)
    pe = json.loads((out / "proposed_profile_enrichment.json").read_text())
    assert pe["status"] == "PROPOSED_NOT_BUILT_NOT_APPROVED"
    assert pe["count"] <= 30
    # excludes previously-enriched authors, no duplicates
    ids = pe["proposed_author_ids"]
    assert len(ids) == len(set(ids))
    assert not (set(ids) & P.PRIOR_ENRICHED_AUTHOR_IDS)


def test_broad_retrieval_cannot_be_rerun():
    from sourcing import broad_market_run as BMR

    class Stub:
        def __init__(self): self.calls = []
        def _get(self, *a, **k): self.calls.append(a); return {"data": []}
    stub = Stub()
    r = BMR.execute_broad_run(client=stub)   # real consumed approval + lock
    assert r["status"] in ("gate_failed", "execution_already_consumed")
    assert stub.calls == []


def test_proposed_enrichment_cost_capped(tmp_path):
    out = tmp_path / "processed"
    res = R.run_processing(output_dir=out)
    from decimal import Decimal
    from sourcing.money import parse_money
    n = len(res["proposed_enrichment"])
    assert n <= 30
    assert parse_money(json.loads((out / "proposed_profile_enrichment.json").read_text())["projected_cost_usd"]) <= Decimal("0.300")
