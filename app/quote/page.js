import Script from 'next/script';
import QuoteClient from './QuoteClient';

export const metadata = {
  title: 'Home Inspection Cost Calculator & Quote Atlanta GA | $345',
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
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "description": "Interactive fee estimator and buyer negotiation leverage calculator for Metro Atlanta home inspections.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
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
      <QuoteClient />
    </>
  );
}
