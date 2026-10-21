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
