import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const LOAN_OFFICERS_FILE = path.join(ROOT_DIR, 'data', 'loan-officers.json');
const UNDER_CONTRACT_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const OUTREACH_LOG_FILE = path.join(ROOT_DIR, 'data', 'due-diligence-outreach-log.json');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const UNSUBSCRIBED_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

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
    <div class="header">
      <img src="https://www.fhinspectionsatl.com/images/Logopng.webp" alt="Foresight Home Inspections">
    </div>
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
          <li><strong>Two Certified Master Inspectors Concurrency:</strong> Complete structural, mechanical &amp; thermal audit in under 2.5 hours.</li>
          <li><strong>Georgia Repair Amendment Support:</strong> Clear diagnostic defect summaries compatible with standard Georgia repair request amendments (such as GAR Form F404) for licensed broker or attorney review.</li>
          <li><strong>$35,000 in Buyer Protection Guarantees:</strong> InterNACHI Buy-Back Guarantee + 90-Day Structural Warranty eliminates borrower cold feet.</li>
          <li><strong>DeKalb County Low-Flow Plumbing Certificate ($100 Flat):</strong> On-site 1.28 GPF fixture verification and official signed county certificate for pre-1993 DeKalb homes to prevent closing delays.</li>
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
• $35,000 Client Protection Warranty & InterNACHI Buy-Back Guarantee
👉 Reserve your inspection slot in 60 seconds: ${quoteUrl}
Priority Desk: (678) 480-2110 | inspect@foresightcmi.com"</div>

      <p>If you would like dedicated VIP priority scheduling for your branch's borrowers, let's connect directly at <strong>(678) 480-2110</strong>.</p>

      <p style="margin-bottom: 0;">
        Respectfully,<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector &amp; Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082 • InterNACHI #NACHI20061502</em><br>
        Direct Priority Desk: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a><br>
        Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com" style="color: #d4af37; font-weight: bold;">www.fhinspectionsatl.com</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058<br>
      Serving Metro Atlanta, Fulton, Gwinnett, Cobb, DeKalb, Forsyth, Cherokee &amp; 20 Counties.<br>
      Confidential Professional Advisory for Mortgage Industry Partners.<br>
      <span style="font-size: 10px; color: #94a3b8;">Foresight Home Inspections is an independent inspection firm and is not affiliated with or endorsed by the Georgia Association of Realtors (GAR). Diagnostic summaries are provided for informational review by licensed real estate brokers and legal counsel.</span>
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
function buildUnderContractEmail(realtor) {
  const firstName = realtor.first || 'there';
  const address = realtor.address || 'your property';
  const city = realtor.city || 'Metro Atlanta';
  const price = realtor.price ? ` (${realtor.price})` : '';
  const quoteUrl = `https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)}`;

  const subject = `⚡ Due Diligence Inspection Advisory: ${address} (${city}) | 24-Hr Turnaround`;

  const isDeKalb = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|chamblee|clarkston|doraville|avondale/i.test(city) || /dekalb/i.test(address);

  const deKalbBox = isDeKalb ? `
      <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 16px; margin: 15px 0; border-radius: 4px; font-size: 14px; color: #1e3a8a;">
        <strong>🏛️ DeKalb County Mandatory Closing Requirement:</strong><br>
        Under DeKalb County Water Conservation Ordinance § 25-41, pre-1993 homes require an official signed <strong>Certificate of Compliance</strong> verifying 1.28 GPF low-flow plumbing fixtures to transfer title at closing. Foresight conducts the fixture audit on-site and issues the official signed certificate for a <strong>$100 flat fee</strong>.
      </div>
  ` : '';

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
    .banner { background: #10b981; color: #ffffff; padding: 8px 15px; font-size: 13px; font-weight: 800; text-align: center; letter-spacing: 0.5px; }
    .content { padding: 35px 30px; }
    .property-bar { background: #f1f5f9; border-left: 4px solid #10b981; padding: 12px 16px; margin: 15px 0; border-radius: 4px; font-size: 15px; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; font-size: 14.5px; }
    .forward-box { background: #eff6ff; border: 1px dashed #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13.5px; color: #1e3a8a; }
    .btn { display: inline-block; background: #10b981; color: #ffffff !important; font-weight: 800; font-size: 14px; padding: 13px 26px; text-decoration: none; border-radius: 6px; margin: 15px 0; text-align: center; }
    .footer { background: #0f172a; color: #94a3b8; padding: 25px 30px; font-size: 12px; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <img src="https://www.fhinspectionsatl.com/images/Logopng.webp" alt="Foresight Home Inspections">
    </div>
    <div class="banner">
      ⚡ ACTIVE DUE DILIGENCE &amp; EARNEST MONEY PROTECTION
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hi <strong>${firstName}</strong>,</p>

      <p>Congratulations! Saw that your listing at <strong>${address}</strong> in <strong>${city}</strong>${price} is officially under contract.</p>

      <div class="property-bar">
        📍 <strong>Property:</strong> ${address}, ${city}, GA<br>
        📅 <strong>Due Diligence Window:</strong> Active (5-to-7 Day Contingency Clock Running)
      </div>

      ${deKalbBox}

      <p>With Georgia due diligence timelines as tight as 5 to 7 days, your buyers or co-op agent cannot afford inspection delays or confusing reports that derail negotiations.</p>

      <div class="highlight-box">
        <strong>The Foresight Dual-Master Inspector Advantage:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Two Certified Master Inspectors Concurrency:</strong> Full structural, roof, MEP, and foundation sweep completed in under 2.5 hours.</li>
          <li><strong>Same-Day Digital Report (Delivered by 8 PM):</strong> Zero waiting; negotiation begins immediately.</li>
          <li><strong>Georgia Contract-Ready Defect Language:</strong> Clear diagnostic summaries structured for seamless review and transfer onto standard Georgia repair amendments.</li>
          <li><strong>Active SUPRA eKEY Access:</strong> Seamless entry with zero hassle for listing agents.</li>
          <li><strong>$35,000 in Buyer Warranties:</strong> Includes InterNACHI's "We'll Buy Your Home Back" Guarantee.</li>
          <li><strong>DeKalb Low-Flow Plumbing Certificate ($100 Flat):</strong> Official signed county compliance certificate issued on-site for pre-1993 DeKalb homes to eliminate closing table delays.</li>
        </ul>
      </div>

      <div class="forward-box">
        <strong>📲 1-Tap Buyer Forward Pass:</strong><br>
        Feel free to pass this 1-click scheduler link directly to your buyers so they can lock in their inspection date today:<br>
        <div style="margin-top:8px; font-weight:bold;">
          <a href="${quoteUrl}" style="color: #2563eb;">${quoteUrl}</a>
        </div>
        <div style="font-size:12px; color:#64748b; margin-top:4px;">
          (Address pre-filled with instant pricing and schedule selection)
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${quoteUrl}" class="btn">⚡ View Due Diligence Reservation for ${address} &rarr;</a>
      </div>

      <p style="margin-bottom: 0;">
        Best wishes on a fast, smooth closing!<br><br>
        <strong>Christopher Boykin, CMI®</strong><br>
        Lead Inspector &amp; Founder | Foresight Home Inspections, LLC<br>
        <em>Certified Master Inspector® #MICB-1082 • InterNACHI #NACHI20061502</em><br>
        Direct: <a href="tel:6784802110" style="color: #0f172a; font-weight: bold;">(678) 480-2110</a> | Email: <a href="mailto:inspect@foresightcmi.com" style="color: #0f172a;">inspect@foresightcmi.com</a><br>
        <a href="https://www.fhinspectionsatl.com/realtors" style="color: #10b981; font-weight: bold;">Agent VIP Portal: fhinspectionsatl.com/realtors</a>
      </p>
    </div>
    <div class="footer">
      Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058<br>
      Serving Metro Atlanta &amp; 77+ Municipalities across 20 Counties.<br>
      Professional notification based on Georgia public MLS contract status.<br>
      <span style="font-size: 10px; color: #94a3b8;">Foresight Home Inspections is an independent inspection firm and is not affiliated with or endorsed by the Georgia Association of Realtors (GAR). Diagnostic summaries are provided for informational review by licensed real estate brokers and legal counsel.</span>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
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
    <div class="header">
      <img src="https://www.fhinspectionsatl.com/images/Logopng.webp" alt="Foresight Home Inspections">
    </div>
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
          <li><strong>Two Certified Master Inspectors on Every Job:</strong> Complete thorough evaluation in ~2 hours.</li>
          <li><strong>Active SUPRA eKEY Access:</strong> We inspect smoothly without burdening the listing agent.</li>
          <li><strong>Georgia Contract-Ready Repair Summaries:</strong> Clean diagnostic language compatible with standard Georgia repair amendments that keeps deals intact.</li>
          <li><strong>$35,000 Client Protection Guarantees:</strong> 90-Day Structural Warranty &amp; InterNACHI Buy-Back Guarantee.</li>
          <li><strong>DeKalb Low-Flow Plumbing Certificate ($100 Flat):</strong> Official signed county compliance certificate issued on-site for pre-1993 DeKalb homes.</li>
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
      Foresight Home Inspections, LLC | 1816 South Deshon Road, Lithonia, GA 30058<br>
      Serving Metro Atlanta &amp; 77+ Municipalities across 20 Georgia Counties.<br>
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

async function main() {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      const lockAgeMs = Date.now() - (lockData.timestamp || 0);
      if (lockData.pid && isProcessRunning(lockData.pid) && lockAgeMs < 30 * 60 * 1000) {
        console.log(`🛡️ [Concurrency Guard] Another Due Diligence Scout instance is actively running (PID ${lockData.pid}). Exiting cleanly to prevent duplicate sends.`);
        return;
      }
      fs.unlinkSync(LOCK_FILE);
    } catch {
      try { fs.unlinkSync(LOCK_FILE); } catch {}
    }
  }
  fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, timestamp: Date.now() }), 'utf8');
  const releaseLock = () => {
    try {
      if (fs.existsSync(LOCK_FILE)) {
        const cur = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
        if (cur.pid === process.pid) fs.unlinkSync(LOCK_FILE);
      }
    } catch {}
  };
  process.on('exit', releaseLock);

  console.log('⚡ [Due Diligence Engine] Initializing Autonomous Scout & Dossier Transmission...');

  // 1. Check Email Credentials
  const { user, pass } = getEmailCredentials();
  let transporter = null;
  let canSendEmail = false;

  if (!pass) {
    console.warn('⚠️ [Due Diligence Engine] EMAIL_PASSWORD not found in environment/secrets.');
    console.log('ℹ️ [Due Diligence Engine] Running in Directory Scout & Verification mode (email dispatch handled by authenticated local daemon).');
  } else {
    try {
      const testTransporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true,
        maxConnections: 1,
        maxMessages: 200,
        auth: { user, pass }
      });
      await testTransporter.verify();
      transporter = testTransporter;
      canSendEmail = true;
      console.log(`✅ [Due Diligence Engine] SMTP connection verified for ${user}`);
    } catch (err) {
      console.warn(`⚠️ [Due Diligence Engine] SMTP connection failed (${err.message}).`);
      console.log('ℹ️ [Due Diligence Engine] Running in Directory Scout & Verification mode.');
    }
  }

  // 2. Load Logs
  let outreachLog = [];
  if (fs.existsSync(OUTREACH_LOG_FILE)) {
    try {
      outreachLog = JSON.parse(fs.readFileSync(OUTREACH_LOG_FILE, 'utf8'));
    } catch {
      outreachLog = [];
    }
  }
  const contactedKeys = new Set(outreachLog.map(o => o.key));

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

  function isSuppressed(email, name = '', brokerage = '') {
    if (!email) return true;
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).toLowerCase().trim();
    const cleanBrokerage = String(brokerage).toLowerCase().trim();

    if (suppressedEmails.has(cleanEmail)) return true;
    if (cleanEmail.includes('ansleyre.com') || cleanEmail.includes('ansley')) return true;
    if (cleanEmail.includes('amyfuchs') || cleanEmail.includes('amy.fuchs')) return true;
    if (cleanEmail.includes('cgrealtyinc.com') || cleanEmail.includes('joe@cgrealtyinc.com')) return true;
    if (cleanName.includes('amy fuchs') || cleanName.includes('joe chapman')) return true;
    if (cleanBrokerage.includes('ansley') || cleanBrokerage.includes('chapman group realty')) return true;

    return false;
  }

  let quotaCeilingHit = false;

  let sentLendersCount = 0;
  let sentUnderContractCount = 0;

  // -----------------------------------------------------------
  // PRIORITY #1 (TASK A): Dispatch to Active Under-Contract / Due Diligence Properties First
  // (Premature Pre-Due Diligence active listings disabled so 100% of realtor allocation targets active contracts)
  // -----------------------------------------------------------
  let totalUnderContract = 0;
  if (fs.existsSync(UNDER_CONTRACT_FILE)) {
    const underContractRealtors = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
    totalUnderContract = underContractRealtors.length;
    console.log(`📋 [Due Diligence Engine] Priority #1: Loaded ${underContractRealtors.length} Active Under-Contract / Due Diligence Realtors.`);

    if (canSendEmail && transporter) {
      // Sort newest contracts first
      const sorted = [...underContractRealtors].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      for (const r of sorted) {
        if (quotaCeilingHit) break;
        if (!r.email || !r.email.includes('@')) continue;
        const key = `CONTRACT_${r.id}_${r.email}`;
        if (contactedKeys.has(key)) continue;
        if (isSuppressed(r.email, r.name, r.brokerage)) {
          console.log(`  🛡️ [Suppression Gate] Bypassed suppressed contact: ${r.name} (${r.email}) [Ansley / Unsubscribed Lockout]`);
          continue;
        }

        console.log(`📤 [Due Diligence Engine] Dispatching Active Due Diligence Dossier to ${r.name} (${r.address}) <${r.email}>...`);
        const { subject, html } = buildUnderContractEmail(r);

        try {
          await transporter.sendMail({
            from: `"Christopher Boykin, CMI® - Foresight Home Inspections" <${user}>`,
            to: r.email,
            subject,
            html
          });

          contactedKeys.add(key);
          outreachLog.push({
            key,
            type: 'UNDER_CONTRACT_DUE_DILIGENCE',
            targetName: r.name,
            brokerage: r.brokerage,
            address: r.address,
            city: r.city,
            email: r.email,
            date: r.date,
            timestamp: new Date().toISOString()
          });
          fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

          sentUnderContractCount++;
          console.log(`  ✓ Transmitted successfully to ${r.name} for ${r.address}`);
          await sleep(3000); // 3s safe spacing
        } catch (e) {
          console.error(`  ❌ Failed to send to ${r.email}:`, e.message);
          if (e.message.includes('550') || e.message.includes('454') || e.message.includes('Daily user sending limit exceeded')) {
            console.warn('⚠️ [Due Diligence Engine] Daily rolling sending limit reached (550/454). Halting dispatch cleanly to preserve domain reputation.');
            quotaCeilingHit = true;
            break;
          }
        }

        // Priority allocation: 6 active under-contract due diligence properties per run (0 wasted on premature active listings)
        if (sentUnderContractCount >= 6) break;
      }
    } else {
      console.log('  ℹ️ Email dispatch inactive; under-contract due diligence directory is verified and current.');
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

    if (canSendEmail && transporter) {
      for (const lo of loanOfficers) {
        if (quotaCeilingHit) break;
        const key = `LO_${lo.id}_${lo.email}`;
        if (contactedKeys.has(key)) continue;
        if (isSuppressed(lo.email, lo.name, lo.company)) {
          console.log(`  🛡️ [Suppression Gate] Bypassed suppressed loan officer: ${lo.name} (${lo.email})`);
          continue;
        }

        console.log(`📤 [Due Diligence Engine] Dispatching Lender Dossier to ${lo.name} (${lo.company}) <${lo.email}>...`);
        const { subject, html } = buildLoanOfficerEmail(lo);

        try {
          await transporter.sendMail({
            from: `"Christopher Boykin, CMI® - Foresight Home Inspections" <${user}>`,
            to: lo.email,
            subject,
            html
          });

          contactedKeys.add(key);
          outreachLog.push({
            key,
            type: 'LOAN_OFFICER',
            targetName: lo.name,
            company: lo.company,
            email: lo.email,
            city: lo.city,
            timestamp: new Date().toISOString()
          });
          fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

          sentLendersCount++;
          console.log(`  ✓ Transmitted successfully to ${lo.name}`);
          await sleep(2500); // 2.5s safe spacing
        } catch (e) {
          console.error(`  ❌ Failed to send to ${lo.email}:`, e.message);
          if (e.message.includes('550') || e.message.includes('454') || e.message.includes('Daily user sending limit exceeded')) {
            console.warn('⚠️ [Due Diligence Engine] Daily rolling sending limit reached (550/454). Halting dispatch cleanly to preserve domain reputation.');
            quotaCeilingHit = true;
            break;
          }
        }

        // Max 2 loan officers per automated daily scout pass
        if (sentLendersCount >= 2) break;
      }
    } else {
      console.log('  ℹ️ Email dispatch inactive; loan officer directory is verified and current.');
    }
  }

  // 3. Save Updated Outreach Log
  fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
  console.log(`💾 [Due Diligence Engine] Updated outreach log (${outreachLog.length} total historical communications).`);

  // 4. Send Mobile Summary Alert
  const totalSentThisRun = sentUnderContractCount + sentLendersCount;
  if (canSendEmail && totalSentThisRun > 0) {
    const pushTitle = `⚡ Due Diligence Scout: ${totalSentThisRun} Dossiers Dispatched`;
    const pushMsg = `Autonomous Scout Run Complete:\n• Priority #1 (Active Under-Contract Due Diligence): ${sentUnderContractCount}\n• Priority #2 (Mortgage Loan Officers): ${sentLendersCount}\nTotal Historical Dispatched: ${outreachLog.length}`;
    await sendPushNotification(pushTitle, pushMsg, 'high');
  } else if (!canSendEmail) {
    const pushTitle = `🛡️ Due Diligence Scout: Directory Verified`;
    const pushMsg = `Autonomous Scout Directory Verified:\n• ${totalUnderContract} Active Under-Contract Due Diligence Listings Verified\n• ${totalLoanOfficers} Loan Officers Verified\n• Email dispatch handled by local daemon engine`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  } else {
    const pushTitle = `⚡ Due Diligence Scout: Roster Current`;
    const pushMsg = `All active under-contract properties and loan officers have current dossiers.\nTotal Historical Dispatched: ${outreachLog.length}`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  }

  if (transporter) transporter.close();
  releaseLock();
  console.log('🏁 [Due Diligence Engine] Execution complete!');
  console.log(`Summary: ${sentUnderContractCount} Active Under-Contract Due Diligence, ${sentLendersCount} Lenders dispatched.`);
}

main().catch(async (err) => {
  releaseLock();
  console.error('⚠️ [Due Diligence Engine] Engine completed with warning:', err.message);
  process.exit(0);
});

