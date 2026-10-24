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

const METRO_COUNTIES = new Set([
  'fulton', 'dekalb', 'gwinnett', 'cobb', 'clayton', 'cherokee', 'forsyth',
  'henry', 'fayette', 'coweta', 'douglas', 'paulding', 'rockdale', 'newton',
  'walton', 'barrow', 'hall', 'dawson', 'bartow', 'jackson', 'carroll',
  'spalding', 'butts', 'morgan'
]);

const EXCLUDED_DOMAINS = new Set([
  'ansleyre.com', 'ansleyatlanta.com', 'cgrealtyinc.com', 'drhorton.com',
  'pulte.com', 'lennar.com', 'ashtonwoods.com', 'stanleymartin.com',
  'centurycommunities.com', 'beazer.com', 'adamshomes.com', 'rocklynhomes.com',
  'meritagehomes.com', 'tollbrothers.com', 'kbhome.com', 'taylormorrison.com',
  'smithdouglas.com', 'chafincommunities.com', 'paranhomes.com'
]);

const DEKALB_REGEX = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|chamblee|clarkston|doraville|avondale/i;

function formatPhone(digits) {
  if (!digits || digits.length !== 10) return digits || '';
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function buildSmsCopy(first, address, city, role) {
  const isDeKalb = DEKALB_REGEX.test(city || '') || DEKALB_REGEX.test(address || '');
  const dekalbBonus = isDeKalb ? ', plus on-site DeKalb Low-Flow Certificate ($100)' : '';
  if (role === 'BUYER_AGENT') {
    return `Hi ${first}, congrats on getting your buyers under contract at ${address} in ${city}! Christopher Boykin, CMI with Foresight Home Inspections here. If your buyers need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day digital report${dekalbBonus}, we have a slot open in ${city}: https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)} — (678) 480-2110`;
  }
  return `Hi ${first}, Christopher Boykin with Foresight Home Inspections here! Saw ${address} in ${city} just went under contract—congratulations! If your buyers or co-op agent need a rapid 24-hr due diligence inspection with our two-inspector team, active SUPRA eKEY access, and same-day report delivery${dekalbBonus}, we have a slot open in ${city} this week. Best wishes on a smooth closing! — (678) 480-2110 | https://www.fhinspectionsatl.com/realtors`;
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
    const k = item.listing_ref || item.listing_key || `${(item.email || item.clean_phone || '').toLowerCase()}::${(item.address || '').toLowerCase()}`;
    delete item.listing_key;
    item.listing_ref = k;
    byKey.set(k, item);
  }

  let newPendingDeals = 0;

  for (let offset = 0; offset < maxOffset; offset += 200) {
    const url = `https://mls.virtusmart.com/api/search/p?From=${offset}&Size=200&geocode=1&feed=FMLS`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      if (!res.ok) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;

      for (const row of data) {
        const src = row?._source || {};
        const status = String(src.StandardStatus || src.MlsStatus || '');
        if (/closed|sold|terminate|withdraw|expired/i.test(status)) continue;
        if (!/pending|under contract|contingent/i.test(status)) continue;
        if (src.CloseDate) continue;

        const propType = String(src.PropertyType || src.PropertySubType || '');
        if (/lease|rental|land|lot|acreage|farm/i.test(propType)) continue;

        const county = String(src.CountyOrParish || '').toLowerCase().trim();
        if (county && !METRO_COUNTIES.has(county)) continue;

        const address = String(src.UnparsedAddress || '').trim();
        const city = String(src.City || 'Atlanta').trim();
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
            name: String(src.ListAgentFullName || '').trim(),
            first: String(src.ListAgentFirstName || '').trim(),
            email: String(src.ListAgentEmail || '').toLowerCase().trim(),
            phone: String(src.ListAgentDirectPhone || src.ListAgentMobilePhone || '').replace(/\D/g, '').slice(-10),
            brokerage: String(src.ListOfficeName || 'Listing Representation').trim()
          }
        ];

        for (const t of targets) {
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
          const textBody = buildSmsCopy(first, address, city, t.role);
          const buyerForwardBody = `Hi ${first}, here is our 1-click due diligence scheduler and $35,000 warranty certificate for your buyers at ${address}: https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(address)} — Includes our two-inspector team, same-day report, and free utility setup concierge. Feel free to pass this directly to your buyers!`;

          const record = {
            id: `card_${idHash}`,
            listing_ref: listingRef,
            role: t.role,
            email: t.email,
            name: t.name,
            first,
            brokerage: t.brokerage,
            city,
            county: src.CountyOrParish || '',
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
      console.warn(`⚠️ [Live FMLS Harvester] Warning at offset ${offset}:`, err.message);
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

  // Sort active records: freshest dates first, Buyer Agent first, highest list price first
  active.sort((a, b) => {
    const dCmp = (b.date || '').localeCompare(a.date || '');
    if (dCmp !== 0) return dCmp;
    if (a.role === 'BUYER_AGENT' && b.role !== 'BUYER_AGENT') return -1;
    if (b.role === 'BUYER_AGENT' && a.role !== 'BUYER_AGENT') return 1;
    return (b.raw_price || 0) - (a.raw_price || 0);
  });

  fs.writeFileSync(UNDER_CONTRACT_FILE, JSON.stringify(active, null, 2), 'utf8');
  console.log(`✅ [Live FMLS Harvester] Discovered ${newPendingDeals} new deals. Active pool maintained at ${active.length} records (rolling 5-day freshness window; ${stale.length} archived).`);
  return { newPendingDeals, totalRecords: active.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  harvestLiveDueDiligence().catch(console.error);
}
