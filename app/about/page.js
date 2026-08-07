import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

export const metadata = {
  title: 'Certified Master Inspector Atlanta | About Us',
  description: 'Meet Christopher Boykin, CMI — the Certified Master Inspector leading Foresight Home Inspections, LLC. Over a decade of hands-on experience, two inspectors on every job, and a $10,000 Elite Master Inspection Warranty included. Serving 163+ Metro Atlanta cities.',
  keywords: ['certified master inspector Atlanta', 'about Foresight Home Inspections', 'Christopher Boykin CMI', 'home inspector Lithonia GA', 'InterNACHI certified inspector Atlanta'],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/about',
  },
  openGraph: {
    title: 'About Foresight Home Inspections | Certified Master Inspector Atlanta',
    description: 'Christopher Boykin, CMI, founded Foresight Home Inspections with a mission to deliver unparalleled thoroughness. Two inspectors, advanced tech, and a $10,000 warranty on every job.',
    url: 'https://www.fhinspectionsatl.com/about',
    type: 'website',
  },
};

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.fhinspectionsatl.com/about#christopher-boykin",
        "name": "Christopher Boykin",
        "jobTitle": "Certified Master Inspector",
        "honorificSuffix": "CMI",
        "description": "Founder and lead Certified Master Inspector (CMI) of Foresight Home Inspections, LLC. Over a decade of hands-on residential inspection experience across Metro Atlanta, Georgia.",
        "image": "https://www.fhinspectionsatl.com/images/Christopher_Boykin.jpg",
        "url": "https://www.fhinspectionsatl.com/about",
        "telephone": "+1-678-480-2110",
        "email": "inspect@foresightcmi.com",
        "worksFor": {
          "@id": "https://www.fhinspectionsatl.com/#organization"
        },
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Professional Certification",
            "name": "Certified Master Inspector (CMI)",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Master Inspector Certification Board"
            },
            "dateCreated": "2024-09"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "Professional Certification",
            "name": "Certified Professional Inspector (CPI)",
            "recognizedBy": {
              "@type": "Organization",
              "name": "InterNACHI"
            }
          }
        ],
        "knowsAbout": [
          "Residential Home Inspections",
          "Thermal Imaging Inspections",
          "Drone Roof Inspections",
          "Radon Gas Testing",
          "Sewer Scope Inspections",
          "Pool and Spa Inspections",
          "Termite and WDO Inspections",
          "Moisture Diagnostics"
        ]
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://www.fhinspectionsatl.com/#organization",
        "name": "Foresight Home Inspections, LLC",
        "url": "https://www.fhinspectionsatl.com",
        "logo": "https://www.fhinspectionsatl.com/images/logo.png",
        "image": "https://www.fhinspectionsatl.com/images/Christopher_Boykin.jpg",
        "telephone": "+1-678-480-2110",
        "email": "inspect@foresightcmi.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1816 South Deshon Road",
          "addressLocality": "Lithonia",
          "addressRegion": "GA",
          "postalCode": "30058",
          "addressCountry": "US"
        },
        "founder": {
          "@id": "https://www.fhinspectionsatl.com/about#christopher-boykin"
        },
        "areaServed": {
          "@type": "State",
          "name": "Georgia"
        },
        "priceRange": "$295 - $890+",
        "description": "Certified Master Inspector-led home inspection company in Metro Atlanta. Two certified inspectors on every job with FLIR thermal imaging, drones, and a $10,000 Elite Master Inspection Warranty included.",
        "memberOf": {
          "@type": "Organization",
          "name": "InterNACHI (International Association of Certified Home Inspectors)"
        },
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "minValue": 2
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.fhinspectionsatl.com/about#webpage",
        "url": "https://www.fhinspectionsatl.com/about",
        "name": "About Foresight Home Inspections | Certified Master Inspector Atlanta",
        "description": "Meet the Certified Master Inspector leading Metro Atlanta's premium two-inspector home inspection company.",
        "isPartOf": { "@id": "https://www.fhinspectionsatl.com/#website" },
        "about": { "@id": "https://www.fhinspectionsatl.com/about#christopher-boykin" }
      }
    ]
  };

  return (
    <>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="slogan-heading">
            &ldquo;Hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>
            About <span style={{ color: 'var(--color-red)' }}>Foresight Home Inspections</span>
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '750px', margin: '0 auto', fontSize: '1.125rem' }}>
            Founded by Christopher Boykin, Certified Master Inspector (CMI), Foresight Home Inspections delivers Metro Atlanta&rsquo;s most thorough residential inspections &mdash; two certified inspectors on every job, advanced diagnostic technology, and a $10,000 Elite Master Inspection Warranty included at no extra cost.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MEET CHRISTOPHER BOYKIN
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <Image
                src="/images/Christopher_Boykin.jpg"
                alt="Christopher Boykin, Certified Master Inspector (CMI) — Founder of Foresight Home Inspections in Atlanta GA"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
                priority
              />
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Image src="/images/cmi_logo.png" alt="Certified Master Inspector designation logo" width={160} height={120} style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
                <Image src="/images/cpi_logo.png" alt="Certified Professional Inspector designation logo" width={160} height={120} style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
                
                {/* 10+ Years Experience Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-dark)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1.25rem', height: '100px', minWidth: '120px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-gold)', lineHeight: 1 }}>10+</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginTop: '0.4rem', lineHeight: 1.2 }}>Years Trusted<br/>Experience</span>
                </div>
              </div>
            </div>
            <div style={{ padding: '0 2rem' }}>
              <span className="badge" style={{ marginBottom: '1rem' }}>Meet The Inspector</span>
              <h2 style={{ marginBottom: '1.5rem' }}>Christopher Boykin, CMI</h2>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-red)', marginBottom: '0.5rem' }}>
                Certified Master Inspector &amp; Founder
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
                <strong>Did you know Georgia does not require a license to be a home inspector?</strong> Anyone can legally inspect your home. Christopher Boykin founded Foresight Home Inspections with a clear mission: to protect buyers in an unregulated market by delivering the most detailed, transparent, and technology-driven inspection in Metro Atlanta. With over a decade of hands-on experience, Christopher has personally inspected thousands of properties across the greater Atlanta area.
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
                In <strong>September 2024</strong>, Christopher earned the prestigious <strong>Certified Master Inspector (CMI)</strong> designation &mdash; the highest professional credential awarded by the Master Inspector Certification Board (top 3% of the industry). This distinction is reserved for inspectors who have completed at least 1,000 paid inspections or equivalent hours of verified education, maintain an impeccable professional record, and adhere strictly to the InterNACHI Standards of Practice, meaning you never have to gamble on your biggest investment.
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
                Christopher also holds the <strong>Certified Professional Inspector (CPI)</strong> credential through InterNACHI, the International Association of Certified Home Inspectors &mdash; the world&rsquo;s largest home inspector association.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  📅 Schedule With Christopher
                </a>
                <Link href="/quote" className="btn btn-outline" style={{ borderWidth: '2px' }}>
                  Get Instant Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          THE FORESIGHT DIFFERENCE: TWO-INSPECTOR MODEL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>The Foresight Difference</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Why Two Inspectors on Every Job?</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              Most inspection companies send a single inspector to rush through your property. Foresight was built to be different from day one.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card card-premium" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>Dual Coverage</h3>
              <p style={{ color: 'var(--color-gray-dark)' }}>
                One inspector audits the roof, structure, and exterior while the second simultaneously reviews interior plumbing, electrical, and HVAC. Two sets of expert eyes dramatically reduce the chance of missed defects.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ marginBottom: '1rem' }}>Half the Time</h3>
              <p style={{ color: 'var(--color-gray-dark)' }}>
                Our two-inspector model cuts total inspection time in half &mdash; typically under 2.5 hours &mdash; without ever sacrificing thoroughness. You and your realtor get time back in your day.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ marginBottom: '1rem' }}>CMI-Led Accuracy</h3>
              <p style={{ color: 'var(--color-gray-dark)' }}>
                A lead Certified Master Inspector is on site at every single appointment, paired with another fully certified professional inspector. This team structure exceeds every InterNACHI standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ADVANCED TECHNOLOGY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Advanced Diagnostics</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Technology That Sees the Invisible</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              Every Foresight inspection integrates professional-grade diagnostic technology &mdash; all included at no extra charge.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                🔥
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>FLIR Thermal Imaging</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Professional infrared cameras scan walls, ceilings, and electrical panels to locate hidden plumbing leaks, electrical fire hazards, and missing insulation &mdash; without damaging drywall.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                🚁
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>High-Resolution Aerial Drones</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Specialized camera drones capture detailed imagery of roofs, chimneys, eaves, and gutters that are too steep, tall, or fragile to walk on. Full exterior coverage from the safest angles.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                💧
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Moisture &amp; Gas Diagnostics</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Electronic moisture scanners trace active leaks through subflooring and walls. High-sensitivity combustible gas sniffers check appliance lines and gas meters for micro-leaks.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                📋
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>24-Hour Digital Reports</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Receive a comprehensive, easy-to-read digital inspection report with high-resolution photos and video within 24 hours. Our 3-step format (Observation, Implication, Recommendation) is written in plain English.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          $10,000 WARRANTY SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-dark), #1f2937)', color: 'white' }}>
        <div className="container">
          <div className="section-title">
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-red)' }}>$10,000</span> Elite Master Inspection Warranty
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem' }}>
              Because Christopher Boykin holds the Certified Master Inspector designation &mdash; the highest credential awarded by the Master Inspector Certification Board &mdash; every Foresight client receives the maximum Elite MASTER level warranty plan at no additional cost.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> $10,000 Aggregate
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Total coverage limit with exactly $0 deductible. Active for 90 days from closing or 120 days from inspection.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Major Systems
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 each for appliances, structural components, and mechanicals (HVAC, electrical, plumbing).</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Additional Protection
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for mold remediation and $1,000 for roof leak protection. Backed by the Master Inspector Certification Board.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                📅 Schedule &amp; Get Your Warranty
              </a>
              <Link href="/quote" className="btn btn-outline-light" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                See Pricing First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CREDENTIALS TIMELINE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-title" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Professional Journey</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Credentials &amp; Milestones</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '600px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              A timeline of the certifications, experience, and milestones that make Foresight the premium choice for Metro Atlanta home inspections.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                year: '2024',
                title: 'Certified Master Inspector (CMI) Designation',
                description: 'Christopher Boykin earns the Certified Master Inspector credential from the Master Inspector Certification Board — the highest professional designation in North America — in September 2024.',
                highlight: true,
              },
              {
                year: '2023',
                title: 'Two-Inspector Model Established',
                description: 'Foresight formally adopts its signature two-inspector team model, deploying two fully certified inspectors on every single appointment for maximum accuracy and efficiency.',
              },
              {
                year: '2022',
                title: 'Advanced Technology Integration',
                description: 'Foresight integrates professional FLIR thermal imaging cameras, high-resolution aerial drones, and digital moisture diagnostic equipment into every standard inspection.',
              },
              {
                year: '2021',
                title: 'Certified Professional Inspector (CPI)',
                description: 'Christopher Boykin earns the Certified Professional Inspector (CPI) designation through InterNACHI, the International Association of Certified Home Inspectors.',
              },
              {
                year: 'Founded',
                title: 'Foresight Home Inspections, LLC',
                description: 'Christopher Boykin founds Foresight Home Inspections with a mission to deliver the most detailed and transparent residential inspections in the Metro Atlanta area.',
              },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '80px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: item.highlight ? 'var(--color-red)' : 'var(--color-dark)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: item.year === 'Founded' ? '0.6rem' : '0.75rem',
                    boxShadow: item.highlight ? '0 0 0 4px var(--color-red-light)' : 'none',
                    zIndex: 2,
                  }}>
                    {item.year}
                  </div>
                  {idx < 4 && (
                    <div style={{ width: '2px', flex: 1, background: 'var(--color-gray-mid)', minHeight: '2rem' }} />
                  )}
                </div>
                <div className={`card ${item.highlight ? 'card-premium' : ''}`} style={{
                  flex: 1,
                  marginBottom: '1.5rem',
                  borderLeft: item.highlight ? '4px solid var(--color-red)' : undefined,
                }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          UTILITIES PLUS PARTNERSHIP
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card card-premium" style={{ borderTop: '6px solid var(--color-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem' }}>Exclusive VIP Partnership</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>Free Utilities Plus Concierge Setup</h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '700px' }}>
              We believe our job doesn't end when the inspection report is delivered. To make your move as seamless as possible, every Foresight client receives a complimentary VIP introduction to the <strong>Utilities Plus Concierge</strong> team. With one quick phone call, they'll find the best local rates and connect your power, water, gas, and high-speed internet. 
            </p>
            <Link href="/free-utility-setup" className="btn btn-gold" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: 'var(--radius-md)' }}>
              Learn About This Free Perk ($150 Value)
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMPANY DETAILS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '3.5rem' }}>
            <h2>Company Details</h2>
          </div>
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Headquarters</h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                1816 South Deshon Road<br />
                Lithonia, GA 30058
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Contact</h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                <a href="tel:+16784802110" style={{ color: 'var(--color-red)', fontWeight: 600 }}>678-480-2110</a><br />
                <a href="mailto:inspect@foresightcmi.com" style={{ color: 'var(--color-red)', fontWeight: 600 }}>inspect@foresightcmi.com</a>
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Service Area</h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                Serving 163+ cities across<br />
                <Link href="/service-areas" style={{ color: 'var(--color-red)', fontWeight: 600 }}>Metro Atlanta, Georgia</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-red)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to Experience the Foresight Difference?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
            Schedule your two-inspector home inspection with Christopher Boykin, Certified Master Inspector. Your $10,000 Elite Master Inspection Warranty is included at no extra cost.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', background: 'var(--color-white)', color: 'var(--color-red)', fontWeight: 700, borderRadius: 'var(--radius-md)' }}>
              📅 Schedule Your Inspection
            </a>
            <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              Get Instant Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
