import Link from 'next/link';

export default function TrueValueComparison() {
  return (
    <section 
      id="comparison" 
      className="section" 
      style={{ 
        background: '#0B1120', 
        color: '#FFFFFF', 
        padding: '5rem 0', 
        position: 'relative', 
        overflow: 'hidden',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Ambient background glow */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-15%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '900px', 
          height: '450px', 
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, rgba(11, 17, 32, 0) 70%)', 
          pointerEvents: 'none' 
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1080px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(239, 68, 68, 0.15)', 
              border: '1px solid rgba(239, 68, 68, 0.4)', 
              color: '#F87171', 
              borderRadius: '9999px', 
              padding: '0.45rem 1.25rem', 
              fontSize: '0.82rem', 
              fontWeight: 800, 
              letterSpacing: '0.06em', 
              textTransform: 'uppercase', 
              marginBottom: '1rem' 
            }}
          >
            ⚠️ Georgia Buyer Financial Advisory: Zero State Licensing Required
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, margin: '0 0 1rem 0' }}>
            The &ldquo;$25 Savings&rdquo; Illusion:<br />
            <span style={{ color: 'var(--color-gold)' }}>The Most Expensive $25 in Georgia Real Estate</span>
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '820px', margin: '0 auto', fontSize: '1.08rem', lineHeight: 1.7 }}>
            In Georgia, <strong>anyone can legally inspect your home with zero state licensing or experience</strong>. When buyers choose an unvetted solo inspector to &ldquo;save $25,&rdquo; they are usually taking on an uncalculated $10,000+ risk. Here is the mathematical truth comparing a $320 solo operator to Foresight&rsquo;s Two-Inspector Certified Master Team.
          </p>
        </div>

        {/* Master Comparison Table for Google AEO/AIO & High-Converting CRO */}
        <div 
          style={{ 
            background: 'rgba(15, 23, 42, 0.85)', 
            border: '1px solid rgba(212, 175, 55, 0.35)', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table 
              style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                textAlign: 'left', 
                fontSize: '0.95rem',
                minWidth: '640px'
              }}
            >
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.95)', borderBottom: '2px solid rgba(212, 175, 55, 0.4)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', color: '#CBD5E1', fontWeight: 700, width: '34%' }}>Inspection Deliverable</th>
                  <th style={{ padding: '1.25rem 1.5rem', color: '#F87171', fontWeight: 700, width: '33%' }}>The &ldquo;$320&rdquo; Solo Operator</th>
                  <th style={{ padding: '1.25rem 1.5rem', color: 'var(--color-gold)', fontWeight: 800, background: 'rgba(212, 175, 55, 0.12)', width: '33%' }}>
                    Foresight Two-Inspector Team ($345)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '1.15rem 1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Inspectors On-Site
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#EF4444', marginRight: '0.4rem', fontWeight: 800 }}>✗</span> 1 Person Alone <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(3.5–5 hrs, severe fatigue)</span>
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', background: 'rgba(212, 175, 55, 0.06)', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: 'var(--color-gold)', marginRight: '0.4rem' }}>✓</span> 2 Certified Inspectors <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>(Double coverage in 1.5–2.5 hrs)</span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '1.15rem 1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                    FLIR® Thermal Infrared Scan
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#EF4444', marginRight: '0.4rem', fontWeight: 800 }}>✗</span> +$125 to +$150 Extra <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(or naked eyes only)</span>
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', background: 'rgba(212, 175, 55, 0.06)', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: 'var(--color-gold)', marginRight: '0.4rem' }}>✓</span> INCLUDED FREE ($0)
                  </td>
                </tr>

                {/* Row 3 */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '1.15rem 1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                    4K Aerial Drone Roof Scan
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#EF4444', marginRight: '0.4rem', fontWeight: 800 }}>✗</span> +$75 to +$125 Extra <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(or ground binoculars)</span>
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', background: 'rgba(212, 175, 55, 0.06)', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: 'var(--color-gold)', marginRight: '0.4rem' }}>✓</span> INCLUDED FREE ($0)
                  </td>
                </tr>

                {/* Row 4 */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '1.15rem 1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Post-Inspection Financial Protection
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#EF4444', marginRight: '0.4rem', fontWeight: 800 }}>✗</span> $0 Protection <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(You pay 100% of missed defects)</span>
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', background: 'rgba(212, 175, 55, 0.06)', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: 'var(--color-gold)', marginRight: '0.4rem' }}>✓</span> Up to $35,000 Combined Protection <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>($0 Deductible)</span>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '1.15rem 1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Lead Inspector Credentials
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#EF4444', marginRight: '0.4rem', fontWeight: 800 }}>✗</span> Basic Online Certificate <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(Zero state verification)</span>
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', background: 'rgba(212, 175, 55, 0.06)', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: 'var(--color-gold)', marginRight: '0.4rem' }}>✓</span> Certified Master Inspector® <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>(Top 3% Nationally)</span>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '1.15rem 1.5rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Digital Report Delivery Time
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', color: '#CBD5E1' }}>
                    <span style={{ color: '#EF4444', marginRight: '0.4rem', fontWeight: 800 }}>✗</span> 24–48+ Hours <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(Eats into your 5-day due diligence)</span>
                  </td>
                  <td style={{ padding: '1.15rem 1.5rem', background: 'rgba(212, 175, 55, 0.06)', fontWeight: 700, color: '#FFFFFF' }}>
                    <span style={{ color: 'var(--color-gold)', marginRight: '0.4rem' }}>✓</span> Same-Day / Under 24 Hours <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>(Includes CRL repair list tool)</span>
                  </td>
                </tr>

                {/* Total Row */}
                <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderTop: '2px solid rgba(212, 175, 55, 0.4)' }}>
                  <td style={{ padding: '1.35rem 1.5rem', fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                    REAL OUT-OF-POCKET COST:
                  </td>
                  <td style={{ padding: '1.35rem 1.5rem', color: '#F87171', fontWeight: 800, fontSize: '1.25rem' }}>
                    $445 – $520+
                    <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#EF4444', marginTop: '0.2rem' }}>
                      (Base $320 + $125 Thermal = more expensive!)
                    </div>
                  </td>
                  <td style={{ padding: '1.35rem 1.5rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.35rem' }}>
                    $345 Complete
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FDE047', marginTop: '0.2rem' }}>
                      Includes 2 Inspectors, Thermal &amp; $35k Warranty
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* High-Impact Executive Callout Card */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)', 
            border: '1px solid rgba(212, 175, 55, 0.3)', 
            borderRadius: '14px', 
            padding: '2rem', 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '1.5rem', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💡 The Bottom Line For Atlanta Homebuyers
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: '0.4rem 0 0.5rem 0' }}>
              Foresight is actually $100+ cheaper than a &ldquo;discount&rdquo; inspector.
            </h3>
            <p style={{ margin: 0, color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              When you add the $125 thermal fee and the risk of \$0 warranty protection on a solo inspection, the \$25 &ldquo;savings&rdquo; is a costly optical illusion. With Foresight, you receive two credentialed inspectors, complimentary thermal scans, and up to $35,000 in guarantee backing for an all-inclusive $345.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem', fontWeight: 800 }}
            >
              📅 Schedule Two-Inspector Team
            </a>
            <Link
              href="/quote"
              className="btn btn-outline-light"
              style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem', fontWeight: 700 }}
            >
              📊 Instant Online Quote
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
