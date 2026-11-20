@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
if not exist "data\private" mkdir "data\private"
"C:\Program Files\nodejs\node.exe" scripts/review-request-engine.mjs run >> "data\private\review-engine.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/review-request-engine.mjs warranty-checkin --live --limit=4 >> "data\private\review-engine.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/review-request-engine.mjs reactivate-past-clients --live --limit=6 >> "data\private\review-engine.log" 2>&1
exit /b 0
