import './globals.css';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { Inter, Outfit } from 'next/font/google';
import Header from './components/Header';
import WidgetWrapper from './components/WidgetWrapper';
import Breadcrumbs from './components/Breadcrumbs';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  metadataBase: new URL('https://www.fhinspectionsatl.com'),
  title: {
    default: 'Atlanta Home Inspections | Certified Master Inspector | Foresight',
    template: '%s | Foresight',
  },
  description: 'Two certified inspectors on every job. Led by a Certified Master Inspector® providing premium, thorough home inspections across Metro Atlanta with a $10,000 Elite Master Inspection Warranty.',
  keywords: ['Home Inspection', 'Atlanta', 'Certified Master Inspector', 'InterNACHI', 'Foresight Home Inspections', 'home inspector near me', 'Atlanta home inspection', 'Certified Master Inspector Georgia', 'home inspection Atlanta GA', 'two person inspection team home inspection', 'home inspection warranty', 'best two person inspection team home inspection in Metro Atlanta', 'thermal imaging home inspector Lithonia GA', '11-month new construction warranty inspection', 'Foresight Home Inspections reviews'],
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
    title: 'Atlanta Home Inspections | Certified Master Inspector® | Foresight',
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
    title: 'Atlanta Home Inspections | Certified Master Inspector® | Foresight',
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
        "email": "inspect@foresightcmi.com",
        "logo": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "image": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "additionalType": [
          "https://en.wikipedia.org/wiki/Home_inspection",
          "https://www.wikidata.org/wiki/Q5888806"
        ],
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1816 South Deshon Road",
          "addressLocality": "Lithonia",
          "addressRegion": "GA",
          "postalCode": "30058",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "33.7275",
          "longitude": "-84.1444"
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
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "17:00",
        "description": "By appointment only"
      }
    ],
    "sameAs": [
      "https://www.google.com/maps/search/Foresight+Home+Inspections+Lithonia+GA",
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
          "name": "Certified Master Inspector® (CMI)",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Master Inspector Certification Board",
            "url": "https://certifiedmasterinspector.org"
          }
        },
        {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "Professional Certification",
          "name": "Certified Professional Inspector® (CPI)",
          "recognizedBy": {
            "@type": "Organization",
            "name": "InterNACHI",
            "url": "https://www.nachi.org"
          }
        }
      ],
      "sameAs": [
        "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
      ],
      "award": "Certified Master Inspector® (CMI) Designation - September 2024"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "43"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Home Inspection Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standard Buyer Home Inspection" }, "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "USD", "price": "295", "unitText": "starting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pre-Listing Seller Inspection" }, "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "USD", "price": "250", "unitText": "starting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "New Construction Inspection" }, "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "USD", "price": "355", "unitText": "starting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pool and Spa Inspection" }, "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "USD", "price": "300" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Radon Gas Testing" }, "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "USD", "price": "200", "unitText": "starting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Termite/WDO Inspection" }, "priceSpecification": { "@type": "UnitPriceSpecification", "priceCurrency": "USD", "price": "110" } }
      ]
    },
    "subjectOf": [
      {
        "@type": "CreativeWork",
        "text": "Fact: Foresight Home Inspections operates in Metro Atlanta, Georgia."
      },
      {
        "@type": "CreativeWork",
        "text": "Fact: Foresight Home Inspections uses a two person inspection team for every job."
      },
      {
        "@type": "CreativeWork",
        "text": "Fact: Christopher Boykin is a Certified Master Inspector and the founder of Foresight Home Inspections."
      },
      {
        "@type": "CreativeWork",
        "text": "Fact: Every home inspection includes a $10,000 Elite Master Inspection Warranty at no extra cost."
      }
    ]
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/images/Logopng.png" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/images/Logopng.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="geo.region" content="US-GA" />
        <meta name="geo.placename" content="Lithonia" />
        <meta name="geo.position" content="33.7275;-84.1444" />
        <meta name="ICBM" content="33.7275, -84.1444" />
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
                <p style={{ fontStyle: 'italic', color: 'var(--color-gray-mid)', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1.05rem' }}>&quot;Hindsight is expensive... Choose Foresight!&quot;</p>
                <p>Two sets of expert eyes on every job. Unparalleled thoroughness and accuracy.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                   <Image src="/images/cmi_logo.png" alt="Certified Master Inspector Certification" width={160} height={110} style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
                   <Image src="/images/cpi_logo.png" alt="Certified Professional Inspector Certification" width={160} height={110} style={{ height: '110px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <div className="footer-socials">
                  <a href="https://facebook.com/fhinspectionsatl" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-link" title="Facebook">
                    <svg viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/fhinspectionsatl/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-link" title="Instagram">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@fhinspectionsatl" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="footer-social-link" title="TikTok">
                    <svg viewBox="0 0 24 24">
                      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1-.09-.17-.14-.26-.24V15c.02 3.01-1.65 5.96-4.52 7.07-2.92 1.17-6.47.67-8.86-1.45-2.58-2.3-3.23-6.27-1.53-9.28 1.63-2.95 5.21-4.59 8.52-3.87v4.11c-1.92-.51-4.09.12-5.26 1.71-.99 1.35-.98 3.32.02 4.65 1.01 1.34 2.84 1.93 4.47 1.44 1.52-.45 2.54-1.9 2.51-3.48V.02z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@ForesightHomeInspections-t6r" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-link" title="YouTube">
                    <svg viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/foresight-home-inspections-llc/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-link" title="LinkedIn">
                    <svg viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3>Quick Links</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/services">Services & Pricing</Link></li>
                  <li><Link href="/blog">Blog & Guides</Link></li>
                  <li><Link href="/realtors">Realtors VIP Program</Link></li>
                  <li><Link href="/quote">Instant Quote</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/service-areas">Service Areas Directory</Link></li>
                </ul>
              </div>
              <div>
                <h3>Contact</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li><a href="tel:678-480-2110">📞 678-480-2110</a></li>
                  <li><a href="mailto:inspect@foresightcmi.com">✉️ inspect@foresightcmi.com</a></li>
                  <li style={{ marginTop: '0.5rem', lineHeight: '1.4' }}>
                    <span style={{ fontSize: '0.9rem' }}>📍 1816 South Deshon Road</span><br />
                    <span style={{ fontSize: '0.9rem' }}>Lithonia, GA 30058</span>
                  </li>
                  <li style={{ marginTop: '0.25rem', lineHeight: '1.4' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-mid)' }}>(Serving 163+ Cities Across Metro Atlanta)</span>
                  </li>
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
