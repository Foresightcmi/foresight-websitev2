import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PAST_CLIENTS_FILE = path.join(ROOT_DIR, 'data', 'past-clients.json');
const NEW_CONSTRUCTION_FILE = path.join(ROOT_DIR, 'data', 'new-construction-leads.json');
const REALTORS_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const OUTPUT_CRM_FILE = path.join(ROOT_DIR, 'data', 'warranty-tracker-crm.json');
const OUTPUT_HTML_FILE = path.join(ROOT_DIR, 'public', 'warranty-dispatch.html');
const DOSSIERS_DIR = path.join(ROOT_DIR, 'public', 'dossiers');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

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
        'Tags': 'shield,calendar,wrench,bell'
      },
      body: message
    });
    console.log(`📱 [Push Alert] Sent to ntfy.sh/${NTFY_TOPIC}: "${title}"`);
  } catch (err) {
    console.warn('⚠️ [Push Alert] Failed to send ntfy alert:', err.message);
  }
}

function cleanPhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/[^0-9]/g, '');
}

function formatPhoneDisplay(phone) {
  const digits = cleanPhone(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone || '';
}

function parseInspectionDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function calculateWarrantyMetrics(inspDate, now = new Date()) {
  const diffMs = now - inspDate;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = (now.getFullYear() - inspDate.getFullYear()) * 12 + (now.getMonth() - inspDate.getMonth());
  const oneYearDeadline = new Date(inspDate);
  oneYearDeadline.setFullYear(oneYearDeadline.getFullYear() + 1);
  const daysUntilDeadline = Math.round((oneYearDeadline - now) / (1000 * 60 * 60 * 24));

  let urgencyTier = 'pipeline';
  let badgeColor = '#3b82f6'; // Blue
  let badgeLabel = 'Future Pipeline';

  if (diffMonths >= 10 && diffMonths <= 12) {
    urgencyTier = 'urgent';
    badgeColor = '#ef4444'; // Red
    badgeLabel = 'DUE NOW (Months 10–12)';
  } else if (diffMonths >= 8 && diffMonths < 10) {
    urgencyTier = 'upcoming';
    badgeColor = '#f59e0b'; // Gold
    badgeLabel = 'UPCOMING (Months 8–10)';
  } else if (diffMonths >= 6 && diffMonths < 8) {
    urgencyTier = 'pipeline';
    badgeColor = '#10b981'; // Emerald
    badgeLabel = 'PIPELINE (Months 6–8)';
  } else if (diffMonths > 12) {
    urgencyTier = 'past_year';
    badgeColor = '#6b7280'; // Gray
    badgeLabel = 'Annual Maintenance';
  }

  return {
    diffDays,
    diffMonths,
    daysUntilDeadline,
    urgencyTier,
    badgeColor,
    badgeLabel,
    deadlineStr: oneYearDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

function generateHomeownerSms(firstName, address, city, serviceType, daysUntilDeadline, dossierUrl) {
  const addrText = address ? ` at ${address}` : '';
  const cityText = city ? ` in ${city}` : '';
  const deadlineText = daysUntilDeadline <= 30
    ? `in less than 30 days`
    : `in approximately ${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks`;

  const isNewBuild = serviceType && serviceType.toLowerCase().includes('new construction');
  
  if (isNewBuild) {
    return `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections. Checking in on your home${addrText}${cityText}! Your 1-year builder warranty expires ${deadlineText}. Before that deadline passes and your builder is officially off the hook, we prepared an 11-Month Warranty Building Science Dossier for your property: ${dossierUrl} — Let's compile your InterNACHI punch list so the builder repairs items on their dime! Reply here or call (678) 480-2110`;
  }

  return `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections! Hard to believe it has been almost a year since inspecting your home${addrText}${cityText}. If you have an active 1-year home warranty or are approaching your builder milestone, having an independent annual inspection before the season changes ensures any hidden plumbing leaks, attic ventilation, or electrical hazards are documented before claims deadlines close: ${dossierUrl} — Have a wonderful week! (678) 480-2110`;
}

function generateHomeownerEmail(firstName, address, city, serviceType, daysUntilDeadline, deadlineStr, dossierUrl) {
  const deadlineText = daysUntilDeadline <= 30
    ? `in less than 30 days (${deadlineStr})`
    : `in approximately ${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks (${deadlineStr})`;

  const subject = `11-Month Builder Warranty Technical Dossier: ${address}, ${city} | Action Required Before Day 365`;
  
  const body = `Hi ${firstName},

Christopher Boykin here with Foresight Home Inspections.

I hope you've been settling in wonderfully at ${address} in ${city}!

Because your home's 1-year builder warranty reaches its official 365-day cutoff ${deadlineText}, our building science team prepared a confidential 11-Month Warranty Due Diligence Dossier specifically for your property:

👉 View Your Property Dossier: ${dossierUrl}

In Georgia, builders provide a 1-year builder warranty covering structural settlement, plumbing line deflections, drywall truss uplift, and HVAC duct plenum imbalances. However, once day 365 passes, the builder is legally released from financial liability, transferring all repair costs directly to the homeowner.

Builders routinely dismiss informal homeowner checklists as "normal cosmetic settling"—but they legally must respond to an official InterNACHI Certified Master Inspector® engineering punch list backed by thermal FLIR imaging and building code citations.

You can review your complete settlement diagnostic and reserve your 11-month inspection date directly inside your dossier:
${dossierUrl}

Feel free to reply directly to this email or call/text me at (678) 480-2110 if you have any questions about your home!

Warm regards,

Christopher Boykin, CMI®
Foresight Home Inspections
Certified Master Inspector® | InterNACHI®
Direct: (678) 480-2110
Web: https://fhinspectionsatl.com`;

  return { subject, body };
}

function generateRealtorCoopSms(agentName, clientName, address, city, daysUntilDeadline, dossierUrl) {
  const agentFirst = agentName ? agentName.trim().split(' ')[0] : 'there';
  const addrText = address ? ` at ${address}` : '';
  const cityText = city ? ` in ${city}` : '';

  return `Hi ${agentFirst}, Christopher Boykin with Foresight Home Inspections. Checking in because your past client ${clientName}${addrText}${cityText} is hitting their 1-year builder warranty milestone in ~${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks! Here is their 11-Month Warranty Dossier to forward them: ${dossierUrl} — Great touchpoint to protect their equity and stay top-of-mind! Let me know if you need anything. — (678) 480-2110`;
}

function generateRealtorCoopEmail(agentName, clientName, address, city, daysUntilDeadline, deadlineStr, dossierUrl) {
  const agentFirst = agentName ? agentName.trim().split(' ')[0] : 'there';
  const deadlineText = daysUntilDeadline <= 30
    ? `in less than 30 days (${deadlineStr})`
    : `in approximately ${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks (${deadlineStr})`;

  const subject = `Warranty Touchpoint for Your Client ${clientName} (${address})`;
  
  const body = `Hi ${agentFirst},

Christopher Boykin with Foresight Home Inspections here.

Checking in because your past buyer ${clientName} at ${address} in ${city} is hitting their 1-year builder warranty expiration ${deadlineText}!

This is a prime relationship touchpoint to check in, protect their equity, and stay top-of-mind for referrals before their builder warranty closes.

We've prepared an 11-Month Warranty Technical Dossier for their property that you can share with them:
👉 ${dossierUrl}

Let me know if you'd like us to pull their original inspection summary or if you need rapid due diligence scheduling for any buyers you have under contract this week!

Best regards,

Christopher Boykin, CMI®
Foresight Home Inspections
(678) 480-2110 | https://fhinspectionsatl.com/realtors`;

  return { subject, body };
}

async function main() {
  console.log('🛡️ [Warranty Tracker] Initializing 11-Month Warranty & Cluster Radar...');

  if (!fs.existsSync(PAST_CLIENTS_FILE)) {
    console.error(`❌ Past clients file not found at: ${PAST_CLIENTS_FILE}`);
    process.exit(1);
  }

  const rawClients = JSON.parse(fs.readFileSync(PAST_CLIENTS_FILE, 'utf8'));
  console.log(`📊 Loaded ${rawClients.length} total historical clients from database.`);

  // Load Realtors to match agent emails
  const realtorEmailMap = new Map();
  if (fs.existsSync(REALTORS_FILE)) {
    const rawRealtors = JSON.parse(fs.readFileSync(REALTORS_FILE, 'utf8'));
    rawRealtors.forEach(r => {
      if (r.name && r.email) realtorEmailMap.set(r.name.trim().toLowerCase(), r.email);
      if (r.clean_phone && r.email) realtorEmailMap.set(r.clean_phone, r.email);
    });
    console.log(`🤝 Indexed ${realtorEmailMap.size} realtor email contact points.`);
  }

  const now = new Date();
  const cohorts = {
    urgent: [],      // 10–12 months ago (action required now)
    upcoming: [],    // 8–10 months ago (prep window)
    pipeline: [],    // 6–8 months ago
    pastYear: []     // > 12 months (annual maintenance checkup)
  };

  const processedClients = [];

  for (const c of rawClients) {
    const inspDate = parseInspectionDate(c.date);
    if (!inspDate) continue;

    const metrics = calculateWarrantyMetrics(inspDate, now);
    const firstName = c.first || (c.name ? c.name.trim().split(' ')[0] : 'Homeowner');
    const cleanClientPhone = cleanPhone(c.raw_phone || c.phone);
    const cleanAgentPhone = cleanPhone(c.agent_phone);
    const clientId = c.id || `cl_${Math.random().toString(36).slice(2, 9)}`;

    // Client email lookup (check if present in client record)
    let clientEmail = c.email || c.client_email || '';
    if (!clientEmail && c.name && c.name.includes('@')) {
      const match = c.name.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (match) clientEmail = match[0];
    }

    // Agent email lookup
    let agentEmail = '';
    if (c.agent_name && realtorEmailMap.has(c.agent_name.trim().toLowerCase())) {
      agentEmail = realtorEmailMap.get(c.agent_name.trim().toLowerCase());
    } else if (cleanAgentPhone && realtorEmailMap.has(cleanAgentPhone)) {
      agentEmail = realtorEmailMap.get(cleanAgentPhone);
    }

    const dossierFilename = `warranty-${clientId}.html`;
    const dossierUrl = `https://fhinspectionsatl.com/dossiers/${dossierFilename}`;
    const dossierPath = `/dossiers/${dossierFilename}`;

    // SMS & Email payload generation
    const clientSmsBody = generateHomeownerSms(firstName, c.address, c.city, c.service, metrics.daysUntilDeadline, dossierUrl);
    const clientSmsLink = cleanClientPhone ? `sms:+1${cleanClientPhone}?&body=${encodeURIComponent(clientSmsBody)}` : '';
    const clientCallLink = cleanClientPhone ? `tel:+1${cleanClientPhone}` : '';

    const { subject: homeownerSubject, body: homeownerBody } = generateHomeownerEmail(
      firstName, c.address, c.city, c.service, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl
    );
    const clientEmailLink = `mailto:${clientEmail}?subject=${encodeURIComponent(homeownerSubject)}&body=${encodeURIComponent(homeownerBody)}`;

    let realtorSmsBody = '';
    let realtorSmsLink = '';
    let realtorEmailSubject = '';
    let realtorEmailBody = '';
    let realtorEmailLink = '';

    if (c.agent_name) {
      if (cleanAgentPhone) {
        realtorSmsBody = generateRealtorCoopSms(c.agent_name, c.name, c.address, c.city, metrics.daysUntilDeadline, dossierUrl);
        realtorSmsLink = `sms:+1${cleanAgentPhone}?&body=${encodeURIComponent(realtorSmsBody)}`;
      }
      const realtorEmailData = generateRealtorCoopEmail(
        c.agent_name, c.name, c.address, c.city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl
      );
      realtorEmailSubject = realtorEmailData.subject;
      realtorEmailBody = realtorEmailData.body;
      realtorEmailLink = `mailto:${agentEmail}?subject=${encodeURIComponent(realtorEmailSubject)}&body=${encodeURIComponent(realtorEmailBody)}`;
    }

    const item = {
      id: clientId,
      name: c.name || 'Valued Client',
      firstName,
      email: clientEmail,
      phone: formatPhoneDisplay(c.phone || c.raw_phone),
      cleanPhone: cleanClientPhone,
      address: c.address || 'Metro Atlanta Area',
      city: c.city || 'Atlanta',
      date: c.date,
      service: c.service || 'Home Inspection',
      isNewConstruction: !!(c.service && c.service.toLowerCase().includes('new construction')),
      agentName: c.agent_name || null,
      agentEmail: agentEmail || null,
      agentPhone: formatPhoneDisplay(c.agent_phone),
      cleanAgentPhone,
      dossierFilename,
      dossierUrl,
      dossierPath,
      metrics,
      clientSmsBody,
      clientSmsLink,
      clientCallLink,
      clientEmailSubject: homeownerSubject,
      clientEmailBody: homeownerBody,
      clientEmailLink,
      realtorSmsBody,
      realtorSmsLink,
      realtorEmailSubject,
      realtorEmailBody,
      realtorEmailLink
    };

    processedClients.push(item);

    if (metrics.urgencyTier === 'urgent') cohorts.urgent.push(item);
    else if (metrics.urgencyTier === 'upcoming') cohorts.upcoming.push(item);
    else if (metrics.urgencyTier === 'pipeline') cohorts.pipeline.push(item);
    else cohorts.pastYear.push(item);
  }

  // Sort urgent by days until deadline ascending (most urgent first)
  cohorts.urgent.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);
  cohorts.upcoming.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);
  cohorts.pipeline.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);

  console.log(`🎯 Identified:`);
  console.log(`   🔥 Due Right Now (10–12 Mos): ${cohorts.urgent.length} clients`);
  console.log(`   ⏳ Upcoming Window (8–10 Mos): ${cohorts.upcoming.length} clients`);
  console.log(`   🌱 Pipeline (6–8 Mos): ${cohorts.pipeline.length} clients`);

  // Load New Construction Cluster Data
  let newConstructionClusters = [];
  if (fs.existsSync(NEW_CONSTRUCTION_FILE)) {
    const rawNC = JSON.parse(fs.readFileSync(NEW_CONSTRUCTION_FILE, 'utf8'));
    newConstructionClusters = rawNC
      .filter(x => x.address && (x.address.includes(', GA') || x.address.includes(' GA ')))
      .slice(0, 35)
      .map(x => ({
        address: x.address,
        city: x.city,
        price: x.price ? `$${x.price.toLocaleString()}` : '$350,000+',
        yearBuilt: x.yearBuilt,
        stage: x.constructionStage || '11-Month Warranty Eligible Phase',
        redfinUrl: x.redfinUrl || null
      }));
    console.log(`🏗️ Loaded ${newConstructionClusters.length} Georgia new construction cluster locations.`);
  }

  // Save CRM output file
  const crmData = {
    updatedAt: now.toISOString(),
    stats: {
      totalClientsAudited: processedClients.length,
      urgentCount: cohorts.urgent.length,
      upcomingCount: cohorts.upcoming.length,
      pipelineCount: cohorts.pipeline.length,
      clusterCount: newConstructionClusters.length
    },
    cohorts,
    newConstructionClusters
  };

  fs.writeFileSync(OUTPUT_CRM_FILE, JSON.stringify(crmData, null, 2), 'utf8');
  console.log(`💾 Saved structured CRM data to: ${OUTPUT_CRM_FILE}`);

  // Build Interactive Mobile Dispatch HTML
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Foresight 11-Month Warranty Dispatch Radar &amp; Dossiers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090D16;
      --card-bg: #111827;
      --card-border: #1F2937;
      --text: #F9FAFB;
      --text-muted: #9CA3AF;
      --gold: #D4AF37;
      --gold-light: #FDE047;
      --red: #EF4444;
      --emerald: #10B981;
      --blue: #38BDF8;
      --purple: #A855F7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 16px;
      padding-bottom: 90px;
      max-width: 920px;
      margin: 0 auto;
    }
    header {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-gold { background: rgba(212, 175, 55, 0.15); color: var(--gold); border: 1px solid rgba(212, 175, 55, 0.3); }
    .badge-red { background: rgba(239, 68, 68, 0.15); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-emerald { background: rgba(16, 185, 129, 0.15); color: var(--emerald); border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-blue { background: rgba(56, 189, 248, 0.15); color: var(--blue); border: 1px solid rgba(56, 189, 248, 0.3); }
    
    h1 { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; margin: 8px 0; color: #FFFFFF; }
    p.subtitle { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      margin-top: 16px;
    }
    .stat-box {
      background: rgba(17, 24, 39, 0.8);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .stat-number { font-size: 22px; font-weight: 800; }
    .stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .tab-btn {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: var(--gold);
      color: #0F172A;
      border-color: var(--gold);
    }

    .search-bar {
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      color: #FFFFFF;
      margin-bottom: 16px;
      outline: none;
    }
    .search-bar:focus { border-color: var(--gold); }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px;
      margin-bottom: 14px;
      transition: transform 0.15s, border-color 0.15s;
    }
    .card.urgent { border-left: 4px solid var(--red); }
    .card.upcoming { border-left: 4px solid var(--gold); }
    .card.pipeline { border-left: 4px solid var(--emerald); }
    
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .client-name { font-size: 17px; font-weight: 800; color: #FFFFFF; }
    .client-addr { font-size: 13.5px; color: var(--gold-light); font-weight: 600; margin-bottom: 4px; }
    .client-meta { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px; }

    /* Inline Email Edit Box */
    .email-edit-box {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .email-edit-box label { font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
    .email-input {
      flex: 1;
      min-width: 180px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 6px 10px;
      color: #FFFFFF;
      font-size: 12px;
    }
    .email-input:focus { border-color: var(--blue); outline: none; }
    .btn-save-email {
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: var(--blue);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-top: 10px;
    }
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .action-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-dossier { background: var(--gold); color: #0F172A; }
    .btn-email-client { background: rgba(56, 189, 248, 0.2); color: #BAE6FD; border: 1px solid rgba(56, 189, 248, 0.4); }
    .btn-sms-client { background: rgba(16, 185, 129, 0.2); color: #A7F3D0; border: 1px solid rgba(16, 185, 129, 0.4); }
    .btn-call { background: rgba(255, 255, 255, 0.08); color: #E5E7EB; border: 1px solid rgba(255, 255, 255, 0.15); }
    .btn-email-agent { background: rgba(168, 85, 247, 0.2); color: #E9D5FF; border: 1px solid rgba(168, 85, 247, 0.4); }
    .btn-sms-agent { background: rgba(245, 158, 11, 0.2); color: #FDE68A; border: 1px solid rgba(245, 158, 11, 0.4); }
    .btn-status { background: rgba(255, 255, 255, 0.06); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.12); }

    .status-badge {
      display: inline-block;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
    .status-pending { background: rgba(255,255,255,0.1); color: #E5E7EB; }
    .status-contacted { background: rgba(56,189,248,0.25); color: #7DD3FC; }
    .status-dossier_sent { background: rgba(168,85,247,0.25); color: #D8B4FE; }
    .status-booked { background: rgba(212,175,55,0.3); color: #FDE047; }

    /* Toast Notification */
    #toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1E293B;
      color: #FFFFFF;
      border: 1px solid var(--gold);
      border-radius: 8px;
      padding: 12px 18px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      display: none;
      z-index: 9999;
    }
  </style>
</head>
<body>

  <header>
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <span class="badge badge-gold">🛡️ 11-Month Warranty Lead Radar</span>
      <span class="badge badge-emerald">Interactive Dossier Engine</span>
    </div>
    <h1>11-Month Warranty Radar &amp; Dossiers</h1>
    <p class="subtitle">
      Automated tracking, personalized building science dossiers, and 1-click email/SMS dispatch for past inspection clients reaching their 365-day builder warranty expiration.
    </p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-number" style="color:var(--red);">${cohorts.urgent.length}</div>
        <div class="stat-label">Due Right Now</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--gold);">${cohorts.upcoming.length}</div>
        <div class="stat-label">Next 60 Days</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--emerald);">${cohorts.pipeline.length}</div>
        <div class="stat-label">Q1 2027 Pipeline</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--blue);">${newConstructionClusters.length}</div>
        <div class="stat-label">Builder Clusters</div>
      </div>
    </div>
  </header>

  <input type="text" id="searchBar" class="search-bar" placeholder="🔍 Search by client name, street address, city, agent, or email..." onkeyup="filterCards()">

  <div class="tabs">
    <button class="tab-btn active" onclick="setTab('urgent')">🔥 Due Now (${cohorts.urgent.length})</button>
    <button class="tab-btn" onclick="setTab('upcoming')">⏳ Next 60 Days (${cohorts.upcoming.length})</button>
    <button class="tab-btn" onclick="setTab('pipeline')">🌱 Future Pipeline (${cohorts.pipeline.length})</button>
    <button class="tab-btn" onclick="setTab('clusters')">🏗️ Builder Clusters (${newConstructionClusters.length})</button>
  </div>

  <div id="cardsContainer"></div>

  <div id="toast"></div>

  <script>
    const cohorts = ${JSON.stringify(cohorts)};
    const clusters = ${JSON.stringify(newConstructionClusters)};
    let activeTab = 'urgent';

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.style.display = 'block';
      setTimeout(() => { t.style.display = 'none'; }, 3000);
    }

    function getStatus(id) {
      return localStorage.getItem('warranty_status_' + id) || 'pending';
    }

    function toggleStatus(id) {
      const current = getStatus(id);
      let next = 'contacted';
      if (current === 'contacted') next = 'dossier_sent';
      else if (current === 'dossier_sent') next = 'booked';
      else if (current === 'booked') next = 'pending';
      localStorage.setItem('warranty_status_' + id, next);
      renderCards();
    }

    function getSavedEmail(id, defaultEmail) {
      return localStorage.getItem('warranty_email_' + id) || defaultEmail || '';
    }

    function saveEmail(id) {
      const input = document.getElementById('email_input_' + id);
      if (input) {
        const val = input.value.trim();
        localStorage.setItem('warranty_email_' + id, val);
        showToast('✅ Saved email: ' + (val || 'Cleared'));
        renderCards();
      }
    }

    function copyToClipboard(text, label) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Copied ' + label + ' to clipboard!');
      }).catch(err => {
        showToast('❌ Copy failed: ' + err.message);
      });
    }

    function setTab(tab) {
      activeTab = tab;
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      renderCards();
    }

    function renderCards() {
      const container = document.getElementById('cardsContainer');
      const searchTerm = document.getElementById('searchBar').value.toLowerCase();

      if (activeTab === 'clusters') {
        container.innerHTML = clusters.map(c => \`
          <div class="card pipeline">
            <div class="card-top">
              <div>
                <span class="badge badge-blue">New Build Cluster</span>
                <div class="client-name" style="margin-top:6px;">\${c.address}</div>
                <div class="client-addr">\${c.city}, GA &bull; \${c.price}</div>
              </div>
              <span class="badge badge-gold">\${c.yearBuilt || '2025'} Build</span>
            </div>
            <p class="client-meta">
              <strong>Stage:</strong> \${c.stage}<br>
              💡 <em>Entire subdivision phase closed in late 2025. Every neighbor on this block is due for an 11-month builder warranty inspection.</em>
            </p>
            <div class="actions-grid">
              \${c.redfinUrl ? \`<a href="\${c.redfinUrl}" target="_blank" class="action-btn btn-call">View Subdivision Map</a>\` : ''}
              <a href="https://fhinspectionsatl.com/services/11-month-warranty-inspection-guide" target="_blank" class="action-btn btn-dossier">View Service Page</a>
            </div>
          </div>
        \`).join('');
        return;
      }

      const list = cohorts[activeTab] || [];
      const filtered = list.filter(item => {
        if (!searchTerm) return true;
        const currentEmail = getSavedEmail(item.id, item.email);
        const text = (item.name + ' ' + item.address + ' ' + item.city + ' ' + (item.agentName || '') + ' ' + currentEmail).toLowerCase();
        return text.includes(searchTerm);
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#6B7280;">No leads found matching your criteria.</div>';
        return;
      }

      container.innerHTML = filtered.map(item => {
        const st = getStatus(item.id);
        const statusClass = 'status-' + st;
        const statusLabel = st.replace('_', ' ').toUpperCase();
        const activeEmail = getSavedEmail(item.id, item.email);

        const emailMailto = \`mailto:\${activeEmail}?subject=\${encodeURIComponent(item.clientEmailSubject)}&body=\${encodeURIComponent(item.clientEmailBody)}\`;

        return \`
          <div class="card \${item.metrics.urgencyTier}" id="card_\${item.id}">
            <div class="card-top">
              <div>
                <span class="badge" style="background:\${item.metrics.badgeColor}22; color:\${item.metrics.badgeColor}; border:1px solid \${item.metrics.badgeColor}44;">
                  \${item.metrics.badgeLabel}
                </span>
                <span class="status-badge \${statusClass}" onclick="toggleStatus('\${item.id}')" style="margin-left:6px;">
                  \${statusLabel} ⟳
                </span>
                <div class="client-name" style="margin-top:6px;">\${item.name}</div>
                <div class="client-addr">\${item.address}, \${item.city}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px; color:var(--text-muted);">Inspection Date:</div>
                <div style="font-size:12px; font-weight:700; color:#FFFFFF;">\${item.date}</div>
                <div style="font-size:11px; color:var(--gold); font-weight:600; margin-top:2px;">
                  Cutoff: \${item.metrics.deadlineStr}
                </div>
              </div>
            </div>

            <p class="client-meta">
              <strong>Service:</strong> \${item.service}<br>
              <strong>Phone:</strong> \${item.phone || 'None on file'}<br>
              <strong>Email:</strong> \${activeEmail ? \`<span style="color:var(--blue);">\${activeEmail}</span>\` : '<span style="color:var(--text-muted);">None on file (add below)</span>'}<br>
              \${item.agentName ? \`<strong>Buyer Agent:</strong> \${item.agentName} (\${item.agentPhone || 'No phone'})\` : '<em>Direct Client (No agent on record)</em>'}
            </p>

            <!-- Inline Email Editor -->
            <div class="email-edit-box">
              <label>✉️ Homeowner Email:</label>
              <input type="email" id="email_input_\${item.id}" class="email-input" placeholder="Enter client email (e.g. client@gmail.com)" value="\${activeEmail}">
              <button class="btn-save-email" onclick="saveEmail('\${item.id}')">💾 Save</button>
            </div>

            <div class="actions-grid">
              <a href="\${item.dossierPath}" target="_blank" class="action-btn btn-dossier">
                📄 View Dossier
              </a>
              <a href="\${emailMailto}" class="action-btn btn-email-client" onclick="localStorage.setItem('warranty_status_\${item.id}', 'dossier_sent')">
                📧 Email Homeowner
              </a>
              \${item.clientSmsLink ? \`<a href="\${item.clientSmsLink}" class="action-btn btn-sms-client" onclick="localStorage.setItem('warranty_status_\${item.id}', 'contacted')">📱 Text Homeowner</a>\` : ''}
              \${item.clientCallLink ? \`<a href="\${item.clientCallLink}" class="action-btn btn-call">📞 Call Client</a>\` : ''}
              \${item.realtorEmailLink ? \`<a href="\${item.realtorEmailLink}" class="action-btn btn-email-agent">🤝 Email Agent</a>\` : ''}
              \${item.realtorSmsLink ? \`<a href="\${item.realtorSmsLink}" class="action-btn btn-sms-agent">📱 Text Agent</a>\` : ''}
              <button class="action-btn btn-status" onclick="copyToClipboard(\`\${item.clientEmailBody}\`, 'Email Draft')">📋 Copy Email</button>
              <button class="action-btn btn-status" onclick="toggleStatus('\${item.id}')">Toggle Status</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterCards() {
      renderCards();
    }

    // Initial render
    renderCards();
  </script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML_FILE, htmlContent, 'utf8');
  console.log(`🌐 Deployed standalone interactive portal to: ${OUTPUT_HTML_FILE}`);

  // Send Push Notification
  const pushTitle = `🛡️ 11-Month Warranty Radar: ${cohorts.urgent.length} Clients Due Now!`;
  const pushMsg = `Warranty Radar Scan Complete:\n• Due Right Now (Mo 10–12): ${cohorts.urgent.length}\n• Upcoming (Mo 8–10): ${cohorts.upcoming.length}\n• Pipeline: ${cohorts.pipeline.length}\n• Builder Clusters: ${newConstructionClusters.length}\n\nTap to open mobile dispatch portal:\nhttps://fhinspectionsatl.com/warranty-dispatch.html`;

  await sendPushNotification(pushTitle, pushMsg, cohorts.urgent.length > 0 ? 'high' : 'default');

  console.log('🏁 [Warranty Tracker] Execution completed successfully!');
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
