'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';

const COUNTIES_DATA = {
  fulton: { name: 'Fulton County (Atlanta, Alpharetta, Sandy Springs, Roswell, Johns Creek)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'Granite bedrock + expansive red clay' },
  dekalb: { name: 'DeKalb County (Decatur, Brookhaven, Dunwoody, Stonecrest, Chamblee)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'Piedmont granite shelf + aging sewer lateral grid' },
  gwinnett: { name: 'Gwinnett County (Lawrenceville, Duluth, Suwanee, Buford, Norcross)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'Granite bedrock + 1980s-90s suburban boom era' },
  cobb: { name: 'Cobb County (Marietta, Smyrna, Kennesaw, Acworth, Mableton)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'High-plasticity red clay + granite outcrops' },
  cherokee: { name: 'Cherokee County (Woodstock, Canton, Holly Springs)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'North Georgia Piedmont bedrock' },
  forsyth: { name: 'Forsyth County (Cumming)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'High granite concentration + rapid new construction' },
  henry: { name: 'Henry County (McDonough, Stockbridge, Hampton)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Red clay soil with severe seasonal shrink-swell' },
  clayton: { name: 'Clayton County (Jonesboro, Forest Park, Morrow)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Dense clay subsoil + mature tree root sewer hazards' },
  douglas: { name: 'Douglas County (Douglasville, Lithia Springs)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Piedmont clay with drainage slope challenges' },
  fayette: { name: 'Fayette County (Peachtree City, Fayetteville)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Sandy loam over red clay + mature septic/sewer' },
  coweta: { name: 'Coweta County (Newnan, Senoia, Sharpsburg)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Granite and clay transitional zone' },
  paulding: { name: 'Paulding County (Dallas, Hiram)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Steep lot grades and red clay foundation movement' },
  rockdale: { name: 'Rockdale County (Conyers)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'Heavy granite bedrock formation' },
  hall: { name: 'Hall County (Gainesville, Flowery Branch)', radonZone: 1, radonRisk: 'Zone 1 (High > 4.0 pCi/L)', soil: 'Lake Lanier basin granite geology' },
  bartow: { name: 'Bartow County (Cartersville, Emerson)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Limestone valley and clay interface' },
  carroll: { name: 'Carroll County (Carrollton, Villa Rica)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Piedmont red clay' },
  newton: { name: 'Newton County (Covington)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Granite and clay mix' },
  walton: { name: 'Walton County (Monroe, Loganville)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'High clay content' },
  barrow: { name: 'Barrow County (Winder, Auburn)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Red clay soil' },
  spalding: { name: 'Spalding County (Griffin)', radonZone: 2, radonRisk: 'Zone 2 (Moderate 2.0 - 4.0 pCi/L)', soil: 'Clay loam' },
};

const ERA_PRESETS = [
  { label: '🏛️ Pre-1950 Historic', year: 1935, foundation: 'crawlspace', siding: 'wood' },
  { label: '🌿 1950-1964 Mid-Century', year: 1958, foundation: 'crawlspace', siding: 'brick' },
  { label: '⚡ 1965-1973 Aluminum Wire', year: 1970, foundation: 'crawlspace', siding: 'brick' },
  { label: '⚠️ 1978-1995 Polybutylene & FPE', year: 1988, foundation: 'slab', siding: 'vinyl' },
  { label: '🏰 1985-2000 Synthetic Stucco', year: 1994, foundation: 'basement-finished', siding: 'eifs' },
  { label: '🏡 2001-2019 Modern Suburban', year: 2012, foundation: 'slab', siding: 'hardie' },
  { label: '🏗️ 2020-2026 New Construction', year: 2025, foundation: 'slab', siding: 'hardie' },
];

export default function RiskScannerClient() {
  const [yearBuilt, setYearBuilt] = useState(1988);
  const [county, setCounty] = useState('fulton');
  const [foundation, setFoundation] = useState('crawlspace');
  const [siding, setSiding] = useState('eifs');
  const [sqft, setSqft] = useState(2500);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize from URL params if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('year')) setYearBuilt(Number(p.get('year')) || 1988);
      if (p.get('county') && COUNTIES_DATA[p.get('county')]) setCounty(p.get('county'));
      if (p.get('foundation')) setFoundation(p.get('foundation'));
      if (p.get('siding')) setSiding(p.get('siding'));
      if (p.get('sqft')) setSqft(Number(p.get('sqft')) || 2500);
    }
  }, []);

  const countyInfo = COUNTIES_DATA[county] || COUNTIES_DATA.fulton;

  // Diagnostic Calculation Engine
  const diagnostic = useMemo(() => {
    const year = Number(yearBuilt) || 1988;
    const items = [];
    let score = 15; // baseline structural diligence
    let minExposure = 0;
    let maxExposure = 0;

    // 1. Plumbing Era Hazard
    if (year >= 1978 && year <= 1995) {
      score += 24;
      minExposure += 4500;
      maxExposure += 12000;
      items.push({
        id: 'polybutylene',
        severity: 'critical',
        badge: '🚨 CRITICAL LIFE-SAFETY / FLOODING',
        title: 'Polybutylene (Quest PB2110) Plumbing Hazard (1978 - 1995)',
        standard: 'ASTM D3309 / $950M Cox v. Shell Oil Class Action',
        description: 'Homes built in this boom era heavily utilized flexible blue/gray polybutylene supply piping. Municipal chlorine disinfectant micro-fractures acetal plastic fittings from the inside out, causing catastrophic sudden wall/ceiling blowouts.',
        exposure: '$4,500 – $12,000+ (Full PEX-a Repipe)',
        foresightProtocol: 'Dual inspectors perform full-system acoustic & thermal pressure checks on risers, manifold feeds, and water heater tie-ins.'
      });
    } else if (year < 1970) {
      score += 18;
      minExposure += 3500;
      maxExposure += 9000;
      items.push({
        id: 'galvanized-lead',
        severity: 'high',
        badge: '⚠️ HIGH CONTAMINATION & RESTRICTION',
        title: 'Galvanized Steel & Lead Solder Water Supply (Pre-1970)',
        standard: 'EPA Safe Drinking Water Act / InterNACHI SOP Plumbing §3.1',
        description: 'Interior zinc coatings corrode internally into heavy rust buildup, cutting water volume to a trickle. Solder connections on pre-1986 copper lines may introduce heavy metal lead particulates.',
        exposure: '$3,500 – $9,000+ (Supply Line Replacement)',
        foresightProtocol: 'Concurrent fixture dynamic pressure drops measured across both levels with lead test visual screenings.'
      });
    }

    // 2. Electrical Era Hazard
    if (year >= 1965 && year <= 1973) {
      score += 28;
      minExposure += 2500;
      maxExposure += 6500;
      items.push({
        id: 'aluminum-wiring',
        severity: 'critical',
        badge: '🔥 CRITICAL RESIDENTIAL FIRE HAZARD',
        title: 'Single-Strand Aluminum Branch Circuit Wiring (1965 - 1973)',
        standard: 'U.S. CPSC Publication #516 (55x Fire Hazard Rating) / NEC Art. 310',
        description: 'Single-strand aluminum wiring expands at a higher thermal rate than copper, loosening connections at switches and outlets. Terminal oxidation causes resistive micro-arcing that can ignite structural wall framing.',
        exposure: '$2,500 – $6,500 (COPALUM / AlumiConn Pig-tailing or Rewiring)',
        foresightProtocol: 'Every electrical breaker and junction box is scanned with infrared thermal radiometric thermal infrared to detect ΔT ≥ 15°F thermal anomalies.'
      });
    } else if (year < 1990) {
      score += 20;
      minExposure += 1800;
      maxExposure += 3800;
      items.push({
        id: 'fpe-zinsco',
        severity: 'high',
        badge: '⚡ LIFE-SAFETY OVERCURRENT FAILURE',
        title: 'Federal Pacific Electric (FPE) Stab-Lok & Zinsco Breaker Panels',
        standard: 'NJIT / IEEE Study (25% - 60% Failure-to-Trip Rate)',
        description: 'Standard circuit breakers trip to shut off power during an electrical overload. Independent lab tests prove FPE Stab-Lok and Zinsco breakers fail to trip up to 60% of the time, allowing wiring inside walls to melt and burn.',
        exposure: '$1,800 – $3,800 (Full 200A Service Panel Replacement)',
        foresightProtocol: 'Certified Master Inspector panel deadfront removal, bus bar arcing inspection, and infrared thermal sweep.'
      });
    }

    // 3. Exterior & Siding Trap
    if (siding === 'eifs') {
      score += 26;
      minExposure += 15000;
      maxExposure += 55000;
      items.push({
        id: 'eifs-stucco',
        severity: 'critical',
        badge: '🌊 CONCEALED WALL CAVITY ROT RISK',
        title: 'Synthetic Stucco (EIFS) Moisture Entrapment (1985 - 2000 Era)',
        standard: 'ASTM E2110 / Moisture Intrusion Diagnostic SOP',
        description: 'Barrier EIFS systems lack an integrated secondary drainage plane. Unsealed kickout flashing, window headers, and deck ledgers allow rainwater behind the synthetic foam, quietly rotting OSB sheathing and studs with zero surface signs.',
        exposure: '$15,000 – $55,000+ (Cladding Replacement & Structural Reframing)',
        foresightProtocol: 'infrared thermal scans pinpoint evaporative cooling ΔT ≥ 8.5°F anomalies, followed by non-destructive dielectric pin moisture verification.'
      });
    } else if (siding === 'wood' && year < 2000) {
      score += 12;
      minExposure += 2000;
      maxExposure += 6000;
      items.push({
        id: 'lp-siding',
        severity: 'moderate',
        badge: '🪵 WOOD MOISTURE WICKING & SUBTERRANEAN TERMITES',
        title: 'Hardboard / LP Inner-Seal Siding Deterioration & Fungal Wicking',
        standard: 'InterNACHI Exterior SOP §3.2 / Georgia Structural Pest Rules',
        description: 'Composite wood sidings without minimum 6-inch ground clearances absorb capillary moisture from Georgia red clay soil, swelling and creating hidden bridge tunnels for subterranean termites.',
        exposure: '$2,000 – $6,000 (Siding Repairs & Termite Treatment)',
        foresightProtocol: 'Ground clearance measurement, moisture probe reading, and Official Georgia WDO-100 wood-destroying insect inspection.'
      });
    }

    // 4. Sewer Line Lateral Hazard
    if (year < 1995) {
      score += 15;
      minExposure += 4500;
      maxExposure += 14000;
      items.push({
        id: 'sewer-lateral',
        severity: 'high',
        badge: '🚰 CONCEALED UNDERGROUND COLLAPSE HAZARD',
        title: 'Aging Cast Iron / Vitrified Clay Sewer Lateral (30+ Years Old)',
        standard: 'ASTM C12 / Municipal Lateral Maintenance Standard',
        description: 'Homes built before 1995 across Metro Atlanta frequently have cast iron or clay sewer pipes beneath driveways and yards. Mature oak root systems penetrate joints, and acidic wastewater corrodes bottom channels into soil.',
        exposure: '$4,500 – $14,000+ (Underground Sewer Excavation & Trenchless Lining)',
        foresightProtocol: 'High-definition 150-ft self-leveling sewer scope camera deployed through exterior cleanout directly to the municipal main connection.'
      });
    }

    // 5. Geological & Foundation Hazards
    if (foundation === 'crawlspace') {
      score += 20;
      minExposure += 3500;
      maxExposure += 12000;
      items.push({
        id: 'red-clay-crawlspace',
        severity: 'high',
        badge: '🍄 FUNGAL DECAY & HIGH RELATIVE HUMIDITY',
        title: 'Georgia Red Clay Crawlspace Moisture & Subfloor Rot',
        standard: 'GA Dept of Agriculture Fungal Guidelines (>19% WME Rot Threshold)',
        description: 'Vented crawlspaces in Metro Atlanta suck in warm humid summer air, condensing against cool floor ducts. Red clay ground moisture elevates crawlspace humidity above 70%, fostering fungal mycelium bloom and joist deflection.',
        exposure: '$3,500 – $12,000+ (12-mil Encapsulation & Commercial Dehumidifier)',
        foresightProtocol: 'Dual inspectors traverse 100% of crawlspace perimeter with electronic psychrometer relative humidity and wood moisture meters.'
      });
    } else if (foundation.includes('basement')) {
      score += 14;
      minExposure += 2500;
      maxExposure += 8000;
      items.push({
        id: 'hydrostatic-pressure',
        severity: 'moderate',
        badge: '🧱 HYDROSTATIC RED CLAY LATERAL SHEAR',
        title: 'Hydrostatic Soil Pressure & Basement Wall Shear Cracking',
        standard: 'IRC R404 Foundation Walls / Georgia Red Clay Expansion Index',
        description: 'Heavy Georgia red clay expands dramatically when saturated with winter rain, exerting severe lateral hydrostatic pressure against concrete block basement walls, manifesting as horizontal shear cracks.',
        exposure: '$2,500 – $8,000 (Carbon Fiber Strapping or Helical Pier Tiebacks)',
        foresightProtocol: 'Laser level horizontal deflection scan and Infrared Thermal Imaging water table intrusion diagnostic.'
      });
    }

    // 6. Radon Gas Zone 1 Granite Radiation
    if (countyInfo.radonZone === 1 && (foundation === 'crawlspace' || foundation.includes('basement'))) {
      score += 18;
      minExposure += 1500;
      maxExposure += 2500;
      items.push({
        id: 'radon-zone-1',
        severity: 'critical',
        badge: '☢️ EPA RADON ZONE 1 CARCINOGENIC HAZARD',
        title: `EPA Radon Zone 1 Warning: ${countyInfo.name}`,
        standard: 'EPA Action Level 4.0 pCi/L / Piedmont Granite Geological Belt',
        description: 'North Metro Atlanta sits atop a massive subterranean granite bedrock formation. Naturally decaying uranium releases odorless, invisible radioactive radon gas that seeps directly through basement slabs and crawlspace soils.',
        exposure: '$1,500 – $2,500 (Active Sub-Slab Depressurization Mitigation System)',
        foresightProtocol: 'Continuous 48-hour electronic CRM radon monitor calibrated to take hourly automated readings following strict EPA closed-building protocols.'
      });
    }

    // 7. New Construction Rapid-Build Window
    if (year >= 2022) {
      score += 22;
      minExposure += 3000;
      maxExposure += 10000;
      items.push({
        id: 'new-construction-concealment',
        severity: 'high',
        badge: '⏱️ DRYWALL CONCEALMENT TIMELINE RISK',
        title: 'New Construction Framing & Subcontractor Coordination Errors',
        standard: 'Georgia State Minimum Standard One and Two Family Dwelling Code (IRC 2018)',
        description: 'Building science audits show that 82% of structural framing alterations, improperly cut load-bearing headers, unglued PVC drain lines, and disconnected attic ducts occur during rapid modern builds. County inspectors spend less than 15 minutes on site.',
        exposure: '$3,000 – $10,000 (Post-Closing Defect Rectification)',
        foresightProtocol: 'Two Certified Master Inspectors conduct full pre-drywall framing audits and pre-closing operational punchlists.'
      });
    }

    const clampedScore = Math.min(98, Math.max(15, score));
    let tier = {
      level: 'MODERATE',
      color: '#EAB308',
      label: '🟡 MODERATE - Age-Related Deferred Maintenance',
      summary: 'Property exhibits typical mid-life mechanical wear. Requires thorough mechanical testing and targeted lateral line diagnostics.'
    };

    if (clampedScore >= 75) {
      tier = {
        level: 'CRITICAL',
        color: '#EF4444',
        label: '🔴 CRITICAL - High Defect Vulnerability & Life-Safety Exposure',
        summary: 'Multiple high-liability building code hazards detected (hazardous wiring, recalled plumbing, or high moisture trap risk). Full forensic dual-inspector audit is essential.'
      };
    } else if (clampedScore >= 50) {
      tier = {
        level: 'HIGH',
        color: '#F97316',
        label: '🟠 HIGH - Significant Material & Environmental Hazards',
        summary: 'Substantial structural or environmental vulnerabilities identified based on regional geological conditions and era building practices.'
      };
    } else if (clampedScore < 30) {
      tier = {
        level: 'LOW',
        color: '#22C55E',
        label: '🟢 LOW - Modern Code Compliance Baseline',
        summary: 'Modern construction practices reduce historical material hazards, but independent third-party verification of subcontractor execution remains vital.'
      };
    }

    return {
      score: clampedScore,
      tier,
      items,
      minExposure,
      maxExposure
    };
  }, [yearBuilt, county, foundation, siding, countyInfo]);

  // Recommended Inspection Package Builder
  const recommendedPackage = useMemo(() => {
    const year = Number(yearBuilt) || 1988;
    const isNew = year >= 2024;
    const baseService = isNew ? 'new-construction' : 'buyer';
    
    let basePrice = 345;
    if (isNew) {
      basePrice = sqft <= 1800 ? 400 : sqft <= 2500 ? 455 : 485;
    } else {
      basePrice = sqft <= 1000 ? 345 : sqft <= 1500 ? 375 : sqft <= 2000 ? 405 : sqft <= 2500 ? 435 : 465;
    }

    const needsRadon = countyInfo.radonZone === 1 || foundation.includes('basement') || foundation === 'crawlspace';
    const needsSewer = year < 2000;
    const needsTermite = foundation === 'crawlspace' || year < 1995;

    let total = basePrice;
    const services = [
      {
        name: isNew ? 'New Construction Phased / Final Inspection' : 'Pre-Purchase Buyer Home Inspection',
        price: `From $${basePrice}`,
        cost: basePrice,
        included: true,
        desc: 'Two Certified Inspectors on site concurrently. Full 1,600-point InterNACHI SOP audit.'
      },
      {
        name: 'High-Resolution Infrared Thermal Imaging Scan',
        price: 'FREE ($150 Value)',
        cost: 0,
        included: true,
        desc: 'Radiometric infrared detection of hidden moisture leaks and electrical panel hotspots.'
      },
      {
        name: '4K Aerial Drone Roof Analysis',
        price: 'FREE ($125 Value)',
        cost: 0,
        included: true,
        desc: 'FAA Part 107 licensed drone inspection of steep roof planes, flashings, and boots.'
      },
      {
        name: 'Up to $35,000 Combined Warranty Protection',
        price: 'INCLUDED ($0 Deductible)',
        cost: 0,
        included: true,
        desc: '$10k Elite Master Inspection Warranty + InterNACHI $25k Honor Guarantee.'
      }
    ];

    if (needsRadon) {
      total += 250;
      services.push({
        name: '48-Hour Electronic Continuous Radon Testing',
        price: '$250 Flat Rate',
        cost: 250,
        recommended: true,
        reason: `${countyInfo.name} is EPA Radon Zone 1 with high granite soil emissions.`
      });
    }

    if (needsSewer) {
      total += 450;
      services.push({
        name: 'High-Definition Sewer Scope Camera Inspection',
        price: '$450 Flat Rate',
        cost: 450,
        recommended: true,
        reason: `Built in ${year}. Sewer laterals over 25 years old require lateral camera verification.`
      });
    }

    if (needsTermite) {
      const termiteFee = foundation === 'crawlspace' ? 165 : 125;
      total += termiteFee;
      services.push({
        name: 'Official Georgia Wood Infestation Report (WDO / Termite)',
        price: `$${termiteFee}`,
        cost: termiteFee,
        recommended: true,
        reason: 'Georgia red clay soil is high-risk subterranean termite territory.'
      });
    }

    return {
      baseService,
      basePrice,
      total,
      services,
      needsRadon,
      needsSewer,
      needsTermite
    };
  }, [yearBuilt, sqft, countyInfo, foundation]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const url = `${window.location.origin}/risk-scanner?year=${yearBuilt}&county=${county}&foundation=${foundation}&siding=${siding}&sqft=${sqft}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Build target link to QuoteClient with pre-filled parameters
  const quoteTargetUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('service', recommendedPackage.baseService);
    params.set('sqft', String(sqft));
    params.set('foundation', foundation.includes('basement') ? 'basement' : foundation === 'crawlspace' ? 'crawlspace' : 'slab');
    if (recommendedPackage.needsRadon) params.set('radon', 'true');
    if (recommendedPackage.needsSewer) params.set('sewer', 'true');
    if (recommendedPackage.needsTermite) params.set('termite', 'true');
    return `/quote?${params.toString()}`;
  }, [recommendedPackage, sqft, foundation]);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1rem 4rem 1rem',
        borderBottom: '3px solid var(--color-gold)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--color-gold)', padding: '0.35rem 1rem', borderRadius: '50px', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1rem' }}>🔬</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Building Science Diagnostic Intelligence
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            color: '#FFFFFF'
          }}>
            Georgia Property Risk &amp; Age Diagnostic Scanner
          </h1>

          <p style={{
            color: '#CBD5E1',
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            maxWidth: '820px',
            margin: '0 auto 1.5rem auto',
            lineHeight: 1.6
          }}>
            Analyze hidden building code hazards, recalled plumbing, high-risk electrical panels, EPA Radon Zone 1 granite emissions, and Georgia red clay moisture traps by property era and county.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#94A3B8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <strong style={{ color: 'var(--color-gold)' }}>👥 Two CMI Inspectors</strong> on Every Job
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <strong style={{ color: 'var(--color-gold)' }}>🔥 Free infrared thermal</strong>
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <strong style={{ color: 'var(--color-gold)' }}>🛡️ Up to $35,000</strong> Warranty Included
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Container */}
      <main style={{ maxWidth: '1180px', margin: '-2rem auto 0 auto', padding: '0 1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 420px) minmax(320px, 1fr)',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* LEFT COLUMN: Input Controls */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '1.25rem',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            border: '1px solid #E2E8F0',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--color-slate-dark)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>⚙️ Property Parameters</span>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                🖨️ Print
              </button>
            </h2>

            {/* Quick Era Presets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Quick Era Select
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {ERA_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setYearBuilt(preset.year);
                      setFoundation(preset.foundation);
                      setSiding(preset.siding);
                    }}
                    style={{
                      background: yearBuilt === preset.year ? 'var(--color-slate-dark)' : '#F1F5F9',
                      color: yearBuilt === preset.year ? 'var(--color-gold)' : '#334155',
                      border: yearBuilt === preset.year ? '1px solid var(--color-gold)' : '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Built Slider */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label htmlFor="year-input" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                  📅 Year Built
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <input
                    id="year-input"
                    type="number"
                    min="1900"
                    max="2026"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(Math.min(2026, Math.max(1900, Number(e.target.value) || 1988)))}
                    style={{
                      width: '80px',
                      padding: '0.35rem 0.5rem',
                      border: '2px solid var(--color-gold)',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: '#0F172A',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>({2026 - yearBuilt} yrs)</span>
                </div>
              </div>
              <input
                type="range"
                min="1900"
                max="2026"
                value={yearBuilt}
                onChange={(e) => setYearBuilt(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                <span>1900 (Historic)</span>
                <span>1985 (Boom Era)</span>
                <span>2026 (New Build)</span>
              </div>
            </div>

            {/* Metro Atlanta County */}
            <div style={{ marginBottom: '1.35rem' }}>
              <label htmlFor="county-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.4rem' }}>
                📍 Metro Atlanta County
              </label>
              <select
                id="county-select"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0F172A'
                }}
              >
                {Object.entries(COUNTIES_DATA).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.name} {data.radonZone === 1 ? '☢️ Zone 1' : '⚠️ Zone 2'}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: '0.75rem', color: countyInfo.radonZone === 1 ? '#DC2626' : '#D97706', marginTop: '0.35rem', fontWeight: 600 }}>
                {countyInfo.radonZone === 1 ? '🚨 EPA Radon Zone 1 (>4.0 pCi/L)' : '⚠️ EPA Radon Zone 2 (2.0 - 4.0 pCi/L)'} • {countyInfo.soil}
              </div>
            </div>

            {/* Foundation Type */}
            <div style={{ marginBottom: '1.35rem' }}>
              <label htmlFor="foundation-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.4rem' }}>
                🧱 Foundation Type
              </label>
              <select
                id="foundation-select"
                value={foundation}
                onChange={(e) => setFoundation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0F172A'
                }}
              >
                <option value="crawlspace">Georgia Red Clay Crawlspace (Vented)</option>
                <option value="encapsulated">Encapsulated Sealed Crawlspace</option>
                <option value="slab">Concrete Slab-on-Grade</option>
                <option value="basement-unfinished">Full Unfinished Basement</option>
                <option value="basement-finished">Full Finished Basement</option>
              </select>
            </div>

            {/* Exterior Siding */}
            <div style={{ marginBottom: '1.35rem' }}>
              <label htmlFor="siding-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.4rem' }}>
                🏠 Exterior Cladding
              </label>
              <select
                id="siding-select"
                value={siding}
                onChange={(e) => setSiding(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0F172A'
                }}
              >
                <option value="eifs">Synthetic Stucco (EIFS Barrier Trap)</option>
                <option value="brick">Brick Veneer / Masonry</option>
                <option value="hardie">Fiber Cement (HardiePlank)</option>
                <option value="wood">Wood / LP / Hardboard Siding</option>
                <option value="vinyl">Traditional Vinyl Siding</option>
              </select>
            </div>

            {/* Approximate Square Footage */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label htmlFor="sqft-range" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>
                  📐 Home Square Footage
                </label>
                <span style={{ fontWeight: 800, color: 'var(--color-slate-dark)', fontSize: '1rem' }}>
                  {sqft.toLocaleString()} sq ft
                </span>
              </div>
              <input
                id="sqft-range"
                type="range"
                min="800"
                max="6500"
                step="100"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
              />
            </div>

            {/* Share / Copy Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--color-gold)',
                background: copiedLink ? '#ECFDF5' : 'rgba(212, 175, 55, 0.1)',
                color: copiedLink ? '#065F46' : 'var(--color-slate-dark)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <span>{copiedLink ? '✅ Link Copied to Clipboard!' : '📋 Copy Shareable Link'}</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Diagnostic Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Risk Gauge Header Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '1.25rem',
              padding: '2.25rem',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
              border: `2px solid ${diagnostic.tier.color}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    background: `${diagnostic.tier.color}15`,
                    color: diagnostic.tier.color,
                    border: `1px solid ${diagnostic.tier.color}`,
                    padding: '0.35rem 0.85rem',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem'
                  }}>
                    {diagnostic.tier.label}
                  </span>
                  <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0
                  }}>
                    Property Vulnerability Score: {diagnostic.score} / 100
                  </h2>
                </div>

                <div style={{
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '1rem 1.5rem',
                  borderRadius: '1rem',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Concealed Defect Exposure
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                    ${diagnostic.minExposure.toLocaleString()} – ${diagnostic.maxExposure.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress Meter Bar */}
              <div style={{ background: '#E2E8F0', height: '12px', borderRadius: '50px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{
                  width: `${diagnostic.score}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, #22C55E 0%, #EAB308 50%, #EF4444 100%)`,
                  borderRadius: '50px',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                <strong>Diagnostic Summary:</strong> {diagnostic.tier.summary} Analysis benchmarked against Georgia Association of Realtors (GAR) due diligence standards, EPA Radon surveys, and Georgia State Minimum Standard Construction Codes.
              </p>
            </div>

            {/* Identified Vulnerabilities Section */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🔍 Identified Age &amp; Geological Vulnerabilities ({diagnostic.items.length})</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {diagnostic.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '1rem',
                      padding: '1.75rem',
                      border: '1px solid #E2E8F0',
                      borderLeft: `5px solid ${item.severity === 'critical' ? '#EF4444' : item.severity === 'high' ? '#F97316' : '#EAB308'}`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.65rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: item.severity === 'critical' ? '#EF4444' : item.severity === 'high' ? '#EA580C' : '#CA8A04',
                        background: '#F8FAFC',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0'
                      }}>
                        {item.badge}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#DC2626' }}>
                        Liability: {item.exposure}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                      {item.title}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Reference: {item.standard}
                    </div>

                    <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                      {item.description}
                    </p>

                    <div style={{
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      fontSize: '0.88rem',
                      color: '#0F172A'
                    }}>
                      <strong style={{ color: 'var(--color-gold-hover)' }}>🛡️ Foresight Master Diagnostic Protocol:</strong>{' '}
                      {item.foresightProtocol}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Recommended Package Card */}
            <div style={{
              background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: '1.25rem',
              padding: '2.5rem',
              color: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
              border: '2px solid var(--color-gold)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.75rem' }}>
                <div>
                  <span style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: 'var(--color-gold)',
                    border: '1px solid var(--color-gold)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    🎯 Tailored Due Diligence Solution
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: 0
                  }}>
                    Recommended Foresight Diagnostic Package
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
                    Engineered to neutralize all identified hazards for {yearBuilt} build in {countyInfo.name}.
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Estimated Total Package
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-gold)', lineHeight: 1.1 }}>
                    From ${recommendedPackage.total}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 600 }}>
                    Zero Hidden Fees • Transparent Online Pricing
                  </div>
                </div>
              </div>

              {/* Package Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {recommendedPackage.services.map((srv, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '0.85rem 1.15rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{srv.included ? '✅' : '⚡'}</span>
                        <span>{srv.name}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                        {srv.desc || srv.reason}
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--color-gold)', fontSize: '0.95rem' }}>
                      {srv.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href={quoteTargetUrl}
                  style={{
                    background: 'var(--color-gold)',
                    color: '#0F172A',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>📅 Calculate Instant Quote Online</span>
                  <span>&rarr;</span>
                </Link>

                <a
                  href="tel:678-480-2110"
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    border: '1px solid #475569',
                    fontWeight: 700,
                    fontSize: '1rem',
                    padding: '1rem 1.75rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>📞 CMI Hotline: 678-480-2110</span>
                </a>
              </div>
            </div>

            {/* Educational Guarantee Banner */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '1rem',
              padding: '1.75rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '2.5rem' }}>🛡️</div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A', fontSize: '1.1rem', fontWeight: 800 }}>
                  Backed by Up to $35,000 in Combined Warranty Protection
                </h4>
                <p style={{ margin: 0, color: '#64748B', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Every full Foresight home inspection includes our $10,000 Elite Master Inspection Warranty ($0 deductible) covering mechanicals, roof leaks, appliances, and mold, plus InterNACHI&apos;s $25,000 Honor Guarantee.
                </p>
              </div>
              <div>
                <Link
                  href="/due-diligence"
                  style={{
                    color: 'var(--color-gold-hover)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                  }}
                >
                  Learn About Due Diligence Protection &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
