import Link from 'next/link';
import Image from 'next/image';
import ValueComparison from '../components/ValueComparison';
import QualityChecklist from '../components/QualityChecklist';

export const metadata = {
  title: 'Services & Pricing | Foresight Home Inspections',
  description: 'View our comprehensive home inspection services starting at $315. We offer standard buyer inspections, pre-listing inspections, WDO/termite, pool/spa, and radon testing across Atlanta.',
  keywords: ['home inspection services Atlanta', 'home inspection pricing Georgia', 'radon gas testing cost', 'sewer scope inspection Atlanta', 'termite inspection Atlanta', 'pool and spa inspector Lithonia GA'],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/services',
  },
  openGraph: {
    title: 'Services & Pricing | Foresight Home Inspections',
    description: 'Comprehensive home inspection services starting at $315 with two certified inspectors on every job. Servicing Lithonia, Decatur, Atlanta, and surrounding North Georgia.',
    url: 'https://www.fhinspectionsatl.com/services',
    type: 'website',
  },
};

export default function Services() {
  const services = [
    {
      title: 'Standard Buyer Inspection',
      price: '$315+',
      description: 'Our core comprehensive inspection covering the structure, roof, electrical, plumbing, HVAC, and all major systems. Two expert inspectors on site for maximum thoroughness.',
      details: ['Two inspectors on site', 'Thermal imaging scan included', 'Detailed digital report within 24 hours', 'InterNACHI Inspection Warranty included'],
      image: '/images/ac-pic.png',
      slug: 'what-does-home-inspector-look-for-buying-house'
    },
    {
      title: 'Pre-Listing Seller Inspection',
      price: '$365+',
      description: 'Identify potential issues before putting your home on the market. Streamline negotiations, avoid last-minute surprises, and increase buyer confidence.',
      details: ['Full major systems review', 'Proactive repair planning tool', 'Increased transaction speed', 'Thermal scan included'],
      image: '/images/crawlspace.png',
      slug: 'pre-listing-seller-inspection-guide'
    },
    {
      title: 'New Construction Inspections',
      price: '$355+',
      description: 'Ensure your brand-new home was built to correct specifications. We inspect foundations, framing, pre-drywall, and perform final walkthrough checks.',
      details: ['Phase-by-phase option', 'Pre-drywall framing checks', 'Code-compliance review', 'Identify developer defects'],
      image: '/images/drone-2.png',
      slug: 'why-you-need-home-inspection-new-build'
    },
    {
      title: '11-Month Warranty Inspection',
      price: '$335+',
      description: 'Performed just before your 1-year builder warranty expires. Get a professional punch list to have the builder fix issues on their dime, not yours.',
      details: ['Detailed builder-ready report', 'Mechanical & structural check', 'Saves thousand in future repairs', 'Maximum warranty utilization'],
      image: '/images/gas-meter.png',
      slug: '11-month-warranty-inspection-guide'
    },
    {
      title: 'Pool & Spa Inspections',
      price: '$275',
      description: 'Specialized evaluation of residential pools and spas. We test pumps, filters, heaters, electrical, plumbing, shell integrity, and safety boundaries.',
      details: ['Pump & heater functional test', 'Safety barrier compliance', 'Filter and plumbing evaluation', 'Peace of mind for water features'],
      image: '/images/pool-inspecting.png',
      slug: 'pool-and-spa-inspection-guide'
    },
    {
      title: 'Sewer Scope Inspections',
      price: '$400',
      description: 'Using high-resolution sewer cameras, we inspect the main lateral sewer line from the home to the municipal connection or septic tank. Highly recommended for older properties.',
      details: ['Main lateral line sewer inspection', 'High-res video feed provided', 'Locate bellies, roots, and cracks', 'Saves thousands in excavation costs'],
      image: '/images/sewer-scope.png',
      slug: 'sewer-scope-inspection-guide'
    },
    {
      title: 'Termite & WDO Inspections',
      price: '$125+',
      description: 'Wood Destroying Organisms can cause catastrophic structural damage. We partner with licensed pest control specialists to provide an Official Georgia Wood Infestation Report. Starts at $125 on slab/basement, and $165 on crawlspace.',
      details: ['Official GA WDO Report', 'Identify active/past termites', 'Detect powderpost beetles & decay', 'Critical for mortgage approvals'],
      slug: 'termite-and-wdo-inspection-guide'
    },
    {
      title: 'Radon Gas Testing',
      price: '$200+',
      description: 'Radon is a cancer-causing, odorless radioactive gas. We use professional 48-hour continuous monitors to ensure your home environment is safe (when combined with a home inspection).',
      details: ['48-hour professional monitoring', 'Precise electronic sensors', 'Crucial indoor air safety profile', 'Water radon testing available'],
      slug: 'hidden-dangers-of-radon-gas-georgia'
    }
  ];

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Home Inspection",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "678-480-2110"
    },
    "areaServed": {
      "@type": "State",
      "name": "Georgia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Home Inspection Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standard Buyer Inspection", "description": "Comprehensive inspection covering structure, roof, electrical, plumbing, HVAC, and all major systems with two inspectors." }, "price": "315", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pre-Listing Seller Inspection", "description": "Identify potential issues before listing. Streamline negotiations and increase buyer confidence." }, "price": "365", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "New Construction Inspection", "description": "Ensure your new home was built to specifications. Foundation, framing, pre-drywall, and final walkthrough checks." }, "price": "355", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "11-Month Warranty Inspection", "description": "Professional punch list before your 1-year builder warranty expires." }, "price": "335", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pool & Spa Inspection", "description": "Evaluation of pumps, filters, heaters, electrical, plumbing, shell integrity, and safety boundaries." }, "price": "275", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Termite & WDO Inspection", "description": "Official Georgia Wood Infestation Report by licensed pest control specialists." }, "price": "125", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Radon Gas Testing", "description": "Professional 48-hour continuous monitor radon testing." }, "price": "200", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Short-Term Rental (STR) Compliance Assist", "description": "Professional safety audits, egress route checks, and alarm pre-screening mapped to Metro Atlanta county guidelines." }, "price": "275", "priceCurrency": "USD" }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does a home inspection include?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Foresight home inspection is a comprehensive evaluation of the property's major systems and components. This includes the structural foundation, roofing, electrical systems, plumbing, HVAC (heating, ventilation, and air conditioning), insulation, windows, doors, interior and exterior surfaces, and built-in appliances. We also perform a complimentary thermal imaging scan to detect hidden moisture intrusion, insulation gaps, and electrical hotspots not visible to the naked eye."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a home inspection take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A typical home inspection takes between 2 and 3 hours depending on the size, age, and condition of the property. Because Foresight sends two certified inspectors on every appointment, we are able to cover more ground in less time while maintaining thoroughness that exceeds industry standards."
        }
      },
      {
        "@type": "Question",
        "name": "When do I get my inspection report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You will receive your full digital inspection report within 24 hours of the completed inspection. The report includes high-resolution photos, video clips where applicable, and our clear 3-step reporting format: Observation, Implication, and Recommendation—written in plain English so you can negotiate with confidence."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer a warranty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every Foresight inspection includes our $10,000 Elite Master Inspection Warranty at no additional cost. This warranty provides coverage for 90 days after closing on items that were inspected, giving you added financial protection and peace of mind during your transition into your new home."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Foresight Home Inspections proudly serves over 163 cities across the Metro Atlanta area and greater Georgia. This includes major areas such as Atlanta, Marietta, Alpharetta, Roswell, Decatur, Kennesaw, and many more. Visit our Service Areas page for a complete list of cities we cover."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="slogan-heading">
            &ldquo;Because hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Inspection Services & Pricing</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>
            Transparent pricing based on actual square footage. We provide Certified Master Inspector-led inspections with thermal imaging included, plus a full range of specialty assessments.
          </p>
        </div>
      </section>

      <section className="section bg-white" style={{ borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', background: 'var(--color-white)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--color-dark)', color: 'var(--color-white)', borderBottom: '2px solid var(--color-red)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Service Program</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Base Pricing</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>Core Deliverables & Protection</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>Standard Buyer Inspection</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$315+</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Two inspectors on site, thermal scans, & $10k warranty coverage</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>Pre-Listing Seller Inspection</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$365+</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Proactive system audit to protect negotiations and closing speed</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>New Construction Phase Audit</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$355+</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Pre-drywall frame audits, final walkthrough, & structural checks</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>11-Month Warranty Inspection</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$335+</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Developer repair list before one-year home warranty expiration</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>Sewer Scope Pipeline Scan</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$400</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>HD lateral camera inspection to check for roots, cracks, and bellies</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>Radon Continuous Gas Test</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$200+</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>48-hour continuous digital monitoring for radon gas levels</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>Pool & Spa Mechanical Safety</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$275</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Pumps, pressure leaks, heaters, filters, and electrical safety scan</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>Termite & WDO Infestation Report</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$125+</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Official Georgia wood infestation report for mortgage/lender compliance</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-dark)' }}>STR Permit Compliance Assist</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-red)' }}>$275</td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-gray-dark)' }}>Airbnb/Vrbo host safety pre-screening compliance audit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: '4rem' }}>
            {services.slice(0, 3).map((s, idx) => (
              <div key={idx} id={s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className={`card ${idx === 0 ? 'card-premium' : ''}`} style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {s.image && (
                  <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    {idx === 0 && <div className="badge" style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>Core Service</div>}
                  </div>
                )}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {!s.image && idx === 0 && <div className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>Core Service</div>}
                  <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-red)', margin: '1rem 0' }}>{s.price}</div>
                  <p style={{ color: 'var(--color-gray-dark)', flex: 1, marginBottom: '1.5rem' }}>{s.description}</p>
                  <ul style={{ listStyle: 'none', margin: '0 0 2rem 0', padding: 0 }}>
                    {s.details.map((d, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-red)' }}>✓</span> {d}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                    <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className={`btn ${idx === 0 ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', borderColor: idx !== 0 ? 'var(--color-red)' : undefined, color: idx !== 0 ? 'var(--color-red)' : undefined }}>
                      📅 Book Inspection
                    </a>
                    <Link href="/quote" className="btn btn-outline" style={{ width: '100%', borderWidth: '1px', opacity: 0.8, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                      Calculate Price
                    </Link>
                    {s.slug && (
                      <Link href={`/blog/${s.slug}`} className="btn btn-outline" style={{ width: '100%', borderWidth: '1px', fontSize: '0.9rem', padding: '0.5rem 1rem', borderColor: 'var(--color-gray-dark)', color: 'var(--color-gray-dark)' }}>
                        📖 In-Depth Guide
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Specialty & Add-on Services</h2>
          <div className="grid grid-2">
            {services.slice(3).map((s, idx) => (
              <div key={idx} id={s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="card" style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap' }}>
                {s.image && (
                  <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="110px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ marginBottom: '0.25rem' }}>{s.title}</h3>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-red)', margin: '0.25rem 0' }}>{s.price}</div>
                  <p style={{ color: 'var(--color-gray-dark)', marginBottom: '0.75rem', fontSize: '0.95rem', lineHeight: 1.5 }}>{s.description}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                    {s.details.map((d, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-red)' }}>✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '100%', mdWidth: 'auto', marginTop: '1rem' }}>
                  <Link href="/quote" className="btn btn-outline" style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>Add to Quote</Link>
                  {s.slug && (
                    <Link href={`/blog/${s.slug}`} className="btn btn-outline" style={{ whiteSpace: 'nowrap', width: '100%', textAlign: 'center', borderColor: 'var(--color-gray-dark)', color: 'var(--color-gray-dark)', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      📖 Read Guide
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--color-red-light)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Proudly serving over 163 cities across Metro Atlanta</p>
            <Link href="/service-areas" className="btn btn-outline">View All Service Areas</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SHORT-TERM RENTAL (STR) COMPLIANCE ASSIST
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-white" style={{ borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Metro Atlanta Short-Term Rental (STR) Support</span>
            <h2>Short-Term Rental (STR) Compliance Assist</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '800px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Surrounding counties and cities across the Metro Atlanta area (including DeKalb, Fulton, Gwinnett, Cobb, and more) are requiring active compliance inspections for short-term rental (STR) operators on Airbnb and Vrbo. Since every county features unique local ordinances, zoning requirements, and safety checklists, Foresight provides standard third-party safety audits starting at our base rate to ensure your property remains active and compliant.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto 4rem' }}>
            <div className="card card-premium" style={{ borderTop: '5px solid var(--color-red)', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-gray-mid)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <span className="badge" style={{ background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 700 }}>Host Safety Compliance Check</span>
                  <h3 style={{ marginTop: '0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>Short-Term Rental (STR) Compliance Assist</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)', display: 'block' }}>Starting at</span>
                  <strong style={{ color: 'var(--color-red)', fontSize: '2.25rem', fontWeight: 800 }}>$275</strong>
                </div>
              </div>

              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Every local jurisdiction has slightly different requirements, but they almost all require a certified third-party physical inspection of basic safety systems to secure or renew your operating permit. We assist hosts by thoroughly inspecting and verifying standard county compliance items:
              </p>

              <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <li>🛡️ <strong>Life-Safety Alarms:</strong> Placement and functional testing of smoke detectors (minimum one per level and inside every sleeping room) and carbon monoxide alarms (minimum one per level).</li>
                  <li>🧯 <strong>Fire Extinguishers:</strong> Verification and documentation of visible, accessible fire extinguishers (at least one per level).</li>
                  <li>🚪 <strong>Egress Safety:</strong> Detailed checks of stairs, handrails, guards, and exit routes to ensure clear emergency egress paths.</li>
                </ul>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <li>🪧 <strong>Local Agent Signage:</strong> Checking that the mandatory 24-hour local contact information and evacuation maps are clearly posted.</li>
                  <li>🚫 <strong>Historic Exclusions:</strong> Pre-screening checks for localized historic district restrictions to safeguard your non-refundable government portal application fees.</li>
                  <li>📞 <strong>Custom Pricing:</strong> Pricing starts at <strong>$275</strong> based on standard condos and single-family homes, and adjusts for larger estates. Contact us for exact pricing tailored to your county's rules.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/quote" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  📊 Estimate Short-Term Rental (STR) Price
                </Link>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.75rem 2rem', color: 'var(--color-red)', borderColor: 'var(--color-red)' }}>
                  📅 Schedule Audit
                </a>
                <Link href="/blog/metro-atlanta-short-term-rental-str-compliance-assist" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
                  📖 Read STR Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HIGH-TECH DIAGNOSTIC SUITE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Advanced Equipment</span>
            <h2>Our High-Tech Diagnostic Suite</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We don't just perform a physical walkthrough. Foresight equips every dual-inspector team with state-of-the-art diagnostic technology to see the invisible and protect your home investment.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>📷</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Infrared Thermal Imaging (FLIR)</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Our professional thermal cameras scan walls, ceilings, and electrical panels to locate hidden plumbing leaks, electrical fire hazards, and missing insulation without damaging any drywall. Included on every inspection at no extra charge.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🛸</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>High-Resolution Aerial Drones</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  We utilize specialized camera drones to capture high-resolution imagery of roofs, chimneys, eaves, and gutters that are too steep, tall, or fragile to walk on. We inspect the entire property from the safest and most effective angles.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🤖</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Foresight AI Digital Twin</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  An AI assistant trained directly on InterNACHI Standards of Practice and Georgia structural codes. Ask questions about your inspection report, get home maintenance timelines, or troubleshoot issues in seconds.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>⚡</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Digital Moisture & Combustible Gas Detectors</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  We employ electronic moisture scanners to trace active leaks through subflooring and walls, plus high-sensitivity combustible gas sniffers to check appliance lines and gas meters for micro-leaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-dark text-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem' }}>Our 3-Step Report System</h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '1rem auto 0', fontSize: '1.125rem' }}>
              We structure every finding to keep things simple, clear, and perfectly straightforward—written in plain English so you can negotiate with absolute confidence!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--color-red)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                1
              </div>
              <div>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>🔍 Step 1: The Observation</h3>
                <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '1.05rem' }}>
                  We state exactly what we observed during the inspection in clear, plain language (e.g., *"The water heater's temperature-pressure relief valve is missing a discharge pipe."*).
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--color-red)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                2
              </div>
              <div>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>💡 Step 2: What This Could Mean</h3>
                <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '1.05rem' }}>
                  We explain the real-world implications, risks, and potential safety or financial consequences (e.g., *"If the water heater ever overheats, super-heated water could release directly onto anyone standing nearby, causing severe burns."*).
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--color-red)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                3
              </div>
              <div>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>🛠️ Step 3: Our Recommendations</h3>
                <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '1.05rem' }}>
                  To stay 100% InterNACHI compliant, our recommendations specify exactly who needs to evaluate the system further and perform repairs as needed, keeping you safe and within standards (e.g., *"Have a licensed plumbing contractor evaluate further and repair as needed."*).
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                📅 Schedule Your Inspection
              </a>
              <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                Calculate Pricing First
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-white" style={{ borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Foresight Client & Agent Perks</span>
            <h2>Added Value & Realtor Conveniences</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We partner with elite service providers and equip our inspectors with the right tools to make every transaction seamless.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🔑</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Active SUPRA Key Access</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                  For the ultimate convenience of Metro Atlanta real estate agents, our inspectors carry active **SUPRA key access** to gain entry to the property securely and independently. Realtors do not need to take time out of their busy schedules to drive over and open the home.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🔌</div>
              <div>
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Utilities Plus Utility Concierge</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                  We are proud partners of <a href="https://utilities-plus.com/our-services/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'underline' }}>Utilities Plus</a>, a premier Utility Concierge Service. All Foresight clients gain free access to this service to help get utilities (power, gas, water, internet, security) set up fast, easy, and at the best available rates, whether moving across town or across the country!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ValueComparison />
      <QualityChecklist />

      <section className="section bg-gray-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Frequently Asked Questions</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '2.5rem' }}>
            Get answers to the most common questions about our home inspection services.
          </p>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>What does a home inspection include?</summary>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              A Foresight home inspection is a comprehensive evaluation of the property&apos;s major systems and components. This includes the structural foundation, roofing, electrical systems, plumbing, HVAC (heating, ventilation, and air conditioning), insulation, windows, doors, interior and exterior surfaces, and built-in appliances. We also perform a complimentary thermal imaging scan to detect hidden moisture intrusion, insulation gaps, and electrical hotspots not visible to the naked eye.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>How long does a home inspection take?</summary>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              A typical home inspection takes between 2 and 3 hours depending on the size, age, and condition of the property. Because Foresight sends two certified inspectors on every appointment, we are able to cover more ground in less time while maintaining thoroughness that exceeds industry standards.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>When do I get my inspection report?</summary>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              You will receive your full digital inspection report within 24 hours of the completed inspection. The report includes high-resolution photos, video clips where applicable, and our clear 3-step reporting format: Observation, Implication, and Recommendation—written in plain English so you can negotiate with confidence.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Do you offer a warranty?</summary>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Yes. Every Foresight inspection includes our $10,000 Elite Master Inspection Warranty at no additional cost. This warranty provides coverage for 90 days after closing on items that were inspected, giving you added financial protection and peace of mind during your transition into your new home.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>What areas do you serve?</summary>
            <p style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Foresight Home Inspections proudly serves over 163 cities across the Metro Atlanta area and greater Georgia. This includes major areas such as Atlanta, Marietta, Alpharetta, Roswell, Decatur, Kennesaw, and many more. Visit our <Link href="/service-areas" style={{ color: 'var(--color-red)', fontWeight: 600 }}>Service Areas</Link> page for a complete list of cities we cover.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
