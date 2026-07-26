import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadDefects() {
  const filePath = path.join(process.cwd(), 'data', 'defects-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function generateStaticParams() {
  const defects = loadDefects();
  return defects.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const defects = loadDefects();
  const defect = defects.find(d => d.slug === resolvedParams.slug);

  if (!defect) {
    return { title: 'Defect Audit Not Found' };
  }

  const canonicalUrl = `${SITE_URL}/defects/${resolvedParams.slug}`;

  return {
    title: defect.metaTitle,
    description: defect.metaDescription,
    keywords: [
      defect.title.toLowerCase(),
      `${defect.slug.replace(/-/g, ' ')} Atlanta`,
      `home inspection ${defect.slug.replace(/-/g, ' ')}`,
      `certified master inspector Georgia ${defect.slug.replace(/-/g, ' ')}`
    ],
    openGraph: {
      title: defect.metaTitle,
      description: defect.metaDescription,
      url: canonicalUrl,
      type: 'article',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DefectPage({ params }) {
  const resolvedParams = await params;
  const defects = loadDefects();
  const defect = defects.find(d => d.slug === resolvedParams.slug);

  if (!defect) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/defects/${resolvedParams.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": defect.title,
    "description": defect.metaDescription,
    "url": canonicalUrl,
    "author": {
      "@type": "Person",
      "name": "Christopher Boykin",
      "jobTitle": "Certified Master Inspector",
      "honorificSuffix": "CMI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Foresight Home Inspections, LLC",
      "url": SITE_URL
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": defect.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="container" style={{ paddingTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-gray)' }}>
        <Link href="/" style={{ color: 'var(--color-red)' }}>Home</Link> &nbsp;/&nbsp;
        <Link href="/services" style={{ color: 'var(--color-red)' }}>Services</Link> &nbsp;/&nbsp;
        <span>{defect.title}</span>
      </div>

      {/* Hero Section */}
      <section className="hero" style={{ padding: '4rem 0 4.5rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {defect.icon} {defect.badge}
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            {defect.title}
          </h1>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>
            {defect.summary}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              📅 Schedule Inspection Audit
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}
              data-call-source={`defect_${defect.slug}`}
            >
              📞 Call Inspector: 678-480-2110
            </a>
          </div>
        </div>
      </section>

      {/* Identification & Hazards */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '850px' }}>
          
          {/* AEO Direct Answer Block for Search Engine AI Overviews */}
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '2px solid #e2e8f0', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚡ Quick Definition: What is {defect.title}?
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155', margin: 0, fontWeight: 500 }}>
              {defect.summary} In Metro Atlanta residential property inspections, identifying {defect.title.toLowerCase()} early prevents severe structural degradation, water damage, and un-budgeted repair costs before closing.
            </p>
          </div>

          <div style={{ background: 'var(--color-gray-light)', padding: '2rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-red)', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-dark)' }}>
              🔍 How to Identify This Defect in Georgia Homes
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', margin: 0 }}>
              {defect.identification}
            </p>
          </div>

          <h2 style={{ fontSize: '1.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Critical Property & Financial Risks
          </h2>
          <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
            {defect.risks.map((risk, i) => (
              <div key={i} className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '1.5rem', borderTop: '4px solid var(--color-red)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>⚠️</span>
                <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                  {risk}
                </p>
              </div>
            ))}
          </div>

          {/* How Foresight Inspects It */}
          <div className="card card-premium" style={{ background: 'var(--color-dark)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', textAlign: 'center' }}>
              🛡️ How Foresight Inspects & Detects This Defect
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.1rem', lineHeight: 1.7, textAlign: 'center', margin: '0 auto 1.5rem', maxWidth: '750px' }}>
              {defect.howWeInspect}
            </p>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: 'var(--color-white)', margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                ⚡ Every inspection includes two certified inspectors, FLIR thermal imaging, and our $10,000 Elite Warranty with $0 deductible.
              </p>
            </div>
          </div>

          {/* Remediation & Negotiation */}
          <div style={{ background: 'white', border: '1px solid var(--color-gray-mid)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-dark)' }}>
              🛠️ Repair & Buyer Negotiation Strategy
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', margin: 0 }}>
              {defect.remediation}
            </p>
          </div>

          {/* FAQ Section */}
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ marginBottom: '3rem' }}>
            {defect.faqs.map((faq, i) => (
              <details
                key={i}
                style={{
                  border: '1px solid var(--color-gray-mid)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--color-gray-light)',
                }}
              >
                <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', color: 'var(--color-dark)' }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.7, color: 'var(--color-gray-dark)', fontSize: '0.975rem' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          {/* Call to Action Card */}
          <div className="card card-premium" style={{ textCenter: 'center', textAlign: 'center', background: 'var(--color-red-light)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-red)' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-dark)', marginBottom: '0.75rem' }}>
              Protect Your Home Investment with Foresight
            </h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', marginBottom: '1.5rem', maxWidth: '650px', margin: '0 auto 1.5rem' }}>
              Don't leave major defects to guesswork. Book Atlanta's lead Certified Master Inspector team today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                Schedule Inspection Online
              </a>
              <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
                Get Instant Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
