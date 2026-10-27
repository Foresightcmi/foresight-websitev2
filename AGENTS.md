# Foresight Home Inspections (`fhinspectionsatl.com`) — Project-Local Standards

> [!IMPORTANT]
> **Project-Scoped Rules (`foresight-website`)**: These standards apply **strictly** to Foresight Home Inspections and must never be carried over into the entrepreneur's other independent business ventures.

## 1. Non-Negotiable Commercial Pricing & Copy Constraints
* **Standard Residential Homes (Buyer, Pre-Listing Seller, 11-Month Builder Warranty)**: Starting at **`$345`** (same square-footage tier table across all three; `1,501–2,000 sq ft` = `$425`)
* **Condos & Townhomes**: Starting at **`$295`** (`<= 1,000 sq ft` = `$295`, `> 1,000 sq ft` = `$325`)
* **Pre-Drywall Framing Inspection**: **`$275+`** (`$275` up to 1,500 sq ft, `$300` 1,501–2,500, `$350` 2,501–3,500, `$400` 3,501+)
* **New Construction Final Inspection**: **`$400+`** based on square footage
* **Auxiliary & Specialty Add-Ons (Sewer Scope, Radon, Pool & Spa, Termite/WDO, Mold & Air Quality, STR Compliance, DeKalb Low-Flow Certificate, Contractor Repair Cost Estimates)**: **`Call for Quote` / `Call (678) 480-2110 for Quote`** (never display fixed dollar prices for auxiliary services on the calculator, service pages, or outbound emails)
* **Core Value Hooks**: Two-Inspector Team on every home, same-day interactive digital report, **`$10,000` Honor Guarantee**, active SUPRA eKEY access.
* **Copy & Schema Formatting**:
  * **Zero asterisks (`*`)** in any visible user-facing copy.
  * **Sunday hours**: Strictly *"By Appointment Only"* in visible copy.
  * **Physical street address**: Present in JSON-LD schema only; never display street address in visible page copy (Service-Area Business compliance).

## 2. Outreach Quota & Permanent Suppression Rules
* **Daily Rolling Ceiling**: Strictly capped at **1,200 emails / 24h** (`Math.min(limit, 1200 - sentInLast24h)`), preserving the entrepreneur's **800-email/day Workspace reserve buffer**.
* **Daytime Dispatch Window**: 9:00 AM – 6:00 PM local time only, guarded by atomic PID lock (`campaign_dispatch.lock`).
* **Permanent Suppression (0% Leakage)**:
  * Permanently exclude all `@ansleyre.com` and `@ansleyatlanta.com` addresses and Ansley Real Estate affiliates.
  * Permanently exclude all contacts in `data/unsubscribed_contacts.json` (including Amy Fuchs and Joe Chapman / Chapman Group Realty).

## 3. Technical & Local SEO Guardrails
* Primary GBP category locked to **`Home inspector`**.
* Maintain 87 valid Metro Atlanta municipal hubs with exact GPS `latitude`/`longitude`, `GeoCircle`, `hasMap` Place ID linkage, `/llms.txt`, `/llms-full.txt`, and Web MCP (`/api/mcp`, `.well-known/mcp.json`).


## 4. FirstIndex Autonomous SEO/AEO & Email Campaign Bridge (`data/truth.json`)
* **Canonical Source of Truth**: [`data/truth.json`](file:///C:/Users/fores/.gemini/antigravity/scratch/foresight-website/data/truth.json) governs both `foresight-website` and `../email-campaign-engine` (`lightweight_realtor_templates.js`).
* **Deterministic Validator & Auto-Healer**: Run `npm run firstindex:guard` (`node scripts/firstindex-truth-guard.mjs --fix`) to enforce zero banned terms (`F404`, `F201`, `RSMeans`, `CRL`, `FLIR`), exact pricing (`$345` homes, `$295` condos, `$450` sewer scope flat rate, `$250` radon, `$300` pool, `$100` DeKalb low-flow, `$125`/`$165` termite, `$450` mold, `$395` STR, `$99` repair estimate, `+$75` unfinished crawlspace/basement/50+ yr vintage), and 100% `public/llms.txt` coverage (`39/39` blogs, `11/11` services).
* **Bidirectional Website $\leftrightarrow$ Email Campaign Bridge (`scripts/sync-email-campaign-bridge.mjs`)**:
  * Mirrors `unsubscribed_contacts.json` bidirectionally between `foresight-website/data/` and `../email-campaign-engine/`.
  * Feeds newly harvested FMLS Under-Contract Realtors (`data/under-contract-realtors.json`) into `../email-campaign-engine/recovered_active_filers.json`.
  * Highlights the `$100` DeKalb County Low-Flow Plumbing Certificate in outreach as applying to **unincorporated DeKalb only** (source: DeKalb County water service application and Exemption Form, verified 2026-10-22). Never call it "mandatory" for a named city. Emails say we confirm applicability per address (county Tax District field). Mailing city names (Decatur, Lithonia, Stone Mountain) do NOT decide it across both `autonomous-due-diligence-engine.mjs` and `../email-campaign-engine/lightweight_realtor_templates.js`.
* **Daily Dispatcher (`npm run firstindex:run`)**: Runs daily via `.github/workflows/firstindex-daily-engine.yml` (`12:30 UTC`) and local Windows Task Scheduler (`Foresight_Daily_DueDiligence_Scout` at `9:30 AM` ET).

## 5. City Page Ownership (anti-cannibalization, set 2026-10-21 from GSC query x page data)
* **`/services/buyer-inspection/{city}`** is the ONLY page that targets "home inspection {city}" (title `Home Inspection in {City}, GA | ...`). Google already ranked it in 78 cities vs. 33 for the hub.
* **`/service-areas/{city}`** hubs are local guides: title `{City}, GA Inspection Guide: Local Risks & Services` (`Title Strategy: hub-local-guide-v1` in `data/cities.json`). Never retitle a hub to "Home Inspection in {City}" and never add exact "home inspection {city} ga" keyword bullets to hubs.
* Hub GSC sentences (`scripts/lib/gsc-city-injector.mjs`) link to the city-specific service page; "home" intent links to `/services/buyer-inspection/{city}`.
* Goal metric: `node scripts/city-rank-scoreboard.mjs` (cities on page 1 for core queries). Map pack is not visible in GSC; target the home ring (Lithonia, Stonecrest, Redan, Conyers, Stone Mountain, Snellville, Decatur, Tucker, Covington, Lilburn).
* Review requests: `scripts/review-request-engine.mjs` (client PII only in gitignored `data/private/`). Weekly GBP post: `scripts/gbp-weekly-kit.mjs`.


## 6. Always-On Page-1 SEO Autopilot (Zero-Dashboard Executive Standard)
* **Zero Manual Dashboard Required**: The entrepreneur does not need to open `/dashboard` or `localhost:3800` to trigger SEO upgrades. `scripts/firstindex-daily-dispatcher.mjs` and the AI team autonomously run:
  1. `node scripts/fetch-gsc-analytics.mjs` + `node scripts/striking-distance-engine.mjs` (live query-by-page striking-distance queue).
  2. `node scripts/firstindex-truth-guard.mjs --fix` + `python scripts/page1-guard.py` (enforcing 4+ FAQs across all 10 `services-pseo.json` services and 957 `service × city` routes).
  3. Automatic `git commit` + `git push origin main` (Vercel live deploy) + `node scripts/ping-indexnow.mjs` whenever daily GSC city enrichments pass both guards.
* **Service-to-Service De-Cannibalization (`app/services/[service]/[city]/page.js`)**:
  * Every non-buyer `/services/[service]/[city]` page includes a top-30% canonical de-cannibalization link and exact-match sibling anchor (`🏡 Home Inspection in {City}, GA ($345+)`) pointing to `/services/buyer-inspection/{city}` so specialty pages (`11-month-warranty-inspection`, `pre-drywall-inspection`, `sewer-scope-inspection`) never cannibalize core `"home inspection {city} ga"` queries.
