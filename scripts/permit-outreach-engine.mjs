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
 * Builds both plain text and luxury HTML email for the homeowner/builder.
 */
function buildDueDiligenceEmail(lead) {
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
      Serving Metro Atlanta & 77+ Cities Across 20 Georgia Counties.<br>
      This confidential building science advisory was prepared using public municipal permitting records.
    </div>
  </div>
</body>
</html>
  `;

  return { subject, bodyText, html, dossierUrl };
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
    console.error('❌ [Outreach Engine] EMAIL_PASSWORD not found in environment or .env.local');
    process.exit(1);
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

  const queue = enrichedLeads.filter(l => l.ownerEmail && !contactedEmails.has(l.ownerEmail));
  console.log(`📬 [Outreach Engine] Found ${queue.length} actionable verified leads in queue.`);

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
        inspectionTarget: 'Pre-Drywall Rough-In ($475 - $850)'
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
