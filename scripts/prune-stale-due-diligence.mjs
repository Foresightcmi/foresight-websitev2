import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const UNDER_CONTRACT_FILE = path.join(ROOT_DIR, 'data', 'under-contract-realtors.json');
const ARCHIVE_FILE = path.join(ROOT_DIR, 'data', 'archive-under-contract-realtors.json');

export function pruneStaleDueDiligence(maxAgeDays = 2) {
  if (!fs.existsSync(UNDER_CONTRACT_FILE)) {
    console.error('❌ File not found:', UNDER_CONTRACT_FILE);
    return { activeCount: 0, archivedCount: 0 };
  }

  const all = JSON.parse(fs.readFileSync(UNDER_CONTRACT_FILE, 'utf8'));
  console.log(`📊 Total records before pruning: ${all.length}`);

  // Calculate cutoff timestamp for rolling freshness window (strictly max 48 hours / 2 days)
  const now = Date.now();
  const cutoffTime = now - (maxAgeDays * 24 * 60 * 60 * 1000);
  const cutoffDateStr = new Date(cutoffTime).toISOString().slice(0, 10);
  console.log(`🗓️ Freshness Cutoff Date: ${cutoffDateStr} (retention: last ${maxAgeDays} days / 48 hours)`);

  const active = [];
  const stale = [];

  for (const item of all) {
    if ((item.raw_price || 0) < 75000 || /^0\s+/i.test(item.address || '') || /non-mls/i.test(item.name || '') || item.clean_phone === '0000000000') {
      continue;
    }
    const ref = item.listing_ref || item.listing_key || item.id || `${item.email || ''}::${item.clean_phone || ''}::${item.address || ''}`;
    delete item.listing_key;
    item.listing_ref = ref;
    const itemDate = (item.date || '').slice(0, 10);
    const itemTimestamp = new Date(item.date || 0).getTime();
    const isClosedOrStale = item.closed || item.close_date || (itemTimestamp < cutoffTime);
    if (!isClosedOrStale && itemDate >= cutoffDateStr) {
      active.push(item);
    } else {
      stale.push(item);
    }
  }

  console.log(`✨ Active Live Due Diligence records: ${active.length}`);
  console.log(`📦 Stale historical records to archive: ${stale.length}`);

  // Read existing archive if any
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
    if ((item.raw_price || 0) < 75000 || /^0\s+/i.test(item.address || '') || /non-mls/i.test(item.name || '') || item.clean_phone === '0000000000') {
      continue;
    }
    const key = item.listing_ref || item.listing_key || item.id || `${item.email || ''}::${item.clean_phone || ''}::${item.address || ''}`;
    delete item.listing_key;
    item.listing_ref = key;
    archiveMap.set(key, item);
  }
  for (const item of stale) {
    const key = item.listing_ref || item.listing_key || item.id || `${item.email || ''}::${item.clean_phone || ''}::${item.address || ''}`;
    delete item.listing_key;
    item.listing_ref = key;
    archiveMap.set(key, item);
  }

  const mergedArchive = Array.from(archiveMap.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  // Sort active records by date desc, Buyer Agent first, price desc
  active.sort((a, b) => {
    const dCmp = (b.date || '').localeCompare(a.date || '');
    if (dCmp !== 0) return dCmp;
    if (a.role === 'BUYER_AGENT' && b.role !== 'BUYER_AGENT') return -1;
    if (b.role === 'BUYER_AGENT' && a.role !== 'BUYER_AGENT') return 1;
    return (b.raw_price || 0) - (a.raw_price || 0);
  });

  // Write files
  fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(mergedArchive, null, 2), 'utf8');
  fs.writeFileSync(UNDER_CONTRACT_FILE, JSON.stringify(active, null, 2), 'utf8');

  console.log(`✅ Successfully archived ${stale.length} stale deals to ${path.relative(ROOT_DIR, ARCHIVE_FILE)} (${mergedArchive.length} total in archive).`);
  console.log(`✅ Active pool streamlined to ${active.length} deals in ${path.relative(ROOT_DIR, UNDER_CONTRACT_FILE)}.`);

  return {
    activeCount: active.length,
    archivedCount: stale.length,
    totalArchive: mergedArchive.length
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  pruneStaleDueDiligence();
}
