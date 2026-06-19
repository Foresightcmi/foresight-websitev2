import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';

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

  const schemaGraph = [
    {
      "@type": "Article",
      "headline": post.title,
      "description": post.description || post.excerpt,
      "datePublished": post.date,
      "dateModified": post.dateModified || post.date,
      "wordCount": wordCount,
      "articleSection": post.category || "Home Inspection",
      "inLanguage": "en-US",
      "author": {
        "@type": "Person",
        "name": "Christopher Boykin",
        "honorificSuffix": "CMI",
        "jobTitle": "Certified Master Inspector",
        "sameAs": "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873"
      },
      "publisher": {
        "@type": "Organization",
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

  // Find related posts (same category, exclude current)
  const relatedPosts = posts
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Article Header */}
      <section className="section bg-dark text-white" style={{ padding: '5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
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
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Reading Time + Share */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-gray-light)' }}>
            <span style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>
              📖 {Math.ceil((post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 230)} min read
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

          {/* Article excerpt for search engines */}
          {post.excerpt && (
            <p className="article-excerpt" style={{ fontSize: '1.15rem', color: 'var(--color-gray-dark)', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.7, borderLeft: '3px solid var(--color-red)', paddingLeft: '1.25rem' }}>
              {post.excerpt}
            </p>
          )}
          
          {post.tldr && post.tldr.length > 0 && (
            <div className="ai-summary-box" style={{ background: 'var(--color-gray-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-red)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span role="img" aria-label="robot">🤖</span> AI Quick Summary
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                {post.tldr.map((bullet, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem' }}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}

          <article
            className="blog-content"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--color-gray-dark)',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="card card-premium" style={{ marginTop: '3rem', textAlign: 'center', background: 'var(--color-dark)', color: 'var(--color-white)' }}>
            <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Ready to Protect Your Investment?</h3>
            <p style={{ color: 'var(--color-gray-mid)', marginBottom: '1.5rem' }}>
              Get an instant, transparent quote for your home inspection — backed by our $10,000 warranty.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/quote" className="btn btn-primary">Get Instant Quote</Link>
              <Link href="/ask-twin" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>Ask Foresight AI</Link>
            </div>
          </div>

          {/* Related Posts */}
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
