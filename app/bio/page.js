import BioClient from './BioClient';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Official VIP Links & Quick Access | Foresight Home Inspections Atlanta',
  description: 'Instant access to Foresight Home Inspections: 60-Second Instant Quote Engine, Georgia Property Risk Scanner, Sample Reports, 5-Star Reviews & direct Certified Master Inspector contact.',
  keywords: [
    'Foresight Home Inspections Link in Bio',
    'Atlanta home inspection quote',
    'Christopher Boykin CMI',
    'Georgia property risk scanner',
    'Atlanta home inspector phone number',
    'Two certified inspectors Atlanta',
    'Home inspection warranty Atlanta',
    'Foresight Instagram link',
    'Foresight TikTok link'
  ],
  alternates: { canonical: `${SITE_URL}/bio` },
  openGraph: {
    title: 'Foresight Home Inspections | Official VIP Quick Links',
    description: 'Two Certified Inspectors on Every Job. Calculate instant inspection pricing, scan property age risks, view sample reports, or call direct.',
    url: `${SITE_URL}/bio`,
    siteName: 'Foresight Home Inspections',
    type: 'profile',
    images: [
      {
        url: `${SITE_URL}/images/Christopher_Boykin.webp`,
        width: 800,
        height: 800,
        alt: 'Christopher Boykin Certified Master Inspector'
      }
    ]
  },
};

const bioSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'HomeAndConstructionBusiness',
    name: 'Foresight Home Inspections',
    url: SITE_URL,
    image: `${SITE_URL}/images/Christopher_Boykin.webp`,
    telephone: '+1-678-480-2110',
    priceRange: '$275 - $895',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Atlanta',
      addressRegion: 'GA',
      addressCountry: 'US'
    },
    founder: {
      '@type': 'Person',
      name: 'Christopher Boykin',
      jobTitle: 'Certified Master Inspector® (CMI)',
      knowsAbout: [
        'InterNACHI Standards of Practice',
        'Building Science',
        'FLIR Thermal Infrared Diagnostics',
        'FAA Part 107 Commercial Drone Aerial Inspection',
        'EPA Radon Zone 1 Electronic CRM Testing'
      ]
    }
  }
};

export default function BioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bioSchema) }}
      />
      <BioClient />
    </>
  );
}
