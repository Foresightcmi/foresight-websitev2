import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'new-construction-leads.json');
const CRM_FILE = path.join(ROOT_DIR, 'data', 'new-construction-crm.json');
const UNSUBSCRIBED_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const MASTER_DB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'master_realtor_database.json');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

const METRO_COUNTIES = new Set([
  'fulton', 'dekalb', 'gwinnett', 'cobb', 'clayton', 'cherokee', 'forsyth',
  'henry', 'fayette', 'coweta', 'douglas', 'paulding', 'rockdale', 'newton',
  'walton', 'barrow', 'hall', 'dawson', 'bartow', 'jackson', 'carroll',
  'spalding', 'butts', 'morgan'
]);

const BUILDER_OR_EXCLUDED_REGEX = /ansley|drhorton|pulte|lennar|meritage|tollbrothers|beazer|kbhome|ashtonwoods|weekley|taylormorrison|stanleymartin|smithdouglas|centurycommunities|rocklynhomes|chafin|paranhomes|adamshomes|metrobrokers|cbcmetrobrokers|peachtreetc|cgrealtyinc|dwhomes|theprovidencegroup|relianthomes|odwyerhomes|cstonega/i;

const CORRIDOR_TARGETS = [
  { city: 'Alpharetta', corridor: 'NORTH_FULTON' }, { city: 'Roswell', corridor: 'NORTH_FULTON' },
  { city: 'Milton', corridor: 'NORTH_FULTON' }, { city: 'Johns Creek', corridor: 'NORTH_FULTON' },
  { city: 'Sandy Springs', corridor: 'NORTH_FULTON' }, { city: 'Dunwoody', corridor: 'NORTH_FULTON' },
  { city: 'Cumming', corridor: 'NORTHEAST' }, { city: 'Buford', corridor: 'NORTHEAST' },
  { city: 'Suwanee', corridor: 'NORTHEAST' }, { city: 'Lawrenceville', corridor: 'NORTHEAST' },
  { city: 'Dacula', corridor: 'NORTHEAST' }, { city: 'Hoschton', corridor: 'NORTHEAST' },
  { city: 'Braselton', corridor: 'NORTHEAST' }, { city: 'Winder', corridor: 'NORTHEAST' },
  { city: 'Marietta', corridor: 'NORTHWEST' }, { city: 'Woodstock', corridor: 'NORTHWEST' },
  { city: 'Canton', corridor: 'NORTHWEST' }, { city: 'Acworth', corridor: 'NORTHWEST' },
  { city: 'Kennesaw', corridor: 'NORTHWEST' }, { city: 'Dallas', corridor: 'NORTHWEST' },
  { city: 'Douglasville', corridor: 'WEST' }, { city: 'Villa Rica', corridor: 'WEST' },
  { city: 'Decatur', corridor: 'EAST' }, { city: 'Tucker', corridor: 'EAST' },
  { city: 'Snellville', corridor: 'EAST' }, { city: 'Loganville', corridor: 'EAST' },
  { city: 'Conyers', corridor: 'EAST' }, { city: 'Covington', corridor: 'EAST' },
  { city: 'McDonough', corridor: 'SOUTH' }, { city: 'Locust Grove', corridor: 'SOUTH' },
  { city: 'Stockbridge', corridor: 'SOUTH' }, { city: 'Fayetteville', corridor: 'SOUTH' },
  { city: 'Peachtree City', corridor: 'SOUTH' }, { city: 'Newnan', corridor: 'SOUTH' },
  { city: 'Senoia', corridor: 'SOUTH' }, { city: 'Fairburn', corridor: 'SOUTH' },
  { city: 'Atlanta', corridor: 'INTOWN' }
];
const CITY_CORRIDOR_MAP = new Map(CORRIDOR_TARGETS.map((t) => [t.city.toLowerCase(), t.corridor]));

function cleanHeader(str) {
  return str ? String(str).replace(/[^\x00-\x7F]/g, '').trim() : '';
}

function loadSuppressedEmails() {
  const set = new Set();
  if (!fs.existsSync(UNSUBSCRIBED_FILE)) return set;
  try {
    for (const item of JSON.parse(fs.readFileSync(UNSUBSCRIBED_FILE, 'utf8'))) {
      const em = typeof item === 'string' ? item : item?.email;
      if (em) set.add(em.toLowerCase().trim());
    }
  } catch {}
  return set;
}

function loadMasterRealtorLookup(suppressed) {
  const byPhone = new Map();
  const byName = new Map();
  if (!fs.existsSync(MASTER_DB_FILE)) return { byPhone, byName };
  try {
    const contacts = Object.values(JSON.parse(fs.readFileSync(MASTER_DB_FILE, 'utf8')).contacts || {});
    const phoneCounts = new Map();
    const nameCounts = new Map();
    for (const c of contacts) {
      const p = String(c.phone || '').replace(/\D/g, '').slice(-10);
      if (p.length === 10) phoneCounts.set(p, (phoneCounts.get(p) || 0) + 1);
      const n = String(c.name || '').trim().toLowerCase();
      if (n.length > 5) nameCounts.set(n, (nameCounts.get(n) || 0) + 1);
    }
    for (const c of contacts) {
      const em = String(c.email || '').toLowerCase().trim();
      if (!em || !em.includes('@') || c.unsubscribed || c.quarantined || c.excluded || suppressed.has(em)) continue;
      if (BUILDER_OR_EXCLUDED_REGEX.test(`${em} ${c.brokerage || ''}`)) continue;
      const p = String(c.phone || '').replace(/\D/g, '').slice(-10);
      const n = String(c.name || '').trim().toLowerCase();
      if (p.length === 10 && (phoneCounts.get(p) || 0) <= 2 && !byPhone.has(p)) byPhone.set(p, { email: em, phone: p });
      if (n.length > 5 && (nameCounts.get(n) || 0) === 1 && !byName.has(n)) byName.set(n, { email: em, phone: p });
    }
  } catch {}
  return { byPhone, byName };
}
async function mapWithConcurrency(items, concurrency, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, items.length)) }, () => worker()));
  return out;
}

function buildLeadFromSource(src, feedName, url, masterLookup, suppressed) {
  const status = String(src.StandardStatus || src.MlsStatus || '');
  if (/closed|sold|expired|withdrawn|canceled|terminate/i.test(status) || src.CloseDate) return null;
  if (/lease|rental|land|lot|acreage|farm/i.test(String(src.PropertyType || src.PropertySubType || ''))) return null;

  const state = String(src.StateOrProvince || '').toUpperCase().trim();
  if (state !== 'GA') return null;

  const countyRaw = String(src.CountyOrParish || '').trim();
  const county = countyRaw.toLowerCase();
  const city = String(src.City || '').trim();
  if (!county || !METRO_COUNTIES.has(county)) return null;

  const yearBuilt = Number(src.YearBuilt || 0);
  const isNewFlag = src.NewConstructionYN === true || String(src.NewConstructionYN || '').toLowerCase() === 'true';
  if (!(isNewFlag || yearBuilt >= 2025)) return null;

  const price = Number(src.ListPrice || 0);
  if (price < 200000) return null;

  const addressLine = String(src.UnparsedAddress || `${src.StreetNumber || ''} ${src.StreetName || ''} ${src.StreetSuffix || ''}`).trim();
  if (!addressLine || /^0\s+/i.test(addressLine)) return null;

  const zip = String(src.PostalCode || '').trim();
  const fullAddress = `${addressLine}, ${city}, GA ${zip}`.trim();
  const mlsId = String(src.ListingId || src.ListingKey || `${city}_${addressLine}`.replace(/[^a-zA-Z0-9]/g, '')).trim();
  const rawAgentName = String(src.ListAgentFullName || src.ShowingContactName || '').trim();
  let agentEmail = String(src.ListAgentEmail || '').toLowerCase().trim();
  let agentPhone = String(src.ListAgentDirectPhone || src.ListAgentMobilePhone || src.ShowingContactPhone || src.AttributionContact || '').replace(/\D/g, '').slice(-10);
  const brokerage = String(src.ListOfficeName || 'Metro Atlanta Real Estate').trim();

  if (!agentEmail || agentPhone.length !== 10) {
    const hit = (agentPhone.length === 10 && masterLookup.byPhone.get(agentPhone))
      || (rawAgentName.length > 5 && masterLookup.byName.get(rawAgentName.toLowerCase()));
    if (hit) {
      if (!agentEmail && hit.email) agentEmail = hit.email;
      if (agentPhone.length !== 10 && hit.phone) agentPhone = hit.phone;
    }
  }

  const isIndependentAgent = Boolean(
    agentEmail && agentEmail.includes('@') && !suppressed.has(agentEmail) && !BUILDER_OR_EXCLUDED_REGEX.test(`${agentEmail} ${brokerage}`)
  );
  const dom = Number(src.DaysOnMarket || src.CumulativeDaysOnMarket || 14);
  const estStage = /pending|under contract|contingent/i.test(status)
    ? 'Active Due Diligence / Pre-Closing Final Walkthrough Window'
    : (dom < 21 ? 'Active Framing & Rough-In (Pre-Drywall Critical Window)' : 'Pre-Drywall & 11-Month Warranty Window');
  const todayStr = new Date().toISOString().slice(0, 10);

  return {
    recordId: `NC-${mlsId}`,
    mlsId,
    source: `${feedName} Live Georgia New Construction Feed`,
    jurisdiction: `${countyRaw} County, GA`,
    corridor: CITY_CORRIDOR_MAP.get(city.toLowerCase()) || 'METRO_ATL',
    permitType: 'New Construction Residential',
    propertyName: addressLine,
    address: fullAddress,
    city,
    state: 'GA',
    zip,
    price,
    sqft: Number(src.LivingArea || src.BuildingAreaTotal || 0),
    yearBuilt: yearBuilt >= 2024 ? yearBuilt : 2025,
    beds: Number(src.BedroomsTotal || 4),
    baths: Number(src.BathroomsTotalInteger || 3),
    mlsStatus: status || 'Active',
    constructionStage: estStage,
    daysOnMarket: isNaN(dom) ? 14 : dom,
    brokerage,
    agentPhone: agentPhone.length === 10 ? `(${agentPhone.slice(0, 3)}) ${agentPhone.slice(3, 6)}-${agentPhone.slice(6)}` : null,
    redfinUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
    ownerName: isIndependentAgent && rawAgentName ? rawAgentName : 'Future Homeowner / Buyer Representation',
    ownerEmail: isIndependentAgent ? agentEmail : null,
    ownerPhone: agentPhone.length === 10 ? agentPhone : null,
    estInspectionValue: 675,
    source_url: url,
    retrieved_on: todayStr,
    harvestedAt: new Date().toISOString()
  };
}
function isGeorgiaLead(lead) {
  if (!lead) return false;
  if (/\/(IN|IL|IA|TX|FL|NC|SC|TN|AL)\//i.test(String(lead.redfinUrl || ''))) return false;
  if (lead.state && String(lead.state).toUpperCase() !== 'GA') return false;
  if (/,\s*(IN|IL|IA|TX|FL|NC|SC|TN|AL)\b/i.test(String(lead.address || ''))) return false;
  const county = String(lead.jurisdiction || '').toLowerCase().replace(/\s*county.*$/, '').trim();
  const city = String(lead.city || '').toLowerCase().trim();
  if (county && METRO_COUNTIES.has(county)) return true;
  if (CITY_CORRIDOR_MAP.has(city)) return true;
  return /,\s*GA\b/i.test(String(lead.address || ''));
}

async function main() {
  console.log('🚀 [New Construction Radar] Initializing 100% Georgia Multi-MLS New Construction Harvester...');
  const suppressed = loadSuppressedEmails();
  const masterLookup = loadMasterRealtorLookup(suppressed);

  const feedUrls = [
    'https://mls.virtusmart.com/api/search/p?From=0&Size=200&geocode=1&feed=FMLS',
    'https://mls.virtusmart.com/api/search/p?From=200&Size=200&geocode=1&feed=FMLS',
    'https://mls.virtusmart.com/api/search/p?From=0&Size=200&geocode=1&feed=GeorgiaMLS',
    'https://mls.virtusmart.com/api/search/p?From=200&Size=200&geocode=1&feed=GeorgiaMLS'
  ];
  for (const t of CORRIDOR_TARGETS) {
    const q = encodeURIComponent(t.city);
    feedUrls.push(`https://mls.virtusmart.com/api/search/p?From=0&Size=100&geocode=1&feed=FMLS&City=${q}`);
    feedUrls.push(`https://mls.virtusmart.com/api/search/p?From=0&Size=100&geocode=1&feed=GeorgiaMLS&City=${q}`);
  }

  const pages = await mapWithConcurrency(feedUrls, 25, async (url) => {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, signal: AbortSignal.timeout(7000) });
      if (!res.ok) return { url, rows: [] };
      const data = await res.json();
      return { url, rows: Array.isArray(data) ? data : [] };
    } catch { return { url, rows: [] }; }
  });

  const newlyHarvested = [];
  for (const { url, rows } of pages) {
    const feedName = url.includes('feed=GeorgiaMLS') ? 'GeorgiaMLS' : 'FMLS';
    for (const row of rows) {
      const lead = buildLeadFromSource(row?._source || {}, feedName, url, masterLookup, suppressed);
      if (lead) newlyHarvested.push(lead);
    }
  }
  console.log(`📊 [New Construction Radar] Harvested ${newlyHarvested.length} Georgia new-build candidates across FMLS + GeorgiaMLS.`);

  let existingLeads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try { existingLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')).filter(isGeorgiaLead); } catch { existingLeads = []; }
  }

  const leadMap = new Map();
  const addrSeen = new Set();
  for (const lead of existingLeads) {
    lead.state = 'GA';
    if (!lead.corridor) {
      const cLow = String(lead.city || '').toLowerCase().trim();
      lead.corridor = CITY_CORRIDOR_MAP.get(cLow) || (['brookhaven', 'chamblee'].includes(cLow) ? 'NORTH_FULTON' : ['south fulton', 'east point', 'hapeville'].includes(cLow) ? 'SOUTH' : 'METRO_ATL');
    }
    leadMap.set(lead.recordId, lead);
    if (lead.address) addrSeen.add(lead.address.toLowerCase().trim());
  }

  let addedCount = 0;
  for (const lead of newlyHarvested) {
    const addrKey = lead.address.toLowerCase().trim();
    if (leadMap.has(lead.recordId)) {
      const prev = leadMap.get(lead.recordId);
      if (!prev.ownerEmail && lead.ownerEmail) { prev.ownerEmail = lead.ownerEmail; prev.ownerName = lead.ownerName; prev.ownerPhone = lead.ownerPhone; }
      continue;
    }
    if (addrSeen.has(addrKey)) continue;
    leadMap.set(lead.recordId, lead);
    addrSeen.add(addrKey);
    addedCount++;
  }

  const uniqueLeads = Array.from(leadMap.values()).filter(isGeorgiaLead);
  fs.mkdirSync(path.dirname(LEADS_FILE), { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(uniqueLeads, null, 2), 'utf8');
  console.log(`💾 [New Construction Radar] Saved ${uniqueLeads.length} 100%-Georgia leads (+${addedCount} new).`);

  const crmPayload = {
    lastSync: new Date().toISOString(),
    totalActiveLeads: uniqueLeads.length,
    newLeadsThisRun: addedCount,
    topCorridors: ['NORTH_FULTON', 'NORTHEAST', 'NORTHWEST', 'WEST', 'EAST', 'SOUTH', 'INTOWN'],
    leads: uniqueLeads.slice(0, 50)
  };
  fs.writeFileSync(CRM_FILE, JSON.stringify(crmPayload, null, 2), 'utf8');

  const skipAlert = process.argv.includes('--no-alert') || process.argv.includes('--harvest-only') || process.argv.includes('--dry-run');
  if (addedCount > 0 && !skipAlert) {
    const topLead = uniqueLeads[0];
    try {
      await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        headers: { Title: cleanHeader(`🏗️ ${addedCount} Georgia New Construction Leads Captured`), Priority: 'default', Tags: 'building_construction,house' },
        body: Buffer.from(`100% Georgia Multi-MLS New Construction Update:\n• New Leads: ${addedCount} | Total Active: ${uniqueLeads.length}\n• Sample: ${topLead?.city || 'Metro Atlanta'}, GA ($${Number(topLead?.price || 0).toLocaleString()})`, 'utf8')
      });
    } catch {}
  }
}

main().catch((err) => { console.warn('⚠️ [New Construction Radar]', err.message); process.exit(0); });
