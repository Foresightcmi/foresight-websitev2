import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Atlanta Home Inspection FAQs & Costs | From $345',
  description: 'Get direct answers on Atlanta home inspection costs, our InterNACHI 2-inspector process, up to $35,000 in warranty & guarantee protection, and Sunday appointments. Pricing from $345!',
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
  let colonyData = null;
  try {
    const colonyPath = path.join(process.cwd(), 'data', 'seo-colony-matrix.json');
    if (fs.existsSync(colonyPath)) {
      colonyData = JSON.parse(fs.readFileSync(colonyPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading colony matrix:', e);
  }

  const faqs = [
    {
      category: 'Pricing & Booking',
      questions: [
        { q: 'How much does a home inspection cost in Atlanta?', a: 'Start at $295+ condos, $345+ homes. Add-ons: sewer scope $450, radon $250, pool $275, termite $125+.' },
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
        { q: 'How quickly do I get my report?', a: 'Most of the time the very same day, and definitely within 24 hours of inspection completion.' },
      ],
    },
    {
      category: 'Warranty & Protection',
      questions: [
        { q: 'What warranties and guarantees are included with an inspection?', a: 'Every standard buyer inspection includes up to $35,000 in combined protection: (1) Our $10,000 Elite Master Inspection Warranty ($0 deductible, 90 days) covering appliances ($2,250), structural ($2,250), HVAC/plumbing/electrical ($2,250), mold remediation ($2,250), and roof leaks ($1,000); and (2) InterNACHI\'s $25,000 Honor Guarantee backing member integrity with up to $25,000 in property replacement.' },
        { q: 'What is a Certified Master Inspector (CMI®) and why is it crucial in Georgia?', a: 'Georgia has zero state licensing requirements for home inspectors—anyone can legally buy a flashlight and inspect a property without passing an exam. A Certified Master Inspector® (CMI) is the highest professional designation in North America, awarded by the Master Inspector Certification Board only to inspectors with 1,000+ verified fee-paid inspections, years of field experience, a clean criminal record, and continuous peer-reviewed education. Christopher Boykin is a board-certified CMI (top 1% to 3% nationwide).' },
        { q: 'What are the two possibilities when hiring a home inspector in Georgia?', a: 'Because Georgia does not license inspectors, buyers face two distinct possibilities: Possibility A is the Unvetted Solo Inspector Gamble—an unregulated solo operator working alone for 4+ hours, suffering inspection fatigue, skipping thermal imaging, delivering a slow 48–72 hour report that burns your due diligence period, and offering $0 warranty. Possibility B is the Certified Master Inspector Dual-Team Standard—Foresight dispatches two certified inspectors led by a board-certified CMI, cutting on-site time to 1.5–2.5 hours with zero fatigue, including complimentary FLIR thermal imaging and 4K drone scans, same-day reporting with 1-click GAR repair list generation, and up to $35,000 in combined warranty and guarantee protection.' },
      ],
    },
    {
      category: 'Service Areas & Specialties',
      questions: [
        { q: 'What areas do you serve?', a: '163+ cities across Metro Atlanta including Fulton, DeKalb, Gwinnett, Cobb, Forsyth, Clayton, Henry, and Rockdale counties.' },
        { q: 'Do you inspect luxury and estate homes?', a: 'Yes, our Estate & Luxury Tier includes extended 4+ hour evaluation, CMI-led team, full drone scanning, and a private strategy call.' },
        { q: 'What add-on services do you offer?', a: 'Sewer scope ($450), radon gas testing ($250), pool/spa ($275), termite/WDO ($125+), and more.' },
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

      {/* TOPICAL AUTHORITY COLONY HUB (EDWARD STURM METHODOLOGY) */}
      {colonyData && colonyData.colonies && (
        <section style={{ backgroundColor: '#f8fafc', padding: '5rem 2rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ backgroundColor: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                InterNACHI CMI Topical Authority Directory
              </span>
              <h2 style={{ fontSize: '2.4rem', marginTop: '1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                🏰 Deep-Dive Inspection Authority Colonies
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
                Detailed forensic answers to critical Georgia contract, building science, and environmental questions. Each guide funnels directly into actionable due diligence tools.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '2rem' }}>
              {colonyData.colonies.map((colony) => {
                const colonyQuestions = colonyData.questions.filter(q => q.colonyId === colony.id);
                return (
                  <div key={colony.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {colony.category}
                        </span>
                        <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>
                          {colonyQuestions.length} Guides
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)' }}>
                        {colony.name}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5', margin: '0 0 1.25rem' }}>
                        {colony.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                        {colonyQuestions.map((q) => (
                          <Link 
                            key={q.slug} 
                            href={`/faq/${q.slug}`}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#334155', textDecoration: 'none', fontSize: '0.9rem', lineHeight: '1.4', padding: '0.4rem 0.5rem', borderRadius: '6px', backgroundColor: '#f8fafc', transition: 'background-color 0.15s ease' }}
                          >
                            <span style={{ color: '#0284c7', fontWeight: 700 }}>•</span>
                            <span style={{ fontWeight: 600 }}>{q.question}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <Link 
                        href={colony.primaryMoneyPage.url}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        <span>Target Solution: {colony.primaryMoneyPage.name}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section style={{ backgroundColor: 'var(--color-dark)', color: 'var(--color-white)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Still have questions?</h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-gray-light)', marginBottom: '2.5rem' }}>
            Our team is here to help. Reach out to us or connect directly with Christopher Boykin, CMI® via our Live Concierge.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-gold" style={{ padding: '1rem 2rem', backgroundColor: 'var(--color-gold)', color: 'var(--color-dark)', textDecoration: 'none', fontWeight: 'bold', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
              Contact Us
            </Link>
            <Link href="/concierge" className="btn btn-outline" style={{ padding: '1rem 2rem', border: '2px solid var(--color-white)', color: 'var(--color-white)', textDecoration: 'none', fontWeight: 'bold', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
              Live Concierge Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
