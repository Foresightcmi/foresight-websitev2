import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import GooglePreferredSource from '../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadComparisons() {
  const filePath = path.join(process.cwd(), 'data', 'comparisons-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export const metadata = {
  title: 'Home Inspection Comparison Guides | Foresight Atlanta',
  description: 'Expert comparison frameworks for Atlanta homebuyers. Compare two-inspector teams vs solo inspectors, 11-month builder warranties, and pre-purchase inspections vs appraisals.',
  keywords: [
    'two inspector team vs single inspector',
    '11 month warranty vs builder walkthrough',
    'home inspection vs appraisal Atlanta',
    'home inspection comparison guides'
  ],
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
  openGraph: {
    title: 'Home Inspection Comparison Guides | Foresight',
    description: 'Expert frameworks comparing inspection standards, builder warranties, and team structures in Metro Atlanta.',
    url: `${SITE_URL}/compare`,
    type: 'website',
  },
};

export default function CompareHubPage() {
  const comparisons = loadComparisons();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Home Inspection Comparison Frameworks",
    "description": "Authoritative decision frameworks comparing inspection types, warranties, and service methodologies.",
    "url": `${SITE_URL}/compare`,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "url": SITE_URL
    },
    "hasPart": comparisons.map(c => ({
      "@type": "WebPage",
      "name": c.title,
      "url": `${SITE_URL}/compare/${c.slug}`
    }))
  };

  return (
    <>
      <Script
        id="compare-hub-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1.25rem' }}>
            ⚖️ Decision Frameworks
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Home Inspection Decision &amp; Comparison Guides
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, maxWidth: '750px', margin: '0 auto 2rem' }}>
            Understand the critical differences between inspection models, new construction warranty rights, and appraisal limits so you can make informed decisions on your property investment.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {comparisons.map((c) => (
              <div
                key={c.slug}
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
                    <span style={{ fontSize: '2rem' }}>{c.icon || '⚖️'}</span>
                    <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#854D0E', fontSize: '0.75rem', fontWeight: 700 }}>
                      {c.badge || 'Comparison'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {c.title.split('|')[0].trim()}
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {c.summary ? c.summary.substring(0, 140) + '...' : c.metaDescription}
                  </p>
                </div>
                <Link
                  href={`/compare/${c.slug}`}
                  prefetch={false}
                  className="btn btn-outline"
                  style={{ width: '100%', textAlign: 'center', padding: '0.8rem', borderColor: 'var(--color-red)', color: 'var(--color-red)', fontWeight: 700 }}
                >
                  Read Full Comparison &rarr;
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
