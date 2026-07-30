"""Runner + output writers for the deterministic broad-market processing pass.

Writes all derived outputs under data/output/broad_market_4000/processed/ ONLY.
Never touches raw retrieval files or any prior run's outputs. No network, no LLM,
no enrichment execution.
"""

from __future__ import annotations

import csv
import io
import json
from decimal import Decimal
from pathlib import Path
from typing import Any

from . import broad_market as BM
from . import broad_market_process as P
from .money import money_str
from .timeutil import now_utc, to_rfc3339

PRIOR_COMPARISON_NAMES = ["Vattara", "AOS", "Unicity Labs", "Synapse", "Mitsumono", "Adaptive",
                          "AI Coding Console", "Nexa Digital", "CodeMate", "Kanvas", "Nexarion"]

SHORTLIST_CAPS = {"ai": 15, "non_ai_software": 15, "hardware_deeptech": 15,
                  "climate_medical_industrial": 15, "consumer_hardware": 10,
                  "headline_mandate": 20, "overall": 25}
MAX_PROPOSED_ENRICHMENT = 30
ENRICHMENT_PROFILE_COST = Decimal("0.010")


def _atomic(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _wj(path: Path, obj: Any) -> None:
    _atomic(path, json.dumps(obj, indent=2, default=str))


def _actionable_sort_key(r: P.ProcessedRecord):
    disp_rank = {"keep_verified": 0, "keep_for_enrichment": 1, "manual_review": 2}.get(r.lead_disposition, 9)
    return (disp_rank, -r.research_score, 0 if r.has_level_a else 1,
            0 if r.announcement_attribution == "direct_builder_claim" else 1)


def _rec_public(r: P.ProcessedRecord) -> dict:
    return {
        "post_id": r.post_id, "author_id": r.author_id,
        "author_name": None, "username": None,     # never invented without enrichment
        "normalized_company_or_project_name": r.normalized_company_or_project_name,
        "sector_bucket": r.sector_bucket, "source_queries": r.source_queries,
        "post_url": r.post_url, "post_text": r.text,
        "announcement_attribution": r.announcement_attribution,
        "actor_project_relation": r.actor_project_relation,
        "artifact_urls": [a.get("canonical_url") for a in r.artifacts],
        "artifact_types": [a.get("artifact_type") for a in r.artifacts],
        "artifact_owner_scope": r.artifact_owner_scope,
        "evidence_levels": r.evidence_levels,
        "hardware_evidence": r.hardware_evidence,
        "broad_market_relevance": r.broad_market_relevance,
        "headline_mandate_fit": r.headline_mandate_fit,
        "general_venture_attractiveness": r.general_venture_attractiveness,
        "research_score": r.research_score, "reason_codes": r.reason_codes,
        "unresolved_questions": r.unresolved_questions, "lead_disposition": r.lead_disposition,
    }


def _shortlist_rows(records, predicate, cap):
    # One row per author (highest-ranked post) so a capped list holds distinct
    # candidates; all source posts are still preserved in all_processed_records.
    ranked = sorted([r for r in records if predicate(r)], key=_actionable_sort_key)
    seen, picked = set(), []
    for r in ranked:
        if r.author_id in seen:
            continue
        seen.add(r.author_id)
        picked.append(r)
        if len(picked) >= cap:
            break
    return [{**_rec_public(r), "candidate_rank": i + 1} for i, r in enumerate(picked)]


def _csv(rows: list[dict], cols: list[str]) -> str:
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for r in rows:
        w.writerow({c: (json.dumps(r.get(c)) if isinstance(r.get(c), (list, dict)) else r.get(c)) for c in cols})
    return buf.getvalue()


def _md_table(rows: list[dict], cols: list[str]) -> str:
    if not rows:
        return "_none_\n"
    out = ["| " + " | ".join(cols) + " |", "| " + " | ".join("---" for _ in cols) + " |"]
    for r in rows:
        cells = []
        for c in cols:
            v = r.get(c)
            if isinstance(v, (list, dict)):
                v = json.dumps(v)
            v = str(v).replace("\n", " ").replace("|", "/")
            cells.append(v[:80])
        out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out) + "\n"


SHORT_COLS = ["candidate_rank", "author_id", "normalized_company_or_project_name", "sector_bucket",
              "headline_mandate_fit", "general_venture_attractiveness", "research_score",
              "lead_disposition", "announcement_attribution", "post_url"]


def _find_prior_candidate(name: str) -> dict | None:
    """Search prior saved outputs (no network) for a previously identified candidate."""
    low = name.lower()
    search_dirs = ["targeted_enrichment", "six_query_pilot", "pilot_shortlist_enrichment"]
    for d in search_dirs:
        base = BM.OUTPUT_DIR / d
        if not base.is_dir():
            continue
        for f in base.rglob("*.json"):
            try:
                txt = f.read_text()
            except Exception:  # noqa: BLE001
                continue
            if low in txt.lower():
                return {"name": name, "found_in": str(f.relative_to(BM.OUTPUT_DIR)), "source": "prior_run"}
    return None


def run_processing(output_dir: Path | None = None) -> dict:
    out = Path(output_dir) if output_dir else P.PROCESSED_DIR
    out.mkdir(parents=True, exist_ok=True)

    integrity = P.load_manifest_integrity()
    records, errors = P.process_all()
    rec_dicts = [r.to_dict() for r in records]

    # metrics
    global_metrics = P.metrics_for(records)
    by_query = P.group_by(records, lambda r: r.source_queries)
    by_sector = P.group_by(records, lambda r: r.sector_bucket)
    by_group = P.group_by(records, lambda r: r.broad_group)
    query_metrics = {q: P.metrics_for(rs) for q, rs in sorted(by_query.items())}
    sector_metrics = {s: P.metrics_for(rs) for s, rs in sorted(by_sector.items())}
    group_metrics = {g: P.metrics_for(rs) for g, rs in sorted(by_group.items())}

    # query ranking + recommendation
    def q_rank_key(item):
        q, m = item
        return (-m["actionable_leads"], -m["keep_verified"], -m["direct_builder_claims"],
                -(m["actionable_lead_rate"] if isinstance(m["actionable_lead_rate"], float) else 0),
                (m["estimated_cost_per_actionable_lead_usd"] if isinstance(m["estimated_cost_per_actionable_lead_usd"], str) else "999"))
    ranked = sorted(query_metrics.items(), key=q_rank_key)

    def recommend(m) -> str:
        if m["actionable_leads"] >= 8 and (isinstance(m["actionable_lead_rate"], float) and m["actionable_lead_rate"] >= 0.15):
            return "expand"
        if m["actionable_leads"] >= 3:
            return "retain"
        if m["posts_processed"] >= 15 and m["actionable_leads"] <= 1:
            return "revise"
        if m["posts_processed"] <= 3 and m["actionable_leads"] == 0:
            return "disable"
        return "retain"
    query_reco = {q: recommend(m) for q, m in query_metrics.items()}

    # dispositions
    keep_verified = [r for r in records if r.lead_disposition == "keep_verified"]
    keep_for_enrichment = [r for r in records if r.lead_disposition == "keep_for_enrichment"]
    manual_review = [r for r in records if r.lead_disposition == "manual_review"]
    actionable = [r for r in records if r.lead_disposition in P.ACTIONABLE]  # strict
    pool = [r for r in records if r.lead_disposition in P.SHORTLIST_DISPOSITIONS]  # + manual_review

    # consolidation
    companies = P.consolidate(records)
    actionable_companies = [c for c in companies if c["lead_disposition"] in P.ACTIONABLE]

    # shortlists (human-review pool: verified > enrichment > manual_review, by score)
    ai_sl = _shortlist_rows(pool, lambda r: r.sector_bucket in P._AI_SECTORS, SHORTLIST_CAPS["ai"])
    nonai_sl = _shortlist_rows(pool, lambda r: r.sector_bucket in P._NON_AI_SOFTWARE_SECTORS, SHORTLIST_CAPS["non_ai_software"])
    hw_sl = _shortlist_rows(pool, lambda r: r.sector_bucket == "hardware_deeptech", SHORTLIST_CAPS["hardware_deeptech"])
    cmi_sl = _shortlist_rows(pool, lambda r: r.sector_bucket in {"climate_energy", "medical_device", "industrial_manufacturing"}, SHORTLIST_CAPS["climate_medical_industrial"])
    consumer_sl = _shortlist_rows(pool, lambda r: r.sector_bucket == "consumer_hardware", SHORTLIST_CAPS["consumer_hardware"])
    headline_sl = _shortlist_rows(pool, lambda r: r.headline_mandate_fit in ("high", "medium"), SHORTLIST_CAPS["headline_mandate"])
    overall_sl = _shortlist_rows(pool, lambda r: True, SHORTLIST_CAPS["overall"])

    # combined comparison set (<=25): strongest new + prior candidates where records exist
    prior_entries = []
    for nm in ["Vattara", "AOS / Unicity Labs", "Synapse", "Mitsumono", "Adaptive",
               "AI Coding Console", "Nexa Digital", "CodeMate", "Kanvas", "Nexarion"]:
        probe = nm.split(" / ")[0]
        found = _find_prior_candidate(probe)
        prior_entries.append({"candidate_source": "prior_run", "name": nm,
                              "record_found": found is not None,
                              "found_in": (found or {}).get("found_in"),
                              "note": "prior candidate — compared on equal footing, records preserved"})
    new_top = overall_sl[: max(0, 25 - len(prior_entries))]
    combined = {"prior_candidates": prior_entries,
                "new_broad_market_candidates": new_top,
                "policy": "no automatic preference for old or new; final pitch company NOT selected"}

    # proposed enrichment (<=30) — NOT built or approved (draws from full pool
    # incl. manual_review, where a profile can most change the decision)
    proposed = _propose_enrichment(pool)

    # ---- write outputs (processed dir ONLY) ----
    manifest = {
        "operation": "broad_market_local_processing",
        "generated_at_utc": to_rfc3339(now_utc()),
        "input_dir": str(P.BROAD_DIR), "output_dir": str(out),
        "input_integrity": integrity,
        "records_processed": len(records), "processing_errors": len(errors),
        "network_calls": 0, "llm_calls": 0, "user_profiles_retrieved": 0,
        "external_urls_accessed": 0, "github_api_calls": 0,
        "raw_files_modified": 0, "prior_outputs_modified": 0,
    }
    _wj(out / "processing_manifest.json", manifest)
    summary = {
        "records_processed": len(records), "processing_errors": len(errors),
        "actionable_posts": len(actionable), "actionable_companies": len(actionable_companies),
        "keep_verified": len(keep_verified), "keep_for_enrichment": len(keep_for_enrichment),
        "manual_review": len(manual_review),
        "global_metrics": global_metrics, "query_recommendations": query_reco,
        "proposed_enrichment_count": len(proposed),
        "proposed_enrichment_cost_usd": money_str(ENRICHMENT_PROFILE_COST * len(proposed)),
    }
    _wj(out / "processing_summary.json", summary)
    _wj(out / "global_metrics.json", global_metrics)
    _wj(out / "query_metrics.json", {"metrics": query_metrics, "recommendations": query_reco,
                                     "ranking": [q for q, _ in ranked]})
    _wj(out / "sector_metrics.json", sector_metrics)
    _wj(out / "broad_group_metrics.json", group_metrics)
    _wj(out / "all_processed_records.json", rec_dicts)
    _atomic(out / "all_processed_records.csv", _csv([_rec_public(r) for r in records], SHORT_COLS[1:]))
    actionable_rows = [{**_rec_public(r), "candidate_rank": i + 1}
                       for i, r in enumerate(sorted(actionable, key=_actionable_sort_key))]
    _wj(out / "actionable_candidates.json", actionable_rows)
    _atomic(out / "actionable_candidates.csv", _csv(actionable_rows, SHORT_COLS))
    _atomic(out / "actionable_candidates.md", _md_table(actionable_rows, SHORT_COLS))
    _wj(out / "keep_verified.json", [_rec_public(r) for r in keep_verified])
    _wj(out / "keep_for_enrichment.json", [_rec_public(r) for r in keep_for_enrichment])
    _wj(out / "manual_review.json", [_rec_public(r) for r in manual_review])

    exclusions = [{"post_id": r.post_id, "author_id": r.author_id, "disposition": r.lead_disposition,
                   "reason_codes": r.reason_codes, "post_url": r.post_url, "text": r.text}
                  for r in records if r.lead_disposition.startswith("archive")]
    _wj(out / "exclusion_audit.json", exclusions)

    reason_index: dict[str, list[str]] = {}
    for r in records:
        for c in r.reason_codes:
            reason_index.setdefault(c, []).append(r.post_id)
    _wj(out / "reason_code_audit.json", {c: {"count": len(v), "post_ids": v} for c, v in sorted(reason_index.items())})

    _wj(out / "ownership_attribution_audit.json",
        [{"post_id": r.post_id, "announcement_attribution": r.announcement_attribution,
          "actor_project_relation": r.actor_project_relation, "text": r.text,
          "referenced_tweets_present": r.referenced_tweets_present} for r in records])
    _wj(out / "artifact_evidence_audit.json",
        [{"post_id": r.post_id, "artifacts": r.artifacts, "has_level_a": r.has_level_a,
          "evidence_levels": r.evidence_levels, "x_only_links": r.x_only_links} for r in records])
    _wj(out / "physical_product_evidence_audit.json",
        [{"post_id": r.post_id, "sector_bucket": r.sector_bucket, "hardware_evidence": r.hardware_evidence}
         for r in records if r.hardware_evidence])
    _wj(out / "company_consolidation_audit.json",
        {"total_companies": len(companies),
         "consolidated_multi_post": [c for c in companies if c["post_count"] > 1],
         "basis_note": "merge only on exact repo / domain / (project+author); scores use best, not sum"})
    _wj(out / "consolidated_companies.json", companies)
    _atomic(out / "consolidated_companies.csv", _csv(
        [{"name": c["normalized_company_or_project_name"], "sector_bucket": c["sector_bucket"],
          "post_count": c["post_count"], "research_score": c["research_score"],
          "lead_disposition": c["lead_disposition"], "consolidation_basis": c["consolidation_basis"]}
         for c in companies],
        ["name", "sector_bucket", "post_count", "research_score", "lead_disposition", "consolidation_basis"]))

    # shortlists
    _wj(out / "ai_shortlist.json", ai_sl);            _atomic(out / "ai_shortlist.md", _md_table(ai_sl, SHORT_COLS))
    _wj(out / "non_ai_software_shortlist.json", nonai_sl); _atomic(out / "non_ai_software_shortlist.md", _md_table(nonai_sl, SHORT_COLS))
    _wj(out / "hardware_deeptech_shortlist.json", hw_sl);  _atomic(out / "hardware_deeptech_shortlist.md", _md_table(hw_sl, SHORT_COLS))
    _wj(out / "climate_medical_industrial_shortlist.json", cmi_sl); _atomic(out / "climate_medical_industrial_shortlist.md", _md_table(cmi_sl, SHORT_COLS))
    _wj(out / "consumer_hardware_shortlist.json", consumer_sl);     _atomic(out / "consumer_hardware_shortlist.md", _md_table(consumer_sl, SHORT_COLS))
    _wj(out / "headline_mandate_shortlist.json", headline_sl);      _atomic(out / "headline_mandate_shortlist.md", _md_table(headline_sl, SHORT_COLS))
    _wj(out / "overall_venture_shortlist.json", overall_sl);        _atomic(out / "overall_venture_shortlist.md", _md_table(overall_sl, SHORT_COLS))

    _wj(out / "combined_comparison_set.json", combined)
    _atomic(out / "combined_comparison_set.md",
            "## Prior candidates\n" + _md_table(prior_entries, ["name", "record_found", "found_in", "note"]) +
            "\n## New broad-market candidates\n" + _md_table(new_top, SHORT_COLS))

    _wj(out / "proposed_profile_enrichment.json",
        {"proposed_author_ids": [p["author_id"] for p in proposed], "count": len(proposed),
         "max_allowed": MAX_PROPOSED_ENRICHMENT, "profile_cost_usd": money_str(ENRICHMENT_PROFILE_COST),
         "projected_cost_usd": money_str(ENRICHMENT_PROFILE_COST * len(proposed)),
         "status": "PROPOSED_NOT_BUILT_NOT_APPROVED", "candidates": proposed})
    _atomic(out / "proposed_profile_enrichment.md", _md_table(proposed,
            ["priority_rank", "author_id", "associated_company_or_project", "sector", "source_query",
             "current_disposition", "expected_decision_impact", "previously_enriched", "estimated_profile_cost_usd"]))

    _wj(out / "query_quality_report_data.json", {"ranking": [{"query_id": q, **query_metrics[q],
                                                              "recommendation": query_reco[q]} for q, _ in ranked]})
    _atomic(out / "query_quality_report.md", _query_quality_md(ranked, query_metrics, query_reco))

    # sanitized fixture (small, no PII beyond IDs; text redacted)
    _wj(out / "sanitized_processing_fixture.json",
        [{"post_id": r.post_id, "author_id": r.author_id, "sector_bucket": r.sector_bucket,
          "announcement_attribution": r.announcement_attribution, "lead_disposition": r.lead_disposition,
          "research_score": r.research_score, "text": "SANITIZED"} for r in records[:25]])

    return {
        "integrity": integrity, "records": len(records), "errors": len(errors),
        "global_metrics": global_metrics, "sector_metrics": sector_metrics,
        "group_metrics": group_metrics, "query_metrics": query_metrics,
        "query_ranking": [q for q, _ in ranked], "query_reco": query_reco,
        "keep_verified": keep_verified, "keep_for_enrichment": keep_for_enrichment,
        "manual_review": manual_review, "actionable": actionable,
        "actionable_companies": actionable_companies, "companies": companies,
        "shortlists": {"ai": ai_sl, "non_ai_software": nonai_sl, "hardware_deeptech": hw_sl,
                       "climate_medical_industrial": cmi_sl, "consumer_hardware": consumer_sl,
                       "headline_mandate": headline_sl, "overall": overall_sl},
        "combined": combined, "proposed_enrichment": proposed, "output_dir": str(out),
    }


def _propose_enrichment(pool) -> list[dict]:
    # Prioritise profiles that can CHANGE the decision: keep_for_enrichment (no
    # verifiable artifact yet -> could advance) and strong manual_review (could
    # advance or archive) ahead of keep_verified (identity confirmation only).
    impact_rank = {"keep_for_enrichment": 0, "manual_review": 1, "keep_verified": 2}
    ranked = sorted(pool, key=lambda r: (impact_rank.get(r.lead_disposition, 9), -r.research_score,
                                         0 if r.has_level_a else 1))
    seen_authors, proposed = set(), []
    for r in ranked:
        if len(proposed) >= MAX_PROPOSED_ENRICHMENT:
            break
        aid = r.author_id
        if aid in P.PRIOR_ENRICHED_AUTHOR_IDS or aid in seen_authors:
            continue
        if r.actor_project_relation == "third_party" or r.announcement_attribution in ("third_party_announcement", "industry_commentary"):
            continue
        if r.artifact_owner_scope in ("established_organization", "foundation_or_community"):
            continue
        if r.broad_market_relevance == "out_of_scope":
            continue
        seen_authors.add(aid)
        impact = ("could_advance" if r.lead_disposition == "keep_for_enrichment"
                  else "identity_confirmation_only" if r.lead_disposition == "keep_verified"
                  else "could_advance_or_archive")
        proposed.append({
            "priority_rank": len(proposed) + 1, "author_id": aid,
            "associated_company_or_project": r.normalized_company_or_project_name,
            "sector": r.sector_bucket, "source_query": (r.source_queries[0] if r.source_queries else None),
            "current_disposition": r.lead_disposition,
            "current_evidence": r.evidence_levels,
            "identity_or_ownership_question": "Is this author the builder/owner of the artifact?",
            "company_formation_question": "Is a legal entity formed and at what stage?",
            "expected_decision_impact": impact,
            "reason_selected": ";".join(r.reason_codes[:3]),
            "previously_enriched": False, "duplicate": False,
            "established_organization": False,
            "estimated_profile_cost_usd": money_str(ENRICHMENT_PROFILE_COST),
        })
    return proposed


def _query_quality_md(ranked, qm, reco) -> str:
    cols = ["rank", "query_id", "posts", "authors", "direct_builder", "level_a",
            "keep_verified", "actionable", "actionable_rate", "cost_per_actionable", "recommendation"]
    rows = []
    for i, (q, m) in enumerate(ranked, 1):
        rows.append({"rank": i, "query_id": q, "posts": m["posts_processed"],
                     "authors": m["unique_authors"], "direct_builder": m["direct_builder_claims"],
                     "level_a": m["level_a_artifacts"], "keep_verified": m["keep_verified"],
                     "actionable": m["actionable_leads"],
                     "actionable_rate": m["actionable_lead_rate"],
                     "cost_per_actionable": m["estimated_cost_per_actionable_lead_usd"],
                     "recommendation": reco[q]})
    return "# Broad-market query quality report\n\n" + _md_table(rows, cols)
