"""Config-driven organization registry + deterministic matching.

Matching rules (mandate section 8):
  * domains: lowercase, drop www.; exact OR subdomain-with-dot-boundary; NO substring.
  * github owners: exact, case-insensitive; NO substring.
  * aliases: explicit text attribution only (never proves author employment).

The registry NEVER alters artifact_evidence_level.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Optional

import yaml

from .config import CONFIG_DIR, ConfigError

# entity_type -> artifact_owner_scope
_SCOPE_BY_TYPE = {
    "established_company": "established_organization",
    "major_private_company": "established_organization",
    "accelerator_or_investor": "established_organization",
    "other_non_target_organization": "established_organization",
    "open_source_foundation": "foundation_or_community",
}


@dataclass(frozen=True)
class RegistryMatch:
    entity_name: str
    entity_type: str
    matched_value: str
    match_type: str          # domain | github_owner | alias
    owner_scope: str         # established_organization | foundation_or_community


@lru_cache(maxsize=1)
def load_registry() -> list[dict[str, Any]]:
    path = CONFIG_DIR / "organization_registry.yaml"
    if not path.exists():
        raise ConfigError(f"Missing organization registry: {path}")
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    return data.get("organizations", []) or []


def _bare_host(host: str) -> str:
    host = (host or "").lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def _scope(entity_type: str) -> str:
    return _SCOPE_BY_TYPE.get(entity_type, "established_organization")


def match_domain(host: str) -> Optional[RegistryMatch]:
    """Exact or dot-boundary subdomain match. Substring is forbidden."""
    host = _bare_host(host)
    if not host:
        return None
    for org in load_registry():
        for dom in org.get("domains", []) or []:
            d = dom.lower()
            if host == d or host.endswith("." + d):
                return RegistryMatch(org["entity_name"], org["entity_type"], d,
                                     "domain", _scope(org["entity_type"]))
    return None


def match_github_owner(owner: str) -> Optional[RegistryMatch]:
    """Exact, case-insensitive owner match. Substring is forbidden."""
    if not owner:
        return None
    o = owner.strip().lower()
    for org in load_registry():
        for ro in org.get("github_owners", []) or []:
            if o == str(ro).strip().lower():
                return RegistryMatch(org["entity_name"], org["entity_type"], str(ro),
                                     "github_owner", _scope(org["entity_type"]))
    return None


def match_aliases_in_text(text: str) -> list[RegistryMatch]:
    """Word-boundary alias matches in text (explicit_text_attribution only).

    An alias match alone NEVER proves the author works for the organization.
    """
    out: list[RegistryMatch] = []
    seen = set()
    for org in load_registry():
        for alias in org.get("aliases", []) or []:
            if re.search(rf"\b{re.escape(alias)}\b", text):
                key = org["entity_name"]
                if key not in seen:
                    seen.add(key)
                    out.append(RegistryMatch(org["entity_name"], org["entity_type"], alias,
                                             "alias", _scope(org["entity_type"])))
    return out
