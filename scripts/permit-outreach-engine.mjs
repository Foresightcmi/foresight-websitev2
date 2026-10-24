import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { routePermitLead, buildConstructionEmail, buildSTREmail, LIST_UNSUBSCRIBE_HEADER } from './permit-email-templates.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'permit-leads.json');
const OUTREACH_FILE = path.join(ROOT_DIR, 'data', 'permit-outreach-log.json');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';
const LOCAL_UNSUB_FILE = path.join(ROOT_DIR, 'data', 'unsubscribed_contacts.json');
const LEGACY_UNSUB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const UNSUBSCRIBED_FILE = fs.existsSync(LOCAL_UNSUB_FILE) ? LOCAL_UNSUB_FILE : LEGACY_UNSUB_FILE;
const PERMIT_SUPPRESSION_FILE = path.join(ROOT_DIR, 'data', 'permit-suppression.json');
const LOCK_FILE = path.join(ROOT_DIR, 'data', 'permit_outreach_dispatch.lock');

function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      const ageMs = Date.now() - (raw.timestamp || 0);
      if (ageMs < 30 * 60 * 1000) {
        console.log(`🔒 [Outreach Engine] Active lock held by PID ${raw.pid} (${Math.round(ageMs / 1000)}s old). Exiting cleanly to prevent duplicate sends.`);
        return false;
      }
    } catch (_) {}
  }
  try {
    fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, timestamp: Date.now() }), 'utf8');
    return true;
  } catch (_) {
    return false;
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
  } catch (_) {}
}


/**
 * Emails that must never be contacted again (global unsubscribes + permit opt-outs).
 */
function loadSuppressedEmails() {
  const set = new Set();
  for (const file of [UNSUBSCRIBED_FILE, PERMIT_SUPPRESSION_FILE]) {
    if (!fs.existsSync(file)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const items = Array.isArray(data) ? data : Object.values(data);
      for (const item of items) {
        const em = typeof item === 'string' ? item : (item && item.email);
        if (em) set.add(String(em).toLowerCase().trim());
      }
    } catch (e) {
      console.warn('[Outreach Engine] Could not read suppression file', file, e.message);
    }
  }
  return set;
}

/**
 * Loads environment variables from .env.local
 */
function getEmailCredentials() {
  let pass = process.env.EMAIL_PASSWORD; // ggignore
  let user = process.env.EMAIL_USER || 'inspect@foresightcmi.com'; // ggignore

  if (!pass && fs.existsSync(ENV_LOCAL_FILE)) {
    const content = fs.readFileSync(ENV_LOCAL_FILE, 'utf8');
    const passMatch = content.match(/EMAIL_PASSWORD=(.+)/); // ggignore
    const userMatch = content.match(/EMAIL_USER=(.+)/); // ggignore
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
 * Router: returns an honest, relevant email for this permit, or null to skip.
 * The old DeKalb low-flow and STR "mandate" templates were removed on 2026-10-15
 * because they implied legal requirements that did not apply to the recipients.
 */
function buildDueDiligenceEmail(lead) {
  return routePermitLead(lead);
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

const SHARED_COOLDOWN_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'smtp_cooldown_state.json');

function getSharedCooldown() {
  try {
    if (!fs.existsSync(SHARED_COOLDOWN_FILE)) return { active: false };
    const d = JSON.parse(fs.readFileSync(SHARED_COOLDOWN_FILE, 'utf8'));
    if (d && d.cooldownUntil && new Date(d.cooldownUntil).getTime() > Date.now()) {
      return { active: true, cooldownUntil: d.cooldownUntil };
    }
  } catch {}
  return { active: false };
}

function setSharedCooldown(reason) {
  try {
    fs.writeFileSync(SHARED_COOLDOWN_FILE, JSON.stringify({
      triggeredAt: new Date().toISOString(),
      cooldownUntil: new Date(Date.now() + 24.25 * 3600 * 1000).toISOString(),
      reason
    }, null, 2), 'utf8');
  } catch {}
}

async function main() {
  console.log('🚀 [Outreach Engine] Initializing Municipal Lead Outreach Engine...');
  if (!acquireLock()) return;

  const smtpCooldown = getSharedCooldown();
  if (smtpCooldown.active) {
    console.log(`🛡️ [Outreach Engine] Shared SMTP Circuit Breaker active until ${smtpCooldown.cooldownUntil}. Skipping SMTP to protect 24h reset.`);
    releaseLock();
    return;
  }

  const { user, pass } = getEmailCredentials();
  if (!pass) {
    console.warn('⚠️ [Outreach Engine] EMAIL_PASSWORD not found in environment or .env.local.'); // ggignore
    console.warn('   To enable live email dispatch in GitHub Actions, add EMAIL_PASSWORD to repository secrets.'); // ggignore
    console.log('🏁 [Outreach Engine] Skipping email transmission for this run.');
    releaseLock();
    return;
  }

  // Create real Gmail/Google Workspace SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 1,
    maxMessages: 45,
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log(`✅ [Outreach Engine] SMTP connection verified for ${user}`);
  } catch (verifyErr) {
    console.warn('⚠️ [Outreach Engine] SMTP temporarily in Gmail rolling 24-hr cooldown:', verifyErr.message);
    if (verifyErr.message.includes('454') || verifyErr.message.includes('550')) {
      setSharedCooldown(`Permit Outreach Verify Error: ${verifyErr.message}`);
    }
    transporter.close();
    releaseLock();
    return;
  }

  if (!fs.existsSync(LEADS_FILE)) {
    console.error('❌ [Outreach Engine] Leads file not found:', LEADS_FILE);
    releaseLock();
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

  const DUE_DILIGENCE_LOG_FILE = path.join(ROOT_DIR, 'data', 'due-diligence-outreach-log.json');
  let dueDiligenceLog = [];
  if (fs.existsSync(DUE_DILIGENCE_LOG_FILE)) {
    try {
      dueDiligenceLog = JSON.parse(fs.readFileSync(DUE_DILIGENCE_LOG_FILE, 'utf8'));
    } catch {
      dueDiligenceLog = [];
    }
  }

  const contactedEmails = new Set([
    ...outreachLog
      .filter(o => o.status === 'SENT')
      .map(o => String(o.recipientEmail || '').trim().toLowerCase())
      .filter(Boolean),
    ...dueDiligenceLog
      .map(o => String(o.email || '').trim().toLowerCase())
      .filter(Boolean)
  ]);

  const contactedNames = new Set([
    ...outreachLog
      .filter(o => o.status === 'SENT')
      .map(o => String(o.recipientName || '').trim().toLowerCase())
      .filter(Boolean),
    ...dueDiligenceLog
      .map(o => String(o.targetName || '').trim().toLowerCase())
      .filter(Boolean)
  ]);

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

  const args = process.argv.slice(2);
  const sendAll = args.includes('--all');
  const dekalbOnly = args.includes('--dekalb-only');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const batchLimit = sendAll ? Infinity : (limitArg ? parseInt(limitArg.split('=')[1], 10) : 50);

  const TRADE_SUBCONTRACTOR_REGEX = /plumb|electr|hvac|heat|air|roof|solar|drain|rooter|sewer|mech|generator|dekalbcountyga\.gov|expedit|sign|pool|fence|paving|grading|demo|fire|alarm|sprinkler|restore|remediat|mitigat|llc|inc\b|corp|homes|builders|construction|development|holdings|mhp|boavida/i;
  const seenEmailsInQueue = new Set();
  const seenNamesInQueue = new Set();
  const suppressedEmails = loadSuppressedEmails();
  console.log(`🛡️ [Outreach Engine] Loaded ${suppressedEmails.size} suppressed contacts.`);

  const queue = enrichedLeads.filter(l => {
    if (!l.ownerEmail) return false;
    const normEmail = l.ownerEmail.trim().toLowerCase();
    const normName = String(l.ownerName || '').trim().toLowerCase();
    if (contactedEmails.has(normEmail) || seenEmailsInQueue.has(normEmail)) return false;
    if (normName && (contactedNames.has(normName) || seenNamesInQueue.has(normName))) return false;
    if (suppressedEmails.has(normEmail)) return false;
    if (!routePermitLead(l)) return false; // Strictly New Construction or STR only (remodels/additions excluded)

    const type = (l.permitType || '').toLowerCase();
    if (/addition|alteration|remodel|repair|renovation/i.test(type)) return false;

    const isDeKalb = (l.jurisdiction || '').includes('DeKalb') || (l.recordId || '').startsWith('DKB-');
    if (dekalbOnly && !isDeKalb) return false;

    // Strict guard: never email trade subcontractors, builder LLCs, or government emails
    if (isDeKalb) {
      if (l.primaryContactType && String(l.primaryContactType) !== '1') return false;
      const combinedText = `${l.ownerName || ''} ${l.ownerEmail || ''} ${l.permitName || ''}`;
      if (TRADE_SUBCONTRACTOR_REGEX.test(combinedText)) return false;
      seenEmailsInQueue.add(normEmail);
      if (normName) seenNamesInQueue.add(normName);
      return true;
    }

    const isSTR = (l.jurisdiction || '').includes('Short-Term Rental') || (l.recordId || '').startsWith('STR-');
    const isNewBuild = type.includes('new');
    if (isSTR || isNewBuild) {
      seenEmailsInQueue.add(normEmail);
      if (normName) seenNamesInQueue.add(normName);
      return true;
    }
    return false;
  }).slice(0, batchLimit);
  console.log(`📬 [Outreach Engine] Found ${queue.length} actionable high-intent verified New Construction / STR Property Owner leads in queue (Batch Limit: ${batchLimit === Infinity ? 'ALL' : batchLimit}).`);

  for (const lead of queue) {
    const emailData = buildDueDiligenceEmail(lead);
    console.log(`\n📨 [Outreach Engine] Transmitting email to ${lead.ownerName} (${lead.ownerEmail})...`);

    const mailOptions = {
      from: `"Christopher Boykin, CMI® - Foresight Home Inspections" <${user}>`,
      to: lead.ownerEmail,
      subject: emailData.subject,
      text: emailData.bodyText,
      html: emailData.html,
      headers: { 'List-Unsubscribe': LIST_UNSUBSCRIBE_HEADER }
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`🎉 [Outreach Engine] Email SENT successfully! Message ID: ${info.messageId}`);

      const isDeKalbLead = (lead.jurisdiction || '').includes('DeKalb') || (lead.recordId || '').startsWith('DKB-');
      const isSTRLead = (lead.jurisdiction || '').includes('Short-Term Rental') || (lead.recordId || '').startsWith('STR-');
      const inspectionTarget = isSTRLead ? 'Optional STR Safety Check (Starts at $395)' : 'Optional Construction Inspection (Pre-Drywall from $275)';

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
        inspectionTarget
      };

      outreachLog.unshift(entry);
      fs.writeFileSync(OUTREACH_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');

      // Send real-time confirmation push to entrepreneur's phone
      await dispatchSmartphoneAlert(lead, emailData);
      console.log(`📱 [Outreach Engine] Live confirmation pinged to your phone for ${lead.ownerName}`);

      // Respect Google SMTP pacing with 20s delay between sends
      await new Promise(r => setTimeout(r, 20000));

    } catch (sendErr) {
      console.error(`❌ [Outreach Engine] Failed to send email to ${lead.ownerEmail}:`, sendErr.message);
      if (sendErr.message.includes('550') || sendErr.message.includes('454') || sendErr.message.includes('Daily user sending limit exceeded')) {
        setSharedCooldown(`Permit Outreach 550/454 limit reached (${lead.ownerEmail}): ${sendErr.message}`);
        console.warn('\n⚠️ [Outreach Engine] Google SMTP daily quota reached. Locked shared 24h circuit breaker and halting immediately.');
        break;
      }
    }
  }

  transporter.close();
  releaseLock();
  console.log(`\n🏁 [Outreach Engine] Outreach run completed.`);
}

export {
  buildDueDiligenceEmail,
  buildConstructionEmail,
  buildSTREmail
};

if (process.argv[1] && process.argv[1].endsWith('permit-outreach-engine.mjs')) {
  main();
}
