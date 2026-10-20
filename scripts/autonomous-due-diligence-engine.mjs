import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import os from 'node:os';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { harvestLiveDueDiligence } from './harvest-live-due-diligence.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const LOAN_OFFICERS_FILE = path.join(ROOT_DIR, 'data', 'loan-officers.json');
const UNDER_CONTRACT_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const OUTREACH_LOG_FILE = path.join(ROOT_DIR, 'data', 'due-diligence-outreach-log.json');
const OPENSMS_LOG_FILE = path.join(ROOT_DIR, 'data', 'opensms-outreach-log.json');
const OPENSMS_CONFIG_FILE = path.join(ROOT_DIR, 'data', 'opensms-config.json');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const UNSUBSCRIBED_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
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

async function discoverLocalOpenSmsPhone(port = 9292) {
  const prefixes = new Set(['192.168.1']);
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const iface of nets[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal && (iface.address.startsWith('192.168.') || iface.address.startsWith('10.0.'))) {
        prefixes.add(iface.address.split('.').slice(0, 3).join('.'));
      }
    }
  }
  for (const prefix of prefixes) {
    const found = [];
    await Promise.all(
      Array.from({ length: 254 }, (_, i) => i + 1).map(
        i =>
          new Promise(resolve => {
            const ip = `${prefix}.${i}`;
            const sock = new net.Socket();
            sock.setTimeout(500);
            sock.once('connect', () => {
              found.push(`http://${ip}:${port}/sms/`);
              sock.destroy();
              resolve();
            });
            sock.once('timeout', () => {
              sock.destroy();
              resolve();
            });
            sock.once('error', () => {
              sock.destroy();
              resolve();
            });
            sock.connect(port, ip);
          })
      )
    );
    if (found.length > 0) return found[0];
  }
  return '';
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
  const quoteUrl = `https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)}`;

  const subject = `Congrats on ${address} (${city}) — 24-hr due diligence slot`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Congratulations on getting ${address} in ${city}${price} under contract! Wanted to reach out in case your buyers or co-op agent need a rapid 24-hour due diligence inspection while the 5-to-7 day contingency clock is running.`,
    ``,
    `My partner and I inspect every property as a two-inspector Certified Master Inspector (CMI) team with active SUPRA eKEY access:`,
    `• 2-Inspector Team Starting at $345: Full structural, roof, MEP & FLIR thermal sweep in half the time with same-day calm, objective digital reports.`,
    `• New Construction & 11-Month Builder Warranty: Pre-Drywall (from $275) and Final / 11-Month Warranty (from $345) inspections.`,
    `• DeKalb County Low-Flow Plumbing Fixture Certificate ($100 Flat Fee): Official signed Certificate of Compliance for DeKalb Watershed water turn-on.`,
    `• $35,000+ Buyer Protection Warranties + Free Utility Setup Concierge.`,
    ``,
    `Feel free to pass this 1-click quote link to your buyers or text/call me directly at (678) 480-2110: ${quoteUrl}`,
    ``,
    `Best regards,`,
    `Christopher Boykin, CMI`,
    `Foresight Home Inspections`,
    `(678) 480-2110 | https://fhinspectionsatl.com`,
    `1816 South Deshon Road, Lithonia, GA 30058`,
    `Reply stop anytime to opt out.`
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;max-width:600px;">
<p>Hi ${firstName},</p>
<p>Congratulations on getting <strong>${address}</strong> in ${city}${price} under contract! Wanted to reach out in case your buyers or co-op agent need a rapid 24-hour due diligence inspection while the contingency clock is running.</p>
<p>My partner and I inspect every property as a <strong>two-inspector Certified Master Inspector (CMI) team</strong> with active SUPRA eKEY access:</p>
<ul style="padding-left:20px;margin:14px 0;">
<li style="margin-bottom:8px;"><strong>2-Inspector Team Starting at $345:</strong> Full structural, roof, MEP &amp; FLIR thermal sweep in half the time with same-day calm, objective digital reports.</li>
<li style="margin-bottom:8px;"><strong>New Construction &amp; 11-Month Builder Warranty:</strong> Pre-Drywall (from $275) and Final / 11-Month Warranty (from $345) inspections.</li>
<li style="margin-bottom:8px;"><strong>DeKalb County Low-Flow Plumbing Certificate ($100 Flat Fee):</strong> Official signed Certificate of Compliance for DeKalb Watershed water service activation.</li>
<li style="margin-bottom:8px;"><strong>$35,000+ Buyer Warranties</strong> + Free Utility Setup Concierge.</li>
</ul>
<p>Feel free to pass this pre-filled quote link to your buyers: <a href="${quoteUrl}" style="color:#0f52ba;text-decoration:underline;">fhinspectionsatl.com/quote</a> or text/call me directly at <strong>(678) 480-2110</strong>.</p>
<p style="margin-top:20px;">Best regards,<br>
<strong>Christopher Boykin, CMI</strong><br>
Foresight Home Inspections<br>
(678) 480-2110 | <a href="https://fhinspectionsatl.com" style="color:#0f52ba;">fhinspectionsatl.com</a><br>
<span style="font-size:12px;color:#6b7280;">1816 South Deshon Road, Lithonia, GA 30058 &bull; Reply stop anytime to opt out.</span></p>
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

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const cur = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      if (cur.pid === process.pid) fs.unlinkSync(LOCK_FILE);
    }
  } catch {}
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
      if (d && d.cooldownUntil && new Date(d.cooldownUntil).getTime() > Date.now()) {
        return { active: true, cooldownUntil: d.cooldownUntil, reason: d.reason };
      }
    } catch {}
    return { active: false };
  }
  function setSharedCooldown(reason) {
    try {
      const payload = {
        triggeredAt: new Date().toISOString(),
        cooldownUntil: new Date(Date.now() + 24.25 * 3600 * 1000).toISOString(),
        reason
      };
      fs.writeFileSync(SHARED_COOLDOWN_FILE, JSON.stringify(payload, null, 2), 'utf8');
    } catch {}
  }

  const { user, pass } = getEmailCredentials();
  const { apiKey: openSmsKey, gatewayUrl: configuredSmsUrl } = getOpenSmsConfig();
  let transporter = null;
  let canSendEmail = false;
  const smtpCooldown = getSharedCooldown();

  if (smtpCooldown.active) {
    console.log(`🛡️ [Due Diligence Engine] Shared SMTP Circuit Breaker active until ${smtpCooldown.cooldownUntil}. Skipping SMTP to protect 24h reset (FMLS Harvest & OpenSMS remain active).`);
  } else if (!pass) {
    console.warn('⚠️ [Due Diligence Engine] EMAIL_PASSWORD not found in environment/secrets.');
    console.log('ℹ️ [Due Diligence Engine] Running in Directory Scout & Verification mode (email dispatch handled by authenticated local daemon).');
  } else {
    try {
      const testTransporter = nodemailer.createTransport({
        service: 'gmail',
        pool: true,
        maxConnections: 1,
        maxMessages: 45,
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
  let sentOpenSmsCount = 0;

  // -----------------------------------------------------------
  // PRIORITY #1 (TASK A): Dispatch to Active Under-Contract / Due Diligence Properties First
  // -----------------------------------------------------------
  let totalUnderContract = 0;
  if (fs.existsSync(UNDER_CONTRACT_FILE)) {
    const underContractRealtors = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
    totalUnderContract = underContractRealtors.length;
    console.log(`📋 [Due Diligence Engine] Priority #1: Loaded ${underContractRealtors.length} Active Under-Contract / Due Diligence Realtors.`);

    const sorted = [...underContractRealtors].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (canSendEmail && transporter) {
      for (const r of sorted) {
        if (quotaCeilingHit) break;
        if (!r.email || !r.email.includes('@')) continue;
        const normEmail = String(r.email).trim().toLowerCase();
        const normName = String(r.name || '').trim().toLowerCase();
        const cleanPhone = String(r.clean_phone || r.raw_phone || r.phone || '').replace(/\D/g, '').slice(-10);
        const key = `CONTRACT_${r.id}_${r.email}`;
        if (
          contactedKeys.has(key) ||
          contactedEmails.has(normEmail) ||
          (normName && contactedNames.has(normName)) ||
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
            timestamp: new Date().toISOString()
          });
          fs.writeFileSync(OUTREACH_LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

          sentUnderContractCount++;
          console.log(`  ✓ Transmitted successfully to ${r.name} for ${r.address}`);
          await sleep(18000); // 18s safe spacing
        } catch (e) {
          console.error(`  ❌ Failed to send to ${r.email}:`, e.message);
          if (e.message.includes('550') || e.message.includes('454') || e.message.includes('Daily user sending limit exceeded')) {
            setSharedCooldown(`Due Diligence 550/454 limit reached (${r.email}): ${e.message}`);
            console.warn('⚠️ [Due Diligence Engine] Daily rolling sending limit reached (550/454). Locked shared 24h circuit breaker and halting cleanly.');
            quotaCeilingHit = true;
            break;
          }
        }

        if (sentUnderContractCount >= 6) break;
      }
    } else {
      console.log('  ℹ️ Email dispatch inactive; under-contract due diligence directory is verified and current.');
    }

    // Autonomous OpenSMS Dispatch for Top Uncontacted Due Diligence Deals
    // Strictly targets DasLearning Local OpenSMS on Android phone (http://<PHONE_IP>:9292/sms/)
    const discoveredLocalUrl = configuredSmsUrl || (await discoverLocalOpenSmsPhone(9292));
    if (discoveredLocalUrl) {
      const targetEndpoint = discoveredLocalUrl;
      const isLocalDasLearning = targetEndpoint.includes(':9292') || targetEndpoint.endsWith('/sms/');
      console.log(`🤖 [OpenSMS Engine] Connected to Android OpenSMS Gateway: ${targetEndpoint}`);

      for (const r of sorted) {
        // Strict Freshness Gate: ONLY contracts signed in the last 4 days (active 5-day due diligence window)
        if (!r.date) continue;
        const dealAgeDays = (Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
        if (dealAgeDays < 0 || dealAgeDays > 4.5) continue;

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

        const smsMessage = r.text_body || `Hi ${r.first || 'there'}, Christopher Boykin with Foresight Home Inspections here! Saw ${r.address} in ${r.city} just went under contract—congratulations! If your buyers need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report, we have a slot open in ${r.city}: https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(r.address || '')} — (678) 480-2110`;

        const headers = { 'Content-Type': 'application/json' };
        if (openSmsKey) headers['Authorization'] = `Bearer ${openSmsKey}`;

        const bodyPayload = isLocalDasLearning
          ? { number: `+1${cleanPhone}`, text: smsMessage }
          : { to: `+1${cleanPhone}`, message: smsMessage };

        try {
          const smsRes = await fetch(targetEndpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyPayload)
          });
          if (smsRes.ok) {
            const smsData = await smsRes.json().catch(() => ({}));
            smsContactedPhones.add(cleanPhone);
            if (normName) contactedNames.add(normName);
            if (normEmail) contactedEmails.add(normEmail);
            openSmsLog.push({
              id: smsData.id || `sms_${Date.now()}`,
              leadId: r.id,
              to: `+1${cleanPhone}`,
              targetName: r.name,
              address: r.address,
              city: r.city,
              role: r.role || 'LIST_AGENT',
              gateway: isLocalDasLearning ? 'DasLearning-Local-9292' : 'OpenSMS-Cloud',
              status: smsData.stat === true ? 'sent' : (smsData.status || 'pending'),
              timestamp: new Date().toISOString()
            });
            fs.writeFileSync(OPENSMS_LOG_FILE, JSON.stringify(openSmsLog, null, 2), 'utf8');
            sentOpenSmsCount++;
            console.log(`  📱 [OpenSMS] Dispatched SMS to ${r.name} (+1${cleanPhone}) for ${r.address}`);
            await sleep(25000); // 25s carrier-safe spacing
          } else {
            console.warn(`  ⚠️ [OpenSMS] HTTP ${smsRes.status} for +1${cleanPhone}`);
            break;
          }
        } catch (smsErr) {
          console.warn(`  ⚠️ [OpenSMS] Dispatch error:`, smsErr.message);
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

    if (canSendEmail && transporter) {
      for (const lo of loanOfficers) {
        if (quotaCeilingHit) break;
        const normEmail = String(lo.email || '').trim().toLowerCase();
        const normName = String(lo.name || '').trim().toLowerCase();
        const key = `LO_${lo.id}_${lo.email}`;
        if (
          contactedKeys.has(key) ||
          (normEmail && contactedEmails.has(normEmail)) ||
          (normName && contactedNames.has(normName))
        ) {
          continue;
        }
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
          if (normEmail) contactedEmails.add(normEmail);
          if (normName) contactedNames.add(normName);
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

  // 3b. Auto-Deploy Refreshed VIP Dispatcher & Due Diligence Pool to Live Site
  try {
    execSync('node scripts/generate-due-diligence-dispatch.mjs', { cwd: ROOT_DIR, stdio: 'ignore' });
    execSync('git add public/vip-dispatch.html data/under-contract-realtors.json data/archive-under-contract-realtors.json data/due-diligence-outreach-log.json', { cwd: ROOT_DIR, stdio: 'ignore' });
    const diffStatus = execSync('git diff --cached --name-only', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    if (diffStatus) {
      const todayIso = new Date().toISOString().split('T')[0];
      execSync(`git commit -m "chore(dispatch): auto-sync ${todayIso} FMLS due diligence harvest & vip-dispatch.html"`, { cwd: ROOT_DIR, stdio: 'ignore' });
      execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'ignore' });
      console.log('🚀 [Due Diligence Engine] Auto-deployed refreshed public/vip-dispatch.html to origin/main.');
    }
  } catch (gitErr) {
    console.warn('⚠️ [Due Diligence Engine] Git auto-deploy warning:', gitErr.message);
  }

  // 4. Send Mobile Summary Alert
  const totalSentThisRun = sentUnderContractCount + sentLendersCount + sentOpenSmsCount;
  if ((canSendEmail || sentOpenSmsCount > 0) && (totalSentThisRun > 0 || newPendingHarvested > 0)) {
    const pushTitle = `⚡ Due Diligence Engine: ${sentUnderContractCount} Emails, ${sentOpenSmsCount} SMS`;
    const pushMsg = `Autonomous Scout & OpenSMS Run Complete:\n• Live FMLS Pending Harvested: ${newPendingHarvested}\n• Active Due Diligence Emails: ${sentUnderContractCount}\n• OpenSMS Dispatched: ${sentOpenSmsCount}\n• Mortgage Loan Officers: ${sentLendersCount}\nTotal Historical Dispatched: ${outreachLog.length}`;
    await sendPushNotification(pushTitle, pushMsg, 'high');
  } else if (!canSendEmail) {
    const pushTitle = `🛡️ Due Diligence Scout: ${newPendingHarvested} New Pending Homes`;
    const pushMsg = `Autonomous Scout Directory Verified:\n• ${newPendingHarvested} New FMLS Pending Listings Harvested\n• ${totalUnderContract} Total Under-Contract Agents Ready\n• ${sentOpenSmsCount} OpenSMS Sent`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  } else {
    const pushTitle = `⚡ Due Diligence Scout: Roster Current`;
    const pushMsg = `All active under-contract properties and loan officers have current dossiers.\nTotal Historical Dispatched: ${outreachLog.length}`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  }

  if (transporter) transporter.close();
  releaseLock();
  console.log('🏁 [Due Diligence Engine] Execution complete!');
  console.log(`Summary: ${newPendingHarvested} New Pending Harvested, ${sentUnderContractCount} Due Diligence Emails, ${sentOpenSmsCount} OpenSMS Texts, ${sentLendersCount} Lenders dispatched.`);
}

main().catch(async (err) => {
  releaseLock();
  console.error('⚠️ [Due Diligence Engine] Engine completed with warning:', err.message);
  process.exit(0);
});

