'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CitySearch({ cities }) {
  const [query, setQuery] = useState('');

  const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const filtered = cities.filter(c =>
    c['City Name'].toLowerCase().includes(query.toLowerCase()) ||
    (c.County && c.County.toLowerCase().includes(query.toLowerCase())) ||
    (c.Zip && c.Zip.includes(query))
  );

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Search Input */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="🔍 Type your City or ZIP Code (e.g. Sandy Springs, Alpharetta, 30058, Fulton)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1.1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-gray-mid)',
            fontSize: '1.05rem',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-red)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-mid)'}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--color-gray)',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* City Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {filtered.slice(0, 40).map(c => (
          <Link
            key={c['City Name']}
            href={`/service-areas/${toSlug(c['City Name'])}`}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card"
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'white',
                border: '1px solid var(--color-gray-mid)',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--color-red)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--color-gray-mid)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <strong style={{ display: 'block', color: 'var(--color-dark)', fontSize: '1rem' }}>
                📍 {c['City Name']}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                {c.County} County {c.Zip ? `• ${c.Zip}` : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            We serve all 163+ cities across Metro Atlanta! If your city isn&apos;t listed above, we still cover your area.
          </p>
          <a href="tel:6784802110" className="btn btn-primary">
            📞 Call to Confirm Coverage: 678-480-2110
          </a>
        </div>
      )}
    </div>
  );
}
