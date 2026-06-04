import Script from 'next/script';

export const metadata = {
  title: 'Instant Quote Calculator | Home Inspection Cost Atlanta GA',
  description: 'Calculate your home inspection cost instantly with our transparent pricing estimator. Free online quotes for buyer, seller, radon, termite, and sewer scope inspections in Metro Atlanta.',
  keywords: ['home inspection cost Atlanta', 'home inspection price Lithonia GA', 'home inspection quote Georgia', 'radon testing price Atlanta', 'sewer scope inspection cost'],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/quote',
  },
  openGraph: {
    title: 'Instant Home Inspection Quote Calculator | Atlanta, GA',
    description: 'Get an instant, transparent home inspection estimate online. Select your service, square footage, and add-ons to see our competitive pricing.',
    url: 'https://www.fhinspectionsatl.com/quote',
    type: 'website',
  },
};

export default function QuoteLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Instant Home Inspection Quote Calculator",
    "description": "Calculate custom, transparent home inspection pricing instantly for services in Lithonia, Decatur, Atlanta, and across North Georgia.",
    "publisher": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "678-480-2110",
      "email": "plsinspectnow@gmail.com",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Atlanta",
        "addressRegion": "GA",
        "addressCountry": "US"
      }
    }
  };

  return (
    <>
      <Script
        id="quote-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
