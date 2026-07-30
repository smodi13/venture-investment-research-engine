"""Enrichment approval store, exclusive execution lock, and one-shot execution.

All zero-network: the network client is stubbed; locks/decisions use tmp dirs."""

from __future__ import annotations

import io
import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

from sourcing import enrichment_run as R
from sourcing.enrichment import build_enrichment_request
from sourcing.enrichment_run import (
    CONFIRMATION_VALUE,
    EXPECTED_FINGERPRINT,
    execute_enrichment,
    gate_checks,
    lock_identity_filename,
    read_confirmation,
    record_enrichment_approval,
)

USERS_RESPONSE = {
    "data": [
        {"id": "2063311066294054912", "name": "N", "username": "nrkoka786",
         "description": "Founder, building Synapse",
         "entities": {"url": {"urls": [{"url": "https://t.co/x", "expanded_url": "https://github.com/nrkoka786/synapse"}]}}},
        {"id": "2061874923639836672", "name": "Neu", "username": "NeurainX",
         "description": "We launched Comfy MCP", "entities": {}},
    ],
    "errors": [{"title": "Not Found", "resource_id": "15963134"}],
}


class StubClient:
    def __init__(self, response=None, raises=None, lock_dir=None):
        self.response, self.raises, self.lock_dir = response, raises, lock_dir
        self.calls = []
        self.last_response_meta = {"http_status": 200}
        self.lock_content_at_call = None

    def _get(self, path, params, cache_sig=None, retry_context=None):
        self.calls.append({"path": path, "params": params})
        if self.lock_dir:  # capture lock file state at network time (ordering proof)
            files = list(Path(self.lock_dir).glob("*.lock"))
            self.lock_content_at_call = files[0].read_text() if files else ""
        if self.raises:
            raise self.raises
        return self.response


@pytest.fixture
def env(tmp_path):
    return {"decision_path": tmp_path / "enrichment_decisions.yaml",
            "lock_dir": tmp_path / "locks", "output_dir": tmp_path / "out"}


def _approve(env, now=None):
    return record_enrichment_approval("Sahil Modi", path=env["decision_path"], now=now)


# --- confirmation input helper --------------------------------------------
def test_correct_confirmation_accepted():
    ok, _ = read_confirmation("", CONFIRMATION_VALUE, io.StringIO(CONFIRMATION_VALUE + "\n"), is_tty=False)
    assert ok is True


def test_trailing_newline_and_whitespace_normalized():
    assert read_confirmation("", CONFIRMATION_VALUE, io.StringIO("  " + CONFIRMATION_VALUE + "  \n"), is_tty=False)[0]


def test_eof_empty_whitespace_wrong_and_extra_rejected():
    assert read_confirmation("", CONFIRMATION_VALUE, io.StringIO(""), is_tty=False) == (False, "eof")
    assert read_confirmation("", CONFIRMATION_VALUE, io.StringIO("\n"), is_tty=False)[0] is False
    assert read_confirmation("", CONFIRMATION_VALUE, io.StringIO("   \n"), is_tty=False)[0] is False
    assert read_confirmation("", CONFIRMATION_VALUE, io.StringIO("wrong\n"), is_tty=False) == (False, "mismatch")
    # multiple non-whitespace lines
    assert read_confirmation("", CONFIRMATION_VALUE, io.StringIO(CONFIRMATION_VALUE + "\nextra\n"), is_tty=False) == (False, "extra_input")


def test_input_exception_cannot_approve():
    class Boom:
        def isatty(self): return False
        def readline(self): raise OSError("unreadable")
    assert read_confirmation("", CONFIRMATION_VALUE, Boom())[0] is False


# --- approval record -------------------------------------------------------
def test_approval_written_atomically_with_unique_id(env):
    a = _approve(env)
    assert env["decision_path"].exists()
    assert a["approval_consumed"] is False
    assert a["approved_request_fingerprint"] == EXPECTED_FINGERPRINT
    b = record_enrichment_approval("Sahil Modi", path=env["decision_path"])
    assert a["approval_record_id"] != b["approval_record_id"]  # new id each time


def test_gate_rejects_expired_and_mismatch(env):
    from sourcing.timeutil import now_utc
    from datetime import timedelta
    old = _approve(env, now=now_utc() - timedelta(seconds=1000))  # expired
    req = build_enrichment_request()
    ok, reasons = gate_checks(req, R.load_enrichment_decision(env["decision_path"]))
    assert ok is False and any("expired" in r for r in reasons)
    # fingerprint mismatch
    d = R.load_enrichment_decision(env["decision_path"])
    d["approved_request_fingerprint"] = "sha256:deadbeef"
    ok2, reasons2 = gate_checks(req, d)
    assert ok2 is False and any("fingerprint mismatch" in r for r in reasons2)


def test_gate_rejects_changed_authors_fields_endpoint_budget(env):
    _approve(env)
    req = build_enrichment_request()
    for mutate in (
        lambda d: d.update({"author_ids": ["1", "2", "3"]}),
        lambda d: d.update({"requested_user_fields": ["id"]}),
        lambda d: d.update({"endpoint": "/2/tweets"}),
        lambda d: d.update({"http_method": "POST"}),
        lambda d: d.update({"max_http_requests": 2}),
        lambda d: d.update({"expected_max_cost_usd": "0.031"}),
        lambda d: d.update({"global_enrichment_budget_usd": "0.041"}),
    ):
        d = R.load_enrichment_decision(env["decision_path"])
        mutate(d)
        assert gate_checks(req, d)[0] is False


# --- execution lock --------------------------------------------------------
def test_lock_is_os_open_exclusive_and_blocks_second(env):
    _approve(env)
    r1 = execute_enrichment(client=StubClient(USERS_RESPONSE), decision_path=env["decision_path"],
                            lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r1["status"] == "executed"
    lock_files = list(env["lock_dir"].glob("*.lock"))
    assert len(lock_files) == 1
    # second attempt with the SAME approval -> BLOCKED (gate sees consumed via the
    # mirrored YAML; if the mirror had failed, the lock's FileExistsError blocks it).
    stub2 = StubClient(USERS_RESPONSE)
    r2 = execute_enrichment(client=stub2, decision_path=env["decision_path"],
                            lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed")
    assert stub2.calls == []                       # network NOT invoked
    assert lock_files[0].exists()                  # lock not deleted


def test_stub_invoked_exactly_once_and_after_lock_metadata(env):
    _approve(env)
    stub = StubClient(USERS_RESPONSE, lock_dir=env["lock_dir"])
    execute_enrichment(client=stub, decision_path=env["decision_path"],
                       lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert len(stub.calls) == 1
    # lock metadata was present (flushed+fsynced) BEFORE the network call
    assert stub.lock_content_at_call and json.loads(stub.lock_content_at_call)["approval_consumed"] is True


def test_failed_http_leaves_approval_consumed_no_retry(env):
    from sourcing.x_client import XAPIError
    _approve(env)
    stub = StubClient(raises=XAPIError("boom"))
    r = execute_enrichment(client=stub, decision_path=env["decision_path"],
                           lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r["status"] == "executed" and r["exec_error"] == "XAPIError"
    assert len(stub.calls) == 1                     # no auto retry
    assert list(env["lock_dir"].glob("*.lock"))     # lock persists (approval consumed)
    d = R.load_enrichment_decision(env["decision_path"])
    assert d["approval_consumed"] is True
    # re-run blocked (consumed) and no network invoked
    stub2 = StubClient(USERS_RESPONSE)
    r2 = execute_enrichment(client=stub2, decision_path=env["decision_path"],
                            lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r2["status"] in ("gate_failed", "execution_already_consumed")
    assert stub2.calls == []


def test_empty_and_malformed_lock_still_block(env):
    _approve(env)
    d = R.load_enrichment_decision(env["decision_path"])
    fp = build_enrichment_request().fingerprint()
    fname = lock_identity_filename(R.OPERATION_NAME, fp, d["approval_record_id"], d["approved_at_utc"])
    env["lock_dir"].mkdir(parents=True, exist_ok=True)
    (env["lock_dir"] / fname).write_text("")       # empty lock
    stub = StubClient(USERS_RESPONSE)
    r = execute_enrichment(client=stub, decision_path=env["decision_path"],
                           lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r["status"] == "execution_already_consumed"
    assert r["lock_metadata"] == "lock_metadata_unavailable"
    assert stub.calls == []


def test_new_approval_id_distinct_lock(env):
    a = _approve(env)
    fp = build_enrichment_request().fingerprint()
    f1 = lock_identity_filename(R.OPERATION_NAME, fp, a["approval_record_id"], a["approved_at_utc"])
    b = record_enrichment_approval("Sahil Modi", path=env["decision_path"])
    f2 = lock_identity_filename(R.OPERATION_NAME, fp, b["approval_record_id"], b["approved_at_utc"])
    assert f1 != f2                                 # distinct lock even with same fingerprint


def test_lock_not_derived_from_fingerprint_alone():
    fp = build_enrichment_request().fingerprint()
    a = lock_identity_filename(R.OPERATION_NAME, fp, "id-A", "2026-07-19T00:00:00Z")
    b = lock_identity_filename(R.OPERATION_NAME, fp, "id-B", "2026-07-19T00:00:00Z")
    assert a != b


# --- gate blocks with no approval -----------------------------------------
def test_no_approval_blocks_execution(env):
    stub = StubClient(USERS_RESPONSE)
    r = execute_enrichment(client=stub, decision_path=env["decision_path"],
                           lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    assert r["status"] == "gate_failed"
    assert stub.calls == []


# --- outputs / partial / security -----------------------------------------
def test_outputs_raw_first_partial_handled_and_no_secrets(env):
    _approve(env)
    execute_enrichment(client=StubClient(USERS_RESPONSE), decision_path=env["decision_path"],
                       lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    out = env["output_dir"]
    for name in ("raw_user_response", "parsed_user_response", "enrichment_manifest",
                 "enrichment_cost_ledger", "enrichment_audit", "enrichment_candidate_report",
                 "sanitized_user_fixture"):
        assert (out / f"{name}.json").exists()
    parsed = json.loads((out / "parsed_user_response.json").read_text())
    ids = {r["author_id"]: r for r in parsed}
    assert ids["15963134"]["missing"] is True and ids["15963134"]["returned"] is False
    assert ids["2063311066294054912"]["returned"] is True
    ledger = json.loads((out / "enrichment_cost_ledger.json").read_text())
    assert ledger["billing_status"] == "estimated_only"
    assert ledger["observed_console_cost_usd"] is None
    assert ledger["reconciliation_status"] == "unavailable_external_project_access"
    # no secrets in any output
    blob = " ".join((out / f"{n}.json").read_text().lower() for n in ("raw_user_response", "enrichment_manifest"))
    assert "bearer" not in blob and "authorization" not in blob


def test_canary_outputs_untouched(env):
    canary = Path("data/output/canary/raw_response.json")
    before = canary.stat().st_mtime if canary.exists() else None
    _approve(env)
    execute_enrichment(client=StubClient(USERS_RESPONSE), decision_path=env["decision_path"],
                       lock_dir=env["lock_dir"], output_dir=env["output_dir"])
    if before is not None:
        assert canary.stat().st_mtime == before     # canary raw unchanged


# --- subprocess: interactive vs piped confirmation ------------------------
def _run_approve(tmp_path, stdin_bytes):
    env = dict(os.environ)
    env["PYTHONPATH"] = "src"
    env["SOURCING_ENRICHMENT_DECISIONS_PATH"] = str(tmp_path / "dec.yaml")
    return subprocess.run(
        [sys.executable, "-m", "sourcing.cli", "approve-enrichment", "--reviewer", "Sahil Modi"],
        input=stdin_bytes, env=env, capture_output=True, cwd=os.getcwd(),
    )


def test_subprocess_piped_confirmation_accepted(tmp_path):
    r = _run_approve(tmp_path, (CONFIRMATION_VALUE + "\n").encode())
    assert r.returncode == 0
    assert (tmp_path / "dec.yaml").exists()


def test_subprocess_empty_and_wrong_and_multiline_rejected(tmp_path):
    assert _run_approve(tmp_path, b"").returncode == 1
    assert not (tmp_path / "dec.yaml").exists()
    assert _run_approve(tmp_path, b"nope\n").returncode == 1
    assert _run_approve(tmp_path, (CONFIRMATION_VALUE + "\nextra\n").encode()).returncode == 1
    assert not (tmp_path / "dec.yaml").exists()
