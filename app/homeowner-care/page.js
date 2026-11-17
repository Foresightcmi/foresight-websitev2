import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

const SITE_URL = 'https://www.fhinspectionsatl.com';
const PAGE_URL = `${SITE_URL}/homeowner-care`;

export const metadata = {
  title: 'Post-Closing Homeowner Care & 11-Month Warranty Hub | Foresight',
  description:
    'Metro Atlanta homeowner maintenance checklist, $35,000 combined protection guide ($10,000 Elite Warranty $0 deductible + $25,000 InterNACHI Honor Guarantee), Free Utilities Plus Setup, and Month-11 Builder Warranty Inspections From $345.',
  keywords: [
    'Atlanta homeowner maintenance checklist',
    '11 month builder warranty inspection Atlanta',
    'Foresight Elite Master Warranty 10000',
    'crawlspace humidity Georgia 60 percent',
    'Piedmont red clay downspout grading',
    'Free Utilities Plus Concierge Setup',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Post-Closing Homeowner Care & 11-Month Warranty Hub | Foresight',
    description:
      'Protect your Metro Atlanta investment after closing day with seasonal Piedmont clay & crawlspace maintenance, $35,000 combined protection, Free Utilities Plus setup, and Month-11 Builder Warranty evaluations From $345.',
    url: PAGE_URL,
    type: 'website',
  },
};

const SEASONAL_CHECKLIST = [
  {
    season: 'SPRING',
    title: 'Piedmont Red-Clay Gutter & Downspout Grading',
    focus: 'Exterior Drainage & Roof Transitions',
    items: [
      'Extend every downspout 6–10 feet away from foundation walls using splash blocks or solid drain pipe.',
      'Confirm soil around the perimeter slopes downward (roughly 6 inches over the first 10 feet) so Piedmont clay never pools against footings.',
      'Clear winter leaves from roof valleys and gutter troughs, and verify chimney counter-flashings and rubber pipe boots after spring storms.',
    ],
  },
  {
    season: 'SUMMER',
    title: 'Crawlspace Humidity (<60% RH) & Condensation Control',
    focus: 'Subfloor Air Quality & Vapor Science',
    items: [
      'Monitor crawlspace relative humidity to keep levels strictly under 60% RH and wood moisture below 19% WME.',
      'Verify continuous 6-mil or 12-mil vapor barrier seams remain taped and undisturbed around plumbing chases.',
      'Flush HVAC condensate drain lines with vinegar monthly and confirm emergency pan float switches operate smoothly.',
    ],
  },
  {
    season: 'FALL',
    title: 'HVAC Delta-T, Filter & Heat Exchanger Check',
    focus: 'Heating Readiness & Indoor Safety',
    items: [
      'Verify supply-to-return HVAC temperature differential (Delta-T) and swap pleated air filters before heating season peaks.',
      'Schedule annual gas furnace inspection for flame quality, exhaust flue draft, and hairline heat exchanger fatigue on units 10+ years old.',
      'Test smoke detectors and install fresh batteries in dual-sensor carbon monoxide alarms near every sleeping corridor.',
    ],
  },
  {
    season: 'WINTER',
    title: 'Hose-Bib Freeze Protection & Attic Checks',
    focus: 'Freeze Prevention & Thermal Envelope',
    items: [
      'Disconnect all exterior garden hoses before the first freeze and snap insulated covers onto exterior hose bibs.',
      'Check exposed crawlspace, garage, and attic water lines for pipe insulation continuity and ensure interior shut-off valves turn cleanly.',
      'Inspect attic soffit baffles and door weatherstripping during cold snaps to limit heat loss and roof decking condensation.',
    ],
  },
];

const HOMEOWNER_FAQS = [
  {
    q: 'How does Foresight’s $35,000 combined warranty and guarantee protection work after closing?',
    a: 'Every primary residential inspection led by CMI Christopher Boykin includes our $10,000 Elite Master Inspection Warranty ($0 deductible, active 90 days from closing or 120 days from inspection, covering up to $2,250 per mechanical/appliance/structural category, up to $2,250 mold remediation, and up to $1,000 roof leak protection) plus InterNACHI’s $25,000 Honor Guarantee.',
  },
  {
    q: 'When should new-build homeowners schedule an 11-Month Builder Warranty Inspection?',
    a: 'Book your Month-11 Builder Warranty Inspection during Month 10 or early Month 11—2 to 4 weeks before your builder’s 365-day coverage expires. Starting From $345 for single-family homes (From $295 condos/townhomes), our two certified inspectors deliver a photo-documented digital punch list with calibrated infrared thermal and 4K aerial drone scans.',
  },
  {
    q: 'Why does crawlspace humidity below 60% matter so much in Metro Atlanta?',
    a: 'When humid Georgia summer air enters vented crawlspaces, wood joists absorb moisture above 19% WME—supporting wood-decay fungi and musty indoor odors via the stack effect. Keeping relative humidity below 60% protects subfloor framing and indoor air quality.',
  },
  {
    q: 'How do I claim my Free Utilities Plus Concierge Setup after booking?',
    a: 'Every paid Foresight inspection automatically receives a VIP email introduction to Utilities Plus Concierge ($150 value at zero cost). One phone call compares local rates and connects electricity, gas, water, trash, and high-speed internet prior to move-in.',
  },
  {
    q: 'How can past clients or Atlanta homeowners refer friends or schedule follow-up checks?',
    a: 'Share our 3:00 AM Homebuyer Red-Flag Translator (/homebuyer-red-flags) with friends shopping in Metro Atlanta, leave feedback via our Verified Google Review link (4.8★ across 53 Verified Google Reviews), or call (678) 480-2110 for Repair Re-Inspections ($200) or custom quotes on Radon, Sewer Scope, Mold & Air Quality, Pool & Spa, or Termite/WDO testing. Sunday hours are By Appointment Only.',
  },
];

export default function HomeownerCarePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Post-Closing Homeowner Care & 11-Month Warranty Hub | Foresight Home Inspections',
        description:
          'Post-closing Metro Atlanta home care checklist, $35,000 combined warranty protection guide, Month-11 Builder Warranty inspections From $345, Free Utilities Plus Concierge setup, and homeowner ambassador resources.',
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
        mainEntity: HOMEOWNER_FAQS.map((item) => ({
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
        id="homeowner-care-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="bg-dark text-white"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '4.5rem 0 4rem',
          borderBottom: '3px solid var(--color-gold)',
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
              Post-Closing Hourglass Lifecycle &amp; 11-Month Warranty Hub
            </span>

            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 4.3vw, 3.15rem)', marginBottom: '1rem' }}>
              Metro Atlanta <span style={{ color: 'var(--color-gold)' }}>Homeowner Care</span> &amp; Warranty Protection
            </h1>

            <p style={{ color: '#E2E8F0', fontSize: '1.12rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Closing day is only the start of our partnership with Georgia homeowners and past Realtor clients. Protect your home equity year-round with seasonal Piedmont red-clay &amp; humidity guidance, $35,000 in included protection, Free Utilities Plus setup, and Month-11 Builder Warranty evaluations From $345.
            </p>

            <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/services/11-month-warranty-inspection" className="btn btn-gold" style={{ padding: '0.9rem 1.75rem' }}>
                Book 11-Month Warranty Inspection (From $345) &rarr;
              </Link>
              <Link href="/free-utility-setup" className="btn btn-outline-light" style={{ padding: '0.9rem 1.75rem' }}>
                Activate Free Utilities Setup
              </Link>
              <Link href="/" className="btn btn-outline-light" style={{ padding: '0.9rem 1.35rem', color: '#FDE047', borderColor: 'rgba(212, 175, 55, 0.45)' }}>
                &larr; Home Hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderLeft: '5px solid var(--color-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem 2rem',
              marginBottom: '3rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#0F172A', margin: 0, fontWeight: 800 }}>
                How should Metro Atlanta homeowners protect their home after closing day?
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                BLUF Summary
              </span>
            </div>
            <p
              id="aeo-direct-answer"
              className="ai-citation-bluf"
              style={{ fontSize: '1.05rem', lineHeight: 1.65, color: '#1E293B', margin: 0, fontWeight: 500 }}
            >
              After closing, Metro Atlanta homeowners should follow a four-season Piedmont clay and humidity maintenance checklist, activate their $35,000 combined Foresight warranty protection, connect utilities free via Utilities Plus, and schedule an 11-Month Builder Warranty Inspection from $345.
            </p>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
              <span className="badge" style={{ marginBottom: '0.75rem' }}>Pillar 1 &bull; Seasonal Maintenance</span>
              <h2 style={{ fontSize: '2.1rem', color: '#0F172A', marginBottom: '0.75rem' }}>
                Metro Atlanta 4-Season Home Protection Checklist
              </h2>
              <p style={{ color: 'var(--color-gray-dark)', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem' }}>
                Built specifically for Georgia’s heavy spring storms, humid crawlspaces, peak summer HVAC demand, and hard winter freezes.
              </p>
            </div>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              {SEASONAL_CHECKLIST.map((block) => (
                <div key={block.season} className="card card-premium" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--color-red)', background: 'var(--color-red-light)', padding: '0.25rem 0.7rem', borderRadius: '9999px' }}>
                      {block.season}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>{block.focus}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '1rem' }}>{block.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem', color: '#334155', fontSize: '0.95rem' }}>
                    {block.items.map((pt) => (
                      <li key={pt} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                        <span style={{ color: '#15803D', fontWeight: 800 }}>✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              marginBottom: '3.5rem',
              border: '1px solid rgba(212, 175, 55, 0.4)',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2rem' }}>
              <span className="badge" style={{ marginBottom: '0.75rem' }}>Pillar 2 &bull; Included Client Protection</span>
              <h2 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '0.75rem' }}>
                Your Included <span style={{ color: 'var(--color-gold)' }}>$35,000</span> Protection Guide
              </h2>
              <p style={{ color: '#CBD5E1', fontSize: '1.02rem', margin: 0 }}>
                Because Foresight is led by Certified Master Inspector Christopher Boykin (CMI #MICB-1082, InterNACHI #NACHI18051119, Member #176873), every primary inspection includes two independent protection tiers at zero added charge.
              </p>
            </div>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-gold)', marginBottom: '0.4rem' }}>
                  TIER 1 &bull; $0 DEDUCTIBLE
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                  $10,000 Elite Master Inspection Warranty
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#E2E8F0', fontSize: '0.94rem' }}>
                  <li>✓ Active for 90 days from closing or 120 days from inspection date</li>
                  <li>✓ Up to $2,250 each for appliances, mechanicals (HVAC/electrical/plumbing), and structural components</li>
                  <li>✓ Up to $2,250 for mold remediation and $1,000 for roof leak protection</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 'var(--radius-md)', padding: '1.75rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38BDF8', marginBottom: '0.4rem' }}>
                  TIER 2 &bull; INTERNACHI MEMBER BACKING
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                  $25,000 InterNACHI Honor Guarantee
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#E2E8F0', fontSize: '0.94rem' }}>
                  <li>✓ Backed directly by InterNACHI (Member #176873 / CPI #NACHI18051119)</li>
                  <li>✓ Protects personal property inside occupied or staged homes during inspection access</li>
                  <li>✓ Active SUPRA eKEY lockbox accountability and Sunday hours By Appointment Only</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem', marginBottom: '3.5rem' }}>
            <div className="card" style={{ borderTop: '5px solid var(--color-red)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge" style={{ marginBottom: '0.75rem' }}>Pillar 3 &bull; New-Build Deadline</span>
                <h2 style={{ fontSize: '1.55rem', color: '#0F172A', marginBottom: '0.75rem' }}>
                  New-Build Homeowners: Month-11 Builder Warranty Inspection (From $345)
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.65, marginBottom: '1rem' }}>
                  Seasonal temperature swings and settling in your first year expose grading erosion, unsealed roof flashings, drywall nail pops, and HVAC airflow imbalances. Before Day 365 shuts your builder warranty window—turning $1,250–$14,200+ in hidden defects into your bill—our two-inspector team delivers a photo-verified punch list (Single-Family From $345, Condos/Townhomes From $295, $200 Repair Re-Inspection).
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/services/11-month-warranty-inspection" className="btn btn-primary">
                  11-Month Warranty Service Details &rarr;
                </Link>
                <Link href="/quote" className="btn btn-outline">
                  Instant Quote
                </Link>
              </div>
            </div>

            <div className="card" style={{ borderTop: '5px solid var(--color-gold)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', marginBottom: '0.75rem' }}>Pillar 4 &bull; Included $150 Value</span>
                <h2 style={{ fontSize: '1.55rem', color: '#0F172A', marginBottom: '0.75rem' }}>
                  Free Utilities Plus Concierge Setup
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.65, marginBottom: '1rem' }}>
                  Skip waiting on hold with five utility companies during closing week. Every Foresight client receives a complimentary VIP introduction to Utilities Plus Concierge so one quick phone call compares local rates and connects electricity, gas, water, trash, and high-speed internet before move-in day.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/free-utility-setup" className="btn btn-gold">
                  Open Free Utility Concierge Guide &rarr;
                </Link>
                <Link href="/repair-credit-calculator" className="btn btn-outline">
                  Repair Credit Calculator
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#F8FAFC',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              marginBottom: '3.5rem',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2rem' }}>
              <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', marginBottom: '0.75rem' }}>
                Pillar 5 &bull; Homeowner Ambassador &amp; Review Dock
              </span>
              <h2 style={{ fontSize: '1.9rem', color: '#0F172A', marginBottom: '0.65rem' }}>
                Share Your Experience or Help a Friend Buying in Metro Atlanta
              </h2>
              <p style={{ color: '#334155', fontSize: '1rem', margin: 0 }}>
                Foresight holds 4.8★ across 53 Verified Google Reviews across 87 Metro Atlanta cities. Leave a review for our two-inspector team or pass along our free 3:00 AM red-flag guide to buyers in your circle. (Verified Licensed Georgia Realtors with active GREC License # receive a -$25 courtesy discount.)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://g.page/r/CaK5MZOz_FBtEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ padding: '0.95rem 1.85rem' }}
              >
                Leave a Verified Google Review (4.8★ / 53 Reviews) &rarr;
              </a>
              <Link href="/homebuyer-red-flags" className="btn btn-outline" style={{ padding: '0.95rem 1.5rem' }}>
                Share /homebuyer-red-flags With Friends Buying in Atlanta &rarr;
              </Link>
              <Link href="/about/christopher-boykin" className="btn btn-outline" style={{ padding: '0.95rem 1.5rem' }}>
                Christopher Boykin, CMI Bio &amp; CV &rarr;
              </Link>
              <Link href="/" className="btn btn-outline" style={{ padding: '0.95rem 1.5rem' }}>
                &larr; Atlanta Home Inspections Home
              </Link>
            </div>
          </div>

          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '1.5rem', color: '#0F172A' }}>
              Post-Closing Homeowner &amp; Warranty FAQs
            </h2>
            {HOMEOWNER_FAQS.map((faq) => (
              <details key={faq.q} className="faq-item" style={{ background: '#F8FAFC' }}>
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
