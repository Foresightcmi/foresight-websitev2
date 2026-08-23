import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import CitySearch from '../components/CitySearch';

export const metadata = {
  title: 'Home Inspections in 163+ Metro Atlanta Cities',
  description: 'Foresight Home Inspections serves over 163 cities across Georgia. Find a certified master home inspector in your local area.',
  openGraph: {
    title: 'Home Inspections in 163+ Metro Atlanta Cities | Foresight',
    description: 'Foresight Home Inspections serves over 163 cities across Georgia. Find a certified master home inspector in your local area.',
    url: 'https://www.fhinspectionsatl.com/service-areas',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/service-areas',
  },
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

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Foresight Home Inspections Service Areas",
    "description": "All cities served by Foresight Home Inspections across Metro Atlanta, Georgia.",
    "numberOfItems": cities.length,
    "itemListElement": cities.map((city, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": `Home Inspections in ${city['City Name']}, GA`,
      "url": `https://www.fhinspectionsatl.com/service-areas/${city['City Name'].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)' }}>Areas We Serve</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.125rem' }}>
            Proudly providing premium two-inspector team services across Georgia. Find your city or ZIP code below to learn more about our local services.
          </p>
        </div>
      </section>

      {/* Interactive Instant City/ZIP Search */}
      <section className="section bg-white" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '2rem' }}>
            <h2>Instant Service Area Finder</h2>
            <p style={{ color: 'var(--color-gray-dark)' }}>Type your city, county, or ZIP code below to find your dedicated local inspection page.</p>
          </div>
          <CitySearch cities={cities} />
        </div>
      </section>

      {/* ── SPECIALIZED SUB-NICHE INSPECTION HUBS ──────────────────── */}
      <section className="section bg-white" style={{ padding: '0 0 3rem 0', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '0.5rem' }}>Sub-Niche Specialization</span>
            <h2>Specialized Inspection Services Across Metro Atlanta</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0 auto' }}>
              We provide dedicated, certified inspection teams for every major property evaluation category.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>☢️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Radon Gas Testing</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                48-hour continuous electronic radon monitoring for granite-zone foundations.
              </p>
              <Link href="/services/radon-testing/atlanta" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Atlanta Radon Testing &rarr;
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-gold)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🐜</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Termite & WDO Clearances</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                Official Georgia Wood Infestation Reports for loan closing and pest defense.
              </p>
              <Link href="/services/termite-inspection/alpharetta" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Alpharetta Termite Clearances &rarr;
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-dark)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🚽</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>HD Sewer Scope Cameras</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                Fiber-optic underground lateral pipe evaluations to locate roots and collapses.
              </p>
              <Link href="/services/sewer-scope-inspection/decatur" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Decatur Sewer Scopes &rarr;
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-red)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏗️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>New Construction Audits</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                Independent builder punch-list inspections for pre-drywall and final phase.
              </p>
              <Link href="/services/new-construction-inspection/johns-creek" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Johns Creek New Construction &rarr;
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-gold)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏊‍♂️</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pool & Spa Inspections</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                Complete shell, pump, heater, hydraulic, and electrical bonding evaluations.
              </p>
              <Link href="/services/pool-inspection/roswell" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Roswell Pool Inspections &rarr;
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-dark)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📋</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Pre-Listing Seller Audits</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
                Identify defects before hitting MLS to protect asking price and speed closing.
              </p>
              <Link href="/services/pre-listing-inspection/marietta" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.875rem' }}>
                View Marietta Pre-Listing Audits &rarr;
              </Link>
            </div>
          </div>
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
