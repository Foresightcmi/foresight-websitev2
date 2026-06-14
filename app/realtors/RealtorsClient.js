'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function RealtorsClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = {
      name: e.target.name.value,
      brokerage: e.target.brokerage.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      message: e.target.message.value,
      supraNeeded: e.target.supraNeeded.checked ? 'Yes' : 'No',
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: `REALTOR VIP INQUIRY:\nBrokerage: ${formData.brokerage}\nSUPRA Access Needed: ${formData.supraNeeded}\n\nMessage: ${formData.message}`
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        e.target.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-light)', fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
            Exclusive Realtor Partner Program
          </span>
          <h1 style={{ color: 'var(--color-white)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Close Transactions Faster.<br />
            <span style={{ color: 'var(--color-red)' }}>Delight Your Buyers.</span>
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.6 }}>
            Empower your Metro Atlanta transactions with our elite two person inspection team teams. We handle SUPRA lockbox access, provide complimentary utility setups, and back your clients with $10,000 warranties.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#partner-form" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              🤝 Join the VIP Partner Program
            </a>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              📅 Schedule an Inspection
            </a>
          </div>
        </div>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(211,47,47,0.05) 0%, transparent 60%)', zIndex: 1, pointerEvents: 'none' }} />
      </section>

      {/* Strategic Pillars Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>How We Support You</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The Foresight Realtor Advantage</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We know your reputation is on the line with every referral. That is why we provide a friction-free inspection service designed to keep deals together and protect your buyers.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {/* Pillar 1: SUPRA Key */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1 }}>🔑</div>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Active SUPRA Key Access</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                Stop driving across Metro Atlanta just to unlock doors. Foresight carries <strong>active SUPRA key access</strong> for secure lockbox entry. We handle the opening, inspection, and lockup professionally, giving you hours of your day back.
              </p>
            </div>

            {/* Pillar 2: Two Person Inspection Team speed */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1 }}>👥</div>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>2-Inspector Speed & Accuracy</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                Unlike solo operators who can take up to 5 hours, we send <strong>two certified inspectors working in unison</strong> on every job. We get in, inspect with extreme thoroughness, and get out in half the time—reducing seller inconvenience and scheduling headaches.
              </p>
            </div>

            {/* Pillar 3: Utilities Plus */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1 }}>🔌</div>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Free Utility Concierge Service</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                Help your clients transition seamlessly. Through our partnership with <strong>Utilities Plus</strong>, all Foresight buyers receive complimentary, high-touch utility connection services (water, gas, electric, internet, security) at the best available market rates.
              </p>
            </div>

            {/* Pillar 4: $10,000 Master Warranty */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1 }}>🛡️</div>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>$10,000 Client Protection</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                Every inspection led by Christopher Boykin, a Certified Master Inspector®, includes our <strong>$10,000 Elite Master Inspection Warranty</strong> with $0 deductible. It covers mechanicals, structure, major appliances, mold, and roofs, protecting your buyer and your reputation post-closing.
              </p>
            </div>

            {/* Pillar 5: Interactive CRL */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1 }}>📝</div>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Create Request List (CRL™)</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                Tired of copying and pasting text into amendment documents? Our digital reports feature HomeGauge\'s CRL™ tool. Agents can click items directly in the inspection report to automatically compile a polished, professional repair amendment in minutes.
              </p>
            </div>

            {/* Pillar 6: elite CMI credentials */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1 }}>🏆</div>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>CMI-Led Dual Inspections</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                We don\'t dispatch rookie solo inspectors. Every job features a certified inspector paired directly with Christopher Boykin, a fully-credentialed Certified Master Inspector®—representing the highest professional standard in North America.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Realtor Testimonials Section */}
      <section className="section bg-white" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem' }}>
              Partner Testimonials
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
              What Atlanta Real Estate Partners Say
            </h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Discover how Foresight's two person inspection team efficiency, SUPRA access, and $10,000 client warranties help local real estate agents save hours of work and protect their deals.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            {/* Agent Testimonial 1 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fbbf24', fontSize: '1.15rem', marginBottom: '1.25rem', letterSpacing: '0.08em' }}>★★★★★</div>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 1.5rem 0' }}>
                  "Foresight is my secret weapon for negotiations. On a recent Sandy Springs transaction, they caught a collapsed clay sewer line. Armed with their highly detailed report and the HomeGauge CRL tool, I put together an amendment in minutes and negotiated a <strong>$24,500 repair credit</strong> for my buyers before closing!"
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--color-gray-mid)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  Melissa S.
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-mid)', fontSize: '0.875rem' }}>
                  <span>Keller Williams Peachtree Rd</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-red)' }}>💼 Buyer Agent</span>
                </div>
              </div>
            </div>

            {/* Agent Testimonial 2 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fbbf24', fontSize: '1.15rem', marginBottom: '1.25rem', letterSpacing: '0.08em' }}>★★★★★</div>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 1.5rem 0' }}>
                  "The two person inspection team model and active SUPRA lockbox access are massive time savers. I no longer have to spend 4 hours driving out to lock and unlock properties. Foresight enters securely, does a highly thorough sweep in under 2 hours, and sends the report same-day. They save me hours of coordination on every transaction."
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--color-gray-mid)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  Marcus G.
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-mid)', fontSize: '0.875rem' }}>
                  <span>Compass Atlanta</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-red)' }}>🔑 Listing Agent</span>
                </div>
              </div>
            </div>

            {/* Agent Testimonial 3 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTop: '4px solid var(--color-red)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fbbf24', fontSize: '1.15rem', marginBottom: '1.25rem', letterSpacing: '0.08em' }}>★★★★★</div>
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 1.5rem 0' }}>
                  "Having a Certified Master Inspector lead the audit is great, but the complimentary $10,000 warranty is what really shields my buyers. When a water heater failed weeks after closing, the warranty covered it 100%. No stress, no angry buyer phone calls, and zero post-closing agent liability."
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--color-gray-mid)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  Sarah K.
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-mid)', fontSize: '0.875rem' }}>
                  <span>Harry Norman Realtors</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-red)' }}>🛡️ Realtor Partner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Branded Marketing / Quick Quote Integration Section */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ marginBottom: '1rem' }}>Marketing Support</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                Co-Branded Marketing & Client Care Kits
              </h2>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-gray-dark)' }}>
                When you partner with Foresight, we help you shine. We provide customized, co-branded home buyer guides and inspection prep sheets that you can share with your listing or buying clients.
              </p>
              <ul className="cms-content" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span> <strong>Buyer Vetting Sheets</strong>: Help clients spot issues before making an offer.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span> <strong>Seller Prep Checklists</strong>: Ensure listing homes are prepared to pass inspection smoothly.
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span> <strong>Co-Branded PDF Guides</strong>: Professional home maintenance advice custom-branded with your face and info.
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn btn-outline" style={{ borderWidth: '2px' }}>
                  💰 Try Instant Quote Calculator
                </Link>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderWidth: '2px' }}>
                  📅 Book Client Inspection
                </a>
                <Link href="/ask-twin" className="btn btn-outline" style={{ borderWidth: '2px' }}>
                  🤖 Ask Foresight AI about Home Inspections
                </Link>
              </div>
            </div>

            {/* Signup Form */}
            <div className="card card-premium" id="partner-form" style={{ padding: '3rem', background: 'var(--color-white)' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>Join the VIP Program</h3>
              <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>
                Register as a Foresight Realtor Partner to secure prioritized scheduling, lockbox coordination, and co-branded marketing materials.
              </p>

              {submitStatus === 'success' ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-red-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-red-dark)' }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--color-red)', fontSize: '1.25rem', fontWeight: 700 }}>Welcome to the VIP Program!</h4>
                  <p style={{ marginBottom: '1.5rem' }}>Christopher Boykin will be in touch with you shortly to deliver your co-branded digital materials and verify your SUPRA details.</p>
                  <button onClick={() => setSubmitStatus(null)} className="btn btn-outline" style={{ display: 'inline-flex' }}>Register Another Agent</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label" htmlFor="name" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                    <input type="text" id="name" name="name" className="form-control" placeholder="e.g. Sarah Jenkins" required />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="brokerage" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Real Estate Brokerage</label>
                    <input type="text" id="brokerage" name="brokerage" className="form-control" placeholder="e.g. Keller Williams Atlanta" required />
                  </div>
                  <div className="grid grid-2" style={{ gap: '1rem' }}>
                    <div>
                      <label className="form-label" htmlFor="phone" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                      <input type="tel" id="phone" name="phone" className="form-control" placeholder="678-555-0199" required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="email" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Email</label>
                      <input type="email" id="email" name="email" className="form-control" placeholder="sarah@brokerage.com" required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
                    <input type="checkbox" id="supraNeeded" name="supraNeeded" style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-red)', cursor: 'pointer' }} defaultChecked />
                    <label htmlFor="supraNeeded" style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', cursor: 'pointer', userSelect: 'none' }}>
                      I want Foresight to handle SUPRA key lockbox entry on my inspections.
                    </label>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="message" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Additional Comments or Special Requests</label>
                    <textarea id="message" name="message" className="form-control" rows="3" placeholder="e.g. Please send details about co-branded home buyers guides..."></textarea>
                  </div>

                  {submitStatus === 'error' && (
                    <p style={{ color: 'var(--color-red)', fontWeight: 500 }}>
                      There was a problem sending your inquiry. Please try again or contact us directly at 678-480-2110.
                    </p>
                  )}

                  <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Registering Agent...' : 'Join Partner Program & Get Co-Branded Materials'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Realtor VIP Program FAQ Section */}
      <section className="section bg-white" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Realtor VIP Program FAQ</h2>
            <p style={{ color: 'var(--color-gray-dark)', margin: '0.5rem 0 0' }}>Answers to common agent coordination questions.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--color-gray-mid)', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                How do we coordinate SUPRA lockbox entry?
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0 }}>
                Foresight is fully integrated with active Metro Atlanta board memberships and carries active SUPRA eKEY access. You simply schedule the inspection and enter the SUPRA lockbox serial number or property address. We will obtain keys directly, perform the inspection, and securely relock the home.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--color-gray-mid)', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                How long do your dual inspections take?
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0 }}>
                Because we send <strong>two fully-certified inspectors to every job</strong>, we complete the physical scanning in approximately 1.5 to 2.5 hours depending on size. This is nearly half the time a standard single inspector requires, helping minimize inconvenience to listing sellers.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--color-gray-mid)', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                How does the complimentary Utilities Plus service benefit agents?
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0 }}>
                Utility setup is one of the most stressful parts of moving. By offering your buyers complimentary access to Utilities Plus through Foresight, we take that burden off their plate. Your buyers receive absolute white-glove treatment to connect their water, gas, power, internet, and home security, which reflects incredibly well on you as their agent.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark)' }}>
                What happens if a defect is found after closing?
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0 }}>
                Every standard buyer inspection we conduct is backed by a complimentary <strong>$10,000 Elite Master Inspection Warranty</strong> with $0 deductible. If a major covered appliance, structural component, major HVAC/plumbing element, or roof leak manifests within 90 days of closing (or 120 days of inspection), your client is financially protected. This dramatically reduces post-closing conflict for the real estate agent!
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
