"""Command-line entry point + cost controls + approval control.

Subcommands:
    (default / no subcommand)  -> estimate + run the pipeline
    approve-query              -> review & record a per-query approval decision

Usage:
    python -m sourcing.cli --dry-run
    python -m sourcing.cli --max-posts 200 --query-group A
    python -m sourcing.cli approve-query --query-id q2_artifact_devtools \
        --decision run --reviewer "Sahil Modi" --note "looks reasonable"

``--dry-run`` estimates API usage, validates queries, and shows approval status;
it makes NO network calls. A live search is fail-closed: each query must have a
matching ``run`` approval (fingerprint) or it is skipped.
"""

from __future__ import annotations

import argparse
import logging
import sys

from .cache import Cache
from .config import (
    CACHE_PATH,
    ConfigError,
    Secrets,
    credential_status_lines,
    load_secrets,
)
from .pipeline import (
    FROZEN_MAX_POSTS,
    FROZEN_MAX_USERS,
    FROZEN_REVIEW_TOP,
    RunConfig,
    build_query_specs,
    estimate_usage,
    format_estimate,
    run_pipeline,
)


# ---------------------------------------------------------------------------
# Parsers
# ---------------------------------------------------------------------------
def build_run_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="headline-sourcing",
        description="Lightweight X-API sourcing engine for Headline's AI Infra & Software seat.",
    )
    p.add_argument("--max-posts", type=int, default=FROZEN_MAX_POSTS,
                   help=f"Max initial posts total (frozen cap {FROZEN_MAX_POSTS}).")
    p.add_argument("--max-users", type=int, default=FROZEN_MAX_USERS,
                   help=f"Max profile enrichments (frozen cap {FROZEN_MAX_USERS}).")
    p.add_argument("--max-timelines", type=int, default=FROZEN_REVIEW_TOP,
                   help="Max shortlisted timelines to fetch.")
    p.add_argument("--posts-per-timeline", type=int, default=10,
                   help="Posts to pull per shortlisted timeline.")
    p.add_argument("--page-size", type=int, default=100,
                   help="Results requested per search page (10-100). Part of the "
                        "approved_request_fingerprint.")
    p.add_argument("--budget-limit", type=int, default=0,
                   help="Max estimated posts read before confirmation is required "
                        "(0 = no explicit limit).")
    p.add_argument("--op-budget-limit", type=int, default=0,
                   help="Operation-level cap: max posts a single query may read "
                        "(0 = unset).")
    p.add_argument("--acknowledge-stale-pricing", action="store_true",
                   help="Acknowledge stale pricing so the gate does not fail closed on it.")
    p.add_argument("--dry-run", action="store_true",
                   help="Estimate + validate + show approval status; make NO network calls.")
    p.add_argument("--query-group", choices=["A", "B", "C"], default=None,
                   help="Restrict to one role-topic group (A/B/C).")
    p.add_argument("--output-limit", type=int, default=FROZEN_REVIEW_TOP,
                   help="Number of top leads to report in detail.")
    p.add_argument("--paginate", action="store_true",
                   help="Enable search pagination (off by default). Part of the fingerprint.")
    p.add_argument("--llm", action="store_true",
                   help="Enable optional LLM analysis of the top candidates.")
    p.add_argument("--no-enrich", action="store_true",
                   help="Skip external enrichment of the top 5.")
    p.add_argument("--yes", action="store_true",
                   help="Skip the interactive budget confirmation.")
    p.add_argument("--verbose", "-v", action="store_true", help="Verbose logging.")
    return p


def build_approve_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="headline-sourcing approve-query",
        description="Review and record a per-query approval decision.",
    )
    p.add_argument("--query-id", required=True, help="Query id from config/queries.yaml.")
    p.add_argument("--decision", required=True, choices=["run", "revise", "disable"],
                   help="run: approve for execution; revise/disable: no runnable fingerprint.")
    p.add_argument("--reviewer", required=True, help="Human reviewer name.")
    p.add_argument("--note", default="", help="Free-text review note.")
    # These affect the canonical request (and thus the fingerprint); they must
    # match the intended run configuration.
    p.add_argument("--page-size", type=int, default=100,
                   help="Page size the approved run will use (10-100).")
    p.add_argument("--paginate", action="store_true",
                   help="Whether the approved run will paginate.")
    p.add_argument("--with-counts", action="store_true",
                   help="Probe the recent-counts endpoint for a volume assessment "
                        "(makes ONE X API call).")
    p.add_argument("--verbose", "-v", action="store_true", help="Verbose logging.")
    return p


def _config_from_args(args: argparse.Namespace) -> RunConfig:
    return RunConfig(
        max_posts=args.max_posts,
        max_users=args.max_users,
        max_timelines=args.max_timelines,
        posts_per_timeline=args.posts_per_timeline,
        page_size=args.page_size,
        budget_limit=args.budget_limit,
        op_budget_limit=args.op_budget_limit,
        acknowledge_stale_pricing=args.acknowledge_stale_pricing,
        dry_run=args.dry_run,
        query_group=args.query_group,
        output_limit=args.output_limit,
        paginate=args.paginate,
        use_llm=args.llm,
        enrich=not args.no_enrich,
    ).clamp()


# ---------------------------------------------------------------------------
# approve-query command
# ---------------------------------------------------------------------------
def cmd_approve_query(argv: list[str]) -> int:
    args = build_approve_parser().parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
    )
    from .approval import (
        QueryDecision,
        build_canary_request,
        now_utc_iso,
        record_decision,
        validate_canary_canonical_request,
    )
    from .analysis import volume_assessment
    from .config import load_queries
    from .pricing import is_pricing_stale, pricing_age_days

    config_version = load_queries().get("config_version", 1)
    spec = next((s for s in build_query_specs(None) if s.id == args.query_id), None)
    if spec is None:
        print(f"ERROR: unknown query-id '{args.query_id}'. Known ids: "
              + ", ".join(s.id for s in build_query_specs(None)), file=sys.stderr)
        return 2

    # revise / disable: record without a runnable fingerprint.
    if args.decision in ("revise", "disable"):
        rec = QueryDecision(
            query_id=spec.id,
            decision=args.decision,
            reviewer=args.reviewer,
            note=args.note,
            reviewed_at_utc=now_utc_iso(),
            approved_request_fingerprint=None,
            query_config_version=str(config_version),
        )
        record_decision(rec)
        print(f"Recorded decision '{args.decision}' for {spec.id} (no runnable fingerprint).")
        return 0

    # decision == run  -> the schema-v2 CANARY canonical request.
    cfg = RunConfig(page_size=args.page_size, paginate=args.paginate).clamp()
    req = build_canary_request(spec, cfg, config_version)
    validate_canary_canonical_request(req.canonical_dict())  # fail closed at the gate
    fingerprint = req.fingerprint()

    # 1. Display the complete literal query and full canonical request config.
    print("=" * 70)
    print(f"APPROVAL REVIEW — query id: {spec.id}")
    print(f"  lane: {spec.lane}   topics: {'+'.join(spec.topics)}")
    print("\n  Full literal query:")
    print(f"    {req.query}")
    print("\n" + req.describe())

    # 2. Current count / volume assessment when available.
    if args.with_counts:
        try:
            secrets = load_secrets(require_x=True)
            with Cache(CACHE_PATH) as cache:
                from .x_client import XClient

                client = XClient(secrets, cache)
                count = client.count_recent(req.query)
            print(f"\n  Volume assessment: {volume_assessment(count)}")
        except (ConfigError, Exception) as exc:  # noqa: BLE001
            print(f"\n  Volume assessment: unavailable ({exc})")
    else:
        print("\n  Volume assessment: not probed (pass --with-counts for a counts probe).")

    # Pricing staleness note.
    age = pricing_age_days()
    stale = is_pricing_stale()
    print(f"  Pricing reference age: {age if age is not None else 'unknown'} day(s)"
          f" — {'STALE (run will need --acknowledge-stale-pricing)' if stale else 'current'}.")

    # Execution-safety preview: separate connect/read timeouts, no timeout retry,
    # and the approval TTL.
    from .approval import APPROVAL_TTL_SECONDS
    from .x_client import load_http_timeouts

    ht = load_http_timeouts()
    print(f"  HTTP connect timeout: {int(ht.connect_seconds)} seconds")
    print(f"  HTTP read timeout: {int(ht.read_seconds)} seconds")
    print("  automatic retry after network timeout: disabled")
    print(f"  approval TTL: {APPROVAL_TTL_SECONDS} seconds "
          "(re-checked immediately before the initial request and before any retry)")

    # Pricing + budget (exact decimal).
    from . import ledger
    from .money import money_str

    est = ledger.canary_estimated_post_cost(10)
    print(f"  post_read_usd: {money_str(ledger.post_read_cost())}")
    print(f"  estimated maximum Post cost: {money_str(est)}")
    print(f"  global budget: {money_str(ledger.canary_budget())}")
    print(f"  remaining budget: {money_str(ledger.canary_remaining_budget(est))}")
    print(f"\n  current fingerprint: {fingerprint}")

    # 3. Require explicit typed confirmation.
    print("\n" + "=" * 70)
    prompt = (
        f"Type the query id '{spec.id}' EXACTLY to approve this exact request "
        f"(anything else cancels): "
    )
    try:
        typed = input(prompt).strip()
    except EOFError:
        typed = ""
    if typed != spec.id:
        print("Cancelled — no decision recorded.")
        return 1

    # 4. Fingerprint already computed above (reviewer never types a hash).
    # 5. Write atomically (with the 15-minute approval TTL).
    from .approval import compute_ttl

    approved_at, expires_at = compute_ttl()
    rec = QueryDecision(
        query_id=spec.id,
        decision="run",
        reviewer=args.reviewer,
        note=args.note,
        reviewed_at_utc=approved_at,
        approved_request_fingerprint=fingerprint,
        query_config_version=str(config_version),
        approved_at_utc=approved_at,
        expires_at_utc=expires_at,
    )
    record_decision(rec)
    print(f"\nAPPROVED {spec.id}")
    print(f"  approved_request_fingerprint: {fingerprint}")
    print(f"  reviewer: {args.reviewer}   approved_at_utc: {approved_at}")
    print(f"  expires_at_utc: {expires_at} (15-minute TTL)")
    print("  Written atomically to config/query_decisions.yaml.")
    return 0


# ---------------------------------------------------------------------------
# default run command
# ---------------------------------------------------------------------------
def cmd_run(argv: list[str]) -> int:
    args = build_run_parser().parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
    )
    cfg = _config_from_args(args)

    # Estimate first -- no network calls involved.
    est = estimate_usage(cfg)
    print(format_estimate(est, cfg))

    if cfg.dry_run:
        _print_dry_run(est, cfg)
        return 0

    # Load secrets (token required for a real run; never printed in full).
    try:
        secrets = load_secrets(require_x=True, require_llm=cfg.use_llm)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    for line in credential_status_lines(secrets.x_bearer_token):
        print(line)

    # Budget gate: confirm if the estimate exceeds the budget limit.
    if not est.within_budget and not args.yes:
        print(
            f"\nEstimated posts read (~{est.est_posts_read}) EXCEEDS the budget "
            f"limit ({cfg.budget_limit})."
        )
        try:
            reply = input("Proceed anyway? [y/N] ").strip().lower()
        except EOFError:
            reply = "n"
        if reply not in {"y", "yes"}:
            print("Aborted by user.")
            return 1

    try:
        with Cache(CACHE_PATH) as cache:
            summary = run_pipeline(cfg, secrets, cache)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    except Exception as exc:  # noqa: BLE001
        logging.exception("Run failed")
        print(f"ERROR: run failed: {exc}", file=sys.stderr)
        return 3

    print("\n=== Run complete ===")
    print(f"  Queries run:     {summary['queries_run']}")
    if summary.get("queries_blocked"):
        print(f"  Queries blocked: {len(summary['queries_blocked'])} (fail-closed)")
    print(f"  Posts collected: {summary['posts_collected']}")
    print(f"  Posts kept:      {summary['posts_kept']}")
    print(f"  Companies:       {summary['companies']}")
    print(f"  API calls made:  {summary['api_calls_made']}")
    print(f"  Top pick:        {summary['top_pick']}")
    print(f"  Outputs written to: data/output/")
    return 0


def _print_dry_run(est, cfg: RunConfig) -> None:
    from .approval import build_canonical_request, load_decisions
    from .config import load_queries
    from .pricing import is_pricing_stale, pricing_age_days
    from .validator import validate_query

    decisions = load_decisions()
    config_version = load_queries().get("config_version", 1)

    print("\n[dry-run] Curated queries (validation + approval status):")
    for spec in est.queries:
        vr = validate_query(spec.query)
        status = "OK" if vr.ok else "FAIL"
        req = build_canonical_request(spec, cfg, config_version)
        dec = decisions.get(spec.id)
        if dec is None:
            approval = "NOT REVIEWED — blocked (run approve-query)"
        elif dec.decision != "run":
            approval = f"decision='{dec.decision}' — blocked"
        elif dec.approved_request_fingerprint == req.fingerprint():
            approval = "APPROVED — fingerprint matches"
        else:
            approval = "STALE APPROVAL — fingerprint mismatch, re-approve required"
        print(f"\n  [{spec.id}] lane={spec.lane} topics={'+'.join(spec.topics)} — validate:{status}")
        print(f"    QUERY: {spec.query}")
        print(f"    fingerprint: {req.fingerprint()}")
        print(f"    approval: {approval}")
        for w in vr.warnings:
            print(f"    WARNING: {w}")
        for e in vr.errors:
            print(f"    ERROR: {e}")

    age = pricing_age_days()
    print(f"\n[dry-run] Pricing reference age: {age if age is not None else 'unknown'} day(s)"
          f" — {'STALE' if is_pricing_stale() else 'current'}.")
    print("[dry-run] No X API calls were made.")


# ---------------------------------------------------------------------------
# dispatch
# ---------------------------------------------------------------------------
def cmd_count_preflight(argv: list[str]) -> int:
    p = argparse.ArgumentParser(
        prog="headline-sourcing count-preflight",
        description="Phase 2: counts-only preflight over one frozen shared window.",
    )
    p.add_argument("--budget-usd", type=float, default=None,
                   help="Least-privilege USD budget for THIS counts-only run "
                        "(e.g. 0.05 or 0.10). Defaults to config/pricing.yaml.")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
    )
    from .preflight import run_count_preflight
    from .x_client import BASE_URL

    print("=== Phase 2 count preflight (GET /2/tweets/counts/recent only) ===")
    print(f"Live base URL: {BASE_URL}")
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    for line in credential_status_lines(secrets.x_bearer_token):
        print(line)

    with Cache(CACHE_PATH) as cache:
        result = run_count_preflight(secrets, cache, budget_usd=args.budget_usd)

    win = result["window"]
    print("\n--- Frozen shared count window (identical for all six) ---")
    print(f"  as_of_utc:      {win.as_of_utc}")
    print(f"  start_time_utc: {win.start_time_utc}")
    print(f"  end_time_utc:   {win.end_time_utc}")
    print(f"  granularity:    {win.granularity}")

    print("\n--- Six count results ---")
    for cr in result["count_results"]:
        total = cr["total_tweet_count"]
        total_s = total if total is not None else f"unavailable ({cr.get('error')})"
        print(f"  [{cr['query_id']}] 7-day count: {total_s} | {cr['volume_assessment']}"
              f" | decision: pending_review")

    cur = result["current_run_ledger"]
    ptd = result["project_to_date_ledger"]
    print("\n=== Current count-preflight run — cost ledger ===")
    print(f"  recent-count requests:            {cur['recent_count_requests']}")
    print(f"  cost per recent-count request:    ${cur['configured_cost_per_recent_count_request_usd']}")
    print(f"  estimated current-run cost:       ${cur['current_run_estimated_cost_usd']}")
    print(f"  current-run budget:               ${cur['global_run_budget_usd']}")
    print(f"  estimated current-run remaining:  ${cur['current_run_remaining_budget_usd']}")
    print("\n=== Project-to-date — cost ledger ===")
    print(f"  prior user-lookup estimated cost:     ${ptd['previous_estimated_spend_usd']}")
    print(f"  current count-preflight estimated:    ${ptd['current_run_estimated_cost_usd']}")
    print(f"  cumulative estimated cost:            ${ptd['cumulative_estimated_spend_usd']}")
    print(f"  cumulative observed console cost:     {ptd['cumulative_observed_console_spend_usd']}")

    print(f"\n  Real network API calls made: {result['api_calls_made']}")
    print("  Outputs: data/output/query_audit.md, data/output/counts.json, data/output/cost_audit.jsonl")
    print("\nSTOP: six decisions remain pending_review. No ten-post canary until you approve one exact request.")
    return 0


def cmd_regenerate_audit(argv: list[str]) -> int:
    """No-network regeneration of the audit + counts.json from cached counts."""
    p = argparse.ArgumentParser(prog="headline-sourcing regenerate-audit")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
    )
    from .preflight import regenerate_from_counts

    print("=== Regenerating audit from cached count results (NO network) ===")
    result = regenerate_from_counts()
    if result["dropped_decision_ids"]:
        print(f"Dropped stale decision id(s) (fingerprints invalidated): "
              f"{result['dropped_decision_ids']}")
    for cr in result["count_results"]:
        print(f"  [{cr['query_id']}] count={cr['total_tweet_count']} "
              f"| {cr['volume_assessment']} | pending_review")
    print("Rewrote data/output/query_audit.md and data/output/counts.json. No API calls.")
    return 0


def _enrich_paths():
    """Optional path overrides for test isolation (NOT the confirmation value)."""
    import os as _os
    from .enrichment_run import DECISIONS_PATH, LOCK_DIR
    from .enrichment import OUTPUT_PATHS
    dp = _os.environ.get("SOURCING_ENRICHMENT_DECISIONS_PATH")
    ld = _os.environ.get("SOURCING_ENRICHMENT_LOCK_DIR")
    od = _os.environ.get("SOURCING_ENRICHMENT_OUTPUT_DIR")
    from pathlib import Path as _P
    return (_P(dp) if dp else DECISIONS_PATH,
            _P(ld) if ld else LOCK_DIR,
            _P(od) if od else OUTPUT_PATHS["raw_user_response"].parent)


def cmd_approve_enrichment(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing approve-enrichment")
    p.add_argument("--reviewer", required=True)
    args = p.parse_args(argv)
    import json as _json
    from . import enrichment as E
    from .enrichment import OPERATION_NAME
    from .enrichment_run import (
        CONFIRMATION_VALUE, EXPECTED_FINGERPRINT, load_enrichment_decision,
        read_confirmation, record_enrichment_approval,
    )
    from .money import money_str

    decision_path, _lock, _out = _enrich_paths()
    req = E.build_enrichment_request()
    fp = req.fingerprint()

    # Fail closed if the canonical fingerprint changed.
    if fp != EXPECTED_FINGERPRINT:
        print("STOP: canonical fingerprint changed — approval refused.", file=sys.stderr)
        print(f"  previous fingerprint: {EXPECTED_FINGERPRINT}", file=sys.stderr)
        print(f"  new fingerprint:      {fp}", file=sys.stderr)
        print(f"  new canonical request: {_json.dumps(req.canonical_dict())}", file=sys.stderr)
        return 2

    print("=" * 70)
    print("ENRICHMENT APPROVAL REVIEW — targeted_candidate_author_enrichment")
    print(f"  endpoint: https://api.x.com/2/users   method: GET")
    print(f"  author IDs (sorted): {list(req.author_ids)}")
    print(f"  requested User fields: {list(req.requested_user_fields)}")
    print(f"  expansions: none   pagination: False   max HTTP requests: 1   max users: 3")
    print(f"  price/user: ${money_str(E.user_read_cost())}   expected max cost: ${req.expected_max_cost_usd}")
    print(f"  enrichment budget: ${req.global_enrichment_budget_usd}   "
          f"safety margin: ${money_str(E.enrichment_budget() - E.expected_max_cost())}")
    print(f"  connect timeout: 5s   read timeout: 30s   timeout retry: disabled   TTL: 900s")
    print("  canonical request JSON:")
    print(_json.dumps(req.canonical_dict(), indent=2))
    print(f"  fingerprint: {fp}")
    dec = load_enrichment_decision(decision_path)
    print(f"  current approval status: {'approved (record exists)' if dec else 'pending / not approved'}")
    print("=" * 70)
    print(f"Type '{CONFIRMATION_VALUE}' to approve (stdin only; anything else cancels): ")

    ok, reason = read_confirmation("", CONFIRMATION_VALUE, sys.stdin)
    if not ok:
        print(f"Cancelled — no approval recorded (reason: {reason}).")
        return 1
    rec = record_enrichment_approval(args.reviewer, path=decision_path)
    print(f"APPROVED {OPERATION_NAME}")
    print(f"  approval_record_id: {rec['approval_record_id']}")
    print(f"  approved_at_utc: {rec['approved_at_utc']}   expires_at_utc: {rec['expires_at_utc']}")
    print(f"  approved_request_fingerprint: {rec['approved_request_fingerprint']}")
    print(f"  written atomically to {decision_path}")
    return 0


def cmd_run_enrichment(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing run-enrichment")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    from .enrichment_run import execute_enrichment

    decision_path, lock_dir, output_dir = _enrich_paths()
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    with Cache(CACHE_PATH) as cache:
        result = execute_enrichment(secrets=secrets, cache=cache,
                                    decision_path=decision_path, lock_dir=lock_dir,
                                    output_dir=output_dir)
    print(f"run-enrichment status: {result['status']}")
    if result["status"] == "gate_failed":
        for r in result["reasons"]:
            print(f"  BLOCKED: {r}")
        return 1
    if result["status"] == "execution_already_consumed":
        print(f"  approval_record_id: {result['approval_record_id']}")
        print(f"  execution_started_at_utc: {result['execution_started_at_utc']}")
        print(f"  lock_metadata: {result['lock_metadata']}")
        return 1
    print(f"  users_returned: {result['users_returned']}   exec_error: {result['exec_error']}")
    print(f"  lock_path: {result['lock_path']}")
    print(f"  billing_status: {result['cost_ledger']['billing_status']}")
    return 0


def _pilot_paths():
    import os as _os
    from pathlib import Path as _P
    from .pilot_run import DECISIONS_PATH, LOCK_DIR
    from .pilot import OUTPUT_PATHS
    dp = _os.environ.get("SOURCING_PILOT_DECISIONS_PATH")
    ld = _os.environ.get("SOURCING_PILOT_LOCK_DIR")
    od = _os.environ.get("SOURCING_PILOT_OUTPUT_DIR")
    return (_P(dp) if dp else DECISIONS_PATH, _P(ld) if ld else LOCK_DIR,
            _P(od) if od else OUTPUT_PATHS["parsed_posts"].parent)


def cmd_approve_pilot(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing approve-pilot")
    p.add_argument("--reviewer", required=True)
    args = p.parse_args(argv)
    import json as _json
    from . import pilot as P
    from .pilot import build_pilot_request
    from .pilot_run import CONFIRMATION_VALUE, load_pilot_decision, read_confirmation, record_pilot_approval
    from .money import money_str

    decision_path, _l, _o = _pilot_paths()
    req = build_pilot_request()
    fp = req.fingerprint()
    print("=" * 70)
    print("PILOT APPROVAL REVIEW — six_query_sourcing_pilot")
    print(f"  endpoint: https://api.x.com/2/tweets/search/recent   method: GET")
    print(f"  query IDs: {list(req.query_ids)}")
    print(f"  max_results/query: {req.max_results_per_query}   max total posts: {req.max_total_posts}   max requests: {req.max_http_requests}")
    print(f"  expansions: none   user_fields: none   pagination: False   sort_order: recency")
    print(f"  post_read: ${money_str(P.post_read_cost())}   expected max cost: ${req.max_expected_cost_usd}   budget: ${req.global_pilot_post_budget_usd}")
    print("  canonical request JSON:")
    print(_json.dumps(req.canonical_dict(), indent=2))
    print(f"  fingerprint: {fp}")
    dec = load_pilot_decision(decision_path)
    print(f"  current approval status: {'approved (record exists)' if dec else 'pending / not approved'}")
    print("=" * 70)
    print(f"Type '{CONFIRMATION_VALUE}' to approve (stdin only; anything else cancels): ")
    ok, reason = read_confirmation("", CONFIRMATION_VALUE, sys.stdin)
    if not ok:
        print(f"Cancelled — no approval recorded (reason: {reason}).")
        return 1
    rec = record_pilot_approval(args.reviewer, path=decision_path)
    print(f"APPROVED six_query_sourcing_pilot")
    print(f"  approval_record_id: {rec['approval_record_id']}")
    print(f"  approved_at_utc: {rec['approved_at_utc']}   expires_at_utc: {rec['expires_at_utc']}")
    print(f"  approved_request_fingerprint: {rec['approved_request_fingerprint']}")
    return 0


def cmd_run_pilot(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing run-pilot")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    from .pilot_run import execute_pilot

    decision_path, lock_dir, output_dir = _pilot_paths()
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    with Cache(CACHE_PATH) as cache:
        result = execute_pilot(secrets=secrets, cache=cache, decision_path=decision_path,
                               lock_dir=lock_dir, output_dir=output_dir)
    print(f"run-pilot status: {result['status']}")
    if result["status"] in ("gate_failed", "execution_already_consumed"):
        for r in result.get("reasons", []):
            print(f"  BLOCKED: {r}")
        return 1
    print(f"  posts_returned: {result['metrics_overall']['posts_returned']}")
    print(f"  billing_status: {result['cost_ledger']['billing_status']}")
    return 0


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    if argv and argv[0] == "approve-query":
        return cmd_approve_query(argv[1:])
    if argv and argv[0] == "count-preflight":
        return cmd_count_preflight(argv[1:])
    if argv and argv[0] == "regenerate-audit":
        return cmd_regenerate_audit(argv[1:])
    if argv and argv[0] == "approve-enrichment":
        return cmd_approve_enrichment(argv[1:])
    if argv and argv[0] == "run-enrichment":
        return cmd_run_enrichment(argv[1:])
    if argv and argv[0] == "approve-pilot":
        return cmd_approve_pilot(argv[1:])
    if argv and argv[0] == "run-pilot":
        return cmd_run_pilot(argv[1:])
    if argv and argv[0] == "approve-pilot-enrichment":
        return cmd_approve_pilot_enrichment(argv[1:])
    if argv and argv[0] == "run-pilot-enrichment":
        return cmd_run_pilot_enrichment(argv[1:])
    if argv and argv[0] == "approve-broad-counts":
        return cmd_approve_broad_counts(argv[1:])
    if argv and argv[0] == "run-broad-counts":
        return cmd_run_broad_counts(argv[1:])
    if argv and argv[0] == "approve-broad-run":
        return cmd_approve_broad_run(argv[1:])
    if argv and argv[0] == "run-broad-run":
        return cmd_run_broad_run(argv[1:])
    if argv and argv[0] == "approve-broad-enrichment14":
        return cmd_approve_broad_enrichment14(argv[1:])
    if argv and argv[0] == "run-broad-enrichment14":
        return cmd_run_broad_enrichment14(argv[1:])
    return cmd_run(argv)


def _pilot_enrich_paths():
    import os as _os
    from pathlib import Path as _P
    from .pilot_enrichment_run import DECISIONS_PATH, LOCK_DIR
    from .pilot_enrichment import OUTPUT_PATHS
    dp = _os.environ.get("SOURCING_PILOT_ENRICH_DECISIONS_PATH")
    ld = _os.environ.get("SOURCING_PILOT_ENRICH_LOCK_DIR")
    od = _os.environ.get("SOURCING_PILOT_ENRICH_OUTPUT_DIR")
    return (_P(dp) if dp else DECISIONS_PATH, _P(ld) if ld else LOCK_DIR,
            _P(od) if od else OUTPUT_PATHS["raw_user_response"].parent)


def cmd_approve_pilot_enrichment(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing approve-pilot-enrichment")
    p.add_argument("--reviewer", required=True)
    args = p.parse_args(argv)
    import json as _json
    from .pilot_enrichment import build_pilot_enrichment_request, expected_max_cost, pilot_enrichment_budget
    from .pilot_enrichment_run import CONFIRMATION_VALUE, load_decision, read_confirmation, record_approval
    from .money import money_str

    decision_path, _l, _o = _pilot_enrich_paths()
    req = build_pilot_enrichment_request()
    print("=" * 70)
    print("PILOT-SHORTLIST ENRICHMENT APPROVAL — pilot_shortlist_author_enrichment")
    print("  endpoint: https://api.x.com/2/users   method: GET")
    print(f"  author IDs ({len(req.author_ids)}): {list(req.author_ids)}")
    print(f"  requested User fields: {list(req.requested_user_fields)}")
    print(f"  expansions: none   pagination: False   max requests: 1   max users: 8")
    print(f"  expected max cost: ${req.max_expected_cost_usd}   budget: ${req.global_pilot_enrichment_budget_usd}   "
          f"margin: ${money_str(pilot_enrichment_budget() - expected_max_cost())}")
    print("  canonical request JSON:")
    print(_json.dumps(req.canonical_dict(), indent=2))
    print(f"  fingerprint: {req.fingerprint()}")
    print(f"  current approval status: {'approved' if load_decision(decision_path) else 'pending / not approved'}")
    print("=" * 70)
    print(f"Type '{CONFIRMATION_VALUE}' to approve (stdin only; anything else cancels): ")
    ok, reason = read_confirmation("", CONFIRMATION_VALUE, sys.stdin)
    if not ok:
        print(f"Cancelled — no approval recorded (reason: {reason}).")
        return 1
    rec = record_approval(args.reviewer, path=decision_path)
    print(f"APPROVED {CONFIRMATION_VALUE}\n  approval_record_id: {rec['approval_record_id']}")
    print(f"  approved_at_utc: {rec['approved_at_utc']}   expires_at_utc: {rec['expires_at_utc']}")
    print(f"  approved_request_fingerprint: {rec['approved_request_fingerprint']}")
    return 0


def cmd_run_pilot_enrichment(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing run-pilot-enrichment")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    from .pilot_enrichment_run import execute_pilot_enrichment
    decision_path, lock_dir, output_dir = _pilot_enrich_paths()
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    with Cache(CACHE_PATH) as cache:
        result = execute_pilot_enrichment(secrets=secrets, cache=cache, decision_path=decision_path,
                                          lock_dir=lock_dir, output_dir=output_dir)
    print(f"run-pilot-enrichment status: {result['status']}")
    if result["status"] in ("gate_failed", "execution_already_consumed"):
        for r in result.get("reasons", []):
            print(f"  BLOCKED: {r}")
        return 1
    print(f"  users_returned: {result['users_returned']}   billing: {result['cost_ledger']['billing_status']}")
    return 0


# ---------------------------------------------------------------------------
# broad-market commands (20-query count preflight + 4000-post retrieval)
# ---------------------------------------------------------------------------
def _broad_count_paths():
    import os as _os
    from pathlib import Path as _P
    from .broad_market_run import COUNT_DECISIONS_PATH, COUNT_LOCK_DIR
    from .broad_market import BROAD_DIR
    dp = _os.environ.get("SOURCING_BROAD_COUNT_DECISIONS_PATH")
    ld = _os.environ.get("SOURCING_BROAD_COUNT_LOCK_DIR")
    od = _os.environ.get("SOURCING_BROAD_COUNT_OUTPUT_DIR")
    return (_P(dp) if dp else COUNT_DECISIONS_PATH, _P(ld) if ld else COUNT_LOCK_DIR,
            _P(od) if od else BROAD_DIR / "count_preflight")


def _broad_run_paths():
    import os as _os
    from pathlib import Path as _P
    from .broad_market_run import RUN_DECISIONS_PATH, RUN_LOCK_DIR
    from .broad_market import BROAD_DIR
    dp = _os.environ.get("SOURCING_BROAD_RUN_DECISIONS_PATH")
    ld = _os.environ.get("SOURCING_BROAD_RUN_LOCK_DIR")
    od = _os.environ.get("SOURCING_BROAD_RUN_OUTPUT_DIR")
    return (_P(dp) if dp else RUN_DECISIONS_PATH, _P(ld) if ld else RUN_LOCK_DIR,
            _P(od) if od else BROAD_DIR)


def _resolved_url(endpoint: str) -> str:
    """Human-readable resolved URL for a canonical endpoint path.

    The canonical endpoint already carries the ``/2`` version segment, so the
    display uses only the scheme+host of BASE_URL to avoid a duplicated ``/2``.
    Display-only: does not affect endpoint construction or the fingerprint.
    """
    from urllib.parse import urlsplit
    from .x_client import BASE_URL
    s = urlsplit(BASE_URL)
    return f"{s.scheme}://{s.netloc}{endpoint}"


def cmd_approve_broad_counts(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing approve-broad-counts")
    p.add_argument("--reviewer", required=True)
    args = p.parse_args(argv)
    import json as _json
    from . import broad_market as BM
    from .broad_market_run import approve_decision, load_decision, record_count_approval

    decision_path, _l, _o = _broad_count_paths()
    req = BM.build_count_request()
    if load_decision(decision_path) is None:
        record_count_approval(args.reviewer, path=decision_path)
    print("=" * 70)
    print(f"BROAD-MARKET COUNT PREFLIGHT APPROVAL — {BM.COUNT_OPERATION}")
    print(f"  endpoint: {_resolved_url(BM.COUNTS_ENDPOINT)}   method: GET")
    print(f"  queries: {BM.MAX_QUERIES}   max count requests: {BM.MAX_COUNT_REQUESTS}")
    print(f"  max count cost: ${req.max_count_cost_usd}   count budget: ${req.count_budget_usd}")
    print("  canonical request JSON:")
    print(_json.dumps(req.canonical_dict(), indent=2))
    print(f"  fingerprint: {req.fingerprint()}")
    print("=" * 70)
    print(f"Type '{BM.COUNT_OPERATION}' to approve (stdin only; anything else cancels): ")
    result = approve_decision(decision_path, sys.stdin, BM.COUNT_OPERATION, BM.COUNT_OPERATION)
    print(f"approve-broad-counts: {result['status']}")
    return 0 if result["status"] == "approved" else 1


def cmd_run_broad_counts(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing run-broad-counts")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    from .broad_market_run import execute_broad_counts
    decision_path, lock_dir, output_dir = _broad_count_paths()
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    with Cache(CACHE_PATH) as cache:
        result = execute_broad_counts(secrets=secrets, cache=cache, decision_path=decision_path,
                                      lock_dir=lock_dir, output_dir=output_dir)
    print(f"run-broad-counts status: {result['status']}")
    if result["status"] in ("gate_failed", "execution_already_consumed"):
        for r in result.get("reasons", []):
            print(f"  BLOCKED: {r}")
        return 1
    print(f"  requests_made: {result['requests_made']}   billing: {result['cost_ledger']['billing_status']}")
    return 0


def cmd_approve_broad_run(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing approve-broad-run")
    p.add_argument("--reviewer", required=True)
    args = p.parse_args(argv)
    import json as _json
    from . import broad_market as BM
    from .broad_market_run import approve_decision, load_decision, record_run_approval

    decision_path, _l, _o = _broad_run_paths()
    req = BM.build_retrieval_request()
    if load_decision(decision_path) is None:
        record_run_approval(args.reviewer, path=decision_path)
    proj = BM.projection()
    print("=" * 70)
    print(f"BROAD-MARKET RETRIEVAL APPROVAL — {BM.RUN_OPERATION}")
    print(f"  endpoint: {_resolved_url(BM.SEARCH_ENDPOINT)}   method: GET")
    print(f"  tweet.fields: {req.tweet_fields}")
    print(f"  expansions: none   user.fields: none")
    print(f"  queries: {BM.MAX_QUERIES}   max posts: {BM.MAX_TOTAL_POSTS}   max HTTP requests: {BM.MAX_HTTP_REQUESTS}")
    print(f"  max expected cost: ${req.max_expected_cost_usd}   operation budget: ${req.operation_budget_usd}")
    print(f"  projected total activity: ${proj['projected_total_activity_usd']}   "
          f"cushion: ${proj['projected_credit_cushion_usd']}")
    # Count-informed review metadata (NON-fingerprinted; from saved count outputs).
    review = BM.load_count_snapshot_review()
    if review is not None:
        print("  --- count-informed review metadata (not part of the fingerprint) ---")
        print(f"  total aggregate 7-day count: {review['total_aggregate_7d_count']} "
              f"(NOT a unique-Post total)")
        print(f"  expected resources after 200/query cap: ~{review['expected_resources_after_200_cap']}")
        print(f"  estimated expected Post cost: ~${review['expected_post_cost_usd']} "
              f"(not a guarantee — counts and the recent window can change)")
        print(f"  max authorized Post resources: {review['max_authorized_posts']}   "
              f"max authorized Post cost: ${review['max_authorized_post_cost_usd']}")
        for oc in review["queries_over_cap"]:
            print(f"  over cap: {oc['query_id']} at {oc['count']} — may omit ~{oc['omitted_estimate']} Posts")
    print("  canonical request JSON:")
    print(_json.dumps(req.canonical_dict(), indent=2))
    print(f"  fingerprint: {req.fingerprint()}")
    print("=" * 70)
    print(f"Type '{BM.RUN_OPERATION}' to approve (stdin only; anything else cancels): ")
    result = approve_decision(decision_path, sys.stdin, BM.RUN_OPERATION, BM.RUN_OPERATION)
    print(f"approve-broad-run: {result['status']}")
    return 0 if result["status"] == "approved" else 1


def cmd_run_broad_run(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing run-broad-run")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    from .broad_market_run import execute_broad_run
    decision_path, lock_dir, output_dir = _broad_run_paths()
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    with Cache(CACHE_PATH) as cache:
        result = execute_broad_run(secrets=secrets, cache=cache, decision_path=decision_path,
                                   lock_dir=lock_dir, output_dir=output_dir)
    print(f"run-broad-run status: {result['status']}")
    if result["status"] in ("gate_failed", "execution_already_consumed"):
        for r in result.get("reasons", []):
            print(f"  BLOCKED: {r}")
        return 1
    print(f"  posts_retrieved: {result['posts_retrieved']}   new: {result['new_discovery_count']}   "
          f"billing: {result['cost_ledger']['billing_status']}")
    return 0


def _broad_enrich14_paths():
    import os as _os
    from pathlib import Path as _P
    from .broad_market_enrichment14_run import DECISIONS_PATH, LOCK_DIR
    from .broad_market_enrichment14 import OUTPUT_DIR_14
    dp = _os.environ.get("SOURCING_BROAD_ENRICH14_DECISIONS_PATH")
    ld = _os.environ.get("SOURCING_BROAD_ENRICH14_LOCK_DIR")
    od = _os.environ.get("SOURCING_BROAD_ENRICH14_OUTPUT_DIR")
    return (_P(dp) if dp else DECISIONS_PATH, _P(ld) if ld else LOCK_DIR, _P(od) if od else OUTPUT_DIR_14)


def cmd_approve_broad_enrichment14(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing approve-broad-enrichment14")
    p.add_argument("--reviewer", required=True)
    args = p.parse_args(argv)
    import json as _json
    from . import broad_market_enrichment14 as E14
    from .broad_market_enrichment14_run import CONFIRMATION_VALUE, load_decision, record_approval
    from .enrichment_run import read_confirmation

    decision_path, _l, _o = _broad_enrich14_paths()
    req = E14.build_enrichment14_request()
    print("=" * 70)
    print(f"BROAD 14-AUTHOR ENRICHMENT APPROVAL — {E14.OPERATION_NAME}")
    print(f"  endpoint: {_resolved_url(E14.ENDPOINT)}   method: GET")
    print(f"  author IDs ({len(req.author_ids)}, ordered): {list(req.author_ids)}")
    print(f"  user fields: {list(req.requested_user_fields)}")
    print(f"  expansions: none   max users: 14   max requests: 1   retry: disabled")
    print(f"  max expected cost: ${req.max_expected_cost_usd}   budget: ${req.operation_budget_usd}")
    print("  canonical request JSON:")
    print(_json.dumps(req.canonical_dict(), indent=2))
    print(f"  fingerprint: {req.fingerprint()}")
    print(f"  current approval status: {'approved' if load_decision(decision_path) else 'pending / not approved'}")
    print("=" * 70)
    print(f"Type '{CONFIRMATION_VALUE}' to approve (stdin only; anything else cancels): ")
    ok, reason = read_confirmation("", CONFIRMATION_VALUE, sys.stdin)
    if not ok:
        print(f"Cancelled — no approval recorded (reason: {reason}).")
        return 1
    rec = record_approval(args.reviewer, path=decision_path)
    print(f"APPROVED {E14.OPERATION_NAME}\n  approval_record_id: {rec['approval_record_id']}")
    print(f"  approved_at_utc: {rec['approved_at_utc']}   expires_at_utc: {rec['expires_at_utc']}")
    print(f"  approved_request_fingerprint: {rec['approved_request_fingerprint']}")
    return 0


def cmd_run_broad_enrichment14(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog="headline-sourcing run-broad-enrichment14")
    p.add_argument("--verbose", "-v", action="store_true")
    args = p.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(levelname)s %(name)s: %(message)s")
    from .broad_market_enrichment14_run import execute_enrichment14
    decision_path, lock_dir, output_dir = _broad_enrich14_paths()
    try:
        secrets = load_secrets(require_x=True)
    except ConfigError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    with Cache(CACHE_PATH) as cache:
        result = execute_enrichment14(secrets=secrets, cache=cache, decision_path=decision_path,
                                      lock_dir=lock_dir, output_dir=output_dir)
    print(f"run-broad-enrichment14 status: {result['status']}")
    if result["status"] in ("gate_failed", "execution_already_consumed"):
        for r in result.get("reasons", []):
            print(f"  BLOCKED: {r}")
        return 1
    print(f"  returned: {result['returned']}   missing: {result['missing']}   billing: {result['cost_ledger']['billing_status']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
