import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://www.fhinspectionsatl.com';

function loadComparisons() {
  const filePath = path.join(process.cwd(), 'data', 'comparisons-pseo.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function generateStaticParams() {
  const comparisons = loadComparisons();
  return comparisons.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const comparisons = loadComparisons();
  const item = comparisons.find(c => c.slug === resolvedParams.slug);

  if (!item) {
    return { title: 'Comparison Not Found' };
  }

  const canonicalUrl = `${SITE_URL}/compare/${resolvedParams.slug}`;

  return {
    title: item.metaTitle,
    description: item.metaDescription,
    keywords: [
      item.title.toLowerCase(),
      `home inspection comparison Atlanta`,
      `foresight home inspections difference`,
      `best home inspector Georgia`
    ],
    openGraph: {
      title: item.metaTitle,
      description: item.metaDescription,
      url: canonicalUrl,
      type: 'article',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ComparisonPage({ params }) {
  const resolvedParams = await params;
  const comparisons = loadComparisons();
  const item = comparisons.find(c => c.slug === resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/compare/${resolvedParams.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": item.title,
    "description": item.metaDescription,
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
    "mainEntity": item.faqs.map(f => ({
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
        <span>{item.title}</span>
      </div>

      {/* Hero Section */}
      <section className="hero" style={{ padding: '4rem 0 4.5rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '850px' }}>
          <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {item.icon} {item.badge}
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            {item.title}
          </h1>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-red)', marginBottom: '1.5rem', fontWeight: 600 }}>
            {item.headline}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>
            {item.summary}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              📅 Experience the Foresight Advantage
            </a>
            <Link href="/quote" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              See Pricing & Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center" style={{ marginBottom: '2.5rem' }}>
            <h2>Feature Comparison Matrix</h2>
            <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}>
              See how Foresight Home Inspections compares against standard home inspection options in Georgia.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '3.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'var(--color-dark)', color: 'white' }}>
                  <th style={{ padding: '1.25rem', fontSize: '1.05rem' }}>Evaluation Feature</th>
                  <th style={{ padding: '1.25rem', fontSize: '1.05rem', background: 'var(--color-red)', color: 'white' }}>Foresight Standard</th>
                  <th style={{ padding: '1.25rem', fontSize: '1.05rem' }}>Ordinary Inspector / Alternative</th>
                </tr>
              </thead>
              <tbody>
                {item.comparisonTable.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-mid)', background: i % 2 === 0 ? 'var(--color-gray-light)' : 'white' }}>
                    <td style={{ padding: '1.1rem', fontWeight: 600, color: 'var(--color-dark)' }}>{row.feature}</td>
                    <td style={{ padding: '1.1rem', color: 'var(--color-red-dark)', fontWeight: 700, background: 'rgba(211,47,47,0.05)' }}>
                      ✓ {row.foresight}
                    </td>
                    <td style={{ padding: '1.1rem', color: 'var(--color-gray-dark)' }}>{row.competitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Benefits */}
          <div className="section-title text-center" style={{ marginBottom: '2rem' }}>
            <h2>Why This Matters to Your Wallet & Safety</h2>
          </div>
          <div className="grid grid-3" style={{ gap: '1.5rem', marginBottom: '3.5rem' }}>
            {item.benefits.map((benefit, i) => {
              const [title, desc] = benefit.split(': ');
              return (
                <div key={i} className="card card-premium" style={{ background: 'var(--color-gray-light)', padding: '1.75rem', borderTop: '4px solid var(--color-dark)' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark)' }}>{title}</h3>
                  <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
                </div>
              );
            })}
          </div>

          {/* FAQs */}
          <div className="section-title text-center" style={{ marginBottom: '2rem' }}>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div style={{ marginBottom: '3.5rem' }}>
            {item.faqs.map((faq, i) => (
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

          {/* Call to Action */}
          <div className="card card-premium" style={{ textAlign: 'center', background: 'var(--color-dark)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ color: 'white', fontSize: '1.85rem', marginBottom: '0.75rem' }}>
              Choose the Superior Inspection Standard
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.1rem', marginBottom: '1.5rem', maxWidth: '650px', margin: '0 auto 1.5rem' }}>
              Two certified inspectors, FLIR thermal imaging, and a $10,000 Elite Warranty on every job. Book online in 5 minutes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                Schedule Now
              </a>
              <a href="tel:6784802110" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', padding: '1rem 2.5rem' }}>
                📞 Call 678-480-2110
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
