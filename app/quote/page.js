import Script from 'next/script';
import QuoteClient from './QuoteClient';

export const metadata = {
  title: 'Home Inspection Quote & Price Calculator | Atlanta GA',
  description: 'Calculate instant, transparent home inspection pricing and buyer negotiation leverage in Metro Atlanta. Includes two certified inspectors and $10,000 warranty.',
  keywords: ['home inspection cost calculator Atlanta', 'home inspection price quote Georgia', 'Atlanta home inspector cost', 'instant home inspection quote'],
  alternates: { canonical: 'https://www.fhinspectionsatl.com/quote' },
  openGraph: {
    title: 'Instant Home Inspection Quote & Fee Calculator | Foresight Atlanta',
    description: '100% transparent pricing based on square footage. Two certified inspectors on every job.',
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
    "name": "Foresight Home Inspections, LLC"
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
