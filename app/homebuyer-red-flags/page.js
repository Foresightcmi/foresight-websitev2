import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import SymptomTranslatorClient from './SymptomTranslatorClient';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const PAGE_URL = `${SITE_URL}/homebuyer-red-flags`;

export const metadata = {
  title: 'Atlanta Homebuyer Red Flags & Symptom Translator | Foresight',
  description:
    'Worried at 3:00 AM about musty crawlspace smells, brick cracks, ceiling patches, or new-build shortcuts? Translate plain-English Atlanta homebuyer symptoms into building science and $1,250–$14,200+ seller credit leverage.',
  keywords: [
    'homebuying red flags Atlanta',
    'musty crawlspace smell house Georgia',
    'stair step brick cracks Atlanta clay soil',
    'does new construction need home inspection Georgia',
    'Georgia due diligence repair credit leverage',
    'Foresight Home Inspections two inspector team',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: '3:00 AM Atlanta Homebuyer Red-Flag & Symptom Translator',
    description:
      'Filter plain-English red flags by symptom and buyer awareness stage to see how Foresight’s two-inspector CMI team uncovers $1,250–$14,200+ in Repair Amendment leverage from $345.',
    url: PAGE_URL,
    type: 'website',
  },
};

const BUYER_FAQS = [
  {
    q: 'Why does an Atlanta house smell musty near the crawlspace or basement?',
    a: 'Over 60% of vented Georgia crawlspaces exceed 19% wood moisture due to Piedmont clay ground vapor and poor drainage. Wood-decay fungi weaken floor joists while the stack effect pulls up to 50% of crawlspace air upward into living spaces. Remediation frequently costs $3,500–$12,000+.',
  },
  {
    q: 'Are stair-step brick cracks or sloping floors normal in Georgia homes?',
    a: 'Georgia shrink-swell Piedmont clay shifts dramatically between wet winters and dry summers. Minor hairline mortar shrinkage differs from progressive differential settlement or rotted rim joists behind moisture-trapping EIFS stucco. Two certified inspectors verify whether footing movement requires $4,200–$14,200+ in structural underpinning.',
  },
  {
    q: 'Should I worry about one freshly painted patch on a ceiling or near a chimney?',
    a: 'Yes. Over 80% of Georgia roof leaks originate at chimney counter-flashings, plumbing boots, and roof valleys, or above attic HVAC drain pans. Fresh localized drywall paint often conceals active moisture intrusion that calibrated infrared thermal cameras and 4K aerial drones expose without cutting drywall.',
  },
  {
    q: 'Does a brand-new house still need an independent inspection if the county passed code?',
    a: 'Yes. Municipal inspectors conduct brief life-safety spot checks, whereas builders routinely leave unsealed roof penetrations, over-bored floor joists behind drywall, missing attic insulation baffles, or reverse-wired circuits. Foresight offers Phase 1 Pre-Drywall From $275, Final New Construction From $400, and 11-Month Warranty From $345.',
  },
  {
    q: 'What if an older Atlanta home has a Federal Pacific panel or grey polybutylene pipes?',
    a: 'Federal Pacific Stab-Lok and Zinsco breakers exhibit a 25%–60% failure-to-trip rate, 1965–1973 aluminum branch wiring carries 55x outlet fire risk, and 1978–1995 grey Quest (PB2110) polybutylene plumbing oxidizes from municipal chlorine—frequently causing Georgia insurers to deny coverage until replaced ($1,800–$12,000+).',
  },
  {
    q: 'How can I negotiate $1,250–$14,200+ in seller credits during a 3–7 day Georgia due diligence window?',
    a: 'Waiting 48–72 hours for a solo inspector burns your negotiation runway. Foresight deploys two certified inspectors simultaneously for 2x diagnostic depth, delivers same-day interactive digital reports within 24 hours with a Digital Repair Request Builder, and lets you convert verified defects into closing credits using our Repair Credit Calculator.',
  },
];

export default function HomebuyerRedFlagsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: '3:00 AM Homebuyer Symptom & 4-Stage Awareness Translator | Foresight Home Inspections',
        description:
          'Interactive diagnostic translator turning plain-English Metro Atlanta homebuyer symptoms and 4 buyer awareness stages into building science clarity and Georgia Repair Amendment leverage.',
        dateCreated: '2026-11-16T08:00:00-05:00',
        dateModified: '2026-11-16T08:00:00-05:00',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#business` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#aeo-direct-answer', 'h1'],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: BUYER_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Script
        id="homebuyer-red-flags-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="bg-dark text-white"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '4.5rem 0 4rem',
          borderBottom: '3px solid var(--color-red)',
        }}
      >
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              marginBottom: '2rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                padding: '0.5rem 1.15rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/images/Logopng.png"
                alt="Foresight Home Inspections official logo"
                width={140}
                height={62}
                priority
                style={{ height: '54px', width: 'auto', objectFit: 'contain', filter: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
              <Image
                src="/images/cmi_logo.png"
                alt="Certified Master Inspector MICB-1082"
                width={110}
                height={110}
                priority
                style={{ height: '110px', width: 'auto', objectFit: 'contain' }}
              />
              <Image
                src="/images/cpi_logo.png"
                alt="InterNACHI Certified Professional Inspector NACHI18051119"
                width={100}
                height={100}
                priority
                style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--color-gold)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                marginBottom: '1rem',
              }}
            >
              3:00 AM Homebuyer Symptom &amp; 4-Stage Awareness Translator
            </span>

            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4.3vw, 3.15rem)', marginBottom: '1rem' }}>
              Atlanta Homebuyer <span style={{ color: 'var(--color-gold)' }}>Red Flags</span> &amp; Symptom Translator
            </h1>

            <p style={{ color: '#E2E8F0', fontSize: '1.12rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Noticed a musty basement, stair-step brick crack, ceiling paint patch, or short Georgia due diligence deadline? Filter what you saw in plain English below to uncover the building science and $1,250–$14,200+ in seller repair credit leverage—led by CMI Christopher Boykin (#MICB-1082, #NACHI18051119).
            </p>

            <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/repair-credit-calculator" className="btn btn-gold" style={{ padding: '0.9rem 1.75rem' }}>
                Estimate Repair Credit Leverage &rarr;
              </Link>
              <Link href="/quote" className="btn btn-outline-light" style={{ padding: '0.9rem 1.75rem' }}>
                Get Instant Quote (From $345)
              </Link>
              <Link href="/" className="btn btn-outline-light" style={{ padding: '0.9rem 1.35rem', color: '#FDE047', borderColor: 'rgba(212, 175, 55, 0.45)' }}>
                &larr; Home Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderLeft: '5px solid #2563EB',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem 2rem',
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#0F172A', margin: 0, fontWeight: 800 }}>
                What homebuying red flags should Atlanta buyers check before due diligence expires?
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: '#DBEAFE', color: '#1E40AF', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                BLUF Summary
              </span>
            </div>
            <p
              id="aeo-direct-answer"
              className="ai-citation-bluf"
              style={{ fontSize: '1.05rem', lineHeight: 1.65, color: '#1E293B', margin: 0, fontWeight: 500 }}
            >
              Musty crawlspaces, stair-step brick cracks, fresh ceiling patches, aging panels, grey Quest plumbing, and unverified new builds signal $1,250–$14,200+ in repairs. Foresight&rsquo;s two-inspector CMI team translates symptoms into Georgia Repair Amendment leverage from $345.
            </p>
          </div>

          <SymptomTranslatorClient />

          <div
            style={{
              marginTop: '3.5rem',
              background: '#0F172A',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem',
              border: '1px solid rgba(212, 175, 55, 0.35)',
            }}
          >
            <h2 style={{ color: '#FFFFFF', fontSize: '1.65rem', marginBottom: '1rem' }}>
              Pricing Transparency &amp; Two-Inspector CMI Protection
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.15rem' }}>Single-Family Homes: From $345</div>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>
                  Buyer, Pre-Listing, and 11-Month Builder Warranty. +$75 each for unfinished crawlspace, unfinished basement, or 50+ yr vintage. -$25 strictly for Verified Licensed Georgia Realtors only (active GREC License # required).
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.15rem' }}>Condos &amp; New Construction</div>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>
                  Condos &amp; Townhomes From $295 (&lt;= 1,000 sq ft = $295, &gt; 1,000 sq ft = $325). Phase 1 Pre-Drywall From $275; Final New Construction From $400 ($200 Repair Re-Inspection).
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.15rem' }}>Auxiliary &amp; Commercial Diagnostics</div>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>
                  Sewer Scope, Radon, Pool &amp; Spa, Termite/WDO, Mold &amp; Air Quality, STR Compliance, DeKalb Low-Flow, Commercial PCA, and Repair Cost Estimates: Call (678) 480-2110 for Quote.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.15rem' }}>4.8★ Reviews • $35,000 Backing</div>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: '0.4rem 0 0' }}>
                  53 Verified Google Reviews, active SUPRA eKEY, Sunday hours By Appointment Only, $10,000 Elite Master Warranty ($0 deductible) + $25,000 InterNACHI Honor Guarantee.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                Book Two-Inspector CMI Team &rarr;
              </a>
              <Link href="/repair-credit-calculator" className="btn btn-outline-light">
                Open Repair Credit Calculator &rarr;
              </Link>
              <Link href="/quote" className="btn btn-outline-light">
                Instant Pricing Calculator &rarr;
              </Link>
              <Link href="/about/christopher-boykin" className="btn btn-outline-light">
                Meet Christopher Boykin, CMI &rarr;
              </Link>
              <Link href="/" className="btn btn-outline-light">
                &larr; Atlanta Home Inspections Home
              </Link>
            </div>
          </div>

          <div style={{ maxWidth: '880px', margin: '3.5rem auto 0' }}>
            <h2 style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '1.5rem', color: '#0F172A' }}>
              3:00 AM Homebuyer Questions Answered by CMI Christopher Boykin
            </h2>
            {BUYER_FAQS.map((faq) => (
              <details key={faq.q} className="faq-item" style={{ background: '#FFFFFF' }}>
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
