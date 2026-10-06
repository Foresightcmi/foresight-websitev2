import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import GooglePreferredSource from '../../components/GooglePreferredSource';

const SITE_URL = 'https://www.fhinspectionsatl.com';

export const dynamic = 'force-static';
export const dynamicParams = false;

function loadColonyData() {
  const filePath = path.join(process.cwd(), 'data', 'seo-colony-matrix.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function generateStaticParams() {
  const data = loadColonyData();
  return data.questions.map(q => ({ slug: q.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const data = loadColonyData();
  const item = data.questions.find(q => q.slug === resolvedParams.slug);

  if (!item) {
    return { title: 'Question Not Found | Foresight Home Inspections' };
  }

  const canonicalUrl = `${SITE_URL}/faq/${resolvedParams.slug}`;

  return {
    title: item.metaTitle,
    description: item.metaDescription,
    keywords: [
      item.question.toLowerCase(),
      'Georgia home inspection rules',
      'Atlanta home inspection questions',
      'InterNACHI building science answers',
      'due diligence home inspector Georgia'
    ],
    openGraph: {
      title: item.metaTitle,
      description: item.metaDescription,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Foresight Home Inspections',
      locale: 'en_US'
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ColonyQuestionPage({ params }) {
  const resolvedParams = await params;
  const data = loadColonyData();
  const item = data.questions.find(q => q.slug === resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const colony = data.colonies.find(c => c.id === item.colonyId) || {};
  const canonicalUrl = `${SITE_URL}/faq/${resolvedParams.slug}`;

  // Structured Data Schema: FAQPage + Article + Breadcrumb
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: canonicalUrl,
    mainEntity: [
      {
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.shortAnswer
        }
      }
    ]
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.question,
    description: item.metaDescription,
    author: {
      '@type': 'Person',
      name: 'Christopher Boykin',
      jobTitle: 'Certified Master Inspector (CMI®)',
      url: `${SITE_URL}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Foresight Home Inspections',
      url: SITE_URL
    },
    mainEntityOfPage: canonicalUrl,
    datePublished: '2026-10-01'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Inspection FAQs',
        item: `${SITE_URL}/faq`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.question,
        item: canonicalUrl
      }
    ]
  };

  return (
    <main style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh' }}>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb Navigation */}
      <nav style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.85rem 1.5rem', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', color: '#64748b' }}>
          <Link href="/" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <span>/</span>
          <Link href="/faq" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>FAQs &amp; Authority Colony</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{colony.category || 'Inspection Answers'}</span>
        </div>
      </nav>

      {/* Question Header & BLUF Section */}
      <article style={{ maxWidth: '850px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        
        {/* Colony Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span style={{ backgroundColor: '#eff6ff', color: '#0284c7', border: '1px solid #bfdbfe', padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {colony.name || 'Topical Authority Colony'}
          </span>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>• InterNACHI CMI Verified Answer</span>
        </div>

        {/* H1 Tag — Strictly Aligned to Search Intent */}
        <h1 style={{ fontSize: '2.4rem', lineHeight: '1.25', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem', fontFamily: 'var(--font-heading)' }}>
          {item.question}
        </h1>

        {/* Direct Answer Box (BLUF - Bottom Line Up Front within First 100-120 Words) */}
        <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #86efac', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>✓</span>
            <span style={{ color: '#166534', fontWeight: 800, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Direct Inspector Answer (BLUF)
            </span>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.65', color: '#14532d', margin: 0, fontWeight: 500 }}>
            {item.shortAnswer}
          </p>
        </div>

        {/* Certified Master Inspector Bylines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
            CB
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
              Reviewed by Christopher Boykin, CMI®
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Board-Certified Master Inspector • 1,000+ Verified Georgia Inspections • Top 1% Nationwide
            </div>
          </div>
        </div>

        {/* Detailed Building Science & Contract Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
          {item.detailedAnalysis.map((section, idx) => (
            <section key={idx}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem', fontFamily: 'var(--font-heading)' }}>
                {section.heading}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line', margin: 0 }}>
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* Expert Quote Card */}
        {item.expertQuote && (
          <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #0284c7', padding: '1.25rem 1.5rem', borderRadius: '0 8px 8px 0', marginBottom: '3.5rem' }}>
            <p style={{ margin: 0, fontSize: '1.05rem', fontStyle: 'italic', color: '#1e293b', lineHeight: '1.6' }}>
              "{item.expertQuote}"
            </p>
            <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>
              — Christopher Boykin, Board-Certified Master Inspector
            </span>
          </div>
        )}

        {/* PRIMARY COLONY AUTHORITY CARD (FUNNELS PAGERANK & CLICKS DIRECTLY TO TARGET MONEY PAGE) */}
        {item.moneyPageTarget && (
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '16px', padding: '2.25rem', marginBottom: '3.5rem', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <span style={{ backgroundColor: '#22c55e', color: '#052e16', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recommended Next Step
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', margin: '0.85rem 0 0.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {item.moneyPageTarget.name}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
              {item.moneyPageTarget.callout}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link 
                href={item.moneyPageTarget.url}
                style={{ backgroundColor: '#22c55e', color: '#0f172a', padding: '0.85rem 1.6rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}
              >
                {item.moneyPageTarget.anchorText} →
              </Link>
              <Link 
                href="/quote"
                style={{ backgroundColor: 'transparent', color: '#38bdf8', padding: '0.85rem 1.25rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', border: '1px solid #38bdf8' }}
              >
                View Transparent Pricing
              </Link>
            </div>
          </div>
        )}

        {/* TOPICAL BRIDGES (CONNECTING ADJACENT COLONY CIRCLES) */}
        {item.topicalBridges && item.topicalBridges.length > 0 && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2.5rem', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              Related Inspection Authority Questions &amp; Building Science Guides:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {item.topicalBridges.map((bridge, bIdx) => (
                <Link
                  key={bIdx}
                  href={`/faq/${bridge.slug}`}
                  style={{ display: 'block', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', transition: 'border-color 0.2s ease' }}
                >
                  <span style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>PAA Authority Answer</span>
                  <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.35rem', lineHeight: '1.4' }}>
                    {bridge.title} →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to All FAQs */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/faq" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'underline' }}>
            ← View All Georgia Inspection Questions in Authority Colony Hub
          </Link>
        </div>

      </article>

      {/* Google Preferred Entity Source Footer */}
      <GooglePreferredSource />
    </main>
  );
}
