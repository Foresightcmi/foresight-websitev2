# Antigravity 2.0 - Universal Scheduled Task Registrar
# Hardens all autonomous background engines to OS-level persistence

$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 3)

# 1. Daily Due Diligence & Loan Officer Scout (Daily at 8:00 AM)
$actionDD = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument '/c C:\Users\fores\.gemini\antigravity\scratch\foresight-website\run_due_diligence_service.bat' -WorkingDirectory 'C:\Users\fores\.gemini\antigravity\scratch\foresight-website'
$triggerDaily8AM = New-ScheduledTaskTrigger -Daily -At '08:00AM'
$triggerLogon = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

Register-ScheduledTask -TaskName 'Foresight_Daily_DueDiligence_Scout' -Action $actionDD -Trigger @($triggerDaily8AM, $triggerLogon) -Settings $settings -Description 'Autonomous Daily Due Diligence & Mortgage Loan Officer Scout for Foresight Home Inspections' -Force | Out-Null
Write-Host "Registered Foresight_Daily_DueDiligence_Scout (Daily 8:00 AM + Auto Catch-Up)"

# 2. Weekly SEO Dominance Engine (Mondays at 9:00 AM)
$actionSEO = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument '/c C:\Users\fores\.gemini\antigravity\scratch\foresight-website\run_weekly_seo_service.bat' -WorkingDirectory 'C:\Users\fores\.gemini\antigravity\scratch\foresight-website'
$triggerMon9AM = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At '09:00AM'

Register-ScheduledTask -TaskName 'Foresight_Weekly_SEO_Dominance' -Action $actionSEO -Trigger @($triggerMon9AM) -Settings $settings -Description 'Autonomous Weekly Monday SEO Dominance Pipeline, Striking Distance Keywords & Next.js Build' -Force | Out-Null
Write-Host "Registered Foresight_Weekly_SEO_Dominance (Mondays 9:00 AM + Auto Catch-Up)"

# 3. Monthly Strategic Growth Audit (1st of each Month at 10:00 AM)
$actionGrowth = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument '/c C:\Users\fores\.gemini\antigravity\scratch\foresight-website\run_monthly_growth_service.bat' -WorkingDirectory 'C:\Users\fores\.gemini\antigravity\scratch\foresight-website'
$triggerMonthly10AM = New-ScheduledTaskTrigger -Daily -At '10:00AM'

Register-ScheduledTask -TaskName 'Foresight_Monthly_Growth_Audit' -Action $actionGrowth -Trigger @($triggerMonthly10AM) -Settings $settings -Description 'Autonomous Monthly Strategic SEO & Competitor Growth Reconnaissance' -Force | Out-Null
Write-Host "Registered Foresight_Monthly_Growth_Audit (10:00 AM + Auto Catch-Up)"

Write-Host "All Foresight autonomous background tasks are now 100% hardened in Windows OS Task Scheduler!"
