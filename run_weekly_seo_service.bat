@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
echo ======================================================================== >> "seo_dominance.log"
echo [Weekly SEO Dominance Trigger] %DATE% %TIME% >> "seo_dominance.log"
echo ======================================================================== >> "seo_dominance.log"
powershell.exe -ExecutionPolicy Bypass -File scripts\run-seo-agents.ps1 >> "seo_dominance.log" 2>&1
