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

  const filteredCities = cities.filter((c) => toSlug(c['City Name']) !== currentCitySlug);

  // Deterministic Leak Hunter Priority Sort: Priority GSC strike-zone cities first, then alphabetical
  const sortedCities = [...filteredCities].sort((a, b) => {
    const slugA = toSlug(a['City Name']);
    const slugB = toSlug(b['City Name']);
    const idxA = LEAK_HUNTER_PRIORITY_SLUGS.indexOf(slugA);
    const idxB = LEAK_HUNTER_PRIORITY_SLUGS.indexOf(slugB);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return slugA.localeCompare(slugB);
  });

  const selectedCities = sortedCities.slice(0, 15);

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
