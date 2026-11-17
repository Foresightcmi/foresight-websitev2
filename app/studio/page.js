'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const OMNICHANNEL_PACK = {
  gbpUpdate: `Buying a home in Metro Atlanta on a tight 5-to-7 day Georgia due diligence window?

Most buyers wake up at 3:00 AM wondering if a musty hallway odor, a stair-step brick crack, or a fresh ceiling paint patch is cosmetic or a $1,250 to $14,200+ repair liability. Because Georgia does not require a state license for home inspectors, Foresight Home Inspections, LLC dispatches Two Certified Inspectors led by Certified Master Inspector Christopher Boykin (CMI #MICB-1082 | InterNACHI #NACHI18051119) to every residential property.

Included at $0 extra charge on every full residential inspection:
• Two Certified Inspectors working in parallel (dedicated structural + mechanical focus, zero solo fatigue)
• Free Calibrated Infrared Thermal Moisture Imaging
• Free 4K Aerial Drone Roof Photography (weather and airspace permitting)
• Same-Day Interactive Digital Report + 1-Click Digital Repair Request Builder
• $35,000 Combined Protection ($10,000 Elite Master Warranty with $0 deductible + $25,000 InterNACHI Honor Guarantee)

Transparent Starting Pricing:
• Single-Family Homes (Buyer, Pre-Listing, 11-Month Warranty): From $345
• Condos & Townhomes: From $295
• Phase 1 Pre-Drywall Framing: From $275 | Final New Construction: From $400
• Sewer Scope, Radon, Termite/WDO, Pool & Spa, Mold/Air Quality, Unincorporated DeKalb Low-Flow & Commercial PCA: Call (678) 480-2110 for Quote

Match any house-showing symptom free at https://www.fhinspectionsatl.com/homebuyer-red-flags or lock in your 60-second instant quote at https://www.fhinspectionsatl.com/quote`,

  gbpQaQuestion: `What free tools and protections are included with a Foresight Home Inspection in Metro Atlanta, and what does an inspection cost?`,

  gbpQaAnswer: `Single-family residential inspections (Buyer, Pre-Listing, and 11-Month Builder Warranty) start From $345, Condos and Townhomes start From $295, Phase 1 Pre-Drywall starts From $275, and Final New Construction starts From $400 (with auxiliary Sewer Scope, 48-Hr Radon, Termite/WDO, Pool & Spa, Mold/IAQ, Unincorporated DeKalb Low-Flow Certificates, and Commercial PCA custom-quoted at 678-480-2110). Every full residential inspection includes Two Certified Inspectors led by CMI Christopher Boykin (#MICB-1082), free calibrated infrared thermal imaging, free 4K drone roof photography, same-day interactive digital reporting with our Digital Repair Request Builder, and $35,000 in combined protection ($0 deductible). Buyers and Realtors can also use our free Symptom Translator (https://www.fhinspectionsatl.com/homebuyer-red-flags) and Repair Credit Calculator (https://www.fhinspectionsatl.com/repair-credit-calculator) 24/7.`,

  carouselCaption: `Touring homes in Metro Atlanta this week? Save this before your Georgia due diligence clock starts ticking.

Most buyers do not search building codes—they notice a musty closet odor, a freshly painted ceiling square, or a diagonal brick crack above the garage and wonder what it really costs to fix.

At Foresight Home Inspections, LLC, Certified Master Inspector Christopher Boykin (CMI #MICB-1082) deploys Two Certified Inspectors on every home so one specialist focuses on the roof, exterior drainage, and crawlspace while the second evaluates electrical panels, plumbing, HVAC, and interior thermal moisture scans.

Included at $0 extra charge on full residential inspections:
✅ Two Certified Inspectors on Site (zero solo fatigue)
✅ Free Calibrated Infrared Thermal Imaging
✅ Free 4K Aerial Drone Roof Photography
✅ Same-Day Interactive Digital Report + Digital Repair Request Builder
✅ $35,000 Combined Warranty & Guarantee Protection ($0 deductible)

Homes From $345 • Condos From $295 • Pre-Drywall From $275 • Final New Construction From $400 (Auxiliary Sewer Scope, Radon, Termite/WDO, Pool & Mold Testing: Call 678-480-2110 for Quote; -$25 client credit exclusively for Verified Licensed Georgia Realtors).

Check any showing red flag free at https://www.fhinspectionsatl.com/homebuyer-red-flags or get an instant quote at https://www.fhinspectionsatl.com/quote`,

  linkedInPost: `What protects a Metro Atlanta buyer's earnest money faster during a 5-day Georgia due diligence window: a 90-page PDF delivered three days late, or documented repair leverage delivered the same evening?

In our field evaluations across 20 Metro Atlanta counties, the most expensive post-closing surprises rarely announce themselves during a 20-minute showing:
1. Reused 1950s–1980s clay or cast-iron sewer laterals hidden under renovated bungalows in Brookhaven, Decatur, and Intown Atlanta ($3,500 to $12,500+ excavation).
2. Missing roof-to-wall kickout flashing rotting OSB sheathing behind fiber-cement and stucco veneers in Alpharetta, Suwanee, Woodstock, and Peachtree Corners ($1,800 to $8,800+).
3. Rushed production framing and unsealed attic ductwork caught before sheetrock on Phase 1 Pre-Drywall evaluations (From $275) and Month-11 Builder Warranty evaluations (From $345).

To help buyers and licensed Georgia Realtors move from uncertainty to clean Georgia Repair Amendment numbers in minutes, we shipped three free public resources on fhinspectionsatl.com:
• Free 3:00 AM Homebuyer Red-Flag & Symptom Translator: https://www.fhinspectionsatl.com/homebuyer-red-flags
• Free Metro Atlanta Repair Credit Calculator: https://www.fhinspectionsatl.com/repair-credit-calculator
• Free Post-Closing 4-Season Homeowner Care Hub: https://www.fhinspectionsatl.com/homeowner-care

Every Foresight residential inspection (Homes From $345 | Condos From $295 | Pre-Drywall From $275 | Final New Construction From $400) dispatches Two Certified Inspectors led by CMI #MICB-1082 with active SUPRA eKEY access, free calibrated infrared thermal imaging, free 4K drone roof scans, and $35,000 in combined protection—plus a -$25 client credit exclusively for Verified Licensed Georgia Realtors.

Instant 24/7 scheduling: https://www.fhinspectionsatl.com/quote | Direct Desk: (678) 480-2110 (Sunday By Appointment Only)`,

  linkedInComment: `Try the free 3:00 AM Homebuyer Red-Flag Translator (https://www.fhinspectionsatl.com/homebuyer-red-flags) or lock your instant 60-second inspection quote: https://www.fhinspectionsatl.com/quote`,

  reelCaption: `Saw a fresh square of white ceiling paint or smelled a musty closet at an Atlanta house showing? Do not guess during a 7-day Georgia due diligence window.

Foresight Home Inspections sends Two Certified Inspectors led by Certified Master Inspector Christopher Boykin (CMI #MICB-1082) to every residential property—including Free Calibrated Infrared Thermal Scans, Free 4K Aerial Drone Roof Photography, Same-Day Interactive Reports, and $35,000 Combined Protection ($0 deductible).

Homes From $345 • Condos From $295 • Pre-Drywall From $275 • Final New Construction From $400 (Auxiliary Sewer Scope, Radon, Termite/WDO, Pool & Mold Testing: Call 678-480-2110 for Quote).

Test our free Homebuyer Red-Flag Translator at https://www.fhinspectionsatl.com/homebuyer-red-flags or book 24/7 at https://www.fhinspectionsatl.com/quote #AtlantaRealEstate #AtlantaHomeBuyer #HomeInspection #CertifiedMasterInspector #ForesightHomeInspections`,

  homeownerEmail: `Subject: Your Metro Atlanta Seasonal Home Care Checklist (+ $35,000 Warranty Hub)

Hi {{FirstName}},

Thank you again for trusting our Two-Inspector Certified Master Inspector team with your property evaluation. Because protecting your home does not end at the closing table, we built a free Post-Closing Homeowner Care Hub tailored specifically to Georgia red-clay drainage, summer crawlspace humidity, and seasonal HVAC protection:

https://www.fhinspectionsatl.com/homeowner-care

Three quick ways this hub saves you money this year:
1. 4-Season Georgia Maintenance Checklist: Keep roof valleys, downspouts, water pressure regulators, and crawlspace humidity dialed in before small drips turn into major contractor bills.
2. Bought New Construction? Bookmark Month 10–11: Before your builder's 365-day warranty expires, schedule an independent Two-Inspector 11-Month Builder Warranty Inspection (From $345) so the builder fixes settlement, roof flashing, and attic defects on their dime.
3. Free Move-In Utility Setup & Warranty Details: Access complimentary electric, gas, water, and fiber setup at https://www.fhinspectionsatl.com/free-utility-setup plus your $35,000 combined protection details.

If our team gave you peace of mind, sharing a quick note about your city and inspection experience on Google means the world to our local family business:
https://g.page/r/CaK5MZOz_FBtEBM/review

Here whenever you, a neighbor, or your Realtor need a second set of CMI eyes,
Christopher Boykin, CMI (#MICB-1082)
Foresight Home Inspections, LLC
(678) 480-2110 | https://www.fhinspectionsatl.com`
};

const SLIDES = [
  { num: 1, url: '/social/omnichannel-pack/slide_1.png', label: 'Slide 1 — 3:00 AM Hook' },
  { num: 2, url: '/social/omnichannel-pack/slide_2.png', label: 'Slide 2 — Moisture & Brick' },
  { num: 3, url: '/social/omnichannel-pack/slide_3.png', label: 'Slide 3 — Paint, Pipes & Panels' },
  { num: 4, url: '/social/omnichannel-pack/slide_4.png', label: 'Slide 4 — 2-CMI + 4K Drone' },
  { num: 5, url: '/social/omnichannel-pack/slide_5.png', label: 'Slide 5 — Rates & Free Tool' }
];

export default function UnifiedForesightStudioPage() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('omnichannel');
  const [topic, setTopic] = useState('Phase 1 Pre-Drywall (From $275) & New Construction (From $400) Inspections');
  const [city, setCity] = useState('Decatur');
  const [generatedPacket, setGeneratedPacket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    fetch('/api/studio')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  async function handleGenerate(e) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, city })
      });
      const json = await res.json();
      if (json.ok) setGeneratedPacket(json.packet);
    } finally {
      setLoading(false);
    }
  }

  function copyText(key, text) {
    navigator.clipboard.writeText(text || '');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2200);
  }

  const m = data?.metrics || {};
  const pricing = data?.truth?.pricing || {};

  return (
    <main style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', padding: '2rem 1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              PRIORITY #1: FHINSPECTIONSATL.COM • VERCEL PRO COMMAND HUB (v{data?.truth?.version || '2026.10.20'})
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Foresight Unified Email, Social &amp; Video Marketing Studio
            </h1>
            <p style={{ color: '#94a3b8', margin: '0.35rem 0 0', fontSize: '0.92rem' }}>
              Website-First Operations Engine: Ready-to-Post GBP Store 264545 Graphics, 5-Slide Tri-Logo Carousels, LinkedIn PDF Deck, 30s Anthem Video Reel, and 48h VIP Due Diligence OpenSMS driving bookings to https://www.fhinspectionsatl.com.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <a href="/vip-dispatch.html" style={{ background: '#10b981', color: '#06281e', fontWeight: 800, padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
              📲 Open 48h VIP SMS Dispatcher ({m.activeDueDiligence48h ?? '...'})
            </a>
            <a href="/warranty-dispatch.html" style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', fontWeight: 700, padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
              🛡️ 11-Month Warranty Dispatch
            </a>
            <Link href="/dashboard" style={{ background: '#1e293b', color: '#d4af37', border: '1px solid rgba(212,175,55,0.4)', fontWeight: 700, padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
              📊 SEO &amp; Rankings Dashboard
            </Link>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Omnichannel & GBP Pack', val: '8 Assets Live', sub: '4:3 GBP + 5 Slides + PDF + 30s MP4' },
            { label: '48h Active Due Diligence', val: m.activeDueDiligence48h ?? '434', sub: 'Strict 0–48h FMLS Window' },
            { label: 'Video & Carousel Packets', val: m.videoStudioPacketsReady ?? '23', sub: '9:16 Master + 30s GBP + 5-Slide PDF' },
            { label: 'LinkedIn & GBP Queue', val: m.socialQueueOmnichannelCount ?? '28', sub: '100% Locked to data/truth.json' }
          ].map((stat, idx) => (
            <div key={idx} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.1rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d4af37', margin: '0.25rem 0' }}>{stat.val}</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{stat.sub}</div>
            </div>
          ))}
        </section>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'omnichannel', label: '🚀 Ready-to-Post Omnichannel & GBP Pack (Store 264545)' },
            { id: 'generator', label: '🎬 1-Click Custom Campaign Generator' },
            { id: 'packets', label: `📦 Studio Packet Vault (${m.videoStudioPacketsReady ?? 23})` },
            { id: 'email', label: `📧 48h Due Diligence Queue (${m.activeDueDiligence48h ?? 434})` },
            { id: 'truth', label: '⚖️ Master Pricing & Truth Lock' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? '#d4af37' : '#111827',
                color: activeTab === t.id ? '#090d16' : '#cbd5e1',
                border: '1px solid ' + (activeTab === t.id ? '#d4af37' : '#1f2937'),
                padding: '0.65rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.86rem'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'omnichannel' && (
          <section style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Row 1: Google Business Profile Store 264545 Card + Copy + Q&A */}
            <div style={{ background: '#111827', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1.15rem' }}>
                <div>
                  <span style={{ color: '#34d399', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Step 1 • Google Map-Pack Booster (Store 264545)</span>
                  <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', color: '#ffffff' }}>Google Business Profile 4:3 Graphic + Weekly Update + Q&amp;A Seed</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a href="/social/omnichannel-pack/gbp-store-264545-card.png" download="foresight-gbp-store-264545-update.png" style={{ background: '#d4af37', color: '#090d16', fontWeight: 800, padding: '0.55rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem' }}>
                    ⬇️ Download 4:3 GBP Image
                  </a>
                  <button onClick={() => copyText('gbpUpdate', OMNICHANNEL_PACK.gbpUpdate)} style={{ background: '#10b981', color: '#06281e', fontWeight: 800, border: 'none', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    {copiedKey === 'gbpUpdate' ? '✓ GBP Post Copied!' : '📋 Copy GBP Update Text'}
                  </button>
                  <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', fontWeight: 700, padding: '0.55rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem' }}>
                    ↗ Open Google Business Profile
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.85rem' }}>
                  <img src="/social/omnichannel-pack/gbp-store-264545-card.png" alt="Foresight GBP Store 264545 Update Card" style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    1200x900 (4:3) • Tri-Logo Verified (Unmodified Logopng.png on #FFFFFF + Optical CMI 122px &gt; CPI 112px) • CTA Link: https://www.fhinspectionsatl.com/homebuyer-red-flags
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.9rem' }}>
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#d4af37', fontSize: '0.88rem' }}>📍 GBP &ldquo;Add Update&rdquo; Body Copy</strong>
                      <button onClick={() => copyText('gbpUpdate2', OMNICHANNEL_PACK.gbpUpdate)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.65rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                        {copiedKey === 'gbpUpdate2' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.81rem', lineHeight: 1.5, color: '#e2e8f0', maxHeight: '210px', overflowY: 'auto' }}>{OMNICHANNEL_PACK.gbpUpdate}</pre>
                  </div>

                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#34d399', fontSize: '0.88rem' }}>❓ GBP Q&amp;A Seed (Question + Official Owner Answer)</strong>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => copyText('gbpQ', OMNICHANNEL_PACK.gbpQaQuestion)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.74rem' }}>
                          {copiedKey === 'gbpQ' ? '✓ Copied Q' : 'Copy Question'}
                        </button>
                        <button onClick={() => copyText('gbpA', OMNICHANNEL_PACK.gbpQaAnswer)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.74rem' }}>
                          {copiedKey === 'gbpA' ? '✓ Copied A' : 'Copy Answer'}
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.81rem', fontWeight: 700, color: '#facc15', margin: '0 0 0.35rem' }}>Q: {OMNICHANNEL_PACK.gbpQaQuestion}</p>
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.48, color: '#cbd5e1', margin: 0 }}>A: {OMNICHANNEL_PACK.gbpQaAnswer}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 5-Slide 4:5 Editorial Carousel + LinkedIn PDF Deck */}
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1.15rem' }}>
                <div>
                  <span style={{ color: '#d4af37', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>Step 2 • 5-Slide 4:5 Editorial Carousel + LinkedIn Document Deck</span>
                  <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', color: '#ffffff' }}>Instagram (@fhinspectionsatl), Facebook &amp; LinkedIn Carousel Pack</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a href="/social/omnichannel-pack/linkedin_carousel_deck.pdf" download="foresight-3am-red-flags-linkedin-carousel.pdf" style={{ background: '#d4af37', color: '#090d16', fontWeight: 800, padding: '0.55rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem' }}>
                    ⬇️ Download 5-Page LinkedIn PDF
                  </a>
                  <button onClick={() => copyText('igCap', OMNICHANNEL_PACK.carouselCaption)} style={{ background: '#10b981', color: '#06281e', fontWeight: 800, border: 'none', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    {copiedKey === 'igCap' ? '✓ IG/FB Caption Copied!' : '📋 Copy IG / FB Caption'}
                  </button>
                  <button onClick={() => copyText('liPost', OMNICHANNEL_PACK.linkedInPost)} style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 800, border: 'none', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem' }}>
                    {copiedKey === 'liPost' ? '✓ LinkedIn Post Copied!' : '💼 Copy LinkedIn Post'}
                  </button>
                  <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', fontWeight: 700, padding: '0.55rem 0.9rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem' }}>
                    ↗ LinkedIn
                  </a>
                  <a href="https://www.instagram.com/fhinspectionsatl/" target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', fontWeight: 700, padding: '0.55rem 0.9rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem' }}>
                    ↗ Instagram
                  </a>
                  <a href="https://www.facebook.com/fhinspectionsatl/" target="_blank" rel="noopener noreferrer" style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', fontWeight: 700, padding: '0.55rem 0.9rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem' }}>
                    ↗ Facebook
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem', marginBottom: '1.2rem' }}>
                {SLIDES.map((s) => (
                  <div key={s.num} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <img src={s.url} alt={s.label} style={{ width: '100%', height: 'auto', borderRadius: '6px', display: 'block' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1' }}>{s.label}</span>
                      <a href={s.url} download={`foresight-slide-${s.num}.png`} style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 800, textDecoration: 'none' }}>⬇️ PNG</a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37', fontSize: '0.86rem' }}>📸 Instagram &amp; Facebook Carousel Caption</strong>
                    <button onClick={() => copyText('igCap2', OMNICHANNEL_PACK.carouselCaption)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'igCap2' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.8rem', lineHeight: 1.5, color: '#e2e8f0', maxHeight: '200px', overflowY: 'auto' }}>{OMNICHANNEL_PACK.carouselCaption}</pre>
                </div>

                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#60a5fa', fontSize: '0.86rem' }}>💼 LinkedIn Personal &amp; Company Post (+ 1st Comment)</strong>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => copyText('liPost2', OMNICHANNEL_PACK.linkedInPost)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.74rem' }}>
                        {copiedKey === 'liPost2' ? '✓ Post Copied' : 'Copy Post'}
                      </button>
                      <button onClick={() => copyText('liComm', OMNICHANNEL_PACK.linkedInComment)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.74rem' }}>
                        {copiedKey === 'liComm' ? '✓ 1st Comment Copied' : 'Copy 1st Comment'}
                      </button>
                    </div>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.8rem', lineHeight: 1.5, color: '#e2e8f0', maxHeight: '200px', overflowY: 'auto' }}>{OMNICHANNEL_PACK.linkedInPost}</pre>
                </div>
              </div>
            </div>

            {/* Row 3: 30s 9:16 Anthem Video Reel + Homeowner Hourglass Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#34d399', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>Step 3 • Reels / Shorts / TikTok + GBP Video</span>
                    <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.15rem' }}>30s 9:16 Vertical Reel (Foresight Anthem Audio)</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a href="/social/omnichannel-pack/reel-3am-homebuyer-red-flags-30s.mp4" download="foresight-3am-red-flags-reel-30s.mp4" style={{ background: '#d4af37', color: '#090d16', fontWeight: 800, padding: '0.5rem 0.85rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem' }}>
                      ⬇️ Download 30s MP4
                    </a>
                    <button onClick={() => copyText('reelCap', OMNICHANNEL_PACK.reelCaption)} style={{ background: '#10b981', color: '#06281e', fontWeight: 800, border: 'none', padding: '0.5rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      {copiedKey === 'reelCap' ? '✓ Caption Copied!' : '📋 Copy Reel Caption'}
                    </button>
                  </div>
                </div>
                <video
                  controls
                  preload="metadata"
                  poster="/social/omnichannel-pack/slide_1.png"
                  style={{ width: '100%', maxHeight: '420px', background: '#000', borderRadius: '10px', marginBottom: '0.75rem' }}
                >
                  <source src="/social/omnichannel-pack/reel-3am-homebuyer-red-flags-30s.mp4" type="video/mp4" />
                </video>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.8rem', lineHeight: 1.48, color: '#cbd5e1', background: '#090d16', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b' }}>{OMNICHANNEL_PACK.reelCaption}</pre>
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#d4af37', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase' }}>Step 4 • Post-Closing Retention &amp; Review Loop</span>
                    <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.15rem' }}>Homeowner Care &amp; Month-11 Hourglass Email</h3>
                  </div>
                  <button onClick={() => copyText('homeEmail', OMNICHANNEL_PACK.homeownerEmail)} style={{ background: '#d4af37', color: '#090d16', fontWeight: 800, border: 'none', padding: '0.5rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    {copiedKey === 'homeEmail' ? '✓ Email Copied!' : '📋 Copy Homeowner Email'}
                  </button>
                </div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.81rem', lineHeight: 1.55, color: '#e2e8f0', background: '#090d16', padding: '1rem', borderRadius: '10px', border: '1px solid #1e293b', flex: 1 }}>{OMNICHANNEL_PACK.homeownerEmail}</pre>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'generator' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#f8fafc' }}>
              Synchronized Multi-Channel Generator (Video Script + 5-Slide Carousel + GBP/LinkedIn/Reels + Realtor Email)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Enter any inspection topic and Metro Atlanta city below to generate a 100% harmonized campaign across Video, Social, GBP, and Email using your canonical pricing (From $345 Homes, From $295 Condos, From $275 Pre-Drywall / From $400 New Construction, Auxiliary Services: Call for Quote, $35,000 Protection).
            </p>
            <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Topic (e.g., Phase 1 Pre-Drywall (From $275), New Construction (From $400), Polybutylene Pipe)"
                style={{ background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}
              />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City (e.g., Decatur, Alpharetta, Buckhead)"
                style={{ background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}
              />
              <button type="submit" disabled={loading} style={{ background: '#d4af37', color: '#090d16', fontWeight: 800, border: 'none', borderRadius: '8px', padding: '0 1.35rem', cursor: 'pointer' }}>
                {loading ? 'Generating...' : '⚡ Generate Unified Packet'}
              </button>
            </form>

            {generatedPacket && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37' }}>🎥 @plsinspectnow 30s Video Script</strong>
                    <button onClick={() => copyText('video', `${generatedPacket.videoStudioScript.hook0to3s}\n\n${generatedPacket.videoStudioScript.body3to22s}\n\n${generatedPacket.videoStudioScript.cta22to29s}`)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'video' ? '✓ Copied' : 'Copy Script'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.5rem' }}><strong>Scene:</strong> {generatedPacket.videoStudioScript.avatarPrompt}</p>
                  <p style={{ fontSize: '0.86rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{generatedPacket.videoStudioScript.hook0to3s}{'\n\n'}{generatedPacket.videoStudioScript.body3to22s}{'\n\n'}{generatedPacket.videoStudioScript.cta22to29s}</p>
                </div>

                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37' }}>📍 Google Business Profile &amp; LinkedIn Post</strong>
                    <button onClick={() => copyText('linkedin', generatedPacket.socialPosts.linkedin)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'linkedin' ? '✓ Copied' : 'Copy LinkedIn'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.84rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{generatedPacket.socialPosts.linkedin}</p>
                </div>

                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37' }}>📧 1-to-1 Realtor Email Campaign Snippet</strong>
                    <button onClick={() => copyText('email', `Subject: ${generatedPacket.emailCampaignSnippet.subject}\n\n${generatedPacket.emailCampaignSnippet.body}`)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'email' ? '✓ Copied' : 'Copy Email'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 0.4rem' }}>Subject: {generatedPacket.emailCampaignSnippet.subject}</p>
                  <p style={{ fontSize: '0.83rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{generatedPacket.emailCampaignSnippet.body}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'packets' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Ready Foresight Video &amp; Carousel Packets (Synced from @plsinspectnow Studio)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {(data?.studioPackets || []).map(pkt => (
                <div key={pkt.jobId} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>{pkt.date} • {pkt.jobId}</div>
                  <div style={{ fontWeight: 700, margin: '0.35rem 0', fontSize: '0.95rem' }}>{pkt.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {pkt.hasMasterVideo ? '✅ 9:16 Video ' : ''}
                    {pkt.hasGbp30sVideo ? '• ✅ 30s GBP Video ' : ''}
                    {pkt.hasCarouselPdf ? `• ✅ ${pkt.slideCount}-Slide Carousel PDF` : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'email' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Active 48-Hour Under-Contract Due Diligence Feed &amp; Email Nurture</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {(data?.recentUnderContract || []).map(deal => (
                <div key={deal.id} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{deal.role} • {deal.date} • {deal.price}</div>
                  <div style={{ fontWeight: 700, margin: '0.25rem 0' }}>{deal.name} ({deal.brokerage})</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{deal.address}, {deal.city}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'truth' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Canonical Pricing &amp; Legal Guardrails (data/truth.json)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(pricing).map(([k, v]) => (
                <div key={k} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{k}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d4af37' }}>{v}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
