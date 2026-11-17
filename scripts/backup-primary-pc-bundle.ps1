# Foresight Home Inspections - Safe Cross-PC Engine Code Backup (Run Once on Primary PC)
# Copies ONLY clean code/templates of omni-video-publisher & email-campaign-engine into OneDrive
# Excludes all .env*, secrets, browser_profile cookies, node_modules, .venv, and heavy video caches.

$scratchRoot = "C:\Users\fores\.gemini\antigravity\scratch"
$oneDriveDest = "C:\Users\fores\OneDrive\Foresight_Engine_Code_Backups"
New-Item -ItemType Directory -Force -Path $oneDriveDest | Out-Null

$engines = @("omni-video-publisher", "email-campaign-engine", "foresight-gbp-automation")

foreach ($eng in $engines) {
  $src = Join-Path $scratchRoot $eng
  if (Test-Path $src) {
    $dst = Join-Path $oneDriveDest $eng
    Write-Host "Backing up clean source code for $eng -> $dst ..."
    robocopy $src $dst /MIR /XD node_modules .venv venv __pycache__ .git browser_profile outbox_ready commercial_screenshots logs temp tmp /XF .env .env.* *secret* *credential* *.mp4 *.mov *.wav *.zip /NFL /NDL /NJH /NJS | Out-Null
    Write-Host "  [OK] $eng backed up to OneDrive!"
  } else {
    Write-Host "  [SKIP] $eng not present on this PC."
  }
}

Write-Host "`nDone! OneDrive will automatically mirror clean engine source code across both PCs."
