import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import AuthorBio from '../../components/AuthorBio';
import TableOfContents from '../../components/TableOfContents';
import GooglePreferredSource from '../../components/GooglePreferredSource';

function loadPosts() {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function generateStaticParams() {
  const posts = loadPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const posts = loadPosts();
  const post = posts.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.fhinspectionsatl.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://www.fhinspectionsatl.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params;
  const posts = loadPosts();
  const post = posts.find(p => p.slug === resolvedParams.slug);

  if (!post) {
    return (
      <section className="section bg-gray-light" style={{ textAlign: 'center' }}>
        <div className="container">
          <h1>Post Not Found</h1>
          <p style={{ marginBottom: '2rem' }}>Sorry, we couldn't find that article.</p>
          <Link href="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </section>
    );
  }

  const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const summaryText = post.excerpt || post.description || `${post.title} — Comprehensive inspection guide by Certified Master Inspector Christopher Boykin.`;

  const schemaGraph = [
    {
      "@type": "Article",
      "headline": post.title,
      "description": summaryText,
      "datePublished": post.date,
      "dateModified": post.dateModified || post.date,
      "wordCount": wordCount,
      "articleSection": post.category || "Home Inspection",
      "inLanguage": "en-US",
      "author": {
        "@type": "Person",
        "@id": "https://www.fhinspectionsatl.com/#person-christopher-boykin",
        "name": "Christopher Boykin",
        "honorificSuffix": "CMI",
        "jobTitle": "Certified Master Inspector",
        "sameAs": "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://www.fhinspectionsatl.com/#business",
        "name": "Foresight Home Inspections, LLC",
        "url": "https://www.fhinspectionsatl.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.fhinspectionsatl.com/images/Logopng.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.fhinspectionsatl.com/blog/${post.slug}`,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.fhinspectionsatl.com/#website"
        }
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://www.fhinspectionsatl.com/images/Logopng.png",
        "width": 800,
        "height": 600
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".article-title", ".article-excerpt"]
      },
      "keywords": post.keywords?.join(', ')
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.fhinspectionsatl.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://www.fhinspectionsatl.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `https://www.fhinspectionsatl.com/blog/${post.slug}`
        }
      ]
    }
  ];

  // Add FAQPage schema if the post has FAQ data
  if (post.faq && post.faq.length > 0) {
    schemaGraph.push({
      "@type": "FAQPage",
      "mainEntity": post.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@graph": schemaGraph
  };

  // Smart Category-Matching Related Posts Engine
  const sameCategoryPosts = posts.filter(p => p.category === post.category && p.slug !== post.slug);
  const otherPosts = posts.filter(p => p.category !== post.category && p.slug !== post.slug);
  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Article Header */}
      <section className="section bg-dark text-white" style={{ padding: '5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/blog" style={{ color: 'var(--color-red)', fontWeight: 600, fontSize: '0.9rem' }}>
              ← Back to Blog
            </Link>
          </div>
          <span className="badge" style={{ marginBottom: '1rem' }}>{post.category}</span>
          <h1 className="article-title" style={{ color: 'var(--color-white)', fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-gray-mid)', fontSize: '0.95rem' }}>
            <span>By {post.author} (CMI®)</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: '850px' }}>

          {/* Reading Time + Share */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-gray-light)' }}>
            <span style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>
              📖 {Math.ceil(wordCount / 230)} min read • Verified by Certified Master Inspector®
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://www.fhinspectionsatl.com/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}
              >
                📘
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=https://www.fhinspectionsatl.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}
              >
                🐦
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://www.fhinspectionsatl.com/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}
              >
                💼
              </a>
            </div>
          </div>

          {/* Article excerpt for search engines & AI speakable grounding */}
          <p className="article-excerpt" style={{ fontSize: '1.15rem', color: 'var(--color-gray-dark)', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.7, borderLeft: '4px solid var(--color-red)', paddingLeft: '1.25rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
            {summaryText}
          </p>
          
          {post.tldr && post.tldr.length > 0 && (
            <div className="ai-summary-box" style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #3b82f6', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <span role="img" aria-label="robot">🤖</span> AI Key Takeaways &amp; Field Summary
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, color: '#334155', fontSize: '1rem', lineHeight: 1.6 }}>
                {post.tldr.map((bullet, i) => (
                  <li key={i} style={{ marginBottom: '0.4rem' }}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of Contents for Jump Links (SEO) */}
          <TableOfContents />

          <article
            className="blog-content"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--color-gray-dark)',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Internal Linking: Service Callout */}
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--color-gray-light)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-red)' }}>
            <p style={{ margin: 0, color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Need a professional inspection? Foresight Home Inspections sends <strong>two certified inspectors on every job</strong> with FLIR thermal imaging and drone technology. View our <Link href="/services" style={{ color: 'var(--color-red)', fontWeight: 600 }}>full services and transparent pricing</Link>, check <Link href="/service-areas" style={{ color: 'var(--color-red)', fontWeight: 600 }}>87 city &amp; 20 county service areas</Link>, or explore our <Link href="/ai-fact-sheet" style={{ color: 'var(--color-red)', fontWeight: 600 }}>AI Fact Sheet</Link>.
            </p>
          </div>

          {/* Defect Diagnostics & Comparisons Cross-Link Section */}
          <div style={{ marginTop: '3rem', padding: '1.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem' }}>
              🔍 Related Defect Diagnostics &amp; Decision Guides
            </h3>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Defect Audits:</strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <li><Link href="/defects/stucco-eifs-moisture-inspection" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 600 }}>&rarr; Stucco (EIFS) Moisture Audit</Link></li>
                  <li><Link href="/defects/polybutylene-pipe-inspection" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 600 }}>&rarr; Polybutylene Plumbing Risks</Link></li>
                  <li><Link href="/defects/foundation-crack-settlement-inspection" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 600 }}>&rarr; Red Clay Foundation Settlement</Link></li>
                </ul>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Decision Frameworks:</strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <li><Link href="/compare/two-inspector-team-vs-single-inspector" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 600 }}>&rarr; 2-Inspector Team vs Single Inspector</Link></li>
                  <li><Link href="/compare/11-month-warranty-vs-builder-walkthrough" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 600 }}>&rarr; 11-Month Warranty vs Builder Walkthrough</Link></li>
                  <li><Link href="/ask-twin" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 600 }}>&rarr; Ask Foresight AI Twin (Instant Answers)</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Google Preferred Source 1-Click Ranking Signal Component */}
          <div style={{ marginTop: '2.5rem' }}>
            <GooglePreferredSource />
          </div>

          {/* Conversion Call to Action */}
          <div className="card card-premium" style={{ marginTop: '2rem', textAlign: 'center', background: 'var(--color-dark)', color: 'var(--color-white)' }}>
            <h3 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>Ready to Protect Your Investment?</h3>
            <p style={{ color: 'var(--color-gray-mid)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              Call us directly or get an instant quote — backed by our $10,000 warranty.
            </p>
            <a href="tel:678-480-2110" style={{ display: 'inline-block', color: 'var(--color-red)', fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }} data-call-source="blog_post_cta">
              📞 678-480-2110
            </a>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://schedulenow.homegauge.com/11ec7d41-999d-45c5-9ccd-df7d23ece8b6/schedule" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Schedule Inspection</a>
              <Link href="/quote" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>Get Instant Quote</Link>
              <Link href="/realtors" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>Realtor VIP Program</Link>
            </div>
          </div>

          {/* E-E-A-T Author Bio */}
          <AuthorBio />

          {/* Related Posts (Smart Category Matching) */}
          {relatedPosts.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>More from the Blog</h2>
              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {relatedPosts.map(rp => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{ height: '100%' }}>
                      <span className="badge" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>{rp.category}</span>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{rp.title}</h3>
                      <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
                        {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
