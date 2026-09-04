import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import GooglePreferredSource from '../../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadCounties() {
  const filePath = path.join(process.cwd(), 'data', 'counties-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export const metadata = {
  title: 'Metro Atlanta County Inspection Services | 20 Counties',
  description: 'Certified Master Inspector coverage across all 20 Metro Atlanta and North Georgia counties. Dual-inspector precision, FLIR thermal imaging, and $10,000 warranty protection.',
  keywords: [
    'Metro Atlanta home inspection counties',
    'Fulton County home inspector',
    'DeKalb County home inspection',
    'Gwinnett County home inspector',
    'Cobb County home inspection',
    'Georgia county home inspections'
  ],
  alternates: {
    canonical: `${SITE_URL}/service-areas/counties`,
  },
  openGraph: {
    title: 'Metro Atlanta County Inspection Services | Foresight',
    description: 'Two certified inspectors on every job across 20 Georgia counties. $10,000 warranty included.',
    url: `${SITE_URL}/service-areas/counties`,
    type: 'website',
  },
};

export default function CountiesHubPage() {
  const counties = loadCounties();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Metro Atlanta County Inspection Coverage Directory",
    "description": "Comprehensive directory of home inspection services across 20 Metro Atlanta and North Georgia counties.",
    "url": `${SITE_URL}/service-areas/counties`,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "url": SITE_URL
    },
    "hasPart": counties.map(c => ({
      "@type": "WebPage",
      "name": `${c.name} Home Inspection Services`,
      "url": `${SITE_URL}/service-areas/counties/${c.slug}`
    }))
  };

  return (
    <>
      <Script
        id="counties-hub-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1.25rem' }}>
            🏛️ Regional County Coverage
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Metro Atlanta &amp; North Georgia County Inspection Directory
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, maxWidth: '750px', margin: '0 auto 2rem' }}>
            Foresight Home Inspections deploys two certified inspectors on every evaluation across 20 counties in Metro Atlanta and North Georgia. Select your county below for specialized local building codes, soil considerations, and municipal guidelines.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.9rem 2rem' }}>
              📅 Schedule County Inspection
            </a>
            <Link href="/service-areas" className="btn btn-outline-light" style={{ padding: '0.9rem 2rem' }}>
              🏙️ View 87 City Hubs
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.75rem' }}>
              Explore Our 20 Covered Georgia Counties
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
              Each county hub details localized soil expansion risks, radon concentrations, sewer infrastructure, and municipal real estate inspection standards.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {counties.map((c) => (
              <Link
                key={c.slug}
                href={`/service-areas/counties/${c.slug}`}
                prefetch={false}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>📍</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(211, 47, 47, 0.1)', color: 'var(--color-red)', padding: '0.25rem 0.65rem', borderRadius: '1rem' }}>
                      2-Inspector Team
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '0.925rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {c.summary ? c.summary.substring(0, 110) + '...' : `Comprehensive dual-inspector coverage across all cities and communities in ${c.name}.`}
                  </p>
                </div>
                <div style={{ color: 'var(--color-red)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Explore {c.name} Guide <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
            <GooglePreferredSource variant="card" />
          </div>
        </div>
      </section>
    </>
  );
}
