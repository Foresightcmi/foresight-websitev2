import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

req = urllib.request.Request('https://johnmeasehomeinspections.com/', headers=headers)
with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
    html = r.read().decode('utf-8', errors='ignore')

clean_text = re.sub(r'<[^>]+>', ' ', html)
clean_text = re.sub(r'\s+', ' ', clean_text).strip()
print("John Mease Text Sample:")
print(clean_text[:1200])
