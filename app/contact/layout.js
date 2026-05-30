import Script from 'next/script';

export const metadata = {
  title: 'Contact Us | Foresight Home Inspections | Lithonia & Atlanta, GA',
  description: 'Get in touch with Foresight Home Inspections. Schedule your Certified Master Inspector-led dual home inspection, request a quote, or call 678-480-2110.',
  keywords: ['Contact Foresight Home Inspections', 'schedule home inspection Atlanta', 'book home inspector Lithonia GA', 'home inspection phone number Atlanta', 'inspect@foresightcmi.com'],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/contact',
  },
  openGraph: {
    title: 'Contact Us | Certified Master Inspector® | Atlanta GA',
    description: 'Ready to book or have questions? Get in touch with Foresight Home Inspections at 678-480-2110 or book online instantly.',
    url: 'https://www.fhinspectionsatl.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Foresight Home Inspections, LLC",
      "telephone": "678-480-2110",
      "email": "inspect@foresightcmi.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Atlanta",
        "addressRegion": "GA",
        "addressCountry": "US"
      },
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
      ]
    }
  };

  return (
    <>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
