import Link from 'next/link';

export const metadata = {
  title: 'Services & Pricing | Foresight Home Inspections',
  description: 'View our comprehensive home inspection services starting at $315. We offer standard buyer inspections, pre-listing inspections, WDO/termite, pool/spa, and radon testing across Atlanta.'
};

export default function Services() {
  const services = [
    {
      title: 'Standard Buyer Inspection',
      price: '$315+',
      description: 'Our core comprehensive inspection covering the structure, roof, electrical, plumbing, HVAC, and all major systems. Two expert inspectors on site for maximum thoroughness.',
      details: ['Two inspectors on site', 'Thermal imaging scan included', 'Detailed digital report within 24 hours', 'InterNACHI Inspection Warranty included']
    },
    {
      title: 'Pre-Listing Seller Inspection',
      price: '$365+',
      description: 'Identify potential issues before putting your home on the market. Streamline negotiations, avoid last-minute surprises, and increase buyer confidence.',
      details: ['Full major systems review', 'Proactive repair planning tool', 'Increased transaction speed', 'Thermal scan included']
    },
    {
      title: 'New Construction Inspections',
      price: '$355+',
      description: 'Ensure your brand-new home was built to correct specifications. We inspect foundations, framing, pre-drywall, and perform final walkthrough checks.',
      details: ['Phase-by-phase option', 'Pre-drywall framing checks', 'Code-compliance review', 'Identify developer defects']
    },
    {
      title: '11-Month Warranty Inspection',
      price: '$335+',
      description: 'Performed just before your 1-year builder warranty expires. Get a professional punch list to have the builder fix issues on their dime, not yours.',
      details: ['Detailed builder-ready report', 'Mechanical & structural check', 'Saves thousand in future repairs', 'Maximum warranty utilization']
    },
    {
      title: 'Pool & Spa Inspections',
      price: '$125+',
      description: 'Specialized evaluation of residential pools and spas. We test pumps, filters, heaters, electrical, plumbing, shell integrity, and safety boundaries.',
      details: ['Pump & heater functional test', 'Safety barrier compliance', 'Filter and plumbing evaluation', 'Peace of mind for water features']
    },
    {
      title: 'Termite & WDO Inspections',
      price: '$85+',
      description: 'Wood Destroying Organisms can cause catastrophic structural damage. We partner with licensed pest control specialists to provide an Official Georgia Wood Infestation Report.',
      details: ['Official GA WDO Report', 'Identify active/past termites', 'Detect powderpost beetles & decay', 'Critical for mortgage approvals']
    },
    {
      title: 'Radon Gas Testing',
      price: '$125+',
      description: 'Radon is a cancer-causing, odorless radioactive gas. We use professional 48-hour continuous monitors to ensure your home environment is safe.',
      details: ['48-hour professional monitoring', 'Precise electronic sensors', 'Crucial indoor air safety profile', 'Water radon testing available']
    }
  ];

  return (
    <>
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Inspection Services & Pricing</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '0 auto', fontSize: '1.125rem' }}>
            Transparent pricing based on actual square footage. We provide CMI-led inspections with thermal imaging included, plus a full range of specialty assessments.
          </p>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: '4rem' }}>
            {services.slice(0, 3).map((s, idx) => (
              <div key={idx} className={`card ${idx === 0 ? 'card-premium' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
                {idx === 0 && <div className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>Core Service</div>}
                <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-red)', margin: '1rem 0' }}>{s.price}</div>
                <p style={{ color: 'var(--color-gray-dark)', flex: 1, marginBottom: '1.5rem' }}>{s.description}</p>
                <ul style={{ listStyle: 'none', margin: '0 0 2rem 0', padding: 0 }}>
                  {s.details.map((d, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--color-red)' }}>✓</span> {d}
                    </li>
                  ))}
                </ul>
                <Link href="/quote" className={`btn ${idx === 0 ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>Calculate Exact Price</Link>
              </div>
            ))}
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Specialty & Add-on Services</h2>
          <div className="grid grid-2">
            {services.slice(3).map((s, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-red)', margin: '0.5rem 0' }}>{s.price}</div>
                  <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>{s.description}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {s.details.map((d, i) => (
                      <li key={i} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-red)' }}>✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', height: '100%' }}>
                  <Link href="/quote" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>Add to Quote</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-dark text-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem' }}>Our 3-Step Report System</h2>
            <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '1rem auto 0', fontSize: '1.125rem' }}>
              We structure every finding to keep things simple, clear, and perfectly straightforward—written in plain English so you can negotiate with absolute confidence!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--color-red)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                1
              </div>
              <div>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>🔍 Step 1: The Observation</h3>
                <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '1.05rem' }}>
                  We state exactly what we observed during the inspection in clear, plain language (e.g., *“The water heater's temperature-pressure relief valve is missing a discharge pipe.”*).
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--color-red)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                2
              </div>
              <div>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>💡 Step 2: What This Could Mean</h3>
                <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '1.05rem' }}>
                  We explain the real-world implications, risks, and potential safety or financial consequences (e.g., *“If the water heater ever overheats, super-heated water could release directly onto anyone standing nearby, causing severe burns.”*).
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--color-red)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                3
              </div>
              <div>
                <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>🛠️ Step 3: Our Recommendations</h3>
                <p style={{ color: 'var(--color-gray-mid)', margin: 0, fontSize: '1.05rem' }}>
                  To stay 100% InterNACHI compliant, our recommendations specify exactly who needs to evaluate the system further and perform repairs as needed, keeping you safe and within standards (e.g., *“Have a licensed plumbing contractor evaluate further and repair as needed.”*).
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/quote" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Get Your Crystal-Clear Report Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
