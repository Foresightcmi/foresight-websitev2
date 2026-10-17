import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

req = urllib.request.Request('https://www.noble-pi.com/pricing', headers=headers)
with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
    html = r.read().decode('utf-8', errors='ignore')

clean_text = re.sub(r'<[^>]+>', '\n', html)
lines = [l.strip() for l in clean_text.split('\n') if l.strip()]

for i, line in enumerate(lines):
    if '$' in line:
        context = " | ".join(lines[max(0, i-2):min(len(lines), i+3)])
        print(f"Price: {line}  ->  Context: {context}")
