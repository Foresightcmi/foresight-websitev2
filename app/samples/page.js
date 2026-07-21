import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Sample Home Inspection Reports | Foresight Home Inspections Atlanta',
  description: 'View sample home inspection reports from Foresight Home Inspections. See how our dual-inspector model, FLIR thermal imaging, and 3-step reporting system deliver clear, buyer-friendly insights.',
  keywords: ['sample home inspection report Atlanta', 'HomeGauge sample report', 'home inspection sample Georgia', 'dual inspector report format'],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/samples',
  },
  openGraph: {
    title: 'Sample Home Inspection Reports | Foresight Atlanta',
    description: 'Explore interactive sample home inspection reports. Clear, photo-documented reports delivered within 24 hours.',
    url: 'https://www.fhinspectionsatl.com/samples',
    type: 'website',
  },
};

export default function SampleReports() {
  const sampleSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sample Home Inspection Reports",
    "description": "Interactive sample report preview for Foresight Home Inspections in Metro Atlanta.",
    "publisher": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sampleSchema) }}
      />

      <section className="section bg-dark text-white text-center" style={{ padding: '5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ marginBottom: '1rem' }}>Transparent Quality Assurance</span>
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Sample Home Inspection Reports</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
            See exactly what you will receive before you book. Every Foresight report is delivered within 24 hours in an easy-to-read digital format with high-resolution photos, thermal imaging, and prioritized repair action items.
          </p>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div className="card card-premium" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-mid)', paddingBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>The 3-Step Reporting System</h2>
                <p style={{ color: 'var(--color-gray-dark)', margin: '0.5rem 0 0 0' }}>No confusing technical jargon—just clear, actionable intelligence.</p>
              </div>
              <a 
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem' }}
              >
                📅 Schedule Inspection
              </a>
            </div>

            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              <div style={{ background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-red)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>1. The Observation</div>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.5 }}>
                  We clearly document what was observed (e.g., moisture staining on attic subflooring, outdated electrical panel, missing GFCI protection).
                </p>
              </div>
              <div style={{ background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-dark)' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>2. What This Means</div>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.5 }}>
                  We explain the real-world impact, potential safety hazard, or risk of future costly structural or mechanical damage.
                </p>
              </div>
              <div style={{ background: 'var(--color-white)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #34d399' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>3. Recommended Action</div>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.5 }}>
                  We provide a clear recommendation on the exact licensed trade contractor to evaluate further and repair before closing.
                </p>
              </div>
            </div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sample Report Highlights</h2>
          <div className="grid grid-2" style={{ gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🌡️</span>
                <h3 style={{ margin: 0 }}>FLIR Thermal Imaging Scan</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                Included on every standard inspection at no extra charge. Thermal scans identify hidden moisture leaks behind drywall, missing ceiling insulation, and overheating electrical breakers that visual inspection alone would miss.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>👥</span>
                <h3 style={{ margin: 0 }}>Two Inspectors on Site</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                Our dual-inspector model provides double the technical oversight while completing physical audits in 1.5 to 2.5 hours. Fast delivery ensures you meet tight option period deadlines.
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--color-white)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Ready to Get Your Detailed Digital Report?</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
              Book your certified dual-inspector home inspection today. All standard inspections are backed by our $10,000 Elite Master Inspection Warranty.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ padding: '0.85rem 2rem' }}
              >
                📅 Schedule Now via HomeGauge
              </a>
              <Link href="/quote" className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
                📊 Instant Quote Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
