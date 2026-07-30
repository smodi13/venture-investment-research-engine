"""Offline re-derivation of profile evidence + combined dispositions for the
14-author enrichment. Uses ONLY saved local data (raw_user_response.json + the
processed candidate records). Never calls the network; never mutates the raw
response or the first-pass derived files. Writes a versioned rederived_v2/ set.
"""

from __future__ import annotations

import csv
import io
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any, Optional

from .broad_market_enrichment14 import OUTPUT_DIR_14, decision_questions
from .urlutil import normalized_domain

PROCESSED = Path("data/output/broad_market_4000/processed")
RAW_PATH = OUTPUT_DIR_14 / "raw_user_response.json"
V2_DIR = OUTPUT_DIR_14 / "rederived_v2"

# Small deterministic set of well-known established-company product domains (review
# layer only; no browsing). Used to recognise official product/marketing accounts.
KNOWN_ESTABLISHED_DOMAINS = {"monday.com", "microsoft.com", "google.com", "atlassian.com",
                             "salesforce.com", "notion.so", "figma.com", "stripe.com"}
KNOWN_ESTABLISHED_EMPLOYERS = {"microsoft", "google", "amazon", "meta", "apple", "stripe",
                               "openai", "anthropic", "nvidia", "netflix", "uber", "airbnb"}


class RederiveError(ValueError):
    pass


# ---------------------------------------------------------------------------
# Load + deterministic join by exact author ID
# ---------------------------------------------------------------------------
def _load(name: str) -> Any:
    return json.loads((PROCESSED / name).read_text())


def load_raw_users() -> dict[str, dict]:
    raw = json.loads(RAW_PATH.read_text())
    return {str(u["id"]): u for u in (raw.get("data") or [])}


def join_context() -> list[dict]:
    allrec = {str(r["author_id"]): r for r in _load("all_processed_records.json")}
    dq = {q["author_id"]: q for q in decision_questions()}
    ctx = []
    for aid, q in dq.items():
        rec = allrec.get(aid)
        if rec is None:
            raise RederiveError(f"author {aid} not found in all_processed_records (fail closed)")
        arts = rec.get("artifacts") or []
        domains = sorted({a["normalized_domain"] for a in arts
                          if a.get("is_verifiable_product_artifact") and a.get("normalized_domain")})
        gh_owners = sorted({a["github_owner"] for a in arts if a.get("github_owner")})
        gh_repos = sorted({a["github_repository"] for a in arts if a.get("github_repository")})
        ctx.append({
            "author_id": aid,
            "project_or_company_name": q.get("associated_company_or_project") or rec.get("verified_project_name"),
            "claimed_project_name": rec.get("claimed_project_name"),
            "verified_project_name": rec.get("verified_project_name"),
            "post_text": rec.get("text"), "post_url": rec.get("post_url"),
            "source_query": (rec.get("source_queries") or [None])[0],
            "pre_enrichment_disposition": q.get("current_disposition"),
            "post_artifact_urls": [a.get("canonical_url") for a in arts],
            "post_artifact_domains": domains,
            "post_github_owners": gh_owners, "post_github_repos": gh_repos,
            "post_actor_project_relation": rec.get("actor_project_relation"),
            "post_announcement_attribution": rec.get("announcement_attribution"),
            "sector": rec.get("sector_bucket"), "headline_mandate_fit": rec.get("headline_mandate_fit"),
            "overall_shortlist_status": q.get("overall_shortlist_status"),
            "comparison_set_status": q.get("comparison_set_status"),
            "enrichment_priority_score": q.get("enrichment_priority_score"),
            "unresolved_decision_question": q.get("expected_value_of_lookup"),
        })
    return ctx


# ---------------------------------------------------------------------------
# Profile parsing
# ---------------------------------------------------------------------------
def profile_link_domains(user: dict) -> list[str]:
    doms = set()
    ents = user.get("entities", {}) or {}
    urls = ((ents.get("url", {}) or {}).get("urls", []) or []) + ((ents.get("description", {}) or {}).get("urls", []) or [])
    for u in urls:
        d = normalized_domain(u.get("expanded_url") or u.get("url") or "")
        if d:
            doms.add(d)
    if user.get("url"):
        d = normalized_domain(user["url"])
        if d and d != "t.co":
            doms.add(d)
    return sorted(doms)


def profile_github_owner(user: dict) -> Optional[str]:
    ents = user.get("entities", {}) or {}
    urls = ((ents.get("url", {}) or {}).get("urls", []) or []) + ((ents.get("description", {}) or {}).get("urls", []) or [])
    cand = [u.get("expanded_url") or u.get("url") or "" for u in urls] + [user.get("url") or ""]
    for u in cand:
        m = re.search(r"github\.com/([A-Za-z0-9-]+)", u or "")
        if m:
            return m.group(1)
    return None


def _mentions_employer(desc: str) -> Optional[str]:
    for m in re.finditer(r"(?:building at|work(?:s|ing)? at|@)\s*@?([A-Za-z][A-Za-z0-9_]+)", desc, re.I):
        tok = m.group(1).lower()
        if tok in KNOWN_ESTABLISHED_EMPLOYERS:
            return tok
    return None


# ---------------------------------------------------------------------------
# Role classification (extended set)
# ---------------------------------------------------------------------------
def profile_role_classification(user: dict) -> tuple[str, str]:
    name = user.get("name", "") or ""
    desc = user.get("description", "") or ""
    text = f"{name} {desc}"
    low = text.lower()
    if not desc.strip():
        return "no_explicit_signal", ""
    has_founder = bool(re.search(r"\bfounder\b", low)) and not re.search(r"co[-\s]?founder", low)
    has_cofounder = bool(re.search(r"co[-\s]?founder", low))
    has_exec = bool(re.search(r"\b(ceo|cto|coo|cfo|cmo|chief\s+\w+\s+officer|vp of|head of)\b", low))
    if has_cofounder:
        return "explicit_cofounder", _grab(desc, r"co[-\s]?founder.{0,40}")
    if has_founder and has_exec:
        return "explicit_founder_and_executive", _grab(desc, r"founder.{0,40}")
    if has_founder:
        return "explicit_founder", _grab(desc, r"founder.{0,40}")
    if re.search(r"\b(reviewer|reviews|analyst|journalist|author|columnist|\d+\+?\s*articles|writer)\b", low):
        return "analyst_or_reviewer", _grab(desc, r"(reviewer|reviews|analyst|journalist|author|articles).{0,40}")
    if re.search(r"\b(agency|consult\w+|i help .* (businesses|clients)|ad creatives|appointment setting|freelance|we help|client services)\b", low):
        return "services_operator", _grab(desc, r"(agency|consult\w+|i help.{0,40}|ad creatives|appointment setting)")
    if _mentions_employer(desc):
        return "explicit_employee", _grab(desc, r"(building at|work(?:s|ing)? at|@)\s*@?\w+")
    if has_exec:
        return "explicit_executive_not_founder", _grab(desc, r"(ceo|cto|coo|cfo|cmo|head of).{0,30}")
    if re.search(r"\b(\d{1,2}\s*y/?o|\d{1,2}\s*years? old|student|high school|undergrad|freshman|sophomore)\b", low):
        return "student_builder", _grab(desc, r"(\d{1,2}\s*y/?o|student).{0,30}")
    if re.search(r"\b(indie dev|indie hacker|solo (dev|build)|hobby|enthusiast|for fun|nights and weekends)\b", low):
        return "independent_hobby_builder", _grab(desc, r"(indie dev|indie hacker|solo|hobby|enthusiast).{0,30}")
    if re.search(r"\b(i build|i'm building|building|builder|maker)\b", low):
        return "explicit_builder", _grab(desc, r"(i build|building|builder|maker).{0,40}")
    if re.search(r"\b(engineer|developer|swe|programmer)\b", low):
        return "explicit_engineer", _grab(desc, r"(engineer|developer|swe|programmer).{0,30}")
    if re.search(r"\b(we|our|official)\b", low) or (name and name.lower().replace(" ", "") in (user.get("username", "") or "").lower()):
        return "organization_account", _grab(desc, r"(we|our|official).{0,40}")
    return "no_explicit_signal", ""


def _grab(text: str, pattern: str) -> str:
    m = re.search(pattern, text, re.I)
    return m.group(0).strip() if m else ""


# ---------------------------------------------------------------------------
# Profile -> company relation + employment relation + business type
# ---------------------------------------------------------------------------
def _name_in(name: Optional[str], desc: str) -> bool:
    if not name:
        return False
    return bool(re.search(rf"\b{re.escape(name)}\b", desc, re.I)) or name.replace(" ", "").lower() in desc.lower().replace(" ", "")


def _same_root(a: str, b: str) -> bool:
    return a.split(".")[-2:] == b.split(".")[-2:]


def profile_company_relation(user: dict, ctx: dict, role: str) -> dict:
    desc = user.get("description", "") or ""
    text = f"{ctx.get('post_text','')} {desc}"
    p_domains = profile_link_domains(user)
    p_gh = profile_github_owner(user)
    post_domains = [d for d in ctx.get("post_artifact_domains", []) if d and d != "github.com"]
    post_gh_owners = ctx.get("post_github_owners", [])
    name = (ctx.get("project_or_company_name") or ctx.get("verified_project_name") or "")

    rels: list[str] = []
    basis: dict[str, Any] = {}
    # domain
    exact_dom = sorted(set(p_domains) & set(post_domains))
    if exact_dom:
        rels.append("exact_product_domain_match"); basis["exact_product_domain"] = exact_dom
    elif p_domains and post_domains and any(_same_root(pd, qd) for pd in p_domains for qd in post_domains):
        rels.append("related_company_domain_match"); basis["related_domain"] = [p_domains, post_domains]
    # github owner corroboration (suggestive identity, not company verification)
    if p_gh and post_gh_owners and p_gh.lower() in [o.lower() for o in post_gh_owners]:
        rels.append("exact_github_owner_match"); basis["github_owner"] = p_gh
    # company/project name
    if name and _name_in(name, desc):
        rels.append("exact_company_name_match" if role.startswith("explicit_founder") or role == "explicit_cofounder"
                    else "exact_project_name_match")
        basis["name"] = name
    # profile RESOLVES a company the Post could not parse: profile founder/org links a
    # domain whose label appears in the Post text (e.g. "Plexor Labs" + plexorlabs.com).
    if role in ("explicit_founder", "explicit_founder_and_executive", "explicit_cofounder", "organization_account") \
            and "exact_product_domain_match" not in rels:
        post_low = (ctx.get("post_text") or "").lower().replace(" ", "")
        for d in p_domains:
            label = d.split(".")[0]
            if len(label) > 4 and label in post_low:
                rels.append("exact_product_domain_match"); basis["post_text_resolved_domain"] = d
                if role in ("explicit_founder", "explicit_founder_and_executive"):
                    rels.append("explicit_founder_alignment")
                elif role == "explicit_cofounder":
                    rels.append("explicit_cofounder_alignment")
                break
    # role alignment
    if role in ("explicit_founder", "explicit_founder_and_executive") and (exact_dom or _name_in(name, desc)):
        rels.append("explicit_founder_alignment")
    if role == "explicit_cofounder" and (exact_dom or "related_company_domain_match" in rels or _name_in(name, desc)):
        rels.append("explicit_cofounder_alignment")
    if role == "explicit_builder" and (exact_dom or ctx.get("post_actor_project_relation") in ("self", "self_organization")):
        rels.append("explicit_builder_alignment")
    if role == "organization_account" and (exact_dom or p_domains):
        rels.append("organization_owns_product")
    # circular self identity: only the handle echoes the project, nothing external
    uname = (user.get("username") or "").lower()
    if not rels and name and name.replace(" ", "").lower() in uname and not p_domains:
        rels.append("circular_self_identity_only"); basis["circular_username"] = uname
    if not rels:
        rels.append("no_match")
    return {"profile_company_relation": rels, "relation_basis": basis,
            "profile_domains": p_domains, "profile_github_owner": p_gh}


def employment_project_relation(user: dict, ctx: dict, role: str, relation: list[str]) -> dict:
    desc = user.get("description", "") or ""
    emp = _mentions_employer(desc)
    p_domains = profile_link_domains(user)
    personal_oss = bool(ctx.get("post_github_owners")) and not ctx.get("post_artifact_domains_non_github", None) \
        and (not [d for d in ctx.get("post_artifact_domains", []) if d != "github.com"])
    if role in ("explicit_founder", "explicit_founder_and_executive") and ("explicit_founder_alignment" in relation or "exact_company_name_match" in relation):
        val = "founder_of_project"
    elif role == "explicit_cofounder" and "explicit_cofounder_alignment" in relation:
        val = "founder_of_project"
    elif role == "explicit_builder":
        val = "builder_of_project"
    elif role == "organization_account":
        val = "organization_account"
    elif emp and role in ("explicit_founder", "explicit_founder_and_executive", "explicit_cofounder"):
        val = "founder_of_project"  # founder claim preserved even if employed elsewhere
    elif emp:
        # different employer + personal OSS / no ownership claim
        val = "independent_side_project" if (personal_oss or ctx.get("post_actor_project_relation") in ("self", "self_organization")) else "different_current_employer"
    elif "no_match" in relation:
        val = "no_employment_signal"
    else:
        val = "unclear"
    return {"employment_project_relation": val, "current_employer": emp}


def business_type(user: dict, ctx: dict, role: str, relation: list[str], employment: dict) -> str:
    desc = (user.get("description", "") or "").lower()
    p_domains = profile_link_domains(user)
    if any(d in KNOWN_ESTABLISHED_DOMAINS for d in p_domains) and role in ("organization_account", "explicit_employee") \
            and re.search(r"\b(real job at|official|sign up|agents? can sign up|part of the team)\b", desc):
        return "established_company_product"
    if role == "analyst_or_reviewer":
        return "media_or_reviewer"
    if role == "services_operator":
        return "agency_or_services"
    if re.search(r"\b(web3|tron|defi|token|memecoin|\$[a-z]{2,6}\b|on-chain|stablecoin)\b", desc):
        return "crypto_or_token_project"
    if employment["employment_project_relation"] == "independent_side_project":
        return "open_source_project" if ctx.get("post_github_owners") else "independent_side_project"
    if role in ("explicit_founder", "explicit_cofounder", "explicit_founder_and_executive") and \
            ("explicit_founder_alignment" in relation or "explicit_cofounder_alignment" in relation or "exact_company_name_match" in relation):
        return "early_company_or_stealth" if ctx.get("pre_enrichment_disposition") != "keep_verified" else "venture_scale_company_candidate"
    if role == "organization_account" and ("organization_owns_product" in relation or "exact_product_domain_match" in relation):
        return "early_company_or_stealth"
    if role == "student_builder":
        return "independent_side_project"
    if role == "independent_hobby_builder":
        return "open_source_project" if ctx.get("post_github_owners") else "independent_side_project"
    if re.search(r"\b(learn|skills|career|course|nonprofit|community)\b", desc):
        return "nonprofit_or_community"
    return "unclear"


# ---------------------------------------------------------------------------
# Combined disposition (revised rules)
# ---------------------------------------------------------------------------
def combined_disposition(user: Optional[dict], ctx: dict, role: str, relation: dict,
                         employment: dict, biz: str) -> dict:
    if user is None:
        return {"combined_disposition": "insufficient_total_evidence",
                "combined_reason_codes": ["USER_NOT_RETURNED"], "evidence": "profile not returned"}
    rels = relation["profile_company_relation"]
    codes: list[str] = []
    dom_match = "exact_product_domain_match" in rels or "related_company_domain_match" in rels
    name_match = "exact_company_name_match" in rels

    # 7 reviewer / 8 services / 9 established product / 10 unrelated
    if role == "analyst_or_reviewer":
        codes.append("ANALYST_OR_REVIEWER")
        return {"combined_disposition": "archive_third_party_or_reviewer", "combined_reason_codes": codes,
                "evidence": "profile is an analyst/reviewer/author, not the builder"}
    if biz == "agency_or_services":
        codes.append("SERVICES_BUSINESS")
        return {"combined_disposition": "archive_services_business", "combined_reason_codes": codes,
                "evidence": "services/agency profile, no scalable product"}
    if biz == "established_company_product":
        codes.append("ESTABLISHED_COMPANY_PRODUCT")
        return {"combined_disposition": "archive_established_company_product", "combined_reason_codes": codes,
                "evidence": "official established-company product/marketing account"}
    if biz == "crypto_or_token_project" and not (dom_match or name_match):
        codes.append("CRYPTO_OR_UNRELATED")
        return {"combined_disposition": "archive_unrelated", "combined_reason_codes": codes,
                "evidence": "crypto/token researcher unrelated to the candidate project"}

    # 1 founder/cofounder alignment + domain/name
    if ("explicit_founder_alignment" in rels or "explicit_cofounder_alignment" in rels) and (dom_match or name_match):
        codes.append("FOUNDER_COMPANY_ALIGNMENT")
        return {"combined_disposition": "advance_for_diligence", "combined_reason_codes": codes,
                "evidence": f"explicit founder/cofounder + {'domain' if dom_match else 'company name'} match"}
    # 2 org account + product domain
    if role == "organization_account" and ("organization_owns_product" in rels or dom_match):
        codes.append("ORG_OWNS_PRODUCT")
        return {"combined_disposition": "advance_company_identity_confirmed", "combined_reason_codes": codes,
                "evidence": "organization account owns the product domain (individual founder NOT asserted)"}
    # 5 employee at established co + personal OSS
    if employment["current_employer"] and ctx.get("post_github_owners") and employment["employment_project_relation"] in ("independent_side_project", "different_current_employer"):
        codes.append("EMPLOYEE_PERSONAL_OSS")
        return {"combined_disposition": "watch_open_source_side_project", "combined_reason_codes": codes,
                "evidence": f"works at {employment['current_employer']}; candidate is a personal OSS repo"}
    # 3 builder + production/customer evidence, no company formation
    if role == "explicit_builder" and re.search(r"\b(in production|real clinics|customers?|first customer|paid|shipping)\b", (user.get("description", "") or "") + " " + (ctx.get("post_text") or ""), re.I):
        codes.append("BUILDER_WITH_TRACTION_NO_ENTITY")
        return {"combined_disposition": "retain_for_company_formation_check", "combined_reason_codes": codes,
                "evidence": "builder with production/customer signal but no company-formation evidence"}
    # 6 student / young indie with a real artifact (age/indie status never auto-archives).
    # Fires even when a founder claim for a DIFFERENT project is present.
    desc_low = (user.get("description", "") or "").lower()
    young_indie = bool(re.search(r"\b(\d{1,2}\s*y/?o|\d{1,2}\s*years? old|student|indie dev|high school|undergrad)\b", desc_low))
    if (role == "student_builder" or young_indie) and (ctx.get("post_artifact_domains") or ctx.get("post_github_owners")):
        codes.append("YOUNG_INDIE_REAL_ARTIFACT")
        return {"combined_disposition": "watch_independent_builder", "combined_reason_codes": codes,
                "evidence": "young/indie builder with a real artifact (not archived on age; founder claim, if any, is for a different project)"}
    # 4 verified artifact + strong identity but no company/customer
    if "exact_github_owner_match" in rels or biz == "open_source_project":
        codes.append("OSS_IDENTITY_CONFIRMED_NO_ENTITY")
        return {"combined_disposition": "watch_open_source_side_project", "combined_reason_codes": codes,
                "evidence": "profile owns the repo (identity corroborated) but no company/customer evidence"}
    # 11 empty / circular / ambiguous
    if "circular_self_identity_only" in rels or role == "no_explicit_signal":
        codes.append("UNINFORMATIVE_OR_CIRCULAR")
        return {"combined_disposition": "retain_for_manual_research", "combined_reason_codes": codes,
                "evidence": "empty/circular profile evidence; cannot resolve ownership"}
    codes.append("PARTIAL_EVIDENCE")
    return {"combined_disposition": "retain_for_manual_research", "combined_reason_codes": codes,
            "evidence": "partial alignment; not enough to advance or archive"}


# ---------------------------------------------------------------------------
# Top-level re-derivation
# ---------------------------------------------------------------------------
def rederive() -> dict:
    users = load_raw_users()
    ctxs = join_context()
    old_combined = {c["author_id"]: c for c in json.loads((OUTPUT_DIR_14 / "combined_candidate_results.json").read_text())}
    rows = []
    for ctx in ctxs:
        aid = ctx["author_id"]
        u = users.get(aid)
        if u is None:
            rows.append({**ctx, "returned": False, "profile_role": "unclear",
                         "profile_company_relation": ["no_match"], "employment_project_relation": "unclear",
                         "business_type": "unclear",
                         **combined_disposition(None, ctx, "unclear",
                                                {"profile_company_relation": ["no_match"], "profile_domains": [], "profile_github_owner": None, "relation_basis": {}},
                                                {"employment_project_relation": "unclear", "current_employer": None}, "unclear"),
                         "old_combined_disposition": old_combined.get(aid, {}).get("combined_disposition")})
            continue
        role, role_ev = profile_role_classification(u)
        rel = profile_company_relation(u, ctx, role)
        emp = employment_project_relation(u, ctx, role, rel["profile_company_relation"])
        biz = business_type(u, ctx, role, rel["profile_company_relation"], emp)
        comb = combined_disposition(u, ctx, role, rel, emp, biz)
        rows.append({
            **ctx, "returned": True,
            "profile_name": u.get("name"), "profile_username": u.get("username"),
            "profile_bio": u.get("description"), "profile_location": u.get("location"),
            "profile_created_at": u.get("created_at"), "profile_url_domains": rel["profile_domains"],
            "profile_github_owner": rel["profile_github_owner"],
            "profile_role": role, "profile_role_evidence": role_ev,
            "profile_company_relation": rel["profile_company_relation"], "relation_basis": rel["relation_basis"],
            "employment_project_relation": emp["employment_project_relation"], "current_employer": emp["current_employer"],
            "business_type": biz,
            "combined_disposition": comb["combined_disposition"],
            "combined_reason_codes": comb["combined_reason_codes"], "change_evidence": comb["evidence"],
            "old_combined_disposition": old_combined.get(aid, {}).get("combined_disposition"),
        })
    return {"rows": rows, "users": users}


# ---------------------------------------------------------------------------
# Versioned writers (rederived_v2/ only; originals + raw are never touched)
# ---------------------------------------------------------------------------
ADVANCE = {"advance_for_diligence", "advance_company_identity_confirmed"}
RETAIN = {"retain_for_company_formation_check", "retain_for_manual_research"}
WATCH = {"watch_open_source_side_project", "watch_independent_builder"}
ARCHIVE = {"archive_third_party_or_reviewer", "archive_services_business",
           "archive_established_company_product", "archive_unrelated", "archive_out_of_scope"}


def _csv(rows, cols):
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for r in rows:
        w.writerow({c: (json.dumps(r.get(c)) if isinstance(r.get(c), (list, dict)) else r.get(c)) for c in cols})
    return buf.getvalue()


def _md_table(rows, cols):
    if not rows:
        return "_none_\n"
    out = ["| " + " | ".join(cols) + " |", "| " + " | ".join("---" for _ in cols) + " |"]
    for r in rows:
        cells = []
        for c in cols:
            v = r.get(c)
            if isinstance(v, (list, dict)):
                v = json.dumps(v)
            cells.append(str(v).replace("\n", " ").replace("|", "/")[:90])
        out.append("| " + " | ".join(cells) + " |")
    return "\n".join(out) + "\n"


def _hash(path):
    import hashlib
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write_rederivation(result: dict) -> dict:
    from .timeutil import now_utc, to_rfc3339
    rows = result["rows"]
    V2_DIR.mkdir(parents=True, exist_ok=True)

    def wj(name, obj):
        (V2_DIR / name).write_text(json.dumps(obj, indent=2, default=str))

    def wt(name, text):
        (V2_DIR / name).write_text(text)

    # integrity: capture hashes of the immutable inputs (assert unchanged by us)
    raw_hash = _hash(RAW_PATH)
    orig_files = ["combined_candidate_results.json", "profile_records.json",
                  "enrichment_cost_ledger.json", "raw_user_response.json"]
    orig_hashes = {f: _hash(OUTPUT_DIR_14 / f) for f in orig_files}

    wj("rederivation_manifest.json", {
        "operation": "broad_market_14_author_enrichment_rederivation_v2",
        "generated_at_utc": to_rfc3339(now_utc()),
        "source_raw": str(RAW_PATH), "raw_sha256": raw_hash,
        "inputs": ["all_processed_records.json", "profile_enrichment_selection_review.json",
                   "consolidated_companies.json"],
        "authors_reprocessed": len(rows), "network_calls": 0, "user_profiles_retrieved": 0,
        "raw_mutated": False, "original_derived_mutated": False,
        "output_dir": str(V2_DIR),
    })
    wj("candidate_context_join_audit.json", [{
        "author_id": r["author_id"], "matched_by": "exact_author_id",
        "post_artifact_domains": r["post_artifact_domains"], "post_github_owners": r["post_github_owners"],
        "post_github_repos": r["post_github_repos"], "project_or_company_name": r["project_or_company_name"],
        "post_actor_project_relation": r["post_actor_project_relation"],
        "post_announcement_attribution": r["post_announcement_attribution"]} for r in rows])
    wj("profile_records_v2.json", [{k: r.get(k) for k in (
        "author_id", "profile_username", "profile_name", "profile_bio", "profile_location",
        "profile_created_at", "profile_url_domains", "profile_github_owner")} for r in rows])
    wt("profile_records_v2.csv", _csv(rows, ["author_id", "profile_username", "profile_name",
        "profile_location", "profile_created_at", "profile_github_owner"]))
    wj("profile_role_classification_v2.json", [{"author_id": r["author_id"], "profile_role": r["profile_role"],
        "evidence": r.get("profile_role_evidence")} for r in rows])
    wj("profile_company_relation_v2.json", [{"author_id": r["author_id"],
        "profile_company_relation": r["profile_company_relation"], "relation_basis": r.get("relation_basis")} for r in rows])
    wj("profile_employer_relation_v2.json", [{"author_id": r["author_id"],
        "employment_project_relation": r["employment_project_relation"], "current_employer": r.get("current_employer")} for r in rows])
    wj("profile_business_type_v2.json", [{"author_id": r["author_id"], "business_type": r["business_type"]} for r in rows])
    wj("profile_contradiction_audit_v2.json", [{"author_id": r["author_id"], "current_employer": r.get("current_employer"),
        "note": r.get("change_evidence")} for r in rows if r.get("current_employer") or "contradict" in str(r.get("profile_company_relation"))])
    wj("combined_candidate_results_v2.json", rows)
    cols = ["author_id", "profile_username", "project_or_company_name", "pre_enrichment_disposition",
            "profile_role", "employment_project_relation", "business_type", "combined_disposition",
            "combined_reason_codes", "change_evidence"]
    wt("combined_candidate_results_v2.csv", _csv(rows, cols))
    wt("combined_candidate_results_v2.md", _md_table(rows, cols))

    cmp_rows = [{"author_id": r["author_id"], "username": r.get("profile_username"),
                 "project": r["project_or_company_name"], "pre_enrichment": r["pre_enrichment_disposition"],
                 "old": r["old_combined_disposition"], "new": r["combined_disposition"],
                 "changed": r["old_combined_disposition"] != r["combined_disposition"],
                 "evidence": r["change_evidence"]} for r in rows]
    wj("old_vs_new_disposition_comparison.json", cmp_rows)
    wt("old_vs_new_disposition_comparison.md", _md_table(cmp_rows,
        ["username", "project", "old", "new", "changed", "evidence"]))

    counts = Counter(r["combined_disposition"] for r in rows)
    wj("rederivation_summary.json", {
        "authors_reprocessed": len(rows), "disposition_counts": dict(counts),
        "advanced": sorted(r["profile_username"] for r in rows if r["combined_disposition"] in ADVANCE),
        "company_formation_checks": sorted(r["profile_username"] for r in rows if r["combined_disposition"] == "retain_for_company_formation_check"),
        "watchlist": sorted(r["profile_username"] for r in rows if r["combined_disposition"] in WATCH),
        "archived": sorted((r["profile_username"], r["combined_disposition"]) for r in rows if r["combined_disposition"] in ARCHIVE),
        "unresolved": sorted(r["profile_username"] for r in rows if r["combined_disposition"] == "retain_for_manual_research"),
    })
    wj("sanitized_rederivation_fixture.json", [{"author_id": r["author_id"], "profile_role": r["profile_role"],
        "combined_disposition": r["combined_disposition"], "bio": "SANITIZED"} for r in rows])

    # verify immutable inputs unchanged after all writes
    post_raw = _hash(RAW_PATH)
    post_orig = {f: _hash(OUTPUT_DIR_14 / f) for f in orig_files}
    return {"rows": rows, "counts": dict(counts), "raw_unchanged": raw_hash == post_raw,
            "originals_unchanged": orig_hashes == post_orig, "output_dir": str(V2_DIR)}


def strongest_five(rows) -> list[dict]:
    rank = {"advance_for_diligence": 0, "advance_company_identity_confirmed": 1,
            "retain_for_company_formation_check": 2, "watch_independent_builder": 3,
            "watch_open_source_side_project": 4}
    elig = [r for r in rows if r["combined_disposition"] in rank]
    elig.sort(key=lambda r: (rank[r["combined_disposition"]], -(r.get("enrichment_priority_score") or 0)))
    return elig[:5]
