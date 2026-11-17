# Foresight Home Inspections - Universal Windows Scheduled Task Registrar (foresight-websitev2)
# Hardens local SEO, Competitor Scorecard, Social Queue & Omni-Radar persistence alongside 24/7 GitHub Cloud Actions

$repoDir = 'C:\Users\fores\.gemini\antigravity\scratch\foresight-websitev2'
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 2)

# 1. Daily SEO, AEO & Social Media Research Agency (Daily at 9:30 AM ET)
$actionAgency = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$repoDir\run_seo_social_agency_service.bat`"" -WorkingDirectory $repoDir
$triggerDaily930AM = New-ScheduledTaskTrigger -Daily -At '09:30AM'

Register-ScheduledTask -TaskName 'Foresight_SEO_Social_Agency_Daily' -Action $actionAgency -Trigger @($triggerDaily930AM) -Settings $settings -Description 'Daily Foresight Website SEO, GSC Leak Hunter, Chameleonic Competitor Scorecard, Social Queue Sync & IndexNow Pinger' -Force | Out-Null
Write-Host "Registered Foresight_SEO_Social_Agency_Daily (Daily 9:30 AM ET)"

# 2. Weekly SEO Dominance & GBP Kit Engine (Mondays at 9:00 AM ET)
$actionSEO = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$repoDir\run_weekly_seo_service.bat`"" -WorkingDirectory $repoDir
$triggerMon9AM = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At '09:00AM'

Register-ScheduledTask -TaskName 'Foresight_Weekly_SEO_Dominance' -Action $actionSEO -Trigger @($triggerMon9AM) -Settings $settings -Description 'Weekly Monday SEO Dominance Pipeline, GBP Store 264545 Weekly Kit & Chameleonic Scorecard' -Force | Out-Null
Write-Host "Registered Foresight_Weekly_SEO_Dominance (Mondays 9:00 AM ET)"

# 3. Twice-Daily Agent-Reach 10-Medium Social & YouTube Demand Radar (7:30 AM & 12:30 PM ET)
$actionRadar = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$repoDir\run_agent_reach_radar_service.bat`"" -WorkingDirectory $repoDir
$trigger730AM = New-ScheduledTaskTrigger -Daily -At '07:30AM'
$trigger1230PM = New-ScheduledTaskTrigger -Daily -At '12:30PM'

Register-ScheduledTask -TaskName 'Foresight_AgentReach_Omni_Radar' -Action $actionRadar -Trigger @($trigger730AM, $trigger1230PM) -Settings $settings -Description 'Twice-Daily 10-Medium Social & YouTube Realtor Demand Radar (Zero-Cookie Public-Web Mode)' -Force | Out-Null
Write-Host "Registered Foresight_AgentReach_Omni_Radar (Daily 7:30 AM & 12:30 PM ET)"

Write-Host "All Foresight local SEO & Social Agency background tasks are registered in Windows Task Scheduler!"
