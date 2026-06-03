'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

function AnimatedNumber({ value, duration = 600 }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const rafId = useRef(null);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;
    if (from === to) return;

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [value, duration]);

  return display.toLocaleString();
}

function StatCard({ label, value, prefix = '', suffix = '', sublabel, highlight = false }) {
  return (
    <div
      style={{
        background: highlight ? 'rgba(211,47,47,0.12)' : 'rgba(255,255,255,0.05)',
        border: highlight ? '1px solid rgba(211,47,47,0.35)' : '1px solid rgba(255,255,255,0.08)',
        borderTop: '4px solid var(--color-red)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(211,47,47,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        {label}
      </p>
      <p style={{ color: highlight ? 'var(--color-red-light)' : 'var(--color-white)', fontSize: highlight ? '2.75rem' : '2.25rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.1 }}>
        {prefix}<AnimatedNumber value={value} />{suffix}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>
        {sublabel}
      </p>
    </div>
  );
}

export default function Realtors() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [transactions, setTransactions] = useState(4);
  const [hourlyRate, setHourlyRate] = useState(75);

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
            Empower your Metro Atlanta transactions with our elite dual-inspector teams. We handle SUPRA lockbox access, provide complimentary utility setups, and back your clients with $10,000 warranties.
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

            {/* Pillar 2: Dual Inspector speed */}
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

      {/* ROI Calculator Section */}
      <section className="section bg-dark text-white" style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Background radial gradient */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(211,47,47,0.08) 0%, transparent 55%)', zIndex: 1, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-light)', fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
              Agent Time Savings Calculator
            </span>
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
              How Much Time & Money Does Foresight{' '}
              <span style={{ color: 'var(--color-red)' }}>Save Your Agents?</span>
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Enter your transaction volume and hourly rate below to see the real dollar value of partnering with Foresight's dual-inspector, SUPRA-equipped team.
            </p>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-2" style={{ gap: '2rem', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <label style={{ display: 'block', color: 'var(--color-gray-mid)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                Transactions / Month
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={transactions}
                onChange={(e) => setTransactions(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-control"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-white)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', width: '100%' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>How many deals do you close each month?</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <label style={{ display: 'block', color: 'var(--color-gray-mid)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                Your Hourly Rate ($)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-mid)', fontSize: '1.5rem', fontWeight: 700, pointerEvents: 'none' }}>$</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-control"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-white)', fontSize: '2rem', fontWeight: 800, textAlign: 'center', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', width: '100%' }}
                />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>What's your time worth per hour?</p>
            </div>
          </div>

          {/* Calculated Output Stats */}
          {(() => {
            const hoursSavedPerTx = 3;
            const hoursSavedMonth = transactions * hoursSavedPerTx;
            const monthlyDollar = hoursSavedMonth * hourlyRate;
            const annualDollar = monthlyDollar * 12;
            const freedTransactions = Math.floor(hoursSavedMonth / 3);

            return (
              <>
                <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <StatCard label="Hours Saved Per Transaction" value={hoursSavedPerTx} suffix=" hrs" sublabel="1.5 hrs SUPRA + 1.5 hrs dual-inspector speed" />
                  <StatCard label="Hours Saved Per Month" value={hoursSavedMonth} suffix=" hrs" sublabel={`${transactions} transactions × 3 hours each`} />
                  <StatCard label="Transactions Freed Up" value={freedTransactions} suffix=" deals" sublabel="Extra deals you could close with reclaimed time" />
                </div>
                <div className="grid grid-2" style={{ gap: '1.5rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                  <StatCard label="Monthly Dollar Value" value={monthlyDollar} prefix="$" suffix="" sublabel={`${hoursSavedMonth} hrs × $${hourlyRate}/hr`} highlight />
                  <StatCard label="Annual Dollar Value" value={annualDollar} prefix="$" suffix="" sublabel={`$${monthlyDollar.toLocaleString()}/mo × 12 months`} highlight />
                </div>
              </>
            );
          })()}

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <a href="#partner-form" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              🤝 Join the VIP Partner Program
            </a>
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
                  🤖 Ask Foresight AI about GA Codes
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
