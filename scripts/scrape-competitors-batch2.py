import json
import re
import urllib.request
import urllib.error
import ssl
from datetime import datetime, timezone

# Target URLs for Batch 2 Metro Atlanta Competitors
TARGETS = [
    {
        "name": "Avalon Home Inspections",
        "url": "https://avaloninspections.com/",
        "services_url": "https://avaloninspections.com/services/"
    },
    {
        "name": "Scott Home Services",
        "url": "https://scotthomeservices.com/",
        "services_url": "https://scotthomeservices.com/services/"
    },
    {
        "name": "Paris Pressley Real Estate Inspector",
        "url": "https://www.ppinspect.com/",
        "services_url": "https://www.ppinspect.com/pricing-fees/"
    },
    {
        "name": "The BrickKicker Greater Atlanta",
        "url": "https://www.georgia.brickkicker.com/",
        "services_url": "https://brickkicker.com/greater-atlanta/"
    },
    {
        "name": "Noble Property Inspections",
        "url": "https://www.noble-pi.com/",
        "services_url": "https://www.noble-pi.com/services"
    },
    {
        "name": "John Mease Home Inspections",
        "url": "https://johnmeasehomeinspections.com/",
        "services_url": "https://johnmeasehomeinspections.com/pricing/"
    },
    {
        "name": "Superior Home Inspections",
        "url": "https://choosesuperiorinspection.com/",
        "services_url": "https://choosesuperiorinspection.com/services/"
    },
    {
        "name": "Conley Home Inspections",
        "url": "https://conleyhomeinspections.com/",
        "services_url": "https://conleyhomeinspections.com/services/"
    },
    {
        "name": "Sherlock Homes Inspection Co.",
        "url": "http://sherlockhic.com/",
        "services_url": "http://sherlockhic.com/services.html"
    }
]

def fetch_url(url):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12, context=ctx) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return response.status, html
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return str(e), ""

def parse_html_dom(html, url):
    data = {
        "source_url": url,
        "retrieved_on": datetime.now(timezone.utc).isoformat(),
        "title": "",
        "meta_description": "",
        "h1s": [],
        "h2s": [],
        "schemas": [],
        "prices_found": [],
        "warranty_mentions": [],
        "team_mentions": [],
        "services_detected": [],
        "turnaround_mentions": []
    }
    
    # Title
    t_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    if t_match:
        data["title"] = re.sub(r'\s+', ' ', t_match.group(1)).strip()
        
    # Meta Description
    m_match = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', html, re.IGNORECASE)
    if not m_match:
        m_match = re.search(r'<meta[^>]*content=["\'](.*?)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE)
    if m_match:
        data["meta_description"] = m_match.group(1).strip()
        
    # H1s
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
    data["h1s"] = [re.sub(r'<[^>]+>', '', h).strip() for h in h1s if re.sub(r'<[^>]+>', '', h).strip()]
    
    # H2s (top 8)
    h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.IGNORECASE | re.DOTALL)
    data["h2s"] = [re.sub(r'<[^>]+>', '', h).strip() for h in h2s if re.sub(r'<[^>]+>', '', h).strip()][:8]
    
    # Schemas
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
            elif isinstance(parsed, list):
                for item in parsed:
                    if isinstance(item, dict) and '@type' in item:
                        data["schemas"].append(item['@type'])
        except:
            data["schemas"].append("Unparsed_JSON_LD")
            
    # Prices found (e.g. $350, $400)
    prices = set(re.findall(r'\$\d{2,4}(?:\.\d{2})?', html))
    data["prices_found"] = sorted(list(prices))
    
    # Warranty mentions
    w_matches = re.findall(r'([^.?!]*?(?:warranty|guarantee|\$10,000|\$25,000|\$100,000|90-day)[^.?!]*?[.?!])', html, re.IGNORECASE)
    data["warranty_mentions"] = [re.sub(r'<[^>]+>', '', m).strip() for m in w_matches[:5]]
    
    # Team mentions
    t_matches = re.findall(r'([^.?!]*?(?:two inspector|2 inspector|team|solo|single inspector)[^.?!]*?[.?!])', html, re.IGNORECASE)
    data["team_mentions"] = [re.sub(r'<[^>]+>', '', m).strip() for m in t_matches[:5]]
    
    # Turnaround mentions
    time_matches = re.findall(r'([^.?!]*?(?:same day|24 hour|next day|report delivery|turnaround)[^.?!]*?[.?!])', html, re.IGNORECASE)
    data["turnaround_mentions"] = [re.sub(r'<[^>]+>', '', tm).strip() for tm in time_matches[:4]]
    
    # Services detected
    keywords = ['radon', 'sewer scope', 'thermal', 'infrared', 'termite', 'mold', '11-month', 'new construction', 'pre-drywall', 'pool', 'commercial']
    lower_html = html.lower()
    for kw in keywords:
        if kw in lower_html:
            data["services_detected"].append(kw)
            
    return data

def main():
    results = {}
    total_urls = 0
    passed_urls = 0
    
    print("=== STARTING BATCH 2 METRO ATLANTA COMPETITOR SCRAPE ===")
    for target in TARGETS:
        name = target["name"]
        print(f"\n[TARGET] {name}")
        results[name] = {
            "homepage": {},
            "services_page": {}
        }
        
        # Homepage
        status, html = fetch_url(target["url"])
        total_urls += 1
        print(f"  Fetching Homepage: {target['url']} -> HTTP {status}")
        if status == 200:
            passed_urls += 1
            results[name]["homepage"] = parse_html_dom(html, target["url"])
        else:
            results[name]["homepage"] = {"status": status, "source_url": target["url"], "retrieved_on": datetime.now(timezone.utc).isoformat()}
            
        # Services page if distinct
        if target.get("services_url") and target["services_url"] != target["url"]:
            s_status, s_html = fetch_url(target["services_url"])
            total_urls += 1
            print(f"  Fetching Services: {target['services_url']} -> HTTP {s_status}")
            if s_status == 200:
                passed_urls += 1
                results[name]["services_page"] = parse_html_dom(s_html, target["services_url"])
            else:
                results[name]["services_page"] = {"status": s_status, "source_url": target["services_url"], "retrieved_on": datetime.now(timezone.utc).isoformat()}
                
    output_path = "data/competitor-deep-dive-batch2.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    print("\n=== BATCH 2 SCRAPE COMPLETED ===")
    print(f"Total URLs Checked: {total_urls}")
    print(f"Passed (HTTP 200): {passed_urls}")
    print(f"Failed: {total_urls - passed_urls}")
    print(f"Dataset Saved: {output_path}")

if __name__ == "__main__":
    main()
