"""Targeted candidate-author enrichment — PREPARATION + parsing (no auto-exec).

One batched GET /2/users lookup for exactly three approved author IDs. This
module builds the canonical request + fingerprint, validates fail-closed, does
Decimal budgeting, and provides the deterministic profile parser/classifier used
on the (future) approved response. It never calls the network by itself.
"""

from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

from .config import OUTPUT_DIR
from .money import money_str, parse_money
from .pricing import load_pricing
from .registry import match_aliases_in_text, match_domain, match_github_owner
from .urlutil import bare_host, build_url_info, github_owner_repo

# ---------------------------------------------------------------------------
# Constants / field set
# ---------------------------------------------------------------------------
ENRICHMENT_SCHEMA_VERSION = 1
OPERATION_NAME = "targeted_candidate_author_enrichment"
ENDPOINT = "/2/users"
HTTP_METHOD = "GET"
APPROVAL_TTL_SECONDS = 900
MAX_EXPECTED_USERS = 3
MAX_HTTP_REQUESTS = 1

APPROVED_AUTHOR_IDS = ["15963134", "2061874923639836672", "2063311066294054912"]

# affiliation is NOT part of the X API v2 /2/users user.fields enumeration nor the
# existing client schema -> excluded (no silent substitution).
AFFILIATION_SUPPORTED = False
AFFILIATION_EXCLUSION_REASON = (
    "'affiliation' is not a supported user.fields value on /2/users in the X API "
    "v2 schema used by this client (client USER_FIELDS does not include it). "
    "Excluded rather than substituted; raw_affiliation stays null."
)

# Requested User fields (supported subset; affiliation excluded above). id/name/
# username are default-returned but listed for a complete, fingerprinted scope.
REQUESTED_USER_FIELDS = sorted([
    "id", "name", "username", "description", "entities", "url", "location",
    "created_at", "protected", "public_metrics", "verified", "verified_type",
    "pinned_tweet_id",
])

# Output paths (separate from canary outputs).
ENRICH_DIR = OUTPUT_DIR / "targeted_enrichment"
OUTPUT_PATHS = {
    "raw_user_response": ENRICH_DIR / "raw_user_response.json",
    "parsed_user_response": ENRICH_DIR / "parsed_user_response.json",
    "enrichment_manifest": ENRICH_DIR / "enrichment_manifest.json",
    "enrichment_cost_ledger": ENRICH_DIR / "enrichment_cost_ledger.json",
    "enrichment_audit": ENRICH_DIR / "enrichment_audit.json",
    "enrichment_candidate_report": ENRICH_DIR / "enrichment_candidate_report.json",
    "sanitized_user_fixture": ENRICH_DIR / "sanitized_user_fixture.json",
}


class EnrichmentValidationError(ValueError):
    """Raised when the enrichment request violates a fail-closed constraint."""


# ---------------------------------------------------------------------------
# Cost / budget (Decimal only)
# ---------------------------------------------------------------------------
def user_read_cost() -> Decimal:
    return parse_money(load_pricing().get("costs", {}).get("user_read_usd"),
                       field="costs.user_read_usd")


def enrichment_budget() -> Decimal:
    return parse_money(load_pricing().get("run_budget", {}).get("global_enrichment_budget_usd"),
                       field="run_budget.global_enrichment_budget_usd")


def expected_max_cost(n_users: int = MAX_EXPECTED_USERS) -> Decimal:
    return user_read_cost() * Decimal(int(n_users))


def pricing_config_version() -> int:
    return int(load_pricing().get("pricing_config_version", 1))


# ---------------------------------------------------------------------------
# Canonical request + fingerprint
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class EnrichmentRequest:
    author_ids: tuple[str, ...]
    requested_user_fields: tuple[str, ...]
    expected_max_cost_usd: str
    global_enrichment_budget_usd: str
    pricing_config_version: int
    affiliation_included: bool = False
    canonical_request_schema_version: int = ENRICHMENT_SCHEMA_VERSION
    operation_name: str = OPERATION_NAME
    endpoint: str = ENDPOINT
    http_method: str = HTTP_METHOD
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
            "endpoint": self.endpoint,
            "http_method": self.http_method,
            "author_ids": sorted(self.author_ids),
            "requested_user_fields": sorted(self.requested_user_fields),
            "affiliation_included": self.affiliation_included,
            "expansions": self.expansions,
            "pagination": self.pagination,
            "max_expected_users": self.max_expected_users,
            "max_http_requests": self.max_http_requests,
            "expected_max_cost_usd": self.expected_max_cost_usd,
            "global_enrichment_budget_usd": self.global_enrichment_budget_usd,
            "timeout_policy": {
                "connect_timeout_seconds": self.connect_timeout_seconds,
                "read_timeout_seconds": self.read_timeout_seconds,
                "network_timeout_retry": self.network_timeout_retry,
            },
            "pricing_config_version": self.pricing_config_version,
            "approval_ttl_seconds": self.approval_ttl_seconds,
        }

    def fingerprint(self) -> str:
        blob = json.dumps(self.canonical_dict(), sort_keys=True, separators=(",", ":"))
        return "sha256:" + hashlib.sha256(blob.encode("utf-8")).hexdigest()


def build_enrichment_request(author_ids: list[str] = APPROVED_AUTHOR_IDS) -> EnrichmentRequest:
    req = EnrichmentRequest(
        author_ids=tuple(sorted(author_ids)),
        requested_user_fields=tuple(REQUESTED_USER_FIELDS),
        expected_max_cost_usd=money_str(expected_max_cost(len(author_ids))),
        global_enrichment_budget_usd=money_str(enrichment_budget()),
        pricing_config_version=pricing_config_version(),
        affiliation_included=AFFILIATION_SUPPORTED,
    )
    validate_enrichment_request(req)
    return req


def validate_enrichment_request(req: EnrichmentRequest) -> None:
    """Fail closed on every disallowed condition (mandate)."""
    ids = list(req.author_ids)
    if len(ids) != 3:
        raise EnrichmentValidationError(f"expected exactly 3 author IDs, got {len(ids)}")
    if sorted(ids) != sorted(APPROVED_AUTHOR_IDS):
        raise EnrichmentValidationError("author-ID set does not match the approved three")
    if sorted(req.requested_user_fields) != sorted(REQUESTED_USER_FIELDS):
        raise EnrichmentValidationError("requested user fields changed from the approved set")
    if req.affiliation_included and not AFFILIATION_SUPPORTED:
        raise EnrichmentValidationError("affiliation is unsupported and must not be included")
    if req.expansions != "none":
        raise EnrichmentValidationError("expansions must be 'none'")
    if req.pagination:
        raise EnrichmentValidationError("pagination must be disabled")
    if req.max_http_requests != 1:
        raise EnrichmentValidationError("max_http_requests must be 1")
    if req.max_expected_users > MAX_EXPECTED_USERS:
        raise EnrichmentValidationError("max_expected_users exceeds 3")
    if req.endpoint != ENDPOINT or req.http_method != HTTP_METHOD:
        raise EnrichmentValidationError("endpoint/method must be GET /2/users")
    if req.network_timeout_retry != "disabled":
        raise EnrichmentValidationError("network-timeout retry must be disabled")
    if parse_money(req.expected_max_cost_usd) > Decimal("0.030"):
        raise EnrichmentValidationError("expected cost exceeds 0.030")
    if parse_money(req.global_enrichment_budget_usd) > Decimal("0.040"):
        raise EnrichmentValidationError("enrichment budget exceeds 0.040")


# ---------------------------------------------------------------------------
# Candidate descriptors (from the 3 actionable canary candidates)
# ---------------------------------------------------------------------------
CANDIDATES = {
    "2063311066294054912": {
        "project": "Synapse", "aliases": ["Synapse"],
        "github_owner": "nrkoka786", "github_repo": "synapse",
        "product_domains": [], "source_author_handle": "AILearningGym",
        "project_handles": [], "organization": None,
    },
    "2061874923639836672": {
        "project": "Comfy MCP", "aliases": ["Comfy MCP", "ComfyMCP"],
        "github_owner": None, "github_repo": None,
        "product_domains": [], "source_author_handle": "NeurainX",
        "project_handles": [], "organization": None,
    },
    "15963134": {
        "project": "AOS", "aliases": ["AOS"],
        "github_owner": None, "github_repo": None,
        "product_domains": [], "source_author_handle": "mgault",
        "project_handles": ["unicity_labs", "Unicity Labs"], "organization": "Unicity Labs",
    },
}


# ---------------------------------------------------------------------------
# Profile URL role
# ---------------------------------------------------------------------------
_LINK_AGGREGATORS = {"linktr.ee", "bio.link", "beacons.ai", "lnk.bio", "carrd.co",
                     "about.me", "linkin.bio", "hoo.be", "solo.to"}
_NEWSLETTERS = {"substack.com", "medium.com", "beehiiv.com", "ghost.io"}
_SOCIAL = {"x.com", "twitter.com", "t.co", "linkedin.com", "youtube.com",
           "instagram.com", "tiktok.com", "facebook.com", "threads.net"}


def classify_profile_url_role(url: str, candidate: Optional[dict] = None) -> str:
    host = bare_host(url)
    if not host:
        return "unknown"
    if github_owner_repo(url) is not None or host in ("github.com", "gitlab.com"):
        return "github"
    if host in _LINK_AGGREGATORS:
        return "link_aggregator"
    if host in _NEWSLETTERS:
        return "newsletter_or_publication"
    if host in _SOCIAL:
        return "social_profile"
    if host.startswith("docs.") or "/docs" in url.lower():
        return "documentation"
    if candidate:
        if host in (candidate.get("product_domains") or []):
            return "candidate_product"
    return "company_site"


# ---------------------------------------------------------------------------
# Profile URL + bio extraction (structured entities preferred; regex fallback)
# ---------------------------------------------------------------------------
_URL_RE = re.compile(r"https?://[^\s]+")
_MENTION_RE = re.compile(r"(?<![\w@])@([A-Za-z0-9_]{1,15})")
_HASHTAG_RE = re.compile(r"(?<!\w)#(\w+)")


def _profile_url_info(entity: dict, source_field: str, candidate: Optional[dict]) -> dict:
    # Priority: unwound_url > unwound.url > expanded_url > url (via urlutil).
    e = dict(entity)
    if not e.get("unwound_url") and isinstance(e.get("unwound"), dict):
        e["unwound_url"] = e["unwound"].get("url")
    info = build_url_info(e)
    info["source_field"] = source_field
    info["display_url"] = entity.get("display_url")
    info["profile_url_role"] = (
        "unknown" if info["url_resolution_status"] == "unresolved_shortener"
        else classify_profile_url_role(info["selected_canonical_url"] or "", candidate)
    )
    return info


def extract_profile(user: dict, candidate: Optional[dict] = None) -> dict:
    ents = user.get("entities", {}) or {}
    desc = user.get("description", "") or ""
    urls: list[dict] = []
    extraction_source = "structured_entities"

    # primary profile URL (entities.url.urls)
    for u in (ents.get("url", {}) or {}).get("urls", []) or []:
        urls.append(_profile_url_info(u, "profile_url", candidate))
    # bio URLs (entities.description.urls)
    bio_urls_struct = (ents.get("description", {}) or {}).get("urls", []) or []
    for u in bio_urls_struct:
        urls.append(_profile_url_info(u, "description", candidate))
    # regex fallback for bio URLs only when structured absent
    if not bio_urls_struct and desc:
        for raw in _URL_RE.findall(desc):
            urls.append(_profile_url_info({"url": raw, "expanded_url": raw}, "regex_fallback", candidate))
            extraction_source = "regex_fallback"

    # mentions
    struct_mentions = (ents.get("description", {}) or {}).get("mentions", []) or []
    if struct_mentions:
        mentions = [m.get("username") for m in struct_mentions if m.get("username")]
    else:
        mentions = _MENTION_RE.findall(desc)
        if mentions:
            extraction_source = "regex_fallback"
    mentions = _dedup_ci(mentions)

    # hashtags
    struct_tags = (ents.get("description", {}) or {}).get("hashtags", []) or []
    if struct_tags:
        tags = [h.get("tag") for h in struct_tags if h.get("tag")]
    else:
        tags = _HASHTAG_RE.findall(desc)
    tags = _dedup_ci(tags)

    return {
        "profile_bio_urls": [u for u in urls if u["source_field"] in ("description", "regex_fallback")],
        "profile_all_urls": urls,
        "profile_mentioned_handles": mentions,
        "profile_bio_hashtags": tags,
        "profile_entity_extraction_source": extraction_source,
    }


def _dedup_ci(items: list[str]) -> list[str]:
    seen, out = set(), []
    for it in items:
        if it and it.lower() not in seen:
            seen.add(it.lower())
            out.append(it)
    return out


# ---------------------------------------------------------------------------
# Account type / founder signal / candidate match / disposition
# ---------------------------------------------------------------------------
_FOUNDER_RE = re.compile(r"\b(co-?founder|founder)\b", re.I)
_BUILDER_RE = re.compile(r"\b(building|builder|creator of|maker of|i build|we build)\b", re.I)
_EMPLOYEE_RE = re.compile(r"\b(engineer|developer|swe|pm|designer|scientist|staff|working)\s+(at|@)\b", re.I)
_ORG_ACCOUNT_RE = re.compile(r"\b(official account|company account|the team behind|we are|our team|open[- ]source project)\b", re.I)


# Executive titles (do NOT imply founder). Longest-first so full titles win.
_EXEC_TITLES = [
    ("Chief Executive Officer", "CEO"), ("Chief Technology Officer", "CTO"),
    ("Chief Operating Officer", "COO"), ("Chief Product Officer", "CPO"),
    ("Chief Information Officer", "CIO"), ("CEO", "CEO"), ("CTO", "CTO"),
    ("COO", "COO"), ("CPO", "CPO"), ("CIO", "CIO"), ("President", "President"),
]


def _org_after(text: str, end: int) -> Optional[str]:
    tail = text[end:].lstrip(" :,-").strip()
    # skip a single leading preposition ("at Acme", "of Acme", "@Acme").
    tail = re.sub(r"^(at|of|for|@)\s+", "", tail, flags=re.I)
    words = tail.split()
    parts: list[str] = []
    for w in words[:4]:
        wc = w.strip(",.:;@#")
        if wc and (wc[0].isupper() or wc.isupper()) and wc.lower() not in ("of", "the", "at", "and", "&"):
            parts.append(wc)
        else:
            break
    return " ".join(parts) or None


def profile_role_signal(description: str) -> tuple[str, dict[str, Any]]:
    """Explicit role signal. CEO/CTO/President are executives, NOT founders."""
    d = description or ""
    ev: dict[str, Any] = {"matched_role_phrase": None, "matched_role_title": None,
                          "matched_organization": None, "role_source_field": "description",
                          "exact_role_text_span": None, "role_confidence": "none"}
    if not d.strip():
        return "unclear", ev
    m = re.search(r"\bco-?founder\b", d, re.I)
    if m:
        ev.update(matched_role_phrase=m.group(0), matched_role_title="Cofounder",
                  exact_role_text_span=m.group(0), role_confidence="high",
                  matched_organization=_org_after(d, m.end()))
        return "explicit_cofounder", ev
    m = re.search(r"\bfounder\b", d, re.I)
    if m:
        ev.update(matched_role_phrase=m.group(0), matched_role_title="Founder",
                  exact_role_text_span=m.group(0), role_confidence="high",
                  matched_organization=_org_after(d, m.end()))
        return "explicit_founder", ev
    for full, short in _EXEC_TITLES:
        m = re.search(rf"\b{re.escape(full)}\b", d, re.I)
        if m:
            ev.update(matched_role_phrase=m.group(0), matched_role_title=short,
                      exact_role_text_span=m.group(0), role_confidence="high",
                      matched_organization=_org_after(d, m.end()))
            return "explicit_executive", ev
    m = _EMPLOYEE_RE.search(d)
    if m:
        ev.update(matched_role_phrase=m.group(0), matched_role_title=m.group(1),
                  exact_role_text_span=m.group(0), role_confidence="medium",
                  matched_organization=_org_after(d, m.end()))
        return ("explicit_engineer" if re.search(r"engineer|developer|swe", m.group(1), re.I)
                else "explicit_employee"), ev
    m = _BUILDER_RE.search(d)
    if m:
        ev.update(matched_role_phrase=m.group(0), matched_role_title="Builder",
                  exact_role_text_span=m.group(0), role_confidence="medium")
        return "explicit_builder", ev
    if _ORG_ACCOUNT_RE.search(d) or re.search(r"\bopen[- ]source project\b", d, re.I):
        return "organization_account", ev
    return "no_explicit_signal", ev


def account_type(description: str) -> tuple[str, str]:
    d = description or ""
    if not d.strip():
        return "unclear", ""
    if re.search(r"\bopen[- ]source project\b", d, re.I):
        return "project", "open-source project"
    if _ORG_ACCOUNT_RE.search(d):
        return "company", _ORG_ACCOUNT_RE.search(d).group(0)
    role, ev = profile_role_signal(d)
    if role in ("explicit_founder", "explicit_cofounder", "explicit_executive",
                "explicit_builder", "explicit_engineer", "explicit_employee"):
        return "individual", ev["matched_role_phrase"] or role
    return "unclear", ""


def founder_or_builder_signal(description: str) -> tuple[str, str]:
    d = description or ""
    m = re.search(r"\bco-?founder\b", d, re.I)
    if m:
        return "explicit_cofounder", m.group(0)
    m = _FOUNDER_RE.search(d)
    if m:
        return "explicit_founder", m.group(0)
    m = _ORG_ACCOUNT_RE.search(d)
    if m:
        return "organization_account", m.group(0)
    m = _EMPLOYEE_RE.search(d)
    if m:
        return "explicit_employee", m.group(0)
    m = _BUILDER_RE.search(d)
    if m:
        return "explicit_builder", m.group(0)
    if not d.strip():
        return "unclear", ""
    return "no_explicit_signal", ""


def _names_project(text: str, candidate: dict) -> Optional[str]:
    for alias in candidate.get("aliases", []):
        if re.search(rf"\b{re.escape(alias)}\b", text, re.I):
            return alias
    return None


def candidate_project_match(user: dict, profile: dict, candidate: dict) -> dict:
    desc = user.get("description", "") or ""
    name = user.get("name", "") or ""
    username = user.get("username", "") or ""
    protected = bool(user.get("protected"))
    blob = f"{name} {username} {desc}"
    role, role_ev = profile_role_signal(desc)
    ev: dict[str, Any] = {"matched_project_name": None, "matched_handle": None,
                          "matched_domain": None, "matched_github_owner_repository": None,
                          "conflicting_affiliation": None, "exact_profile_text_span": None,
                          "profile_role_signal": role}

    # --- handle-evidence independence (circular self-handle excluded) ---
    src = candidate.get("source_author_handle")
    is_source_author_handle = bool(src and username.lower() == src.lower())
    proj_handles = [h.lower() for h in candidate.get("project_handles", [])]
    bio_mentions = [h for h in profile.get("profile_mentioned_handles", [])]
    distinct_handles = [h for h in bio_mentions if h.lower() != username.lower()]
    matched_distinct = next((h for h in distinct_handles if h.lower() in proj_handles), None)
    is_candidate_project_handle = matched_distinct is not None
    if is_candidate_project_handle:
        independence = "independent"
    elif is_source_author_handle:
        independence = "circular_self_identity"
    elif distinct_handles:
        independence = "ambiguous"
    else:
        independence = "none"
    ev.update(is_source_author_handle=is_source_author_handle,
              is_candidate_project_handle=is_candidate_project_handle,
              handle_evidence_independence=independence)
    reasons: list[str] = []

    if protected or not desc.strip():
        return {"match": "unclear", "confidence": "low", "final_match_rule": "empty_or_protected",
                "reason_codes": ["PROFILE_PROTECTED" if protected else "PROFILE_EMPTY", "CANDIDATE_MATCH_UNCLEAR"],
                "evidence": ev}

    named = _names_project(blob, candidate)
    if named:
        ev["matched_project_name"] = named
        ev["exact_profile_text_span"] = named
        reasons.append("PROFILE_EXPLICITLY_NAMES_PROJECT")

    # INDEPENDENT second signals only (circular self-handle never counts).
    second = 0
    for u in profile.get("profile_all_urls", []):
        gh = github_owner_repo(u.get("selected_canonical_url") or "")
        if gh and candidate.get("github_owner") and gh.split("/")[0].lower() == candidate["github_owner"].lower():
            ev["matched_github_owner_repository"] = gh
            reasons.append("PROFILE_MATCHING_GITHUB_OWNER")
            second += 1
        dom = u.get("normalized_domain")
        if dom and dom in (candidate.get("product_domains") or []):
            ev["matched_domain"] = dom
            reasons.append("PROFILE_MATCHING_PRODUCT_DOMAIN")
            second += 1
    # distinct project/company handle tied to an org/role statement
    if is_candidate_project_handle and role != "no_explicit_signal" and role != "unclear":
        ev["matched_handle"] = matched_distinct
        reasons.append("PROFILE_MATCHING_PROJECT_HANDLE")
        second += 1
    if is_source_author_handle and not is_candidate_project_handle:
        reasons.append("PROFILE_MENTION_WITHOUT_OWNERSHIP")  # circular; not corroboration
    if named and (_FOUNDER_RE.search(desc) or _BUILDER_RE.search(desc)):
        reasons.append("PROFILE_EXPLICIT_FOUNDER")
        second += 1

    # employer / contradiction: explicit "<role> at <registry org>"
    employer = None
    for rm in match_aliases_in_text(desc):
        if re.search(rf"\b(at|@)\s+{re.escape(rm.matched_value)}\b", desc, re.I):
            employer = rm.entity_name
            ev["conflicting_affiliation"] = rm.entity_name
    established_org_tie = bool(named and employer)
    ev["established_org_tie"] = established_org_tie
    if employer and not named:
        reasons.append("PROFILE_PROJECT_CONTRADICTION")
        reasons.append("CANDIDATE_MATCH_CONTRADICTED")
        return {"match": "contradicted", "confidence": "medium",
                "final_match_rule": "explicit_conflicting_employer",
                "reason_codes": reasons, "evidence": ev}

    if named and second >= 1:
        match, conf, rule = "confirmed", "high", "explicit_name_plus_independent_signal"
        reasons.append("CANDIDATE_MATCH_CONFIRMED")
    elif named or second >= 1:
        match, conf, rule = "likely", "medium", "single_independent_signal"
        reasons.append("CANDIDATE_MATCH_LIKELY")
    else:
        # No name, no independent signal. Distinguish generic (unclear) from an
        # explicit unrelated role/employer (unsupported).
        unrelated_role = (role in ("explicit_founder", "explicit_cofounder", "explicit_executive",
                                    "explicit_employee", "explicit_engineer")
                          and role_ev.get("matched_organization"))
        if unrelated_role:
            match, conf, rule = "unsupported", "low", "explicit_unrelated_role"
            reasons.append("PROFILE_NO_PROJECT_SIGNAL")
            reasons.append("CANDIDATE_MATCH_UNSUPPORTED")
        else:
            match, conf, rule = "unclear", "low", "generic_or_circular_only"
            reasons.append("PROFILE_AMBIGUOUS")
            if independence == "circular_self_identity":
                reasons.append("PROFILE_MENTION_WITHOUT_OWNERSHIP")
            reasons.append("CANDIDATE_MATCH_UNCLEAR")
    return {"match": match, "confidence": conf, "final_match_rule": rule,
            "reason_codes": reasons, "evidence": ev}


def enrichment_disposition(user: dict, match: dict, founder_signal: str,
                           established_org_tie: bool) -> dict:
    m = match["match"]
    codes = list(match["reason_codes"])
    # 1. contradicted
    if m == "contradicted":
        return _disp("archive_contradicted_ownership", "1:contradicted", codes + ["CANDIDATE_MATCH_CONTRADICTED"])
    # 2. established-org tie
    if established_org_tie:
        return _disp("archive_established_org", "2:established_org_tie", codes + ["PROFILE_ESTABLISHED_ORG_CONNECTION"])
    # 3. confirmed
    if m == "confirmed":
        return _disp("advance_for_diligence", "3:confirmed", codes)
    # 4. likely + explicit ownership role
    if m == "likely" and founder_signal in (
            "explicit_founder", "explicit_cofounder", "explicit_builder",
            "organization_account", "explicit_employee"):
        return _disp("advance_for_diligence", "4:likely+explicit_role", codes)
    # 5. likely but incomplete role
    if m == "likely":
        return _disp("retain_for_manual_research", "5:likely_incomplete_role", codes)
    # 7. empty/protected/ambiguous
    if m == "unclear":
        return _disp("insufficient_profile_evidence", "7:insufficient", codes)
    # 6. unsupported + clearly unrelated
    if m == "unsupported":
        return _disp("archive_unrelated_profile", "6:unsupported_unrelated", codes)
    return _disp("insufficient_profile_evidence", "7:default", codes)


def _disp(disposition: str, rule: str, codes: list[str]) -> dict:
    return {"enrichment_disposition": disposition, "final_enrichment_rule": rule,
            "enrichment_reason_codes": list(dict.fromkeys(codes))}


_ADVANCE_ROLES = {"explicit_founder", "explicit_cofounder", "explicit_executive",
                  "explicit_builder", "explicit_engineer", "explicit_employee",
                  "organization_account"}


def combined_disposition(post_level: dict, match: dict, profile_role: str,
                         registry_match: bool) -> dict:
    """Combine post-level + enrichment evidence. Does NOT overwrite either layer.

    A verified external artifact is never erased by an empty/generic profile.
    Vanity metrics never affect the result.
    """
    m = match["match"]
    ev = match["evidence"]
    post_disp = post_level.get("lead_disposition")
    has_level_a = post_level.get("has_level_a", False)
    attribution = post_level.get("announcement_attribution")
    codes = list(match.get("reason_codes", []))

    def out(disp, rule, reason, extra=None):
        return {"combined_candidate_disposition": disp, "combined_disposition_rule": rule,
                "combined_disposition_reason": reason,
                "combined_evidence": {"post_level_disposition": post_disp,
                                      "has_level_a_artifact": has_level_a,
                                      "candidate_project_match": m,
                                      "profile_role_signal": profile_role,
                                      "handle_evidence_independence": ev.get("handle_evidence_independence"),
                                      "organization": ev.get("conflicting_affiliation"),
                                      "registry_match": registry_match},
                "combined_reason_codes": list(dict.fromkeys(codes + (extra or []))) }

    # 1. enrichment explicitly contradicts ownership
    if m == "contradicted":
        return out("archive_contradicted", "1:contradicted",
                   "Profile explicitly identifies a conflicting employer/project.")
    # 2. explicit profile+project tie to a REGISTERED established org
    if ev.get("established_org_tie") and registry_match:
        return out("archive_established_org", "2:established_org_tie",
                   "Profile+project evidence ties the candidate to a registry-matched org.")
    # 3. verified external artifact survives profile enrichment
    if post_disp == "keep_verified" and has_level_a:
        return out("advance_for_diligence", "3:verified_artifact_survives_profile",
                   "Post-level verified external artifact remains actionable; enrichment does not contradict it.")
    # 4. keep_for_enrichment + corroboration
    if post_disp == "keep_for_enrichment" and (
            m == "confirmed" or (m == "likely" and profile_role in _ADVANCE_ROLES)):
        return out("advance_for_diligence", "4:enrichment_corroborates",
                   "Direct builder claim plus enrichment project/organization alignment.")
    # 5. direct builder claim but enrichment empty/generic/unsupported/circular
    if attribution == "direct_builder_claim" and m in ("unclear", "unsupported", "likely"):
        return out("retain_for_manual_research", "5:builder_claim_unconfirmed_profile",
                   "Direct builder claim but profile enrichment is empty/generic/circular without contradiction.")
    # 6. clearly unrelated profile
    if m == "unsupported":
        return out("archive_unrelated", "6:unrelated_profile",
                   "Profile clearly concerns unrelated work with no candidate connection.")
    # 7. insufficient total evidence
    return out("insufficient_total_evidence", "7:insufficient",
               "Neither the post nor enrichment provides sufficient reliable evidence.")


def diligence_questions(candidate: dict, combined_disp: str, match: dict, profile_role: str) -> dict:
    proj = candidate.get("project")
    org = candidate.get("organization")
    ownership_q, product_q = [], []
    if proj == "AOS":
        ownership_q.append(f"Is @mgault (CEO {org}) the actual builder/owner of AOS, or a company representative?")
        product_q.append("Is AOS a commercial product, an open-source project, or a company product line?")
    elif proj == "Synapse":
        ownership_q.append("Does the X author (@AILearningGym) own or control github.com/nrkoka786/synapse?")
        product_q.append("Is Synapse a commercial venture or a personal open-source side project?")
    elif proj == "Comfy MCP":
        ownership_q.append("Who owns @NeurainX / Comfy MCP? Is there an identifiable person or company behind it?")
        product_q.append("Does a product site, repository, documentation, or public artifact exist for Comfy MCP?")
    return {"unresolved_ownership_questions": ownership_q,
            "unresolved_product_questions": product_q}
