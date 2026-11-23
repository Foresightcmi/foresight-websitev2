import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { harvestLiveDueDiligence } from './harvest-live-due-diligence.mjs';
import { discoverLocalOpenSmsPhone, sendOpenSmsWithDhcpFallback } from './lib/opensms-fallback.mjs';
import { syncNetworkClock, readGovernorCeiling } from './lib/network-clock.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const LOAN_OFFICERS_FILE = path.join(ROOT_DIR, 'data', 'loan-officers.json');
const B2B_PARTNERS_FILE = path.join(ROOT_DIR, 'data', 'b2b-referral-partners.json');
const UNDER_CONTRACT_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const OUTREACH_LOG_FILE = path.join(ROOT_DIR, 'data', 'due-diligence-outreach-log.json');
const OPENSMS_LOG_FILE = path.join(ROOT_DIR, 'data', 'opensms-outreach-log.json');
const OPENSMS_CONFIG_FILE = path.join(ROOT_DIR, 'data', 'opensms-config.json');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const LOCAL_UNSUB_FILE = path.join(ROOT_DIR, 'data', 'unsubscribed_contacts.json');
const LEGACY_UNSUB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const UNSUBSCRIBED_FILE = fs.existsSync(LOCAL_UNSUB_FILE) ? LOCAL_UNSUB_FILE : LEGACY_UNSUB_FILE;
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

function getOpenSmsConfig() {
  let apiKey = process.env.OPENSMS_API_KEY ? process.env.OPENSMS_API_KEY.trim() : '';
  let gatewayUrl = process.env.OPENSMS_URL ? process.env.OPENSMS_URL.trim() : '';

  if (fs.existsSync(ENV_LOCAL_FILE)) {
    const content = fs.readFileSync(ENV_LOCAL_FILE, 'utf8');
    const keyMatch = content.match(/OPENSMS_API_KEY=(.+)/);
    const urlMatch = content.match(/OPENSMS_URL=(.+)/);
    if (!apiKey && keyMatch && keyMatch[1].trim()) apiKey = keyMatch[1].trim();
    if (!gatewayUrl && urlMatch && urlMatch[1].trim()) gatewayUrl = urlMatch[1].trim();
  }
  if (fs.existsSync(OPENSMS_CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(OPENSMS_CONFIG_FILE, 'utf8'));
      if (!apiKey && cfg.apiKey) apiKey = String(cfg.apiKey).trim();
      if (!gatewayUrl && cfg.gatewayUrl) gatewayUrl = String(cfg.gatewayUrl).trim();
    } catch {}
  }
  return { apiKey, gatewayUrl };
}

function getEmailCredentials() {
  let pass = process.env.EMAIL_PASSWORD; // ggignore
  let user = process.env.EMAIL_USER || 'inspect@foresightcmi.com'; // ggignore

  if (!pass && fs.existsSync(ENV_LOCAL_FILE)) {
    const content = fs.readFileSync(ENV_LOCAL_FILE, 'utf8');
    const passMatch = content.match(/EMAIL_PASSWORD=(.+)/); // ggignore
    const userMatch = content.match(/EMAIL_USER=(.+)/);
    if (passMatch) pass = passMatch[1].trim(); // ggignore
    if (userMatch) user = userMatch[1].trim();
  }

  return { user, pass };
}

function cleanHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '').trim();
}

async function sendPushNotification(title, message, priority = 'default') {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': cleanHeader(title),
        'Priority': priority,
        'Tags': 'shield,briefcase,zap'
      },
      body: message
    });
    console.log(`📱 [Push Alert] Sent to ntfy.sh/${NTFY_TOPIC}: "${title}"`);
  } catch (err) {
    console.warn('⚠️ [Push Alert] Failed to send ntfy alert:', err.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -------------------------------------------------------------
// 1. Dossier Email Builder: Mortgage Loan Officers
// -------------------------------------------------------------
function buildLoanOfficerEmail(lo) {
  const subject = `⚡ Mortgage Originator Due Diligence SLA: Zero Closing Delays | Foresight Home Inspections`;
  const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/lender-partner-dossier.html`;
  const quoteUrl = `https://www.fhinspectionsatl.com/quote?partner=${encodeURIComponent(lo.company)}`;

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
    .banner { background: #d4af37; color: #0f172a; padding: 8px 15px; font-size: 13px; font-weight: 800; text-align: center; letter-spacing: 0.5px; }
    .content { padding: 35px 30px; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; font-size: 14.5px; }
    .snippet-box { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 6px; font-family: monospace; font-size: 12.5px; margin: 15px 0; line-height: 1.5; white-space: pre-wrap; }
    .btn { display: inline-block; background: #d4af37; color: #0f172a !important; font-weight: 800; font-size: 14px; padding: 13px 26px; text-decoration: none; border-radius: 6px; margin: 15px 0; text-align: center; }
    .footer { background: #0f172a; color: #94a3b8; padding: 25px 30px; font-size: 12px; text-align: center; line-height: 1.5; }
    .footer a { color: #d4af37; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div style="background-color:#ffffff;border-bottom:3px solid #d4af37;padding:14px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="70" style="display:block;height:70px;width:auto;border:0;" /><div style="font-size:11px;font-weight:800;color:#0f172a;letter-spacing:0.4px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;margin-right:8px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;" /></td></tr></table></div>
    <div class="banner">
      🏛️ MORTGAGE ORIGINATOR SERVICE LEVEL AGREEMENT &amp; COLLATERAL PROTECTION
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hi <strong>${lo.first}</strong>,</p>

      <p>As a mortgage originator at <strong>${lo.company}</strong> in ${lo.city}, you know that <strong>the 5-to-7 day Georgia due diligence period</strong> is where purchase files face the greatest risk of appraisal delays, rate-lock expirations, and repair negotiation fallout.</p>

      <p>When buyers hire slow solo inspectors who take 3 days to deliver reports, or when repair disputes stall the contract, your closing calendar is on the line.</p>

      <div class="highlight-box">
        <strong>The Foresight CMI® Lender Protection Standard:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Guaranteed 24-Hr Scheduling SLA:</strong> Same-day digital reports delivered by 8:00 PM.</li>
          <li><strong>Two Certified Master Inspectors Concurrency:</strong> Dedicated structural + mechanical evaluations in parallel with zero solo-inspector fatigue.</li>
          <li><strong>Georgia Repair Amendment Support:</strong> Clear diagnostic defect summaries compatible with standard Georgia repair request amendments (such as Georgia repair amendment) for licensed broker or attorney review.</li>
          <li><strong>$35,000 in Buyer Protection Guarantees:</strong> $10,000 Elite Group 100-Day Zero-Deductible Home Warranty + $25,000 InterNACHI Honor Guarantee eliminates borrower cold feet.</li>
          <li><strong>DeKalb County Low-Flow Plumbing Certificate:</strong> On-site fixture verification (toilets 1.6 GPF max) and signed county certificate for pre-1993 homes in unincorporated DeKalb; we confirm whether it applies to your address.</li>
        </ul>
      </div>

      <p>We invite you to review our official <strong>Lender Closing-Protection Dossier</strong>:</p>

      <div style="text-align: center;">
        <a href="${dossierUrl}" class="btn">📄 Open Lender Partner Dossier &rarr;</a>
      </div>

      <p style="margin-top: 20px;"><strong>📲 1-Click Plug-In for Your Borrower Onboarding:</strong><br>
      Many Atlanta lending teams paste this quick snippet into Step 2 of their automated "Under Contract Next Steps" email sequence to ensure buyers order immediately:</p>

      <div class="snippet-box">"STEP 2: ORDER YOUR HOME INSPECTION IMMEDIATELY
In Georgia, due diligence is typically only 5 to 7 days. To protect your earnest money and keep our closing date on schedule, we recommend Foresight Home Inspections:
• Two Certified Master Inspectors on every job
• Same-day digital report delivery
• $35,000 Client Protection ($10,000 100-Day Zero-Deductible Warranty + $25,000 InterNACHI Honor Guarantee)
👉 Reserve your inspection slot in 60 seconds: ${quoteUrl}
Priority Desk: (678) 480-2110 | inspect@foresightcmi.com"</div>

      <p>If you would like dedicated VIP priority scheduling for your branch's borrowers, let's connect directly at <strong>(678) 480-2110</strong>.</p>

      <p style="margin-bottom: 0;">
        Respectfully,<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector &amp; Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082 • InterNACHI #NACHI18051119</em><br>
        Direct Priority Desk: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a><br>
        Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com" style="color: #d4af37; font-weight: bold;">www.fhinspectionsatl.com</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | Serving Metro Atlanta • <br>
      Serving Metro Atlanta, Fulton, Gwinnett, Cobb, DeKalb, Forsyth, Cherokee &amp; 20 Counties.<br>
      Confidential Professional Advisory for Mortgage Industry Partners.<br>
      <span style="font-size: 10px; color: #94a3b8;">Foresight Home Inspections is an independent inspection firm and is not affiliated with or endorsed by the Georgia Association of Realtors (GAR). RESPA Section 8 Notice (12 U.S.C. 2607): Zero referral fees, zero kickbacks, and zero fee-splitting; objective scheduling SLA and technical inspection standards only; borrowers are always free to select any home inspector of their choice.</span>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

// -------------------------------------------------------------
// 2. Dossier Email Builder: Under Due Diligence (New Contracts)
// -------------------------------------------------------------
const DEKALB_MUNICIPALITIES_REGEX = /\b(lithonia|stone mountain|tucker|decatur|redan|stonecrest|chamblee|dunwoody|brookhaven|avondale estates|clarkston|doraville|pine lake|ellenwood|scottdale|conley|belvedere park|candler-mcafee|gresham park|north decatur|north druid hills|panthersville|dekalb)\b/i;

function buildUnderContractEmail(realtor) {
  const firstName = realtor.first || 'there';
  const address = realtor.address || 'your property';
  const city = realtor.city || 'Metro Atlanta';
  const price = realtor.price ? ` (${realtor.price})` : '';
  const quoteUrl = `https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)}`;
  const isDeKalb = DEKALB_MUNICIPALITIES_REGEX.test(city) || DEKALB_MUNICIPALITIES_REGEX.test(address);

  const subject = isDeKalb
    ? `Congrats on ${address} (${city}) — 24-Hr Priority Due Diligence Pass + DeKalb Low-Flow`
    : `Congrats on ${address} (${city}) — 24-Hr Priority Due Diligence Slot`;

  const dekalbPara = isDeKalb
    ? `Since ${address} is in the DeKalb area, if it was built before 1993 in unincorporated DeKalb County, we also sign the official DeKalb Watershed Low-Flow Plumbing Certificate (Call for Quote) on the spot so water service turn-on is never delayed.`
    : `We also handle Phase 1 Pre-Drywall (From $275), Final New Construction (From $400), 11-Month Builder Warranty (From $345), plus main sewer line camera scopes, radon, mold/air quality, and signed unincorporated DeKalb County Low-Flow Certificates (Call for Quote).`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Congratulations on getting ${address} in ${city}${price} under contract. I wanted to reach out personally in case your buyers or the co-op agent need a fast 24-hour inspection slot while the due diligence clock is running.`,
    ``,
    `My partner and I inspect every property together as a two-inspector Certified Master Inspector team with active SUPRA eKEY access (Homes From $345 / Condos From $295). One of us evaluates the roof, exterior, attic, and foundation while the other checks electrical, plumbing, and HVAC—giving your buyers double the diagnostic focus with zero solo-inspector fatigue and delivering a clean same-day digital report that regularly protects thousands in Georgia Repair Amendment seller credits, backed by $35,000 in combined protection.`,
    ``,
    dekalbPara,
    ``,
    `Reserve a slot in 60 seconds: ${quoteUrl} or text/call me directly at (678) 480-2110.`,
    ``,
    `Best regards,`,
    `Christopher Boykin, CMI`,
    `Foresight Home Inspections | Serving Metro Atlanta • `
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0;background-color:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">
  <div style="background-color:#ffffff;border-bottom:3px solid #d4af37;padding:14px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="70" style="display:block;height:70px;width:auto;border:0;" /><div style="font-size:11px;font-weight:800;color:#0f172a;letter-spacing:0.4px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;margin-right:8px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;" /></td></tr></table></div>
  <div style="padding:24px 24px 20px 24px;">
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.62;color:#1e293b;">Hi ${firstName},</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.62;color:#1e293b;">Congratulations on getting <strong>${address}</strong> in <strong>${city}${price}</strong> under contract! I wanted to reach out directly in case your buyers or the co-op agent need a fast 24-hour inspection slot while your due diligence clock is running.</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.62;color:#1e293b;">My partner and I inspect every home together as a two-inspector Certified Master Inspector team with active SUPRA eKEY access. Dividing structural and mechanical systems in parallel gives your buyers double the diagnostic focus with zero solo-inspector fatigue, keeps showing schedules smooth, and delivers a calm walkthrough of what actually matters versus routine upkeep.</p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #d4af37;border-radius:6px;padding:14px 18px;margin:18px 0;">
      <div style="font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">What's Included for ${address}</div>
      <div style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#1e293b;"><strong style="color:#0f172a;">&#9642; Two Certified Master Inspectors (Homes From $345 / Condos From $295):</strong> Dedicated structural + mechanical coverage, calibrated infrared thermal &amp; 4K drone scans, and same-day Digital Repair Request Builder reports that regularly protect $2,600–$8,400+ in Georgia Repair Amendment credits.</div>
      <div style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#1e293b;"><strong style="color:#0f172a;">&#9642; DeKalb County Low-Flow Certificate (Call for Quote):</strong> Same-day signed Certificate of Compliance for pre-1993 homes in unincorporated DeKalb County so water turn-on is never delayed.</div>
      <div style="margin:0;font-size:14px;line-height:1.5;color:#1e293b;"><strong style="color:#0f172a;">&#9642; Pre-Drywall (From $275), New Build (From $400) &amp; $35,000 Warranties:</strong> Plus Sewer Scope, Radon, Mold/IAQ (Call for Quote), free utility setup concierge, and $35,000 in combined zero-deductible buyer protection.</div>
    </div>
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.62;color:#1e293b;">You or your buyer can grab a time slot online or text/call my cell directly at <strong>(678) 480-2110</strong>.</p>
    <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:16px;">
      <div style="font-size:15px;font-weight:700;color:#0f172a;">Christopher Boykin, CMI</div>
      <div style="font-size:13px;color:#475569;margin-top:2px;">Founder &amp; Lead Inspector &bull; Foresight Home Inspections</div>
      <div style="font-size:13px;color:#0f172a;margin-top:6px;"><strong>Direct / Text:</strong> (678) 480-2110 &nbsp;|&nbsp; <a href="https://www.fhinspectionsatl.com" style="color:#0f52ba;text-decoration:none;font-weight:600;">www.fhinspectionsatl.com</a></div>
      <div style="font-size:11px;color:#64748b;margin-top:8px;">Serving Metro Atlanta • Reply stop anytime to opt out.</div>
    </div>
  </div>
</div>`;

  return { subject, text, html };
}

// -------------------------------------------------------------
// 3. Dossier Email Builder: Pre-Due Diligence (Hot / Imminent Binding)
// -------------------------------------------------------------
function buildPreDueDiligenceEmail(realtor) {
  const firstName = realtor.first || 'there';
  const address = realtor.address || 'your property';
  const city = realtor.city || 'Metro Atlanta';
  const quoteUrl = `https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)}`;

  const subject = `Pre-Due Diligence Readiness & 24-Hr Inspection Reservation: ${address}`;

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
    .banner { background: #3b82f6; color: #ffffff; padding: 8px 15px; font-size: 13px; font-weight: 800; text-align: center; letter-spacing: 0.5px; }
    .content { padding: 35px 30px; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; font-size: 14.5px; }
    .btn { display: inline-block; background: #3b82f6; color: #ffffff !important; font-weight: 800; font-size: 14px; padding: 13px 26px; text-decoration: none; border-radius: 6px; margin: 15px 0; text-align: center; }
    .footer { background: #0f172a; color: #94a3b8; padding: 25px 30px; font-size: 12px; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div style="background-color:#ffffff;border-bottom:3px solid #d4af37;padding:14px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle" style="padding-right:12px;"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="70" style="display:block;height:70px;width:auto;border:0;" /><div style="font-size:11px;font-weight:800;color:#0f172a;letter-spacing:0.4px;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;margin-right:8px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;" /></td></tr></table></div>
    <div class="banner">
      ⚡ PRE-DUE DILIGENCE READINESS &amp; 24-HR INSPECTION SLOT RESERVATION
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hi <strong>${firstName}</strong>,</p>

      <p>Saw your active listing at <strong>${address}</strong> in <strong>${city}</strong>. As buyer showings surge and purchase offers are drafted, having your due diligence inspection resources aligned in advance eliminates closing friction the moment you go binding.</p>

      <p>We have pre-reserved a <strong>24-hour Due Diligence Inspection slot</strong> for properties in ${city} this week.</p>

      <div class="highlight-box">
        <strong>Why Atlanta Top Producers Keep Foresight on Speed Dial:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Two Certified Master Inspectors on Every Job:</strong> Dedicated structural + mechanical focus in parallel with zero solo-inspector fatigue.</li>
          <li><strong>Active SUPRA eKEY Access:</strong> We inspect smoothly without burdening the listing agent.</li>
          <li><strong>Georgia Contract-Ready Repair Summaries:</strong> Clean diagnostic language compatible with standard Georgia repair amendments that keeps deals intact.</li>
          <li><strong>$35,000 Client Protection Guarantees:</strong> $10,000 Elite Group 100-Day Zero-Deductible Home Warranty &amp; $25,000 InterNACHI Honor Guarantee.</li>
          <li><strong>DeKalb Low-Flow Plumbing Certificate:</strong> Official signed county compliance certificate issued on-site for pre-1993 DeKalb homes.</li>
        </ul>
      </div>

      <p>When the contract goes binding, you or your buyer can lock in the date instantly:</p>

      <div style="text-align: center;">
        <a href="${quoteUrl}" class="btn">⚡ 1-Click Due Diligence Booking for ${address} &rarr;</a>
      </div>

      <p style="margin-bottom: 0;">
        Wishing you great offers and a smooth contract!<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector &amp; Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082</em><br>
        Direct: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a> | Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com/realtors" style="color: #3b82f6; font-weight: bold;">Agent VIP Portal: fhinspectionsatl.com/realtors</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | Serving Metro Atlanta • <br>
      Serving Metro Atlanta &amp; 87 Municipalities across 20 Georgia Counties.<br>
      <span style="font-size: 10px; color: #94a3b8;">Foresight Home Inspections is an independent inspection firm and is not affiliated with or endorsed by the Georgia Association of Realtors (GAR). Diagnostic summaries are provided for informational review by licensed real estate brokers and legal counsel.</span>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

// -------------------------------------------------------------
// MAIN ORCHESTRATION ENGINE
// -------------------------------------------------------------
const LOCK_FILE = path.join(ROOT_DIR, 'data', 'due_diligence_dispatch.lock');

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const cur = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      if (cur.pid === process.pid) fs.unlinkSync(LOCK_FILE);
    }
  } catch {}
}

async function main() {
  const netClock = await syncNetworkClock();
  const localStartMs = Date.now();
  const liveNowMs = () => (netClock.ok ? netClock.nowMs + (Date.now() - localStartMs) : Date.now());
  const liveIso = () => new Date(liveNowMs()).toISOString();

  if (fs.existsSync(LOCK_FILE)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      const lockAgeMs = liveNowMs() - (lockData.timestamp || 0);
      if (lockData.pid && isProcessRunning(lockData.pid) && lockAgeMs < 30 * 60 * 1000) {
        console.log(`🛡️ [Concurrency Guard] Another Due Diligence Scout instance is actively running (PID ${lockData.pid}). Exiting cleanly to prevent duplicate sends.`);
        return;
      }
      fs.unlinkSync(LOCK_FILE);
    } catch {
      try { fs.unlinkSync(LOCK_FILE); } catch {}
    }
  }
  fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, timestamp: liveNowMs() }), 'utf8');
  process.on('exit', releaseLock);

  console.log('⚡ [Due Diligence Engine] Initializing Autonomous Scout, Email & OpenSMS Transmission...');

  // 0. Harvest Live FMLS Pending / Under-Contract Deals First & Rebuild VIP Dispatch
  let newPendingHarvested = 0;
  try {
    const harvestRes = await harvestLiveDueDiligence(1400);
    newPendingHarvested = harvestRes.newPendingDeals || 0;
    execSync('node scripts/generate-due-diligence-dispatch.mjs', { cwd: ROOT_DIR, stdio: 'ignore' });
    console.log(`🔄 [Due Diligence Engine] Synced public/vip-dispatch.html with ${newPendingHarvested} newly harvested FMLS Pending deals.`);
  } catch (err) {
    console.warn('⚠️ [Due Diligence Engine] Live FMLS harvest warning:', err.message);
  }

  // 1. Check Email & OpenSMS Credentials + Shared Cross-Engine SMTP Circuit Breaker
  const SHARED_COOLDOWN_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'smtp_cooldown_state.json');
  function getSharedCooldown() {
    try {
      if (!fs.existsSync(SHARED_COOLDOWN_FILE)) return { active: false };
      const d = JSON.parse(fs.readFileSync(SHARED_COOLDOWN_FILE, 'utf8'));
      if (d && d.cooldownUntil && new Date(d.cooldownUntil).getTime() > liveNowMs()) {
        return { active: true, cooldownUntil: d.cooldownUntil, reason: d.reason };
      }
    } catch {}
    return { active: false };
  }
  function setSharedCooldown(reason, hours = 24.25) {
    try {
      const payload = {
        triggeredAt: liveIso(),
        cooldownUntil: new Date(liveNowMs() + hours * 3600 * 1000).toISOString(),
        reason
      };
      fs.writeFileSync(SHARED_COOLDOWN_FILE, JSON.stringify(payload, null, 2), 'utf8');
    } catch {}
  }

  const easternHour = netClock.ok ? netClock.easternHour : null;
  const easternDateStr = netClock.ok ? netClock.easternDateStr : liveIso().slice(0, 10);
  const isDaytimeWindow = netClock.ok && netClock.isDaytimeWindow;
  const isHolidayBlackout = new Set(['2026-11-26', '2026-11-27', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31', '2027-01-01']).has(easternDateStr);

  const oneDayAgoMs = liveNowMs() - 24 * 3600 * 1000;
  const fourteenDaysAgoMs = liveNowMs() - 14 * 24 * 3600 * 1000;
  let rolling24hSent = 0;
  const recentlyContactedEmails14d = new Set();
  const masterDbPath = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'master_realtor_database.json');
  if (fs.existsSync(masterDbPath)) {
    try {
      const mdb = JSON.parse(fs.readFileSync(masterDbPath, 'utf8'));
      for (const c of Object.values(mdb.contacts || {})) {
        const cEmail = String(c?.email || '').trim().toLowerCase();
        for (const camp of Object.values(c?.campaigns || {})) {
          if (camp?.sent && camp.timestamp) {
            const tMs = new Date(camp.timestamp).getTime();
            if (tMs >= oneDayAgoMs) rolling24hSent++;
            if (cEmail && tMs >= fourteenDaysAgoMs) recentlyContactedEmails14d.add(cEmail);
          }
        }
      }
    } catch {}
  }
  for (const [fn, tsKey] of [
    ['due-diligence-outreach-log.json', 'timestamp'],
    ['permit-outreach-log.json', 'dispatchedAt'],
    ['warranty-outreach-log.json', 'timestamp'],
    ['new-construction-outreach-log.json', 'sentAt'],
    ['new-construction-outreach.json', 'sentAt'],
    ['agent-reach-outreach-log.json', 'timestamp']
  ]) {
    const lp = path.join(ROOT_DIR, 'data', fn);
    if (!fs.existsSync(lp)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(lp, 'utf8'));
      for (const r of (Array.isArray(parsed) ? parsed : (parsed.history || []))) {
        const ts = r?.[tsKey] || r?.timestamp || r?.dispatchedAt || r?.sentAt;
        const tMs = ts ? new Date(ts).getTime() : 0;
        if (tMs >= oneDayAgoMs) rolling24hSent++;
        const em = String(r?.email || r?.recipientEmail || '').trim().toLowerCase();
        if (em && tMs >= fourteenDaysAgoMs) recentlyContactedEmails14d.add(em);
      }
    } catch {}
  }
  const cloudStateFile = path.join(ROOT_DIR, 'data', 'cloud-realtor-nurture-state.json');
  if (fs.existsSync(cloudStateFile)) {
    try {
      const cs = JSON.parse(fs.readFileSync(cloudStateFile, 'utf8'));
      for (const ts of Object.values(cs.lastSentByEmail || {})) {
        if (ts && new Date(ts).getTime() >= oneDayAgoMs) rolling24hSent++;
      }
    } catch {}
  }
  const revLedgerFile = path.join(ROOT_DIR, 'data', 'private', 'review-dispatch-ledger.json');
  if (fs.existsSync(revLedgerFile)) {
    try {
      const rl = JSON.parse(fs.readFileSync(revLedgerFile, 'utf8'));
      for (const rec of Object.values(rl.byKey || {})) {
        for (const t of rec?.touches || []) {
          if (t?.at && Array.isArray(t.channels) && t.channels.includes('email') && new Date(t.at).getTime() >= oneDayAgoMs) rolling24hSent++;
        }
      }
    } catch {}
  }
  const govCap = readGovernorCeiling(ROOT_DIR, 1200);
  const max24hCap = govCap.max24h;
  let remaining24hBudget = govCap.allowSend ? Math.max(0, max24hCap - rolling24hSent) : 0;

  const { user, pass } = getEmailCredentials();
  const { apiKey: openSmsKey, gatewayUrl: configuredSmsUrl } = getOpenSmsConfig();
  let transporter = null;
  let canSendEmail = false;
  const smtpCooldown = getSharedCooldown();

  if (!netClock.ok) {
    console.log('🛡️ [Due Diligence Engine] Network clock unavailable. Fail-closed: harvest synced; SMTP/SMS deferred.');
  } else if (!govCap.allowSend) {
    console.log(`🛡️ [Due Diligence Engine] Governor Safety Gate blocked sends (${govCap.reason}). Deferring SMTP.`);
  } else if (!isDaytimeWindow) {
    console.log(`🛡️ [Due Diligence Engine] Outside 9:00 AM - 6:00 PM ET window (Real ET Hour: ${easternHour}). Harvest synced; SMTP/SMS deferred to daytime.`);
  } else if (remaining24hBudget <= 0) {
    console.log(`🛡️ [Due Diligence Engine] Rolling 24h cap reached (${rolling24hSent}/${max24hCap}). Preserving 800-email Workspace buffer.`);
  } else if (smtpCooldown.active) {
    console.log(`🛡️ [Due Diligence Engine] Shared SMTP Circuit Breaker active until ${smtpCooldown.cooldownUntil}. Skipping SMTP.`);
  } else if (!pass) {
    console.warn('⚠️ [Due Diligence Engine] EMAIL_PASSWORD not found in environment/secrets.');
  } else {
    try {
      const testTransporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true,
        maxConnections: 1,
        maxMessages: 25,
        auth: { user, pass }
      });
      await testTransporter.verify();
      transporter = testTransporter;
      canSendEmail = true;
      console.log(`✅ [Due Diligence Engine] SMTP connection verified for ${user}`);
    } catch (err) {
      console.warn(`⚠️ [Due Diligence Engine] SMTP connection failed (${err.message}).`);
      if (err.message.includes('454') || err.message.includes('550')) {
        setSharedCooldown(`Due Diligence Verify Error: ${err.message}`);
      }
      console.log('ℹ️ [Due Diligence Engine] Running in Directory Scout & Verification mode.');
    }
  }

  // 2. Load Logs & Strict Person-Level Deduplication (Never Contact the Same Person Twice)
  const PERMIT_LOG_FILE = path.join(ROOT_DIR, 'data', 'permit-outreach-log.json');
  let outreachLog = [];
  if (fs.existsSync(OUTREACH_LOG_FILE)) {
    try {
      outreachLog = JSON.parse(fs.readFileSync(OUTREACH_LOG_FILE, 'utf8'));
    } catch {
      outreachLog = [];
    }
  }
  let permitLog = [];
  if (fs.existsSync(PERMIT_LOG_FILE)) {
    try {
      permitLog = JSON.parse(fs.readFileSync(PERMIT_LOG_FILE, 'utf8'));
    } catch {
      permitLog = [];
    }
  }

  // Load OpenSMS Logs
  let openSmsLog = [];
  if (fs.existsSync(OPENSMS_LOG_FILE)) {
    try {
      openSmsLog = JSON.parse(fs.readFileSync(OPENSMS_LOG_FILE, 'utf8'));
    } catch {
      openSmsLog = [];
    }
  }

  const contactedKeys = new Set(outreachLog.map(o => o.key).filter(Boolean));
  const contactedEmails = new Set([
    ...outreachLog.map(o => String(o.email || '').trim().toLowerCase()).filter(Boolean),
    ...permitLog.map(o => String(o.recipientEmail || '').trim().toLowerCase()).filter(Boolean)
  ]);
  const contactedNames = new Set([
    ...outreachLog.map(o => String(o.targetName || '').trim().toLowerCase()).filter(Boolean),
    ...openSmsLog.map(o => String(o.targetName || '').trim().toLowerCase()).filter(Boolean),
    ...permitLog.map(o => String(o.recipientName || '').trim().toLowerCase()).filter(Boolean)
  ]);
  const smsContactedPhones = new Set([
    ...openSmsLog.map(o => String(o.to || '').replace(/\D/g, '').slice(-10)).filter(p => p.length === 10),
    ...outreachLog.map(o => String(o.phone || '').replace(/\D/g, '').slice(-10)).filter(p => p.length === 10)
  ]);

  // Load Unsubscribed / Suppressions
  const suppressedEmails = new Set();
  if (fs.existsSync(UNSUBSCRIBED_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(UNSUBSCRIBED_FILE, 'utf8'));
      for (const item of data) {
        if (typeof item === 'string') suppressedEmails.add(item.toLowerCase().trim());
        else if (item && typeof item === 'object' && item.email) suppressedEmails.add(item.email.toLowerCase().trim());
      }
      console.log(`🛡️ [Due Diligence Engine] Loaded ${suppressedEmails.size} suppressed contacts.`);
    } catch (err) {
      console.warn('⚠️ [Due Diligence Engine] Could not load unsubscribed contacts:', err.message);
    }
  }

  const EXCLUDED_DOMAINS = new Set([
    'ansleyre.com', 'ansleyatlanta.com', 'metrobrokers.com', 'cbcmetrobrokers.com',
    'peachtreetc.com', 'drhorton.com', 'pulte.com', 'lennar.com', 'ashtonwoods.com',
    'stanleymartin.com', 'centurycommunities.com', 'beazer.com', 'adamshomes.com',
    'rocklynhomes.com', 'meritagehomes.com', 'tollbrothers.com', 'kbhome.com',
    'taylormorrison.com', 'smithdouglas.com', 'chafincommunities.com',
    'chafinrealtyinc.com', 'paranhomes.com', 'dwhomes.com', 'theprovidencegroup.com',
    'relianthomes.com', 'odwyerhomes.com', 'cstonega.com'
  ]);

  function isSuppressed(email, name = '', brokerage = '') {
    if (!email) return true;
    const cleanEmail = String(email).toLowerCase().trim();
    const domain = cleanEmail.split('@')[1] || '';
    const cleanName = String(name).toLowerCase().trim();
    const cleanBrokerage = String(brokerage).toLowerCase().trim();

    if (suppressedEmails.has(cleanEmail)) return true;
    if (EXCLUDED_DOMAINS.has(domain)) return true;
    if (cleanEmail.includes('ansleyre.com') || cleanEmail.includes('ansley')) return true;
    if (cleanEmail.includes('amyfuchs') || cleanEmail.includes('amy.fuchs')) return true;
    if (cleanEmail.includes('cgrealtyinc.com') || cleanEmail.includes('joe@cgrealtyinc.com')) return true;
    if (cleanName.includes('amy fuchs') || cleanName.includes('joe chapman')) return true;
    if (cleanBrokerage.includes('ansley') || cleanBrokerage.includes('chapman group realty')) return true;

    return false;
  }

  let quotaCeilingHit = remaining24hBudget <= 0;
  const TRI_LOGO_HEADER = `<div style="background:#ffffff;border-bottom:3px solid #d4af37;padding:14px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="middle"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="70" style="display:block;height:70px;width:auto;border:0;" /><div style="font-size:11px;font-weight:800;color:#0f172a;margin-top:6px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; TWO-INSPECTOR TEAM</div></td><td valign="middle" align="right" style="white-space:nowrap;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="CMI" height="78" width="78" style="display:inline-block;height:78px;width:78px;margin-right:8px;" /><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="CPI" height="78" width="78" style="display:inline-block;height:78px;width:78px;" /></td></tr></table></div>`;

  function consumeBudget(normEmail) {
    remaining24hBudget = Math.max(0, remaining24hBudget - 1);
    if (normEmail) recentlyContactedEmails14d.add(normEmail);
    if (remaining24hBudget <= 0) quotaCeilingHit = true;
  }

  function handleSmtpError(e, label = '') {
    const msg = String(e?.message || e || '');
    if (/550|454|Daily user sending limit/i.test(msg)) {
      setSharedCooldown(`Due Diligence 550/454 limit (${label}): ${msg}`, 24.25);
      quotaCeilingHit = true;
      return true;
    }
    if (/421|4\.7\.0|Too many concurrent|rate/i.test(msg)) {
      setSharedCooldown(`Due Diligence 421 soft rate deferral (${label}): ${msg}`, 0.75);
      quotaCeilingHit = true;
      return true;
    }
    return false;
  }

  let sentLendersCount = 0;
  let sentB2bPartnersCount = 0;
  let sentUnderContractCount = 0;
  let sentOpenSmsCount = 0;

  let totalUnderContract = 0;
  if (fs.existsSync(UNDER_CONTRACT_FILE)) {
    const underContractRealtors = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
    totalUnderContract = underContractRealtors.length;
    console.log(`📋 [Due Diligence Engine] Priority #1: Loaded ${underContractRealtors.length} Active Under-Contract / Due Diligence Realtors.`);

    const sorted = [...underContractRealtors];

    if (canSendEmail && transporter && !isHolidayBlackout) {
      for (const r of sorted) {
        if (quotaCeilingHit) break;
        if (!r.email || !r.email.includes('@')) continue;
        if (r.closed || r.close_date) continue;
        if ((r.raw_price || 0) < 75000 || /^0\s+/i.test(r.address || '') || /non-mls/i.test(r.name || '') || r.clean_phone === '0000000000') continue;
        const dealTimestamp = new Date(r.pending_timestamp || r.date || 0).getTime();
        const dealAgeDays = (liveNowMs() - dealTimestamp) / (1000 * 60 * 60 * 24);
        if (isNaN(dealAgeDays) || dealAgeDays < 0 || dealAgeDays > 2.0) continue;
        const normEmail = String(r.email).trim().toLowerCase();
        const normName = String(r.name || '').trim().toLowerCase();
        const cleanPhone = String(r.clean_phone || r.raw_phone || r.phone || '').replace(/\D/g, '').slice(-10);
        const key = `CONTRACT_${r.id}_${r.email}`;
        if (
          contactedKeys.has(key) ||
          recentlyContactedEmails14d.has(normEmail) ||
          (cleanPhone.length === 10 && smsContactedPhones.has(cleanPhone))
        ) {
          continue;
        }
        if (isSuppressed(r.email, r.name, r.brokerage)) {
          console.log(`  🛡️ [Suppression Gate] Bypassed suppressed contact: ${r.name} (${r.email}) [Ansley / Unsubscribed Lockout]`);
          continue;
        }

        console.log(`📤 [Due Diligence Engine] Dispatching Active Due Diligence Dossier to ${r.name} (${r.address}) <${r.email}>...`);
        const { subject, text, html } = buildUnderContractEmail(r);

        try {
          await transporter.sendMail({
            from: `"Christopher Boykin, CMI" <${user}>`,
            to: r.email,
            subject,
            text,
            html
          });

          contactedKeys.add(key);
          contactedEmails.add(normEmail);
          consumeBudget(normEmail);
          if (normName) contactedNames.add(normName);
          if (cleanPhone.length === 10) smsContactedPhones.add(cleanPhone);
          outreachLog.push({
            key,
            type: 'UNDER_CONTRACT_DUE_DILIGENCE',
            role: r.role || 'LIST_AGENT',
            targetName: r.name,
            brokerage: r.brokerage,
            address: r.address,
            city: r.city,
            email: r.email,
            phone: cleanPhone,
            date: r.date,
            timestamp: liveIso()
          });
        
          fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

          sentUnderContractCount++;
          console.log(`  ✓ Transmitted successfully to ${r.name} for ${r.address}`);
          await sleep(18500);
        } catch (e) {
          console.error(`  ❌ Failed to send to ${r.email}:`, e.message);
          if (handleSmtpError(e, r.email)) break;
        }

        const maxUnderContractPerRun = Number(process.env.DD_BATCH_LIMIT || 10);
        if (sentUnderContractCount >= maxUnderContractPerRun) break;
      }
    } else {
      console.log('  ℹ️ Email dispatch inactive; under-contract due diligence directory is verified and current.');
    }

    let activeSmsUrl = isDaytimeWindow ? (configuredSmsUrl || (await discoverLocalOpenSmsPhone(9292))) : '';
    if (activeSmsUrl) {
      console.log(`🤖 [OpenSMS Engine] Target Android OpenSMS Gateway: ${activeSmsUrl}`);

      for (const r of sorted) {
        // Strict Freshness Gate: ONLY contracts signed in the last 48 hours (active 2-day due diligence window)
        if (!r.date) continue;
        if ((r.raw_price || 0) < 75000 || /^0\s+/i.test(r.address || '') || /non-mls/i.test(r.name || '') || r.clean_phone === '0000000000') continue;
        const dealAgeDays = (liveNowMs() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
        if (r.closed || r.close_date || isNaN(dealAgeDays) || dealAgeDays < 0 || dealAgeDays > 2.0) continue;

        const cleanPhone = String(r.clean_phone || r.raw_phone || r.phone || '').replace(/\D/g, '').slice(-10);
        const normName = String(r.name || '').trim().toLowerCase();
        const normEmail = String(r.email || '').trim().toLowerCase();
        if (cleanPhone.length !== 10 || cleanPhone === '6788780215' || cleanPhone === '6784802110') continue;
        if (
          smsContactedPhones.has(cleanPhone) ||
          (normName && contactedNames.has(normName)) ||
          (normEmail && contactedEmails.has(normEmail))
        ) {
          continue;
        }
        if (r.email && isSuppressed(r.email, r.name, r.brokerage)) continue;
        if (/ansley|chapman group/i.test(r.brokerage || '') || /amy fuchs|joe chapman/i.test(r.name || '')) continue;

        const smsMessage = r.text_body || `Hi ${r.first || 'there'}, Christopher Boykin with Foresight Home Inspections here! Saw ${r.address} in ${r.city} just went under contract—congratulations! If your buyers need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report, we have a slot open in ${r.city}: https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(r.address || '')} — (678) 480-2110`;

        const smsOut = await sendOpenSmsWithDhcpFallback({
          phone: cleanPhone,
          text: smsMessage,
          configuredUrl: activeSmsUrl,
          apiKey: openSmsKey,
          configFilePath: OPENSMS_CONFIG_FILE
        });

        if (smsOut.ok) {
          activeSmsUrl = smsOut.endpoint || activeSmsUrl;
          if (smsOut.rediscovered) console.log(`  🔄 [OpenSMS] Auto-updated DHCP LAN IP -> ${activeSmsUrl}`);
          const smsData = smsOut.data || {};
          const isLocalDasLearning = activeSmsUrl.includes(':9292') || activeSmsUrl.endsWith('/sms/');
          smsContactedPhones.add(cleanPhone);
          if (normName) contactedNames.add(normName);
          if (normEmail) contactedEmails.add(normEmail);
          openSmsLog.push({
            id: smsData.id || `sms_${liveNowMs()}`,
            leadId: r.id,
            to: `+1${cleanPhone}`,
            targetName: r.name,
            address: r.address,
            city: r.city,
            role: r.role || 'LIST_AGENT',
            gateway: isLocalDasLearning ? 'DasLearning-Local-9292' : 'OpenSMS-Cloud',
            status: smsData.stat === true ? 'sent' : (smsData.status || 'pending'),
            timestamp: liveIso()
          });
          fs.writeFileSync(OPENSMS_LOG_FILE, JSON.stringify(openSmsLog, null, 2), 'utf8');
          sentOpenSmsCount++;
          console.log(`  📱 [OpenSMS] Dispatched SMS to ${r.name} (+1${cleanPhone}) for ${r.address}`);
          await sleep(25000);
        } else {
          console.warn(`  ⚠️ [OpenSMS] Gateway unreachable (${smsOut.error || `HTTP ${smsOut.status || 0}`}); deferring SMS until phone reconnects to LAN.`);
          break;
        }

        if (sentOpenSmsCount >= 8) break;
      }
    } else {
      console.log('  ℹ️ [OpenSMS Engine] OpenSMS phone server (:9292) was not detected on local Wi-Fi. (Ensure your Android phone is connected to home Wi-Fi with OpenSMS "Start Server" active, or use VIP Dispatch on your phone).');
    }
  }

  // -----------------------------------------------------------
  // PRIORITY #2 (TASK B): Dispatch to Mortgage Loan Officers
  // -----------------------------------------------------------
  let totalLoanOfficers = 0;
  if (fs.existsSync(LOAN_OFFICERS_FILE)) {
    const loanOfficers = JSON.parse(fs.readFileSync(LOAN_OFFICERS_FILE, 'utf8'));
    totalLoanOfficers = loanOfficers.length;
    console.log(`🏦 [Due Diligence Engine] Priority #2: Loaded ${loanOfficers.length} Mortgage Loan Officers.`);

    if (canSendEmail && transporter && !isHolidayBlackout) {
      for (const lo of loanOfficers) {
        if (quotaCeilingHit) break;
        const normEmail = String(lo.email || '').trim().toLowerCase();
        const normName = String(lo.name || '').trim().toLowerCase();
        const key = `LO_${lo.id}_${lo.email}`;
        if (contactedKeys.has(key) || (normEmail && recentlyContactedEmails14d.has(normEmail))) continue;
        if (isSuppressed(lo.email, lo.name, lo.company)) continue;

        console.log(`📤 [Due Diligence Engine] Dispatching Lender Dossier to ${lo.name} (${lo.company}) <${lo.email}>...`);
        const { subject, html } = buildLoanOfficerEmail(lo);

        try {
          await transporter.sendMail({
            from: `"Christopher Boykin, CMI - Foresight Home Inspections" <${user}>`,
            to: lo.email,
            subject,
            html
          });

          contactedKeys.add(key);
          if (normEmail) contactedEmails.add(normEmail);
          consumeBudget(normEmail);
          if (normName) contactedNames.add(normName);
          outreachLog.push({
            key, type: 'LOAN_OFFICER', targetName: lo.name, company: lo.company,
            email: lo.email, city: lo.city, timestamp: liveIso()
          });
          fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

          sentLendersCount++;
          console.log(`  ✓ Transmitted successfully to ${lo.name}`);
          await sleep(18500);
        } catch (e) {
          console.error(`  ❌ Failed to send to ${lo.email}:`, e.message);
          if (handleSmtpError(e, lo.email)) break;
        }

        if (sentLendersCount >= 3) break;
      }
    } else {
      console.log('  ℹ️ Email dispatch inactive; loan officer directory is verified and current.');
    }
  }

  // 3. Save Updated Outreach Log (after Priority #3 B2B Referral Partners)
  if (fs.existsSync(B2B_PARTNERS_FILE)) {
    const b2bPartners = JSON.parse(fs.readFileSync(B2B_PARTNERS_FILE, 'utf8')).filter((p) => p.email && p.category !== 'podcast_media');
    console.log(`🤝 [Due Diligence Engine] Priority #3: Loaded ${b2bPartners.length} Verified B2B Referral Partners (Closing/Probate Attorneys & Insurance Agencies).`);
    if (canSendEmail && transporter && !quotaCeilingHit && !isHolidayBlackout) {
      for (const p of b2bPartners) {
        if (quotaCeilingHit) break;
        const normEmail = String(p.email || '').trim().toLowerCase();
        const normName = String(p.name || '').trim().toLowerCase();
        const key = `B2B_${p.id}_${normEmail}`;
        if (contactedKeys.has(key) || recentlyContactedEmails14d.has(normEmail) || isSuppressed(p.email, p.name, p.company)) continue;
        let subject = `4-Point, Roof Drone & Moisture Verification for ${p.company} Policyholders`;
        let pitchLine = `When ${p.company} clients in ${p.city || 'Metro Atlanta'} need independent roof/4K drone condition documentation, polybutylene or electrical panel safety checks, or full residential inspections (Homes From $345 / Condos From $295; specialty evaluations Call for Quote), our Two Certified Master Inspectors deliver same-day reports backed by $35,000 in client protection.`;
        let partnerCta = '';
        if (p.category === 'attorney_closing_probate' || p.category === 'attorney_divorce_family') {
          subject = `Metro Atlanta Probate, Estate & Closing Condition Inspections (2-Inspector CMI Team)`;
          pitchLine = `Whether ${p.company} is handling a Georgia probate estate valuation, marital property division, pre-closing repair dispute, or unincorporated DeKalb County Low-Flow Plumbing Certificate (Call for Quote), our Two Certified Master Inspectors evaluate every property in parallel (Residential Homes From $345 / Condos From $295) with same-day photo-documented reports.`;
        } else if (p.category === 'property_management_sfr') {
          subject = `Single-Family Acquisition, Annual Maintenance & 11-Month Warranty Inspections for ${p.company}`;
          pitchLine = `When ${p.company} or your out-of-state investor landlords need fast acquisition due-diligence inspections, 11-month builder warranty punch-lists, or calibrated infrared thermal moisture & sewer diagnostics across Metro Atlanta, our Two Certified Master Inspectors inspect in parallel (Homes From $345 / Condos From $295) with same-day interactive digital reports.`;
        } else if (p.category === 'relocation_corporate_mobility' || p.category === 'senior_move_manager_nasmm') {
          subject = `2-Inspector Corporate Relocation & Pre-Listing Evaluations for ${p.company}`;
          pitchLine = `Whether ${p.company} is coordinating an executive corporate relocation buyout or preparing a longtime Metro Atlanta home for downsizing and listing, our Two Certified Master Inspectors deliver same-day, zero-fatigue evaluations (Residential Homes From $345 / Condos From $295; Phase 1 Pre-Drywall From $275) with 4K aerial roof drone and calibrated infrared thermal scanning included.`;
        } else if (p.category === 'specialty_engineer_contractor') {
          subject = `Independent CMI Structural, Moisture & Pre-Drywall Diagnostics for ${p.company} (CMI #MICB-1082)`;
          pitchLine = `Because our Two Certified Master Inspectors perform 100% objective full-home, pre-drywall (From $275), and 11-month warranty inspections across Metro Atlanta (Homes From $345) and never sell competing repair work, our independent diagnostic reports give ${p.company} clients clear, unbiased baseline documentation with zero conflict of interest.`;
        } else if (p.category === 'public_adjuster_gapia') {
          subject = `Independent CMI Thermal, Moisture & 4K Roof Drone Documentation for ${p.company}`;
          pitchLine = `When ${p.company} represents Metro Atlanta policyholders on storm, roof, or water-intrusion claims, our Two Certified Master Inspectors provide 100% independent third-party property condition evaluations, calibrated infrared thermal moisture mapping, and 4K aerial roof drone documentation (Residential Homes From $345 / Condos From $295; specialty evaluations Call for Quote) with zero conflict of interest in repair work.`;
        } else if (p.category === 'qi_1031_exchange') {
          subject = `45-Day 1031 Exchange Replacement Property Inspections for ${p.company} Clients`;
          pitchLine = `Because ${p.company} investors operate under a strict 45-day IRS identification window, our Two Certified Master Inspectors evaluate Metro Atlanta replacement properties in parallel (Residential Homes From $345 / Condos From $295) and deliver same-day CapEx-focused reports so your exchangers can lock in their selections with confidence.`;
        } else if (p.category === 'attorney_elder_law_fiduciary') {
          subject = `Fiduciary & Elder-Care Property Condition Assessments for ${p.company}`;
          pitchLine = `When ${p.company} advises Metro Atlanta families on Medicaid trusts, conservatorships, or estate administration, our Two Certified Master Inspectors deliver objective, photo-documented Property Condition & Safety Assessments (Residential Homes From $345 / Condos From $295) so fiduciaries know whether to sell as-is, renovate, or rent the residence.`;
        } else if (p.category === 'realtor_youtube_relocation') {
          subject = `Sight-Unseen Out-of-State Buyer Inspections for ${p.company} (2-Inspector CMI Team)`;
          pitchLine = `Because out-of-state buyers finding ${p.company} on YouTube often purchase sight-unseen, our Two Certified Master Inspectors inspect every home in parallel (Residential Homes From $345 / Condos From $295; Pre-Drywall From $275) with calibrated infrared thermal imaging, 4K roof drone photos, and a calm phone walkthrough that keeps remote buyers confident.`;
        } else if (p.category === 'hoa_remodeler_architect') {
          subject = `Townhome 11-Month Warranty Days & Pre-Renovation Baselines for ${p.company}`;
          pitchLine = `Whether ${p.company} is coordinating neighborhood-wide 11-month builder warranty inspections for a townhome community or establishing a pre-renovation structural and thermal moisture baseline across Metro Atlanta, our Two Certified Master Inspectors deliver same-day engineering-grade reports (Homes From $345 / Condos From $295; Pre-Drywall From $275).`;
        } else if (p.category === 'transaction_coordinator') {
          subject = `24-Hr Georgia Due Diligence SLA + SUPRA eKEY for ${p.company} Closings`;
          pitchLine = `Under tight Metro Atlanta GAR Due Diligence periods, ${p.company} cannot afford scheduling delays or multi-day report bottlenecks. Our Two Certified Master Inspectors deploy in parallel with active SUPRA eKEY access, delivering same-day interactive reports plus a Digital Repair Request Builder (Single-Family From $345, Condos/Townhomes From $295, Pre-Drywall From $275, New Construction From $400; specialty add-ons Call (678) 480-2110 for Quote) backed by $35,000 combined protection ($10,000 Elite Master Warranty $0 deductible + $25,000 InterNACHI Honor Guarantee).`;
          partnerCta = `<p style="font-size:15px;line-height:1.6;color:#1e293b;">View our <a href="https://www.fhinspectionsatl.com/dossiers/tc-partner-dossier.html" style="color:#0f52ba;font-weight:700;">TC &amp; Buyer Team Partner Dossier</a> (with a copy-paste Day-1 Buyer Onboarding Snippet) or share our <a href="https://www.fhinspectionsatl.com/list-of-3" style="color:#0f52ba;font-weight:700;">Recommended List of 3</a> directly with your contract-to-close agents.</p>`;
        } else if (p.category === 'buyer_lead_team') {
          subject = `2-Inspector CMI Team + Day-1 SUPRA Access for ${p.company} Buyers`;
          pitchLine = `When ${p.company} moves buyers from binding agreement through Georgia Due Diligence, our Two Certified Master Inspectors evaluate structural and mechanical systems in parallel—eliminating solo-inspector fatigue—with active SUPRA eKEY access and same-day Digital Repair Request Builder reports (Single-Family From $345, Condos/Townhomes From $295, Pre-Drywall From $275, New Construction From $400; specialty services Call (678) 480-2110 for Quote) backed by $35,000 combined protection.`;
          partnerCta = `<p style="font-size:15px;line-height:1.6;color:#1e293b;">See the <a href="https://www.fhinspectionsatl.com/dossiers/tc-partner-dossier.html" style="color:#0f52ba;font-weight:700;">TC &amp; Buyer Team Partner Dossier</a> (includes -$25 Verified Licensed GA Realtor courtesy terms with Active GREC License # and Day-1 buyer onboarding copy) or keep our card ready via <a href="https://www.fhinspectionsatl.com/list-of-3" style="color:#0f52ba;font-weight:700;">fhinspectionsatl.com/list-of-3</a>.</p>`;
        }
        const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:600px;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">${TRI_LOGO_HEADER}<div style="padding:24px;"><p style="font-size:15px;line-height:1.6;color:#1e293b;">Hi <strong>${p.first || 'there'}</strong>,</p><p style="font-size:15px;line-height:1.6;color:#1e293b;">${pitchLine}</p>${partnerCta}<p style="font-size:15px;line-height:1.6;color:#1e293b;">If your office ever needs priority 24-hour scheduling across Metro Atlanta, feel free to share our direct desk at <strong>(678) 480-2110</strong> or <a href="https://www.fhinspectionsatl.com" style="color:#0f52ba;font-weight:600;">www.fhinspectionsatl.com</a>.</p><p style="font-size:14px;color:#0f172a;margin-top:16px;"><strong>Christopher Boykin, CMI</strong><br>Founder &amp; Lead Inspector &bull; Foresight Home Inspections<br><span style="font-size:11px;color:#64748b;">Lithonia, GA 30058 &bull; Serving Metro Atlanta &bull; Reply stop anytime to opt out.</span></p></div></div>`;
        try {
          await transporter.sendMail({ from: `"Christopher Boykin, CMI - Foresight Home Inspections" <${user}>`, to: p.email, subject, html });
          contactedKeys.add(key); contactedEmails.add(normEmail); consumeBudget(normEmail); if (normName) contactedNames.add(normName);
          outreachLog.push({ key, type: 'B2B_PARTNER', category: p.category, targetName: p.name, company: p.company, email: p.email, city: p.city, timestamp: liveIso() });
          fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
          sentB2bPartnersCount++;
          await sleep(18500);
        } catch (e) {
          if (handleSmtpError(e, p.email)) break;
        }
        if (sentB2bPartnersCount >= 4) break;
      }
    }
  }

  // -----------------------------------------------------------
  // PRIORITY #4: Live FMLS Price-Drop / Seller-Defense Realtors
  // -----------------------------------------------------------
  const PRICE_DROP_FILE = path.join(ROOT_DIR, 'data', 'fmls-price-drop-leads.json');
  let sentPriceDropCount = 0;
  if (fs.existsSync(PRICE_DROP_FILE) && canSendEmail && transporter && !quotaCeilingHit && !isHolidayBlackout) {
    const priceDrops = JSON.parse(fs.readFileSync(PRICE_DROP_FILE, 'utf8'));
    console.log(`📉 [Due Diligence Engine] Priority #4: Loaded ${priceDrops.length} Live FMLS Price-Drop / Seller-Defense Leads.`);
    for (const pd of priceDrops) {
      if (quotaCeilingHit) break;
      const normEmail = String(pd.email || '').trim().toLowerCase();
      const normName = String(pd.name || '').trim().toLowerCase();
      const key = `PRICEDROP_${pd.id}_${normEmail}`;
      if (!normEmail || contactedKeys.has(key) || recentlyContactedEmails14d.has(normEmail) || isSuppressed(pd.email, pd.name, pd.brokerage)) continue;
      const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:600px;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">${TRI_LOGO_HEADER}<div style="padding:24px;"><p style="font-size:15px;line-height:1.6;color:#1e293b;">${pd.pitch_body}</p><p style="font-size:14px;color:#0f172a;margin-top:16px;"><strong>Christopher Boykin, CMI</strong><br>Founder &amp; Lead Inspector &bull; Foresight Home Inspections<br><span style="font-size:11px;color:#64748b;">Lithonia, GA 30058 &bull; Serving Metro Atlanta &bull; Reply stop anytime to opt out.</span></p></div></div>`;
      try {
        await transporter.sendMail({ from: `"Christopher Boykin, CMI - Foresight Home Inspections" <${user}>`, to: pd.email, subject: pd.subject, text: pd.pitch_body, html });
        contactedKeys.add(key); contactedEmails.add(normEmail); consumeBudget(normEmail); if (normName) contactedNames.add(normName);
        outreachLog.push({ key, type: 'FMLS_PRICE_DROP', targetName: pd.name, brokerage: pd.brokerage, address: pd.address, city: pd.city, email: pd.email, timestamp: liveIso() });
        fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
        sentPriceDropCount++;
        await sleep(18500);
      } catch (e) {
        if (handleSmtpError(e, pd.email)) break;
      }
      if (sentPriceDropCount >= 6) break;
    }
  }

  // -----------------------------------------------------------
  // PRIORITY #5: Live FMLS Micro-Triggers (Back On Market, 1031 Exchange, Pre-1972 Sewer, Tenant/Multifamily)
  // -----------------------------------------------------------
  const MICRO_TRIGGER_FILE = path.join(ROOT_DIR, 'data', 'fmls-micro-trigger-leads.json');
  let sentMicroTriggerCount = 0;
  if (fs.existsSync(MICRO_TRIGGER_FILE) && canSendEmail && transporter && !quotaCeilingHit && !isHolidayBlackout) {
    const microLeads = JSON.parse(fs.readFileSync(MICRO_TRIGGER_FILE, 'utf8'));
    console.log(`🎯 [Due Diligence Engine] Priority #5: Loaded ${microLeads.length} Live FMLS Micro-Trigger Leads (Back On Market, 1031, Vintage Sewer, Multifamily).`);
    for (const ml of microLeads) {
      if (quotaCeilingHit) break;
      const normEmail = String(ml.email || '').trim().toLowerCase();
      const normName = String(ml.name || '').trim().toLowerCase();
      const key = `MICRO_${ml.id}_${normEmail}`;
      if (!normEmail || contactedKeys.has(key) || recentlyContactedEmails14d.has(normEmail) || isSuppressed(ml.email, ml.name, ml.brokerage)) continue;
      const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:600px;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">${TRI_LOGO_HEADER}<div style="padding:24px;"><p style="font-size:15px;line-height:1.6;color:#1e293b;">${ml.pitch_body}</p><p style="font-size:14px;color:#0f172a;margin-top:16px;"><strong>Christopher Boykin, CMI</strong><br>Founder &amp; Lead Inspector &bull; Foresight Home Inspections<br><span style="font-size:11px;color:#64748b;">Lithonia, GA 30058 &bull; Serving Metro Atlanta &bull; Reply stop anytime to opt out.</span></p></div></div>`;
      try {
        await transporter.sendMail({ from: `"Christopher Boykin, CMI - Foresight Home Inspections" <${user}>`, to: ml.email, subject: ml.subject, text: ml.pitch_body, html });
        contactedKeys.add(key); contactedEmails.add(normEmail); consumeBudget(normEmail); if (normName) contactedNames.add(normName);
        outreachLog.push({ key, type: `FMLS_${ml.trigger_type}`, targetName: ml.name, brokerage: ml.brokerage, address: ml.address, city: ml.city, email: ml.email, timestamp: liveIso() });
        fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
        sentMicroTriggerCount++;
        await sleep(18500);
      } catch (e) {
        if (handleSmtpError(e, ml.email)) break;
      }
      if (sentMicroTriggerCount >= 6) break;
    }
  }

  // -----------------------------------------------------------
  // PRIORITY #6: 11-Month Builder Warranty Buyer-Agent Client-for-Life Drip ($0.00)
  // -----------------------------------------------------------
  const WARRANTY_11M_FILE = path.join(ROOT_DIR, 'data', 'eleven-month-deed-leads.json');
  let sentWarranty11mCount = 0;
  if (fs.existsSync(WARRANTY_11M_FILE) && canSendEmail && transporter && !quotaCeilingHit && !isHolidayBlackout) {
    const warrantyLeads = JSON.parse(fs.readFileSync(WARRANTY_11M_FILE, 'utf8')).filter(
      (w) => w && w.cohort === 'URGENT_10_TO_12_MONTHS' && w.buyerAgentEmail && w.dns_mx_ok === true
    );
    console.log(`🏡 [Due Diligence Engine] Priority #6: Loaded ${warrantyLeads.length} Urgent 10-12 Month New-Construction Buyer-Agent Leads.`);
    for (const w of warrantyLeads) {
      if (quotaCeilingHit) break;
      const normEmail = String(w.buyerAgentEmail || '').trim().toLowerCase();
      const normName = String(w.buyerAgentName || '').trim().toLowerCase();
      const key = `WARRANTY11M_${w.id}_${normEmail}`;
      if (!normEmail || contactedKeys.has(key) || recentlyContactedEmails14d.has(normEmail) || isSuppressed(w.buyerAgentEmail, w.buyerAgentName, w.buyerOfficeName)) continue;
      const quoteUrl = `https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(w.address || '')}&service=11-month-warranty`;
      const subject = `11-Month Builder Warranty Cutoff for Your Buyers at ${w.address} (${w.city})`;
      const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:600px;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">${TRI_LOGO_HEADER}<div style="padding:24px;"><p style="font-size:15px;line-height:1.6;color:#1e293b;">Hi <strong>${w.buyerAgentFirst || 'there'}</strong>,</p><p style="font-size:15px;line-height:1.6;color:#1e293b;">Your buyers at <strong>${w.address}</strong> in ${w.city} (closed ${w.closeDate}) are approaching their 1-year builder warranty cutoff (${w.warrantyExpirationDate}). Reaching out with an <strong>11-Month Builder Warranty Inspection (From $345)</strong> is a $0 client-for-life touchpoint before builder structural, flashing, attic duct, and cold-weather thermal insulation coverage expires.</p><p style="font-size:15px;line-height:1.6;color:#1e293b;">Our Two Certified Master Inspectors evaluate structural and mechanical systems in parallel with calibrated infrared thermal imaging, 4K aerial roof drone scans, and same-day photo-documented punch-lists (11-Month Warranty From $345, Phase 1 Pre-Drywall From $275, Final New Construction From $400; specialty services Call (678) 480-2110 for Quote) backed by $35,000 combined zero-deductible protection ($10,000 $0-deductible Elite Master Warranty + $25,000 InterNACHI Honor Guarantee). A -$25 courtesy discount applies strictly for Verified Licensed Georgia Realtors (Active GREC License # required).</p><p style="font-size:15px;line-height:1.6;color:#1e293b;"><a href="${quoteUrl}" style="display:inline-block;background:#0f172a;color:#d4af37;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:8px;">Book 11-Month Warranty Inspection</a> &nbsp; or call <strong>(678) 480-2110</strong> (Mon&ndash;Sat; Sunday By Appointment Only).</p><p style="font-size:14px;color:#0f172a;margin-top:16px;"><strong>Christopher Boykin, CMI</strong><br>Founder &amp; Lead Inspector &bull; Foresight Home Inspections<br><span style="font-size:11px;color:#64748b;">Lithonia, GA 30058 &bull; Serving Metro Atlanta &bull; RESPA Section 8 (12 U.S.C. 2607): Zero referral fees or kickbacks; homebuyers are free to choose any qualified inspector. Reply stop anytime to opt out.</span></p></div></div>`;
      try {
        await transporter.sendMail({ from: `"Christopher Boykin, CMI - Foresight Home Inspections" <${user}>`, to: w.buyerAgentEmail, subject, html });
        contactedKeys.add(key); contactedEmails.add(normEmail); consumeBudget(normEmail); if (normName) contactedNames.add(normName);
        outreachLog.push({ key, type: 'WARRANTY_11M_DRIP', targetName: w.buyerAgentName, brokerage: w.buyerOfficeName, address: w.address, city: w.city, email: w.buyerAgentEmail, timestamp: liveIso() });
        fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
        sentWarranty11mCount++;
        await sleep(18500);
      } catch (e) {
        if (handleSmtpError(e, w.buyerAgentEmail)) break;
      }
      if (sentWarranty11mCount >= Number(process.env.WARRANTY11M_BATCH_LIMIT || 18)) break;
    }
  }

  fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
  console.log(`💾 [Due Diligence Engine] Updated outreach log (${outreachLog.length} total historical communications).`);

  try {
    execSync('node scripts/generate-due-diligence-dispatch.mjs', { cwd: ROOT_DIR, stdio: 'ignore' });
    execSync('git add public/vip-dispatch.html data/under-contract-realtors.json data/archive-under-contract-realtors.json data/due-diligence-outreach-log.json', { cwd: ROOT_DIR, stdio: 'ignore' });
    const diffStatus = execSync('git diff --cached --name-only', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    if (diffStatus) {
      const todayIso = netClock.ok ? netClock.easternDateStr : liveIso().slice(0, 10);
      execSync(`git commit -m "chore(dispatch): auto-sync ${todayIso} FMLS due diligence harvest & vip-dispatch.html"`, { cwd: ROOT_DIR, stdio: 'ignore' });
      execSync('git pull --ff-only origin main', { cwd: ROOT_DIR, stdio: 'ignore' });
      execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'ignore' });
      console.log('🚀 [Due Diligence Engine] Auto-deployed refreshed public/vip-dispatch.html to origin/main.');
    }
  } catch (gitErr) {
    console.warn('⚠️ [Due Diligence Engine] Git auto-deploy warning:', gitErr.message);
  }

  const totalEmailsSentThisRun = sentUnderContractCount + sentWarranty11mCount + sentPriceDropCount + sentMicroTriggerCount + sentB2bPartnersCount + sentLendersCount;
  if (totalEmailsSentThisRun > 0 || sentOpenSmsCount > 0) {
    const pushTitle = `Due Diligence & 11-Mo Warranty: ${totalEmailsSentThisRun} Emails, ${sentOpenSmsCount} SMS`;
    const pushMsg = `High-Intent Dispatch Complete:\n- Active Under-Contract: ${sentUnderContractCount}\n- 11-Mo Builder Warranty: ${sentWarranty11mCount}\n- Price-Drop & Micro-Triggers: ${sentPriceDropCount + sentMicroTriggerCount}\n- B2B & Lenders: ${sentB2bPartnersCount + sentLendersCount}\n- OpenSMS: ${sentOpenSmsCount}\nTotal Historical: ${outreachLog.length}`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  }

  if (transporter) transporter.close();
  releaseLock();
  console.log('🏁 [Due Diligence Engine] Execution complete!');
  console.log(`Summary: ${newPendingHarvested} New Pending, ${sentUnderContractCount} Under-Contract, ${sentWarranty11mCount} 11-Mo Warranty, ${sentPriceDropCount} Price-Drop, ${sentMicroTriggerCount} Micro-Trigger, ${sentB2bPartnersCount} B2B, ${sentLendersCount} Lenders, ${sentOpenSmsCount} OpenSMS.`);
}

main().catch(async (err) => {
  releaseLock();
  console.error('⚠️ [Due Diligence Engine] Engine completed with warning:', err.message);
  process.exit(0);
});

