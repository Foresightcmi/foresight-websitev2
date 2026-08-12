import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Leave a Review | Foresight Home Inspections Atlanta',
  description: 'Share your home inspection experience with Foresight Home Inspections. Your feedback helps Metro Atlanta homebuyers find a trusted, thorough inspection team.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/review',
  },
  openGraph: {
    title: 'Leave a Review | Foresight Home Inspections Atlanta',
    description: 'Share your home inspection experience with Foresight Home Inspections in Metro Atlanta.',
    url: 'https://www.fhinspectionsatl.com/review',
  },
};

export default function ReviewPage() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg, 1rem)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
          border: '1px solid #E2E8F0',
        }}
      >
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/images/Logopng.png"
            alt="Foresight Home Inspections Logo"
            width={180}
            height={60}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <h1
          style={{
            color: 'var(--color-slate-dark, #0F172A)',
            fontFamily: 'var(--font-heading)',
            fontSize: '2.25rem',
            fontWeight: 800,
            marginBottom: '1.25rem',
            lineHeight: 1.2,
          }}
        >
          Thank You for Choosing Foresight!
        </h1>

        <p
          style={{
            color: 'var(--color-gray-dark, #334155)',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          We value your feedback! Your review helps other homebuyers in Metro Atlanta find a trusted, thorough inspection team.
        </p>

        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="https://search.google.com/local/writereview?placeid=ChIJk_3KQe0H9YgRw8vLCvROjpY"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-gold, #D4AF37)',
              color: 'var(--color-slate-dark, #0F172A)',
              fontSize: '1.2rem',
              fontWeight: 700,
              padding: '1rem 2rem',
              borderRadius: 'var(--radius-md, 0.5rem)',
              textDecoration: 'none',
              boxShadow: '0 4px 14px 0 rgba(212, 175, 55, 0.4)',
              transition: 'all 0.2s ease-in-out',
              width: '100%',
              maxWidth: '360px',
            }}
          >
            ⭐ Leave a Google Review
          </Link>
        </div>

        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '2rem',
            marginTop: '2rem',
          }}
        >
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-gray, #64748B)',
              marginBottom: '0.75rem',
              fontWeight: 500,
            }}
          >
            Or share your experience on:
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="https://www.homegauge.com/inspector/foresight-home-inspections"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-slate-dark, #0F172A)',
                backgroundColor: 'var(--color-gray-light, #F8FAFC)',
                border: '1px solid #CBD5E1',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md, 0.5rem)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              HomeGauge
            </Link>
            <Link
              href="https://www.yelp.com/biz/foresight-home-inspections-lithonia"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-slate-dark, #0F172A)',
                backgroundColor: 'var(--color-gray-light, #F8FAFC)',
                border: '1px solid #CBD5E1',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md, 0.5rem)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Yelp
            </Link>
          </div>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-gray, #64748B)',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Your honest feedback helps us improve and helps other Atlanta homebuyers make informed decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
