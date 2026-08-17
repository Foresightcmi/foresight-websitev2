import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function RelatedServiceAreas({ currentCitySlug, serviceSlug }) {
  let cities = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'cities.json');
    cities = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error loading cities for RelatedServiceAreas', err);
    return null;
  }

  // Filter out the current city so we don't link to the page we're on
  const filteredCities = cities.filter(c => {
    const slug = c['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return slug !== currentCitySlug;
  });

  // Shuffle and pick 12 random cities to spread link juice evenly across the site
  // For deterministic SSG builds, we could use a seeded random, but standard sort is okay for now
  // We'll use a simple deterministic slice based on the length to avoid hydration issues if it were client side.
  // Since this is a server component, standard random is fine for every build.
  const shuffled = filteredCities.sort(() => 0.5 - Math.random());
  const selectedCities = shuffled.slice(0, 15);

  return (
    <div style={{ marginTop: '4rem', padding: '3rem 0', borderTop: '1px solid var(--color-gray-mid)' }}>
      <div className="container">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          More Areas We Serve in Metro Atlanta
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          {selectedCities.map((city) => {
            const slug = city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
            // If serviceSlug is provided, we link to the PSEO service page, otherwise the general city page
            const href = serviceSlug ? `/services/${serviceSlug}/${slug}` : `/service-areas/${slug}`;
            return (
              <Link 
                key={slug} 
                href={href}
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
             View All 160+ Service Areas
           </Link>
        </div>
      </div>
    </div>
  );
}
