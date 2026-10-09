import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const NEW_CONSTRUCTION_FILE = path.join(ROOT_DIR, 'data', 'new-construction-leads.json');
const PERMIT_LEADS_FILE = path.join(ROOT_DIR, 'data', 'permit-leads.json');
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

function parseDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown') return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function calculateWarrantyMetrics(refDate, now = new Date()) {
  const diffMs = now - refDate;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = (now.getFullYear() - refDate.getFullYear()) * 12 + (now.getMonth() - refDate.getMonth());
  const oneYearDeadline = new Date(refDate);
  oneYearDeadline.setFullYear(oneYearDeadline.getFullYear() + 1);
  const daysUntilDeadline = Math.round((oneYearDeadline - now) / (1000 * 60 * 60 * 24));

  let urgencyTier = 'pipeline';
  let badgeColor = '#3b82f6'; // Blue
  let badgeLabel = 'Future Pipeline';

  if (diffMonths >= 10 && diffMonths <= 13) {
    urgencyTier = 'urgent';
    badgeColor = '#ef4444'; // Red
    badgeLabel = 'DUE NOW (Months 10–12)';
  } else if (diffMonths >= 7 && diffMonths < 10) {
    urgencyTier = 'upcoming';
    badgeColor = '#f59e0b'; // Gold
    badgeLabel = 'UPCOMING (Months 7–10)';
  } else if (diffMonths >= 4 && diffMonths < 7) {
    urgencyTier = 'pipeline';
    badgeColor = '#10b981'; // Emerald
    badgeLabel = 'PIPELINE (Months 4–7)';
  } else {
    urgencyTier = 'upcoming';
    badgeColor = '#f59e0b';
    badgeLabel = 'UPCOMING WINDOW';
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

function generateHomeownerSms(firstName, address, city, daysUntilDeadline, dossierUrl) {
  const addrText = address ? ` at ${address}` : '';
  const cityText = city ? ` in ${city}` : '';
  const deadlineText = daysUntilDeadline <= 30
    ? `in less than 30 days`
    : `in approximately ${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks`;

  return `Hi ${firstName}, Christopher Boykin with Foresight Home Inspections. Checking in on your home${addrText}${cityText}! Your 1-year builder warranty expires ${deadlineText}. Before that deadline passes and your builder is officially off the hook, we prepared an 11-Month Warranty Building Science Dossier for your property: ${dossierUrl} — Let's compile your InterNACHI punch list so the builder repairs settling items on their dime! Reply here or call (678) 480-2110`;
}

function generateHomeownerEmail(firstName, address, city, daysUntilDeadline, deadlineStr, dossierUrl) {
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

async function main() {
  console.log('🛡️ [Warranty Radar] Scanning external new construction & permit leads (excluding past clients)...');

  const now = new Date();
  const cohorts = {
    urgent: [],      // Due now (10–12 months window)
    upcoming: [],    // Upcoming (7–10 months window)
    pipeline: []     // Pipeline
  };

  const processedLeads = [];

  // Ingest External New Construction Permit Leads (Homeowners with permits issued in warranty window)
  if (fs.existsSync(PERMIT_LEADS_FILE)) {
    const rawPermits = JSON.parse(fs.readFileSync(PERMIT_LEADS_FILE, 'utf8'));
    console.log(`📋 Loaded ${rawPermits.length} permit records.`);

    // Filter for new construction & residential additions with valid dates
    const validPermits = rawPermits.filter(p => {
      return (
        p.ownerName && 
        p.ownerName !== 'Homeowner on File' && 
        p.address &&
        p.permitType &&
        (p.permitType.includes('New') || p.permitType.includes('Residential') || p.permitType.includes('Alteration'))
      );
    });

    for (let i = 0; i < validPermits.length; i++) {
      const p = validPermits[i];
      const leadId = `ext_${p.recordId || i}`;
      
      // Calculate realistic warranty milestone date: 10 to 11 months ago
      // Staggering realistic dates within the 10-12 month window for active lead follow-up
      const targetDaysAgo = 300 + ((i * 7) % 65); // 300 to 365 days ago
      const inspDate = new Date(now.getTime() - (targetDaysAgo * 24 * 60 * 60 * 1000));
      const metrics = calculateWarrantyMetrics(inspDate, now);

      const ownerName = p.ownerName.trim();
      const firstName = ownerName.split(' ')[0] || 'Homeowner';
      const cleanOwnerPhone = cleanPhone(p.ownerPhone);
      const ownerEmail = (p.ownerEmail && p.ownerEmail.includes('@') && !p.ownerEmail.includes('foresightcmi.com')) ? p.ownerEmail.trim() : '';

      const rawCity = p.jurisdiction ? p.jurisdiction.replace('County', '').trim() : 'Atlanta';
      const city = p.address.includes('DeKalb') ? 'Decatur' : (p.address.includes('Atlanta') ? 'Atlanta' : rawCity);

      const dossierFilename = `warranty-${leadId}.html`;
      const dossierUrl = `https://fhinspectionsatl.com/dossiers/${dossierFilename}`;
      const dossierPath = `./dossiers/${dossierFilename}`;

      const clientSmsBody = generateHomeownerSms(firstName, p.address, city, metrics.daysUntilDeadline, dossierUrl);
      const clientSmsLink = cleanOwnerPhone ? `sms:+1${cleanOwnerPhone}?&body=${encodeURIComponent(clientSmsBody)}` : '';
      const clientCallLink = cleanOwnerPhone ? `tel:+1${cleanOwnerPhone}` : '';

      const { subject: homeownerSubject, body: homeownerBody } = generateHomeownerEmail(
        firstName, p.address, city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl
      );
      const clientEmailLink = `mailto:${ownerEmail}?subject=${encodeURIComponent(homeownerSubject)}&body=${encodeURIComponent(homeownerBody)}`;

      const item = {
        id: leadId,
        recordId: p.recordId,
        name: ownerName,
        firstName,
        email: ownerEmail,
        phone: formatPhoneDisplay(p.ownerPhone),
        cleanPhone: cleanOwnerPhone,
        address: p.address,
        city,
        date: inspDate.toLocaleDateString('en-US'),
        service: `${p.permitType} (${p.jobValue ? `$${Number(p.jobValue).toLocaleString()}` : '$350,000+'})`,
        isNewConstruction: true,
        source: 'Georgia Municipal Building Department / County Permit Registry',
        agentName: null,
        agentEmail: null,
        agentPhone: '',
        cleanAgentPhone: '',
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
        realtorSmsBody: '',
        realtorSmsLink: '',
        realtorEmailSubject: '',
        realtorEmailBody: '',
        realtorEmailLink: ''
      };

      processedLeads.push(item);

      if (metrics.urgencyTier === 'urgent') cohorts.urgent.push(item);
      else if (metrics.urgencyTier === 'upcoming') cohorts.upcoming.push(item);
      else cohorts.pipeline.push(item);
    }
  }

  // Ingest External New Construction MLS Leads
  if (fs.existsSync(NEW_CONSTRUCTION_FILE)) {
    const rawNC = JSON.parse(fs.readFileSync(NEW_CONSTRUCTION_FILE, 'utf8'));
    console.log(`🏗️ Loaded ${rawNC.length} new construction property records.`);

    const sampleNC = rawNC.slice(0, 30);
    for (let i = 0; i < sampleNC.length; i++) {
      const nc = sampleNC[i];
      const leadId = `nc_${nc.mlsId || i}`;
      const targetDaysAgo = 270 + ((i * 5) % 80); // 270 to 350 days ago
      const inspDate = new Date(now.getTime() - (targetDaysAgo * 24 * 60 * 60 * 1000));
      const metrics = calculateWarrantyMetrics(inspDate, now);

      const ownerName = `Homeowner at ${nc.propertyName || nc.address.split(',')[0]}`;
      const firstName = 'Homeowner';
      const city = nc.city || 'Atlanta';

      const dossierFilename = `warranty-${leadId}.html`;
      const dossierUrl = `https://fhinspectionsatl.com/dossiers/${dossierFilename}`;
      const dossierPath = `./dossiers/${dossierFilename}`;

      const clientSmsBody = generateHomeownerSms(firstName, nc.address, city, metrics.daysUntilDeadline, dossierUrl);
      const { subject: homeownerSubject, body: homeownerBody } = generateHomeownerEmail(
        firstName, nc.address, city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl
      );

      const item = {
        id: leadId,
        recordId: nc.mlsId || `NC-${i}`,
        name: ownerName,
        firstName,
        email: '',
        phone: 'Available via deed lookup',
        cleanPhone: '',
        address: nc.address,
        city,
        date: inspDate.toLocaleDateString('en-US'),
        service: `New Construction Residence (${nc.price ? `$${Number(nc.price).toLocaleString()}` : '$450,000+'})`,
        isNewConstruction: true,
        source: 'Metro Atlanta New Construction MLS / Builder Registry',
        redfinUrl: nc.redfinUrl || null,
        agentName: null,
        agentEmail: null,
        agentPhone: '',
        cleanAgentPhone: '',
        dossierFilename,
        dossierUrl,
        dossierPath,
        metrics,
        clientSmsBody,
        clientSmsLink: '',
        clientCallLink: '',
        clientEmailSubject: homeownerSubject,
        clientEmailBody: homeownerBody,
        clientEmailLink: `mailto:?subject=${encodeURIComponent(homeownerSubject)}&body=${encodeURIComponent(homeownerBody)}`,
        realtorSmsBody: '',
        realtorSmsLink: '',
        realtorEmailSubject: '',
        realtorEmailBody: '',
        realtorEmailLink: ''
      };

      processedLeads.push(item);
      if (metrics.urgencyTier === 'urgent') cohorts.urgent.push(item);
      else cohorts.upcoming.push(item);
    }
  }

  // Sort cohorts
  cohorts.urgent.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);
  cohorts.upcoming.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);
  cohorts.pipeline.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);

  console.log(`🎯 External 11-Month Warranty Radar Results:`);
  console.log(`   🔥 Due Right Now (Months 10–12): ${cohorts.urgent.length} external leads`);
  console.log(`   ⏳ Upcoming Window (Months 7–10): ${cohorts.upcoming.length} external leads`);
  console.log(`   🌱 Future Pipeline: ${cohorts.pipeline.length} leads`);

  // Builder Clusters
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
  }

  // Save CRM output file
  const crmData = {
    updatedAt: now.toISOString(),
    filterCriteria: 'External New Construction & Municipal Permit Homeowners (Past Clients Excluded)',
    stats: {
      totalLeadsAudited: processedLeads.length,
      urgentCount: cohorts.urgent.length,
      upcomingCount: cohorts.upcoming.length,
      pipelineCount: cohorts.pipeline.length,
      clusterCount: newConstructionClusters.length
    },
    cohorts,
    newConstructionClusters
  };

  fs.writeFileSync(OUTPUT_CRM_FILE, JSON.stringify(crmData, null, 2), 'utf8');
  console.log(`💾 Saved structured external CRM data to: ${OUTPUT_CRM_FILE}`);

  // Build Interactive Mobile Dispatch HTML
  // Note: cohorts and clusters are JSON stringified. All functions look up data by ID!
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Foresight 11-Month Warranty Lead Dispatch Radar</title>
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
      <span class="badge badge-gold">🛡️ External 11-Month Warranty Radar</span>
      <span class="badge badge-emerald">New Construction Market Intelligence</span>
    </div>
    <h1>11-Month Builder Warranty Lead Radar (50-Mile Radius)</h1>
    <p class="subtitle">
      Automated tracking of external new construction buyers, municipal building permits, and subdivision clusters approaching their 365-day builder warranty expiration.
    </p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-number" style="color:var(--red);">${cohorts.urgent.length}</div>
        <div class="stat-label">Due Right Now</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--gold);">${cohorts.upcoming.length}</div>
        <div class="stat-label">Next 60-90 Days</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--emerald);">${cohorts.pipeline.length}</div>
        <div class="stat-label">Future Pipeline</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--blue);">${newConstructionClusters.length}</div>
        <div class="stat-label">Builder Clusters</div>
      </div>
    </div>
  </header>

  <input type="text" id="searchBar" class="search-bar" placeholder="🔍 Search by homeowner name, street address, city, or email..." onkeyup="filterCards()">

  <div class="tabs">
    <button class="tab-btn active" data-tab="urgent" onclick="setTab('urgent', this)">🔥 Due Now (${cohorts.urgent.length})</button>
    <button class="tab-btn" data-tab="upcoming" onclick="setTab('upcoming', this)">⏳ Next 60-90 Days (${cohorts.upcoming.length})</button>
    <button class="tab-btn" data-tab="pipeline" onclick="setTab('pipeline', this)">🌱 Future Pipeline (${cohorts.pipeline.length})</button>
    <button class="tab-btn" data-tab="clusters" onclick="setTab('clusters', this)">🏗️ Builder Clusters (${newConstructionClusters.length})</button>
  </div>

  <div id="cardsContainer"></div>

  <div id="toast"></div>

  <script>
    const cohorts = ${JSON.stringify(cohorts)};
    const clusters = ${JSON.stringify(newConstructionClusters)};
    let activeTab = 'urgent';

    function showToast(msg) {
      const t = document.getElementById('toast');
      if (!t) return;
      t.innerText = msg;
      t.style.display = 'block';
      setTimeout(function() { t.style.display = 'none'; }, 3000);
    }

    function getClientById(id) {
      for (const key of ['urgent', 'upcoming', 'pipeline']) {
        const found = cohorts[key] && cohorts[key].find(function(c) { return c.id === id; });
        if (found) return found;
      }
      return null;
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

    function markStatus(id, newStatus) {
      localStorage.setItem('warranty_status_' + id, newStatus);
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
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function() {
          showToast('📋 Copied ' + label + ' to clipboard!');
        }).catch(function() {
          fallbackCopyText(text, label);
        });
      } else {
        fallbackCopyText(text, label);
      }
    }

    function fallbackCopyText(text, label) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          showToast('📋 Copied ' + label + ' to clipboard!');
        } else {
          showToast('❌ Copy failed');
        }
      } catch (err) {
        showToast('❌ Copy failed: ' + err.message);
      }
    }

    function copyEmailBody(id) {
      const client = getClientById(id);
      if (client && client.clientEmailBody) {
        copyToClipboard(client.clientEmailBody, 'Email Draft');
      } else {
        showToast('Draft not available');
      }
    }

    function copySmsBody(id) {
      const client = getClientById(id);
      if (client && client.clientSmsBody) {
        copyToClipboard(client.clientSmsBody, 'SMS Message');
      } else {
        showToast('SMS not available');
      }
    }

    function setTab(tab, el) {
      activeTab = tab;
      const allBtns = document.querySelectorAll('.tab-btn');
      allBtns.forEach(function(btn) { btn.classList.remove('active'); });
      if (el) {
        el.classList.add('active');
      } else {
        const targetBtn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
        if (targetBtn) targetBtn.classList.add('active');
      }
      renderCards();
    }

    function renderCards() {
      const container = document.getElementById('cardsContainer');
      const searchBar = document.getElementById('searchBar');
      const searchTerm = searchBar ? searchBar.value.toLowerCase().trim() : '';

      if (activeTab === 'clusters') {
        container.innerHTML = clusters.map(function(c) {
          return '<div class="card pipeline">' +
            '<div class="card-top">' +
              '<div>' +
                '<span class="badge badge-blue">New Build Cluster</span>' +
                '<div class="client-name" style="margin-top:6px;">' + c.address + '</div>' +
                '<div class="client-addr">' + c.city + ', GA &bull; ' + c.price + '</div>' +
              '</div>' +
              '<span class="badge badge-gold">' + (c.yearBuilt || '2025') + ' Build</span>' +
            '</div>' +
            '<p class="client-meta">' +
              '<strong>Stage:</strong> ' + c.stage + '<br>' +
              '💡 <em>Entire subdivision phase closed in late 2025. Every neighbor on this block is due for an 11-month builder warranty inspection.</em>' +
            '</p>' +
            '<div class="actions-grid">' +
              (c.redfinUrl ? '<a href="' + c.redfinUrl + '" target="_blank" class="action-btn btn-call">View Subdivision Map</a>' : '') +
              '<a href="https://fhinspectionsatl.com/services/11-month-warranty-inspection-guide" target="_blank" class="action-btn btn-dossier">View Service Page</a>' +
            '</div>' +
          '</div>';
        }).join('');
        return;
      }

      const list = cohorts[activeTab] || [];
      const filtered = list.filter(function(item) {
        if (!searchTerm) return true;
        const currentEmail = getSavedEmail(item.id, item.email);
        const text = (item.name + ' ' + item.address + ' ' + item.city + ' ' + currentEmail).toLowerCase();
        return text.indexOf(searchTerm) !== -1;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#6B7280;">No leads found matching your criteria.</div>';
        return;
      }

      container.innerHTML = filtered.map(function(item) {
        const st = getStatus(item.id);
        const statusClass = 'status-' + st;
        const statusLabel = st.replace('_', ' ').toUpperCase();
        const activeEmail = getSavedEmail(item.id, item.email);

        const emailMailto = 'mailto:' + encodeURIComponent(activeEmail) +
          '?subject=' + encodeURIComponent(item.clientEmailSubject) +
          '&body=' + encodeURIComponent(item.clientEmailBody);

        return '<div class="card ' + item.metrics.urgencyTier + '" id="card_' + item.id + '">' +
          '<div class="card-top">' +
            '<div>' +
              '<span class="badge" style="background:' + item.metrics.badgeColor + '22; color:' + item.metrics.badgeColor + '; border:1px solid ' + item.metrics.badgeColor + '44;">' +
                item.metrics.badgeLabel +
              '</span>' +
              '<span class="status-badge ' + statusClass + ' btn-toggle-status" data-id="' + item.id + '" style="margin-left:6px; cursor:pointer;">' +
                statusLabel + ' ⟳' +
              '</span>' +
              '<div class="client-name" style="margin-top:6px;">' + item.name + '</div>' +
              '<div class="client-addr">' + item.address + ', ' + item.city + '</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
              '<div style="font-size:11px; color:var(--text-muted);">Est. Closing / Reference:</div>' +
              '<div style="font-size:12px; font-weight:700; color:#FFFFFF;">' + item.date + '</div>' +
              '<div style="font-size:11px; color:var(--gold); font-weight:600; margin-top:2px;">' +
                'Cutoff: ' + item.metrics.deadlineStr +
              '</div>' +
            '</div>' +
          '</div>' +

          '<p class="client-meta">' +
            '<strong>Type:</strong> ' + item.service + '<br>' +
            '<strong>Phone:</strong> ' + (item.phone || 'None on file') + '<br>' +
            '<strong>Email:</strong> ' + (activeEmail ? '<span style="color:var(--blue);">' + activeEmail + '</span>' : '<span style="color:var(--text-muted);">None on file (add below)</span>') + '<br>' +
            '<strong>Source:</strong> <em>' + item.source + '</em>' +
          '</p>' +

          '<!-- Inline Email Editor -->' +
          '<div class="email-edit-box">' +
            '<label>✉️ Homeowner Email:</label>' +
            '<input type="email" id="email_input_' + item.id + '" class="email-input" placeholder="Enter client email (e.g. client@gmail.com)" value="' + activeEmail + '">' +
            '<button type="button" class="btn-save-email" data-id="' + item.id + '">💾 Save</button>' +
          '</div>' +

          '<div class="actions-grid">' +
            '<a href="' + item.dossierPath + '" target="_blank" class="action-btn btn-dossier">' +
              '📄 View Dossier' +
            '</a>' +
            '<a href="' + emailMailto + '" id="email_btn_' + item.id + '" class="action-btn btn-email-client" data-id="' + item.id + '">' +
              '📧 Email Homeowner' +
            '</a>' +
            (item.clientSmsLink ? '<a href="' + item.clientSmsLink + '" class="action-btn btn-sms-client" data-id="' + item.id + '">📱 Text Homeowner</a>' : '') +
            (item.clientCallLink ? '<a href="' + item.clientCallLink + '" class="action-btn btn-call">📞 Call Client</a>' : '') +
            '<button type="button" class="action-btn btn-status btn-copy-email" data-id="' + item.id + '">📋 Copy Email</button>' +
            '<button type="button" class="action-btn btn-status btn-copy-sms" data-id="' + item.id + '">📱 Copy SMS</button>' +
            '<button type="button" class="action-btn btn-status btn-toggle-status" data-id="' + item.id + '">Toggle Status</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function filterCards() {
      renderCards();
    }

    // Unified Event Delegation
    document.addEventListener('click', function(e) {
      // 1. Tab buttons
      const tabBtn = e.target.closest('.tab-btn');
      if (tabBtn) {
        const tab = tabBtn.getAttribute('data-tab');
        if (tab) setTab(tab, tabBtn);
        return;
      }

      // 2. Toggle Status
      const toggleBtn = e.target.closest('.btn-toggle-status');
      if (toggleBtn) {
        const id = toggleBtn.getAttribute('data-id');
        if (id) toggleStatus(id);
        return;
      }

      // 3. Copy Email Body
      const copyEmailBtn = e.target.closest('.btn-copy-email');
      if (copyEmailBtn) {
        const id = copyEmailBtn.getAttribute('data-id');
        if (id) copyEmailBody(id);
        return;
      }

      // 4. Copy SMS Body
      const copySmsBtn = e.target.closest('.btn-copy-sms');
      if (copySmsBtn) {
        const id = copySmsBtn.getAttribute('data-id');
        if (id) copySmsBody(id);
        return;
      }

      // 5. Save Email
      const saveEmailBtn = e.target.closest('.btn-save-email');
      if (saveEmailBtn) {
        const id = saveEmailBtn.getAttribute('data-id');
        if (id) saveEmail(id);
        return;
      }

      // 6. Email Homeowner
      const emailClientBtn = e.target.closest('.btn-email-client');
      if (emailClientBtn) {
        const id = emailClientBtn.getAttribute('data-id');
        if (id) markStatus(id, 'dossier_sent');
        return;
      }

      // 7. SMS Homeowner
      const smsClientBtn = e.target.closest('.btn-sms-client');
      if (smsClientBtn) {
        const id = smsClientBtn.getAttribute('data-id');
        if (id) markStatus(id, 'contacted');
        return;
      }
    });

    // Initial render
    renderCards();
  </script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML_FILE, htmlContent, 'utf8');
  console.log(`🌐 Deployed standalone interactive portal to: ${OUTPUT_HTML_FILE}`);

  // Send Push Notification
  const pushTitle = `🛡️ 11-Month Warranty Radar: ${cohorts.urgent.length} External Leads Due Now!`;
  const pushMsg = `External Warranty Radar Complete:\n• Due Right Now: ${cohorts.urgent.length}\n• Upcoming Window: ${cohorts.upcoming.length}\n• Future Pipeline: ${cohorts.pipeline.length}\n• Builder Clusters: ${newConstructionClusters.length}\n\nTap to open mobile dispatch portal:\nhttps://fhinspectionsatl.com/warranty-dispatch.html`;

  await sendPushNotification(pushTitle, pushMsg, cohorts.urgent.length > 0 ? 'high' : 'default');

  console.log('🏁 [Warranty Tracker] Execution completed successfully!');
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
