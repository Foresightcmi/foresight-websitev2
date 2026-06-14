import Script from 'next/script';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us',
  description: 'Contact Foresight Home Inspections for expert Certified Master Inspector-led home inspections in Metro Atlanta. Call 678-480-2110 or use our online form to schedule your dual-inspector evaluation.',
  alternates: { canonical: 'https://www.fhinspectionsatl.com/contact' },
  openGraph: {
    title: 'Contact Foresight Home Inspections',
    description: 'Reach Foresight Home Inspections — Atlanta\'s Certified Master Inspector-led dual home inspection team. Call 678-480-2110 or book online.',
    url: 'https://www.fhinspectionsatl.com/contact',
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Foresight Home Inspections',
  description: 'Contact page for Foresight Home Inspections, LLC — Certified Master Inspector-led dual home inspections in Metro Atlanta, Georgia.',
  url: 'https://www.fhinspectionsatl.com/contact',
  mainEntity: {
    '@type': 'HomeAndConstructionBusiness',
    '@id': 'https://www.fhinspectionsatl.com/#business',
    name: 'Foresight Home Inspections, LLC',
    telephone: '678-480-2110',
    email: 'inspect@foresightcmi.com',
  },
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}
