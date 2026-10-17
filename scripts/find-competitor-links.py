import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

targets = [
    ('Scott Home', 'https://scotthomeservices.com/'),
    ('Paris Pressley', 'https://www.ppinspect.com/'),
    ('John Mease', 'https://johnmeasehomeinspections.com/'),
    ('Conley', 'https://conleyhomeinspections.com/'),
    ('The BrickKicker', 'https://www.georgia.brickkicker.com/'),
    ('Noble Property', 'https://www.noble-pi.com/')
]

for name, url in targets:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            links = set(re.findall(r'href=[\'"](https?://[^\s\'"<>]+|/[^\s\'"<>]+)[\'"]', html))
            service_links = [l for l in links if any(k in l.lower() for k in ['service', 'price', 'pricing', 'radon', 'fee', 'cost', 'inspect', 'about'])]
            print(f'=== {name} Links ===')
            for sl in sorted(service_links)[:12]:
                print(' ', sl)
    except Exception as e:
        print(f'Error {name}: {e}')
