'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Strict 50-Mile Metro Atlanta Service Footprint Cities
// Every entry corresponds directly to a verified pre-rendered static route at /service-areas/[slug]
const METRO_ATLANTA_50MILE_CITIES = {
  'acworth': { name: 'Acworth', slug: 'acworth' },
  'alpharetta': { name: 'Alpharetta', slug: 'alpharetta' },
  'atlanta': { name: 'Atlanta', slug: 'atlanta' },
  'austell': { name: 'Austell', slug: 'austell' },
  'avondale estates': { name: 'Avondale Estates', slug: 'avondale-estates' },
  'berkeley lake': { name: 'Berkeley Lake', slug: 'berkeley-lake' },
  'between': { name: 'Between', slug: 'between' },
  'brookhaven': { name: 'Brookhaven', slug: 'brookhaven' },
  'brooks': { name: 'Brooks', slug: 'brooks' },
  'buckhead': { name: 'Buckhead', slug: 'atlanta' },
  'buford': { name: 'Buford', slug: 'buford' },
  'canton': { name: 'Canton', slug: 'canton' },
  'carrollton': { name: 'Carrollton', slug: 'carrollton' },
  'cartersville': { name: 'Cartersville', slug: 'cartersville' },
  'chamblee': { name: 'Chamblee', slug: 'chamblee' },
  'chattahoochee hills': { name: 'Chattahoochee Hills', slug: 'chattahoochee-hills' },
  'clarkston': { name: 'Clarkston', slug: 'clarkston' },
  'college park': { name: 'College Park', slug: 'college-park' },
  'conyers': { name: 'Conyers', slug: 'conyers' },
  'covington': { name: 'Covington', slug: 'covington' },
  'cumming': { name: 'Cumming', slug: 'cumming' },
  'dacula': { name: 'Dacula', slug: 'dacula' },
  'dallas': { name: 'Dallas', slug: 'dallas' },
  'decatur': { name: 'Decatur', slug: 'decatur' },
  'doraville': { name: 'Doraville', slug: 'doraville' },
  'douglasville': { name: 'Douglasville', slug: 'douglasville' },
  'duluth': { name: 'Duluth', slug: 'duluth' },
  'dunwoody': { name: 'Dunwoody', slug: 'dunwoody' },
  'east point': { name: 'East Point', slug: 'east-point' },
  'fairburn': { name: 'Fairburn', slug: 'fairburn' },
  'fayetteville': { name: 'Fayetteville', slug: 'fayetteville' },
  'forest park': { name: 'Forest Park', slug: 'forest-park' },
  'gainesville': { name: 'Gainesville', slug: 'gainesville' },
  'good hope': { name: 'Good Hope', slug: 'good-hope' },
  'grantville': { name: 'Grantville', slug: 'grantville' },
  'grayson': { name: 'Grayson', slug: 'grayson' },
  'griffin': { name: 'Griffin', slug: 'griffin' },
  'hampton': { name: 'Hampton', slug: 'hampton' },
  'hapeville': { name: 'Hapeville', slug: 'hapeville' },
  'haralson': { name: 'Haralson', slug: 'haralson' },
  'jersey': { name: 'Jersey', slug: 'jersey' },
  'johns creek': { name: 'Johns Creek', slug: 'johns-creek' },
  'jonesboro': { name: 'Jonesboro', slug: 'jonesboro' },
  'kennesaw': { name: 'Kennesaw', slug: 'kennesaw' },
  'lawrenceville': { name: 'Lawrenceville', slug: 'lawrenceville' },
  'lilburn': { name: 'Lilburn', slug: 'lilburn' },
  'lithonia': { name: 'Lithonia', slug: 'lithonia' },
  'locust grove': { name: 'Locust Grove', slug: 'locust-grove' },
  'loganville': { name: 'Loganville', slug: 'loganville' },
  'mansfield': { name: 'Mansfield', slug: 'mansfield' },
  'marietta': { name: 'Marietta', slug: 'marietta' },
  'mcdonough': { name: 'McDonough', slug: 'mcdonough' },
  'midtown': { name: 'Midtown', slug: 'atlanta' },
  'milton': { name: 'Milton', slug: 'milton' },
  'monroe': { name: 'Monroe', slug: 'monroe' },
  'moreland': { name: 'Moreland', slug: 'moreland' },
  'morrow': { name: 'Morrow', slug: 'morrow' },
  'mountain park': { name: 'Mountain Park', slug: 'mountain-park' },
  'newborn': { name: 'Newborn', slug: 'newborn' },
  'newnan': { name: 'Newnan', slug: 'newnan' },
  'norcross': { name: 'Norcross', slug: 'norcross' },
  'oxford': { name: 'Oxford', slug: 'oxford' },
  'palmetto': { name: 'Palmetto', slug: 'palmetto' },
  'peachtree city': { name: 'Peachtree City', slug: 'peachtree-city' },
  'peachtree corners': { name: 'Peachtree Corners', slug: 'peachtree-corners' },
  'pine lake': { name: 'Pine Lake', slug: 'pine-lake' },
  'porterdale': { name: 'Porterdale', slug: 'porterdale' },
  'powder springs': { name: 'Powder Springs', slug: 'powder-springs' },
  'redan': { name: 'Redan', slug: 'redan' },
  'roswell': { name: 'Roswell', slug: 'roswell' },
  'sandy springs': { name: 'Sandy Springs', slug: 'sandy-springs' },
  'senoia': { name: 'Senoia', slug: 'senoia' },
  'sharpsburg': { name: 'Sharpsburg', slug: 'sharpsburg' },
  'smyrna': { name: 'Smyrna', slug: 'smyrna' },
  'snellville': { name: 'Snellville', slug: 'snellville' },
  'south fulton': { name: 'South Fulton', slug: 'south-fulton' },
  'stockbridge': { name: 'Stockbridge', slug: 'stockbridge' },
  'stone mountain': { name: 'Stone Mountain', slug: 'stone-mountain' },
  'stonecrest': { name: 'Stonecrest', slug: 'stonecrest' },
  'sugar hill': { name: 'Sugar Hill', slug: 'sugar-hill' },
  'suwanee': { name: 'Suwanee', slug: 'suwanee' },
  'tucker': { name: 'Tucker', slug: 'tucker' },
  'turin': { name: 'Turin', slug: 'turin' },
  'tyrone': { name: 'Tyrone', slug: 'tyrone' },
  'union city': { name: 'Union City', slug: 'union-city' },
  'vinings': { name: 'Vinings', slug: 'smyrna' },
  'walnut grove': { name: 'Walnut Grove', slug: 'walnut-grove' },
  'winder': { name: 'Winder', slug: 'winder' },
  'woodstock': { name: 'Woodstock', slug: 'woodstock' },
  'woolsey': { name: 'Woolsey', slug: 'woolsey' }
};

export default function GeoTrustBanner() {
  const [geoCity, setGeoCity] = useState(null);

  useEffect(() => {
    // Check sessionStorage cache first to avoid redundant API hits during multi-page browsing
    try {
      const cached = sessionStorage.getItem('foresight_geo_city');
      if (cached) {
        setGeoCity(JSON.parse(cached));
        return;
      }
    } catch {}

    // Fast non-blocking internal edge geolocation without third-party rate limits
    const fetchLocation = async () => {
      try {
        const res = await fetch('/api/geo');
        if (res.ok) {
          const data = await res.json();
          // STRICT 50-MILE SERVICE RADIUS ENFORCEMENT:
          // 1. Visitor MUST be in Georgia (data.region === 'GA')
          // 2. City MUST match our verified 87-municipality footprint in Metro Atlanta
          // Never synthesize links for out-of-state locations like New York or unverified cities.
          if (data && data.region === 'GA' && data.city) {
            const rawCity = data.city.toLowerCase().replace(/%20/g, ' ').replace(/-/g, ' ').trim();
            const matched = METRO_ATLANTA_50MILE_CITIES[rawCity];
            if (matched) {
              setGeoCity(matched);
              try {
                sessionStorage.setItem('foresight_geo_city', JSON.stringify(matched));
              } catch {}
              return;
            }
          }
          // Out-of-state visitors (e.g. New York, California) or locations outside our 50-mile radius
          // will strictly receive the default 50-mile Metro Atlanta coverage banner.
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
        {/* Left: Dynamic Geo Footprint Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {geoCity ? (
            <Link
              href={`/service-areas/${geoCity.slug}`}
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
              <span>ACTIVE IN {geoCity.name.toUpperCase()}, GA &rarr;</span>
            </Link>
          ) : (
            <Link
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
          )}

          <span style={{ color: '#E2E8F0', fontWeight: 500, fontSize: '0.82rem' }}>
            Two Certified Inspectors &bull; Up to $35K Combined Warranty &bull; Free $150 Utility Setup
          </span>
        </div>

        {/* Right: Direct Dispatch & 24/7 Booking Hook */}
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
