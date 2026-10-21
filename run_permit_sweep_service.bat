@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
echo ======================================================================== >> "permit_sweep.log"
echo [Permit Sweep Trigger] %DATE% %TIME% >> "permit_sweep.log"
echo ======================================================================== >> "permit_sweep.log"
"C:\Program Files\nodejs\node.exe" scripts/permit-radar.mjs >> "permit_sweep.log" 2>&1
