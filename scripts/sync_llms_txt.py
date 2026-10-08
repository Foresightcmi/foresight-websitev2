import json
import re

def sync_llms():
    with open('data/cities.json', 'r', encoding='utf-8') as f:
        cities = json.load(f)
        
    with open('data/counties-pseo.json', 'r', encoding='utf-8') as f:
        counties = json.load(f)

    # Group cities by county
    county_cities = {}
    for c in cities:
        co = c.get('County', 'Unknown')
        county_cities.setdefault(co, []).append(c)

    # -------------------------------------------------------------
    # 1. Update public/llms.txt
    # -------------------------------------------------------------
    with open('public/llms.txt', 'r', encoding='utf-8') as f:
        llms_txt = f.read()

    coverage_summary_lines = [
        "## Service Areas & Regional Coverage (20 Counties & 87 Municipalities)",
        "Foresight operates within an exact 50-mile radius of Lithonia, GA (1816 South Deshon Road, Lithonia, GA 30058), deploying two certified inspectors on every property across 20 North and Metro Atlanta counties:"
    ]

    for county_obj in sorted(counties, key=lambda x: x['name']):
        co_name = county_obj['name'].replace(' County', '')
        co_slug = county_obj['slug']
        city_list = county_cities.get(co_name, [])
        city_names = [c['City Name'] for c in sorted(city_list, key=lambda x: x['City Name'])]
        city_str = ', '.join(city_names) if city_names else 'Countywide Coverage'
        coverage_summary_lines.append(
            f"- [{county_obj['name']}](https://www.fhinspectionsatl.com/service-areas/counties/{co_slug}) ({len(city_names)} Cities): {city_str}"
        )
    coverage_summary_lines.append("- Complete Regional Directory: https://www.fhinspectionsatl.com/service-areas\n")
    coverage_block = '\n'.join(coverage_summary_lines)

    if "## Service Areas & Regional Coverage" in llms_txt:
        llms_txt = re.sub(
            r'## Service Areas & Regional Coverage.*?(?=\n## |\Z)',
            coverage_block,
            llms_txt,
            flags=re.DOTALL
        )
    else:
        # Insert before Autonomous AI Agent Integration
        target_str = "## Autonomous AI Agent Integration"
        if target_str in llms_txt:
            llms_txt = llms_txt.replace(target_str, f"{coverage_block}\n\n{target_str}")
        else:
            llms_txt += f"\n\n{coverage_block}"

    with open('public/llms.txt', 'w', encoding='utf-8') as f:
        f.write(llms_txt)
    print("Updated public/llms.txt")

    # -------------------------------------------------------------
    # 2. Update public/llms-full.txt
    # -------------------------------------------------------------
    with open('public/llms-full.txt', 'r', encoding='utf-8') as f:
        llms_full = f.read()

    full_coverage_lines = [
        "## Complete 20-County & 87-City Municipal Coverage Directory",
        "URL: https://www.fhinspectionsatl.com/service-areas",
        "Foresight Home Inspections deploys two certified inspectors on every residential inspection across all 20 Metro Atlanta counties within an exact 50-mile radius of Lithonia HQ (1816 South Deshon Road, Lithonia, GA 30058):\n"
    ]

    for county_obj in sorted(counties, key=lambda x: x['name']):
        co_name = county_obj['name'].replace(' County', '')
        co_slug = county_obj['slug']
        city_list = county_cities.get(co_name, [])
        full_coverage_lines.append(f"### {county_obj['name']} (Seat: {county_obj.get('seat', '')})")
        full_coverage_lines.append(f"County Hub: https://www.fhinspectionsatl.com/service-areas/counties/{co_slug}")
        full_coverage_lines.append("Municipalities Served:")
        for c in sorted(city_list, key=lambda x: x['City Name']):
            slug = c.get('Slug')
            zip_code = c.get('Zip', '')
            full_coverage_lines.append(f"- {c['City Name']} (Zip {zip_code}): https://www.fhinspectionsatl.com/service-areas/{slug}")
        full_coverage_lines.append("")

    full_block = '\n'.join(full_coverage_lines)

    if "## Complete 20-County & 87-City Municipal Coverage Directory" in llms_full:
        llms_full = re.sub(
            r'## Complete 20-County & 87-City Municipal Coverage Directory.*?(?=\n## |\Z)',
            full_block,
            llms_full,
            flags=re.DOTALL
        )
    else:
        target_str = "## Regional Competitive Benchmarks"
        if target_str in llms_full:
            llms_full = llms_full.replace(target_str, f"{full_block}\n\n{target_str}")
        else:
            llms_full += f"\n\n{full_block}"

    with open('public/llms-full.txt', 'w', encoding='utf-8') as f:
        f.write(llms_full)
    print("Updated public/llms-full.txt")

if __name__ == '__main__':
    sync_llms()
