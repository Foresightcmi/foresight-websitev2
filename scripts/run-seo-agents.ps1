# Foresight SEO & Blog Automation Runner
# This PowerShell script runs the complete automated SEO pipeline.
# Run this once a week or schedule it in Windows Task Scheduler.

$ErrorActionPreference = "Stop"

Clear-Host
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Foresight Home Inspections SEO Pipeline Runner  " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 0. Pre-Flight SEO Health Check
Write-Host "`n🛡️ [Step 0/5] Running Pre-Flight SEO & Pricing Health Check..." -ForegroundColor Yellow
node scripts/seo-health-check.mjs

# 1. Discover keywords & Striking-Distance Queries
Write-Host "`n🔍 [Step 1/7] Discovering Trending Keywords & Striking-Distance Queries..." -ForegroundColor Yellow
node scripts/discover-keywords.mjs
node scripts/striking-distance-engine.mjs

# 1b. AI Fanning & GEO Surface Area Audit (Cody Schneider Framework)
Write-Host "`n🌐 [Step 1b/7] Auditing AI Fanning & GEO Surface Area Coverage..." -ForegroundColor Yellow
node scripts/ai-fanning-engine.mjs

# 1c. Backlink Gap & High-Yield Partner Reconnaissance
Write-Host "`n🔗 [Step 1c/7] Scanning Brokerage & Digital PR Backlink Opportunities..." -ForegroundColor Yellow
node scripts/backlink-gap-recon.mjs

# 2. Write and publish the blog post
Write-Host "`n🤖 [Step 2/7] Generating Blog Post with Gemini..." -ForegroundColor Yellow
node scripts/generate-blog-post.mjs

# 3. Refresh seasonal city pages
Write-Host "`n🗺️ [Step 3/7] Updating Seasonal City Landing Pages..." -ForegroundColor Yellow
node scripts/refresh-city-pages.mjs

# 4. Post-Generation Health Check
Write-Host "`n🛡️ [Step 4/7] Validating Newly Generated Content and Pricing Integrity..." -ForegroundColor Yellow
node scripts/seo-health-check.mjs

# 5. Rebuild Next.js website
Write-Host "`n🏗️ [Step 5/7] Rebuilding Website Static Pages..." -ForegroundColor Yellow
npm run build

# 6. Technical Page 1 Guard
Write-Host "`n🛡️ [Step 6/7] Running Technical Page 1 Quality Guard..." -ForegroundColor Yellow
python scripts/page1-guard.py

# 7. Ping Search Engines
Write-Host "`n📡 [Step 7/7] Submitting Updated URLs to Search Engines..." -ForegroundColor Yellow
node scripts/ping-indexnow.mjs

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   🎉 SEO pipeline ran and submitted successfully!   " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
