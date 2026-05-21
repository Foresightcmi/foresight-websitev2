# Foresight SEO & Blog Automation Runner
# This PowerShell script runs the complete automated SEO pipeline.
# Run this once a week or schedule it in Windows Task Scheduler.

$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Foresight Home Inspections SEO Pipeline Runner  " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Discover keywords
Write-Host "`n🔍 [Step 1/5] Discovering Trending Keywords..." -ForegroundColor Yellow
node scripts/discover-keywords.mjs

# 2. Write and publish the blog post
Write-Host "`n🤖 [Step 2/5] Generating Blog Post with Gemini..." -ForegroundColor Yellow
node scripts/generate-blog-post.mjs

# 3. Refresh seasonal city pages
Write-Host "`n🗺️ [Step 3/5] Updating Seasonal City Landing Pages..." -ForegroundColor Yellow
node scripts/refresh-city-pages.mjs

# 4. Rebuild Next.js website
Write-Host "`n🏗️ [Step 4/5] Rebuilding Website Static Pages..." -ForegroundColor Yellow
npm run build

# 5. Ping Search Engines
Write-Host "`n📡 [Step 5/5] Submitting Updated URLs to Search Engines..." -ForegroundColor Yellow
node scripts/ping-indexnow.mjs

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   🎉 SEO pipeline ran and submitted successfully!   " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
