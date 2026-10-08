import Link from 'next/link';

export const metadata = {
  title: 'Order Confirmed | Foresight Home Inspections Atlanta',
  description: 'Your payment has been received. Our Certified Master Inspector team is processing your report audit.',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main style={{ backgroundColor: '#0B1120', color: '#F8FAFC', minHeight: '100vh', padding: '4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '640px', width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        {/* Animated Checkmark Circle */}
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10B981', fontSize: '2rem' }}>
          ✓
        </div>

        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '9999px', fontSize: '0.75rem', color: '#34D399', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Payment Confirmed • $99 Due Diligence Audit
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Your Due Diligence Audit Is Underway
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 2rem' }}>
          Thank you for choosing Foresight Home Inspections. Our Certified Master Inspector® (CMI) team has received your order and is cross-referencing your defect findings against <strong>RSMeans 2026 Metro Atlanta contractor pricing indices</strong>.
        </p>

        {/* 4-Step Process Timeline */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '0.85rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1rem', fontWeight: 800 }}>
            What Happens Next (Guaranteed 4-Hour Window):
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#94A3B8' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>1.</span>
              <span><strong>Diagnostic Defect Extraction:</strong> We isolate safety hazards, mechanical failures, and major structural concerns.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>2.</span>
              <span><strong>Trade Labor Pricing:</strong> Applied Atlanta licensed trade rates ($95–$165/hr) and materials allowances.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>3.</span>
              <span><strong>GAR Form F404 Exhibit Creation:</strong> Clean amendment language formatted for your Realtor and closing attorney.</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>4.</span>
              <span><strong>Email &amp; SMS Delivery:</strong> Complete PDF audit package delivered straight to your inbox within 4 hours.</span>
            </div>
          </div>
        </div>

        {/* Urgent Questions */}
        <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '2rem' }}>
          Need to attach additional photos, disclosures, or have an immediate contingency deadline?<br />
          Call or text Christopher Boykin, CMI® directly at{' '}
          <a href="tel:6784802110" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>
            (678) 480-2110
          </a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B89628 100%)',
              color: '#0F172A',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            Return to Homepage
          </Link>
          <Link
            href="/repair-credit-calculator"
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            Back to Calculator
          </Link>
        </div>

      </div>
    </main>
  );
}
