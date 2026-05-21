import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <h2 className="slogan-heading">
            &ldquo;Because hindsight is expensive...<br />
            <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <h1 style={{ marginBottom: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Certified Home Inspections<br />
            <span style={{ color: 'var(--color-red)' }}>Two Inspectors on Every Job.</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem', textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontSize: '1.125rem' }}>
            At Foresight Home Inspections, LLC, a lead Certified Master Inspector® is paired with another certified inspector. Armed with high-resolution drones, advanced thermal cameras, and electronic moisture diagnostic gear, we bring unparalleled high-tech thoroughness to your inspection.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              📅 Schedule Your Inspection
            </a>
            <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              Get Instant Quote
            </Link>
          </div>
          <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
             <Image src="/images/cmi_logo.png" alt="Certified Master Inspector" width={200} height={140} style={{ height: '140px', width: 'auto', objectFit: 'contain' }} />
             <Image src="/images/cpi_logo.png" alt="Certified Professional Inspector" width={200} height={140} style={{ height: '140px', width: 'auto', objectFit: 'contain' }} />
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
              <h2 style={{ marginBottom: '1.5rem' }}>Meet Your Inspector</h2>
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
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  📅 Schedule Now
                </a>
                <Link href="/ask-twin" className="btn btn-outline" style={{ borderWidth: '2px' }}>
                  Ask Foresight AI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Advanced Equipment</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Our High-Tech Diagnostic Suite</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We don't just perform a physical walkthrough. Foresight equips every dual-inspector team with state-of-the-art diagnostic technology to see the invisible and protect your home investment.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/thermal-1.png"
                  alt="Infrared Thermal Imaging (FLIR) camera inspecting home electrical heat profile"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Infrared Thermal Imaging (FLIR)</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Our professional thermal cameras scan walls, ceilings, and electrical panels to locate hidden plumbing leaks, electrical fire hazards, and missing insulation without damaging any drywall. Included on every inspection at no extra charge.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/drone-remote.png"
                  alt="High-resolution aerial drone operator remote controller with telemetry screen"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>High-Resolution Aerial Drones</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  We utilize specialized camera drones to capture high-resolution imagery of roofs, chimneys, eaves, and gutters that are too steep, tall, or fragile to walk on. We inspect the entire exterior from the safest and most effective angles.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1, width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                🤖
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Foresight AI Digital Twin</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  An AI assistant trained directly on InterNACHI Standards of Practice and Georgia structural codes. Ask questions about your inspection report, get home maintenance timelines, or troubleshoot issues in seconds.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/moisture-meter.png"
                  alt="Digital moisture detector being used to inspect home framing and walls"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Digital Moisture & Combustible Gas Detectors</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  We employ electronic moisture scanners to trace active leaks through subflooring and walls, plus high-sensitivity combustible gas sniffers to check appliance lines and gas meters for micro-leaks.
                </p>
              </div>
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
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                📅 Schedule & Get Your $10,000 Warranty
              </a>
              <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                See Pricing First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
