import Link from 'next/link';
import GeoCityClientUpdater from './GeoCityClientUpdater';

export default function GeoTrustBanner() {
  return (
    <div
      role="banner"
      aria-label="Executive Announcement and Direct Dispatch Bar"
      style={{
        background: '#0B1120',
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
        color: '#F8FAFC',
        padding: '0.45rem 1rem',
        fontSize: '0.84rem',
        contain: 'layout style',
        position: 'relative',
        zIndex: 50,
        letterSpacing: '0.015em'
      }}
    >
      <GeoCityClientUpdater />
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.65rem',
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link
            id="geo-trust-city-pill"
            prefetch={false}
            href="/service-areas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              color: 'var(--color-gold)',
              padding: '0.2rem 0.65rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.04em'
            }}
          >
            <span>METRO ATLANTA &bull; 87+ CITIES &rarr;</span>
          </Link>

          <span style={{ color: '#E2E8F0', fontWeight: 500, fontSize: '0.82rem' }}>
            Two Certified Inspectors &bull; Up to $35K Combined Warranty &bull; Free $150 Utility Setup
          </span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#94A3B8', fontSize: '0.82rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 8px #22C55E' }}></span>
            <strong style={{ color: '#F1F5F9' }}>Online Booking 24/7</strong>
          </span>

          <span style={{ color: '#334155' }}>|</span>

          <a
            href="tel:678-480-2110"
            aria-label="Call Foresight Home Inspections directly at 678-480-2110"
            style={{
              color: 'var(--color-gold)',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              textDecoration: 'none'
            }}
          >
            678-480-2110
          </a>
        </div>
      </div>
    </div>
  );
}
