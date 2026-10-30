@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
if not exist "logs" mkdir "logs"
echo ======================================================================== >> "logs\agent_reach_omni_radar.log"
echo [Foresight Agent-Reach Omni-Medium Radar Trigger] %DATE% %TIME% >> "logs\agent_reach_omni_radar.log"
echo ======================================================================== >> "logs\agent_reach_omni_radar.log"
"C:\Program Files\nodejs\node.exe" scripts/agent-reach-omni-radar.mjs --push >> "logs\agent_reach_omni_radar.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/digital-pr-scout.mjs >> "logs\agent_reach_omni_radar.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/sync-email-campaign-bridge.mjs >> "logs\agent_reach_omni_radar.log" 2>&1
"C:\Program Files\nodejs\node.exe" scripts/firstindex-ai-mention-tracker.mjs >> "logs\agent_reach_omni_radar.log" 2>&1
echo [Completed] %DATE% %TIME% >> "logs\agent_reach_omni_radar.log"
