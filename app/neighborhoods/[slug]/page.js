import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadNeighborhoods() {
  const filePath = path.join(process.cwd(), 'data', 'neighborhoods-pseo.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function generateStaticParams() {
  const neighborhoods = loadNeighborhoods();
  return neighborhoods.map(n => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const neighborhoods = loadNeighborhoods();
  const hood = neighborhoods.find(n => n.slug === resolvedParams.slug);

  if (!hood) {
    return { title: 'Neighborhood Not Found | Foresight Home Inspections' };
  }

  const title = `Home Inspection in ${hood.name}, ${hood.city} GA | Foresight Dual-Inspector Team`;
  const description = `Certified Master Inspector home inspections in ${hood.name} (${hood.city}, GA). Specialized diagnostics for ${hood.era} architecture, ${hood.type.toLowerCase()} risks, FLIR thermal, and $10k warranty.`;
  const canonicalUrl = `${SITE_URL}/neighborhoods/${resolvedParams.slug}`;

  return {
    title,
    description,
    keywords: [
      `${hood.name} home inspection`,
      `home inspector ${hood.name} GA`,
      `${hood.name} Atlanta home inspector`,
      `historic home inspection ${hood.name}`,
      `luxury home inspection ${hood.name}`,
      `Certified Master Inspector ${hood.city} GA`
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function NeighborhoodPage({ params }) {
  const resolvedParams = await params;
  const neighborhoods = loadNeighborhoods();
  const hood = neighborhoods.find(n => n.slug === resolvedParams.slug);

  if (!hood) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/neighborhoods/${hood.slug}`;
  const citySlug = hood.city.toLowerCase().replace(/\s+/g, '-');

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Neighborhoods', item: `${SITE_URL}/neighborhoods` },
      { '@type': 'ListItem', position: 3, name: `${hood.name}, ${hood.city} GA`, item: canonicalUrl },
    ],
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: `Home Inspection Services in ${hood.name}, GA`,
    serviceType: 'Residential Home Inspection',
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'Foresight Home Inspections, LLC',
      telephone: '+1-678-480-2110',
      priceRange: '$$$',
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
      '@type': 'AdministrativeArea',
      name: `${hood.name}, ${hood.city}, GA`,
    },
    description: hood.intro,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: hood.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Script
        id={`hood-breadcrumbs-${hood.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <Script
        id={`hood-service-${hood.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id={`hood-faq-${hood.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" className="bg-light" style={{ padding: '0.75rem 0', borderBottom: '1px solid #eaeaea' }}>
        <div className="container">
          <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: 0, padding: 0, fontSize: '0.875rem' }}>
            <li><Link href="/" style={{ color: 'var(--color-gray-dark)' }}>Home</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li><Link href="/neighborhoods" style={{ color: 'var(--color-gray-dark)' }}>Neighborhoods</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li style={{ color: 'var(--color-red)', fontWeight: 600 }}>{hood.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '4.5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="badge" style={{ background: 'rgba(211,47,47,0.2)', color: 'var(--color-red-light)', fontSize: '0.85rem' }}>
              🏛️ {hood.type}
            </span>
            <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)', fontSize: '0.85rem' }}>
              ⏳ Era: {hood.era}
            </span>
          </div>

          <h1 style={{ color: 'var(--color-white)', fontSize: 'clamp(2.2rem, 4vw, 3.25rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Expert Home Inspections in <span style={{ color: 'var(--color-red-light)' }}>{hood.name}</span>
          </h1>

          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '780px', margin: '0 auto 2rem', fontSize: '1.15rem', lineHeight: 1.6 }}>
            {hood.tagline}. Backed by Lead Certified Master Inspector Christopher Boykin, two certified inspectors on site, FLIR thermal scans, aerial drones, and our complimentary $10,000 warranty.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}
            >
              📅 Schedule {hood.name} Inspection
            </a>
            <Link
              href="/quote"
              className="btn btn-outline"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontWeight: 700 }}
            >
              📊 Calculate Instant Fee
            </Link>
          </div>
        </div>
      </section>

      {/* Overview & Architecture Context */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ marginBottom: '1rem' }}>Architectural Insight</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Navigating Due Diligence in {hood.name}
              </h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {hood.intro}
              </p>
              <div style={{ padding: '1.25rem', background: 'var(--color-gray-light)', borderRadius: '8px', borderLeft: '4px solid var(--color-red)' }}>
                <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '0.5rem' }}>
                  📍 Parent Municipality & Service Link:
                </strong>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-gray-dark)' }}>
                  Located within {hood.county} County. Explore our full citywide inspection capabilities on our{' '}
                  <Link href={`/service-areas/${citySlug}`} style={{ color: 'var(--color-red)', fontWeight: 600 }}>
                    {hood.city}, GA Home Inspection Hub →
                  </Link>
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--color-dark)', color: 'var(--color-white)', padding: '2.25rem', borderRadius: '12px' }}>
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.35rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                ⭐ The Foresight {hood.name} Standard
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Two Certified Inspectors:</strong> Lead CMI + Senior Inspector cover twice the ground in 1.5–2.5 hrs.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>FLIR Thermal Envelope Diagnostics:</strong> Detect concealed moisture and insulation voids without damage.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Active SUPRA eKEY Access:</strong> Seamless, autonomous entry with zero scheduling friction for agents.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>$10,000 Elite Warranty:</strong> $0 deductible coverage on appliances, structural, and mechanicals.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hyper-Local Defect Risk Matrix */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Diagnostic Priority Matrix</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
              Top Defect Risks Evaluated in {hood.name} Homes
            </h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '650px', margin: '0.5rem auto 0', fontSize: '1rem' }}>
              Based on empirical field audits conducted by Certified Master Inspector Christopher Boykin across {hood.county} County.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '1.75rem' }}>
            {hood.keyDefects.map((defect, idx) => (
              <div
                key={idx}
                className="card card-premium"
                style={{ padding: '2rem', background: 'var(--color-white)', borderRadius: '10px', borderTop: '4px solid var(--color-red)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ background: 'var(--color-red)', color: 'var(--color-white)', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                    {idx + 1}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    {defect.title}
                  </h3>
                </div>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
                  {defect.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Ancillary Services for this Neighborhood */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Recommended Diagnostic Add-Ons</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Essential Specialized Services for {hood.name}
            </h2>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {hood.recommendedServices.map((srv, idx) => {
              const titles = {
                'sewer-scope-inspection': 'Sewer Scope HD Camera',
                'radon-testing': '48-Hour Continuous Radon Test',
                'termite-inspection': 'Official GA WDO Termite Letter',
                'pool-inspection': 'Pool & Spa Diagnostic Audit',
                'new-construction-inspection': 'New Build / 11-Month Audit'
              };
              const descriptions = {
                'sewer-scope-inspection': '200ft high-def camera scan through main lateral line to detect root blockages, offset joints, and cracked clay pipes.',
                'radon-testing': 'EPA-compliant electronic continuous monitors measuring airborne radon levels in living spaces and basements.',
                'termite-inspection': 'Thorough inspection for subterranean termite activity, past treatments, and moisture-damaged framing with official state clearance.',
                'pool-inspection': 'APSP & NEC 680 safety evaluation of pumps, chlorinators, filters, heaters, barriers, and electrical bonding.',
                'new-construction-inspection': 'Independent builder warranty punch list documenting code compliance and finishing defects before builder sign-off.'
              };

              return (
                <div key={idx} className="card" style={{ padding: '1.75rem', background: 'var(--color-gray-light)', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {titles[srv] || srv.replace(/-/g, ' ')}
                  </h3>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.92rem', lineHeight: 1.6, flexGrow: 1 }}>
                    {descriptions[srv] || 'Specialized diagnostic service tailored for this housing stock.'}
                  </p>
                  <div style={{ marginTop: '1rem' }}>
                    <Link href={`/services/${srv}/${citySlug}`} style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.9rem' }}>
                      Learn More & View Pricing →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local FAQ Section */}
      <section className="section bg-light">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Local Questions</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              {hood.name} Home Inspection FAQs
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {hood.faqs.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <summary style={{ fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', color: 'var(--color-dark)' }}>
                  {faq.question}
                </summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--color-gray-dark)', fontSize: '0.98rem', lineHeight: 1.65, margin: '0.75rem 0 0' }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="section bg-dark text-white text-center" style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ color: 'var(--color-white)', fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            Protect Your {hood.name} Investment
          </h2>
          <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Schedule with Georgia's premier two-inspector team led by Certified Master Inspector Christopher Boykin. Reports delivered within 24 hours with the Create Request List (CRL) repair tool included.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              📅 Book Online 24/7
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}
            >
              📞 Call 678-480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
