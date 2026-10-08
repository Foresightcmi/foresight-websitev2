import Link from 'next/link';

export const metadata = {
  title: 'Checkout Incomplete | Foresight Home Inspections',
  description: 'Your checkout was canceled. Contact Foresight Home Inspections for assistance.',
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <main style={{ backgroundColor: '#0B1120', color: '#F8FAFC', minHeight: '100vh', padding: '4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '580px', width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '2px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#EF4444', fontSize: '2rem' }}>
          ✕
        </div>

        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '9999px', fontSize: '0.75rem', color: '#F87171', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Payment Incomplete
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Your Checkout Was Not Completed
        </h1>

        <p style={{ fontSize: '0.95rem', color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
          No charges were made to your account. If you experienced an issue with payment, need to confirm whether your outside report qualifies, or have an urgent due diligence deadline, our team is standing by to help.
        </p>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
            📞 <strong>Direct Master Inspector Support:</strong><br />
            Call or text Christopher Boykin, CMI® at{' '}
            <a href="tel:6784802110" style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none' }}>
              (678) 480-2110
            </a>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/repair-credit-calculator"
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
            Try Again ($99 Audit)
          </Link>
          <Link
            href="/quote"
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
            Schedule Full Inspection
          </Link>
        </div>

      </div>
    </main>
  );
}
