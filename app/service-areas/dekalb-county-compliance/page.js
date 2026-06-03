import Link from 'next/link';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const SCHEDULE_URL = 'https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule';

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata() {
  const title = 'DeKalb County Low-Flow Compliance Inspection | Foresight Home Inspections';
  const description =
    'Need a DeKalb County low-flow plumbing compliance certificate? Foresight Home Inspections provides certified compliance inspections for property transfers in DeKalb County, GA.';

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
    a: 'Any property transferring ownership in unincorporated DeKalb County or participating municipalities is required to obtain a low-flow plumbing compliance certificate. This applies to residential sales, and the certificate must be presented at closing to confirm that all plumbing fixtures meet DeKalb County water conservation standards.',
  },
  {
    q: 'What happens if my property fails the low-flow inspection?',
    a: 'If your property does not pass the low-flow compliance inspection, non-compliant fixtures must be replaced before closing. We provide a detailed, itemized list of every fixture that needs updating — including the exact location, current flow rate, and the required specification — so you or your plumber can address the issues quickly and efficiently.',
  },
  {
    q: 'Can I get the compliance inspection as a standalone service?',
    a: 'Yes, the DeKalb County low-flow compliance inspection is available as a standalone service. However, it is most cost-effective when combined with a standard home inspection, where it can be added on for just $125. Contact us for standalone pricing.',
  },
  {
    q: 'How long does the compliance inspection take?',
    a: 'The low-flow compliance check adds approximately 30–45 minutes to a standard home inspection. We systematically test every toilet, showerhead, and faucet in the property against DeKalb County\'s water conservation requirements and document our findings in a clear compliance report.',
  },
];

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------
export default function DeKalbCountyCompliancePage() {

  // ── JSON-LD: LocalBusiness ──────────────────────────────────────────
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Foresight Home Inspections, LLC',
    description:
      'Certified low-flow plumbing compliance inspections for property transfers in DeKalb County, GA. Official compliance certificates issued on-site.',
    telephone: '678-480-2110',
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
    priceRange: '$$',
    image: `${SITE_URL}/images/logo.png`,
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
    { icon: '🚽', label: 'Toilets', spec: '1.6 GPF or less' },
    { icon: '🚿', label: 'Showerheads', spec: '2.5 GPM or less' },
    { icon: '🚰', label: 'Faucets', spec: '2.2 GPM or less' },
  ];

  // ── Inspection cards ────────────────────────────────────────────────
  const inspectionItems = [
    {
      icon: '🚽',
      title: 'Toilet Flow Rate Verification',
      desc: 'Every toilet is checked to confirm it meets the 1.6 gallons-per-flush (GPF) maximum required by DeKalb County.',
    },
    {
      icon: '🚿',
      title: 'Showerhead GPM Testing',
      desc: 'All showerheads are tested to verify they do not exceed the 2.5 gallons-per-minute (GPM) threshold.',
    },
    {
      icon: '🚰',
      title: 'Faucet Aerator Compliance',
      desc: 'Kitchen and bathroom faucets are inspected for compliant aerators at or below 2.2 GPM.',
    },
    {
      icon: '📋',
      title: 'Official Compliance Certificate',
      desc: 'Upon passing, we issue the official low-flow compliance certificate required for your DeKalb County property transfer.',
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
            Certified compliance certificates for property transfers in DeKalb County, GA.
            Required for real estate closings on qualifying properties.
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
              📊 Get Instant Quote
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
              📅 Schedule Compliance Inspection
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
                DeKalb County requires that all residential properties meet strict water
                conservation fixture standards before a property transfer can be completed. This
                ordinance ensures that toilets, showerheads, and faucets meet maximum flow-rate
                limits designed to reduce water consumption across the county.
              </p>
              <p
                style={{
                  color: 'var(--color-gray-dark)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                }}
              >
                During the compliance inspection, every plumbing fixture in the home is tested
                against DeKalb County&apos;s specific thresholds. Fixtures that exceed the maximum
                gallons-per-flush (GPF) or gallons-per-minute (GPM) must be replaced or retrofitted
                with compliant components before the property sale can close.
              </p>
              <p
                style={{
                  color: 'var(--color-gray-dark)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                }}
              >
                Once all fixtures pass inspection, we issue an official compliance certificate that
                satisfies DeKalb County&apos;s property transfer requirements and can be presented at
                closing.
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
                <strong style={{ color: 'var(--color-red)' }}>⚠️ Important:</strong> Non-compliant
                fixtures must be replaced before the property transfer can close.
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
              $125
            </div>
            <p
              style={{
                color: 'var(--color-gray-dark)',
                fontSize: '1.15rem',
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}
            >
              When combined with a standard home inspection
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
              Includes full fixture testing, detailed compliance report, and official certificate
              issuance for DeKalb County property transfers.
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
                📊 Get Your Quote
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
                📅 Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

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
            Don&apos;t let a missing low-flow compliance certificate delay your DeKalb County
            property closing. Schedule your inspection today.
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
              📅 Schedule Compliance Inspection
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
              📞 Call: 678-480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
