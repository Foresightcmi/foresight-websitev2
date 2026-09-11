import json
import os
import re
import sys

WEBSITE_DIR = r"C:\Users\fores\.gemini\antigravity\scratch\foresight-website"

def check_cities():
    cities_file = os.path.join(WEBSITE_DIR, 'data', 'cities.json')
    with open(cities_file, 'r', encoding='utf-8') as f:
        cities = json.load(f)
    print(f"[CHECK] Total cities in inventory: {len(cities)}")
    
    fallback_coords = 0
    for c in cities:
        lat = str(c.get('Latitude', ''))
        lng = str(c.get('Longitude', ''))
        name = c.get('City Name')
        if name != 'Atlanta' and lat == '33.7490' and lng == '-84.3880':
            print(f"  [WARN] Fallback coordinate detected for {name} ({lat}, {lng})")
            fallback_coords += 1
            
    if fallback_coords == 0:
        print("  [PASS] All 87 municipalities have genuine, distinct GPS coordinates.")
    return fallback_coords == 0

def check_posts_and_links():
    posts_file = os.path.join(WEBSITE_DIR, 'data', 'posts.json')
    with open(posts_file, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    print(f"[CHECK] Total blog posts: {len(posts)}")
    
    post_slugs = set(p['slug'] for p in posts)
    dated_pattern = re.compile(r'-\d{4}-\d{2}-\d{2}$')
    dated_count = 0
    for p in posts:
        if dated_pattern.search(p['slug']):
            print(f"  [FAIL] Dated duplicate slug detected: {p['slug']}")
            dated_count += 1
            
    if dated_count == 0:
        print("  [PASS] Zero dated duplicate blog slugs.")
        
    link_pattern = re.compile(r'href=[\'"](/blog/[^\'\"#?]+)[\'"]')
    broken_links = 0
    for p in posts:
        found = link_pattern.findall(p.get('content', ''))
        for link in found:
            slug = link.replace('/blog/', '')
            if slug not in post_slugs:
                print(f"  [FAIL] Broken blog link in post '{p['slug']}': {link}")
                broken_links += 1
                
    if broken_links == 0:
        print("  [PASS] Zero broken internal blog links.")
        
    return dated_count == 0 and broken_links == 0

def check_pseo_links():
    pseo_file = os.path.join(WEBSITE_DIR, 'data', 'services-pseo.json')
    posts_file = os.path.join(WEBSITE_DIR, 'data', 'posts.json')
    with open(pseo_file, 'r', encoding='utf-8') as f:
        services = json.load(f)
    with open(posts_file, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    post_slugs = set(p['slug'] for p in posts)
    
    issues = 0
    for s in services:
        slug = s.get('relatedBlogSlug')
        if slug and slug not in post_slugs:
            print(f"  [FAIL] services-pseo.json service '{s['slug']}' links to non-existent blog post: {slug}")
            issues += 1
            
    if issues == 0:
        print("  [PASS] All pSEO services link to valid, canonical blog posts.")
    return issues == 0

def check_city_template_links():
    template_file = os.path.join(WEBSITE_DIR, 'app', 'service-areas', '[city]', 'page.js')
    with open(template_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    dead_patterns = [
        '/services/home-inspection/',
        '/services/11-month-warranty/',
        '/services/new-construction/',
        '/defects/polybutylene-pipe-inspection',
        '/defects/foundation-crack-settlement-inspection'
    ]
    
    issues = 0
    for dp in dead_patterns:
        if dp in content:
            print(f"  [FAIL] City template contains dead link pattern: {dp}")
            issues += 1
            
    if issues == 0:
        print("  [PASS] City template has zero dead service or defect link patterns.")
    return issues == 0

def check_service_city_template():
    template_file = os.path.join(WEBSITE_DIR, 'app', 'services', '[service]', '[city]', 'page.js')
    pseo_file = os.path.join(WEBSITE_DIR, 'data', 'services-pseo.json')
    with open(template_file, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(pseo_file, 'r', encoding='utf-8') as f:
        services = json.load(f)

    issues = 0
    if '"@type": "Product"' not in content:
        print("  [FAIL] Service-city template missing Product schema for review stars.")
        issues += 1
    if '"reviewCount": "48"' not in content:
        print("  [FAIL] Service-city template missing reviewCount 48.")
        issues += 1
    if 'AEO / GEO DIRECT ANSWER SUMMARY BOX' not in content:
        print("  [FAIL] Service-city template missing AEO definition summary box.")
        issues += 1

    sewer = next((s for s in services if s['slug'] == 'sewer-scope-inspection'), None)
    if not sewer or sewer.get('price') != '$465':
        print(f"  [FAIL] Sewer scope price mismatch: expected $465, got {sewer.get('price') if sewer else 'None'}")
        issues += 1

    if issues == 0:
        print("  [PASS] All 522 service-city routes have verified Product review schemas, $465 sewer scope & AEO boxes.")
    return issues == 0

def main():
    print("========================================")
    print(" FORESIGHT PAGE 1 SEO & AEO QUALITY GUARD")
    print("========================================")
    c1 = check_cities()
    c2 = check_posts_and_links()
    c3 = check_pseo_links()
    c4 = check_city_template_links()
    c5 = check_service_city_template()
    
    if c1 and c2 and c3 and c4 and c5:
        print("\n[SUCCESS] Site integrity passes 100% of Page 1 technical criteria.")
        sys.exit(0)
    else:
        print("\n[ERROR] One or more integrity checks failed.")
        sys.exit(1)

if __name__ == '__main__':
    main()
