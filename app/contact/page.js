import Script from 'next/script';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us | Foresight Home Inspections | Lithonia & Atlanta, GA',
  description: 'Contact Foresight Home Inspections for expert Certified Master Inspector-led home inspections in Metro Atlanta. Call 678-480-2110 or use our online form to schedule your dual-inspector evaluation.',
  keywords: ['Contact Foresight Home Inspections', 'schedule home inspection Atlanta', 'book home inspector Lithonia GA', 'home inspection phone number Atlanta', 'inspect@foresightcmi.com'],
  alternates: { canonical: 'https://www.fhinspectionsatl.com/contact' },
  openGraph: {
    title: 'Contact Foresight Home Inspections',
    description: 'Reach Foresight Home Inspections — Atlanta\'s Certified Master Inspector-led dual home inspection team. Call 678-480-2110 or book online.',
    url: 'https://www.fhinspectionsatl.com/contact',
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      name: 'Contact Foresight Home Inspections',
      url: 'https://www.fhinspectionsatl.com/contact',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.fhinspectionsatl.com/#website',
      },
      description: 'Contact page for Foresight Home Inspections, LLC — Certified Master Inspector-led dual home inspections in Metro Atlanta, Georgia.',
      mainEntity: {
        '@type': 'HomeAndConstructionBusiness',
        '@id': 'https://www.fhinspectionsatl.com/#business',
        name: 'Foresight Home Inspections, LLC',
        telephone: '+1-678-480-2110',
        email: 'inspect@foresightcmi.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1816 South Deshon Road',
          addressLocality: 'Lithonia',
          addressRegion: 'GA',
          postalCode: '30058',
          addressCountry: 'US',
        },
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'], opens: '08:00', closes: '20:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '08:00', closes: '19:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:00', closes: '17:00', description: 'By appointment only' },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How quickly can I schedule an inspection?', acceptedAnswer: { '@type': 'Answer', text: 'In most cases, Foresight can schedule your inspection within 24-48 hours of booking. During peak season, we recommend booking 3-5 days in advance.' } },
        { '@type': 'Question', name: 'What areas does Foresight Home Inspections serve?', acceptedAnswer: { '@type': 'Answer', text: 'Foresight Home Inspections serves over 163 cities across Metro Atlanta and the state of Georgia.' } },
        { '@type': 'Question', name: 'How long does a home inspection take?', acceptedAnswer: { '@type': 'Answer', text: 'With two certified inspectors working simultaneously, a typical Foresight inspection takes approximately 1.5 to 2.5 hours.' } },
        { '@type': 'Question', name: 'Can I attend the inspection?', acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. We encourage all clients to attend. Our inspectors will walk you through key findings in real-time and answer any questions.' } },
      ],
    },
  ],
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
