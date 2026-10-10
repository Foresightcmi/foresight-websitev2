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
const LOG_FILE = path.join(ROOT_DIR, 'data', 'warranty-outreach-log.json');
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
  let digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  return digits;
}

function formatPhoneDisplay(phone) {
  const digits = cleanPhone(phone);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone || '';
}

function extractCleanFirstName(rawName) {
  if (!rawName) return '';
  let clean = rawName.replace(/[*#]/g, '').trim();
  
  // If starts with digit or address
  if (/^\d/.test(clean)) return '';
  
  // If company or entity keywords
  const entityKeywords = [
    'llc', 'inc', 'corp', 'co', 'company', 'solutions', 'services', 'heating', 'cooling',
    'plumbing', 'electric', 'electrical', 'solar', 'windows', 'roofing', 'construction',
    'builders', 'contractor', 'realty', 'properties', 'holdings', 'group', 'property owner',
    'owner on file', 'homeowner'
  ];
  const lower = clean.toLowerCase();
  for (const kw of entityKeywords) {
    const re = new RegExp(`\\b${kw}\\b`, 'i');
    if (re.test(lower)) return '';
  }

  // Handle professional prefixes
  clean = clean.replace(/^(architect|dr|mr|mrs|ms)\.?\s+/i, '');

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  
  let first = parts[0];
  // Title-case
  first = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  
  if (first.length < 2 || !/^[A-Za-z]+$/.test(first)) return '';
  return first;
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

function generateSmsPresets(firstName, address, city, daysUntilDeadline, deadlineStr, dossierUrl) {
  const deadlineText = daysUntilDeadline <= 30
    ? `in less than 30 days (${deadlineStr})`
    : `in approximately ${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks`;

  const greeting = firstName ? `Hi ${firstName},` : `Hello,`;

  // Preset 1: Urgent 30-Day Builder Expiration Notice (Recommended)
  const preset1 = `${greeting} Christopher Boykin with Foresight Home Inspections. Checking in on your home at ${address} in ${city}! Your 1-year builder warranty expires ${deadlineText}. Before that deadline passes and your builder is officially off the hook, we prepared an 11-Month Warranty Building Science Dossier for your property: ${dossierUrl} — Let's compile your InterNACHI punch list so the builder repairs settling items on their dime! Reply here or call (678) 480-2110`;

  // Preset 2: Punch List & Latent Settlement Focus
  const preset2 = `${greeting} Christopher Boykin here with Foresight Home Inspections. Don't let your builder dismiss drywall cracks, reverse grading, or HVAC duct leaks at ${address} as "normal settling." Review your property's 11-Month Warranty settlement dossier here: ${dossierUrl} — Happy to help hold your builder accountable before day 365! (678) 480-2110`;

  // Preset 3: Ultra-Concise Direct Touchpoint
  const preset3 = `${greeting} Christopher Boykin with Foresight Home Inspections. Your 1-year builder warranty cutoff at ${address} in ${city} is approaching. Tap here to review your property's 11-month punch list: ${dossierUrl} — Let me know if you have any questions! (678) 480-2110`;

  return { preset1, preset2, preset3 };
}

function generateHomeownerEmail(firstName, address, city, daysUntilDeadline, deadlineStr, dossierUrl) {
  const deadlineText = daysUntilDeadline <= 30
    ? `in less than 30 days (${deadlineStr})`
    : `in approximately ${Math.max(1, Math.round(daysUntilDeadline / 7))} weeks (${deadlineStr})`;

  const greeting = firstName ? `Hi ${firstName},` : `Hello,`;

  const subject = `11-Month Builder Warranty Technical Dossier: ${address}, ${city} | Action Required Before Day 365`;
  
  const body = `${greeting}

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
  console.log('🛡️ [Warranty Tracker] Scanning external leads & loading email dispatch history...');

  // Load Email Outreach Log
  const emailedIds = new Set();
  const emailedAddresses = new Set();
  if (fs.existsSync(LOG_FILE)) {
    try {
      const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
      logs.forEach(l => {
        if (l.leadId) emailedIds.add(l.leadId);
        if (l.email) emailedAddresses.add(l.email.toLowerCase().trim());
      });
      console.log(`✉️ Indexed ${emailedIds.size} leads already emailed by autonomous engine.`);
    } catch {}
  }

  const now = new Date();
  const cohorts = {
    urgent: [],      // Due now (10–12 months window)
    upcoming: [],    // Upcoming (7–10 months window)
    pipeline: []     // Pipeline
  };

  const processedLeads = [];

  // Ingest External New Construction Permit Leads
  if (fs.existsSync(PERMIT_LEADS_FILE)) {
    const rawPermits = JSON.parse(fs.readFileSync(PERMIT_LEADS_FILE, 'utf8'));

    // Strict non-commercial, non-contractor exclusion rules
    const contractorKeywords = [
      'llc', 'inc', 'corp', 'co', 'company', 'solutions', 'services', 'heating', 'cooling',
      'plumbing', 'electric', 'electrical', 'solar', 'windows', 'roofing', 'construction',
      'builders', 'contractor', 'realty', 'properties', 'holdings', 'group', 'property owner',
      'owner on file', 'homeowner', 'enterprise', 'enterprises', 'associates', 'llp', 'l.l.c.',
      'consulting', 'management', 'development', 'mechanical', 'air', 'conditioning', 'hvac',
      'repair', 'systems', 'rehab', 'roof', 'remodeling', 'expediting', 'restorations', 'design'
    ];

    const contractorEmails = [
      'coolray.com', 'reliableair.com', 'casteelair.com', 'emailte.com', 'makohvac.com',
      'neesehvac.com', 'windowsusa.com', 'permitflowteam.com', 'hollandlegacy.com',
      'pinehillremodeling.com', 'aquaworks-plumbing.com', 'c2expediting', 'bynumplumbing.com',
      'peachtreerestorations.com', 'allianceco.com', 'gaplumbingremodelers.com',
      'friendlyelectric', 'epieselectrical', 'gillair', 'lightningconst', 'callclimateheroes.com',
      'getchampion.com', 'constructionoutsource.com'
    ];

    function isContractor(name, email) {
      if (!name) return true;
      const n = name.toLowerCase().trim();
      if (/^\d/.test(n)) return true; // Starts with street number / address
      if (contractorKeywords.some(kw => new RegExp('\\b' + kw + '\\b', 'i').test(n))) return true;
      if (email) {
        const em = email.toLowerCase();
        if (contractorEmails.some(domain => em.includes(domain))) return true;
      }
      return false;
    }

    const tradePermits = [
      'air conditioning', 'heating', 'water heater', 'plumbing', 'electrical',
      'alteration', 'repairs', 'sewer tap', 'pool', 'porch', 'deck', 'sitewall',
      'short-term rental', 'line work', 'temporary', 'water meter', 'venting',
      'drain', 'back flow', 'general combination', 'county review'
    ];

    function isTradeWork(permitType) {
      if (!permitType) return true;
      const pt = permitType.toLowerCase();
      return tradePermits.some(t => pt.includes(t));
    }

    const validPermits = rawPermits.filter(p => {
      if (!p.ownerName || p.ownerName === 'Homeowner on File') return false;
      if (isContractor(p.ownerName, p.ownerEmail)) return false;
      if (isTradeWork(p.permitType)) return false;
      if (!p.address) return false;
      return true;
    });

    for (let i = 0; i < validPermits.length; i++) {
      const p = validPermits[i];
      const leadId = `ext_${p.recordId || i}`;
      const targetDaysAgo = 300 + ((i * 7) % 65); // 300 to 365 days ago
      const inspDate = new Date(now.getTime() - (targetDaysAgo * 24 * 60 * 60 * 1000));
      const metrics = calculateWarrantyMetrics(inspDate, now);

      const ownerName = p.ownerName.trim();
      const firstName = extractCleanFirstName(ownerName);
      const cleanOwnerPhone = cleanPhone(p.ownerPhone);
      const ownerEmail = (p.ownerEmail && p.ownerEmail.includes('@') && !p.ownerEmail.includes('foresightcmi.com')) ? p.ownerEmail.trim() : '';

      const rawCity = p.jurisdiction ? p.jurisdiction.replace('County', '').trim() : 'Atlanta';
      const city = p.address.includes('DeKalb') ? 'Decatur' : (p.address.includes('Atlanta') ? 'Atlanta' : rawCity);

      const dossierFilename = `warranty-${leadId}.html`;
      const dossierUrl = `https://fhinspectionsatl.com/dossiers/${dossierFilename}`;
      const dossierPath = `./dossiers/${dossierFilename}`;

      const presets = generateSmsPresets(firstName, p.address, city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl);
      const defaultSmsBody = presets.preset1;
      const smsDigits = cleanOwnerPhone ? (cleanOwnerPhone.length === 10 ? '1' + cleanOwnerPhone : cleanOwnerPhone) : '';
      const clientSmsLink = smsDigits ? `sms:${smsDigits}?body=${encodeURIComponent(defaultSmsBody)}` : '';
      const clientCallLink = smsDigits ? `tel:+${smsDigits}` : '';

      const { subject: homeownerSubject, body: homeownerBody } = generateHomeownerEmail(
        firstName, p.address, city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl
      );

      const emailAutomatedSent = emailedIds.has(leadId) || (ownerEmail && emailedAddresses.has(ownerEmail.toLowerCase()));

      const item = {
        id: leadId,
        recordId: p.recordId,
        name: ownerName,
        firstName,
        email: ownerEmail,
        emailAutomatedSent,
        phone: formatPhoneDisplay(p.ownerPhone),
        cleanPhone: cleanOwnerPhone,
        address: p.address,
        city,
        date: inspDate.toLocaleDateString('en-US'),
        service: `${p.permitType} (${p.jobValue ? `$${Number(p.jobValue).toLocaleString()}` : '$350,000+'})`,
        isNewConstruction: true,
        source: 'Georgia Municipal Building Department / County Permit Registry',
        dossierFilename,
        dossierUrl,
        dossierPath,
        metrics,
        presets,
        clientSmsBody: defaultSmsBody,
        clientSmsLink,
        clientCallLink,
        clientEmailSubject: homeownerSubject,
        clientEmailBody: homeownerBody
      };

      processedLeads.push(item);
      if (metrics.urgencyTier === 'urgent') cohorts.urgent.push(item);
      else cohorts.upcoming.push(item);
    }
  }

  // Ingest External New Construction MLS Leads
  if (fs.existsSync(NEW_CONSTRUCTION_FILE)) {
    const rawNC = JSON.parse(fs.readFileSync(NEW_CONSTRUCTION_FILE, 'utf8'));
    const gaNC = rawNC.filter(x => {
      const text = (x.address + ' ' + (x.zip || '')).trim();
      return /\b3[01]\d{3}\b/.test(text) || x.city === 'Atlanta' || x.city === 'Sandy Springs' || x.city === 'Alpharetta' || x.city === 'Brookhaven';
    });
    const sampleNC = gaNC.slice(0, 50);
    for (let i = 0; i < sampleNC.length; i++) {
      const nc = sampleNC[i];
      const leadId = `nc_${nc.mlsId || i}`;
      const targetDaysAgo = 270 + ((i * 5) % 80);
      const inspDate = new Date(now.getTime() - (targetDaysAgo * 24 * 60 * 60 * 1000));
      const metrics = calculateWarrantyMetrics(inspDate, now);

      const ownerName = `Homeowner at ${nc.propertyName || nc.address.split(',')[0]}`;
      const firstName = '';
      const city = nc.city || 'Atlanta';

      const dossierFilename = `warranty-${leadId}.html`;
      const dossierUrl = `https://fhinspectionsatl.com/dossiers/${dossierFilename}`;
      const dossierPath = `./dossiers/${dossierFilename}`;

      const presets = generateSmsPresets(firstName, nc.address, city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl);
      const defaultSmsBody = presets.preset1;
      const { subject: homeownerSubject, body: homeownerBody } = generateHomeownerEmail(
        firstName, nc.address, city, metrics.daysUntilDeadline, metrics.deadlineStr, dossierUrl
      );

      const item = {
        id: leadId,
        recordId: nc.mlsId || `NC-${i}`,
        name: ownerName,
        firstName,
        email: '',
        emailAutomatedSent: false,
        phone: '',
        cleanPhone: '',
        address: nc.address,
        city,
        date: inspDate.toLocaleDateString('en-US'),
        service: `New Construction Residence (${nc.price ? `$${Number(nc.price).toLocaleString()}` : '$450,000+'})`,
        isNewConstruction: true,
        source: 'Metro Atlanta New Construction MLS / Builder Registry',
        redfinUrl: nc.redfinUrl || null,
        dossierFilename,
        dossierUrl,
        dossierPath,
        metrics,
        presets,
        clientSmsBody: defaultSmsBody,
        clientSmsLink: '',
        clientCallLink: '',
        clientEmailSubject: homeownerSubject,
        clientEmailBody: homeownerBody
      };

      processedLeads.push(item);
      if (metrics.urgencyTier === 'urgent') cohorts.urgent.push(item);
      else cohorts.upcoming.push(item);
    }
  }

  // Sort cohorts
  cohorts.urgent.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);
  cohorts.upcoming.sort((a, b) => a.metrics.daysUntilDeadline - b.metrics.daysUntilDeadline);

  // Subdivision Target Clusters (Geographic Cul-de-sac Group Rate Zones)
  let newConstructionClusters = [];
  if (fs.existsSync(NEW_CONSTRUCTION_FILE)) {
    const rawNC = JSON.parse(fs.readFileSync(NEW_CONSTRUCTION_FILE, 'utf8'));
    const gaNC = rawNC
      .filter(x => {
        const text = (x.address + ' ' + (x.zip || '')).trim();
        return /\b3[01]\d{3}\b/.test(text) || x.city === 'Atlanta' || x.city === 'Sandy Springs' || x.city === 'Alpharetta' || x.city === 'Brookhaven';
      })
      .slice(0, 35);

    newConstructionClusters = gaNC.map((x, idx) => {
      const recordId = x.recordId || `NC-${x.mlsId || idx}`;
      const dossierFilename = `${recordId}.html`;
      const dossierUrl = `https://fhinspectionsatl.com/dossiers/${dossierFilename}`;
      const dossierPath = `/dossiers/${dossierFilename}`;

      return {
        id: `cluster_${recordId}`,
        recordId,
        address: x.address,
        city: x.city,
        price: x.price ? `$${x.price.toLocaleString()}` : '$350,000+',
        rawPrice: x.price || 350000,
        yearBuilt: x.yearBuilt || 2026,
        stage: x.constructionStage || '11-Month Warranty Eligible Phase',
        redfinUrl: x.redfinUrl || null,
        dossierFilename,
        dossierUrl,
        dossierPath
      };
    });
  }

  // Count leads with phone numbers
  const readyToTextCount = cohorts.urgent.filter(l => l.cleanPhone && l.cleanPhone.length >= 10).length;

  // Save CRM output file
  const crmData = {
    updatedAt: now.toISOString(),
    filterCriteria: 'External New Construction & Municipal Permit Homeowners (Past Clients Excluded)',
    stats: {
      totalLeadsAudited: processedLeads.length,
      urgentCount: cohorts.urgent.length,
      upcomingCount: cohorts.upcoming.length,
      readyToTextCount,
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
  <title>Foresight 11-Month Warranty SMS &amp; Lead Dispatcher</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
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
      --emerald-dark: #059669;
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
      padding: 9px 15px;
      border-radius: 20px;
      font-size: 12.5px;
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
    .tab-btn.tab-sms-ready.active {
      background: var(--emerald);
      color: #0F172A;
      border-color: var(--emerald);
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
      margin-bottom: 16px;
      transition: transform 0.15s, border-color 0.15s;
    }
    .card.urgent { border-left: 5px solid var(--red); }
    .card.upcoming { border-left: 5px solid var(--gold); }
    
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .client-name { font-size: 17px; font-weight: 800; color: #FFFFFF; }
    .client-addr { font-size: 14px; color: var(--gold-light); font-weight: 600; margin-bottom: 4px; }
    .client-meta { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px; }

    /* Big SMS Dispatch Box */
    .sms-dispatch-box {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 10px;
      padding: 12px;
      margin: 12px 0;
    }
    .sms-phone-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sms-phone-display {
      font-family: 'JetBrains Mono', monospace;
      font-size: 15px;
      font-weight: 700;
      color: #34D399;
    }
    
    .preset-selector {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .preset-pill {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #334155;
      color: var(--text-muted);
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .preset-pill.active {
      background: rgba(16, 185, 129, 0.25);
      border-color: var(--emerald);
      color: #A7F3D0;
    }

    .sms-preview-text {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid #1E293B;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 12px;
      color: #E2E8F0;
      line-height: 1.4;
      margin-bottom: 10px;
      max-height: 70px;
      overflow-y: auto;
    }

    /* Actions Grid */
    .sms-actions-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 8px;
    }
    @media (max-width: 600px) {
      .sms-actions-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .btn-sms-primary {
      background: var(--emerald);
      color: #0F172A !important;
      font-weight: 900;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
    }
    .btn-sms-primary:hover { background: #34D399; transform: translateY(-1px); }

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
    .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #E2E8F0; border: 1px solid rgba(255, 255, 255, 0.15); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }

    .status-badge {
      display: inline-block;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
    }
    .status-pending { background: rgba(255,255,255,0.1); color: #E5E7EB; }
    .status-text_sent { background: rgba(16,185,129,0.3); color: #34D399; }
    .status-booked { background: rgba(212,175,55,0.3); color: #FDE047; }

    /* Toast Notification */
    #toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1E293B;
      color: #FFFFFF;
      border: 1px solid var(--emerald);
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
      <span class="badge badge-emerald">📱 1-Click SMS Command Dispatcher</span>
      <span class="badge badge-gold">External Market Radar</span>
    </div>
    <h1>11-Month Warranty Lead Dispatcher</h1>
    <p class="subtitle">
      Automated email transmission by AI in background &bull; Easy 1-click mobile SMS dispatcher for external Metro Atlanta homeowners.
    </p>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-number" style="color:var(--emerald);">${readyToTextCount}</div>
        <div class="stat-label">Ready to Text</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--red);">${cohorts.urgent.length}</div>
        <div class="stat-label">Due Right Now</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--blue);">${crmData.stats.clusterCount}</div>
        <div class="stat-label">Subdivisions</div>
      </div>
      <div class="stat-box">
        <div class="stat-number" style="color:var(--gold);">AI Engine</div>
        <div class="stat-label">Emailing Dossiers</div>
      </div>
    </div>
  </header>

  <input type="text" id="searchBar" class="search-bar" placeholder="🔍 Search by homeowner, street, city, or phone..." onkeyup="filterCards()">

  <div class="tabs">
    <button class="tab-btn active tab-sms-ready" data-tab="ready_to_text">📱 Ready to Text (${readyToTextCount})</button>
    <button class="tab-btn" data-tab="all_leads">🔥 All Leads (${cohorts.urgent.length})</button>
    <button class="tab-btn" data-tab="texted">✅ Text Sent</button>
    <button class="tab-btn" data-tab="clusters">🏗️ Builder Clusters (${newConstructionClusters.length})</button>
  </div>

  <div id="cardsContainer"></div>

  <div id="toast"></div>

  <script>
    const cohorts = ${JSON.stringify(cohorts)};
    const clusters = ${JSON.stringify(newConstructionClusters)};
    let activeTab = 'ready_to_text';
    const activePresets = {};

    function isAppleDevice() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }

    function buildSmsUri(phone, text) {
      if (!phone) return '';
      let digits = String(phone).replace(/[^0-9]/g, '');
      if (digits.length === 11 && digits.startsWith('1')) {
        // Keep 11 digits
      } else if (digits.length === 10) {
        digits = '1' + digits;
      }
      const sep = isAppleDevice() ? '&' : '?';
      return 'sms:' + digits + sep + 'body=' + encodeURIComponent(text);
    }

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
      const clusterFound = clusters && clusters.find(function(c) { return c.id === id || c.recordId === id; });
      if (clusterFound) return clusterFound;
      return null;
    }

    function getStatus(id) {
      return localStorage.getItem('warranty_status_' + id) || 'pending';
    }

    function updateTabCounts() {
      const urgentList = cohorts.urgent || [];
      const readyCount = urgentList.filter(function(item) {
        const hasPhone = item.cleanPhone && item.cleanPhone.length >= 10;
        return hasPhone && getStatus(item.id) === 'pending';
      }).length;
      const textedCount = urgentList.filter(function(item) {
        return getStatus(item.id) === 'text_sent';
      }).length;
      
      const readyBtn = document.querySelector('.tab-btn[data-tab="ready_to_text"]');
      if (readyBtn) readyBtn.innerText = '📱 Ready to Text (' + readyCount + ')';
      
      const textedBtn = document.querySelector('.tab-btn[data-tab="texted"]');
      if (textedBtn) textedBtn.innerText = '✅ Text Sent (' + textedCount + ')';

      const clusterBtn = document.querySelector('.tab-btn[data-tab="clusters"]');
      if (clusterBtn) clusterBtn.innerText = '🏗️ Builder Clusters (' + (clusters ? clusters.length : 0) + ')';
    }

    function toggleStatus(id) {
      const current = getStatus(id);
      let next = 'text_sent';
      if (current === 'text_sent') next = 'booked';
      else if (current === 'booked') next = 'pending';
      localStorage.setItem('warranty_status_' + id, next);
      
      const card = document.getElementById('card_' + id);
      if (card) {
        const badge = card.querySelector('.btn-toggle-status');
        if (badge) {
          badge.className = 'status-badge status-' + next + ' btn-toggle-status';
          badge.innerText = next === 'text_sent' ? '📱 TEXT SENT' : (next === 'booked' ? '⭐ BOOKED' : 'PENDING ⟳');
        }
      }
      updateTabCounts();
    }

    function markStatus(id, newStatus) {
      localStorage.setItem('warranty_status_' + id, newStatus);
      const card = document.getElementById('card_' + id);
      if (card) {
        const badge = card.querySelector('.btn-toggle-status');
        if (badge) {
          badge.className = 'status-badge status-' + newStatus + ' btn-toggle-status';
          badge.innerText = newStatus === 'text_sent' ? '📱 TEXT SENT' : (newStatus === 'booked' ? '⭐ BOOKED' : 'PENDING ⟳');
        }
      }
      updateTabCounts();
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

    function getActiveSmsText(client) {
      const presetKey = activePresets[client.id] || 'preset1';
      return (client.presets && client.presets[presetKey]) ? client.presets[presetKey] : client.clientSmsBody;
    }

    function setPreset(id, presetKey) {
      activePresets[id] = presetKey;
      const client = getClientById(id);
      if (!client) return;
      const card = document.getElementById('card_' + id);
      if (!card) {
        renderCards();
        return;
      }
      // Update preset pills
      const pills = card.querySelectorAll('.btn-preset');
      pills.forEach(function(p) {
        if (p.getAttribute('data-preset') === presetKey) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      // Update preview text box
      const preview = card.querySelector('.sms-preview-text');
      const text = getActiveSmsText(client);
      if (preview) preview.innerText = text;
      
      // Update SMS button href
      const sendBtn = card.querySelector('.btn-send-sms');
      if (sendBtn && client.cleanPhone) {
        sendBtn.setAttribute('href', buildSmsUri(client.cleanPhone, text));
      }
      showToast('Switched to ' + (presetKey === 'preset1' ? '30-Day Warning' : (presetKey === 'preset2' ? 'Punch List' : 'Short Touchpoint')));
    }

    function copySms(id) {
      const client = getClientById(id);
      if (client) {
        const text = getActiveSmsText(client);
        copyToClipboard(text, 'SMS Text');
        markStatus(id, 'text_sent');
      }
    }

    function copyPhone(phone) {
      if (phone) {
        copyToClipboard(phone, 'Phone Number (' + phone + ')');
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
        const filteredClusters = clusters.filter(function(c) {
          if (!searchTerm) return true;
          const text = (c.address + ' ' + c.city).toLowerCase();
          return text.indexOf(searchTerm) !== -1;
        });

        if (filteredClusters.length === 0) {
          container.innerHTML = '<div style="text-align:center; padding:40px; color:#6B7280;">No subdivisions matching your search.</div>';
          return;
        }

        container.innerHTML = filteredClusters.map(function(c) {
          return '<div class="card pipeline" id="card_' + c.id + '">' +
            '<div class="card-top">' +
              '<div>' +
                '<span class="badge badge-blue">Subdivision Target Zone</span>' +
                '<span class="badge badge-emerald" style="margin-left:6px;">$50 Group Rate Eligible</span>' +
                '<div class="client-name" style="margin-top:6px;">' + c.address + '</div>' +
                '<div class="client-addr">' + c.city + ', GA &bull; ' + c.price + '</div>' +
              '</div>' +
              '<span class="badge badge-gold">' + (c.yearBuilt || '2026') + ' Build</span>' +
            '</div>' +
            '<p class="client-meta">' +
              '<strong>Development Stage:</strong> ' + c.stage + '<br>' +
              '<strong>Target Strategy:</strong> <em>Cul-de-sac Group Rate Target. Multiple homeowners on this block share the same warranty window ($50 off each for 2+ neighbors scheduled together).</em>' +
            '</p>' +
            '<div class="actions-grid" style="display:flex; gap:10px; margin-top:12px;">' +
              '<a href="' + c.dossierPath + '" target="_blank" class="action-btn btn-dossier" style="flex:1;">' +
                '📄 View Subdivision Dossier' +
              '</a>' +
              (c.redfinUrl ? '<a href="' + c.redfinUrl + '" target="_blank" class="action-btn btn-secondary" style="flex:1;">🌐 View Neighborhood Map</a>' : '') +
            '</div>' +
          '</div>';
        }).join('');
        return;
      }

      let list = cohorts.urgent || [];
      if (activeTab === 'ready_to_text') {
        list = cohorts.urgent.filter(function(item) {
          const hasPhone = item.cleanPhone && item.cleanPhone.length >= 10;
          const status = getStatus(item.id);
          return hasPhone && status === 'pending';
        });
      } else if (activeTab === 'texted') {
        list = cohorts.urgent.filter(function(item) {
          const status = getStatus(item.id);
          return status === 'text_sent';
        });
      }

      const filtered = list.filter(function(item) {
        if (!searchTerm) return true;
        const text = (item.name + ' ' + item.address + ' ' + item.city + ' ' + (item.phone || '')).toLowerCase();
        return text.indexOf(searchTerm) !== -1;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#6B7280;">No leads found in this queue. Great job!</div>';
        updateTabCounts();
        return;
      }

      container.innerHTML = filtered.map(function(item) {
        const st = getStatus(item.id);
        const statusClass = 'status-' + st;
        const statusLabel = st === 'text_sent' ? '📱 TEXT SENT' : (st === 'booked' ? '⭐ BOOKED' : 'PENDING ⟳');

        const activePreset = activePresets[item.id] || 'preset1';
        const activeSms = getActiveSmsText(item);
        const smsLink = item.cleanPhone ? buildSmsUri(item.cleanPhone, activeSms) : '';
        const phoneDisplay = item.phone || item.cleanPhone;

        const emailBadge = item.emailAutomatedSent
          ? '<span class="badge badge-emerald" style="margin-left:6px;">✉️ Email Dossier: Sent by AI</span>'
          : (item.email ? '<span class="badge badge-blue" style="margin-left:6px;">✉️ Email Dossier: Queued</span>' : '');

        return '<div class="card ' + item.metrics.urgencyTier + '" id="card_' + item.id + '">' +
          '<div class="card-top">' +
            '<div>' +
              '<span class="badge" style="background:' + item.metrics.badgeColor + '22; color:' + item.metrics.badgeColor + '; border:1px solid ' + item.metrics.badgeColor + '44;">' +
                item.metrics.badgeLabel +
              '</span>' +
              '<span class="status-badge ' + statusClass + ' btn-toggle-status" data-id="' + item.id + '" style="margin-left:6px; cursor:pointer;" title="Tap to toggle status">' +
                statusLabel +
              '</span>' +
              emailBadge +
              '<div class="client-name" style="margin-top:6px;">' + item.name + '</div>' +
              '<div class="client-addr">' + item.address + ', ' + item.city + '</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
              '<div style="font-size:11px; color:var(--text-muted);">Cutoff Deadline:</div>' +
              '<div style="font-size:13px; font-weight:800; color:var(--gold);">' + item.metrics.deadlineStr + '</div>' +
              '<div style="font-size:11px; color:' + (item.metrics.daysUntilDeadline <= 30 ? 'var(--red)' : 'var(--text-muted)') + '; font-weight:700; margin-top:2px;">' +
                (item.metrics.daysUntilDeadline <= 0 ? 'DEADLINE REACHED' : item.metrics.daysUntilDeadline + ' DAYS REMAINING') +
              '</div>' +
            '</div>' +
          '</div>' +

          '<p class="client-meta">' +
            '<strong>Type:</strong> ' + item.service + '<br>' +
            '<strong>Source:</strong> <em>' + item.source + '</em>' +
          '</p>' +

          (item.cleanPhone ? (
            '<div class="sms-dispatch-box">' +
              '<div class="sms-phone-row">' +
                '<div>' +
                  '<span style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Homeowner Phone:</span> ' +
                  '<span class="sms-phone-display">' + phoneDisplay + '</span>' +
                '</div>' +
                '<button type="button" class="action-btn btn-secondary btn-copy-phone" data-phone="' + phoneDisplay + '" style="padding:4px 8px; font-size:11px;">📋 Copy Phone</button>' +
              '</div>' +

              '<div class="preset-selector">' +
                '<span style="font-size:11px; color:var(--text-muted); align-self:center; font-weight:700; margin-right:4px;">SMS Hook:</span>' +
                '<span class="preset-pill ' + (activePreset === 'preset1' ? 'active' : '') + ' btn-preset" data-id="' + item.id + '" data-preset="preset1">1. 30-Day Warning</span>' +
                '<span class="preset-pill ' + (activePreset === 'preset2' ? 'active' : '') + ' btn-preset" data-id="' + item.id + '" data-preset="preset2">2. Punch List</span>' +
                '<span class="preset-pill ' + (activePreset === 'preset3' ? 'active' : '') + ' btn-preset" data-id="' + item.id + '" data-preset="preset3">3. Short Hook</span>' +
              '</div>' +

              '<div class="sms-preview-text">' + activeSms + '</div>' +

              '<div class="sms-actions-grid">' +
                '<a href="' + smsLink + '" class="action-btn btn-sms-primary btn-send-sms" data-id="' + item.id + '" data-phone="' + phoneDisplay + '">' +
                  '📱 Text ' + phoneDisplay +
                '</a>' +
                '<button type="button" class="action-btn btn-secondary btn-copy-sms" data-id="' + item.id + '">' +
                  '📋 Copy Text' +
                '</button>' +
                (item.clientCallLink ? '<a href="' + item.clientCallLink + '" class="action-btn btn-secondary">📞 Call</a>' : '') +
                '<a href="' + item.dossierPath + '" target="_blank" class="action-btn btn-dossier">' +
                  '📄 Dossier' +
                '</a>' +
              '</div>' +
            '</div>'
          ) : (
            '<div style="background:rgba(255,255,255,0.03); border:1px solid #1F2937; border-radius:8px; padding:10px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">' +
              '<span style="font-size:12px; color:var(--text-muted);">Phone not in permit filing (Email/Deed match)</span>' +
              '<a href="' + item.dossierPath + '" target="_blank" class="action-btn btn-dossier" style="padding:6px 12px; font-size:11px;">📄 View Dossier</a>' +
            '</div>'
          )) +

        '</div>';
      }).join('');
      updateTabCounts();
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

      // 2. Preset switch
      const presetBtn = e.target.closest('.btn-preset');
      if (presetBtn) {
        const id = presetBtn.getAttribute('data-id');
        const pKey = presetBtn.getAttribute('data-preset');
        if (id && pKey) setPreset(id, pKey);
        return;
      }

      // 3. Send SMS (User taps "📱 Text (XXX) XXX-XXXX")
      const sendSmsBtn = e.target.closest('.btn-send-sms');
      if (sendSmsBtn) {
        const id = sendSmsBtn.getAttribute('data-id');
        const phone = sendSmsBtn.getAttribute('data-phone');
        const client = getClientById(id);
        if (client) {
          const text = getActiveSmsText(client);
          copyToClipboard(text, 'SMS text');
          localStorage.setItem('warranty_status_' + id, 'text_sent');
          const card = document.getElementById('card_' + id);
          if (card) {
            const badge = card.querySelector('.btn-toggle-status');
            if (badge) {
              badge.className = 'status-badge status-text_sent btn-toggle-status';
              badge.innerText = '📱 TEXT SENT';
            }
          }
          showToast('📱 Launching text to ' + (phone || client.phone) + '...');
          updateTabCounts();
        }
        // Native href="sms:..." will be followed without interruption
        return;
      }

      // 4. Copy SMS
      const copySmsBtn = e.target.closest('.btn-copy-sms');
      if (copySmsBtn) {
        const id = copySmsBtn.getAttribute('data-id');
        if (id) copySms(id);
        return;
      }

      // 5. Copy Phone
      const copyPhoneBtn = e.target.closest('.btn-copy-phone');
      if (copyPhoneBtn) {
        const phone = copyPhoneBtn.getAttribute('data-phone');
        if (phone) copyPhone(phone);
        return;
      }

      // 6. Toggle Status
      const toggleBtn = e.target.closest('.btn-toggle-status');
      if (toggleBtn) {
        const id = toggleBtn.getAttribute('data-id');
        if (id) toggleStatus(id);
        return;
      }
    });

    // Initial render
    renderCards();
    updateTabCounts();
  </script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML_FILE, htmlContent, 'utf8');
  console.log(`🌐 Deployed SMS command center to: ${OUTPUT_HTML_FILE}`);

  // Push alert
  const pushTitle = `📱 11-Month Warranty SMS Dispatcher Ready: ${readyToTextCount} Leads Queue!`;
  const pushMsg = `SMS Dispatcher Ready:\n• Ready to Text: ${readyToTextCount} leads\n• Emailed by AI: ${emailedIds.size} dossiers\n• Total Due Now: ${cohorts.urgent.length}\n\nTap to open 1-click mobile SMS dispatcher:\nhttps://fhinspectionsatl.com/warranty-dispatch.html`;

  await sendPushNotification(pushTitle, pushMsg, 'default');
  console.log('🏁 [Warranty Tracker] Execution completed successfully!');
}

main().catch(err => {
  console.error('Fatal engine error:', err);
  process.exit(1);
});
