import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const OUTPUT_JSON = path.join(ROOT_DIR, 'data', 'eleven-month-deed-leads.json');
const OUTPUT_HTML = path.join(ROOT_DIR, 'public', 'eleven-month-warranty-dispatch.html');
const DATA_UNSUB_FILE = path.join(ROOT_DIR, 'data', 'unsubscribed_contacts.json');
const ENGINE_UNSUB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const PERMIT_SUPP_FILE = path.join(ROOT_DIR, 'data', 'permit-suppression.json');
const MASTER_DB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'master_realtor_database.json');

const RETRIEVED_ON = '2026-11-14';
const REF_DATE = new Date('2026-11-14T12:00:00Z');
const GIS_START_MS = new Date('2025-09-01T00:00:00Z').getTime();
const GIS_END_MS = new Date('2026-03-15T23:59:59Z').getTime();

const METRO_COUNTIES = new Set([
  'fulton', 'dekalb', 'gwinnett', 'cobb', 'clayton', 'cherokee', 'forsyth',
  'henry', 'fayette', 'coweta', 'douglas', 'paulding', 'rockdale', 'newton',
  'walton', 'barrow', 'hall', 'dawson', 'bartow', 'jackson', 'carroll',
  'spalding', 'butts', 'morgan'
]);

const CORRIDOR_TARGETS = [
  { city: 'Alpharetta', corridor: 'NORTH_FULTON' }, { city: 'Roswell', corridor: 'NORTH_FULTON' },
  { city: 'Milton', corridor: 'NORTH_FULTON' }, { city: 'Johns Creek', corridor: 'NORTH_FULTON' },
  { city: 'Sandy Springs', corridor: 'NORTH_FULTON' }, { city: 'Dunwoody', corridor: 'NORTH_FULTON' },
  { city: 'Brookhaven', corridor: 'NORTH_FULTON' }, { city: 'Cumming', corridor: 'NORTHEAST' },
  { city: 'Buford', corridor: 'NORTHEAST' }, { city: 'Suwanee', corridor: 'NORTHEAST' },
  { city: 'Lawrenceville', corridor: 'NORTHEAST' }, { city: 'Dacula', corridor: 'NORTHEAST' },
  { city: 'Hoschton', corridor: 'NORTHEAST' }, { city: 'Braselton', corridor: 'NORTHEAST' },
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

const EXCLUDED_DOMAINS = new Set([
  'ansleyre.com', 'ansleyatlanta.com', 'cgrealtyinc.com',
  'metrobrokers.com', 'cbcmetrobrokers.com', 'peachtreetc.com',
  'drhorton.com', 'pulte.com', 'pultegroup.com', 'lennar.com',
  'ashtonwoods.com', 'stanleymartin.com', 'centurycommunities.com', 'beazer.com',
  'adamshomes.com', 'rocklynhomes.com', 'meritagehomes.com', 'tollbrothers.com',
  'kbhome.com', 'taylormorrison.com', 'smithdouglas.com', 'chafincommunities.com',
  'chafinrealtyinc.com', 'paranhomes.com', 'dwhomes.com', 'theprovidencegroup.com',
  'relianthomes.com', 'odwyerhomes.com', 'cstonega.com', 'weekleyhomes.com',
  'davidweekleyhomes.com', 'fischerhomes.com', 'empirecommunities.com', 'ryanhomes.com',
  'tratonhomes.com', 'khov.com', 'mihomes.com', 'brightlandhomes.com', 'mccarleyhomes.com'
]);

const SUPPRESSED_ENTITY_REGEX = /ansley|chapman group|amy\s+fuchs|joe\s+chapman|metro\s*brokers|peachtree\s*tc|cgrealty|drhorton|d\.r\.\s*horton|pulte|lennar|ashton\s*woods|stanley\s*martin|century\s*communities|beazer|adams\s*homes|rocklyn|meritage|toll\s*brothers|kb\s*home|taylor\s*morrison|smith\s*douglas|chafin|paran\s*homes|dw\s*homes|providence\s*group|reliant\s*homes|o'?dwyer|cstonega|david\s*weekley|fischer\s*homes|empire\s*communities|ryan\s*homes|traton\s*homes|khov/i;

const TRADE_SUBCONTRACTOR_REGEX = /plumb|electr|hvac|heat|air|roof|solar|drain|rooter|sewer|mech|generator|dekalbcountyga\.gov|expedit|sign|pool|fence|paving|grading|demo|fire|alarm|sprinkler|restore|remediat|mitigat|llc|inc\b|corp|homes|builders|construction|development|holdings|mhp|boavida/i;

const NON_NEW_BUILD_DESC_REGEX = /addition|alteration|remodel|repair|renovation|water meter|sewer tap|demolition|porch|deck|pool|sitewall|retaining|shed|arbor|gazebo|fence/i;

function cleanPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits.length === 10 ? digits : '';
}

function formatPhone(digits) {
  const d = cleanPhone(digits);
  return d ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : null;
}

function normalizeAddrKey(addr) {
  return String(addr || '').split(',')[0].toLowerCase()
    .replace(/\b(street|st|drive|dr|lane|ln|road|rd|court|ct|circle|cir|way|place|pl|parkway|pkwy|boulevard|blvd|trail|trl|avenue|ave|terrace|ter)\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function classifyCorridor(city = '', county = '') {
  const cLow = String(city).toLowerCase().trim();
  const hit = CITY_CORRIDOR_MAP.get(cLow);
  if (hit) return hit;
  if (/south fulton|college park|east point|hapeville|union city|palmetto|chattahoochee hills/.test(cLow)) return 'SOUTH';
  if (/atlanta/.test(cLow)) return 'INTOWN';
  const co = String(county).toLowerCase();
  if (/douglas|carroll/.test(co)) return 'WEST';
  if (/dekalb|rockdale|newton|walton|morgan/.test(co)) return 'EAST';
  if (/henry|fayette|coweta|clayton|spalding|butts/.test(co)) return 'SOUTH';
  if (/gwinnett|forsyth|hall|barrow|jackson|dawson/.test(co)) return 'NORTHEAST';
  if (/cobb|cherokee|paulding|bartow/.test(co)) return 'NORTHWEST';
  if (/fulton/.test(co)) return 'NORTH_FULTON';
  return 'INTOWN';
}

function loadSuppressed() {
  const emails = new Set();
  const phones = new Set(['6788780215', '0000000000', '6784802110']);
  for (const file of [DATA_UNSUB_FILE, ENGINE_UNSUB_FILE, PERMIT_SUPP_FILE]) {
    if (!fs.existsSync(file)) continue;
    try {
      const items = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const item of (Array.isArray(items) ? items : [])) {
        if (typeof item === 'string') {
          const psMatch = item.match(/email=([^;\s}]+)/i);
          const em = (psMatch ? psMatch[1] : item).toLowerCase().trim();
          if (em.includes('@')) emails.add(em.replace(/^%20/, ''));
          const pMatch = item.match(/phone=([^;\s}]+)/i);
          if (pMatch) { const cp = cleanPhone(pMatch[1]); if (cp) phones.add(cp); }
        } else if (item && typeof item === 'object') {
          if (item.email) emails.add(String(item.email).toLowerCase().trim());
          const cp = cleanPhone(item.phone);
          if (cp) phones.add(cp);
        }
      }
    } catch {}
  }
  return { emails, phones };
}

function isSuppressed(suppressed, { email = '', name = '', office = '', phone = '' }) {
  const em = String(email || '').toLowerCase().trim();
  const domain = em.includes('@') ? em.split('@')[1] : '';
  if (em && suppressed.emails.has(em)) return true;
  if (domain && EXCLUDED_DOMAINS.has(domain)) return true;
  const cp = cleanPhone(phone);
  if (cp && suppressed.phones.has(cp)) return true;
  if (SUPPRESSED_ENTITY_REGEX.test(`${em} ${name || ''} ${office || ''}`)) return true;
  return false;
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
      const p = cleanPhone(c.phone);
      if (p) phoneCounts.set(p, (phoneCounts.get(p) || 0) + 1);
      const n = String(c.name || '').trim().toLowerCase();
      if (n.length > 5) nameCounts.set(n, (nameCounts.get(n) || 0) + 1);
    }
    for (const c of contacts) {
      const em = String(c.email || '').toLowerCase().trim();
      if (!em.includes('@') || c.unsubscribed || c.quarantined || c.excluded) continue;
      if (isSuppressed(suppressed, { email: em, name: c.name, office: c.brokerage, phone: c.phone })) continue;
      const p = cleanPhone(c.phone);
      const n = String(c.name || '').trim().toLowerCase();
      if (p && (phoneCounts.get(p) || 0) <= 2 && !byPhone.has(p)) byPhone.set(p, { email: em, phone: p });
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

async function fetchJson(url, timeoutMs = 15000) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', Accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (!res.ok) continue;
      return await res.json();
    } catch {}
  }
  return null;
}

function computeTiming(dateInput, isPermit = false) {
  const dt = new Date(dateInput);
  if (isNaN(dt.getTime())) return null;
  const iso = dt.toISOString().slice(0, 10);
  const diffDays = Math.round((REF_DATE.getTime() - dt.getTime()) / 86400000);
  if (diffDays < 0 || diffDays > 435) return null;
  const monthsElapsed = Number((diffDays / 30.4375).toFixed(1));
  const exp = new Date(dt.getTime());
  exp.setUTCFullYear(exp.getUTCFullYear() + 1);
  const warrantyExpirationDate = exp.toISOString().slice(0, 10);
  const daysUntilWarrantyExpiry = Math.round((exp.getTime() - REF_DATE.getTime()) / 86400000);

  let cohort = 'RECENT_NEW_BUILD_COHORT';
  if (isPermit) {
    cohort = monthsElapsed >= 9 ? 'URGENT_10_TO_12_MONTHS' : 'UPCOMING_6_TO_9_MONTHS';
  } else if (monthsElapsed >= 9 && monthsElapsed <= 13) {
    cohort = 'URGENT_10_TO_12_MONTHS';
  } else if (monthsElapsed >= 6 && monthsElapsed < 9) {
    cohort = 'UPCOMING_6_TO_9_MONTHS';
  } else if (monthsElapsed > 13) {
    return null;
  }
  return { iso, monthsElapsed, warrantyExpirationDate, daysUntilWarrantyExpiry, cohort };
}

function parseMlsLead(src, feedName, sourceUrl, suppressed, masterLookup) {
  if (String(src.StateOrProvince || '').toUpperCase().trim() !== 'GA') return null;
  if (/lease|rental|land|lot|acreage|farm/i.test(String(src.PropertyType || src.PropertySubType || ''))) return null;
  const listPrice = Number(src.ListPrice || 0);
  const closePrice = Number(src.ClosePrice || listPrice || 0);
  if (listPrice < 200000 && closePrice < 200000) return null;

  const yearBuilt = Number(src.YearBuilt || 0);
  const isNew = src.NewConstructionYN === true || String(src.NewConstructionYN || '').toLowerCase() === 'true';
  if (!(isNew || yearBuilt >= 2025)) return null;

  const countyRaw = String(src.CountyOrParish || '').trim();
  const countyLow = countyRaw.toLowerCase();
  const city = String(src.City || '').trim();
  if (countyLow && !METRO_COUNTIES.has(countyLow)) return null;
  if (!countyLow && !CITY_CORRIDOR_MAP.has(city.toLowerCase())) return null;

  const address = String(src.UnparsedAddress || `${src.StreetNumber || ''} ${src.StreetName || ''} ${src.StreetSuffix || ''}`).trim();
  if (!address || /^0\s+/i.test(address)) return null;
  const timing = computeTiming(src.CloseDate, false);
  if (!timing) return null;

  const agentName = String(src.BuyerAgentFullName || '').trim();
  let agentEmail = String(src.BuyerAgentEmail || '').toLowerCase().trim();
  let agentCleanPhone = cleanPhone(src.BuyerAgentDirectPhone || src.BuyerAgentMobilePhone || '');
  const buyerOffice = String(src.BuyerOfficeName || '').trim();
  let enrichedFromMasterDb = false;

  if ((!agentEmail.includes('@') || !agentCleanPhone) && (agentName || agentCleanPhone)) {
    const hit = (agentCleanPhone && masterLookup.byPhone.get(agentCleanPhone))
      || (agentName.length > 5 && masterLookup.byName.get(agentName.toLowerCase()));
    if (hit) {
      if (!agentEmail.includes('@') && hit.email) { agentEmail = hit.email; enrichedFromMasterDb = true; }
      if (!agentCleanPhone && hit.phone) { agentCleanPhone = hit.phone; enrichedFromMasterDb = true; }
    }
  }
  if (/non-mls/i.test(agentName)) return null;
  if (isSuppressed(suppressed, { email: agentEmail, name: agentName, office: buyerOffice, phone: agentCleanPhone })) return null;
  const listingId = String(src.ListingId || src.ListingKey || `${city}_${address}`).trim();
  const streetNumMatch = address.match(/^(\d+)\s+/);
  const price = closePrice || listPrice;
  return {
    id: `${feedName === 'GeorgiaMLS' ? 'gamls' : 'fmls'}_11m_${listingId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    sourceSystem: feedName,
    source_url: sourceUrl,
    retrieved_on: RETRIEVED_ON,
    cohort: timing.cohort,
    address,
    city: city || 'Atlanta',
    county: countyRaw ? `${countyRaw.replace(/\s*county$/i, '').trim()} County` : 'Metro Atlanta',
    state: 'GA',
    postalCode: String(src.PostalCode || '').trim() || null,
    corridor: classifyCorridor(city, countyRaw),
    yearBuilt: yearBuilt >= 2024 ? yearBuilt : null,
    subdivision: String(src.SubdivisionName || '').trim() || null,
    price,
    closeDate: timing.iso,
    permitDate: null,
    monthsElapsed: timing.monthsElapsed,
    warrantyExpirationDate: timing.warrantyExpirationDate,
    daysUntilWarrantyExpiry: timing.daysUntilWarrantyExpiry,
    parcelId: String(src.ParcelNumber || '').trim() || null,
    ownerName: null,
    ownerMailingAddress: null,
    ownerEmail: null,
    ownerPhone: null,
    parcelSourceUrl: null,
    buyerAgentName: agentName || null,
    buyerAgentFirst: String(src.BuyerAgentFirstName || (agentName ? agentName.split(/\s+/)[0] : '')).trim() || null,
    buyerAgentEmail: agentEmail.includes('@') ? agentEmail : null,
    buyerAgentPhone: formatPhone(agentCleanPhone),
    buyerAgentCleanPhone: agentCleanPhone || null,
    buyerOfficeName: buyerOffice || null,
    enrichedFromMasterDb,
    email: agentEmail.includes('@') ? agentEmail : null,
    dns_mx_ok: null,
    _streetNum: streetNumMatch ? streetNumMatch[1] : null
  };
}

async function harvestMlsClosed(suppressed, masterLookup) {
  console.log('📡 [11-Month Warranty Harvester] Querying FMLS + GeorgiaMLS Closed New Construction feeds...');
  const urls = [];
  const fmlsNcOffsets = [0, 600, 1800, 3200, 4800, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 8800, 9000];
  for (const off of fmlsNcOffsets) {
    urls.push(`https://mls.virtusmart.com/api/search/p?From=${off}&Size=200&StandardStatus=Closed&feed=FMLS&NewConstructionYN=true`);
  }
  for (const off of [0, 2000, 4000, 6000, 6600, 7200]) {
    urls.push(`https://mls.virtusmart.com/api/search/p?From=${off}&Size=200&StandardStatus=Closed&feed=FMLS&YearBuilt=2025`);
  }
  for (const off of [0, 200, 400]) {
    urls.push(`https://mls.virtusmart.com/api/search/p?From=${off}&Size=200&StandardStatus=Closed&feed=GeorgiaMLS&YearBuilt=2025`);
    urls.push(`https://mls.virtusmart.com/api/search/p?From=${off}&Size=200&StandardStatus=Closed&feed=GeorgiaMLS&NewConstructionYN=true`);
  }
  urls.push('https://mls.virtusmart.com/api/search/p?From=0&Size=200&StandardStatus=Closed&feed=GeorgiaMLS&YearBuilt=2026');
  for (const t of CORRIDOR_TARGETS.slice(0, 18)) {
    const qCity = encodeURIComponent(t.city);
    urls.push(`https://mls.virtusmart.com/api/search/p?From=0&Size=100&StandardStatus=Closed&feed=FMLS&NewConstructionYN=true&City=${qCity}`);
    urls.push(`https://mls.virtusmart.com/api/search/p?From=0&Size=100&StandardStatus=Closed&feed=GeorgiaMLS&YearBuilt=2025&City=${qCity}`);
  }

  const pages = await mapWithConcurrency(urls, 8, async (url) => {
    const data = await fetchJson(url, 15000);
    return { url, rows: Array.isArray(data) ? data : [] };
  });

  const out = [];
  for (const { url, rows } of pages) {
    const feedName = url.includes('feed=GeorgiaMLS') ? 'GeorgiaMLS' : 'FMLS';
    for (const row of rows) {
      const lead = parseMlsLead(row?._source || {}, feedName, url, suppressed, masterLookup);
      if (lead) out.push(lead);
    }
  }
  console.log(`✅ [MLS Closed] Parsed ${out.length} candidate Georgia Metro new-build closings.`);
  return out;
}
async function harvestDeKalbPermits(suppressed) {
  const params = new URLSearchParams({
    where: "primaryContactType = '1' AND WorkTypeDescription = 'New Construction' AND (OccupancyTypeDescription LIKE '%Single Family%' OR OccupancyTypeDescription LIKE '%Townhouse%' OR OccupancyTypeDescription LIKE '%Residential%') AND ((cooIssuedDateTime >= DATE '2025-09-01' AND cooIssuedDateTime <= DATE '2026-03-15') OR (issuedDateTime >= DATE '2025-09-01' AND issuedDateTime <= DATE '2026-03-15') OR (applicationDateTime >= DATE '2025-09-01' AND applicationDateTime <= DATE '2026-03-15'))",
    outFields: 'OBJECTID,applicationNumber,id,locationLine1,primaryContactType,primaryContactName,primaryContactEMailAddress,primaryContactPhone,applicationName,comments,applicationDateTime,issuedDateTime,cooIssuedDateTime,status,declaredValuation,calculatedValuation,commonId,District',
    returnGeometry: 'false',
    orderByFields: 'OBJECTID DESC',
    resultRecordCount: '500',
    f: 'json'
  });
  const url = `https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0/query?${params}`;
  const json = await fetchJson(url, 15000);
  const out = [];
  for (const f of (json?.features || [])) {
    const a = f.attributes || {};
    const combined = `${a.primaryContactName || ''} ${a.primaryContactEMailAddress || ''} ${a.applicationName || ''}`;
    if (TRADE_SUBCONTRACTOR_REGEX.test(combined)) continue;
    if (NON_NEW_BUILD_DESC_REGEX.test(`${a.applicationName || ''} ${a.comments || ''}`)) continue;
    const ownerEmail = String(a.primaryContactEMailAddress || '').toLowerCase().trim();
    const ownerName = String(a.primaryContactName || '').trim();
    const ownerPhone = cleanPhone(a.primaryContactPhone || '');
    if (isSuppressed(suppressed, { email: ownerEmail, name: ownerName, phone: ownerPhone })) continue;
    const dtMs = [a.cooIssuedDateTime, a.issuedDateTime, a.applicationDateTime].find((t) => t && t >= GIS_START_MS && t <= GIS_END_MS);
    const timing = dtMs ? computeTiming(dtMs, true) : null;
    const addr = String(a.locationLine1 || '').trim();
    if (!timing || !addr) continue;
    const val = Number(a.declaredValuation || a.calculatedValuation || 0);
    out.push({
      id: `dkb_11m_${a.applicationNumber || a.id || a.OBJECTID}`,
      sourceSystem: 'DeKalb_GIS',
      source_url: url,
      retrieved_on: RETRIEVED_ON,
      cohort: timing.cohort,
      address: addr,
      city: 'Decatur / DeKalb',
      county: 'DeKalb County',
      state: 'GA',
      postalCode: null,
      corridor: 'EAST',
      yearBuilt: Number(timing.iso.slice(0, 4)),
      subdivision: String(a.applicationName || '').trim() || null,
      price: val >= 50000 ? val : null,
      closeDate: null,
      permitDate: timing.iso,
      monthsElapsed: timing.monthsElapsed,
      warrantyExpirationDate: timing.warrantyExpirationDate,
      daysUntilWarrantyExpiry: timing.daysUntilWarrantyExpiry,
      parcelId: a.commonId ? String(a.commonId).trim() : null,
      ownerName: ownerName || null,
      ownerMailingAddress: null,
      ownerEmail: ownerEmail.includes('@') ? ownerEmail : null,
      ownerPhone: formatPhone(ownerPhone),
      parcelSourceUrl: null,
      buyerAgentName: null, buyerAgentFirst: null, buyerAgentEmail: null,
      buyerAgentPhone: null, buyerAgentCleanPhone: null, buyerOfficeName: null,
      enrichedFromMasterDb: false,
      email: ownerEmail.includes('@') ? ownerEmail : null,
      dns_mx_ok: null
    });
  }
  console.log(`✅ [DeKalb GIS] Harvested ${out.length} clean 8-14 month residential owner permits.`);
  return out;
}

async function harvestAlpharettaPermits(suppressed) {
  const params = new URLSearchParams({
    where: "CASE_TYPE_DESC LIKE '%Residential%' AND CASE_TYPE_DESC LIKE '%New%'",
    outFields: 'CASE_NUMBER,CASE_NAME,CASE_TYPE_DESC,Location,DATE_ENTERED,ACTUAL_END_DATE,RESULT_CODE,STATUS_CODE,Facility_Id,CWID,CA_OBJECT_ID',
    returnGeometry: 'false',
    orderByFields: 'DATE_ENTERED DESC',
    resultRecordCount: '500',
    f: 'json'
  });
  const url = `https://alphagis.alpharetta.ga.us/arcgis/rest/services/OpenData/OpenData_PCE_Full/FeatureServer/3/query?${params}`;
  const json = await fetchJson(url, 15000);
  const out = [];
  for (const f of (json?.features || [])) {
    const a = f.attributes || {};
    if (NON_NEW_BUILD_DESC_REGEX.test(String(a.CASE_TYPE_DESC || ''))) continue;
    if (TRADE_SUBCONTRACTOR_REGEX.test(`${a.CASE_NAME || ''} ${a.Location || ''}`)) continue;
    if (isSuppressed(suppressed, { name: a.CASE_NAME || '' })) continue;
    const dtMs = [a.ACTUAL_END_DATE, a.DATE_ENTERED].find((t) => t && t >= GIS_START_MS && t <= GIS_END_MS);
    const timing = dtMs ? computeTiming(dtMs, true) : null;
    const rawLoc = String(a.Location || '').trim();
    const streetOnly = rawLoc.split(',')[0].trim();
    if (!timing || !streetOnly) continue;
    const zipMatch = rawLoc.match(/\b(30\d{3})\b/);
    out.push({
      id: `alp_11m_${String(a.CASE_NUMBER || a.CWID || a.CA_OBJECT_ID).replace(/[^a-zA-Z0-9_-]/g, '')}`,
      sourceSystem: 'Alpharetta_GIS',
      source_url: url,
      retrieved_on: RETRIEVED_ON,
      cohort: timing.cohort,
      address: streetOnly,
      city: 'Alpharetta',
      county: 'Fulton County',
      state: 'GA',
      postalCode: zipMatch ? zipMatch[1] : '30009',
      corridor: 'NORTH_FULTON',
      yearBuilt: Number(timing.iso.slice(0, 4)),
      subdivision: String(a.CASE_NAME || '').trim() || null,
      price: null, closeDate: null, permitDate: timing.iso,
      monthsElapsed: timing.monthsElapsed,
      warrantyExpirationDate: timing.warrantyExpirationDate,
      daysUntilWarrantyExpiry: timing.daysUntilWarrantyExpiry,
      parcelId: a.Facility_Id ? String(a.Facility_Id).trim() : null,
      ownerName: null, ownerMailingAddress: null, ownerEmail: null, ownerPhone: null, parcelSourceUrl: null,
      buyerAgentName: null, buyerAgentFirst: null, buyerAgentEmail: null,
      buyerAgentPhone: null, buyerAgentCleanPhone: null, buyerOfficeName: null,
      enrichedFromMasterDb: false, email: null, dns_mx_ok: null
    });
  }
  console.log(`✅ [Alpharetta GIS] Harvested ${out.length} clean 8-14 month residential permits.`);
  return out;
}
async function harvestJohnsCreekPermits(suppressed) {
  const params = new URLSearchParams({
    where: "JobTypeDescription LIKE '%Residential%' AND JobSquareFootage >= 2000 AND ISSUE_DATE >= DATE '2025-09-01' AND ISSUE_DATE <= DATE '2026-03-15'",
    outFields: 'OBJECTID,JobID,JobAddress,JobSquareFootage,JobStatus,ISSUE_DATE,AddrLocationID',
    returnGeometry: 'false',
    orderByFields: 'ISSUE_DATE DESC',
    resultRecordCount: '500',
    f: 'json'
  });
  const url = `https://services1.arcgis.com/bqfNVPUK3HOnCFmA/arcgis/rest/services/Building_Permits_Issued/FeatureServer/0/query?${params}`;
  const json = await fetchJson(url, 15000);
  const out = [];
  for (const f of (json?.features || [])) {
    const a = f.attributes || {};
    const addr = String(a.JobAddress || '').trim();
    if (!addr || TRADE_SUBCONTRACTOR_REGEX.test(addr) || isSuppressed(suppressed, { name: addr })) continue;
    const timing = a.ISSUE_DATE ? computeTiming(a.ISSUE_DATE, true) : null;
    if (!timing) continue;
    const sqft = Number(a.JobSquareFootage || 0);
    out.push({
      id: `jck_11m_${String(a.JobID || a.OBJECTID).replace(/[^a-zA-Z0-9_-]/g, '')}`,
      sourceSystem: 'JohnsCreek_GIS',
      source_url: url,
      retrieved_on: RETRIEVED_ON,
      cohort: timing.cohort,
      address: addr,
      city: 'Johns Creek',
      county: 'Fulton County',
      state: 'GA',
      postalCode: '30097',
      corridor: 'NORTH_FULTON',
      yearBuilt: Number(timing.iso.slice(0, 4)),
      subdivision: sqft ? `New Build (${sqft} sq ft)` : null,
      price: null, closeDate: null, permitDate: timing.iso,
      monthsElapsed: timing.monthsElapsed,
      warrantyExpirationDate: timing.warrantyExpirationDate,
      daysUntilWarrantyExpiry: timing.daysUntilWarrantyExpiry,
      parcelId: a.AddrLocationID ? String(a.AddrLocationID).trim() : null,
      ownerName: null, ownerMailingAddress: null, ownerEmail: null, ownerPhone: null, parcelSourceUrl: null,
      buyerAgentName: null, buyerAgentFirst: null, buyerAgentEmail: null,
      buyerAgentPhone: null, buyerAgentCleanPhone: null, buyerOfficeName: null,
      enrichedFromMasterDb: false, email: null, dns_mx_ok: null
    });
  }
  console.log(`✅ [Johns Creek GIS] Harvested ${out.length} clean 8-14 month residential permits.`);
  return out;
}

async function enrichFultonTaxParcels(leads) {
  const fultonLeads = leads.filter((l) => /fulton/i.test(l.county || ''));
  console.log(`🏛️  [Fulton Tax_Parcels] Looking up ${fultonLeads.length} Fulton County addresses...`);
  let matched = 0;
  await mapWithConcurrency(fultonLeads, 12, async (lead) => {
    const tokens = String(lead.address || '').toUpperCase().replace(/[^A-Z0-9\s]/g, ' ').trim().split(/\s+/);
    if (tokens.length < 2 || !/^\d+$/.test(tokens[0])) return;
    const num = tokens[0];
    const streetWord = (tokens[1].length <= 2 && tokens[2]) ? tokens[2] : tokens[1];
    const prefix = `${num} ${streetWord}`.replace(/'/g, "''");
    const params = new URLSearchParams({
      where: `Address LIKE '${prefix}%'`,
      outFields: 'ParcelID,Address,Owner,OwnerAddr1,Subdiv',
      resultRecordCount: '10',
      f: 'json'
    });
    const url = `https://services1.arcgis.com/AQDHTHDrZzfsFsB5/arcgis/rest/services/Tax_Parcels/FeatureServer/0/query?${params}`;
    const json = await fetchJson(url, 12000);
    const feat = (json?.features || []).find((ft) => {
      const pAddr = String(ft.attributes?.Address || '').toUpperCase().trim();
      return pAddr.startsWith(`${num} `) && pAddr.includes(streetWord);
    });
    if (!feat?.attributes) return;
    const a = feat.attributes;
    const owner = String(a.Owner || '').trim();
    if (owner && SUPPRESSED_ENTITY_REGEX.test(owner)) return;
    lead.parcelId = String(a.ParcelID || '').trim() || lead.parcelId;
    lead.ownerName = owner || lead.ownerName;
    lead.ownerMailingAddress = String(a.OwnerAddr1 || '').trim() || lead.ownerMailingAddress;
    if (!lead.subdivision && a.Subdiv) lead.subdivision = String(a.Subdiv).trim();
    lead.parcelSourceUrl = url;
    matched++;
  });
  console.log(`✅ [Fulton Tax_Parcels] Matched ${matched}/${fultonLeads.length} Fulton County parcels with recorded owner/parcel ID.`);
}
async function verifyMxDomains(leads) {
  const domains = new Set();
  for (const l of leads) {
    for (const em of [l.email, l.buyerAgentEmail, l.ownerEmail]) {
      if (em && em.includes('@')) domains.add(em.split('@')[1].toLowerCase().trim());
    }
  }
  console.log(`🌐 [DNS MX] Verifying ${domains.size} unique email domains via dns.promises.resolveMx...`);
  const fallbackResolver = new dns.promises.Resolver();
  fallbackResolver.setServers(['8.8.8.8', '1.1.1.1']);
  const mxMap = new Map();
  await mapWithConcurrency(Array.from(domains), 8, async (domain) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const fn = attempt === 0 ? dns.promises.resolveMx(domain) : fallbackResolver.resolveMx(domain);
        const mx = await Promise.race([
          fn,
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))
        ]);
        mxMap.set(domain, Array.isArray(mx) && mx.length > 0);
        return;
      } catch (err) {
        if (err && (err.code === 'ENOTFOUND' || err.code === 'ENODATA')) {
          mxMap.set(domain, false);
          return;
        }
      }
    }
    mxMap.set(domain, false);
  });
  let mxPass = 0;
  let mxFail = 0;
  const failedDomains = [];
  for (const l of leads) {
    if (l.buyerAgentEmail && !mxMap.get(l.buyerAgentEmail.split('@')[1])) {
      failedDomains.push(l.buyerAgentEmail.split('@')[1]);
      l.buyerAgentEmail = null;
    }
    if (l.ownerEmail && !mxMap.get(l.ownerEmail.split('@')[1])) {
      failedDomains.push(l.ownerEmail.split('@')[1]);
      l.ownerEmail = null;
    }
    l.email = l.buyerAgentEmail || l.ownerEmail || null;
    if (l.email) {
      l.dns_mx_ok = Boolean(mxMap.get(l.email.split('@')[1]));
      if (l.dns_mx_ok) mxPass++; else mxFail++;
    } else {
      l.dns_mx_ok = null;
    }
  }
  const uniqFailed = [...new Set(failedDomains)];
  console.log(`✅ [DNS MX] Verified: ${mxPass} leads with MX-valid email (${mxFail} failed; dead domains dropped: ${uniqFailed.join(', ') || 'none'}).`);
}

function dedupeAndSortLeads(rawLeads) {
  const byAddr = new Map();
  const scoreLead = (l) => (l.buyerAgentEmail ? 8 : 0) + (l.buyerAgentPhone ? 4 : 0) + (l.ownerEmail ? 6 : 0) + (l.ownerPhone ? 3 : 0) + (l.parcelId ? 2 : 0) + (l.sourceSystem === 'FMLS' ? 1 : 0);
  for (const l of rawLeads) {
    delete l._streetNum;
    const key = `${normalizeAddrKey(l.address)}::${String(l.city || '').toLowerCase().trim()}`;
    const prev = byAddr.get(key);
    if (!prev) {
      byAddr.set(key, l);
      continue;
    }
    if (scoreLead(l) > scoreLead(prev)) {
      if (!l.parcelId && prev.parcelId) l.parcelId = prev.parcelId;
      if (!l.ownerName && prev.ownerName) l.ownerName = prev.ownerName;
      if (!l.ownerMailingAddress && prev.ownerMailingAddress) l.ownerMailingAddress = prev.ownerMailingAddress;
      byAddr.set(key, l);
    } else {
      if (!prev.parcelId && l.parcelId) prev.parcelId = l.parcelId;
      if (!prev.ownerName && l.ownerName) prev.ownerName = l.ownerName;
      if (!prev.ownerMailingAddress && l.ownerMailingAddress) prev.ownerMailingAddress = l.ownerMailingAddress;
    }
  }
  const cohortRank = { URGENT_10_TO_12_MONTHS: 0, UPCOMING_6_TO_9_MONTHS: 1, RECENT_NEW_BUILD_COHORT: 2 };
  return Array.from(byAddr.values()).sort((a, b) => {
    const cr = (cohortRank[a.cohort] ?? 9) - (cohortRank[b.cohort] ?? 9);
    if (cr !== 0) return cr;
    const ac = (a.email || a.buyerAgentPhone || a.ownerPhone) ? 0 : 1;
    const bc = (b.email || b.buyerAgentPhone || b.ownerPhone) ? 0 : 1;
    if (ac !== bc) return ac - bc;
    return Math.abs(a.daysUntilWarrantyExpiry) - Math.abs(b.daysUntilWarrantyExpiry);
  });
}
function buildCompactDispatchData(leads) {
  const sourceIdx = new Map();
  const sources = [];
  const rows = leads.map((l) => {
    let si = sourceIdx.get(l.source_url);
    if (si === undefined) {
      si = sources.length;
      sources.push(l.source_url);
      sourceIdx.set(l.source_url, si);
    }
    return {
      id: l.id, src: l.sourceSystem, si, coh: l.cohort,
      addr: l.address, city: l.city, cnty: l.county, zip: l.postalCode || '',
      corr: l.corridor, sub: l.subdivision || '', pr: l.price || 0,
      dt: l.closeDate || l.permitDate || '', isP: Boolean(l.permitDate && !l.closeDate),
      mo: l.monthsElapsed, exp: l.warrantyExpirationDate, days: l.daysUntilWarrantyExpiry,
      pid: l.parcelId || '', own: l.ownerName || '', oaddr: l.ownerMailingAddress || '',
      oem: l.ownerEmail || '', oph: l.ownerPhone || '',
      anm: l.buyerAgentName || '', afn: l.buyerAgentFirst || '',
      aem: l.buyerAgentEmail || '', aph: l.buyerAgentPhone || '', acph: l.buyerAgentCleanPhone || '',
      aof: l.buyerOfficeName || '', mx: l.dns_mx_ok === true
    };
  });
  return { sources, rows };
}

function buildDispatchHtml(leads) {
  const { sources, rows } = buildCompactDispatchData(leads);
  const safeSourcesJson = JSON.stringify(sources).replace(/</g, '\\u003c');
  const safeJson = JSON.stringify(rows).replace(/</g, '\\u003c');
  const urgentCount = leads.filter((l) => l.cohort === 'URGENT_10_TO_12_MONTHS').length;
  const upcomingCount = leads.filter((l) => l.cohort === 'UPCOMING_6_TO_9_MONTHS').length;
  const recentCount = leads.filter((l) => l.cohort === 'RECENT_NEW_BUILD_COHORT').length;
  const fultonCount = leads.filter((l) => l.parcelId && l.ownerName).length;
  const agentEmailCount = leads.filter((l) => l.buyerAgentEmail).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>11-Month Builder Warranty &amp; Deed Dispatch | Foresight Home Inspections</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    html, body, div, section, header, main, footer, table, input, select, button, a, p, h1, h2, h3, span, pre, article { box-sizing: border-box; }
    :root {
      --bg: #090d16; --surface: #111827; --surface-2: #1e293b; --border: #263244;
      --gold: #d4af37; --gold-soft: #fde047; --emerald: #10b981; --red: #ef4444;
      --blue: #38bdf8; --text: #f8fafc; --muted: #94a3b8;
    }
    html, body { max-width: 100%; overflow-x: hidden; }
    body { margin: 0; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; line-height: 1.5; }
    .tri-header { background: #ffffff; border-bottom: 3px solid #d4af37; padding: 14px 22px; width: 100%; }
    .tri-inner { max-width: 1180px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
    .tri-sub { font-size: 11px; font-weight: 800; color: #0f172a; letter-spacing: 0.4px; margin-top: 6px; overflow-wrap: anywhere; }
    .tri-badges { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; max-width: 100%; }
    .wrap { max-width: 1180px; width: 100%; margin: 0 auto; padding: 20px 16px 64px; }
    .hero { background: linear-gradient(135deg, #111827 0%, #0f172a 100%); border: 1px solid rgba(212,175,55,0.35); border-radius: 16px; padding: 22px; margin-bottom: 16px; min-width: 0; max-width: 100%; }
    h1 { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 800; margin: 8px 0 8px; color: #ffffff; overflow-wrap: anywhere; }
    .sub { color: var(--muted); font-size: 13.5px; margin: 0 0 14px; overflow-wrap: anywhere; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 10px; min-width: 0; }
    .stat { background: rgba(9,13,22,0.75); border: 1px solid var(--border); border-radius: 10px; padding: 12px; min-width: 0; }
    .stat-v { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: var(--gold-soft); }
    .stat-l { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }
    .policy-bar { background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; font-size: 12.5px; color: #e2e8f0; min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
    .policy-bar strong { color: var(--gold-soft); }
    .controls { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; margin-bottom: 14px; min-width: 0; }
    .ctrl { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 10px; padding: 10px 13px; font-size: 13.5px; width: 100%; min-width: 0; }
    .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
    .tab { background: var(--surface); border: 1px solid var(--border); color: var(--muted); padding: 8px 14px; border-radius: 999px; font-size: 12.5px; font-weight: 700; cursor: pointer; max-width: 100%; }
    .tab.active { background: var(--gold); color: #0f172a; border-color: var(--gold); }
    .pager { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; font-size: 12.5px; color: var(--muted); gap: 8px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 13px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; border: 1px solid transparent; cursor: pointer; min-height: 40px; }
    .btn-gold { background: var(--gold); color: #0f172a; }
    .btn-emerald { background: var(--emerald); color: #0f172a; }
    .btn-ghost { background: rgba(255,255,255,0.06); color: #e2e8f0; border-color: var(--border); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(440px, 100%), 1fr)); gap: 14px; min-width: 0; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px; min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
    .card.urgent { border-left: 4px solid var(--red); }
    .card.upcoming { border-left: 4px solid var(--gold); }
    .card.recent { border-left: 4px solid var(--blue); }
    .badges { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .pill { display: inline-block; font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.04em; max-width: 100%; overflow-wrap: anywhere; }
    .p-red { background: rgba(239,68,68,0.16); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4); }
    .p-gold { background: rgba(212,175,55,0.16); color: var(--gold-soft); border: 1px solid rgba(212,175,55,0.38); }
    .p-blue { background: rgba(56,189,248,0.16); color: #7dd3fc; border: 1px solid rgba(56,189,248,0.38); }
    .p-em { background: rgba(16,185,129,0.16); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.38); }
    .addr { font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 800; color: #ffffff; overflow-wrap: anywhere; }
    .meta { font-size: 12.5px; color: var(--muted); overflow-wrap: anywhere; }
    .box { background: rgba(15,23,42,0.78); border: 1px solid var(--border); border-radius: 10px; padding: 11px 12px; font-size: 12.5px; min-width: 0; max-width: 100%; overflow-wrap: anywhere; }
    .box-title { font-size: 11px; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
    .actions { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 8px; }
    .alert-copy { background: #0b1120; border: 1px dashed #334155; border-radius: 8px; padding: 10px; font-size: 12px; color: #cbd5e1; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; max-width: 100%; overflow-x: auto; margin-top: 7px; }
    .footer { margin-top: 28px; padding: 18px; border-top: 1px solid var(--border); font-size: 12px; color: var(--muted); line-height: 1.6; overflow-wrap: anywhere; }
    @media (max-width: 780px) { .controls { grid-template-columns: minmax(0, 1fr); } }
    @media (max-width: 540px) { .tri-header { padding: 12px 14px; } .wrap { padding: 14px 12px 56px; } .hero, .policy-bar, .card { padding: 14px; } h1 { font-size: 21px; } .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid { grid-template-columns: minmax(0, 1fr); } }
    #toast { position: fixed; bottom: 18px; right: 18px; background: #0f172a; color: #fff; border: 1px solid var(--emerald); padding: 10px 16px; border-radius: 8px; font-size: 12.5px; font-weight: 700; display: none; z-index: 99; }
  </style>
</head>
<body>
  <header class="tri-header">
    <div class="tri-inner">
      <div>
        <img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" height="70" style="display:block;height:70px;width:auto;filter:none;border:0;">
        <div class="tri-sub">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; INTER-NACHI CPI &bull; TWO-INSPECTOR TEAM</div>
      </div>
      <div class="tri-badges">
        <img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="Certified Master Inspector (CMI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;">
        <img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="InterNACHI Certified Professional Inspector (CPI)" height="78" width="78" style="display:inline-block;height:78px;width:78px;border:0;vertical-align:middle;">
      </div>
    </div>
  </header>
  <main class="wrap">
    <section class="hero">
      <span class="pill p-gold">Live Verified Metro Atlanta Deed &amp; Warranty Radar (Retrieved ${RETRIEVED_ON})</span>
      <h1>11-Month Builder Warranty &amp; New-Construction Dispatch</h1>
      <p class="sub">100% live public FMLS/GeorgiaMLS closings, Fulton County Tax Parcels, and DeKalb / Alpharetta / Johns Creek GIS permits. Strictly $0.00 out-of-pocket dispatch: includes 1-click Buyer-Agent client-for-life touchpoints and $0 Client-Forwardable 11-Month Warranty Alert copy for Agent or direct Email/SMS.</p>
      <div class="stats">
        <div class="stat"><div class="stat-v">${leads.length.toLocaleString()}</div><div class="stat-l">Verified Leads</div></div>
        <div class="stat"><div class="stat-v" style="color:#fca5a5;">${urgentCount.toLocaleString()}</div><div class="stat-l">Urgent 10-12 Mo</div></div>
        <div class="stat"><div class="stat-v" style="color:#fde047;">${upcomingCount.toLocaleString()}</div><div class="stat-l">Upcoming 6-9 Mo</div></div>
        <div class="stat"><div class="stat-v" style="color:#7dd3fc;">${recentCount.toLocaleString()}</div><div class="stat-l">2026 New Builds</div></div>
        <div class="stat"><div class="stat-v" style="color:#6ee7b7;">${fultonCount.toLocaleString()}</div><div class="stat-l">Fulton Deed Owners</div></div>
        <div class="stat"><div class="stat-v" style="color:#6ee7b7;">${agentEmailCount.toLocaleString()}</div><div class="stat-l">MX-OK Agent Emails</div></div>
      </div>
    </section>
    <section class="policy-bar">
      <strong>Locked Service Rates:</strong> 11-Month Builder Warranty <strong>From $345</strong> &bull; Phase 1 Pre-Drywall <strong>From $275</strong> &bull; Final New Construction <strong>From $400</strong> &bull; Auxiliary &amp; Specialty Services (Sewer Scope, Radon, Termite/WDO, Mold/IAQ, Pool/Spa, STR, Unincorporated DeKalb Low-Flow Plumbing Certificate): <strong>Call (678) 480-2110 for Quote</strong>.<br>
      <strong>Two-Inspector Standard:</strong> Two Certified Master Inspectors in parallel (dedicated structural + mechanical focus, zero solo-inspector fatigue), active SUPRA eKEY, same-day interactive digital report + Digital Repair Request Builder, $35,000 combined protection ($10,000 Elite Master Warranty $0 deductible + $25,000 InterNACHI Honor Guarantee). Sunday: By Appointment Only. <strong>-$25 Courtesy Discount strictly for Verified Licensed Georgia Realtors only (Active GREC License # Required).</strong>
    </section>
    <div class="controls">
      <input id="q" class="ctrl" type="text" placeholder="Search address, city, county, owner, parcel, agent, or brokerage...">
      <select id="corrFilter" class="ctrl">
        <option value="">All 7 Corridors</option>
        <option value="NORTH_FULTON">North Fulton</option>
        <option value="NORTHEAST">Northeast</option>
        <option value="NORTHWEST">Northwest</option>
        <option value="EAST">East / DeKalb</option>
        <option value="SOUTH">South Metro</option>
        <option value="WEST">West Metro</option>
        <option value="INTOWN">Intown Atlanta</option>
      </select>
      <select id="contactFilter" class="ctrl">
        <option value="">All Contact Channels</option>
        <option value="agent_email">Has Buyer-Agent Email</option>
        <option value="agent_sms">Has Buyer-Agent SMS</option>
        <option value="fulton_owner">Has Fulton Recorded Owner</option>
        <option value="gis_owner">Has Direct GIS Owner Contact</option>
      </select>
      <button id="exportCsv" class="btn btn-emerald" type="button">Export CSV</button>
    </div>
    <div class="tabs" id="tabs">
      <button class="tab active" data-tab="URGENT_10_TO_12_MONTHS">Urgent 10-12 Mo (${urgentCount})</button>
      <button class="tab" data-tab="UPCOMING_6_TO_9_MONTHS">Upcoming 6-9 Mo (${upcomingCount})</button>
      <button class="tab" data-tab="RECENT_NEW_BUILD_COHORT">2026 New Builds (${recentCount})</button>
      <button class="tab" data-tab="FULTON_PARCEL">Fulton Deed Owners (${fultonCount})</button>
      <button class="tab" data-tab="GIS_PERMITS">GIS Permits</button>
      <button class="tab" data-tab="ALL">All (${leads.length})</button>
    </div>
    <div class="pager"><span id="pageInfo"></span><div><button id="prevBtn" class="btn btn-ghost" type="button">Prev</button> <button id="nextBtn" class="btn btn-ghost" type="button">Next</button></div></div>
    <div class="grid" id="grid"></div>
    <footer class="footer">
      <strong>Foresight Home Inspections, LLC</strong> &bull; Certified Master Inspector (#MICB-1082) &bull; InterNACHI #NACHI18051119 &bull; Direct: (678) 480-2110 &bull; inspect@foresightcmi.com &bull; <a href="https://www.fhinspectionsatl.com" style="color:#d4af37;">www.fhinspectionsatl.com</a><br>
      <strong>RESPA Section 8 Notice (12 U.S.C. 2607):</strong> Foresight Home Inspections, LLC is an independent inspection company with zero referral fees, zero kickbacks, and zero fee-splitting. All real estate professionals, homeowners, and buyers remain completely free to select any home inspector of their choice. Courtesy -$25 discount applies strictly to Verified Licensed Georgia Realtors only (Active GREC License # required).
    </footer>
  </main>
  <div id="toast"></div>
  <script>
    const SOURCES = ${safeSourcesJson};
    const LEADS = ${safeJson};
${buildDispatchClientScript()}
  </script>
</body>
</html>`;
}

function buildDispatchClientScript() {
  return `
    let tab = 'URGENT_10_TO_12_MONTHS', page = 0;
    const PAGE_SIZE = 36;
    const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const toast = (m) => { const t = document.getElementById('toast'); t.textContent = m; t.style.display = 'block'; setTimeout(() => { t.style.display = 'none'; }, 2400); };
    const copyTxt = (txt, label) => { navigator.clipboard?.writeText(txt).then(() => toast('Copied ' + label)); };
    const getSt = (id) => localStorage.getItem('w11_' + id) || 'Pending';
    const setSt = (id, v) => { localStorage.setItem('w11_' + id, v); toast('Status saved: ' + v); };

    function buildAgentTouchpoints(l) {
      const first = l.afn || (l.anm ? l.anm.split(' ')[0] : 'there');
      const prop = l.addr + ', ' + l.city + ', GA' + (l.zip ? ' ' + l.zip : '');
      const qUrl = 'https://www.fhinspectionsatl.com/quote?prop=' + encodeURIComponent(prop) + '&service=11-month-warranty';
      const subj = 'Client-for-Life 11-Month Warranty Check-In: ' + l.addr + ' (' + l.city + ')';
      const emailBody = 'Hi ' + first + ',\\n\\nHope your buyers who closed at ' + prop + ' on ' + (l.dt || 'recent build') + ' are enjoying their new home. Their 1-year builder warranty cutoff approaches around ' + l.exp + '.\\n\\nAs a client-for-life touchpoint, feel free to share our 11-Month Builder Warranty Inspection (From $345): two Certified Master Inspectors in parallel with calibrated infrared thermal scan, same-day interactive digital report + Digital Repair Request Builder, and $35,000 combined protection ($10,000 Elite Master Warranty $0 deductible + $25,000 InterNACHI Honor Guarantee).\\n\\nVerified Licensed Georgia Realtors receive our -$25 courtesy discount (Active GREC License # required). Phase 1 Pre-Drywall From $275 | Final New Construction From $400 | Specialty services (Sewer Scope, Radon, Termite/WDO, Mold/IAQ, Pool/Spa, STR, Unincorporated DeKalb Low-Flow): Call (678) 480-2110 for Quote.\\n\\nBooking link: ' + qUrl + '\\n\\nBest regards,\\nChristopher Boykin, CMI (#MICB-1082)\\nForesight Home Inspections | (678) 480-2110\\nRESPA Section 8 Notice (12 U.S.C. 2607): Independent inspection firm; zero referral fees or kickbacks; clients may choose any inspector.';
      const smsBody = 'Hi ' + first + ', Christopher Boykin with Foresight Home Inspections. Quick client-for-life heads-up: your buyers at ' + l.addr + ' (' + l.city + ') are approaching their 1-year builder warranty cutoff (' + l.exp + '). Our 2-inspector CMI 11-Month Warranty punch-list inspection is From $345 (-$25 courtesy for Verified Licensed GA Realtors, GREC # req). Book/share: ' + qUrl + ' or call (678) 480-2110.';
      return { subj, emailBody, smsBody, mailto: l.aem ? 'mailto:' + encodeURIComponent(l.aem) + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(emailBody) : '', smsUri: l.acph ? 'sms:+1' + l.acph + '?body=' + encodeURIComponent(smsBody) : '' };
    }

    function buildWarrantyAlertCopy(l) {
      const recip = l.own || 'Current Homeowner';
      const prop = l.addr + ', ' + l.city + ', GA' + (l.zip ? ' ' + l.zip : '');
      return 'ATTN: ' + recip + '\\n' + prop + (l.pid ? ' (Parcel ' + l.pid + ')' : '') + '\\n\\nYOUR 1-YEAR BUILDER WARRANTY CUTOFF: ' + l.exp + '\\nBefore your builder warranty expires permanently, protect your new build with Foresight Home Inspections (Two Certified Master Inspectors working in parallel).\\n- 11-Month Builder Warranty Evaluation: From $345\\n- Calibrated infrared thermal & moisture check + roof, attic, foundation, HVAC, plumbing, and electrical punch list\\n- Same-day interactive digital report + Digital Repair Request Builder\\n- $35,000 combined protection ($10,000 Elite Master Warranty $0 deductible + $25,000 InterNACHI Honor Guarantee)\\n- Specialty add-ons (Sewer Scope, Radon, Termite/WDO, Mold/IAQ, Pool/Spa, DeKalb Low-Flow): Call (678) 480-2110 for Quote\\nSchedule online: https://www.fhinspectionsatl.com/quote?service=11-month-warranty | Call/Text: (678) 480-2110 (Sunday: By Appointment Only)';
    }

    function getFiltered() {
      const q = document.getElementById('q').value.toLowerCase().trim();
      const corr = document.getElementById('corrFilter').value;
      const cf = document.getElementById('contactFilter').value;
      return LEADS.filter((l) => {
        if (tab === 'FULTON_PARCEL' && !(l.pid && l.own)) return false;
        else if (tab === 'GIS_PERMITS' && !l.isP) return false;
        else if (tab !== 'ALL' && tab !== 'FULTON_PARCEL' && tab !== 'GIS_PERMITS' && l.coh !== tab) return false;
        if (corr && l.corr !== corr) return false;
        if (cf === 'agent_email' && !l.aem) return false;
        if (cf === 'agent_sms' && !l.acph) return false;
        if (cf === 'fulton_owner' && !l.own) return false;
        if (cf === 'gis_owner' && !(l.oem || l.oph)) return false;
        if (q) {
          const hay = (l.addr + ' ' + l.city + ' ' + l.cnty + ' ' + l.own + ' ' + l.pid + ' ' + l.anm + ' ' + l.aof + ' ' + l.aem + ' ' + l.sub).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }

    function render() {
      const items = getFiltered();
      const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
      if (page >= totalPages) page = totalPages - 1;
      const startIdx = Math.imul(page, PAGE_SIZE);
      const endIdx = Math.imul(page + 1, PAGE_SIZE);
      const slice = items.slice(startIdx, endIdx);
      document.getElementById('pageInfo').textContent = 'Showing ' + (items.length ? (startIdx + 1) : 0) + '-' + Math.min(endIdx, items.length) + ' of ' + items.length + ' verified leads (Page ' + (page + 1) + '/' + totalPages + ')';
      const grid = document.getElementById('grid');
      if (!slice.length) { grid.innerHTML = '<div class="card">No matching records in this filter.</div>'; return; }
      grid.innerHTML = slice.map((l) => {
        const cls = l.coh === 'URGENT_10_TO_12_MONTHS' ? 'urgent' : (l.coh === 'UPCOMING_6_TO_9_MONTHS' ? 'upcoming' : 'recent');
        const pCls = cls === 'urgent' ? 'p-red' : (cls === 'upcoming' ? 'p-gold' : 'p-blue');
        const ag = buildAgentTouchpoints(l);
        const waCopy = buildWarrantyAlertCopy(l);
        const st = getSt(l.id);
        const dayText = l.days <= 0 ? (Math.abs(l.days) + 'd past yr-1') : (l.days + 'd left');
        return '<article class="card ' + cls + '" data-id="' + esc(l.id) + '">' +
          '<div class="badges"><span class="pill ' + pCls + '">' + esc(l.coh.replace(/_/g, ' ')) + ' (' + l.mo + ' mo)</span><span class="pill p-em">' + esc(l.src) + '</span><span class="pill p-gold">' + esc(l.corr) + '</span><span class="pill p-blue">' + esc(dayText) + '</span></div>' +
          '<div class="addr">' + esc(l.addr) + ', ' + esc(l.city) + ', GA ' + esc(l.zip) + '</div>' +
          '<div class="meta">' + esc(l.cnty) + (l.sub ? ' &bull; ' + esc(l.sub) : '') + (l.pr ? ' &bull; $' + Number(l.pr).toLocaleString() : '') + '<br>' + (l.isP ? 'Permit Date: ' : 'Close Date: ') + '<strong>' + esc(l.dt) + '</strong> &bull; Warranty Cutoff: <strong>' + esc(l.exp) + '</strong> &bull; <a href="' + esc(SOURCES[l.si] || '') + '" target="_blank" style="color:#38bdf8;">Live API Source</a></div>' +
          (l.own || l.pid ? '<div class="box"><div class="box-title">Recorded Deed / Parcel Owner</div>' + (l.own ? '<strong>' + esc(l.own) + '</strong> ' : '') + (l.pid ? '<span class="pill p-em">Parcel ' + esc(l.pid) + '</span>' : '') + (l.oaddr ? '<div class="meta" style="margin-top:3px;">Mailing: ' + esc(l.oaddr) + '</div>' : '') + (l.oem || l.oph ? '<div class="actions">' + (l.oem ? '<a class="btn btn-gold" href="mailto:' + esc(l.oem) + '?subject=' + encodeURIComponent('11-Month Builder Warranty Notice: ' + l.addr) + '&body=' + encodeURIComponent(waCopy) + '">Email Owner</a>' : '') + (l.oph ? '<a class="btn btn-emerald" href="sms:+1' + esc(l.oph.replace(/\\D/g, '')) + '?body=' + encodeURIComponent('Hi ' + (l.own ? l.own.split(' ')[0] : 'there') + ', Christopher Boykin with Foresight Home Inspections. Your 1-year builder warranty at ' + l.addr + ' approaches ' + l.exp + '. 2-inspector CMI 11-Month evaluation From $345: https://www.fhinspectionsatl.com/quote?service=11-month-warranty or (678) 480-2110.') + '">SMS Owner (' + esc(l.oph) + ')</a>' : '') + '</div>' : '') + '</div>' : '') +
          (l.anm || l.aem || l.aph ? '<div class="box"><div class="box-title">Buyer Agent Client-for-Life Touchpoint</div><strong>' + esc(l.anm || 'Buyer Agent') + '</strong>' + (l.aof ? ' &bull; ' + esc(l.aof) : '') + (l.mx ? ' <span class="pill p-em">MX OK</span>' : '') + '<div class="meta">' + esc(l.aem || 'No email') + (l.aph ? ' &bull; ' + esc(l.aph) : '') + '</div><div class="actions">' + (ag.mailto ? '<a class="btn btn-gold" href="' + esc(ag.mailto) + '">1-Click Mailto Agent</a>' : '') + (ag.smsUri ? '<a class="btn btn-emerald" href="' + esc(ag.smsUri) + '">1-Click SMS Agent</a>' : '') + '<button class="btn btn-ghost btn-cp-em" type="button">Copy Email</button><button class="btn btn-ghost btn-cp-sms" type="button">Copy SMS</button></div></div>' : '') +
          '<div class="box"><div class="box-title">$0 Client-Forwardable 11-Month Warranty Alert (For Agent or Direct Email/SMS)</div><pre class="alert-copy">' + esc(waCopy) + '</pre><div class="actions"><button class="btn btn-gold btn-cp-alert" type="button">Copy $0 Warranty Alert</button><select class="ctrl st-sel" style="width:auto;padding:6px 10px;font-size:12px;">' + ['Pending', 'Agent Emailed ($0)', 'Agent Texted ($0)', 'Owner Emailed/Texted ($0)', 'Booked'].map((o) => '<option' + (st === o ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></div></div></article>';
      }).join('');
    }

    const byId = new Map(LEADS.map((x) => [x.id, x]));
    document.getElementById('tabs').addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (!b) return; document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active')); b.classList.add('active'); tab = b.dataset.tab; page = 0; render(); });
    ['q', 'corrFilter', 'contactFilter'].forEach((id) => document.getElementById(id).addEventListener('input', () => { page = 0; render(); }));
    document.getElementById('prevBtn').addEventListener('click', () => { if (page > 0) { page--; render(); window.scrollTo(0, 0); } });
    document.getElementById('nextBtn').addEventListener('click', () => { page++; render(); window.scrollTo(0, 0); });
    document.getElementById('exportCsv').addEventListener('click', () => {
      const rows = getFiltered();
      const hdr = ['id', 'cohort', 'sourceSystem', 'address', 'city', 'county', 'zip', 'closeOrPermitDate', 'warrantyExpiration', 'parcelId', 'ownerName', 'ownerMailingAddress', 'buyerAgentName', 'buyerOfficeName', 'buyerAgentEmail', 'buyerAgentPhone'];
      const csv = [hdr.join(',')].concat(rows.map((r) => [r.id, r.coh, r.src, r.addr, r.city, r.cnty, r.zip, r.dt, r.exp, r.pid, r.own, r.oaddr, r.anm, r.aof, r.aem, r.aph].map((v) => '"' + String(v || '').replace(/"/g, '""') + '"').join(','))).join('\\n');
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'eleven-month-deed-leads.csv'; a.click();
    });
    document.getElementById('grid').addEventListener('click', (e) => {
      const card = e.target.closest('.card'); if (!card) return;
      const l = byId.get(card.dataset.id); if (!l) return;
      if (e.target.closest('.btn-cp-em')) copyTxt(buildAgentTouchpoints(l).emailBody, 'agent email');
      else if (e.target.closest('.btn-cp-sms')) copyTxt(buildAgentTouchpoints(l).smsBody, 'agent SMS');
      else if (e.target.closest('.btn-cp-alert')) copyTxt(buildWarrantyAlertCopy(l), '$0 warranty alert');
    });
    document.getElementById('grid').addEventListener('change', (e) => { if (e.target.classList.contains('st-sel')) setSt(e.target.closest('.card').dataset.id, e.target.value); });
    render();
  `;
}

async function main() {
  const start = Date.now();
  const suppressed = loadSuppressed();
  const masterLookup = loadMasterRealtorLookup(suppressed);

  const [mlsLeads, dkbLeads, alpLeads, jckLeads] = await Promise.all([
    harvestMlsClosed(suppressed, masterLookup),
    harvestDeKalbPermits(suppressed),
    harvestAlpharettaPermits(suppressed),
    harvestJohnsCreekPermits(suppressed)
  ]);

  let leads = dedupeAndSortLeads([...mlsLeads, ...dkbLeads, ...alpLeads, ...jckLeads]);
  await enrichFultonTaxParcels(leads);
  await verifyMxDomains(leads);

  leads = leads.filter((l) => {
    if (l.permitDate && !l.closeDate && l.ownerName && TRADE_SUBCONTRACTOR_REGEX.test(l.ownerName)) return false;
    return !isSuppressed(suppressed, {
      email: l.email || l.buyerAgentEmail || l.ownerEmail || '',
      name: `${l.buyerAgentName || ''} ${l.ownerName || ''}`,
      office: l.buyerOfficeName || '',
      phone: l.buyerAgentCleanPhone || l.ownerPhone || ''
    });
  });

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(leads, null, 2), 'utf8');

  const html = buildDispatchHtml(leads);
  if (html.includes('*') || /\baudit(s|ed|ing)?\b|\b(F404|F201|HomeGauge|CRL|RSMeans|FLIR|postcard|postage)\b|1816\s+South\s+Deshon/i.test(html)) {
    throw new Error('Dispatch HTML failed brand/copy guardrail check.');
  }
  fs.mkdirSync(path.dirname(OUTPUT_HTML), { recursive: true });
  fs.writeFileSync(OUTPUT_HTML, html, 'utf8');

  const stats = {
    total: leads.length,
    urgent: leads.filter((l) => l.cohort === 'URGENT_10_TO_12_MONTHS').length,
    upcoming: leads.filter((l) => l.cohort === 'UPCOMING_6_TO_9_MONTHS').length,
    recent: leads.filter((l) => l.cohort === 'RECENT_NEW_BUILD_COHORT').length,
    fmls: leads.filter((l) => l.sourceSystem === 'FMLS').length,
    gamls: leads.filter((l) => l.sourceSystem === 'GeorgiaMLS').length,
    dekalbGis: leads.filter((l) => l.sourceSystem === 'DeKalb_GIS').length,
    alpharettaGis: leads.filter((l) => l.sourceSystem === 'Alpharetta_GIS').length,
    johnsCreekGis: leads.filter((l) => l.sourceSystem === 'JohnsCreek_GIS').length,
    fultonTaxMatched: leads.filter((l) => l.parcelId && l.ownerName).length,
    enrichedMasterDb: leads.filter((l) => l.enrichedFromMasterDb).length,
    mxVerifiedEmails: leads.filter((l) => l.dns_mx_ok === true).length,
    elapsedSec: ((Date.now() - start) / 1000).toFixed(1)
  };
  console.log('🏁 [11-Month Warranty Harvest Complete]', JSON.stringify(stats, null, 2));
}

main().catch((err) => {
  console.error('❌ [11-Month Warranty Harvest Fatal]', err);
  process.exit(1);
});
