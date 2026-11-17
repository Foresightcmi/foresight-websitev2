@echo off
cd /d "%~dp0"
set "PATH=C:\Users\fores\.local\nodejs;C:\Program Files\nodejs;C:\Users\fores\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"
if not exist ".env.local" (
  echo [Standby Review Engine] .env.local not present on this PC yet - skipping cleanly. >> "review_standby_pc2.log"
  exit /b 0
)
echo [Standby Review Engine] %DATE% %TIME% >> "review_standby_pc2.log"
node scripts/review-request-engine.mjs run >> "review_standby_pc2.log" 2>&1
