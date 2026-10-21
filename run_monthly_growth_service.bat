@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
rem Task Scheduler trigger is daily; only run on the 1st of the month (StartWhenAvailable keeps catch-up behavior).
for /f %%a in ('powershell -NoProfile -Command "(Get-Date).Day"') do set DOM=%%a
if not "%DOM%"=="1" exit /b 0
echo ======================================================================== >> "growth_audit.log"
echo [Monthly Growth Audit Trigger] %DATE% %TIME% >> "growth_audit.log"
echo ======================================================================== >> "growth_audit.log"
"C:\Program Files\nodejs\node.exe" scripts/discover-keywords.mjs >> "growth_audit.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/audit-ai-citations.mjs >> "growth_audit.log" 2>&1
python scripts/page1-guard.py >> "growth_audit.log" 2>&1
