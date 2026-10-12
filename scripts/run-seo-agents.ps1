# Foresight SEO & Blog Automation Runner
# This PowerShell script runs the complete automated SEO pipeline.
# Run this once a week or schedule it in Windows Task Scheduler.

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Foresight Home Inspections SEO Pipeline Runner  " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 0. Pre-Flight SEO Health Check
Write-Host ""
Write-Host "[Step 0/7] Running Pre-Flight SEO and Pricing Health Check..." -ForegroundColor Yellow
node scripts/seo-health-check.mjs

# 1. Discover keywords and Striking-Distance Queries
Write-Host ""
Write-Host "[Step 1/7] Discovering Trending Keywords and Striking-Distance Queries..." -ForegroundColor Yellow
node scripts/discover-keywords.mjs
node scripts/striking-distance-engine.mjs

# 1b. AI Fanning and GEO Surface Area Audit (Cody Schneider Framework)
Write-Host ""
Write-Host "[Step 1b/7] Auditing AI Fanning and GEO Surface Area Coverage..." -ForegroundColor Yellow
node scripts/ai-fanning-engine.mjs

# 1c. Backlink Gap and High-Yield Partner Reconnaissance
Write-Host ""
Write-Host "[Step 1c/7] Scanning Brokerage and Digital PR Backlink Opportunities..." -ForegroundColor Yellow
node scripts/backlink-gap-recon.mjs
node scripts/digital-pr-scout.mjs
node scripts/broken-link-prospector.mjs

# 2. Write and publish the blog post
Write-Host ""
Write-Host "[Step 2/7] Generating Blog Post with Gemini..." -ForegroundColor Yellow
node scripts/generate-blog-post.mjs

# 3. Refresh seasonal city pages
Write-Host ""
Write-Host "[Step 3/7] Updating Seasonal City Landing Pages..." -ForegroundColor Yellow
node scripts/refresh-city-pages.mjs

# 4. Post-Generation Health Check
Write-Host ""
Write-Host "[Step 4/7] Validating Newly Generated Content and Pricing Integrity..." -ForegroundColor Yellow
node scripts/seo-health-check.mjs

# 5. Rebuild Next.js website
Write-Host ""
Write-Host "[Step 5/7] Rebuilding Website Static Pages..." -ForegroundColor Yellow
npm run build

# 6. Technical Page 1 Guard & AI Citation Audit
Write-Host ""
Write-Host "[Step 6/7] Running Technical Page 1 Quality Guard and AI Audit..." -ForegroundColor Yellow
python scripts/page1-guard.py
node scripts/audit-ai-citations.mjs

# 7. Ping Search Engines
Write-Host ""
Write-Host "[Step 7/7] Submitting Updated URLs to Search Engines..." -ForegroundColor Yellow
node scripts/ping-indexnow.mjs

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "   SEO pipeline ran and submitted successfully!   " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
