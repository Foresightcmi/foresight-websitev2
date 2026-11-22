"""Canonical URL, locale, and route-template cohort normalizer."""
from __future__ import annotations

from urllib.parse import parse_qsl, urlencode, urlsplit

STRIP_QUERY_PARAMS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "utm_id", "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "srsltid",
    "mc_cid", "mc_eid", "_ga", "_gl", "ref",
}

KNOWN_LOCALES = {
    "en", "es", "fr", "de", "it", "pt", "pl", "nl", "sv", "no", "da", "fi",
    "ja", "ko", "zh", "ar", "hi", "tr", "cs", "ro", "uk", "vi", "id", "th",
    "en-us", "en-gb", "en-ca", "en-au", "es-mx", "pt-br", "fr-ca",
}


def normalize_url(raw_url: str) -> str:
    """Normalize full or relative URLs to canonical lowercase path (+ non-tracking query)."""
    if not raw_url:
        return "/"
    val = raw_url.strip()
    parts = urlsplit(val)
    path = (parts.path or "/").lower()
    while "//" in path:
        path = path.replace("//", "/")
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    if not path.startswith("/"):
        path = "/" + path

    if parts.query:
        kept = [
            (k.lower(), v)
            for k, v in parse_qsl(parts.query, keep_blank_values=False)
            if k.lower() not in STRIP_QUERY_PARAMS and not k.lower().startswith("utm_")
        ]
        if kept:
            kept.sort()
            return f"{path}?{urlencode(kept)}"
    return path


def extract_locale(canonical_url: str) -> str:
    """Return ISO locale prefix (e.g. 'pl') if present as first path segment, else 'default'."""
    path = canonical_url.split("?", 1)[0]
    segs = [s for s in path.split("/") if s]
    if segs and segs[0] in KNOWN_LOCALES:
        return segs[0]
    return "default"


def extract_template_cohort(canonical_url: str) -> str:
    """Map canonical URL to its route-template cohort (e.g. '/guides/*', '/shop/*', '/pricing')."""
    path = canonical_url.split("?", 1)[0]
    segs = [s for s in path.split("/") if s]
    if segs and segs[0] in KNOWN_LOCALES:
        segs = segs[1:]
    if not segs:
        return "/"
    if len(segs) == 1:
        return f"/{segs[0]}"
    return f"/{segs[0]}/*"
