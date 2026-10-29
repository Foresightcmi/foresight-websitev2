# Foresight Home Inspections (`fhinspectionsatl.com`) — Project-Local Standards

> [!IMPORTANT]
> **Project-Scoped Rules (`foresight-website`)**: These standards apply **strictly** to Foresight Home Inspections and must never be carried over into the entrepreneur's other independent business ventures.

## 1. Non-Negotiable Commercial Pricing & Copy Constraints (`data/truth.json`)
* **Standard Residential Homes (Buyer, Pre-Listing Seller, 11-Month Builder Warranty)**: Starting at **`$345`** (unified square-footage tier table across all three).
* **Condos & Townhomes**: Starting at **`$295`** (`<= 1,000 sq ft` = `$295`, `> 1,000 sq ft` = `$325`).
* **Pre-Drywall Framing Inspection**: **`$275+`** (`$275` up to 1,500 sq ft, `$300` 1,501–2,500, `$350` 2,501–3,500, `$400` 3,501+).
* **New Construction Final Inspection**: **`$400+`** based on square footage (`$200` Repair Re-Inspections).
* **Auxiliary & Commercial Services (Sewer Scope, Radon, Pool & Spa, Termite/WDO, Mold & Air Quality, STR Compliance, DeKalb Low-Flow Certificate, Commercial Property Inspection PCA, Contractor Repair Cost Estimates)**: **`Call for Quote` / `Call (678) 480-2110 for Quote`** (never display legacy flat-rate dollar prices on the calculator, service pages, social copy, or outbound emails).
* **Complexity Adjustments & Max Discount**: `+$75` each for Unfinished Crawlspace, Unfinished Basement, or `50+` yr Vintage Home; discounts capped strictly at `-$25`.
* **Core Value Hooks**: Two-Inspector Team on every home (`1.5–2.5 hours`), same-day interactive digital report, calibrated infrared thermal & 4K drone scans, **`$10,000` Elite Master Warranty (`$0` deductible) + `$25,000` InterNACHI Honor Guarantee (`$35,000` combined protection)**, active SUPRA eKEY access.
* **Copy & Schema Formatting**:
  * **Zero asterisks (`*`)** in any visible user-facing copy.
  * **Zero banned legal/brand tokens**: Replace `GAR Form F404` -> `Georgia Repair Amendment`, `F201` -> `Purchase Agreement`, `HomeGauge`/`CRL` -> `interactive digital report` / `Digital Repair Request Builder`, `RSMeans` -> `regional contractor cost data`, `FLIR` -> `calibrated infrared thermal camera`.
  * **Sunday hours**: Strictly *"By Appointment Only"* in visible copy.
  * **Physical street address**: Present in JSON-LD schema only (`1816 South Deshon Road`); never display street address in visible page copy (Service-Area Business compliance).

## 2. Outreach Quota & Permanent Suppression Rules
* **Daily Rolling Ceiling**: Strictly capped at **1,200 emails / 24h** (`Math.min(limit, 1200 - sentInLast24h)`), preserving the entrepreneur's **800-email/day Workspace reserve buffer**.
* **Daytime Dispatch Window**: 9:00 AM – 6:00 PM local time only, guarded by atomic PID lock (`campaign_dispatch.lock`).
* **Permanent Suppression (0% Leakage)**:
  * Permanently exclude all `@ansleyre.com` and `@ansleyatlanta.com` addresses and Ansley Real Estate affiliates.
  * Permanently exclude all contacts in `data/unsubscribed_contacts.json` (including Amy Fuchs and Joe Chapman / Chapman Group Realty).

## 3. Technical & Local SEO Guardrails
* Primary GBP category locked to **`Home inspector`** (`Store code 264545`).
* Maintain 87 valid Metro Atlanta municipal hubs with exact GPS `latitude`/`longitude`, `GeoCircle`, `hasMap` Place ID linkage, `/llms.txt`, `/llms-full.txt`, `/sitemap-images.xml`, and Web MCP (`/api/mcp`, `.well-known/mcp.json`).

## 4. FirstIndex Autonomous SEO/AEO, Social & Email Campaign Bridge (`data/truth.json`)
* **Canonical Source of Truth**: [`data/truth.json`](file:///C:/Users/fores/.gemini/antigravity/scratch/foresight-website/data/truth.json) governs `foresight-website`, `../email-campaign-engine`, and `../omni-video-publisher`.
* **Deterministic Validator & Auto-Healer**: Run `npm run firstindex:guard` (`node scripts/firstindex-truth-guard.mjs --fix`) and `python scripts/page1-guard.py` before deploying.
* **Bidirectional Website $\leftrightarrow$ Email Campaign Bridge (`scripts/sync-email-campaign-bridge.mjs`)**:
  * Mirrors `unsubscribed_contacts.json` bidirectionally and feeds newly harvested FMLS Under-Contract Realtors (`data/under-contract-realtors.json`) into `../email-campaign-engine/recovered_active_filers.json`.
  * Highlights the DeKalb County Low-Flow Plumbing Certificate (`Call for Quote`) as applying to **unincorporated DeKalb only** (verified per county Tax District field, never claimed mandatory by mailing city name).
* **Daily Social Video & Editorial Carousel Sync (`../omni-video-publisher`)**:
  * `Foresight_ChiefOfStaff_Social_Team` dispatches **Daily at `10:30 AM` ET** (Video Commercials) and `Foresight_Afternoon_Editorial_Carousel` dispatches **Daily at `2:30 PM` ET** (5-Slide `v3` Architectural Editorial Carousels) across IG (`@fhinspectionsatl`), FB, TikTok, YouTube Shorts, LinkedIn Personal + Company Page, and GBP (`Store 264545`), funneling traffic to `/quote` and `(678) 480-2110`.

## 5. City Page Ownership & Anti-Cannibalization
* **`/services/buyer-inspection/{city}`** is the ONLY page targeting `"home inspection {city}"`.
* **`/service-areas/{city}`** hubs are local guides (`{City}, GA Inspection Guide: Local Risks & Services`). Never retitle hubs to `"Home Inspection in {City}"`.
* Every non-buyer `/services/[service]/[city]` page includes a top-30% de-cannibalization sibling link pointing to `/services/buyer-inspection/{city}`.

## 6. Inviolable Tri-Logo Brand Standard (All Presentations, Carousels, Dossiers & Outbound Emails)
* **Every single slide** of every presentation, social carousel (`slide_1.jpg`–`slide_5.jpg`), LinkedIn PDF deck (`linkedin_carousel_deck.pdf`), companion HTML field guide, and client HTML dossier (`public/dossiers/*.html`, `public/warranty-dossiers/*.html`), AND **100% of outbound emails** sent across `foresight-website`, `../email-campaign-engine`, and `../omni-video-publisher` MUST display all **three official marks**:
  1. **Foresight Business Logo**: `https://www.fhinspectionsatl.com/images/Logopng.png` (light headers).
  2. **Certified Master Inspector (`CMI`) Seal**: `https://www.fhinspectionsatl.com/images/cmi_logo.png` (`CMI #MICB-1082`).
  3. **InterNACHI Certified Professional Inspector (`CPI`) Seal**: `https://www.fhinspectionsatl.com/images/cpi_logo.png` (`InterNACHI #NACHI20061502`).
* **Email Compatibility Rule**: Always use `.png` URLs served over first-party HTTPS (`https://www.fhinspectionsatl.com/images/*.png`) in HTML emails — never `.webp` or `.svg` (which Outlook Desktop and several webmail proxies block).
