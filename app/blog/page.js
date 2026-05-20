import Link from 'next/link';

export const metadata = {
  title: 'Home Inspection Blog & Insights | Foresight Home Inspections',
  description: 'Read the latest insights and expert tips on home inspections, maintenance, and buying from Certified Master Inspector Christopher Boykin.'
};

export default function Blog() {
  return (
    <>
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)' }}>The Foresight Blog</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
            Expert insights to help you protect your most valuable investment.
          </p>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Why You Need a Home Inspection for a New Build</h3>
              <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1.5rem' }}>
                Don't let the shiny new paint fool you. Builders make mistakes, and municipal code inspectors don't have the time to check every detail. Here's why you need a private inspection before closing.
              </p>
              <Link href="/ask-twin" style={{ fontWeight: 600, color: 'var(--color-red)' }}>Ask the Twin about New Builds →</Link>
            </div>
            
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>The Hidden Dangers of Radon Gas</h3>
              <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1.5rem' }}>
                Radon is the second leading cause of lung cancer in the US. It's odorless, colorless, and can seep into any home. Learn why radon testing is an essential add-on to your inspection.
              </p>
              <Link href="/ask-twin" style={{ fontWeight: 600, color: 'var(--color-red)' }}>Ask the Twin about Radon →</Link>
            </div>
            
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Thermal Imaging: Seeing the Invisible</h3>
              <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1.5rem' }}>
                Water leaks behind walls, missing insulation, and electrical hotspots can't be seen with the naked eye. Discover how our Premium Package uses FLIR thermal imaging to catch these costly issues.
              </p>
              <Link href="/ask-twin" style={{ fontWeight: 600, color: 'var(--color-red)' }}>Ask the Twin about Thermal Tech →</Link>
            </div>
            
            <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'var(--color-white)' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Have a Specific Question?</h3>
              <p style={{ color: 'var(--color-gray-mid)', marginBottom: '1.5rem' }}>
                Our Digital Twin is trained on InterNACHI standards and is available 24/7 to answer your specific home inspection questions.
              </p>
              <Link href="/ask-twin" className="btn btn-primary">Chat with the Digital Twin</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
