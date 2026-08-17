import Link from 'next/link';
import Image from 'next/image';
import ValueComparison from '../components/ValueComparison';
import QualityChecklist from '../components/QualityChecklist';

export const metadata = {
  title: 'Home Inspection Services Atlanta | From $295',
  description: 'View our comprehensive home inspection services starting at $295. We offer standard buyer inspections, pre-listing inspections, WDO/termite, pool/spa, and radon testing across Atlanta.',
  keywords: [
    'home inspection services Atlanta',
    'home inspection pricing Georgia 2026',
    'radon gas testing cost Atlanta',
    'sewer scope inspection Atlanta',
    'termite and WDO inspection Atlanta',
    'pool and spa inspection Atlanta GA',
    '11 month warranty inspection cost',
    'new construction home inspection Atlanta',
    'pre-listing seller inspection pricing',
    'luxury estate inspection Atlanta',
    'commercial and municipal rehab inspection Georgia',
    'FLIR thermal imaging inspection Atlanta'
  ],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/services',
  },
  openGraph: {
    title: 'Home Inspection Services & Pricing | Foresight Atlanta',
    description: 'Comprehensive home inspection services starting at $295 with two certified inspectors on every job. Servicing Lithonia, Decatur, Atlanta, and surrounding North Georgia.',
    url: 'https://www.fhinspectionsatl.com/services',
    type: 'website',
  },
};

export default function Services() {
  const services = [
    {
      title: 'Estate & Luxury Home Inspection',
      price: 'Custom Quote',
      priceNote: 'Popular for $750k+ Estates & Custom Builds',
      description: 'Dedicated 4+ hour comprehensive property inspection for luxury estates and complex architectural grounds. Led by a Certified Master Inspector® (CMI) with aerial drone scanning, thermal envelope diagnostics, and 1-on-1 strategy consultation.',
      details: ['Lead Certified Master Inspector® (CMI) + Senior Inspector', 'Extended 4+ hour dedicated evaluation window', 'Aerial drone roof & grounds scan', 'FLIR thermal imaging & envelope diagnostics', 'Direct 1-on-1 post-report strategy consultation', '$10,000 Warranty protection included'],
      image: '/images/drone-2.png',
      slug: 'estate-and-luxury-home-inspection-guide'
    },
    {
      title: 'Standard Buyer Inspection',
      price: '$295+',
      priceNote: 'Condos from $295 | Homes from $345',
      description: 'Our core comprehensive inspection covering the structure, roof, electrical, plumbing, HVAC, and all major systems. Two expert inspectors on site for maximum thoroughness.',
      details: ['Two inspectors on site', 'Thermal imaging scan included', 'Detailed digital report within 24 hours', 'InterNACHI Inspection Warranty included'],
      image: '/images/ac-pic.png',
      slug: 'what-does-home-inspector-look-for-buying-house'
    },
    {
      title: 'Pre-Listing Seller Inspection',
      price: '$295+',
      priceNote: 'Condos from $295 | Homes from $345',
      description: 'Identify potential issues before putting your home on the market. Streamline negotiations, avoid last-minute surprises, and increase buyer confidence.',
      details: ['Full major systems review', 'Proactive repair planning tool', 'Increased transaction speed', 'Thermal scan included'],
      image: '/images/crawlspace.png',
      slug: 'pre-listing-seller-inspection-guide'
    },
    {
      title: 'New Construction Inspections',
      price: '$375+',
      description: 'Ensure your brand-new home was built to correct specifications. We perform a comprehensive final inspection of all major systems.',
      details: ['Final phase inspection evaluation', 'Structure & systems checks', 'Workmanship quality review', 'Identify developer defects'],
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
      details: ['Pump & heater functional test', 'Safety barrier review', 'Filter and plumbing evaluation', 'Peace of mind for water features'],
      image: '/images/pool-inspecting.png',
      slug: 'pool-and-spa-inspection-guide'
    },
    {
      title: 'Sewer Scope Inspections',
      price: '$450',
      description: 'Using high-resolution sewer cameras, we inspect the main lateral sewer line from the home to the municipal connection or septic tank. Highly recommended for older properties.',
      details: ['Main lateral line sewer inspection', 'High-res video feed provided', 'Locate bellies, roots, and cracks', 'Saves thousands in excavation costs'],
      image: '/images/sewer-scope.png',
      slug: 'sewer-scope-inspection-guide'
    },
    {
      title: 'Termite & WDO Inspections',
      price: '$100+',
      description: 'Wood Destroying Organisms can cause catastrophic structural damage. We provide an Official Georgia Wood Infestation Report. Price is $100 for crawlspace or $125 for slab.',
      details: ['Official GA WDO Report', 'Identify active/past termites', 'Detect powderpost beetles & decay', 'Critical for mortgage approvals'],
      slug: 'termite-and-wdo-inspection-guide'
    },
    {
      title: 'Radon Gas Testing',
      price: '$250',
      description: 'Radon is a cancer-causing, odorless radioactive gas. We use professional 48-hour continuous monitors to ensure your home environment is safe.',
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
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com"
    },
    "areaServed": {
      "@type": "State",
      "name": "Georgia"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Home Inspection Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standard Buyer Inspection", "description": "Comprehensive inspection covering structure, roof, electrical, plumbing, HVAC, and all major systems with two inspectors." }, "price": "295", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pre-Listing Seller Inspection", "description": "Identify potential issues before listing. Streamline negotiations and increase buyer confidence." }, "price": "295", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "New Construction Inspection", "description": "Ensure your new home was built to specifications. Final phase inspection checks." }, "price": "375", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "11-Month Warranty Inspection", "description": "Professional punch list before your 1-year builder warranty expires." }, "price": "335", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pool & Spa Inspection", "description": "Evaluation of pumps, filters, heaters, electrical, plumbing, shell integrity, and safety boundaries." }, "price": "275", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Termite & WDO Inspection", "description": "Official Georgia Wood Infestation Report by licensed pest control specialists." }, "price": "100", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Radon Gas Testing", "description": "Professional 48-hour continuous monitor radon testing." }, "price": "250", "priceCurrency": "USD" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Short-Term Rental (STR) Compliance Inspection", "description": "Professional safety audits, egress route checks, and alarm pre-screening mapped to Metro Atlanta county guidelines." }, "price": "595", "priceCurrency": "USD" }
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
            &ldquo;Hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Inspection Services & Pricing</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>
            Transparent pricing based on actual square footage. We provide Certified Master Inspector®-led inspections with thermal imaging included, plus a full range of specialty assessments. All inspections are conducted to InterNACHI Standards of Practice.
          </p>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1rem', opacity: 0.85 }}>
            A standard home inspection in Metro Atlanta starts at $420 and includes two certified inspectors, FLIR thermal imaging, and the $10,000 Elite Master Inspection Warranty at no extra cost.
          </p>
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
                  {s.priceNote && <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>{s.priceNote}</p>}
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

          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Choose Foresight Premium Inspections?</h2>
          <div style={{ overflowX: 'auto', marginBottom: '4rem', padding: '0 1rem' }}>
            <table className="comparison-table" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', borderCollapse: 'collapse', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <thead>
                <tr style={{ background: 'var(--color-dark)', color: 'var(--color-white)' }}>
                  <th style={{ padding: '1.5rem', textAlign: 'left', width: '40%' }}>Feature</th>
                  <th style={{ padding: '1.5rem', textAlign: 'center', width: '30%', borderLeft: '1px solid var(--color-gray-dark)' }}>Typical Competitor</th>
                  <th style={{ padding: '1.5rem', textAlign: 'center', width: '30%', background: 'var(--color-red)', color: 'var(--color-white)' }}>Foresight Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-dark)' }}>Inspectors on Site</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)', borderLeft: '1px solid var(--color-gray-light)' }}>1</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-red)', borderLeft: '1px solid var(--color-gray-light)', background: 'rgba(211, 47, 47, 0.05)' }}>2 (Two Person Inspection Team Model)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-dark)' }}>Thermal Imaging Scan</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)', borderLeft: '1px solid var(--color-gray-light)' }}>Extra Charge ($99+)</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 700, color: '#34d399', borderLeft: '1px solid var(--color-gray-light)', background: 'rgba(211, 47, 47, 0.05)' }}>✓ Included Free</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-dark)' }}>Aerial Drone Roof Scan</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)', borderLeft: '1px solid var(--color-gray-light)' }}>Rarely Offered</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 700, color: '#34d399', borderLeft: '1px solid var(--color-gray-light)', background: 'rgba(211, 47, 47, 0.05)' }}>✓ Included Free</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-dark)' }}>Post-Inspection Warranty</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)', borderLeft: '1px solid var(--color-gray-light)' }}>None</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 700, color: '#34d399', borderLeft: '1px solid var(--color-gray-light)', background: 'rgba(211, 47, 47, 0.05)' }}><cite style={{ fontStyle: 'normal' }}>✓ $10,000 Elite Master Warranty</cite></td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-dark)' }}>Lead Inspector Credential</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)', borderLeft: '1px solid var(--color-gray-light)' }}>Standard Certification</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-red)', borderLeft: '1px solid var(--color-gray-light)', background: 'rgba(211, 47, 47, 0.05)' }}><cite style={{ fontStyle: 'normal' }}>Certified Master Inspector®</cite></td>
                </tr>
              </tbody>
            </table>
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
                  <strong style={{ color: 'var(--color-red)', fontSize: '2.25rem', fontWeight: 800 }}>$355</strong>
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
                  <li>📞 <strong>Custom Pricing:</strong> Pricing starts at <strong>$355</strong> based on standard condos and single-family homes, and adjusts for larger estates. Contact us for exact pricing tailored to your county's rules.</li>
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
              We don't just perform a physical inspection. Foresight equips every two person inspection team team with state-of-the-art diagnostic technology to see the invisible and protect your home investment.
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
                  We utilize specialized camera drones to capture high-resolution imagery of roofs, chimneys, eaves, and gutters that are too steep, tall, or fragile to walk on. We inspect the entire property from the safest and most effective angles.
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
                <h3 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Complimentary Utility Concierge Service</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                  Moving is stressful enough. That's why every Foresight Home Inspection includes an exclusive partnership with <a href="https://utilities-plus.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'underline' }}>Utilities Plus</a>. Once your inspection is booked and paid for, you'll receive a VIP email introduction to their concierge team. With one phone call, their experts will help you find the best rates and seamlessly set up your electricity, water, gas, internet, and home security at no further charge (with an easy opt-out if you prefer to handle utilities yourself).
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
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>What does a home inspection include?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              A Foresight home inspection is a comprehensive evaluation of the property&apos;s major systems and components. This includes the structural foundation, roofing, electrical systems, plumbing, HVAC (heating, ventilation, and air conditioning), insulation, windows, doors, interior and exterior surfaces, and built-in appliances. We also perform a complimentary thermal imaging scan to detect hidden moisture intrusion, insulation gaps, and electrical hotspots not visible to the naked eye.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>How long does a home inspection take?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              A typical home inspection takes between 2 and 3 hours depending on the size, age, and condition of the property. Because Foresight sends two certified inspectors on every appointment, we are able to cover more ground in less time while maintaining thoroughness that exceeds InterNACHI Standards of Practice.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>When do I get my inspection report?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              You will receive your full digital inspection report within 24 hours of the completed inspection. The report includes high-resolution photos, video clips where applicable, and our clear 3-step reporting format: Observation, Implication, and Recommendation—written in plain English so you can negotiate with confidence.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Do you offer a warranty?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Yes. Every Foresight inspection includes our $10,000 Elite Master Inspection Warranty at no additional cost. This warranty provides coverage for 90 days after closing on items that were inspected, giving you added financial protection and peace of mind during your transition into your new home.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>What areas do you serve?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Foresight Home Inspections proudly serves over 163 cities across the Metro Atlanta area and greater Georgia. This includes major areas such as Atlanta, Marietta, Alpharetta, Roswell, Decatur, Kennesaw, and many more. Visit our <Link href="/service-areas" style={{ color: 'var(--color-red)', fontWeight: 600 }}>Service Areas</Link> page for a complete list of cities we cover.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Should I attend the home inspection?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              We strongly encourage it. In our experience, buyers who attend their inspection walk away with a dramatically better understanding of their new home. Our inspectors walk you through every finding in real time, explain what is normal wear versus a legitimate concern, and answer your questions on the spot. We have found that buyers who attend feel significantly more confident during negotiations because they have seen the issues firsthand.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Can a house actually fail a home inspection?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Technically, no. A home inspection is not a pass/fail test. It is an objective evaluation of the property's current condition. In our 1,000+ inspections across Metro Atlanta, we have never written a report that says "this house failed." Instead, we document what we observe, explain the implications, and recommend next steps. This gives you and your agent the information needed to negotiate repairs, credits, or make an informed decision about proceeding with the purchase.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Are home inspection costs part of closing costs?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              The home inspection fee is typically paid directly to the inspection company at the time of service, not through closing. However, it is considered part of your overall home-buying expenses. In Georgia, the buyer is responsible for scheduling and paying for the inspection. Many of our clients view it as the most valuable investment of the entire home-buying process since findings from the inspection frequently lead to repair credits or price reductions that far exceed the inspection cost itself.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>What is not covered in a standard home inspection?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Per InterNACHI Standards of Practice, a standard home inspection does not include testing for environmental hazards like radon gas, termite/WDO infestation, mold, or lead paint. It also does not include sewer line camera scoping, pool or spa evaluation, or septic system testing. However, Foresight offers all of these as add-on services that can be bundled with your inspection. We recommend radon testing and WDO inspections on virtually every Georgia home purchase due to the region's geological and climate conditions.
            </p>
          </details>

          <details style={{ border: '1px solid var(--color-gray-mid)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem', background: 'white' }}>
            <summary className="faq-question" style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem' }}>Can I see a sample inspection report before booking?</summary>
            <p className="speakable-answer" style={{ marginTop: '1rem', color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Our inspection reports are delivered through <strong>HomeGauge</strong>, a professional digital reporting platform. Each report includes high-resolution photographs, video clips of specific concerns, detailed descriptions using our Observation-Implication-Recommendation format, and the interactive <strong>Create Request List (CRL)</strong> tool that lets you and your agent build a repair amendment directly from the report. If you would like to see a sample before booking, please <Link href="/contact" style={{ color: 'var(--color-red)', fontWeight: 600 }}>contact us</Link> and we will be happy to share one.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
