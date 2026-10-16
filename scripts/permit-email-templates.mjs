/**
 * Permit outreach email templates (calibrated & refined 2026-10-15).
 *
 * Rules every template follows:
 *  1. Clear, warm, professional executive tone from Christopher Boykin, CMI®.
 *  2. Clearly identified as an introductory note from an independent inspection firm.
 *  3. Transparently states Foresight is NOT affiliated with any municipal or county agency.
 *  4. Never claims an inspection is legally required or mandatory.
 *  5. No "Notice", "Advisory", "Mandatory", "Warning", or bureaucratic styling.
 *  6. Transparent pricing, InterNACHI CMI credentials, and $35,000 warranty stack.
 *  7. Full CAN-SPAM compliance with physical address and 1-click unsubscribe.
 */

const SITE = 'https://www.fhinspectionsatl.com';
const PHONE = '(678) 480-2110';
const EMAIL = 'inspect@foresightcmi.com';
const POSTAL = 'Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058';

export const LIST_UNSUBSCRIBE_HEADER = `<mailto:${EMAIL}?subject=unsubscribe>`;

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function firstNameOrGreeting(name) {
  const n = String(name || '').trim();
  if (!n || /llc|inc|homes|builders|corp|company|post|lp\b|trust|properties|holdings|greystar/i.test(n)) return 'Hello';
  const first = n.replace(/^(mr|mrs|ms|dr|owner)\.?\s+/i, '').split(/\s+/)[0];
  const pretty = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  return `Hi ${pretty}`;
}

function cleanAddress(address) {
  return String(address || '').replace(/,\s*DeKalb County, GA$/i, '').replace(/,\s*Atlanta, GA$/i, '').trim();
}

function disclosureText(agencyName) {
  return [
    `Foresight Home Inspections, LLC is an independent, privately owned inspection firm and is not affiliated with, endorsed by, or representing ${agencyName} or any government entity. Contact details were retrieved from public permit and licensing records.`,
    `If you do not wish to receive further notes, reply "unsubscribe" or email ${EMAIL} with "unsubscribe" in the subject line.`,
    POSTAL
  ].join('\n');
}

function wrapHtml(paragraphsHtml, agencyName) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.65;font-size:15px;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="border-bottom:2px solid #0f172a;padding-bottom:12px;margin-bottom:20px;">
      <span style="font-size:16px;font-weight:700;letter-spacing:0.5px;color:#0f172a;">FORESIGHT HOME INSPECTIONS</span>
      <span style="font-size:12px;color:#64748b;margin-left:8px;">| Certified Master Inspector®</span>
    </div>
    ${paragraphsHtml}
    <p style="margin:24px 0 0;font-size:14px;color:#0f172a;">
      Warm regards,<br><br>
      <strong>Christopher Boykin, CMI®</strong><br>
      Lead Inspector & Founder | Foresight Home Inspections, LLC<br>
      <a href="tel:6784802110" style="color:#0f172a;text-decoration:none;font-weight:600;">${PHONE}</a> · <a href="mailto:${EMAIL}" style="color:#0f172a;text-decoration:none;">${EMAIL}</a><br>
      <a href="${SITE}" style="color:#0f172a;text-decoration:none;">fhinspectionsatl.com</a>
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 14px;">
    <p style="font-size:12px;color:#64748b;margin:0 0 8px;line-height:1.5;">
      Foresight Home Inspections, LLC is an independent, privately owned inspection firm and is <strong>not affiliated with, endorsed by, or representing ${esc(agencyName)}</strong> or any municipal government department. Contact information was sourced from publicly accessible permit and licensing registries.
    </p>
    <p style="font-size:12px;color:#64748b;margin:0 0 8px;">
      To opt out of future updates, reply "unsubscribe" or email <a href="mailto:${EMAIL}?subject=unsubscribe" style="color:#64748b;">${EMAIL}</a> with "unsubscribe" in the subject.
    </p>
    <p style="font-size:12px;color:#64748b;margin:0;">${POSTAL}</p>
  </div>
</body>
</html>`;
}

/**
 * /**
 * New construction permits ONLY (remodels, additions, and alterations excluded).
 * Optional third-party inspection pitch. No legal-requirement claims.
 */
export function buildConstructionEmail(lead) {
  const greeting = firstNameOrGreeting(lead.ownerName);
  const addr = cleanAddress(lead.address);
  const agencyName = (lead.jurisdiction || '').includes('DeKalb') ? 'DeKalb County' : 'the City of Atlanta or Fulton County';

  const subject = `Independent pre-drywall & new construction inspection for ${addr} - Foresight Home Inspections`;

  const bodyText = `${greeting},

My name is Christopher Boykin, and I am the lead Certified Master Inspector at Foresight Home Inspections, based in Metro Atlanta. I noticed the new construction residential permit on file for ${addr} and wanted to reach out with a quick introduction.

While municipal building inspectors complete standard code inspections, many new-build buyers and custom homeowners bring in an independent Certified Master Inspector for an in-depth evaluation at each phase of construction. Our most impactful service during active framing is a Pre-Drywall Framing & Mechanical Audit—examining structural framing, load paths, rough plumbing, electrical runs, and HVAC ductwork while they are still fully visible, before insulation and drywall conceal them.

What sets our process apart:
• Two Certified Inspectors on every inspection for complete coverage
• High-resolution FLIR infrared thermal imaging included at no extra cost
• Digital report with HD photos and video delivered within 24 hours to share directly with your builder's superintendent
• Backed by up to $35,000 in warranty protection ($10,000 Elite Master Warranty + $25,000 InterNACHI Honor Guarantee)

Straightforward flat-rate pricing:
- Pre-drywall framing inspection: from $275
- New construction final walkthrough inspection: from $345
- 11-month builder warranty evaluation (before Day 365): from $345
- DeKalb County Low-Flow Plumbing Fixture Certificate (Official CMI Sign-Off): $100 Flat Fee

If you already have an independent inspector on board or have already completed your inspections, congratulations on your new build and please feel free to disregard this note!

If you would like to talk through your build schedule or lock in a pre-drywall, final, or 11-month warranty evaluation, simply reply to this email or call me directly at ${PHONE}. You can also explore full details at ${SITE}/services/new-construction-inspection.

Warm regards,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
${PHONE} | ${EMAIL}
${SITE}

---
${disclosureText(agencyName)}`;

  const html = wrapHtml(`
    <p style="margin:0 0 14px;">${esc(greeting)},</p>
    <p style="margin:0 0 14px;">My name is Christopher Boykin, and I am the lead Certified Master Inspector at Foresight Home Inspections, based in Metro Atlanta. I noticed the new construction residential permit on file for <strong>${esc(addr)}</strong> and wanted to reach out with a quick introduction.</p>
    <p style="margin:0 0 14px;">While municipal building inspectors complete standard code inspections, many new-build buyers and custom homeowners bring in an independent Certified Master Inspector for an in-depth evaluation at each phase of construction. Our most impactful service during active framing is a <strong>Pre-Drywall Framing &amp; Mechanical Audit</strong>—examining structural framing, load paths, rough plumbing, electrical runs, and HVAC ductwork while they are still fully visible, before insulation and drywall conceal them.</p>
    <p style="margin:0 0 6px;"><strong>What sets our process apart:</strong></p>
    <ul style="margin:0 0 14px;padding-left:20px;">
      <li><strong>Two Certified Inspectors</strong> on every inspection for complete coverage</li>
      <li><strong>High-resolution FLIR infrared thermal imaging</strong> included at no extra cost</li>
      <li><strong>Digital report with HD photos and video</strong> delivered within 24 hours to share directly with your builder's superintendent</li>
      <li>Backed by <strong>up to $35,000 in warranty protection</strong> ($10,000 Elite Master Warranty + $25,000 InterNACHI Honor Guarantee)</li>
    </ul>
    <p style="margin:0 0 6px;"><strong>Straightforward flat-rate pricing:</strong></p>
    <ul style="margin:0 0 14px;padding-left:20px;">
      <li>Pre-drywall framing inspection: from $275</li>
      <li>New construction final walkthrough inspection: from $345</li>
      <li>11-month builder warranty evaluation (before Day 365): from $345</li>
      <li><strong>DeKalb County Low-Flow Plumbing Fixture Certificate: $100 Flat Fee</strong></li>
    </ul>
    <p style="margin:0 0 14px;">If you already have an independent inspector on board or have already completed your inspections, congratulations on your new build and please feel free to disregard this note!</p>
    <p style="margin:0 0 14px;">If you would like to talk through your build schedule or lock in an evaluation, simply reply to this email or call me directly at <a href="tel:6784802110" style="color:#0f172a;font-weight:600;">${PHONE}</a>. Full details are also available at <a href="${SITE}/services/new-construction-inspection" style="color:#0f172a;">fhinspectionsatl.com/services/new-construction-inspection</a>.</p>
  `, agencyName);

  return { subject, bodyText, html, dossierUrl: `${SITE}/dossiers/${lead.recordId}.html` };
}

/**
 * City of Atlanta short-term rental licenses.
 * Research (2026-10-15): the City's STR license relies on owner affidavits; it
 * does not require a third-party inspection. So this is pitched as optional.
 */
export function buildSTREmail(lead) {
  const greeting = firstNameOrGreeting(lead.ownerName);
  const addr = cleanAddress(lead.address);
  const agencyName = 'the City of Atlanta';

  const subject = `Short-term rental safety & guest readiness check for ${addr} - Foresight Home Inspections`;

  const bodyText = `${greeting},

My name is Christopher Boykin, and I am the lead Certified Master Inspector at Foresight Home Inspections in Metro Atlanta. Public City of Atlanta records indicate an active short-term rental registration for ${addr}.

As a host, delivering a safe, 5-star guest experience while protecting your property and reputation against avoidable liabilities is paramount.

To be completely clear: the City relies on owner self-certification affidavits and does not require a third-party inspection for your STR license. However, many Atlanta hosts choose our independent 3rd-Party STR Life-Safety & Guest Readiness Evaluation before welcoming guests or renewing their license.

What we inspect on site:
• Smoke and carbon monoxide alarm placement, dates, and audible testing
• Emergency egress windows, exit pathways, and fire extinguisher ratings
• GFCI electrical protection at kitchens, bathrooms, and exterior outlets
• Electrical service panels and grounding integrity
• Deck ledger boards, guardrails, and stair stability
• 24-hour digital checklist report with photos for your owner records and insurance documentation

Flat-rate fee: $595.

If you have already completed your safety checks or are fully set, congratulations and please feel free to disregard this note!

If you would like to book a safety evaluation or discuss any questions about your property, simply reply to this email, call me at ${PHONE}, or visit ${SITE}/service-areas/atlanta-str-compliance.

Warm regards,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
${PHONE} | ${EMAIL}
${SITE}

---
${disclosureText(agencyName)}`;

  const html = wrapHtml(`
    <p style="margin:0 0 14px;">${esc(greeting)},</p>
    <p style="margin:0 0 14px;">My name is Christopher Boykin, and I am the lead Certified Master Inspector at Foresight Home Inspections in Metro Atlanta. Public City of Atlanta records indicate an active short-term rental registration for <strong>${esc(addr)}</strong>.</p>
    <p style="margin:0 0 14px;">As a host, delivering a safe, 5-star guest experience while protecting your property and reputation against avoidable liabilities is paramount.</p>
    <p style="margin:0 0 14px;">To be completely clear: <strong>the City relies on owner self-certification affidavits and does not require a third-party inspection for your STR license.</strong> However, many Atlanta hosts choose our independent 3rd-Party STR Life-Safety &amp; Guest Readiness Evaluation before welcoming guests or renewing their license.</p>
    <p style="margin:0 0 6px;"><strong>What we inspect on site:</strong></p>
    <ul style="margin:0 0 14px;padding-left:20px;">
      <li>Smoke and carbon monoxide alarm placement, dates, and audible testing</li>
      <li>Emergency egress windows, exit pathways, and fire extinguisher ratings</li>
      <li>GFCI electrical protection at kitchens, bathrooms, and exterior outlets</li>
      <li>Electrical service panels and grounding integrity</li>
      <li>Deck ledger boards, guardrails, and stair stability</li>
      <li>24-hour digital checklist report with photos for your owner records and insurance documentation</li>
    </ul>
    <p style="margin:0 0 14px;"><strong>Flat-rate fee:</strong> $595</p>
    <p style="margin:0 0 14px;">If you have already completed your safety checks or are fully set, congratulations and please feel free to disregard this note!</p>
    <p style="margin:0 0 14px;">If you would like to book a safety evaluation or discuss any questions about your property, simply reply to this email, call me at <a href="tel:6784802110" style="color:#0f172a;font-weight:600;">${PHONE}</a>, or learn more at <a href="${SITE}/service-areas/atlanta-str-compliance" style="color:#0f172a;">fhinspectionsatl.com/service-areas/atlanta-str-compliance</a>.</p>
  `, agencyName);

  return { subject, bodyText, html, dossierUrl: `${SITE}/dossiers/${lead.recordId}.html` };
}

/**
 * Decides whether a permit lead should get an email at all, and which one.
 * Strictly restricted to New Construction (or City of Atlanta STR).
 * Remodels, additions, alterations, and repairs are permanently excluded.
 */
export function routePermitLead(lead) {
  const isSTR = (lead.jurisdiction || '').includes('Short-Term Rental') || (lead.recordId || '').startsWith('STR-');
  if (isSTR) return buildSTREmail(lead);

  const type = String(lead.permitType || '').toLowerCase();
  // Strictly New Construction ONLY — never additions, alterations, remodels, or repairs.
  const isNewConstruction = /new construction|new residential|residential new/.test(type);
  const isExcluded = /addition|alteration|remodel|repair|renovation|demolition|water meter|sewer tap|sign|fence|pool|roof|solar|generator|mobile home|accessory/i.test(type);
  if (!isNewConstruction || isExcluded) return null;

  return buildConstructionEmail(lead);
}

