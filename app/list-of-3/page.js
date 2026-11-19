import Link from 'next/link';
import Script from 'next/script';
import GooglePreferredSource from '../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const BOOKING_URL = 'https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule';

export const metadata = {
  title: { absolute: 'Compare Your 3 Home Inspectors in Atlanta | Foresight' },
  description: 'Compare your Realtor list of 3 Atlanta home inspectors in 60 seconds. Two-inspector CMI team, free thermal and 4K roof drone, $35,000 protection, from $345.',
  keywords: [
    'compare home inspectors Atlanta',
    'realtor list of 3 home inspectors',
    'best home inspector Atlanta GA',
    'two inspector team Atlanta',
    'Certified Master Inspector Atlanta',
    'Foresight Home Inspections comparison'
  ],
  alternates: {
    canonical: `${SITE_URL}/list-of-3`,
  },
  openGraph: {
    title: 'Compare Your 3 Home Inspectors in Atlanta | Foresight',
    description: 'Got 3 home inspector names from your Realtor? Compare credentials, two-inspector coverage, free thermal and 4K drone scans, $35,000 protection, and flat rates.',
    url: `${SITE_URL}/list-of-3`,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/Logopng.png`,
        width: 800,
        height: 600,
        alt: 'Foresight Home Inspections, LLC Logo',
      },
    ],
  },
};

const listOf3FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: `${SITE_URL}/list-of-3`,
  mainEntity: [
    {
      '@type': 'Question',
      name: '1. Do you deploy two certified inspectors simultaneously on every home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Foresight Home Inspections deploys 2 Certified Inspectors in parallel on every full residential evaluation with dedicated structural and mechanical focus and zero solo fatigue. Most solo inspectors or franchises send one inspector working alone for 3.5 to 5 hours.',
      },
    },
    {
      '@type': 'Question',
      name: '2. Are calibrated infrared thermal and 4K aerial roof drone scans included at $0 upcharge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Calibrated infrared thermal imaging and 4K aerial roof drone scans are included free ($0 upcharge) on every full inspection. Many competitors charge $75 to $175 extra or skip steep roofs altogether.',
      },
    },
    {
      '@type': 'Question',
      name: '3. Is the inspection led by a Board-Certified Master Inspector (CMI)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Foresight is led by Board-Certified Master Inspector Christopher Boykin (CMI #MICB-1082, InterNACHI #NACHI18051119) and holds 4.8 out of 5 across 53 verified reviews. Georgia does not license home inspectors at the state level, making verified CMI credentials essential.',
      },
    },
    {
      '@type': 'Question',
      name: '4. Will I receive a same-day interactive digital report inside a 5-to-10 day Georgia Due Diligence window?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Foresight delivers a same-day interactive digital report paired with our Digital Repair Request Builder to help protect $1,250 to $14,200+ in typical Georgia Repair Amendment seller credits, plus active SUPRA eKEY lockbox coordination.',
      },
    },
    {
      '@type': 'Question',
      name: '5. Is $35,000 in zero-deductible warranty and guarantee protection included?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Every standard full inspection includes $35,000 in combined zero-deductible protection: the $10,000 Elite Master Warranty ($0 deductible) plus the $25,000 InterNACHI Honor Guarantee.',
      },
    },
  ],
};

const listOf3ServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE_URL}/list-of-3#service`,
  name: 'Two-Inspector CMI Home Inspection (Metro Atlanta List-of-3 Benchmark)',
  serviceType: 'Residential Home Inspection',
  description: 'Two Certified Inspectors in parallel with dedicated structural and mechanical focus and zero solo fatigue, calibrated infrared thermal imaging, 4K aerial roof drone scans, same-day interactive digital report, and $35,000 combined zero-deductible protection.',
  image: `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`,
  provider: {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: 'Foresight Home Inspections, LLC',
    image: `${SITE_URL}/images/Logopng.png`,
    telephone: '+1-678-480-2110',
    email: 'inspect@foresightcmi.com',
    url: SITE_URL,
    priceRange: '$$$',
    hasMap: 'https://maps.google.com/?cid=10862078652033010531',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1816 South Deshon Road',
      addressLocality: 'Lithonia',
      addressRegion: 'GA',
      postalCode: '30058',
      addressCountry: 'US',
    },
  },
  areaServed: {
    '@type': 'State',
    name: 'Georgia',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '53',
    bestRating: '5',
    worstRating: '1',
  },
  offers: {
    '@type': 'Offer',
    price: '345.00',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '345.00',
      priceCurrency: 'USD',
      unitText: 'starting',
      description: 'Single-Family Homes from $345, Condos & Townhomes from $295, Phase 1 Pre-Drywall from $275, Final New Construction from $400, 11-Month Builder Warranty from $345, Repair Re-Inspection $200.',
    },
    priceValidUntil: '2027-12-31',
    validThrough: '2027-12-31',
    validFrom: '2026-01-01',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/list-of-3`,
  },
};

const SCORECARD_ROWS = [
  {
    criterion: 'Inspectors On-Site',
    foresight: '2 Certified Inspectors in parallel with dedicated structural + mechanical focus and zero solo fatigue',
    solo: '1 Solo Inspector (3.5 to 5 hrs alone; high late-hour fatigue risk)',
    franchise: '1 Assigned Tech (variable field tenure; corporate dispatch)',
  },
  {
    criterion: 'Lead Credential & Oversight',
    foresight: 'Board-Certified Master Inspector Christopher Boykin (CMI #MICB-1082 / InterNACHI #NACHI18051119)',
    solo: 'Unregulated GA baseline; verify CMI standing individually',
    franchise: 'Mixed employee roster; rare direct CMI oversight',
  },
  {
    criterion: 'Verified Review Profile',
    foresight: '4.8 out of 5 across 53 verified Google reviews',
    solo: 'Often inconsistent or low verified volume',
    franchise: 'Split across corporate call-center branches',
  },
  {
    criterion: 'Infrared Thermal & 4K Roof Drone',
    foresight: 'Calibrated infrared thermal + 4K aerial roof drone included ($0 upcharge)',
    solo: '+$75 to +$150 extra fee or omitted on steep roofs',
    franchise: '+$125 to +$175 extra tiered package upcharge',
  },
  {
    criterion: 'Zero-Deductible Protection',
    foresight: '$35,000 combined zero-deductible protection ($10,000 Elite Master Warranty + $25,000 InterNACHI Honor Guarantee)',
    solo: '$0 post-closing warranty (basic E&O defense only)',
    franchise: 'Limited 90-day coverage with $500 deductibles and sub-limits',
  },
  {
    criterion: 'Report Turnaround & Negotiation Tools',
    foresight: 'Same-day interactive digital report + Digital Repair Request Builder protecting $1,250-$14,200+ in typical Georgia Repair Amendment seller credits',
    solo: '24 to 48+ hrs static PDF inside 5-to-10 day Georgia Due Diligence window',
    franchise: '24 to 36 hrs generic template; no Georgia Repair Amendment builder',
  },
  {
    criterion: 'Lockbox & Access Coordination',
    foresight: 'Active SUPRA eKEY access for independent showing coordination',
    solo: 'Often lacks active SUPRA eKEY; agent must drive to unlock',
    franchise: 'Varies by assigned contractor credentials',
  },
  {
    criterion: 'Published Starting Rates',
    foresight: 'Single-Family Homes from $345 ($295 Condos); published online 24/7',
    solo: '$325-$450 base plus surprise add-on fees for thermal or drone',
    franchise: '$450-$650+ often gated behind out-of-state call centers',
  },
];
const FIVE_QUESTIONS = [
  {
    num: '01',
    question: 'Do you send two certified inspectors simultaneously?',
    why: 'A solo inspector working 3.5 to 5 hours alone in Georgia attics and crawlspaces faces late-hour fatigue. Parallel inspection pairs cover structure and mechanics simultaneously.',
    foresightAnswer: 'Yes. 2 Certified Inspectors in parallel with dedicated structural + mechanical focus and zero solo fatigue on every full home inspection.',
  },
  {
    num: '02',
    question: 'Are calibrated infrared thermal and 4K roof drone scans included free?',
    why: 'Concealed plumbing leaks behind tile, breaker hot spots, and steep-roof shingle damage stay invisible to flashlights and binoculars.',
    foresightAnswer: 'Yes. Calibrated infrared thermal imaging and 4K aerial roof drone scans are included at $0 upcharge on every full inspection.',
  },
  {
    num: '03',
    question: 'Is the evaluation led by a Board-Certified Master Inspector (CMI)?',
    why: 'Georgia has no state licensing requirement for general home inspectors. Anyone can legally print business cards without board verification.',
    foresightAnswer: 'Yes. Led by Board-Certified Master Inspector Christopher Boykin (CMI #MICB-1082 / InterNACHI #NACHI18051119), rated 4.8 out of 5 across 53 verified reviews.',
  },
  {
    num: '04',
    question: 'Will I get a same-day digital report inside my 5-to-10 day Georgia Due Diligence window?',
    why: 'Waiting 24 to 48 hours for a static PDF drains critical negotiation days needed for contractor quotes and repair amendments.',
    foresightAnswer: 'Yes. Same-day interactive digital report plus our Digital Repair Request Builder protecting $1,250-$14,200+ in typical Georgia Repair Amendment seller credits.',
  },
  {
    num: '05',
    question: 'Is $35,000 in zero-deductible warranty and guarantee protection included?',
    why: 'Standard E&O coverage only protects the inspector in a lawsuit. Real post-closing financial protection covers you with $0 deductible.',
    foresightAnswer: 'Yes. $35,000 combined zero-deductible protection ($10,000 Elite Master Warranty + $25,000 InterNACHI Honor Guarantee) included standard.',
  },
];

const CORE_RATES = [
  { label: 'Single-Family Homes', price: 'From $345' },
  { label: 'Condos & Townhomes', price: 'From $295' },
  { label: 'Pre-Listing Inspection', price: 'From $345' },
  { label: '11-Month Builder Warranty', price: 'From $345' },
  { label: 'Phase 1 Pre-Drywall', price: 'From $275' },
  { label: 'Final New Construction', price: 'From $400' },
  { label: 'Repair Re-Inspection', price: '$200' },
];

const COMPLEXITY_FEES = [
  { label: 'Unfinished Crawlspace', price: '+$75' },
  { label: 'Unfinished Basement', price: '+$75' },
  { label: '50+ yr Vintage Home', price: '+$75' },
];

const SPECIALTY_ADDONS = [
  'Sewer Scope Camera Inspection',
  '48-Hour Continuous Radon Gas Testing',
  'Termite / WDO Clearance Inspection',
  'Mold & Indoor Air Quality Testing',
  'Pool & Spa Inspection',
  'Short-Term Rental (STR) Compliance',
  'Unincorporated DeKalb County Low-Flow Plumbing Certificate',
];

export default function ListOf3Page() {
  return (
    <>
      <Script
        id="list-of-3-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listOf3FaqSchema) }}
      />
      <Script
        id="list-of-3-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listOf3ServiceSchema) }}
      />

      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1rem 0' }}>
        <div
          className="container"
          style={{
            maxWidth: '1080px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.fhinspectionsatl.com/images/Logopng.png"
              alt="Foresight Home Inspections, LLC"
              style={{ height: '64px', width: 'auto', objectFit: 'contain', filter: 'none', background: '#FFFFFF' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.fhinspectionsatl.com/images/cmi_logo.png"
              alt="Board-Certified Master Inspector CMI #MICB-1082"
              style={{ height: '92px', width: '92px', objectFit: 'contain' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.fhinspectionsatl.com/images/cpi_logo.png"
              alt="InterNACHI Certified Professional Inspector #NACHI18051119"
              style={{ height: '92px', width: '92px', objectFit: 'contain' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#0F172A', color: '#FFFFFF', padding: '0.6rem 1.1rem', borderRadius: '9999px', border: '1px solid #D4AF37', fontSize: '0.88rem', fontWeight: 700 }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', display: 'inline-block', flexShrink: 0 }} />
            <span>4.8 / 5 Across 53 Verified Reviews | Active SUPRA eKEY</span>
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4rem 0 3.75rem' }}>
        <div className="container" style={{ maxWidth: '1040px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.14)', border: '1px solid #D4AF37', color: '#D4AF37', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Metro Atlanta Buyer Scorecard (20 Counties / 87 Cities)
          </div>
          <h1 style={{ fontSize: 'clamp(1.95rem, 4.2vw, 3.15rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.16, marginBottom: '1.25rem' }}>
            Got 3 Home Inspector Names From Your Realtor?{' '}
            <span style={{ color: '#D4AF37' }}>Compare Them in 60 Seconds</span>
          </h1>
          <p id="list-of-3-bluf" style={{ fontSize: '1.12rem', color: '#E2E8F0', lineHeight: 1.72, maxWidth: '860px', margin: '0 auto 2rem' }}>
            <strong>Bottom Line Up Front:</strong> Georgia does not require a state home inspector license. Before choosing blindly from a 3-name sheet, verify who actually steps inside your home. <strong>Foresight Home Inspections, LLC</strong>—led by Board-Certified Master Inspector <strong>Christopher Boykin (CMI #MICB-1082 / InterNACHI #NACHI18051119)</strong>—deploys <strong>2 Certified Inspectors in parallel</strong> with calibrated infrared thermal imaging and 4K aerial roof drone scans included at <strong>$0 upcharge</strong>, <strong>$35,000 combined zero-deductible protection</strong>, and same-day digital reports starting at <strong>$345</strong> ($295 condos).
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.95rem 1.85rem', fontSize: '1.02rem' }}>
              Book Online 24/7 &rarr;
            </a>
            <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.95rem 1.65rem', fontSize: '1rem', borderColor: '#D4AF37', color: '#D4AF37' }}>
              Instant Quote ($295+)
            </Link>
            <a href="tel:6784802110" className="btn btn-outline-light" style={{ padding: '0.95rem 1.65rem', fontSize: '1rem', borderColor: '#10B981', color: '#FFFFFF' }}>
              Call (678) 480-2110
            </a>
            <Link href="/repair-credit-calculator" className="btn btn-outline-light" style={{ padding: '0.95rem 1.55rem', fontSize: '1rem' }}>
              Repair Credit Calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFFFFF', padding: '4rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <span className="badge" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '0.75rem' }}>
              Section 1: 60-Second Side-by-Side Buyer Scorecard
            </span>
            <h2 style={{ fontSize: 'clamp(1.65rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              Foresight Two-Inspector CMI Team vs. the Other 2 Names on Your List
            </h2>
            <p style={{ color: '#475569', fontSize: '1.04rem', maxWidth: '790px', margin: '0 auto' }}>
              Compare all three options side by side before your Georgia 5-to-10 day Due Diligence clock starts ticking.
            </p>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #CBD5E1', boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  <th style={{ padding: '1.1rem 1rem', width: '20%' }}>Decision Criterion</th>
                  <th style={{ padding: '1.1rem 1rem', width: '32%', background: '#1E293B', borderBottom: '3px solid #D4AF37', color: '#D4AF37' }}>
                    Foresight Two-Inspector CMI Team
                  </th>
                  <th style={{ padding: '1.1rem 1rem', width: '24%' }}>Solo Inspector on the List</th>
                  <th style={{ padding: '1.1rem 1rem', width: '24%' }}>Regional Multi-Inspector Franchise</th>
                </tr>
              </thead>
              <tbody>
                {SCORECARD_ROWS.map((row, idx) => (
                  <tr key={row.criterion} style={{ background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '1.05rem 1rem', fontWeight: 700, color: '#0F172A', verticalAlign: 'top' }}>{row.criterion}</td>
                    <td style={{ padding: '1.05rem 1rem', fontWeight: 700, color: '#065F46', background: 'rgba(16, 185, 129, 0.07)', borderLeft: '2px solid #10B981', borderRight: '1px solid #CBD5E1', verticalAlign: 'top' }}>
                      &#10003; {row.foresight}
                    </td>
                    <td style={{ padding: '1.05rem 1rem', color: '#475569', verticalAlign: 'top' }}>{row.solo}</td>
                    <td style={{ padding: '1.05rem 1rem', color: '#475569', verticalAlign: 'top' }}>{row.franchise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.16)', color: '#854D0E', border: '1px solid rgba(212, 175, 55, 0.45)', marginBottom: '0.75rem' }}>
              Section 2: 60-Second Vetting Script
            </span>
            <h2 style={{ fontSize: 'clamp(1.65rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              5 Questions to Ask the Other 2 Inspectors Before You Book
            </h2>
            <p style={{ color: '#475569', fontSize: '1.04rem', maxWidth: '760px', margin: '0 auto' }}>
              Text or ask these five questions before paying a deposit. Any vague answer reveals hidden fees or solo-inspector risk.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.35rem' }}>
            {FIVE_QUESTIONS.map((item) => (
              <div
                key={item.num}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderTop: '4px solid #0F172A',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.05rem', color: '#D4AF37', background: '#0F172A', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      Q{item.num}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065F46', background: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #A7F3D0' }}>
                      Buyer Check
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.6rem', lineHeight: 1.35 }}>
                    {item.question}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '0.95rem' }}>
                    {item.why}
                  </p>
                </div>
                <div style={{ background: '#F8FAFC', borderLeft: '3px solid #10B981', padding: '0.75rem 0.9rem', borderRadius: '6px', fontSize: '0.88rem', color: '#0F172A', lineHeight: 1.55 }}>
                  <strong style={{ color: '#065F46' }}>Foresight Standard:</strong> {item.foresightAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFFFFF', padding: '4rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', marginBottom: '0.75rem' }}>
              Section 3: Transparent Starting Rates
            </span>
            <h2 style={{ fontSize: 'clamp(1.65rem, 3vw, 2.25rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              Published Metro Atlanta Inspection Rates (Zero Hidden Thermal or Drone Upcharges)
            </h2>
            <p style={{ color: '#475569', fontSize: '1.04rem', maxWidth: '780px', margin: '0 auto' }}>
              Every full inspection includes 2 Certified Inspectors in parallel, calibrated infrared thermal imaging, 4K aerial roof drone photography, active SUPRA eKEY entry, and $35,000 combined zero-deductible protection.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div style={{ background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', padding: '1.75rem', border: '1px solid #D4AF37' }}>
              <h3 style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                Core Inspection Packages
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {CORE_RATES.map((item) => (
                  <li key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.55rem', fontSize: '0.96rem', color: '#F1F5F9' }}>
                    <span>{item.label}</span>
                    <strong style={{ color: '#D4AF37', whiteSpace: 'nowrap', marginLeft: '0.75rem' }}>{item.price}</strong>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.35)' }}>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Property Complexity Modifiers:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {COMPLEXITY_FEES.map((fee) => (
                    <span key={fee.label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.82rem', color: '#F8FAFC' }}>
                      {fee.label}: <strong style={{ color: '#D4AF37' }}>{fee.price}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.75rem', border: '1px solid #CBD5E1' }}>
              <h3 style={{ color: '#0F172A', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                Specialty Environmental &amp; Compliance Add-Ons
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {SPECIALTY_ADDONS.map((addon) => (
                  <li key={addon} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.55rem', fontSize: '0.94rem', color: '#1E293B' }}>
                    <span>{addon}</span>
                    <a href="tel:6784802110" style={{ color: '#065F46', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '0.85rem', textDecoration: 'underline' }}>
                      Call (678) 480-2110 for Quote
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', padding: '1.35rem 1.5rem', borderLeft: '5px solid #10B981' }}>
            <div>
              <strong style={{ color: '#D4AF37', display: 'block', marginBottom: '0.25rem', fontSize: '0.98rem' }}>
                Realtor Partner Courtesy Policy
              </strong>
              <p style={{ margin: 0, color: '#E2E8F0', fontSize: '0.9rem', lineHeight: 1.55 }}>
                A -$25 courtesy discount is available strictly for Verified Licensed Georgia Realtors (Active GREC License # required).
              </p>
            </div>
            <div>
              <strong style={{ color: '#10B981', display: 'block', marginBottom: '0.25rem', fontSize: '0.98rem' }}>
                Sunday &amp; Rush Dispatch Hours
              </strong>
              <p style={{ margin: 0, color: '#E2E8F0', fontSize: '0.9rem', lineHeight: 1.55 }}>
                Monday–Saturday regular service across 20 Metro Atlanta counties (87 municipalities). Sunday: By Appointment Only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.16)', color: '#854D0E', border: '1px solid rgba(212, 175, 55, 0.45)', marginBottom: '0.75rem' }}>
              Frequently Asked Questions
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.15rem)', fontWeight: 800, color: '#0F172A' }}>
              Key Answers When Comparing Your 3 Inspectors
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {listOf3FaqSchema.mainEntity.map((faq) => (
              <details
                key={faq.name}
                style={{
                  background: '#FFFFFF',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                }}
              >
                <summary style={{ fontWeight: 700, fontSize: '1.03rem', cursor: 'pointer', color: '#0F172A' }}>
                  {faq.name}
                </summary>
                <p style={{ marginTop: '0.75rem', marginBottom: 0, color: '#334155', fontSize: '0.96rem', lineHeight: 1.65 }}>
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>

          <GooglePreferredSource
            customTitle="Prefer Foresight in Your Google AI Search Results"
            customText="Make Foresight Home Inspections a preferred source on Google to keep our Metro Atlanta Certified Master Inspector scorecards, repair credit tools, and Georgia Due Diligence guides at the top of your search."
          />
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4.25rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.16)', color: '#10B981', border: '1px solid #10B981', marginBottom: '1rem' }}>
            1-Click Booking &amp; Instant Decision Tools
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Book Your Two-Inspector CMI Team?
          </h2>
          <p style={{ color: '#E2E8F0', fontSize: '1.08rem', lineHeight: 1.65, maxWidth: '760px', margin: '0 auto 2rem' }}>
            Lock in Christopher Boykin (CMI #MICB-1082 / InterNACHI #NACHI18051119) and our two-inspector team with active SUPRA eKEY access, free infrared thermal and 4K roof drone scans, and $35,000 combined zero-deductible protection.
          </p>
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.95rem 2rem', fontSize: '1.05rem' }}>
              Schedule Online 24/7 &rarr;
            </a>
            <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.95rem 1.75rem', fontSize: '1rem', borderColor: '#D4AF37', color: '#D4AF37' }}>
              Instant Quote Calculator
            </Link>
            <Link href="/repair-credit-calculator" className="btn btn-outline-light" style={{ padding: '0.95rem 1.75rem', fontSize: '1rem' }}>
              Repair Credit Calculator
            </Link>
            <a href="tel:6784802110" className="btn btn-outline-light" style={{ padding: '0.95rem 1.75rem', fontSize: '1rem', borderColor: '#10B981', color: '#FFFFFF' }}>
              Call (678) 480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
