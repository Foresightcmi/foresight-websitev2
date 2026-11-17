import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const PAGE_URL = `${SITE_URL}/about/christopher-boykin`;

export const metadata = {
  title: 'Christopher Boykin, CMI | Certified Master Inspector CV & Protocol',
  description:
    'Verified practitioner CV for Christopher Boykin (CMI #MICB-1082, InterNACHI #NACHI18051119, Member #176873). Discover Foresight Home Inspections dual-inspector protocol from $345 with $35,000 protection.',
  keywords: [
    'Christopher Boykin CMI',
    'MICB-1082',
    'NACHI18051119',
    'Certified Master Inspector Atlanta',
    'Foresight Home Inspections two inspector protocol',
    'unlicensed Georgia home inspector credential',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Christopher Boykin, CMI® | Practitioner CV & Dual-Team Protocol',
    description:
      'Explore all 6 credentials held by Lead Certified Master Inspector Christopher Boykin (CMI #MICB-1082) and how Foresight deploys two certified inspectors on every Metro Atlanta home.',
    url: PAGE_URL,
    type: 'profile',
    images: [
      {
        url: `${SITE_URL}/images/Christopher_Boykin.webp`,
        width: 1024,
        height: 614,
        alt: 'Christopher Boykin, Certified Master Inspector in Metro Atlanta',
      },
    ],
  },
};

const CREDENTIAL_TABLE = [
  {
    credential: 'Certified Master Inspector® (CMI)',
    idCode: 'CMI #MICB-1082',
    issuer: 'Master Inspector Certification Board',
    earned: 'September 2024 (Top 1%–3% Nationwide)',
    protectionImpact:
      'Requires 1,000+ fee-paid inspections or verified hours, peer-reviewed standing, background vetting, and unlocks the $10,000 Elite Master Inspection Warranty ($0 deductible) for every client.',
  },
  {
    credential: 'Certified Professional Inspector® (CPI)',
    idCode: 'InterNACHI #NACHI18051119 (Member #176873)',
    issuer: 'InterNACHI (International Association of Certified Home Inspectors)',
    earned: '2021 — Active Standing',
    protectionImpact:
      'Exceeds Georgia minimum marketplace practices (where zero state licensing exists) and backs clients with InterNACHI’s $25,000 Honor Guarantee.',
  },
  {
    credential: 'InterNACHI® Certified New Construction Inspector',
    idCode: 'Specialty Endorsement • Member #176873',
    issuer: 'InterNACHI Building Science Division',
    earned: '2024 — Active Standing',
    protectionImpact:
      'Qualifies phased framing, shear wall, truss, rough-in MEP, and final closing evaluations (Pre-Drywall From $275; Final New Construction From $400).',
  },
  {
    credential: 'InterNACHI® Certified Moisture Intrusion Inspector',
    idCode: 'Specialty Endorsement • Member #176873',
    issuer: 'InterNACHI Building Envelope Faculty',
    earned: '2024 — Active Standing',
    protectionImpact:
      'Guides non-invasive electronic moisture diagnostics and psychrometric crawlspace, stucco/EIFS, and basement evaluations in humid Georgia clay conditions.',
  },
  {
    credential: 'InterNACHI® Infrared Certified® Inspector',
    idCode: 'Specialty Endorsement • Member #176873',
    issuer: 'InterNACHI Infrared Thermography Program',
    earned: '2022 — Active Standing',
    protectionImpact:
      'Powering complimentary calibrated infrared thermal imaging on every inspection to pinpoint concealed wall plumbing leaks, missing insulation, and electrical breaker hotspots.',
  },
  {
    credential: 'InterNACHI® Certified 11th Month Warranty Inspector',
    idCode: 'Specialty Endorsement • Member #176873',
    issuer: 'InterNACHI Warranty & Construction Faculty',
    earned: '2024 — Active Standing',
    protectionImpact:
      'Structures builder-ready punch lists during Month 10–11 (From $345) so homeowners recover covered structural, roof, and HVAC repairs before Day 365 expires.',
  },
];

const AUTHORED_DEFECT_GUIDES = [
  {
    title: 'Synthetic Stucco (EIFS) & Hard-Coat Moisture Evaluation',
    href: '/defects/stucco-eifs-moisture-inspection',
    metric: 'ASTM E2110 • Non-Invasive Thermal & WME >19% Detection',
  },
  {
    title: 'Federal Pacific (FPE) Stab-Lok & Zinsco Panel Hazard Guide',
    href: '/defects/federal-pacific-zinsco-panel-inspection',
    metric: 'IEEE / NJIT 25%–60% Failure-to-Trip Data • NEC 408',
  },
  {
    title: 'Georgia Crawlspace Moisture, Fungus & Joist Rot Science',
    href: '/defects/crawlspace-fungus-joist-rot-inspection',
    metric: '60%+ Vented Georgia Crawlspaces Exceed 19% Wood Decay',
  },
  {
    title: 'Polybutylene (Quest PB2110) Pipe Rupture & Insurance Risk',
    href: '/defects/polybutylene-pipe-plumbing-defect-inspection',
    metric: 'ASTM D3309 • 1978–1995 Chlorine Oxidation Failures',
  },
  {
    title: 'Aluminum Branch Circuit Wiring Fire Hazard Diagnostics',
    href: '/defects/aluminum-wiring-inspection',
    metric: 'CPSC #516 • 55x Higher Outlet Fire Risk vs Copper',
  },
  {
    title: 'HVAC Heat Exchanger Fatigue & Roof Flashing Leak Guides',
    href: '/defects/unsealed-roof-flashing-water-leak-inspection',
    metric: 'NRCA 80%+ Flashing Leak Origin • 4K Aerial Drone Protocol',
  },
];

const AUTHORED_BLOG_STUDIES = [
  {
    title: '2026 Metro Atlanta Residential Defect Index & Building Science Study',
    href: '/blog/metro-atlanta-residential-defect-index-building-science-study',
    tag: 'Primary Research',
  },
  {
    title: 'How Georgia’s Piedmont Red Clay Soil Drives Foundation Settlement',
    href: '/blog/atlanta-red-clay-soil-foundation-settlement',
    tag: 'Structural Engineering',
  },
  {
    title: 'Crawlspace Moisture: The Silent Threat to Georgia Foundations',
    href: '/blog/crawlspace-moisture-silent-threat-georgia-foundations',
    tag: 'Moisture Science',
  },
  {
    title: 'Pre-Drywall Framing Inspection in Georgia: What Builders Overlook',
    href: '/blog/pre-drywall-framing-inspection-georgia-new-construction',
    tag: 'New Construction',
  },
  {
    title: 'How to Negotiate Home Inspection Repairs Under Georgia Contracts',
    href: '/blog/how-to-negotiate-home-inspection-repairs-georgia-gar-contract',
    tag: 'Due Diligence',
  },
  {
    title: 'Why 3-Day Georgia Due Diligence Windows Require a Two-Inspector Team',
    href: '/blog/atlanta-housing-market-due-diligence-contract-trends',
    tag: 'Dual-Team Speed',
  },
];

const FAQS = [
  {
    q: 'Why does hiring a Certified Master Inspector (CMI) matter in Georgia?',
    a: 'Georgia does not require a state license to perform residential home inspections. Anyone can legally advertise as a home inspector without passing a licensing exam. Christopher Boykin holds CMI #MICB-1082 from the Master Inspector Certification Board, verifying 1,000+ completed inspections, clean background vetting, continuing education, and strict adherence to InterNACHI practice guidelines.',
  },
  {
    q: 'What does "BY Christopher Boykin" Dual-Team Protocol mean on inspection day?',
    a: 'Instead of sending one fatigued solo inspector to spend 4+ hours alone, Foresight dispatches two certified inspectors on every property following Christopher Boykin’s dual-team protocol: one specialist covers the roof, 4K drone envelope, grading, foundation, and crawlspace while the second simultaneously evaluates electrical panels, HVAC delta-T, plumbing, thermal imaging, and interiors—delivering 2x diagnostic depth and property-scaled thoroughness.',
  },
  {
    q: 'How can I verify Christopher Boykin’s official credentials and numbers?',
    a: 'You can verify CMI #MICB-1082 directly through the Master Inspector Certification Board directory (certifiedmasterinspector.org) and InterNACHI CPI #NACHI18051119 / Member #176873 on InterNACHI’s official certified inspector registry (nachi.org/certified-inspectors/christopher-boykin-cmi-176873).',
  },
  {
    q: 'What does a two-inspector CMI evaluation cost, and what protection is included?',
    a: 'Primary residential inspections start From $345 for single-family homes (Buyer, Pre-Listing, and 11-Month Builder Warranty), From $295 for condos and townhomes (<= 1,000 sq ft = $295, > 1,000 sq ft = $325), From $275 for Phase 1 Pre-Drywall, and From $400 for Final New Construction ($200 Repair Re-Inspection). Every primary inspection includes calibrated infrared thermal scans, 4K aerial drone roof imagery, same-day interactive digital reporting, and $35,000 in combined protection ($10,000 Elite Master Warranty with $0 deductible + $25,000 InterNACHI Honor Guarantee).',
  },
  {
    q: 'How do complexity adjustments, Realtor courtesy discounts, and auxiliary services work?',
    a: 'Homes with an unfinished crawlspace, unfinished basement, or 50+ year vintage carry a +$75 complexity adjustment each. Verified Licensed Georgia Realtors (active GREC License # required) receive a -$25 courtesy discount. Auxiliary and commercial evaluations—including Sewer Scope, Radon, Pool & Spa, Termite/WDO, Mold & Air Quality, STR Compliance, DeKalb Low-Flow Certificate, Commercial PCA, and Repair Cost Estimates—are custom-quoted by calling (678) 480-2110.',
  },
];

export default function ChristopherBoykinCvPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Christopher Boykin, CMI | Certified Master Inspector CV & Dual-Team Protocol',
        description:
          'Verified practitioner biography, 6-credential CV, and Dual-Inspector CMI protocol for Christopher Boykin (#MICB-1082, #NACHI18051119, Member #176873) at Foresight Home Inspections in Metro Atlanta, GA.',
        dateCreated: '2026-11-16T08:00:00-05:00',
        dateModified: '2026-11-16T08:00:00-05:00',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/about#christopher-boykin` },
        about: { '@id': `${SITE_URL}/about#christopher-boykin` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#aeo-direct-answer', 'h1'],
        },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/about#christopher-boykin`,
        name: 'Christopher Boykin',
        jobTitle: 'Lead Certified Master Inspector',
        honorificSuffix: 'CMI',
        description:
          'Founder and Lead Certified Master Inspector (CMI #MICB-1082, InterNACHI #NACHI18051119, Member #176873) of Foresight Home Inspections, LLC across 87 Metro Atlanta cities.',
        url: PAGE_URL,
        image: `${SITE_URL}/images/Christopher_Boykin.webp`,
        telephone: '+1-678-480-2110',
        email: 'inspect@foresightcmi.com',
        identifier: ['CMI #MICB-1082', 'InterNACHI #NACHI18051119', 'InterNACHI Member #176873'],
        worksFor: {
          '@type': 'HomeAndConstructionBusiness',
          '@id': `${SITE_URL}/#business`,
          name: 'Foresight Home Inspections, LLC',
          url: SITE_URL,
          telephone: '+1-678-480-2110',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1816 South Deshon Road',
            addressLocality: 'Lithonia',
            addressRegion: 'GA',
            postalCode: '30058',
            addressCountry: 'US',
          },
        },
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Professional Certification',
            name: 'Certified Master Inspector (CMI)',
            identifier: 'MICB-1082',
            dateCreated: '2024-09',
            recognizedBy: {
              '@type': 'Organization',
              name: 'Master Inspector Certification Board',
              url: 'https://certifiedmasterinspector.org/',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Professional Certification',
            name: 'Certified Professional Inspector (CPI)',
            identifier: 'NACHI18051119',
            recognizedBy: {
              '@type': 'Organization',
              name: 'InterNACHI',
              url: 'https://www.nachi.org',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Specialty Certification',
            name: 'InterNACHI Certified New Construction Inspector',
            identifier: 'Member #176873',
            recognizedBy: {
              '@type': 'Organization',
              name: 'InterNACHI',
              url: 'https://www.nachi.org',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Specialty Certification',
            name: 'InterNACHI Certified Moisture Intrusion Inspector',
            identifier: 'Member #176873',
            recognizedBy: {
              '@type': 'Organization',
              name: 'InterNACHI',
              url: 'https://www.nachi.org',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Specialty Certification',
            name: 'InterNACHI Infrared Certified Inspector',
            identifier: 'Member #176873',
            recognizedBy: {
              '@type': 'Organization',
              name: 'InterNACHI',
              url: 'https://www.nachi.org',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Specialty Certification',
            name: 'InterNACHI Certified 11th Month Warranty Inspector',
            identifier: 'Member #176873',
            recognizedBy: {
              '@type': 'Organization',
              name: 'InterNACHI',
              url: 'https://www.nachi.org',
            },
          },
        ],
        knowsAbout: [
          'Residential Structural Home Inspections',
          'Dual-Inspector Parallel Inspection Protocol',
          'Calibrated Infrared Thermal Diagnostics',
          '4K Aerial Drone Roof Evaluations',
          'Georgia Piedmont Red-Clay Foundation Settlement',
          'Crawlspace Moisture Intrusion & Fungal Decay Science',
          'New Construction Pre-Drywall & Month-11 Builder Warranty',
          'Georgia Repair Amendment Negotiation Evidence',
        ],
        sameAs: [
          'https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873',
          'https://certifiedmasterinspector.org/',
          'https://www.facebook.com/fhinspectionsatl/',
          'https://www.instagram.com/fhinspectionsatl/',
          'https://www.tiktok.com/@fhinspectionsatl',
          'https://www.linkedin.com/company/foresight-home-inspections-llc/',
          `${SITE_URL}/about`,
          `${SITE_URL}/videos/complete-home-systems-diagnostic`,
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Script
        id="christopher-boykin-cv-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="bg-dark text-white"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '4.5rem 0 4rem',
          borderBottom: '3px solid var(--color-gold)',
        }}
      >
        <div className="container" style={{ maxWidth: '1050px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '2.25rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                padding: '0.55rem 1.25rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
              }}
            >
              <Image
                src="/images/Logopng.png"
                alt="Foresight Home Inspections official logo"
                width={150}
                height={68}
                priority
                style={{ height: '58px', width: 'auto', objectFit: 'contain', filter: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <Image
                src="/images/cmi_logo.png"
                alt="Certified Master Inspector MICB-1082 seal"
                width={120}
                height={110}
                priority
                style={{ height: '110px', width: 'auto', objectFit: 'contain' }}
              />
              <Image
                src="/images/cpi_logo.png"
                alt="InterNACHI Certified Professional Inspector NACHI18051119 seal"
                width={110}
                height={100}
                priority
                style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--color-gold)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                marginBottom: '1rem',
              }}
            >
              CMI #MICB-1082 &bull; InterNACHI #NACHI18051119 &bull; Member #176873
            </span>

            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2.1rem, 4.4vw, 3.25rem)', marginBottom: '1rem' }}>
              Christopher Boykin, <span style={{ color: 'var(--color-gold)' }}>CMI®</span>
            </h1>

            <p style={{ color: '#E2E8F0', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Founder &amp; Lead Certified Master Inspector at Foresight Home Inspections &mdash; 4.8★ across 53 Verified Google Reviews, deploying two certified inspectors on every Metro Atlanta home with active SUPRA eKEY access and $35,000 in combined protection.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ padding: '0.9rem 1.85rem' }}
              >
                Schedule With Foresight &rarr;
              </a>
              <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.9rem 1.85rem' }}>
                Instant Quote (From $345)
              </Link>
              <Link
                href="/"
                className="btn btn-outline-light"
                style={{ padding: '0.9rem 1.5rem', borderColor: 'rgba(212, 175, 55, 0.45)', color: '#FDE047' }}
              >
                &larr; Atlanta Home Inspections Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white" style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #E2E8F0',
                  background: '#0F172A',
                }}
              >
                <Image
                  src="/images/Christopher_Boykin.webp"
                  alt="Christopher Boykin, Lead Certified Master Inspector in Foresight Home Inspections uniform"
                  width={1024}
                  height={614}
                  sizes="(max-width: 768px) 100vw, 520px"
                  priority
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1024 / 614',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Image
                  src="/images/cmi_logo.png"
                  alt="Certified Master Inspector designation logo"
                  width={120}
                  height={110}
                  style={{ height: '110px', width: 'auto', objectFit: 'contain' }}
                />
                <Image
                  src="/images/cpi_logo.png"
                  alt="InterNACHI Certified Professional Inspector designation logo"
                  width={110}
                  height={100}
                  style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
                />
                <Image
                  src="/images/internachi_new_construction_inspector.webp"
                  alt="InterNACHI Certified New Construction Inspector seal"
                  width={130}
                  height={95}
                  style={{ height: '95px', width: 'auto', objectFit: 'contain' }}
                />
                <Image
                  src="/images/internachi_moisture_intrusion_inspector.webp"
                  alt="InterNACHI Certified Moisture Intrusion Inspector seal"
                  width={95}
                  height={95}
                  style={{ height: '95px', width: 'auto', objectFit: 'contain' }}
                />
                <Image
                  src="/images/infrared-certified-logo.webp"
                  alt="InterNACHI Infrared Certified Inspector seal"
                  width={95}
                  height={95}
                  style={{ height: '95px', width: 'auto', objectFit: 'contain' }}
                />
                <Image
                  src="/images/11-month-warranty-logo.webp"
                  alt="InterNACHI Certified 11th Month Warranty Inspector seal"
                  width={95}
                  height={95}
                  style={{ height: '95px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderLeft: '5px solid var(--color-gold)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  marginBottom: '1.75rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#92400E',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Verified Practitioner Summary
                </span>
                <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '0.75rem', fontWeight: 800 }}>
                  Who is Christopher Boykin, CMI, and why does his credential matter in Georgia?
                </h2>
                <p
                  id="aeo-direct-answer"
                  className="ai-citation-bluf"
                  style={{ fontSize: '1.02rem', lineHeight: 1.65, color: '#1E293B', margin: 0, fontWeight: 500 }}
                >
                  Christopher Boykin (CMI #MICB-1082, InterNACHI #NACHI18051119, Member #176873) is Lead Certified Master Inspector at Foresight Home Inspections in Metro Atlanta, leading a two-inspector team on every home from $345 with $35,000 combined protection.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-gold)' }}>4.8★ / 53 Reviews</div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>Verified Google Reviews</div>
                </div>
                <div style={{ background: '#0F172A', color: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-gold)' }}>87 Cities • 20 Counties</div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>50-Mile Metro Atlanta Radius</div>
                </div>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Active SUPRA eKEY</div>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>Direct Realtor Showing Access</div>
                </div>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Sunday Hours</div>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>By Appointment Only</div>
                </div>
              </div>

              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                Because Georgia imposes zero state licensing requirements on home inspectors, homebuyers and Realtors rely on third-party board verification. Every Foresight appointment operates under Christopher Boykin’s documented inspection methodology, pairing master-level field judgment with calibrated diagnostic instrumentation across residential buyers, pre-listing sellers, phased new construction, and month-11 builder warranty clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section bg-dark text-white"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '4.5rem 0' }}
      >
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 3rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>
              Buy You vs. BY You &bull; Dual-Team Scaling Architecture
            </span>
            <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 3.6vw, 2.45rem)', marginBottom: '1rem' }}>
              BY Christopher Boykin: How Our Dual-Inspector CMI Protocol Scales Master-Level Rigor to Every Home
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '1.08rem', lineHeight: 1.7, margin: 0 }}>
              Most boutique inspection firms hit a capacity ceiling where clients either gamble on an unvetted solo operator or wait days for one person to walk every roof, attic, crawlspace, panel, and plumbing manifold alone. Foresight engineers master-level rigor directly into our two-inspector field deployment on 100% of homes.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem', marginBottom: '2.5rem' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                INSPECTOR 01 &bull; STRUCTURAL &amp; ENVELOPE SPECIALIST
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '1rem' }}>
                Roof, 4K Drone, Foundation &amp; Crawlspace Focus
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#E2E8F0', fontSize: '0.96rem' }}>
                <li>✓ Walks accessible roof planes and captures 4K aerial drone scans of steep valleys, chimneys, and kick-out flashings</li>
                <li>✓ Evaluates Georgia Piedmont red-clay drainage grading, siding/EIFS clearances, and masonry settlement patterns</li>
                <li>✓ Traverses crawlspaces and basements with electronic moisture meters checking joists, sill plates, and vapor barriers</li>
                <li>✓ Checks attic framing, trusses, ventilation baffles, and insulation depth</li>
              </ul>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                INSPECTOR 02 &bull; MECHANICAL, ELECTRICAL &amp; THERMAL SPECIALIST
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '1rem' }}>
                Panels, HVAC Delta-T, Plumbing &amp; Infrared Sweeps
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#E2E8F0', fontSize: '0.96rem' }}>
                <li>✓ Evaluates main 200A panels for FPE Stab-Lok, Zinsco, aluminum wiring, double taps, and breaker thermal hotspots</li>
                <li>✓ Conducts calibrated infrared thermal imaging across wet walls, ceilings, and recessed lighting junctions</li>
                <li>✓ Tests HVAC supply-to-return delta-T differentials, gas furnace combustion safety, and condensate switches</li>
                <li>✓ Verifies supply piping (screening for grey Quest PB2110), water heaters, windows, and GFCI/AFCI protection</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>2x Diagnostic Depth</h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', margin: 0 }}>
                  Zero solo-inspector fatigue. Property-scaled thoroughness ensures large estates and historic homes get unhurried scrutiny without rushing showings.
                </p>
              </div>
              <div>
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>Same-Day Digital Report</h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', margin: 0 }}>
                  Delivered within 24 hours via our interactive digital report and Digital Repair Request Builder for fast Georgia Repair Amendment turnaround.
                </p>
              </div>
              <div>
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>$35,000 Protection</h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', margin: 0 }}>
                  Includes our $10,000 Elite Master Warranty ($0 deductible) plus InterNACHI’s $25,000 Honor Guarantee on every primary inspection.
                </p>
              </div>
              <div>
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>Included Tech Suite</h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', margin: 0 }}>
                  Calibrated infrared thermal camera sweeps, 4K aerial drone roof captures, moisture scanners, and combustible gas checks included free.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '0.5rem' }}>
                Field Video Walkthrough: Watch Christopher Boykin’s Dual-Team Protocol Live
              </h3>
              <p style={{ color: '#E2E8F0', fontSize: '0.96rem', margin: 0 }}>
                See our two-inspector team inspect HVAC delta-T splits, 200A electrical panels, infrared thermal scans, and structural crawlspace piers in Metro Atlanta.
              </p>
            </div>
            <Link
              href="/videos/complete-home-systems-diagnostic"
              className="btn btn-gold"
              style={{ padding: '0.95rem 1.75rem', whiteSpace: 'nowrap' }}
            >
              Watch Complete Systems Diagnostic Video &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white" style={{ padding: '4.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Verified Practitioner CV</span>
            <h2 style={{ fontSize: '2.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>
              Why Do All 6 Credentials Matter in Georgia’s Unlicensed Inspection Market?
            </h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '760px', margin: '0 auto', fontSize: '1.05rem' }}>
              Georgia requires zero state licensing for residential home inspectors. Below is the verified credential record Christopher Boykin maintains to protect buyers, sellers, and Realtor partners.
            </p>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.94rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  <th style={{ padding: '1rem' }}>Credential / Endorsement</th>
                  <th style={{ padding: '1rem' }}>Registry ID</th>
                  <th style={{ padding: '1rem' }}>Issuing Body &amp; Standing</th>
                  <th style={{ padding: '1rem' }}>Homebuyer Protection Impact</th>
                </tr>
              </thead>
              <tbody>
                {CREDENTIAL_TABLE.map((row, idx) => (
                  <tr
                    key={row.credential}
                    style={{
                      background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                      borderTop: '1px solid #E2E8F0',
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>{row.credential}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-red)', whiteSpace: 'nowrap' }}>{row.idCode}</td>
                    <td style={{ padding: '1rem', color: '#334155' }}>
                      <div style={{ fontWeight: 600 }}>{row.issuer}</div>
                      <div style={{ fontSize: '0.84rem', color: '#64748B' }}>{row.earned}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#334155', lineHeight: 1.55 }}>{row.protectionImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: '2.5rem',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderLeft: '5px solid var(--color-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
            }}
          >
            <h3 style={{ color: '#0F172A', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
              Transparent Pricing vs. $1,250–$14,200+ Georgia Repair Amendment Leverage
            </h3>
            <p style={{ color: '#334155', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              A single concealed crawlspace moisture issue, hazardous panel, or polybutylene supply line regularly drives $1,250–$14,200+ in Metro Atlanta contractor repair estimates and Georgia Repair Amendment closing credits. Compare that return against Foresight’s published rates: Single-Family Homes (Buyer, Pre-Listing, 11-Month Builder Warranty) From $345; Condos &amp; Townhomes From $295 (&lt;= 1,000 sq ft = $295, &gt; 1,000 sq ft = $325); Phase 1 Pre-Drywall From $275; Final New Construction From $400 ($200 Repair Re-Inspection); +$75 each for unfinished crawlspace, unfinished basement, or 50+ yr vintage; -$25 courtesy discount strictly for Verified Licensed Georgia Realtors (active GREC License # required). All auxiliary and commercial services (Sewer Scope, Radon, Pool &amp; Spa, Termite/WDO, Mold &amp; Air Quality, STR Compliance, DeKalb Low-Flow Certificate, Commercial PCA, and Repair Cost Estimates) are custom-quoted: Call (678) 480-2110 for Quote.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/repair-credit-calculator" className="btn btn-gold">
                Model Seller Repair Credit Leverage &rarr;
              </Link>
              <Link href="/quote" className="btn btn-outline">
                Calculate Exact Inspection Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Published Field Research</span>
            <h2 style={{ fontSize: '2.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>
              Technical Guides &amp; Defect Studies Authored by Christopher Boykin, CMI
            </h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem' }}>
              Explore building science defect guides and Metro Atlanta field studies written to help Georgia buyers and real estate agents protect contract equity.
            </p>
          </div>

          <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '1rem' }}>
            Diagnostic Defect Guides (/defects)
          </h3>
          <div className="grid grid-3" style={{ gap: '1.25rem', marginBottom: '2.75rem' }}>
            {AUTHORED_DEFECT_GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-red)', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem' }}>
                    {guide.metric}
                  </span>
                  <h4 style={{ fontSize: '1.08rem', color: '#0F172A', marginBottom: '0.75rem', lineHeight: 1.35 }}>
                    {guide.title}
                  </h4>
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-red)' }}>
                  Read Defect Diagnostic Guide &rarr;
                </span>
              </Link>
            ))}
          </div>

          <h3 style={{ fontSize: '1.3rem', color: '#0F172A', marginBottom: '1rem' }}>
            Metro Atlanta Building Science &amp; Contract Studies (/blog)
          </h3>
          <div className="grid grid-3" style={{ gap: '1.25rem', marginBottom: '3.5rem' }}>
            {AUTHORED_BLOG_STUDIES.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none' }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem' }}>
                    {post.tag}
                  </span>
                  <h4 style={{ fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.75rem', lineHeight: 1.35 }}>
                    {post.title}
                  </h4>
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                  Read Field Study &rarr;
                </span>
              </Link>
            ))}
          </div>

          <div style={{ maxWidth: '860px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '1.5rem', color: '#0F172A' }}>
              Frequently Asked Questions About Christopher Boykin, CMI
            </h2>
            {FAQS.map((faq) => (
              <details key={faq.q} className="faq-item" style={{ background: '#FFFFFF' }}>
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>

          <div
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem',
              textAlign: 'center',
            }}
          >
            <h2 style={{ color: '#FFFFFF', fontSize: '1.65rem', marginBottom: '0.75rem' }}>
              Continue Exploring Foresight Home Inspections
            </h2>
            <p style={{ color: '#CBD5E1', maxWidth: '680px', margin: '0 auto 1.5rem' }}>
              Translate homebuyer red flags before closing, explore post-closing home care, or return to our Metro Atlanta homepage hub.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-gold">
                &larr; Atlanta Home Inspections Home
              </Link>
              <Link href="/homebuyer-red-flags" className="btn btn-outline-light">
                3:00 AM Homebuyer Red-Flag Translator
              </Link>
              <Link href="/homeowner-care" className="btn btn-outline-light">
                Post-Closing Homeowner Care Hub
              </Link>
              <Link href="/about" className="btn btn-outline-light">
                About Foresight Overview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
