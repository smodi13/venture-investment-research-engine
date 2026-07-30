"""Deterministic pre-enrichment ownership / attribution / disposition layer.

Six dimensions are kept SEPARATE (mandate):
  1. artifact_evidence_level   (A/B/D — never altered by the registry)
  2. announcement_attribution  (direct_builder_claim/third_party_announcement/
                                industry_commentary/unclear)
  3. actor_project_relation    (self/self_organization/third_party/unclear)
  4. project_identity          (claimed/verified name + source + confidence)
  5. artifact_owner_scope      (established_organization/foundation_or_community/
                                unregistered/unknown)
  6. lead_disposition          (keep_verified/keep_for_enrichment/archive_*/manual_review)

No network. No scoring changes. A Level A artifact stays Level A even if owned by
an established org or mentioned by a third party.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Optional

from .filters import PostExtraction
from .models import EvidenceLevel
from .registry import match_aliases_in_text, match_domain, match_github_owner
from .urlutil import github_owner_repo

# --- lexicon ---------------------------------------------------------------
_BUILD = r"(launched|launching|built|shipped|shipping|open[\s-]?sourced|open[\s-]?sourcing|released|releasing|introduced|introducing|unveiled|unveiling)"
_BUILD_RE = re.compile(_BUILD, re.IGNORECASE)
_FIRST_PERSON = {"we", "i", "our", "we've", "we're", "i've", "i'm", "we'd"}
_ADVERBS = {"just", "today", "recently", "finally", "officially", "now", "also",
            "proudly", "already", "publicly", "first", "this"}
_ARTICLES = {"a", "an", "the", "our", "my", "its"}
_TITLES = {"president", "ceo", "cto", "founder", "cofounder", "co-founder", "vp", "head"}
_PATTERN_WORDS = ["the pattern", "every company", "every organization", "every serious",
                  "converged", "converging", "the wars", " wars", "the shift", "landscape",
                  "the trend", "industry is", "are all building", "everyone is"]
# Posting/discussion platforms are not a company's product domain.
_POSTING_PLATFORMS = {"news.ycombinator.com", "producthunt.com", "reddit.com"}

# Non-X posting domains that are still "resolved" but not the product owner.


@dataclass
class Ownership:
    post_id: str
    announcement_attribution: str = "unclear"
    attribution_evidence: str = ""
    actor_project_relation: str = "unclear"
    actor_evidence: str = ""
    claimed_project_name: Optional[str] = None
    verified_project_name: Optional[str] = None
    project_name_source: str = "none"          # external_artifact|explicit_self_claim|third_party_mention|none
    project_name_confidence: str = "none"      # high|medium|low|none
    project_name_evidence: str = ""
    artifact_evidence_level: list[str] = field(default_factory=list)
    artifact_urls: list[str] = field(default_factory=list)
    github_owner: Optional[str] = None
    github_repository: Optional[str] = None
    github_owner_repository: Optional[str] = None
    github_owner_registry_match: bool = False
    github_owner_registry_entity: Optional[str] = None
    github_owner_registry_type: Optional[str] = None
    artifact_owner_scope: str = "unknown"
    artifact_owner_entity: Optional[str] = None
    artifact_owner_match_basis: str = "none"   # domain_registry|github_owner_registry|explicit_text_attribution|none
    artifact_owner_matched_value: Optional[str] = None
    artifact_owner_match_source: Optional[str] = None
    lead_disposition: str = "manual_review"
    final_disposition_rule: str = ""
    final_disposition_reason: str = ""
    reason_codes: list[str] = field(default_factory=list)
    matched_text_evidence: list[str] = field(default_factory=list)
    matched_artifact_evidence: list[str] = field(default_factory=list)
    matched_registry_evidence: list[str] = field(default_factory=list)


# --- helpers ---------------------------------------------------------------
def _clause_before(text: str, idx: int) -> str:
    start = max((text.rfind(ch, 0, idx) for ch in ".!?\n"), default=-1)
    return text[start + 1:idx]


def _subject_tokens(segment: str) -> list[str]:
    toks = [t for t in re.split(r"\s+", segment.strip()) if t]
    while toks and toks[-1].lower().strip(",.:;") in _ADVERBS:
        toks.pop()
    return toks


def _project_name_after(text: str, end: int) -> tuple[Optional[str], str]:
    tail = text[end:end + 60].lstrip()
    words = tail.split()
    i = 0
    while i < len(words) and words[i].lower().strip(",.:;") in _ARTICLES:
        i += 1
    name_parts: list[str] = []
    for w in words[i:i + 3]:
        wc = w.strip(",.:;!?")
        if wc and (wc[0].isupper() or wc.isupper()):
            name_parts.append(wc)
            # stop at a sentence boundary so we don't absorb the next sentence.
            if w.rstrip()[-1:] in ".!?":
                break
        else:
            break
    if name_parts:
        return " ".join(name_parts), " ".join(words[:i + len(name_parts)])
    return None, ""


def _build_occurrences(text: str) -> list[dict[str, Any]]:
    occ = []
    for m in _BUILD_RE.finditer(text):
        seg = _clause_before(text, m.start())
        toks = _subject_tokens(seg)
        occ.append({"verb": m.group(0), "start": m.start(), "end": m.end(),
                    "subject_tokens": toks, "segment": seg.strip()})
    return occ


def _classify_subject(toks: list[str], full_text: str) -> tuple[str, str, Optional[Any]]:
    """Return (kind, evidence, registry_entity). kind in self|self_org|third_party|ambiguous|implicit_self."""
    if not toks:
        return "implicit_self", "(implicit first-person subject)", None
    tail = " ".join(toks[-3:])
    low = [t.lower().strip(",.:;") for t in toks]
    # "we/our/i at <Org>" affiliation -> self_organization (author works there).
    if "at" in low:
        ai = low.index("at")
        if ai > 0 and low[ai - 1] in _FIRST_PERSON:
            return "self_org", tail, None
    # The grammatical subject is the token immediately before the verb (last token).
    last = low[-1]
    if last in _FIRST_PERSON:
        return ("self" if last == "i" else "self_org"), tail, None
    # registry alias as subject
    matches = match_aliases_in_text(" ".join(toks[-3:]))
    if matches:
        return "third_party", tail, matches[0]
    # person-with-title (e.g. "YC President Garry Tan")
    if any(t.lower().strip(",.:;") in _TITLES for t in toks):
        ents = match_aliases_in_text(" ".join(toks)) or match_aliases_in_text(full_text)
        return "third_party", tail, (ents[0] if ents else None)
    # bare "First Last" capitalized person, only if a registry alias appears elsewhere
    if len(toks) >= 2 and toks[-1][:1].isupper() and toks[-2][:1].isupper():
        ents = match_aliases_in_text(full_text)
        if ents:
            return "third_party", tail, ents[0]
    return "ambiguous", tail, None


def _has_pattern_framing(low: str) -> bool:
    return any(p in low for p in _PATTERN_WORDS)


# --- main ------------------------------------------------------------------
def analyze(ex: PostExtraction, role_fit: bool) -> Ownership:
    post = ex.post
    text = post.text
    low = text.lower()
    o = Ownership(post_id=post.id)

    occ = _build_occurrences(text)
    self_occ, tp_orgs, ambiguous = [], [], []
    for c in occ:
        kind, ev, entity = _classify_subject(c["subject_tokens"], text)
        c["kind"], c["ev"], c["entity"] = kind, ev, entity
        if kind in ("self", "self_org", "implicit_self"):
            self_occ.append(c)
        elif kind == "third_party":
            tp_orgs.append(c)
        else:
            ambiguous.append(c)

    # ---- attribution + actor ----
    if self_occ:
        o.announcement_attribution = "direct_builder_claim"
        first = self_occ[0]
        o.actor_project_relation = "self" if first["kind"] == "self" else "self_organization"
        o.attribution_evidence = f"'{first['segment']} {first['verb']}'".strip()
        o.actor_evidence = o.attribution_evidence
        # claimed project name from the self build action
        name, ev = _project_name_after(text, first["end"])
        if name:
            o.claimed_project_name = name
            o.project_name_evidence = f"'{ev}'"
    elif len(tp_orgs) >= 2 or (_has_pattern_framing(low) and len(tp_orgs) >= 1 and len({c['ev'] for c in tp_orgs}) >= 2):
        o.announcement_attribution = "industry_commentary"
        o.actor_project_relation = "unclear"
        o.attribution_evidence = "; ".join(f"'{c['ev']} {c['verb']}'" for c in tp_orgs[:3])
        o.actor_evidence = o.attribution_evidence
        for c in tp_orgs:
            if c.get("entity"):
                o.matched_registry_evidence.append(f"attribution:{c['entity'].entity_name}")
    elif len(tp_orgs) == 1:
        o.announcement_attribution = "third_party_announcement"
        o.actor_project_relation = "third_party"
        c = tp_orgs[0]
        o.attribution_evidence = f"'{c['ev']} {c['verb']}'"
        o.actor_evidence = o.attribution_evidence
        if c.get("entity"):
            o.matched_registry_evidence.append(f"attribution:{c['entity'].entity_name}")
        name, ev = _project_name_after(text, c["end"])
        if name:
            o.claimed_project_name = name
    else:
        if _has_pattern_framing(low):
            o.announcement_attribution = "industry_commentary"
            o.actor_project_relation = "unclear"
            o.attribution_evidence = "market/architecture commentary; no direct build subject"
        else:
            o.announcement_attribution = "unclear"
            o.actor_project_relation = "unclear"
            o.attribution_evidence = "no clear build subject or ownership signal"
        o.actor_evidence = o.attribution_evidence

    # ---- artifact evidence level (from extraction; X links already excluded) ----
    levels = sorted({s.evidence_level.value for s in ex.signals})
    o.artifact_evidence_level = levels or ["-"]
    o.artifact_urls = [a.url for a in ex.artifacts]
    has_level_a = any(a for a in ex.artifacts)  # any non-X artifact

    # ---- github owner parsing + registry ----
    gh_art = next((a for a in ex.artifacts if a.type.value == "github"), None)
    if gh_art:
        owner_repo = github_owner_repo(gh_art.url)
        if owner_repo and "/" in owner_repo:
            o.github_owner, o.github_repository = owner_repo.split("/", 1)
            o.github_owner_repository = owner_repo
        elif owner_repo:
            o.github_owner = owner_repo
        if o.github_owner:
            m = match_github_owner(o.github_owner)
            o.github_owner_registry_match = m is not None
            if m:
                o.github_owner_registry_entity = m.entity_name
                o.github_owner_registry_type = m.entity_type

    # ---- artifact owner scope (primary project artifact) ----
    _resolve_owner_scope(o, ex, has_level_a)

    # ---- project identity source/confidence ----
    if gh_art and o.github_owner_repository:
        o.verified_project_name = o.github_owner_repository
        o.project_name_source = "external_artifact"
        o.project_name_confidence = "high"
        o.project_name_evidence = gh_art.url
        o.reason_codes.append("PROJECT_NAME_FROM_EXTERNAL_ARTIFACT")
        o.matched_artifact_evidence.append(gh_art.url)
    elif o.announcement_attribution == "direct_builder_claim" and o.claimed_project_name:
        o.project_name_source = "explicit_self_claim"
        o.project_name_confidence = "medium"
        o.reason_codes.append("PROJECT_NAME_FROM_SELF_CLAIM")
    elif o.announcement_attribution == "third_party_announcement" and o.claimed_project_name:
        o.project_name_source = "third_party_mention"
        o.project_name_confidence = "low"
        o.reason_codes.append("PROJECT_NAME_FROM_THIRD_PARTY_MENTION")
    else:
        o.project_name_source = "none"
        o.project_name_confidence = "none"

    # ---- disposition (strict precedence, section 12) ----
    _decide_disposition(o, ex, role_fit, has_level_a)
    return o


def _resolve_owner_scope(o: Ownership, ex: PostExtraction, has_level_a: bool) -> None:
    # Prefer the github owner as the project owner.
    if o.github_owner:
        m = match_github_owner(o.github_owner)
        if m:
            o.artifact_owner_scope = m.owner_scope
            o.artifact_owner_entity = m.entity_name
            o.artifact_owner_match_basis = "github_owner_registry"
            o.artifact_owner_matched_value = m.matched_value
            o.artifact_owner_match_source = "github_owner"
            o.matched_registry_evidence.append(f"github_owner:{m.matched_value}->{m.entity_name}")
        else:
            o.artifact_owner_scope = "unregistered"
            o.artifact_owner_match_basis = "none"
            o.artifact_owner_matched_value = o.github_owner
        return
    # Else a product-domain artifact (excluding posting platforms).
    for a in ex.artifacts:
        if a.type.value in ("product_url", "docs", "pricing", "changelog"):
            from .urlutil import bare_host
            host = bare_host(a.url)
            if host in _POSTING_PLATFORMS:
                continue
            m = match_domain(host)
            if m:
                o.artifact_owner_scope = m.owner_scope
                o.artifact_owner_entity = m.entity_name
                o.artifact_owner_match_basis = "domain_registry"
                o.artifact_owner_matched_value = m.matched_value
                o.artifact_owner_match_source = "domain"
                o.matched_registry_evidence.append(f"domain:{m.matched_value}->{m.entity_name}")
            else:
                o.artifact_owner_scope = "unregistered"
                o.artifact_owner_matched_value = host
            return
    # No usable artifact owner.
    o.artifact_owner_scope = "unregistered" if has_level_a else "unknown"


def _explicit_registry_org_in_builder_claim(o: Ownership, ex: PostExtraction) -> Optional[Any]:
    """A registry org explicitly tied to a self/self_org build claim."""
    if o.artifact_owner_match_basis in ("github_owner_registry", "domain_registry") \
            and o.artifact_owner_scope in ("established_organization", "foundation_or_community"):
        return o.artifact_owner_entity
    # explicit "we at <RegistryOrg>" text attribution
    m = re.search(r"\b[Ww]e(?:\s+[Aa]t)?\s+([A-Z][\w&.\- ]+?)\b", ex.post.text)
    if m:
        for rm in match_aliases_in_text(ex.post.text):
            if rm.entity_name.lower() in m.group(1).lower() or rm.matched_value.lower() in m.group(1).lower():
                o.artifact_owner_match_basis = "explicit_text_attribution"
                o.matched_registry_evidence.append(f"text:{rm.matched_value}->{rm.entity_name}")
                return rm.entity_name
    return None


def _decide_disposition(o: Ownership, ex: PostExtraction, role_fit: bool, has_level_a: bool) -> None:
    attr = o.announcement_attribution
    actor = o.actor_project_relation

    # 1. industry_commentary
    if attr == "industry_commentary":
        o.lead_disposition = "archive_commentary"
        o.final_disposition_rule = "1:industry_commentary->archive_commentary"
        o.final_disposition_reason = "Discusses a trend/pattern across companies; no direct builder ownership."
        o.reason_codes.append("COMMENTARY_NO_OWNERSHIP")
        return
    # 2. third_party_announcement
    if attr == "third_party_announcement":
        o.lead_disposition = "archive_third_party"
        o.final_disposition_rule = "2:third_party_announcement->archive_third_party"
        o.final_disposition_reason = "Primarily reports another named org/person's release; author ownership not established."
        o.reason_codes.append("THIRD_PARTY_ANNOUNCEMENT")
        if not has_level_a:
            o.reason_codes.append("X_ONLY_ARTIFACT" if ex.post.url_details else "NO_VERIFIABLE_OR_SELF_CLAIM_SIGNAL")
        return
    # 3. actor third_party
    if actor == "third_party":
        o.lead_disposition = "archive_third_party"
        o.final_disposition_rule = "3:actor_third_party->archive_third_party"
        o.final_disposition_reason = "Launch actor is a third party; author ownership not established."
        o.reason_codes.append("THIRD_PARTY_ANNOUNCEMENT")
        return
    # 4. direct builder explicitly tied to a registry-matched org
    if attr == "direct_builder_claim":
        org = _explicit_registry_org_in_builder_claim(o, ex)
        if org:
            o.lead_disposition = "archive_established_org"
            o.final_disposition_rule = "4:direct_builder+registry_org->archive_established_org"
            o.final_disposition_reason = f"Direct builder claim tied to registry org '{org}'."
            o.reason_codes.append("ESTABLISHED_ORG_RELEASE")
            o.reason_codes.append("ESTABLISHED_GITHUB_OWNER" if o.artifact_owner_match_source == "github_owner" else
                                  "ESTABLISHED_PRODUCT_DOMAIN" if o.artifact_owner_match_source == "domain" else
                                  "EXPLICIT_TEXT_ORGANIZATION_MATCH")
            return
        # 5. verified external artifact -> keep_verified
        if has_level_a and role_fit:
            o.lead_disposition = "keep_verified"
            o.final_disposition_rule = "5:direct_builder+verified_artifact->keep_verified"
            o.final_disposition_reason = "Direct builder claim with a verifiable non-X artifact and role fit."
            o.reason_codes.append("DIRECT_BUILDER_WITH_VERIFIED_ARTIFACT")
            o.reason_codes.append("REGISTRY_NO_MATCH")
            return
        # 6. no verified artifact -> keep_for_enrichment
        if role_fit:
            o.lead_disposition = "keep_for_enrichment"
            o.final_disposition_rule = "6:direct_builder+no_verified_artifact->keep_for_enrichment"
            o.final_disposition_reason = "Direct builder claim with role fit but no verifiable non-X artifact yet."
            o.reason_codes.append("DIRECT_BUILDER_REQUIRES_ENRICHMENT")
            if ex.post.url_details and not has_level_a:
                o.reason_codes.append("X_ONLY_ARTIFACT")
            return
    # 7. unresolved
    o.lead_disposition = "manual_review"
    o.final_disposition_rule = "7:unresolved->manual_review"
    o.final_disposition_reason = "Relevant subject matter but ownership/actor relation unresolved."
    o.reason_codes.append("ACTOR_PROJECT_RELATION_UNCLEAR")
    if not has_level_a:
        o.reason_codes.append("NO_VERIFIABLE_OR_SELF_CLAIM_SIGNAL")


def next_enrichment_question(o: Ownership) -> str:
    if o.lead_disposition == "keep_verified":
        return (f"Confirm {o.verified_project_name or o.claimed_project_name} is an independent "
                "venture (not a subsidiary/open-source side project) and identify the founding team.")
    if o.lead_disposition == "keep_for_enrichment":
        return (f"Is there a public non-X artifact (repo, site, docs) for "
                f"'{o.claimed_project_name or 'the project'}', and who owns it?")
    return "Resolve who built the project and whether a verifiable external artifact exists."
