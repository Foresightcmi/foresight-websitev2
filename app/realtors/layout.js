import Script from 'next/script';

export const metadata = {
  title: 'Realtor Partner VIP Program | Metro Atlanta CMI Home Inspections',
  description: 'Streamline your real estate transactions with Foresight Home Inspections. Active SUPRA key access, complimentary Utility Concierge setup, two person inspection team speed, and $10,000 client protection warranties.',
  keywords: [
    'Realtor Partner Program',
    'Atlanta real estate agent inspections',
    'SUPRA key access home inspector Atlanta',
    'Certified Master Inspector Georgia',
    'Utility Concierge real estate',
    'Foresight Home Inspections realtors',
    'Metro Atlanta home inspector'
  ],
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/realtors',
  },
  openGraph: {
    title: 'Realtor Partner VIP Program | Metro Atlanta CMI Inspections',
    description: 'Empower your clients and close deals faster with Atlanta\'s premier two person inspection team team. Active SUPRA lockbox access, complimentary Utility Concierge, and elite $10,000 warranties included.',
    url: 'https://www.fhinspectionsatl.com/realtors',
    type: 'website',
  },
};

export default function RealtorsLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.fhinspectionsatl.com/realtors/#webpage",
        "url": "https://www.fhinspectionsatl.com/realtors",
        "name": "Realtor Partner VIP Program | Metro Atlanta CMI Home Inspections",
        "description": "Streamline your real estate transactions with Foresight Home Inspections. Active SUPRA key access, complimentary Utility Concierge setup, two person inspection team speed, and $10,000 client protection warranties.",
        "isPartOf": {
          "@id": "https://www.fhinspectionsatl.com/#website"
        },
        "breadcrumb": {
          "@id": "https://www.fhinspectionsatl.com/realtors/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.fhinspectionsatl.com/realtors/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.fhinspectionsatl.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Realtors",
            "item": "https://www.fhinspectionsatl.com/realtors"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="realtors-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
