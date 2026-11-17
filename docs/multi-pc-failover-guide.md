# Foresight 3-Tier PC-Independent Continuity & Failover Architecture

Your business operations no longer depend on any single desktop PC staying alive. Every daily engine now runs across a **3-Tier Active -> Standby -> 24/7 Cloud** safety net with **zero duplicate posts or emails**.

---

## 1. Engine-by-Engine Redundancy Matrix

| Business Engine | Tier 1 (Primary PC) | Tier 2 (This PC — Standby) | Tier 3 (24/7 GitHub Cloud — Zero PC Needed) | Duplicate Prevention Lock |
| :--- | :--- | :--- | :--- | :--- |
| **Realtor Nurture Emails** | `email-campaign-engine` | Optional `.env.local` | `cloud-realtor-nurture.yml` (`10:15 AM`, `1:15 PM`, `4:15 PM ET`) | Checks `[Gmail]/Sent Mail` via IMAP first; stands down if PC sent today |
| **48h Under-Contract Due Diligence** | Synced via Git | `/studio` + `/vip-dispatch.html` | `daily-due-diligence.yml` (`2x/day` inside `9 AM–6 PM ET`) | `data/due-diligence-outreach-log.json` + `<= 1,200/24h` ceiling |
| **11-Month Builder Warranty** | Synced via Git | `/warranty-dispatch.html` | `daily-warranty-engine.yml` (`Daily 10:45 AM ET`) | `data/warranty-outreach-log.json` |
| **Website SEO, AEO & Omni-Radar** | Synced via Git | `Foresight_SEO_Social_Agency_Daily` (`9:30 AM`) + `Foresight_Weekly_SEO_Dominance` (`Mon 9:00 AM`) + `Foresight_AgentReach_Omni_Radar` (`7:30 AM & 12:30 PM`) | `foresight-agency-cloud-pulse.yml` (`6x/day`), `agent-reach-omni-radar.yml` (`2x/day`), `firstindex-daily-engine.yml`, `weekly-seo-dominance.yml` | Git rebase + `data/truth.json` lock |
| **Daily Social Video, Carousel & GBP (`Store 264545`)** | `10:30 AM` & `2:30 PM ET` (`omni-video-publisher`) | **`Foresight_Social_Failover_Morning` (`11:05 AM ET`)** & **`Foresight_Social_Failover_Afternoon` (`3:05 PM ET`)** + local Tri-Logo renderer (`render-omnichannel-pack.mjs`) | **`social-broadcast.yml` (`11:35 AM ET`)** + `https://www.fhinspectionsatl.com/studio` | `data/chief-of-staff-social-status.json` (`America/New_York` date lock) |
| **Post-Inspection Google Reviews** | `Foresight_HomeGauge_Review_Afternoon` | **`Foresight_Review_Intake_Standby` (`11:30 AM` & `4:30 PM ET`)** | `ntfy` mobile intake + `https://www.fhinspectionsatl.com/review` | `data/private/review-dispatch-ledger.json` |

---

## 2. Optional 2-Minute One-Time Steps While Your Other PC Is Up

1. **Back Up Your Other PC's Local Engine Code to OneDrive (Run Once on the Other PC)**:
   ```powershell
   cd C:\Users\fores\.gemini\antigravity\scratch\foresight-websitev2
   git pull --rebase origin main
   powershell -ExecutionPolicy Bypass -File .\scripts\backup-primary-pc-bundle.ps1
   ```
   *(Copies clean source code/templates of `omni-video-publisher` and `email-campaign-engine` into `OneDrive\Foresight_Engine_Code_Backups` without copying giant `.mp4` caches or raw secrets.)*

2. **Sign Into This PC's Standby Social Browser Profile Once (Optional on This PC)**:
   - Double-click `login_social_accounts_this_pc.bat` (or run `npm run social:failover:login`) inside `foresight-websitev2`.
   - Sign into Google Business Profile (`Store 264545`), LinkedIn, Meta Business Suite, YouTube Studio, and TikTok once, then close the browser window. Whenever the other PC goes offline at `10:30 AM` or `2:30 PM ET`, this PC automatically steps in 35 minutes later (`11:05 AM` / `3:05 PM ET`) with pre-rendered Tri-Logo graphics, PDFs, and 30s Anthem Reels ready!
