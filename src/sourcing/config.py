"""Configuration loading: YAML config files + `.env` secrets.

Security rule (mandate): read ``X_BEARER_TOKEN`` from the environment and NEVER
print the complete token. :func:`masked_token` is the only sanctioned way to
show token material in logs.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv

# Project root = two levels up from this file (src/sourcing/config.py -> root).
PROJECT_ROOT = Path(__file__).resolve().parents[2]
CONFIG_DIR = PROJECT_ROOT / "config"
DATA_DIR = PROJECT_ROOT / "data"
OUTPUT_DIR = DATA_DIR / "output"
CACHE_PATH = DATA_DIR / "cache.db"


class ConfigError(RuntimeError):
    """Raised when required configuration or secrets are missing/invalid."""


def _load_yaml(name: str) -> dict[str, Any]:
    path = CONFIG_DIR / name
    if not path.exists():
        raise ConfigError(f"Missing config file: {path}")
    with path.open("r", encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    if not isinstance(data, dict):
        raise ConfigError(f"Config file {name} did not parse to a mapping")
    return data


@lru_cache(maxsize=1)
def load_queries() -> dict[str, Any]:
    return _load_yaml("queries.yaml")


@lru_cache(maxsize=1)
def load_keywords() -> dict[str, Any]:
    return _load_yaml("keywords.yaml")


@lru_cache(maxsize=1)
def load_scoring() -> dict[str, Any]:
    return _load_yaml("scoring.yaml")


@lru_cache(maxsize=1)
def load_platform_risk() -> dict[str, Any]:
    return _load_yaml("platform_risk.yaml")


@lru_cache(maxsize=1)
def load_runtime() -> dict[str, Any]:
    return _load_yaml("runtime.yaml")


def masked_token(token: str | None) -> str:
    """Return a fully redacted representation of a bearer token.

    Never reveals the token's value, prefix, suffix, length, or shape.
    """
    return "redacted"


def credential_status_lines(token: str | None) -> list[str]:
    """The only sanctioned credential log lines (loaded yes/no + redacted)."""
    return [
        f"Bearer token loaded: {'yes' if token else 'no'}",
        "Bearer token value: redacted",
    ]


@dataclass(frozen=True)
class Secrets:
    x_bearer_token: str
    anthropic_api_key: str | None = None

    @property
    def masked_x_token(self) -> str:
        return masked_token(self.x_bearer_token)


def load_secrets(require_x: bool = True, require_llm: bool = False) -> Secrets:
    """Load secrets from the environment (populated from `.env`).

    Parameters
    ----------
    require_x:
        Raise :class:`ConfigError` if ``X_BEARER_TOKEN`` is unset. In ``--dry-run``
        mode the caller may set this False so no token is needed.
    require_llm:
        Raise if ``ANTHROPIC_API_KEY`` is unset (only when ``--llm`` requested).
    """
    load_dotenv(PROJECT_ROOT / ".env", override=False)

    x_token = os.environ.get("X_BEARER_TOKEN", "").strip()
    if require_x and not x_token:
        raise ConfigError(
            "X_BEARER_TOKEN is not set. Add it to .env (see .env.example). "
            "It is read from the environment and never printed in full."
        )

    llm_key = os.environ.get("ANTHROPIC_API_KEY", "").strip() or None
    if require_llm and not llm_key:
        raise ConfigError(
            "ANTHROPIC_API_KEY is not set but --llm was requested. "
            "Add it to .env or drop --llm."
        )

    return Secrets(x_bearer_token=x_token, anthropic_api_key=llm_key)


def ensure_dirs() -> None:
    """Create data/output directories if they do not exist."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
