# Foresight Home Inspections (`fhinspectionsatl.com`) — Project-Local Standards

> [!IMPORTANT]
> **Project-Scoped Rules (`foresight-website`)**: These standards apply **strictly** to Foresight Home Inspections and must never be carried over into the entrepreneur's other independent business ventures.

## 1. Non-Negotiable Commercial Pricing & Copy Constraints
* **Standard Residential Homes**: Starting at **`$345`**
* **Condos & Townhomes**: Starting at **`$295`**
* **Sewer Scope Camera Inspection**: Strictly **`$450` flat rate** (never alter or discount)
* **Radon Continuous Monitoring**: **`$250`**
* **Swimming Pool & Spa Inspection**: **`$300`**
* **DeKalb County Low-Flow Plumbing Certificate**: **`$100`**
* **Termite / Official Georgia Wood Infestation Report**: **`$125`** slab (`$165` crawlspace)
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
  * Automatically highlights the **Mandatory `$100` DeKalb County Low-Flow Plumbing Certificate** on DeKalb municipalities (`Lithonia, Stone Mountain, Tucker, Decatur, Redan, Stonecrest, Chamblee, Dunwoody, Brookhaven, Avondale Estates, Clarkston, Doraville, Pine Lake, Ellenwood`) across both `autonomous-due-diligence-engine.mjs` and `../email-campaign-engine/lightweight_realtor_templates.js`.
* **Daily Dispatcher (`npm run firstindex:run`)**: Runs daily via `.github/workflows/firstindex-daily-engine.yml` (`12:30 UTC`) and local Windows Task Scheduler (`Foresight_Daily_DueDiligence_Scout` at `9:30 AM` ET).
