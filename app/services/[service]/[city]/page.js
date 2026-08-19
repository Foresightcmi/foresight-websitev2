import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import RelatedServiceAreas from '../../../components/RelatedServiceAreas';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadServices() {
  const filePath = path.join(process.cwd(), 'data', 'services-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function loadCities() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Static params – generates 462 routes (6 services x 77 cities)
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const services = loadServices();
  const cities = loadCities();

  const params = [];
  for (const service of services) {
    for (const city of cities) {
      params.push({
        service: service.slug,
        city: toSlug(city['City Name']),
      });
    }
  }
  return params;
}

// ---------------------------------------------------------------------------
// Metadata – SEO titles, descriptions, OpenGraph, canonical
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const services = loadServices();
  const cities = loadCities();

  const serviceData = services.find(s => s.slug === resolvedParams.service);
  const cityData = cities.find(c => toSlug(c['City Name']) === resolvedParams.city);

  if (!serviceData || !cityData) {
    return { title: 'Service Not Found | Foresight Home Inspections' };
  }

  const cityName = cityData['City Name'];
  const county = cityData.County || 'Georgia';
  const serviceName = serviceData.name;

  const title = serviceData.metaTitle.replace(/{city}/g, cityName);
  const description = serviceData.metaDescription.replace(/{city}/g, cityName);
  const canonicalUrl = `${SITE_URL}/services/${resolvedParams.service}/${resolvedParams.city}`;

  return {
    title,
    description,
    keywords: [
      `${serviceName.toLowerCase()} ${cityName} GA`,
      `best ${serviceName.toLowerCase()} ${cityName} GA`,
      `${serviceName.toLowerCase()} cost ${cityName}`,
      `${serviceName.toLowerCase()} near me ${cityName}`,
      `certified home inspector ${cityName} GA`,
      `${serviceName.toLowerCase()} ${county} County GA`,
      `foresight home inspections ${cityName}`
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

// ---------------------------------------------------------------------------
// County Context Helper
// ---------------------------------------------------------------------------
function getCountyContext(county, cityName, serviceName) {
  switch (county) {
    case 'Fulton':
      return `Fulton County features a mix of historic homes and dense modern developments. Performing ${serviceName.toLowerCase()} in ${cityName} requires careful attention to North Fulton granite soil formations and local municipal building codes.`;
    case 'DeKalb':
      return `DeKalb County properties are subject to specific municipal guidelines, including low-flow plumbing standards and legacy infrastructure checks. Our ${serviceName.toLowerCase()} in ${cityName} helps homeowners navigate county compliance seamlessly.`;
    case 'Gwinnett':
      return `As one of Metro Atlanta's fastest-expanding areas, Gwinnett County homes range from 1990s subdivisions to rapid new builds. We tailor our ${serviceName.toLowerCase()} in ${cityName} to identify polybutylene piping, rapid-build defects, and regional environmental factors.`;
    case 'Cobb':
      return `Cobb County's rolling topography and red clay soil create unique structural and drainage challenges. Our ${serviceName.toLowerCase()} in ${cityName} evaluates how soil settlement and moisture impact your home's integrity.`;
    case 'Forsyth':
      return `Forsyth County features premier luxury estates and lakefront homes. We utilize high-tech diagnostic gear during ${serviceName.toLowerCase()} in ${cityName} to verify high-end systems meet rigid safety standards.`;
    default:
      return `${county} County properties are influenced by Georgia's humid climate and regional soil conditions. Our ${serviceName.toLowerCase()} in ${cityName} ensures your property meets all safety and performance standards.`;
  }
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default async function ServiceCityPage({ params }) {
  const resolvedParams = await params;
  const services = loadServices();
  const cities = loadCities();

  const serviceData = services.find(s => s.slug === resolvedParams.service);
  const cityData = cities.find(c => toSlug(c['City Name']) === resolvedParams.city);

  if (!serviceData || !cityData) {
    notFound();
  }

  const cityName = cityData['City Name'];
  const county = cityData.County || 'Georgia';
  const zip = cityData.Zip || '';
  const serviceName = serviceData.name;
  const canonicalUrl = `${SITE_URL}/services/${resolvedParams.service}/${resolvedParams.city}`;

  // Process FAQs with city name injected
  const processedFaqs = serviceData.faqs.map(f => ({
    q: f.q.replace(/{city}/g, cityName),
    a: f.a.replace(/{city}/g, cityName),
  }));

  // JSON-LD Schemas
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${SITE_URL}/services` },
      { "@type": "ListItem", "position": 3, "name": serviceName, "item": `${SITE_URL}/services#${serviceData.slug}` },
      { "@type": "ListItem", "position": 4, "name": `${serviceName} in ${cityName}`, "item": canonicalUrl }
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    "name": `${serviceName} in ${cityName}, GA`,
    "url": canonicalUrl,
    "serviceType": serviceName,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1816 South Deshon Road",
        "addressLocality": "Lithonia",
        "addressRegion": "GA",
        "postalCode": "30058",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": `${county} County`,
        "containedInPlace": { "@type": "State", "name": "Georgia" }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "43",
      "bestRating": "5"
    },
    "offers": {
      "@type": "Offer",
      "price": serviceData.price.replace(/[^0-9]/g, '') || "200",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "areaServed": {
        "@type": "City",
        "name": cityName
      }
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": processedFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a.replace(/<[^>]*>/g, '')
      }
    }))
  };

  // Select nearby cities for footer cross-linking
  const nearbyCities = cities
    .filter(c => toSlug(c['City Name']) !== resolvedParams.city && c.County === county)
    .slice(0, 8);

  return (
    <>
      {/* ── JSON-LD SCHEMAS ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── BREADCRUMBS ────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
        <Link href="/" style={{ color: 'var(--color-red)' }}>Home</Link> &nbsp;/&nbsp;
        <Link href="/services" style={{ color: 'var(--color-red)' }}>Services</Link> &nbsp;/&nbsp;
        <Link href={`/service-areas/${resolvedParams.city}`} style={{ color: 'var(--color-red)' }}>{cityName}</Link> &nbsp;/&nbsp;
        <span>{serviceName}</span>
      </div>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="hero" style={{ padding: '4rem 0 5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {serviceData.icon} {serviceData.badge}
          </span>
          <h1 style={{ fontSize: '2.75rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {serviceName} in <span style={{ color: 'var(--color-red)' }}>{cityName}, GA</span>
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto 2.5rem', fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--color-gray-dark)' }}>
            {serviceData.heroSub.replace(/{city}/g, cityName)}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              📅 Schedule {serviceName}
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}
              data-call-source={`pseo_${serviceData.slug}_${resolvedParams.city}`}
            >
              📞 Call 678-480-2110
            </a>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW & PRICING CARD ──────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="grid grid-2" style={{ gap: '2.5rem', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
              <span className="badge" style={{ background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', marginBottom: '1rem', display: 'inline-block' }}>
                Service Overview
              </span>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Professional {serviceName} Services for {cityName} Homeowners
              </h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                {serviceData.overview.replace(/{city}/g, cityName)}
              </p>
            </div>

            {/* Pricing Card */}
            <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'white', padding: '2.25rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{serviceData.icon}</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{serviceName} Pricing</h3>
              <div style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--color-red)', margin: '0.5rem 0' }}>
                {serviceData.price}
              </div>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {serviceData.priceDetails}
              </p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--color-gray-mid)', fontSize: '0.95rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Includes $10,000 Elite Warranty Protection</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Two Certified Inspectors on every job</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Digital Report delivered within 24 hours</li>
              </ul>
              <Link href="/quote" className="btn btn-primary" style={{ width: '100%', display: 'block' }}>
                Get Custom Quote
              </Link>
            </div>
          </div>

          {/* Standards & Equipment */}
          <div className="grid grid-2" style={{ gap: '2rem', marginTop: '2rem' }}>
            <div style={{ background: 'var(--color-gray-light)', padding: '1.75rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-red)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📋 Testing Standards & Regulations
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                {serviceData.standards}
              </p>
            </div>

            <div style={{ background: 'var(--color-gray-light)', padding: '1.75rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-dark)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚙️ Diagnostic Equipment Used
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                {serviceData.equipment}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTY & CITY CONTEXT ───────────────────────────────────── */}
      <section className="section bg-gray-light">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center">
            <h2>{cityName}, {county} County Environmental & Property Analysis</h2>
          </div>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid var(--color-red)' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', marginBottom: '1.25rem' }}>
              <strong>📍 Regional Analysis for {cityName}:</strong> {getCountyContext(county, cityName, serviceName)}
            </p>
            {cityData?.Intro && (
              <p style={{ fontSize: '1.025rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', marginBottom: '1.25rem' }}>
                <strong>🏡 Local Neighborhood Overview:</strong> {cityData.Intro}
              </p>
            )}
            {cityData?.['Seasonal Tip'] && (
              <div style={{ background: 'rgba(211,47,47,0.04)', borderLeft: '4px solid var(--color-gold)', padding: '1rem 1.25rem', borderRadius: '4px', marginBottom: '1.25rem' }}>
                <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '0.25rem' }}>
                  🌤️ Seasonal Inspection Advisory for {cityName}:
                </strong>
                <span style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {cityData['Seasonal Tip']}
                </span>
              </div>
            )}
            <p style={{ fontSize: '1.025rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', margin: 0 }}>
              <strong>⚠️ Environmental Warning:</strong> {serviceData.riskContext.replace(/{city}/g, cityName)}
            </p>
          </div>

          {/* Sibling Services in this City */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>
              Complete Inspection Services in {cityName}, GA
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href={`/service-areas/${resolvedParams.city}`}
                className="btn btn-outline"
                style={{ fontSize: '0.875rem', background: 'white', borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
              >
                ⭐ Full {cityName} Inspection Hub
              </Link>
              {services.filter(s => s.slug !== resolvedParams.service).map(s => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}/${resolvedParams.city}`}
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem', background: 'white' }}
                >
                  {s.icon} {s.name} in {cityName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ───────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-title text-center">
            <h2>Frequently Asked Questions: {serviceName} in <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
          </div>
          <div>
            {processedFaqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  border: '1px solid var(--color-gray-mid)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--color-gray-light)',
                }}
              >
                <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-dark)' }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.7, color: 'var(--color-gray-dark)', fontSize: '1rem' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED BLOG LINK ───────────────────────────────────────── */}
      {serviceData.relatedBlogSlug && (
        <section className="section bg-dark text-white" style={{ padding: '3.5rem 0' }}>
          <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <span style={{ color: 'var(--color-red)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Educational Resource
            </span>
            <h3 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem', fontSize: '1.75rem' }}>
              Want to learn more about {serviceName.toLowerCase()}?
            </h3>
            <p style={{ color: 'var(--color-gray-mid)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Read our comprehensive guide written by Certified Master Inspector Christopher Boykin.
            </p>
            <Link
              href={`/blog/${serviceData.relatedBlogSlug}`}
              className="btn btn-outline"
              style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)', padding: '0.75rem 2rem' }}
            >
              Read Expert Guide &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ── FOOTER CROSS-LINKING ────────────────────────────────────── */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {serviceName} in Nearby {county} County Communities
          </h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/service-areas/${resolvedParams.city}`}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem', background: 'white' }}
            >
              🏡 Full {cityName} Inspection Overview
            </Link>
            {nearbyCities.map(nc => (
              <Link
                key={nc['City Name']}
                href={`/services/${resolvedParams.service}/${toSlug(nc['City Name'])}`}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', background: 'white' }}
              >
                📍 {serviceName} in {nc['City Name']}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKING MESH ───────────────────────────────────── */}
      <RelatedServiceAreas currentCitySlug={resolvedParams.city} serviceSlug={resolvedParams.service} />

      {/* ── MOBILE STICKY CTA ───────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-sticky-cta { display: none; }
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
          body { padding-bottom: 80px; }
        }
      `}} />
      <div className="mobile-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'var(--color-white)', padding: '0.75rem 1rem', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', gap: '0.5rem', zIndex: 9999 }}>
        <a href="tel:6784802110" className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', fontSize: '1rem', background: 'var(--color-white)' }}>Call Now</a>
        <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', fontSize: '1rem' }}>Book Now</a>
      </div>
    </>
  );
}
