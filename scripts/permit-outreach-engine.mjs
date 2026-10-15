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
const UNSUBSCRIBED_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const PERMIT_SUPPRESSION_FILE = path.join(ROOT_DIR, 'data', 'permit-suppression.json');

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
    pool: true,
    maxConnections: 1,
    maxMessages: 200,
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log(`✅ [Outreach Engine] SMTP connection verified for ${user}`);
  } catch (verifyErr) {
    console.warn('⚠️ [Outreach Engine] SMTP temporarily in Gmail rolling 24-hr cooldown:', verifyErr.message);
    transporter.close();
    return;
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

  const args = process.argv.slice(2);
  const sendAll = args.includes('--all');
  const dekalbOnly = args.includes('--dekalb-only');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const batchLimit = sendAll ? Infinity : (limitArg ? parseInt(limitArg.split('=')[1], 10) : 50);

  const TRADE_SUBCONTRACTOR_REGEX = /plumb|electr|hvac|heat|air|roof|solar|drain|rooter|sewer|mech|generator|dekalbcountyga\.gov|expedit|sign|pool|fence|paving|grading|demo|fire|alarm|sprinkler|restore|remediat|mitigat/i;
  const seenEmailsInQueue = new Set();
  const suppressedEmails = loadSuppressedEmails();
  console.log(`🛡️ [Outreach Engine] Loaded ${suppressedEmails.size} suppressed contacts.`);

  const queue = enrichedLeads.filter(l => {
    if (!l.ownerEmail) return false;
    const normEmail = l.ownerEmail.trim().toLowerCase();
    if (contactedEmails.has(normEmail) || seenEmailsInQueue.has(normEmail)) return false;
    if (suppressedEmails.has(normEmail)) return false;
    if (!routePermitLead(l)) return false; // no honest, relevant offer for this permit type

    const isDeKalb = (l.jurisdiction || '').includes('DeKalb') || (l.recordId || '').startsWith('DKB-');
    if (dekalbOnly && !isDeKalb) return false;

    // Strict guard: never email trade subcontractors or government emails
    if (isDeKalb) {
      if (l.primaryContactType && String(l.primaryContactType) !== '1') return false;
      const combinedText = `${l.ownerName || ''} ${l.ownerEmail || ''} ${l.permitName || ''}`;
      if (TRADE_SUBCONTRACTOR_REGEX.test(combinedText)) return false;
      seenEmailsInQueue.add(normEmail);
      return true;
    }

    const val = Number(l.jobValue || 0);
    const type = (l.permitType || '').toLowerCase();
    const isHighValue = val >= 15000;
    const isStructural = type.includes('addition') || type.includes('new') || type.includes('alteration') || type.includes('repair') || type.includes('structure');
    if (isHighValue || isStructural) {
      seenEmailsInQueue.add(normEmail);
      return true;
    }
    return false;
  }).slice(0, batchLimit);
  console.log(`📬 [Outreach Engine] Found ${queue.length} actionable high-intent verified Property Owner leads in queue (Batch Limit: ${batchLimit === Infinity ? 'ALL' : batchLimit}).`);

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
      const inspectionTarget = isSTRLead ? 'Optional STR Safety Check ($595)' : 'Optional Construction Inspection (Pre-Drywall from $275)';

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

      // Respect Google SMTP pacing with 2.5s delay between sends
      await new Promise(r => setTimeout(r, 2500));

    } catch (sendErr) {
      console.error(`❌ [Outreach Engine] Failed to send email to ${lead.ownerEmail}:`, sendErr.message);
      if (sendErr.message.includes('550-5.4.5') || sendErr.message.includes('454') || sendErr.message.includes('Daily user sending limit exceeded')) {
        console.warn('\n⚠️ [Outreach Engine] Google SMTP daily quota reached. Pausing remaining queue until rolling 24-hr window resets.');
        break;
      }
    }
  }

  transporter.close();
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
