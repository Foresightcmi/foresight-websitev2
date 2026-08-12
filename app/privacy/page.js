import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Foresight Home Inspections',
  description: 'Privacy Policy for Foresight Home Inspections, LLC in Atlanta, GA.',
  alternates: { canonical: 'https://www.fhinspectionsatl.com/privacy' },
};

export default function PrivacyPolicy() {
  return (
    <section className="section" style={{ padding: '6rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Privacy Policy</h1>
        <div className="cms-content" style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-gray-dark)' }}>
          <p><strong>Last Updated: July 2026</strong></p>
          <p>
            Foresight Home Inspections, LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (www.fhinspectionsatl.com) or use our home inspection services.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>1. Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services, such as:
          </p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Property addresses for inspection quotes and scheduling</li>
            <li>Billing information (processed securely through our payment processors)</li>
          </ul>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>2. How We Use Your Information</h2>
          <p>
            We use the information we collect primarily to:
          </p>
          <ul>
            <li>Schedule and perform home inspections</li>
            <li>Deliver inspection reports to you and authorized agents</li>
            <li>Respond to customer service requests</li>
            <li>Process transactions and send related information (invoices, receipts)</li>
          </ul>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
          </p>
          <p>
            With your explicit consent (such as when signing a pre-inspection agreement), we may share your inspection report with your real estate agent or the seller's agent to facilitate your real estate transaction.
          </p>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>4. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </p>
          <p>
            Foresight Home Inspections, LLC<br />
            Metro Atlanta, GA<br />
            Phone: 678-480-2110<br />
            Email: inspect@foresightcmi.com
          </p>
          <div style={{ marginTop: '3rem' }}>
            <Link href="/" className="btn btn-outline">Return to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
