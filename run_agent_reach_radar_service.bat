@echo off
cd /d "C:\Users\fores\.gemini\antigravity\scratch\foresight-website"
echo ======================================================================== >> "agent_reach_radar.log"
echo [AgentReach Omni Radar Trigger] %DATE% %TIME% >> "agent_reach_radar.log"
echo ======================================================================== >> "agent_reach_radar.log"
"C:\Program Files\nodejs\node.exe" scripts/agent-reach-omni-radar.mjs >> "agent_reach_radar.log" 2>&1
