import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Municipal & Pre-Rehab Property Inspections Atlanta | DeKalb County Housing Bond Partner',
  description: 'Certified Master Inspector-led municipal, pre-rehab, and post-rehab compliance inspections in Metro Atlanta. Supporting DeKalb County $155M Housing Bond projects and B2G contractor compliance.',
  keywords: ['pre rehab inspection Atlanta', 'post rehab compliance inspection DeKalb', 'municipal property inspector Georgia', 'housing bond inspection partner', 'government contractor home inspector Lithonia'],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/services/municipal-rehab-inspections',
  },
  openGraph: {
    title: 'Municipal & Pre-Rehab Property Inspections | Foresight Atlanta',
    description: 'Third-party milestone and pre/post-rehab compliance Inspections for municipal agencies, housing authorities, and affordable housing developers.',
    url: 'https://www.fhinspectionsatl.com/services/municipal-rehab-inspections',
    type: 'website',
  },
};

export default function MunicipalRehabInspections() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Municipal & Pre-Rehab Compliance Property Inspections",
    "serviceType": "Property Rehabilitation Evaluation",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "image": "https://www.fhinspectionsatl.com/images/Logopng.png",
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com",
      "priceRange": "$$$",
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
      "@type": "AdministrativeArea",
      "name": "DeKalb County & Metro Atlanta"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#aeo-direct-answer", "h1"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <section className="section bg-dark text-white text-center" style={{ padding: '5.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ marginBottom: '1rem' }}>DeKalb Housing Bond & B2G Solutions</span>
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Municipal & Pre-Rehab Property Inspections</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
            Providing independent third-party property evaluations, pre-rehab scope assessments, and post-rehab contractor compliance sign-offs for municipal programs, housing authorities, and non-profit development partners across DeKalb County and Metro Atlanta.
          </p>
        </div>
      </section>

      <section className="section bg-white" style={{ padding: '2.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid var(--color-red)', borderRadius: '10px', padding: '1.75rem 2rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: '0.6rem' }}>
              Who provides certified pre-rehab and post-rehab municipal property inspections in DeKalb County and Metro Atlanta?
            </h2>
            <p id="aeo-direct-answer" style={{ margin: 0, color: 'var(--color-gray-dark)', lineHeight: 1.7 }}>
              Foresight Home Inspections (CMI #MICB-1082, InterNACHI #NACHI18051119) performs independent third-party pre-rehab baseline assessments, milestone progress inspections, and post-rehab final draw sign-offs across DeKalb County and 20 Metro Atlanta counties (Call (678) 480-2110 for Quote).
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <span className="badge" style={{ marginBottom: '1rem' }}>Unbiased Public Investment Protection</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Supporting DeKalb County&apos;s $155M Housing Investment Bond</h2>
              <p style={{ color: 'var(--color-gray-dark)', lineHeight: 1.7, marginBottom: '1rem' }}>
                With public funds flowing into owner-occupied rehabilitation and affordable housing preservation, municipal agencies and developers need objective inspection partners. Foresight Home Inspections delivers thorough pre-rehab evaluations to document structural, mechanical, and safety hazards before funds are allocated.
              </p>
              <p style={{ color: 'var(--color-gray-dark)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Led by Certified Master Inspector Christopher Boykin, our dual-inspector teams verify that general contractor repairs comply with safety standards before final draw releases.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="tel:678-480-2110" className="btn btn-primary">Call Direct: 678-480-2110</a>
                <Link href="/contact" className="btn btn-outline">Request B2G Proposal</Link>
              </div>
            </div>
            <div className="card card-premium" style={{ padding: '2.5rem', borderTop: '5px solid var(--color-red)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Municipal Core Capabilities</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Pre-Rehab Baseline Evaluations:</strong> Documenting existing structural, electrical, roof, and plumbing defects to establish accurate scope of work.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Post-Rehab Verification:</strong> Conducting final walkthrough sign-offs to verify general contractor compliance before fund release.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>DeKalb Low-Flow Plumbing Certificates:</strong> Official plumbing compliance Inspections for DeKalb County property transactions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>infrared thermal & Moisture Diagnostics:</strong> Thermal scanning for active leaks, insulation voids, and electrical fire risks.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card" style={{ padding: '2.25rem', marginBottom: '3rem', background: 'var(--color-white)' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Four-Stage Municipal &amp; Grant Rehabilitation Workflow</h2>
            <p style={{ color: 'var(--color-gray-dark)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Publicly funded owner-occupied rehabilitation grants, CDBG and HOME program allocations, land-bank dispositions, and non-profit affordable housing renovations require objective field documentation at every construction milestone so agency administrators protect taxpayer capital and resident safety:
            </p>
            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', marginBottom: '0.35rem' }}>1. Pre-Rehab Scope &amp; Hazard Baseline</strong>
                <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                  Two certified inspectors evaluate roof life, structural framing, electrical panels, supply and drain plumbing, HVAC equipment, crawlspace moisture, and life-safety egress to establish a photo-verified scope of work before contractor bidding.
                </p>
              </div>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', marginBottom: '0.35rem' }}>2. Rough-In &amp; Open-Wall Milestone Review</strong>
                <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                  Mid-project verification of structural repairs, flashing details, PEX or copper re-piping, ductwork, and electrical branch circuits prior to insulation and drywall concealment.
                </p>
              </div>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', marginBottom: '0.35rem' }}>3. Calibrated Infrared Thermal &amp; Drone Verification</strong>
                <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                  Non-invasive calibrated infrared thermal camera imaging and 4K aerial drone roof scans confirm envelope water-tightness, insulation continuity, and proper HVAC temperature splits.
                </p>
              </div>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', marginBottom: '0.35rem' }}>4. Post-Rehab Final Draw &amp; Unincorporated DeKalb Low-Flow Sign-Off</strong>
                <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--color-gray-dark)', lineHeight: 1.6 }}>
                  Same-day interactive digital report confirming punch-list completion before final retainage release, plus official Low-Flow Plumbing Certificate verification where required in unincorporated DeKalb County.
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--color-white)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <h2>Need a Certified Master Inspector for Municipal Bids?</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '650px', margin: '1rem auto 2rem', fontSize: '1.05rem' }}>
              We carry full professional E&O and general liability insurance, SUPRA lockbox access, and certified CMI credentials.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/blog/pre-rehab-post-rehab-inspections-dekalb" className="btn btn-outline">
                Read Pre/Post-Rehab Guide
              </Link>
              <Link href="/service-areas/dekalb-county-compliance" className="btn btn-primary">
                DeKalb Compliance Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
