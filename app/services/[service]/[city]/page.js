import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import RelatedServiceAreas from '../../../components/RelatedServiceAreas';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const dynamic = 'force-static';
export const dynamicParams = false;

function loadServices() {
  const filePath = path.join(process.cwd(), 'data', 'services-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function loadCities() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function normalizeServiceSlug(slug) {
  if (slug === 'termite-wdo-inspection') return 'termite-inspection';
  if (slug === 'pool-spa-inspection') return 'pool-inspection';
  if (slug === 'home-buyer-inspection') return 'buyer-inspection';
  return slug;
}

const SERVICE_DEFECT_MAP = {
  'sewer-scope-inspection': [
    {
      title: 'Polybutylene (Quest) Plumbing Defect Audit',
      slug: '/defects/polybutylene-pipe-plumbing-defect-inspection',
      desc: 'Micro-fractures, acetal insert fitting degradation, and interior burst hazards in Georgia homes.'
    },
    {
      title: 'Atlanta Red Clay Soil & Foundation Settlement',
      slug: '/blog/atlanta-red-clay-soil-foundation-settlement',
      desc: 'Expansive red clay soil shear forces causing underground sewer lateral bellies and joint offsets.'
    }
  ],
  'radon-testing': [
    {
      title: 'Hidden Dangers of Radon Gas in Georgia Granite',
      slug: '/blog/hidden-dangers-of-radon-gas-georgia',
      desc: 'Radioactive decay across Georgia Piedmont granite belts entering homes through slabs and crawlspaces.'
    },
    {
      title: 'Crawlspace Moisture, Wood Rot & Fungus Diagnostics',
      slug: '/defects/crawlspace-fungus-joist-rot-inspection',
      desc: 'Vented crawlspaces concentrating high humidity, microbial spores, and subterranean soil gases.'
    }
  ],
  'termite-inspection': [
    {
      title: 'Crawlspace Moisture, Wood Rot & Joist Defect Audit',
      slug: '/defects/crawlspace-fungus-joist-rot-inspection',
      desc: 'Subterranean termite entry vectors, shelter tubes, and fungal rot compromising structural framing.'
    },
    {
      title: 'Synthetic Stucco (EIFS) & Hard-Coat Moisture Audit',
      slug: '/defects/stucco-eifs-moisture-inspection',
      desc: 'Zero-clearance grade penetrations allowing hidden termite transit behind exterior cladding systems.'
    }
  ],
  'new-construction-inspection': [
    {
      title: 'Roof Flashing & Chimney Water Intrusion Diagnostics',
      slug: '/defects/unsealed-roof-flashing-water-leak-inspection',
      desc: 'Rushed builder shortcuts, missing kickout flashing, and unsealed valley transitions.'
    },
    {
      title: 'HVAC Heat Exchanger & Air Duct Defect Inspection',
      slug: '/defects/heat-exchanger-hvac-inspection',
      desc: 'Subcontractor flex duct constriction, unbalanced static pressure, and equipment commissioning flaws.'
    }
  ],
  'buyer-inspection': [
    {
      title: 'Federal Pacific & Zinsco Electrical Panel Hazards',
      slug: '/defects/federal-pacific-zinsco-panel-inspection',
      desc: 'Breakers failing to trip under overcurrent load, buss bar arcing, and panel fire hazards.'
    },
    {
      title: 'Synthetic Stucco (EIFS) Hidden Substrate Moisture',
      slug: '/defects/stucco-eifs-moisture-inspection',
      desc: 'Infrared thermal and pin-probe diagnostics identifying concealed wood framing rot behind stucco.'
    },
    {
      title: 'Polybutylene Pipe Plumbing Failure Risks',
      slug: '/defects/polybutylene-pipe-plumbing-defect-inspection',
      desc: 'Pre-1996 residential plumbing systems subject to sudden catastrophic pressure failure.'
    }
  ],
  'pre-listing-inspection': [
    {
      title: 'Federal Pacific & Zinsco Breaker Fire Risks',
      slug: '/defects/federal-pacific-zinsco-panel-inspection',
      desc: 'Identify obsolete panels prior to buyer discovery and negotiation repair escrow demands.'
    },
    {
      title: 'Roof Flashing & Chimney Water Intrusion Analysis',
      slug: '/defects/unsealed-roof-flashing-water-leak-inspection',
      desc: 'Eliminate roof leaks before the buyer submits an inspection contingency amendment.'
    }
  ],
  '11-month-warranty-inspection': [
    {
      title: 'Roof Flashing & Envelope Water Intrusion Audits',
      slug: '/defects/unsealed-roof-flashing-water-leak-inspection',
      desc: 'Document builder envelope defects and missing flashing while builder warranties remain in force.'
    },
    {
      title: 'HVAC Heat Exchanger & Airflow Balancing',
      slug: '/defects/heat-exchanger-hvac-inspection',
      desc: 'Verify builder HVAC installations meet manufacturer specifications and supply airflow requirements.'
    }
  ],
  'mold-testing': [
    {
      title: 'Crawlspace Moisture, Wood Rot & Fungus Diagnostics',
      slug: '/defects/crawlspace-fungus-joist-rot-inspection',
      desc: 'Spore concentration sources in humid crawlspaces venting upward into living quarters via stack effect.'
    },
    {
      title: 'Synthetic Stucco (EIFS) Moisture Intrusion Audit',
      slug: '/defects/stucco-eifs-moisture-inspection',
      desc: 'Trapped moisture in exterior wall envelopes breeding mold colonies behind interior drywall.'
    }
  ],
  'pool-inspection': [
    {
      title: 'Roof Flashing & Ground Drainage Defect Analysis',
      slug: '/defects/unsealed-roof-flashing-water-leak-inspection',
      desc: 'Grade drainage vectors, retaining wall hydrostatic pressure, and patio slope moisture intrusion.'
    },
    {
      title: 'Atlanta Red Clay Soil & Foundation Movement',
      slug: '/blog/atlanta-red-clay-soil-foundation-settlement',
      desc: 'Expansive soils affecting pool shells, underground plumbing runs, and surrounding decking.'
    }
  ],
  'pre-drywall-inspection': [
    {
      title: 'Roof Flashing & Wall Sheathing Water Intrusion',
      slug: '/defects/unsealed-roof-flashing-water-leak-inspection',
      desc: 'Inspect weather-resistive barriers, flashing kickouts, and window pan flashing before drywall seals them.'
    },
    {
      title: 'Aluminum & Branch Circuit Electrical Inspection',
      slug: '/defects/aluminum-wiring-inspection',
      desc: 'Inspect electrical framing runs, box installation, rough-in wire routing, and nail plate protection.'
    }
  ],
  'commercial-property-inspection': [
    {
      title: 'HVAC Heat Exchanger & Commercial Roof Top Units',
      slug: '/defects/heat-exchanger-hvac-inspection',
      desc: 'Commercial packaged HVAC inspection, thermal combustion audits, and distribution efficiency.'
    },
    {
      title: 'Commercial Roof Flashing & Parapet Water Intrusion',
      slug: '/defects/unsealed-roof-flashing-water-leak-inspection',
      desc: 'Low-slope roof drainage, scupper flashing, and commercial envelope leak diagnostics.'
    }
  ]
};

// ---------------------------------------------------------------------------
// Static params – generates 462 routes (6 services x 77 cities)
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const services = loadServices();
  const cities = loadCities();

  const params = [];
  for (const service of services) {
    for (const city of cities) {
      params.push({
        service: service.slug,
        city: toSlug(city['City Name']),
      });
    }
  }
  return params;
}

// ---------------------------------------------------------------------------
// Metadata – SEO titles, descriptions, OpenGraph, canonical
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const services = loadServices();
  const cities = loadCities();

  const normalizedService = normalizeServiceSlug(resolvedParams.service);
  const serviceData = services.find(s => s.slug === normalizedService);
  const cityData = cities.find(c => toSlug(c['City Name']) === resolvedParams.city);

  if (!serviceData || !cityData) {
    return { title: 'Service Not Found | Foresight Home Inspections' };
  }

  const cityName = cityData['City Name'];
  const county = cityData.County || 'Georgia';
  const serviceName = serviceData.name;

  let title = serviceData.metaTitle.replace(/{city}/g, cityName);
  if (title.length > 62) {
    title = `${cityName}, GA ${serviceName} | ${serviceData.price}`;
  }
  const description = serviceData.metaDescription.replace(/{city}/g, cityName);
  const canonicalUrl = `${SITE_URL}/services/${normalizedService}/${resolvedParams.city}`;

  return {
    title: {
      absolute: title,
    },
    description,
    keywords: [
      `${serviceName.toLowerCase()} ${cityName} GA`,
      `best ${serviceName.toLowerCase()} ${cityName} GA`,
      `${serviceName.toLowerCase()} cost ${cityName}`,
      `${serviceName.toLowerCase()} near me ${cityName}`,
      `certified home inspector ${cityName} GA`,
      `${serviceName.toLowerCase()} ${county} County GA`,
      `foresight home inspections ${cityName}`
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ---------------------------------------------------------------------------
// County Context Helper (20-County Geotech, Era & Municipal Code Matrix)
// ---------------------------------------------------------------------------
function getCountyContext(county, cityName, serviceName) {
  switch (county) {
    case 'Fulton':
      return `Fulton County spans historic Intown unreinforced masonry homes to dense North Fulton luxury estates built over uranium-bearing granite bedrock (EPA Zone 1 radon). Performing ${serviceName.toLowerCase()} in ${cityName} requires evaluating Piedmont red clay foundation hydrostatic pressure, legacy electrical panels, and City of Atlanta municipal compliance standards.`;
    case 'DeKalb':
      return `DeKalb County enforces mandatory Low-Flow Plumbing Retrofit Certificates ($100 flat fee through Foresight) on pre-1993 residential sales and sits directly atop the Stone Mountain granite formation (EPA Zone 1 radon). Our ${serviceName.toLowerCase()} in ${cityName} targets mature tree-root intrusion in cast-iron and terracotta sewer laterals alongside mid-century crawlspace moisture.`;
    case 'Gwinnett':
      return `As one of Georgia's largest suburban corridors, Gwinnett County features a high density of 1978–1995 subdivisions with polybutylene (PB2110) supply piping and synthetic stucco (EIFS) cladding alongside rapid 2020s new construction. We tailor our ${serviceName.toLowerCase()} in ${cityName} to catch hidden plumbing micro-fractures, rushed builder framing, and granite soil radon gas.`;
    case 'Cobb':
      return `Cobb County's rolling Piedmont topography and expansive Cecil red clay soils create significant seasonal shrink-swell foundation stress and basement retaining wall deflection. Our ${serviceName.toLowerCase()} in ${cityName} utilizes calibrated infrared thermal imaging and pin-probe hygrometers to detect sub-surface moisture and structural settlement.`;
    case 'Forsyth':
      return `Forsyth County's Lake Lanier watershed slopes and custom multi-system estates demand rigorous mechanical and structural verification. During ${serviceName.toLowerCase()} in ${cityName}, our two-inspector team audits multi-zone HVAC static pressure, steep-slope roof flashings via 4K drone telemetry, and North Georgia granite radon gas accumulation.`;
    case 'Cherokee':
      return `Cherokee County combines Etowah River basin humidity with steep-grade foothill lots where improper builder lot grading frequently drives water into crawlspaces and slab footings. Our ${serviceName.toLowerCase()} in ${cityName} focuses on retaining wall drainage, wood-destroying organism (WDO) vectors, and production builder warranty defects.`;
    case 'Clayton':
      return `Clayton County contains a high concentration of 1950s–1980s ranch and split-level homes where obsolete Federal Pacific or Zinsco electrical panels, aging galvanized water lines, and clay sewer lateral bellies are frequently uncovered during our ${serviceName.toLowerCase()} in ${cityName}.`;
    case 'Henry':
      return `Henry County's rapid Southern Crescent expansion includes thousands of post-tension slab-on-grade builds and master-planned subdivisions. Performing ${serviceName.toLowerCase()} in ${cityName} requires close inspection of attic truss bracing, unsealed roof valley flashings, and underground sewer line compaction from heavy grading equipment.`;
    case 'Fayette':
      return `Fayette County's custom acreage estates and established executive subdivisions frequently feature complex roofline geometries, synthetic or hard-coat stucco envelopes, and expansive crawlspaces. Our ${serviceName.toLowerCase()} in ${cityName} verifies envelope moisture integrity, septic/sewer transition lines, and multi-unit HVAC performance.`;
    case 'Coweta':
      return `Coweta County blends historic Newnan-area mill architecture with high-velocity I-85 corridor new construction. Our two-inspector ${serviceName.toLowerCase()} in ${cityName} evaluates historic pier-and-curtain foundation movement, subterranean termite shelter tubes, and builder framing compliance.`;
    case 'Douglas':
      return `Douglas County's Sweetwater Creek basin and steep Piedmont ridges subject residential foundations to heavy stormwater runoff and hydrostatic soil pressure. During ${serviceName.toLowerCase()} in ${cityName}, we closely audit crawlspace vapor barriers, floor joist moisture levels, and electrical grounding systems.`;
    case 'Paulding':
      return `Paulding County is one of Metro Atlanta's fastest-growing new construction markets, where tight builder schedules frequently result in missing kickout flashings, disconnected attic ductwork, and crushed PVC sewer laterals. Our ${serviceName.toLowerCase()} in ${cityName} protects buyers before closing or 11-month builder warranty expiration.`;
    case 'Rockdale':
      return `Rockdale County sits over prominent granite gneiss outcroppings that elevate indoor radon potential and create perched water tables beneath residential slabs and basements. Our ${serviceName.toLowerCase()} in ${cityName} combines thermal moisture mapping with thorough structural and mechanical diagnostics.`;
    case 'Newton':
      return `Newton County spans historic Covington masonry properties to fast-expanding eastern corridor subdivisions near the Alcovy and Yellow River watersheds. Performing ${serviceName.toLowerCase()} in ${cityName} requires targeted diagnostics for high crawlspace relative humidity, fungal joist decay, and roof flashing longevity.`;
    case 'Walton':
      return `Walton County's transition from agricultural tracts to residential subdivisions places modern slab and crawlspace foundations over high-plasticity red clay soils. Our ${serviceName.toLowerCase()} in ${cityName} checks for differential foundation settlement, grading drainage slope, and complete MEP code compliance.`;
    case 'Barrow':
      return `Barrow County's booming Northeast I-85 and Highway 316 corridors feature dense production-built neighborhoods where our ${serviceName.toLowerCase()} in ${cityName} routinely identifies improper roof shingle fastening, unbalanced HVAC supply airflow, and unsealed exterior wall penetrations.`;
    case 'Bartow':
      return `Bartow County's North Georgia valley and ridge geology introduces mixed clay and limestone soil movement alongside high seasonal moisture. Our two-inspector ${serviceName.toLowerCase()} in ${cityName} evaluates foundation stability, attic insulation thermal bypasses, and electrical panel safety.`;
    case 'Carroll':
      return `Carroll County properties experience heavy West Georgia red clay shrink-swell cycles and intense subterranean termite pressure. Performing ${serviceName.toLowerCase()} in ${cityName} involves thorough crawlspace structural framing checks, brick veneer lintel inspection, and moisture intrusion scanning.`;
    case 'Hall':
      return `Hall County's Lake Lanier shoreline microclimates and steep hillside lots require specialized evaluation of foundation footing stability, multi-level deck ledger attachments, and high-elevation roof slopes during every ${serviceName.toLowerCase()} in ${cityName}.`;
    case 'Spalding':
      return `Spalding County features a mix of early-20th-century historic residences and modern suburban infill, where our ${serviceName.toLowerCase()} in ${cityName} targets aging cast-iron drain stacks, ungrounded branch circuit wiring, and crawlspace wood-rot remediation needs.`;
    default:
      return `${county} County properties are directly impacted by Georgia's humid subtropical climate and expansive Piedmont red clay soils. Our two-inspector ${serviceName.toLowerCase()} in ${cityName} ensures your property's structural, roof, electrical, plumbing, and HVAC systems are thoroughly verified.`;
  }
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default async function ServiceCityPage({ params }) {
  const resolvedParams = await params;
  const services = loadServices();
  const cities = loadCities();

  const normalizedService = normalizeServiceSlug(resolvedParams.service);
  const serviceData = services.find(s => s.slug === normalizedService);
  const cityData = cities.find(c => toSlug(c['City Name']) === resolvedParams.city);

  if (!serviceData || !cityData) {
    notFound();
  }

  const cityName = cityData['City Name'];
  const county = cityData.County || 'Georgia';
  const zip = cityData.Zip || '';
  const serviceName = serviceData.name;
  const canonicalUrl = `${SITE_URL}/services/${normalizedService}/${resolvedParams.city}`;

  // Process FAQs with city name injected
  const processedFaqs = serviceData.faqs.map(f => ({
    q: f.q.replace(/{city}/g, cityName),
    a: f.a.replace(/{city}/g, cityName),
  }));

  // JSON-LD Schemas
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": `${SITE_URL}/services` },
      { "@type": "ListItem", "position": 3, "name": serviceName, "item": `${SITE_URL}/services#${serviceData.slug}` },
      { "@type": "ListItem", "position": 4, "name": `${serviceName} in ${cityName}`, "item": canonicalUrl }
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    "name": `${serviceName} in ${cityName}, GA`,
    "url": canonicalUrl,
    "serviceType": serviceName,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "image": "https://www.fhinspectionsatl.com/images/two-inspectors-electrical-panel-inspection.jpg",
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com",
      "priceRange": "$$$",
      "hasMap": "https://maps.google.com/?cid=10862078652033010531",
      "sameAs": [
        "https://maps.google.com/?cid=10862078652033010531",
        "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
      ],
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
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": cityData.Latitude || "33.7490",
        "longitude": cityData.Longitude || "-84.3880"
      },
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": `${county} County`,
        "containedInPlace": { "@type": "State", "name": "Georgia" }
      }
    },
    "offers": {
      "@type": "Offer",
      "price": serviceData.price.replace(/[^0-9]/g, '') || "200",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "areaServed": {
        "@type": "City",
        "name": cityName
      }
    }
  };

  const serviceImages = {
    'sewer-scope-inspection': `${SITE_URL}/images/sewer-scope.png`,
    'pool-spa-inspection': `${SITE_URL}/images/pool-inspecting.png`,
    'pool-inspection': `${SITE_URL}/images/pool-inspecting.png`,
    'thermal-imaging': `${SITE_URL}/images/thermal-1.png`,
    'termite-inspection': `${SITE_URL}/images/crawlspace.png`,
    'termite-wdo-inspection': `${SITE_URL}/images/crawlspace.png`,
    '11-month-warranty-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'pre-listing-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'new-construction-inspection': `${SITE_URL}/images/luxury-home.jpg`,
    'buyer-inspection': `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`,
    'home-buyer-inspection': `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`
  };
  const primaryProductImage = serviceImages[resolvedParams.service] || `${SITE_URL}/images/two-inspectors-electrical-panel-inspection.jpg`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${serviceName} Package in ${cityName}, GA`,
    "description": `Comprehensive ${serviceName.toLowerCase()} in ${cityName}, GA by Certified Master Inspector Christopher Boykin of Foresight Home Inspections. Includes professional testing equipment, full digital report within 24 hours, and $10,000 warranty protection.`,
    "image": [
      primaryProductImage,
      `${SITE_URL}/images/luxury-home.jpg`,
      `${SITE_URL}/images/Logopng.png`
    ],
    "sku": `FHI-${toSlug(serviceName)}-${toSlug(cityName)}`.toUpperCase(),
    "brand": {
      "@type": "Brand",
      "name": "Foresight Home Inspections"
    },
    "offers": {
      "@type": "Offer",
      "price": `${serviceData.price.replace(/[^0-9]/g, '') || "200"}.00`,
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
      "validFrom": "2026-01-01",
      "availability": "https://schema.org/InStock",
      "url": canonicalUrl,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US",
          "addressRegion": "GA"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "48",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Marcus Vance" },
        "datePublished": "2026-06-15",
        "reviewBody": "Christopher and his secondary inspector saved us thousands on our Atlanta home purchase. Their thermal camera caught a massive hidden moisture issue behind the master bath tile that standard inspectors missed.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": processedFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a.replace(/<[^>]*>/g, '')
      }
    }))
  };

  // Select nearby cities for footer cross-linking
  const nearbyCities = cities
    .filter(c => toSlug(c['City Name']) !== resolvedParams.city && c.County === county)
    .slice(0, 8);

  return (
    <>
      {/* ── JSON-LD SCHEMAS ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── BREADCRUMBS ────────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
        <Link href="/" style={{ color: 'var(--color-red)' }}>Home</Link> &nbsp;/&nbsp;
        <Link href="/services" style={{ color: 'var(--color-red)' }}>Services</Link> &nbsp;/&nbsp;
        <Link href={`/service-areas/${resolvedParams.city}`} style={{ color: 'var(--color-red)' }}>{cityName}</Link> &nbsp;/&nbsp;
        <span>{serviceName}</span>
      </div>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="hero" style={{ padding: '4rem 0 5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {serviceData.icon} {serviceData.badge}
          </span>
          <h1 style={{ fontSize: '2.75rem', marginBottom: '1.25rem', lineHeight: 1.2, color: '#FFFFFF', textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}>
            {serviceData.h1Title ? serviceData.h1Title.replace(/{city}/g, cityName) : `${cityName}, GA ${serviceName}`}: <span style={{ color: 'var(--color-gold)', textShadow: '0 2px 14px rgba(212, 175, 55, 0.35)' }}>Certified 2-Inspector Team</span>
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto 2.5rem', fontSize: '1.2rem', lineHeight: 1.6, color: '#F1F5F9', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            {serviceData.heroSub.replace(/{city}/g, cityName)}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              Schedule {serviceName}
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}
              data-call-source={`pseo_${serviceData.slug}_${resolvedParams.city}`}
            >
              Call 678-480-2110
            </a>
          </div>
        </div>
      </section>

      {/* ── AEO / GEO DIRECT ANSWER SUMMARY BOX (AI Overviews & Answer Engines) ── */}
      <section style={{ background: '#f8fafc', padding: '2rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid var(--color-red)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {serviceName} in {cityName}, GA: Quick Facts &amp; Pricing
              </h2>
              <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                Verified 2026 Standards
              </span>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: 1.65, color: '#334155', margin: '0 0 1rem 0' }}>
              <strong>Direct Answer:</strong> Foresight Home Inspections provides certified <strong>{serviceName.toLowerCase()}</strong> in {cityName}, GA ({county} County) starting at <strong>{serviceData.price}</strong> ({serviceData.priceDetails}). Governed directly by Board-Certified Master Inspector® Christopher Boykin (CMI #MICB-1082) with <strong>two certified inspectors on every appointment</strong>, our dual-audit protocol cuts on-site time in half (1.5–2.5 hours vs. 4+ hours for solo competitors) while eliminating late-stage inspector fatigue. Every evaluation includes calibrated infrared thermal imaging ($0 upcharge vs. $150 competitor fees), 24-hour digital reporting, and up to <strong>$35,000 in zero-deductible warranty protection</strong> ($10,000 Elite Master Warranty + $25,000 InterNACHI Honor Guarantee).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.875rem', color: '#475569' }}>
              <div><strong>Price:</strong> {serviceData.price}</div>
              <div><strong>Inspectors:</strong> 2 Certified on Site</div>
              <div><strong>⭐ Rating:</strong> 4.9★ (48 Reviews)</div>
              <div><strong>Protection:</strong> $35,000 ($0 Deductible)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW & PRICING CARD ──────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="grid grid-2" style={{ gap: '2.5rem', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
              <span className="badge" style={{ background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', marginBottom: '1rem', display: 'inline-block' }}>
                Service Overview
              </span>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Professional {serviceName} Services in {cityName}, GA ({county} County)
              </h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                {serviceData.overview.replace(/{city}/g, cityName)}
              </p>
            </div>

            {/* Pricing Card */}
            <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'white', padding: '2.25rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{serviceData.icon}</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{serviceName} Pricing</h3>
              <div style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--color-red)', margin: '0.5rem 0' }}>
                {serviceData.price}
              </div>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {serviceData.priceDetails}
              </p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--color-gray-mid)', fontSize: '0.95rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Includes $10,000 Elite Warranty Protection</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Two Certified Inspectors on every job</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Digital Report delivered within 24 hours</li>
              </ul>
              <Link href="/quote" className="btn btn-primary" style={{ width: '100%', display: 'block' }}>
                Get Custom Quote
              </Link>
            </div>
          </div>

          {/* Standards & Equipment */}
          <div className="grid grid-2" style={{ gap: '2rem', marginTop: '2rem' }}>
            <div style={{ background: 'var(--color-gray-light)', padding: '1.75rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-red)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Testing Standards & Regulations
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                {serviceData.standards}
              </p>
            </div>

            <div style={{ background: 'var(--color-gray-light)', padding: '1.75rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-dark)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Diagnostic Equipment Used
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                {serviceData.equipment}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTY & CITY CONTEXT ───────────────────────────────────── */}
      <section className="section bg-gray-light">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center">
            <h2>{cityName}, {county} County Environmental & Property Analysis</h2>
          </div>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid var(--color-red)' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', marginBottom: '1.25rem' }}>
              <strong>Regional Analysis for {cityName}:</strong> {getCountyContext(county, cityName, serviceName)}
            </p>
            {cityData?.Intro && (
              <p style={{ fontSize: '1.025rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', marginBottom: '1.25rem' }}>
                <strong>Local Neighborhood Overview:</strong> {cityData.Intro}
              </p>
            )}
            {cityData?.['Local Risks HTML'] && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '0.5rem' }}>
                  Geotechnical &amp; Housing Vulnerabilities in {cityName}:
                </strong>
                <div style={{ fontSize: '0.975rem', lineHeight: 1.7, color: 'var(--color-gray-dark)' }} dangerouslySetInnerHTML={{ __html: cityData['Local Risks HTML'] }} />
              </div>
            )}
            {cityData?.['Seasonal Tip'] && (
              <div style={{ background: 'rgba(211,47,47,0.04)', borderLeft: '4px solid var(--color-gold)', padding: '1rem 1.25rem', borderRadius: '4px', marginBottom: '1.25rem' }}>
                <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '0.25rem' }}>
                  Seasonal Inspection Advisory for {cityName}:
                </strong>
                <span style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: cityData['Seasonal Tip'] }} />
              </div>
            )}
            <p style={{ fontSize: '1.025rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', margin: 0 }}>
              <strong>Environmental Advisory:</strong> {serviceData.riskContext.replace(/{city}/g, cityName)}
            </p>
          </div>

          {/* Sibling Services in this City */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>
              Complete Inspection Services in {cityName}, GA
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href={`/service-areas/${resolvedParams.city}`}
                className="btn btn-outline"
                style={{ fontSize: '0.875rem', background: 'white', borderColor: 'var(--color-red)', color: 'var(--color-red)' }}
              >
                ⭐ Full {cityName} Inspection Hub
              </Link>
              {services.filter(s => s.slug !== resolvedParams.service).map(s => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}/${resolvedParams.city}`}
                  className="btn btn-outline"
                  style={{ fontSize: '0.875rem', background: 'white' }}
                >
                  {s.icon} {s.name} in {cityName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      {/* ── PHYSICAL GEO-TRUST & SERVICE MAP ──────────────────────────── */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-gray-mid)', padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>Local Territory Grounding</span>
            <h2>{serviceName} in <span style={{ color: 'var(--color-red)' }}>{cityName}, GA</span> &amp; {county} County</h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem' }}>
              Full certified deployment coverage across {cityName} from our Lithonia, GA headquarters.
            </p>
          </div>

          <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 0 }}>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', color: '#065f46', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content', marginBottom: '1rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                  Certified Local Service
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem' }}>
                  {cityName} {serviceName} Trust Anchor
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="font-mono text-xs text-primary font-bold">[GEO]</span>
                    <span><strong>Service Area:</strong> {cityName}, {county} County, GA</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="font-mono text-xs text-primary font-bold">[HUB]</span>
                    <span><strong>Operating Base:</strong> Metro Atlanta Headquarters (Lithonia, GA)</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="font-mono text-xs text-primary font-bold">[CMI]</span>
                    <span><strong>Inspector Credential:</strong> Certified Master Inspector® (CMI) Led Team</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="font-mono text-xs text-primary font-bold">[TEL]</span>
                    <span><strong>Direct Dispatch Phone:</strong> 678-480-2110</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Foresight Home Inspections ${serviceName} ${cityName} GA`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
                    View {cityName} Map ↗
                  </a>
                  <a href="/quote" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
                    Instant {serviceName} Quote
                  </a>
                </div>
              </div>

              <div style={{ minHeight: '300px', width: '100%', background: '#e2e8f0', position: 'relative' }}>
                <iframe
                  title={`Foresight Home Inspections ${serviceName} - ${cityName}, GA`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${cityName}, GA`)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

{/* ── FAQ ACCORDION ───────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-title text-center">
            <h2>Frequently Asked Questions: {serviceName} in <span style={{ color: 'var(--color-red)' }}>{cityName}</span></h2>
          </div>
          <div>
            {processedFaqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  border: '1px solid var(--color-gray-mid)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--color-gray-light)',
                }}
              >
                <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-dark)' }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.7, color: 'var(--color-gray-dark)', fontSize: '1rem' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED BLOG LINK ───────────────────────────────────────── */}
      {serviceData.relatedBlogSlug && (
        <section className="section bg-dark text-white" style={{ padding: '3.5rem 0' }}>
          <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <span style={{ color: 'var(--color-red)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Educational Resource
            </span>
            <h3 style={{ color: 'white', marginTop: '0.5rem', marginBottom: '1rem', fontSize: '1.75rem' }}>
              Want to learn more about {serviceName.toLowerCase()}?
            </h3>
            <p style={{ color: 'var(--color-gray-mid)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              Read our comprehensive guide written by Certified Master Inspector Christopher Boykin.
            </p>
            <Link
              href={`/blog/${serviceData.relatedBlogSlug}`}
              className="btn btn-outline"
              style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)', padding: '0.75rem 2rem' }}
            >
              Read Expert Guide &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ── TARGETED BUILDING SCIENCE & DEFECT AUDITS ───────────────── */}
      <section className="section bg-white" style={{ borderTop: '1px solid #e2e8f0', padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-gold, #D4AF37)',
              background: '#0F172A',
              padding: '0.3rem 0.75rem',
              borderRadius: '4px',
              marginBottom: '0.75rem'
            }}>
              Forensic Building Science Diagnostic Silo
            </span>
            <h2 style={{ fontSize: '1.85rem', color: '#0F172A', margin: '0.5rem 0' }}>
              Targeted Building Science &amp; Defect Audits for <span style={{ color: 'var(--color-red)' }}>{cityName}</span>
            </h2>
            <p style={{ color: '#64748B', maxWidth: '680px', margin: '0.5rem auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
              In {county} County, specific geological and construction era factors directly influence property integrity. Review critical forensic defect guides relevant to your {serviceName.toLowerCase()} inspection.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {(SERVICE_DEFECT_MAP[normalizedService] || SERVICE_DEFECT_MAP['buyer-inspection']).map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-red, #D32F2F)'
                    }}></span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Diagnostic Guide
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                    {item.desc}
                  </p>
                </div>
                <Link
                  href={item.slug}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--color-red, #D32F2F)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    textDecoration: 'none'
                  }}
                >
                  Read Forensic Audit &rarr;
                </Link>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            background: '#F1F5F9',
            borderRadius: 'var(--radius-md, 8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderLeft: '4px solid var(--color-gold, #D4AF37)'
          }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0F172A' }}>
                Need a multi-point risk scan before scheduling?
              </strong>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Use our interactive Georgia Due Diligence Matrix to identify required inspection add-ons by era.
              </span>
            </div>
            <Link
              href="/risk-scanner"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#FFFFFF' }}
            >
              Launch Era Scanner &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER CROSS-LINKING ────────────────────────────────────── */}
      <section className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {serviceName} in Nearby {county} County Communities
          </h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`/service-areas/${resolvedParams.city}`}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem', background: 'white' }}
            >
              Full {cityName} Inspection Overview
            </Link>
            {nearbyCities.map(nc => (
              <Link
                key={nc['City Name']}
                href={`/services/${resolvedParams.service}/${toSlug(nc['City Name'])}`}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', background: 'white' }}
              >
                {serviceName} in {nc['City Name']}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKING MESH ───────────────────────────────────── */}
      <RelatedServiceAreas currentCitySlug={resolvedParams.city} serviceSlug={resolvedParams.service} />
    </>
  );
}
