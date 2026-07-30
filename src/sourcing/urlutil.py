"""URL selection + normalization for company/artifact detection.

Uses ONLY URL information already present in the X API response — never makes an
external HEAD/GET/redirect request.

Selection priority for each URL entity: unwound_url > expanded_url > url.
All representations are preserved. x.com / twitter.com / t.co are never treated
as a product company domain, and an unresolved t.co shortener never invents a
company/project.
"""

from __future__ import annotations

from typing import Any, Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

TRACKING_PARAMS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "fbclid", "gclid",
}

# Hosts that must never be treated as a product company domain (per mandate).
NON_PRODUCT_HOSTS = {"x.com", "twitter.com", "t.co"}

# Code-hosting hosts: the OWNER/REPO is the identity, not the host domain.
_CODE_HOSTS = {"github.com", "gitlab.com"}

UNRESOLVED_SHORTENER = "unresolved_shortener"
RESOLVED = "resolved"


def bare_host(url: str) -> str:
    """Lowercased hostname without a leading ``www.`` (empty for blank input)."""
    if not url:
        return ""
    host = urlparse(url).netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def select_canonical_url(entity: dict[str, Any]) -> str:
    """unwound_url > expanded_url > url (first present, nonempty)."""
    for key in ("unwound_url", "expanded_url", "url"):
        val = entity.get(key)
        if val and str(val).strip():
            return str(val).strip()
    return ""


def normalize_url(url: str) -> str:
    """Normalize a URL for dedup: lowercase host, drop www, strip tracking params,
    remove a trailing slash that doesn't change the resource. Scheme is lowercased
    (http/https treated equivalently for domain comparison via :func:`bare_host`).
    Meaningful path (incl. GitHub owner/repo) is preserved.
    """
    if not url:
        return ""
    p = urlparse(url)
    scheme = (p.scheme or "https").lower()
    host = p.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    path = p.path
    if path in ("", "/"):
        path = ""
    elif path.endswith("/"):
        path = path.rstrip("/")
    query = urlencode([
        (k, v) for k, v in parse_qsl(p.query, keep_blank_values=True)
        if k.lower() not in TRACKING_PARAMS
    ])
    return urlunparse((scheme, host, path, "", query, ""))


def normalized_domain(url: str) -> str:
    return bare_host(url)


def github_owner_repo(url: str) -> Optional[str]:
    """Return ``owner/repo`` (or ``owner``) for a github/gitlab URL, else None.

    Case is preserved (GitHub paths are meaningful).
    """
    if bare_host(url) not in _CODE_HOSTS:
        return None
    parts = [seg for seg in urlparse(url).path.strip("/").split("/") if seg]
    if len(parts) >= 2:
        return f"{parts[0]}/{parts[1]}"
    if len(parts) == 1:
        return parts[0]
    return None


def is_product_domain(url: str) -> bool:
    """True if the URL's host can represent a product/company (not x/twitter/t.co)."""
    host = bare_host(url)
    return bool(host) and host not in NON_PRODUCT_HOSTS


def build_url_info(entity: dict[str, Any]) -> dict[str, Any]:
    """Build the preserved URL representation set for one URL entity."""
    selected = select_canonical_url(entity)
    host = bare_host(selected)
    status = UNRESOLVED_SHORTENER if (not selected or host == "t.co") else RESOLVED
    return {
        "original_short_url": entity.get("url"),
        "expanded_url": entity.get("expanded_url"),
        "unwound_url": entity.get("unwound_url"),
        "selected_canonical_url": normalize_url(selected) if selected else None,
        "normalized_domain": host or None,
        "url_resolution_status": status,
        "is_product_domain": is_product_domain(selected) and status == RESOLVED,
    }
