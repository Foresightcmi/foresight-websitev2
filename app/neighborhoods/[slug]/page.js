import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const dynamic = 'force-static';
export const dynamicParams = false;

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
  const description = `Certified Master Inspector home inspections in ${hood.name} (${hood.city}, GA). Specialized diagnostics for ${hood.era} architecture, ${hood.type.toLowerCase()} risks, infrared thermal, and $10k warranty.`;
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

  const otherNeighborhoods = neighborhoods.filter(n => n.slug !== hood.slug);
  const sameCounty = otherNeighborhoods.filter(n => n.county === hood.county);
  const otherCounties = otherNeighborhoods.filter(n => n.county !== hood.county);
  const currentIdx = neighborhoods.findIndex(n => n.slug === hood.slug);
  const offset = otherCounties.length > 0 ? currentIdx % otherCounties.length : 0;
  const rotatedOthers = [...otherCounties.slice(offset), ...otherCounties.slice(0, offset)];
  const adjacentNeighborhoods = [...sameCounty, ...rotatedOthers].slice(0, 6);

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
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#aeo-direct-answer', 'h1'],
    },
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'Foresight Home Inspections, LLC',
      image: `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`,
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
    offers: {
      '@type': 'Offer',
      price: '345.00',
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '345.00',
        priceCurrency: 'USD',
        unitText: 'starting',
      },
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
            <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.45)', fontSize: '0.85rem', backdropFilter: 'blur(8px)' }}>
              {hood.type}
            </span>
            <span className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--color-gold)', border: '1px solid rgba(212,175,55,0.45)', fontSize: '0.85rem', backdropFilter: 'blur(8px)' }}>
              ⏳ Era: {hood.era}
            </span>
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2.2rem, 4vw, 3.25rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.15, textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
            Expert Home Inspections in <span style={{ color: 'var(--color-gold)', textShadow: '0 2px 14px rgba(212, 175, 55, 0.45)' }}>{hood.name}</span>
          </h1>

          <p style={{ color: '#F1F5F9', maxWidth: '780px', margin: '0 auto 2rem', fontSize: '1.15rem', lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            {hood.tagline}. Backed by Lead Certified Master Inspector Christopher Boykin, two certified inspectors on site, infrared thermal scans, aerial drones, and our complimentary $10,000 warranty.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}
            >
              Schedule {hood.name} Inspection
            </a>
            <Link
              href="/quote"
              className="btn btn-outline"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontWeight: 700 }}
            >
              Calculate Instant Fee
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
                What should homebuyers inspect in {hood.name} ({hood.city}, GA) and what does an inspection cost?
              </h2>
              <p id="aeo-direct-answer" style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                <strong>Foresight Home Inspections, LLC</strong> (led by Certified Master Inspector Christopher Boykin, CMI #MICB-1082) inspects {hood.name} homes in {hood.city}, GA from $345 ($295 condos), deploying <strong>two certified inspectors</strong> with free thermal imaging, 4K drone scans, and <strong>$35,000 warranty protection</strong>. {hood.intro}
              </p>
              <div style={{ padding: '1.35rem', background: 'var(--color-gray-light)', borderRadius: '8px', borderLeft: '4px solid var(--color-red)' }}>
                <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '0.6rem' }}>
                  Parent Municipality &amp; Upward Metro Equity Links:
                </strong>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: 'var(--color-gray-dark)' }}>
                  Located within {hood.county} County, {hood.city}, GA. Connect directly to our primary Atlanta authority hub, dedicated buyer inspection page, and local municipal risk guide:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.95rem' }}>
                  <li>
                    <Link href="/" style={{ color: 'var(--color-dark)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      Atlanta Home Inspections — Foresight Home Inspections →
                    </Link>
                  </li>
                  <li>
                    <Link href={`/services/buyer-inspection/${citySlug}`} style={{ color: 'var(--color-red)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      {hood.city}, GA Buyer Home Inspection (From $345) →
                    </Link>
                  </li>
                  <li>
                    <Link href={`/service-areas/${citySlug}`} style={{ color: 'var(--color-dark)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      {hood.city}, GA Inspection Guide: Local Risks &amp; Services →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ background: 'var(--color-dark)', color: 'var(--color-white)', padding: '2.25rem', borderRadius: '12px' }}>
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.35rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                ⭐ The Foresight {hood.name} Protocol
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Two Certified Inspectors:</strong> Lead CMI + Senior Inspector deliver property-scaled parallel focus with zero solo-inspector fatigue.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Infrared Thermal Envelope Diagnostics:</strong> Detect concealed moisture and insulation voids without damage, plus 4K aerial drone roof scans.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>Active SUPRA eKEY Access:</strong> Smooth, autonomous lockbox entry with zero scheduling friction for listing and buyer agents.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red-light)', fontSize: '1.2rem' }}>✓</span>
                  <div>
                    <strong>$35,000 Combined Protection:</strong> $10,000 Elite Master Warranty ($0 deductible) + $25,000 InterNACHI Honor Guarantee.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Real Defect Negotiation Leverage & Verified Google Reviews Strip */}
          <div style={{ marginTop: '2.5rem', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(212, 175, 55, 0.35)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ marginBottom: '0.65rem' }}>Verified Client ROI &amp; Trust</span>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                $1,250–$14,200+ Typical Repair Credit Leverage vs. From $345 Inspection
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
                Metro Atlanta contractor trade defects uncovered before closing routinely power $1,250–$14,200+ in Georgia Repair Amendment seller credits. Decode red-flag symptoms or estimate your negotiation leverage before due diligence expires.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <a
                href="https://g.page/r/CaK5MZOz_FBtEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'rgba(212, 175, 55, 0.14)', border: '1px solid rgba(212, 175, 55, 0.45)', borderRadius: '8px', padding: '0.85rem 1.1rem', color: '#FDE047', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'block', textAlign: 'center' }}
              >
                ★★★★★ 4.8/5 across 53 Verified Google Reviews →
              </a>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/repair-credit-calculator" className="btn btn-gold" style={{ flex: 1, minWidth: '180px', padding: '0.75rem 1rem', fontSize: '0.92rem' }}>
                  Repair Credit Calculator →
                </Link>
                <Link href="/homebuyer-red-flags" className="btn btn-outline-light" style={{ flex: 1, minWidth: '180px', padding: '0.75rem 1rem', fontSize: '0.92rem' }}>
                  3:00 AM Red-Flag Guide →
                </Link>
              </div>
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
              Based on empirical field inspections conducted by Certified Master Inspector Christopher Boykin across {hood.county} County.
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
                'pool-inspection': 'Pool & Spa Diagnostic Evaluation',
                'new-construction-inspection': 'New Construction Inspection (From $400)',
                '11-month-warranty-inspection': '11-Month Builder Warranty (From $345)',
                'pre-drywall-inspection': 'Pre-Drywall Framing Inspection (From $275)',
                'pre-listing-inspection': 'Pre-Listing Seller Inspection (From $345)',
                'mold-testing': 'Certified Mold & Air Quality Lab Testing'
              };
              const descriptions = {
                'sewer-scope-inspection': '200ft high-def camera scan through main lateral line to detect root blockages, offset joints, and cracked clay pipes. Call (678) 480-2110 for Quote.',
                'radon-testing': 'EPA-compliant electronic continuous monitors measuring airborne radon levels in living spaces and basements. Call (678) 480-2110 for Quote.',
                'termite-inspection': 'Thorough inspection for subterranean termite activity, past treatments, and moisture-damaged framing with official state clearance. Call (678) 480-2110 for Quote.',
                'pool-inspection': 'APSP & NEC 680 safety evaluation of pumps, chlorinators, filters, heaters, barriers, and electrical bonding. Call (678) 480-2110 for Quote.',
                'new-construction-inspection': 'Independent final new-build evaluation documenting framing, mechanical, and envelope punch list items before closing.',
                '11-month-warranty-inspection': 'Comprehensive two-inspector evaluation before your 1-year builder warranty expires so defects are repaired at builder expense.',
                'pre-drywall-inspection': 'Phase 1 framing, rough electrical, rough plumbing, and structural shear check before insulation and drywall conceal defects.',
                'pre-listing-inspection': 'Two-inspector seller pre-listing evaluation that uncovers repair priorities before hitting the MLS.',
                'mold-testing': 'Calibrated spore-trap indoor air quality sampling analyzed by an accredited lab. Call (678) 480-2110 for Quote.'
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

      {/* Adjacent Metro Atlanta Neighborhood Clusters (Deterministic) */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '2.25rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Concentric Ring Exploration</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800 }}>
              Adjacent Metro Atlanta Neighborhood Clusters
            </h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '680px', margin: '0.5rem auto 0', fontSize: '1rem' }}>
              Compare construction eras, radon zones, and structural risks across neighboring {hood.county} County and Metro Atlanta communities.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '1.25rem' }}>
            {adjacentNeighborhoods.map((adj) => (
              <Link
                key={adj.slug}
                href={`/neighborhoods/${adj.slug}`}
                className="card"
                style={{ padding: '1.5rem', background: 'var(--color-gray-light)', borderRadius: '10px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--color-gold)' }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {adj.city}, GA &bull; {adj.county} County
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark)', margin: '0.4rem 0 0.5rem' }}>
                    {adj.name}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0, lineHeight: 1.55 }}>
                    {adj.tagline}
                  </p>
                </div>
                <span style={{ marginTop: '1rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-red)' }}>
                  Explore Cluster Guide →
                </span>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/neighborhoods" className="btn btn-outline" style={{ borderColor: 'var(--color-dark)', color: 'var(--color-dark)' }}>
              View All {neighborhoods.length} Neighborhood Clusters
            </Link>
            <Link href="/" className="btn btn-outline" style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)' }}>
              Atlanta Home Inspections — Foresight Home Inspections
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="section bg-dark text-white text-center" style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', textShadow: '0 2px 14px rgba(0,0,0,0.5)' }}>
            Protect Your {hood.name} Investment
          </h2>
          <p style={{ color: '#F1F5F9', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            Schedule with Georgia's premier two-inspector team led by Certified Master Inspector Christopher Boykin. Reports delivered within 24 hours with the Digital Repair Request List Builder repair tool included.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              Book Online 24/7
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '0.9rem 2.25rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}
            >
              Call 678-480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
