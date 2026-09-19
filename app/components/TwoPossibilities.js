import Link from 'next/link';

export default function TwoPossibilities() {
  return (
    <section className="section" style={{ background: '#0F172A', color: '#FFFFFF', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(15,23,42,0) 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.45rem 1.25rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', display: 'inline-block', marginBottom: '1.25rem' }}>
            ⚠️ GEORGIA CONSUMER ADVISORY: ZERO STATE LICENSING REQUIRED
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            The Two Possibilities on Inspection Day<br />
            <span style={{ color: 'var(--color-gold)' }}>Which Will You Choose for Your Investment?</span>
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '780px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Most homebuyers don&rsquo;t realize that <strong>Georgia does not license home inspectors</strong>. Anyone can legally inspect your home without passing an exam or proving experience. When you book an inspection in Atlanta, you are faced with two radically different possibilities.
          </p>
        </div>

        {/* The Two Possibilities Contrast Grid */}
        <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'stretch', marginBottom: '3.5rem' }}>
          
          {/* Possibility 1: The Unvetted Solo Inspector Gamble */}
          <div style={{ background: 'rgba(30, 41, 59, 0.65)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}>
            <div style={{ position: 'absolute', top: '-13px', left: '24px', background: '#DC2626', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.9rem', borderRadius: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              POSSIBILITY A &bull; THE $15,000+ GAMBLE
            </div>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F87171', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                The Unvetted Solo Inspector
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '1rem' }}>
                A solo operator working without board credentials. Seems inexpensive on paper, but risks catastrophic hidden repair costs after closing.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#E2E8F0' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✗</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Unlicensed &amp; Unverified in Georgia:</strong> No state exam or criminal background vetting required. Anyone with a flashlight can claim to be an expert.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✗</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Severe 4+ Hour Fatigue:</strong> One person inspecting a 3,000 sq ft home alone for 4 hours in a 130&deg;F Georgia attic gets exhausted, missing critical structural defects and active roof leaks.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✗</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Drywall-Blind (No Thermal Imaging):</strong> Uses only basic visual flashlights. Hidden plumbing leaks, insulation voids, and overheating electrical breakers remain completely invisible.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✗</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Slow 48–72 Hour Turnaround:</strong> Burns 2 to 3 days of your strict 5–7 day Georgia Due Diligence period waiting on a PDF, eliminating your leverage to negotiate repair credits.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✗</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>$0 Post-Closing Warranty:</strong> If the HVAC fails or the roof leaks 3 weeks after moving in, you are entirely on your own with an unexpected $8,000 to $15,000 repair bill.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: '#FCA5A5', lineHeight: 1.5 }}>
              ⚠️ <strong>The Cost:</strong> A minor $50 upfront savings can easily result in thousands in undiscovered repairs after you take title.
            </div>
          </div>

          {/* Possibility 2: The Certified Master Inspector Dual-Team Standard */}
          <div style={{ background: 'linear-gradient(145deg, #1E293B, #0F172A)', border: '2px solid var(--color-gold)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', boxShadow: '0 12px 35px rgba(212, 175, 55, 0.2)' }}>
            <div style={{ position: 'absolute', top: '-13px', right: '24px', background: 'var(--color-gold)', color: '#0F172A', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.9rem', borderRadius: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              POSSIBILITY B &bull; THE FORESIGHT CMI STANDARD
            </div>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-gold)', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                Board-Certified Master Inspector &bull; Dual Team
              </h3>
              <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', paddingBottom: '1rem' }}>
                Led by Christopher Boykin, CMI®—the top 1% of the industry nationwide—backed by two certified inspectors and up to $35,000 in warranty and guarantee protection.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#F1F5F9' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Top 1% Board-Certified CMI:</strong> Peer-reviewed and credentialed by the Master Inspector Certification Board with 1,000+ verified inspections, zero criminal record, and advanced building science mastery.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Two Certified Inspectors on Every Job:</strong> Dual-coverage splits the property simultaneously (interior vs. exterior), reducing on-site disruption to 1.5–2.5 hours with twice the eyes and zero fatigue.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>FLIR Infrared Thermal &amp; 4K Drone Included:</strong> State-of-the-art thermal imaging reveals hidden moisture, missing insulation, and hot circuits. 4K aerial drones safely audit steep roof planes and chimney flashings at no extra charge.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Same-Day Delivery &amp; 1-Click GAR Repair List:</strong> Comprehensive digital reports delivered most of the time the same day (definitely within 24 hours) with 1-click GAR F404 Amendment generator to lock in seller concessions fast.
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ color: '#FFFFFF' }}>Up to $35,000 in Protection:</strong> Our $10,000 Elite Master Warranty ($0 deductible) covering appliances, structural elements, HVAC, plumbing, electrical, mold, and roof + InterNACHI&rsquo;s $25,000 Honor Guarantee.
                  </div>
                </li>
              </ul>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ flex: '1 1 200px', textAlign: 'center', padding: '0.9rem 1.5rem', fontWeight: 700 }}
              >
                📅 Schedule Inspection Now
              </a>
              <Link
                href="/quote"
                className="btn btn-outline"
                style={{ flex: '1 1 160px', textAlign: 'center', padding: '0.9rem 1.5rem', borderColor: '#FFFFFF', color: '#FFFFFF' }}
              >
                Instant Price Calculator →
              </Link>
            </div>
          </div>

        </div>

        {/* 🏛️ What Is a Certified Master Inspector (CMI®)? Credential Deep Dive */}
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>🎖️</span>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                What Is a Certified Master Inspector (CMI®)?
              </h3>
              <p style={{ color: 'var(--color-gold)', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                The Highest Professional Designation in North American Home Inspection
              </p>
            </div>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Because Georgia does not regulate or license home inspectors, the <strong>Certified Master Inspector® (CMI)</strong> credential is the ultimate gold standard of competence and consumer protection. Awarded exclusively by the Master Inspector Certification Board, CMI is not a beginner course or a commercial membership—it is an earned board certification held by only the top 1% to 3% of inspectors in North America.
          </p>

          <div className="grid grid-4" style={{ gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1.5rem 1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>1,000+</div>
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '0.4rem', fontWeight: 700 }}>Verified Inspections</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Must prove at least 1,000 fee-paid inspections or accredited equivalent hours. Zero beginners.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1.5rem 1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Top 1%</div>
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '0.4rem', fontWeight: 700 }}>Elite National Rank</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Recognized nationwide as the best trained, most experienced inspectors in the United States and Canada.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1.5rem 1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>100%</div>
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '0.4rem', fontWeight: 700 }}>Vetted Background</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Strict criminal background vetting, mandatory continuous education, and flawless professional standing.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', padding: '1.5rem 1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>InterNACHI</div>
              <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '0.4rem', fontWeight: 700 }}>Highest Standards</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                Strict adherence to InterNACHI Standards of Practice, backed by the $25,000 InterNACHI Honor Guarantee.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
