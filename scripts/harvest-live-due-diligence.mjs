import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const UNDER_CONTRACT_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const ARCHIVE_FILE = path.join(ROOT_DIR, 'data', 'archive-under-contract-realtors.json');
const UNSUBSCRIBED_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const MASTER_DB_FILE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'master_realtor_database.json');

function loadMasterRealtorLookup(suppressedEmails) {
  const byPhone = new Map();
  const byName = new Map();
  if (!fs.existsSync(MASTER_DB_FILE)) return { byPhone, byName };
  try {
    const raw = JSON.parse(fs.readFileSync(MASTER_DB_FILE, 'utf8'));
    const contacts = Object.values(raw.contacts || {});
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
      if (!em || !em.includes('@') || c.unsubscribed || c.quarantined || c.excluded) continue;
      if (suppressedEmails.has(em) || EXCLUDED_DOMAINS.has(em.split('@')[1] || '')) continue;
      if (/ansley|chapman group/i.test(c.brokerage || '') || /amy fuchs|joe chapman/i.test(c.name || '')) continue;
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

const METRO_COUNTIES = new Set([
  'fulton', 'dekalb', 'gwinnett', 'cobb', 'clayton', 'cherokee', 'forsyth',
  'henry', 'fayette', 'coweta', 'douglas', 'paulding', 'rockdale', 'newton',
  'walton', 'barrow', 'hall', 'dawson', 'bartow', 'jackson', 'carroll',
  'spalding', 'butts', 'morgan'
]);

const EXCLUDED_DOMAINS = new Set([
  'ansleyre.com', 'ansleyatlanta.com', 'cgrealtyinc.com',
  'metrobrokers.com', 'cbcmetrobrokers.com', 'peachtreetc.com',
  'drhorton.com', 'pulte.com', 'lennar.com', 'ashtonwoods.com', 'stanleymartin.com',
  'centurycommunities.com', 'beazer.com', 'adamshomes.com', 'rocklynhomes.com',
  'meritagehomes.com', 'tollbrothers.com', 'kbhome.com', 'taylormorrison.com',
  'smithdouglas.com', 'chafincommunities.com', 'chafinrealtyinc.com', 'paranhomes.com',
  'dwhomes.com', 'theprovidencegroup.com', 'relianthomes.com', 'odwyerhomes.com', 'cstonega.com'
]);

const DEKALB_REGEX = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|chamblee|clarkston|doraville|avondale/i;

export const SURROUNDING_QUADRANT_CITIES = {
  NORTH_FULTON: [
    'Alpharetta', 'Roswell', 'Sandy Springs', 'Johns Creek', 'Milton',
    'Dunwoody', 'Brookhaven', 'Chamblee', 'Doraville'
  ],
  NORTHEAST: [
    'Lawrenceville', 'Buford', 'Duluth', 'Suwanee', 'Dacula', 'Lilburn',
    'Norcross', 'Peachtree Corners', 'Grayson', 'Sugar Hill', 'Cumming',
    'Hoschton', 'Flowery Branch', 'Gainesville', 'Auburn', 'Winder', 'Braselton'
  ],
  SOUTH: [
    'McDonough', 'Stockbridge', 'Locust Grove', 'Hampton', 'Fayetteville',
    'Peachtree City', 'Newnan', 'Senoia', 'Tyrone', 'Fairburn', 'College Park',
    'East Point', 'Union City', 'Jonesboro', 'Rex', 'Morrow', 'Riverdale', 'Forest Park'
  ],
  EAST: [
    'Decatur', 'Lithonia', 'Stone Mountain', 'Tucker', 'Conyers', 'Covington',
    'Snellville', 'Loganville', 'Monroe', 'Stonecrest', 'Clarkston',
    'Avondale Estates', 'Social Circle'
  ],
  WEST: [
    'Douglasville', 'Villa Rica', 'Lithia Springs', 'Carrollton', 'Austell', 'Mableton'
  ],
  NORTHWEST: [
    'Marietta', 'Smyrna', 'Kennesaw', 'Acworth', 'Woodstock', 'Canton',
    'Dallas', 'Powder Springs', 'Hiram', 'Cartersville', 'Vinings'
  ]
};

export function classifyQuadrant(city = '', county = '') {
  const c = String(city).toLowerCase().trim();
  const co = String(county).toLowerCase().trim();
  for (const [quad, list] of Object.entries(SURROUNDING_QUADRANT_CITIES)) {
    if (list.some((item) => item.toLowerCase() === c)) return quad;
  }
  if (/douglas|carroll/.test(co)) return 'WEST';
  if (/dekalb|rockdale|newton|walton|morgan/.test(co)) return 'EAST';
  if (/henry|fayette|coweta|clayton|spalding|butts/.test(co)) return 'SOUTH';
  if (/gwinnett|forsyth|hall|barrow|jackson|dawson/.test(co)) return 'NORTHEAST';
  if (/cobb|cherokee|paulding|bartow/.test(co)) return 'NORTHWEST';
  return 'INTOWN';
}

function formatPhone(digits) {
  if (!digits || digits.length !== 10) return digits || '';
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function buildSmsCopy(first, address, city, role) {
  const isDeKalb = DEKALB_REGEX.test(city || '') || DEKALB_REGEX.test(address || '');
  const dekalbNote = isDeKalb ? ', plus signed DeKalb Low-Flow certs' : '';
  if (role === 'BUYER_AGENT') {
    return `Hi ${first}, congrats on getting your buyers under contract at ${address} in ${city}! This is Chris Boykin with Foresight Home Inspections. If your buyers need a fast 24-hr inspection slot during due diligence, my partner and I inspect together as a 2-inspector CMI team ($345+ homes, active SUPRA eKEY, same-day report${dekalbNote}). You can check times here: https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)} or text me at (678) 480-2110.`;
  }
  return `Hi ${first}, Chris Boykin with Foresight Home Inspections here. Saw ${address} in ${city} just went under contract, congrats! If the buyers or co-op agent need a fast 24-hr due diligence slot, my partner and I inspect together as a 2-inspector CMI team ($345+ homes, SUPRA eKEY, same-day report${dekalbNote}) or we can help with a pre-listing inspection (From $345) on your next listing. My cell is (678) 480-2110 | https://www.fhinspectionsatl.com/realtors`;
}

export async function harvestLiveDueDiligence(maxOffset = 1400) {
  console.log('🔍 [Live FMLS Due Diligence Harvester] Scanning live FMLS feed for Pending / Under-Contract homes...');

  const suppressedEmails = new Set();
  const suppressedPhones = new Set(['6788780215', '0000000000']);
  if (fs.existsSync(UNSUBSCRIBED_FILE)) {
    try {
      const unsubs = JSON.parse(fs.readFileSync(UNSUBSCRIBED_FILE, 'utf8'));
      for (const u of unsubs) {
        if (typeof u === 'string') suppressedEmails.add(u.toLowerCase().trim());
        else if (u?.email) suppressedEmails.add(u.email.toLowerCase().trim());
      }
    } catch {}
  }

  let existing = [];
  if (fs.existsSync(UNDER_CONTRACT_FILE)) {
    try {
      existing = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
    } catch {
      existing = [];
    }
  }

  const byKey = new Map();
  for (const item of existing) {
    if ((item.raw_price || 0) < 75000 || /^0\s+/i.test(item.address || '') || /non-mls/i.test(item.name || '') || item.clean_phone === '0000000000') {
      continue;
    }
    const itemEmail = String(item.email || '').toLowerCase().trim();
    const itemDomain = itemEmail.split('@')[1] || '';
    if (EXCLUDED_DOMAINS.has(itemDomain) || suppressedEmails.has(itemEmail) || suppressedPhones.has(item.clean_phone)) {
      continue;
    }
    const first = item.first || (item.name ? item.name.split(' ')[0] : 'there');
    const textBody = buildSmsCopy(first, item.address, item.city, item.role);
    const buyerForwardBody = `Hi ${first}, here is our 1-click due diligence quote link and $35,000 warranty info for your buyers at ${item.address}: https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(item.address)} — Includes our 2-inspector team, same-day report, and free utility setup concierge. Feel free to pass this along to your buyers!`;
    item.text_body = textBody;
    item.sms_link = item.clean_phone ? `sms:+1${item.clean_phone}?&body=${encodeURIComponent(textBody)}` : '';
    item.buyer_forward_body = buyerForwardBody;
    item.buyer_forward_link = item.clean_phone ? `sms:+1${item.clean_phone}?&body=${encodeURIComponent(buyerForwardBody)}` : '';
    item.quadrant = classifyQuadrant(item.city, item.county);
    const k = item.listing_ref || item.listing_key || `${(item.email || item.clean_phone || '').toLowerCase()}::${(item.address || '').toLowerCase()}`;
    delete item.listing_key;
    item.listing_ref = k;
    byKey.set(k, item);
  }

  const masterLookup = loadMasterRealtorLookup(suppressedEmails);
  const KNOWN_METRO_CITIES = new Set(
    Object.values(SURROUNDING_QUADRANT_CITIES).flat().map(c => c.toLowerCase()).concat(['atlanta'])
  );
  let newPendingDeals = 0;

  const feedUrls = [];
  for (let offset = 0; offset < maxOffset; offset += 200) {
    feedUrls.push(`https://mls.virtusmart.com/api/search/p?From=${offset}&Size=200&geocode=1&feed=FMLS`);
    feedUrls.push(`https://mls.virtusmart.com/api/search/p?From=${offset}&Size=200&geocode=1&feed=GeorgiaMLS`);
  }
  for (const quad of ['NORTH_FULTON', 'NORTHEAST', 'SOUTH', 'EAST', 'WEST', 'NORTHWEST']) {
    for (const targetCity of SURROUNDING_QUADRANT_CITIES[quad].slice(0, 5)) {
      const qCity = encodeURIComponent(targetCity);
      feedUrls.push(`https://mls.virtusmart.com/api/search/p?From=0&Size=100&geocode=1&feed=FMLS&City=${qCity}`);
      feedUrls.push(`https://mls.virtusmart.com/api/search/p?From=0&Size=100&geocode=1&feed=GeorgiaMLS&City=${qCity}`);
    }
  }

  const fetchedPages = await mapWithConcurrency(feedUrls, 25, async (url) => {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(7000)
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  for (const data of fetchedPages) {
    if (!Array.isArray(data) || data.length === 0) continue;
    try {
      for (const row of data) {
        const src = row?._source || {};
        const status = String(src.StandardStatus || src.MlsStatus || '');
        if (/closed|sold|terminate|withdraw|expired/i.test(status)) continue;
        if (!/pending|under contract|contingent/i.test(status)) continue;
        if (src.CloseDate) continue;

        const state = String(src.StateOrProvince || '').toUpperCase().trim();
        if (state && state !== 'GA') continue;

        const propType = String(src.PropertyType || src.PropertySubType || '');
        if (/lease|rental|land|lot|acreage|farm/i.test(propType)) continue;

        const county = String(src.CountyOrParish || '').toLowerCase().trim();
        const city = String(src.City || 'Atlanta').trim();
        if (county && !METRO_COUNTIES.has(county)) continue;
        if (!county && !KNOWN_METRO_CITIES.has(city.toLowerCase())) continue;

        const address = String(src.UnparsedAddress || '').trim();
        if (!address || /^0\s+/i.test(address)) continue;

        const rawPrice = Number(src.ListPrice || 0);
        // Purchase-Only Quality Gate: Reject rentals (<$75,000) and unpriced lots
        if (rawPrice < 75000) continue;
        const priceStr = `$${rawPrice.toLocaleString()}`;
        const pendingTs = String(src.PurchaseContractDate || src.PendingTimestamp || src.StatusChangeTimestamp || new Date().toISOString());
        const pendingMs = new Date(pendingTs).getTime();
        const nowMs = Date.now();
        const ageDays = (nowMs - pendingMs) / (1000 * 60 * 60 * 24);

        // Strict 48-hour cutoff: Never harvest contracts older than 2 days or already closed
        if (isNaN(ageDays) || ageDays < 0 || ageDays > 2) continue;
        const dateStr = pendingTs.slice(0, 10);

        const feedName = String(src.OriginatingSystemName || (String(src.ListingId || '').startsWith('1') ? 'GeorgiaMLS' : 'FMLS'));
        const listRawPhone = String(
          src.ListAgentDirectPhone || src.ListAgentMobilePhone || src.ShowingContactPhone || src.AttributionContact || ''
        ).replace(/\D/g, '').slice(-10);

        const targets = [
          {
            role: 'BUYER_AGENT',
            name: String(src.BuyerAgentFullName || '').trim(),
            first: String(src.BuyerAgentFirstName || '').trim(),
            email: String(src.BuyerAgentEmail || '').toLowerCase().trim(),
            phone: String(src.BuyerAgentDirectPhone || src.BuyerAgentMobilePhone || '').replace(/\D/g, '').slice(-10),
            brokerage: String(src.BuyerOfficeName || 'Buyer Representation').trim()
          },
          {
            role: 'LIST_AGENT',
            name: String(src.ListAgentFullName || src.ShowingContactName || '').trim(),
            first: String(src.ListAgentFirstName || '').trim(),
            email: String(src.ListAgentEmail || '').toLowerCase().trim(),
            phone: listRawPhone,
            brokerage: String(src.ListOfficeName || 'Listing Representation').trim()
          }
        ];

        for (const t of targets) {
          if (t.phone.length !== 10 || !t.email.includes('@')) {
            const normNameLookup = t.name.toLowerCase().trim();
            const enriched = (t.phone.length === 10 && masterLookup.byPhone.get(t.phone))
              || (normNameLookup.length > 5 && masterLookup.byName.get(normNameLookup));
            if (enriched) {
              if (!t.email && enriched.email) t.email = enriched.email;
              if (t.phone.length !== 10 && enriched.phone) t.phone = enriched.phone;
            }
          }
          if (!t.name && !t.phone && !t.email) continue;
          if (/non-mls/i.test(t.name) || t.phone === '0000000000') continue;
          if (t.phone.length !== 10 && !t.email.includes('@')) continue;

          const domain = t.email.split('@')[1] || '';
          if (EXCLUDED_DOMAINS.has(domain)) continue;
          if (suppressedEmails.has(t.email) || suppressedPhones.has(t.phone)) continue;
          if (/ansley|chapman group/i.test(t.brokerage) || /amy fuchs|joe chapman/i.test(t.name)) continue;

          const first = t.first || t.name.split(' ')[0] || 'there';
          const listingRef = `${t.role}::${t.email || t.phone}::${address.toLowerCase()}`;
          if (byKey.has(listingRef)) continue;

          const idHash = crypto.createHash('md5').update(listingRef).digest('hex').slice(0, 10);
          const idPrefix = feedName === 'GeorgiaMLS' ? 'gamls_pending_' : 'fmls_pending_';
          const textBody = buildSmsCopy(first, address, city, t.role);
          const buyerForwardBody = `Hi ${first}, here is our 1-click due diligence scheduler and $35,000 warranty certificate for your buyers at ${address}: https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)} — Includes our two-inspector team, same-day report, and free utility setup concierge. Feel free to pass this directly to your buyers!`;

          const record = {
            id: `${idPrefix}${idHash}`,
            listing_ref: listingRef,
            mlsFeed: feedName,
            role: t.role,
            email: t.email,
            name: t.name,
            first,
            brokerage: t.brokerage,
            city,
            county: src.CountyOrParish || '',
            quadrant: classifyQuadrant(city, src.CountyOrParish || ''),
            address,
            price: priceStr,
            raw_price: rawPrice,
            date: dateStr,
            pending_timestamp: pendingTs,
            phone: formatPhone(t.phone),
            raw_phone: t.phone,
            clean_phone: t.phone,
            text_body: textBody,
            sms_link: t.phone ? `sms:+1${t.phone}?&body=${encodeURIComponent(textBody)}` : '',
            buyer_forward_body: buyerForwardBody,
            buyer_forward_link: t.phone ? `sms:+1${t.phone}?&body=${encodeURIComponent(buyerForwardBody)}` : '',
            initial_sent: false,
            in_cooldown: false
          };

          byKey.set(listingRef, record);
          newPendingDeals++;
        }
      }
    } catch (err) {
      console.warn(`⚠️ [Live FMLS Harvester] Warning fetching feed:`, err.message);
    }
  }

  const allDeals = Array.from(byKey.values());

  // Strict 2-day (48-hour) rolling due diligence window (Georgia 0-48h rapid diligence outreach)
  const nowMs = Date.now();
  const maxAgeMs = 2 * 24 * 60 * 60 * 1000;
  const cutoffDateStr = new Date(nowMs - maxAgeMs).toISOString().slice(0, 10);

  const active = [];
  const stale = [];

  for (const item of allDeals) {
    const itemDate = (item.date || '').slice(0, 10);
    const itemTimestamp = new Date(item.pending_timestamp || item.date || 0).getTime();
    const isClosedOrStale = item.closed || item.close_date || (nowMs - itemTimestamp > maxAgeMs);
    if (!isClosedOrStale && itemDate >= cutoffDateStr) {
      active.push(item);
    } else {
      stale.push(item);
    }
  }

  // If there are stale deals, archive them so no historical data is lost
  if (stale.length > 0) {
    let archive = [];
    if (fs.existsSync(ARCHIVE_FILE)) {
      try {
        archive = JSON.parse(fs.readFileSync(ARCHIVE_FILE, 'utf8'));
      } catch {
        archive = [];
      }
    }
    const archiveMap = new Map();
    for (const item of archive) {
      const k = item.listing_ref || item.listing_key || item.id || `${item.email || ''}::${item.clean_phone || ''}::${item.address || ''}`;
      delete item.listing_key;
      item.listing_ref = k;
      archiveMap.set(k, item);
    }
    for (const item of stale) {
      const k = item.listing_ref || item.listing_key || item.id || `${item.email || ''}::${item.clean_phone || ''}::${item.address || ''}`;
      delete item.listing_key;
      item.listing_ref = k;
      archiveMap.set(k, item);
    }
    const mergedArchive = Array.from(archiveMap.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(mergedArchive, null, 2), 'utf8');
  }

  // Sort within each quadrant: freshest dates first, Buyer Agent first, highest list price first
  const baseCompare = (a, b) => {
    const dCmp = (b.date || '').localeCompare(a.date || '');
    if (dCmp !== 0) return dCmp;
    if (a.role === 'BUYER_AGENT' && b.role !== 'BUYER_AGENT') return -1;
    if (b.role === 'BUYER_AGENT' && a.role !== 'BUYER_AGENT') return 1;
    return (b.raw_price || 0) - (a.raw_price || 0);
  };

  const quadrantOrder = ['EAST', 'SOUTH', 'NORTHEAST', 'NORTH_FULTON', 'WEST', 'NORTHWEST', 'INTOWN'];
  const buckets = { EAST: [], SOUTH: [], NORTHEAST: [], NORTH_FULTON: [], WEST: [], NORTHWEST: [], INTOWN: [] };
  for (const item of active) {
    const q = classifyQuadrant(item.city, item.county);
    item.quadrant = q;
    (buckets[q] || buckets.INTOWN).push(item);
  }
  for (const q of quadrantOrder) buckets[q].sort(baseCompare);

  // Round-robin interleave across East, South, Northeast, North Fulton, West, Northwest, and Intown
  const balancedActive = [];
  let added = true;
  while (added) {
    added = false;
    for (const q of quadrantOrder) {
      if (buckets[q].length > 0) {
        balancedActive.push(buckets[q].shift());
        added = true;
      }
    }
  }

  fs.writeFileSync(UNDER_CONTRACT_FILE, JSON.stringify(balancedActive, null, 2), 'utf8');
  console.log(`✅ [Live FMLS + GeorgiaMLS Harvester] Discovered ${newPendingDeals} new deals. Active pool maintained at ${balancedActive.length} balanced 7-corridor records (${stale.length} archived).`);
  return { newPendingDeals, totalRecords: balancedActive.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  harvestLiveDueDiligence().catch(console.error);
}
