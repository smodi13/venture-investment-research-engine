"""Pilot-shortlist author enrichment — canonical request + validation.

A SEPARATE operation from targeted_candidate_author_enrichment. Prepares one
batched /2/users lookup for up to 10 NEW pilot-shortlist authors (excluding the
three already enriched). Reuses the corrected deterministic profile logic and
the fixed User field set. Never calls the network by itself.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path
from typing import Any

from .config import OUTPUT_DIR
from .enrichment import REQUESTED_USER_FIELDS, user_read_cost
from .money import money_str, parse_money
from .pricing import load_pricing

OPERATION_NAME = "pilot_shortlist_author_enrichment"
SCHEMA_VERSION = 1
ENDPOINT = "/2/users"
HTTP_METHOD = "GET"
APPROVAL_TTL_SECONDS = 900
MAX_EXPECTED_USERS = 8
MAX_HTTP_REQUESTS = 1

# Already enriched in the prior approved lookup (must NOT be requested again).
PREVIOUSLY_ENRICHED = {"15963134", "2061874923639836672", "2063311066294054912"}

# Two marginal keep_verified authors were removed by review (precision over
# capacity); they must NOT consume a User resource.
EXCLUDED_MARGINAL = {
    "1842770165873979392": "prompt-pack marketplace product (Gumroad); weak venture relevance",
    "2050456733437534208": "hackathon observability blog post, not a demonstrated company/product",
}

# Selected NEW authors (exactly 8): 4 keep_verified + 4 named keep_for_enrichment.
SELECTED_AUTHOR_IDS = sorted([
    "1581663006328778753",  # Adaptive (github Yrqx-95/adaptive)      keep_verified
    "176285260",            # AI Coding Console (tyrantious-del)      keep_verified
    "2068596121732055041",  # agentic security scanner (mitsumono.app) keep_verified
    "1858065635223261184",  # Vattara (vattara.ai)                    keep_verified
    "2065358674076319746",  # CodeMate                                keep_for_enrichment
    "1728811697035677696",  # Kanvas                                  keep_for_enrichment
    "1984220819657285632",  # Nexarion                                keep_for_enrichment
    "2068381226306822144",  # Nexa Digital                            keep_for_enrichment
])

# Candidate descriptors from pilot evidence (for the future profile analysis).
CANDIDATES = {
    "1581663006328778753": {"project": "Adaptive", "aliases": ["Adaptive"], "github_owner": "Yrqx-95",
                            "github_repo": "adaptive", "product_domains": [],
                            "source_author_handle": None, "project_handles": [], "organization": None},
    "176285260": {"project": "AI Coding Console", "aliases": ["AI Coding Console"],
                  "github_owner": "tyrantious-del", "github_repo": "ai-coding-console", "product_domains": [],
                  "source_author_handle": None, "project_handles": [], "organization": None},
    "2068596121732055041": {"project": "agentic security scanner", "aliases": [], "github_owner": None,
                            "github_repo": None, "product_domains": ["mitsumono.app"],
                            "source_author_handle": None, "project_handles": [], "organization": None},
    "1858065635223261184": {"project": "Vattara", "aliases": ["Vattara"], "github_owner": None,
                            "github_repo": None, "product_domains": ["vattara.ai"],
                            "source_author_handle": None, "project_handles": [], "organization": None},
    "2065358674076319746": {"project": "CodeMate", "aliases": ["CodeMate"], "github_owner": None,
                            "github_repo": None, "product_domains": [],
                            "source_author_handle": None, "project_handles": [], "organization": None},
    "1728811697035677696": {"project": "Kanvas", "aliases": ["Kanvas"], "github_owner": None,
                            "github_repo": None, "product_domains": [],
                            "source_author_handle": None, "project_handles": [], "organization": None},
    "1984220819657285632": {"project": "Nexarion", "aliases": ["Nexarion"], "github_owner": None,
                            "github_repo": None, "product_domains": [],
                            "source_author_handle": None, "project_handles": [], "organization": None},
    "2068381226306822144": {"project": "Nexa Digital", "aliases": ["Nexa Digital", "Nexa"], "github_owner": None,
                            "github_repo": None, "product_domains": [],
                            "source_author_handle": None, "project_handles": [], "organization": None},
}

PILOT_ENRICH_DIR = OUTPUT_DIR / "pilot_shortlist_enrichment"
OUTPUT_PATHS = {
    "raw_user_response": PILOT_ENRICH_DIR / "raw_user_response.json",
    "parsed_user_response": PILOT_ENRICH_DIR / "parsed_user_response.json",
    "enrichment_manifest": PILOT_ENRICH_DIR / "enrichment_manifest.json",
    "enrichment_cost_ledger": PILOT_ENRICH_DIR / "enrichment_cost_ledger.json",
    "enrichment_candidate_report": PILOT_ENRICH_DIR / "enrichment_candidate_report.json",
    "combined_candidate_report": PILOT_ENRICH_DIR / "combined_candidate_report.json",
    "final_comparison_queue": PILOT_ENRICH_DIR / "final_comparison_queue.json",
    "sanitized_enrichment_fixture": PILOT_ENRICH_DIR / "sanitized_enrichment_fixture.json",
}


class PilotEnrichmentValidationError(ValueError):
    pass


def pilot_enrichment_budget() -> Decimal:
    return parse_money(load_pricing().get("run_budget", {}).get("global_pilot_enrichment_budget_usd"),
                       field="run_budget.global_pilot_enrichment_budget_usd")


def expected_max_cost(n: int = None) -> Decimal:
    return user_read_cost() * Decimal(int(len(SELECTED_AUTHOR_IDS) if n is None else n))


def pricing_config_version() -> int:
    return int(load_pricing().get("pricing_config_version", 1))


@dataclass(frozen=True)
class PilotEnrichmentRequest:
    author_ids: tuple[str, ...]
    requested_user_fields: tuple[str, ...]
    max_expected_cost_usd: str
    global_pilot_enrichment_budget_usd: str
    pricing_config_version: int
    canonical_request_schema_version: int = SCHEMA_VERSION
    operation_name: str = OPERATION_NAME
    endpoint: str = ENDPOINT
    http_method: str = HTTP_METHOD
    affiliation_included: bool = False
    expansions: str = "none"
    pagination: bool = False
    max_expected_users: int = MAX_EXPECTED_USERS
    max_http_requests: int = MAX_HTTP_REQUESTS
    connect_timeout_seconds: int = 5
    read_timeout_seconds: int = 30
    network_timeout_retry: str = "disabled"
    approval_ttl_seconds: int = APPROVAL_TTL_SECONDS

    def canonical_dict(self) -> dict[str, Any]:
        return {
            "canonical_request_schema_version": self.canonical_request_schema_version,
            "operation_name": self.operation_name,
            "author_ids": sorted(self.author_ids),
            "requested_user_fields": sorted(self.requested_user_fields),
            "affiliation_included": self.affiliation_included,
            "endpoint": self.endpoint, "http_method": self.http_method,
            "expansions": self.expansions, "pagination": self.pagination,
            "max_expected_users": self.max_expected_users, "max_http_requests": self.max_http_requests,
            "expected_max_cost_usd": self.max_expected_cost_usd,
            "global_pilot_enrichment_budget_usd": self.global_pilot_enrichment_budget_usd,
            "timeout_policy": {"connect_timeout_seconds": self.connect_timeout_seconds,
                               "read_timeout_seconds": self.read_timeout_seconds,
                               "network_timeout_retry": self.network_timeout_retry},
            "pricing_config_version": self.pricing_config_version,
            "approval_ttl_seconds": self.approval_ttl_seconds,
        }

    def fingerprint(self) -> str:
        blob = json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":"))
        return "sha256:" + hashlib.sha256(blob.encode("utf-8")).hexdigest()


def build_pilot_enrichment_request(author_ids: list[str] = None) -> PilotEnrichmentRequest:
    ids = list(author_ids if author_ids is not None else SELECTED_AUTHOR_IDS)
    req = PilotEnrichmentRequest(
        author_ids=tuple(sorted(ids)),
        requested_user_fields=tuple(REQUESTED_USER_FIELDS),
        max_expected_cost_usd=money_str(expected_max_cost(len(ids))),
        global_pilot_enrichment_budget_usd=money_str(pilot_enrichment_budget()),
        pricing_config_version=pricing_config_version(),
    )
    validate_pilot_enrichment_request(req)
    return req


def validate_pilot_enrichment_request(req: PilotEnrichmentRequest) -> None:
    ids = list(req.author_ids)
    if len(ids) != len(set(ids)):
        raise PilotEnrichmentValidationError("duplicate author IDs")
    if len(ids) > MAX_EXPECTED_USERS:
        raise PilotEnrichmentValidationError("more than 8 authors")
    if any(a in PREVIOUSLY_ENRICHED for a in ids):
        raise PilotEnrichmentValidationError("previously enriched author present")
    if any(a in EXCLUDED_MARGINAL for a in ids):
        raise PilotEnrichmentValidationError("excluded marginal author present")
    if sorted(ids) != sorted(SELECTED_AUTHOR_IDS):
        raise PilotEnrichmentValidationError("author set does not match the approved selection")
    if sorted(req.requested_user_fields) != sorted(REQUESTED_USER_FIELDS):
        raise PilotEnrichmentValidationError("requested user fields changed")
    if req.affiliation_included:
        raise PilotEnrichmentValidationError("affiliation unsupported; must not be included")
    if req.expansions != "none":
        raise PilotEnrichmentValidationError("expansions must be none")
    if req.pagination:
        raise PilotEnrichmentValidationError("pagination must be disabled")
    if req.max_http_requests != 1:
        raise PilotEnrichmentValidationError("max_http_requests must be 1")
    if req.max_expected_users > MAX_EXPECTED_USERS:
        raise PilotEnrichmentValidationError("max_expected_users exceeds 8")
    if req.endpoint != ENDPOINT or req.http_method != HTTP_METHOD:
        raise PilotEnrichmentValidationError("endpoint/method must be GET /2/users")
    if parse_money(req.max_expected_cost_usd) > Decimal("0.080"):
        raise PilotEnrichmentValidationError("expected cost exceeds 0.080")
    if parse_money(req.global_pilot_enrichment_budget_usd) > Decimal("0.100"):
        raise PilotEnrichmentValidationError("budget exceeds 0.100")
