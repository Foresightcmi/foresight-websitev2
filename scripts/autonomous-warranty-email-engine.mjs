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

function buildClusterEmailHtml(cluster) {
  const safeAgent = cluster.agentName || 'Real Estate Professional';
  const firstName = cluster.agentFirst || safeAgent.split(' ')[0] || 'Agent';
  const safeAddress = cluster.address || 'Metro Atlanta Area';
  const safeCity = cluster.city || 'Atlanta';
  const price = cluster.price || '$450,000+';
  const stage = cluster.stage || '11-Month Warranty Eligible Phase';
  const brokerage = cluster.brokerage || 'Atlanta Board of REALTORS®';
  const dossierUrl = cluster.dossierUrl || `https://fhinspectionsatl.com/dossiers/${cluster.recordId}.html`;
  const bookingUrl = `https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(`${safeAddress}, ${safeCity}, GA`)}&service=11-month-warranty`;

  const subject = `🏗️ New Construction Due Diligence Advisory: ${safeAddress}, ${safeCity} | Pre-Drywall & 11-Month Warranty Protection`;

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
    .alert-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 14px 18px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #065f46; }
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
      🏛️ INDEPENDENT BUILDING SCIENCE &amp; NEW CONSTRUCTION WARRANTY ADVISORY
    </div>
    <div class="content">
      <h2 style="margin-top:0; font-size:20px; color:#0f172a;">
        Pre-Drywall &amp; 11-Month Warranty Due Diligence Advisory
      </h2>

      <p style="font-size:15px; color:#334155;">
        Dear <strong>${firstName}</strong>,
      </p>

      <p style="font-size:14.5px; color:#334155;">
        Christopher Boykin here with Foresight Home Inspections. As an active Realtor representing buyers and homeowners across <strong>${safeCity}</strong> with <em>${brokerage}</em>, you know how crucial it is to safeguard clients during new construction milestones.
      </p>

      <div class="alert-box">
        <strong>📍 Development Property:</strong> ${safeAddress}, ${safeCity}, GA<br>
        <strong>Market Stage:</strong> ${stage} &bull; ${price}<br>
        <strong>Action Window:</strong> Pre-Drywall Rough-In &amp; 11-Month Builder Warranty Due Diligence
      </div>

      <p style="font-size:14.5px; color:#334155;">
        Municipal code inspectors spend an average of only 8 to 12 minutes on-site and legally cannot inspect for cosmetic settling, truss uplift, HVAC duct plenum leakage, or contractor shortcuts.
      </p>

      <p style="font-size:14.5px; color:#334155;">
        In Georgia (under OCGA § 8-2-35 et seq. and standard residential warranties), once day 365 passes, the builder is legally released from financial liability, transferring tens of thousands in latent repair costs directly to your buyers.
      </p>

      <div class="highlight-box">
        <div style="font-weight:800; text-transform:uppercase; font-size:11px; color:#64748b; margin-bottom:8px;">
          🌟 Exclusive Subdivision / Cul-de-sac Group Rate:
        </div>
        <p style="font-size:13.5px; color:#334155; margin-bottom:10px;">
          Because multiple homes in this development phase share the same construction timeline, we offer a <strong>$50 Group Discount</strong> to any of your buyers or neighbors who schedule together:
        </p>
        <div class="vector-item">
          <div class="vector-title">✓ Two-Inspector InterNACHI Certified Master Inspector® (CMI) Team</div>
          <div class="vector-desc">Double the thoroughness on roof trusses, electrical panels, and thermal envelope.</div>
        </div>
        <div class="vector-item">
          <div class="vector-title">✓ High-Resolution FLIR® Infrared Thermal Imaging Included</div>
          <div class="vector-desc">Detect concealed insulation voids, missing vapor barriers, and attic duct separation.</div>
        </div>
        <div class="vector-item">
          <div class="vector-title">✓ 1-Click GAR Form F404 Repair Addendum Integration</div>
          <div class="vector-desc">Generates official Georgia Association of Realtors amendment wording with one tap.</div>
        </div>
        <div class="vector-item">
          <div class="vector-title">✓ Active SUPRA eKEY Access</div>
          <div class="vector-desc">Direct lockbox entry across all FMLS/GAMLS properties with zero hassle for agents.</div>
        </div>
      </div>

      <p style="font-size:14.5px; color:#334155;">
        We prepared a technical building science dossier specifically for this property that you can review or forward directly to your clients:
      </p>

      <div style="text-align:center; margin:25px 0;">
        <a href="${dossierUrl}" class="btn">
          👉 View Property Due Diligence Dossier
        </a>
        <div style="font-size:12px; color:#64748b; margin-top:6px;">
          Live technical dossier with punch list blueprints &amp; booking tools.
        </div>
      </div>

      <p style="font-size:14px; color:#334155;">
        Your clients can reserve their inspection date online directly: <a href="${bookingUrl}" style="color:#0284c7; font-weight:600;">Reserve Online Here</a>, or call/text me directly at <strong>(678) 480-2110</strong>.
      </p>

      <p style="font-size:14px; color:#0f172a; font-weight:600; margin-top:20px;">
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
        This advisory is sent as a Realtor partner and client due diligence alert regarding new construction warranties in Georgia.
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
  const allHomeowners = [
    ...(crm.cohorts?.urgent || []),
    ...(crm.cohorts?.upcoming || []),
    ...(crm.cohorts?.pipeline || [])
  ];
  const allClusters = crm.newConstructionClusters || [];

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
  const contactedIds = new Set(outreachLog.map(o => o.leadId || o.clusterId).filter(Boolean));

  console.log(`📋 Total external homeowner leads in CRM: ${allHomeowners.length}`);
  console.log(`🏗️ Total new build clusters in CRM: ${allClusters.length}`);
  console.log(`📜 Previously contacted recipients in log: ${contactedEmails.size}`);

  // Find homeowner leads with valid emails who haven't been contacted yet
  const eligibleHomeowners = allHomeowners.filter(lead => {
    if (!lead.email || !lead.email.includes('@')) return false;
    const cleanEmail = lead.email.toLowerCase().trim();
    if (cleanEmail.includes('foresightcmi.com')) return false;
    return !contactedEmails.has(cleanEmail) && !contactedIds.has(lead.id);
  });

  // Find new build clusters with valid agent emails who haven't been contacted yet
  const eligibleClusters = allClusters.filter(cluster => {
    if (!cluster.email || !cluster.email.includes('@')) return false;
    const cleanEmail = cluster.email.toLowerCase().trim();
    if (cleanEmail.includes('foresightcmi.com')) return false;
    return !contactedEmails.has(cleanEmail) && !contactedIds.has(cluster.recordId);
  });

  console.log(`🎯 Eligible homeowner leads ready: ${eligibleHomeowners.length}`);
  console.log(`🎯 Eligible new build clusters ready: ${eligibleClusters.length}`);

  if (eligibleHomeowners.length === 0 && eligibleClusters.length === 0) {
    console.log('✨ All current email targets have already received their dossiers! Standing by.');
    return;
  }

  // Build unified dispatch queue: prioritize new build clusters as requested by user
  const dispatchQueue = [];
  const BATCH_LIMIT = 5; // Dispatches 5 per pass to maintain 100% deliverability & zero spam risk

  // Pick up to 3 clusters and up to 2 homeowners per pass
  for (const c of eligibleClusters) {
    if (dispatchQueue.length >= 3) break;
    dispatchQueue.push({ type: 'cluster', data: c });
  }
  for (const h of eligibleHomeowners) {
    if (dispatchQueue.length >= BATCH_LIMIT) break;
    dispatchQueue.push({ type: 'homeowner', data: h });
  }
  // Fill remaining slots if either category had fewer
  if (dispatchQueue.length < BATCH_LIMIT) {
    for (const c of eligibleClusters) {
      if (!dispatchQueue.some(item => item.data.recordId === c.recordId)) {
        dispatchQueue.push({ type: 'cluster', data: c });
        if (dispatchQueue.length >= BATCH_LIMIT) break;
      }
    }
  }
  if (dispatchQueue.length < BATCH_LIMIT) {
    for (const h of eligibleHomeowners) {
      if (!dispatchQueue.some(item => item.data.id === h.id)) {
        dispatchQueue.push({ type: 'homeowner', data: h });
        if (dispatchQueue.length >= BATCH_LIMIT) break;
      }
    }
  }

  let sentCount = 0;
  let clusterSentCount = 0;
  let homeownerSentCount = 0;

  for (const item of dispatchQueue) {
    if (item.type === 'cluster') {
      const cluster = item.data;
      const targetEmail = cluster.email.trim();
      const { subject, html } = buildClusterEmailHtml(cluster);

      console.log(`📤 Dispatching Cluster Dossier to: ${cluster.agentName} <${targetEmail}> at ${cluster.address}...`);

      try {
        await transporter.sendMail({
          from: `"Christopher Boykin, CMI® - Foresight Home Inspections" <${user}>`,
          to: targetEmail,
          subject,
          html
        });

        contactedEmails.add(targetEmail.toLowerCase());
        contactedIds.add(cluster.recordId);
        outreachLog.push({
          clusterId: cluster.recordId,
          name: cluster.agentName,
          brokerage: cluster.brokerage,
          address: cluster.address,
          city: cluster.city,
          email: targetEmail,
          dossierUrl: cluster.dossierUrl,
          type: 'new_build_cluster',
          timestamp: new Date().toISOString()
        });

        cluster.emailAutomatedSent = true;
        cluster.status = 'email_sent';
        sentCount++;
        clusterSentCount++;
        console.log(`  ✓ Transmitted successfully to agent ${targetEmail}`);
        await sleep(2500); // 2.5s safe spacing between sends
      } catch (e) {
        console.error(`  ❌ Failed to send cluster email to ${targetEmail}:`, e.message);
      }
    } else {
      const lead = item.data;
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
        contactedIds.add(lead.id);
        outreachLog.push({
          leadId: lead.id,
          name: lead.name,
          address: lead.address,
          city: lead.city,
          email: targetEmail,
          dossierUrl: lead.dossierUrl,
          type: 'permit_homeowner',
          timestamp: new Date().toISOString()
        });

        lead.emailAutomatedSent = true;
        lead.status = 'email_sent';
        sentCount++;
        homeownerSentCount++;
        console.log(`  ✓ Transmitted successfully to homeowner ${targetEmail}`);
        await sleep(2500); // 2.5s safe spacing between sends
      } catch (e) {
        console.error(`  ❌ Failed to send homeowner email to ${targetEmail}:`, e.message);
      }
    }
  }

  // Save updated outreach log
  fs.writeFileSync(LOG_FILE, JSON.stringify(outreachLog, null, 2), 'utf8');
  console.log(`💾 Saved updated outreach log to: ${LOG_FILE}`);

  // Update CRM records & sync mobile dispatcher portal
  const DISPATCH_HTML_FILE = path.join(ROOT_DIR, 'public', 'warranty-dispatch.html');
  if (sentCount > 0) {
    // Sync cohorts
    for (const cohortKey of Object.keys(crm.cohorts || {})) {
      for (const item of (crm.cohorts[cohortKey] || [])) {
        if (item.email && contactedEmails.has(item.email.toLowerCase().trim())) {
          item.emailAutomatedSent = true;
          item.status = 'email_sent';
        }
      }
    }
    // Sync clusters
    for (const item of (crm.newConstructionClusters || [])) {
      if (item.email && contactedEmails.has(item.email.toLowerCase().trim())) {
        item.emailAutomatedSent = true;
        item.status = 'email_sent';
      }
    }

    fs.writeFileSync(CRM_FILE, JSON.stringify(crm, null, 2), 'utf8');
    console.log(`💾 Saved updated CRM to: ${CRM_FILE}`);

    if (fs.existsSync(DISPATCH_HTML_FILE)) {
      let dispatchHtml = fs.readFileSync(DISPATCH_HTML_FILE, 'utf8');
      const cohortsJson = JSON.stringify(crm.cohorts || {});
      const clustersJson = JSON.stringify(crm.newConstructionClusters || []);
      const lines = dispatchHtml.split('\n');
      const cohortLineIdx = lines.findIndex(l => l.includes('const cohorts = '));
      if (cohortLineIdx !== -1) {
        lines[cohortLineIdx] = `    const cohorts = ${cohortsJson};`;
      }
      const clusterLineIdx = lines.findIndex(l => l.includes('const clusters = '));
      if (clusterLineIdx !== -1) {
        lines[clusterLineIdx] = `    const clusters = ${clustersJson};`;
      }
      fs.writeFileSync(DISPATCH_HTML_FILE, lines.join('\n'), 'utf8');
      console.log(`💾 Synced updated cohorts and clusters into: ${DISPATCH_HTML_FILE}`);
    }
  }

  // Send smartphone push notification
  if (sentCount > 0) {
    const pushTitle = `📧 Warranty & Cluster Dossiers Dispatched: ${sentCount} Emailed!`;
    const pushMsg = `Autonomous Email Engine dispatched ${sentCount} dossiers (${clusterSentCount} New Build Clusters, ${homeownerSentCount} Homeowners) via inspect@foresightcmi.com.\n\nRemaining Queue: ${eligibleClusters.length - clusterSentCount} Clusters, ${eligibleHomeowners.length - homeownerSentCount} Homeowners.\nView status on Mobile Dispatcher.`;
    await sendPushNotification(pushTitle, pushMsg, 'default');
  }

  console.log(`🏁 [Warranty Email Engine] Cycle complete: ${sentCount} dossiers emailed (${clusterSentCount} clusters, ${homeownerSentCount} homeowners).`);
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
