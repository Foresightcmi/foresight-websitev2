import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import GooglePreferredSource from '../../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

const SERVICE_MAP = {
  'radon-testing': {
    name: 'Electronic Radon Testing',
    price: '$200',
    icon: '☢️',
    headline: 'Continuous 48-Hour Electronic Radon Testing Across Metro Atlanta',
    metaTitle: 'Professional Radon Gas Testing Services | Foresight Atlanta',
    metaDescription: 'EPA-certified continuous electronic radon testing across 87 Metro Atlanta cities. 48-hour hourly breakdown reports for real estate transactions. Flat $200.',
    description: 'Radon is an odorless, invisible radioactive gas that represents the second leading cause of lung cancer in the United States. Northern Georgia geology contains significant granite bedrock with naturally occurring uranium deposits. Foresight uses state-of-the-art continuous electronic radon monitors delivering precision hourly graphs and EPA-compliant action reports.',
    included: [
      '48-hour continuous electronic active monitor placement',
      'Hourly air concentration measurement graph',
      'Tamper-resistant sensor tracking (temperature, barometric pressure, movement)',
      'Same-day digital EPA-compliance report upon completion'
    ]
  },
  'sewer-scope-inspection': {
    name: 'Sewer Scope Camera Inspection',
    price: '$425',
    icon: '🎥',
    headline: 'HD Fiber-Optic Main Drain & Lateral Sewer Scope Camera Audits',
    metaTitle: 'Sewer Scope Camera Inspections | Foresight Atlanta',
    metaDescription: 'High-definition fiber-optic sewer scope camera inspections across Metro Atlanta. Detect root intrusions, collapsed lines, and pipe offsets. Flat $425.',
    description: 'Replacing a broken underground sewer lateral costs between $5,000 and $25,000 and is not covered by standard homeowners insurance. Foresight pushes a self-leveling HD fiber-optic camera through the entire line to the municipal connection or septic tank, pinpointing root intrusions, crushed pipes, low-pitch bellies, and joint separations.',
    included: [
      'Full 100+ foot self-leveling color video camera push',
      'Digital video recording link embedded directly in your report',
      'Depth and location pinpointing of defects',
      'Evaluation of cast iron, PVC, clay, and Orangeburg piping'
    ]
  },
  'pool-spa-inspection': {
    name: 'Pool & Spa Inspection',
    price: '$300',
    icon: '🏊',
    headline: 'Comprehensive Swimming Pool, Spa & Equipment Diagnostic Evaluations',
    metaTitle: 'Swimming Pool & Spa Inspections | Foresight Atlanta',
    metaDescription: 'Certified swimming pool and spa inspections across Metro Atlanta. Pumps, heaters, electrical bonding, filtration, and safety barriers. Starting at $300.',
    description: 'Swimming pools and integrated spas involve high-voltage electricity, pressurized plumbing, structural gunite/vinyl membranes, and complex heating systems. Our InterNACHI Certified Pool Inspector verifies equipment operation, safety coping, GFCI and bonding compliance, surface integrity, and safety fencing.',
    included: [
      'Pump, filtration, and circulation system pressure testing',
      'Pool heater ignition, burner, and heat exchanger evaluation',
      'Electrical safety, GFCI, and equipotential bonding audit',
      'Safety barriers, self-latching gates, and anti-entrapment drains'
    ]
  },
  'termite-wdo-inspection': {
    name: 'Termite & WDO Clearance Inspection',
    price: '$110+',
    icon: '🐜',
    headline: 'Official Georgia Wood Destroying Organism (WDO) Clearance Letters',
    metaTitle: 'Termite & WDO Inspections | Foresight Atlanta',
    metaDescription: 'Official Georgia Wood Destroying Organism (WDO) clearance letters and termite inspections for buyers and realtors. Starting at $110.',
    description: 'Georgia is located in the highest-risk termite zone in North America (Zone 1). Subterranean termites, carpenter ants, and wood-boring beetles cause billions of dollars in structural damage annually. We inspect all crawlspaces, sill plates, foundation perimeters, and framing for active infestations and past damage.',
    included: [
      'Comprehensive crawlspace, basement, and foundation perimeter sweep',
      'Inspection for subterranean termites, carpenter ants, and powderpost beetles',
      'Identification of wood rot, high-moisture contact, and earth-to-wood conditions',
      'Official Georgia WDO clearance letter for lenders and mortgage closing'
    ]
  },
  '11-month-warranty-inspection': {
    name: '11-Month Builder Warranty Inspection',
    price: 'From $345',
    icon: '🏗️',
    headline: 'Protect Your New Construction Equity Before the 1-Year Builder Warranty Expires',
    metaTitle: '11-Month Builder Warranty Inspections | Foresight Atlanta',
    metaDescription: 'Independent 11-month builder warranty home inspections across Metro Atlanta. Two inspectors, FLIR thermal scans, and full punch lists before builder warranty expires.',
    description: 'Most new construction homes include a 1-year builder warranty covering materials and workmanship. Over the first year, homes settle, framing contracts, roof shingles experience storm cycles, and HVAC ductwork can detach. Our two-inspector team provides a comprehensive punch list backed by thermal imaging to submit directly to your builder.',
    included: [
      'Two certified inspectors on site for complete dual coverage',
      'FLIR thermal imaging to verify attic and wall insulation integrity',
      'Roof, flashing, attic truss, and structural movement verification',
      'Digital punch-list report with photos formatted for builder warranty submissions'
    ]
  },
  'str-short-term-rental-inspection': {
    name: 'Short-Term Rental (STR) Inspection',
    price: '$355',
    icon: '🏡',
    headline: 'Safety, Code Compliance & Due Diligence for Airbnb & STR Investments',
    metaTitle: 'Short-Term Rental Airbnb Inspections | Foresight Atlanta',
    metaDescription: 'Short-term rental (STR) safety, liability, and municipal compliance home inspections in Metro Atlanta for Airbnb & VRBO hosts. Flat $355.',
    description: 'Operating a short-term rental in Metro Atlanta requires strict adherence to life-safety codes, electrical load capacities, and guest protection standards. Foresight provides investor-focused inspections verifying smoke/CO alarms, egress paths, water heater capacity, HVAC performance, and structural reliability.',
    included: [
      'Life-safety audit (egress windows, smoke/CO interconnectivity, handrails)',
      'High-occupancy mechanical load capacity verification',
      'Thermal imaging of electrical panels and HVAC distribution',
      'Municipal STR compliance checklist support'
    ]
  },
  'home-buyer-inspection': {
    name: 'Standard Buyer & Seller Inspection',
    price: 'From $345',
    icon: '🏠',
    headline: 'Two Certified Inspectors on Every Home Inspection Across Metro Atlanta',
    metaTitle: 'Home Buyer & Seller Inspections | Foresight Atlanta',
    metaDescription: 'Premier home inspections led by a Certified Master Inspector®. Two inspectors on every job, FLIR thermal imaging, aerial drone scanning, and $10,000 warranty.',
    description: 'Every Foresight home inspection includes two certified inspectors on site led by Christopher Boykin, Certified Master Inspector® (CMI). We evaluate the entire structural, mechanical, electrical, plumbing, roof, and attic systems, delivering comprehensive reports within 24 hours backed by a $10,000 Elite Warranty.',
    included: [
      'Two certified inspectors on site for 2x thoroughness in half the time',
      'FLIR thermal imaging and moisture meter diagnostics included free',
      'Aerial camera drone roof scanning for high or steep roofs',
      '$10,000 Master Protection Warranty with $0 deductible included free',
      'Free Utilities Plus VIP utility setup concierge ($150 value)'
    ]
  }
};

function loadCities() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function generateStaticParams() {
  return Object.keys(SERVICE_MAP).map(service => ({ service }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const serviceData = SERVICE_MAP[resolvedParams.service];
  if (!serviceData) {
    return { title: 'Service Not Found | Foresight' };
  }
  return {
    title: serviceData.metaTitle,
    description: serviceData.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/services/${resolvedParams.service}`,
    },
    openGraph: {
      title: serviceData.metaTitle,
      description: serviceData.metaDescription,
      url: `${SITE_URL}/services/${resolvedParams.service}`,
      type: 'website',
    },
  };
}

export default async function ServiceHubPage({ params }) {
  const resolvedParams = await params;
  const serviceData = SERVICE_MAP[resolvedParams.service];
  if (!serviceData) {
    notFound();
  }

  const cities = loadCities();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceData.name,
    "description": serviceData.description,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "url": SITE_URL
    },
    "offers": {
      "@type": "Offer",
      "price": serviceData.price.replace(/[^0-9]/g, '') || "345",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Script
        id="service-hub-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', marginBottom: '1.25rem' }}>
            {serviceData.icon} Specialized Inspection Service
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {serviceData.name} in Metro Atlanta
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', lineHeight: 1.7, maxWidth: '750px', margin: '0 auto 2rem' }}>
            {serviceData.headline}. Flat-rate pricing starting at <strong style={{ color: 'var(--color-gold)' }}>{serviceData.price}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '0.9rem 2rem' }}>
              📅 Schedule {serviceData.name}
            </a>
            <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.9rem 2rem' }}>
              📊 Calculate Instant Fee
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFFFFF', padding: '4.5rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#0F172A', fontWeight: 800, marginBottom: '1rem' }}>
              Why Choose Foresight for {serviceData.name}?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {serviceData.description}
            </p>
            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-gold)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: 700, marginBottom: '1rem' }}>
                What&apos;s Included in Every Evaluation:
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {serviceData.included.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#334155', fontSize: '1rem' }}>
                    <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 87 City Silo Directory Grid */}
      <section className="section" style={{ background: '#F8FAFC', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.75rem' }}>
              {serviceData.name} Service Coverage by City
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
              Select your local municipality to view localized soil risks, local infrastructure notes, and dedicated scheduling options.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/services/${resolvedParams.service}/${city.slug}`}
                prefetch={false}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem 1.25rem',
                  border: '1px solid #E2E8F0',
                  textDecoration: 'none',
                  color: '#0F172A',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s, transform 0.2s'
                }}
              >
                <span>{city.name}</span>
                <span style={{ color: 'var(--color-red)', fontSize: '0.85rem' }}>&rarr;</span>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
            <GooglePreferredSource variant="card" />
          </div>
        </div>
      </section>
    </>
  );
}
