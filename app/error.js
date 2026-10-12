'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: 'var(--color-gray-light)'
    }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: 'var(--color-dark)', 
        fontFamily: 'var(--font-heading)',
        marginBottom: '1rem' 
      }}>
        Something Went Wrong
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--color-gray-dark)', 
        maxWidth: '500px', 
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        We encountered an unexpected error. Please try again or contact us if the issue persists.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => reset()}
          className="btn btn-gold"
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: 'var(--color-gold)', 
            color: 'var(--color-dark)', 
            border: 'none',
            fontWeight: 'bold', 
            borderRadius: 'var(--radius-md)', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Try Again
        </button>
        <Link 
          href="/" 
          className="btn btn-outline"
          style={{ 
            padding: '1rem 2rem', 
            border: '2px solid var(--color-dark)', 
            color: 'var(--color-dark)', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            borderRadius: 'var(--radius-md)', 
            display: 'inline-block'
          }}
        >
          Return Home
        </Link>
      </div>

      <div style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}>
        Or call us directly: <strong>678-480-2110</strong>
      </div>
    </div>
  );
}
