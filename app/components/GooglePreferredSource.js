'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function GooglePreferredSource({ 
  variant = 'banner',
  customTitle,
  customText
}) {
  const googleDeeplinkUrl = "https://google.com/preferences/source?q=fhinspectionsatl.com";
  const preferredSourceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || [];
      window.PREFERRED_SOURCE.push(function(preferredSource) {
        try {
          preferredSource.init({ theme: 'light', lang: 'en' });
          preferredSourceRef.current = preferredSource;
        } catch {
          // Fallback gracefully
        }
      });
    }
  }, []);

  const handleActionClick = (e) => {
    if (preferredSourceRef.current && typeof preferredSourceRef.current.addPreferredSource === 'function') {
      try {
        e.preventDefault();
        preferredSourceRef.current.addPreferredSource();
      } catch {
        // Fallback to opening Google preferences link
      }
    }
  };

  if (variant === 'footer') {
    return (
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <a
          href={googleDeeplinkUrl}
          onClick={handleActionClick}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          Add Foresight as Preferred Source on Google
        </a>
      </div>
    );
  }

  // Standalone isolated placement (Paul James High-Conversion Video Strategy)
  // "Do not put the preferred sources button near other trust signals. Put it alone. One ask, one action."
  return (
    <>
      <Script 
        src="https://news.google.com/swg/js/v1/publisher.js" 
        strategy="lazyOnload" 
      />
      <div 
        className="google-preferred-source-box"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          border: '1px solid #cbd5e1',
          borderLeft: '5px solid #4285F4',
          borderRadius: '12px',
          padding: '1.75rem 2rem',
          margin: '2.5rem 0',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
            {customTitle || 'Prefer Foresight in Your Google AI Search Results'}
          </span>
        </div>

        <p style={{
          color: '#334155',
          fontSize: '1rem',
          lineHeight: 1.6,
          margin: '0 0 1.25rem 0',
          maxWidth: '780px'
        }}>
          {customText || (
            <>
              Click below to make Foresight Home Inspections a preferred source in your <strong>Google AI search results</strong>. You will see our certified home inspection guides and due diligence advisories prioritized whenever you search for property diagnostics, contract rights, or Atlanta real estate topics.
            </>
          )}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Google official interactive embed container */}
          <div google-add-preferred-source-btn="" data-theme="light"></div>

          {/* Direct 1-click fallback linking to Google Source Preferences */}
          <a
            href={googleDeeplinkUrl}
            onClick={handleActionClick}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#1a73e8',
              color: '#ffffff',
              padding: '0.75rem 1.4rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(26, 115, 232, 0.3)',
              transition: 'background-color 0.2s ease, transform 0.1s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2zm-6-5c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z"/>
            </svg>
            Follow on Google Search &amp; AI
          </a>
        </div>
      </div>
    </>
  );
}

