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
 * 1. Queries the official City of Atlanta / Fulton County ArcGIS Open Data FeatureServer
 */
async function fetchAtlantaPermits() {
  console.log('🏛️  [Permit Radar: Atlanta] Querying City of Atlanta & Fulton County open GIS registry...');
  try {
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
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) throw new Error(`ArcGIS returned ${response.status}`);
    const json = await response.json();
    const features = json.features || [];
    console.log(`✅ [Permit Radar: Atlanta] Retrieved ${features.length} municipal permits.`);

    return features.map(f => {
      const a = f.attributes || {};
      const date = a.StatusDate ? new Date(a.StatusDate).toISOString().split('T')[0] : 'Unknown';
      const isNew = (a.TypeCombo || '').toLowerCase().includes('new');

      return {
        recordId: a.RecordID || `ATL-${a.OBJECTID}`,
        jurisdiction: 'City of Atlanta (Fulton County)',
        permitName: a.Name || 'Residential Project',
        permitType: a.TypeCombo || 'Residential New/Addition',
        address: a.Address ? `${a.Address}, Atlanta, GA` : 'Atlanta, GA',
        jobValue: a.JobValue || a.JOB_VALUE || 0,
        status: a.statusP || a.Status_1 || 'Active',
        statusDate: date,
        parcel: a.PARCEL || 'N/A',
        quadrant: a.QUADRANT || 'N/A',
        ownerName: a.Name || 'Property Owner',
        ownerEmail: null,
        ownerPhone: null,
        acaLink: a.ACA_Link || `https://aca-prod.accela.com/ATLANTA_GA/Cap/GlobalSearchResults.aspx?QueryText=${a.RecordID}`,
        streetView: a.StreetView || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.Address || 'Atlanta, GA')}`,
        inspectionOpportunity: isNew 
          ? 'Pre-Drywall Framing Inspection + 11-Month Builder Warranty'
          : 'Major Structural & Renovation Inspection',
        estimatedInspectionFee: isNew ? '$475 - $850' : '$425 - $650',
        harvestedAt: new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn(`⚠️ [Permit Radar: Atlanta] Error:`, err.message);
    return [];
  }
}

/**
 * 2. Queries DeKalb County Building Permit Applications GIS FeatureServer
 */
async function fetchDeKalbPermits() {
  console.log('🏛️  [Permit Radar: DeKalb] Querying DeKalb County GIS permit registry...');
  try {
    const params = new URLSearchParams({
      where: "OccupancyTypeDescription LIKE '%Single Family%' OR applicationType_description LIKE '%Building%'",
      outFields: '*',
      returnGeometry: 'false',
      orderByFields: 'OBJECTID DESC',
      resultRecordCount: '25',
      f: 'json'
    });

    const url = `https://dcgis.dekalbcountyga.gov/mapping/rest/services/Building_Permit_Applications/FeatureServer/0/query?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) throw new Error(`DeKalb ArcGIS returned ${response.status}`);
    const json = await response.json();
    const features = json.features || [];
    console.log(`✅ [Permit Radar: DeKalb] Retrieved ${features.length} municipal permits.`);

    return features.map(f => {
      const a = f.attributes || {};
      const date = a.applicationDateTime 
        ? new Date(a.applicationDateTime).toISOString().split('T')[0] 
        : (a.issuedDateTime ? new Date(a.issuedDateTime).toISOString().split('T')[0] : 'Unknown');
      
      const valuation = parseFloat(a.declaredValuation || a.calculatedValuation || 0) || 0;
      const typeDesc = a.applicationType_description || a.WorkTypeDescription || 'Residential Building Permit';
      const isNew = typeDesc.toLowerCase().includes('new') || (a.comments || '').toLowerCase().includes('new');

      return {
        recordId: `DKB-${a.applicationNumber || a.id || a.OBJECTID}`,
        jurisdiction: 'DeKalb County',
        permitName: a.applicationName || a.primaryContactName || 'DeKalb Residential Project',
        permitType: typeDesc,
        address: a.locationLine1 ? `${a.locationLine1.trim()}, DeKalb County, GA` : 'DeKalb County, GA',
        jobValue: valuation > 0 ? valuation : 185000,
        status: a.status || 'Active',
        statusDate: date,
        parcel: a.commonId || 'N/A',
        quadrant: `District ${a.District || 'DeKalb'}`,
        ownerName: a.primaryContactName || a.applicationName || 'Property Owner',
        ownerEmail: a.primaryContactEMailAddress || null,
        ownerPhone: a.primaryContactPhone || null,
        comments: a.comments ? a.comments.slice(0, 300) : null,
        acaLink: `https://aca-prod.accela.com/DEKALB/Cap/GlobalSearchResults.aspx?QueryText=${a.applicationNumber || a.id}`,
        streetView: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.locationLine1 || 'DeKalb County, GA')}`,
        inspectionOpportunity: isNew
          ? 'Pre-Drywall Framing Inspection + 11-Month Builder Warranty'
          : 'Structural Renovation, Plumbing & Electrical System Audit',
        estimatedInspectionFee: isNew ? '$475 - $850' : '$425 - $650',
        harvestedAt: new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn(`⚠️ [Permit Radar: DeKalb] Error:`, err.message);
    return [];
  }
}

/**
 * 3. Queries City of Alpharetta (North Fulton) Open Data FeatureServer
 */
async function fetchAlpharettaPermits() {
  console.log('🏛️  [Permit Radar: Alpharetta] Querying City of Alpharetta Open Data GIS registry...');
  try {
    const params = new URLSearchParams({
      where: "CASE_TYPE_DESC LIKE '%Residential%'",
      outFields: '*',
      returnGeometry: 'false',
      orderByFields: 'created_date DESC',
      resultRecordCount: '25',
      f: 'json'
    });

    const url = `https://alphagis.alpharetta.ga.us/arcgis/rest/services/OpenData/OpenData_PCE_Full/FeatureServer/3/query?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) throw new Error(`Alpharetta ArcGIS returned ${response.status}`);
    const json = await response.json();
    const features = json.features || [];
    console.log(`✅ [Permit Radar: Alpharetta] Retrieved ${features.length} municipal permits.`);

    return features.map(f => {
      const a = f.attributes || {};
      const date = a.DATE_ENTERED 
        ? new Date(a.DATE_ENTERED).toISOString().split('T')[0] 
        : (a.created_date ? new Date(a.created_date).toISOString().split('T')[0] : 'Unknown');
      
      const typeDesc = a.CASE_TYPE_DESC || 'Residential Permit';
      const isNew = typeDesc.toLowerCase().includes('new') || typeDesc.toLowerCase().includes('whole');

      return {
        recordId: `ALP-${a.CASE_NUMBER || a.CWID || a.CA_OBJECT_ID}`,
        jurisdiction: 'City of Alpharetta (North Fulton)',
        permitName: a.CASE_NAME || 'Alpharetta Residential Project',
        permitType: typeDesc,
        address: a.Location || 'Alpharetta, GA 30009',
        jobValue: 275000, // Benchmark luxury Alpharetta residential valuation
        status: a.RESULT_DISPLAY || a.STATUS_CODE || 'Issued',
        statusDate: date,
        parcel: a.Facility_Id || 'N/A',
        quadrant: 'North Fulton',
        ownerName: a.CASE_NAME || 'Alpharetta Property Owner',
        ownerEmail: null,
        ownerPhone: null,
        acaLink: `https://open-alpharetta.opendata.arcgis.com/datasets/948431fae5cf463e82139da09b6e432c_3/data`,
        streetView: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.Location || 'Alpharetta, GA')}`,
        inspectionOpportunity: isNew
          ? 'Luxury Pre-Drywall Framing Audit + 11-Month Warranty'
          : 'High-End Remodel, Addition & Foundation Audit',
        estimatedInspectionFee: '$525 - $950',
        harvestedAt: new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn(`⚠️ [Permit Radar: Alpharetta] Error:`, err.message);
    return [];
  }
}

/**
 * 4. Queries City of Johns Creek (North Fulton) Open Data FeatureServer
 */
async function fetchJohnsCreekPermits() {
  console.log('🏛️  [Permit Radar: Johns Creek] Querying City of Johns Creek Open Data GIS registry...');
  try {
    const params = new URLSearchParams({
      where: "JobTypeDescription LIKE '%Residential%'",
      outFields: '*',
      returnGeometry: 'false',
      orderByFields: 'ISSUE_DATE DESC',
      resultRecordCount: '25',
      f: 'json'
    });

    const url = `https://services1.arcgis.com/bqfNVPUK3HOnCFmA/arcgis/rest/services/Building_Permits_Issued/FeatureServer/0/query?${params.toString()}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) throw new Error(`Johns Creek ArcGIS returned ${response.status}`);
    const json = await response.json();
    const features = json.features || [];
    console.log(`✅ [Permit Radar: Johns Creek] Retrieved ${features.length} municipal permits.`);

    return features.map(f => {
      const a = f.attributes || {};
      const date = a.ISSUE_DATE ? new Date(a.ISSUE_DATE).toISOString().split('T')[0] : 'Unknown';
      const sqft = a.JobSquareFootage || 0;
      const isNew = sqft > 1500;

      return {
        recordId: `JCK-${a.JobID || a.OBJECTID}`,
        jurisdiction: 'City of Johns Creek (North Fulton)',
        permitName: `Residential Project (${sqft ? sqft + ' sq ft' : 'Custom'})`,
        permitType: `Residential Construction (${a.JobTypeDescription || 'Single Family'})`,
        address: a.JobAddress ? `${a.JobAddress}, Johns Creek, GA` : 'Johns Creek, GA',
        jobValue: sqft > 0 ? sqft * 185 : 350000,
        status: 'Issued',
        statusDate: date,
        parcel: a.AddrLocationID || 'N/A',
        quadrant: 'North Fulton',
        ownerName: 'Johns Creek Property Owner',
        ownerEmail: null,
        ownerPhone: null,
        acaLink: `https://services1.arcgis.com/bqfNVPUK3HOnCFmA/arcgis/rest/services/Building_Permits_Issued/FeatureServer/0`,
        streetView: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.JobAddress ? a.JobAddress + ', Johns Creek, GA' : 'Johns Creek, GA')}`,
        inspectionOpportunity: isNew
          ? 'Luxury Pre-Drywall Framing Audit + 11-Month Warranty'
          : 'Structural Addition, Mechanical & Framing Inspection',
        estimatedInspectionFee: '$550 - $950',
        harvestedAt: new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn(`⚠️ [Permit Radar: Johns Creek] Error:`, err.message);
    return [];
  }
}

/**
 * Dispatches smartphone push notification via ntfy.sh
 */
async function dispatchPushAlert(newLeads, statsByJurisdiction) {
  if (!newLeads || newLeads.length === 0) return;

  const topLead = newLeads[0];
  const totalValue = newLeads.reduce((sum, l) => sum + (l.jobValue || 0), 0);

  const title = cleanHeader(`🏛️ Radar: ${newLeads.length} Metro Atlanta Permit Leads`);
  
  const jurisdictionBreakdown = Object.entries(statsByJurisdiction)
    .map(([j, count]) => `• ${j}: ${count} leads`)
    .join('\n');

  const bodyText = [
    `Metro Atlanta Municipal Expansion Harvest:`,
    jurisdictionBreakdown,
    ``,
    `Top Project:`,
    `• ${topLead.address} (${topLead.jurisdiction})`,
    `• Type: ${topLead.permitType}`,
    `• Est. Valuation: $${(topLead.jobValue || 0).toLocaleString()}`,
    `• Opportunity: ${topLead.inspectionOpportunity}`,
    `• Total Scanned Pipeline: $${totalValue.toLocaleString()}`,
    ``,
    `Tap below to view Due Diligence Dossiers or map leads.`
  ].join('\n');

  try {
    const safeMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(topLead.address || '')}`;
    const dossierUrl = `https://www.fhinspectionsatl.com/dossiers/${topLead.recordId}.html`;

    const resp = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': 'default',
        'Tags': 'construction,house,hammer,satellite',
        'Actions': `view, Open Dossier, ${dossierUrl}, clear=true; view, Google Maps, ${safeMapUrl}, clear=true`
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
 * Main multi-collector execution loop
 */
async function main() {
  console.log('🚀 [Permit Radar] Initializing Metro Atlanta Multi-County Harvest Engine...');
  const startTime = Date.now();

  try {
    // Execute all municipal collectors in parallel
    const [atlRes, dkbRes, alpRes, jckRes] = await Promise.allSettled([
      fetchAtlantaPermits(),
      fetchDeKalbPermits(),
      fetchAlpharettaPermits(),
      fetchJohnsCreekPermits()
    ]);

    const atlLeads = atlRes.status === 'fulfilled' ? atlRes.value : [];
    const dkbLeads = dkbRes.status === 'fulfilled' ? dkbRes.value : [];
    const alpLeads = alpRes.status === 'fulfilled' ? alpRes.value : [];
    const jckLeads = jckRes.status === 'fulfilled' ? jckRes.value : [];

    const allHarvested = [...atlLeads, ...dkbLeads, ...alpLeads, ...jckLeads];
    console.log(`\n📊 [Permit Radar] Multi-Jurisdiction Raw Harvest Complete: ${allHarvested.length} total permits across 4 jurisdictions.`);

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
    const newlyDiscovered = allHarvested.filter(l => !existingIds.has(l.recordId));

    console.log(`✨ [Permit Radar] ${newlyDiscovered.length} NEWLY DISCOVERED high-intent permits across Metro Atlanta.`);

    // Track breakdown by jurisdiction
    const statsByJurisdiction = {};
    newlyDiscovered.forEach(l => {
      statsByJurisdiction[l.jurisdiction] = (statsByJurisdiction[l.jurisdiction] || 0) + 1;
    });

    // Merge and save (cap at top 250 most recent records)
    const combined = [...newlyDiscovered, ...existingLeads].slice(0, 250);
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
      await dispatchPushAlert(newlyDiscovered, statsByJurisdiction);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🏁 [Permit Radar] Multi-County Radar cycle completed in ${duration}s.`);

    // Print summary to terminal
    console.log('\n--- TOP HARVESTED METRO ATLANTA LEADS ---');
    combined.slice(0, 8).forEach((l, idx) => {
      console.log(`${idx + 1}. [${l.recordId}] ${l.jurisdiction}`);
      console.log(`   ${l.permitType} | ${l.address}`);
      console.log(`   Valuation: $${Number(l.jobValue || 0).toLocaleString()} | Target: ${l.inspectionOpportunity}`);
      if (l.ownerEmail) console.log(`   Direct Contact: ${l.ownerName} <${l.ownerEmail}> | ${l.ownerPhone || 'No Phone'}`);
      console.log(`   Link: ${l.acaLink}`);
    });
    console.log('-----------------------------------------\n');

  } catch (err) {
    console.error('❌ [Permit Radar] Fatal Error:', err.message);
    process.exit(1);
  }
}

main();
