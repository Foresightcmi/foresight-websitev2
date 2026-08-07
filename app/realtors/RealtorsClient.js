'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function RealtorsClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState({
    id: 'hvac',
    label: '❄️ HVAC System',
    clause: 'Seller agrees to pay a licensed HVAC contractor to evaluate, service, and repair the primary HVAC system, specifically addressing [e.g., low temperature split / failing capacitor], and provide buyer with a paid invoice showing system is in normal working order prior to closing.'
  });

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
            Your Negotiation Asset.<br />
            <span style={{ color: 'var(--color-red)' }}>Never a Deal Killer.</span>
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.6 }}>
            We help your clients win at the negotiating table with clear, detailed inspection reporting that strengthens your position — not undermines it. Backed by SUPRA lockbox access, two-inspector speed, and $10,000 warranties.
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
              We know your reputation is on the line with every referral. Our reports are designed to give your clients leverage at the negotiating table — clearly communicating issues so you can negotiate with confidence, not fear.
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
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>The Due Diligence Accelerator</h3>
              <p style={{ color: 'var(--color-gray-dark)', flexGrow: 1, fontSize: '1.025rem', lineHeight: 1.6 }}>
                In Atlanta's fast-paced market, tight due diligence windows kill deals. We send <strong>two certified inspectors</strong> to every job to cut on-site time in half and guarantee your clients get their comprehensive report within 24 hours, maximizing your negotiation leverage.
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
                We don&apos;t dispatch rookie solo inspectors. Every job features a certified inspector paired directly with Christopher Boykin, a fully-credentialed Certified Master Inspector®—representing the highest professional standard in North America.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📝 HOMEGAUGE CREATE-REPAIR-LIST (CRL™) FEATURE HIGHLIGHT 📝 */}
      <section className="section" style={{ background: '#0F172A', color: '#FFFFFF', padding: '5rem 0', borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem', fontWeight: 600 }}>
                ⚡ Agent Efficiency Tool
              </span>
              <h2 style={{ color: '#FFFFFF', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Build Custom Repair Addendums in Minutes with HomeGauge CRL™
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Never waste hours copying and pasting inspection report findings into amendment contracts again. Foresight digital reports include HomeGauge&rsquo;s interactive <strong>Create-Repair-List (CRL™)</strong> tool, built specifically for real estate agents.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.2rem' }}>✓</span>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '1rem' }}><strong>One-Click Selection:</strong> Select repair items directly from our digital report into your amendment draft.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.2rem' }}>✓</span>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '1rem' }}><strong>Dollar Amount Customization:</strong> Request seller credit amounts or contractor repairs with exact line items.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.2rem' }}>✓</span>
                  <p style={{ color: '#CBD5E1', margin: 0, fontSize: '1rem' }}><strong>Seamless PDF Export:</strong> Generate a polished PDF addendum ready to attach directly to your GAR amendment form.</p>
                </div>
              </div>
              <a href="#partner-form" className="btn btn-gold" style={{ padding: '0.9rem 2rem' }}>
                🤝 Connect with Foresight Realtor VIP
              </a>
            </div>

            <div style={{ background: '#1E293B', border: '2px solid var(--color-gold)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>📄</div>
                <div>
                  <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.25rem' }}>HomeGauge CRL™ Interactive Preview</h3>
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>Included Standard on Every Foresight Report</span>
                </div>
              </div>
              <div style={{ background: '#0F172A', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem', borderLeft: '4px solid var(--color-gold)' }}>
                <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>Item 3.2: HVAC Condenser Heat Surcharge</p>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>Selected for Repair Request &bull; Requested Credit: $1,200</p>
              </div>
              <div style={{ background: '#0F172A', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-gold)' }}>
                <p style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>Item 5.1: Main Electrical Panel Grounding Rod</p>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>Selected for Contractor Repair Prior to Closing</p>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, textAlign: 'center', fontStyle: 'italic' }}>
                Agents report saving 45+ minutes per transaction using the Foresight CRL™ addendum tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 ZERO-CLICK AGENT TOOL: INSTANT GAR AMENDMENT REPAIR CLAUSE GENERATOR 🚀 */}
      <section className="section" style={{ background: '#0F172A', borderBottom: '1px solid #1E293B', padding: '4rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem', fontWeight: 600 }}>
              🛠️ Zero-Click Agent Utility
            </span>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Instant GAR Amendment Repair Clause Generator
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Drafting repair requests during due diligence? Click any preset below to generate copyable, attorney-aligned repair language ready for your Georgia GAR Amendment to Request Repairs.
            </p>
          </div>

          {/* Generator Interface */}
          <div style={{ maxWidth: '900px', margin: '0 auto', background: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            {/* Presets Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {[
                { id: 'hvac', label: '❄️ HVAC System', clause: 'Seller agrees to pay a licensed HVAC contractor to evaluate, service, and repair the primary HVAC system, specifically addressing [e.g., low temperature split / failing capacitor], and provide buyer with a paid invoice showing system is in normal working order prior to closing.' },
                { id: 'electrical', label: '⚡ Electrical Double Taps', clause: 'Seller agrees to hire a licensed electrician to inspect the main electrical breaker panel, repair any double-tapped breakers, properly bond neutral/ground buses, and provide buyer with a copy of the licensed electrician\'s invoice prior to closing.' },
                { id: 'moisture', label: '🌊 Crawlspace Moisture', clause: 'Seller agrees to hire a qualified contractor to remedy moisture intrusion identified behind [Location], replace damaged subflooring/drywall, and install a 6-mil vapor barrier over 100% of exposed crawlspace soil prior to closing.' },
                { id: 'roof', label: '🏠 Roof & Flashing', clause: 'Seller agrees to hire a licensed roofing contractor to repair damaged/missing shingles and reseal pipe boot flashings at [Location], providing buyer with a paid invoice and proof of repair prior to closing.' },
                { id: 'wdo', label: '🐜 Termite / WDO Treatment', clause: 'Seller agrees to provide an Official Georgia Wood Infestation Inspection Report (WDO) and hire a licensed pest control company to complete liquid soil treatment for subterranean termites, transferring a 1-year renewable warranty to buyer at closing.' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePreset(preset);
                    setCopied(false);
                  }}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: activePreset.id === preset.id ? 'var(--color-gold)' : '#334155',
                    background: activePreset.id === preset.id ? 'rgba(212,175,55,0.15)' : '#0F172A',
                    color: activePreset.id === preset.id ? 'var(--color-gold)' : '#94A3B8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Display Box */}
            <div style={{ background: '#0F172A', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid #334155', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>GAR Amendment Repair Clause</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activePreset.clause);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{
                    background: copied ? '#22C55E' : 'var(--color-gold)',
                    color: '#0F172A',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {copied ? '✅ Copied to Clipboard!' : '📋 Copy Clause'}
                </button>
              </div>
              <p style={{ color: '#F1F5F9', fontSize: '1rem', lineHeight: 1.6, margin: 0, fontFamily: 'monospace' }}>
                &quot;{activePreset.clause}&quot;
              </p>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.75rem', marginBottom: 0, textAlign: 'center' }}>
              💡 Free agent tool provided by Foresight Home Inspections. Use freely in your GAR transaction documents.
            </p>
          </div>
        </div>
      </section>

      {/* Negotiation Partner Section */}
      <section className="section" style={{ padding: '6rem 0', background: 'linear-gradient(135deg, var(--color-dark) 0%, #1a1a2e 100%)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
            <div>
              <span className="badge" style={{ marginBottom: '1rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-light)', fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
                Your Negotiation Edge
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-white)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                We Help You Close Deals,<br />
                <span style={{ color: 'var(--color-red)' }}>Not Kill Them.</span>
              </h2>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Some agents worry that a thorough inspector will scare buyers or blow up a deal. At Foresight, we take the opposite approach. Our reports are written to <strong style={{ color: 'var(--color-white)' }}>clearly communicate issues and potential concerns</strong> in a way that empowers your clients at the negotiating table — not frighten them away from it.
              </p>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                When your buyers know exactly what they are dealing with, you can negotiate repair credits, price reductions, or seller concessions from a position of strength. Our detailed reporting and the HomeGauge CRL tool make it easy to build professional repair amendments in minutes. The result? Your clients get a better deal, and your reputation as a <strong style={{ color: 'var(--color-white)' }}>sharp, strategic negotiator</strong> grows with every transaction.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2rem', lineHeight: 1 }}>📋</div>
                  <div>
                    <h4 style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.5rem' }}>Clear, Actionable Reporting</h4>
                    <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      We categorize findings by severity and explain them in plain language. Your clients understand what matters, what does not, and what gives them negotiating leverage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2rem', lineHeight: 1 }}>💪</div>
                  <div>
                    <h4 style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.5rem' }}>Stronger Negotiation Position</h4>
                    <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      A well-documented inspection report with thermal imaging evidence and clear cost implications gives your buyers undeniable leverage. Agents who partner with us consistently secure repair credits and price adjustments for their clients.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '2rem', lineHeight: 1 }}>🤝</div>
                  <div>
                    <h4 style={{ color: 'var(--color-white)', fontWeight: 700, marginBottom: '0.5rem' }}>Your Reputation, Elevated</h4>
                    <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                      When your buyers walk away from closing knowing they negotiated from a position of knowledge, they remember who made that possible. That kind of client loyalty is built on trust — and trust starts with transparency.
                    </p>
                  </div>
                </div>
              </div>
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
