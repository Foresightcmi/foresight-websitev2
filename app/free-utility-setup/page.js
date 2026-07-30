import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Free Utility Concierge Setup | Foresight Home Inspections Atlanta',
  description: 'Every Foresight home inspection in Atlanta includes free access to the Utilities Plus Concierge Service. Set up your power, water, gas, and internet with one phone call.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/free-utility-setup',
  },
  openGraph: {
    title: 'Free Utility Concierge Setup | Foresight Home Inspections',
    description: 'Every inspection includes a free VIP concierge service to help you set up utilities with one phone call.',
    url: 'https://www.fhinspectionsatl.com/free-utility-setup',
    type: 'website',
  }
};

export default function FreeUtilitySetupPage() {
  return (
    <>
      <section className="hero" style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '6rem 0 5rem' }}>
        <Image
          src="/images/luxury-home.jpg"
          alt="Atlanta Home Buying Utility Setup"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.7) 100%)', zIndex: 1 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1.5rem', display: 'inline-block' }}>
            ⚡ VIP BUYER PERK
          </span>
          <h1 style={{ color: '#FFF', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>
            Moving Just Got <span style={{ color: 'var(--color-gold)' }}>Easier.</span>
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Every Foresight home inspection automatically includes our complimentary Utilities Plus Concierge service. One phone call connects all your utilities.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              📅 Book Your Inspection
            </a>
            <Link href="/services" className="btn btn-outline-light" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View All Included Perks
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="badge">Save Time & Stress</span>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', marginTop: '1rem', lineHeight: 1.2 }}>
                Skip the Hold Music. <br /> Let the Experts Handle It.
              </h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                We know how stressful the final weeks leading up to closing can be. Between packing, signing endless documents, and coordinating movers, the last thing you want to do is sit on hold with five different utility companies.
              </p>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                That's why Foresight Home Inspections partnered with <strong>Utilities Plus</strong>. Once your inspection is paid for, you'll receive a VIP email introduction to their concierge team. They will find the best rates in your new neighborhood and handle the setup for you. 
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}><span style={{ color: '#10B981' }}>✅</span> Electricity & Gas</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}><span style={{ color: '#10B981' }}>✅</span> Water & Trash Services</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}><span style={{ color: '#10B981' }}>✅</span> High-Speed Internet & Cable</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}><span style={{ color: '#10B981' }}>✅</span> Home Security Systems</li>
              </ul>
            </div>
            <div style={{ background: 'var(--color-gray-light)', padding: '3rem', borderRadius: 'var(--radius-lg)', borderTop: '6px solid var(--color-gold)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>How It Works (100% Free)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: 'var(--color-red)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Book Your Inspection</h4>
                    <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.95rem' }}>Schedule your home inspection with Foresight's two-person expert team.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: 'var(--color-red)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Get Introduced</h4>
                    <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.95rem' }}>After payment, receive a VIP introduction email to the Utilities Plus team.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: 'var(--color-red)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>One Phone Call</h4>
                    <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.95rem' }}>Hop on a quick call with your concierge. They'll comparison shop and connect everything at once.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: 'var(--color-red)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Move In Smoothly</h4>
                    <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.95rem' }}>Walk into your new home with the lights on and the Wi-Fi ready to go.</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(212,175,55,0.1)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-gray-dark)' }}>
                <em>Prefer to handle utilities yourself? No problem. The introductory email contains a simple one-click opt-out link.</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate" style={{ background: 'var(--color-slate-dark)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Experience the Foresight Difference?</h2>
          <p style={{ fontSize: '1.15rem', color: '#94A3B8', marginBottom: '2.5rem' }}>
            From our two-inspector teams to our $10,000 warranty and free utility concierge, we do more to protect your investment and your time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
              📅 Schedule Your Inspection
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
