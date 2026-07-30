"""Deterministic local processing of the saved broad-market Post responses.

Consumes only saved files under data/output/broad_market_4000/ (new-only parsed
posts + provenance + raw pages). Reuses the corrected URL-entity parser, the
organization registry, and the deterministic attribution grammar. Never calls the
network, GitHub, an LLM, or any external URL. The LLM never scores.

Layers per Post: URL/artifact extraction -> announcement attribution ->
actor-project relation -> project/company identity -> artifact + hardware evidence
-> organization scoping -> sector classification -> broad_market_relevance +
headline_mandate_fit + general_venture_attractiveness -> lead disposition + reason
codes -> 100-point research score. Then deterministic company consolidation and
query/sector/broad-group metrics.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from decimal import Decimal
from pathlib import Path
from typing import Any, Optional

from . import broad_market as BM
from .money import money_str, parse_money
from .registry import match_domain, match_github_owner
from .urlutil import github_owner_repo, normalized_domain
from .x_client import _extract_url_details

BROAD_DIR = BM.BROAD_DIR
PROCESSED_DIR = BROAD_DIR / "processed"
POST_READ_USD = Decimal("0.005")

# Authors already enriched in prior runs (must be excluded from proposed enrichment).
PRIOR_ENRICHED_AUTHOR_IDS = {
    "15963134", "2061874923639836672", "2063311066294054912",
    "1581663006328778753", "1728811697035677696", "176285260", "1858065635223261184",
    "1984220819657285632", "2065358674076319746", "2068381226306822144", "2068596121732055041",
}

# ---------------------------------------------------------------------------
# Grammar / keyword tables (all deterministic, no network)
# ---------------------------------------------------------------------------
_BUILD = (r"(built|build|building|launched|launch|launching|shipped|shipping|ship|"
          r"deployed|deploy|deploying|installed|install|open[\s-]?sourced|open[\s-]?source|"
          r"released|releasing|release|made|created|prototyped|manufactured|manufacturing|"
          r"taped[\s-]?out)")
_BUILD_RE = re.compile(_BUILD, re.I)
_SENT_SPLIT = re.compile(r"[.!?\n]")
_ADVERBS = {"just", "now", "recently", "finally", "officially", "today", "already",
            "also", "proudly", "happily", "excitedly", "literally", "basically"}
_FIRST_PERSON = {"we", "i", "our", "my", "we've", "i've", "we're", "weve", "ive"}

_SELF_PHRASES = re.compile(
    r"\b(our (product|prototype|app|tool|platform|device|first units|beta|launch|company|startup)|"
    r"we (started|launched|shipped|built|deployed|installed|open[\s-]?sourced|received)|"
    r"i (built|launched|shipped|made|created|open[\s-]?sourced)|"
    r"first units|our first (purchase order|customer|units))\b", re.I)

_INTRO_NAME = re.compile(
    r"(?:introducing|meet|launching|announcing|say hello to|our (?:product|app|tool|platform) (?:called )?)\s+"
    r"([A-Z][A-Za-z0-9][A-Za-z0-9._-]{1,30})")

# out-of-scope / spam / non-venture
_OUT_OF_SCOPE = re.compile(
    r"\b(giveaway|airdrop|free crypto|casino|betting|forex signal|follow for follow|f4f|"
    r"onlyfans|nsfw|we'?re hiring|now hiring|job opening|apply now|we are hiring|"
    r"enroll now|free course|free webinar|link in bio for course|dm me to|"
    r"pump|memecoin|meme coin|token launch|presale|nft mint|whitelist)\b", re.I)
_SERVICES = re.compile(
    r"\b(agency|consulting|consultancy|freelance|dev shop|we build (apps|websites|software) for|"
    r"done[\s-]?for[\s-]?you|hire us|fractional (cto|cmo|cfo)|we offer .* services|"
    r"outsourc\w+|staffing)\b", re.I)
_MARKETPLACE = re.compile(
    r"\b(amazon|affiliate|coupon|discount code|use code|promo code|dropship\w*|reseller|"
    r"buy now on|shop now|etsy|aliexpress|available on amazon|link to buy)\b", re.I)
_COMMENTARY = re.compile(
    r"\b(i think|imo|in my opinion|great to see|excited to see|congrats|congratulations|"
    r"check out|interesting|love this|this is (cool|great|awesome)|kudos|shoutout|shout out|"
    r"h/t|hat tip|thread on|here'?s why|hot take)\b", re.I)

# hardware / physical-product evidence tokens
_HW_EVIDENCE = {
    "functioning_prototype": re.compile(r"\b(working prototype|functioning prototype|prototype (?:is )?(?:working|running|live)|demo unit)\b", re.I),
    "prototype_video_only": re.compile(r"\b(prototype (?:video|demo)|video of (?:our|the) prototype|watch (?:our|the) prototype)\b", re.I),
    "technical_specification": re.compile(r"\b(spec sheet|technical spec\w*|datasheet|specifications?)\b", re.I),
    "manufacturing_evidence": re.compile(r"\b(manufactured|in production|production line|mass production|assembling units)\b", re.I),
    "manufacturing_partner_claim": re.compile(r"\b(manufacturing partner|contract manufacturer|foundry partner|fab partner)\b", re.I),
    "certification_evidence": re.compile(r"\b(ce mark|ul listed|iso \d|rohs|fcc (?:id|certified)|certified)\b", re.I),
    "regulatory_submission": re.compile(r"\b(fda submission|510\(k\)|ce submission|regulatory submission|filed with the fda)\b", re.I),
    "regulatory_approval": re.compile(r"\b(fda approved|fda clearance|ce approved|received approval|got approval)\b", re.I),
    "clinical_pilot": re.compile(r"\b(clinical pilot|clinical trial|first patient|clinical study|in the clinic)\b", re.I),
    "pilot_installation": re.compile(r"\b(first installation|pilot install|installed at|deployment at|field pilot)\b", re.I),
    "customer_deployment": re.compile(r"\b(deployed (?:at|with|for)|in production at|rolled out to|live with (?:our )?customer)\b", re.I),
    "purchase_order_claim": re.compile(r"\b(purchase order|first PO|received (?:our )?first order|signed (?:a )?PO)\b", re.I),
    "shipped_units_claim": re.compile(r"\b(shipped (?:our )?(?:first )?units|units shipped|shipping units|first units shipped)\b", re.I),
    "preorder_claim": re.compile(r"\b(pre[\s-]?order|preorders? (?:open|live)|reserve yours)\b", re.I),
    "crowdfunding_claim": re.compile(r"\b(kickstarter|indiegogo|crowdfund\w*|backers|backed us)\b", re.I),
    "patent_claim": re.compile(r"\b(patent(?:ed|-pending| pending)?|provisional patent|filed a patent)\b", re.I),
    "first_units_claim": re.compile(r"\b(first units|first batch|first run of units)\b", re.I),
    "commercial_availability_claim": re.compile(r"\b(now available|generally available|buy (?:it )?now|on sale now|order now|commercially available)\b", re.I),
    "independent_demonstration": re.compile(r"\b(demoed at|featured at|showcased at|live demo at)\b", re.I),
}

# sector keyword tables (primary product-sector inference)
_SECTOR_KEYWORDS = {
    "ai_infrastructure": ["mcp server", "agent runtime", "inference server", "model serving",
                          "vector database", "data infrastructure", "gpu", "ai infrastructure",
                          "orchestration", "fine-tun", "llm serving", "rag pipeline"],
    "ai_application_software": ["ai agent", "ai copilot", "vertical ai", "ai coding", "ai testing",
                               "ai security", "evals", "workflow automation", "copilot", "llm app",
                               "ai app", "ai-native", "ai assistant"],
    "developer_infrastructure": ["developer tool", "devtool", "api", "database", "observability",
                                "devops", "ci/cd", "sdk", "data engineering", "open source library"],
    "cybersecurity": ["cybersecurity", "identity security", "application security", "cloud security",
                     "compliance", "soc 2", "pentest", "threat", "zero trust", "siem"],
    "fintech_software": ["accounts payable", "treasury", "payroll", "procurement", "expense management",
                        "financial operations", "fintech", "payments", "invoicing", "banking"],
    "vertical_saas": ["vertical saas", "practice management", "field service", "construction software",
                     "healthcare software", "legal software", "dental", "restaurant software"],
    "non_ai_b2b_saas": ["b2b saas", "enterprise software", "workflow software", "crm", "sales software",
                       "customer support", "customer success", "revenue operations", "hr software"],
    "hardware_deeptech": ["robot", "robotics", "drone", "autonomous", "semiconductor", "chip",
                         "photonics", "sensor", "accelerator", "edge compute", "silicon", "lidar",
                         "quantum", "hardware"],
    "climate_energy": ["battery", "energy storage", "solar", "grid", "hydrogen", "geothermal",
                      "carbon removal", "climate", "clean energy", "ev charging", "renewable"],
    "medical_device": ["medical device", "diagnostics", "surgical", "health hardware", "wearable",
                      "clinical", "fda", "biotech device", "implant", "medtech"],
    "industrial_manufacturing": ["supply chain", "logistics", "manufacturing", "warehouse", "industrial",
                                "additive manufacturing", "3d printing", "factory", "advanced materials",
                                "cnc", "automation hardware"],
    "consumer_hardware": ["consumer hardware", "smart home", "camera", "audio device", "mobility",
                        "headphones", "gadget", "wearable device", "smart device"],
}
_HARDWARE_SECTORS = {"hardware_deeptech", "climate_energy", "medical_device",
                     "industrial_manufacturing", "consumer_hardware"}
_AI_SECTORS = {"ai_infrastructure", "ai_application_software"}
_NON_AI_SOFTWARE_SECTORS = {"non_ai_b2b_saas", "developer_infrastructure", "cybersecurity",
                            "fintech_software", "vertical_saas"}
_HEADLINE_HIGH = {"ai_infrastructure", "ai_application_software", "developer_infrastructure"}
_HEADLINE_MEDIUM = {"non_ai_b2b_saas", "cybersecurity", "fintech_software", "vertical_saas"}

# Third-party platforms / aggregators / news: a link here proves a mention exists
# but is NOT the builder's own verifiable product artifact (no Level A on its own).
_NON_ARTIFACT_PLATFORMS = {
    "youtube.com", "youtu.be", "amazon.com", "amzn.to", "linkedin.com", "medium.com",
    "substack.com", "reddit.com", "facebook.com", "instagram.com", "tiktok.com",
    "threads.net", "producthunt.com", "kickstarter.com", "indiegogo.com", "patreon.com",
    "reuters.com", "bloomberg.com", "techcrunch.com", "theverge.com", "forbes.com",
    "cnbc.com", "businessinsider.com", "wsj.com", "nytimes.com", "dailytelegraph.com.au",
    "telegraph.co.uk", "theguardian.com", "wired.com", "arstechnica.com", "venturebeat.com",
    "notion.site", "notion.so", "google.com", "docs.google.com", "drive.google.com",
    "eventbrite.com", "meetup.com", "discord.com", "discord.gg", "t.me", "calendly.com",
}

_ARTIFACT_PATH_HINTS = [
    ("docs", "documentation"), ("documentation", "documentation"), ("/api", "api_page"),
    ("developer", "api_page"), ("changelog", "changelog"), ("/blog/changelog", "changelog"),
    ("demo", "live_demo"), ("app.", "live_demo"), ("spec", "technical_specification"),
    ("datasheet", "technical_specification"), ("fda", "regulatory_certification"),
    ("certification", "regulatory_certification"), ("/product", "company_product_page"),
    ("/products", "company_product_page"),
]


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------
@dataclass
class ProcessedRecord:
    post_id: str
    author_id: str
    text: str
    created_at: Optional[str]
    lang: Optional[str]
    public_metrics: dict
    source_queries: list[str]
    source_pages: list[int]
    source_run: str
    post_url: str
    entities_present: bool
    referenced_tweets_present: bool
    is_retweet: bool
    is_reply: bool
    # artifacts
    artifacts: list[dict] = field(default_factory=list)
    has_level_a: bool = False
    x_only_links: bool = False
    # attribution / actor
    announcement_attribution: str = "unclear"
    actor_project_relation: str = "unclear"
    # identity
    claimed_project_name: Optional[str] = None
    verified_project_name: Optional[str] = None
    claimed_company_name: Optional[str] = None
    normalized_company_or_project_name: Optional[str] = None
    project_name_source: str = "none"
    project_name_confidence: str = "none"
    # organization scope
    artifact_owner_scope: str = "unknown"
    artifact_owner_entity: Optional[str] = None
    artifact_owner_match_basis: Optional[str] = None
    # evidence
    evidence_levels: list[str] = field(default_factory=list)
    hardware_evidence: dict = field(default_factory=dict)
    # sector
    sector_bucket: str = "unclear"
    source_query_sector: Optional[str] = None
    inferred_product_sector: Optional[str] = None
    sector_confidence: str = "low"
    sector_evidence: list[str] = field(default_factory=list)
    broad_group: Optional[str] = None
    # relevance / fit
    broad_market_relevance: str = "unclear"
    headline_mandate_fit: str = "unclear"
    general_venture_attractiveness: str = "unclear"
    # disposition
    lead_disposition: str = "manual_review"
    reason_codes: list[str] = field(default_factory=list)
    reason_evidence: dict = field(default_factory=dict)
    unresolved_questions: list[str] = field(default_factory=list)
    # score
    research_score: int = 0
    score_breakdown: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items()}


# ---------------------------------------------------------------------------
# Loading + integrity
# ---------------------------------------------------------------------------
def load_manifest_integrity() -> dict:
    manifest = json.loads((BROAD_DIR / "broad_run_manifest.json").read_text())
    ledger = json.loads((BROAD_DIR / "broad_run_cost_ledger.json").read_text())
    dedup = json.loads((BROAD_DIR / "cross_run_dedup_audit.json").read_text())
    parsed = json.loads((BROAD_DIR / "parsed_posts.json").read_text())
    return {
        "posts_retrieved": manifest["posts_retrieved"],
        "new_discovery_count": manifest["new_discovery_count"],
        "http_requests": manifest["http_requests"],
        "estimated_cost_usd": ledger["estimated_cost_usd"],
        "exec_error": manifest["exec_error"],
        "cross_run_duplicates": len(dedup["cross_run_duplicates"]),
        "within_run_duplicates": len(dedup["within_run_duplicates"]),
        "parsed_new_count": len(parsed),
    }


def _post_page_map() -> dict[str, dict[str, int]]:
    """post_id -> {query_id: earliest page it appeared on}. From raw page files."""
    out: dict[str, dict[str, int]] = {}
    raw_dir = BROAD_DIR / "raw_responses_by_query_and_page"
    for f in sorted(raw_dir.glob("*.json")):
        stem = f.stem
        qid, _, ptxt = stem.rpartition("_page")
        page = int(ptxt) if ptxt.isdigit() else 1
        d = json.loads(f.read_text())
        for t in (d.get("data") or []) if isinstance(d, dict) else []:
            pid = str(t.get("id"))
            out.setdefault(pid, {})
            if qid not in out[pid] or page < out[pid][qid]:
                out[pid][qid] = page
    return out


def load_new_posts() -> list[dict]:
    return json.loads((BROAD_DIR / "parsed_posts.json").read_text())


def load_provenance() -> dict[str, list[str]]:
    return json.loads((BROAD_DIR / "query_provenance_audit.json").read_text())


# ---------------------------------------------------------------------------
# Per-post deterministic processing
# ---------------------------------------------------------------------------
def _artifact_type(url_info: dict) -> str:
    canon = (url_info.get("selected_canonical_url") or "").lower()
    if github_owner_repo(url_info.get("expanded_url") or url_info.get("unwound_url") or canon or ""):
        return "github_repository"
    for hint, atype in _ARTIFACT_PATH_HINTS:
        if hint in canon:
            return atype
    return "product_website"


def extract_artifacts(entities: dict) -> tuple[list[dict], bool, bool]:
    """Return (artifacts, has_level_a, x_only_links). Reuses the corrected parser."""
    details = _extract_url_details(entities or {})
    artifacts, product_seen, any_link = [], False, False
    for d in details:
        any_link = True
        if not d.get("is_product_domain"):
            continue  # x.com / twitter.com / t.co / unresolved shortener excluded
        dom = (d.get("normalized_domain") or "").lower()
        platform = dom in _NON_ARTIFACT_PLATFORMS
        gh = github_owner_repo(d.get("expanded_url") or d.get("unwound_url") or d.get("selected_canonical_url") or "")
        if not platform:
            product_seen = True  # a real, builder-ownable external artifact
        artifacts.append({
            "original_url": d.get("original_short_url"),
            "expanded_url": d.get("expanded_url"),
            "unwound_url": d.get("unwound_url"),
            "canonical_url": d.get("selected_canonical_url"),
            "normalized_domain": d.get("normalized_domain"),
            "github_owner": gh.split("/")[0] if gh else None,
            "github_repository": gh if gh and "/" in gh else None,
            "artifact_type": ("third_party_platform_link" if platform else _artifact_type(d)),
            "is_verifiable_product_artifact": not platform,
            "resolution_status": d.get("url_resolution_status"),
        })
    # X-only OR only third-party-platform links => no verifiable own artifact
    x_only = any_link and not product_seen
    return artifacts, product_seen, x_only


def _subject_before(text: str, verb_start: int) -> Optional[str]:
    seg = text[:verb_start]
    parts = _SENT_SPLIT.split(seg)
    clause = parts[-1] if parts else seg
    toks = re.findall(r"[A-Za-z][A-Za-z0-9'&./-]*", clause)
    while toks and toks[-1].lower() in _ADVERBS:
        toks.pop()
    return toks[-1] if toks else None


def classify_attribution(text: str) -> tuple[str, str]:
    """Return (announcement_attribution, actor_project_relation)."""
    has_self = has_third = has_unclear_build = False
    self_org = False
    if _SELF_PHRASES.search(text):
        has_self = True
        self_org = bool(re.search(r"\b(we|our|we've|we're)\b", text, re.I)) and not re.search(r"^\s*i\b", text, re.I)
    for m in _BUILD_RE.finditer(text):
        subj = _subject_before(text, m.start())
        if subj is None:
            continue
        low = subj.lower()
        if low in _FIRST_PERSON:
            has_self = True
            if low in {"we", "our", "we've", "we're", "weve"}:
                self_org = True
        elif subj[0].isupper() and low not in {"the", "a", "an", "this", "it", "they"}:
            has_third = True
        else:
            has_unclear_build = True
    if has_self:
        return "direct_builder_claim", ("self_organization" if self_org else "self")
    if has_third:
        return "third_party_announcement", "third_party"
    if has_unclear_build:
        return "unclear", "unclear"
    if _COMMENTARY.search(text):
        return "industry_commentary", "third_party"
    return "unclear", "unclear"


def classify_sector(text: str, source_query_sector: Optional[str]) -> tuple[str, Optional[str], str, list[str]]:
    low = text.lower()
    scores: dict[str, int] = {}
    evidence: dict[str, list[str]] = {}
    for bucket, kws in _SECTOR_KEYWORDS.items():
        hits = [k for k in kws if k in low]
        if hits:
            scores[bucket] = len(hits)
            evidence[bucket] = hits
    if scores:
        best = max(scores, key=lambda b: (scores[b], b))
        inferred = best
        conf = "high" if scores[best] >= 2 else "medium"
        return best, inferred, conf, evidence[best]
    # fall back to the query's declared sector
    if source_query_sector:
        return source_query_sector, None, "low", ["source_query_sector_fallback"]
    return "unclear", None, "low", []


def hardware_evidence(text: str, sector: str) -> dict:
    if sector not in _HARDWARE_SECTORS:
        return {}
    out = {}
    for name, rx in _HW_EVIDENCE.items():
        m = rx.search(text)
        if m:
            out[name] = m.group(0)
    return out


def project_identity(text: str, artifacts: list[dict]) -> dict:
    verified = claimed = None
    src = "none"
    conf = "none"
    # external artifact name (deterministic, from domain / repo) — never from a
    # third-party platform link (youtube/amazon/news/etc.)
    for a in artifacts:
        if not a.get("is_verifiable_product_artifact"):
            continue
        if a.get("github_repository"):
            verified = a["github_repository"].split("/")[-1]
            src, conf = "external_artifact", "high"
            break
        dom = a.get("normalized_domain")
        if dom:
            label = dom.split(".")[0]
            if label and label not in {"www", "app", "docs", "api", "site", "accio", "vercel", "netlify", "github", "notion"}:
                verified = label
                src, conf = "external_artifact", "medium"
                break
    m = _INTRO_NAME.search(text)
    if m:
        claimed = m.group(1).strip(".-_")
        if src == "none":
            src, conf = "explicit_self_claim", "medium"
    norm = (verified or claimed)
    return {
        "claimed_project_name": claimed,
        "verified_project_name": verified,
        "claimed_company_name": claimed,
        "normalized_company_or_project_name": norm.lower() if norm else None,
        "project_name_source": src,
        "project_name_confidence": conf,
    }


def organization_scope(artifacts: list[dict]) -> dict:
    for a in artifacts:
        if a.get("github_owner"):
            m = match_github_owner(a["github_owner"])
            if m:
                return {"artifact_owner_scope": m.owner_scope, "artifact_owner_entity": m.entity_name,
                        "artifact_owner_match_basis": f"github_owner:{m.matched_value}"}
        dom = a.get("normalized_domain")
        if dom:
            m = match_domain(dom)
            if m:
                return {"artifact_owner_scope": m.owner_scope, "artifact_owner_entity": m.entity_name,
                        "artifact_owner_match_basis": f"domain:{m.matched_value}"}
    if artifacts:
        return {"artifact_owner_scope": "unregistered", "artifact_owner_entity": None,
                "artifact_owner_match_basis": "registry_no_match"}
    return {"artifact_owner_scope": "unknown", "artifact_owner_entity": None,
            "artifact_owner_match_basis": None}


def broad_relevance(text: str, sector: str, has_artifact: bool, attribution: str) -> str:
    if _OUT_OF_SCOPE.search(text):
        return "out_of_scope"
    if sector != "unclear":
        return "in_scope"
    if has_artifact and attribution == "direct_builder_claim":
        return "in_scope"
    return "unclear"


def headline_fit(sector: str, relevance: str) -> str:
    if relevance == "out_of_scope":
        return "outside"
    if sector in _HEADLINE_HIGH:
        return "high"
    if sector in _HEADLINE_MEDIUM:
        return "medium"
    if sector in _HARDWARE_SECTORS:
        return "low"
    return "unclear"


def _services_signal(text: str) -> bool:
    return bool(_SERVICES.search(text))


def _marketplace_signal(text: str) -> bool:
    return bool(_MARKETPLACE.search(text))


def disposition_and_reasons(rec: ProcessedRecord) -> tuple[str, list[str], dict]:
    codes: list[str] = []
    ev: dict = {}
    text = rec.text
    attr, actor = rec.announcement_attribution, rec.actor_project_relation
    # relevance code
    if rec.broad_market_relevance == "in_scope":
        codes.append("BROAD_MARKET_IN_SCOPE")
    elif rec.broad_market_relevance == "out_of_scope":
        codes.append("BROAD_MARKET_OUT_OF_SCOPE")
    if rec.x_only_links:
        codes.append("X_ONLY_ARTIFACT")
    if rec.artifacts and rec.artifact_owner_scope == "unregistered":
        codes.append("REGISTRY_NO_MATCH")
    # hardware caveats (reported, never upgraded)
    hw = rec.hardware_evidence
    if "preorder_claim" in hw:
        codes.append("PREORDER_NOT_REVENUE")
    if "crowdfunding_claim" in hw:
        codes.append("CROWDFUNDING_NOT_RECURRING_REVENUE")
    if "purchase_order_claim" in hw:
        codes.append("PURCHASE_ORDER_UNVERIFIED")
    if "clinical_pilot" in hw or "pilot_installation" in hw:
        codes.append("PILOT_STATUS_UNVERIFIED")
    if ("regulatory_submission" in hw or "regulatory_approval" in hw) and "regulatory_approval" not in hw:
        codes.append("REGULATORY_STATUS_UNVERIFIED")
    if hw and not rec.has_level_a and rec.broad_market_relevance != "out_of_scope":
        codes.append("PROTOTYPE_NOT_COMMERCIAL")
    if rec.normalized_company_or_project_name is None:
        codes.append("COMPANY_IDENTITY_UNRESOLVED")

    # precedence
    if attr == "industry_commentary":
        codes.append("COMMENTARY_NO_OWNERSHIP")
        return "archive_commentary", codes, ev
    if attr == "third_party_announcement" or actor == "third_party":
        codes.append("THIRD_PARTY_ANNOUNCEMENT")
        return "archive_third_party", codes, ev
    if attr == "direct_builder_claim" and rec.artifact_owner_scope in ("established_organization", "foundation_or_community"):
        basis = rec.artifact_owner_match_basis or ""
        codes.append("ESTABLISHED_ORG_RELEASE")
        if basis.startswith("github_owner"):
            codes.append("ESTABLISHED_GITHUB_OWNER")
        if basis.startswith("domain"):
            codes.append("ESTABLISHED_PRODUCT_DOMAIN")
        ev["established_org"] = rec.artifact_owner_entity
        return "archive_established_org", codes, ev
    if _services_signal(text):
        codes.append("SERVICES_BUSINESS_SIGNAL")
        return "archive_services_business", codes, ev
    if _marketplace_signal(text):
        codes.append("MARKETPLACE_OR_RESELLER_SIGNAL")
        return "archive_marketplace_or_reseller", codes, ev
    if rec.broad_market_relevance == "out_of_scope":
        return "archive_out_of_scope", codes, ev
    if attr == "direct_builder_claim" and rec.has_level_a:
        codes.append("DIRECT_BUILDER_WITH_VERIFIED_ARTIFACT")
        return "keep_verified", codes, ev
    if attr == "direct_builder_claim" and not rec.has_level_a:
        codes.append("DIRECT_BUILDER_REQUIRES_ENRICHMENT")
        return "keep_for_enrichment", codes, ev
    if attr == "unclear" and rec.broad_market_relevance in ("in_scope", "unclear") and (rec.has_level_a or rec.sector_bucket != "unclear"):
        codes.append("ACTOR_PROJECT_RELATION_UNCLEAR")
        return "manual_review", codes, ev
    codes.append("NO_VERIFIABLE_OR_SELF_CLAIM_SIGNAL")
    return "archive_low_quality", codes, ev


def score_record(rec: ProcessedRecord) -> tuple[int, dict]:
    b: dict[str, int] = {}
    # category / broad-market fit (15)
    b["broad_market_fit"] = 15 if rec.broad_market_relevance == "in_scope" else (7 if rec.broad_market_relevance == "unclear" else 0)
    # ownership + identity (15)
    own = 0
    if rec.announcement_attribution == "direct_builder_claim":
        own += 9
    if rec.actor_project_relation in ("self", "self_organization"):
        own += 3
    if rec.normalized_company_or_project_name:
        own += 3
    b["ownership_identity"] = min(own, 15)
    # founder/team signal from the Post (10) — deterministic text cues only
    team = 0
    if re.search(r"\b(founder|co[\s-]?founder|founding (engineer|team)|our team|we are a team|ex[- ](google|meta|stripe|openai|amazon|apple))\b", rec.text, re.I):
        team += 6
    if rec.actor_project_relation == "self_organization":
        team += 4
    b["founder_team_signal"] = min(team, 10)
    # product/technical evidence (15)
    prod = 0
    if rec.has_level_a:
        prod += 8
    if any(a["artifact_type"] in ("github_repository", "documentation", "api_page", "technical_specification") for a in rec.artifacts):
        prod += 4
    if rec.hardware_evidence.get("functioning_prototype") or rec.hardware_evidence.get("technical_specification"):
        prod += 3
    b["product_technical_evidence"] = min(prod, 15)
    # customer / deployment / adoption (15)
    cust = 0
    for k, pts in (("customer_deployment", 8), ("pilot_installation", 5), ("purchase_order_claim", 4),
                   ("customer_or_partner_name", 4), ("shipped_units_claim", 4)):
        if rec.hardware_evidence.get(k):
            cust += pts
    if re.search(r"\b(first customer|design partner|paid pilot|in production|migrated from|customers? (?:are )?using)\b", rec.text, re.I):
        cust += 6
    b["customer_adoption"] = min(cust, 15)
    # recurring workflow / repeat purchase (10)
    rec_wf = 0
    if rec.sector_bucket in _NON_AI_SOFTWARE_SECTORS | _AI_SECTORS:
        rec_wf += 6  # software = recurring workflow potential
    if re.search(r"\b(subscription|seats|per month|recurring|renewal|repeat order)\b", rec.text, re.I):
        rec_wf += 4
    b["recurring_potential"] = min(rec_wf, 10)
    # differentiation / defensibility hypothesis (10)
    diff = 0
    if rec.hardware_evidence.get("patent_claim"):
        diff += 3
    if rec.sector_bucket in _HARDWARE_SECTORS | {"ai_infrastructure", "cybersecurity"}:
        diff += 4
    if re.search(r"\b(proprietary|novel|breakthrough|10x faster|outperforms|state of the art|sota)\b", rec.text, re.I):
        diff += 3
    b["differentiation"] = min(diff, 10)
    # shipping / execution momentum (5)
    b["execution_momentum"] = 5 if re.search(r"\b(launched|shipped|now live|deployed|first units|open[\s-]?sourced)\b", rec.text, re.I) else 0
    # financing / formation timing (5)
    b["financing_timing"] = 5 if re.search(r"\b(raised|seed round|pre[\s-]?seed|angel round|just incorporated|started a company|building in stealth|founding)\b", rec.text, re.I) else 0
    total = sum(b.values())
    # archived dispositions cannot present as strong ventures
    if rec.lead_disposition in ("archive_third_party", "archive_commentary", "archive_low_quality",
                                "archive_out_of_scope", "archive_services_business",
                                "archive_marketplace_or_reseller"):
        total = min(total, 30)
    return total, b


def _venture_band(score: int, disposition: str) -> str:
    if disposition.startswith("archive"):
        return "very_low" if score < 20 else "low"
    if score >= 75:
        return "very_high"
    if score >= 60:
        return "high"
    if score >= 45:
        return "moderate"
    if score >= 30:
        return "low"
    if score > 0:
        return "very_low"
    return "unclear"


def _unresolved_questions(rec: ProcessedRecord) -> list[str]:
    qs = []
    if rec.actor_project_relation == "unclear":
        qs.append("Is the author the builder/owner, or reporting on someone else's work?")
    if rec.normalized_company_or_project_name is None:
        qs.append("What is the company/project name and is a legal entity formed?")
    if rec.announcement_attribution == "direct_builder_claim" and not rec.has_level_a:
        qs.append("Is there a verifiable external artifact (site/repo/docs) for this claim?")
    if rec.sector_bucket in _HARDWARE_SECTORS:
        if rec.hardware_evidence.get("purchase_order_claim"):
            qs.append("Is the purchase order verifiable and is it a paying customer?")
        if rec.hardware_evidence.get("clinical_pilot") or "fda" in rec.text.lower():
            qs.append("What is the actual regulatory/clinical status (submission vs approval)?")
    return qs


# ---------------------------------------------------------------------------
# Top-level per-post
# ---------------------------------------------------------------------------
def process_post(raw: dict, source_queries: list[str], source_pages: list[int]) -> ProcessedRecord:
    entities = raw.get("entities") or {}
    refs = raw.get("referenced_tweets") or []
    pid = str(raw.get("id"))
    rec = ProcessedRecord(
        post_id=pid,
        author_id=str(raw.get("author_id", "")),
        text=raw.get("text", "") or "",
        created_at=raw.get("created_at"),
        lang=raw.get("lang"),
        public_metrics=raw.get("public_metrics") or {},
        source_queries=sorted(set(source_queries)),
        source_pages=sorted(set(source_pages)),
        source_run="broad_market_4000_post_run",
        post_url=f"https://x.com/i/web/status/{pid}",
        entities_present=bool(entities),
        referenced_tweets_present=bool(refs),
        is_retweet=any(r.get("type") == "retweeted" for r in refs),
        is_reply=any(r.get("type") == "replied_to" for r in refs),
    )
    # sector labels from the (first) source query
    q_sectors = {q: BM._sector_map().get(q) for q in rec.source_queries}
    q_groups = {q: BM._group_map().get(q) for q in rec.source_queries}
    rec.source_query_sector = next((s for s in q_sectors.values() if s), None)
    rec.broad_group = next((g for g in q_groups.values() if g), None)

    # artifacts
    rec.artifacts, rec.has_level_a, rec.x_only_links = extract_artifacts(entities)
    # attribution / actor
    rec.announcement_attribution, rec.actor_project_relation = classify_attribution(rec.text)
    # sector
    rec.sector_bucket, rec.inferred_product_sector, rec.sector_confidence, rec.sector_evidence = \
        classify_sector(rec.text, rec.source_query_sector)
    # hardware evidence
    rec.hardware_evidence = hardware_evidence(rec.text, rec.sector_bucket)
    # identity
    rec.__dict__.update(project_identity(rec.text, rec.artifacts))
    # org scope
    rec.__dict__.update(organization_scope(rec.artifacts))
    # evidence levels
    levels = []
    if rec.has_level_a:
        levels.append("A")
    if rec.announcement_attribution == "direct_builder_claim":
        levels.append("B")
    if rec.announcement_attribution in ("third_party_announcement", "industry_commentary"):
        levels.append("C")
    levels.append("D")  # deterministic engine inference always present
    rec.evidence_levels = levels
    # relevance / fit
    rec.broad_market_relevance = broad_relevance(rec.text, rec.sector_bucket, rec.has_level_a, rec.announcement_attribution)
    rec.headline_mandate_fit = headline_fit(rec.sector_bucket, rec.broad_market_relevance)
    # disposition + reasons
    rec.lead_disposition, rec.reason_codes, rec.reason_evidence = disposition_and_reasons(rec)
    # score
    rec.research_score, rec.score_breakdown = score_record(rec)
    rec.general_venture_attractiveness = _venture_band(rec.research_score, rec.lead_disposition)
    rec.unresolved_questions = _unresolved_questions(rec)
    return rec


def process_all() -> tuple[list[ProcessedRecord], list[dict]]:
    posts = load_new_posts()
    prov = load_provenance()
    page_map = _post_page_map()
    records, errors = [], []
    for raw in posts:
        pid = str(raw.get("id"))
        try:
            sq = prov.get(pid) or list(page_map.get(pid, {}).keys())
            pages = list(page_map.get(pid, {}).values()) or [1]
            records.append(process_post(raw, sq, pages))
        except Exception as exc:  # noqa: BLE001 - record + continue, deterministic
            errors.append({"post_id": pid, "error": type(exc).__name__, "detail": str(exc)[:200]})
    return records, errors


# ---------------------------------------------------------------------------
# Consolidation (deterministic evidence only)
# ---------------------------------------------------------------------------
def consolidation_key(rec: ProcessedRecord) -> Optional[str]:
    for a in rec.artifacts:
        if a.get("github_repository"):
            return f"repo:{a['github_repository'].lower()}"
    for a in rec.artifacts:
        if a.get("is_verifiable_product_artifact") and a.get("normalized_domain"):
            return f"domain:{a['normalized_domain'].lower()}"
    if rec.verified_project_name and rec.actor_project_relation in ("self", "self_organization"):
        return f"project:{rec.verified_project_name.lower()}|author:{rec.author_id}"
    return None  # no deterministic key -> never merged with others


def consolidate(records: list[ProcessedRecord]) -> list[dict]:
    groups: dict[str, list[ProcessedRecord]] = {}
    singletons: list[ProcessedRecord] = []
    for r in records:
        k = consolidation_key(r)
        if k is None:
            singletons.append(r)
        else:
            groups.setdefault(k, []).append(r)
    companies = []
    for k, recs in groups.items():
        posts = [r.post_id for r in recs]
        queries = sorted({q for r in recs for q in r.source_queries})
        # dedupe artifacts by canonical URL so repeated evidence never inflates
        artifacts = {}
        for r in recs:
            for a in r.artifacts:
                artifacts[a.get("canonical_url") or a.get("expanded_url")] = a
        best = max(recs, key=lambda r: r.research_score)
        companies.append({
            "consolidation_key": k,
            "consolidation_basis": k.split(":")[0],
            "normalized_company_or_project_name": best.normalized_company_or_project_name,
            "sector_bucket": best.sector_bucket,
            "broad_group": best.broad_group,
            "author_ids": sorted({r.author_id for r in recs}),
            "source_posts": posts,
            "source_queries": queries,
            "unique_artifacts": list(artifacts.values()),
            "lead_disposition": best.lead_disposition,
            "headline_mandate_fit": best.headline_mandate_fit,
            "general_venture_attractiveness": best.general_venture_attractiveness,
            "research_score": best.research_score,          # best, NOT summed
            "reason_codes": sorted({c for r in recs for c in r.reason_codes}),
            "post_count": len(posts),
        })
    for r in singletons:
        companies.append({
            "consolidation_key": None,
            "consolidation_basis": "unconsolidated_single_post",
            "normalized_company_or_project_name": r.normalized_company_or_project_name,
            "sector_bucket": r.sector_bucket, "broad_group": r.broad_group,
            "author_ids": [r.author_id], "source_posts": [r.post_id],
            "source_queries": r.source_queries, "unique_artifacts": r.artifacts,
            "lead_disposition": r.lead_disposition, "headline_mandate_fit": r.headline_mandate_fit,
            "general_venture_attractiveness": r.general_venture_attractiveness,
            "research_score": r.research_score, "reason_codes": r.reason_codes,
            "post_count": 1,
        })
    return companies


# ---------------------------------------------------------------------------
# Metrics
# ---------------------------------------------------------------------------
# Strict actionable = leads you would act on now. manual_review is a separate
# triage bucket (reported, and surfaced in human-review shortlists) but it does
# NOT inflate actionable rates or query recommendations.
ACTIONABLE = {"keep_verified", "keep_for_enrichment"}
SHORTLIST_DISPOSITIONS = {"keep_verified", "keep_for_enrichment", "manual_review"}


def _rate(n: int, d: int) -> Any:
    if d == 0:
        return {"value": None, "note": "zero denominator"}
    return round(n / d, 4)


def metrics_for(records: list[ProcessedRecord]) -> dict:
    n = len(records)
    authors = {r.author_id for r in records}
    attr = lambda a: sum(1 for r in records if r.announcement_attribution == a)
    disp = lambda d: sum(1 for r in records if r.lead_disposition == d)
    level_a = sum(1 for r in records if r.has_level_a)
    level_b = sum(1 for r in records if "B" in r.evidence_levels)
    direct = attr("direct_builder_claim")
    actionable = sum(1 for r in records if r.lead_disposition in ACTIONABLE)
    cost = POST_READ_USD * Decimal(n)
    return {
        "posts_processed": n,
        "unique_authors": len(authors),
        "direct_builder_claims": direct,
        "third_party_announcements": attr("third_party_announcement"),
        "commentary": attr("industry_commentary"),
        "unclear_attribution": attr("unclear"),
        "level_a_artifacts": level_a,
        "level_b_claims": level_b,
        "keep_verified": disp("keep_verified"),
        "keep_for_enrichment": disp("keep_for_enrichment"),
        "manual_review": disp("manual_review"),
        "archived": {d: disp(d) for d in
                     ("archive_third_party", "archive_commentary", "archive_established_org",
                      "archive_services_business", "archive_marketplace_or_reseller",
                      "archive_out_of_scope", "archive_low_quality")},
        "actionable_leads": actionable,
        "direct_builder_rate": _rate(direct, n),
        "verified_artifact_rate": _rate(disp("keep_verified"), n),
        "actionable_lead_rate": _rate(actionable, n),
        "allocated_retrieval_cost_usd": money_str(cost),
        "estimated_cost_per_actionable_lead_usd": (money_str(cost / actionable) if actionable else
                                                   {"value": None, "note": "zero denominator"}),
    }


def group_by(records: list[ProcessedRecord], key) -> dict[str, list[ProcessedRecord]]:
    out: dict[str, list[ProcessedRecord]] = {}
    for r in records:
        for k in ([key(r)] if isinstance(key(r), str) or key(r) is None else key(r)):
            out.setdefault(k or "none", []).append(r)
    return out
