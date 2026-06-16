import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Foresight Home Inspections',
  description: 'The page you are looking for could not be found. Navigate back to Foresight Home Inspections to explore our services, service areas, blog, and more.',
};

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--color-gray-light)' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--color-red)', lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          404
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-dark)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
          Don&rsquo;t worry &mdash; let&rsquo;s get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <Link href="/" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
            Go Home
          </Link>
          <Link href="/quote" className="btn btn-outline" style={{ padding: '0.875rem 2rem' }}>
            Get a Quote
          </Link>
        </div>

        <div className="card" style={{ textAlign: 'left', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--color-dark)' }}>
            Helpful Links
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-dark)', fontWeight: 500, fontSize: '0.975rem' }}>
              <span style={{ color: 'var(--color-red)' }}>→</span> Home
            </Link>
            <Link href="/services" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-dark)', fontWeight: 500, fontSize: '0.975rem' }}>
              <span style={{ color: 'var(--color-red)' }}>→</span> Services &amp; Pricing
            </Link>
            <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-dark)', fontWeight: 500, fontSize: '0.975rem' }}>
              <span style={{ color: 'var(--color-red)' }}>→</span> Blog &amp; Guides
            </Link>
            <Link href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-dark)', fontWeight: 500, fontSize: '0.975rem' }}>
              <span style={{ color: 'var(--color-red)' }}>→</span> Contact Us
            </Link>
            <Link href="/service-areas" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-dark)', fontWeight: 500, fontSize: '0.975rem' }}>
              <span style={{ color: 'var(--color-red)' }}>→</span> Service Areas
            </Link>
            <Link href="/quote" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-dark)', fontWeight: 500, fontSize: '0.975rem' }}>
              <span style={{ color: 'var(--color-red)' }}>→</span> Instant Quote
            </Link>
          </div>
        </div>

        <p style={{ marginTop: '2rem', color: 'var(--color-gray)', fontSize: '0.9rem' }}>
          Need help? Call us at{' '}
          <a href="tel:+16784802110" style={{ color: 'var(--color-red)', fontWeight: 600 }}>678-480-2110</a>{' '}
          or email{' '}
          <a href="mailto:inspect@foresightcmi.com" style={{ color: 'var(--color-red)', fontWeight: 600 }}>inspect@foresightcmi.com</a>
        </p>
      </div>
    </section>
  );
}
