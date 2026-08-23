'use client';

export default function GooglePreferredSource({ variant = 'banner' }) {
  const googleSourceUrl = "https://www.google.com/preferences/source";

  if (variant === 'footer') {
    return (
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <a
          href={googleSourceUrl}
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

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderLeft: '4px solid #4285F4',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      marginTop: '2.5rem',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1.25rem'
    }}>
      <div style={{ flex: '1 1 300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
            Follow Foresight on Google Search &amp; Discover
          </strong>
        </div>
        <p style={{ margin: 0, fontSize: '0.925rem', color: '#475569', lineHeight: 1.5 }}>
          Add Foresight Home Inspections as your preferred Georgia real estate diagnostic source to see our latest property advisories and due diligence guides in your Google feed.
        </p>
      </div>

      <div>
        <a
          href={googleSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            background: '#4285F4',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            fontSize: '0.925rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            boxShadow: '0 2px 4px rgba(66, 133, 244, 0.3)'
          }}
        >
          ⭐ Add as Preferred Source &rarr;
        </a>
      </div>
    </div>
  );
}
