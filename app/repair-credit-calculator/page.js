import Link from 'next/link';
import Script from 'next/script';
import GooglePreferredSource from '../components/GooglePreferredSource';
import DueDiligenceCalculator from '../components/DueDiligenceCalculator';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const metadata = {
  title: 'Home Inspection Repair Credit Calculator Atlanta GA | Foresight',
  description: 'Calculate home inspection repair costs with RSMeans 2026 data. Model Georgia seller closing credit requests and generate sample GAR Form F404 amendment wording.',
  keywords: [
    'home inspection repair credit calculator',
    'inspection repair cost calculator atlanta',
    'seller credit negotiator due diligence',
    'GAR amendment repair list inspection',
    'closing cost credit calculator home inspection',
    'georgia due diligence repair credit',
    'how much credit to ask for home inspection'
  ],
  alternates: { canonical: `${SITE_URL}/repair-credit-calculator` },
  openGraph: {
    title: 'Home Inspection Repair Credit Calculator Atlanta GA | Foresight',
    description: 'Price inspection defect outlays with RSMeans contractor data, formulate seller closing credit demands, and generate sample GAR amendment wording.',
    url: `${SITE_URL}/repair-credit-calculator`,
    type: 'website',
  },
};

const calculatorFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: `${SITE_URL}/repair-credit-calculator`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does a home inspection repair credit work in Georgia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In Georgia Association of Realtors (GAR) contracts, buyers can request a financial closing cost credit from the seller in lieu of physical repairs. The agreed credit is written into an Amendment to Address Concerns (GAR Form F404) and applied directly toward buyer closing costs, prepaids, or loan rate buydowns at closing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is a cash repair credit better than asking the seller to fix defects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When sellers agree to make repairs, they are incentivized to hire the cheapest available handyman, cut corners, or fail to pull required permits before closing. A cash closing credit allows the buyer to control contractor selection, supervise workmanship, and retain direct warranties after taking title.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get an official repair cost audit if I hired another home inspector?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Foresight Home Inspections offers a standalone $99 Due Diligence Repair Cost Audit. You can upload an inspection report from any outside inspection company, and our Certified Master Inspector team will extract contractor repair ranges and generate a structured GAR Form F404 exhibit within 4 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'What contractor cost index powers this repair credit calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our calculator utilizes RSMeans 2026 construction data calibrated with a 1.08x regional cost modifier specifically for the 87 municipalities across Metro Atlanta and North Georgia.',
      },
    },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Foresight Due Diligence & Repair Credit Negotiator',
  operatingSystem: 'All Web Browsers',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Foresight Home Inspections, LLC',
    url: SITE_URL,
  },
};

export default function RepairCreditCalculatorPage() {
  return (
    <>
      <Script
        id="repair-calculator-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorFaqSchema) }}
      />
      <Script
        id="repair-calculator-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <main style={{ backgroundColor: '#0B1120', color: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 1.5rem 0' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/due-diligence" style={{ color: '#94A3B8', textDecoration: 'none' }}>Due Diligence</Link>
            <span>/</span>
            <span style={{ color: '#D4AF37', fontWeight: 600 }}>Repair Credit Calculator</span>
          </nav>
        </div>

        {/* Hero Header */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '9999px', padding: '6px 14px', marginBottom: '1.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.78rem', color: '#FDE047', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'monospace' }}>
              Georgia Association of Realtors® (GAR) Due Diligence Protocol
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Home Inspection Repair Cost &amp; <br />
            <span style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Seller Closing Credit Calculator
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '820px', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Under contract on an Atlanta home with an inspection report full of defect findings? Quantify contractor repair outlays using RSMeans 2026 trade indices, formulate your optimal cash-in-lieu settlement, and generate sample <strong>GAR Form F404 (Amendment to Address Concerns)</strong> wording before your contingency deadline expires.
          </p>

          <GooglePreferredSource
            heading="Why Georgia Homebuyers Choose Cash Closing Credits Over Seller Repairs"
            summary="Under standard GAR contract stipulations, sellers obligated to perform repairs often select low-bid, unlicensed handymen to preserve their net proceeds. Securing an empirical closing credit allows buyers to choose certified, insured trade contractors after closing, retain transferable manufacturer warranties, and eliminate pre-closing repair re-inspection disputes."
          />
        </section>

        {/* The Core Interactive Calculator Engine */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <DueDiligenceCalculator />
        </section>

        {/* Strategic Authority & Educational Grid */}
        <section style={{ maxWidth: '1280px', margin: '4rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#D4AF37', fontWeight: 800, margin: '0 0 0.75rem' }}>
                1. Empirical Trade Cost Benchmarks
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                Every defect estimate is indexed to Metro Atlanta trade contractor averages—reflecting current regional labor rates (\$95–\$165/hr) across electrical, HVAC, plumbing, structural framing, and roofing trades.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#10B981', fontWeight: 800, margin: '0 0 0.75rem' }}>
                2. Cash-in-Lieu Closing Strategy
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                Negotiating an opening request at 85% of total contractor estimates and settling around 70–75% protects your transaction from falling apart while giving you cash at settlement to hire vetted trade specialists.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#38BDF8', fontWeight: 800, margin: '0 0 0.75rem' }}>
                3. Two-Inspector Due Diligence Advantage
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.55, margin: 0 }}>
                Foresight places two certified inspectors on every single property, delivering digital reports with FLIR thermal imaging within 24 hours to maximize your remaining negotiation runway.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Booking CTA Banner */}
        <section style={{ maxWidth: '1280px', margin: '4rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '16px', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.75rem' }}>
              Need an Empirical Report That Georgia Sellers Cannot Dispute?
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Online estimates give you a negotiation target, but contract enforcement requires verified evidence from a Certified Master Inspector. Book Foresight with 2 inspectors, FLIR thermal imaging, and guaranteed 24-hour turnaround.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/quote"
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B89628 100%)',
                  color: '#0F172A',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
              >
                Schedule Your Inspection (From $345) →
              </Link>
              <Link
                href="/due-diligence"
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none'
                }}
              >
                View Due Diligence Timeline Guide
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
