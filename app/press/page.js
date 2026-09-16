import Script from 'next/script';
import PressClient from './PressClient';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Press & Media Kit | Christopher Boykin CMI | Atlanta Building Science Expert',
  description: 'Official media room for Christopher Boykin, Certified Master Inspector® and founder of Foresight Home Inspections. Expert quotes, research, and analysis on Georgia real estate, due diligence, and building science.',
  keywords: [
    'Christopher Boykin CMI press kit',
    'Atlanta real estate expert source',
    'building science expert Georgia',
    'home inspection media quotes',
    'due diligence expert Atlanta',
    'radon red clay building expert'
  ],
  alternates: {
    canonical: `${SITE_URL}/press`,
  },
  openGraph: {
    title: 'Press & Media Center | Christopher Boykin CMI | Foresight Home Inspections',
    description: 'Expert commentary, on-record quotes, and media resources on Georgia building science, real estate contracts, and home safety.',
    url: `${SITE_URL}/press`,
    type: 'website',
  },
};

const pressSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/press#christopher-boykin`,
      name: 'Christopher Boykin',
      jobTitle: 'Certified Master Inspector',
      honorificSuffix: 'CMI',
      description: 'Founder and lead Certified Master Inspector at Foresight Home Inspections, LLC. Expert source for Southeastern building science, residential safety diagnostics, and Georgia real estate contract due diligence.',
      url: `${SITE_URL}/about`,
      telephone: '+1-678-480-2110',
      email: 'inspect@foresightcmi.com',
      image: `${SITE_URL}/images/Christopher_Boykin.jpg`,
      worksFor: {
        '@type': 'HomeAndConstructionBusiness',
        name: 'Foresight Home Inspections, LLC',
        url: SITE_URL,
        telephone: '+1-678-480-2110',
      },
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Professional Certification',
          name: 'Certified Master Inspector (CMI)',
          recognizedBy: {
            '@type': 'Organization',
            name: 'Master Inspector Certification Board',
          },
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Professional Certification',
          name: 'Certified Professional Inspector (CPI)',
          recognizedBy: {
            '@type': 'Organization',
            name: 'InterNACHI',
          },
        },
      ],
      knowsAbout: [
        'Residential Building Science',
        'Georgia Red Clay Foundation Dynamics',
        'Polybutylene Plumbing Hazards',
        'Radon Gas in North Georgia Granite Bedrock',
        'Crawlspace Moisture and Mold Remediation',
        'GAR Contract Due Diligence Timelines',
        'Thermal Imaging Diagnostic Inspections',
        'Sewer Lateral Video Inspections'
      ],
    },
    {
      '@type': 'ContactPoint',
      '@id': `${SITE_URL}/press#media-contact`,
      contactType: 'press inquiries',
      telephone: '+1-678-480-2110',
      email: 'inspect@foresightcmi.com',
      availableLanguage: ['en'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        opens: '08:00',
        closes: '20:00'
      }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Press & Media Kit',
          item: `${SITE_URL}/press`,
        },
      ],
    },
  ],
};

export default function PressPage() {
  return (
    <>
      <Script
        id="press-schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }}
      />
      <PressClient />
    </>
  );
}
