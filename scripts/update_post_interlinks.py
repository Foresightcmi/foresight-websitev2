import json

def update_posts():
    with open('data/posts.json', 'r', encoding='utf-8') as f:
        posts = json.load(f)

    for p in posts:
        # 1. Update sewer-scope-inspection-guide
        if p.get('slug') == 'sewer-scope-inspection-guide':
            content = p['content']
            # Fix $400 to $450
            content = content.replace('$400 sewer scope fee', '$450 flat rate sewer scope inspection')
            content = content.replace('$400 sewer scope', '$450 sewer scope')
            
            # Add targeted community links
            hub_links = (
                '<h3>High-Demand Metro Atlanta Sewer Scope Communities</h3>'
                '<p>Due to aging clay/cast iron infrastructure and aggressive tree root intrusion, underground lateral pipe camera scopes are strongly recommended in these communities before closing:</p>'
                '<ul>'
                '<li><a href="/services/sewer-scope-inspection/alpharetta">Alpharetta Sewer Scope &amp; Camera Inspection</a> ($450 flat rate with HD video)</li>'
                '<li><a href="/services/sewer-scope-inspection/atlanta">Atlanta Main Line Video Pipe Scope</a></li>'
                '<li><a href="/services/sewer-scope-inspection/roswell">Roswell Lateral Drain Line Camera Evaluation</a></li>'
                '<li><a href="/services/sewer-scope-inspection/sandy-springs">Sandy Springs Sewer Line Video Inspection</a></li>'
                '<li><a href="/services/sewer-scope-inspection/marietta">Marietta Underground Sewer Camera Audit</a></li>'
                '<li><a href="/services/sewer-scope-inspection/decatur">Decatur Historic Lateral Pipe Scope Inspection</a></li>'
                '</ul>'
            )
            
            if 'High-Demand Metro Atlanta Sewer Scope Communities' not in content:
                content = content.replace(
                    'Ready to protect your investment?',
                    f'{hub_links}\n\nReady to protect your investment?'
                )
            p['content'] = content
            print('Updated sewer-scope-inspection-guide')

        # 2. Update why-new-construction-needs-inspections
        if p.get('slug') == 'why-new-construction-needs-inspections':
            content = p['content']
            content = content.replace(
                'New construction inspections start at $355+ for condos and $395+ for single-family homes, including FLIR thermal imaging and our $10,000 warranty.',
                'New construction final phase inspections start at $400+, including FLIR thermal imaging, complete exterior drone scans, and our $10,000 warranty.'
            )
            
            new_build_links = (
                '<h3>High-Growth Metro Atlanta New Construction Hubs</h3>'
                '<p>Independent third-party builder evaluations before closing are critical across these fast-expanding subdivisions:</p>'
                '<ul>'
                '<li><a href="/services/new-construction-inspection/sugar-hill">Sugar Hill New Construction Home Inspections</a></li>'
                '<li><a href="/services/new-construction-inspection/canton">Canton Pre-Closing Builder Phase Audits</a></li>'
                '<li><a href="/services/new-construction-inspection/acworth">Acworth New Construction Quality Inspections</a></li>'
                '<li><a href="/services/new-construction-inspection/cumming">Cumming Forsyth County New Build Inspections</a></li>'
                '<li><a href="/services/new-construction-inspection/buford">Buford Gwinnett New Construction Evaluations</a></li>'
                '<li><a href="/services/new-construction-inspection/hapeville">Hapeville Fulton New Construction Final Walkthroughs</a></li>'
                '</ul>'
            )
            
            if 'High-Growth Metro Atlanta New Construction Hubs' not in content:
                content = content.replace(
                    'Ready to protect your investment?',
                    f'{new_build_links}\n\nReady to protect your investment?'
                )
            p['content'] = content
            print('Updated why-new-construction-needs-inspections')

    with open('data/posts.json', 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    print('Successfully saved data/posts.json')

if __name__ == '__main__':
    update_posts()
