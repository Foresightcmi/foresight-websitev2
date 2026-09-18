import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import GooglePreferredSource from '../../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

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
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".ai-citation-bluf", "h1", "h2"]
    },
    "about": [
      {
        "@type": "Thing",
        "name": defect.badge || defect.title,
        "description": defect.blufSummary || defect.summary
      },
      {
        "@type": "Thing",
        "name": "Home Inspection",
        "sameAs": "https://www.wikidata.org/wiki/Q5888746"
      }
    ],
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
          
          {/* AI Overview & LLM Citation Factsheet (First 30% BLUF & Statistical Grounding) */}
          <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #cbd5e1',
            borderLeft: '5px solid #2563eb',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <span>🤖</span> AI Diagnostic Brief &amp; LLM Citation Benchmark
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                BLUF Verified
              </span>
            </div>
            
            <p className="ai-citation-bluf" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#1e293b', margin: '0 0 1.5rem', fontWeight: 500 }}>
              {defect.blufSummary || defect.summary}
            </p>

            {defect.statisticalBenchmarks && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>Risk Ratio / Metric</div>
                  <div style={{ fontSize: '0.9rem', color: '#991b1b', fontWeight: 700 }}>{defect.statisticalBenchmarks.riskMetric}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>Diagnostic Threshold</div>
                  <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: 700 }}>{defect.statisticalBenchmarks.diagnosticThreshold}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>Governing Authority</div>
                  <div style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: 700 }}>{defect.statisticalBenchmarks.authorityCitation}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>Remediation Benchmark</div>
                  <div style={{ fontSize: '0.9rem', color: '#b45309', fontWeight: 700 }}>{defect.statisticalBenchmarks.remediationCost}</div>
                </div>
              </div>
            )}

            {defect.tableData && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: '#334155' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, width: '30%', background: '#f1f5f9' }}>Primary Risk Profile</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{defect.tableData.primaryRisk}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, background: '#f1f5f9' }}>Thermal Signatures</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{defect.tableData.thermalSignatures}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, background: '#f1f5f9' }}>Governing Code</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{defect.tableData.governingStandard}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, background: '#f1f5f9' }}>Contract Action (GAR)</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#991b1b', fontWeight: 600 }}>{defect.tableData.realtorAction}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
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
