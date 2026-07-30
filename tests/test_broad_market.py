"""Broad-market 20-query preparation: config, canonical requests, validation,
projection, dedup, approval/lock/gates. Zero-network."""

from __future__ import annotations

import dataclasses
import json
from decimal import Decimal
from pathlib import Path

import pytest

from sourcing import broad_market as BM
from sourcing import broad_market_run as BMR


# --- config / queries ------------------------------------------------------
def test_exactly_twenty_queries_unique_sorted_ids():
    qs = BM.load_broad_queries()
    ids = [q["id"] for q in qs]
    assert len(qs) == 20
    assert len(set(ids)) == 20
    assert BM.broad_config_version() == 2


def test_all_queries_within_512_and_valid_operators():
    for r in BM.validate_query_lengths():
        assert r["char_count"] <= 512, r["query_id"]
        assert r["within_limit"] and r["valid"], (r["query_id"], r["errors"])


def test_required_broad_groups_present():
    groups = {q["broad_group"] for q in BM.load_broad_queries()}
    assert BM.REQUIRED_BROAD_GROUPS <= groups


def test_all_sector_labels_recognized():
    for q in BM.load_broad_queries():
        assert q["sector_bucket"] in BM.SECTOR_BUCKETS
        assert q["discovery_lane"]


# --- caps ------------------------------------------------------------------
def test_retrieval_caps_constants():
    assert BM.MAX_RESULTS_PER_REQUEST == 100
    assert BM.MAX_PAGES_PER_QUERY == 2
    assert BM.MAX_RESULTS_PER_QUERY == 200
    assert BM.MAX_QUERIES == 20
    assert BM.MAX_HTTP_REQUESTS == 40
    assert BM.MAX_TOTAL_POSTS == 4000
    assert BM.MAX_COUNT_REQUESTS == 20
    assert BM.MAX_FUTURE_PROFILES == 30


# --- Decimal projection ----------------------------------------------------
def test_projection_math_exact():
    assert BM.count_expected_cost() == Decimal("0.100")   # 20 * 0.005
    assert BM.post_expected_cost() == Decimal("20.000")   # 4000 * 0.005
    assert BM.future_enrichment_expected_cost() == Decimal("0.300")  # 30 * 0.010
    proj = BM.projection()
    assert proj["current_estimated_spend_usd"] == "1.085"
    assert proj["projected_total_activity_usd"] == "21.485"   # 1.085+0.100+20.000+0.300
    assert proj["total_allowance_usd"] == "25.000"
    assert proj["projected_credit_cushion_usd"] == "3.515"


def test_projection_never_uses_float():
    for v in BM.projection().values():
        assert isinstance(v, str)


# --- count canonical request ----------------------------------------------
def test_count_request_builds_and_validates():
    req = BM.build_count_request()
    d = req.canonical_dict()
    assert d["operation_name"] == BM.COUNT_OPERATION
    assert d["endpoint"] == BM.COUNTS_ENDPOINT and d["http_method"] == "GET"
    assert d["max_count_requests"] == 20
    assert req.fingerprint().startswith("sha256:")
    assert len(d["queries"]) == 20


def test_count_request_rejects_over_budget():
    bad = dataclasses.replace(BM.build_count_request(), max_count_cost_usd="0.200")
    with pytest.raises(BM.BroadMarketValidationError):
        BM.validate_count_request(bad)
    bad2 = dataclasses.replace(BM.build_count_request(), count_budget_usd="0.200")
    with pytest.raises(BM.BroadMarketValidationError):
        BM.validate_count_request(bad2)


# --- retrieval canonical request ------------------------------------------
def test_retrieval_request_builds_and_validates():
    req = BM.build_retrieval_request()
    d = req.canonical_dict()
    assert d["operation_name"] == BM.RUN_OPERATION
    assert d["endpoint"] == BM.SEARCH_ENDPOINT and d["http_method"] == "GET"
    assert d["expansions"] == "none" and d["user_fields"] == "none"
    assert d["sort_order"] == "recency"
    assert d["max_results_per_request"] == 100
    assert d["max_pages_per_query"] == 2
    assert d["max_total_posts"] == 4000
    assert d["max_http_requests"] == 40
    assert d["timeout_policy"]["connect_timeout_seconds"] == 5
    assert d["timeout_policy"]["read_timeout_seconds"] == 30
    assert d["timeout_policy"]["network_timeout_retry"] == "disabled"
    assert len(d["sector_buckets"]) == 20 and len(d["discovery_lanes"]) == 20
    assert req.fingerprint().startswith("sha256:")


def test_retrieval_request_fails_closed_on_cap_breaches():
    base = BM.build_retrieval_request()
    for bad in (
        dataclasses.replace(base, max_results_per_request=101),
        dataclasses.replace(base, max_pages_per_query=3),
        dataclasses.replace(base, max_results_per_query=201),
        dataclasses.replace(base, max_total_posts=4001),
        dataclasses.replace(base, max_http_requests=41),
        dataclasses.replace(base, expansions="author_id"),
        dataclasses.replace(base, user_fields="username"),
        dataclasses.replace(base, network_timeout_retry="enabled"),
        dataclasses.replace(base, max_expected_cost_usd="20.001"),
        dataclasses.replace(base, operation_budget_usd="20.501"),
    ):
        with pytest.raises(BM.BroadMarketValidationError):
            BM.validate_retrieval_request(bad)


def test_fingerprint_order_independent_and_change_sensitive():
    a = BM.build_retrieval_request()
    b = dataclasses.replace(a, sort_order="relevancy")
    assert a.fingerprint() != b.fingerprint()
    # deterministic across rebuilds
    assert BM.build_retrieval_request().fingerprint() == a.fingerprint()


def test_count_and_run_fingerprints_differ():
    assert BM.build_count_request().fingerprint() != BM.build_retrieval_request().fingerprint()


# --- cross-run dedup -------------------------------------------------------
def test_prior_post_ids_loads_from_canary_and_pilot():
    ids = BM.prior_post_ids()
    assert isinstance(ids, set)
    # canary q1 first page exists in prior runs
    assert len(ids) > 0


def test_dedup_against_prior_partitions_correctly():
    prior = next(iter(BM.prior_post_ids()))
    new = {
        "qA": [{"id": prior}, {"id": "NEW-1"}, {"id": "NEW-2"}],
        "qB": [{"id": "NEW-2"}, {"id": "NEW-3"}],   # NEW-2 is within-run dup
    }
    out = BM.dedup_against_prior(new)
    kept = {p["id"] for p in out["unique_new_posts"]}
    assert kept == {"NEW-1", "NEW-2", "NEW-3"}
    assert prior in out["cross_run_duplicates"]
    assert "NEW-2" in out["within_run_duplicates"]
    assert out["provenance"]["NEW-2"] == ["qA", "qB"]
    assert out["new_discovery_count"] == 3


# --- approval / lock / gate (stub client, temp dirs) ----------------------
class Stub:
    def __init__(self):
        self.calls = []

    def _get(self, path, params, cache_sig=None, retry_context=None):
        self.calls.append((path, params))
        if "counts" in path:
            return {"data": [{"tweet_count": 3}], "meta": {"total_tweet_count": 3}}
        return {"data": [{"id": f"x{len(self.calls)}"}], "meta": {}}


@pytest.fixture
def cenv(tmp_path):
    return {"dp": tmp_path / "cdec.yaml", "ld": tmp_path / "clocks", "od": tmp_path / "cout"}


@pytest.fixture
def renv(tmp_path):
    return {"dp": tmp_path / "rdec.yaml", "ld": tmp_path / "rlocks", "od": tmp_path / "rout"}


def _run_approval(env, recorder):
    rec = recorder(env["dp"])
    d = BMR.load_decision(env["dp"])
    d["decision"] = "run"                      # simulate human confirmation
    import yaml
    from sourcing.enrichment_run import _atomic_write
    _atomic_write(env["dp"], yaml.safe_dump({"decision": d}, sort_keys=True))
    return rec


def test_counts_blocked_without_approval(cenv):
    stub = Stub()
    r = BMR.execute_broad_counts(client=stub, decision_path=cenv["dp"],
                                 lock_dir=cenv["ld"], output_dir=cenv["od"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_counts_pending_review_default_blocks(cenv):
    BMR.record_count_approval("Sahil Modi", path=cenv["dp"])   # decision == pending_review
    stub = Stub()
    r = BMR.execute_broad_counts(client=stub, decision_path=cenv["dp"],
                                 lock_dir=cenv["ld"], output_dir=cenv["od"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_counts_one_shot_and_lock_durable(cenv):
    _run_approval(cenv, lambda p: BMR.record_count_approval("Sahil Modi", path=p))
    stub = Stub()
    r = BMR.execute_broad_counts(client=stub, decision_path=cenv["dp"],
                                 lock_dir=cenv["ld"], output_dir=cenv["od"])
    assert r["status"] == "executed"
    assert r["requests_made"] == 20 and len(stub.calls) == 20
    locks = list(Path(cenv["ld"]).glob("*.lock"))
    assert len(locks) == 1
    # second attempt consumes nothing
    stub2 = Stub()
    r2 = BMR.execute_broad_counts(client=stub2, decision_path=cenv["dp"],
                                  lock_dir=cenv["ld"], output_dir=cenv["od"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed")
    assert stub2.calls == [] and locks[0].exists()


def test_retrieval_respects_caps_and_no_expansions(renv):
    _run_approval(renv, lambda p: BMR.record_run_approval("Sahil Modi", path=p))
    stub = Stub()
    r = BMR.execute_broad_run(client=stub, decision_path=renv["dp"],
                              lock_dir=renv["ld"], output_dir=renv["od"])
    assert r["status"] == "executed"
    assert r["http_requests"] <= 40
    for _path, params in stub.calls:
        assert "expansions" not in params
        assert "user.fields" not in params
        assert params.get("sort_order") == "recency"
        assert params["max_results"] == 100


def test_retrieval_blocked_without_approval(renv):
    stub = Stub()
    r = BMR.execute_broad_run(client=stub, decision_path=renv["dp"],
                              lock_dir=renv["ld"], output_dir=renv["od"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_expired_approval_blocks(cenv):
    from datetime import timedelta
    from sourcing.timeutil import now_utc
    _run_approval(cenv, lambda p: BMR.record_count_approval("Sahil Modi", path=p))
    req = BM.build_count_request()
    ok, reasons = BMR.gate_checks(req, BMR.load_decision(cenv["dp"]),
                                  now=now_utc() + timedelta(seconds=1000))
    assert ok is False and any("expired" in x for x in reasons)


# --- prior artifacts untouched --------------------------------------------
def test_prior_outputs_and_fingerprints_untouched():
    assert Path("data/output/canary/raw_response.json").exists()
    assert Path("data/output/six_query_pilot/pilot_summary.json").exists()
    from sourcing.enrichment import build_enrichment_request
    from sourcing.enrichment_run import EXPECTED_FINGERPRINT
    assert build_enrichment_request().fingerprint() == EXPECTED_FINGERPRINT
    # original six-query config unchanged
    from sourcing.config import load_queries
    assert load_queries().get("config_version", 1) == 1


# ===========================================================================
# Corrected Tweet fields for the deterministic evidence pipeline
# ===========================================================================
OLD_RETRIEVAL_FP = "sha256:5f8114b957206995f80dd894b5b81b906ebefc5e7584fa6695b51e069b65aa1f"
COUNT_FP = "sha256:de8fa6f4c17744e5a050640fe1944271ec6ee9dfa63a1d41c5c5aa5854b64e66"
EXPECTED_TWEET_FIELDS = ["id", "created_at", "author_id", "lang",
                         "public_metrics", "entities", "referenced_tweets"]


def test_retrieval_requests_exactly_seven_tweet_fields_in_order():
    d = BM.build_retrieval_request().canonical_dict()
    assert d["tweet_fields"] == "id,created_at,author_id,lang,public_metrics,entities,referenced_tweets"
    assert d["tweet_fields"].split(",") == EXPECTED_TWEET_FIELDS


def test_retrieval_includes_each_required_field():
    fields = BM.build_retrieval_request().canonical_dict()["tweet_fields"].split(",")
    for f in ("id", "created_at", "author_id", "lang", "public_metrics",
              "entities", "referenced_tweets"):
        assert f in fields                                     # tests 1-7


def test_retrieval_includes_no_other_tweet_fields():             # test 8
    fields = BM.build_retrieval_request().canonical_dict()["tweet_fields"].split(",")
    forbidden = {"conversation_id", "attachments", "context_annotations", "geo",
                 "withheld", "edit_history_tweet_ids", "edit_controls", "note_tweet",
                 "source", "reply_settings", "in_reply_to_user_id", "possibly_sensitive"}
    assert not (set(fields) & forbidden)
    assert set(fields) == set(EXPECTED_TWEET_FIELDS)


def test_retrieval_has_no_expansions_or_user_fields():           # tests 9-10
    d = BM.build_retrieval_request().canonical_dict()
    assert d["expansions"] == "none"
    assert d["user_fields"] == "none"
    assert "expansions" not in d["tweet_fields"]
    assert "user.fields" not in d["tweet_fields"]


def test_entities_available_to_url_parser():                    # test 11
    from sourcing.x_client import parse_post
    from sourcing.urlutil import github_owner_repo
    raw = {"id": "1", "text": "we launched", "author_id": "9", "lang": "en",
           "entities": {"urls": [{"url": "https://t.co/x", "expanded_url": "https://github.com/acme/widget"}]}}
    p = parse_post(raw)
    assert p.url_details, "entities must reach the URL parser"
    joined = " ".join(p.expanded_urls) + " " + " ".join(d.get("expanded_url", "") for d in p.url_details)
    assert "github.com/acme/widget" in joined
    assert github_owner_repo("https://github.com/acme/widget") == "acme/widget"


def test_referenced_tweets_available_to_attribution():          # test 12
    from sourcing.x_client import parse_post
    rt = parse_post({"id": "1", "text": "x", "author_id": "9",
                     "referenced_tweets": [{"type": "retweeted", "id": "77"}]})
    rp = parse_post({"id": "2", "text": "x", "author_id": "9",
                     "referenced_tweets": [{"type": "replied_to", "id": "88"}]})
    own = parse_post({"id": "3", "text": "we built it", "author_id": "9",
                      "referenced_tweets": []})
    assert rt.is_retweet and not rt.is_reply       # third-party repost flagged
    assert rp.is_reply and not rp.is_retweet
    assert not own.is_retweet and not own.is_reply  # direct claim not misread


def test_lang_preserved_in_parsed_records():                    # test 13
    from sourcing.x_client import parse_post
    assert parse_post({"id": "1", "text": "x", "author_id": "9", "lang": "en"}).lang == "en"
    assert parse_post({"id": "2", "text": "x", "author_id": "9", "lang": "de"}).lang == "de"


def test_public_metrics_do_not_determine_disposition():         # test 14
    from sourcing.x_client import parse_post
    base = {"id": "1", "text": "we launched Adaptive", "author_id": "9", "lang": "en",
            "entities": {"urls": [{"url": "https://t.co/x", "expanded_url": "https://github.com/acme/widget"}]},
            "referenced_tweets": []}
    lo = parse_post({**base, "public_metrics": {"like_count": 0, "retweet_count": 0, "reply_count": 0, "quote_count": 0}})
    hi = parse_post({**base, "public_metrics": {"like_count": 9999, "retweet_count": 5000, "reply_count": 4000, "quote_count": 3000}})
    # Disposition-relevant, deterministic inputs are identical regardless of metrics.
    assert lo.url_details == hi.url_details
    assert lo.expanded_urls == hi.expanded_urls
    assert (lo.is_retweet, lo.is_reply, lo.text) == (hi.is_retweet, hi.is_reply, hi.text)
    # Metrics themselves are preserved for audit only.
    assert hi.engagement_raw > lo.engagement_raw == 0


def test_changing_tweet_fields_changes_fingerprint():           # test 15
    a = BM.build_retrieval_request()
    b = dataclasses.replace(a, tweet_fields="id,created_at,author_id,public_metrics")
    assert a.fingerprint() != b.fingerprint()


def test_old_retrieval_fingerprint_no_longer_active():          # test 16
    assert BM.build_retrieval_request().fingerprint() != OLD_RETRIEVAL_FP


def test_count_fingerprint_unchanged():                         # test 17
    assert BM.build_count_request().fingerprint() == COUNT_FP


def test_saved_count_outputs_unchanged():                       # test 18
    metrics = json.loads(Path("data/output/broad_market_4000/count_preflight/count_metrics.json").read_text())
    ledger = json.loads(Path("data/output/broad_market_4000/count_preflight/count_cost_ledger.json").read_text())
    assert len(metrics) == 20
    assert sum(r["total_recent_count"] for r in metrics) == 1486
    assert ledger["requests_made"] == 20 and ledger["estimated_cost_usd"] == "0.100"


def test_prior_canary_pilot_enrichment_untouched():             # tests 19-21
    assert Path("data/output/canary/raw_response.json").exists()
    assert Path("data/output/six_query_pilot/pilot_summary.json").exists()
    assert Path("data/output/targeted_enrichment/raw_user_response.json").exists()
    assert Path("data/output/pilot_shortlist_enrichment/raw_user_response.json").exists()


def test_approval_and_execution_remain_separate(renv):          # test 23
    # Recording an approval never triggers a network call; execution is a
    # distinct, separately-gated step.
    BMR.record_run_approval("Sahil Modi", path=renv["dp"])      # decision == pending_review
    stub = Stub()
    r = BMR.execute_broad_run(client=stub, decision_path=renv["dp"],
                              lock_dir=renv["ld"], output_dir=renv["od"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_retrieval_approval_consumed_and_rerun_blocked():       # test 24 (post-execution)
    # The broad retrieval has since been approved AND executed: a durable lock
    # exists and a second run must be refused (one-shot). Before execution this
    # asserted "pending"; that state has legitimately advanced.
    lock_dir = BMR.RUN_LOCK_DIR
    assert lock_dir.exists() and list(lock_dir.glob("*.lock")), "expected a consumed execution lock"

    class Stub:
        def __init__(self): self.calls = []
        def _get(self, *a, **k): self.calls.append(a); return {"data": []}
    stub = Stub()
    r = BMR.execute_broad_run(client=stub)
    assert r["status"] in ("gate_failed", "execution_already_consumed")
    assert stub.calls == []


def test_retrieval_second_execution_prohibited(renv):           # test 25
    _run_approval(renv, lambda p: BMR.record_run_approval("Sahil Modi", path=p))
    r1 = BMR.execute_broad_run(client=Stub(), decision_path=renv["dp"],
                               lock_dir=renv["ld"], output_dir=renv["od"])
    assert r1["status"] == "executed"
    stub2 = Stub()
    r2 = BMR.execute_broad_run(client=stub2, decision_path=renv["dp"],
                               lock_dir=renv["ld"], output_dir=renv["od"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed")
    assert stub2.calls == []


def test_approval_banner_url_has_no_duplicated_slash_2():        # tests 26-27
    from sourcing.cli import _resolved_url
    url = _resolved_url(BM.SEARCH_ENDPOINT)
    assert url == "https://api.x.com/2/tweets/search/recent"
    assert "/2/2/" not in url
    assert BM.SEARCH_ENDPOINT == "/2/tweets/search/recent"
    assert _resolved_url(BM.COUNTS_ENDPOINT) == "https://api.x.com/2/tweets/counts/recent"


def test_count_snapshot_review_is_not_in_fingerprint():
    review = BM.load_count_snapshot_review()
    assert review is not None
    assert review["total_aggregate_7d_count"] == 1486
    assert review["expected_resources_after_200_cap"] == 1381
    assert review["expected_post_cost_usd"] == "6.905"
    assert review["max_authorized_posts"] == 4000
    assert review["max_authorized_post_cost_usd"] == "20.000"
    assert [q["query_id"] for q in review["queries_over_cap"]] == ["q14_robotics_and_drones"]
    assert review["queries_over_cap"][0]["omitted_estimate"] == 105
    # review metadata must never enter the canonical request / fingerprint
    assert "total_aggregate_7d_count" not in json.dumps(BM.build_retrieval_request().canonical_dict())
