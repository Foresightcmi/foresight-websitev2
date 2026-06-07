import './globals.css';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import WidgetWrapper from './components/WidgetWrapper';
import Breadcrumbs from './components/Breadcrumbs';

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
        url: '/images/Logopng.png',
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
    images: ['/images/Logopng.png'],
  },
  verification: {
    google: 'google2daf7fa6e380098a',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://www.fhinspectionsatl.com/#business",
        "name": "Foresight Home Inspections, LLC",
        "url": "https://www.fhinspectionsatl.com",
        "telephone": "+1-678-480-2110",
        "email": "plsinspectnow@gmail.com",
        "logo": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "image": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "additionalType": [
          "https://en.wikipedia.org/wiki/Home_inspection",
          "https://www.wikidata.org/wiki/Q5888806"
        ],
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Atlanta",
          "addressRegion": "GA",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.7490",
          "longitude": "-84.3880"
        },
        "areaServed": [
        {
              "@type": "State",
              "name": "Georgia"
        },
        {
              "@type": "City",
              "name": "Acworth"
        },
        {
              "@type": "City",
              "name": "Alpharetta"
        },
        {
              "@type": "City",
              "name": "Atlanta"
        },
        {
              "@type": "City",
              "name": "Austell"
        },
        {
              "@type": "City",
              "name": "Avondale Estates"
        },
        {
              "@type": "City",
              "name": "Berkeley Lake"
        },
        {
              "@type": "City",
              "name": "Between"
        },
        {
              "@type": "City",
              "name": "Brookhaven"
        },
        {
              "@type": "City",
              "name": "Brooks"
        },
        {
              "@type": "City",
              "name": "Buford"
        },
        {
              "@type": "City",
              "name": "Chamblee"
        },
        {
              "@type": "City",
              "name": "Chattahoochee Hills"
        },
        {
              "@type": "City",
              "name": "Clarkston"
        },
        {
              "@type": "City",
              "name": "College Park"
        },
        {
              "@type": "City",
              "name": "Conyers"
        },
        {
              "@type": "City",
              "name": "Covington"
        },
        {
              "@type": "City",
              "name": "Dacula"
        },
        {
              "@type": "City",
              "name": "Decatur"
        },
        {
              "@type": "City",
              "name": "Doraville"
        },
        {
              "@type": "City",
              "name": "Duluth"
        },
        {
              "@type": "City",
              "name": "Dunwoody"
        },
        {
              "@type": "City",
              "name": "East Point"
        },
        {
              "@type": "City",
              "name": "Fairburn"
        },
        {
              "@type": "City",
              "name": "Fayetteville"
        },
        {
              "@type": "City",
              "name": "Forest Park"
        },
        {
              "@type": "City",
              "name": "Good Hope"
        },
        {
              "@type": "City",
              "name": "Grantville"
        },
        {
              "@type": "City",
              "name": "Grayson"
        },
        {
              "@type": "City",
              "name": "Hampton"
        },
        {
              "@type": "City",
              "name": "Hapeville"
        },
        {
              "@type": "City",
              "name": "Haralson"
        },
        {
              "@type": "City",
              "name": "Jersey"
        },
        {
              "@type": "City",
              "name": "Johns Creek"
        },
        {
              "@type": "City",
              "name": "Jonesboro"
        },
        {
              "@type": "City",
              "name": "Kennesaw"
        },
        {
              "@type": "City",
              "name": "Lawrenceville"
        },
        {
              "@type": "City",
              "name": "Lilburn"
        },
        {
              "@type": "City",
              "name": "Lithonia"
        },
        {
              "@type": "City",
              "name": "Locust Grove"
        },
        {
              "@type": "City",
              "name": "Loganville"
        },
        {
              "@type": "City",
              "name": "Mansfield"
        },
        {
              "@type": "City",
              "name": "Marietta"
        },
        {
              "@type": "City",
              "name": "McDonough"
        },
        {
              "@type": "City",
              "name": "Milton"
        },
        {
              "@type": "City",
              "name": "Monroe"
        },
        {
              "@type": "City",
              "name": "Moreland"
        },
        {
              "@type": "City",
              "name": "Morrow"
        },
        {
              "@type": "City",
              "name": "Mountain Park"
        },
        {
              "@type": "City",
              "name": "Newborn"
        },
        {
              "@type": "City",
              "name": "Newnan"
        },
        {
              "@type": "City",
              "name": "Norcross"
        },
        {
              "@type": "City",
              "name": "Oxford"
        },
        {
              "@type": "City",
              "name": "Palmetto"
        },
        {
              "@type": "City",
              "name": "Peachtree City"
        },
        {
              "@type": "City",
              "name": "Peachtree Corners"
        },
        {
              "@type": "City",
              "name": "Pine Lake"
        },
        {
              "@type": "City",
              "name": "Porterdale"
        },
        {
              "@type": "City",
              "name": "Powder Springs"
        },
        {
              "@type": "City",
              "name": "Redan"
        },
        {
              "@type": "City",
              "name": "Roswell"
        },
        {
              "@type": "City",
              "name": "Sandy Springs"
        },
        {
              "@type": "City",
              "name": "Senoia"
        },
        {
              "@type": "City",
              "name": "Sharpsburg"
        },
        {
              "@type": "City",
              "name": "Smyrna"
        },
        {
              "@type": "City",
              "name": "Snellville"
        },
        {
              "@type": "City",
              "name": "South Fulton"
        },
        {
              "@type": "City",
              "name": "Stockbridge"
        },
        {
              "@type": "City",
              "name": "Stone Mountain"
        },
        {
              "@type": "City",
              "name": "Stonecrest"
        },
        {
              "@type": "City",
              "name": "Sugar Hill"
        },
        {
              "@type": "City",
              "name": "Suwanee"
        },
        {
              "@type": "City",
              "name": "Tucker"
        },
        {
              "@type": "City",
              "name": "Turin"
        },
        {
              "@type": "City",
              "name": "Tyrone"
        },
        {
              "@type": "City",
              "name": "Union City"
        },
        {
              "@type": "City",
              "name": "Walnut Grove"
        },
        {
              "@type": "City",
              "name": "Woolsey"
        }
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
      "https://maps.app.goo.gl/R1nk9tbM19aDvXpA8",
      "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873",
      "https://www.tiktok.com/@fhinspectionsatl",
      "https://www.youtube.com/@ForesightHomeInspections-t6r",
      "https://facebook.com/fhinspectionsatl",
      "https://www.instagram.com/fhinspectionsatl/",
      "https://www.linkedin.com/company/foresight-home-inspections-llc/"
    ],
    "knowsAbout": [
      "Home Inspection",
      "Thermal Imaging",
      "Infrared Thermal Imaging",
      "Aerial Drone Roof Inspections",
      "Moisture & Combustible Gas Detection",
      "InterNACHI Standards of Practice",
      "Residential Construction Practices",
      "Radon Gas Testing",
      "Sewer Scope Inspection",
      "Termite and Wood Destroying Organism (WDO) Inspections",
      "Pool and Spa Inspections",
      "Pre-Listing Home Inspections",
      "New Construction Final Inspections"
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "International Association of Certified Home Inspectors (InterNACHI)",
      "url": "https://www.nachi.org"
    },
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
    "employee": {
      "@type": "Person",
      "name": "Christopher Boykin",
      "jobTitle": "Certified Master Inspector",
      "award": "Certified Master Inspector (CMI) Designation - September 2024"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "48"
    }
  },
  {
    "@type": "WebSite",
    "@id": "https://www.fhinspectionsatl.com/#website",
    "url": "https://www.fhinspectionsatl.com",
    "name": "Foresight Home Inspections",
    "publisher": {
      "@id": "https://www.fhinspectionsatl.com/#business"
    }
  }
]
};

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/images/Logopng.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/Logopng.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-F5NKKNS7B7" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F5NKKNS7B7');
            `,
          }}
        />
        <div style={{ background: 'var(--color-red)', color: 'white', padding: '0.5rem 1rem', textAlign: 'center', fontWeight: '600', fontSize: '1rem', letterSpacing: '0.5px' }}>
          🛡️ The Certified Master Inspector Advantage: Every Inspection Includes a $10,000 Protection Warranty at No Extra Cost!
        </div>
        <Header />
        <Breadcrumbs />

        <main>{children}</main>
        <WidgetWrapper />

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h3>Foresight Home Inspections, LLC</h3>
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
                  <li><Link href="/realtors">Realtors VIP Program</Link></li>
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
                  <li>Atlanta, GA & Surrounding Metro Areas</li>
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
