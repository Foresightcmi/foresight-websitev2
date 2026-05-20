import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Home Inspection Blog & Expert Insights',
  description: 'Read the latest insights and expert tips on home inspections, maintenance, and buying from Certified Master Inspector Christopher Boykin. Serving Metro Atlanta, GA.',
  openGraph: {
    title: 'Home Inspection Blog | Foresight Home Inspections',
    description: 'Expert insights on home inspections, real estate trends, and maintenance tips from a Certified Master Inspector serving Metro Atlanta.',
    url: 'https://www.fhinspectionsatl.com/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/blog',
  },
};

export default function Blog() {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const posts = JSON.parse(fileContents);

  // Sort by date descending
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const featuredPost = sortedPosts[0];
  const otherPosts = sortedPosts.slice(1);

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Foresight Home Inspections Blog",
    "description": "Expert insights on home inspections, real estate, and property maintenance in Metro Atlanta.",
    "url": "https://www.fhinspectionsatl.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Foresight Home Inspections, LLC"
    },
    "blogPost": sortedPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": "Christopher Boykin"
      },
      "url": `https://www.fhinspectionsatl.com/blog/${post.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)' }}>The Foresight Blog</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '600px', margin: '0 auto', fontSize: '1.125rem' }}>
            Expert insights on home inspections, real estate trends, and maintenance tips from a Certified Master Inspector.
          </p>
        </div>
      </section>

      <section className="section bg-gray-light">
        <div className="container">
          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '3rem' }}>
              <div className="card card-premium" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge">Latest</span>
                  <span className="badge" style={{ background: 'transparent', color: 'var(--color-gray)', border: '1px solid var(--color-gray-mid)' }}>{featuredPost.category}</span>
                </div>
                <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>{featuredPost.title}</h2>
                <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {featuredPost.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--color-gray)' }}>
                  <span>{featuredPost.author}</span>
                  <span>•</span>
                  <time dateTime={featuredPost.date}>
                    {new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
                <span style={{ display: 'inline-block', marginTop: '1.5rem', fontWeight: 600, color: 'var(--color-red)' }}>Read Full Article →</span>
              </div>
            </Link>
          )}

          {/* Other Posts Grid */}
          {otherPosts.length > 0 && (
            <div className="grid grid-3">
              {otherPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>{post.category}</span>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', lineHeight: 1.3 }}>{post.title}</h3>
                    <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1rem', fontSize: '0.95rem', flex: 1 }}>
                      {post.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-gray-mid)' }}>
                      <time dateTime={post.date} style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                      <span style={{ fontWeight: 600, color: 'var(--color-red)', fontSize: '0.9rem' }}>Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="card" style={{ marginTop: '3rem', textAlign: 'center', background: 'var(--color-dark)', color: 'var(--color-white)', borderColor: 'transparent' }}>
            <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Have a Specific Question?</h3>
            <p style={{ color: 'var(--color-gray-mid)', marginBottom: '1.5rem' }}>
              Foresight AI is trained on InterNACHI standards and is available 24/7 to answer your home inspection questions.
            </p>
            <Link href="/ask-twin" className="btn btn-primary">Chat with Foresight AI</Link>
          </div>
        </div>
      </section>
    </>
  );
}
