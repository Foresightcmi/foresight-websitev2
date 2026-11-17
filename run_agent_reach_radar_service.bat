@echo off
cd /d "%~dp0"
set "PATH=C:\Users\fores\.local\nodejs;C:\Program Files\nodejs;C:\Users\fores\AppData\Roaming\uv\python\cpython-3.12-windows-x86_64-none;C:\Users\fores\.local\bin;%PATH%"
echo ======================================================================== >> "agent_reach_radar.log"
echo [AgentReach Omni Radar Trigger] %DATE% %TIME% >> "agent_reach_radar.log"
echo ======================================================================== >> "agent_reach_radar.log"
node scripts/agent-reach-omni-radar.mjs >> "agent_reach_radar.log" 2>&1
