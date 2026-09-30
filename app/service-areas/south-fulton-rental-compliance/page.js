import Link from 'next/link';

const SITE_URL = 'https://www.fhinspectionsatl.com';

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata() {
  const title = 'City of South Fulton Rental Property Inspection | Landlord Compliance $250';
  const description =
    'Certified Master Inspector property maintenance & life-safety inspections for City of South Fulton residential landlords and property managers. Official compliance certificate.';

  return {
    title,
    description,
    keywords: [
      'City of South Fulton rental inspection',
      'South Fulton landlord compliance certificate',
      'South Fulton rental housing license inspection',
      'City of South Fulton code compliance inspector',
      'residential rental inspection South Fulton GA',
      'South Fulton landlord property maintenance inspection',
      'certified home inspector South Fulton rental',
      'City of South Fulton rental occupancy inspection',
      'South Fulton rental license affidavit',
      'Foresight Home Inspections South Fulton'
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/service-areas/south-fulton-rental-compliance`,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/service-areas/south-fulton-rental-compliance`,
    },
  };
}

// ---------------------------------------------------------------------------
// FAQ Data
// ---------------------------------------------------------------------------
const faqs = [
  {
    q: 'Does the City of South Fulton require an inspection for rental properties?',
    a: 'Yes. The City of South Fulton requires all owners of residential rental properties (single-family homes, townhouses, and multi-family units) to obtain a Rental Housing Business License. To obtain or renew this license, landlords must submit a certified property maintenance and life-safety inspection certificate confirming the property meets International Property Maintenance Code (IPMC) standards.',
  },
  {
    q: 'What is inspected during a South Fulton rental compliance evaluation?',
    a: 'Our certified inspection verifies essential life-safety and habitability systems: roof and exterior water-tightness, foundation and structural framing stability, water heater temperature-pressure relief (T&P) discharge piping, functional heating and air conditioning (minimum 68°F winter heating capacity), electrical panel safety and GFCI outlet protection, smoke and carbon monoxide detector operation, and sanitary plumbing supply and drainage.',
  },
  {
    q: 'How much does a South Fulton rental compliance inspection cost?',
    a: 'We offer a transparent flat fee of $250 per single-family home or townhouse. For landlords and property management companies with portfolios of 3 or more units, we provide volume portfolio pricing at $195 per unit. This includes our full inspection and the signed compliance certificate required by the city.',
  },
  {
    q: 'How fast do I receive the compliance certificate for the City of South Fulton?',
    a: 'We provide same-day or 24-hour digital delivery of your official Certified Master Inspector-stamped inspection report and signed compliance certificate. You can immediately upload this document to the City of South Fulton Community Development portal to finalize your rental license.',
  },
  {
    q: 'What happens if a rental unit fails an item on the checklist?',
    a: 'If our inspectors identify any deficient items (such as a missing smoke alarm, an unseated handrail, or an ungrounded outlet), we provide a clear, photographic deficiency report detailing the exact fix required. For minor punch-list corrections, we accept photo-re-verification or offer low-cost fast re-inspections so your tenant move-in is not delayed.',
  },
];

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------
export default function SouthFultonRentalCompliancePage() {

  // ── JSON-LD: LocalBusiness ──────────────────────────────────────────
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Foresight Home Inspections, LLC',
    description:
      'Certified property maintenance and life-safety inspections for residential landlords and property managers in the City of South Fulton, GA. Official compliance certificates issued.',
    telephone: '+1-678-480-2110',
    email: 'inspect@foresightcmi.com',
    url: SITE_URL,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'City of South Fulton, Georgia',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'South Fulton',
      addressRegion: 'GA',
      addressCountry: 'US',
    },
    priceRange: '$$$',
    image: `${SITE_URL}/images/Logopng.png`,
  };

  // ── JSON-LD: GovernmentService ──────────────────────────────────────
  const governmentServiceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    'name': 'City of South Fulton Rental Housing License Compliance Inspection',
    'serviceType': 'Rental Property Maintenance & Life-Safety Certification',
    'provider': {
      '@type': 'HomeAndConstructionBusiness',
      'name': 'Foresight Home Inspections, LLC',
      'telephone': '+1-678-480-2110',
      'url': SITE_URL
    },
    'areaServed': {
      '@type': 'City',
      'name': 'City of South Fulton, Georgia'
    }
  };

  // ── JSON-LD: FAQPage ────────────────────────────────────────────────
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const inspectionPillars = [
    {
      icon: '🏠',
      title: 'Structural & Exterior Envelope',
      desc: 'Roof shingles, flashings, gutters, foundation walls, exterior siding, and weather-tightness verification to ensure zero active water penetration.',
    },
    {
      icon: '🔥',
      title: 'HVAC Heating & Air Quality',
      desc: 'Operational testing of the primary heating system ensuring reliable winter capacity (min 68°F), filter cleanliness, and flue venting integrity.',
    },
    {
      icon: '⚡',
      title: 'Electrical Service & Shock Prevention',
      desc: 'Main distribution panel inspection, breaker sizing, dead-front cover security, and GFCI receptacle testing in kitchens, bathrooms, and outdoors.',
    },
    {
      icon: '🚰',
      title: 'Plumbing Supply & Water Heating',
      desc: 'Adequate static water pressure, leak-free drainage, operational shutoff valves, and water heater temperature-pressure relief (T&P) safety piping.',
    },
    {
      icon: '🚨',
      title: 'Smoke & Carbon Monoxide Detectors',
      desc: 'Testing of working smoke alarms on every level and in all sleeping quarters, plus UL-listed CO detectors outside bedrooms.',
    },
    {
      icon: '📜',
      title: 'Official CMI Compliance Certificate',
      desc: 'Official signed certification ready for instant submission to the City of South Fulton Community Development & Business Licensing portal.',
    },
  ];

  return (
    <>
      {/* ── JSON-LD Schemas ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          padding: '7rem 0 6rem',
          textAlign: 'center',
          color: 'var(--color-white)',
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.2) 0%, transparent 60%), linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="badge"
            style={{
              marginBottom: '1.5rem',
              background: 'rgba(212,175,55,0.15)',
              color: 'var(--color-gold)',
              border: '1px solid rgba(212,175,55,0.35)',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            City of South Fulton Landlord Licensing Compliance
          </span>
          <h1
            style={{
              color: 'var(--color-white)',
              marginBottom: '1.25rem',
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              lineHeight: 1.15,
              maxWidth: '900px',
              margin: '0 auto 1.25rem',
            }}
          >
            City of South Fulton Rental Property{' '}
            <span style={{ color: 'var(--color-gold)' }}>Compliance Inspection</span>
          </h1>
          <p
            style={{
              color: '#CBD5E1',
              maxWidth: '740px',
              margin: '0 auto 2.5rem',
              fontSize: '1.15rem',
              lineHeight: 1.7,
            }}
          >
            Mandatory property maintenance & life-safety compliance certificates for South Fulton landlords, single-family investors, and property management firms. $250 flat fee with 24-hr turnaround.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/quote"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}
            >
              📊 Instant Rental Quote ($250)
            </Link>
            <a
              href="tel:678-480-2110"
              className="btn btn-outline"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              📞 Call Direct: 678-480-2110
            </a>
          </div>
          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              fontSize: '0.9rem',
              color: '#CBD5E1',
            }}
          >
            <span>🛡️ Certified Master Inspector® (CMI)</span>
            <span>⚡ Fast Same-Day / 24-Hr Certificates</span>
            <span>💼 Volume Rates for 3+ Unit Portfolios ($195/unit)</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. THE ORDINANCE & LANDLORD REQUIREMENTS
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', background: 'var(--color-white)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--color-red)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Municipal Code Mandate
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  lineHeight: 1.25,
                  marginBottom: '1.25rem',
                  color: 'var(--color-slate-dark)',
                }}
              >
                Avoid Costly Citations & Secure Your South Fulton Rental License
              </h2>
              <p
                style={{
                  color: 'var(--color-gray)',
                  lineHeight: 1.75,
                  marginBottom: '1.25rem',
                  fontSize: '1.05rem',
                }}
              >
                To maintain safe, quality housing standards, the City of South Fulton enforces mandatory property maintenance inspections on all residential rental properties. Landlords cannot legally lease residential properties or renew their municipal business license without submitting a valid Certificate of Compliance signed by a certified inspector.
              </p>
              <p
                style={{
                  color: 'var(--color-gray)',
                  lineHeight: 1.75,
                  marginBottom: '1.75rem',
                  fontSize: '1.05rem',
                }}
              >
                Foresight Home Inspections delivers fast, reliable compliance evaluations tailored specifically to South Fulton’s checklist. Led by Certified Master Inspector Christopher Boykin, our team identifies any potential violations before they become municipal code enforcement citations, ensuring full regulatory compliance and seamless tenant move-ins.
              </p>

              <div
                style={{
                  background: 'var(--color-gray-light)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  borderLeft: '4px solid var(--color-gold)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--color-slate-dark)', marginBottom: '0.5rem' }}>
                  🔑 Landlord Notice: Fast Tenant Turnaround
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                  Don’t let vacant units sit idle waiting on municipal inspectors. Foresight provides priority scheduling within 24 to 48 hours and instant digital certificates, helping you place paying tenants faster.
                </div>
              </div>
            </div>

            {/* Checklist Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                borderRadius: '16px',
                padding: '2.5rem 2rem',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              <h3 style={{ color: 'var(--color-gold)', marginBottom: '1.25rem', fontSize: '1.35rem' }}>
                South Fulton Rental Inspection Standards:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Roof & Water Intrusion:</strong> Zero active leaks or exterior siding damage.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Heating & AC Performance:</strong> Verified heating to minimum 68°F standards.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Electrical Dead-Front & Outlets:</strong> GFCI protection and intact panel covers.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Plumbing & Water Heater:</strong> Drain flow check and T&P discharge pipe safety.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Smoke & Carbon Monoxide:</strong> Alarms tested on all levels and bedrooms.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Signed CMI Certificate:</strong> Delivered within 24 hours for city upload.</span>
                </li>
              </ul>
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                  $250 Flat Fee / Unit
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
                  Multi-unit portfolios (3+ properties): $195 / unit
                </div>
                <Link
                  href="/quote"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem 1.5rem', textAlign: 'center' }}
                >
                  Schedule Rental Inspection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. INSPECTION PILLARS
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', background: 'var(--color-gray-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <span
              style={{
                color: 'var(--color-gold)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Inspection Scope
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                color: 'var(--color-slate-dark)',
                marginBottom: '1rem',
              }}
            >
              Comprehensive 6-Point Habitability & Safety Audit
            </h2>
            <p style={{ color: 'var(--color-gray)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Our Certified Master Inspector dual-inspector teams thoroughly evaluate every system so your property passes municipal licensing on the first try.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {inspectionPillars.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: '12px',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    color: 'var(--color-slate-dark)',
                    marginBottom: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. FREQUENTLY ASKED QUESTIONS
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 0', background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                color: 'var(--color-gold)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Common Questions
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                color: 'var(--color-slate-dark)',
              }}
            >
              Frequently Asked Questions About South Fulton Rental Inspections
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="faq-item"
                style={{
                  background: 'var(--color-gray-light)',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
              >
                <summary
                  style={{
                    padding: '1.25rem 1.5rem',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'var(--color-slate-dark)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{faq.q}</span>
                </summary>
                <div
                  style={{
                    padding: '0 1.5rem 1.25rem',
                    color: 'var(--color-gray-dark)',
                    lineHeight: 1.7,
                    fontSize: '0.975rem',
                  }}
                >
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. BOTTOM CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', marginBottom: '1.25rem', color: '#ffffff' }}>
            Protect Your Rental Revenue in the City of South Fulton
          </h2>
          <p
            style={{
              color: '#CBD5E1',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Get your certified inspection completed fast and keep your rental licenses in 100% good standing. Call our team or book online for immediate scheduling.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/quote"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}
            >
              📊 Book Rental Inspection ($250)
            </Link>
            <a
              href="tel:678-480-2110"
              className="btn btn-outline"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                borderColor: 'var(--color-gold)',
                color: 'var(--color-gold)',
              }}
            >
              📞 678-480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
