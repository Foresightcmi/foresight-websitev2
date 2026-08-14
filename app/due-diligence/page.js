import Link from 'next/link';
import Script from 'next/script';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Georgia Due Diligence Defense System | Fast 48-Hour Home Inspections',
  description: 'Protect your Georgia Due Diligence period. Guaranteed 48-hour inspection scheduling, same-day digital reports in under 24 hours, and $10,000 warranty protection.',
  keywords: [
    'Georgia due diligence period home inspection',
    'fast home inspection Atlanta',
    '48 hour home inspector Georgia',
    'rush home inspection Atlanta',
    'GAR amendment repair list inspection',
    'due diligence timeline real estate Georgia',
    'emergency home inspection Atlanta'
  ],
  alternates: { canonical: `${SITE_URL}/due-diligence` },
  openGraph: {
    title: 'Georgia Due Diligence Defense System | Foresight Home Inspections',
    description: 'Never lose your negotiating window. Dual-inspector speed, 48-hour guaranteed booking, and same-day reports for tight Georgia contracts.',
    url: `${SITE_URL}/due-diligence`,
  },
};

const dueDiligenceFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: `${SITE_URL}/due-diligence`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long is the typical Georgia Due Diligence period?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In standard Georgia Association of Realtors (GAR) contracts, due diligence periods typically range from 5 to 10 calendar days. During this strict window, the buyer must complete all physical evaluations, negotiate repairs or credits via an Amendment to Address Concerns, or terminate the contract with earnest money returned.',
      },
    },
    {
      '@type': 'Question',
      name: 'How quickly can Foresight conduct an inspection after contract binding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Through our dual-inspector operational model, we guarantee scheduling availability within 48 hours of contract binding. You can also self-schedule online 24/7 directly through our HomeGauge scheduling portal.',
      },
    },
    {
      '@type': 'Question',
      name: 'When will I receive my digital inspection report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Guaranteed within 24 hours of inspection completion (and frequently the same evening). Our reports include high-definition photos, FLIR thermal imaging scans, drone footage, and the interactive Create Request List (CRL) tool to generate repair amendments in one click.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the two-inspector team help protect my due diligence timeline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A solo inspector typically takes 3.5 to 5 hours on site and requires 24 to 48 hours to draft a narrative report. Foresight sends two certified inspectors who complete the comprehensive on-site diagnostic in 1.5 to 2.5 hours, allowing rapid report finalization so your agent has maximum days left to negotiate.',
      },
    },
  ],
};

const dueDiligenceServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${SITE_URL}/due-diligence#service`,
  name: 'Georgia Due Diligence Defense System',
  serviceType: 'Rapid Turnaround Due Diligence Inspection',
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
    '@type': 'State',
    name: 'Georgia',
  },
  description: 'Fast-turnaround residential home inspection service designed specifically for Georgia 5-to-10 day due diligence contract deadlines. 48-hour scheduling window guarantee, same-day report delivery, and $10,000 warranty protection.',
};

export default function DueDiligencePage() {
  return (
    <>
      <Script
        id="due-diligence-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dueDiligenceFaqSchema) }}
      />
      <Script
        id="due-diligence-service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dueDiligenceServiceSchema) }}
      />

      {/* Hero Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '5.5rem 0 4.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge" style={{ marginBottom: '1.25rem', background: 'rgba(211,47,47,0.2)', color: 'var(--color-red-light)', fontSize: '0.9rem' }}>
            ⏱️ Contract Timeline Protection
          </span>
          <h1 style={{ color: 'var(--color-white)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.15 }}>
            The Georgia Due Diligence<br />
            <span style={{ color: 'var(--color-red-light)' }}>Defense System</span>
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto 2.25rem', fontSize: '1.2rem', lineHeight: 1.6 }}>
            In Georgia real estate, you have a strict 5-to-10 day Due Diligence clock. Don't let a slow inspector burn your negotiation window. Foresight pairs dual-inspector speed with guaranteed 48-hour scheduling and same-day reports.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.95rem 2.25rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              ⚡ Priority Schedule Inspection (24/7)
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '0.95rem 2.25rem', fontSize: '1.1rem', borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontWeight: 700 }}
            >
              📞 Call for Rush Slot: 678-480-2110
            </a>
          </div>
        </div>
      </section>

      {/* The 3 Ironclad Guarantees */}
      <section className="section bg-white" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Our Commitment</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>The 3 Pillars of Your Due Diligence Defense</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0.75rem auto 0', fontSize: '1.1rem' }}>
              Engineered so buyers and agents never risk missing contract milestones or leaving repair credits on the table.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {/* Pillar 1 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '2.5rem 2rem', borderRadius: '12px', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>📅</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Guaranteed 48-Hour Scheduling Window
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: 1.6, flexGrow: 1 }}>
                Once your purchase agreement is binding, you cannot afford to wait 4 to 6 days for an open slot. Our dual-inspector team guarantees an on-site appointment within 48 hours across 163+ Metro Atlanta cities.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '2.5rem 2rem', borderRadius: '12px', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Same-Day Digital Report Delivery
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: 1.6, flexGrow: 1 }}>
                Your complete digital report is delivered within 24 hours of inspection (usually the same evening). Complete with HD photos, FLIR thermal imaging, drone captures, and the 1-click Create Request List (CRL) tool for instant GAR repair addendums.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '2.5rem 2rem', borderRadius: '12px', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                $10,000 Post-Closing Master Warranty
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: 1.6, flexGrow: 1 }}>
                Eliminate closing anxiety. Every standard buyer inspection includes our complimentary $10,000 Elite Master Inspection Warranty ($0 deductible) covering major appliances, structural framing, HVAC, electrical, plumbing, mold, and roof leaks for 90 days from closing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Georgia Due Diligence Timeline Breakdown */}
      <section className="section bg-light" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>The Due Diligence Timeline</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>How Foresight Wins Back Your 7-Day Window</h2>
          </div>

          <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--color-red)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem' }}>Day 1: Binding Contract Acceptance</h3>
                    <p style={{ margin: 0, color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      You book online in 60 seconds or call our priority desk. We confirm your inspection time and coordinate SUPRA key access automatically.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--color-red)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem' }}>Day 2–3: Dual-Inspector Diagnostic Audit</h3>
                    <p style={{ margin: 0, color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Two certified inspectors evaluate structure, electrical, HVAC, plumbing, roof, and foundation in 1.5–2.5 hours with FLIR thermal and drones.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--color-red)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem' }}>Day 3 Evening: Same-Day Report &amp; CRL™ Tool</h3>
                    <p style={{ margin: 0, color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      You receive your digital report with prioritized defects, repair estimates, and 1-click clause generation for your agent's GAR amendment.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--color-gold)', color: 'var(--color-dark)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>4</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem' }}>Day 4–7: Confident Negotiation Leverage</h3>
                    <p style={{ margin: 0, color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Your agent submits the amendment with days to spare, securing repair credits or contractor fixes with zero panic before the deadline expires.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-dark)', color: 'var(--color-white)', padding: '2.5rem', borderRadius: '12px' }}>
              <span className="badge" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--color-gold)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                Why Solo Inspectors Fail the Clock
              </span>
              <h3 style={{ color: 'var(--color-white)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                The "Discount" Inspector Bottleneck
              </h3>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                A typical solo inspector takes 4+ hours on site and requires 24–48 hours just to type up a PDF report. If they don't inspect until Day 4, you might not receive your report until Day 6 — leaving your agent less than 24 hours to obtain contractor bids and submit the amendment.
              </p>
              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--color-red-light)' }}>
                <strong style={{ color: 'var(--color-white)', display: 'block', marginBottom: '0.35rem' }}>
                  The Foresight Difference:
                </strong>
                <p style={{ margin: 0, color: 'var(--color-gray-mid)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Two certified inspectors finish the inspection faster and deliver comprehensive findings the same evening, preserving maximum days for your negotiations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Due Diligence FAQs */}
      <section className="section bg-white" style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Common Questions</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Georgia Due Diligence FAQs</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {dueDiligenceFaqSchema.mainEntity.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: 'var(--color-gray-light)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <summary style={{ fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', color: 'var(--color-dark)' }}>
                  {faq.name}
                </summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--color-gray-dark)', fontSize: '0.98rem', lineHeight: 1.65, margin: '0.75rem 0 0' }}>
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ color: 'var(--color-white)', fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Protect Your Due Diligence Window?
          </h2>
          <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Book now to lock in your 48-hour inspection slot. Certified Master Inspector Christopher Boykin and our two-inspector team are ready across Metro Atlanta.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.95rem 2.25rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              📅 Book Online 24/7 (Instant Confirmation)
            </a>
            <Link
              href="/quote"
              className="btn btn-outline"
              style={{ padding: '0.95rem 2.25rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}
            >
              📊 Instant Fee Calculator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
