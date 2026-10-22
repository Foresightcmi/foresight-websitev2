import Link from 'next/link';
import UnincorporatedAreas from './UnincorporatedAreas';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const SCHEDULE_URL = 'https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule';

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata() {
  const title = 'DeKalb County Low-Flow Compliance Inspection | Foresight Home Inspections';
  const description =
    'Selling or buying a pre-1993 home in unincorporated DeKalb County? We check plumbing fixtures and sign the county low-flow Certificate of Compliance for a $100 flat rate.';

  return {
    title,
    description,
    keywords: [
      'dekalb county low-flow',
      'dekalb compliance inspection',
      'dekalb plumbing certificate',
      'dekalb county low-flow compliance inspection',
      'dekalb county property transfer inspection',
      'dekalb county water conservation inspection',
      'low-flow plumbing certificate dekalb',
      'dekalb county real estate closing inspection',
      'dekalb county fixture compliance',
      'low-flow toilet inspection dekalb GA',
      'dekalb county home inspection compliance',
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/service-areas/dekalb-county-compliance`,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/service-areas/dekalb-county-compliance`,
    },
  };
}

// ---------------------------------------------------------------------------
// FAQ Data
// ---------------------------------------------------------------------------
const faqs = [
  {
    q: 'Who needs a DeKalb County low-flow compliance certificate?',
    a: 'Homes in unincorporated DeKalb County that were built before January 1, 1993 need a signed Certificate of Compliance when they are sold. DeKalb County Department of Watershed Management asks for it before water service can be set up in the new owner\'s name. It is tied to the sale of an older home, not to building permits, renovations, or new construction. If your property is inside a city, confirm with DeKalb Watershed Management whether it applies to your address.',
  },
  {
    q: 'How do I know if my address is in unincorporated DeKalb County?',
    a: 'Do not rely on the mailing address. A Decatur, Lithonia or Stone Mountain mailing address can be in unincorporated DeKalb. DeKalb County tells buyers to look the address up in its online property search: the Tax District field says "unincorporated" when the certificate applies, and shows a city name when it does not. If you are unsure, call DeKalb Watershed Management before closing, or ask us and we will help you check.',
  },
  {
    q: 'Which homes are exempt?',
    a: 'Homes built on or after January 1, 1993 do not need the certificate. Other common exemptions include foreclosure sales, transfers between spouses or between parents and children, and properties that will be fully demolished after the sale. Exempt properties typically file the county\'s exemption form instead. If you already have a certificate for this sale, you do not need another one.',
  },
  {
    q: 'What happens if a fixture does not meet the limit?',
    a: 'We list each fixture that is over the limit, with its location, so it can be replaced. Once the replacements are in, we confirm them and sign the certificate.',
  },
  {
    q: 'Can I get the compliance inspection as a standalone service?',
    a: 'Yes. The fixture check and signed Certificate of Compliance cost a flat $100, either on their own or added to a home inspection. We send the signed certificate to you, and to your closing attorney if you like, within 24 hours.',
  },
  {
    q: 'Is Foresight part of DeKalb County?',
    a: 'No. Foresight Home Inspections is a private, independently owned company. The county allows a licensed plumber, a certified home inspector, or a DeKalb County Watershed inspector to sign the certificate, and we are certified home inspectors.',
  },
];

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------
export default function DeKalbCountyCompliancePage() {

  // ── JSON-LD: LocalBusiness ──────────────────────────────────────────
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Foresight Home Inspections, LLC',
    description:
      'Low-flow plumbing fixture checks and signed Certificates of Compliance for pre-1993 homes being sold in unincorporated DeKalb County, GA.',
    telephone: '+1-678-480-2110',
    email: 'inspect@foresightcmi.com',
    url: SITE_URL,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'DeKalb County, Georgia',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lithonia',
      addressRegion: 'GA',
      postalCode: '30058',
      addressCountry: 'US',
    },
    priceRange: '$$$',
    image: `${SITE_URL}/images/Logopng.png`,
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

  // ── Fixture requirement data ────────────────────────────────────────
  const fixtures = [
    { icon: '01', label: 'Toilets', spec: '1.6 GPF or less' },
    { icon: '02', label: 'Showerheads', spec: '2.5 GPM or less' },
    { icon: '03', label: 'Bathroom Faucets', spec: '2.0 GPM or less' },
    { icon: '04', label: 'Kitchen Faucets', spec: '2.2 GPM or less' },
  ];

  // ── Inspection cards ────────────────────────────────────────────────
  const inspectionItems = [
    {
      icon: '01',
      title: 'Toilet Flow Rate Verification',
      desc: 'Every toilet is checked against the 1.6 gallons-per-flush (GPF) limit.',
    },
    {
      icon: '02',
      title: 'Showerhead GPM Testing',
      desc: 'All showerheads are checked against the 2.5 gallons-per-minute (GPM) limit.',
    },
    {
      icon: '03',
      title: 'Faucet Aerator Check',
      desc: 'Bathroom faucets are checked against 2.0 GPM and kitchen faucets against 2.2 GPM.',
    },
    {
      icon: '04',
      title: 'Signed Certificate of Compliance',
      desc: 'When every fixture meets the limits, we sign the county Certificate of Compliance so the new owner can set up water service.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          padding: '7rem 0 6rem',
          textAlign: 'center',
          color: 'var(--color-white)',
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(211,47,47,0.18) 0%, transparent 60%), linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span
            className="badge"
            style={{
              marginBottom: '1.5rem',
              background: 'rgba(211,47,47,0.15)',
              color: '#ff6659',
              border: '1px solid rgba(211,47,47,0.3)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            DeKalb County Compliance
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
            DeKalb County Low-Flow Plumbing{' '}
            <span style={{ color: 'var(--color-red)' }}>Compliance Inspection</span>
          </h1>
          <p
            style={{
              color: 'var(--color-gray-mid)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              fontSize: '1.15rem',
              lineHeight: 1.7,
            }}
          >
            For pre-1993 homes being sold in unincorporated DeKalb County, GA. We check every
            fixture and sign the county Certificate of Compliance for a $100 flat rate.
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
              Get Instant Quote
            </Link>
            <a
              href={SCHEDULE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.125rem',
                borderColor: 'var(--color-white)',
                color: 'var(--color-white)',
              }}
            >
              Schedule Compliance Inspection
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. WHAT IS LOW-FLOW COMPLIANCE?
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Water Conservation</span>
            <h2>What Is Low-Flow Compliance?</h2>
          </div>

          <div className="grid grid-2" style={{ alignItems: 'flex-start', gap: '3rem' }}>
            {/* Left – Explanation */}
            <div>
              <p
                style={{
                  color: 'var(--color-gray-dark)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}
              >
                In unincorporated DeKalb County, homes built before January 1, 1993 need a signed
                Certificate of Compliance when they are sold. DeKalb County Department of Watershed
                Management asks for it before water service can be set up in the new owner&apos;s name.
                Homes built in 1993 or later are exempt, and it does not apply to building permits,
                renovations, or new construction.
              </p>
              <p
                style={{
                  color: 'var(--color-gray-dark)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}
              >
                We check every toilet, showerhead, and faucet against the county limits. Any fixture
                over the limit is listed with its location so it can be replaced.
              </p>
              <p
                style={{
                  color: 'var(--color-gray-dark)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                }}
              >
                When every fixture meets the limits, we sign the Certificate of Compliance. Foresight
                Home Inspections is a private company, not part of DeKalb County; the county allows
                certified home inspectors to sign this certificate. For official forms, contact DeKalb
                County Department of Watershed Management.
              </p>
            </div>

            {/* Right – Fixture Requirements Card */}
            <div
              className="card card-premium"
              style={{
                borderTop: '5px solid var(--color-red)',
                padding: '2.5rem',
              }}
            >
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.35rem' }}>
                DeKalb County Fixture Requirements
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {fixtures.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem 0',
                      borderBottom:
                        i < fixtures.length - 1
                          ? '1px solid var(--color-gray-mid)'
                          : 'none',
                    }}
                  >
                    <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>
                      {f.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '1.05rem' }}>
                        {f.label}
                      </strong>
                      <span style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem' }}>
                        Must be{' '}
                        <strong style={{ color: 'var(--color-red)' }}>{f.spec}</strong>
                      </span>
                    </div>
                    <span
                      style={{
                        color: 'var(--color-red)',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem 1.25rem',
                  background: 'var(--color-red-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  color: 'var(--color-gray-dark)',
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: 'var(--color-red)' }}>Important:</strong> Non-compliant
                fixtures must be replaced before the certificate can be signed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. WHAT WE INSPECT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light">
        <div className="container">
          <div className="section-title" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Our Process</span>
            <h2>What We Inspect</h2>
            <p
              style={{
                color: 'var(--color-gray-dark)',
                maxWidth: '700px',
                margin: '1rem auto 0',
                fontSize: '1.1rem',
              }}
            >
              Every fixture in the home is systematically tested and documented against DeKalb
              County&apos;s low-flow requirements.
            </p>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {inspectionItems.map((item, i) => (
              <div
                key={i}
                className="card card-premium"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                }}
              >
                <div
                  style={{
                    fontSize: '3rem',
                    lineHeight: 1,
                    marginBottom: '1.25rem',
                    width: '72px',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-red-light)',
                    borderRadius: '50%',
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="section-title" style={{ marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Transparent Pricing</span>
            <h2>DeKalb County Low-Flow Compliance Pricing</h2>
          </div>

          <div
            className="card card-premium"
            style={{
              borderTop: '5px solid var(--color-red)',
              padding: '3rem 2.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--color-red-light)',
                color: 'var(--color-red)',
                fontWeight: 700,
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
              }}
            >
              Add-On Service
            </div>
            <div
              style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: 'var(--color-red)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}
            >
              $100
            </div>
            <p
              style={{
                color: 'var(--color-gray-dark)',
                fontSize: '1.15rem',
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}
            >
              Flat rate for standalone inspection or when combined with a home inspection
            </p>
            <p
              style={{
                color: 'var(--color-gray-mid)',
                fontSize: '0.95rem',
                marginBottom: '2rem',
                maxWidth: '500px',
                margin: '0 auto 2rem',
                lineHeight: 1.6,
              }}
            >
              Includes a check of every fixture, a short written report, and a signed Certificate of Compliance
              for pre-1993 homes being sold in unincorporated DeKalb County.
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
                style={{ padding: '0.85rem 2.5rem', fontSize: '1.05rem' }}
              >
                Get Your Quote
              </Link>
              <a
                href={SCHEDULE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  padding: '0.85rem 2.5rem',
                  fontSize: '1.05rem',
                  color: 'var(--color-red)',
                  borderColor: 'var(--color-red)',
                }}
              >
                Book Now
              </a>
              <a
                href="/dossiers/dekalb-low-flow-compliance.html"
                className="btn btn-outline"
                style={{
                  padding: '0.85rem 2.5rem',
                  fontSize: '1.05rem',
                  color: 'var(--color-primary, #0f172a)',
                  borderColor: 'var(--color-primary, #0f172a)',
                }}
              >
                View Regulatory Dossier
              </a>
            </div>
          </div>
        </div>
      </section>

      <UnincorporatedAreas />

      {/* ═══════════════════════════════════════════════════════════════
          5. FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-title" style={{ marginBottom: '2.5rem' }}>
            <h2>Frequently Asked Questions</h2>
            <p
              style={{
                color: 'var(--color-gray-dark)',
                maxWidth: '600px',
                margin: '0.75rem auto 0',
                fontSize: '1.05rem',
              }}
            >
              Common questions about DeKalb County low-flow compliance inspections.
            </p>
          </div>

          {faqs.map((faq, i) => (
            <details
              key={i}
              className="faq-item"
              style={{
                background: 'white',
              }}
            >
              <summary>{faq.q}</summary>
              <div className="faq-answer">
                <p style={{ margin: 0 }}>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="section"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(211,47,47,0.12) 0%, transparent 60%), linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
          color: 'var(--color-white)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2
            style={{
              color: 'var(--color-white)',
              marginBottom: '1rem',
              fontSize: '2.25rem',
            }}
          >
            Ready to Get Your{' '}
            <span style={{ color: 'var(--color-red)' }}>Compliance Certificate</span>?
          </h2>
          <p
            style={{
              color: 'var(--color-gray-mid)',
              marginBottom: '2.5rem',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              maxWidth: '650px',
              margin: '0 auto 2.5rem',
            }}
          >
            Selling or buying a pre-1993 home in unincorporated DeKalb County? Get the certificate
            handled during due diligence so water service setup is simple after closing.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href={SCHEDULE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                padding: '1.25rem 3rem',
                fontSize: '1.2rem',
                boxShadow: '0 6px 20px rgba(211,47,47,0.4)',
              }}
            >
              Schedule Compliance Inspection
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{
                padding: '1.25rem 3rem',
                fontSize: '1.2rem',
                borderColor: 'var(--color-white)',
                color: 'var(--color-white)',
              }}
            >
              Call: 678-480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
