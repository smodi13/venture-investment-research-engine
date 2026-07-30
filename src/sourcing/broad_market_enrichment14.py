"""Broad-market 14-author profile-enrichment: canonical request + validation +
deterministic profile evidence classification. Preparation only — never calls the
network. Reuses the working /2/users lookup pattern from prior enrichment batches.
"""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from decimal import Decimal
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

from .broad_market import OUTPUT_DIR
from .broad_market_process import PRIOR_ENRICHED_AUTHOR_IDS
from .money import money_str, parse_money
from .registry import match_domain, match_github_owner
from .urlutil import normalized_domain

OPERATION_NAME = "broad_market_14_author_enrichment"
CANONICAL_SCHEMA_VERSION = 1
ENDPOINT = "/2/users"
HTTP_METHOD = "GET"
EXPANSIONS = "none"
MAX_USERS = 14
MAX_HTTP_REQUESTS = 1
CONNECT_TIMEOUT_S = 5
READ_TIMEOUT_S = 30
NETWORK_TIMEOUT_RETRY = "disabled"
APPROVAL_TTL_SECONDS = 900
PRICING_CONFIG_VERSION = 1

# Exactly the User fields the review's decision questions require (spec list).
REQUESTED_USER_FIELDS = ("id", "name", "username", "description", "url", "entities",
                         "location", "created_at", "public_metrics", "verified",
                         "protected", "pinned_tweet_id")

USER_PRICE_USD = Decimal("0.010")
MAX_EXPECTED_COST_USD = Decimal("0.140")      # 14 * 0.010
OPERATION_BUDGET_USD = Decimal("0.180")
SAFETY_MARGIN_USD = Decimal("0.040")          # 0.180 - 0.140
CURRENT_ACTIVITY_USD = Decimal("7.580")
PROJECTED_AFTER_USD = Decimal("7.720")        # 7.580 + 0.140
TOTAL_ALLOWANCE_USD = Decimal("25.000")
PROJECTED_REMAINING_USD = Decimal("17.280")   # 25.000 - 7.720

SELECTION_REVIEW_PATH = OUTPUT_DIR / "broad_market_4000" / "processed" / "profile_enrichment_selection_review.json"
OUTPUT_DIR_14 = OUTPUT_DIR / "broad_market_4000" / "profile_enrichment_14"
OUTPUT_PATHS = {name: OUTPUT_DIR_14 / fname for name, fname in {
    "raw_user_response": "raw_user_response.json", "enrichment_manifest": "enrichment_manifest.json",
    "enrichment_cost_ledger": "enrichment_cost_ledger.json", "requested_user_ids": "requested_user_ids.json",
    "returned_user_ids": "returned_user_ids.json", "missing_user_ids": "missing_user_ids.json",
    "profile_records": "profile_records.json", "profile_records_csv": "profile_records.csv",
    "profile_role_classification": "profile_role_classification.json",
    "profile_company_relation": "profile_company_relation.json",
    "profile_evidence_audit": "profile_evidence_audit.json",
    "profile_contradiction_audit": "profile_contradiction_audit.json",
    "combined_candidate_results": "combined_candidate_results.json",
    "combined_candidate_results_csv": "combined_candidate_results.csv",
    "combined_candidate_results_md": "combined_candidate_results.md",
    "enrichment_summary": "enrichment_summary.json",
    "sanitized_enrichment_fixture": "sanitized_enrichment_fixture.json",
}.items()}


class Enrichment14ValidationError(ValueError):
    pass


# ---------------------------------------------------------------------------
# Load the exact 14 authors from the selection review (source of truth)
# ---------------------------------------------------------------------------
@lru_cache(maxsize=1)
def load_selected_authors() -> tuple[dict, ...]:
    data = json.loads(SELECTION_REVIEW_PATH.read_text())
    revised = data.get("revised_proposed_set", [])
    # ordered by the review's final_enrichment_rank
    revised = sorted(revised, key=lambda c: c["final_enrichment_rank"])
    return tuple(revised)


def selected_author_ids() -> tuple[str, ...]:
    return tuple(str(c["author_id"]) for c in load_selected_authors())


def _post_id_from_url(url: str | None) -> Optional[str]:
    if not url:
        return None
    m = re.search(r"/status/(\d+)", url)
    return m.group(1) if m else None


def decision_questions() -> list[dict]:
    """Carry forward the per-author decision context from the review file."""
    out = []
    for c in load_selected_authors():
        out.append({
            "final_enrichment_rank": c["final_enrichment_rank"],
            "author_id": str(c["author_id"]),
            "associated_company_or_project": c.get("associated_company_or_project"),
            "sector": c.get("sector"),
            "source_post_id": _post_id_from_url(c.get("post_url")),
            "source_post_url": c.get("post_url"),
            "current_disposition": c.get("current_disposition"),
            "current_artifact_evidence": c.get("current_evidence"),
            "current_ownership_evidence": "direct_builder_claim/self" if "B" in (c.get("current_evidence") or []) else "unclear",
            "unresolved_founder_question": c.get("unresolved_identity_question"),
            "unresolved_organization_question": c.get("unresolved_ownership_question"),
            "unresolved_company_formation_question": c.get("company_formation_question"),
            "expected_decision_impact": c.get("expected_decision_impact"),
            "enrichment_priority_score": c.get("priority_score"),
            "overall_shortlist_status": c.get("in_overall_shortlist"),
            "comparison_set_status": c.get("in_comparison_set"),
            "expected_value_of_lookup": c.get("expected_value_of_lookup"),
        })
    return out


# ---------------------------------------------------------------------------
# Integrity checks against the review file
# ---------------------------------------------------------------------------
def verify_selection() -> dict:
    data = json.loads(SELECTION_REVIEW_PATH.read_text())
    revised = data.get("revised_proposed_set", [])
    considered = {str(c["author_id"]): c for c in data.get("candidates_considered", [])}
    ids = [str(c["author_id"]) for c in revised]
    problems = []
    if len(ids) != 14:
        problems.append(f"expected 14 authors, found {len(ids)}")
    if len(set(ids)) != len(ids):
        problems.append("duplicate author IDs in review set")
    if set(ids) & PRIOR_ENRICHED_AUTHOR_IDS:
        problems.append("previously-enriched author present")
    for i in ids:
        c = considered.get(i)
        if c is None:
            problems.append(f"{i}: not in candidates_considered")
            continue
        if c.get("recommended_action") != "enrich":
            problems.append(f"{i}: recommended_action != enrich")
        if not c.get("expected_value_of_lookup"):
            problems.append(f"{i}: missing decision-value question")
    return {"ok": not problems, "problems": problems, "author_ids": ids}


# ---------------------------------------------------------------------------
# Canonical request
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Enrichment14Request:
    author_ids: tuple[str, ...]
    requested_user_fields: tuple[str, ...] = REQUESTED_USER_FIELDS
    canonical_request_schema_version: int = CANONICAL_SCHEMA_VERSION
    operation_name: str = OPERATION_NAME
    endpoint: str = ENDPOINT
    http_method: str = HTTP_METHOD
    expansions: str = EXPANSIONS
    max_user_resources: int = MAX_USERS
    max_http_requests: int = MAX_HTTP_REQUESTS
    connect_timeout_seconds: int = CONNECT_TIMEOUT_S
    read_timeout_seconds: int = READ_TIMEOUT_S
    network_timeout_retry: str = NETWORK_TIMEOUT_RETRY
    user_price_usd: str = money_str(USER_PRICE_USD)
    max_expected_cost_usd: str = money_str(MAX_EXPECTED_COST_USD)
    operation_budget_usd: str = money_str(OPERATION_BUDGET_USD)
    approval_ttl_seconds: int = APPROVAL_TTL_SECONDS
    pricing_config_version: int = PRICING_CONFIG_VERSION

    def canonical_dict(self) -> dict[str, Any]:
        return {
            "canonical_request_schema_version": self.canonical_request_schema_version,
            "operation_name": self.operation_name,
            "author_ids_ordered": list(self.author_ids),       # ORDER significant
            "author_count": len(self.author_ids),
            "source_selection_review_path": str(SELECTION_REVIEW_PATH),
            "endpoint": self.endpoint,
            "http_method": self.http_method,
            "requested_user_fields": list(self.requested_user_fields),  # exact order
            "expansions": self.expansions,
            "max_user_resources": self.max_user_resources,
            "max_http_requests": self.max_http_requests,
            "timeout_policy": {"connect_timeout_seconds": self.connect_timeout_seconds,
                               "read_timeout_seconds": self.read_timeout_seconds},
            "retry_policy": {"network_timeout_retry": self.network_timeout_retry},
            "user_price_usd": self.user_price_usd,
            "max_expected_cost_usd": self.max_expected_cost_usd,
            "operation_budget_usd": self.operation_budget_usd,
            "approval_ttl_seconds": self.approval_ttl_seconds,
            "pricing_config_version": self.pricing_config_version,
            "raw_output_path": str(OUTPUT_PATHS["raw_user_response"]),
            "derived_output_dir": str(OUTPUT_DIR_14),
        }

    def fingerprint(self) -> str:
        # NOTE: no execution timestamps; author order + fields are significant, so we
        # do NOT sort — canonical json with sort_keys only orders the dict keys.
        blob = json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":"))
        return "sha256:" + hashlib.sha256(blob.encode()).hexdigest()


def build_enrichment14_request() -> Enrichment14Request:
    v = verify_selection()
    if not v["ok"]:
        raise Enrichment14ValidationError(f"selection integrity failed: {v['problems']}")
    req = Enrichment14Request(author_ids=selected_author_ids())
    validate_request(req)
    return req


def validate_request(req: Enrichment14Request) -> None:
    if len(req.author_ids) != MAX_USERS:
        raise Enrichment14ValidationError("author count must be exactly 14")
    if len(set(req.author_ids)) != len(req.author_ids):
        raise Enrichment14ValidationError("duplicate author IDs")
    if set(req.author_ids) & PRIOR_ENRICHED_AUTHOR_IDS:
        raise Enrichment14ValidationError("previously-enriched author present")
    if req.endpoint != ENDPOINT or req.http_method != HTTP_METHOD:
        raise Enrichment14ValidationError("endpoint/method invalid")
    if req.expansions != "none":
        raise Enrichment14ValidationError("expansions must be none")
    if req.max_user_resources > MAX_USERS:
        raise Enrichment14ValidationError("max_user_resources exceeds 14")
    if req.max_http_requests != 1:
        raise Enrichment14ValidationError("exactly one HTTP request allowed")
    if req.network_timeout_retry != "disabled":
        raise Enrichment14ValidationError("retry must be disabled")
    if tuple(req.requested_user_fields) != REQUESTED_USER_FIELDS:
        raise Enrichment14ValidationError("user fields changed")
    if parse_money(req.max_expected_cost_usd) > MAX_EXPECTED_COST_USD:
        raise Enrichment14ValidationError("expected cost exceeds 0.140")
    if parse_money(req.operation_budget_usd) > OPERATION_BUDGET_USD:
        raise Enrichment14ValidationError("budget exceeds 0.180")


def cost_block() -> dict[str, str]:
    return {
        "current_estimated_activity_usd": money_str(CURRENT_ACTIVITY_USD),
        "user_price_usd": money_str(USER_PRICE_USD),
        "max_user_resources": str(MAX_USERS),
        "max_expected_cost_usd": money_str(MAX_EXPECTED_COST_USD),
        "operation_budget_usd": money_str(OPERATION_BUDGET_USD),
        "safety_margin_usd": money_str(SAFETY_MARGIN_USD),
        "projected_estimated_activity_after_usd": money_str(PROJECTED_AFTER_USD),
        "projected_remaining_balance_usd": money_str(PROJECTED_REMAINING_USD),
    }


# ---------------------------------------------------------------------------
# Deterministic profile evidence classification (used at execution; no network)
# ---------------------------------------------------------------------------
_RE_COFOUNDER = re.compile(r"\bco[-\s]?founder\b", re.I)
_RE_FOUNDER = re.compile(r"\bfounder\b", re.I)
_RE_EXEC = re.compile(r"\b(ceo|cto|coo|cfo|cmo|chief\s+\w+\s+officer|vp\b|head of|president)\b", re.I)
_RE_ENGINEER = re.compile(r"\b(founding engineer|engineer|developer|swe|programmer)\b", re.I)
_RE_BUILDER = re.compile(r"\b(builder|indie hacker|maker|i build|we build|building)\b", re.I)
_RE_EMPLOYEE = re.compile(r"\b(works? at|working at|team at|eng(?:ineer)? at|@\w+ team)\b", re.I)
_RE_ORG = re.compile(r"\b(official account|we are|our team|our mission|™|®|\bInc\b|\bLLC\b|\bLtd\b|\bLabs\b|company)\b", re.I)


def profile_role_classification(description: str, name: str = "") -> str:
    d = f"{name} {description}".strip()
    if not d:
        return "no_explicit_signal"
    if _RE_COFOUNDER.search(d):
        return "explicit_cofounder"
    if _RE_FOUNDER.search(d):
        return "explicit_founder"
    if _RE_EXEC.search(d):                 # CEO/CTO etc. -> executive, NOT founder
        return "explicit_executive"
    if re.search(r"\bfounding engineer\b", d, re.I):
        return "explicit_engineer"
    if _RE_EMPLOYEE.search(d):
        return "explicit_employee"
    if _RE_ENGINEER.search(d):
        return "explicit_engineer"
    if _RE_BUILDER.search(d):
        return "explicit_builder"
    if _RE_ORG.search(d):
        return "organization_account"
    return "no_explicit_signal"


def _profile_domains(user: dict) -> set[str]:
    doms = set()
    ents = user.get("entities", {}) or {}
    urls = (ents.get("url", {}) or {}).get("urls", []) or []
    urls += (ents.get("description", {}) or {}).get("urls", []) or []
    for u in urls:
        d = normalized_domain(u.get("expanded_url") or u.get("url") or "")
        if d:
            doms.add(d)
    if user.get("url"):
        d = normalized_domain(user["url"])
        if d:
            doms.add(d)
    return doms


def profile_company_relation(user: dict, candidate: dict, post_author_id: str) -> dict:
    """Deterministic profile->company relation. Circular handle != independent evidence."""
    name = (candidate.get("associated_company_or_project") or "").lower().strip()
    desc = (user.get("description") or "")
    username = (user.get("username") or "")
    profile_domains = _profile_domains(user)
    post_domains = set()
    for a in candidate.get("post_artifact_domains", []) or []:
        if a:
            post_domains.add(a.lower())

    relation, basis = "no_match", None
    # domain matches
    if post_domains & profile_domains:
        relation, basis = "exact_product_domain_match", sorted(post_domains & profile_domains)[0]
    elif post_domains and profile_domains and any(
            pd.split(".")[-2:] == qd.split(".")[-2:] for pd in post_domains for qd in profile_domains):
        relation, basis = "related_domain_match", "shared_registrable_root"
    # name matches
    elif name and re.search(rf"\b{re.escape(name)}\b", desc, re.I):
        relation, basis = "exact_company_name_match", name
    # circular self identity: only the handle itself echoes the project, nothing external
    elif name and username and name.replace(" ", "") in username.lower():
        relation, basis = "circular_self_identity", username

    # contradiction: employed at a DIFFERENT established org
    contradiction = None
    for d in profile_domains:
        m = match_domain(d)
        if m and m.owner_scope == "established_organization" and (not name or name not in d):
            contradiction = m.entity_name
            relation, basis = "contradictory_affiliation", m.entity_name
            break
    return {"profile_company_relation": relation, "relation_basis": basis,
            "contradiction_entity": contradiction, "profile_domains": sorted(profile_domains)}


def combined_disposition(candidate: dict, role: str, relation: dict, returned: bool) -> dict:
    codes: list[str] = []
    if not returned:
        return {"combined_disposition": "insufficient_total_evidence",
                "combined_reason_codes": ["USER_NOT_RETURNED"]}
    rel = relation["profile_company_relation"]
    pre = candidate.get("current_disposition")
    has_artifact = "A" in (candidate.get("current_artifact_evidence") or [])
    builder_claim = "B" in (candidate.get("current_artifact_evidence") or [])
    founder_like = role in ("explicit_founder", "explicit_cofounder", "explicit_executive", "explicit_builder")

    if relation.get("contradiction_entity"):
        codes.append("CONTRADICTORY_ESTABLISHED_AFFILIATION")
        return {"combined_disposition": "archive_contradicted", "combined_reason_codes": codes}
    if role == "organization_account" and any(match_domain(d) for d in relation["profile_domains"]):
        codes.append("ESTABLISHED_ORG_CONFIRMED")
        return {"combined_disposition": "archive_established_org", "combined_reason_codes": codes}
    if (has_artifact or builder_claim) and founder_like and rel in (
            "exact_product_domain_match", "exact_company_name_match", "exact_project_name_match", "related_domain_match"):
        codes.append("FOUNDER_COMPANY_ALIGNMENT")
        return {"combined_disposition": "advance_for_diligence", "combined_reason_codes": codes}
    if rel == "circular_self_identity":
        codes.append("CIRCULAR_SELF_IDENTITY_ONLY")
        return {"combined_disposition": "retain_for_manual_research", "combined_reason_codes": codes}
    if rel == "no_match" and role in ("no_explicit_signal", "unclear"):
        codes.append("PROFILE_UNINFORMATIVE")
        return {"combined_disposition": "retain_for_manual_research", "combined_reason_codes": codes}
    codes.append("PARTIAL_ALIGNMENT")
    return {"combined_disposition": "retain_for_manual_research", "combined_reason_codes": codes}
