import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <h1 style={{ marginBottom: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Certified Home Inspections<br />
            <span style={{ color: 'var(--color-red)' }}>Two Inspectors on Every Job.</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontSize: '1.125rem' }}>
            At Foresight Home Inspections, LLC, a lead Certified Master Inspector® of InterNACHI will be on site along with another certified inspector. Unparalleled thoroughness, unparalleled peace of mind.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quote" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Get Instant Quote
            </Link>
            <Link href="/ask-twin" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              Ask Foresight AI
            </Link>
          </div>
          <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
             <Image src="/images/cmi_logo.png" alt="Certified Master Inspector" width={200} height={140} style={{ height: '140px', width: 'auto', objectFit: 'contain' }} />
             <Image src="/images/cpi_logo.jpg" alt="Certified Professional Inspector" width={200} height={140} style={{ height: '140px', width: 'auto', objectFit: 'contain' }} />
             <Image src="/images/trust_badge.png" alt="InterNACHI Trust Badge" width={200} height={140} style={{ height: '140px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <Image src="/images/inspector_photo.jpg" alt="Christopher Boykin - Certified Master Inspector performing a home inspection in Atlanta GA" width={600} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} priority />
            </div>
            <div style={{ padding: '0 2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Meet Your Inspectors</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                I'm Christopher Boykin, dedicated to protecting your investment. A lead Certified Master Inspector of InterNACHI will be on site along with another certified inspector. Together, we adhere strictly to InterNACHI Standards of Practice, bringing decades of combined experience to your front door.
              </p>
              <ul className="cms-content" style={{ marginBottom: '2rem', listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> InterNACHI Certified Master Inspector
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> Certified Pool & Spa Inspections
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> Termite & Wood Destroying Organism (WDO) Evaluations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--color-red)' }}>✓</span> Thermal Imaging & Drone Tech Included
                </li>
              </ul>
              <Link href="/ask-twin" className="btn btn-outline" style={{ borderWidth: '2px' }}>
                Chat with Foresight AI
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-gray-light">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Foresight?</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '600px', margin: '1rem auto 0' }}>We go above and beyond the standard InterNACHI guidelines to ensure you have the complete picture.</p>
          </div>
          
          <div className="grid grid-3">
            <div className="card card-premium">
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>The Dual-Inspector Advantage</h3>
              <p>Two sets of expert eyes drastically reduce the chance of missing critical defects. A lead Certified Master Inspector of InterNACHI will be on site along with another certified inspector to provide unmatched accuracy.</p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Advanced Tech Included</h3>
              <p>We utilize thermal imaging, drone technology, and advanced moisture meters to see what the naked eye cannot.</p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Clear, Actionable Reports</h3>
              <p>Receive an easy-to-read, comprehensive digital report with high-res photos and video within 24 hours of your inspection.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-dark), #1f2937)', color: 'white' }}>
        <div className="container">
          <div className="section-title">
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-red)' }}>$10,000</span> Peace of Mind Protection
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem' }}>
              Because Christopher Boykin is a Certified Master Inspector®, you receive the maximum Elite MASTER level warranty plan that ordinary inspectors simply cannot offer.
            </p>
          </div>
          
          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Elite Terms
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>90 Days from closing or 120 Days from inspection (whichever comes first).</p>
            </div>
            
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Total Coverage
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>$10,000 Aggregate Coverage Limit with exactly $0 Deductible.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Appliances
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for Major Kitchen Appliances (NO age limits). Washer/Dryer fully included.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Structural
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 coverage for structural components of the home.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Mechanicals
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 coverage for Major Mechanicals (HVAC, Electrical, Plumbing).</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-red)' }}>✓</span> Additional Protection
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for Mold Remediation and $1,000 for Roof Leak Protection.</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.125rem', marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Getting an inspection isn't just smart—it saves you from financial disasters and gives realtors a powerful tool to negotiate thousands off the asking price.
            </p>
            <Link href="/quote" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Secure Your $10,000 Protection Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
