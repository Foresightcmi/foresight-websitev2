# Executive Analytics Briefing | Foresight Home Inspections
**Reporting Timestamp**: Thursday, October 29, 2026 (Synced from Oct 28 2:28 PM EST GA4 Snapshot)
**Property ID**: `342062426` (`foresight home inspections` - GA4)
**Live Stream Connection**: `100% OPERATIONAL` (Direct Google Analytics Data API)

---

## 1. Executive Performance Metrics (Last 7 Days vs Prior Period)
- **Active Users**: **851 users** (`+156.3%` vs prior 7 days)
- **Total Sessions**: **887 sessions** (`+139.7%` vs prior 7 days)
- **Screen Page Views**: **1,329 views** (`+184.6%` vs prior 7 days)
- **Bounce Rate**: **59.5%** (`-20.2%` improvement vs `79.7%` prior 7 days)
- **Average Session Duration**: **37.3 seconds**
- **High-Intent GA4 Conversion Telemetry (Last 28 Days)**:
  - **`quote_calculated`**: **576 events** across **316 unique users** (`#1` interactive engagement hub)
  - **Direct Phone Call Clicks**: **72 total calls** (`phone_call_click`: 45 + `click_to_call`: 27) across **18 prospective clients** (`24:1` call-to-form preference over `3` completed web forms / `13` form starts)
  - **`schedule_click`**: **53 clicks** across **27 unique users**
  - *(Ground-Truth Note: `data/leads.json` contains both organic web form submissions and pipeline deployment verification tests; GA4 `quote_calculated` and phone-call events are the primary uninflated buyer-intent signals).*

---

## 2. Real-Time Acquisition Channels & AI Citations (Last 28 Days)
- **Direct** (`(direct) / (none)`): **1,430 sessions**, 1,374 active users *(includes cloud/crawler verification sessions)*
- **Organic Search** (`google / organic`): **204 sessions**, 108 active users
- **AI Search Citation** (`chatgpt.com / ai-assistant`): **31 sessions**, 25 active users
- **Organic Search** (`bing / organic`): **15 sessions**, 12 active users
- **Google Business Profile** (`gbp / post`): **10 sessions**, 1 active user
- **Organic Social** (`facebook.com / referral`): **5 sessions**, 5 active users
- **Other Search & Referrals**: `duckduckgo` (3), `yahoo` (3), `homeservicebase.com` (2), `link.edgepilot.com` (2)

---

## 3. Top Visited Surfaces & 2026-10-29 Remediation
1. **`/quote` (Instant Cost Calculator)**: **437 combined views** (`360` + `77`), **375 users**
2. **`/` (Homepage)**: **554 combined views** (`244` + `208` + `102`), **198+ users**
3. **`/concierge` (Live CMI® Consultation)**: **187 views**, **180 users**
4. **`/service-areas` (87 Metro Atlanta Cities)**: **183 views**, **194 users**
5. **`/services` (Services Hub)**: **87 views**, **50 users**
6. **`/due-diligence` (Repair Credit Negotiator)**: **86 views**, **85 users**
7. **`/quote.` (Trailing-Period 404 — RESCUED 2026-10-29)**: **57 views**, **59 users** -> Fixed via permanent `301` redirect to `/quote` in `next.config.mjs` (alongside trailing-punctuation guards and `13` duplicate `| Foresight | Foresight` `<title>` fixes).

---

## 4. System Health & Autonomous Monitoring
Dedicated GA4 service account (`ga4-analytics-reporter@lead-generation-tool-79c91.iam.gserviceaccount.com`) is operational and refreshes every Monday at 9:00 AM EST.
