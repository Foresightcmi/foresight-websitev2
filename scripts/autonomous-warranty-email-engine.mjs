import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CRM_FILE = path.join(ROOT_DIR, 'data', 'warranty-tracker-crm.json');
const LOG_FILE = path.join(ROOT_DIR, 'data', 'warranty-outreach-log.json');
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
        'Tags': 'shield,envelope,zap'
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

function buildWarrantyEmailHtml(lead) {
  const safeName = lead.name || 'Homeowner';
  const firstName = lead.firstName || safeName.split(' ')[0] || 'Homeowner';
  const safeAddress = lead.address || 'Metro Atlanta Area';
  const safeCity = lead.city || 'Atlanta';
  const deadlineStr = lead.metrics?.deadlineStr || 'Late 2026';
  const daysRemaining = lead.metrics?.daysUntilDeadline || 30;
  const dossierUrl = lead.dossierUrl || `https://fhinspectionsatl.com/dossiers/warranty-${lead.id}.html`;
  const bookingUrl = `https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(`${safeAddress}, ${safeCity}, GA`)}&service=11-month-warranty`;

  const urgencyText = daysRemaining <= 30
    ? `expires in less than 30 days (${deadlineStr})`
    : `expires in approximately ${Math.max(1, Math.round(daysRemaining / 7))} weeks (${deadlineStr})`;

  const subject = `🛡️ 11-Month Builder Warranty Notice: ${safeAddress}, ${safeCity} | Action Required Before Day 365`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; line-height: 1.6; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 25px 30px; text-align: center; }
    .header img { height: 60px; width: auto; }
    .banner { background: #d4af37; color: #0f172a; padding: 8px 15px; font-size: 13px; font-weight: 800; text-align: center; letter-spacing: 0.5px; }
    .alert-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 18px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #991b1b; }
    .content { padding: 30px; }
    .highlight-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; font-size: 14px; }
    .vector-item { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    .vector-item:last-child { border-bottom: none; }
    .vector-title { font-weight: 700; color: #0f172a; }
    .vector-desc { font-size: 13px; color: #64748b; margin-top: 2px; }
    .btn { display: inline-block; background: #d4af37; color: #0f172a !important; font-weight: 800; font-size: 14.5px; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 18px 0; text-align: center; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.35); }
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
      🏛️ INDEPENDENT BUILDING SCIENCE &amp; BUILDER WARRANTY AUDIT
    </div>
    <div class="content">
      <h2 style="margin-top:0; font-size:20px; color:#0f172a;">
        Confidential 11-Month Warranty Due Diligence Notice
      </h2>

      <p style="font-size:15px; color:#334155;">
        Dear <strong>${safeName}</strong>,
      </p>

      <div class="alert-box">
        <strong>⚠️ 365-Day Builder Warranty Expiration Notice:</strong><br>
        Your home's 1-year builder warranty for <strong>${safeAddress}, ${safeCity}, GA</strong> ${urgencyText}.
      </div>

      <p style="font-size:14.5px; color:#334155;">
        In Georgia (under OCGA § 8-2-35 et seq. and standard residential builder warranties), the homebuilder is legally obligated to repair latent structural settlement, drywall truss uplift, plumbing deflections, and HVAC duct plenum failures at their expense—<strong>provided deficiencies are formally documented and submitted before Day 365</strong>.
      </p>

      <p style="font-size:14.5px; color:#334155;">
        Once that 365-day cutoff date strikes, the builder is legally released from liability, and all repair costs permanently become your personal financial responsibility.
      </p>

      <div class="highlight-box">
        <div style="font-weight:800; text-transform:uppercase; font-size:11px; color:#64748b; margin-bottom:8px;">
          Top Month-11 Building Science Vectors We Inspect:
        </div>
        <div class="vector-item">
          <div class="vector-title">1. Drywall Truss Uplift &amp; Ceiling Cracks</div>
          <div class="vector-desc">Winter attic thermal contraction bowing roof truss bottom chords off wall plates.</div>
        </div>
        <div class="vector-item">
          <div class="vector-title">2. Foundation Perimeter Backfill Settlement</div>
          <div class="vector-desc">Loose soil trench compaction reversing grade and trapping stormwater against masonry.</div>
        </div>
        <div class="vector-item">
          <div class="vector-title">3. Attic Duct Plenum Separation (FLIR® Thermal Scan)</div>
          <div class="vector-desc">Chilled AC air dumping into 140°F Georgia attics causing hot spots and high power bills.</div>
        </div>
        <div class="vector-item">
          <div class="vector-title">4. Drain Line Deflection &amp; Concealed Plumbing Seepage</div>
          <div class="vector-desc">Initial slab settling straining PVC drain stacks behind vanities and kitchen islands.</div>
        </div>
      </div>

      <p style="font-size:14.5px; color:#334155;">
        Builders routinely dismiss handwritten homeowner lists as <em>"normal cosmetic settling"</em>. However, builder superintendents legally must respond to an official <strong>InterNACHI Certified Master Inspector® (CMI)</strong> engineering punch list supported by calibrated infrared thermal imaging and building code citations.
      </p>

      <div style="text-align:center; margin:25px 0;">
        <a href="${dossierUrl}" class="btn">
          👉 View Your Property's 11-Month Warranty Dossier
        </a>
        <div style="font-size:12px; color:#64748b; margin-top:6px;">
          Includes live 365-day countdown clock and settlement diagnostics.
        </div>
      </div>

      <p style="font-size:14px; color:#334155;">
        If you would like to reserve your inspection slot before your builder cutoff date, you can lock in your date directly through your dossier or contact me personally:
      </p>

      <p style="font-size:14px; color:#0f172a; font-weight:600;">
        Christopher Boykin, CMI®<br>
        <span style="color:#64748b; font-weight:400;">Certified Master Inspector® &bull; InterNACHI®</span><br>
        Direct: <a href="tel:+16784802110" style="color:#0f172a; text-decoration:none;">(678) 480-2110</a><br>
        Web: <a href="https://fhinspectionsatl.com" style="color:#d4af37;">https://fhinspectionsatl.com</a>
      </p>
    </div>
    <div class="footer">
      <p>
        <strong>Foresight Home Inspections</strong> &bull; Metro Atlanta, GA<br>
        InterNACHI® Certified Master Inspector Team &bull; $100,000 Buy-Back Guarantee &bull; 5.0★ Google Verified
      </p>
      <p style="margin-top:10px; font-size:11px; color:#64748b;">
        This advisory is sent as a consumer protection building science notice regarding 1-year builder warranty covenants. If you no longer own this property, you may disregard this notice.
      </p>
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}

async function main() {
  console.log('🚀 [Warranty Email Engine] Initializing Autonomous Email Dispatch...');

  const { user, pass } = getEmailCredentials();
  if (!pass) {
    console.error('❌ [Warranty Email Engine] EMAIL_PASSWORD not found in environment.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  try {
    await transporter.verify();
    console.log(`✅ [Warranty Email Engine] SMTP connection verified for ${user}`);
  } catch (err) {
    console.error('❌ [Warranty Email Engine] SMTP connection failed:', err.message);
    process.exit(1);
  }

  if (!fs.existsSync(CRM_FILE)) {
    console.error(`❌ CRM file not found: ${CRM_FILE}`);
    process.exit(1);
  }

  const crm = JSON.parse(fs.readFileSync(CRM_FILE, 'utf8'));
  const allLeads = [
    ...(crm.cohorts?.urgent || []),
    ...(crm.cohorts?.upcoming || []),
    ...(crm.cohorts?.pipeline || [])
  ];

  // Load Outreach Log to prevent duplicate sends
  let outreachLog = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      outreachLog = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch {
      outreachLog = [];
    }
  }
  const contactedEmails = new Set(outreachLog.map(o => o.email.toLowerCase()));

  console.log(`📋 Total external leads in CRM: ${allLeads.length}`);
  console.log(`📜 Previously contacted leads in log: ${contactedEmails.size}`);

  // Find leads with valid emails who haven't been contacted yet
  const eligibleLeads = allLeads.filter(lead => {
    if (!lead.email || !lead.email.includes('@')) return false;
    const cleanEmail = lead.email.toLowerCase().trim();
    if (cleanEmail.includes('foresightcmi.com')) return false;
    return !contactedEmails.has(cleanEmail);
  });

  console.log(`🎯 Eligible leads ready for autonomous email dispatch: ${eligibleLeads.length}`);

  if (eligibleLeads.length === 0) {
    console.log('✨ All current email leads have already received their dossiers! Standing by.');
    return;
  }

  let sentCount = 0;
  const BATCH_LIMIT = 5; // Dispatches 5 per pass to maintain 100% deliverability & zero spam risk

  for (const lead of eligibleLeads) {
    const targetEmail = lead.email.trim();
    const { subject, html } = buildWarrantyEmailHtml(lead);

    console.log(`📤 Dispatching Warranty Dossier to: ${lead.name} <${targetEmail}> at ${lead.address}...`);

    try {
      await transporter.sendMail({
        from: `"Christopher Boykin, CMI® - Foresight Home Inspections" <${user}>`,
        to: targetEmail,
        subject,
        html
      });

      contactedEmails.add(targetEmail.toLowerCase());
      outreachLog.push({
        leadId: lead.id,
        name: lead.name,
        address: lead.address,
        city: lead.city,
        email: targetEmail,
        dossierUrl: lead.dossierUrl,
        timestamp: new Date().toISOString()
      });

      sentCount++;
      console.log(`  ✓ Transmitted successfully to ${targetEmail}`);
      await sleep(2500); // 2.5s safe spacing between sends
    } catch (e) {
      console.error(`  ❌ Failed to send to ${targetEmail}:`, e.message);
    }

    if (sentCount >= BATCH_LIMIT) {
      console.log(`🛑 Batch limit of ${BATCH_LIMIT} reached for this execution cycle.`);
      break;
    }
  }

  // Save updated outreach log
  fs.writeFileSync(LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
  console.log(`💾 Saved updated outreach log to: ${LOG_FILE}`);

  // Update CRM records & sync mobile dispatcher portal
  const DISPATCH_HTML_FILE = path.join(ROOT_DIR, 'public', 'warranty-dispatch.html');
  if (sentCount > 0) {
    for (const cohortKey of Object.keys(crm.cohorts || {})) {
      for (const item of (crm.cohorts[cohortKey] || [])) {
        if (item.email && contactedEmails.has(item.email.toLowerCase().trim())) {
          item.emailAutomatedSent = true;
          item.status = 'email_sent';
        }
      }
    }
    fs.writeFileSync(CRM_FILE, JSON.stringify(crm, null, 2), 'utf8');
    console.log(`💾 Saved updated CRM to: ${CRM_FILE}`);

    if (fs.existsSync(DISPATCH_HTML_FILE)) {
      const dispatchHtml = fs.readFileSync(DISPATCH_HTML_FILE, 'utf8');
      const cohortsJson = JSON.stringify(crm.cohorts || {});
      const lines = dispatchHtml.split('\n');
      const cohortLineIdx = lines.findIndex(l => l.includes('const cohorts = '));
      if (cohortLineIdx !== -1) {
        lines[cohortLineIdx] = `    const cohorts = ${cohortsJson};`;
        fs.writeFileSync(DISPATCH_HTML_FILE, lines.join('\n'), 'utf8');
        console.log(`💾 Synced updated cohorts into: ${DISPATCH_HTML_FILE}`);
      }
    }
  }

  // Send push notification
  if (sentCount > 0) {
    const pushTitle = `📧 Warranty Dossiers Dispatched: ${sentCount} Leads Emailed!`;
    const pushMsg = `Autonomous Email Dispatch Engine sent ${sentCount} 11-Month Warranty Dossiers via inspect@foresightcmi.com.\n\nRemaining email queue: ${eligibleLeads.length - sentCount}\nCheck dispatcher portal for SMS tracking.`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  }

  console.log(`🏁 [Warranty Email Engine] Cycle complete: ${sentCount} dossiers emailed.`);
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
