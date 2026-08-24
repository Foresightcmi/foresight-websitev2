import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import GooglePreferredSource from '../../components/GooglePreferredSource';

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
  const relatedDefects = defects.filter(d => d.slug !== defect.slug).slice(0, 3);

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
      "honorificSuffix": "CMI",
      "sameAs": "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Foresight Home Inspections, LLC",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/images/Logopng.png`
      }
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

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Defect Guides", "item": `${SITE_URL}/defects/stucco-eifs-moisture-inspection` },
      { "@type": "ListItem", "position": 3, "name": defect.title, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <Script
        id={`defect-article-${defect.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id={`defect-faq-${defect.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id={`defect-breadcrumbs-${defect.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumb Navigation Bar */}
      <nav aria-label="Breadcrumb" style={{ background: '#f8fafc', padding: '0.875rem 0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <ol style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: 0, padding: 0, fontSize: '0.875rem' }}>
            <li><Link href="/" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>Home</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li><Link href="/services" style={{ color: 'var(--color-gray-dark)', textDecoration: 'none' }}>Diagnostic Guides</Link></li>
            <li style={{ color: 'var(--color-gray-mid)' }}>/</li>
            <li style={{ color: 'var(--color-red)', fontWeight: 600 }}>{defect.badge || defect.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '3.5rem 0 4rem',
        borderBottom: '4px solid var(--color-red)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            color: '#fca5a5',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '1.25rem'
          }}>
            <span>{defect.icon}</span>
            <span>{defect.badge || 'Technical Defect Diagnostic Guide'}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em'
          }}>
            {defect.title}
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#cbd5e1',
            marginBottom: '2rem',
            maxWidth: '750px',
            margin: '0 auto 2rem'
          }}>
            {defect.summary}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
              }}
            >
              📅 Schedule Stucco & Defect Audit
            </a>
            <a
              href="tel:6784802110"
              className="btn btn-outline"
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#ffffff'
              }}
              data-call-source={`defect_${defect.slug}`}
            >
              📞 Call Inspector: 678-480-2110
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section bg-white" style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          {/* AEO Direct Answer Summary Box */}
          <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0',
            borderLeft: '5px solid #2563eb',
            marginBottom: '2.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <h2 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span> Quick Diagnostic Summary: {defect.title}
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#334155', margin: 0 }}>
              {defect.summary} In Georgia home inspections, catching {defect.title.toLowerCase()} early prevents severe structural degradation, water intrusion, and un-budgeted repair expenses before due diligence closes.
            </p>
          </div>

          {/* Identification Section */}
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0',
            borderLeft: '5px solid var(--color-red)',
            marginBottom: '3rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔍</span> How to Identify This Defect in Georgia Homes
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', margin: 0 }}>
              {defect.identification}
            </p>
          </div>

          {/* Critical Risks Grid */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center', color: '#0f172a' }}>
              Critical Property &amp; Financial Risks
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '1.75rem', fontSize: '1.05rem' }}>
              Why this defect requires immediate evaluation during your contract due diligence period.
            </p>

            <div className="grid grid-3" style={{ gap: '1.25rem' }}>
              {defect.risks.map((risk, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    background: '#fef2f2',
                    padding: '1.5rem',
                    border: '1px solid #fecaca',
                    borderTop: '4px solid var(--color-red)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚠️</div>
                  <p style={{ color: '#991b1b', margin: 0, fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                    {risk}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How Foresight Inspects It (Two-Inspector Guarantee) */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '3.5rem',
            border: '1px solid #334155'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🛡️</span>
              <h2 style={{ color: 'white', fontSize: '1.75rem', margin: 0 }}>
                How Foresight Inspects &amp; Pinpoints This Defect
              </h2>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.7, textAlign: 'center', margin: '0 auto 1.75rem', maxWidth: '750px' }}>
              {defect.howWeInspect}
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.07)',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              <p style={{ color: '#ffffff', margin: 0, fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 }}>
                ⚡ <strong>The Foresight Difference:</strong> Every inspection includes our Two-Inspector Team, advanced FLIR thermal imaging, and our $10,000 Elite Master Warranty ($0 deductible).
              </p>
            </div>
          </div>

          {/* Remediation & Negotiation Strategy */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderLeft: '5px solid #10b981',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '3.5rem'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🛠️</span> Repair &amp; Buyer Negotiation Strategy
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', margin: 0 }}>
              {defect.remediation}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center', color: '#0f172a' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--color-gray-dark)', marginBottom: '1.75rem', fontSize: '1.05rem' }}>
              Expert answers from Certified Master Inspector Christopher Boykin.
            </p>

            <div>
              {defect.faqs.map((faq, i) => (
                <details
                  key={i}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    padding: '1.25rem 1.5rem',
                    background: '#f8fafc',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <summary style={{ fontWeight: 700, cursor: 'pointer', fontSize: '1.05rem', color: '#0f172a' }}>
                    {faq.q}
                  </summary>
                  <p style={{ marginTop: '0.85rem', marginBottom: 0, lineHeight: 1.7, color: 'var(--color-gray-dark)', fontSize: '0.975rem' }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Google Preferred Source 1-Click Component */}
          <GooglePreferredSource />

          {/* Related Red-Flag Defect Guides */}
          {relatedDefects.length > 0 && (
            <div style={{ marginTop: '3.5rem', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                Explore Related Atlanta Defect Guides
              </h2>
              <div className="grid grid-3" style={{ gap: '1.25rem' }}>
                {relatedDefects.map(rd => (
                  <Link key={rd.slug} href={`/defects/${rd.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ height: '100%', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', transition: 'transform 0.2s' }}>
                      <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>{rd.icon}</span>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: '#0f172a', lineHeight: 1.3 }}>{rd.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-red)', fontWeight: 600, margin: 0 }}>
                        Read Diagnostic Guide &rarr;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Conversion Action Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            border: '2px solid var(--color-red)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ fontSize: '1.85rem', color: '#ffffff', marginBottom: '0.75rem', fontWeight: 800 }}>
              Need an Inspection in Metro Atlanta?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1.75rem', maxWidth: '650px', margin: '0 auto 1.75rem' }}>
              Protect your home investment with Georgia&rsquo;s leading two-inspector team, FLIR thermal imaging, and our $10,000 Elite Warranty.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}
              >
                Schedule Inspection Online
              </a>
              <Link
                href="/quote"
                className="btn btn-outline"
                style={{ padding: '0.875rem 2rem', fontSize: '1.05rem', borderColor: '#ffffff', color: '#ffffff' }}
              >
                Get Instant Quote
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
