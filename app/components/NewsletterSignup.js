'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, source: 'newsletter_checklist' }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
      setStatus('error');
    }
  };

  return (
    <section className="section" style={{ 
      width: '100%', 
      background: 'linear-gradient(135deg, #0F172A, #1E293B)', 
      padding: '5rem 1rem',
      color: '#FFFFFF'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
          Free Atlanta Home Buyer Inspection Checklist
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
          Get our comprehensive 25-point checklist that Metro Atlanta homebuyers use to protect their investment, plus an instant $25 First-Time Buyer Inspection Voucher.
        </p>

        {status === 'success' ? (
          <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-gold)', textAlign: 'left' }}>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              ✓ Instant Access Unlocked + $25 Buyer Voucher
            </div>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.45rem', marginBottom: '0.5rem', fontWeight: 800 }}>
              Your 25-Point Atlanta Buyer Checklist Is Ready!
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Open and print your interactive Certified Master Inspector field checklist now, or apply your complimentary <strong>$25 First-Time Buyer Voucher</strong> directly inside our 30-second fee calculator (homes starting at $345, condos at $295).
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <a
                href="/dossiers/atlanta-buyer-inspection-checklist.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'var(--color-gold)',
                  color: 'var(--color-dark)',
                  padding: '0.85rem 1.35rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                📄 Open &amp; Print 25-Point Checklist &rarr;
              </a>
              <a
                href="/quote?discount=first-time"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                Claim $25 Off Instant Quote &rarr;
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            <input 
              type="text" 
              id="newsletter-name"
              name="name"
              placeholder="Your Name" 
              aria-label="Your Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: 'var(--radius-md)', 
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            <input 
              type="email" 
              id="newsletter-email"
              name="email"
              placeholder="Your Email Address" 
              aria-label="Your Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: 'var(--radius-md)', 
                color: '#FFFFFF',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                backgroundColor: 'var(--color-gold)', 
                color: 'var(--color-dark)', 
                border: 'none', 
                borderRadius: 'var(--radius-md)',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              {status === 'loading' ? 'Unlocking Checklist...' : 'Get My Free Checklist + $25 Voucher'}
            </button>
            {status === 'error' && (
              <p style={{ color: '#FCA5A5', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Oops! Something went wrong. Please try again.
              </p>
            )}
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
              Instant access in browser + printable PDF. Zero spam.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
