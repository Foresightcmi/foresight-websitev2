export default function ProcessSteps() {
  const steps = [
    {
      id: 1,
      icon: "📅",
      title: "Book Online",
      description: "Schedule your inspection in 60 seconds via our 24/7 automated booking system. Pick your date, time, and add-ons."
    },
    {
      id: 2,
      icon: "🔍",
      title: "Dual-Inspector Audit",
      description: "Two certified inspectors examine every system—roof, structure, HVAC, electrical, plumbing—using FLIR thermal and drone technology."
    },
    {
      id: 3,
      icon: "📋",
      title: "Same-Day Report",
      description: "Receive a comprehensive digital report within 24 hours with HD photos, thermal scans, and clear repair recommendations."
    },
    {
      id: 4,
      icon: "🛡️",
      title: "$10K Protection",
      description: "Walk away with a $10,000 Elite Master Inspection Warranty at $0 deductible—included free on every job."
    }
  ];

  return (
    <section className="section bg-white" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--color-gray-light)', color: 'var(--color-red)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.85rem' }}>How It Works</span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-dark)', margin: '1rem 0', fontFamily: 'var(--font-heading)' }}>Your Inspection Journey</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-dark)', lineHeight: '1.6' }}>
            We make getting a professional home inspection fast, easy, and stress-free.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', position: 'relative' }}>
          {/* Desktop connecting line */}
          <div style={{ position: 'absolute', top: '3rem', left: '10%', right: '10%', height: '2px', backgroundColor: 'var(--color-gold)', zIndex: 0, opacity: 0.5 }}></div>
          
          {steps.map((step) => (
            <div key={step.id} style={{ 
              backgroundColor: '#fff', 
              padding: '2rem', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: 'var(--shadow-lg)',
              borderTop: '3px solid var(--color-gold)',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: 'var(--color-gold)', 
                color: 'var(--color-dark)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                position: 'absolute',
                top: '-15px',
                border: '4px solid #fff'
              }}>
                {step.id}
              </div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-dark)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
              <p style={{ color: 'var(--color-gray-dark)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
