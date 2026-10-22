import places from '../../../data/census-dekalb-places.json';

// The nine Census-designated places (CDPs) in unincorporated DeKalb County.
// CDPs are statistical areas, not cities. Figures: U.S. Census Bureau ACS 2019-2023 5-year (data/census-dekalb-places.json).
const NINE = ['Candler-McAfee', 'Belvedere Park', 'Gresham Park', 'Panthersville', 'Druid Hills', 'North Decatur', 'Scottdale', 'North Druid Hills', 'Redan'];
const rows = NINE.map((n) => places.find((p) => p.name === `${n} CDP, Georgia`)).filter(Boolean)
  .sort((a, b) => b.pctBuiltBefore1980 - a.pctBuiltBefore1980);
const fmt = (n) => Number(n).toLocaleString('en-US');

export default function UnincorporatedAreas() {
  if (!rows.length) return null;
  const retrieved = rows[0].retrieved_on;
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="section-title" style={{ marginBottom: '1.5rem' }}>
          <h2>Unincorporated DeKalb Communities Where the Certificate Applies</h2>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '680px', margin: '0.75rem auto 0' }}>
            DeKalb County&apos;s water service application says the Certificate of Compliance is required for properties in
            unincorporated DeKalb County that were built before 1993. These nine Census-designated places are unincorporated, and in
            most of them a large share of homes predates the cutoff.
          </p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <caption style={{ textAlign: 'left', padding: '0 0 0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
              Homes built before 1980 are all before the 1993 cutoff, so the real pre-1993 share is higher.
            </caption>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-gray-light)' }}>
                <th scope="col" style={{ padding: '0.6rem' }}>Community</th>
                <th scope="col" style={{ padding: '0.6rem' }}>Population</th>
                <th scope="col" style={{ padding: '0.6rem' }}>Median year built</th>
                <th scope="col" style={{ padding: '0.6rem' }}>Built before 1980</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                  <th scope="row" style={{ padding: '0.6rem', textAlign: 'left', fontWeight: 600 }}>{r.name.replace(' CDP, Georgia', '')}</th>
                  <td style={{ padding: '0.6rem' }}>{fmt(r.population)}</td>
                  <td style={{ padding: '0.6rem' }}>{r.medianYearBuilt}</td>
                  <td style={{ padding: '0.6rem' }}>{r.pctBuiltBefore1980}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
          <strong>Check your Tax District, not your mailing address.</strong> A &quot;Decatur,&quot; &quot;Lithonia&quot; or &quot;Stone Mountain&quot; mailing
          address can sit in unincorporated DeKalb. The county tells buyers to look up the address in its online property search: the
          Tax District field reads &quot;unincorporated&quot; when the certificate applies, and shows a city name when it does not.
        </p>
        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          Sources: DeKalb County water service application (dekalbcountyga.gov, 2026), which limits the Certificate of Compliance to
          unincorporated DeKalb County;{' '}
          <a
            href="https://www.dekalbcountyga.gov/sites/default/files/2026-01/Capacity%20Credits%20Allocation%20Policy%2003%2025%202022.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            DeKalb County Capacity Credits Allocation Policy
          </a>
          , section 5.1, which states that Code of Ordinances Sections 25-45 through 25-49 require water-conserving plumbing fixtures for
          all properties in unincorporated DeKalb County; U.S. Census Bureau, American Community Survey{' '}
          {rows[0].acsYear || '2019-2023 5-year'} estimates, tables B01003, B25034, B25035, retrieved {retrieved}. Other unincorporated
          communities exist beyond these nine.
        </p>
      </div>
    </section>
  );
}
