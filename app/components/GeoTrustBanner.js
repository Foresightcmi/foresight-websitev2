'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// List of supported Metro Atlanta cities and their slugs
const ATLANTA_CITIES = {
  'alpharetta': { name: 'Alpharetta', slug: 'alpharetta' },
  'atlanta': { name: 'Atlanta', slug: 'atlanta' },
  'brookhaven': { name: 'Brookhaven', slug: 'brookhaven' },
  'buckhead': { name: 'Buckhead', slug: 'atlanta' },
  'buford': { name: 'Buford', slug: 'buford' },
  'canton': { name: 'Canton', slug: 'canton' },
  'chamblee': { name: 'Chamblee', slug: 'chamblee' },
  'cumming': { name: 'Cumming', slug: 'cumming' },
  'decatur': { name: 'Decatur', slug: 'decatur' },
  'douglasville': { name: 'Douglasville', slug: 'douglasville' },
  'duluth': { name: 'Duluth', slug: 'duluth' },
  'dunwoody': { name: 'Dunwoody', slug: 'dunwoody' },
  'east point': { name: 'East Point', slug: 'east-point' },
  'fayetteville': { name: 'Fayetteville', slug: 'fayetteville' },
  'johns creek': { name: 'Johns Creek', slug: 'johns-creek' },
  'kennesaw': { name: 'Kennesaw', slug: 'kennesaw' },
  'lawrenceville': { name: 'Lawrenceville', slug: 'lawrenceville' },
  'lithonia': { name: 'Lithonia', slug: 'lithonia' },
  'marietta': { name: 'Marietta', slug: 'marietta' },
  'mcdonough': { name: 'McDonough', slug: 'mcdonough' },
  'milton': { name: 'Milton', slug: 'milton' },
  'norcross': { name: 'Norcross', slug: 'norcross' },
  'peachtree city': { name: 'Peachtree City', slug: 'peachtree-city' },
  'peachtree corners': { name: 'Peachtree Corners', slug: 'peachtree-corners' },
  'roswell': { name: 'Roswell', slug: 'roswell' },
  'sandy springs': { name: 'Sandy Springs', slug: 'sandy-springs' },
  'smyrna': { name: 'Smyrna', slug: 'smyrna' },
  'snellville': { name: 'Snellville', slug: 'snellville' },
  'stockbridge': { name: 'Stockbridge', slug: 'stockbridge' },
  'stone mountain': { name: 'Stone Mountain', slug: 'stone-mountain' },
  'suwanee': { name: 'Suwanee', slug: 'suwanee' },
  'tucker': { name: 'Tucker', slug: 'tucker' },
  'woodstock': { name: 'Woodstock', slug: 'woodstock' }
};

export default function GeoTrustBanner() {
  const [geoCity, setGeoCity] = useState(null);

  useEffect(() => {
    // Fast non-blocking internal edge geolocation without third-party rate limits
    const fetchLocation = async () => {
      try {
        const res = await fetch('/api/geo');
        if (res.ok) {
          const data = await res.json();
          if (data && (data.region === 'GA' || data.country === 'US') && data.city) {
            const rawCity = data.city.toLowerCase().trim();
            const matched = ATLANTA_CITIES[rawCity];
            if (matched) {
              setGeoCity(matched);
              return;
            }
            // If in Georgia/Metro Atlanta, format slug
            setGeoCity({
              name: data.city,
              slug: rawCity.replace(/[^a-z0-9]+/g, '-')
            });
          }
        }
      } catch {
        // Fallback gracefully without error
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(function() { setTimeout(fetchLocation, 3000); });
    } else {
      setTimeout(fetchLocation, 4000);
    }
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
      borderBottom: '1px solid rgba(211, 47, 47, 0.4)',
      color: '#ffffff',
      padding: '0.65rem 1rem',
      minHeight: '44px',
      contain: 'layout style',
      fontSize: '0.9rem',
      textAlign: 'center',
      position: 'relative',
      zIndex: 40
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        {geoCity ? (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#f8fafc' }}>
              <span style={{ color: 'var(--color-red-light)' }}>📍</span>
              Active Inspectors Serving <strong style={{ color: 'var(--color-gold)' }}>{geoCity.name}, GA</strong> & Surrounding Communities
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.25rem' }}>|</span>
            <span style={{ color: '#94a3b8' }}>Guaranteed 48-Hour Scheduling & $10K Warranty</span>
            <Link
              href={`/service-areas/${geoCity.slug}`}
              style={{
                marginLeft: '0.5rem',
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              View {geoCity.name} Coverage &rarr;
            </Link>
          </>
        ) : (
          <>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#f8fafc' }}>
              <span style={{ color: 'var(--color-red-light)' }}>📍</span>
              Metro Atlanta's Premier Two-Inspector Team
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.25rem' }}>|</span>
            <span style={{ color: '#94a3b8' }}>Serving 163+ Cities with 48-Hour Guaranteed Scheduling</span>
            <Link
              href="/service-areas"
              style={{
                marginLeft: '0.5rem',
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              Explore Service Areas &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
