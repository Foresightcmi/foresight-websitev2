import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Frequently Asked Questions | Foresight Home Inspections',
  description: 'Answers to common questions about our Atlanta home inspections, pricing, warranties, process, and more.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions | Foresight Home Inspections',
    description: 'Answers to common questions about our Atlanta home inspections, pricing, warranties, process, and more.',
    url: 'https://www.fhinspectionsatl.com/faq',
    siteName: 'Foresight Home Inspections',
    locale: 'en_US',
    type: 'website',
  },
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'Pricing & Booking',
      questions: [
        { q: 'How much does a home inspection cost in Atlanta?', a: 'Start at $295+ condos, $345+ homes. Add-ons: sewer scope $425, radon $200, pool $300, termite $110 bundled.' },
        { q: 'How do I book an inspection?', a: '24/7 online booking at schedulenow.homegauge.com, or call 678-480-2110.' },
        { q: 'Do you offer flat-rate pricing?', a: 'Yes, transparent flat-rate pricing based on sq ft, property age, and add-ons. Use /quote calculator.' },
        { q: 'What are your business hours?', a: 'Mon, Tue, Thu, Fri, Sat: 8AM-8PM. Wednesday: 8AM-7PM. Sunday: By Appointment. 24/7 online booking.' },
      ],
    },
    {
      category: 'Inspection Process',
      questions: [
        { q: 'Why do you send two inspectors?', a: 'Two certified inspectors split the work (exterior/interior), doubling coverage and cutting time to under 2.5 hours.' },
        { q: 'What does a home inspection include?', a: 'Roof, structure, foundation, HVAC, electrical, plumbing, appliances, water heater, insulation, ventilation, exterior, drainage. Plus FLIR thermal and drone scans included free.' },
        { q: 'How long does the inspection take?', a: 'Typically 2-3 hours for standard homes thanks to our dual-inspector model.' },
        { q: 'Will I receive photos in the report?', a: 'Yes, HD photos, thermal imaging captures, and drone footage are included.' },
        { q: 'How quickly do I get my report?', a: 'Within 24 hours of inspection completion.' },
      ],
    },
    {
      category: 'Warranty & Protection',
      questions: [
        { q: 'What does the $10,000 warranty cover?', a: 'Appliances (up to $2,250), structural ($2,250), mechanicals/HVAC/plumbing/electrical ($2,250), mold remediation, roof leaks ($1,000). $0 deductible. 90 days from closing.' },
        { q: 'Does the warranty cost extra?', a: 'No, it\'s complimentary with every standard buyer inspection.' },
        { q: 'What is a Certified Master Inspector?', a: 'CMI is the highest designation in North America. Christopher Boykin completed 1,000+ inspections, vetted by the Master Inspector Certification Board.' },
      ],
    },
    {
      category: 'Service Areas & Specialties',
      questions: [
        { q: 'What areas do you serve?', a: '163+ cities across Metro Atlanta including Fulton, DeKalb, Gwinnett, Cobb, Forsyth, Clayton, Henry, and Rockdale counties.' },
        { q: 'Do you inspect luxury and estate homes?', a: 'Yes, our Estate & Luxury Tier includes extended 4+ hour evaluation, CMI-led team, full drone scanning, and a private strategy call.' },
        { q: 'What add-on services do you offer?', a: 'Sewer scope ($425), radon gas testing ($200), pool/spa ($300), termite/WDO ($110 bundled), and more.' },
        { q: 'Do you offer free utility setup?', a: 'Yes, complimentary Utilities Plus concierge sets up all utilities (power, gas, water, internet, security) at best market rates.' },
      ],
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap(cat => cat.questions).map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <main>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--color-dark)', color: 'var(--color-white)', padding: '6rem 2rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Frequently Asked Questions</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-light)', lineHeight: '1.6' }}>
            Get quick answers to common questions about our inspection process, pricing, and services.
          </p>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section style={{ backgroundColor: 'var(--color-white)', padding: '5rem 2rem' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((cat, index) => (
            <div key={index} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-dark)' }}>{cat.category}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cat.questions.map((faq, qIndex) => (
                  <details key={qIndex} style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)' }}>
                    <summary style={{ 
                      fontWeight: '700', 
                      fontSize: '1.1rem', 
                      padding: '1.25rem', 
                      cursor: 'pointer', 
                      borderBottom: '1px solid #E2E8F0', 
                      color: 'var(--color-dark)',
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      {faq.q}
                      <span style={{ color: 'var(--color-gold)' }}>+</span>
                    </summary>
                    <div style={{ padding: '1rem 1.25rem', color: '#475569', lineHeight: '1.7' }}>
                      <p>{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ backgroundColor: 'var(--color-dark)', color: 'var(--color-white)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Still have questions?</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-light)', marginBottom: '2.5rem' }}>
            Our team is here to help. Reach out to us or ask our AI assistant, Twin.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-gold" style={{ padding: '1rem 2rem', backgroundColor: 'var(--color-gold)', color: 'var(--color-dark)', textDecoration: 'none', fontWeight: 'bold', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
              Contact Us
            </Link>
            <Link href="/ask-twin" className="btn btn-outline" style={{ padding: '1rem 2rem', border: '2px solid var(--color-white)', color: 'var(--color-white)', textDecoration: 'none', fontWeight: 'bold', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
              Ask Twin AI
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
