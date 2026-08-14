import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Atlanta Neighborhood & Subdivision Home Inspections | Foresight',
  description: 'Specialized home inspection guides for Metro Atlanta\'s prominent historic districts, luxury enclaves, and master-planned communities. Certified Master Inspector diagnostic audits.',
  keywords: [
    'Atlanta neighborhood home inspection',
    'historic district home inspection Atlanta',
    'Buckhead home inspector',
    'Inman Park home inspection',
    'Grant Park home inspection',
    'Virginia Highland home inspector',
    'Windward Alpharetta home inspection',
    'Sugarloaf Duluth home inspector'
  ],
  alternates: { canonical: `${SITE_URL}/neighborhoods` },
  openGraph: {
    title: 'Metro Atlanta Neighborhood & Subdivision Inspections | Foresight',
    description: 'Expert diagnostic inspections tailored to the specific construction eras and defect risks of Atlanta\'s premier communities.',
    url: `${SITE_URL}/neighborhoods`,
  },
};

function loadNeighborhoods() {
  const filePath = path.join(process.cwd(), 'data', 'neighborhoods-pseo.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export default function NeighborhoodsIndexPage() {
  const neighborhoods = loadNeighborhoods();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Metro Atlanta Neighborhood Home Inspection Guides',
    itemListElement: neighborhoods.map((n, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${n.name}, ${n.city} GA Home Inspection`,
      url: `${SITE_URL}/neighborhoods/${n.slug}`,
    })),
  };

  return (
    <>
      <Script
        id="neighborhoods-itemlist-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge" style={{ marginBottom: '1.25rem', background: 'rgba(211,47,47,0.2)', color: 'var(--color-red-light)', fontSize: '0.9rem' }}>
            🏛️ Hyper-Local Neighborhood Expertise
          </span>
          <h1 style={{ color: 'var(--color-white)', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.15 }}>
            Atlanta Neighborhood &amp; Subdivision Hubs
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '780px', margin: '0 auto 2rem', fontSize: '1.2rem', lineHeight: 1.6 }}>
            Every Atlanta community has its own distinct architectural era, soil dynamics, and hidden defect profile. Explore our specialized due diligence guides for historic districts and luxury golf communities.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/service-areas" className="btn btn-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>
              🏙️ View All 163+ Service Cities
            </Link>
            <Link href="/quote" className="btn btn-primary">
              📊 Calculate Instant Fee
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of Neighborhoods */}
      <section className="section bg-light" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {neighborhoods.map((hood) => (
              <div
                key={hood.slug}
                className="card card-premium"
                style={{
                  background: 'var(--color-white)',
                  padding: '2.25rem',
                  borderRadius: '12px',
                  borderTop: '4px solid var(--color-red)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="badge" style={{ fontSize: '0.8rem', background: 'rgba(211,47,47,0.1)', color: 'var(--color-red)' }}>
                    {hood.type}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-mid)', fontWeight: 600 }}>
                    {hood.city}, GA ({hood.county} Co.)
                  </span>
                </div>

                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <Link href={`/neighborhoods/${hood.slug}`} style={{ color: 'var(--color-dark)', textDecoration: 'none' }}>
                    {hood.name}
                  </Link>
                </h2>

                <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.98rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '1.25rem' }}>
                  {hood.intro}
                </p>

                <div style={{ padding: '0.85rem', background: 'var(--color-gray-light)', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--color-dark)' }}>Primary Diagnostic Priorities:</strong>
                  <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem', color: 'var(--color-gray-dark)' }}>
                    {hood.keyDefects.slice(0, 2).map((kd, i) => (
                      <li key={i}>{kd.title}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                    Era: {hood.era}
                  </span>
                  <Link
                    href={`/neighborhoods/${hood.slug}`}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    View Due Diligence Guide →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Card */}
      <section className="section bg-white text-center" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Need an Inspection in Another Neighborhood?
          </h2>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Foresight covers over 163+ cities and hundreds of subdivisions throughout Metro Atlanta with our signature dual-inspector model and guaranteed 24-hour report turnaround.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/service-areas" className="btn btn-primary">
              Browse All 163+ Service Areas
            </Link>
            <Link href="/quote" className="btn btn-outline" style={{ borderColor: 'var(--color-dark)', color: 'var(--color-dark)' }}>
              Calculate Inspection Fee
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
