import json
import re
import urllib.request
import ssl
from datetime import datetime, timezone

TARGET_URLS = [
    {
        "name": "Paris Pressley Real Estate Inspector",
        "url": "https://www.ppinspect.com/services-and-prices",
        "category": "pricing"
    },
    {
        "name": "Noble Property Inspections",
        "url": "https://www.noble-pi.com/pricing",
        "category": "pricing"
    },
    {
        "name": "Noble Property Inspections Costs",
        "url": "https://www.noble-pi.com/costs",
        "category": "costs"
    },
    {
        "name": "Conley Home Inspections Services",
        "url": "https://www.conleyhomeinspections.com/additional-services/",
        "category": "services"
    },
    {
        "name": "Conley Sewer Scope",
        "url": "https://www.conleyhomeinspections.com/additional-services/sewer-scope/",
        "category": "sewer-scope"
    },
    {
        "name": "Scott Home Services Residential",
        "url": "https://scotthomeservices.com/residential-home-inspection-services-metro-atlanta/",
        "category": "residential"
    },
    {
        "name": "Scott Home Services Homeowner",
        "url": "https://scotthomeservices.com/home-owner-services/",
        "category": "services"
    },
    {
        "name": "The BrickKicker Georgia Residential",
        "url": "https://www.georgia.brickkicker.com/residential-home-inspections/",
        "category": "residential"
    },
    {
        "name": "The BrickKicker Georgia 11-Month",
        "url": "https://www.georgia.brickkicker.com/residential-inspections/11-month-warranty-inspections/",
        "category": "warranty"
    },
    {
        "name": "John Mease Services",
        "url": "https://johnmeasehomeinspections.com/services/",
        "category": "services"
    }
]

def fetch_url(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12, context=ctx) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return response.status, html
    except Exception as e:
        return str(e), ""

def parse_page(html, url):
    data = {
        "source_url": url,
        "retrieved_on": datetime.now(timezone.utc).isoformat(),
        "title": "",
        "meta_description": "",
        "h1s": [],
        "h2s": [],
        "schemas": [],
        "prices_found": [],
        "text_snippets": []
    }
    
    t_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    if t_match:
        data["title"] = re.sub(r'\s+', ' ', t_match.group(1)).strip()
        
    m_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', html, re.IGNORECASE)
    if not m_match:
        m_match = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE)
    if m_match:
        data["meta_description"] = m_match.group(1).strip()
        
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
    data["h1s"] = [re.sub(r'<[^>]+>', '', h).strip() for h in h1s if re.sub(r'<[^>]+>', '', h).strip()]
    
    h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.IGNORECASE | re.DOTALL)
    data["h2s"] = [re.sub(r'<[^>]+>', '', h).strip() for h in h2s if re.sub(r'<[^>]+>', '', h).strip()][:6]
    
    ld_blocks = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.IGNORECASE | re.DOTALL)
    for block in ld_blocks:
        try:
            parsed = json.loads(block)
            if isinstance(parsed, dict):
                data["schemas"].append(parsed.get('@type', 'Unknown'))
                if '@graph' in parsed:
                    for item in parsed['@graph']:
                        if isinstance(item, dict) and '@type' in item:
                            data["schemas"].append(item['@type'])
        except:
            pass
            
    prices = set(re.findall(r'\$\d{2,4}(?:\.\d{2})?', html))
    data["prices_found"] = sorted(list(prices))
    
    # Extract pricing lines or sentences containing prices
    price_lines = re.findall(r'([^.?!<\n]*?\$\d{2,4}[^.?!<\n]*)', html)
    data["text_snippets"] = [re.sub(r'<[^>]+>', '', pl).strip() for pl in price_lines[:10] if pl.strip()]
    
    return data

def main():
    results = {}
    print("=== SCRAPING TARGETED COMPETITOR SERVICE & PRICING DOMS ===")
    for t in TARGET_URLS:
        status, html = fetch_url(t["url"])
        print(f"Fetching {t['name']} ({t['url']}) -> HTTP {status}")
        if status == 200:
            parsed = parse_page(html, t["url"])
            parsed["status"] = 200
            results[t["name"]] = parsed
        else:
            results[t["name"]] = {"status": status, "source_url": t["url"], "retrieved_on": datetime.now(timezone.utc).isoformat()}
            
    with open("data/competitor-deep-dive-batch2-prices.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("\nSaved targeted pricing data to data/competitor-deep-dive-batch2-prices.json")

if __name__ == "__main__":
    main()
