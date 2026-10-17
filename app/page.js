import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import ProcessSteps from './components/ProcessSteps';
import LatestPosts from './components/LatestPosts';
import NewsletterSignup from './components/NewsletterSignup';
import VslTriggerButton from './components/VslTriggerButton';
import HomeVideoPlayer from './components/HomeVideoPlayer';

import TrueValueComparison from './components/TrueValueComparison';
import Testimonials from './components/Testimonials';
const ThermalSlider = dynamic(() => import('./components/ThermalSlider'));
const FaqSearch = dynamic(() => import('./components/FaqSearch'));

export const metadata = {
  title: {
    absolute: 'Atlanta, GA Home Inspection & Certified Home Inspectors | $345',
  },
  description: '4.9★ Full Home Inspection in Atlanta, GA from $345 ($295 condos). 2 Certified Home Inspectors on every job, free thermal & 4K drone scans + $35,000 Warranty!',
  keywords: [
    'full home inspection',
    'home inspection Atlanta GA',
    'home inspectors atlanta',
    'home inspectors atlanta ga',
    'residential home inspector in atlanta, ga',
    'greater atlanta home inspectors',
    'best home inspector Atlanta',
    'certified master inspector Atlanta',
    'two inspector team Atlanta',
    'home inspection cost Atlanta',
    'radon testing Atlanta GA',
    'termite inspection Atlanta GA',
    'pool and spa inspection Atlanta',
    'sewer scope inspection Atlanta',
    'thermal imaging home inspection Atlanta',
    'aerial drone roof inspection Atlanta',
    '11 month warranty inspection Atlanta',
    'new construction inspection Atlanta',
    'pre-listing seller inspection Atlanta',
    'historic home inspection Atlanta',
    'due diligence home inspection Georgia',
    'short term rental STR inspection Atlanta',
    'crawlspace moisture inspection Atlanta'
  ],
  alternates: { canonical: 'https://www.fhinspectionsatl.com' },
  openGraph: {
    title: 'Foresight Home Inspections | Two Inspectors on Every Job',
    description: 'Atlanta home inspections led by a Certified Master Inspector®. Two inspectors. Up to $35,000 in warranty & guarantee protection included. Serving Metro Atlanta and surrounding North Georgia.',
    url: 'https://www.fhinspectionsatl.com',
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.fhinspectionsatl.com/#webpage",
        "url": "https://www.fhinspectionsatl.com",
        "name": "Foresight Home Inspections | Certified Master Inspector® | Atlanta GA",
        "description": "Two certified inspectors on every job. Led by a Certified Master Inspector® providing premium, thorough home inspections across Metro Atlanta.",
        "isPartOf": { "@id": "https://www.fhinspectionsatl.com/#website" },
        "relatedLink": [
          "https://www.fhinspectionsatl.com/videos/complete-home-systems-diagnostic",
          "https://www.fhinspectionsatl.com/due-diligence",
          "https://www.fhinspectionsatl.com/services/buyer-inspection"
        ],
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".slogan-heading", ".hero h1", ".hero p", ".badge"]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why do you send two home inspectors to a property?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our Two-Inspector Standard ensures maximum accuracy and efficiency. By putting two sets of expert eyes on your home, we catch defects solo inspectors miss, while reducing the on-site inspection time from 4+ hours down to roughly 1.5 to 2.5 hours."
            }
          },
          {
            "@type": "Question",
            "name": "What warranties and guarantees are included with a Foresight inspection?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every home inspection includes up to $35,000 in combined warranty and guarantee protection: (1) our $10,000 Elite Master Inspection Warranty ($0 deductible) covering appliances, structural elements, HVAC, plumbing, electrical, mold remediation, and roof leaks; and (2) InterNACHI's $25,000 Honor Guarantee backing member integrity with up to $25,000 for personal property replacement."
            }
          },
          {
            "@type": "Question",
            "name": "How much does a certified home inspection cost in Metro Atlanta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Foresight home inspections start at $295 for condos/townhomes and $345 for single-family homes. Specialized add-ons include certified mold and indoor air quality lab testing ($450), 48-hour continuous electronic radon testing ($275), fiber-optic sewer scope camera audits ($450), swimming pool & spa evaluations ($300), and official termite/WDO clearance letters ($125+)."
            }
          },
          {
            "@type": "Question",
            "name": "Does Foresight Home Inspections do mold testing in Atlanta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Foresight Home Inspections provides certified mold testing and indoor air quality assessments across Metro Atlanta for a flat rate of $450. Testing includes calibrated spore-trap air sampling (2 indoor living zones tested against an outdoor control baseline) and surface tape lifts for visible fungal growth. All samples are analyzed by an independent accredited microbiology laboratory, with certified spore count reports returned in 24 to 48 hours. In addition, our included $10,000 Elite Warranty provides up to $2,250 in mold remediation coverage."
            }
          },
          {
            "@type": "Question",
            "name": "What does Christopher Boykin's Certified Master Inspector® credential mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Christopher Boykin is a Certified Master Inspector® (CMI), the highest professional designation in North America. Because Georgia does not require state licensing for home inspectors, Christopher's CMI credential proves thousands of hours of verified field experience, peer-reviewed education, and strict adherence to InterNACHI Standards of Practice."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between a standard solo inspection and Foresight's Dual-Team CMI Protocol?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Because Georgia does not require state licensing for home inspectors, standards vary widely across operators. In a standard solo inspection, one inspector must evaluate the entire property alone over 4+ hours, where physical fatigue can set in, specialty scans (thermal, drone) often cost extra, and post-inspection warranties are rarely provided. With Foresight's Dual-Team CMI Protocol, two certified inspectors led by board-certified CMI Christopher Boykin inspect simultaneously, dividing interior systems and structural envelopes. This cuts on-site disruption to 1.5–2.5 hours, includes complimentary infrared thermal imaging and drone scans, delivers same-day digital reporting with 1-click GAR repair lists, and includes up to $35,000 in combined warranty and guarantee protection."
            }
          },
          {
            "@type": "Question",
            "name": "Can I get an itemized contractor repair cost estimate for inspection defects?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Standard home inspections in Georgia are strictly diagnostic evaluations in accordance with InterNACHI Standards of Practice (inspectors do not provide repair pricing by default). However, if you choose, Foresight offers an optional $99 Itemized Contractor Repair Cost Estimate. Calibrated using regional Metro Atlanta contractor trade rates, this report provides line-item repair costs and ready-to-use sample repair amendment wording to maximize your seller credit negotiations. It is available as a $99 add-on to any Foresight inspection or as a standalone $99 audit for outside inspection reports."
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
      <section className="hero hero-section-responsive">
        {/* Full-bleed background image */}
        <picture>
          <source media="(min-width: 641px)" srcSet="/images/luxury-home.webp" type="image/webp" />
          <source media="(max-width: 640px)" srcSet="/images/luxury-home-mobile.webp" type="image/webp" />
          <img
            src="/images/luxury-home-mobile.webp"
            alt="Luxury Atlanta GA Estate Home Inspected by Foresight Home Inspections"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </picture>
        {/* Dark gradient overlay for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.68) 40%, rgba(15,23,42,0.85) 100%)', zIndex: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="badge hero-eyebrow-badge">
            METICULOUS HOME INSPECTIONS FOR ATLANTA&apos;S FINEST HOMES
          </span>

          <h1 className="hero-heading">
            Atlanta Full Home Inspections<br />
            <span style={{ color: '#FDE047', background: 'linear-gradient(135deg, #FFFBEB 0%, #FDE047 30%, #D4AF37 70%, #CA8A04 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
              Two Certified Inspectors on Every Job.
            </span>
          </h1>

          <p className="hero-description">
            Foresight provides premier Atlanta home inspections led by board-certified Certified Master Inspector® Christopher Boykin. From single-family homes to luxury estates across 20 Metro Atlanta counties, every inspection features two certified inspectors working in tandem, complimentary infrared thermal imaging, aerial drone roof scanning, and up to $35,000 in combined warranty protection.
          </p>

          <div className="hero-cta-group">
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '1.05rem 2.25rem', fontSize: '1.05rem', fontWeight: 800, borderRadius: 'var(--radius-md)', boxShadow: '0 6px 25px rgba(212, 175, 55, 0.45)' }}>
              Schedule Inspection Now
            </a>
            <Link prefetch={false} href="/quote" className="btn btn-outline" style={{ padding: '1.05rem 2rem', fontSize: '1.02rem', fontWeight: 700, borderRadius: 'var(--radius-md)', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.28)', color: '#FFFFFF', backdropFilter: 'blur(8px)' }}>
              Instant Fee Calculator
            </Link>
            <VslTriggerButton />
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#E2E8F0', fontSize: '0.92rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--color-gold)', letterSpacing: '2px' }}>★★★★★</span>
            <span>4.9/5 Rating &bull; Google <strong style={{ color: '#FFFFFF' }}>&ldquo;Foresight Home Inspections&rdquo;</strong> to read 40+ verified 5-star reviews</span>
          </div>

          <div style={{ display: 'inline-block', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34d399', padding: '0.45rem 1.25rem', borderRadius: '2rem', fontSize: '0.88rem', fontWeight: 600, marginBottom: '2rem', backdropFilter: 'blur(4px)' }}>
            ✓ Includes Free Utilities Plus Concierge Setup ($150 Value)
          </div>

          <div className="hero-credentials-container">
            <div className="hero-credentials-eyebrow">
              <span>★ Board-Certified Master Accreditations ★</span>
            </div>

            <div className="hero-credentials-dock">
              {/* PRIMARY TIER: Certified Master Inspector (CMI), 10+ Years Experience, InterNACHI CPI */}
              <div className="hero-credentials-primary-row">
                {/* Certified Master Inspector (CMI) */}
                <div className="hero-cred-card hero-cred-featured">
                  <Image
                    src="/images/cmi_logo.webp"
                    alt="Certified Master Inspector Christopher Boykin"
                    width={150}
                    height={150}
                    sizes="(max-width: 768px) 110px, 145px"
                    className="hero-cred-img-primary"
                    priority
                  />
                  <div className="hero-cred-caption">
                    <span className="hero-cred-title">Certified Master Inspector®</span>
                    <span className="hero-cred-sub">Highest Designation in North America</span>
                    <span className="hero-cred-tag">Top 3% In Nation</span>
                  </div>
                </div>

                {/* 10+ Years Experience Badge */}
                <div className="hero-cred-card hero-cred-exp">
                  <span className="hero-cred-exp-num">10+</span>
                  <span className="hero-cred-exp-text">Years Trusted<br />Metro Atlanta Experience</span>
                </div>

                {/* InterNACHI Certified Professional Inspector (CPI) */}
                <div className="hero-cred-card hero-cred-featured">
                  <Image
                    src="/images/cpi_logo.webp"
                    alt="InterNACHI Certified Professional Inspector"
                    width={150}
                    height={150}
                    sizes="(max-width: 768px) 110px, 145px"
                    className="hero-cred-img-primary"
                    priority
                  />
                  <div className="hero-cred-caption">
                    <span className="hero-cred-title">InterNACHI® Certified</span>
                    <span className="hero-cred-sub">World&apos;s Elite Inspection Standard</span>
                    <span className="hero-cred-tag">Board-Accredited</span>
                  </div>
                </div>
              </div>

              {/* Golden Accent Divider */}
              <div className="hero-credentials-divider" />

              {/* SECONDARY TIER: Specialized Diagnostic Certifications */}
              <div className="hero-credentials-secondary-row">
                {/* Infrared Certified - High Contrast White Text */}
                <div className="hero-cred-subcard">
                  <Image
                    src="/images/infrared-certified-white-text.webp"
                    alt="InterNACHI Infrared Certified Inspector"
                    width={130}
                    height={130}
                    sizes="(max-width: 768px) 95px, 120px"
                    className="hero-cred-img-secondary"
                  />
                  <span className="hero-cred-sublabel">Infrared Thermal Diagnostic</span>
                </div>

                {/* Moisture Intrusion Specialist */}
                <div className="hero-cred-subcard">
                  <Image
                    src="/images/internachi_moisture_intrusion_inspector.webp"
                    alt="InterNACHI Certified Moisture Intrusion Inspector"
                    width={125}
                    height={125}
                    sizes="(max-width: 768px) 90px, 115px"
                    className="hero-cred-img-secondary"
                  />
                  <span className="hero-cred-sublabel">Moisture Intrusion Specialist</span>
                </div>

                {/* New Construction Inspector */}
                <div className="hero-cred-subcard">
                  <Image
                    src="/images/internachi_new_construction_inspector.webp"
                    alt="InterNACHI Certified New Construction Inspector"
                    width={145}
                    height={100}
                    sizes="(max-width: 768px) 100px, 130px"
                    className="hero-cred-img-secondary"
                    style={{ height: '90px', width: 'auto' }}
                  />
                  <span className="hero-cred-sublabel">New Construction Certified</span>
                </div>

                {/* 11th Month Warranty Inspector */}
                <div className="hero-cred-subcard">
                  <Image
                    src="/images/11-month-warranty-white-text.webp"
                    alt="InterNACHI Certified 11th Month Warranty Inspector"
                    width={130}
                    height={130}
                    sizes="(max-width: 768px) 95px, 120px"
                    className="hero-cred-img-secondary"
                  />
                  <span className="hero-cred-sublabel">11-Month Warranty Inspector</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AEO / GEO QUANTITATIVE EVIDENCE STRIP (First 30% LLM Scrape Anchor) ── */}
      <section style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', padding: '1.75rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', textAlign: 'center' }}>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)' }}>10+ Years</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Board-Certified CMI Leadership</div>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38BDF8' }}>2 Inspectors</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Deployed on 100% of Jobs</div>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34D399' }}>1.5–2.5 Hrs</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>50% Faster Than Solo Inspections</div>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FDE047' }}>&lt;24 Hours</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Digital Report &amp; GAR Repair Lists</div>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#A78BFA' }}>$35,000</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Warranty Protection ($0 Deductible)</div>
            </div>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F87171' }}>87 Cities</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Across 20 Metro Atlanta Counties</div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SHOWCASE SECTION (Home Systems Commercial & Field Proof) */}
      <section className="section bg-dark text-white" style={{ padding: '4.5rem 0', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="badge" style={{ background: 'rgba(211,47,47,0.2)', color: 'var(--color-red-light)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              Field Diagnostics In Action
            </span>
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.4rem', fontWeight: 800 }}>
              See How Our Two-Inspector Team Evaluates Atlanta Home Systems
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '720px', margin: '0.5rem auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Watch Lead Certified Master Inspector® Christopher Boykin demonstrate our signature two-inspector protocol, major systems inspection, and advanced diagnostic technology in the field.
            </p>
          </div>

          <div style={{ maxWidth: '980px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* 9:16 Video Player Container */}
            <HomeVideoPlayer />

            {/* Video Feature & Direct-Response Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.75rem', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  What You Will See In This Field Audit
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.9rem', color: '#E2E8F0', fontSize: '0.95rem' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '1.1rem' }}>✓</span>
                    <div><strong>Complete Home Systems Evaluation:</strong> Roof, framing, electrical panel, plumbing, and HVAC checked in depth.</div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '1.1rem' }}>✓</span>
                    <div><strong>Two Certified Inspectors:</strong> Lead CMI® on site with senior inspector for double coverage in half the time.</div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '1.1rem' }}>✓</span>
                    <div><strong>Advanced Diagnostic Suite:</strong> Complimentary infrared thermal imaging and 4K aerial drone roof scans.</div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '1.1rem' }}>✓</span>
                    <div><strong>Up to $35,000 Protection:</strong> $10,000 Master Warranty ($0 deductible) + InterNACHI® $25,000 Honor Guarantee.</div>
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ padding: '0.9rem 2rem', fontSize: '1rem', flexGrow: 1, textAlign: 'center' }}
                >
                  Schedule Your Inspection
                </a>
                <Link
                  prefetch={false}
                  href="/quote"
                  className="btn btn-outline-light"
                  style={{ padding: '0.9rem 2rem', fontSize: '1rem', flexGrow: 1, textAlign: 'center' }}
                >
                  Instant Quote
                </Link>
              </div>

              <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                <Link
                  prefetch={false}
                  href="/videos/complete-home-systems-diagnostic"
                  style={{
                    color: 'var(--color-gold)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px'
                  }}
                >
                  Open Dedicated Watch Page &amp; Full Audit Transcript →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 4-Step Process Flow */}
      <ProcessSteps />

      {/* TIERED SERVICE ARCHITECTURE */}
      <section className="section" style={{ background: '#0F172A', color: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem' }}>
              Tailored Inspection Solutions
            </span>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.25rem', marginBottom: '1rem' }}>
              Choose the Home Inspection Tier Right for Your Property
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Whether purchasing your first home or investing in a luxury estate, our two-inspector team provides unmatched diagnostic precision.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'stretch' }}>
            {/* TIER 1: CORE PROPERTY INSPECTION */}
            <div style={{ background: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '2.5rem', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge" style={{ background: '#334155', color: '#F1F5F9', marginBottom: '1rem' }}>
                  Core Home Inspection Tier
                </span>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                  Standard Buyer &amp; Seller Home Inspection
                </h3>
                <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                  Ideal for single-family homes, townhomes, condos, and pre-listing seller inspections across Metro Atlanta.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li>✓ <strong>Two Certified Inspectors</strong> on every job</li>
                  <li>✓ Standard infrared thermal imaging &amp; Moisture Detection</li>
                  <li>✓ Same-day digital photo report within 24 hours</li>
                  <li>✓ Compliments of Foresight: <strong>Up to $35,000 Protection</strong> ($10K Warranty + $25K Honor Guarantee)</li>
                  <li>✓ Full online scheduling &amp; transparent flat-rate calculator</li>
                </ul>
              </div>
              <div>
                <Link prefetch={false} href="/quote" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', borderColor: '#64748B', color: '#FFFFFF', padding: '0.85rem' }}>
                  Calculate Instant Flat Rate →
                </Link>
              </div>
            </div>

            {/* TIER 2: ESTATE & LUXURY HOME INSPECTION */}
            <div style={{ background: 'linear-gradient(145deg, #1E293B, #0F172A)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', border: '2px solid var(--color-gold)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.15)' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'var(--color-gold)', color: '#0F172A', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.85rem', borderRadius: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MOST POPULAR FOR $750K+ HOMES
              </div>
              <div>
                <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem' }}>
                  Estate &amp; Luxury Tier
                </span>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                  Estate &amp; Luxury Home Inspection
                </h3>
                <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                  Tailored for high-value estates, custom luxury builds, and complex architectural grounds in Buckhead, Alpharetta, and Milton.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#F1F5F9', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li>✓ Lead <strong>Certified Master Inspector® (CMI)</strong> + Senior Inspector</li>
                  <li>✓ Extended 4+ hour dedicated property evaluation window</li>
                  <li>✓ Full Aerial Drone Scanning + infrared thermal Envelope Diagnostics</li>
                  <li>✓ Dedicated 1-on-1 post-inspection strategy call with lead CMI</li>
                  <li>✓ Priority report turnaround &amp; Up to $35,000 Warranty &amp; Guarantee Protection</li>
                </ul>
              </div>
              <div>
                <Link prefetch={false} href="/contact" className="btn btn-gold" style={{ width: '100%', textAlign: 'center', padding: '0.85rem' }}>
                  Request Estate Consultation →
                </Link>
              </div>
            </div>
          </div>

          {/* OPTIONAL $99 ITEMIZED CONTRACTOR REPAIR ESTIMATES & GAR F404 AMENDMENT EXHIBIT */}
          <div style={{
            marginTop: '2.5rem',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.75rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.35)', color: 'var(--color-gold)', padding: '0.3rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                <span>Optional Due Diligence Service &bull; $99 Flat Fee</span>
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                Itemized Contractor Repair Cost Estimates &amp; Amendment Exhibits ($99)
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.98rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                Standard Georgia home inspections are strictly diagnostic evaluations per InterNACHI Standards of Practice (inspectors do not provide repair pricing by default). However, <strong>if you choose</strong>, Foresight provides an empirical <strong>$99 Itemized Contractor Repair Cost Estimate</strong> calibrated with regional Metro Atlanta contractor trade labor ($95–$165/hr) and materials schedules.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.88rem', color: '#94A3B8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Ready-to-paste Georgia repair amendment language
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Optional $99 add-on to any Foresight inspection
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Available as a standalone $99 audit for outside reports
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
              <Link prefetch={false} href="/quote" className="btn btn-gold" style={{ textAlign: 'center', padding: '0.85rem 1.75rem', fontWeight: 700 }}>
                Add to Quote (+$99) →
              </Link>
              <Link prefetch={false} href="/repair-credit-calculator" className="btn btn-outline" style={{ textAlign: 'center', borderColor: '#64748B', color: '#F1F5F9', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
                Try Repair Credit Tool →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <Image src="/images/Christopher_Boykin.webp" alt="Christopher Boykin - Certified Master Inspector performing a home inspection in Atlanta GA" width={600} height={400} sizes="(max-width: 768px) 100vw, 600px" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
            </div>
            <div style={{ padding: '0 1rem' }}>
              <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0F172A', border: '1px solid #0F172A', marginBottom: '1rem', fontWeight: 600 }}>
                Master-Level Leadership
              </span>
              <h2 style={{ marginBottom: '1.25rem', color: '#0F172A', fontSize: '2.1rem' }}>Lead Certified Master Inspector® Christopher Boykin: Setting the Top 3% Standard in Georgia</h2>
              <p style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.6 }}>
                While Georgia requires zero state licensing for home inspectors, Christopher Boykin holds the elite Certified Master Inspector® (CMI) designation—the highest professional credential in North America, awarded to less than 3% of inspectors.
              </p>
              <p style={{ marginBottom: '1.25rem', fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
                Together with another fully certified professional inspector, our two-inspector team adheres strictly to the rigorous InterNACHI Standards of Practice. Armed with infrared thermal scanners, camera drones, and moisture diagnostics, we deliver detailed reports within 24 hours.
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#1E293B', lineHeight: 1.6, background: '#F8FAFC', padding: '1.25rem', borderLeft: '4px solid var(--color-gold)', borderRadius: 'var(--radius-sm)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                Every home inspection integrates infrared thermal imaging and aerial drone technology, and includes up to $35,000 in combined protection &mdash; our $10,000 Elite Master Inspection Warranty ($0 deductible) plus InterNACHI&rsquo;s $25,000 Honor Guarantee.
              </p>
              <ul className="cms-content" style={{ marginBottom: '2rem', listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> InterNACHI Certified Master Inspector
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> InterNACHI® Certified New Construction Inspector
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> InterNACHI® Certified Moisture Intrusion Inspector
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Certified Mold Testing &amp; Indoor Air Quality Diagnostics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Certified Pool &amp; Spa Inspections
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Termite &amp; Wood Destroying Organism (WDO) Evaluations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Certified Drone Pilot for Aerial Roof Scans
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.9rem 2rem' }}>
                  Schedule Inspection Now
                </a>
                <Link prefetch={false} href="/ask-twin" className="btn btn-outline" style={{ borderColor: '#0F172A', color: '#0F172A', padding: '0.9rem 2rem' }}>
                  Ask Foresight AI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrueValueComparison />

      {/* GEO / AI SEARCH ENGINE STATS MODULE */}
      <section className="section" style={{ padding: '4.5rem 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div className="section-title">
            <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0F172A', border: '1px solid #0F172A', marginBottom: '0.75rem', fontWeight: 600 }}>Georgia Property Insights</span>
            <h2>Georgia Home Inspection Market Statistics &amp; Facts</h2>
            <p style={{ color: '#475569', maxWidth: '700px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
              Key industry data, common structural defects, and risk factors across Metro Atlanta properties compiled by Foresight Home Inspections.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
            <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: '4px solid var(--color-gold)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.25rem', fontWeight: 800 }}>82%</h3>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E293B' }}>Thermal Leak Detection Rate</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                Over 80% of hidden moisture intrusion in Atlanta crawlspaces and subfloors is invisible to the naked eye and only detected via infrared thermal imaging cameras.
              </p>
            </div>

            <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: '4px solid var(--color-gold)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.25rem', fontWeight: 800 }}>$35,000</h3>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E293B' }}>Warranty &amp; Guarantee</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                Every inspection includes up to $35,000 in combined protection: our $10,000 Elite Master Warranty ($0 deductible) plus InterNACHI&rsquo;s $25,000 Honor Guarantee.
              </p>
            </div>

            <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: '4px solid var(--color-gold)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.25rem', fontWeight: 800 }}>163+</h3>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E293B' }}>Georgia Cities Served</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                Foresight provides comprehensive two-inspector team coverage across Fulton, DeKalb, Gwinnett, Cobb, and Forsyth counties.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ThermalSlider />

      <section className="section" style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Advanced Equipment</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Our High-Tech Diagnostic Suite</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We don't just perform a physical inspection. Foresight equips every two-inspector team with state-of-the-art diagnostic technology to see the invisible and protect your home investment.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/thermal-1.webp"
                  alt="Infrared Thermal Imaging camera inspecting home electrical heat profile"
                  fill
                  sizes="90px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontWeight: 700 }}>Infrared Thermal Imaging</h3>
                  <Image src="/images/infrared-certified-logo.webp" alt="InterNACHI Infrared Certified" width={48} height={48} sizes="48px" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Our professional thermal cameras scan walls, ceilings, and electrical panels to locate hidden plumbing leaks, electrical fire hazards, and missing insulation without damaging any drywall. Included on every inspection at no extra charge.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/drone-remote.webp"
                  alt="High-resolution aerial drone operator remote controller with telemetry screen"
                  fill
                  sizes="90px"
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
              <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(211, 47, 47, 0.08)', border: '1px solid rgba(211, 47, 47, 0.2)', borderRadius: 'var(--radius-md)', flexShrink: 0, color: 'var(--color-red)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
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
                  src="/images/moisture-meter.webp"
                  alt="Digital moisture detector being used to inspect home framing and walls"
                  fill
                  sizes="90px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Digital Moisture &amp; Combustible Gas Detectors</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  We employ electronic moisture scanners to trace active leaks through subflooring and walls, plus high-sensitivity combustible gas sniffers to check appliance lines and gas meters for micro-leaks.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(211, 47, 47, 0.08)', border: '1px solid rgba(211, 47, 47, 0.2)', borderRadius: 'var(--radius-md)', flexShrink: 0, color: 'var(--color-red)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31L4.69 17.6A2 2 0 0 0 6.36 21h11.28a2 2 0 0 0 1.67-3.4L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><line x1="14" y1="14" x2="14.01" y2="14"/></svg>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Calibrated Mold Spore-Trap Air Pumps</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Calibrated high-volume air sampling pumps and Air-O-Cell cassettes capture airborne fungal spores across interior living spaces vs. an outdoor baseline, analyzed by an independent accredited microbiology lab.
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
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-red)' }}>The Due Diligence Accelerator (2-Inspector Team)</h3>
              <p>In Atlanta's fast-paced market, your due diligence window is closing fast. Our two-inspector team cuts on-site time in half and guarantees your comprehensive digital report within 24 hours—giving you the maximum possible time to negotiate repairs or price drops.</p>
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
              <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(211, 47, 47, 0.08)', border: '1px solid rgba(211, 47, 47, 0.2)', borderRadius: '12px', flexShrink: 0, color: 'var(--color-red)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Realtor Convenience: Active SUPRA Access</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1.025rem', lineHeight: 1.6 }}>
                  Realtors can skip the drive and stay focused on their clients. Foresight carries active <strong>SUPRA key access</strong> for secure lockbox entry. We handle the opening and locking procedures ourselves, eliminating coordination headaches and saving real estate agents valuable hours on site.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)', padding: '2.5rem' }}>
              <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(211, 47, 47, 0.08)', border: '1px solid rgba(211, 47, 47, 0.2)', borderRadius: '12px', flexShrink: 0, color: 'var(--color-red)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
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
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '0.4rem 1.25rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem', display: 'inline-block' }}>
              UNMATCHED CLIENT FINANCIAL PROTECTION
            </span>
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              Up to <span style={{ color: 'var(--color-gold)' }}>$35,000</span> in Combined Warranty & Guarantee Protection
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '850px', margin: '0 auto', fontSize: '1.2rem', lineHeight: 1.6 }}>
              Because Christopher Boykin is a Certified Master Inspector® (CMI) &mdash; the highest credential awarded by the Master Inspector Certification Board &mdash; every Foresight inspection includes two layers of backing: the <strong>$10,000 Elite Master Inspection Warranty</strong> plus <strong>InterNACHI&rsquo;s $25,000 Honor Guarantee</strong>.
            </p>
          </div>
          
          {/* Pillar 1 Header */}
          <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.75rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ background: '#FFFFFF', padding: '0.6rem 1.25rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0,0,0,0.45)', border: '2px solid rgba(212, 175, 55, 0.4)' }}>
                <Image
                  src="/images/internachi_inspection_warranty.webp"
                  alt="InterNACHI Inspection Warranty"
                  width={200}
                  height={86}
                  sizes="200px"
                  style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pillar 1 &bull; Mechanical, Structural &amp; Appliance Protection</span>
                <h3 style={{ color: '#FFFFFF', margin: '0.25rem 0 0', fontSize: '1.45rem', fontWeight: 700 }}>$10,000 Elite Master Inspection Warranty ($0 Deductible)</h3>
              </div>
            </div>
            <span style={{ background: 'var(--color-gold)', color: '#0F172A', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: '2rem', fontSize: '0.9rem' }}>
              Included Free
            </span>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gold)' }}>✓</span> Elite Terms
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>90 Days from closing or 120 Days from inspection (whichever comes first).</p>
            </div>
            
            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gold)' }}>✓</span> Total Coverage
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>$10,000 Aggregate Coverage Limit with exactly $0 Deductible.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gold)' }}>✓</span> Appliances
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for Major Kitchen Appliances (NO age limits). Washer/Dryer fully included.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gold)' }}>✓</span> Structural
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 coverage for structural components of the home.</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gold)' }}>✓</span> Mechanicals
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 coverage for Major Mechanicals (HVAC, Electrical, Plumbing).</p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-gold)' }}>✓</span> Additional Protection
              </h3>
              <p style={{ color: 'var(--color-gray-mid)' }}>Up to $2,250 for Mold Remediation and $1,000 for Roof Leak Protection.</p>
            </div>
          </div>

          {/* Pillar 2: InterNACHI $25,000 Honor Guarantee */}
          <div style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', backdropFilter: 'blur(8px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Image
                src="/images/internachi_honor_guarantee_badge.webp"
                alt="InterNACHI $25,000 Honor Guarantee"
                width={360}
                height={199}
                sizes="(max-width: 640px) 280px, 360px"
                style={{ width: '100%', maxWidth: '340px', height: 'auto', margin: '0 auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))', borderRadius: '8px' }}
              />
              <div style={{ marginTop: '1.25rem' }}>
                <a
                  href="http://www.inspectorseek.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ fontSize: '0.9rem', padding: '0.65rem 1.5rem', display: 'inline-block' }}
                >
                  Find Certified Master Inspectors Near You
                </a>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Pillar 2 &bull; InterNACHI® Institutional Guarantee
              </span>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.85rem', lineHeight: 1.25 }}>
                InterNACHI&rsquo;s $25,000 Client Property Protection &amp; Honor Guarantee
              </h3>
              <p style={{ color: '#E2E8F0', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                InterNACHI® is so confident in the vetted background, character, and professional integrity of its certified inspectors that every inspection is backed by an exclusive <strong>$25,000 Honor Guarantee</strong>.
              </p>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.65, borderLeft: '3px solid var(--color-gold)', paddingLeft: '1rem', margin: 0 }}>
                InterNACHI® provides up to $25,000 aggregate coverage for the replacement of personal property during an inspection, ensuring complete financial security, mutual trust, and total peace of mind for buyers and real estate professionals across the United States and Canada.
              </p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.125rem', marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Getting an inspection isn't just smart—it saves you from financial disasters and gives realtors a powerful tool to negotiate thousands off the asking price.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link prefetch={false} href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                See Pricing First
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* LATEST BLOG POSTS */}
      <LatestPosts />

      {/* FAQ SECTION (AEO/GEO Optimized with Real-Time Search) */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: '2.25rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '2.5rem' }}>
            Get direct, factual answers to common questions about home inspections in Atlanta.
          </p>

          <FaqSearch
            faqs={[
              {
                q: "How much does a certified home inspection cost in Metro Atlanta?",
                a: "Foresight home inspections start at $295+ for condos and $345+ for homes, depending on the square footage of the property. Add-on services include certified mold & indoor air quality lab testing for $450, sewer scope camera inspections for $450, professional 48-hour continuous radon gas testing for $275, pool safety evaluations starting at $300, and official termite (WDO) reports starting at $125 (bundled)."
              },
              {
                q: "Does Foresight Home Inspections provide mold testing and air quality sampling?",
                a: "Yes. Foresight Home Inspections provides certified mold testing and indoor air quality assessments across Metro Atlanta for a flat rate of $450. Testing includes calibrated spore-trap air sampling (2 indoor living zones tested against an outdoor control baseline) and surface tape lifts for visible fungal growth. All samples are analyzed by an independent accredited microbiology laboratory, with certified spore count reports returned in 24 to 48 hours. In addition, our included $10,000 Elite Warranty provides up to $2,250 in mold remediation coverage."
              },
              {
                q: "Why does Foresight send two home inspectors on every job?",
                a: "Foresight Home Inspections sends two fully certified inspectors to every property. One inspector reviews the roof, structure, and exterior, while the other evaluates interior plumbing, electrical, and HVAC. This dual-coverage system checks twice as much, ensures extreme accuracy, and cuts inspection time in half to under 2.5 hours."
              },
              {
                q: "What does Christopher Boykin's Certified Master Inspector® credential mean?",
                a: "Christopher Boykin is a Certified Master Inspector® (CMI), the highest professional designation in North America. Because Georgia does not require state licensing for home inspectors, Christopher's CMI credential proves thousands of hours of verified field experience, peer-reviewed education, and strict adherence to InterNACHI Standards of Practice."
              },
              {
                q: "What is the difference between a standard solo inspection and Foresight's Dual-Team CMI Protocol?",
                a: "Because Georgia does not require state licensing for home inspectors, standards vary widely across operators. In a standard solo inspection, one inspector must evaluate the entire property alone over 4+ hours, where physical fatigue can set in, specialty scans (thermal, drone) often cost extra, and post-inspection warranties are rarely provided. With Foresight's Dual-Team CMI Protocol, two certified inspectors led by board-certified CMI Christopher Boykin inspect simultaneously, dividing interior systems and structural envelopes. This cuts on-site disruption to 1.5–2.5 hours, includes complimentary infrared thermal imaging and drone scans, delivers same-day digital reporting with 1-click GAR repair lists, and includes up to $35,000 in combined warranty and guarantee protection."
              },
              {
                q: "What is covered under Foresight's up to $35,000 in warranties and guarantees?",
                a: "Every standard home buyer inspection automatically includes two elite protection tiers: (1) The $10,000 Elite Master Inspection Warranty with $0 deductible active for 90 days post-closing, covering appliances (up to $2,250 with no age limits), structural framing ($2,250), HVAC/electrical/plumbing mechanicals ($2,250), mold remediation ($2,250), and roof leaks ($1,000); and (2) InterNACHI's $25,000 Honor Guarantee, where InterNACHI® backs member integrity by paying up to $25,000 for replacement of personal property. Combined, you receive up to $35,000 in total protection at zero extra cost."
              },
              {
                q: "What areas does Foresight Home Inspections serve?",
                a: "Foresight Home Inspections serves over 163 cities across Metro Atlanta, including Lithonia, Decatur, Sandy Springs, Alpharetta, Johns Creek, Roswell, Marietta, Smyrna, Atlanta, and surrounding North Georgia counties."
              },
              {
                q: "How quickly will I receive my home inspection report?",
                a: "Most of the time, you will receive your comprehensive digital report the very same day—and definitely within 24 hours of your inspection. Our reports include detailed photos, infrared thermal imaging scans, and clear recommendation summaries for easy seller negotiations."
              },
              {
                q: "When should I schedule a new construction home inspection in Atlanta?",
                a: "For new construction homes, we recommend 3 critical milestones: pre-pour foundation, pre-drywall framing, and final walk-through before closing. Our 2-inspector team provides an objective, code-referenced punch list so items are addressed under your builder warranty before final closing."
              },
              {
                q: "How do I schedule a certified home inspection near me in Metro Atlanta?",
                a: "Foresight Home Inspections serves all 87 municipalities across Metro Atlanta with rapid 24-hour report turnaround. Every inspection includes two certified inspectors led by a Certified Master Inspector®, complimentary infrared thermal imaging, and aerial drone roof scans. You can book online 24/7 or call 678-480-2110."
              },
              {
                q: "Can I get an itemized repair cost estimate for contractor repairs?",
                a: "Yes. While standard Georgia home inspections are strictly diagnostic evaluations per InterNACHI Standards of Practice (inspectors do not provide repair estimates by default), Foresight offers an optional $99 Itemized Contractor Repair Cost Estimate if you choose to add it. Calibrated using regional Metro Atlanta contractor trade rates, this report provides line-item repair costs and ready-to-use sample repair amendment wording to maximize your seller repair credit negotiations. It is also available as a standalone 4-hour audit for buyers who hired an outside inspection company."
              }
            ]}
          />
        </div>
      </section>

      {/* NEWSLETTER SIGNUP / LEAD MAGNET */}
      <NewsletterSignup />
    </>
  );
}

