import Link from 'next/link';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const SCHEDULE_URL = 'https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule';

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata() {
  const title = 'City of Atlanta Short-Term Rental Inspection | Airbnb Permit Compliance $495';
  const description =
    'Certified Master Inspector life-safety affidavits & STR license compliance inspections for City of Atlanta Airbnb & Vrbo hosts under Ordinance 20-O-1656. Fast 24-hr turnaround.';

  return {
    title,
    description,
    keywords: [
      'Atlanta short term rental inspection',
      'City of Atlanta STR permit inspection',
      'Atlanta Airbnb inspection checklist',
      'Ordinance 20-O-1656 compliance inspection',
      'Atlanta short term rental license affidavit',
      'certified home inspector Atlanta STR',
      'Airbnb life safety inspection Atlanta GA',
      'Atlanta Vrbo permit inspection',
      'City of Atlanta STR smoke detector verification',
      'Atlanta short term rental egress inspection',
      'Foresight Home Inspections Atlanta STR'
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/service-areas/atlanta-str-compliance`,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/service-areas/atlanta-str-compliance`,
    },
  };
}

// ---------------------------------------------------------------------------
// FAQ Data
// ---------------------------------------------------------------------------
const faqs = [
  {
    q: 'Does the City of Atlanta require an inspection for Short-Term Rental (STR) licenses?',
    a: 'Yes. Under City of Atlanta Ordinance 20-O-1656, all residential short-term rental operators (Airbnb, Vrbo, Furnished Finder, and direct bookings) must verify compliance with life-safety codes, including working smoke and carbon monoxide detectors, emergency egress pathways, operational fire extinguishers, and electrical safety standards before receiving or renewing an annual operating license.',
  },
  {
    q: 'What is included in Foresight\'s City of Atlanta STR Inspection?',
    a: 'Our two-inspector team conducts a comprehensive 45-point life-safety and municipal code evaluation. We verify interconnected smoke alarms in every sleeping room and hallway, carbon monoxide detector placement on every habitable level, emergency egress window clear openings (minimum 5.7 sq ft), 2A:10B:C fire extinguisher pressure and mounting, electrical service panel dead-front covers, and GFCI/AFCI wet-area protection. We deliver your official Certified Master Inspector-stamped inspection affidavit within 24 hours.',
  },
  {
    q: 'How much does an Atlanta Short-Term Rental compliance inspection cost?',
    a: 'Our flat-rate City of Atlanta STR Compliance Inspection is $495 for properties up to 2,500 square feet and $595 for larger luxury properties (2,500+ sq ft). This includes our full inspection, on-site testing, photographic documentation, and official signed compliance affidavit for instant upload to the City of Atlanta Accela Citizen Access portal.',
  },
  {
    q: 'How fast will I receive my signed affidavit for the Atlanta city portal?',
    a: 'We guarantee digital delivery of your signed and stamped STR Inspection Report and Life-Safety Affidavit within 24 hours of inspection completion—often the same evening. This allows you to upload documentation directly to the Department of City Planning portal without missing your licensing window.',
  },
  {
    q: 'What happens if my Atlanta STR property has a deficiency during the inspection?',
    a: 'If our inspectors find minor deficiencies (such as an expired fire extinguisher, missing smoke detector battery, or non-functional GFCI receptacle), we document the exact corrective action required on-site. For minor items that can be corrected immediately or via photo verification, we re-verify without charging a full re-inspection fee, helping you maintain operational cash flow.',
  },
];

// ---------------------------------------------------------------------------
// Page Component (Server Component)
// ---------------------------------------------------------------------------
export default function AtlantaSTRCompliancePage() {

  // ── JSON-LD: LocalBusiness ──────────────────────────────────────────
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Foresight Home Inspections, LLC',
    description:
      'Certified City of Atlanta Short-Term Rental (STR) life-safety and municipal license compliance inspections. Official CMI-stamped compliance affidavits for Airbnb and Vrbo operators.',
    telephone: '+1-678-480-2110',
    email: 'inspect@foresightcmi.com',
    url: SITE_URL,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'City of Atlanta, Georgia',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
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
    'name': 'City of Atlanta Short-Term Rental (STR) License Compliance Inspection',
    'serviceType': 'Short-Term Rental Ordinance 20-O-1656 Verification',
    'provider': {
      '@type': 'HomeAndConstructionBusiness',
      'name': 'Foresight Home Inspections, LLC',
      'telephone': '+1-678-480-2110',
      'url': SITE_URL
    },
    'areaServed': {
      '@type': 'City',
      'name': 'City of Atlanta, Georgia'
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

  const checklistItems = [
    {
      icon: '🚨',
      title: 'Interconnected Smoke & CO Alarms',
      desc: 'Verification of dual-sensor smoke detectors in every sleeping room and hallway, plus UL-listed carbon monoxide alarms on every habitable level.',
    },
    {
      icon: '🚪',
      title: 'Emergency Egress & Escape Openings',
      desc: 'Measurement of bedroom egress windows ensuring minimum 5.7 sq ft net clear opening, maximum 44-inch sill height, and unobstructed exit corridors.',
    },
    {
      icon: '🧯',
      title: 'Fire Extinguishers & Life-Safety Gear',
      desc: 'Inspection of 2A:10B:C rated extinguishers mounted in kitchen and common areas, with active pressure gauges and annual inspection validation.',
    },
    {
      icon: '⚡',
      title: 'Electrical Panel & GFCI Protection',
      desc: 'Testing of ground-fault circuit interrupters (GFCI) in all wet areas (bathrooms, kitchens, outdoor patios) and main breaker dead-front safety inspection.',
    },
    {
      icon: '🌡️',
      title: 'HVAC Heating & Water Heater Safety',
      desc: 'Verification of operational heating capacity, water heater temperature-pressure relief (T&P) valve piping, and combustible gas leak detection.',
    },
    {
      icon: '📑',
      title: 'Official Signed CMI Affidavit',
      desc: 'Formal signed and stamped compliance certification ready for instant submission to the City of Atlanta Department of City Planning Accela portal.',
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
            City of Atlanta Ordinance 20-O-1656 Compliance
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
            City of Atlanta Short-Term Rental{' '}
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
            Guaranteed 24-hour certified life-safety affidavits for Airbnb, Vrbo, and short-term rental operators across the City of Atlanta. Fast, authoritative certification by Certified Master Inspector® Christopher Boykin.
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
              📊 Instant STR Quote ($495)
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
              📞 Call Inspector: 678-480-2110
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
            <span>⚡ 24-Hour Portal Affidavit Delivery</span>
            <span>⭐ 4.9-Star Highest Rated in Atlanta</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. ORDINANCE OVERVIEW & REGULATORY REQUIREMENT
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
                Atlanta Department of City Planning Mandate
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  lineHeight: 1.25,
                  marginBottom: '1.25rem',
                  color: 'var(--color-slate-dark)',
                }}
              >
                Operating an Atlanta STR Without a License Risks Heavy Fines and Listing De-Activation
              </h2>
              <p
                style={{
                  color: 'var(--color-gray)',
                  lineHeight: 1.75,
                  marginBottom: '1.25rem',
                  fontSize: '1.05rem',
                }}
              >
                Under City of Atlanta Ordinance 20-O-1656, short-term rental operators cannot legally operate or maintain live listings on Airbnb or Vrbo without an approved annual operating license. A critical component of the application is a certified, professional property life-safety inspection affidavit verifying that the property satisfies local fire, life-safety, and building safety codes.
              </p>
              <p
                style={{
                  color: 'var(--color-gray)',
                  lineHeight: 1.75,
                  marginBottom: '1.75rem',
                  fontSize: '1.05rem',
                }}
              >
                Foresight Home Inspections eliminates bureaucratic delays. Our two-inspector team evaluates every required checkpoint on-site, generates comprehensive photographic proof, and provides the exact signed affidavit required by the City of Atlanta within 24 hours.
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
                  🔑 What City Regulators Specifically Look For:
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                  Accela Citizen Access portal reviewers strictly verify working interconnected smoke alarms, operational carbon monoxide detectors, unobstructed egress pathways, active fire extinguishers with inspection tags, and electrical panel integrity. An incomplete or uncertified submission will cause application rejection.
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
                Foresight Atlanta STR Checklist:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Hardwired / Sealed Smoke Alarms:</strong> Verified in all bedrooms and corridors.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Carbon Monoxide Protection:</strong> Tested on every level near sleeping areas.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Emergency Egress Windows:</strong> Unobstructed operation and clear opening dimensions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Fire Extinguishers:</strong> Min 2A:10B:C pressure gauges, tags, and wall mounts verified.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Electrical Dead-Front & GFCI:</strong> Verified breaker labeling and wet-area circuit safety.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>✓</span>
                  <span><strong>Stamped CMI Affidavit:</strong> Digitally signed and delivered within 24 hours.</span>
                </li>
              </ul>
              <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                  Flat Fee: $495 Complete
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
                  Properties up to 2,500 sq ft &bull; Luxury STRs (2,500+ sq ft) $595
                </div>
                <Link
                  href="/quote"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem 1.5rem', textAlign: 'center' }}
                >
                  Book Your STR Inspection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. SIX INSPECTION PILLARS
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
              Every System Checked for Total Life-Safety & Regulatory Compliance
            </h2>
            <p style={{ color: 'var(--color-gray)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Our Certified Master Inspector dual-inspector teams systematically examine the property so you receive zero rejection notices from the City of Atlanta Department of City Planning.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {checklistItems.map((item, idx) => (
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
              Frequently Asked Questions About Atlanta STR Inspections
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
            Ready to Secure Your City of Atlanta STR License?
          </h2>
          <p
            style={{
              color: '#CBD5E1',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            Don't let a municipal compliance backlog stall your short-term rental revenue. Book your Certified Master Inspector evaluation today and receive your stamped affidavit within 24 hours.
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
              📊 Book STR Inspection ($495)
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
