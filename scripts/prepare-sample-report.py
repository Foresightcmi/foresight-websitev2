import os
import re
import sys
import shutil

# Ensure utf-8 output encoding for Windows consoles
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

SOURCE_DIR = r"C:\Users\fores\Documents\HomeGauge\Reports\20260910-2453-Lake-Erma-Dr"
SOURCE_HTML = os.path.join(SOURCE_DIR, "FullReportForUpload.html")
DEST_DIR = r"C:\Users\fores\.gemini\antigravity\scratch\foresight-website\public\sample-report"

def main():
    print(f"[START] Preparing sample report from: {SOURCE_DIR}")
    os.makedirs(DEST_DIR, exist_ok=True)

    # 1. Read source HTML
    with open(SOURCE_HTML, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    print(f"[INFO] Original HTML length: {len(html)} chars")

    # 2. Redactions & Replacements
    # Page Title
    html = re.sub(
        r"<title>2453 Lake Erma Dr / Foresight Home Inspections, LLC / Christopher Boykin</title>",
        "<title>Sample Home Inspection Report | Foresight Home Inspections, LLC | Christopher Boykin CMI®</title>",
        html,
        flags=re.I
    )

    # Header / Footer Client Reference
    html = re.sub(r"<STRONG>Stillman</STRONG>", "<STRONG>[Confidential Client]</STRONG>", html, flags=re.I)
    html = re.sub(r"<strong>Stillman</strong>", "<strong>[Confidential Client]</strong>", html, flags=re.I)

    # Address references
    html = re.sub(r"2453 Lake Erma Dr", "[Confidential Property Address]", html, flags=re.I)
    html = re.sub(r"2453 Lake Erma Drive", "[Confidential Property Address]", html, flags=re.I)
    html = re.sub(r"Lake Erma Dr", "[Confidential Property Address]", html, flags=re.I)
    html = re.sub(r"Lake Erma Drive", "[Confidential Property Address]", html, flags=re.I)
    html = re.sub(r"Hampton GA 30228", "Metro Atlanta, GA", html, flags=re.I)
    html = re.sub(r"Hampton, GA 30228", "Metro Atlanta, GA", html, flags=re.I)

    # Customer Name
    html = re.sub(r"Gary Stillman", "[Client Name Withheld for Privacy]", html, flags=re.I)

    # Realtor & Brokerage
    html = re.sub(r"Marcus Wilkerson", "[VIP Partner Realtor]", html, flags=re.I)
    html = re.sub(r"Hester Group Raltors", "[Premier Partner Brokerage]", html, flags=re.I)
    html = re.sub(r"Hester Group Realtors", "[Premier Partner Brokerage]", html, flags=re.I)

    # Report ID
    html = re.sub(r"20260910-2453-Lake-Erma-Dr", "SAMPLE-METRO-ATLANTA-REPORT", html, flags=re.I)

    # Add a prominent top banner indicating this is a certified sample report
    sample_banner = """
<div id="foresight-sample-top-banner" style="background: linear-gradient(90deg, #0F172A 0%, #1E293B 100%); color: #ffffff; padding: 12px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; border-bottom: 3px solid #D4AF37; box-shadow: 0 4px 15px rgba(0,0,0,0.3); position: sticky; top: 0; z-index: 999999; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
  <div style="display: flex; align-items: center; gap: 10px;">
    <span style="background: #D4AF37; color: #0F172A; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Official Sample Report</span>
    <span><strong>Foresight Home Inspections</strong> • Dual-Inspector CMI® Audit • All Client & Property Details Redacted for Privacy</span>
  </div>
  <div style="display: flex; gap: 10px; align-items: center;">
    <a href="https://www.fhinspectionsatl.com/quote" target="_blank" style="background: #D4AF37; color: #0F172A; font-weight: 700; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-size: 13px;">Get Instant Quote</a>
    <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" style="background: #d32f2f; color: #ffffff; font-weight: 700; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-size: 13px;">Schedule Inspection</a>
    <a href="https://www.fhinspectionsatl.com/samples" style="background: rgba(255,255,255,0.15); color: #ffffff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 13px;">&larr; Back to Samples</a>
  </div>
</div>
"""
    # Insert banner right after <body>
    html = re.sub(r"<body.*?>", lambda m: m.group(0) + "\n" + sample_banner, html, count=1, flags=re.I)

    # 3. Write redacted HTML to public/sample-report/index.html
    dest_html = os.path.join(DEST_DIR, "index.html")
    with open(dest_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[OK] Wrote redacted HTML to: {dest_html}")

    # 4. Copy required supporting assets (exclude large backup and zip files)
    EXCLUDE_EXTENSIONS = {".zip", ".hr5"}
    EXCLUDE_PREFIXES = ("report-bak", "upFHINSPECTIONS")

    copied_count = 0
    total_bytes = 0

    for item in os.listdir(SOURCE_DIR):
        if item == "FullReportForUpload.html":
            continue
        
        # Check exclusion
        ext = os.path.splitext(item)[1].lower()
        if ext in EXCLUDE_EXTENSIONS or any(item.startswith(p) for p in EXCLUDE_PREFIXES):
            continue

        src_path = os.path.join(SOURCE_DIR, item)
        dest_path = os.path.join(DEST_DIR, item)

        if os.path.isdir(src_path):
            if os.path.exists(dest_path):
                shutil.rmtree(dest_path)
            shutil.copytree(src_path, dest_path)
            print(f"  [DIR] Copied directory: {item}")
        else:
            shutil.copy2(src_path, dest_path)
            copied_count += 1
            total_bytes += os.path.getsize(src_path)

    print(f"[OK] Copied {copied_count} assets ({total_bytes / (1024*1024):.1f} MB) into: {DEST_DIR}")

    # 5. Verify zero leakage of sensitive words in generated index.html
    with open(dest_html, "r", encoding="utf-8") as f:
        result_text = f.read()

    sensitive_checks = ["2453", "Lake Erma", "Stillman", "Gary Stillman", "Marcus Wilkerson", "Hester Group"]
    print("\n[AUDIT] Sensitive Terms Verification:")
    clean_all = True
    for term in sensitive_checks:
        matches = len(re.findall(re.escape(term), result_text, re.I))
        if matches == 0:
            print(f"  {term}: CLEAN (0 matches)")
        else:
            print(f"  {term}: WARNING ({matches} matches remaining)")
            clean_all = False

    if clean_all:
        print("\n[SUCCESS] 100% of address and personal names have been blocked and redacted!")

if __name__ == "__main__":
    main()
