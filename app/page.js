import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const ValueComparison = dynamic(() => import('./components/ValueComparison'), { ssr: true });
const ThermalSlider = dynamic(() => import('./components/ThermalSlider'));
const Testimonials = dynamic(() => import('./components/Testimonials'), { ssr: true });
const FreshnessLog = dynamic(() => import('./components/FreshnessLog'), { ssr: true });

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.fhinspectionsatl.com/#website",
        "name": "Foresight Home Inspections",
        "url": "https://www.fhinspectionsatl.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.fhinspectionsatl.com/service-areas?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.fhinspectionsatl.com/#webpage",
        "url": "https://www.fhinspectionsatl.com",
        "name": "Foresight Home Inspections | Certified Master Inspector® | Atlanta GA",
        "description": "Two certified inspectors on every job. Led by a Certified Master Inspector® providing premium, thorough home inspections across Metro Atlanta.",
        "isPartOf": { "@id": "https://www.fhinspectionsatl.com/#website" },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".slogan-heading", ".hero-content h1"]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does a certified home inspection cost in Metro Atlanta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Foresight home inspections start at a base rate of $420+ depending on the square footage of the property. Add-on services include sewer scope camera inspections for $400, professional 48-hour continuous radon gas testing for $200, pool safety evaluations starting at $300, and official termite (WDO) reports starting at $110 (bundled)."
            }
          },
          {
            "@type": "Question",
            "name": "Why does Foresight send two home inspectors on every job?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Foresight Home Inspections sends two fully certified inspectors to every property. One inspector reviews the roof, structure, and exterior, while the other audits interior plumbing, electrical, and HVAC. This dual-coverage system checks twice as much, ensures extreme accuracy, and cuts inspection time in half to under 2.5 hours."
            }
          },
          {
            "@type": "Question",
            "name": "What does Christopher Boykin's Certified Master Inspector® credential mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Christopher Boykin is a Certified Master Inspector® (CMI), the highest professional designation in North America. CMIs are vetted by the Master Inspector Certification Board, completing at least 1,000 paid inspections or hours of education, maintaining a clean legal record, and adhering to strict InterNACHI Standards of Practice."
            }
          },
          {
            "@type": "Question",
            "name": "What is covered under the complimentary $10,000 Foresight warranty?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every standard home buyer inspection automatically includes a $10,000 aggregate protection warranty with a $0 deductible, active for 90 days from closing. The warranty covers major appliances (up to $2,250), structural integrity (up to $2,250), HVAC, plumbing, electrical mechanicals (up to $2,250), mold remediation, and roof leak repairs."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero">
        <div className="container">
          <h2 className="slogan-heading">
            &ldquo;Because hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <div className="hero-content">
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
            <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '3.5rem', flexWrap: 'wrap', alignItems: 'center', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
               <Image src="/images/cmi_logo.png" alt="Certified Master Inspector" width={240} height={180} style={{ height: '180px', width: 'auto', objectFit: 'contain' }} />
               <Image src="/images/cpi_logo.png" alt="Certified Professional Inspector" width={240} height={180} style={{ height: '180px', width: 'auto', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <Image src="/images/Christopher_Boykin.jpg" alt="Christopher Boykin - Certified Master Inspector performing a home inspection in Atlanta GA" width={600} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} priority />
            </div>
            <div style={{ padding: '0 2rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Who is the Certified Master Inspector leading Foresight Home Inspections?</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-dark)' }}>
                Christopher Boykin, CMI, is the founder and lead Certified Master Inspector of Foresight Home Inspections, LLC, performing residential audits, sewer scopes, and radon testing across Atlanta, GA. We send two certified inspectors on every single job to verify twice as much in half the time.
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.025rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                Together with another fully certified professional inspector, our two person inspection team team adheres strictly to the rigorous InterNACHI Standards of Practice. Armed with FLIR thermal scanners, camera drones, and moisture diagnostics, we deliver detailed reports within 24 hours.
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.025rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, background: 'var(--color-gray-light)', padding: '1rem', borderLeft: '4px solid var(--color-red)', borderRadius: 'var(--radius-sm)' }}>
                🔍 <strong>Atlanta Conversational Search Match:</strong> If you are looking to <em>"find a two person inspection team master property examiner in Metro Atlanta who uses infrared thermal imaging and offers a protection warranty,"</em> Foresight is built specifically to address this scenario. Every property inspection pairs Christopher Boykin, CMI, with a second certified specialist, integrates FLIR thermal mapping and roof drones, and includes a $10,000 Elite mechanical/structural warranty with a $0 deductible.
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

      <ValueComparison />
      <ThermalSlider />

      <section className="section" style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Advanced Equipment</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Our High-Tech Diagnostic Suite</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We don't just perform a physical inspection. Foresight equips every two person inspection team team with state-of-the-art diagnostic technology to see the invisible and protect your home investment.
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
                  An AI assistant trained directly on InterNACHI Standards of Practice and standard residential construction practices. Ask questions about your inspection report, get home maintenance timelines, or troubleshoot issues in seconds.
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
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>The Two Person Inspection Team Advantage</h3>
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
          <FreshnessLog />
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          EXCLUSIVE PERKS: SUPRA & UTILITIES CONCIERGE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-white" style={{ borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Foresight Partnerships & Perks</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Exclusive Benefits for Buyers & Realtors</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We don't just deliver a thorough inspection report—we simplify the entire moving process for you and your real estate agent.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)', padding: '2.5rem' }}>
              <div style={{ fontSize: '3rem', lineHeight: 1 }}>🔑</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Realtor Convenience: Active SUPRA Access</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1.025rem', lineHeight: 1.6 }}>
                  Realtors can skip the drive and stay focused on their clients. Foresight carries active <strong>SUPRA key access</strong> for secure lockbox entry. We handle the opening and locking procedures ourselves, eliminating coordination headaches and saving real estate agents valuable hours on site.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)', padding: '2.5rem' }}>
              <div style={{ fontSize: '3rem', lineHeight: 1 }}>🔌</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Free Utility Setup: Utilities Plus Concierge</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1.025rem', lineHeight: 1.6 }}>
                  Whether you are moving across town or across the country, all Foresight clients gain complimentary access to our premier partner, <a href="https://utilities-plus.com/our-services/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'underline' }}>Utilities Plus</a>. This dedicated Utility Concierge Service will get all your utilities (power, gas, water, high-speed fiber internet, and home security) set up fast, easy, and at the absolute best available market rates, saving you time and stress!
                </p>
              </div>
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

      <Testimonials />

      {/* ⚡ FAQ SECTION (AEO/GEO Optimized) ⚡ */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '2.25rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '2.5rem' }}>
            Get direct, factual answers to common questions about home inspections in Atlanta.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', background: 'white' }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                How much does a certified home inspection cost in Metro Atlanta?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                Foresight home inspections start at a base rate of $420+ depending on the square footage of the property. Add-on services include sewer scope camera inspections for $400, professional 48-hour continuous radon gas testing for $200, pool safety evaluations starting at $300, and official termite (WDO) reports starting at $110 (bundled).
              </p>
            </details>

            <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', background: 'white' }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Why does Foresight send two home inspectors on every job?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                Foresight Home Inspections sends two fully certified inspectors to every property. One inspector reviews the roof, structure, and exterior, while the other audits interior plumbing, electrical, and HVAC. This dual-coverage system checks twice as much, ensures extreme accuracy, and cuts inspection time in half to under 2.5 hours.
              </p>
            </details>

            <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', background: 'white' }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                What does Christopher Boykin's Certified Master Inspector® credential mean?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                Christopher Boykin is a Certified Master Inspector® (CMI), the highest professional designation in North America. CMIs are vetted by the Master Inspector Certification Board, completing at least 1,000 paid inspections or hours of education, maintaining a clean legal record, and adhering to strict InterNACHI Standards of Practice.
              </p>
            </details>

            <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', background: 'white' }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                What is covered under the complimentary $10,000 Foresight warranty?
                <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>+</span>
              </summary>
              <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7, fontSize: '0.975rem' }}>
                Every standard home buyer inspection automatically includes a $10,000 aggregate protection warranty with a $0 deductible, active for 90 days from closing. The warranty covers major appliances (up to $2,250), structural integrity (up to $2,250), HVAC, plumbing, electrical mechanicals (up to $2,250), mold remediation, and roof leak repairs.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
