'use client';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Sarah & Marcus T.',
      location: 'Sandy Springs, GA',
      rating: 5,
      saving: 'Saved $24,500',
      tag: '🚽 Foundation & Sewer Issues',
      text: '“Foresight’s two person inspection team team was an absolute game-changer. They found a major structural foundation crack hidden behind basement paneling and a collapsed clay pipe. Their crystal-clear report gave our realtor massive negotiating leverage, and she successfully secured a $24,500 seller repair credit at closing!”',
    },
    {
      name: 'David L.',
      location: 'Alpharetta, GA',
      rating: 5,
      saving: 'Saved $18,000',
      tag: '🔥 HVAC & Water Intrusion',
      text: '“Christopher Boykin used his FLIR thermal camera to locate active moisture leaks in the second-story subfloor and cracked heat exchangers in both HVAC systems venting carbon monoxide. Armed with this detailed report, our agent negotiated a full $18,000 price reduction to cover total HVAC replacements before closing.”',
    },
    {
      name: 'Elena R.',
      location: 'Decatur, GA',
      rating: 5,
      saving: 'Saved $12,500+',
      tag: '⚡ New Construction Defects',
      text: '“We hired Foresight for a new construction final inspection. Their team caught an improperly wired subpanel, missing attic fire-stops, and high radon levels. The report gave our realtor the exact proof needed to force the builder to install a radon mitigation system and redo the electrical work before closing, saving us over $12,500.”',
    },
  ];

  return (
    <section className="section bg-white" style={{ padding: '6rem 0', borderBottom: '1px solid var(--color-gray-mid)' }}>
      <div className="container">
        <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
          <span className="badge" style={{ marginBottom: '1rem', background: 'var(--color-red-light)', color: 'var(--color-red)', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.875rem' }}>
            Real Client Success
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
            How Choosing Foresight Saves <span style={{ color: 'var(--color-red)' }}>Thousands</span>
          </h2>
          <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
            A standard home inspection finds basic defects—Foresight’s two person inspection team, high-tech diagnostic sweeps locate hidden major system issues, giving you the leverage to negotiate tens of thousands off your purchase.
          </p>
        </div>

        <div className="grid grid-3" style={{ gap: '2rem' }}>
          {reviews.map((r, i) => (
            <div
              key={i}
              className="card card-premium"
              style={{
                background: 'var(--color-gray-light)',
                borderTop: '5px solid var(--color-red)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(211,47,47,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                {/* Five Stars & Saving Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ color: '#fbbf24', fontSize: '1.25rem', letterSpacing: '0.1em' }}>
                    {'★'.repeat(r.rating)}
                  </div>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    {r.saving}
                  </span>
                </div>

                {/* Review Text */}
                <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 1.5rem 0' }}>
                  {r.text}
                </p>
              </div>

              {/* Reviewer Details */}
              <div style={{ borderTop: '1px solid var(--color-gray-mid)', paddingTop: '1.25rem', marginTop: 'auto' }}>
                <strong style={{ display: 'block', color: 'var(--color-dark)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  {r.name}
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-gray-mid)', fontSize: '0.9rem' }}>
                  <span>{r.location}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-red)', fontSize: '0.85rem' }}>{r.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Small Trust Badge under reviews */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: '#1E293B', fontSize: '1rem', fontWeight: 500 }}>
          <span style={{ color: '#D4AF37', fontSize: '1.25rem' }}>★★★★★</span>
          <span>Average rating of <strong style={{ color: '#0F172A' }}>4.9+ stars</strong> across 43+ verified Google &amp; HomeGauge client inspections.</span>
        </div>
      </div>
    </section>
  );
}
