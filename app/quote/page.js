import Script from 'next/script';
import QuoteClient from './QuoteClient';

export const metadata = {
  title: {
    absolute: 'Atlanta Home Inspection Quote Calculator | From $345',
  },
  description: 'Calculate your exact Atlanta home inspection cost in 30 seconds. Flat rates from $345 ($295 condos). 2 certified inspectors, thermal & 4K drones included!',
  keywords: ['home inspection cost calculator', 'home inspection cost calculator Atlanta', 'home inspection price quote Georgia', 'Atlanta home inspector cost', 'instant home inspection quote'],
  alternates: { canonical: 'https://www.fhinspectionsatl.com/quote' },
  openGraph: {
    title: 'Home Inspection Cost Calculator & Quote Atlanta GA | Foresight',
    description: 'Calculate your exact home inspection cost in 30 seconds. Two certified inspectors on every job from $345.',
    url: 'https://www.fhinspectionsatl.com/quote',
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Foresight Home Inspection Fee & Leverage Calculator",
  "url": "https://www.fhinspectionsatl.com/quote",
  "image": "https://www.fhinspectionsatl.com/images/Logopng.png",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "description": "Interactive fee estimator and buyer negotiation leverage calculator for Metro Atlanta home inspections.",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "priceValidUntil": "2027-12-31",
    "validThrough": "2027-12-31",
    "validFrom": "2026-01-01"
  },
  "author": {
    "@type": "HomeAndConstructionBusiness",
    "name": "Foresight Home Inspections, LLC",
    "image": "https://www.fhinspectionsatl.com/images/Logopng.png",
    "telephone": "+1-678-480-2110",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1816 South Deshon Road",
      "addressLocality": "Lithonia",
      "addressRegion": "GA",
      "postalCode": "30058",
      "addressCountry": "US"
    }
  }
};

export default function QuotePage() {
  return (
    <>
      <Script
        id="webapp-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <section style={{ background: '#0B1120', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p id="aeo-direct-answer" style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.55, color: '#E2E8F0' }}>
            Foresight Home Inspections, LLC (fhinspectionsatl.com, independent of Full House Inspections) prices single-family home inspections From $345, condos From $295, Pre-Drywall From $275, and Final New Construction From $400 across 87 Metro Atlanta cities, dispatching two certified inspectors led by Christopher Boykin, CMI (#MICB-1082) with calibrated infrared thermal scans and $35,000 combined protection; call (678) 480-2110 for specialty add-on quotes.
          </p>
        </div>
      </section>
      <QuoteClient />
    </>
  );
}
