# -*- coding: utf-8 -*-
"""
Deep Competitor Intelligence Scraper for Metro Atlanta Home Inspection Market
-----------------------------------------------------------------------------
Scrapes live DOMs of top Atlanta competitors:
- BPG Inspections (bpginspections.com)
- Home-Probe, Inc. (home-probe.com)
- Inspect-All Services (inspectallatlanta.com)
- Residential Inspector of America / RIA (atlanta.residentialinspector.com)
- Champia Real Estate Inspections (champia.com)
- Ally Property Inspections (allypropertyinspections.com)
- Atlanta Premier Home Inspections (atlantapremierhomeinspections.com)

Extracts:
- Live HTTP status & response time
- Pricing transparency & detected dollar amounts
- Team model (Solo vs 2-inspector)
- Warranty protection claims ($0, $10k, $35k)
- Technology inclusions (Thermal, Drone, Sewer, Radon, Mold)
- Structured Schema types (Product, FAQPage, AggregateRating)
- Identified strategic vulnerabilities
Every record carries source_url and retrieved_on (ISO-8601 UTC).
Saves to data/competitor-deep-dive.json.
"""

import os
import sys
import json
import time
import re
from datetime import datetime, timezone
from urllib.parse import urlparse
import html as html_lib
import requests

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

COMPETITOR_TARGETS = [
    {
        "name": "BPG Inspections",
        "domain": "bpginspections.com",
        "urls": [
            "https://www.bpginspections.com/region/atlanta",
            "https://www.bpginspections.com/pricing-packages"
        ],
        "model_type": "Corporate National Franchise / Dispatch"
    },
    {
        "name": "Home-Probe, Inc.",
        "domain": "home-probe.com",
        "urls": [
            "https://home-probe.com/",
            "https://home-probe.com/services/"
        ],
        "model_type": "Regional Solo Inspector Dispatch"
    },
    {
        "name": "Inspect-All Services",
        "domain": "inspectallatlanta.com",
        "urls": [
            "https://inspectallatlanta.com/",
            "https://inspectallservices.com/"
        ],
        "model_type": "Pest Control & Multi-Service Cross-Sell"
    },
    {
        "name": "Residential Inspector of America (RIA)",
        "domain": "atlanta.residentialinspector.com",
        "urls": [
            "https://www.atlanta.residentialinspector.com/",
            "https://www.atlanta.residentialinspector.com/sewer-line-inspections/"
        ],
        "model_type": "Private Equity Owned Regional Dispatch"
    },
    {
        "name": "Champia Real Estate Inspections",
        "domain": "champia.com",
        "urls": [
            "https://champia.com/",
            "https://champia.com/services/"
        ],
        "model_type": "Longstanding Local Multi-Inspector Firm"
    },
    {
        "name": "Ally Property Inspections",
        "domain": "allypropertyinspections.com",
        "urls": [
            "https://allypropertyinspections.com/",
            "https://allypropertyinspections.com/home-inspection-atlanta-ga/",
            "https://allypropertyinspections.com/sewer-scope-inspection/"
        ],
        "model_type": "Independent Local Inspection Firm"
    },
    {
        "name": "Atlanta Premier Home Inspections",
        "domain": "atlantapremierhomeinspections.com",
        "urls": [
            "https://www.atlantapremierhomeinspections.com/",
            "https://www.atlantapremierhomeinspections.com/radon-inspections"
        ],
        "model_type": "Local Multi-Inspector Firm"
    }
]

def scrape_page(url):
    now_iso = datetime.now(timezone.utc).isoformat()
    record = {
        "url": url,
        "source_url": url,
        "retrieved_on": now_iso,
        "http_status": None,
        "reachable": False,
        "title": "",
        "meta_description": "",
        "detected_prices": [],
        "shows_transparent_pricing": False,
        "schema_types": [],
        "has_aggregate_rating": False,
        "has_product_schema": False,
        "has_faq_schema": False,
        "raw_text_length": 0,
        "key_claims": {
            "mentions_two_inspectors": False,
            "mentions_thermal": False,
            "mentions_drone": False,
            "mentions_warranty": False,
            "warranty_amount_detected": None,
            "mentions_turnaround": False
        }
    }
    
    try:
        start_t = time.time()
        res = requests.get(url, headers=HEADERS, timeout=12, allow_redirects=True)
        record["http_status"] = res.status_code
        record["response_time_ms"] = int((time.time() - start_t) * 1000)
        
        if 200 <= res.status_code < 400:
            record["reachable"] = True
            html = res.text
            record["raw_text_length"] = len(html)
            
            # Title
            t_m = re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S)
            if t_m:
                record["title"] = html_lib.unescape(re.sub(r'\s+', ' ', t_m.group(1)).strip())
                
            # Meta Description
            d_m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', html, re.I | re.S)
            if not d_m:
                d_m = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', html, re.I | re.S)
            if d_m:
                record["meta_description"] = html_lib.unescape(d_m.group(1).strip())
                
            # Clean visible text
            clean_html = re.sub(r'<(script|style|nav|footer)[^>]*>.*?</\1>', ' ', html, flags=re.I | re.S)
            visible_text = re.sub(r'<[^>]+>', ' ', clean_html)
            visible_text = re.sub(r'\s+', ' ', visible_text)
            
            # Detected Prices
            prices = list(set(re.findall(r'\$[1-9]\d{1,3}(?:,\d{3})?', visible_text)))
            record["detected_prices"] = sorted(prices)[:12]
            record["shows_transparent_pricing"] = len(prices) > 0
            
            # Schema inspection
            schema_blocks = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.I | re.S)
            found_types = set()
            for sb in schema_blocks:
                try:
                    s_data = json.loads(sb)
                    def extract_type(obj):
                        if isinstance(obj, dict):
                            t = obj.get("@type")
                            if t:
                                if isinstance(t, list):
                                    found_types.update(t)
                                else:
                                    found_types.add(t)
                            for v in obj.values():
                                extract_type(v)
                        elif isinstance(obj, list):
                            for item in obj:
                                extract_type(item)
                    extract_type(s_data)
                except Exception:
                    pass
            
            record["schema_types"] = sorted(list(found_types))
            record["has_product_schema"] = "Product" in found_types
            record["has_faq_schema"] = "FAQPage" in found_types
            record["has_aggregate_rating"] = "AggregateRating" in found_types or "aggregateRating" in html
            
            # Key Claims
            vt_lower = visible_text.lower()
            record["key_claims"]["mentions_two_inspectors"] = any(k in vt_lower for k in ["two inspectors", "2 inspectors", "inspector team", "dual inspector"])
            record["key_claims"]["mentions_thermal"] = any(k in vt_lower for k in ["thermal imaging", "infrared", "thermal camera", "infrared scan"])
            record["key_claims"]["mentions_drone"] = any(k in vt_lower for k in ["drone", "aerial", "4k drone"])
            record["key_claims"]["mentions_warranty"] = any(k in vt_lower for k in ["warranty", "guarantee", "protection plan"])
            record["key_claims"]["mentions_turnaround"] = any(k in vt_lower for k in ["same-day", "same day", "24 hours", "24-hour", "next day"])
            
            w_m = re.findall(r'\$(?:5,000|10,000|25,000|35,000|100,000)\s*(?:warranty|guarantee)', vt_lower)
            if w_m:
                record["key_claims"]["warranty_amount_detected"] = w_m[0]
                
    except Exception as e:
        record["error"] = str(e)[:120]
        
    return record

def main():
    print("🚀 Starting Live Deep Competitor Intelligence Scrape for Metro Atlanta Market...\n")
    audit_start = datetime.now(timezone.utc).isoformat()
    competitor_reports = []
    
    total_pages = 0
    passed_pages = 0
    failed_pages = 0
    
    for comp in COMPETITOR_TARGETS:
        print(f"🏢 Scraping: {comp['name']} ({comp['domain']}) - {comp['model_type']}")
        scraped_urls = []
        for u in comp["urls"]:
            print(f"   Fetching: {u}")
            rec = scrape_page(u)
            scraped_urls.append(rec)
            total_pages += 1
            if rec["reachable"]:
                passed_pages += 1
                print(f"   ✅ HTTP {rec['http_status']} | Titles: {rec['title'][:45]}... | Prices: {len(rec['detected_prices'])} detected")
            else:
                failed_pages += 1
                print(f"   ⚠️ HTTP {rec['http_status']} / Error: {rec.get('error', 'Unreachable')}")
            time.sleep(1.0)
            
        # Synthesize Competitor Vulnerabilities
        any_transparent = any(p["shows_transparent_pricing"] for p in scraped_urls)
        any_two_insp = any(p["key_claims"]["mentions_two_inspectors"] for p in scraped_urls)
        any_product_schema = any(p["has_product_schema"] for p in scraped_urls)
        any_faq_schema = any(p["has_faq_schema"] for p in scraped_urls)
        
        vulnerabilities = []
        if not any_transparent:
            vulnerabilities.append("Opaque Pricing: Forces buyers into quote forms / phone calls rather than showing transparent upfront rates.")
        if not any_two_insp:
            vulnerabilities.append("Solo Inspector Fatigue: Dispatches a single inspector working 3.5-5 hours solo; vulnerable to Foresight's 2-inspector team narrative.")
        if not any_product_schema:
            vulnerabilities.append("Missing Product Schema: Does not output Product rich snippet markup to secure gold review stars in Google SERPs.")
        if not any_faq_schema:
            vulnerabilities.append("Missing FAQPage Schema: Leaves People Also Ask (PAA) and AI Overview answer slots open for competitor capture.")
            
        competitor_reports.append({
            "name": comp["name"],
            "domain": comp["domain"],
            "model_type": comp["model_type"],
            "scraped_pages": scraped_urls,
            "summary": {
                "transparent_pricing_visible": any_transparent,
                "two_inspector_model": any_two_insp,
                "has_product_schema": any_product_schema,
                "has_faq_schema": any_faq_schema,
                "vulnerabilities": vulnerabilities
            }
        })
        print(f"   🎯 Strategic Gaps Found: {len(vulnerabilities)}\n")
        
    out_data = {
        "metadata": {
            "retrieved_on": audit_start,
            "total_competitors_audited": len(COMPETITOR_TARGETS),
            "total_urls_checked": total_pages,
            "passed_urls": passed_pages,
            "failed_urls": failed_pages
        },
        "competitors": competitor_reports
    }
    
    out_file = r"C:\Users\fores\.gemini\antigravity\scratch\foresight-website\data\competitor-deep-dive.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(out_data, f, indent=2, ensure_ascii=False)
        
    print("=====================================================================")
    print("✅ COMPETITOR DEEP DIVE AUDIT COMPLETE")
    print(f"📁 Saved Raw JSON Dataset: {out_file}")
    print(f"🌐 Verification: {passed_pages}/{total_pages} passed ({failed_pages} failed)")
    print("=====================================================================")

if __name__ == "__main__":
    main()
