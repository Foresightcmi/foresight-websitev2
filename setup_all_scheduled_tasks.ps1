# Foresight Home Inspections — Universal Multi-PC & Cloud Failover Registrar (PC #2)
# Ensures ZERO single-PC dependency across SEO, Social/GBP, Demand Radar & Review Intake

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

# 4. Tier-2 Standby Social & GBP Failover — Morning Slot (Daily at 11:05 AM ET, 35m after Primary PC's 10:30 AM run)
$actionFailoverAM = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$repoDir\run_pc2_social_failover.bat`" morning" -WorkingDirectory $repoDir
$trigger1105AM = New-ScheduledTaskTrigger -Daily -At '11:05AM'
Register-ScheduledTask -TaskName 'Foresight_Social_Failover_Morning' -Action $actionFailoverAM -Trigger @($trigger1105AM) -Settings $settings -Description 'Standby PC #2 Social & GBP Failover (Stands down if Primary PC published at 10:30 AM; takes over automatically if Primary PC is offline)' -Force | Out-Null
Write-Host "Registered Foresight_Social_Failover_Morning (Daily 11:05 AM ET)"

# 5. Tier-2 Standby Social & GBP Failover — Afternoon Slot (Daily at 3:05 PM ET, 35m after Primary PC's 2:30 PM run)
$actionFailoverPM = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$repoDir\run_pc2_social_failover.bat`" afternoon" -WorkingDirectory $repoDir
$trigger305PM = New-ScheduledTaskTrigger -Daily -At '03:05PM'
Register-ScheduledTask -TaskName 'Foresight_Social_Failover_Afternoon' -Action $actionFailoverPM -Trigger @($trigger305PM) -Settings $settings -Description 'Standby PC #2 Afternoon Carousel Failover (Stands down if Primary PC published at 2:30 PM; takes over automatically if Primary PC is offline)' -Force | Out-Null
Write-Host "Registered Foresight_Social_Failover_Afternoon (Daily 3:05 PM ET)"

# 6. Standby Post-Inspection Google Review Engine (Daily at 11:30 AM & 4:30 PM ET inside 9 AM - 6 PM window)
$actionReview = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$repoDir\run_pc2_review_standby.bat`"" -WorkingDirectory $repoDir
$triggerRev1 = New-ScheduledTaskTrigger -Daily -At '11:30AM'
$triggerRev2 = New-ScheduledTaskTrigger -Daily -At '04:30PM'
Register-ScheduledTask -TaskName 'Foresight_Review_Intake_Standby' -Action $actionReview -Trigger @($triggerRev1, $triggerRev2) -Settings $settings -Description 'Standby Post-Inspection Google Review Dispatcher (Activates automatically when .env.local is present on PC #2)' -Force | Out-Null
Write-Host "Registered Foresight_Review_Intake_Standby (Daily 11:30 AM & 4:30 PM ET)"

Write-Host "All 6 Foresight Multi-PC Failover & SEO/Social Agency tasks are hardened in Windows Task Scheduler!"
