@echo off
cd /d "%~dp0"
set "PATH=C:\Users\fores\.local\nodejs;C:\Program Files\nodejs;C:\Users\fores\AppData\Roaming\uv\python\cpython-3.12-windows-x86_64-none;C:\Users\fores\.local\bin;%PATH%"
echo ======================================================================== >> "seo_dominance.log"
echo [Weekly SEO Dominance Trigger] %DATE% %TIME% >> "seo_dominance.log"
echo ======================================================================== >> "seo_dominance.log"
powershell.exe -ExecutionPolicy Bypass -File scripts\run-seo-agents.ps1 >> "seo_dominance.log" 2>&1
node scripts/chameleonic-competitor-matrix.mjs >> "seo_dominance.log" 2>&1
node scripts/gbp-weekly-kit.mjs >> "seo_dominance.log" 2>&1
node scripts/foresight-seo-social-agency.mjs >> "seo_dominance.log" 2>&1
