"""External enrichment for the top-5 manually reviewed leads (mandate section 12).

Checks a SMALL, fixed set of URLs derived from the company's own artifacts:
homepage, product/pricing/docs/changelog pages, and a linked GitHub repo. This
is NOT a generalized crawler -- it never follows discovered links and is capped
per company.
"""

from __future__ import annotations

import logging
import re
from typing import Optional

import requests

from .cache import Cache
from .models import ArtifactType, ScoredCompany

log = logging.getLogger(__name__)

MAX_URLS_PER_COMPANY = 6
TIMEOUT = 15

_PRICING_HINTS = ["pricing", "/plans", "per month", "per seat", "free trial"]
_CUSTOMER_HINTS = ["customers", "case study", "case-study", "trusted by", "testimonial"]
_DOCS_HINTS = ["documentation", "api reference", "quickstart", "getting started"]


def _candidate_urls(scored: ScoredCompany) -> list[str]:
    urls: list[str] = []
    company = scored.company
    if company.domain:
        urls.append(f"https://{company.domain}")
    # Prefer specific artifact pages.
    priority = [
        ArtifactType.PRICING,
        ArtifactType.DOCS,
        ArtifactType.CHANGELOG,
        ArtifactType.GITHUB,
        ArtifactType.PRODUCT_URL,
    ]
    seen = set(urls)
    for atype in priority:
        for a in company.artifacts:
            if a.type == atype and a.url not in seen:
                urls.append(a.url)
                seen.add(a.url)
    return urls[:MAX_URLS_PER_COMPANY]


def _fetch(url: str, cache: Cache, session: requests.Session) -> dict:
    sig = f"enrich::{url}"
    cached = cache.get_http(sig)
    if cached is not None:
        return cached
    result: dict
    try:
        resp = session.get(url, timeout=TIMEOUT, headers={"User-Agent": "headline-sourcing/0.1"})
        text = resp.text[:20000].lower() if resp.status_code == 200 else ""
        result = {
            "url": url,
            "status": resp.status_code,
            "has_pricing": any(h in text for h in _PRICING_HINTS),
            "has_customers": any(h in text for h in _CUSTOMER_HINTS),
            "has_docs": any(h in text for h in _DOCS_HINTS),
        }
    except requests.RequestException as exc:
        result = {"url": url, "status": 0, "error": str(exc)[:120]}
    cache.put_http(sig, result)
    return result


def enrich_company(
    scored: ScoredCompany,
    cache: Cache,
    session: Optional[requests.Session] = None,
) -> ScoredCompany:
    """Populate ``scored.enrichment`` and ``scored.missing_information`` in place."""
    session = session or requests.Session()
    urls = _candidate_urls(scored)
    if not urls:
        scored.enrichment = {"note": "no public URLs available to enrich"}
        scored.missing_information.append("No public website/product URL found on X.")
        return scored

    found = {"pricing": False, "customers": False, "docs": False, "reachable": False}
    details: dict[str, str] = {}
    for url in urls:
        res = _fetch(url, cache, session)
        details[url] = (
            f"status={res.get('status')}"
            + (f" error={res['error']}" if res.get("error") else "")
        )
        if res.get("status") == 200:
            found["reachable"] = True
            found["pricing"] = found["pricing"] or res.get("has_pricing", False)
            found["customers"] = found["customers"] or res.get("has_customers", False)
            found["docs"] = found["docs"] or res.get("has_docs", False)

    scored.enrichment = {
        "urls_checked": ", ".join(urls),
        "reachable": str(found["reachable"]),
        "public_pricing_found": str(found["pricing"]),
        "public_customer_evidence_found": str(found["customers"]),
        "public_docs_found": str(found["docs"]),
        **{f"detail::{k}": v for k, v in details.items()},
    }

    if not found["pricing"]:
        scored.missing_information.append("No public pricing page found — pricing/monetization unknown.")
    if not found["customers"]:
        scored.missing_information.append("No public customer evidence (case studies/logos) found.")
    if not found["docs"]:
        scored.missing_information.append("No public product docs found — technical depth unverified.")
    return scored
