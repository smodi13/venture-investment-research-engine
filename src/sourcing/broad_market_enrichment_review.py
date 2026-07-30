"""Decision-value review of which authors to enrich next (local only).

Reads only saved processed outputs. Scores each candidate by the EXPECTED decision
value of a profile lookup (0-100), recommends enrich/hold/exclude, and proposes a
revised (<=30) enrichment set that is NOT auto-filled. Never calls the network,
never builds or approves an enrichment request. Engagement is never scored.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from decimal import Decimal
from pathlib import Path
from typing import Any

# Review-layer venture-relevance filter (does NOT modify processed records; only
# governs which authors are worth a profile lookup). Catches non-venture posts that
# matched a build-verb + sector keyword: crypto tokens, military/propaganda,
# charity/community, news/sports, and marketplace-only listings.
_NON_VENTURE = re.compile(
    r"\b(token|treasury|wallet|airdrop|presale|memecoin|meme coin|\$[A-Z]{2,6}\b|badge|"
    r"tokenomics|on[- ]chain|non-custodial|missile|drone strike|irgc|op\.?\s*nasr|"
    r"satellite comms|lottery|gaming regulatory|election administration|the audit|"
    r"mlb teams|free transportation|during exams|grassroots)\b", re.I)


def _non_venture_signal(r: dict) -> bool:
    return bool(_NON_VENTURE.search(r.get("text", "") or ""))

from .broad_market_process import PRIOR_ENRICHED_AUTHOR_IDS
from .money import money_str, parse_money

PROCESSED_DIR = Path("data/output/broad_market_4000/processed")
PROFILE_COST = Decimal("0.010")
MAX_SET = 30

# Actual project spend to date (actual resources returned, NOT the max authorization).
PRIOR_ACTIVITY_USD = Decimal("1.085")
BROAD_COUNT_USD = Decimal("0.100")
BROAD_RETRIEVAL_USD = Decimal("6.395")
TOTAL_BEFORE_ENRICHMENT_USD = Decimal("7.580")   # 1.085 + 0.100 + 6.395
TOTAL_ALLOWANCE_USD = Decimal("25.000")

# Prior comparison candidates resolved from saved outputs (author_id, already-enriched).
PRIOR_CANDIDATES = {
    "Vattara": "1858065635223261184",
    "AOS / Unicity Labs": "15963134",
    "Synapse": "2063311066294054912",
    "Mitsumono": None,                     # author unresolved from saved files
    "Adaptive": "1581663006328778753",
    "AI Coding Console": "176285260",
    "Nexa Digital": "2068381226306822144",
    "CodeMate": "2065358674076319746",
    "Kanvas": "1728811697035677696",
    "Nexarion": "1984220819657285632",
}

# Deterministic sector -> hypothesis templates (no LLM; reported as hypotheses).
_HYP = {
    "ai_infrastructure": ("AI/platform engineering teams", "usage-based / seat SaaS",
                          "large but crowded AI-infra market", "depends on perf/lock-in vs OSS + labs"),
    "ai_application_software": ("line-of-business teams adopting AI", "per-seat SaaS",
                               "expanding AI-app market", "thin unless workflow depth / proprietary data"),
    "developer_infrastructure": ("developers / platform teams", "OSS + paid cloud / seats",
                                "steady dev-tools demand", "community + integration depth"),
    "cybersecurity": ("security / IT buyers", "enterprise subscription",
                     "durable security spend", "detection quality + compliance moat hypothesis"),
    "fintech_software": ("finance / ops teams", "SaaS + possible payment take-rate",
                        "large finops market", "integrations + compliance hypothesis"),
    "vertical_saas": ("a specific vertical's operators", "vertical SaaS subscription",
                     "focused vertical TAM", "workflow lock-in + data moat hypothesis"),
    "non_ai_b2b_saas": ("business teams", "per-seat SaaS", "broad B2B market",
                       "differentiation unproven from the Post"),
    "hardware_deeptech": ("OEMs / enterprises / operators", "hardware + service revenue",
                         "capital-intensive deep-tech", "IP / manufacturing / performance moat hypothesis"),
    "climate_energy": ("utilities / industrial buyers", "hardware + PPA / project revenue",
                      "policy-driven climate market", "unit economics + deployment moat hypothesis"),
    "medical_device": ("providers / health systems", "device sales + reimbursement",
                      "regulated medtech market", "regulatory + clinical-evidence moat hypothesis"),
    "industrial_manufacturing": ("manufacturers / industrial ops", "hardware/software + service",
                                "large industrial market", "integration + reliability moat hypothesis"),
    "consumer_hardware": ("consumers", "unit sales (+ possible subscription)",
                        "competitive consumer market", "brand / design / supply-chain moat hypothesis"),
    "mixed": ("unclear buyer", "unclear model", "unclear market", "unclear defensibility"),
    "unclear": ("unclear buyer", "unclear model", "unclear market", "unclear defensibility"),
}


def _load(name: str) -> Any:
    return json.loads((PROCESSED_DIR / name).read_text())


def load_context():
    return {
        "all": _load("all_processed_records.json"),
        "overall": _load("overall_venture_shortlist.json"),
        "combined": _load("combined_comparison_set.json"),
        "proposed": _load("proposed_profile_enrichment.json"),
    }


def _author_project_multiplicity(records: list[dict]) -> dict[str, int]:
    by_author: dict[str, set] = defaultdict(set)
    for r in records:
        if r.get("verified_project_name"):
            by_author[str(r["author_id"])].add(r["verified_project_name"].lower())
    return {a: len(v) for a, v in by_author.items()}


def _customer_evidence(r: dict) -> bool:
    hw = r.get("hardware_evidence") or {}
    if any(k in hw for k in ("customer_deployment", "pilot_installation", "purchase_order_claim",
                             "shipped_units_claim", "customer_or_partner_name")):
        return True
    import re
    return bool(re.search(r"\b(first customer|design partner|paid pilot|in production|migrated from|customers? using)\b",
                          r.get("text", ""), re.I))


def _financing_evidence(r: dict) -> bool:
    return bool((r.get("score_breakdown") or {}).get("financing_timing"))


def _identity_unresolved(r: dict) -> bool:
    return (r.get("normalized_company_or_project_name") is None
            or "COMPANY_IDENTITY_UNRESOLVED" in (r.get("reason_codes") or [])
            or r.get("actor_project_relation") == "unclear")


def compute_priority(r: dict, in_comparison: bool, in_overall: bool, multiplicity: int) -> dict:
    comp: dict[str, int] = {}
    comp["in_comparison_set"] = 20 if in_comparison else 0
    comp["in_overall_shortlist"] = 15 if in_overall else 0
    comp["unresolved_identity"] = 15 if _identity_unresolved(r) else 0
    # A verified external artifact whose founder/team is not evidenced in the Post
    # (no team signal) is a high-value lookup: confirm the person is the founder.
    team_in_post = bool((r.get("score_breakdown") or {}).get("founder_team_signal"))
    comp["verified_artifact_unclear_team"] = 15 if (r.get("has_level_a") and not team_in_post) else 0
    comp["builder_no_artifact"] = 10 if (r.get("lead_disposition") == "keep_for_enrichment") else 0
    comp["customer_traction"] = 10 if _customer_evidence(r) else 0
    comp["strong_headline_fit"] = 5 if r.get("headline_mandate_fit") == "high" else 0
    comp["strong_venture_attractiveness"] = 5 if r.get("general_venture_attractiveness") in ("very_high", "high") else 0
    comp["financing_timing"] = 5 if _financing_evidence(r) else 0

    pen: dict[str, int] = {}
    text = (r.get("text") or "").lower()
    likely_side = multiplicity >= 3 or any(k in text for k in ("hackathon", "weekend project", "side project", "just for fun"))
    pen["likely_side_project"] = -15 if likely_side else 0
    pen["likely_established_org"] = -25 if r.get("artifact_owner_scope") in ("established_organization", "foundation_or_community") else 0
    pen["likely_services_business"] = -25 if r.get("lead_disposition") == "archive_services_business" else 0
    pen["unclear_venture_relevance"] = -15 if r.get("broad_market_relevance") == "unclear" else 0
    pen["likely_non_venture"] = -30 if _non_venture_signal(r) else 0   # token/military/charity/news/marketplace
    # A profile is unlikely to resolve venture ownership when the post's only
    # external links are third-party platforms (marketplace/news/video/PH) rather
    # than an own product — that pattern signals a reseller/sharer, not a builder.
    # Pure-text builder claims with NO links are exempt (the bio is the only lead).
    pen["profile_cannot_resolve"] = -20 if r.get("x_only_links") else 0

    total = max(0, min(100, sum(comp.values()) + sum(pen.values())))
    return {"priority_score": total, "components": comp, "penalties": pen}


def _impact(r: dict) -> str:
    d = r.get("lead_disposition")
    if d == "keep_for_enrichment":
        return "could_advance"
    if d == "keep_verified":
        return "identity_confirmation_only"
    return "could_advance_or_archive"   # manual_review


def _expected_value(r: dict) -> str:
    d = r.get("lead_disposition")
    if d == "keep_for_enrichment":
        return "Confirm a verifiable external artifact exists and the author owns it (advance vs archive)."
    if d == "keep_verified":
        return "Confirm the author is the founder/owner and whether a company/entity is formed."
    return "Resolve whether the author is the builder or a third-party sharer of the artifact."


# Per-impact enrich thresholds: a lookup that can FLIP archive<->advance
# (keep_for_enrichment) clears a lower bar than one that only confirms identity.
_ENRICH_THRESHOLD = {"keep_for_enrichment": 25, "keep_verified": 50, "manual_review": 45}


def _recommend(priority: int, r: dict, already_enriched: bool) -> str:
    if already_enriched:
        return "exclude"
    if _non_venture_signal(r):          # crypto token / military / charity / news / marketplace
        return "exclude"
    if r.get("artifact_owner_scope") in ("established_organization", "foundation_or_community"):
        return "exclude"
    if r.get("lead_disposition") in ("archive_services_business", "archive_marketplace_or_reseller",
                                     "archive_third_party", "archive_commentary", "archive_out_of_scope",
                                     "archive_low_quality"):
        return "exclude"
    if r.get("broad_market_relevance") == "out_of_scope":
        return "exclude"
    thr = _ENRICH_THRESHOLD.get(r.get("lead_disposition"), 45)
    if priority >= thr:
        return "enrich"
    if priority >= 20:
        return "hold"
    return "exclude"


def build_review():
    ctx = load_context()
    records = ctx["all"]
    overall_authors = {str(r["author_id"]) for r in ctx["overall"]}
    comparison_new_authors = {str(r["author_id"]) for r in ctx["combined"]["new_broad_market_candidates"]}
    comparison_prior_authors = {a for a in PRIOR_CANDIDATES.values() if a}
    comparison_authors = comparison_new_authors | comparison_prior_authors
    multiplicity = _author_project_multiplicity(records)

    # candidate pool: best record per author among keep_verified / keep_for_enrichment /
    # material manual_review (artifact + unclear actor + in-scope).
    def material_manual(r):
        return (r["lead_disposition"] == "manual_review" and r.get("has_level_a")
                and r.get("broad_market_relevance") == "in_scope"
                and r.get("sector_bucket") != "unclear" and _identity_unresolved(r))

    pool_records = [r for r in records if r["lead_disposition"] in ("keep_verified", "keep_for_enrichment")
                    or material_manual(r)]
    best_by_author: dict[str, dict] = {}
    for r in pool_records:
        a = str(r["author_id"])
        if a not in best_by_author or r["research_score"] > best_by_author[a]["research_score"]:
            best_by_author[a] = r

    considered = []
    for a, r in best_by_author.items():
        already = a in PRIOR_ENRICHED_AUTHOR_IDS
        in_comp = a in comparison_authors
        in_over = a in overall_authors
        pr = compute_priority(r, in_comp, in_over, multiplicity.get(a, 0))
        rec = {
            "author_id": a,
            "associated_company_or_project": r.get("normalized_company_or_project_name"),
            "sector": r.get("sector_bucket"),
            "current_disposition": r.get("lead_disposition"),
            "current_evidence": r.get("evidence_levels"),
            "post_url": r.get("post_url"),
            "post_text": r.get("text"),
            "artifact_urls": [x.get("canonical_url") for x in (r.get("artifacts") or [])],
            "in_overall_shortlist": in_over,
            "in_comparison_set": in_comp,
            "already_enriched": already,
            "headline_mandate_fit": r.get("headline_mandate_fit"),
            "general_venture_attractiveness": r.get("general_venture_attractiveness"),
            "research_score": r.get("research_score"),
            "priority_score": pr["priority_score"],
            "score_components": pr["components"],
            "score_penalties": pr["penalties"],
            "unresolved_identity_question": "Is the author the founder/owner of this project?",
            "unresolved_ownership_question": "Does the author (or their org) own the linked artifact?",
            "company_formation_question": "Is a legal entity formed and at what stage?",
            "expected_value_of_lookup": _expected_value(r),
            "expected_decision_impact": _impact(r),
            "recommended_action": _recommend(pr["priority_score"], r, already),
        }
        considered.append(rec)
    considered.sort(key=lambda x: (-x["priority_score"], -x["research_score"]))

    # prior comparison candidates as explicit review rows
    prior_rows = []
    for name, aid in PRIOR_CANDIDATES.items():
        enriched = bool(aid) and aid in PRIOR_ENRICHED_AUTHOR_IDS
        prior_rows.append({
            "name": name, "author_id": aid, "source_type": "prior",
            "already_enriched": enriched,
            "recommended_action": "exclude" if enriched else ("hold" if aid is None else "review"),
            "note": ("already enriched in a prior run — do not re-enrich" if enriched
                     else "author unresolved from saved files — cannot enrich" if aid is None
                     else "prior candidate not yet enriched"),
        })

    # Revised set: deliberate MIX across impact tiers, capped, NOT auto-filled to 30.
    # Per-tier caps guarantee could_advance (keep_for_enrichment) leads while still
    # reserving slots for high-value founder-confirmation and could-archive lookups.
    TIER_CAP = {"keep_for_enrichment": 18, "keep_verified": 8, "manual_review": 4}
    enrich_pool = [c for c in considered if c["recommended_action"] == "enrich"]
    picked_by_tier: dict[str, list] = {"keep_for_enrichment": [], "keep_verified": [], "manual_review": []}
    for c in enrich_pool:  # already sorted by (-priority, -score)
        d = c["current_disposition"]
        if len(picked_by_tier[d]) < TIER_CAP[d]:
            picked_by_tier[d].append(c)
    tier_order = ["keep_for_enrichment", "manual_review", "keep_verified"]  # could_advance first
    revised_src = [c for t in tier_order for c in picked_by_tier[t]][:MAX_SET]
    revised = [{**c, "final_enrichment_rank": i} for i, c in enumerate(revised_src, 1)]

    n = len(revised)
    cost = PROFILE_COST * n
    total_after = TOTAL_BEFORE_ENRICHMENT_USD + cost
    remaining = TOTAL_ALLOWANCE_USD - total_after
    cost_block = {
        "selected_profiles": n,
        "profile_cost_usd": money_str(PROFILE_COST),
        "expected_enrichment_cost_usd": money_str(cost),
        "total_before_enrichment_usd": money_str(TOTAL_BEFORE_ENRICHMENT_USD),
        "estimated_total_after_enrichment_usd": money_str(total_after),
        "remaining_estimated_credit_usd": money_str(remaining),
        "note": "uses ACTUAL resources returned ($7.580), not the $21.485 max-authorization projection",
    }
    return {"considered": considered, "prior_rows": prior_rows, "revised": revised,
            "cost": cost_block, "context": ctx,
            "mix": _mix(revised)}


def _mix(revised) -> dict:
    from collections import Counter
    return dict(Counter(c["current_disposition"] for c in revised))


def write_review(review) -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    out = {
        "operation": "profile_enrichment_selection_review",
        "policy": "expected decision value only; engagement never scored; not auto-filled to 30",
        "prior_candidate_review": review["prior_rows"],
        "candidates_considered": review["considered"],
        "revised_proposed_set": review["revised"],
        "revised_set_disposition_mix": review["mix"],
        "cost_accounting": review["cost"],
        "network_calls": 0, "user_profiles_retrieved": 0,
        "enrichment_request_built": False, "enrichment_request_approved": False,
    }
    (PROCESSED_DIR / "profile_enrichment_selection_review.json").write_text(json.dumps(out, indent=2, default=str))
    (PROCESSED_DIR / "profile_enrichment_selection_review.md").write_text(_md(review))


def _md(review) -> str:
    r = review
    lines = ["# Profile enrichment — decision-value selection review", "",
             "Expected decision value only. Engagement (followers/likes/reposts/badges) is never scored.",
             "Not auto-filled to 30.", "",
             "## Cost accounting (actual resources, not max authorization)"]
    for k, v in r["cost"].items():
        lines.append(f"- **{k}**: {v}")
    lines += ["", "## Prior comparison candidates", "",
              "| name | author_id | already_enriched | action | note |",
              "| --- | --- | --- | --- | --- |"]
    for p in r["prior_rows"]:
        lines.append(f"| {p['name']} | {p['author_id']} | {p['already_enriched']} | {p['recommended_action']} | {p['note']} |")
    lines += ["", f"## Revised proposed set ({len(r['revised'])})", "",
              "| rank | author_id | project | sector | disp | priority | overall | comparison | impact |",
              "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for c in r["revised"]:
        lines.append(f"| {c['final_enrichment_rank']} | {c['author_id']} | {c['associated_company_or_project']} | "
                     f"{c['sector']} | {c['current_disposition']} | {c['priority_score']} | {c['in_overall_shortlist']} | "
                     f"{c['in_comparison_set']} | {c['expected_decision_impact']} |")
    return "\n".join(lines) + "\n"


def compact_decision_table(review, limit: int = 40) -> list[dict]:
    """<=40: comparison candidates + revised enrichment + any overall not yet included."""
    ctx = review["context"]
    by_author = {c["author_id"]: c for c in review["considered"]}
    rows, seen = [], set()

    def add(author_id, name, source_type, from_rec=None):
        if author_id in seen or len(rows) >= limit:
            return
        seen.add(author_id)
        c = by_author.get(author_id, {})
        rows.append({
            "candidate": name or c.get("associated_company_or_project"),
            "prior_or_new": source_type,
            "sector": c.get("sector"),
            "author_id": author_id,
            "disposition": c.get("current_disposition", "prior/enriched"),
            "verified_artifact": bool(c.get("artifact_urls")) if c else None,
            "direct_builder": ("B" in (c.get("current_evidence") or [])) if c else None,
            "company_identity_known": (c.get("associated_company_or_project") is not None) if c else None,
            "founder_identity_known": False,          # requires enrichment
            "customer_evidence": None,
            "headline_fit": c.get("headline_mandate_fit"),
            "overall_score": c.get("research_score"),
            "enrichment_priority": c.get("priority_score"),
            "action": c.get("recommended_action", "exclude"),
            "in_comparison": author_id in {p["author_id"] for p in review["prior_rows"]} or c.get("in_comparison_set", False),
            "question_enrichment_answers": c.get("expected_value_of_lookup") if c else "already enriched / unresolved author",
        })

    # 1) prior comparison candidates
    for p in review["prior_rows"]:
        add(p["author_id"] or f"prior:{p['name']}", p["name"], "prior")
    # 2) revised enrichment set
    for c in review["revised"]:
        add(c["author_id"], c["associated_company_or_project"], "new")
    # 3) any overall-shortlist author not yet included
    for r in ctx["overall"]:
        add(str(r["author_id"]), r["normalized_company_or_project_name"], "new")

    rows.sort(key=lambda x: (0 if x["in_comparison"] else 1,
                             -(x["enrichment_priority"] or 0), -(x["overall_score"] or 0)))
    return rows[:limit]
