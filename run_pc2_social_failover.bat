@echo off
cd /d "%~dp0"
set "PATH=C:\Users\fores\.local\nodejs;C:\Program Files\nodejs;C:\Users\fores\AppData\Roaming\uv\python\cpython-3.12-windows-x86_64-none;C:\Users\fores\.local\bin;C:\Users\fores\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"
set "SLOT=%~1"
if "%SLOT%"=="" set "SLOT=morning"
echo ======================================================================== >> "social_failover_pc2.log"
echo [PC2 Social Failover Check - %SLOT%] %DATE% %TIME% >> "social_failover_pc2.log"
echo ======================================================================== >> "social_failover_pc2.log"
node scripts/pc2-social-failover-publisher.mjs --slot=%SLOT% >> "social_failover_pc2.log" 2>&1
