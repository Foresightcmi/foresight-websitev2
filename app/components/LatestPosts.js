import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function LatestPosts() {
  let posts = [];
  try {
    const dataPath = path.join(process.cwd(), 'data', 'posts.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const allPosts = JSON.parse(fileContents);
    
    // Sort by date (newest first)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    posts = allPosts.slice(0, 3);
  } catch (error) {
    console.error('Error loading posts for LatestPosts component:', error);
  }

  return (
    <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--color-gray-light)', color: 'var(--color-red)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.85rem' }}>📰 From Our Blog</span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-dark)', margin: '1rem 0', fontFamily: 'var(--font-heading)' }}>Latest Home Inspection Insights</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-dark)', maxWidth: '600px', margin: '0 auto' }}>
            Expert advice, tips, and insights for homebuyers and real estate professionals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {posts.map((post) => (
            <div key={post.slug} style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E2E8F0', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {post.category && (
                  <span style={{ 
                    display: 'inline-block', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase', 
                    color: 'var(--color-gray-dark)', 
                    marginBottom: '1rem' 
                  }}>
                    {post.category}
                  </span>
                )}
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-dark)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>
                {post.date && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-gray)', marginBottom: '1rem' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: 'var(--color-red)', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Read More <span style={{ marginLeft: '4px' }}>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/blog" style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: 'transparent', 
            border: '2px solid var(--color-dark)', 
            color: 'var(--color-dark)', 
            fontWeight: 'bold', 
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none'
          }}>
            View All Articles &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
