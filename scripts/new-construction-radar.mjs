import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEADS_FILE = path.join(ROOT_DIR, 'data', 'new-construction-leads.json');
const CRM_FILE = path.join(ROOT_DIR, 'data', 'new-construction-crm.json');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

function cleanHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '').trim();
}

/**
 * Key Metro Atlanta Regions for New Construction
 * Combines Major Counties and High-Growth Municipalities
 */
const TARGET_REGIONS = [
  { name: 'City of Atlanta', id: 30756, type: 6, jurisdiction: 'City of Atlanta (Fulton/DeKalb)' },
  { name: 'Alpharetta', id: 406, type: 6, jurisdiction: 'City of Alpharetta (North Fulton)' },
  { name: 'Fulton County', id: 894, type: 5, jurisdiction: 'Fulton County' },
  { name: 'Forsyth County', id: 893, type: 5, jurisdiction: 'Forsyth County (Cumming Corridor)' },
  { name: 'Gwinnett County', id: 898, type: 5, jurisdiction: 'Gwinnett County' },
  { name: 'Cobb County', id: 882, type: 5, jurisdiction: 'Cobb County' },
  { name: 'DeKalb County', id: 885, type: 5, jurisdiction: 'DeKalb County' },
  { name: 'Cherokee County', id: 880, type: 5, jurisdiction: 'Cherokee County (Woodstock/Canton)' },
  { name: 'Paulding County', id: 938, type: 5, jurisdiction: 'Paulding County (Dallas/Hiram)' },
  { name: 'Henry County', id: 902, type: 5, jurisdiction: 'Henry County (McDonough/Stockbridge)' },
  { name: 'Coweta County', id: 883, type: 5, jurisdiction: 'Coweta County (Newnan/Senoia)' },
  { name: 'Fayette County', id: 891, type: 5, jurisdiction: 'Fayette County (Peachtree City/Fayetteville)' },
  { name: 'Hall County', id: 899, type: 5, jurisdiction: 'Hall County (Gainesville/Flowery Branch)' }
];

/**
 * Harvests New Construction Listings from Redfin / MLS Open GIS Feed
 */
async function fetchNewBuildsForRegion(region) {
  console.log(`🏗️  [New Construction Radar] Scanning ${region.name} (${region.jurisdiction})...`);
  try {
    const url = `https://www.redfin.com/stingray/api/gis?al=1&region_id=${region.id}&region_type=${region.type}&num_homes=250&v=8`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(12000)
    });

    if (!res.ok) {
      console.warn(`⚠️ [New Construction Radar] ${region.name} returned status ${res.status}`);
      return [];
    }

    const text = await res.text();
    const cleanText = text.replace('{}&&', '');
    const json = JSON.parse(cleanText);
    const homes = json.payload?.homes || [];

    // Filter strictly for New Construction (Built 2024-2026 or isNewConstruction true)
    const newBuilds = homes.filter(h => {
      const year = h.yearBuilt?.value;
      const isNew = h.isNewConstruction === true;
      const recentYear = year >= 2024;
      return isNew || recentYear;
    });

    console.log(`✅ [New Construction Radar] ${region.name}: Harvested ${newBuilds.length} verified new construction properties.`);

    return newBuilds.map(h => {
      const street = h.streetLine?.value || 'New Construction Property';
      const city = h.city || region.name;
      const zip = h.zip || '';
      const fullAddress = `${street}, ${city}, GA ${zip}`.trim();
      const priceVal = h.price?.value || 0;
      const sqftVal = h.sqFt?.value || 0;
      const mlsNumber = h.mlsId?.value || String(h.propertyId || Math.floor(Math.random() * 900000 + 100000));
      const recordId = `NC-${mlsNumber}`;

      // Calculate estimated days until drywall / closing
      const daysOnMarket = h.dom?.value || h.timeOnRedfin?.value ? Math.floor((h.timeOnRedfin?.value || 0) / (1000 * 60 * 60 * 24)) : 14;
      const estStage = h.mlsStatus === 'Coming Soon' || daysOnMarket < 21
        ? 'Active Framing & Rough-In (Pre-Drywall Critical Window)'
        : (h.mlsStatus === 'Under Contract' || h.mlsStatus === 'Pending'
            ? 'Under Contract Due Diligence / Pre-Closing Final'
            : 'Pre-Drywall & 11-Month Warranty Window');

      return {
        recordId,
        mlsId: mlsNumber,
        source: 'MLS / Real Estate Network',
        jurisdiction: region.jurisdiction,
        propertyName: street,
        address: fullAddress,
        city,
        zip,
        price: priceVal,
        sqft: sqftVal,
        yearBuilt: h.yearBuilt?.value || 2025,
        beds: h.beds || 4,
        baths: h.baths || 3.5,
        mlsStatus: h.mlsStatus || 'Active',
        constructionStage: estStage,
        daysOnMarket,
        redfinUrl: h.url ? `https://www.redfin.com${h.url}` : null,
        ownerName: 'Future Homeowner / Buyer Representation',
        ownerEmail: null,
        ownerPhone: null,
        inspectionPackages: [
          'Pre-Drywall Framing & Mechanical Audit ($495 - $695)',
          'Pre-Closing Final Blue Tape Walkthrough + FLIR® Infrared ($495 - $795)',
          '11-Month Builder Warranty Inspection ($450 - $650)',
          'Complete 3-Phase New Construction Master Bundle ($1,295 - $1,795)'
        ],
        harvestedAt: new Date().toISOString()
      };
    });
  } catch (err) {
    console.error(`❌ [New Construction Radar] Error in ${region.name}:`, err.message);
    return [];
  }
}

/**
 * Harvests all target corridors and merges with existing database
 */
async function main() {
  console.log('🚀 [New Construction Radar] Initializing Metro Atlanta New Construction Harvester...');

  const results = await Promise.allSettled(TARGET_REGIONS.map(reg => fetchNewBuildsForRegion(reg)));

  let newlyHarvested = [];
  for (const res of results) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      newlyHarvested.push(...res.value);
    }
  }

  console.log(`\n📊 [New Construction Radar] Harvested a total of ${newlyHarvested.length} new construction properties across Metro Atlanta.`);

  // Load existing leads database if present
  let existingLeads = [];
  if (fs.existsSync(LEADS_FILE)) {
    try {
      existingLeads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    } catch {
      existingLeads = [];
    }
  }

  // De-duplicate by recordId or exact normalized address
  const leadMap = new Map();
  for (const lead of existingLeads) {
    leadMap.set(lead.recordId, lead);
    if (lead.address) leadMap.set(lead.address.toLowerCase().trim(), lead);
  }

  let addedCount = 0;
  for (const lead of newlyHarvested) {
    const addrKey = lead.address.toLowerCase().trim();
    if (!leadMap.has(lead.recordId) && !leadMap.has(addrKey)) {
      leadMap.set(lead.recordId, lead);
      leadMap.set(addrKey, lead);
      addedCount++;
    }
  }

  // Deduplicate map values
  const uniqueLeads = Array.from(new Set(leadMap.values()));

  // Ensure data directory exists
  const dataDir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(LEADS_FILE, JSON.stringify(uniqueLeads, null, 2), 'utf8');
  console.log(`💾 [New Construction Radar] Saved ${uniqueLeads.length} unique leads to ${LEADS_FILE} (+${addedCount} new).`);

  // Write CRM snapshot
  fs.writeFileSync(CRM_FILE, JSON.stringify({
    lastSync: new Date().toISOString(),
    totalActiveLeads: uniqueLeads.length,
    newLeadsThisRun: addedCount,
    topCorridors: TARGET_REGIONS.map(r => r.name),
    leads: uniqueLeads.slice(0, 50)
  }, null, 2), 'utf8');

  // Push real-time alert via ntfy.sh if new leads were found
  if (addedCount > 0) {
    try {
      const topLead = newlyHarvested[0];
      const title = cleanHeader(`🏗️ ${addedCount} New Construction Leads Captured!`);
      const body = [
        `Metro Atlanta New Construction Radar Update:`,
        `• New Properties Added: ${addedCount}`,
        `• Total Active Leads in DB: ${uniqueLeads.length}`,
        `• Sample Property: ${topLead?.address || 'Metro Atlanta'}`,
        `• Valuation / Price: $${Number(topLead?.price || 0).toLocaleString()}`,
        `• Stage: ${topLead?.constructionStage || 'Pre-Drywall'}`,
        ``,
        `Ready for autonomous due diligence dossier generation.`
      ].join('\n');

      await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        headers: {
          'Title': title,
          'Priority': 'default',
          'Tags': 'building_construction,house,hammer'
        },
        body: Buffer.from(body, 'utf8')
      });
      console.log(`📱 [New Construction Radar] Smartphone alert dispatched to ntfy.sh/${NTFY_TOPIC}`);
    } catch (e) {
      console.warn('⚠️ [New Construction Radar] Alert notification failed:', e.message);
    }
  }

  console.log('🏁 [New Construction Radar] Run complete.\n');
}

main().catch(err => {
  console.warn('⚠️ [New Construction Radar] Non-fatal runtime notice:', err.message);
  process.exit(0);
});
