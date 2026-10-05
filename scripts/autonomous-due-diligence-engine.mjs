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
          <li><strong>1-Click GAR Form F404 Repair Tool:</strong> Standardized repair clauses eliminate buyer-seller negotiation deadlocks.</li>
          <li><strong>$35,000 in Buyer Protection Guarantees:</strong> InterNACHI Buy-Back Guarantee + 90-Day Structural Warranty eliminates borrower cold feet.</li>
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
      Confidential Professional Advisory for Mortgage Industry Partners.
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
          <li><strong>1-Click GAR Form F404 Repair Addendum Tool:</strong> 1-click export of repair requests directly formatted for Georgia contracts.</li>
          <li><strong>Active SUPRA eKEY Access:</strong> Seamless entry with zero hassle for listing agents.</li>
          <li><strong>$35,000 in Buyer Warranties:</strong> Includes InterNACHI's "We'll Buy Your Home Back" Guarantee.</li>
          ${isDeKalb ? '<li><strong>DeKalb Low-Flow Plumbing Certificate ($100):</strong> County compliance certificate issued on-site to eliminate closing table delays.</li>' : ''}
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
      Professional notification based on Georgia public MLS contract status.
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
          <li><strong>1-Click GAR Form F404 Repair Addendum:</strong> Generates clean, contract-ready repair language that keeps deals intact.</li>
          <li><strong>$35,000 Client Protection Guarantees:</strong> 90-Day Structural Warranty &amp; InterNACHI Buy-Back Guarantee.</li>
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
      Serving Metro Atlanta &amp; 77+ Municipalities across 20 Georgia Counties.
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
async function main() {
  console.log('⚡ [Due Diligence Engine] Initializing Autonomous Scout & Dossier Transmission...');

  // 1. Check Email Credentials
  const { user, pass } = getEmailCredentials();
  if (!pass) {
    console.error('❌ [Due Diligence Engine] EMAIL_PASSWORD not found in environment.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log(`✅ [Due Diligence Engine] SMTP connection verified for ${user}`);
  } catch (err) {
    console.error('❌ [Due Diligence Engine] SMTP connection failed:', err.message);
    process.exit(1);
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

  let sentLendersCount = 0;
  let sentUnderContractCount = 0;
  let sentPreDDCount = 0;

  // -----------------------------------------------------------
  // TASK A: Dispatch to Mortgage Loan Officers
  // -----------------------------------------------------------
  if (fs.existsSync(LOAN_OFFICERS_FILE)) {
    const loanOfficers = JSON.parse(fs.readFileSync(LOAN_OFFICERS_FILE, 'utf8'));
    console.log(`🏦 [Due Diligence Engine] Loaded ${loanOfficers.length} Mortgage Loan Officers.`);

    for (const lo of loanOfficers) {
      const key = `LO_${lo.id}_${lo.email}`;
      if (contactedKeys.has(key)) continue;

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

        sentLendersCount++;
        console.log(`  ✓ Transmitted successfully to ${lo.name}`);
        await sleep(2500); // 2.5s safe spacing
      } catch (e) {
        console.error(`  ❌ Failed to send to ${lo.email}:`, e.message);
      }

      // Max 2 loan officers per automated daily scout pass to keep deliverability pristine
      if (sentLendersCount >= 2) break;
    }
  }

  // -----------------------------------------------------------
  // TASK B: Dispatch to Under Due Diligence Listings (Newest Contracts)
  // -----------------------------------------------------------
  if (fs.existsSync(UNDER_CONTRACT_FILE)) {
    const underContractRealtors = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
    console.log(`📋 [Due Diligence Engine] Loaded ${underContractRealtors.length} Under-Contract Realtors.`);

    // Sort newest first
    const sorted = [...underContractRealtors].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    for (const r of sorted) {
      if (!r.email || !r.email.includes('@')) continue;
      const key = `CONTRACT_${r.id}_${r.email}`;
      if (contactedKeys.has(key)) continue;

      console.log(`📤 [Due Diligence Engine] Dispatching Due Diligence Dossier to ${r.name} (${r.address}) <${r.email}>...`);
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

        sentUnderContractCount++;
        console.log(`  ✓ Transmitted successfully to ${r.name} for ${r.address}`);
        await sleep(3000); // 3s safe spacing
      } catch (e) {
        console.error(`  ❌ Failed to send to ${r.email}:`, e.message);
      }

      // Limit to 4 contracts per daily run
      if (sentUnderContractCount >= 4) break;
    }
  }

  // -----------------------------------------------------------
  // TASK C: Dispatch to Pre-Due Diligence (Hot Listings / About to Go Binding)
  // -----------------------------------------------------------
  if (fs.existsSync(UNDER_CONTRACT_FILE)) {
    const underContractRealtors = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
    // Select listings that hit the market recently
    const preDDListings = underContractRealtors.slice(50, 100);

    for (const r of preDDListings) {
      if (!r.email || !r.email.includes('@')) continue;
      const key = `PRE_DD_${r.id}_${r.email}`;
      if (contactedKeys.has(key)) continue;

      console.log(`📤 [Due Diligence Engine] Dispatching Pre-Due Diligence Reservation to ${r.name} (${r.address}) <${r.email}>...`);
      const { subject, html } = buildPreDueDiligenceEmail(r);

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
          type: 'PRE_DUE_DILIGENCE_RESERVATION',
          targetName: r.name,
          brokerage: r.brokerage,
          address: r.address,
          city: r.city,
          email: r.email,
          date: r.date,
          timestamp: new Date().toISOString()
        });

        sentPreDDCount++;
        console.log(`  ✓ Transmitted successfully to ${r.name} for ${r.address}`);
        await sleep(3000); // 3s safe spacing
      } catch (e) {
        console.error(`  ❌ Failed to send to ${r.email}:`, e.message);
      }

      // Limit to 2 pre-DD per daily run
      if (sentPreDDCount >= 2) break;
    }
  }

  // 3. Save Updated Outreach Log
  fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
  console.log(`💾 [Due Diligence Engine] Updated outreach log (${outreachLog.length} total historical communications).`);

  // 4. Send Mobile Summary Alert
  const totalSentThisRun = sentLendersCount + sentUnderContractCount + sentPreDDCount;
  const pushTitle = `⚡ Due Diligence Scout: ${totalSentThisRun} Dossiers Dispatched`;
  const pushMsg = `Autonomous Scout Run Complete:\n• Mortgage Loan Officers: ${sentLendersCount}\n• Under Due Diligence Listings: ${sentUnderContractCount}\n• Pre-Due Diligence Listings: ${sentPreDDCount}\nTotal Historical Dispatched: ${outreachLog.length}`;

  await sendPushNotification(pushTitle, pushMsg, totalSentThisRun > 0 ? 'high' : 'default');

  console.log('🏁 [Due Diligence Engine] Execution complete!');
  console.log(`Summary: ${sentLendersCount} Lenders, ${sentUnderContractCount} Under Contract, ${sentPreDDCount} Pre-DD dispatched.`);
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
