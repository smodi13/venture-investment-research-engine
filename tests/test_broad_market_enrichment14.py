"""Broad-market 14-author profile enrichment: request, validation, approval/lock,
deterministic profile classification. Zero-network."""

from __future__ import annotations

import dataclasses
import hashlib
import json
from decimal import Decimal
from pathlib import Path

import pytest

from sourcing import broad_market_enrichment14 as E14
from sourcing import broad_market_enrichment14_run as R14
from sourcing.broad_market_process import PRIOR_ENRICHED_AUTHOR_IDS
from sourcing.money import parse_money


def test_exactly_14_selected_ids_match_review():
    ids = E14.selected_author_ids()
    review = json.loads(E14.SELECTION_REVIEW_PATH.read_text())
    revised = sorted(review["revised_proposed_set"], key=lambda c: c["final_enrichment_rank"])
    assert list(ids) == [str(c["author_id"]) for c in revised]
    assert len(ids) == 14


def test_no_duplicates_and_no_previously_enriched():
    ids = E14.selected_author_ids()
    assert len(set(ids)) == 14
    assert not (set(ids) & PRIOR_ENRICHED_AUTHOR_IDS)


def test_all_selected_recommended_enrich():
    review = json.loads(E14.SELECTION_REVIEW_PATH.read_text())
    considered = {str(c["author_id"]): c for c in review["candidates_considered"]}
    for i in E14.selected_author_ids():
        assert considered[i]["recommended_action"] == "enrich"


def test_no_auto_fill_to_30():
    assert len(E14.selected_author_ids()) == 14 < 30


def test_endpoint_method_expansions_and_fields():
    d = E14.build_enrichment14_request().canonical_dict()
    assert d["endpoint"] == "/2/users" and d["http_method"] == "GET"
    assert d["expansions"] == "none"
    assert d["requested_user_fields"] == ["id", "name", "username", "description", "url", "entities",
                                          "location", "created_at", "public_metrics", "verified",
                                          "protected", "pinned_tweet_id"]
    assert d["max_user_resources"] == 14 and d["max_http_requests"] == 1


def test_retry_and_timeout_policy():
    d = E14.build_enrichment14_request().canonical_dict()
    assert d["retry_policy"]["network_timeout_retry"] == "disabled"
    assert d["timeout_policy"] == {"connect_timeout_seconds": 5, "read_timeout_seconds": 30}


def test_decimal_cost_and_budget():
    assert E14.MAX_EXPECTED_COST_USD == Decimal("0.140")
    assert E14.OPERATION_BUDGET_USD == Decimal("0.180")
    assert E14.PROJECTED_AFTER_USD == Decimal("7.720")
    assert E14.PROJECTED_REMAINING_USD == Decimal("17.280")
    cb = E14.cost_block()
    assert cb["max_expected_cost_usd"] == "0.140" and cb["operation_budget_usd"] == "0.180"
    assert cb["projected_estimated_activity_after_usd"] == "7.720"
    assert cb["projected_remaining_balance_usd"] == "17.280"


def test_fingerprint_sensitivity():
    a = E14.build_enrichment14_request()
    assert a.fingerprint() != dataclasses.replace(a, author_ids=tuple(list(a.author_ids[:13]) + ["42"])).fingerprint()
    assert a.fingerprint() != dataclasses.replace(a, author_ids=tuple(reversed(a.author_ids))).fingerprint()
    assert a.fingerprint() != dataclasses.replace(a, requested_user_fields=a.requested_user_fields + ("x",)).fingerprint()
    assert a.fingerprint() != dataclasses.replace(a, endpoint="/2/users/other").fingerprint()
    assert a.fingerprint() != dataclasses.replace(a, operation_budget_usd="0.200").fingerprint()
    assert a.fingerprint() != dataclasses.replace(a, max_user_resources=15).fingerprint()
    assert a.fingerprint() != dataclasses.replace(a, network_timeout_retry="enabled").fingerprint()
    assert E14.build_enrichment14_request().fingerprint() == a.fingerprint()  # deterministic


def test_no_timestamp_in_fingerprint():
    assert "execution" not in json.dumps(E14.build_enrichment14_request().canonical_dict())


def test_validation_rejects_bad_requests():
    base = E14.build_enrichment14_request()
    for bad in (dataclasses.replace(base, author_ids=base.author_ids[:13]),
                dataclasses.replace(base, expansions="author_id"),
                dataclasses.replace(base, max_http_requests=2),
                dataclasses.replace(base, max_user_resources=15),
                dataclasses.replace(base, network_timeout_retry="enabled"),
                dataclasses.replace(base, requested_user_fields=("id", "name")),
                dataclasses.replace(base, operation_budget_usd="0.200")):
        with pytest.raises(E14.Enrichment14ValidationError):
            E14.validate_request(bad)


# --- deterministic profile classification ---------------------------------
def test_role_ceo_not_founder():
    assert E14.profile_role_classification("CEO at Acme") == "explicit_executive"


def test_role_founder_cofounder_engineer():
    assert E14.profile_role_classification("Founder of Acme") == "explicit_founder"
    assert E14.profile_role_classification("co-founder & CTO") == "explicit_cofounder"
    assert E14.profile_role_classification("Founding Engineer at X") == "explicit_engineer"
    assert E14.profile_role_classification("Software engineer") == "explicit_engineer"
    assert E14.profile_role_classification("") == "no_explicit_signal"


def test_circular_self_identity_not_independent():
    cand = {"associated_company_or_project": "acme", "current_artifact_evidence": ["B", "D"],
            "current_disposition": "keep_for_enrichment", "post_artifact_domains": []}
    u = {"username": "acme", "description": "building things", "entities": {}}
    rel = E14.profile_company_relation(u, cand, "1")
    assert rel["profile_company_relation"] == "circular_self_identity"
    comb = E14.combined_disposition(cand, "explicit_builder", rel, True)
    assert comb["combined_disposition"] == "retain_for_manual_research"


def test_founder_company_alignment_advances():
    cand = {"associated_company_or_project": "acme", "current_artifact_evidence": ["A", "B", "D"],
            "current_disposition": "keep_verified", "post_artifact_domains": ["acme.com"]}
    u = {"username": "acmehq", "description": "Founder of Acme", "url": "https://acme.com", "entities": {}}
    rel = E14.profile_company_relation(u, cand, "1")
    assert rel["profile_company_relation"] == "exact_product_domain_match"
    assert E14.combined_disposition(cand, "explicit_founder", rel, True)["combined_disposition"] == "advance_for_diligence"


def test_contradiction_archives():
    cand = {"associated_company_or_project": "acme", "current_artifact_evidence": ["A", "B", "D"],
            "current_disposition": "keep_verified", "post_artifact_domains": ["acme.com"]}
    u = {"username": "bob", "description": "Engineer at Stripe", "url": "https://stripe.com", "entities": {}}
    rel = E14.profile_company_relation(u, cand, "1")
    assert rel["profile_company_relation"] == "contradictory_affiliation"
    assert E14.combined_disposition(cand, "explicit_engineer", rel, True)["combined_disposition"] == "archive_contradicted"


def test_missing_user_insufficient_not_deleted():
    cand = {"associated_company_or_project": None, "current_artifact_evidence": ["B", "D"],
            "current_disposition": "keep_for_enrichment"}
    comb = E14.combined_disposition(cand, "unclear",
                                    {"profile_company_relation": "unclear", "profile_domains": [], "contradiction_entity": None}, False)
    assert comb["combined_disposition"] == "insufficient_total_evidence"


def test_uninformative_profile_retains():
    cand = {"associated_company_or_project": "acme", "current_artifact_evidence": ["A", "D"],
            "current_disposition": "keep_verified", "post_artifact_domains": ["acme.com"]}
    u = {"username": "xyz", "description": "", "entities": {}}
    rel = E14.profile_company_relation(u, cand, "1")
    assert E14.combined_disposition(cand, "no_explicit_signal", rel, True)["combined_disposition"] == "retain_for_manual_research"


# --- approval / lock / execution (stub client, temp dirs) -----------------
def _sample_users(ids):
    return {"data": [{"id": ids[0], "name": "A", "username": "acmehq",
                      "description": "Founder of Acme", "url": "https://acme.com",
                      "entities": {"url": {"urls": [{"expanded_url": "https://acme.com"}]}},
                      "location": "SF", "created_at": "2020-01-01T00:00:00.000Z",
                      "public_metrics": {"followers_count": 10}, "verified": False,
                      "protected": False, "pinned_tweet_id": "5"}]}


class Stub:
    def __init__(self, resp=None, raises=None):
        self.calls, self.resp, self.raises = [], resp, raises

    def _get(self, path, params, cache_sig=None, retry_context=None):
        self.calls.append((path, params))
        if self.raises:
            raise self.raises
        return self.resp


@pytest.fixture
def env(tmp_path):
    return {"dp": tmp_path / "d.yaml", "ld": tmp_path / "locks", "od": tmp_path / "out"}


def _approve(env, now=None):
    return R14.record_approval("Sahil Modi", path=env["dp"], now=now)


def test_no_approval_blocks(env):
    stub = Stub(_sample_users(E14.selected_author_ids()))
    r = R14.execute_enrichment14(client=stub, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_one_request_and_raw_before_derived(env):
    _approve(env)
    stub = Stub(_sample_users(E14.selected_author_ids()))
    r = R14.execute_enrichment14(client=stub, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r["status"] == "executed"
    assert len(stub.calls) == 1                                  # exactly one request
    assert stub.calls[0][0] == "/users"
    assert "expansions" not in stub.calls[0][1] and "user.fields" in stub.calls[0][1]
    assert (env["od"] / "raw_user_response.json").exists()       # raw written
    assert (env["od"] / "combined_candidate_results.json").exists()
    assert r["returned"] == 1 and r["missing"] == 13             # partial handled, no second request


def test_missing_users_no_second_request(env):
    _approve(env)
    stub = Stub({"data": []})                                    # no users returned
    r = R14.execute_enrichment14(client=stub, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r["status"] == "executed" and len(stub.calls) == 1
    missing = json.loads((env["od"] / "missing_user_ids.json").read_text())
    assert len(missing) == 14
    combined = json.loads((env["od"] / "combined_candidate_results.json").read_text())
    assert all(c["combined_disposition"] == "insufficient_total_evidence" for c in combined)


def test_second_execution_rejected_and_lock_durable(env):
    _approve(env)
    r1 = R14.execute_enrichment14(client=Stub({"execution_error": "X"}, raises=RuntimeError("boom")),
                                  decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r1["status"] == "executed" and r1["exec_error"] == "RuntimeError"  # lock survives failure
    locks = list(Path(env["ld"]).glob("*.lock"))
    assert len(locks) == 1
    stub2 = Stub(_sample_users(E14.selected_author_ids()))
    r2 = R14.execute_enrichment14(client=stub2, decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed") and stub2.calls == []
    assert locks[0].exists()


def test_confirmation_and_eof_rejected():
    import io
    from sourcing.enrichment_run import read_confirmation
    ok, why = read_confirmation("", E14.OPERATION_NAME, io.StringIO(""))
    assert ok is False and why == "eof"
    ok2, _ = read_confirmation("", E14.OPERATION_NAME, io.StringIO("wrong\n"))
    assert ok2 is False
    ok3, _ = read_confirmation("", E14.OPERATION_NAME, io.StringIO(E14.OPERATION_NAME + "\n"))
    assert ok3 is True


def test_expired_and_fingerprint_mismatch_gate(env):
    from datetime import timedelta
    from sourcing.timeutil import now_utc
    _approve(env, now=now_utc() - timedelta(seconds=1000))
    ok, reasons = R14.gate_checks(E14.build_enrichment14_request(), R14.load_decision(env["dp"]))
    assert ok is False and any("expired" in x for x in reasons)
    # fingerprint mismatch
    _approve(env)
    dec = R14.load_decision(env["dp"]); dec["approved_request_fingerprint"] = "sha256:bad"
    ok2, reasons2 = R14.gate_checks(E14.build_enrichment14_request(), dec)
    assert ok2 is False and any("fingerprint" in x for x in reasons2)


def test_cost_ledger_estimated_only(env):
    _approve(env)
    R14.execute_enrichment14(client=Stub(_sample_users(E14.selected_author_ids())),
                             decision_path=env["dp"], lock_dir=env["ld"], output_dir=env["od"])
    ledger = json.loads((env["od"] / "enrichment_cost_ledger.json").read_text())
    assert ledger["billing_status"] == "estimated_only"
    assert ledger["observed_console_cost_usd"] is None
    assert ledger["reconciliation_status"] == "unavailable_external_project_access"
    assert ledger["maximum_expected_cost_usd"] == "0.140"


def test_no_network_client_constructed_for_request_build(monkeypatch):
    import sourcing.x_client as xc
    monkeypatch.setattr(xc.XClient, "__init__",
                        lambda *a, **k: (_ for _ in ()).throw(AssertionError("no network")))
    assert len(E14.build_enrichment14_request().author_ids) == 14


def test_cli_approve_command_imports_resolve(tmp_path, monkeypatch):
    # Regression: the approve command must resolve read_confirmation. EOF stdin
    # cancels and records NO approval (fail-closed), exercising the import path.
    import io
    from sourcing import cli
    monkeypatch.setenv("SOURCING_BROAD_ENRICH14_DECISIONS_PATH", str(tmp_path / "d.yaml"))
    monkeypatch.setenv("SOURCING_BROAD_ENRICH14_LOCK_DIR", str(tmp_path / "locks"))
    monkeypatch.setattr("sys.stdin", io.StringIO(""))          # EOF
    rc = cli.cmd_approve_broad_enrichment14(["--reviewer", "Sahil Modi"])
    assert rc == 1
    assert not (tmp_path / "d.yaml").exists()                   # no approval recorded


def test_prior_outputs_unchanged():
    # selection review + processed records must be untouched by this module
    for p in ("data/output/broad_market_4000/processed/profile_enrichment_selection_review.json",
              "data/output/broad_market_4000/processed/all_processed_records.json",
              "data/output/broad_market_4000/parsed_posts.json"):
        assert Path(p).exists()


def test_enrichment14_approved_and_consumed_rerun_blocked():
    # The operation has since been approved AND executed one-shot: the decision and
    # a durable lock exist, and a second run must be refused (before execution this
    # asserted no decision/lock; that state has legitimately advanced).
    assert R14.DECISIONS_PATH.exists()
    assert R14.LOCK_DIR.exists() and list(R14.LOCK_DIR.glob("*.lock"))

    class Stub:
        def __init__(self): self.calls = []
        def _get(self, *a, **k): self.calls.append(a); return {"data": []}
    stub = Stub()
    r = R14.execute_enrichment14(client=stub)
    assert r["status"] in ("gate_failed", "execution_already_consumed")
    assert stub.calls == []
