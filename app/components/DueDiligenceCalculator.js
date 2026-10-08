'use client';

import { useState, useMemo } from 'react';

// RSMeans 2026 Regional Cost Index for Metro Atlanta / Georgia (1.08x baseline)
const DEFECT_ITEMS = [
  // 1. ELECTRICAL
  {
    id: 'fpe_zinsco_panel',
    category: '⚡ Electrical Systems',
    title: 'Federal Pacific Stab-Lok / Zinsco Panel Replacement',
    cost: 3450,
    severity: 'critical',
    desc: 'Documented failure to trip on dead short circuits. Uninsurable fire risk requiring immediate 200A breaker service upgrade.',
    sponsorCategory: 'home_warranty'
  },
  {
    id: 'ungrounded_circuits',
    category: '⚡ Electrical Systems',
    title: 'Ungrounded Outlets / Missing Dual-Function GFCI & AFCI',
    cost: 1250,
    severity: 'moderate',
    desc: 'Installation of dual-function GFCI/AFCI breakers for kitchen, bath, exterior, and garage wet locations to meet current NEC code.',
    sponsorCategory: 'contractor'
  },

  // 2. HVAC & MECHANICAL
  {
    id: 'hvac_expired',
    category: '❄️ Heating & Cooling (HVAC)',
    title: 'HVAC Split System Exceeding ASHRAE Service Life (>15 yrs)',
    cost: 7200,
    severity: 'high',
    desc: 'Compressor mechanical wear and phased-out R-410A refrigerant. Full high-efficiency heat pump split system replacement.',
    sponsorCategory: 'home_warranty'
  },
  {
    id: 'furnace_heat_exchanger',
    category: '❄️ Heating & Cooling (HVAC)',
    title: 'Cracked Gas Furnace Heat Exchanger (Carbon Monoxide Risk)',
    cost: 4950,
    severity: 'critical',
    desc: 'Immediate life-safety carbon monoxide hazard. Unit requires mandatory red-tag shutdown and emergency equipment replacement.',
    sponsorCategory: 'home_warranty'
  },

  // 3. PLUMBING & WATER
  {
    id: 'polybutylene_plumbing',
    category: '🚰 Plumbing Infrastructure',
    title: 'Polybutylene (Quest PB2110) Whole-Home Supply Repipe',
    cost: 8800,
    severity: 'critical',
    desc: 'Defective resin subject to sudden chlorine degradation and catastrophic ceiling/drywall flooding. Full PEX repiping required.',
    sponsorCategory: 'contractor'
  },
  {
    id: 'sewer_line_root_intrusion',
    category: '🚰 Plumbing Infrastructure',
    title: 'Main Sewer Lateral Root Intrusion / Pipe Deflection',
    cost: 6500,
    severity: 'high',
    desc: 'Sewer camera reveals offset joints or heavy Georgia red clay root intrusion requiring hydro-jetting or trenchless epoxy pipe relining.',
    sponsorCategory: 'contractor'
  },
  {
    id: 'water_heater_expired',
    category: '🚰 Plumbing Infrastructure',
    title: 'Water Heater Aged >12 Years or Active Tank Corrosion',
    cost: 1950,
    severity: 'moderate',
    desc: 'Aged 50-gallon tank with expired sacrificial anode rod. High risk of bottom blowout; replacement with thermal expansion tank.',
    sponsorCategory: 'home_warranty'
  },

  // 4. ROOFING & ENVELOPE
  {
    id: 'roof_replacement',
    category: '🏠 Roofing & Attic Structure',
    title: 'Architectural Shingle Roof Past Service Life (>20 yrs)',
    cost: 11200,
    severity: 'high',
    desc: 'Severe granule loss, brittle fiberglass matting, and hail bruising. Complete architectural shingle tear-off and reroofing.',
    sponsorCategory: 'contractor'
  },
  {
    id: 'roof_flashing_leaks',
    category: '🏠 Roofing & Attic Structure',
    title: 'Chimney / Valley Step Flashing & Pipe Boot Collar Failure',
    cost: 1650,
    severity: 'moderate',
    desc: 'Deteriorated neoprene pipe collars and unsealed step flashing permitting active moisture infiltration into attic insulation.',
    sponsorCategory: 'contractor'
  },

  // 5. FOUNDATION & CRAWLSPACE
  {
    id: 'foundation_settling_cracks',
    category: '🧱 Foundation & Substructure',
    title: 'Foundation Differential Settling / Stair-Step Mortar Cracks',
    cost: 9800,
    severity: 'critical',
    desc: 'Shear deflection from Georgia red clay soil expansion/contraction. Requires structural engineer review and helical steel piering.',
    sponsorCategory: 'contractor'
  },
  {
    id: 'crawlspace_moisture_fungus',
    category: '🧱 Foundation & Substructure',
    title: 'Crawlspace Standing Water / Microbial Fungal Growth (>70% RH)',
    cost: 5800,
    severity: 'high',
    desc: 'Subfloor relative humidity exceeding 70% causing active wood-decay rot. Requires full 12-mil vapor encapsulation and commercial dehumidifier.',
    sponsorCategory: 'contractor'
  },

  // 6. ENVIRONMENTAL & RADON
  {
    id: 'radon_elevated',
    category: '☢️ Environmental & Air Quality',
    title: 'Elevated Indoor Radon Gas Concentration (≥ 4.0 pCi/L)',
    cost: 1850,
    severity: 'high',
    desc: 'EPA Zone 1 Piedmont granite belt radiation risk. Class A carcinogen requiring active sub-slab/sub-membrane depressurization fan system.',
    sponsorCategory: 'insurance'
  }
];

export default function DueDiligenceCalculator() {
  const [activeTab, setActiveTab] = useState('underwriter'); // 'underwriter' | 'timeline'
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Underwriter Inputs
  const [propertyAddress, setPropertyAddress] = useState('1234 Peachtree St NE, Atlanta, GA 30309');
  const [squareFootage, setSquareFootage] = useState(2400);
  const [purchasePrice, setPurchasePrice] = useState(485000);
  const [selectedDefects, setSelectedDefects] = useState([
    'fpe_zinsco_panel',
    'hvac_expired',
    'polybutylene_plumbing'
  ]);
  const [copiedAmendment, setCopiedAmendment] = useState(false);

  // Timeline Inputs
  const [bindingDate, setBindingDate] = useState(todayStr);
  const [dueDiligenceDays, setDueDiligenceDays] = useState(7);
  const [yearBuilt, setYearBuilt] = useState(1994);
  const [foundation, setFoundation] = useState('crawlspace');
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // $99 Outside Report Audit Modal & Stripe Checkout State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditName, setAuditName] = useState('');
  const [auditEmail, setAuditEmail] = useState('');
  const [auditPhone, setAuditPhone] = useState('');
  const [auditAddress, setAuditAddress] = useState('');
  const [auditReportLink, setAuditReportLink] = useState('');
  const [auditNotes, setAuditNotes] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditMsg, setAuditMsg] = useState('');

  const handleStartAuditCheckout = async (e) => {
    e.preventDefault();
    setAuditLoading(true);
    setAuditMsg('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'outside-report-audit',
          name: auditName,
          email: auditEmail,
          phone: auditPhone,
          address: auditAddress,
          reportLink: auditReportLink,
          notes: auditNotes,
          amount: 99
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.setupMode) {
        setAuditMsg(data.message || 'Intake received! We will contact you immediately.');
      } else {
        setAuditMsg(data.error || 'Unable to start checkout. Please call (678) 480-2110.');
      }
    } catch (err) {
      setAuditMsg('Network connection error. Please call or text (678) 480-2110 for immediate dispatch.');
    } finally {
      setAuditLoading(false);
    }
  };

  const toggleDefect = (id) => {
    setSelectedDefects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Underwriting Calculations
  const underwriting = useMemo(() => {
    const active = DEFECT_ITEMS.filter((item) => selectedDefects.includes(item.id));
    
    // Scale costs slightly by square footage for whole-house items
    const totalMedian = active.reduce((sum, item) => {
      let cost = item.cost;
      if (item.id === 'roof_replacement') cost = Math.round(squareFootage * 4.45);
      if (item.id === 'polybutylene_plumbing') cost = Math.round(squareFootage * 3.75);
      return sum + cost;
    }, 0);

    const lowEstimate = Math.round(totalMedian * 0.85);
    const highEstimate = Math.round(totalMedian * 1.25);

    // Negotiation Strategy: Open at 90% demand, target 75% cash credit settlement
    const openingDemand = Math.round(totalMedian * 0.90);
    const targetSettlement = Math.round(totalMedian * 0.75);
    const walkAwayThreshold = Math.round(totalMedian * 0.50);

    // Percentage of Purchase Price
    const creditPct = purchasePrice > 0 ? ((targetSettlement / purchasePrice) * 100).toFixed(1) : 0;

    // Amendment Text Generator
    const amendmentClause = `
SAMPLE DUE DILIGENCE NEGOTIATION LANGUAGE (FOR REALTOR / CLOSING ATTORNEY REVIEW - GAR FORM F404 EXHIBIT)
PROPERTY: ${propertyAddress}
DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Pursuant to the Due Diligence Contingency of the Purchase and Sale Agreement, Buyer conducted an independent evaluation by a Certified Master Inspector and identified the following material contractor repairs:

${active.map((d, i) => `${i + 1}. [${d.category}] ${d.title}
   - Finding: ${d.desc}
   - RSMeans Estimated Contractor Remediation: $${d.cost.toLocaleString()}`).join('\n')}

PROPOSED SETTLEMENT IN LIEU OF REPAIRS:
In lieu of Seller performing actual physical repairs prior to closing, Seller agrees to credit Buyer the sum of $${openingDemand.toLocaleString()} at the time of closing to be applied toward Buyer's closing costs, prepaids, and/or loan rate buydown (or via reduction of the purchase price), subject to Buyer's lender approval.

All other terms and conditions of the Purchase and Sale Agreement remain in full force and effect.

*DISCLAIMER: Foresight Home Inspections, LLC is an independent diagnostic home inspection firm and not a licensed general contractor or legal counsel. This sample wording is provided strictly for review, modification, and incorporation into contract amendments by the consumer's licensed Georgia Real Estate Broker or closing attorney. Cost figures reflect historical statistical benchmarks (RSMeans Southeast Metro Atlanta index) for preliminary negotiation budgeting. All defect remediations must be independently evaluated, quoted, and confirmed by licensed, insured trade specialists prior to contract closing. Not affiliated with or endorsed by the Georgia Association of Realtors® (GAR).
`.trim();

    return {
      activeDefects: active,
      totalMedian,
      lowEstimate,
      highEstimate,
      openingDemand,
      targetSettlement,
      walkAwayThreshold,
      creditPct,
      amendmentClause,
      criticalCount: active.filter((d) => d.severity === 'critical').length
    };
  }, [selectedDefects, squareFootage, purchasePrice, propertyAddress]);

  // Timeline Milestones
  const timeline = useMemo(() => {
    const base = new Date(bindingDate + 'T12:00:00');
    if (isNaN(base.getTime())) return null;

    const addDays = (d, count) => {
      const result = new Date(d);
      result.setDate(result.getDate() + count);
      return result;
    };

    const formatDate = (d) => {
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const day1Inspection = addDays(base, Math.min(2, Math.floor(dueDiligenceDays * 0.3)));
    const dayReport = addDays(day1Inspection, 1);
    const dayQuotes = addDays(base, Math.min(dueDiligenceDays - 2, Math.floor(dueDiligenceDays * 0.7)));
    const dayAmendment = addDays(base, Math.max(1, dueDiligenceDays - 1));
    const dayExpiration = addDays(base, dueDiligenceDays);

    return {
      binding: formatDate(base),
      inspectionTarget: formatDate(day1Inspection),
      reportTarget: formatDate(dayReport),
      specialistQuotes: formatDate(dayQuotes),
      amendmentDeadline: formatDate(dayAmendment),
      finalExpiration: formatDate(dayExpiration),
    };
  }, [bindingDate, dueDiligenceDays]);

  const handleCopyAmendment = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(underwriting.amendmentClause).then(() => {
        setCopiedAmendment(true);
        setTimeout(() => setCopiedAmendment(false), 2500);
      });
    }
  };

  const handleCopyEmbed = () => {
    const code = `<iframe src="https://www.fhinspectionsatl.com/due-diligence" width="100%" height="750" style="border:none;border-radius:12px;" title="Due Diligence Repair Credit Calculator"></iframe>\n<p style="font-size:12px;color:#666;">Source: <a href="https://www.fhinspectionsatl.com/due-diligence" target="_blank" rel="noopener">Foresight Home Inspections - Atlanta Certified Master Inspector</a></p>`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 3000);
      });
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0A0F1D 0%, #111827 50%, #0B1120 100%)',
      borderRadius: '24px',
      padding: '2.5rem 1.75rem',
      border: '1px solid rgba(212, 175, 55, 0.35)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.12)',
      color: '#ffffff',
      margin: '2rem 0'
    }}>
      {/* Premium Header with Trust Badges */}
      <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '5px 16px', borderRadius: '30px', marginBottom: '0.85rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
            RSMeans 2026 Calibrated • GAR Contract Compatible
          </span>
        </div>
        <h3 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, margin: '0 0 0.5rem', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Due Diligence Repair Credit &amp; Closing Negotiator
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
          Quantify inspection defect outlays, determine your optimal seller closing credit demand, and generate an enforceable GAR amendment in seconds.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('underwriter')}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'underwriter' ? 'linear-gradient(135deg, #D4AF37 0%, #B89628 100%)' : 'transparent',
              color: activeTab === 'underwriter' ? '#0F172A' : '#94A3B8',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>💰</span> Repair Credit Negotiator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'timeline' ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' : 'transparent',
              color: activeTab === 'timeline' ? '#ffffff' : '#94A3B8',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⏱️</span> 7-Day Timeline Defense
          </button>
        </div>
      </div>

      {/* ================= TAB 1: REPAIR CREDIT UNDERWRITER ================= */}
      {activeTab === 'underwriter' && (
        <div>
          {/* Top Parameters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            background: 'rgba(0,0,0,0.4)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Property Under Contract
              </label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Home Size: <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>{squareFootage} sq ft</span>
              </label>
              <input
                type="range"
                min={1000}
                max={5500}
                step={50}
                value={squareFootage}
                onChange={(e) => setSquareFootage(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4AF37' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Contract Purchase Price: <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>${purchasePrice.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={200000}
                max={1500000}
                step={10000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#D4AF37' }}
              />
            </div>
          </div>

          {/* Core Underwriting Layout: Defect Checklist Left (7 cols) vs Settlement Card Right (5 cols) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left: Defect Selector */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#E2E8F0' }}>
                  Select Inspection Defect Findings ({selectedDefects.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  Click to add/remove
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {DEFECT_ITEMS.map((d) => {
                  const isSelected = selectedDefects.includes(d.id);
                  let displayCost = d.cost;
                  if (d.id === 'roof_replacement') displayCost = Math.round(squareFootage * 4.45);
                  if (d.id === 'polybutylene_plumbing') displayCost = Math.round(squareFootage * 3.75);

                  return (
                    <div
                      key={d.id}
                      onClick={() => toggleDefect(d.id)}
                      style={{
                        background: isSelected ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        padding: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ marginTop: '4px', accentColor: '#D4AF37', width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#ffffff' : '#E2E8F0' }}>
                              {d.title}
                            </span>
                            {d.severity === 'critical' && (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#EF4444', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                Safety Hazard
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>
                            {d.desc}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: isSelected ? '#D4AF37' : '#ffffff', fontFamily: 'monospace', display: 'block' }}>
                          +${displayCost.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'monospace' }}>
                          RSMeans avg
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Negotiation Settlement Output Card */}
            <div style={{
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)',
              border: '2px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Total Repair Exposure
                </span>
                <span style={{ fontSize: '0.75rem', color: '#A7F3D0', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace', fontWeight: 700 }}>
                  {underwriting.activeDefects.length} Defect Items
                </span>
              </div>

              {/* Total Estimated Contractor Outlay */}
              <div style={{ textAlign: 'center', padding: '0.75rem 0 1.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                  Estimated Licensed Contractor Outlay
                </span>
                <div style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', margin: '4px 0', fontFamily: 'monospace', letterSpacing: '-0.03em' }}>
                  ${underwriting.totalMedian.toLocaleString()}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  <span>Low: ${underwriting.lowEstimate.toLocaleString()}</span>
                  <span>•</span>
                  <span>High: ${underwriting.highEstimate.toLocaleString()}</span>
                </div>
              </div>

              {/* Optimal Opening Closing Credit Demand */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '14px',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  Recommended Opening Closing Credit Demand (90%)
                </span>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FDE047', fontFamily: 'monospace', margin: '2px 0' }}>
                  ${underwriting.openingDemand.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#CBD5E1', display: 'block' }}>
                  Opening amendment amount to request from seller in lieu of repairs.
                </span>
              </div>

              {/* Target Settlement & Walk-Away Benchmarks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Target Settlement</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
                    ${underwriting.targetSettlement.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#10B981', display: 'block', marginTop: '2px' }}>
                    75% Target ({underwriting.creditPct}% of price)
                  </span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Walk-Away Floor</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#EF4444', fontFamily: 'monospace' }}>
                    ${underwriting.walkAwayThreshold.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                    Minimum credit threshold
                  </span>
                </div>
              </div>

              {/* 1-Click Amendment Copy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleCopyAmendment}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: copiedAmendment ? '#10B981' : 'linear-gradient(135deg, #D4AF37 0%, #B89628 100%)',
                    color: copiedAmendment ? '#ffffff' : '#0F172A',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{copiedAmendment ? '✓' : '📋'}</span>
                  {copiedAmendment ? 'Sample GAR Clause Copied!' : 'Copy Sample GAR Amendment Clause'}
                </button>

                <a
                  href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(211, 47, 47, 0.4)',
                    background: 'rgba(211, 47, 47, 0.15)',
                    color: '#FCA5A5',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    display: 'block'
                  }}
                >
                  ⚡ Book Certified Master Inspection with FLIR Scan (From $345) →
                </a>

                {/* Standalone $99 Second-Opinion Audit Door */}
                <div style={{
                  marginTop: '0.75rem',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '10px',
                  padding: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      ⚡ Already Booked Another Inspector?
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                    Get the Official Foresight Repair Cost &amp; GAR Exhibit Audit ($99 Flat)
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
                    Hired a competitor who handed you an un-priced PDF? Upload your report to have our Certified Master Inspector engine extract contractor repair costs and generate your GAR Form F404 amendment exhibit in 4 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAuditModal(true)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #B89628 100%)',
                      color: '#0F172A',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '6px',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)'
                    }}
                  >
                    🔒 Order $99 Outside Report Audit (Stripe Checkout) →
                  </button>
                </div>

                {/* 4-Part Statutory Due Diligence Legal Armor Shield Card */}
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.7rem',
                  color: '#64748B',
                  lineHeight: 1.45
                }}>
                  <strong style={{ color: '#94A3B8', display: 'block', marginBottom: '3px' }}>
                    ⚖️ Statutory Due Diligence &amp; Contract Disclaimer:
                  </strong>
                  Foresight Home Inspections, LLC is an independent diagnostic inspection firm and not a licensed general contractor or legal advisor. Cost calculations reflect regional statistical indices (RSMeans 2026 Metro Atlanta index) for preliminary buyer due diligence budgeting. Sample amendment text is provided solely for review and formal submission by your licensed Georgia Real Estate Broker or closing attorney. Foresight disclaims all liability for contract negotiations, seller disputes, or contractor price variances. All defects must be evaluated by licensed, insured tradesmen prior to closing. Not affiliated with or endorsed by the Georgia Association of Realtors® (GAR).
                </div>
              </div>
            </div>
          </div>

          {/* ================= TOP-DOLLAR PARTNER & AFFILIATE NETWORK ================= */}
          <div style={{
            marginTop: '3rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                  Exclusive Due Diligence Partner Network
                </span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '2px 0 0' }}>
                  Verified Real Estate Underwriting Providers
                </h4>
              </div>
              <a
                href="mailto:partner@fhinspectionsatl.com?subject=Corporate%20Sponsorship%20Inquiry%20-%20Due%20Diligence%20Calculator"
                style={{
                  fontSize: '0.78rem',
                  color: '#94A3B8',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontFamily: 'monospace'
                }}
              >
                Corporate Sponsorship Placement Available →
              </a>
            </div>

            {/* 3 Premium Partner Cards (Top Dollar Monetization) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Partner 1: Home Warranty (Payout $75-$125) */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FDE047', background: 'rgba(212, 175, 55, 0.15)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      Official Warranty Partner
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Top-Rated Protection</span>
                  </div>
                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem' }}>
                    American Home Shield® / Choice Protection
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                    When sellers refuse to replace an aged HVAC compressor or 12-year-old water heater, demand an official \$750 seller closing credit to purchase a 1-year comprehensive home warranty covering unexpected mechanical failure.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <a
                    href="https://www.ahs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: 'rgba(212, 175, 55, 0.2)',
                      border: '1px solid #D4AF37',
                      color: '#FDE047',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Compare Official Warranty Plans →
                  </a>
                </div>
              </div>

              {/* Partner 2: Contractor Quote Network (Payout $25-$60) */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#93C5FD', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      Licensed Contractor Network
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Fast-Track Quotes</span>
                  </div>
                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem' }}>
                    Angi® / Networx Trade Verification
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                    Listing agents routinely push back on credit demands without formal contractor bids. Submit your zip code to instantly dispatch 3 licensed Georgia electricians, roofers, and plumbers for competitive written estimates.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <a
                    href="https://www.angi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid #3B82F6',
                      color: '#93C5FD',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Request 3 Licensed Contractor Bids →
                  </a>
                </div>
              </div>

              {/* Partner 3: Homeowners Insurance (Payout $25-$45) */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6EE7B7', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      Insurance Comparison
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Lender Prerequisite</span>
                  </div>
                  <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem' }}>
                    Policygenius® / Hippo Coverage
                  </h5>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                    Mortgage underwriting strictly forbids loan closing without binder insurance. Compare multi-carrier insurance rates to lock in low premiums on homes with older roofs or historic electrical panels.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                  <a
                    href="https://www.policygenius.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10B981',
                      color: '#6EE7B7',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    Check Multi-Carrier Insurance Rates →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TIMELINE DEFENSE ================= */}
      {activeTab === 'timeline' && (
        <div>
          {/* Timeline Inputs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
                📅 Binding Agreement Date
              </label>
              <input
                type="date"
                value={bindingDate}
                onChange={(e) => setBindingDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
                ⏱️ Due Diligence Window
              </label>
              <select
                value={dueDiligenceDays}
                onChange={(e) => setDueDiligenceDays(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              >
                <option value={5}>5 Calendar Days (Rush Window)</option>
                <option value={7}>7 Calendar Days (Standard Metro Atlanta)</option>
                <option value={8}>8 Calendar Days</option>
                <option value={10}>10 Calendar Days (Extended Due Diligence)</option>
                <option value={14}>14 Calendar Days (Historic / Rural)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
                🏠 Year Built
              </label>
              <input
                type="number"
                min={1900}
                max={2026}
                value={yearBuilt}
                onChange={(e) => setYearBuilt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37', marginBottom: '6px' }}>
                🧱 Foundation Type
              </label>
              <select
                value={foundation}
                onChange={(e) => setFoundation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#0F172A',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              >
                <option value="crawlspace">Crawlspace (Red Clay Moisture Exposure)</option>
                <option value="basement">Basement (Hydrostatic Pressure / Radon)</option>
                <option value="slab">Slab on Grade</option>
              </select>
            </div>
          </div>

          {/* Timeline Milestones Cards */}
          {timeline && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎯</span> Your Strategic GAR Contract Milestones
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem 1rem', borderTop: '3px solid #3B82F6' }}>
                  <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase' }}>
                    Stage 1: Inspection
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                    {timeline.inspectionTarget}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                    Target on-site evaluation with Foresight dual-inspector team.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem 1rem', borderTop: '3px solid #10B981' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6EE7B7', fontWeight: 700, textTransform: 'uppercase' }}>
                    Stage 2: Report &amp; CRL
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                    {timeline.reportTarget}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                    24-hour report delivered with 1-click Create Request List repair generator.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem 1rem', borderTop: '3px solid #F59E0B' }}>
                  <span style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 700, textTransform: 'uppercase' }}>
                    Stage 3: Specialist Quotes
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                    {timeline.specialistQuotes}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                    Collect licensed HVAC, roof, or structural contractor estimates.
                  </p>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem 1rem', borderTop: '3px solid #EF4444' }}>
                  <span style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 700, textTransform: 'uppercase' }}>
                    Stage 4: GAR Amendment
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                    {timeline.amendmentDeadline}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
                    Submit Amendment to Address Concerns to seller agent.
                  </p>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.25) 100%)', border: '2px solid #EF4444', borderRadius: '12px', padding: '1.25rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#F87171', fontWeight: 800, textTransform: 'uppercase' }}>
                    ⚠️ Final Expiration
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                    {timeline.finalExpiration}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#FCA5A5', margin: 0, lineHeight: 1.4, fontWeight: 600 }}>
                    Contingency ends strictly at 11:59 PM. Agreement must be executed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embed / Backlink Citation Box */}
      <div style={{
        marginTop: '2.5rem',
        background: 'rgba(212, 175, 55, 0.08)',
        border: '1px dashed rgba(212, 175, 55, 0.4)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <strong style={{ color: '#D4AF37', fontSize: '0.95rem', display: 'block', marginBottom: '2px' }}>
            🔗 Realtors, Lenders &amp; Real Estate Bloggers: Embed This Engine
          </strong>
          <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
            Embed this Due Diligence Underwriter into your buyer resources or vendor page. Includes automatic attribution backlink.
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopyEmbed}
          style={{
            background: copiedEmbed ? '#10B981' : '#D4AF37',
            color: copiedEmbed ? '#ffffff' : '#0F172A',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          {copiedEmbed ? '✓ Embed Code Copied!' : '📋 Copy Embed Code'}
        </button>
      </div>

      {/* $99 Outside Report Audit Stripe Intake Modal */}
      {showAuditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 8, 17, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            maxWidth: '540px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem 1.75rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowAuditModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94A3B8',
                fontSize: '1.2rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '9999px', padding: '4px 10px', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#FDE047', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                ⚡ Standalone Outside Report Audit
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
              4-Hour Due Diligence Repair Cost Audit ($99 Flat)
            </h3>

            <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
              Standard home inspections are diagnostic only per InterNACHI SOP. If you hired another inspection company and received an un-priced PDF, our CMI team cross-references your findings against <strong>RSMeans 2026 Metro Atlanta trade rates ($95–$165/hr)</strong> and generates a clean GAR Form F404 amendment exhibit within 4 hours.
            </p>

            <form onSubmit={handleStartAuditCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={auditName}
                  onChange={(e) => setAuditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={auditEmail}
                    onChange={(e) => setAuditEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(404) 555-0199"
                    value={auditPhone}
                    onChange={(e) => setAuditPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                  Property Under Contract *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, City, GA"
                  value={auditAddress}
                  onChange={(e) => setAuditAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                  Inspection Report Link / Cloud URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or report URL"
                  value={auditReportLink}
                  onChange={(e) => setAuditReportLink(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', marginBottom: '4px' }}>
                  Due Diligence Deadline &amp; Priority Concerns
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Due diligence ends Friday at 5pm. Main issues: HVAC, roof shingles, and main panel."
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {auditMsg && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38BDF8',
                  fontSize: '0.8rem',
                  lineHeight: 1.4
                }}>
                  {auditMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={auditLoading}
                style={{
                  padding: '13px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B89628 100%)',
                  color: '#0F172A',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: auditLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
                  marginTop: '0.5rem',
                  transition: 'opacity 0.2s',
                  opacity: auditLoading ? 0.7 : 1
                }}
              >
                {auditLoading ? 'Connecting to Stripe...' : '🔒 Proceed to Secure Stripe Checkout ($99 Flat) →'}
              </button>

              <div style={{ fontSize: '0.72rem', color: '#64748B', textAlign: 'center', lineHeight: 1.4 }}>
                🛡️ 256-Bit Encrypted Stripe Processing • Guaranteed 4-Hour Turnaround • Questions? Call (678) 480-2110
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
