@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
echo ======================================================================== >> "growth_audit.log"
echo [Monthly Growth Audit Trigger] %DATE% %TIME% >> "growth_audit.log"
echo ======================================================================== >> "growth_audit.log"
"C:\Program Files\nodejs\node.exe" scripts/discover-keywords.mjs >> "growth_audit.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/audit-ai-citations.mjs >> "growth_audit.log" 2>&1
python scripts/page1-guard.py >> "growth_audit.log" 2>&1
