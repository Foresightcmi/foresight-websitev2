import Link from 'next/link';

export default function ValueComparison() {
  return (
    <section className="section bg-white" style={{ borderBottom: '1px solid var(--color-gray-mid)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-title text-center" style={{ marginBottom: '3rem' }}>
          <span className="badge" style={{ marginBottom: '1rem', background: 'var(--color-red-light)', color: 'var(--color-red)' }}>
            Competitive Advantage &amp; Value Guide
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Why Metro Atlanta Buyers Choose Foresight Over Competitors
          </h2>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.7 }}>
            See how Foresight&rsquo;s Two-Inspector Master Team compares directly to national corporate franchises and ordinary solo inspectors.
          </p>
        </div>

        {/* 3-Column Comparative Feature Matrix */}
        <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '3.5rem', alignItems: 'stretch' }}>
          
          {/* Column 1: National Corporate Franchises (e.g., AmeriSpec) */}
          <div className="card" style={{ border: '1px solid #cbd5e1', background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#334155', fontWeight: 700 }}>Competitor Type A</span>
              <h3 style={{ fontSize: '1.35rem', margin: '0.5rem 0 1rem', color: '#0f172a' }}>National Franchises</h3>
              <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.4rem 0.75rem', borderRadius: '50px', display: 'inline-block', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, marginBottom: '1.25rem' }}>
                Typically $450 - $575+
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9rem', color: '#1e293b' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Single Technician:</strong> Dispatches 1 junior hourly inspector assigned by corporate.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Franchise Markup:</strong> Higher pricing to cover 7-10% corporate royalty fees.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Call Center Friction:</strong> Hidden pricing; must call out-of-state call center for a quote.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Slow Turnaround:</strong> Reports often take 24–48 hours due to corporate review.</li>
              </ul>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#fee2e2', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>
              ⚠️ High corporate prices with no guarantee of who inspects your home.
            </div>
          </div>

          {/* Column 2: Solo "Discount" Operators (e.g., At Ease, Superior) */}
          <div className="card" style={{ border: '1px solid #cbd5e1', background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#334155', fontWeight: 700 }}>Competitor Type B</span>
              <h3 style={{ fontSize: '1.35rem', margin: '0.5rem 0 1rem', color: '#0f172a' }}>Solo Operators</h3>
              <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.4rem 0.75rem', borderRadius: '50px', display: 'inline-block', fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, marginBottom: '1.25rem' }}>
                Typically $325 - $400
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9rem', color: '#1e293b' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>One Solo Inspector:</strong> Spends 3.5 to 5 hours on site; higher fatigue risk.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Zero Warranty:</strong> No post-inspection financial warranty if major defects arise.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Thermal Fees:</strong> Charges an extra $75–$150 add-on fee for infrared scans.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#dc2626' }}>✗</span> <strong>Basic Visual Tools:</strong> Limited diagnostic technology and manual booking.</li>
              </ul>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#fee2e2', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>
              ⚠️ Missing a hidden $8,000 defect wipes out any small upfront savings.
            </div>
          </div>

          {/* Column 3: The Foresight CMI Standard */}
          <div className="card card-premium" style={{ border: '2px solid var(--color-red)', background: 'linear-gradient(145deg, #0f172a, #1e293b)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 12px 30px rgba(220, 38, 38, 0.25)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--color-red)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.85rem', borderRadius: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⭐ BEST VALUE IN ATLANTA
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fca5a5', fontWeight: 700 }}>The Foresight Standard</span>
              <h3 style={{ fontSize: '1.45rem', margin: '0.5rem 0 1rem', color: '#ffffff' }}>Two-Inspector CMI Team</h3>
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.4rem 0.75rem', borderRadius: '50px', display: 'inline-block', fontSize: '0.85rem', color: '#fca5a5', fontWeight: 700, marginBottom: '1.25rem' }}>
                From $295 Condos / $345 Homes
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#4ade80', fontWeight: 800 }}>✓</span> <strong>Two Certified Inspectors:</strong> Dual-team on every site (1.5–2.5 hrs + double check).</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#4ade80', fontWeight: 800 }}>✓</span> <strong>$10,000 Elite Warranty:</strong> $0 deductible covering mechanicals, roof, mold &amp; appliances.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#4ade80', fontWeight: 800 }}>✓</span> <strong>Free FLIR Thermal Imaging:</strong> Advanced infrared moisture/electrical scans included free.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#4ade80', fontWeight: 800 }}>✓</span> <strong>Certified Master Inspector (CMI):</strong> Led by Christopher Boykin (Top 1% nationwide).</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}><span style={{ color: '#4ade80', fontWeight: 800 }}>✓</span> <strong>Instant Transparent Pricing:</strong> 5-second quote calculator + same-day digital report.</li>
              </ul>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/quote" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.85rem', fontSize: '0.95rem' }}>
                Calculate Your Instant Quote →
              </Link>
            </div>
          </div>

        </div>

        {/* E-E-A-T CMI & InterNACHI Credential Trust Block */}
        <div style={{ background: 'var(--color-gray-light)', padding: '2.25rem', borderRadius: 'var(--radius-lg)', borderLeft: '5px solid var(--color-red)', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700, color: 'var(--color-dark)' }}>
              Why Elite Credentials Matter in Georgia Due Diligence
            </h4>
            <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
              The <strong>International Association of Certified Home Inspectors (InterNACHI)</strong> is the world&apos;s leading national inspection authority. With over a decade of hands-on field experience in Georgia, Christopher Boykin is credentialed as a <strong>Certified Master Inspector® (CMI)</strong>—the highest professional rank awarded in the inspection industry. Combined with our standard two-inspector team, you receive the most thorough, legally robust due diligence defense available in Metro Atlanta.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0, flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              📅 Schedule Inspection
            </a>
            <Link href="/quote" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              📊 Price Calculator
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
