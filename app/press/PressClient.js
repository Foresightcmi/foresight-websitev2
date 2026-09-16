'use client';

import Link from 'next/link';
import { useState } from 'react';

const MEDIA_QUOTES = [
  {
    id: 'red-clay',
    topic: 'Georgia Red Clay & Foundation Shifts',
    context: 'On why Metro Atlanta homes suffer foundation settling and stair-step brick cracks:',
    quote: 'Georgia red clay expands drastically when saturated and contracts severely during summer droughts. Without 6-foot downspout extensions and positive grading away from the slab or stem wall, hydraulic pressure forces foundation shifts within 3 to 5 years, leading to binding doors and stair-step mortar fractures.',
    author: 'Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections'
  },
  {
    id: 'polybutylene',
    topic: 'Polybutylene Plumbing Hazards (1978–1995 Homes)',
    context: 'On the hidden risk in Atlanta suburban subdivisions built in the 1980s and early 1990s:',
    quote: 'Polybutylene pipes do not fail simply because of age; municipal micro-chlorination in Georgia public water supplies degrades the acetal plastic fittings from the inside out until catastrophic bursting occurs. A standard home buyer must demand visual verification of both interior supply risers and the exterior yard service line before contract contingency expires.',
    author: 'Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections'
  },
  {
    id: 'radon',
    topic: 'Radon Gas in North Georgia Granite Bedrock',
    context: 'On environmental hazards in Fulton, Gwinnett, Cobb, and DeKalb counties:',
    quote: 'Nearly one in three homes across North Metro Atlanta tests above the EPA action limit of 4.0 pCi/L due to the radioactive decay of naturally occurring uranium in our underlying granite bedrock. Because radon is invisible, odorless, and radioactive, continuous 48-hour active electronic monitoring during due diligence is essential to protect long-term respiratory health.',
    author: 'Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections'
  },
  {
    id: 'crawlspace',
    topic: 'Crawlspace Humidity & Mold Growth Dynamics',
    context: 'On traditional vented crawlspaces in the humid Southeast climate:',
    quote: 'Vented crawlspaces in Georgia operate like moisture pumps in mid-summer. Hot, humid ambient air enters cool crawlspace ground-temperatures, spikes the relative humidity past 80%, and triggers fungal microbial growth on subflooring. A heavy 6-mil poly vapor barrier covering 100% of exposed earth is the single most cost-effective preventative measure against joist rot.',
    author: 'Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections'
  },
  {
    id: 'due-diligence',
    topic: 'Georgia Due Diligence & 7-Day Negotiation Windows',
    context: 'On the commercial impact of slow inspection turnarounds in competitive markets:',
    quote: 'In standard Georgia Association of Realtors contracts, buyers frequently agree to a tight 5 to 7 day due diligence period. If an inspector takes 48 hours to deliver a PDF report, they have burned nearly half of the buyer\'s legal negotiation window. Deploying a two-inspector team allows on-site scanning in two hours and delivery of same-day reports so agents can draft repair amendments immediately.',
    author: 'Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections'
  },
  {
    id: 'new-construction',
    topic: 'New Construction Deficiencies & 11-Month Warranty',
    context: 'On common builder oversights in fast-growing Atlanta exurbs:',
    quote: 'Municipal code inspectors check only for minimum life-safety compliance on a tight 10-minute municipal schedule. They do not traverse attics to confirm insulation depth, check HVAC duct commissioning, or thermal-scan exterior walls for missing insulation bats. An independent 11-month warranty inspection regularly discovers thousands of dollars in builder omissions before the developer\'s liability expires.',
    author: 'Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections'
  }
];

const BIOS = {
  short: 'Christopher Boykin is a Certified Master Inspector (CMI®)—the highest credential in North American property inspection—and founder of Foresight Home Inspections, LLC in Atlanta, Georgia. He leads a pioneering dual-inspector diagnostic team serving home buyers, sellers, and real estate professionals across 163+ Metro Atlanta municipalities.',
  medium: 'Christopher Boykin is a Certified Master Inspector (CMI®) and the founder of Foresight Home Inspections, LLC, based in Metro Atlanta. Holding credentials earned by fewer than 1% of inspectors in North America, Christopher brings deep expertise in residential building science, thermal imaging diagnostics, environmental hazards, and Georgia real estate contract due diligence. Through Foresight\'s dual-inspector operational model, Christopher and his team provide same-day comprehensive reporting and up to $35,000 in combined warranty protection.',
  full: 'Christopher Boykin is a Certified Master Inspector (CMI®) and founder of Foresight Home Inspections, LLC, Atlanta\'s premier residential inspection firm. Board-certified by the Master Inspector Certification Board and accredited by InterNACHI, Christopher represents the top tier of building diagnostic professionals in North America. With extensive hands-on experience in Southeastern structural framing, roof forensics, sewer scope diagnostics, and environmental testing (radon and mold), he frequently advises real estate agents, home buyers, and journalists on navigating Georgia\'s strict due diligence periods. He holds a 4.9-star rating across 48 verified reviews and has served property owners in more than 163 Metro Atlanta cities.'
};

export default function PressClient() {
  const [copiedQuoteId, setCopiedQuoteId] = useState(null);
  const [copiedBioId, setCopiedBioId] = useState(null);
  const [activeBio, setActiveBio] = useState('medium');

  const copyQuote = (item) => {
    const textToCopy = `"${item.quote}" — ${item.author} (Source: https://www.fhinspectionsatl.com/press)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteId(item.id);
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'press_quote_copied', {
        event_category: 'digital_pr',
        event_label: item.id,
      });
    }
    setTimeout(() => setCopiedQuoteId(null), 2500);
  };

  const copyBio = (type) => {
    navigator.clipboard.writeText(BIOS[type]);
    setCopiedBioId(type);
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'press_bio_copied', {
        event_category: 'digital_pr',
        event_label: type,
      });
    }
    setTimeout(() => setCopiedBioId(null), 2500);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '5.5rem 0 4.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge" style={{ marginBottom: '1.25rem', background: 'rgba(212,175,55,0.2)', color: 'var(--color-gold)', fontSize: '0.9rem' }}>
            📰 Digital PR &amp; Media Kit
          </span>
          <h1 style={{ color: 'var(--color-white)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.15 }}>
            Expert Building Science &amp;<br />
            <span style={{ color: 'var(--color-gold)' }}>Georgia Real Estate Commentary</span>
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '820px', margin: '0 auto 2.25rem', fontSize: '1.2rem', lineHeight: 1.6 }}>
            Christopher Boykin, Certified Master Inspector® (Top 1% in North America), delivers deadline-ready analysis, verified data, and practical soundbites for journalists, real estate editors, and media producers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:inspect@foresightcmi.com?subject=Media%20Inquiry%20-%20Interview%20Request"
              className="btn btn-primary"
              style={{ padding: '0.95rem 2.25rem', fontSize: '1.1rem', fontWeight: 700 }}
            >
              🎙️ Request Interview / Comment
            </a>
            <a
              href="#quotes"
              className="btn btn-outline"
              style={{ padding: '0.95rem 2.25rem', fontSize: '1.1rem', borderColor: 'var(--color-gold)', color: 'var(--color-gold)', fontWeight: 700 }}
            >
              📋 Ready-to-Cite Quotes
            </a>
          </div>
        </div>
      </section>

      {/* Journalist Fast-Response Guarantee */}
      <section className="section" style={{ background: '#0F172A', color: '#FFFFFF', padding: '2rem 0', borderBottom: '1px solid #1E293B' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>⚡</span>
              <div>
                <strong style={{ color: '#F1F5F9', fontSize: '1.1rem', display: 'block' }}>Journalist Deadline Guarantee</strong>
                <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>We guarantee a response to accredited media inquiries within 2 business hours.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Press Phone</span>
                <a href="tel:6784802110" style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>678-480-2110</a>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Press Inbox</span>
                <a href="mailto:inspect@foresightcmi.com" style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>inspect@foresightcmi.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Profile & Core Competencies */}
      <section className="section bg-white" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Expert Source</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>About Christopher Boykin, CMI®</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '750px', margin: '0.75rem auto 0', fontSize: '1.1rem' }}>
              A trusted voice in Southeastern residential property diagnostics, risk mitigation, and construction quality standards.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '2rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '2rem', borderRadius: '12px', borderTop: '4px solid var(--color-gold)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Top 1% Industry Credential</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Certified Master Inspector (CMI®), designated by the Master Inspector Certification Board after thousands of verified fee-paid property evaluations and background clearance.
              </p>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '2rem', borderRadius: '12px', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🔬</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Building Science Authority</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Specialized in Southeastern building envelope failures, slab settlement on Piedmont red clay, crawlspace psychrometrics, FLIR thermal infrared analysis, and sewer video diagnostics.
              </p>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '2rem', borderRadius: '12px', borderTop: '4px solid var(--color-gold)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Regional Field Scope</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Deep regional experience across 163+ municipalities in DeKalb, Fulton, Gwinnett, Cobb, Forsyth, Cherokee, Clayton, and Henry counties, with an average 4.9-star rating across 48 verified client reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready-to-Cite Expert Quotes & Soundbites */}
      <section id="quotes" className="section" style={{ background: '#0F172A', color: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem', fontWeight: 600 }}>
              💬 Ready-to-Cite Commentary
            </span>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', fontWeight: 800 }}>
              On-Record Soundbites for Reporters &amp; Writers
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '750px', margin: '0.75rem auto 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Journalists and content creators may cite any of the following statements with attribution to Christopher Boykin, Certified Master Inspector® and Founder of Foresight Home Inspections.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {MEDIA_QUOTES.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.topic}
                  </span>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '0.4rem 0 1rem 0', fontStyle: 'italic' }}>
                    {item.context}
                  </p>
                  <blockquote style={{ color: '#F1F5F9', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 1.25rem 0', borderLeft: '3px solid var(--color-gold)', paddingLeft: '1rem' }}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '1rem' }}>
                  <span style={{ color: '#64748B', fontSize: '0.8rem' }}>Christopher Boykin, CMI®</span>
                  <button
                    onClick={() => copyQuote(item)}
                    style={{
                      background: copiedQuoteId === item.id ? '#22C55E' : 'var(--color-gold)',
                      color: '#0F172A',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copiedQuoteId === item.id ? '✓ Quote Copied!' : '📋 Copy Quote & Attribution'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Copyable Bios & Press Kit Assets */}
      <section className="section bg-light" style={{ padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center" style={{ marginBottom: '3rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Media Assets</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Official Bios &amp; Media Kit</h2>
            <p style={{ color: 'var(--color-gray-dark)', margin: '0.5rem 0 0' }}>
              Choose your preferred bio length for event programs, articles, and podcast introductions.
            </p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid var(--color-gray-mid)', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'short', label: '50-Word Bio' },
                { id: 'medium', label: '100-Word Bio' },
                { id: 'full', label: 'Full Executive Bio' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBio(b.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: activeBio === b.id ? 'var(--color-gold-dark)' : 'var(--color-gray-mid)',
                    background: activeBio === b.id ? 'rgba(212,175,55,0.1)' : '#FFFFFF',
                    color: activeBio === b.id ? 'var(--color-gold-dark)' : 'var(--color-dark)',
                    cursor: 'pointer'
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div style={{ background: 'var(--color-gray-light)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', lineHeight: 1.65, fontSize: '1rem', color: 'var(--color-dark)' }}>
              {BIOS[activeBio]}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>
                Includes permission for editorial reproduction in print, web, and broadcast media.
              </span>
              <button
                onClick={() => copyBio(activeBio)}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                {copiedBioId === activeBio ? '✓ Bio Copied to Clipboard!' : '📋 Copy Selected Bio'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Media Inquiry Form / Direct Contact */}
      <section className="section bg-white" style={{ padding: '4.5rem 0', borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <span className="badge" style={{ marginBottom: '1rem' }}>Press Contact</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>Book Christopher Boykin for Your Story</h2>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Available for television, radio, podcast, and print commentary on residential property defects, building science, due diligence timelines, and Southeast climate impacts.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:inspect@foresightcmi.com?subject=Media%20Interview%20Request%20-%20Christopher%20Boykin"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              ✉️ Email Press Request
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              📞 Direct Press Line: 678-480-2110
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
