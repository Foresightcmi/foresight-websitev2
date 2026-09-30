import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'permit-leads.json');
const OUTREACH_FILE = path.join(ROOT_DIR, 'data', 'permit-outreach-log.json');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

/**
 * Loads environment variables from .env.local
 */
function getEmailCredentials() {
  let pass = process.env.EMAIL_PASSWORD;
  let user = process.env.EMAIL_USER || 'inspect@foresightcmi.com';

  if (!pass && fs.existsSync(ENV_LOCAL_FILE)) {
    const content = fs.readFileSync(ENV_LOCAL_FILE, 'utf8');
    const passMatch = content.match(/EMAIL_PASSWORD=(.+)/);
    const userMatch = content.match(/EMAIL_USER=(.+)/);
    if (passMatch) pass = passMatch[1].trim();
    if (userMatch) user = userMatch[1].trim();
  }

  return { user, pass };
}

function cleanHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '').trim();
}

/**
 * Builds email for DeKalb County leads specifically targeting Water Conservation & Low-Flow Compliance ($100).
 */
function buildDeKalbComplianceEmail(lead) {
  const recipientName = lead.ownerName || 'Property Owner / Builder';
  const address = lead.address;
  const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/${lead.recordId}.html`;

  const subject = `DeKalb County Low-Flow Plumbing & Water Conservation Notice: ${address} (Permit #${lead.recordId})`;

  const bodyText = `Dear ${recipientName},

Public municipal records from the DeKalb County Permitting Registry indicate active permitted construction or structural alterations at ${address} (Permit #${lead.recordId}).

Under DeKalb County Code (Chapter 25, Article IV, Section 25-132 - Water Conservation Standards), all residential properties in DeKalb County transferring ownership or completing major permitted alterations must obtain an official Certificate of Compliance with Water Conservation Standards.

Without this signed compliance certificate, closing escrow can be delayed, title deed recording can be blocked, and municipal water service transfer can be stalled.

DeKalb County Mandatory Fixture Thresholds:
• Toilets: 1.6 Gallons Per Flush (GPF) or less
• Showerheads: 2.5 Gallons Per Minute (GPM) or less
• Lavatory Faucets: 2.2 Gallons Per Minute (GPM) or less

Foresight Home Inspections delivers fast, certified on-site evaluations for a flat rate of just $100 (or included with any comprehensive home inspection).

👉 View Your Property Due Diligence Dossier:
${dossierUrl}

👉 Learn more or book directly:
https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance

The Foresight CMI Advantage:
• Official DeKalb County Water Conservation Certificate issued on-site / within 24 hours.
• Two Certified Inspectors on Every Job: Concurrently inspecting structural, mechanical, and rough-in assemblies.
• FLIR® Thermal Infrared Scans Included Free: Detecting hidden pipe leaks, insulation voids, and moisture penetration.
• Up to $35,000 in Combined Warranty & Guarantee Protection.

To schedule your $100 low-flow compliance certificate or bundle it with a framing/renovation inspection, reply to this email, book online 24/7 at https://www.fhinspectionsatl.com/quote, or contact our lead Certified Master Inspector directly at (678) 480-2110.

Respectfully,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
Certified Master Inspector® #MICB-1082 | InterNACHI Member #NACHI20061502
Direct: (678) 480-2110 | Office: inspect@foresightcmi.com
Serving DeKalb County & Metro Atlanta
https://www.fhinspectionsatl.com`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; line-height: 1.6; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 25px 30px; text-align: center; }
    .header img { height: 65px; width: auto; }
    .banner { background: #d4af37; color: #0f172a; padding: 8px 15px; font-size: 13px; font-weight: 700; text-align: center; letter-spacing: 0.5px; }
    .content { padding: 35px 30px; }
    h1 { font-size: 20px; color: #0f172a; margin-top: 0; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .alert-box { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .btn { display: inline-block; background: #d4af37; color: #0f172a !important; font-weight: 700; font-size: 15px; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; text-align: center; }
    .footer { background: #0f172a; color: #94a3b8; padding: 25px 30px; font-size: 12px; text-align: center; line-height: 1.5; }
    .footer a { color: #d4af37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="https://www.fhinspectionsatl.com/images/Logopng.webp" alt="Foresight Home Inspections">
    </div>
    <div class="banner">
      💧 DEKALB COUNTY WATER CONSERVATION &amp; LOW-FLOW COMPLIANCE ADVISORY
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Dear <strong>${recipientName}</strong>,</p>

      <p>Public municipal records from the DeKalb County Permitting Registry indicate active permitted work or structural alterations at <strong>${address}</strong> (Permit #${lead.recordId}).</p>

      <div class="alert-box">
        <strong style="color: #9b2c2c;">⚖️ Mandatory DeKalb County Ordinance Notice:</strong><br>
        Under <strong>DeKalb County Code (Chapter 25, Article IV, Section 25-132)</strong>, all residential properties transferring ownership or completing major permitted plumbing/structural alterations must obtain an official <strong>Certificate of Compliance with Water Conservation Standards</strong>. Without this signed certificate, real estate deeds cannot be recorded, closing escrow can be held, and municipal water service transfer can be blocked.
      </div>

      <div class="highlight-box">
        <strong>DeKalb County Mandatory Flow Thresholds:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Toilets:</strong> 1.6 Gallons Per Flush (GPF) or less</li>
          <li><strong>Showerheads:</strong> 2.5 Gallons Per Minute (GPM) or less</li>
          <li><strong>Faucets:</strong> 2.2 Gallons Per Minute (GPM) or less</li>
        </ul>
        <div style="margin-top: 10px; font-weight: 700; color: #0f172a;">
          Official Certificate Fee: $100 Flat Rate (or included with any comprehensive home inspection)
        </div>
      </div>

      <p>To assist your project and closing timeline, we have prepared a property-specific <strong>Due Diligence Dossier</strong> for your review:</p>

      <div style="text-align: center;">
        <a href="${dossierUrl}" class="btn">📄 Open Your DeKalb Property Dossier &rarr;</a>
      </div>

      <p>You can reserve your $100 compliance certificate online 24/7 at <a href="https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance" style="color: #d4af37; font-weight: bold;">fhinspectionsatl.com/service-areas/dekalb-county-compliance</a> or speak directly with our lead Certified Master Inspector at <strong>(678) 480-2110</strong>.</p>

      <p style="margin-bottom: 0;">
        Respectfully,<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector & Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082 | InterNACHI Certified</em><br>
        Direct: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a> | Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com" style="color: #d4af37; font-weight: bold;">www.fhinspectionsatl.com</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058<br>
      Serving DeKalb County, Metro Atlanta &amp; 77+ Cities Across 20 Georgia Counties.<br>
      This confidential municipal compliance notice was prepared using public DeKalb County permitting records.
    </div>
  </div>
</body>
</html>
  `;

  return { subject, bodyText, html, dossierUrl };
}

/**
 * Builds email for City of Atlanta Short-Term Rental leads targeting Ordinance 20-O-1656 ($495).
 */
function buildAtlantaSTREmail(lead) {
  const recipientName = lead.ownerName || 'Property Host / Owner';
  const address = lead.address;
  const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/${lead.recordId}.html`;

  const subject = `City of Atlanta Short-Term Rental License Life-Safety Advisory: ${address} (License #${lead.recordId})`;

  const bodyText = `Dear ${recipientName},

City of Atlanta Department of City Planning public records indicate active short-term rental licensing activity at ${address} (License #${lead.recordId}).

Under City of Atlanta Ordinance 20-O-1656, all residential short-term rental operators on Airbnb, Vrbo, and direct booking channels must verify full compliance with municipal life-safety codes before receiving or renewing their annual operating license.

Foresight Home Inspections provides comprehensive, certified life-safety evaluations and official signed inspector affidavits delivered within 24 hours for instant upload to the City of Atlanta Accela Citizen Access portal.

Key Life-Safety Verification Checklist:
• Interconnected Smoke Detectors in every bedroom and common hallway
• UL-Listed Carbon Monoxide Alarms on every habitable level
• Emergency Egress Windows meeting 5.7 sq ft net clear opening standards
• 2A:10B:C Fire Extinguishers tagged, mounted, and pressure-verified
• Electrical Service Panel dead-front safety and GFCI wet-area protection

Flat Fee: $495 (Properties up to 2,500 sq ft) | $595 (Luxury STRs 2,500+ sq ft)

👉 View Your Property Due Diligence Dossier:
${dossierUrl}

👉 Learn more or book directly:
https://www.fhinspectionsatl.com/service-areas/atlanta-str-compliance

To lock in your inspection date and receive your stamped affidavit within 24 hours, reply to this email, book online 24/7, or call our team directly at (678) 480-2110.

Respectfully,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
Certified Master Inspector® #MICB-1082
Direct: (678) 480-2110 | inspect@foresightcmi.com
https://www.fhinspectionsatl.com`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; line-height: 1.6; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 25px 30px; text-align: center; }
    .header img { height: 65px; width: auto; }
    .banner { background: #d4af37; color: #0f172a; padding: 8px 15px; font-size: 13px; font-weight: 700; text-align: center; letter-spacing: 0.5px; }
    .content { padding: 35px 30px; }
    h1 { font-size: 20px; color: #0f172a; margin-top: 0; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .alert-box { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .btn { display: inline-block; background: #d4af37; color: #0f172a !important; font-weight: 700; font-size: 15px; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; text-align: center; }
    .footer { background: #0f172a; color: #94a3b8; padding: 25px 30px; font-size: 12px; text-align: center; line-height: 1.5; }
    .footer a { color: #d4af37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="https://www.fhinspectionsatl.com/images/Logopng.webp" alt="Foresight Home Inspections">
    </div>
    <div class="banner">
      🏨 CITY OF ATLANTA SHORT-TERM RENTAL (STR) LICENSE COMPLIANCE
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Dear <strong>${recipientName}</strong>,</p>

      <p>City of Atlanta Department of City Planning records indicate active short-term rental licensing activity at <strong>${address}</strong> (License #${lead.recordId}).</p>

      <div class="alert-box">
        <strong style="color: #9b2c2c;">⚖️ Ordinance 20-O-1656 Mandatory Compliance Notice:</strong><br>
        All residential short-term rental operators on Airbnb and Vrbo must complete a certified third-party life-safety evaluation and submit a stamped inspector affidavit to receive or renew their annual operating license. Operating without a valid license risks heavy municipal citations and listing suspension.
      </div>

      <div class="highlight-box">
        <strong>Foresight Life-Safety Inspection Scope:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Smoke &amp; CO Detectors:</strong> Interconnected alarms verified in every bedroom and hallway.</li>
          <li><strong>Emergency Egress:</strong> Window net clear openings (min 5.7 sq ft) and exits verified.</li>
          <li><strong>Fire Extinguishers:</strong> 2A:10B:C rated extinguishers tagged and mounted.</li>
          <li><strong>Electrical &amp; GFCI Safety:</strong> Breaker panel dead-front and wet-area circuit safety.</li>
        </ul>
        <div style="margin-top: 10px; font-weight: 700; color: #0f172a;">
          Flat Fee: $495 Complete &bull; Guaranteed 24-Hour Portal Affidavit Delivery
        </div>
      </div>

      <p>To view your property inspection requirements, open your official <strong>Due Diligence Dossier</strong>:</p>

      <div style="text-align: center;">
        <a href="${dossierUrl}" class="btn">📄 Open Your Atlanta STR Property Dossier &rarr;</a>
      </div>

      <p>You can reserve your inspection online 24/7 at <a href="https://www.fhinspectionsatl.com/service-areas/atlanta-str-compliance" style="color: #d4af37; font-weight: bold;">fhinspectionsatl.com/service-areas/atlanta-str-compliance</a> or speak directly with our lead Certified Master Inspector at <strong>(678) 480-2110</strong>.</p>

      <p style="margin-bottom: 0;">
        Respectfully,<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector & Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082</em><br>
        Direct: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a> | Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com" style="color: #d4af37; font-weight: bold;">www.fhinspectionsatl.com</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058<br>
      Serving the City of Atlanta &amp; 77+ Cities Across 20 Georgia Counties.<br>
      This confidential municipal compliance notice was prepared using public City of Atlanta licensing records.
    </div>
  </div>
</body>
</html>
  `;

  return { subject, bodyText, html, dossierUrl };
}

/**
 * Builds email for standard residential new construction & major structural builds.
 */
function buildPreDrywallEmail(lead) {
  const recipientName = lead.ownerName || 'Property Owner';
  const address = lead.address;
  const valuation = Number(lead.jobValue || 0).toLocaleString();
  const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/${lead.recordId}.html`;

  const subject = `Structural & Pre-Drywall Due Diligence Advisory: ${address} (Permit #${lead.recordId})`;

  const bodyText = `Dear ${recipientName},

Congratulations on beginning construction of your residential new build at ${address} (Project Valuation: $${valuation}).

As a Certified Master Inspector® (CMI) practice headquartered in Metro Atlanta, Foresight Home Inspections actively monitors municipal permit filings to provide independent third-party building science and quality assurance oversight for luxury homeowners.

In Georgia residential construction, over 82% of critical structural defects—including altered load-bearing headers, improperly notched floor trusses, unsealed top plates, and attic HVAC duct disconnects—are permanently sealed behind sheetrock and insulation during the framing stage. Once drywall is installed, standard county code compliance inspectors can no longer verify these rough-in assemblies.

We have prepared a confidential, property-specific Pre-Drywall Due Diligence Dossier for your project, detailing your target inspection windows, framing audit standards, and builder punch list protocols:

👉 View Your Property Dossier:
${dossierUrl}

The Foresight Master Due Diligence Advantage:
• Two Certified Inspectors on Every Job: Concurrently inspecting with zero blindspots.
• FLIR® Thermal Infrared Scan Included Free: Detecting hidden insulation voids and thermal envelope leakage.
• 4K Aerial Drone Roof Analysis: Inspecting architectural shingles, roof flashing, and plumbing stack penetrations.
• Up to $35,000 in Combined Warranty Protection: Backed by our $10,000 Elite Master Inspection Warranty ($0 deductible) plus InterNACHI's $25,000 Honor Guarantee.

As framing progresses over the next 30 to 60 days, we strongly advise scheduling your independent Pre-Drywall Framing Audit before sheetrock installation begins.

You can review your inspection milestones or lock in your date online 24/7 at https://www.fhinspectionsatl.com/quote, or contact our lead CMI directly at (678) 480-2110.

Respectfully,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
Certified Master Inspector® #MICB-1082 | InterNACHI Member #NACHI20061502
Direct: (678) 480-2110 | Office: inspect@foresightcmi.com
Serving Metro Atlanta & 77+ Georgia Cities
https://www.fhinspectionsatl.com`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; line-height: 1.6; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 25px 30px; text-align: center; }
    .header img { height: 65px; width: auto; }
    .banner { background: #d4af37; color: #0f172a; padding: 8px 15px; font-size: 13px; font-weight: 700; text-align: center; letter-spacing: 0.5px; }
    .content { padding: 35px 30px; }
    h1 { font-size: 20px; color: #0f172a; margin-top: 0; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .alert-box { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .btn { display: inline-block; background: #d4af37; color: #0f172a !important; font-weight: 700; font-size: 15px; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; text-align: center; }
    .footer { background: #0f172a; color: #94a3b8; padding: 25px 30px; font-size: 12px; text-align: center; line-height: 1.5; }
    .footer a { color: #d4af37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="https://www.fhinspectionsatl.com/images/Logopng.webp" alt="Foresight Home Inspections">
    </div>
    <div class="banner">
      CERTIFIED MASTER INSPECTOR® (CMI) BUILDING SCIENCE ADVISORY
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Dear <strong>${recipientName}</strong>,</p>

      <p>Congratulations on commencing construction of your new residential single-family project at <strong>${address}</strong> (Project Valuation: <strong>$${valuation}</strong>).</p>

      <div class="alert-box">
        <strong style="color: #9b2c2c;">⚠️ The Critical Due Diligence Window:</strong><br>
        In Georgia residential building, over <strong>82% of structural framing defects, altered load-bearing headers, unsealed top plates, and attic HVAC duct disconnects</strong> are permanently concealed behind sheetrock and insulation during rough-in. Once drywall is hung, municipal code inspectors can no longer verify these assemblies.
      </div>

      <p>To assist your project oversight, we have prepared a confidential, property-specific <strong>Pre-Drywall Due Diligence Dossier</strong> for your review, including your project's optimal inspection windows and rough-in engineering punchlist:</p>

      <div style="text-align: center;">
        <a href="${dossierUrl}" class="btn">📄 Open Your Property Due Diligence Dossier &rarr;</a>
      </div>

      <div class="highlight-box">
        <strong>The Foresight Master Due Diligence Advantage:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Two Certified Inspectors on Every Job:</strong> Concurrently inspecting with zero blindspots.</li>
          <li><strong>FLIR® Thermal Infrared Scans Included Free:</strong> Detecting hidden insulation voids and thermal envelope leaks.</li>
          <li><strong>4K Aerial Drone Roof Analysis:</strong> Inspecting architectural shingles, roof flashing, and plumbing stack seals.</li>
          <li><strong>Up to $35,000 in Combined Protection:</strong> Backed by our $10,000 Elite Master Inspection Warranty ($0 deductible) plus InterNACHI's $25,000 Honor Guarantee.</li>
        </ul>
      </div>

      <p>As framing advances over the next 30 to 60 days, we strongly advise scheduling your independent Pre-Drywall Framing Audit before sheetrock installation begins.</p>

      <p>You can reserve your inspection window online 24/7 or speak directly with our lead Certified Master Inspector at <strong>(678) 480-2110</strong>.</p>

      <p style="margin-bottom: 0;">
        Respectfully,<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector & Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082 | InterNACHI Certified</em><br>
        Direct: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a> | Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com" style="color: #d4af37; font-weight: bold;">www.fhinspectionsatl.com</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058<br>
      Serving Metro Atlanta &amp; 77+ Cities Across 20 Georgia Counties.<br>
      This confidential building science advisory was prepared using public municipal permitting records.
    </div>
  </div>
</body>
</html>
  `;

  return { subject, bodyText, html, dossierUrl };
}

/**
 * Intelligent Router: Dispatches the exact, tailored municipal template.
 */
function buildDueDiligenceEmail(lead) {
  const isDeKalb = (lead.jurisdiction || '').includes('DeKalb') || (lead.address || '').includes('DeKalb');
  const isSTR = (lead.jurisdiction || '').includes('Short-Term Rental') || (lead.recordId || '').startsWith('STR-');

  if (isDeKalb) {
    return buildDeKalbComplianceEmail(lead);
  }
  if (isSTR) {
    return buildAtlantaSTREmail(lead);
  }
  return buildPreDrywallEmail(lead);
}

/**
 * Dispatches real-time smartphone alert via ntfy.sh
 */
async function dispatchSmartphoneAlert(lead, emailData) {
  const title = cleanHeader(`🚀 Sent: Advisory to ${lead.ownerName || 'Lead'}`);
  const summary = [
    `Autonomous Due Diligence Advisory Sent:`,
    `• Recipient: ${lead.ownerName} (${lead.ownerEmail})`,
    `• Target Property: ${lead.address}`,
    `• Valuation: $${Number(lead.jobValue || 0).toLocaleString()}`,
    `• Dossier: ${emailData.dossierUrl}`,
    ``,
    `Email dispatched from inspect@foresightcmi.com via Google SMTP.`
  ].join('\n');

  try {
    const safeDossierUrl = emailData.dossierUrl.replace(/,/g, '%2C');
    const safeMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`;

    const resp = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': 'default',
        'Tags': 'email,envelope,memo',
        'Actions': `view, View Dossier, ${safeDossierUrl}, clear=true; view, Google Maps, ${safeMapUrl}, clear=true`
      },
      body: Buffer.from(summary, 'utf8')
    });

    if (resp.ok) {
      console.log(`📱 [Outreach Engine] Push alert sent to ntfy.sh/${NTFY_TOPIC}`);
    }
  } catch (err) {
    console.error('❌ [Outreach Engine] Alert error:', err.message);
  }
}

async function main() {
  console.log('🚀 [Outreach Engine] Initializing Municipal Lead Outreach Engine...');

  const { user, pass } = getEmailCredentials();
  if (!pass) {
    console.warn('⚠️ [Outreach Engine] EMAIL_PASSWORD not found in environment or .env.local.');
    console.warn('   To enable live email dispatch in GitHub Actions, add EMAIL_PASSWORD to repository secrets.');
    console.log('🏁 [Outreach Engine] Skipping email transmission for this run.');
    return;
  }

  // Create real Gmail/Google Workspace SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log(`✅ [Outreach Engine] SMTP connection verified for ${user}`);
  } catch (verifyErr) {
    console.error('❌ [Outreach Engine] SMTP verification failed:', verifyErr.message);
    process.exit(1);
  }

  if (!fs.existsSync(LEADS_FILE)) {
    console.error('❌ [Outreach Engine] Leads file not found:', LEADS_FILE);
    process.exit(1);
  }

  const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));

  // Load or initialize outreach log
  let outreachLog = [];
  if (fs.existsSync(OUTREACH_FILE)) {
    try {
      outreachLog = JSON.parse(fs.readFileSync(OUTREACH_FILE, 'utf8'));
    } catch (e) {
      outreachLog = [];
    }
  }

  const contactedEmails = new Set(
    outreachLog.filter(o => o.status === 'SENT').map(o => o.recipientEmail)
  );

  // Enriched contact intelligence for verified permits
  const enrichedLeads = leads.map(l => {
    if (l.recordId === 'BB-202600800') {
      return {
        ...l,
        ownerName: 'Emanuel Amariw',
        ownerEmail: 'emanuel.amariw@gmail.com',
        mailingAddress: '5950 Heritage Ln, Stone Mountain GA 30087',
        projectScope: '4,665 SF 3-story luxury residence with basement, Hardie siding, 3-car garage'
      };
    }
    if (l.recordId === 'BB-202600778') {
      return {
        ...l,
        ownerName: 'Deborah Leah Calvert',
        ownerEmail: 'leahcalvert@gmail.com',
        ownerPhone: '404-909-7117',
        mailingAddress: '953 Victory Dr SW, Atlanta, GA 30310',
        projectScope: 'Single-family new construction luxury residence ($500,000 valuation)'
      };
    }
    return l;
  });

  const queue = enrichedLeads.filter(l => {
    if (!l.ownerEmail || contactedEmails.has(l.ownerEmail)) return false;
    const val = Number(l.jobValue || 0);
    const type = (l.permitType || '').toLowerCase();
    const isHighValue = val >= 15000;
    const isStructural = type.includes('addition') || type.includes('new') || type.includes('alteration') || type.includes('repair') || type.includes('structure');
    return isHighValue || isStructural;
  }).slice(0, 5);
  console.log(`📬 [Outreach Engine] Found ${queue.length} actionable high-intent verified leads in queue.`);

  for (const lead of queue) {
    const emailData = buildDueDiligenceEmail(lead);
    console.log(`\n📨 [Outreach Engine] Transmitting email to ${lead.ownerName} (${lead.ownerEmail})...`);

    const mailOptions = {
      from: `"Christopher Boykin, CMI® - Foresight Home Inspections" <${user}>`,
      to: lead.ownerEmail,
      bcc: user, // Sends exact copy to inspect@foresightcmi.com
      subject: emailData.subject,
      text: emailData.bodyText,
      html: emailData.html
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`🎉 [Outreach Engine] Email SENT successfully! Message ID: ${info.messageId}`);

      const entry = {
        recordId: lead.recordId,
        recipientName: lead.ownerName,
        recipientEmail: lead.ownerEmail,
        address: lead.address,
        jobValue: lead.jobValue,
        subject: emailData.subject,
        dossierUrl: emailData.dossierUrl,
        messageId: info.messageId,
        status: 'SENT',
        dispatchedAt: new Date().toISOString(),
        inspectionTarget: 'Pre-Drywall Rough-In (From $275)'
      };

      outreachLog.unshift(entry);
      fs.writeFileSync(OUTREACH_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

      // Send real-time confirmation push to entrepreneur's phone
      await dispatchSmartphoneAlert(lead, emailData);
      console.log(`📱 [Outreach Engine] Live confirmation pinged to your phone for ${lead.ownerName}`);

    } catch (sendErr) {
      console.error(`❌ [Outreach Engine] Failed to send email to ${lead.ownerEmail}:`, sendErr.message);
    }
  }

  console.log(`\n🏁 [Outreach Engine] Outreach run completed.`);
}

main();
