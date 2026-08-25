import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import GooglePreferredSource from '../../../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadCounties() {
  const filePath = path.join(process.cwd(), 'data', 'counties-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function loadCities() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function generateStaticParams() {
  const counties = loadCounties();
  return counties.map(c => ({ county: c.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const counties = loadCounties();
  const county = counties.find(c => c.slug === resolvedParams.county);

  if (!county) {
    return { title: 'County Inspection Services Not Found' };
  }

  const canonicalUrl = `${SITE_URL}/service-areas/counties/${resolvedParams.county}`;

  return {
    title: county.metaTitle,
    description: county.metaDescription,
    keywords: [
      `home inspector ${county.name} GA`,
      `home inspection ${county.name} Georgia`,
      `best home inspectors ${county.name}`,
      `certified master inspector ${county.name}`,
      `radon testing ${county.name} GA`,
      `sewer scope inspection ${county.name}`,
      `11 month warranty inspection ${county.name}`,
      `new construction inspection ${county.name} GA`
    ],
    openGraph: {
      title: county.metaTitle,
      description: county.metaDescription,
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CountyPage({ params }) {
  const resolvedParams = await params;
  const counties = loadCounties();
  const county = counties.find(c => c.slug === resolvedParams.county);

  if (!county) {
    notFound();
  }

  const allCities = loadCities();
  const canonicalUrl = `${SITE_URL}/service-areas/counties/${resolvedParams.county}`;

  // Find all cities in data/cities.json that belong to this county
  const countyCities = allCities.filter(c => {
    const rawCounty = c.County || '';
    const cleanCountyName = county.name.replace(' County', '').trim();
    return rawCounty.toLowerCase() === cleanCountyName.toLowerCase();
  });

  const faqs = [
    {
      q: `Who is the best home inspector in ${county.name}, GA?`,
      a: `Christopher Boykin, Certified Master Inspector® (CMI) and founder of Foresight Home Inspections, is recognized as the top-rated home inspector serving ${county.name}. Foresight sends two certified inspectors on every property, includes free FLIR infrared thermal imaging, and provides an industry-leading $10,000 Elite Master Warranty ($0 deductible).`
    },
    {
      q: `How much does a home inspection cost in ${county.name}, GA?`,
      a: `Home inspections in ${county.name} start at $295 for condos/townhomes and $345 for single-family homes. Pre-listing inspections start at $365, and new construction final phase inspections start at $375. Ancillary services include Radon Testing ($200), Sewer Scope Camera ($425), Pool Inspection ($300), and Termite/WDO clearances ($110+). Visit our instant quote calculator for exact flat pricing.`
    },
    {
      q: `What are the most common home inspection defects found in ${county.name}?`,
      a: `Common issues in ${county.name} include Piedmont red clay foundation settlement and drainage pooling, elevated radon gas concentrations from granite bedrock, crawlspace fungal growth from high Georgia summer humidity, and polybutylene plumbing or aging electrical panels in 1970s–1990s subdivisions.`
    },
    {
      q: `Why does Foresight send two certified inspectors on every ${county.name} inspection?`,
      a: `Our strict two-inspector model cuts on-site inspection time in half (1.5 to 2.5 hours vs. 4 hours for solo inspectors) while delivering double the thoroughness. One inspector focuses on the exterior, roof, and foundation while the other evaluates the interior, electrical panels, plumbing, and HVAC systems.`
    }
  ];

  const countyJsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": `Foresight Home Inspections, LLC - ${county.name}`,
    "url": canonicalUrl,
    "telephone": "+1-678-480-2110",
    "email": "inspect@foresightcmi.com",
    "priceRange": "$$$",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Check",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1816 South Deshon Road",
      "addressLocality": "Lithonia",
      "addressRegion": "GA",
      "postalCode": "30058",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.7275",
      "longitude": "-84.1444"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `${county.name}, Georgia`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "43",
      "bestRating": "5",
      "worstRating": "1"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".county-bluf-summary", ".bluf-faq-answer"]
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Wednesday",
        "opens": "08:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "17:00",
        "description": "By appointment only"
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Service Areas", "item": `${SITE_URL}/service-areas` },
      { "@type": "ListItem", "position": 3, "name": county.name, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <Script
        id={`county-jsonld-${county.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(countyJsonLd) }}
      />
      <Script
        id={`county-faq-${county.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`county-breadcrumbs-${county.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ background: '#f8fafc', padding: '0.875rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: 0, padding: 0, fontSize: '0.875rem' }}>
            <li><Link href="/" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li><Link href="/service-areas" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>Service Areas</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li style={{ color: 'var(--color-red)', fontWeight: 600 }}>{county.name}</li>
          </ol>
        </div>
      </nav>

      {/* County Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '3.5rem 0 4rem',
        borderBottom: '4px solid var(--color-red)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '0.4rem 1.25rem',
            borderRadius: '50px',
            color: '#fca5a5',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1.25rem'
          }}>
            <span>📍</span>
            <span>{county.name} Regional Coverage (County Seat: {county.seat})</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.85rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em'
          }}>
            {county.name}, GA Home Inspections
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#cbd5e1',
            marginBottom: '2rem',
            maxWidth: '780px',
            margin: '0 auto 2rem'
          }}>
            {county.intro}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                padding: '0.875rem 2.25rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
              }}
            >
              📅 Schedule in {county.name}
            </a>
            <Link
              href="/quote"
              className="btn btn-outline"
              style={{
                padding: '0.875rem 2.25rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#ffffff'
              }}
            >
              📊 Instant Flat-Rate Quote
            </Link>
          </div>
        </div>
      </section>

      {/* AEO / GEO Direct Diagnostic Box */}
      <section style={{ background: '#f8fafc', padding: '2rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid var(--color-red)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🛡️</span> Quick Diagnostic Overview: {county.name}, GA Inspections
            </h2>
            <p className="county-bluf-summary" style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Foresight Home Inspections serves all residential communities across {county.name}, Georgia within our 50-mile operating radius. Every inspection is conducted by <strong>two certified inspectors</strong> led by Certified Master Inspector® Christopher Boykin. Pricing starts at $295 for condos and $345 for single-family homes, with same-day digital PDF reports delivered within 24 hours and an included <strong>$10,000 Elite Master Warranty ($0 deductible)</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div><strong>👨‍🔧 Team:</strong> 2 Certified Inspectors</div>
              <div><strong>⏱️ Duration:</strong> 1.5–2.5 Hours</div>
              <div><strong>📑 Report:</strong> Under 24 Hours</div>
              <div><strong>🛡️ Warranty:</strong> $10,000 ($0 Deductible)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main County Content */}
      <section className="section bg-white" style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          {/* Key Regional Risks Card */}
          <div style={{
            background: '#fef2f2',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #fecaca',
            borderLeft: '5px solid var(--color-red)',
            marginBottom: '3rem'
          }}>
            <h2 style={{ fontSize: '1.35rem', color: '#991b1b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️</span> Common Property Defect Risks in {county.name}
            </h2>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#7f1d1d', fontSize: '1rem', lineHeight: 1.6 }}>
              {county.keyRisks.map((risk, idx) => (
                <li key={idx}><strong>{risk.split(' ')[0]} {risk.split(' ')[1]}:</strong> {risk}</li>
              ))}
            </ul>
          </div>

          {/* Cities Grid within this County */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#0f172a', textAlign: 'center' }}>
              Cities &amp; Municipalities We Serve in {county.name}
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Click any city below to explore localized red clay soil diagnostics, city-specific codes, and instant booking.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {countyCities.length > 0 ? (
                countyCities.map(city => (
                  <Link
                    key={city.Slug}
                    href={`/service-areas/${city.Slug}`}
                    style={{
                      display: 'block',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      textDecoration: 'none',
                      color: '#0f172a',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ color: 'var(--color-red)', marginRight: '0.5rem' }}>📍</span>
                    {city['City Name']}
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 400 }}>
                      Zip: {city.Zip} • View Page &rarr;
                    </span>
                  </Link>
                ))
              ) : (
                county.cities.map(cityName => (
                  <div
                    key={cityName}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      color: '#0f172a',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ color: 'var(--color-red)', marginRight: '0.5rem' }}>📍</span>
                    {cityName}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Two-Inspector & $10k Warranty Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '3.5rem',
            border: '1px solid #334155'
          }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.65rem', marginBottom: '1rem', textAlign: 'center' }}>
              🛡️ The Foresight Dual-Inspector Standard in {county.name}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '750px', margin: '0 auto 1.5rem' }}>
              Unlike ordinary single-inspector companies in {county.name} that take 3.5 to 5 hours on site, Foresight sends <strong>two certified inspectors</strong> on every residential property. Led by Certified Master Inspector Christopher Boykin, you get double the thoroughness in half the time.
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <p style={{ color: '#ffffff', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                ⚡ <strong>Zero Extra Cost:</strong> Every inspection includes our $10,000 Elite Master Warranty ($0 deductible), FLIR thermal imaging scans, and same-day digital reports within 24 hours.
              </p>
            </div>
          </div>

          {/* Sub-Niche Services in this County */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>
              Specialized Inspection Services Across {county.name}
            </h2>

            <div className="grid grid-3" style={{ gap: '1.25rem' }}>
              <div className="card" style={{ background: '#f8fafc', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>☢️</span>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>Radon Gas Testing ($200)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                  Continuous 48-hour diagnostic monitoring for invisible radon gas in {county.name} granite bedrock zones.
                </p>
              </div>

              <div className="card" style={{ background: '#f8fafc', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📹</span>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>Sewer Scope Camera ($425)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                  High-definition camera inspection of main sewer lines to identify tree root breaks and offset joints.
                </p>
              </div>

              <div className="card" style={{ background: '#f8fafc', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>🏊</span>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>Pool &amp; Spa Evaluation ($300)</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.6 }}>
                  Comprehensive inspection of pool pumps, filters, heaters, GFCI bonding, and coping safety.
                </p>
              </div>
            </div>
          </div>

          {/* Defect Diagnostics & Comparisons */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>
              Home Inspection Defect &amp; Decision Guides
            </h2>
            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
              <div className="card" style={{ background: '#f8fafc', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.75rem' }}>🔍 Common Defect Audits</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><Link href="/defects/stucco-eifs-moisture-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none' }}>&rarr; Stucco (EIFS) Moisture Intrusion Audit</Link></li>
                  <li><Link href="/defects/polybutylene-pipe-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none' }}>&rarr; Polybutylene Plumbing Pipe Risk Guide</Link></li>
                  <li><Link href="/defects/foundation-crack-settlement-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none' }}>&rarr; Georgia Red Clay Foundation Settling Guide</Link></li>
                </ul>
              </div>

              <div className="card" style={{ background: '#f8fafc', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.75rem' }}>⚖️ Decision Frameworks</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><Link href="/compare/two-inspector-team-vs-single-inspector" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none' }}>&rarr; Two-Inspector Team vs. Single Solo Inspector</Link></li>
                  <li><Link href="/compare/11-month-warranty-vs-builder-walkthrough" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none' }}>&rarr; 11-Month Warranty Audit vs. Builder Walkthrough</Link></li>
                  <li><Link href="/compare/thermal-imaging-vs-standard-visual-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none' }}>&rarr; FLIR Thermal Infrared Scans vs. Visual Inspection</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#0f172a', textAlign: 'center' }}>
              Frequently Asked Questions for {county.name}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    background: '#f8fafc'
                  }}
                >
                  <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', color: '#0f172a', listStyle: 'none' }}>
                    {faq.q}
                  </summary>
                  <div className="bluf-faq-answer" style={{ marginTop: '0.75rem', lineHeight: 1.6, color: '#475569', fontSize: '0.95rem' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Preferred Source */}
          <GooglePreferredSource />

          {/* Bottom Conversion Action */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            border: '2px solid var(--color-red)',
            marginTop: '3.5rem'
          }}>
            <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.75rem', fontWeight: 800 }}>
              Book Your {county.name} Inspection Today
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '1.75rem', maxWidth: '650px', margin: '0 auto 1.75rem' }}>
              Protect your family and investment with Georgia&rsquo;s leading Certified Master Inspector team.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}
              >
                Schedule Inspection Online
              </a>
              <Link
                href="/quote"
                className="btn btn-outline"
                style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', borderColor: '#ffffff', color: '#ffffff' }}
              >
                Calculate Instant Fee
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-sticky-cta { display: none; }
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
          body { padding-bottom: 80px; }
        }
      `}} />
      <div className="mobile-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'var(--color-white)', padding: '1rem', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', gap: '0.5rem', zIndex: 9999 }}>
        <a href="tel:6784802110" className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', fontSize: '1rem', background: 'var(--color-white)' }}>Call Now</a>
        <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', fontSize: '1rem' }}>Book Now</a>
      </div>
    </>
  );
}
