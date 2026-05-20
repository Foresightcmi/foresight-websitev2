import './globals.css';
import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Foresight Home Inspections | Certified Master Inspector',
  description: 'Two inspectors on every job. Led by a Certified Master Inspector® (CMI®) providing premium, thorough home inspections in Atlanta.',
  keywords: ['Home Inspection', 'Atlanta', 'Certified Master Inspector', 'InterNACHI', 'Foresight Home Inspections'],
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Foresight Home Inspections, LLC",
    "image": "https://www.fhinspectionsatl.com/images/logo.jpg",
    "url": "https://www.fhinspectionsatl.com",
    "telephone": "678-480-2110",
    "email": "plsinspectnow@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Atlanta",
      "addressRegion": "GA",
      "addressCountry": "US"
    },
    "description": "Premium home inspection services in Atlanta featuring two inspectors on every job, led by a Certified Master Inspector.",
    "founder": {
      "@type": "Person",
      "name": "Christopher Boykin"
    }
  };

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        <div style={{ background: 'var(--color-red)', color: 'white', padding: '1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '0.5px' }}>
          🛡️ The CMI Advantage: Every Inspection Includes a $10,000 Protection Warranty at No Extra Cost!
        </div>
        <header className="header glass">
          <div className="container nav-container">
            <Link href="/" className="logo">
              <img src="/images/logo.jpg" alt="Foresight Home Inspections" style={{ height: '180px' }} />
              <span style={{ display: 'none' }}>Foresight</span>
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/quote">Get Quote</Link></li>
              <li><Link href="/ask-twin" style={{ color: 'var(--color-red)', fontWeight: '600' }}>Ask Foresight AI</Link></li>
              <li>
                <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Schedule Now
                </a>
              </li>
            </ul>
          </div>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h3>Foresight Home Inspections</h3>
                <p>Two sets of expert eyes on every job. Unparalleled thoroughness and accuracy.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                   <img src="/images/cmi_logo.png" alt="CMI" style={{ height: '110px', objectFit: 'contain' }} />
                   <img src="/images/cpi_logo.jpg" alt="CPI" style={{ height: '110px', objectFit: 'contain' }} />
                </div>
              </div>
              <div>
                <h3>Quick Links</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/services">Services & Pricing</Link></li>
                  <li><Link href="/quote">Instant Quote</Link></li>
                  <li><Link href="/ask-twin">Ask Foresight AI Portal</Link></li>
                  <li><Link href="/service-areas">Service Areas Directory</Link></li>
                </ul>
              </div>
              <div>
                <h3>Contact</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><a href="tel:678-480-2110">📞 678-480-2110</a></li>
                  <li><a href="mailto:plsinspectnow@gmail.com">✉️ plsinspectnow@gmail.com</a></li>
                  <li>Atlanta, GA & Surrounding Areas</li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Foresight Home Inspections, LLC. All rights reserved. Proudly Black-owned.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
