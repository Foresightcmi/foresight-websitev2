@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
echo ======================================================================== >> "due_diligence_scout.log"
echo [Due Diligence Scout Trigger] %DATE% %TIME% >> "due_diligence_scout.log"
echo ======================================================================== >> "due_diligence_scout.log"
"C:\Program Files\nodejs\node.exe" scripts/autonomous-due-diligence-engine.mjs >> "due_diligence_scout.log" 2>&1
