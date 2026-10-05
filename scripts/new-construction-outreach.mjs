import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'new-construction-leads.json');
const OUTREACH_FILE = path.join(ROOT_DIR, 'data', 'new-construction-outreach-log.json');
const HOT_SHEET_CSV = path.join(ROOT_DIR, 'data', 'new-construction-hot-sheet.csv');
const ENV_LOCAL_FILE = path.join(ROOT_DIR, '.env.local');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

function cleanHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '').trim();
}

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

/**
 * Builds email specifically targeting New Construction Buyers & Buyer Representation
 */
function buildNewConstructionEmail(lead) {
  const recipientName = lead.ownerName || 'Future Homeowner / Buyer Agent';
  const address = lead.address;
  const valuation = Number(lead.price || 0).toLocaleString();
  const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/${lead.recordId}.html`;

  const subject = `Critical Pre-Drywall & Due Diligence Advisory: ${address} (Valuation: $${valuation})`;

  const bodyText = `Dear ${recipientName},

Our building science monitoring network has flagged new construction activity at ${address} (Estimated Value: $${valuation}).

As this home approaches or completes the rough-in framing stage, we are issuing this confidential 3rd-party due diligence advisory regarding the critical "Pre-Drywall Concealment Window."

The Harsh Reality of New Construction:
Most buyers assume that municipal city or county code inspectors thoroughly verify construction quality. In reality, municipal code inspectors spend an average of under 12 to 15 minutes on site, carry zero legal liability if defects fail later, and only check bare-minimum life-safety codes.

Once sheetrock is hung, over 80% of the home's framing, plumbing stacks, electrical loops, and HVAC ductwork are permanently sealed behind walls:
• Severed or over-notched floor joists and load-bearing studs cut by subcontractors
• Missing hurricane tie-down clips and roof truss anchors
• Disconnected, pinched, or uninsulated attic HVAC ducts
• Missing nail plates on studs risking drywall screw punctures into electrical/PEX lines
• Thermal voids and uninsulated exterior wall cavities behind bathtubs

The Foresight CMI® Two-Inspector Advantage:
• Two Certified Master Inspectors on Every Job: Concurrently inspecting structural, mechanical, and rough-in assemblies.
• High-Resolution FLIR® Thermal Infrared Scans Included Free.
• Comprehensive Digital Report with HD Photos and Video within 24 Hours for the builder blue-tape repair mandate.
• Up to $35,000 in Combined Warranty & Guarantee Protection, including InterNACHI's "We'll Buy Your Home Back" Guarantee.

👉 Open Your Custom Due Diligence Dossier:
${dossierUrl}

👉 Learn more or book directly:
https://www.fhinspectionsatl.com/quote

To schedule your Pre-Drywall Framing Evaluation or Pre-Closing Walkthrough, reply to this email, book online 24/7, or contact our lead Certified Master Inspector directly at (678) 480-2110.

Respectfully,

Christopher Boykin, CMI®
Lead Inspector & Founder | Foresight Home Inspections, LLC
Certified Master Inspector® #MICB-1082 | InterNACHI Member #NACHI20061502
Direct: (678) 480-2110 | Office: inspect@foresightcmi.com
Serving Metro Atlanta & 77+ Cities Across 20 Georgia Counties
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
    .warning-bar { background: #9b2c2c; color: #ffffff; padding: 8px 15px; font-size: 13px; font-weight: 700; text-align: center; }
    .content { padding: 35px 30px; }
    h1 { font-size: 20px; color: #0f172a; margin-top: 0; }
    .highlight-box { background: #fffdf5; border-left: 4px solid #d4af37; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .danger-box { background: #fff5f5; border-left: 4px solid #e53e3e; padding: 18px; margin: 20px 0; border-radius: 4px; }
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
      🛡️ INDEPENDENT 3RD-PARTY BUILDING SCIENCE ADVISORY
    </div>
    <div class="warning-bar">
      ⚠️ TIME-SENSITIVE: PRE-DRYWALL CONCEALMENT MILESTONE
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Dear <strong>${recipientName}</strong>,</p>

      <p>Building intelligence records indicate active new construction at <strong>${address}</strong> (Valuation: $${valuation}).</p>

      <div class="danger-box">
        <strong style="color: #9b2c2c;">⚠️ The Drywall Concealment Warning:</strong><br>
        Once drywall is hung, <strong>over 80% of your home's framing, plumbing lines, electrical runs, and HVAC ductwork become permanently invisible</strong>. Municipal code inspectors average under 12 to 15 minutes per site and carry zero liability if concealed defects fail later.
      </div>

      <div class="highlight-box">
        <strong>The Foresight CMI® Two-Inspector Advantage:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #334155;">
          <li><strong>Two Certified Inspectors:</strong> Evaluating structural framing, MEP, and building envelope.</li>
          <li><strong>FLIR® Thermal Infrared Scans:</strong> Uncovering hidden insulation voids and thermal leaks.</li>
          <li><strong>Contractual Blue-Tape Report:</strong> Forcing the builder to fix defects on their dime before closing.</li>
          <li><strong>Up to $35,000 Guarantee:</strong> InterNACHI Buy-Back Guarantee + 90-Day Structural Warranty.</li>
        </ul>
      </div>

      <p>To view the full engineering and building science audit for this property, open your official <strong>Due Diligence Dossier</strong>:</p>

      <div style="text-align: center;">
        <a href="${dossierUrl}" class="btn">📄 Open Your Property Dossier &rarr;</a>
      </div>

      <p>You can reserve your inspection online 24/7 at <a href="https://www.fhinspectionsatl.com/quote" style="color: #d4af37; font-weight: bold;">fhinspectionsatl.com/quote</a> or contact our lead Certified Master Inspector directly at <strong>(678) 480-2110</strong>.</p>

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
      Serving Metro Atlanta &amp; 77+ Cities Across 20 Georgia Counties.<br>
      This confidential building science advisory was prepared using public MLS and municipal permitting records.
    </div>
  </div>
</body>
</html>
  `;

  return { subject, bodyText, html, dossierUrl };
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

  const contactedIds = new Set(outreachLog.map(o => o.recordId));
  const actionableLeads = leads.filter(l => l.ownerEmail && !contactedIds.has(l.recordId));

  console.log(`📬 [New Construction Outreach] Actionable email leads ready for dispatch: ${actionableLeads.length}`);

  const { user, pass } = getEmailCredentials();
  if (!pass) {
    console.warn('⚠️ [New Construction Outreach] EMAIL_PASSWORD not found. Email transmission skipped.');
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
    const emailData = buildNewConstructionEmail(lead);
    console.log(`📨 [New Construction Outreach] Transmitting advisory for ${lead.address} to ${lead.ownerEmail}...`);

    try {
      const info = await transporter.sendMail({
        from: `"Christopher Boykin, CMI® - Foresight Inspections" <${user}>`,
        to: lead.ownerEmail,
        subject: emailData.subject,
        text: emailData.bodyText,
        html: emailData.html
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
        const title = cleanHeader(`🚀 Sent: Pre-Drywall Advisory for ${lead.propertyName || 'New Build'}`);
        const summary = [
          `New Construction Due Diligence Advisory Sent:`,
          `• Target Property: ${lead.address}`,
          `• Valuation: $${Number(lead.price || 0).toLocaleString()}`,
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
