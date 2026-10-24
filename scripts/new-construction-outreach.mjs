import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { buildConstructionEmail, LIST_UNSUBSCRIBE_HEADER } from './permit-email-templates.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'new-construction-leads.json');
const OUTREACH_FILE = path.join(ROOT_DIR, 'data', 'new-construction-outreach-log.json');
const HOT_SHEET_CSV = path.join(ROOT_DIR, 'data', 'new-construction-hot-sheet.csv');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const LOCAL_UNSUB_FILE = path.join(ROOT_DIR, 'data', 'unsubscribed_contacts.json');
const LEGACY_UNSUB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const UNSUBSCRIBED_FILE = fs.existsSync(LOCAL_UNSUB_FILE) ? LOCAL_UNSUB_FILE : LEGACY_UNSUB_FILE;
const PERMIT_SUPPRESSION_FILE = path.join(ROOT_DIR, 'data', 'permit-suppression.json');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

function cleanHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '').trim();
}

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
      console.warn('[New Construction Outreach] Could not read suppression file', file, e.message);
    }
  }
  return set;
}

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

/**
 * Generates an Executive Hot Sheet CSV for direct mail, agent outreach, or phone calls
 */
function generateHotSheetCsv(leads) {
  const headers = [
    'RecordID',
    'Address',
    'City',
    'Jurisdiction',
    'Price',
    'SqFt',
    'YearBuilt',
    'MLS_Status',
    'ConstructionStage',
    'DossierURL',
    'RedfinURL',
    'HarvestedAt'
  ];

  const rows = leads.map(l => [
    `"${l.recordId}"`,
    `"${(l.address || '').replace(/"/g, '""')}"`,
    `"${l.city || ''}"`,
    `"${l.jurisdiction || ''}"`,
    l.price || 0,
    l.sqft || 0,
    l.yearBuilt || 2025,
    `"${l.mlsStatus || 'Active'}"`,
    `"${l.constructionStage || ''}"`,
    `"https://www.fhinspectionsatl.com/dossiers/${l.recordId}.html"`,
    `"${l.redfinUrl || ''}"`,
    `"${l.harvestedAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  fs.writeFileSync(HOT_SHEET_CSV, csvContent, 'utf8');
  console.log(`📊 [New Construction Outreach] Exported executive hot sheet to ${HOT_SHEET_CSV}`);
}

async function main() {
  console.log('🚀 [New Construction Outreach] Initializing Outreach & Hot Sheet Engine...');

  if (!fs.existsSync(LEADS_FILE)) {
    console.error('❌ [New Construction Outreach] Leads file not found:', LEADS_FILE);
    process.exit(1);
  }

  const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
  console.log(`🔍 [New Construction Outreach] Loaded ${leads.length} new construction properties.`);

  // Export executive hot sheet for direct mail and phone outreach
  generateHotSheetCsv(leads);

  // Load outreach log
  let outreachLog = [];
  if (fs.existsSync(OUTREACH_FILE)) {
    try {
      outreachLog = JSON.parse(fs.readFileSync(OUTREACH_FILE, 'utf8'));
    } catch {
      outreachLog = [];
    }
  }

  const suppressedEmails = loadSuppressedEmails();
  const contactedIds = new Set(outreachLog.map(o => o.recordId));
  const actionableLeads = leads.filter(l => {
    if (!l.ownerEmail) return false;
    if (contactedIds.has(l.recordId)) return false;
    const em = String(l.ownerEmail).toLowerCase().trim();
    if (suppressedEmails.has(em)) return false;
    return true;
  });

  console.log(`📬 [New Construction Outreach] Actionable email leads ready for dispatch: ${actionableLeads.length}`);

  const { user, pass } = getEmailCredentials();
  if (!pass) {
    console.warn('⚠️ [New Construction Outreach] EMAIL_PASSWORD not found. Email transmission skipped.'); // ggignore
    console.log('🏁 [New Construction Outreach] Run complete.');
    return;
  }

  if (actionableLeads.length === 0) {
    console.log('ℹ️ [New Construction Outreach] No uncontacted email leads currently in queue.');
    console.log('🏁 [New Construction Outreach] Run complete.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log(`✅ [New Construction Outreach] SMTP connection verified for ${user}`);
  } catch (e) {
    console.error('❌ [New Construction Outreach] SMTP verification failed:', e.message);
    return;
  }

  // Send batch (up to 5 per run)
  const batch = actionableLeads.slice(0, 5);
  for (const lead of batch) {
    const emailData = buildConstructionEmail(lead);
    console.log(`📨 [New Construction Outreach] Transmitting intro for ${lead.address} to ${lead.ownerEmail}...`);

    try {
      const info = await transporter.sendMail({
        from: `"Christopher Boykin, CMI® - Foresight Inspections" <${user}>`,
        to: lead.ownerEmail,
        subject: emailData.subject,
        text: emailData.bodyText,
        html: emailData.html,
        headers: {
          'List-Unsubscribe': LIST_UNSUBSCRIBE_HEADER,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
      });

      console.log(`🎉 [New Construction Outreach] Email SENT! Message ID: ${info.messageId}`);

      outreachLog.push({
        recordId: lead.recordId,
        address: lead.address,
        recipient: lead.ownerEmail,
        messageId: info.messageId,
        dossierUrl: emailData.dossierUrl,
        sentAt: new Date().toISOString()
      });

      // Dispatched smartphone notification
      try {
        const title = cleanHeader(`🚀 Sent: Pre-Drywall Intro for ${lead.propertyName || 'New Build'}`);
        const summary = [
          `New Construction Introduction Sent:`,
          `• Target Property: ${lead.address}`,
          `• Recipient: ${lead.ownerEmail}`,
          `• Dossier: ${emailData.dossierUrl}`,
          ``,
          `Dispatched from inspect@foresightcmi.com via Google Workspace SMTP.`
        ].join('\n');

        await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
          method: 'POST',
          headers: {
            'Title': title,
            'Priority': 'default',
            'Tags': 'email,building_construction'
          },
          body: Buffer.from(summary, 'utf8')
        });
      } catch (e) {
        console.warn('⚠️ Push notification failed:', e.message);
      }

    } catch (err) {
      console.error(`❌ [New Construction Outreach] Failed sending to ${lead.ownerEmail}:`, err.message);
    }
  }

  fs.writeFileSync(OUTREACH_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
  console.log('🏁 [New Construction Outreach] Outreach run completed.\n');
}

main().catch(err => {
  console.warn('⚠️ [New Construction Outreach] Non-fatal runtime notice:', err.message);
  process.exit(0);
});
