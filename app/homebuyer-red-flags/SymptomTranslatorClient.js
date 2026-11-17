'use client';

import { useState } from 'react';
import Link from 'next/link';

const SYMPTOMS = [
  'All Symptoms',
  'Musty crawlspace or basement odor',
  'Stair-step brick cracks or sloping floors',
  'Fresh ceiling paint patch or roof age',
  '1970s-1990s electrical panel or grey plumbing pipes',
  'Brand-new builder house — county passed code',
  'Short 3-7 day Georgia due diligence window',
];

const AWARENESS_STAGES = [
  'All Stages',
  '1. New Build / Hidden Risk Check',
  '2. I Noticed a Red Flag',
  '3. Comparing Georgia Inspectors',
  '4. Negotiating Seller Credits',
];

const SYMPTOM_CARDS = [
  {
    id: 'crawlspace-odor',
    symptom: 'Musty crawlspace or basement odor',
    badge: 'Moisture & Subfloor Decay',
    stages: [
      '2. I Noticed a Red Flag',
      '3. Comparing Georgia Inspectors',
      '4. Negotiating Seller Credits',
    ],
    buildingScience:
      'In Georgia’s humid Piedmont red-clay belt, vented crawlspaces and unsealed basements trap ground vapor and stormwater runoff. Once wood moisture equivalent (WME) exceeds 19%, wood-decay fungi digest floor joists and sill plates while the stack effect draws up to 50% of crawlspace air—and airborne mold spores—upward into bedroom ductwork.',
    twoInspectorProtocol:
      'While Inspector 01 physically traverses the entire crawlspace with pin and pinless digital moisture meters checking pier spacing, vapor barriers, and fungal growth, Inspector 02 runs calibrated infrared thermal sweeps across interior subfloors and HVAC supply registers. Optional Mold & Air Quality spore-trap lab testing is available (Call (678) 480-2110 for Quote).',
    leverageRange: '$3,500 – $12,000+',
    leverageDetail:
      'Typical Metro Atlanta contractor pricing for 12-mil encapsulation, commercial dehumidification, French drainage, or joist sistering runs $3,500–$12,000+ in Georgia Repair Amendment credits—versus a From $345 single-family inspection (+$75 unfinished crawlspace/basement).',
    defectLinks: [
      { label: 'Crawlspace Fungus & Joist Rot Guide', href: '/defects/crawlspace-fungus-joist-rot-inspection' },
      { label: 'Crawlspace Moisture Blog Study', href: '/blog/crawlspace-moisture-silent-threat-georgia-foundations' },
    ],
    serviceLinks: [
      { label: 'Buyer Home Inspection (From $345)', href: '/services/buyer-inspection' },
      { label: 'Mold & Air Quality (Call for Quote)', href: '/services/mold-testing' },
    ],
  },
  {
    id: 'brick-cracks-sloping',
    symptom: 'Stair-step brick cracks or sloping floors',
    badge: 'Foundation & Envelope Movement',
    stages: [
      '2. I Noticed a Red Flag',
      '3. Comparing Georgia Inspectors',
      '4. Negotiating Seller Credits',
    ],
    buildingScience:
      'Shrink-swell Piedmont clay expands sharply when saturated by unextended downspouts and contracts during summer droughts, producing differential footing settlement and stair-step mortar fractures. On 1980s–1990s synthetic stucco (EIFS) exteriors, failed kick-out flashings also trap bulk water behind sheathing (>19% WME), rotting load-bearing rim joists out of sight.',
    twoInspectorProtocol:
      'Inspector 01 evaluates exterior drainage slope, retaining walls, footing settlement patterns, and stucco/brick wall clearances. Simultaneously, Inspector 02 measures interior floor deflection, tests door/window racking, and conducts non-invasive infrared thermal imaging across exterior wall cavities for evaporative moisture cooling.',
    leverageRange: '$4,200 – $14,200+',
    leverageDetail:
      'Helical pier underpinning, rim-joist sistering, or targeted EIFS flashing remediation routinely supports $4,200–$14,200+ in typical Metro Atlanta contractor repair or Georgia Repair Amendment credits—backed by a From $345 home inspection (From $295 condos).',
    defectLinks: [
      { label: 'Stucco & EIFS Moisture Evaluation', href: '/defects/stucco-eifs-moisture-inspection' },
      { label: 'Georgia Red Clay Foundation Study', href: '/blog/atlanta-red-clay-soil-foundation-settlement' },
    ],
    serviceLinks: [
      { label: 'Buyer Home Inspection (From $345)', href: '/services/buyer-inspection' },
      { label: 'Pre-Listing Inspection (From $345)', href: '/services/pre-listing-inspection' },
    ],
  },
  {
    id: 'ceiling-patch-roof',
    symptom: 'Fresh ceiling paint patch or roof age',
    badge: 'Active Water Intrusion & HVAC',
    stages: [
      '2. I Noticed a Red Flag',
      '3. Comparing Georgia Inspectors',
      '4. Negotiating Seller Credits',
    ],
    buildingScience:
      'Over 80% of residential roof leaks begin at deteriorated neoprene plumbing boots, chimney counter-flashings, and valley transitions—not missing shingles—while attic HVAC condensate overflow or aging 12+ year gas furnace heat exchangers often trigger localized ceiling stains beneath mechanical platforms.',
    twoInspectorProtocol:
      'Inspector 01 walks accessible roof planes and flies a 4K aerial inspection drone over steep pitches, valleys, and chimney shoulders while checking attic sheathing directly beneath stain zones. Inspector 02 scans ceiling drywall with calibrated infrared thermal cameras, checks HVAC delta-T splits, and evaluates furnace combustion safety.',
    leverageRange: '$1,250 – $9,800+',
    leverageDetail:
      'Flashing retrofits, decking repairs, HVAC condensate/coil replacements, or full shingle replacement generate $1,250–$9,800+ in documented Georgia Repair Amendment leverage—with calibrated thermal and 4K drone scans included free on every From $345 inspection.',
    defectLinks: [
      { label: 'Roof Flashing & Chimney Leak Guide', href: '/defects/unsealed-roof-flashing-water-leak-inspection' },
      { label: 'HVAC Heat Exchanger Safety Guide', href: '/defects/heat-exchanger-hvac-inspection' },
    ],
    serviceLinks: [
      { label: 'Buyer Home Inspection (From $345)', href: '/services/buyer-inspection' },
      { label: '11-Month Warranty (From $345)', href: '/services/11-month-warranty-inspection' },
    ],
  },
  {
    id: 'old-panel-grey-pipes',
    symptom: '1970s-1990s electrical panel or grey plumbing pipes',
    badge: 'Insurance & Fire / Flood Risk',
    stages: [
      '2. I Noticed a Red Flag',
      '3. Comparing Georgia Inspectors',
      '4. Negotiating Seller Credits',
    ],
    buildingScience:
      'Federal Pacific Electric (FPE) Stab-Lok and Zinsco panels fail to trip under dead-short overloads 25%–60% of the time (IEEE/NJIT), while 1965–1973 single-strand aluminum wiring carries a 55x higher outlet fire risk (CPSC #516). Meanwhile, 1978–1995 grey Quest (PB2110) polybutylene supply lines oxidize from municipal chlorine and rupture inside walls, often disqualifying Georgia homeowners insurance.',
    twoInspectorProtocol:
      'Inspector 02 pulls dead-front panel covers to verify panel make, conductor material, double-tapped neutrals, and thermal breaker hotspots while logging every PB2110 supply line and crimp fitting. Inspector 01 evaluates main water pressure, crawlspace supply runs, and exterior grounding rods. Pair with Sewer Scope HD camera screening (Call (678) 480-2110 for Quote).',
    leverageRange: '$1,800 – $12,000+',
    leverageDetail:
      '200-Amp service panel replacement ($1,800–$3,800), AlumiConn pigtailing, or full PEX-a repiping ($4,500–$12,000+) creates decisive closing credit leverage against a From $345 inspection (+$75 for 50+ yr vintage homes; -$25 strictly for Verified Licensed Georgia Realtors).',
    defectLinks: [
      { label: 'FPE & Zinsco Panel Hazard Guide', href: '/defects/federal-pacific-zinsco-panel-inspection' },
      { label: 'Polybutylene (Quest) Pipe Guide', href: '/defects/polybutylene-pipe-plumbing-defect-inspection' },
      { label: 'Aluminum Branch Wiring Guide', href: '/defects/aluminum-wiring-inspection' },
    ],
    serviceLinks: [
      { label: 'Sewer Scope Camera (Call for Quote)', href: '/services/sewer-scope-inspection' },
      { label: 'Buyer Home Inspection (From $345)', href: '/services/buyer-inspection' },
    ],
  },
  {
    id: 'new-build-code-myth',
    symptom: 'Brand-new builder house — county passed code',
    badge: 'New Construction Oversight',
    stages: [
      '1. New Build / Hidden Risk Check',
      '3. Comparing Georgia Inspectors',
    ],
    buildingScience:
      'Municipal code inspectors spend brief minutes checking minimum life-safety code items across dozens of stops a day—they do not check builder craftsmanship, over-bored floor joists before drywall, missing hurricane ties, unsealed roof penetrations, missing attic insulation baffles, or crushed underground PVC sewer laterals.',
    twoInspectorProtocol:
      'Led by an InterNACHI Certified New Construction Inspector and Certified 11th Month Warranty Inspector, Foresight deploys two certified inspectors for Phase 1 Pre-Drywall (From $275), Final New Construction (From $400), and Month-11 Builder Warranty (From $345) evaluations—including free infrared thermal insulation scans and 4K roof drone imagery.',
    leverageRange: '$1,500 – $8,500+',
    leverageDetail:
      'Catching framing defects before drywall (From $275) or documenting HVAC, roof flashing, and grading punch lists before closing (From $400) saves $1,500–$8,500+ in post-closing out-of-pocket repairs, with $200 Repair Re-Inspections available to verify builder corrections.',
    defectLinks: [
      { label: 'Why New Construction Needs Inspections', href: '/blog/why-new-construction-needs-inspections' },
      { label: 'Pre-Drywall Framing Checklist', href: '/blog/pre-drywall-framing-inspection-georgia-new-construction' },
    ],
    serviceLinks: [
      { label: 'Pre-Drywall Inspection (From $275)', href: '/services/pre-drywall-inspection' },
      { label: 'Final New Construction (From $400)', href: '/services/new-construction-inspection' },
      { label: '11-Month Warranty (From $345)', href: '/services/11-month-warranty-inspection' },
    ],
  },
  {
    id: 'short-due-diligence',
    symptom: 'Short 3-7 day Georgia due diligence window',
    badge: 'Speed + Master-Level Leverage',
    stages: [
      '1. New Build / Hidden Risk Check',
      '3. Comparing Georgia Inspectors',
      '4. Negotiating Seller Credits',
    ],
    buildingScience:
      'Georgia does not license home inspectors, and waiting 48–72 hours for a fatigued solo inspector to send a generic PDF leaves zero time to review defects, request specialist bids, or submit a Georgia Repair Amendment before earnest money locks in.',
    twoInspectorProtocol:
      'Foresight dispatches two certified inspectors simultaneously under CMI Christopher Boykin’s protocol—providing 2x diagnostic depth, dedicated structural + mechanical focus, active SUPRA eKEY access, free thermal & 4K drone scans, same-day interactive digital reporting with Digital Repair Request Builder, and $35,000 combined protection ($10,000 Elite Warranty $0 deductible + $25,000 InterNACHI Honor Guarantee).',
    leverageRange: '$1,250 – $14,200+',
    leverageDetail:
      'Same-day digital reporting preserves full due diligence negotiation runway for $1,250–$14,200+ in seller closing credits (Single-Family From $345; Condos/Townhomes From $295 [<=1,000 sq ft = $295, >1,000 sq ft = $325]). Auxiliary testing (Radon, Termite/WDO, Sewer Scope, Pool & Spa, Repair Cost Estimates): Call (678) 480-2110 for Quote.',
    defectLinks: [
      { label: 'Georgia Repair Negotiation Guide', href: '/blog/how-to-negotiate-home-inspection-repairs-georgia-gar-contract' },
      { label: '3-Day Due Diligence Dual-Team Study', href: '/blog/atlanta-housing-market-due-diligence-contract-trends' },
    ],
    serviceLinks: [
      { label: 'Buyer Home Inspection (From $345)', href: '/services/buyer-inspection' },
      { label: 'Radon Testing (Call for Quote)', href: '/services/radon-testing' },
      { label: 'Termite & WDO (Call for Quote)', href: '/services/termite-inspection' },
    ],
  },
];

export default function SymptomTranslatorClient() {
  const [selectedSymptom, setSelectedSymptom] = useState('All Symptoms');
  const [selectedStage, setSelectedStage] = useState('All Stages');

  const filteredCards = SYMPTOM_CARDS.filter((card) => {
    const matchesSymptom =
      selectedSymptom === 'All Symptoms' || card.symptom === selectedSymptom;
    const matchesStage =
      selectedStage === 'All Stages' || card.stages.includes(selectedStage);
    return matchesSymptom && matchesStage;
  });

  const resetFilters = () => {
    setSelectedSymptom('All Symptoms');
    setSelectedStage('All Stages');
  };

  return (
    <div>
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-red)',
              marginBottom: '0.75rem',
            }}
          >
            Step 1: What You See, Smell, or Worry About at 3:00 AM
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {SYMPTOMS.map((symptom) => {
              const isActive = selectedSymptom === symptom;
              return (
                <button
                  key={symptom}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedSymptom(symptom)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '9999px',
                    border: isActive ? '2px solid var(--color-red)' : '1px solid #CBD5E1',
                    background: isActive ? 'var(--color-red)' : '#F8FAFC',
                    color: isActive ? '#FFFFFF' : '#0F172A',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {symptom}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#92400E',
              marginBottom: '0.75rem',
            }}
          >
            Step 2: Filter by Your Current Homebuying Stage
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {AWARENESS_STAGES.map((stage) => {
              const isActive = selectedStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedStage(stage)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '9999px',
                    border: isActive ? '2px solid #0F172A' : '1px solid #CBD5E1',
                    background: isActive ? '#0F172A' : '#FFFBEB',
                    color: isActive ? '#FDE047' : '#0F172A',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
            Showing {filteredCards.length} of {SYMPTOM_CARDS.length} Diagnostic Translations
          </span>
          {(selectedSymptom !== 'All Symptoms' || selectedStage !== 'All Stages') && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-red)',
                color: 'var(--color-red)',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#0F172A', marginBottom: '0.75rem' }}>
            No single symptom combines both selected filters
          </h3>
          <p style={{ color: '#475569', marginBottom: '1.25rem' }}>
            Try selecting &ldquo;All Stages&rdquo; for your chosen symptom, or reset both filters to compare all 6 Metro Atlanta red flags.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setSelectedStage('All Stages')} className="btn btn-gold">
              Show Selected Symptom Across All Stages
            </button>
            <button type="button" onClick={resetFilters} className="btn btn-outline">
              Show All 6 Red Flags
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {filteredCards.map((item) => (
            <article
              key={item.id}
              data-symptom-card={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderTop: '5px solid var(--color-red)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'var(--color-red-light)',
                      color: 'var(--color-red-dark)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {item.badge}
                  </span>
                  <h3 style={{ fontSize: '1.45rem', color: '#0F172A', margin: 0, fontWeight: 800 }}>
                    {item.symptom}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.stages.map((st) => (
                    <span
                      key={st}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        background: '#F1F5F9',
                        color: '#334155',
                        border: '1px solid #CBD5E1',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                      }}
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                    (A) Technical Building Science Meaning
                  </div>
                  <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                    {item.buildingScience}
                  </p>
                </div>

                <div
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: '1px solid #334155',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                    (B) Foresight Two-Inspector CMI Diagnosis
                  </div>
                  <p style={{ fontSize: '0.94rem', color: '#E2E8F0', lineHeight: 1.6, margin: 0 }}>
                    {item.twoInspectorProtocol}
                  </p>
                </div>

                <div
                  style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    (C) Metro Atlanta Repair Credit Leverage
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-red)', marginBottom: '0.4rem' }}>
                    {item.leverageRange}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                    {item.leverageDetail}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                    Verified Guides &amp; Services:
                  </span>
                  {item.defectLinks.map((lnk) => (
                    <Link
                      key={lnk.href}
                      href={lnk.href}
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: 'var(--color-red)',
                        background: 'var(--color-red-light)',
                        padding: '0.35rem 0.7rem',
                        borderRadius: '6px',
                      }}
                    >
                      {lnk.label} &rarr;
                    </Link>
                  ))}
                  {item.serviceLinks.map((svc) => (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        padding: '0.35rem 0.7rem',
                        borderRadius: '6px',
                      }}
                    >
                      {svc.label} &rarr;
                    </Link>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <Link href="/repair-credit-calculator" className="btn btn-gold" style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}>
                    Repair Credit Calculator &rarr;
                  </Link>
                  <Link href="/quote" className="btn btn-outline" style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}>
                    Get Instant Quote
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
