import './globals.css';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import WidgetWrapper from './components/WidgetWrapper';

export const metadata = {
  metadataBase: new URL('https://www.fhinspectionsatl.com'),
  title: {
    default: 'Foresight Home Inspections | Certified Master Inspector® | Atlanta GA',
    template: '%s | Foresight Home Inspections',
  },
  description: 'Two certified inspectors on every job. Led by a Certified Master Inspector® providing premium, thorough home inspections across Metro Atlanta with a $10,000 Elite Master Inspection Warranty.',
  keywords: ['Home Inspection', 'Atlanta', 'Certified Master Inspector', 'InterNACHI', 'Foresight Home Inspections', 'home inspector near me', 'Atlanta home inspection', 'Certified Master Inspector Georgia', 'home inspection Atlanta GA', 'two inspector home inspection', 'home inspection warranty'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com',
  },
  openGraph: {
    title: 'Foresight Home Inspections | Certified Master Inspector® | Atlanta GA',
    description: 'Two certified inspectors on every job. Led by a Certified Master Inspector® providing premium home inspections across Metro Atlanta with a $10,000 warranty.',
    url: 'https://www.fhinspectionsatl.com',
    siteName: 'Foresight Home Inspections',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpg',
        width: 800,
        height: 600,
        alt: 'Foresight Home Inspections Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foresight Home Inspections | Certified Master Inspector®',
    description: 'Two certified inspectors on every job. $10,000 warranty included. Serving 163+ cities across Metro Atlanta.',
    images: ['/images/logo.jpg'],
  },
  verification: {
    google: 'google2daf7fa6e380098a',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Foresight Home Inspections, LLC",
    "image": "https://www.fhinspectionsatl.com/images/logo.jpg",
    "url": "https://www.fhinspectionsatl.com",
    "telephone": "678-480-2110",
    "email": "inspect@foresightcmi.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Atlanta",
      "addressRegion": "GA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 33.749,
      "longitude": -84.388
    },
    "areaServed": [
      { "@type": "State", "name": "Georgia" },
      { "@type": "City", "name": "Atlanta" },
      { "@type": "City", "name": "Sandy Springs" },
      { "@type": "City", "name": "Roswell" },
      { "@type": "City", "name": "Alpharetta" },
      { "@type": "City", "name": "Marietta" },
      { "@type": "City", "name": "Decatur" },
      { "@type": "City", "name": "Dunwoody" },
      { "@type": "City", "name": "Kennesaw" },
      { "@type": "City", "name": "Smyrna" },
      { "@type": "City", "name": "Brookhaven" },
      { "@type": "City", "name": "Johns Creek" },
      { "@type": "City", "name": "Peachtree City" },
      { "@type": "City", "name": "Newnan" },
      { "@type": "City", "name": "Conyers" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Thursday",
        "opens": "08:00",
        "closes": "19:00"
      }
    ],
    "sameAs": [
      "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873",
      "https://www.tiktok.com/@fhinspectionsatl",
      "https://www.youtube.com/@ForesightHomeInspections-t6r",
      "https://facebook.com/fhinspectionsatl",
      "https://www.instagram.com/fhinspectionsatl/",
      "https://www.linkedin.com/company/foresight-home-inspections-llc/"
    ],
    "description": "Premium home inspection services in Atlanta featuring two inspectors on every job, led by a Certified Master Inspector. Includes $10,000 Elite Master Inspection Warranty.",
    "founder": {
      "@type": "Person",
      "name": "Christopher Boykin",
      "jobTitle": "Certified Master Inspector",
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Professional Certification",
          "name": "Certified Master Inspector",
          "recognizedBy": {
            "@type": "Organization",
            "name": "InterNACHI",
            "url": "https://www.nachi.org"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Professional Certification",
          "name": "Certified Professional Inspector (CPI)"
        }
      ],
      "sameAs": [
        "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "48"
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
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-342062426" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-342062426');
            `,
          }}
        />
        <div style={{ background: 'var(--color-red)', color: 'white', padding: '0.5rem 1rem', textAlign: 'center', fontWeight: '600', fontSize: '1rem', letterSpacing: '0.5px' }}>
          🛡️ The Certified Master Inspector Advantage: Every Inspection Includes a $10,000 Protection Warranty at No Extra Cost!
        </div>
        <Header />

        <main>{children}</main>
        <WidgetWrapper />

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h3>Foresight Home Inspections</h3>
                <p style={{ fontStyle: 'italic', color: 'var(--color-gray-mid)', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1.05rem' }}>&quot;Because hindsight is expensive... Choose Foresight!&quot;</p>
                <p>Two sets of expert eyes on every job. Unparalleled thoroughness and accuracy.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                   <Image src="/images/cmi_logo.png" alt="Certified Master Inspector Certification" width={160} height={110} style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
                   <Image src="/images/cpi_logo.png" alt="Certified Professional Inspector Certification" width={160} height={110} style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="https://facebook.com/fhinspectionsatl" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--color-gray-mid)', fontSize: '1.25rem' }}>Facebook</a>
                  <a href="https://www.instagram.com/fhinspectionsatl/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--color-gray-mid)', fontSize: '1.25rem' }}>Instagram</a>
                  <a href="https://www.tiktok.com/@fhinspectionsatl" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'var(--color-gray-mid)', fontSize: '1.25rem' }}>TikTok</a>
                  <a href="https://www.youtube.com/@ForesightHomeInspections-t6r" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: 'var(--color-gray-mid)', fontSize: '1.25rem' }}>YouTube</a>
                  <a href="https://www.linkedin.com/company/foresight-home-inspections-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--color-gray-mid)', fontSize: '1.25rem' }}>LinkedIn</a>
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
                  <li><a href="mailto:inspect@foresightcmi.com">✉️ inspect@foresightcmi.com</a></li>
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
