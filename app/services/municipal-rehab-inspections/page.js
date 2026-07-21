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
    description: 'Third-party milestone and pre/post-rehab compliance audits for municipal agencies, housing authorities, and affordable housing developers.',
    url: 'https://www.fhinspectionsatl.com/services/municipal-rehab-inspections',
    type: 'website',
  },
};

export default function MunicipalRehabInspections() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Municipal & Pre-Rehab Compliance Property Inspections",
    "serviceType": "Property Rehabilitation Audit",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "+1-678-480-2110",
      "email": "inspect@foresightcmi.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1816 South Deshon Road",
        "addressLocality": "Lithonia",
        "addressRegion": "GA",
        "postalCode": "30058"
      }
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "DeKalb County & Metro Atlanta"
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
            Providing independent third-party property audits, pre-rehab scope assessments, and post-rehab contractor compliance sign-offs for municipal programs, housing authorities, and non-profit development partners across DeKalb County and Metro Atlanta.
          </p>
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
                <a href="tel:678-480-2110" className="btn btn-primary">📞 Call Direct: 678-480-2110</a>
                <Link href="/contact" className="btn btn-outline">✉️ Request B2G Proposal</Link>
              </div>
            </div>
            <div className="card card-premium" style={{ padding: '2.5rem', borderTop: '5px solid var(--color-red)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Municipal Core Capabilities</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Pre-Rehab Baseline Audits:</strong> Documenting existing structural, electrical, roof, and plumbing defects to establish accurate scope of work.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>Post-Rehab Verification:</strong> Conducting final walkthrough sign-offs to verify general contractor compliance before fund release.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>DeKalb Low-Flow Plumbing Certificates:</strong> Official plumbing compliance audits for DeKalb County property transactions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                  <span><strong>FLIR Thermal & Moisture Diagnostics:</strong> Thermal scanning for active leaks, insulation voids, and electrical fire risks.</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ background: 'var(--color-white)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <h2>Need a Certified Master Inspector for Municipal Bids?</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '650px', margin: '1rem auto 2rem', fontSize: '1.05rem' }}>
              We carry full professional E&O and general liability insurance, SUPRA lockbox access, and certified CMI credentials.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/blog/pre-rehab-post-rehab-inspections-dekalb" className="btn btn-outline">
                📖 Read Pre/Post-Rehab Guide
              </Link>
              <Link href="/service-areas/dekalb-county-compliance" className="btn btn-primary">
                🏛️ DeKalb Compliance Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
