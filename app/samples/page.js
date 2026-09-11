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
          {/* 🌟 ACTUAL LIVE SAMPLE REPORT SHOWCASE 🌟 */}
          <div className="card card-premium" style={{ marginBottom: '3.5rem', padding: '2.5rem', background: '#FFFFFF', borderTop: '4px solid var(--color-gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '0.75rem', fontWeight: 700 }}>
                  🌟 Real Client Report Example
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: '#0F172A' }}>
                  Actual Full Foresight Home Inspection Report
                </h2>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1.05rem', maxWidth: '750px', lineHeight: 1.6 }}>
                  Explore a complete, authentic digital inspection report delivered to a Metro Atlanta client. Features 220+ high-resolution photos, FLIR thermal imaging, crawlspace analysis, and prioritized repair summaries. <em>(Property address and personal client names have been redacted to protect client privacy.)</em>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="/sample-report/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>📄</span> Open Full Screen Report
                </a>
                <a
                  href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', fontWeight: 700, borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
                >
                  ⚡ Book Inspection
                </a>
              </div>
            </div>

            {/* Feature Badges */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
                <span>👥</span> Two Certified Inspectors
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
                <span>📸</span> 220+ Diagnostic Photos
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
                <span>🌡️</span> FLIR Thermal Scan Included
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
                <span>📝</span> HomeGauge CRL™ Repair List
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#0F172A', fontWeight: 600 }}>
                <span>🛡️</span> $10,000 Warranty Backed
              </div>
            </div>

            {/* Embedded Live Iframe Preview */}
            <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #CBD5E1', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#0F172A' }}>
              <div style={{ background: '#1E293B', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                  <span style={{ color: '#94A3B8', fontSize: '0.85rem', marginLeft: '0.75rem', fontFamily: 'monospace' }}>
                    https://www.fhinspectionsatl.com/sample-report/index.html
                  </span>
                </div>
                <a
                  href="/sample-report/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Open in New Window ↗
                </a>
              </div>
              <iframe
                src="/sample-report/index.html"
                title="Foresight Home Inspections Official Sample Report"
                style={{
                  width: '100%',
                  height: '680px',
                  border: 'none',
                  display: 'block',
                  backgroundColor: '#ffffff',
                }}
                loading="lazy"
              />
            </div>
          </div>

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

          {/* ═══════════════════════════════════════════════════════════════
              VISUAL DIAGNOSTIC ASSETS & INFOGRAPHICS (Image Link Authority)
          ═══════════════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
              <span className="badge" style={{ marginBottom: '0.75rem' }}>Educational Visual Assets</span>
              <h2>Georgia Due Diligence & Home Inspection Infographics</h2>
              <p style={{ color: 'var(--color-gray-dark)', maxWidth: '750px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
                Free visual guides and decision frameworks for Georgia homebuyers, realtors, and property investors.
              </p>
            </div>

            <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* Infographic Card 1 */}
              <div className="card card-premium" style={{ background: '#FFFFFF', padding: '1.75rem', borderTop: '4px solid var(--color-red)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-dark)' }}>
                  Georgia 7-Day Due Diligence Flowchart
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  A step-by-step roadmap from contract binding to on-site dual inspection, same-day report review, and submitting the GAR Amendment to Address Concerns.
                </p>
                <div style={{ padding: '0.75rem', background: 'var(--color-gray-light)', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Key Takeaway:</strong> Schedule within 48h to preserve at least 3 full days for contractor bids and repair negotiations.
                </div>
              </div>

              {/* Infographic Card 2 */}
              <div className="card card-premium" style={{ background: '#FFFFFF', padding: '1.75rem', borderTop: '4px solid var(--color-gold)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-dark)' }}>
                  FLIR Thermal Anomaly Delta Guide
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Explains the 5°F to 10°F infrared temperature differential that unmasks hidden moisture leaks behind tile, missing insulation batts, and overloaded circuit breakers.
                </p>
                <div style={{ padding: '0.75rem', background: 'var(--color-gray-light)', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Key Takeaway:</strong> Non-invasive detection finds concealed water intrusion without cutting into finished drywall.
                </div>
              </div>

              {/* Infographic Card 3 */}
              <div className="card card-premium" style={{ background: '#FFFFFF', padding: '1.75rem', borderTop: '4px solid var(--color-dark)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏛️</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-dark)' }}>
                  Atlanta Red Clay Soil & Foundation Matrix
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Diagnoses stair-step brick cracks, hydrostatic crawlspace pressure, and soil shrinkage voids across North Georgia topography.
                </p>
                <div style={{ padding: '0.75rem', background: 'var(--color-gray-light)', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Key Takeaway:</strong> Proper 6-foot gutter discharge prevents 85% of soil expansion settlement defects.
                </div>
              </div>
            </div>

            {/* Media Kit & Embed Attribution Box */}
            <div style={{ background: 'var(--color-dark)', color: '#FFFFFF', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.25rem' }}>
                  📢 Realtors & Publishers: Embed Our Inspection Data
                </h3>
                <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '50px' }}>
                  Creative Commons Attribution License
                </span>
              </div>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Feel free to use our diagnostic data, sample report summaries, and due diligence frameworks on your real estate blog or client guides. Simply provide link attribution back to Foresight Home Inspections.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '0.85rem', overflowX: 'auto', color: '#38bdf8' }}>
                {`<!-- Foresight Home Inspections Attribution Badge -->\n<a href="https://www.fhinspectionsatl.com" target="_blank" rel="noopener">\n  <img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections Atlanta Certified Master Inspector" width="200" height="150" />\n</a>\n<p>Inspection data provided by <a href="https://www.fhinspectionsatl.com">Foresight Home Inspections Atlanta</a></p>`}
              </div>
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
