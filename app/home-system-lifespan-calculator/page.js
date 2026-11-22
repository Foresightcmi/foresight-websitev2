import Link from 'next/link';
import LifespanGraderWrapper from './LifespanGraderWrapper';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Georgia Home System Lifespan & Replacement Cost Calculator',
  description: 'Free Georgia climate-adjusted roof, HVAC, water heater, plumbing, and electrical panel lifespan calculator for homebuyers and Realtors during due diligence.',
  alternates: { canonical: `${SITE_URL}/home-system-lifespan-calculator` },
  openGraph: {
    title: 'Georgia Home System Lifespan & Replacement Cost Calculator',
    description: 'Check remaining roof, HVAC, water heater, and plumbing lifespan under Metro Atlanta heat and humidity before due diligence closes.',
    url: `${SITE_URL}/home-system-lifespan-calculator`,
    type: 'website'
  }
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Georgia Home System Lifespan & Inspection ROI Grader',
  operatingSystem: 'All Web Browsers',
  applicationCategory: 'UtilitiesApplication',
  url: `${SITE_URL}/home-system-lifespan-calculator`,
  offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' }
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does an architectural shingle roof last in Metro Atlanta?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While shingle manufacturers print 25-to-30-year labels, intense Georgia summer attic temperatures and severe convective hail/wind storms typically yield an effective service life of 16 to 20 years across Metro Atlanta.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the average lifespan of an HVAC system in Georgia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Central air conditioners and heat pumps operating through humid Georgia summers average 12 to 15 years before compressor or evaporator coil replacement becomes necessary.'
      }
    }
  ]
};

export default function HomeSystemLifespanPage() {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 20px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <h1 style={{ fontSize: '2.1rem', marginBottom: '14px' }}>
        Georgia Home System Lifespan &amp; Due Diligence Cost Grader
      </h1>

      <div id="aeo-direct-answer" style={{ background: '#f8fafc', color: '#0f172a', borderLeft: '4px solid #D4AF37', padding: '16px 20px', borderRadius: '8px', marginBottom: '28px' }}>
        <strong>Direct Answer:</strong> In Metro Atlanta, high summer attic heat and humidity shorten mechanical and roof service lives compared to northern climates: architectural shingle roofs average 16–20 years, central HVAC units average 12–15 years, and tank water heaters average 8–12 years. Buyers should pair system serial-plate decoding with a <Link href="/services/buyer-inspection">two-inspector buyer home inspection</Link> (From $345) before Georgia due diligence expires.
      </div>

      <LifespanGraderWrapper />

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.45rem', marginBottom: '12px' }}>Georgia Climate Lifespan Reference Table</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Home Component</th>
                <th style={{ padding: '10px' }}>GA Effective Life</th>
                <th style={{ padding: '10px' }}>Typical Metro Atlanta Replacement Range</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px' }}>3-Tab / Architectural Shingle Roof</td><td style={{ padding: '10px' }}>16–20 Years</td><td style={{ padding: '10px' }}>$7,500 – $14,200+</td></tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px' }}>Split Central AC / Heat Pump</td><td style={{ padding: '10px' }}>12–15 Years</td><td style={{ padding: '10px' }}>$5,800 – $11,500+</td></tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}><td style={{ padding: '10px' }}>Gas or Electric Tank Water Heater</td><td style={{ padding: '10px' }}>8–12 Years</td><td style={{ padding: '10px' }}>$1,450 – $2,900</td></tr>
              <tr><td style={{ padding: '10px' }}>Polybutylene Supply Piping (1978–1995)</td><td style={{ padding: '10px' }}>Obsolete / High Leak Risk</td><td style={{ padding: '10px' }}>$4,500 – $12,000+</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '14px', fontSize: '0.92rem' }}>
          Compare appliance energy baselines at <a href="https://www.energy.gov/energysaver/water-heating" target="_blank" rel="noopener noreferrer">U.S. Department of Energy Energy Saver</a>, verify deadline windows with our <Link href="/due-diligence">Georgia Due Diligence Calculator</Link>, or call (678) 480-2110 for auxiliary diagnostics (Sewer Scope, Radon, Termite/WDO, Mold/IAQ, Pool/Spa — Call for Quote).
        </p>
      </section>
    </main>
  );
}
