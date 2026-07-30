"""Pilot approval store, exclusive lock, one-shot 6-request execution. Zero-network."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from sourcing import pilot_run as PR
from sourcing.pilot import build_pilot_request
from sourcing.pilot_run import execute_pilot, gate_checks, record_pilot_approval


def _search_response(ids):
    return {"data": [{"id": i, "text": "just launched AI agent runtime https://github.com/acme/agent",
                      "author_id": f"u{i}", "entities": {"urls": []},
                      "created_at": "2026-07-19T00:00:00.000Z", "public_metrics": {}} for i in ids]}


class StubClient:
    def __init__(self, per_query=2, raises=None):
        self.calls, self.raises, self.per_query = [], raises, per_query
        self.last_response_meta = {"http_status": 200}
        self._n = 0

    def _get(self, path, params, cache_sig=None, retry_context=None):
        self.calls.append(params)
        if self.raises:
            raise self.raises
        base = self._n * 100
        self._n += 1
        return _search_response([str(base + k) for k in range(self.per_query)])


@pytest.fixture
def env(tmp_path):
    return {"decision_path": tmp_path / "pilot_decisions.yaml",
            "lock_dir": tmp_path / "locks", "output_dir": tmp_path / "out"}


def _approve(env, now=None):
    return record_pilot_approval("Sahil Modi", path=env["decision_path"], now=now)


def test_no_approval_blocks(env):
    stub = StubClient()
    r = execute_pilot(client=stub, decision_path=env["decision_path"],
                      lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r["status"] == "gate_failed" and stub.calls == []


def test_expired_and_mismatch_gate(env):
    from datetime import timedelta
    from sourcing.timeutil import now_utc
    _approve(env, now=now_utc() - timedelta(seconds=1000))
    req = build_pilot_request()
    ok, reasons = gate_checks(req, PR.load_pilot_decision(env["decision_path"]))
    assert ok is False and any("expired" in x for x in reasons)


def test_execute_makes_six_requests_dedups_and_writes_outputs(env):
    _approve(env)
    stub = StubClient(per_query=2)
    r = execute_pilot(client=stub, decision_path=env["decision_path"],
                      lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r["status"] == "executed"
    assert len(stub.calls) == 6                    # exactly one request per query
    # no expansions / user.fields / pagination in any request
    for params in stub.calls:
        assert "expansions" not in params and "user.fields" not in params
        assert params["max_results"] <= 50 and params["sort_order"] == "recency"
    out = env["output_dir"]
    for name in ("parsed_posts", "pilot_query_metrics", "pilot_summary", "pilot_cost_ledger",
                 "pilot_dedup_audit", "pilot_manifest"):
        assert (out / f"{name}.json").exists()
    assert (out / "raw_responses_by_query").is_dir()
    ledger = json.loads((out / "pilot_cost_ledger.json").read_text())
    assert ledger["billing_status"] == "estimated_only" and ledger["observed_console_cost_usd"] is None


def test_second_execution_blocked_and_lock_durable(env):
    _approve(env)
    execute_pilot(client=StubClient(), decision_path=env["decision_path"],
                  lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    locks = list(env["lock_dir"].glob("*.lock"))
    assert len(locks) == 1
    stub2 = StubClient()
    r2 = execute_pilot(client=stub2, decision_path=env["decision_path"],
                       lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed")
    assert stub2.calls == [] and locks[0].exists()   # no network, lock not deleted


def test_failed_request_no_retry_leaves_approval_consumed(env):
    from sourcing.x_client import XAPIError
    _approve(env)
    stub = StubClient(raises=XAPIError("boom"))
    r = execute_pilot(client=stub, decision_path=env["decision_path"],
                      lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    # one _get attempt per query, no auto-retry; still 6 attempts (one each), all raise
    assert len(stub.calls) == 6
    d = PR.load_pilot_decision(env["decision_path"])
    assert d["approval_consumed"] is True


def test_approval_and_execution_separate(env):
    # recording approval performs NO network / execution
    rec = _approve(env)
    assert rec["approval_consumed"] is False
    assert not list((env["lock_dir"]).glob("*.lock")) if env["lock_dir"].exists() else True
