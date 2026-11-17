@echo off
cd /d "%~dp0"
set "PATH=C:\Users\fores\.local\nodejs;C:\Program Files\nodejs;C:\Users\fores\AppData\Roaming\uv\python\cpython-3.12-windows-x86_64-none;C:\Users\fores\.local\bin;C:\Users\fores\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"
echo ======================================================================== >> "seo_social_agency.log"
echo [Foresight SEO & Social Agency Trigger] %DATE% %TIME% >> "seo_social_agency.log"
echo ======================================================================== >> "seo_social_agency.log"
node scripts/firstindex-truth-guard.mjs --fix >> "seo_social_agency.log" 2>&1
node scripts/city-rank-scoreboard.mjs >> "seo_social_agency.log" 2>&1
node scripts/gsc-leak-hunter-engine.mjs >> "seo_social_agency.log" 2>&1
node scripts/chameleonic-competitor-matrix.mjs >> "seo_social_agency.log" 2>&1
node scripts/sync-ecosystem-harmony.mjs >> "seo_social_agency.log" 2>&1
node scripts/foresight-seo-social-agency.mjs >> "seo_social_agency.log" 2>&1
node scripts/audit-youtube-growth-system.mjs >> "seo_social_agency.log" 2>&1
node scripts/ping-indexnow.mjs >> "seo_social_agency.log" 2>&1
