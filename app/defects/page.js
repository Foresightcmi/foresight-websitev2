import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import GooglePreferredSource from '../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadDefects() {
  const filePath = path.join(process.cwd(), 'data', 'defects-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export const metadata = {
  title: 'Red-Flag Defect Inspection Guides | Atlanta Home Inspector',
  description: 'Comprehensive diagnostic guides for high-risk Atlanta property defects: Stucco/EIFS moisture, Aluminum Wiring, Federal Pacific panels, CSST gas piping, and Polybutylene.',
  keywords: [
    'Atlanta home inspection defects',
    'stucco moisture inspection Atlanta',
    'aluminum wiring inspector Georgia',
    'federal pacific panel inspection',
    'polybutylene plumbing Atlanta'
  ],
  alternates: {
    canonical: `${SITE_URL}/defects`,
  },
  openGraph: {
    title: 'Red-Flag Defect Inspection Guides | Foresight',
    description: 'Detailed diagnostic guides for major structural, electrical, and plumbing red-flags in Metro Atlanta.',
    url: `${SITE_URL}/defects`,
    type: 'website',
  },
};

export default function DefectsHubPage() {
  const defects = loadDefects();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Red-Flag Property Defect Diagnostic Guides",
    "description": "Engineering and inspection guides for identifying dangerous or costly property defects in Georgia homes.",
    "url": `${SITE_URL}/defects`,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "url": SITE_URL
    },
    "hasPart": defects.map(d => ({
      "@type": "WebPage",
      "name": d.title,
      "url": `${SITE_URL}/defects/${d.slug}`
    }))
  };

  return (
    <>
      <Script
        id="defects-hub-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="badge" style={{ background: 'rgba(211, 47, 47, 0.2)', color: 'var(--color-red-light)', border: '1px solid var(--color-red)', marginBottom: '1.25rem' }}>
            ⚠️ Diagnostic Red-Flag Library
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Major Property Defect Inspection Guides
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, maxWidth: '750px', margin: '0 auto 2rem' }}>
            Learn how Foresight&apos;s two-inspector team diagnoses catastrophic building defects before closing, protecting your health, insurance eligibility, and home equity.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {defects.map((d) => (
              <div
                key={d.slug}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.25rem',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem' }}>{d.icon || '🔍'}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(211, 47, 47, 0.1)', color: 'var(--color-red)', padding: '0.25rem 0.65rem', borderRadius: '1rem' }}>
                      {d.badge || 'Defect Alert'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {d.title.split('|')[0].trim()}
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {d.summary ? d.summary.substring(0, 130) + '...' : d.metaDescription}
                  </p>
                </div>
                <Link
                  href={`/defects/${d.slug}`}
                  prefetch={false}
                  className="btn btn-outline"
                  style={{ width: '100%', textAlign: 'center', padding: '0.8rem', borderColor: 'var(--color-red)', color: 'var(--color-red)', fontWeight: 700 }}
                >
                  View Defect Analysis &rarr;
                </Link>
              </div>
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
