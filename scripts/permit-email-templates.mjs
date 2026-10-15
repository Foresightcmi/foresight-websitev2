/**
 * Permit outreach email templates (rewritten 2026-10-15 after a recipient
 * said the DeKalb low-flow email looked deceptive).
 *
 * Rules every template follows:
 *  1. Clearly identified as marketing from a private company.
 *  2. States plainly that Foresight is NOT affiliated with any government agency.
 *  3. Never says an inspection is legally required unless that is verified for
 *     this exact recipient. (DeKalb's low-flow certificate applies at the SALE of
 *     pre-1993 homes in unincorporated DeKalb, not to permit holders, so it is
 *     no longer pitched to permit holders at all.)
 *  4. No "Notice", "Mandatory", "Official", "Advisory" or alarm-box styling.
 *  5. No unverified statistics and no project valuations (valuation data from
 *     the permit feeds was unreliable).
 *  6. Includes a working opt-out and the sender's physical address (CAN-SPAM).
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
    `This is a marketing email from Foresight Home Inspections, LLC, a privately owned inspection company. We are not affiliated with, endorsed by, or acting on behalf of ${agencyName} or any government agency. We found your contact information in publicly available permit records.`,
    `Don't want to hear from us? Reply "unsubscribe" (or email ${EMAIL} with "unsubscribe" in the subject) and we won't contact you again.`,
    POSTAL
  ].join('\n');
}

function wrapHtml(paragraphsHtml, agencyName) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.6;font-size:15px;">
  <div style="max-width:600px;margin:0 auto;">
    ${paragraphsHtml}
    <p style="margin:24px 0 0;">
      Christopher Boykin, CMI®<br>
      Foresight Home Inspections, LLC<br>
      <a href="tel:6784802110" style="color:#0f172a;">${PHONE}</a> · <a href="mailto:${EMAIL}" style="color:#0f172a;">${EMAIL}</a><br>
      <a href="${SITE}" style="color:#0f172a;">fhinspectionsatl.com</a>
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 14px;">
    <p style="font-size:12px;color:#64748b;margin:0 0 8px;">
      This is a marketing email from Foresight Home Inspections, LLC, a privately owned inspection company. We are <strong>not affiliated with, endorsed by, or acting on behalf of ${esc(agencyName)}</strong> or any government agency. We found your contact information in publicly available permit records.
    </p>
    <p style="font-size:12px;color:#64748b;margin:0 0 8px;">
      Don't want to hear from us? Reply "unsubscribe" (or email <a href="mailto:${EMAIL}?subject=unsubscribe" style="color:#64748b;">${EMAIL}</a> with "unsubscribe" in the subject) and we won't contact you again.
    </p>
    <p style="font-size:12px;color:#64748b;margin:0;">${POSTAL}</p>
  </div>
</body>
</html>`;
}

/**
 * New construction / addition / alteration permits (any jurisdiction).
 * Optional third-party inspection pitch. No legal-requirement claims.
 */
export function buildConstructionEmail(lead) {
  const greeting = firstNameOrGreeting(lead.ownerName);
  const addr = cleanAddress(lead.address);
  const type = String(lead.permitType || '').toLowerCase();
  const isNew = type.includes('new');
  const agencyName = (lead.jurisdiction || '').includes('DeKalb') ? 'DeKalb County' : 'the City of Atlanta or Fulton County';
  const projectWord = isNew ? 'new home' : 'project';

  const subject = isNew
    ? `Independent pre-drywall inspection for ${addr}`
    : `Independent inspection for your project at ${addr}`;

  const bodyText = `${greeting},

I'm Christopher Boykin, a Certified Master Inspector based in Lithonia. I saw a residential building permit for ${addr} in public permit records, so I wanted to briefly introduce what we do.

We offer optional, independent inspections for homeowners during construction. The county's own inspections still happen as normal; ours is an extra set of eyes that works for you. The most useful one is a pre-drywall inspection: we check framing, plumbing, electrical, and HVAC rough-ins while they are still visible, before insulation and drywall cover them.

Pricing:
- Pre-drywall inspection: from $275
- Final inspection before move-in: from $400
- 11-month builder warranty inspection: from $335

Every inspection uses two certified inspectors and includes infrared thermal imaging.

If you already have an inspector, or this isn't useful for your ${projectWord}, please disregard this email. If you'd like to talk it through, reply here or call ${PHONE}. Details: ${SITE}/services/new-construction-inspection

Thanks, and good luck with the build.

Christopher Boykin, CMI®
Foresight Home Inspections, LLC
${PHONE} | ${EMAIL}

---
${disclosureText(agencyName)}`;

  const html = wrapHtml(`
    <p style="margin:0 0 14px;">${esc(greeting)},</p>
    <p style="margin:0 0 14px;">I'm Christopher Boykin, a Certified Master Inspector based in Lithonia. I saw a residential building permit for <strong>${esc(addr)}</strong> in public permit records, so I wanted to briefly introduce what we do.</p>
    <p style="margin:0 0 14px;">We offer <strong>optional</strong>, independent inspections for homeowners during construction. The county's own inspections still happen as normal; ours is an extra set of eyes that works for you. The most useful one is a pre-drywall inspection: we check framing, plumbing, electrical, and HVAC rough-ins while they are still visible, before insulation and drywall cover them.</p>
    <p style="margin:0 0 6px;"><strong>Pricing</strong></p>
    <ul style="margin:0 0 14px;padding-left:20px;">
      <li>Pre-drywall inspection: from $275</li>
      <li>Final inspection before move-in: from $400</li>
      <li>11-month builder warranty inspection: from $335</li>
    </ul>
    <p style="margin:0 0 14px;">Every inspection uses two certified inspectors and includes infrared thermal imaging.</p>
    <p style="margin:0 0 14px;">If you already have an inspector, or this isn't useful for your ${projectWord}, please disregard this email. If you'd like to talk it through, reply here or call ${PHONE}. Details are at <a href="${SITE}/services/new-construction-inspection" style="color:#0f172a;">fhinspectionsatl.com/services/new-construction-inspection</a>.</p>
    <p style="margin:0;">Thanks, and good luck with the build.</p>
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

  const subject = `Optional safety check for your short-term rental at ${addr}`;

  const bodyText = `${greeting},

I'm Christopher Boykin, a Certified Master Inspector based in Lithonia. Public City of Atlanta records show a short-term rental license for ${addr}, so I wanted to introduce a service some hosts find useful.

To be clear: the City does not require a third-party inspection for a short-term rental license. Some hosts still like an independent check before guests arrive or before renewing. We look at smoke and carbon monoxide alarms, bedroom egress windows, fire extinguishers, GFCI protection, the electrical panel, and deck and stair safety, and you get a written report within 24 hours.

Price: $595 flat rate.

If you've already had this done, or it isn't useful to you, please disregard this email. Questions? Reply here or call ${PHONE}. Details: ${SITE}/service-areas/atlanta-str-compliance

Christopher Boykin, CMI®
Foresight Home Inspections, LLC
${PHONE} | ${EMAIL}

---
${disclosureText(agencyName)}`;

  const html = wrapHtml(`
    <p style="margin:0 0 14px;">${esc(greeting)},</p>
    <p style="margin:0 0 14px;">I'm Christopher Boykin, a Certified Master Inspector based in Lithonia. Public City of Atlanta records show a short-term rental license for <strong>${esc(addr)}</strong>, so I wanted to introduce a service some hosts find useful.</p>
    <p style="margin:0 0 14px;">To be clear: <strong>the City does not require a third-party inspection for a short-term rental license.</strong> Some hosts still like an independent check before guests arrive or before renewing. We look at smoke and carbon monoxide alarms, bedroom egress windows, fire extinguishers, GFCI protection, the electrical panel, and deck and stair safety, and you get a written report within 24 hours.</p>
    <p style="margin:0 0 14px;"><strong>Price:</strong> $595 flat rate.</p>
    <p style="margin:0;">If you've already had this done, or it isn't useful to you, please disregard this email. Questions? Reply here or call ${PHONE}. Details are at <a href="${SITE}/service-areas/atlanta-str-compliance" style="color:#0f172a;">fhinspectionsatl.com/service-areas/atlanta-str-compliance</a>.</p>
  `, agencyName);

  return { subject, bodyText, html, dossierUrl: `${SITE}/dossiers/${lead.recordId}.html` };
}

/**
 * Decides whether a permit lead should get an email at all, and which one.
 * Returns null when there is no honest, relevant offer for that permit.
 */
export function routePermitLead(lead) {
  const isSTR = (lead.jurisdiction || '').includes('Short-Term Rental') || (lead.recordId || '').startsWith('STR-');
  if (isSTR) return buildSTREmail(lead);

  const type = String(lead.permitType || '').toLowerCase();
  // Only permits where an in-progress construction inspection is actually relevant.
  const relevant = /new construction|new residential|residential new|addition|alteration/.test(type);
  const irrelevant = /demolition|water meter|sewer tap|sign|fence|pool|roof|solar|generator/.test(type);
  if (!relevant || irrelevant) return null;

  return buildConstructionEmail(lead);
}
