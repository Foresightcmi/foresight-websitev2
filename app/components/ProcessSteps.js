export default function ProcessSteps() {
  const steps = [
    {
      id: 1,
      stepNum: "01",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: "Book Online",
      description: "Schedule your inspection in 60 seconds via our 24/7 automated booking system. Pick your date, time, and add-ons."
    },
    {
      id: 2,
      stepNum: "02",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      title: "Dual-Inspector evaluate",
      description: "Two certified inspectors examine every system—roof, structure, HVAC, electrical, plumbing—using infrared thermal and drone technology."
    },
    {
      id: 3,
      stepNum: "03",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      title: "Same-Day Report",
      description: "Receive a comprehensive digital report within 24 hours with HD photos, thermal scans, and clear repair recommendations."
    },
    {
      id: 4,
      stepNum: "04",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
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

        <div className="process-steps-grid">
          {/* Desktop connecting line */}
          <div className="process-connecting-line"></div>
          
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
                width: '32px', 
                height: '32px', 
                backgroundColor: 'var(--color-gold)', 
                color: 'var(--color-dark)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem',
                position: 'absolute',
                top: '-16px',
                border: '4px solid #fff'
              }}>
                {step.id}
              </div>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '12px', 
                background: 'rgba(212, 175, 55, 0.12)', 
                border: '1px solid rgba(212, 175, 55, 0.3)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '1.25rem',
                marginTop: '0.5rem'
              }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-dark)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
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
