# -*- coding: utf-8 -*-
"""
Live SERP & Competitor Intelligence Audit for Foresight Home Inspections (fhinspectionsatl.com)
----------------------------------------------------------------------------------------------
100% Real Scraper:
- Scrapes live search engine results (Yahoo Organic SERP + Google Autocomplete API)
- Resolves real destination URLs, verifies HTTP status codes, and inspects competitor DOMs for visible pricing
- Every record carries `source_url` and `retrieved_on` (ISO-8601 UTC)
- Saves full raw JSON dataset to `data/live-serp-audit.json`
"""

import os
import sys
import json
import time
import re
from datetime import datetime, timezone
from urllib.parse import unquote, urlparse, quote_plus
import html as html_lib
import requests

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

TARGET_QUERIES = [
    {"query": "home inspection Atlanta", "service": "Single-Family Home Inspection", "foresight_price": "$345+", "foresight_url": "https://fhinspectionsatl.com/"},
    {"query": "sewer scope inspection Atlanta", "service": "Sewer Scope Inspection", "foresight_price": "$450 flat rate", "foresight_url": "https://fhinspectionsatl.com/services/sewer-scope-inspection"},
    {"query": "mold inspection Atlanta", "service": "Mold & Air Quality Testing", "foresight_price": "$450 flat rate", "foresight_url": "https://fhinspectionsatl.com/services/mold-air-quality-testing"},
    {"query": "new construction home inspection Atlanta", "service": "New Construction / Pre-Drywall", "foresight_price": "$400 / $275 Pre-Drywall", "foresight_url": "https://fhinspectionsatl.com/services/new-construction-inspection"},
    {"query": "11 month warranty inspection Atlanta", "service": "11-Month Builder Warranty Inspection", "foresight_price": "$335", "foresight_url": "https://fhinspectionsatl.com/services/11-month-warranty-inspection"},
    {"query": "DeKalb County low flow toilet certificate", "service": "DeKalb Low-Flow Toilet Certificate", "foresight_price": "$100 flat rate", "foresight_url": "https://fhinspectionsatl.com/services/dekalb-low-flow-compliance"},
    {"query": "Atlanta short term rental inspection", "service": "Atlanta STR Life-Safety Inspection", "foresight_price": "$595 flat rate", "foresight_url": "https://fhinspectionsatl.com/services/short-term-rental-inspection"},
    {"query": "radon testing Atlanta", "service": "Radon Gas Testing", "foresight_price": "$275", "foresight_url": "https://fhinspectionsatl.com/services/radon-testing"},
    {"query": "home inspector Lithonia GA", "service": "Local Hub: Lithonia, GA", "foresight_price": "$345+", "foresight_url": "https://fhinspectionsatl.com/service-areas/lithonia"},
    {"query": "home inspector Decatur GA", "service": "Local Hub: Decatur, GA", "foresight_price": "$345+", "foresight_url": "https://fhinspectionsatl.com/service-areas/decatur"},
]

def resolve_yahoo_link(raw_href):
    if "RU=" in raw_href:
        m = re.search(r"RU=([^/]+)", raw_href)
        if m:
            return unquote(m.group(1))
    return raw_href

def fetch_serp_live(query, max_results=10):
    now_iso = datetime.now(timezone.utc).isoformat()
    search_url = f"https://search.yahoo.com/search?p={quote_plus(query)}"
    results = []
    seen_urls = set()
    try:
        res = requests.get(search_url, headers=HEADERS, timeout=15)
        if res.status_code == 200:
            # Split cleanly by each organic result block
            algo_blocks = re.split(r'<div class="dd algo', res.text)[1:]
            if not algo_blocks:
                algo_blocks = re.split(r'<div class="compTitle', res.text)[1:]


            for block in algo_blocks:
                if len(results) >= max_results:
                    break
                a_m = re.search(r'<h3[^>]*>.*?<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', block, flags=re.S)
                if not a_m:
                    a_m = re.search(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', block, flags=re.S)
                if not a_m:
                    continue
                raw_href = html_lib.unescape(a_m.group(1))
                real_url = resolve_yahoo_link(raw_href)
                if not real_url.startswith("http") or "yahoo.com" in real_url or "bing.com/aclick" in real_url:
                    continue
                if real_url in seen_urls:
                    continue
                seen_urls.add(real_url)

                # Clean title (remove span url breadcrumbs inside Yahoo h3)
                raw_title_html = re.sub(r'<span[^>]*>.*?</span>', ' ', a_m.group(2), flags=re.S)
                title = html_lib.unescape(re.sub(r"<[^>]+>", " ", raw_title_html))
                title = re.sub(r"\s+", " ", title).strip()
                if not title:
                    title = html_lib.unescape(re.sub(r"<[^>]+>", " ", a_m.group(2))).strip()

                s_m = re.search(r'<div class="compText[^>]*>(.*?)</div>', block, flags=re.S)
                snippet = html_lib.unescape(re.sub(r"<[^>]+>", " ", s_m.group(1))) if s_m else ""
                snippet = re.sub(r"\s+", " ", snippet).strip()

                parsed = urlparse(real_url)
                domain = parsed.netloc.lower().replace("www.", "")
                results.append({
                    "position": len(results) + 1,
                    "title": title,
                    "url": real_url,
                    "domain": domain,
                    "snippet": snippet[:300],
                    "source_url": search_url,
                    "retrieved_on": now_iso,
                })
    except Exception as e:
        print(f"  [WARN] SERP error for '{query}': {e}")
    return results

def fetch_google_autocomplete(query):
    now_iso = datetime.now(timezone.utc).isoformat()
    api_url = f"https://suggestqueries.google.com/complete/search?client=firefox&q={quote_plus(query)}"
    try:
        res = requests.get(api_url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            data = res.json()
            suggestions = data[1] if len(data) > 1 else []
            return {
                "suggestions": suggestions,
                "source_url": api_url,
                "retrieved_on": now_iso,
            }
    except Exception:
        pass
    return {"suggestions": [], "source_url": api_url, "retrieved_on": now_iso}

def inspect_competitor_page(url, url_cache):
    if url in url_cache:
        return url_cache[url]
    now_iso = datetime.now(timezone.utc).isoformat()
    info = {
        "url": url,
        "http_status": None,
        "reachable": False,
        "shows_dollar_price_in_html": False,
        "detected_prices": [],
        "has_product_or_faq_schema": False,
        "source_url": url,
        "retrieved_on": now_iso,
    }
    try:
        r = requests.get(url, headers=HEADERS, timeout=8, allow_redirects=True)
        info["http_status"] = r.status_code
        info["reachable"] = 200 <= r.status_code < 400
        if info["reachable"]:
            text_clean = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", r.text, flags=re.I | re.S)
            visible_text = re.sub(r"<[^>]+>", " ", text_clean)
            prices = list(set(re.findall(r"\$[1-9]\d{1,3}(?:,\d{3})?", visible_text)))
            info["detected_prices"] = sorted(prices)[:8]
            info["shows_dollar_price_in_html"] = len(prices) > 0
            compact_html = r.text.replace(" ", "")
            info["has_product_or_faq_schema"] = ('"@type":"FAQPage"' in compact_html or '"@type":"Product"' in compact_html)
    except Exception as e:
        info["error"] = str(e)[:120]
    url_cache[url] = info
    return info

def main():
    print("🚀 Starting Live SERP & Competitor Intelligence Audit for Foresight Home Inspections...\n")
    audit_start = datetime.now(timezone.utc).isoformat()
    url_cache = {}
    all_query_reports = []
    domain_frequency = {}

    skip_dirs = {
        "yelp.com", "angi.com", "thumbtack.com", "homeadvisor.com", "bbb.org",
        "reddit.com", "facebook.com", "youtube.com", "nextdoor.com", "expertise.com",
        "houzz.com", "yellowpages.com", "mapquest.com", "porch.com", "forbes.com"
    }

    for item in TARGET_QUERIES:
        q = item["query"]
        serp_rows = fetch_serp_live(q, max_results=10)
        autocomplete = fetch_google_autocomplete(q)
        print(f"🔎 '{q}' -> {len(serp_rows)} live organic results | {len(autocomplete['suggestions'])} Google suggestions")

        inspected_count = 0
        for row in serp_rows:
            d = row["domain"]
            domain_frequency[d] = domain_frequency.get(d, 0) + 1
            if inspected_count < 3 and not any(d == sd or d.endswith("." + sd) for sd in skip_dirs):
                page_check = inspect_competitor_page(row["url"], url_cache)
                row["page_audit"] = page_check
                inspected_count += 1

        foresight_ranked = [r for r in serp_rows if "fhinspectionsatl.com" in r["domain"] or "foresight" in r["title"].lower()]

        all_query_reports.append({
            "query": q,
            "service": item["service"],
            "foresight_price": item["foresight_price"],
            "foresight_target_url": item["foresight_url"],
            "foresight_in_top_10": len(foresight_ranked) > 0,
            "organic_count": len(serp_rows),
            "organic_results": serp_rows,
            "google_autocomplete": autocomplete,
        })

    total_checked = len(url_cache)
    passed_checked = sum(1 for v in url_cache.values() if v.get("reachable"))
    failed_checked = total_checked - passed_checked
    transparent_pricing_count = sum(1 for v in url_cache.values() if v.get("shows_dollar_price_in_html"))
    schema_count = sum(1 for v in url_cache.values() if v.get("has_product_or_faq_schema"))

    top_domains = sorted(domain_frequency.items(), key=lambda x: x[1], reverse=True)[:15]

    output_data = {
        "audit_metadata": {
            "business": "Foresight Home Inspections (fhinspectionsatl.com)",
            "retrieved_on": audit_start,
            "queries_scraped": len(TARGET_QUERIES),
            "urls_http_verified": total_checked,
            "urls_http_passed": passed_checked,
            "urls_http_failed": failed_checked,
            "competitor_pages_with_visible_dollar_prices": transparent_pricing_count,
            "competitor_pages_with_product_or_faq_schema": schema_count,
        },
        "top_ranking_domains_across_queries": [
            {"domain": d, "appearances_in_top_10": c} for d, c in top_domains
        ],
        "query_audits": all_query_reports,
    }

    out_path = r"C:\Users\fores\.gemini\antigravity\scratch\foresight-website\data\live-serp-audit.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print("\n=====================================================================")
    print("✅ LIVE SERP AUDIT COMPLETE")
    print(f"📁 Saved Raw JSON Dataset: {out_path}")
    print(f"🌐 HTTP Verification: {passed_checked}/{total_checked} passed ({failed_checked} failed)")
    print(f"💲 Competitor Pages Showing Visible Dollar Prices: {transparent_pricing_count}/{total_checked}")
    print(f"🧩 Competitor Pages Using Product/FAQ Schema: {schema_count}/{total_checked}")
    print("=====================================================================\n")

    print("Top Ranking Domains Across 10 Commercial Queries:")
    for d, c in top_domains[:12]:
        print(f"  - {d}: {c}/10 queries")

if __name__ == "__main__":
    main()
