import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Service Areas | Foresight Home Inspections',
  description: 'Foresight Home Inspections serves over 160 cities across Georgia. Find a certified master home inspector in your local area.',
};

export default function ServiceAreasDirectory() {
  const filePath = path.join(process.cwd(), 'data', 'cities.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const cities = JSON.parse(fileContents);

  // Group cities by County
  const citiesByCounty = cities.reduce((acc, city) => {
    const county = city.County || 'Other';
    if (!acc[county]) acc[county] = [];
    acc[county].push(city);
    return acc;
  }, {});

  const sortedCounties = Object.keys(citiesByCounty).sort();

  return (
    <>
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)' }}>Areas We Serve</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
            Proudly providing premium dual-inspector services across Georgia. Find your city below to learn more about our local services.
          </p>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div style={{ columnCount: 1, columnGap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {sortedCounties.map(county => (
                <div key={county} className="card">
                  <h3 style={{ borderBottom: '2px solid var(--color-red)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    {county} County
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {citiesByCounty[county].sort((a, b) => a['City Name'].localeCompare(b['City Name'])).map(city => {
                      const slug = city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <li key={slug} style={{ marginBottom: '0.5rem' }}>
                          <Link href={`/service-areas/${slug}`} style={{ color: 'var(--color-dark)', textDecoration: 'none' }}>
                            {city['City Name']} Home Inspections
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
