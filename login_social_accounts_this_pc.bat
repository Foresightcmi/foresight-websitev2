@echo off
cd /d "%~dp0"
set "PATH=C:\Users\fores\.local\nodejs;C:\Program Files\nodejs;%PATH%"
echo Opening isolated Foresight Social Failover Browser Profile on THIS PC...
node scripts/pc2-social-failover-publisher.mjs --login
