import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// GSC Leak Hunter Priority Strike-Zone Cities (Positions 3.5–18.2 with Highest Impressions)
const LEAK_HUNTER_PRIORITY_SLUGS = [
  'atlanta',
  'acworth',
  'woodstock',
  'cumming',
  'lilburn',
  'snellville',
  'norcross',
  'dallas',
  'austell',
  'fairburn',
  'powder-springs',
  'johns-creek',
  'buford',
  'stone-mountain',
  'alpharetta',
  'marietta',
  'peachtree-corners',
  'chattahoochee-hills'
];

export default function RelatedServiceAreas({ currentCitySlug, serviceSlug }) {
  let cities = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'cities.json');
    cities = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error loading cities for RelatedServiceAreas', err);
    return null;
  }

  const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const currentIndex = Math.max(0, cities.findIndex((c) => toSlug(c['City Name']) === currentCitySlug));
  const currentCity = cities[currentIndex] || null;
  const curLat = parseFloat(currentCity?.Latitude) || 33.7490;
  const curLng = parseFloat(currentCity?.Longitude) || -84.3880;
  const curCounty = currentCity?.County || '';

  const toRad = (deg) => (deg * Math.PI) / 180;
  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const filteredCities = cities.filter((c) => toSlug(c['City Name']) !== currentCitySlug);

  // 1. Deterministic Geographic + County Nearest-Neighbor Mesh (10 closest neighbors so all 87 cities receive inbound equity)
  const nearestNeighbors = [...filteredCities]
    .sort((a, b) => {
      const slugA = toSlug(a['City Name']);
      const slugB = toSlug(b['City Name']);
      const distA = haversineKm(curLat, curLng, parseFloat(a.Latitude) || 33.7490, parseFloat(a.Longitude) || -84.3880) - (curCounty && a.County === curCounty ? 8 : 0);
      const distB = haversineKm(curLat, curLng, parseFloat(b.Latitude) || 33.7490, parseFloat(b.Longitude) || -84.3880) - (curCounty && b.County === curCounty ? 8 : 0);
      if (Math.abs(distA - distB) > 0.01) return distA - distB;
      return slugA.localeCompare(slugB);
    })
    .slice(0, 10);

  // 2. Deterministic Leak Hunter Priority Strike-Zone Rotation (5 priority GSC hubs rotated by currentIndex, zero Math.random)
  const chosenSlugs = new Set(nearestNeighbors.map((c) => toSlug(c['City Name'])));
  const priorityCities = [];
  for (let i = 0; i < LEAK_HUNTER_PRIORITY_SLUGS.length && priorityCities.length < 5; i++) {
    const pSlug = LEAK_HUNTER_PRIORITY_SLUGS[(currentIndex + i) % LEAK_HUNTER_PRIORITY_SLUGS.length];
    if (pSlug === currentCitySlug || chosenSlugs.has(pSlug)) continue;
    const match = filteredCities.find((c) => toSlug(c['City Name']) === pSlug);
    if (match) {
      chosenSlugs.add(pSlug);
      priorityCities.push(match);
    }
  }

  // Top up deterministically if needed so every page links to 15 distinct Metro Atlanta cities
  const selectedCities = [...nearestNeighbors, ...priorityCities];
  if (selectedCities.length < 15) {
    for (const c of filteredCities) {
      const s = toSlug(c['City Name']);
      if (!chosenSlugs.has(s)) {
        chosenSlugs.add(s);
        selectedCities.push(c);
        if (selectedCities.length === 15) break;
      }
    }
  }

  return (
    <div style={{ marginTop: '4rem', padding: '3rem 0', borderTop: '1px solid var(--color-gray-mid)' }}>
      <div className="container">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          More Areas We Serve in Metro Atlanta
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          {selectedCities.map((city) => {
            const slug = toSlug(city['City Name']);
            const href = serviceSlug ? `/services/${serviceSlug}/${slug}` : `/service-areas/${slug}`;
            return (
              <Link
                key={slug}
                href={href}
                prefetch={false}
                style={{
                  color: 'var(--color-gray-dark)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '0.5rem',
                  background: 'var(--color-gray-light)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                {city['City Name']}, {city['State'] || 'GA'}
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/service-areas" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
            View All 87 Metro Atlanta Service Areas
          </Link>
        </div>
      </div>
    </div>
  );
}
