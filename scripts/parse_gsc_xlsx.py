import zipfile
import xml.etree.ElementTree as ET
import re
import json
import os
import sys

def parse_gsc_xlsx(xlsx_path, output_json_path):
    print(f"Reading {xlsx_path}...")
    
    with zipfile.ZipFile(xlsx_path, 'r') as z:
        # 1. Parse shared strings
        ss_xml = z.read('xl/sharedStrings.xml')
        root = ET.fromstring(ss_xml)
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        strings = [''.join([t.text for t in si.findall('.//main:t', ns) if t.text]) for si in root.findall('.//main:si', ns)]
        
        def parse_sheet_rows(sheet_xml):
            s_root = ET.fromstring(sheet_xml)
            rows = []
            for row in s_root.findall('.//main:row', ns):
                cols = {}
                for c in row.findall('main:c', ns):
                    col_letter = re.sub(r'[0-9]', '', c.attrib.get('r', ''))
                    cell_type = c.attrib.get('t', '')
                    v = c.find('main:v', ns)
                    val = v.text if v is not None else None
                    if val is not None and cell_type == 's':
                        val = strings[int(val)]
                    cols[col_letter] = val
                if cols:
                    rows.append(cols)
            return rows

        sheet_mapping = {
            'timeline': 'xl/worksheets/sheet1.xml',
            'queries': 'xl/worksheets/sheet2.xml',
            'pages': 'xl/worksheets/sheet3.xml',
            'countries': 'xl/worksheets/sheet4.xml',
            'devices': 'xl/worksheets/sheet5.xml',
            'search_appearance': 'xl/worksheets/sheet6.xml',
            'filters': 'xl/worksheets/sheet7.xml',
        }
        
        # 2. Timeline
        raw_timeline = parse_sheet_rows(z.read(sheet_mapping['timeline']))
        timeline_data = []
        for r in raw_timeline[1:]:
            date_str = r.get('A')
            if date_str:
                clicks = int(float(r.get('B', 0)))
                impressions = int(float(r.get('C', 0)))
                ctr = float(r.get('D', 0))
                pos = round(float(r.get('E', 0)), 2)
                timeline_data.append({
                    'date': date_str,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': pos
                })

        # 3. Queries
        raw_queries = parse_sheet_rows(z.read(sheet_mapping['queries']))
        queries_data = []
        for r in raw_queries[1:]:
            q = r.get('A')
            if q:
                clicks = int(float(r.get('B', 0)))
                impressions = int(float(r.get('C', 0)))
                ctr = float(r.get('D', 0))
                pos = round(float(r.get('E', 0)), 2)
                queries_data.append({
                    'query': q,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': pos
                })

        # 4. Pages
        raw_pages = parse_sheet_rows(z.read(sheet_mapping['pages']))
        pages_data = []
        for r in raw_pages[1:]:
            page_url = r.get('A')
            if page_url:
                clicks = int(float(r.get('B', 0)))
                impressions = int(float(r.get('C', 0)))
                ctr = float(r.get('D', 0))
                pos = round(float(r.get('E', 0)), 2)
                pages_data.append({
                    'page': page_url,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': pos
                })

        # 5. Countries
        raw_countries = parse_sheet_rows(z.read(sheet_mapping['countries']))
        countries_data = []
        for r in raw_countries[1:]:
            country = r.get('A')
            if country:
                clicks = int(float(r.get('B', 0)))
                impressions = int(float(r.get('C', 0)))
                ctr = float(r.get('D', 0))
                pos = round(float(r.get('E', 0)), 2)
                countries_data.append({
                    'country': country,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': pos
                })

        # 6. Devices
        raw_devices = parse_sheet_rows(z.read(sheet_mapping['devices']))
        devices_data = []
        for r in raw_devices[1:]:
            dev = r.get('A')
            if dev:
                clicks = int(float(r.get('B', 0)))
                impressions = int(float(r.get('C', 0)))
                ctr = float(r.get('D', 0))
                pos = round(float(r.get('E', 0)), 2)
                devices_data.append({
                    'device': dev,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': pos
                })

        # 7. Search Appearance
        raw_app = parse_sheet_rows(z.read(sheet_mapping['search_appearance']))
        appearance_data = []
        for r in raw_app[1:]:
            app = r.get('A')
            if app:
                clicks = int(float(r.get('B', 0)))
                impressions = int(float(r.get('C', 0)))
                ctr = float(r.get('D', 0))
                pos = round(float(r.get('E', 0)), 2)
                appearance_data.append({
                    'appearance': app,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': pos
                })

        # Summary calculations
        total_clicks = sum(d['clicks'] for d in timeline_data)
        total_impressions = sum(d['impressions'] for d in timeline_data)
        avg_ctr = round(total_clicks / total_impressions, 4) if total_impressions > 0 else 0
        avg_pos = round(sum(d['position'] * d['impressions'] for d in timeline_data) / total_impressions, 2) if total_impressions > 0 else 0

        # High priority segments
        striking_distance_queries = [
            q for q in queries_data 
            if 3.0 <= q['position'] <= 20.0 and q['impressions'] >= 50
        ]
        striking_distance_queries.sort(key=lambda x: x['impressions'], reverse=True)

        zero_click_high_impression_pages = [
            p for p in pages_data 
            if p['clicks'] == 0 and p['impressions'] >= 100
        ]
        zero_click_high_impression_pages.sort(key=lambda x: x['impressions'], reverse=True)

        result = {
            'exported_at': '2026-10-08',
            'date_range': {
                'start': timeline_data[0]['date'] if timeline_data else '',
                'end': timeline_data[-1]['date'] if timeline_data else '',
                'days': len(timeline_data)
            },
            'summary': {
                'total_clicks': total_clicks,
                'total_impressions': total_impressions,
                'average_ctr': avg_ctr,
                'average_position': avg_pos,
                'total_unique_queries': len(queries_data),
                'total_indexed_pages_with_impressions': len(pages_data),
            },
            'devices': devices_data,
            'search_appearance': appearance_data,
            'top_countries': countries_data[:10],
            'timeline': timeline_data,
            'striking_distance_opportunities_count': len(striking_distance_queries),
            'top_striking_distance_queries': striking_distance_queries[:50],
            'zero_click_high_impression_pages_count': len(zero_click_high_impression_pages),
            'top_zero_click_pages': zero_click_high_impression_pages[:50],
            'all_queries': queries_data,
            'all_pages': pages_data
        }

        os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2)

        print(f"Successfully exported official GSC dataset to {output_json_path}")
        print(f"Total Clicks: {total_clicks}, Total Impressions: {total_impressions}")
        print(f"Striking Distance Queries: {len(striking_distance_queries)}")
        print(f"Zero-Click High-Impression Pages: {len(zero_click_high_impression_pages)}")

if __name__ == '__main__':
    xlsx = r'C:\Users\fores\.gemini\antigravity\brain\57c20a95-6534-416b-af4b-8789bb6046c2\.user_uploaded\media_1791501004126_84084867.xlsx'
    out = r'C:\Users\fores\.gemini\antigravity\scratch\foresight-website\data\analytics\gsc-3month-official-export.json'
    parse_gsc_xlsx(xlsx, out)
