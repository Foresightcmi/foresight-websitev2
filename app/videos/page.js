import Link from 'next/link';
import Image from 'next/image';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Home Inspection Field Videos & Systems Audits | Foresight Home Inspections',
  description: 'Watch Certified Master Inspector® Christopher Boykin evaluate Metro Atlanta residential properties. Explore field diagnostic videos, thermal imaging audits, and inspection procedures.',
  keywords: [
    'home inspection videos Atlanta',
    'certified master inspector videos Georgia',
    'thermal imaging video Atlanta',
    'two inspector home evaluation videos',
    'Foresight inspection video library'
  ],
  alternates: { canonical: `${SITE_URL}/videos` },
  openGraph: {
    title: 'Home Inspection Field Videos & Diagnostics | Foresight Home Inspections',
    description: 'Explore on-site inspection demonstrations, thermal diagnostic videos, and technical system audits across Metro Atlanta.',
    url: `${SITE_URL}/videos`,
  }
};

export default function VideosHub() {
  return (
    <main style={{ background: '#090D16', color: '#F8FAFC', minHeight: '100vh', padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
          <Link href="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem', color: '#64748B' }}>/</span>
          <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Videos</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', borderRadius: '9999px', padding: '0.35rem 0.95rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            🎥 Field Video Library
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 1rem 0' }}>
            Foresight Field Inspections &amp; Diagnostic Videos
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
            Watch real on-site home inspection audits led by Certified Master Inspector® Christopher Boykin across Metro Atlanta.
          </p>
        </header>

        {/* Featured Video Card */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
            ⭐ Featured Video Demonstration
          </h2>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '2rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '16px',
              padding: '1.75rem',
              alignItems: 'center'
            }}
          >
            {/* Poster / Play preview linking to watch page */}
            <Link 
              href="/videos/complete-home-systems-diagnostic" 
              style={{ 
                position: 'relative', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                aspectRatio: '16/9', 
                maxHeight: '320px',
                display: 'block',
                background: '#000000',
                textDecoration: 'none'
              }}
            >
              <Image
                src="/images/home-systems-poster.webp"
                alt="Complete Home Systems Diagnostic Field Demonstration"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#0F172A', paddingLeft: '4px', boxShadow: '0 8px 24px rgba(212,175,55,0.6)' }}>
                  ▶
                </div>
              </div>
              <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                1:19
              </span>
            </Link>

            {/* Description & CTAs */}
            <div>
              <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Commercial &amp; Field Audit
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: '0.5rem 0 0.85rem 0' }}>
                <Link href="/videos/complete-home-systems-diagnostic" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                  Complete Home Systems Diagnostic Field Demonstration
                </Link>
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                Lead Certified Master Inspector® Christopher Boykin evaluates HVAC, 200A electrical distribution, crawlspace foundations, and infrared thermal scans under real field conditions.
              </p>
              
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link
                  href="/videos/complete-home-systems-diagnostic"
                  className="btn btn-gold"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  ▶ Watch Video &amp; Transcript
                </Link>
                <Link
                  href="/quote"
                  className="btn btn-outline-light"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  📊 Instant Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Video Topic Library Grid */}
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>
            📚 Inspection Video Topics &amp; Procedures
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Card 1 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚁</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.4rem 0' }}>
                4K Aerial Drone Roof Audits
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                High-resolution FAA-compliant drone footage evaluates steep-pitch architectural shingles, chimney flashing, and drip edges inaccessible by ladder.
              </p>
              <Link href="/services/buyer-inspection" style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                Learn About Drone Roof Scans →
              </Link>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.4rem 0' }}>
                High-Resolution Infrared Thermal Scans
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                Detect hidden plumbing leaks behind drywall, missing ceiling insulation, and overheated circuit breakers using thermal emissivity differentials.
              </p>
              <Link href="/defects" style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                Explore Defect Diagnostics →
              </Link>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔬</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: '0.5rem 0 0.4rem 0' }}>
                Fiber-Optic Sewer Scope Audits
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                200-foot continuous video camera inspection traverses main sewer lateral lines to identify tree root intrusions, bellies, and cracked cast-iron pipes.
              </p>
              <Link href="/services/sewer-scope-inspection" style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                Sewer Scope Inspection Details →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
