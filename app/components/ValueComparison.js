import Link from 'next/link';

export default function ValueComparison() {
  return (
    <section className="section bg-white" style={{ borderBottom: '1px solid var(--color-gray-mid)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div className="section-title text-center" style={{ marginBottom: '3rem' }}>
          <span className="badge" style={{ marginBottom: '1rem', background: 'var(--color-red-light)', color: 'var(--color-red)' }}>Smart Buyer Guide</span>
          <h2>Not All Home Inspectors Are Created Equal</h2>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '800px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: 1.7 }}>
            When buying a home, saving $50 on a &ldquo;cheap&rdquo; inspection is one of the most expensive mistakes you can make. Discover why elite national certifications and meticulous standards protect your life savings.
          </p>
        </div>

        <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'stretch', marginBottom: '3.5rem' }}>
          {/* Card 1: The Cheap Inspector */}
          <div className="card" style={{ border: '1px solid var(--color-gray-mid)', background: '#fafafa', padding: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-gray-dark)', fontWeight: 700 }}>The &ldquo;Discount&rdquo; Inspector</h3>
                <span style={{ color: 'var(--color-gray)', fontWeight: 600, fontSize: '0.9rem', background: '#eee', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>Typically $250 - $300</span>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Often unlicensed, recently trained, or operating alone as a side gig. They compete strictly on low prices because they lack specialized certifications and advanced equipment.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#b91c1c' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✗</span>
                  <span style={{ fontSize: '0.95rem' }}><strong>One Solo Inspector on Site:</strong> Even companies that advertise having a &ldquo;team&rdquo; of employees only dispatch a <strong>single solo inspector</strong> to do the actual walkthrough of your home, raising the risk of rushed schedules and overlooked details.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#b91c1c' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✗</span>
                  <span style={{ fontSize: '0.95rem' }}><strong>No Advanced Tech:</strong> Performs a basic visual-only check. Misses hidden plumbing leaks, electrical panel hotspots, or ceiling moisture behind drywall.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#b91c1c' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✗</span>
                  <span style={{ fontSize: '0.95rem' }}><strong>Zero Warranty / Protection:</strong> If they miss a $10,000 foundation settlement issue or mold infestation, you are entirely responsible for the repair bill.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#b91c1c' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✗</span>
                  <span style={{ fontSize: '0.95rem' }}><strong>Basic Association Membership:</strong> Lacks vetting by elite national boards. Minimal ongoing educational standards.</span>
                </li>
              </ul>
            </div>
            
            <div style={{ marginTop: '2.5rem', background: '#fee2e2', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #ef4444' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#991b1b', lineHeight: 1.5 }}>
                ⚠️ <strong>The True Cost:</strong> If they miss a rotting subfloor, a cracked HVAC heat exchanger, or structural roofing issues, you lose your negotiation leverage and inherit thousands in instant, out-of-pocket repair bills.
              </p>
            </div>
          </div>

          {/* Card 2: The Foresight standard */}
          <div className="card card-premium" style={{ border: '2px solid var(--color-red)', background: 'var(--color-dark)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-lg)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-white)', fontWeight: 800 }}>The Foresight CMI Standard</h3>
                <span style={{ color: 'var(--color-red)', fontWeight: 700, fontSize: '0.9rem', background: 'var(--color-red-light)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>Starting at $415</span>
              </div>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.975rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Led by Christopher Boykin, a <strong>Certified Master Inspector® (CMI)</strong>—representing the top 2% of elite, highly vetted home inspectors nationwide.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#86efac' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--color-white)' }}><strong style={{ color: '#86efac' }}>Two Certified Inspectors Physically on Site:</strong> We send two certified inspectors working in unison on every single job. One meticulously inspects the exterior and structure, while the other reviews the interior systems and utilities. You get actual dual-coverage, double the thoroughness, and half the timeframe!</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#86efac' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--color-white)' }}><strong style={{ color: '#86efac' }}>Free FLIR Thermal Imaging Scans:</strong> We scan walls, electrical breakers, and pipes to detect temperature anomalies that reveal moisture leaks or electrical hotspots invisibly.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#86efac' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--color-white)' }}><strong style={{ color: '#86efac' }}>Free $10,000 Elite Warranty:</strong> Backed by InterNACHI, we stand completely behind our inspections with a 90-day structural/mechanical warranty to protect your closing transaction.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: '#86efac' }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--color-white)' }}><strong style={{ color: '#86efac' }}>Certified Master Inspector® (CMI):</strong> Vetted by the CMI Board. CmIs must complete 1,000+ inspections, adhere to strict codes of ethics, and complete rigorous continuing education.</span>
                </li>
              </ul>
            </div>
            
            <div style={{ marginTop: '2.5rem', background: 'rgba(211,47,47,0.15)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-red)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#fca5a5', lineHeight: 1.5 }}>
                🛡️ <strong>The Intelligent Investment:</strong> Spending $50 more upfront gives you a 50-page, Master Inspector-vetted negotiation roadmap with photos and video. This regular saves buyers <strong>$3,000 to $12,000</strong> in pre-closing repair credits!
              </p>
            </div>
          </div>
        </div>

        {/* E-E-A-T Respected Organization Context Block */}
        <div style={{ background: 'var(--color-gray-light)', padding: '2rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-red)', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Why Elite Certifications Matter: InterNACHI & The CMI Board</h4>
            <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
              The <strong>International Association of Certified Home Inspectors (InterNACHI)</strong> is the world&apos;s leading national inspection organization, enforcing strict, federal-level Standards of Practice and ethical compliance. Christopher Boykin is credentialed as a <strong>Certified Master Inspector®</strong>—the absolute highest professional title awarded. Only home inspectors with proven records, thousands of hours of field expertise, and rigorous ongoing training ever qualify. Accept nothing less than a Certified Master Inspector to safeguard your family and investment.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
            <Link href="/quote" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              ⚖️ Calculate Your Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
