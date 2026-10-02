import Link from 'next/link';
import Script from 'next/script';
import WatchVideoPlayer from '../../components/WatchVideoPlayer';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const PAGE_URL = `${SITE_URL}/videos/complete-home-systems-diagnostic`;

export const metadata = {
  title: 'Complete Home Systems Diagnostic Video | Foresight Home Inspections',
  description: 'Watch Certified Master Inspector Christopher Boykin demonstrate our two-inspector diagnostic protocol across Atlanta home systems: HVAC, 200A panels, crawlspace, and FLIR thermal imaging.',
  keywords: [
    'home inspection video Atlanta',
    'certified master inspector demonstration Georgia',
    'two inspector home inspection video',
    'FLIR thermal imaging inspection video Atlanta',
    'crawlspace foundation inspection demonstration',
    'Foresight home systems inspection commercial'
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Complete Home Systems Diagnostic Field Demonstration | Foresight Home Inspections',
    description: 'Lead Certified Master Inspector® Christopher Boykin demonstrates major Atlanta home systems evaluations, diagnostic technology, and two-inspector thoroughness in the field.',
    url: PAGE_URL,
    type: 'video.other',
    videos: [
      {
        url: `${SITE_URL}/videos/foresight-home-systems.mp4`,
        width: 720,
        height: 1280,
        type: 'video/mp4'
      }
    ],
    images: [
      {
        url: `${SITE_URL}/images/home-systems-poster.webp`,
        width: 1200,
        height: 675,
        alt: 'Certified Master Inspector Christopher Boykin evaluating Atlanta home systems'
      }
    ]
  }
};

const watchPageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'VideoObject',
      '@id': `${PAGE_URL}#video`,
      name: 'Foresight Home Inspections: Complete Home Systems Diagnostic Commercial & Field Demonstration',
      description: 'Lead Certified Master Inspector® Christopher Boykin demonstrates our two-inspector diagnostic protocol across Metro Atlanta home systems, covering HVAC, 200A electrical service panels, structural crawlspaces, and FLIR thermal infrared scans.',
      thumbnailUrl: [`${SITE_URL}/images/home-systems-poster.webp`],
      uploadDate: '2026-09-13T22:00:00Z',
      duration: 'PT1M19S',
      contentUrl: `${SITE_URL}/videos/foresight-home-systems.mp4`,
      embedUrl: PAGE_URL,
      inLanguage: 'en-US',
      publisher: {
        '@type': 'Organization',
        name: 'Foresight Home Inspections',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/hero-inspector-tablet.webp`
        }
      },
      hasPart: [
        {
          '@type': 'Clip',
          name: 'Introduction & Two-Inspector Standard',
          startOffset: 0,
          endOffset: 15,
          url: `${PAGE_URL}#t=0`
        },
        {
          '@type': 'Clip',
          name: 'Mechanical & HVAC Air Distribution',
          startOffset: 15,
          endOffset: 35,
          url: `${PAGE_URL}#t=15`
        },
        {
          '@type': 'Clip',
          name: 'Electrical Panel & FLIR Thermal Imaging',
          startOffset: 35,
          endOffset: 55,
          url: `${PAGE_URL}#t=35`
        },
        {
          '@type': 'Clip',
          name: 'Crawlspace & Structural Foundations',
          startOffset: 55,
          endOffset: 70,
          url: `${PAGE_URL}#t=55`
        },
        {
          '@type': 'Clip',
          name: 'Same-Day Digital Reports & Guarantee',
          startOffset: 70,
          endOffset: 79,
          url: `${PAGE_URL}#t=70`
        }
      ]
    },
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Complete Home Systems Diagnostic Field Demonstration | Foresight Home Inspections',
      description: 'Official watch page for the Foresight Home Inspections complete home systems diagnostic field demonstration.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${PAGE_URL}#video` }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Videos',
          item: `${SITE_URL}/videos`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Complete Home Systems Diagnostic',
          item: PAGE_URL
        }
      ]
    }
  ]
};

export default function WatchPage() {
  return (
    <>
      <Script
        id="watch-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(watchPageSchema) }}
      />

      <main style={{ background: '#090D16', color: '#F8FAFC', minHeight: '100vh', padding: '3rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '980px', margin: '0 auto', padding: '0 1.25rem' }}>
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
            <Link href="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 0.5rem', color: '#64748B' }}>/</span>
            <Link href="/videos" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Videos</Link>
            <span style={{ margin: '0 0.5rem', color: '#64748B' }}>/</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Home Systems Diagnostic</span>
          </nav>

          {/* Main Watch Page Header (H1) */}
          <header style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', borderRadius: '9999px', padding: '0.35rem 0.95rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              🎥 Official Field Inspection Video
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.2, color: '#FFFFFF', margin: '0 0 0.75rem 0' }}>
              Complete Home Systems Diagnostic Field Demonstration
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '820px', lineHeight: 1.6, margin: 0 }}>
              Lead Certified Master Inspector® <strong>Christopher Boykin</strong> walks you through Foresight&apos;s signature two-inspector evaluation protocol on an active Metro Atlanta property, evaluating critical mechanical, electrical, plumbing, and structural components.
            </p>
          </header>

          {/* Primary Featured Video Player (The Main Content / Watch Element) */}
          <section aria-label="Featured Video Player" style={{ marginBottom: '3rem' }}>
            <WatchVideoPlayer />
          </section>

          {/* Quick Action / Direct Conversion Bar */}
          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.9)', 
              border: '1px solid rgba(212, 175, 55, 0.3)', 
              borderRadius: '14px', 
              padding: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
                Need Two Certified Inspectors on Your Atlanta Property?
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94A3B8' }}>
                Guaranteed 48-hour booking window • Same-day digital reports • $35,000 warranty protection
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ padding: '0.85rem 1.75rem', fontWeight: 700, fontSize: '0.95rem' }}
              >
                📅 Schedule Inspection
              </a>
              <Link
                href="/quote"
                className="btn btn-outline-light"
                style={{ padding: '0.85rem 1.75rem', fontWeight: 700, fontSize: '0.95rem' }}
              >
                📊 Instant Quote
              </Link>
            </div>
          </div>

          {/* Diagnostic Checkpoints Breakdown */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              Technical Checkpoints Demonstrated in This Field Audit
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Card 1 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.85rem' }}>SYSTEM 01</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.35rem 0 0.5rem 0' }}>
                  Mechanical & HVAC Temperature Differential (ΔT)
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  We test cooling splits and heating performance across supply and return plenums using calibrated digital psychrometers, verifying correct compressor draw and condensate line drainage.
                </p>
              </div>

              {/* Card 2 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.85rem' }}>SYSTEM 02</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.35rem 0 0.5rem 0' }}>
                  200A Electrical Panel & Thermal Scanning
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  Main service entrance conductors, branch circuit sizing, double-tapped neutral bars, and circuit breakers are evaluated under active electrical load with FLIR infrared thermography.
                </p>
              </div>

              {/* Card 3 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.85rem' }}>SYSTEM 03</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.35rem 0 0.5rem 0' }}>
                  Crawlspace, Sill Plates & Pier Foundations
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  Physical traversal of the subfloor envelope checks wood moisture content (&lt;16%), masonry pier alignment, vapor barrier integrity (min 6 mil), and signs of fungal or wood-destroying organism damage.
                </p>
              </div>

              {/* Card 4 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.85rem' }}>SYSTEM 04</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.35rem 0 0.5rem 0' }}>
                  Two-Inspector Operational Synergy
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                  While the Lead Certified Master Inspector audits complex roof, attic, and MEP systems, the Senior Inspector methodically tests every interior window, GFCI/AFCI receptacle, and plumbing fixture.
                </p>
              </div>
            </div>
          </section>

          {/* Full Word-for-Word Audio/Video Transcript */}
          <section style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              Full Video Transcript
            </h2>
            <div 
              style={{ 
                background: 'rgba(15, 23, 42, 0.65)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '1.75rem',
                fontSize: '0.95rem',
                lineHeight: 1.8,
                color: '#CBD5E1'
              }}
            >
              <p>
                <strong>[00:00 - Christopher Boykin, CMI®]:</strong> &ldquo;Welcome to Foresight Home Inspections. When you purchase a property in Metro Atlanta, you cannot afford guesswork. That is why on every single job, we deploy our signature Two-Inspector Standard—giving you two pairs of certified eyes on every critical system of the home.&rdquo;
              </p>
              <p>
                <strong>[00:15 - Mechanical &amp; HVAC Systems]:</strong> &ldquo;We examine the heating, ventilation, and air conditioning systems under real operational loads. We check the return and supply air temperature splits, inspect the evaporator coils, verify safety condensate overflow switches, and ensure your combustion exhaust flues are venting properly.&rdquo;
              </p>
              <p>
                <strong>[00:35 - Electrical &amp; Thermal Diagnostics]:</strong> &ldquo;Inside the main electrical distribution panel, we confirm conductor gauge compatibility, test all GFCI and AFCI breakers, and use advanced FLIR infrared thermography to detect hidden electrical hotspots or loose connections that standard visual checks miss.&rdquo;
              </p>
              <p>
                <strong>[00:55 - Crawlspace &amp; Structural Envelope]:</strong> &ldquo;From the attic trusses down to the crawlspace piers and subflooring, we evaluate the structural integrity of your foundation, wood moisture content, and plumbing supply lines, giving you complete clarity on the true condition of the property.&rdquo;
              </p>
              <p>
                <strong>[01:10 - Same-Day Reporting &amp; Warranty]:</strong> &ldquo;Every inspection is delivered same-day in our digital interactive portal with high-definition photos, video clips, and our $35,000 warranty and guarantee protection. Visit fhinspectionsatl.com or call 678-480-2110 to schedule your two-inspector team today.&rdquo;
              </p>
            </div>
          </section>

          {/* Related Links & Authority Internal Linking */}
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Related Inspection Resources
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem' }}>
              <Link href="/services/buyer-inspection" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                Buyer Inspection Protocol →
              </Link>
              <Link href="/due-diligence" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                Georgia Due Diligence Guide →
              </Link>
              <Link href="/compare/two-inspector-team-vs-single-inspector" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                Two-Inspector vs Single Inspector →
              </Link>
              <Link href="/quote" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                Calculate Inspection Pricing →
              </Link>
              <Link href="/contact" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>
                Contact Christopher Boykin →
              </Link>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}
