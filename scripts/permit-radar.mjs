import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'permit-leads.json');
const NTFY_TOPIC = 'fores-antigravity-alerts-77';

/**
 * Sanitizes headers to pure ASCII (0-127) to avoid Node ByteString errors.
 */
function cleanHeader(str) {
  if (!str) return '';
  return String(str).replace(/[^\x00-\x7F]/g, '').trim();
}

/**
 * Queries the official City of Atlanta / Fulton County ArcGIS Open Data FeatureServer
 */
async function fetchAtlantaPermits() {
  console.log('🏛️  [Permit Radar] Querying official Metro Atlanta municipal permit registry...');
  
  // Where clause for high-intent residential projects
  const whereClause = "TypeCombo LIKE '%Residential New%' OR TypeCombo LIKE '%Residential Addition%'";
  const params = new URLSearchParams({
    where: whereClause,
    outFields: '*',
    returnGeometry: 'false',
    orderByFields: 'StatusDate DESC',
    resultRecordCount: '25',
    f: 'json'
  });

  const url = `https://services5.arcgis.com/5RxyIIJ9boPdptdo/arcgis/rest/services/Building_Permit_latest/FeatureServer/0/query?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });

  if (!response.ok) {
    throw new Error(`ArcGIS FeatureServer returned status ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  const features = json.features || [];
  console.log(`✅ [Permit Radar] Retrieved ${features.length} high-intent municipal permits.`);

  const leads = features.map(f => {
    const a = f.attributes || {};
    const date = a.StatusDate ? new Date(a.StatusDate).toISOString().split('T')[0] : 'Unknown';
    const isNew = (a.TypeCombo || '').toLowerCase().includes('new');

    return {
      recordId: a.RecordID || 'Unknown',
      permitName: a.Name || 'Residential Project',
      permitType: a.TypeCombo || 'Residential',
      address: a.Address || 'Metro Atlanta, GA',
      jobValue: a.JobValue || a.JOB_VALUE || 0,
      status: a.statusP || a.Status_1 || 'Active',
      statusDate: date,
      parcel: a.PARCEL || 'N/A',
      quadrant: a.QUADRANT || 'N/A',
      acaLink: a.ACA_Link || `https://aca-prod.accela.com/ATLANTA_GA/Cap/GlobalSearchResults.aspx?QueryText=${a.RecordID}`,
      streetView: a.StreetView || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.Address || '')}`,
      inspectionOpportunity: isNew 
        ? 'Pre-Drywall Framing Inspection + 11-Month Builder Warranty'
        : 'Major Structural & Renovation Inspection',
      estimatedInspectionFee: isNew ? '$475 - $850' : '$425 - $650',
      harvestedAt: new Date().toISOString()
    };
  });

  return leads;
}

/**
 * Dispatches smartphone push notification via ntfy.sh
 */
async function dispatchPushAlert(newLeads) {
  if (!newLeads || newLeads.length === 0) return;

  const topLead = newLeads[0];
  const totalValue = newLeads.reduce((sum, l) => sum + (l.jobValue || 0), 0);

  const title = cleanHeader(`🏛️ Radar: ${newLeads.length} High-Intent Permit Leads`);
  const bodyText = [
    `New Construction & Addition Leads Harvested:`,
    `• Top Lead: ${topLead.address}`,
    `• Type: ${topLead.permitType}`,
    `• Project Valuation: $${(topLead.jobValue || 0).toLocaleString()}`,
    `• Opportunity: ${topLead.inspectionOpportunity}`,
    `• Total Pipeline Value: $${totalValue.toLocaleString()}`,
    ``,
    `Tap below to inspect permit records in Accela or review in your dashboard.`
  ].join('\n');

    const safeMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(topLead.address || '')}`;
    const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/${topLead.recordId}.html`;

    const resp = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': 'default',
        'Tags': 'construction,house,hammer',
        'Actions': `view, 📄 Open Dossier, ${dossierUrl}, clear=true; view, 📍 Google Maps, ${safeMapUrl}, clear=true`
      },
      body: Buffer.from(bodyText, 'utf8')
    });

    if (resp.ok) {
      console.log(`📱 [Permit Radar] Smartphone push notification dispatched to ntfy.sh/${NTFY_TOPIC}`);
    } else {
      console.warn(`⚠️ [Permit Radar] Push alert responded with status ${resp.status}`);
    }
  } catch (err) {
    console.error('❌ [Permit Radar] Push alert error:', err.message);
  }
}

/**
 * Main execution loop
 */
async function main() {
  try {
    const leads = await fetchAtlantaPermits();
    
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read existing leads to prevent duplicates
    let existingLeads = [];
    if (fs.existsSync(DATA_FILE)) {
      try {
        existingLeads = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      } catch (e) {
        existingLeads = [];
      }
    }

    const existingIds = new Set(existingLeads.map(l => l.recordId));
    const newlyDiscovered = leads.filter(l => !existingIds.has(l.recordId));

    console.log(`📊 [Permit Radar] ${newlyDiscovered.length} newly discovered permits (out of ${leads.length} scanned).`);

    // Merge and save
    const combined = [...newlyDiscovered, ...existingLeads].slice(0, 100);
    fs.writeFileSync(DATA_FILE, JSON.stringify(combined, null, 2), 'utf8');
    console.log(`💾 [Permit Radar] Saved ${combined.length} total qualified permit leads to ${DATA_FILE}`);

    // If new leads discovered, generate executive dossiers and dispatch smartphone push alert
    if (newlyDiscovered.length > 0) {
      console.log('📄 [Permit Radar] Generating luxury property due diligence dossiers...');
      try {
        const { execSync } = await import('node:child_process');
        execSync('node scripts/generate-permit-dossiers.mjs', { stdio: 'inherit', cwd: ROOT_DIR });
      } catch (genErr) {
        console.warn('⚠️ [Permit Radar] Dossier generation error:', genErr.message);
      }
      await dispatchPushAlert(newlyDiscovered);
    }

    // Print summary to terminal
    console.log('\n--- TOP HARVESTED LEADS ---');
    combined.slice(0, 5).forEach((l, idx) => {
      console.log(`${idx + 1}. [${l.recordId}] ${l.permitType} | ${l.address}`);
      console.log(`   Valuation: $${l.jobValue.toLocaleString()} | Target: ${l.inspectionOpportunity}`);
      console.log(`   Accela Link: ${l.acaLink}`);
    });
    console.log('---------------------------\n');

  } catch (err) {
    console.error('❌ [Permit Radar] Fatal Error:', err.message);
    process.exit(1);
  }
}

main();
