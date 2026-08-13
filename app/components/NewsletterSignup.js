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
    <section style={{ 
      width: '100%', 
      background: 'linear-gradient(135deg, #0F172A, #1E293B)', 
      padding: '5rem 1rem',
      color: '#FFFFFF'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
          📋 Free Atlanta Home Buyer Inspection Checklist
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
          Get our comprehensive 25-point checklist that Metro Atlanta homebuyers use to protect their investment. Delivered straight to your inbox.
        </p>

        {status === 'success' ? (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅ Check your inbox!</h3>
            <p>Your checklist is on the way.</p>
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
              {status === 'loading' ? 'Sending...' : 'Get My Free Checklist'}
            </button>
            {status === 'error' && (
              <p style={{ color: '#FCA5A5', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Oops! Something went wrong. Please try again.
              </p>
            )}
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
