import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const ValueComparison = dynamic(() => import('./components/ValueComparison'), { ssr: true });
const ThermalSlider = dynamic(() => import('./components/ThermalSlider'));
const Testimonials = dynamic(() => import('./components/Testimonials'), { ssr: true });
const FreshnessLog = dynamic(() => import('./components/FreshnessLog'), { ssr: true });
const FaqSearch = dynamic(() => import('./components/FaqSearch'), { ssr: true });

export const metadata = {
  title: 'Atlanta Home Inspections | Two CMI Inspectors',
  description: 'Two certified inspectors on every job. Led by Christopher Boykin, Certified Master Inspector®. Premium home inspections across Metro Atlanta with a $10,000 Elite Master Inspection Warranty.',
  alternates: { canonical: 'https://www.fhinspectionsatl.com' },
  openGraph: {
    title: 'Foresight Home Inspections | Two Inspectors on Every Job',
    description: 'Atlanta home inspections led by a Certified Master Inspector®. Two inspectors. $10,000 warranty included. Serving 163+ Metro Atlanta cities.',
    url: 'https://www.fhinspectionsatl.com',
  },
};

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
          "target": "https://www.fhinspectionsatl.com/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://www.fhinspectionsatl.com/#business",
        "name": "Foresight Home Inspections, LLC",
        "url": "https://www.fhinspectionsatl.com",
        "telephone": "+1-678-480-2110",
        "email": "inspect@foresightcmi.com",
        "logo": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "image": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1816 South Deshon Road",
          "addressLocality": "Lithonia",
          "addressRegion": "GA",
          "postalCode": "30058",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.7275",
          "longitude": "-84.1444"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "320",
          "bestRating": "5",
          "worstRating": "1"
        },
        "openingHoursSpecification": [
          { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"], "opens": "08:00", "closes": "20:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "08:00", "closes": "19:00" },
          { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "17:00", "description": "By appointment only" }
        ],
        "sameAs": [
          "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873",
          "https://maps.google.com/?cid=10862078652033010531",
          "https://facebook.com/fhinspectionsatl",
          "https://www.instagram.com/fhinspectionsatl/",
          "https://www.tiktok.com/@fhinspectionsatl",
          "https://www.youtube.com/@ForesightHomeInspections-t6r",
          "https://www.linkedin.com/company/foresight-home-inspections-llc/"
        ]
      },
      {
        "@type": "VideoObject",
        "name": "Foresight Home Inspections - High-Tech Dual Inspector Advantage",
        "description": "See how Certified Master Inspector Christopher Boykin and our two-inspector team use FLIR thermal imaging and drones to inspect Atlanta homes.",
        "thumbnailUrl": "https://www.fhinspectionsatl.com/images/thermal-1.png",
        "uploadDate": "2026-01-15T08:00:00+08:00",
        "publisher": { "@id": "https://www.fhinspectionsatl.com/#business" }
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
              "text": "Foresight home inspections start at $295+ for condos and $345+ for homes, depending on the square footage of the property. Add-on services include sewer scope camera inspections for $425, professional 48-hour continuous radon gas testing for $200, pool safety evaluations starting at $300, and official termite (WDO) reports starting at $110 (bundled)."
            }
          },
          {
            "@type": "Question",
            "name": "Why does Foresight send two home inspectors on every job?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Foresight Home Inspections sends two fully certified inspectors to every property. One inspector reviews the roof, structure, and exterior, while the other evaluates interior plumbing, electrical, and HVAC. This dual-coverage system checks twice as much, ensures extreme accuracy, and cuts inspection time in half to under 2.5 hours."
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
      <section className="hero" style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '6rem 0 5rem' }}>
        {/* Full-bleed background image */}
        <Image
          src="/images/luxury-home.jpg"
          alt="Luxury Atlanta GA Estate Home Inspected by Foresight Home Inspections"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        {/* Dark gradient overlay for text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.68) 40%, rgba(15,23,42,0.85) 100%)', zIndex: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '0.5rem 1.5rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '1.75rem', display: 'inline-block', backdropFilter: 'blur(8px)' }}>
            🏛️ METICULOUS HOME INSPECTIONS FOR ATLANTA&apos;S FINEST HOMES
          </span>

          <h1 style={{ marginBottom: '1.5rem', color: '#FFFFFF', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.025em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
            Atlanta&rsquo;s Certified Home Inspections<br />
            <span style={{ color: 'var(--color-gold)', textShadow: '0 2px 15px rgba(212,175,55,0.35)' }}>Two Inspectors on Every Job.</span>
          </h1>

          <p style={{ maxWidth: '720px', margin: '0 auto 2.5rem', fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
            Uncompromising thoroughness led by a Certified Master Inspector® (CMI). From entry-level single-family homes to multi-million dollar luxury estates, every home inspection features two certified inspectors, FLIR thermal imaging, aerial drone roof scanning, and our $10,000 warranty protection.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', borderRadius: 'var(--radius-md)' }}>
              📅 Schedule Inspection Now
            </a>
            <Link href="/quote" className="btn btn-outline-light" style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', borderRadius: 'var(--radius-md)' }}>
              📊 Calculate Instant Fee
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', alignItems: 'center', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}>
             <Image src="/images/cmi_logo.png" alt="Certified Master Inspector" width={200} height={150} style={{ height: '130px', width: 'auto', objectFit: 'contain' }} />
             <Image src="/images/cpi_logo.png" alt="Certified Professional Inspector" width={200} height={150} style={{ height: '130px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
      </section>

      {/* 🏛️ TIERED SERVICE ARCHITECTURE 🏛️ */}
      <section className="section" style={{ background: '#0F172A', color: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1rem' }}>
              🌟 Tailored Inspection Solutions
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
                  🏡 Core Home Inspection Tier
                </span>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
                  Standard Buyer &amp; Seller Home Inspection
                </h3>
                <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                  Ideal for single-family homes, townhomes, condos, and pre-listing seller inspections across Metro Atlanta.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li>✓ <strong>Two Certified Inspectors</strong> on every job</li>
                  <li>✓ Standard FLIR Thermal Imaging &amp; Moisture Detection</li>
                  <li>✓ Same-day digital photo report within 24 hours</li>
                  <li>✓ Compliments of Foresight: <strong>$10,000 Warranty</strong> ($0 deductible)</li>
                  <li>✓ Full online scheduling &amp; transparent flat-rate calculator</li>
                </ul>
              </div>
              <div>
                <Link href="/quote" className="btn btn-outline" style={{ width: '100%', textAlign: 'center', borderColor: '#64748B', color: '#FFFFFF', padding: '0.85rem' }}>
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
                  🏛️ Estate &amp; Luxury Tier
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
                  <li>✓ Full Aerial Drone Scanning + FLIR Thermal Envelope Diagnostics</li>
                  <li>✓ Dedicated 1-on-1 post-inspection strategy call with lead CMI</li>
                  <li>✓ Priority report turnaround &amp; $10,000 Warranty coverage</li>
                </ul>
              </div>
              <div>
                <Link href="/contact" className="btn btn-gold" style={{ width: '100%', textAlign: 'center', padding: '0.85rem' }}>
                  Request Estate Consultation →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFFFFF', padding: '5rem 0' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <Image src="/images/Christopher_Boykin.jpg" alt="Christopher Boykin - Certified Master Inspector performing a home inspection in Atlanta GA" width={600} height={400} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} priority />
            </div>
            <div style={{ padding: '0 1rem' }}>
              <span className="badge" style={{ background: 'rgba(15, 23, 42, 0.08)', color: '#0F172A', border: '1px solid #0F172A', marginBottom: '1rem', fontWeight: 600 }}>
                🎖️ Master-Level Leadership
              </span>
              <h2 style={{ marginBottom: '1.25rem', color: '#0F172A', fontSize: '2.1rem' }}>Who is the Certified Master Inspector leading Foresight Home Inspections?</h2>
              <p style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.6 }}>
                With over a decade of hands-on experience, Christopher Boykin, CMI, is the founder and lead Certified Master Inspector of Foresight Home Inspections, LLC, performing residential home inspections, sewer scopes, and radon testing across Metro Atlanta. We send two certified inspectors on every single job to verify twice as much in half the time.
              </p>
              <p style={{ marginBottom: '1.25rem', fontSize: '1rem', color: '#475569', lineHeight: 1.6 }}>
                Together with another fully certified professional inspector, our two-inspector team adheres strictly to the rigorous InterNACHI Standards of Practice. Armed with FLIR thermal scanners, camera drones, and moisture diagnostics, we deliver detailed reports within 24 hours.
              </p>
              <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#1E293B', lineHeight: 1.6, background: '#F8FAFC', padding: '1.25rem', borderLeft: '4px solid var(--color-gold)', borderRadius: 'var(--radius-sm)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                Every home inspection integrates FLIR thermal imaging and aerial drone technology, and includes a $10,000 Elite Master Inspection Warranty with a $0 deductible &mdash; backed by the Master Inspector Certification Board.
              </p>
              <ul className="cms-content" style={{ marginBottom: '2rem', listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> InterNACHI Certified Master Inspector
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Certified Pool &amp; Spa Inspections
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Termite &amp; Wood Destroying Organism (WDO) Evaluations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600, color: '#0F172A' }}>
                  <span style={{ color: 'var(--color-gold)' }}>✓</span> Thermal Imaging &amp; Drone Tech Included
                </li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.9rem 2rem' }}>
                  📅 Schedule Inspection Now
                </a>
                <Link href="/ask-twin" className="btn btn-outline" style={{ borderColor: '#0F172A', color: '#0F172A', padding: '0.9rem 2rem' }}>
                  Ask Foresight AI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ValueComparison />

      {/* 📊 GEO / AI SEARCH ENGINE STATS MODULE 📊 */}
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
                Over 80% of hidden moisture intrusion in Atlanta crawlspaces and subfloors is invisible to the naked eye and only detected via FLIR thermal imaging cameras.
              </p>
            </div>

            <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: '4px solid var(--color-gold)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.85rem', color: '#0F172A', marginBottom: '0.25rem', fontWeight: 800 }}>$10,000</h3>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1E293B' }}>Elite Master Warranty</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                Every home inspection led by CMI® Christopher Boykin includes $10,000 in zero-deductible coverage for appliances, mechanicals, structural elements, and roof leaks.
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
              Because Christopher Boykin is a Certified Master Inspector® &mdash; the highest credential awarded by the Master Inspector Certification Board &mdash; you receive the maximum Elite MASTER level warranty plan that ordinary inspectors simply cannot offer.
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
                <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                See Pricing First
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* ⚡ FAQ SECTION (AEO/GEO Optimized with Real-Time Search) ⚡ */}
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
                a: "Foresight home inspections start at $295+ for condos and $345+ for homes, depending on the square footage of the property. Add-on services include sewer scope camera inspections for $425, professional 48-hour continuous radon gas testing for $200, pool safety evaluations starting at $300, and official termite (WDO) reports starting at $110 (bundled)."
              },
              {
                q: "Why does Foresight send two home inspectors on every job?",
                a: "Foresight Home Inspections sends two fully certified inspectors to every property. One inspector reviews the roof, structure, and exterior, while the other evaluates interior plumbing, electrical, and HVAC. This dual-coverage system checks twice as much, ensures extreme accuracy, and cuts inspection time in half to under 2.5 hours."
              },
              {
                q: "What does Christopher Boykin's Certified Master Inspector® credential mean?",
                a: "Christopher Boykin is a Certified Master Inspector® (CMI), the highest professional designation in North America. CMIs are vetted by the Master Inspector Certification Board, completing at least 1,000 paid inspections or hours of education, maintaining a clean legal record, and adhering to strict InterNACHI Standards of Practice."
              },
              {
                q: "What is covered under the complimentary $10,000 Foresight warranty?",
                a: "Every standard home buyer inspection automatically includes a $10,000 aggregate protection warranty with a $0 deductible, active for 90 days from closing. The warranty covers major appliances (up to $2,250), structural integrity (up to $2,250), HVAC, plumbing, electrical mechanicals (up to $2,250), mold remediation, and roof leak repairs."
              },
              {
                q: "What areas does Foresight Home Inspections serve?",
                a: "Foresight Home Inspections serves over 163 cities across Metro Atlanta, including Lithonia, Decatur, Sandy Springs, Alpharetta, Johns Creek, Roswell, Marietta, Smyrna, Atlanta, and surrounding North Georgia counties."
              },
              {
                q: "How quickly will I receive my home inspection report?",
                a: "You will receive a comprehensive, high-resolution digital inspection report within 24 hours of your inspection. Our reports include detailed photos, thermal imaging scans, and clear recommendation summaries for easy seller negotiations."
              }
            ]}
          />
        </div>
      </section>
    </>
  );
}

