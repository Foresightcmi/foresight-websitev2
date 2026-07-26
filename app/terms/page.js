import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Foresight Home Inspections',
  description: 'Terms of Service for Foresight Home Inspections, LLC.',
};

export default function TermsOfService() {
  return (
    <section className="section" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Terms of Service</h1>
        <div className="cms-content" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-gray-dark)' }}>
          <p><strong>Last Updated: July 2026</strong></p>
          <p>
            Please read these Terms of Service ("Terms") carefully before using the www.fhinspectionsatl.com website or scheduling a home inspection with Foresight Home Inspections, LLC.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>1. Inspection Services & Standards of Practice</h2>
          <p>
            All home inspections performed by Foresight Home Inspections, LLC are conducted in accordance with the International Association of Certified Home Inspectors (InterNACHI) Standards of Practice. An inspection is a non-invasive, visual examination of the accessible areas of a residential property. It is not technically exhaustive and will not identify concealed or latent defects.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>2. Pre-Inspection Agreement</h2>
          <p>
            Prior to the commencement of any inspection services, the client must sign a formal Pre-Inspection Agreement. This agreement details the specific scope, limitations, and exclusions of the inspection. In the event of a conflict between these Terms of Service and the Pre-Inspection Agreement, the Pre-Inspection Agreement shall prevail.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>3. Payment Terms</h2>
          <p>
            Payment is due in full prior to or at the time of the inspection. The final inspection report will not be released to the client or their agents until full payment has been secured.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>4. Warranty Terms</h2>
          <p>
            The complimentary $10,000 Elite Master Inspection Warranty is provided by a third-party warranty partner. Coverage limits, durations (typically 90 days from closing or 120 days from inspection), and terms are subject to the specific policy documents provided upon completion of the inspection. Foresight Home Inspections, LLC is not the underwriter of this warranty.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Foresight Home Inspections, LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of our website or services.
          </p>
          <div style={{ marginTop: '3rem' }}>
            <Link href="/" className="btn btn-outline">Return to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
