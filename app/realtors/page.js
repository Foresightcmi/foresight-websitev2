import Script from 'next/script';
import RealtorsClient from './RealtorsClient';

export const metadata = {
  title: 'Realtor VIP Partner Program',
  description: 'Join Foresight Home Inspections\' exclusive Realtor VIP Program. SUPRA lockbox access, priority scheduling, and $10,000 warranty protection for your buyers. Serving 163+ Metro Atlanta cities.',
  alternates: { canonical: 'https://www.fhinspectionsatl.com/realtors' },
  openGraph: {
    title: 'Realtor VIP Partner Program | Foresight Home Inspections',
    description: 'Close transactions faster with Foresight\'s dual-inspector team. SUPRA access, CMI-led inspections, and $10,000 warranty included.',
    url: 'https://www.fhinspectionsatl.com/realtors',
  },
};

const realtorsFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do we coordinate SUPRA lockbox entry?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Foresight is fully integrated with active Metro Atlanta board memberships and carries active SUPRA eKEY access. You simply schedule the inspection and enter the SUPRA lockbox serial number or property address. We will obtain keys directly, perform the inspection, and securely relock the home.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long do your dual inspections take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because we send two fully-certified inspectors to every job, we complete the physical scanning in approximately 1.5 to 2.5 hours depending on size. This is nearly half the time a standard single inspector requires, helping minimize inconvenience to listing sellers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the complimentary Utilities Plus service benefit agents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Utility setup is one of the most stressful parts of moving. By offering your buyers complimentary access to Utilities Plus through Foresight, we take that burden off their plate. Your buyers receive absolute white-glove treatment to connect their water, gas, power, internet, and home security, which reflects incredibly well on you as their agent.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if a defect is found after closing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every standard buyer inspection we conduct is backed by a complimentary $10,000 Elite Master Inspection Warranty with $0 deductible. If a major covered appliance, structural component, major HVAC/plumbing element, or roof leak manifests within 90 days of closing (or 120 days of inspection), your client is financially protected. This dramatically reduces post-closing conflict for the real estate agent!',
      },
    },
  ],
};

export default function RealtorsPage() {
  return (
    <>
      <Script
        id="realtors-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realtorsFaqSchema) }}
      />
      <RealtorsClient />
    </>
  );
}
