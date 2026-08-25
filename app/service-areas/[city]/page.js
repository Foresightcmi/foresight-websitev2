import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import RelatedServiceAreas from '../../components/RelatedServiceAreas';
import GooglePreferredSource from '../../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadCities() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function toSlug(cityName) {
  return cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function findCity(cities, slug) {
  return cities.find(c => toSlug(c['City Name']) === slug) || null;
}

// ---------------------------------------------------------------------------
// Static params – generates a route for every city in the JSON
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cities = JSON.parse(fileContents);
  
  return cities.map((city) => ({
    city: city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));
}

// ---------------------------------------------------------------------------
// Metadata – SEO titles, descriptions, OpenGraph, canonical
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const cities = loadCities();
  const cityData = findCity(cities, resolvedParams.city);

  const cityName = cityData?.['City Name'] || resolvedParams.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const county = cityData?.County || 'Georgia';
  const slug = resolvedParams.city;

  const title = cityData?.['Meta Title']
    || `Best Home Inspector in ${cityName}, GA | Foresight Home Inspections`;
  const description = cityData?.['Meta Description']
    || `Need a certified home inspector in ${cityName}, GA? Foresight Home Inspections provides premium, two-inspector team services led by a Certified Master Inspector for ultimate peace of mind.`;

  return {
    title,
    description,
    keywords: [
      `home inspector ${cityName} GA`,
      `best home inspection ${cityName} GA`,
      `home inspection cost ${cityName}`,
      `home inspection near me ${cityName}`,
      `certified master inspector ${cityName}`,
      `new construction inspection ${cityName} GA`,
      `pre-listing inspection ${cityName}`,
      `radon testing ${cityName} GA`,
      `termite inspection ${cityName} GA`,
      `11 month warranty inspection ${cityName}`,
      `thermal imaging inspection ${cityName}`,
      `pool inspection ${cityName} GA`,
      `home inspector ${county} County GA`,
    ],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/service-areas/${slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/service-areas/${slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function CityPage({ params }) {
  const resolvedParams = await params;
  const cities = loadCities();
  const cityData = findCity(cities, resolvedParams.city);

  const cityName = cityData?.['City Name'] || resolvedParams.city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const county = cityData?.County || 'Georgia';
  const zip = cityData?.Zip || '';
  const slug = resolvedParams.city;

  // ── Intro paragraph ──────────────────────────────────────────────────
  const introParagraph = cityData?.Intro
    || `Serving all of ${county} County. When you're buying a home in ${cityName}, you need the absolute best. We provide two certified inspectors on every job for unrivaled accuracy.`;

  // ── FAQ data ─────────────────────────────────────────────────────────
  const faqs = [
    {
      q: `Who is the best home inspector in ${cityName}, GA?`,
      a: `Christopher Boykin of Foresight Home Inspections is widely regarded as one of the best home inspectors serving ${cityName}, GA. As a Certified Master Inspector through InterNACHI — the highest professional designation in the industry — Christopher brings unmatched expertise to every inspection. Foresight sends two certified inspectors on every job, ensuring nothing is missed. Every inspection includes a $10,000 Elite Master Inspection Warranty for total peace of mind.`,
    },
    {
      q: `How much does a home inspection cost in ${cityName}, GA?`,
      a: `Home inspection pricing in ${cityName} starts at $345+ for a standard single-family buyer's inspection ($295 for condos). 11-month warranty inspections start at $335+, pre-listing seller inspections start at $365+, and new construction inspections start at $375+. Pricing varies based on square footage, age, foundation type, and add-on services such as radon testing ($200), termite/WDO inspection ($110+), pool evaluation ($300), or sewer scope inspection ($425). Property age surcharges apply ($75 for 25-50 yrs, $125 for 50+ yrs vintage/historic homes). Complexity fees add $50 for a crawlspace and $75 for an unfinished basement. Visit our <a href="/quote">instant quote page</a> for a personalized price in seconds. Every inspection includes our $10,000 warranty at no extra cost.`,
    },
    {
      q: `What should I look for when hiring a home inspector in ${cityName}?`,
      a: `Look for a Certified Master Inspector — the highest credential from InterNACHI. Foresight Home Inspections exceeds this standard with a unique two-inspector team model: two certified inspectors are on every job, so coverage is thorough and nothing slips through the cracks. We also use advanced thermal imaging to detect hidden moisture, insulation gaps, and electrical hotspots. All findings follow InterNACHI Standards of Practice, and our recommendation language complies with industry guidelines.`,
    },
    {
      q: `Does Foresight Home Inspections offer a warranty in ${cityName}?`,
      a: `Yes! Because Christopher Boykin holds the Certified Master Inspector® designation, every Foresight inspection in ${cityName} comes with the $10,000 Elite Master Inspection Warranty at no additional cost. Coverage includes up to $2,250 each for major appliances, structural components, and major mechanicals (HVAC, electrical, plumbing), plus up to $2,250 for mold remediation and $1,000 for roof leak protection — all with a $0 deductible. The warranty is valid for 90 days from closing or 120 days from the inspection date, whichever comes first.`,
    },
    {
      q: `Do you offer radon testing in ${cityName}, GA?`,
      a: `Yes — Foresight Home Inspections offers professional radon gas testing in ${cityName} as an add-on service for $200. Radon is the second leading cause of lung cancer in the United States, according to the U.S. Environmental Protection Agency (EPA), and is completely odorless and invisible. Our testing uses a continuous 48-hour professional diagnostic monitor that provides highly accurate readings. The EPA recommends radon testing for every home purchase, regardless of location. You can add radon testing to any inspection package through our <a href="/quote">instant quote page</a>.`,
    },
    {
      q: `Do you do termite inspections in ${cityName}, GA?`,
      a: `Yes — we offer Official Georgia Wood Destroying Organism (WDO) inspections in ${cityName} through our licensed pest control partners starting at $110+. Termite and WDO inspections are critical in Georgia's warm, humid climate where subterranean termites are highly active. The National Pest Management Association (NPMA) estimates that termites cause over $5 billion in property damage annually in the United States. The inspection produces an Official Georgia Wood Infestation Report, which is often required by lenders at closing.`,
    },
    {
      q: `Do you inspect new construction homes in ${cityName}?`,
      a: `Absolutely. New construction final phase inspections in ${cityName} start at $375+ and are one of our most requested services. Even brand-new homes have issues — municipal code inspectors are often overloaded and can miss details. Our two-inspector team performs a thorough final inspection check of the foundation, electrical, plumbing, HVAC, insulation, grading, and all final interior/exterior systems before closing. Visit our <a href="/quote">quote page</a> for exact pricing based on your home's size.`,
    },
    {
      q: `What does thermal imaging detect during a home inspection in ${cityName}?`,
      a: `Thermal imaging (infrared camera technology) is included in every Foresight inspection at no extra charge. In ${cityName} homes, our FLIR thermal cameras detect hidden moisture intrusion behind walls and ceilings, missing or damaged insulation, electrical hotspots that could be fire hazards, HVAC duct leaks, and plumbing leaks beneath floors. These are problems completely invisible to the naked eye that could cost thousands to repair if undiscovered. This advanced technology is a standard part of our two-inspector team approach.`,
    },
  ];

  // ── JSON-LD: Service schema ──────────────────────────────────────────
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://www.fhinspectionsatl.com/service-areas/${slug}#service`,
    "name": `Home Inspection in ${cityName}, GA`,
    "url": `https://www.fhinspectionsatl.com/service-areas/${slug}`,
    "serviceType": "Home Inspection",
    "provider": {
      "@type": "ProfessionalService",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1816 South Deshon Road",
        "addressLocality": "Lithonia",
        "addressRegion": "GA",
        "postalCode": "30058",
        "addressCountry": "US"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": `${county} County`,
        "containedInPlace": {
          "@type": "State",
          "name": "Georgia"
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "48",
      "bestRating": "5",
      "worstRating": "1"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".county-bluf-summary", ".bluf-faq-answer"]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Home Inspection Services in ${cityName}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Buyer's Home Inspection"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pre-Listing Inspection"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "11-Month Warranty Inspection"
          }
        }
      ]
    }
  };

  // ── JSON-LD: LocalBusiness from cities.json ──────────────────────────
  let localBusinessJsonLd = null;
  if (cityData?.['JSON-LD Schema']) {
    try {
      localBusinessJsonLd = JSON.parse(cityData['JSON-LD Schema']);
    } catch {
      // Parsing failed — skip this schema block
    }
  }

  // ── JSON-LD: FAQPage schema ──────────────────────────────────────────
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a.replace(/<[^>]*>/g, ''),  // strip HTML for schema
      },
    })),
  };

  // ── County Context ─────────────────────────────────────────────────────
  const getCountyContext = (c) => {
    switch(c) {
      case 'Fulton': return "Fulton County requires specific environmental reviews and adheres to strict urban building codes, especially for properties near the BeltLine or historic districts. Our inspections are calibrated to identify common Fulton County compliance hurdles before you close.";
      case 'DeKalb': return "DeKalb County enforces unique requirements, including the mandatory low-flow plumbing fixture certificate for properties built before 1993. We evaluate these items to ensure your transaction proceeds smoothly without municipal delays.";
      case 'Gwinnett': return "As one of the fastest-growing areas, Gwinnett County properties range from massive new developments to established 1990s subdivisions. We focus heavily on polybutylene plumbing risks and rapid-build structural issues common in this county.";
      case 'Cobb': return "Cobb County's varied topography means properties are highly susceptible to foundation settlement and basement moisture intrusion. Our thermal imaging and structural expertise are specifically tailored to Cobb County terrain challenges.";
      case 'Forsyth': return "Forsyth County features many luxury lakefront properties and large-scale new constructions. We bring advanced drone technology and specialized knowledge of high-end systems required by Forsyth County building standards.";
      default: return `${c} County properties are subject to local Georgia municipal building codes and environmental conditions. Our certified inspectors are fully trained on local guidelines to ensure your home meets the highest standards of safety and structural integrity.`;
    }
  };

  const countySlug = `${toSlug(county)}-county`;

  // ── Proximity Calculation from Lithonia HQ (33.7258, -84.0955) ──────
  let distanceMiles = 18;
  try {
    if (localBusinessJsonLd?.geo?.latitude && localBusinessJsonLd?.geo?.longitude) {
      const lat1 = 33.7258;
      const lon1 = -84.0955;
      const lat2 = parseFloat(localBusinessJsonLd.geo.latitude);
      const lon2 = parseFloat(localBusinessJsonLd.geo.longitude);
      const R = 3958.8; // Radius of the Earth in miles
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = Math.round(R * c);
      if (d > 0) distanceMiles = d;
    }
  } catch {
    // fallback
  }

  // ── JSON-LD: BreadcrumbList schema ──────────────────────────────────
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Service Areas",
        "item": `${SITE_URL}/service-areas`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${county} County`,
        "item": `${SITE_URL}/service-areas/counties/${countySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": `${cityName}, GA`,
        "item": `${SITE_URL}/service-areas/${slug}`
      }
    ]
  };

  return (
    <>
      {/* ── JSON-LD Schemas ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {localBusinessJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Visible Breadcrumbs Navigation ─────────────────────────── */}
      <nav aria-label="Breadcrumb" style={{ background: '#f8fafc', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: 0, padding: 0, fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li><Link href="/service-areas" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>Service Areas</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li><Link href={`/service-areas/counties/${countySlug}`} style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>{county} County</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li style={{ color: 'var(--color-red)', fontWeight: 600 }}>{cityName}</li>
          </ol>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hero" style={{ padding: '5rem 0 4.5rem' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.35rem 1rem', borderRadius: '50px', color: '#fca5a5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <span>📍</span>
            <span>{county} County • ~{distanceMiles} miles from Lithonia HQ • 50-Mile Service Footprint</span>
          </div>

          <h2 className="slogan-heading">
            &ldquo;Hindsight is expensive... <span className="slogan-accent">Choose Foresight!</span>&rdquo;
          </h2>
          <div className="hero-content">
            <h1 style={{ marginBottom: '1rem' }}>
              Top-Rated Home Inspection in<br />
              <span style={{ color: 'var(--color-red)' }}>{cityName}, GA</span>
            </h1>
            <p style={{ maxWidth: '750px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {introParagraph}
              <span style={{ display: 'block', marginTop: '0.75rem', fontSize: '1rem', color: 'var(--color-gray-mid)', fontWeight: '500' }}>
                ⚡ Certified Master Inspector® leadership, two certified inspectors per job, FLIR thermal imaging &amp; included $10,000 Elite Warranty ($0 deductible).
              </span>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.875rem 2.25rem', fontSize: '1.05rem', fontWeight: 700 }}>
                📅 Schedule Your Inspection
              </a>
              <Link href="/quote" className="btn btn-outline" style={{ padding: '0.875rem 2.25rem', fontSize: '1.05rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                Get Instant Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          AEO / GEO DIRECT ANSWER SUMMARY BOX (Machine & AI Digestible)
      ═══════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#f8fafc', padding: '2rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid var(--color-red)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🛡️</span> Quick Diagnostic Overview: {cityName}, GA Home Inspections
              </h2>
              <Link href={`/service-areas/counties/${countySlug}`} style={{ fontSize: '0.85rem', color: 'var(--color-red)', fontWeight: 700, textDecoration: 'none' }}>
                Explore {county} County Hub &rarr;
              </Link>
            </div>
            <p className="city-bluf-summary" style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Foresight Home Inspections is the premier Certified Master Inspector (CMI®) team serving {cityName}, GA. Every inspection is conducted by <strong>two certified inspectors</strong> working in tandem, cutting on-site time to 1.5–2.5 hours while delivering double verification. Standard inspections start at $295 (condos) and $345 (single-family homes) and include free FLIR infrared thermal imaging, roof drone scans, and a <strong>$10,000 Elite Master Warranty with $0 deductible</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div><strong>👨‍🔧 Team:</strong> 2 Certified Inspectors</div>
              <div><strong>⏱️ Duration:</strong> 1.5–2.5 Hours</div>
              <div><strong>📑 Report:</strong> Under 24 Hours</div>
              <div><strong>🛡️ Warranty:</strong> $10,000 ($0 Deductible)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SEASONAL TIP (auto-generated by city refresher bot)
      ═══════════════════════════════════════════════════════════════ */}
      {cityData?.['Seasonal Tip'] && (
        <section style={{ background: 'var(--color-red-light)', padding: '1.75rem 0', borderBottom: '2px solid rgba(211, 47, 47, 0.15)' }}>
          <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
            <div
              style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--color-gray-dark)' }}
              dangerouslySetInnerHTML={{ __html: cityData['Seasonal Tip'] }}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          2. $10,000 WARRANTY SECTION (unchanged)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-dark), #1f2937)', color: 'white' }}>
        <div className="container">
          <div className="section-title">
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--color-red)' }}>$10,000</span> Peace of Mind Protection
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem' }}>
              Because Christopher Boykin is a Certified Master Inspector®, you receive the maximum Elite MASTER level warranty plan that ordinary inspectors simply cannot offer.
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
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                📅 Schedule Inspection & Get Warranty
              </a>
              <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
                See Pricing First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. LOCAL HOUSING RISKS (city-specific)
      ═══════════════════════════════════════════════════════════════ */}
      {cityData?.['Local Risks HTML'] && (
        <section className="section bg-gray-light">
          <div className="container">
            <div className="section-title">
              <h2>Local Housing Risks in <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
              <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0 auto' }}>
                Every community has unique housing challenges. Here's what our inspectors commonly find in {cityName} properties.
              </p>
            </div>
            <div
              className="card card-premium"
              style={{ maxWidth: '800px', margin: '0 auto' }}
              dangerouslySetInnerHTML={{ __html: cityData['Local Risks HTML'] }}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          4. SPECIALIZED SERVICES (city-specific)
      ═══════════════════════════════════════════════════════════════ */}
      {cityData?.['Services HTML'] && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Our Specialized Services in <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
              <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0 auto' }}>
                Tailored inspection services designed for the specific needs of {cityName} homebuyers and sellers.
              </p>
            </div>
            <div
              className="card"
              style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}
              dangerouslySetInnerHTML={{ __html: cityData['Services HTML'] }}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          5. WHY HOMEBUYERS TRUST US (with city-specific benefits)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div className="card card-premium">
              <h2>Why {cityName} Homebuyers Trust Us</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Houses in {cityName} vary from new constructions to historic properties. A standard inspection isn't enough. A lead Certified Master Inspector of InterNACHI will be on site along with another certified inspector, bringing thermal imaging and drone technology to every inspection and ensuring your investment is perfectly sound.
              </p>
              {cityData?.['Benefits HTML'] ? (
                <div
                  className="cms-content"
                  style={{ marginBottom: '2rem' }}
                  dangerouslySetInnerHTML={{ __html: cityData['Benefits HTML'] }}
                />
              ) : (
                <ul className="cms-content" style={{ listStyle: 'none', marginBottom: '2rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-red)' }}>✓</span> Detailed PDF report within 24 hours
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-red)' }}>✓</span> Fully licensed &amp; insured in Georgia
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-red)' }}>✓</span> Radon, Sewer Scope, &amp; Mold Add-ons
                  </li>
                </ul>
              )}
            </div>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', minHeight: '350px', width: '100%' }}>
              <Image
                src="/images/roof-1.png"
                alt={`${cityName} Home Inspection - Roof Inspection by Certified Master Inspector Christopher Boykin`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HIGH-TECH DIAGNOSTIC SUITE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Advanced Equipment</span>
            <h2>Our High-Tech Diagnostic Suite in <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              We don't just perform a physical inspection. Foresight equips every two-inspector team in {cityName} with state-of-the-art diagnostic technology to see the invisible and protect your home investment.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/thermal-1.png"
                  alt={`Infrared Thermal Imaging (FLIR) camera inspecting home electrical heat profile in ${cityName}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Infrared Thermal Imaging (FLIR)</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  Our professional thermal cameras scan walls, ceilings, and electrical panels to locate hidden plumbing leaks, electrical fire hazards, and missing insulation without damaging any drywall. Included on every {cityName} inspection at no extra charge.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/drone-remote.png"
                  alt={`High-resolution aerial drone operator remote controller with telemetry screen in ${cityName}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>High-Resolution Aerial Drones</h3>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                  We utilize specialized camera drones to capture high-resolution imagery of roofs, chimneys, eaves, and gutters that are too steep, tall, or fragile to walk on. We inspect the entire {cityName} property from the safest and most effective angles.
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
                  An AI assistant trained directly on InterNACHI Standards of Practice and standard residential construction practices. Ask questions about your {cityName} inspection report, get home maintenance timelines, or troubleshoot issues in seconds.
                </p>
              </div>
            </div>

            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                <Image
                  src="/images/moisture-meter.png"
                  alt={`Digital moisture detector inspecting building walls in ${cityName}`}
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

      {/* ═══════════════════════════════════════════════════════════════
          LOCAL COUNTY COMPLIANCE & REGULATIONS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div className="section-title">
            <h2>{county} County Building & Compliance Context</h2>
          </div>
          <div style={{ background: 'var(--color-white)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--color-red)' }}>
            <p className="county-bluf-summary" style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1.1rem', lineHeight: 1.7, textAlign: 'left' }}>
              <strong>📍 Hyper-Local Expertise:</strong> {getCountyContext(county)}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DYNAMIC GOOGLE MAP LOCAL GEO-SIGNAL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--color-white)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--color-dark)' }}>
            📍 Foresight Home Inspections Coverage Area: <span style={{ color: 'var(--color-red)' }}>{cityName}, GA</span>
          </h3>
          <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1.5rem', fontSize: '1rem' }}>
            We provide fast, same-day scheduling and certified two-inspector team coverage across {cityName} and all surrounding neighborhoods in {county} County.
          </p>
          <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-gray-mid)' }}>
            <iframe
              title={`Foresight Home Inspections Service Area - ${cityName}, GA`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA_placeholder&q=${encodeURIComponent(`Home Inspector ${cityName} GA`)}`}
              fallbacksrc={`https://maps.google.com/maps?q=${encodeURIComponent(`${cityName}, GA`)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
              srcDoc={`<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=${encodeURIComponent(`${cityName}, GA`)}&t=&z=12&ie=UTF8&iwloc=&output=embed"></iframe>`}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SPECIALIZED SERVICES IN THIS CITY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Specialized Inspections</span>
            <h2>Specialized Inspection Services in <span style={{ color: 'var(--color-red)' }}>{cityName}, GA</span></h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem' }}>
              Book standalone testing or bundle with your full {cityName} home inspection for comprehensive protection.
            </p>
          </div>
          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            <Link href={`/services/home-inspection/${slug}`} className="card card-premium" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏡</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>Buyer Home Inspection</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0 }}>Full 2-inspector buyer evaluation with FLIR thermal scan and same-day report in {cityName}.</p>
            </Link>
            <Link href={`/services/radon-testing/${slug}`} className="card card-premium" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☢️</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>Radon Gas Testing</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0 }}>Continuous 48-hour electronic radon monitoring in {cityName} for EPA-compliant safety.</p>
            </Link>
            <Link href={`/services/termite-inspection/${slug}`} className="card card-premium" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐜</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>Termite & WDO Clearance</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0 }}>Official Georgia Wood Infestation Report for {cityName} buyers and lender approvals.</p>
            </Link>
            <Link href={`/services/11-month-warranty/${slug}`} className="card card-premium" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏗️</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>11-Month Builder Warranty</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0 }}>Independent inspection before your {cityName} builder warranty expires.</p>
            </Link>
            <Link href={`/services/new-construction/${slug}`} className="card card-premium" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔨</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>New Construction Phased</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0 }}>Pre-drywall and final walkthrough audits for newly constructed {cityName} homes.</p>
            </Link>
            <Link href={`/services/pool-inspection/${slug}`} className="card card-premium" style={{ textDecoration: 'none', color: 'inherit', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏊</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>Pool & Spa Evaluation</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', margin: 0 }}>Safety barrier, pump, filter, heater, and electrical bonding audits in {cityName}.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DEFECT & COMPARISON DECISION GUIDES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light" style={{ padding: '3.5rem 0', borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Buyer Decision Guides</span>
            <h2>Home Inspection Defect &amp; Decision Guides for <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem' }}>
              Explore our in-depth diagnostic guides on common Georgia housing red flags and compare inspection approaches.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔍</span> Common Red Flag Diagnostics
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li>
                  <Link href="/defects/stucco-eifs-moisture-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; Stucco (EIFS) Moisture Intrusion Audit
                  </Link>
                </li>
                <li>
                  <Link href="/defects/polybutylene-pipe-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; Polybutylene Plumbing Pipe Risk Guide
                  </Link>
                </li>
                <li>
                  <Link href="/defects/foundation-crack-settlement-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; Georgia Red Clay Foundation Settling Guide
                  </Link>
                </li>
                <li>
                  <Link href="/defects/federal-pacific-zinsco-panel-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; Federal Pacific &amp; Zinsco Panel Hazards
                  </Link>
                </li>
              </ul>
            </div>

            <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚖️</span> Inspection Decision Frameworks
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li>
                  <Link href="/compare/two-inspector-team-vs-single-inspector" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; Two-Inspector Team vs. Single Solo Inspector
                  </Link>
                </li>
                <li>
                  <Link href="/compare/11-month-warranty-vs-builder-walkthrough" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; 11-Month Warranty Audit vs. Builder Walkthrough
                  </Link>
                </li>
                <li>
                  <Link href="/compare/thermal-imaging-vs-standard-visual-inspection" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; FLIR Thermal Infrared Scans vs. Visual Inspection
                  </Link>
                </li>
                <li>
                  <Link href="/compare/pre-purchase-inspection-vs-bank-appraisal" style={{ color: 'var(--color-red)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    &rarr; Home Inspection vs. Bank Mortgage Appraisal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <GooglePreferredSource />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. FAQ ACCORDION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Frequently Asked Questions About Home Inspections in <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  border: '1px solid var(--color-gray-mid)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  padding: '1.5rem',
                  background: 'white',
                }}
              >
                <summary
                  style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    lineHeight: '1.4',
                    listStyle: 'none',
                  }}
                >
                  {faq.q}
                </summary>
                <div
                  style={{ marginTop: '1rem', lineHeight: '1.7', color: 'var(--color-gray-dark)' }}
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. NEARBY COMMUNITIES
      ═══════════════════════════════════════════════════════════════ */}
      {cityData?.['Nearby Cities HTML'] && (
        <section className="section bg-gray-light">
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-title">
              <h2>We Also Serve Communities Near <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
              <p style={{ color: 'var(--color-gray-dark)', maxWidth: '600px', margin: '0 auto' }}>
                Foresight Home Inspections proudly serves {cityName} and the surrounding areas across {county} County.
              </p>
            </div>
            <div
              className="card"
              style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '2rem',
                fontSize: '1.1rem',
                lineHeight: '1.8',
              }}
              dangerouslySetInnerHTML={{ __html: cityData['Nearby Cities HTML'] }}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          8. DEDICATED BOOKING CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to Schedule Your Inspection in <span style={{ color: 'var(--color-red)' }}>{cityName}</span>?</h2>
          <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Book your certified two-inspector team home inspection today. Securing your slot takes less than 5 minutes and includes our comprehensive $10,000 Elite Master warranty.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem', boxShadow: 'var(--shadow-md)' }}>
              📅 Schedule Your Inspection Online
            </a>
            <a href="tel:6784802110" className="btn btn-outline" style={{ padding: '1.25rem 3rem', fontSize: '1.2rem' }}>
              📞 Call to Book: 678-480-2110
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. ASK FORESIGHT AI CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Have questions about a home in {cityName}?</h2>
          <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>Chat with Foresight AI, trained on InterNACHI standards.</p>
          <Link href="/ask-twin" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Ask Foresight AI</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INTERNAL LINKING MESH
      ═══════════════════════════════════════════════════════════════ */}
      <RelatedServiceAreas currentCitySlug={slug} />

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE STICKY CTA (Leads-First)
      ═══════════════════════════════════════════════════════════════ */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-sticky-cta { display: none; }
        @media (max-width: 768px) {
          .mobile-sticky-cta { display: flex !important; }
          body { padding-bottom: 80px; }
        }
      `}} />
      <div className="mobile-sticky-cta" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'var(--color-white)', padding: '1rem', boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', gap: '0.5rem', zIndex: 9999 }}>
        <a href="tel:6784802110" className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', fontSize: '1rem', background: 'var(--color-white)' }}>Call Now</a>
        <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', fontSize: '1rem' }}>Book Now</a>
      </div>
    </>
  );
}
