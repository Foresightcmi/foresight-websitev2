import Script from 'next/script';
import QuoteClient from './QuoteClient';

export const metadata = {
  title: 'Instant Home Inspection Quote Atlanta | Rates From $345',
  description: 'Calculate your exact Atlanta home inspection quote in 30 seconds. 100% transparent flat rates starting at $345 ($295 condos). 2-inspector team, thermal & drone included!',
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
