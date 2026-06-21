import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Home Inspection Guides & Expert Tips | Atlanta GA',
  description: 'Expert home inspection guides, buyer tips, safety insights, and seller resources from Certified Master Inspector Christopher Boykin. Serving Metro Atlanta, GA.',
  openGraph: {
    title: 'Home Inspection Guides & Expert Tips | Atlanta GA',
    description: 'Expert home inspection guides, buyer tips, and seller resources from a Certified Master Inspector serving Metro Atlanta.',
    url: 'https://www.fhinspectionsatl.com/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/blog',
  },
};

// Map original post categories into 3 hub topics for topical authority
const HUB_CATEGORY_MAP = {
  'Buyer Tips': 'Buyer Guides',
  'Pricing & Value': 'Buyer Guides',
  'Inspection Insights': 'Buyer Guides',
  'Health & Safety': 'Home Safety & Diagnostics',
  'Technology': 'Home Safety & Diagnostics',
  'Advanced Diagnostics': 'Home Safety & Diagnostics',
  'Home Protection': 'Home Safety & Diagnostics',
  'Specialty Inspections': 'Home Safety & Diagnostics',
  'Home Selling': 'Seller & Agent Resources',
  'Trending Topic': 'Seller & Agent Resources',
};

const HUB_SECTIONS = [
  {
    hub: 'Buyer Guides',
    heading: 'Buyer Guides: What Every Atlanta Home Buyer Needs to Know',
    description: 'Whether you are a first-time buyer or an experienced investor, these guides walk you through inspection costs, checklists, report red flags, and negotiation strategies specific to Metro Atlanta real estate.',
  },
  {
    hub: 'Home Safety & Diagnostics',
    heading: 'Home Safety and Diagnostics: Protecting Your Family and Investment',
    description: 'From radon testing and crawlspace moisture to FLIR thermal imaging and sewer scope inspections, these articles cover the advanced diagnostics and safety evaluations that reveal hidden hazards in Georgia homes.',
  },
  {
    hub: 'Seller & Agent Resources',
    heading: 'Seller and Agent Resources: Market Trends and Transaction Insights',
    description: 'Stay ahead of the Metro Atlanta real estate market with expert analysis on inspection trends, pre-listing strategies, and the data-driven insights that help sellers, listing agents, and buyer agents close deals with confidence.',
  },
];

export default function Blog() {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const posts = JSON.parse(fileContents);

  // Sort by date descending
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const featuredPost = sortedPosts[0];
  const remainingPosts = sortedPosts.slice(1);

  // Group remaining posts by hub category
  const groupedPosts = {};
  HUB_SECTIONS.forEach(section => {
    groupedPosts[section.hub] = [];
  });
  remainingPosts.forEach(post => {
    const hub = HUB_CATEGORY_MAP[post.category] || 'Seller & Agent Resources';
    if (groupedPosts[hub]) {
      groupedPosts[hub].push(post);
    }
  });

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Foresight Home Inspections Blog",
    "description": "Expert home inspection guides, buyer tips, safety insights, and seller resources for Metro Atlanta homeowners and agents.",
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

      {/* Hero Section */}
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)' }}>Atlanta Home Inspection Guides, Tips, and Expert Insights</h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.125rem', lineHeight: 1.7 }}>
            From our 1,000+ inspections across Metro Atlanta, we share the real-world insights that help homebuyers, sellers, and agents make smarter decisions.
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
                  <span className="badge" style={{ background: 'transparent', color: 'var(--color-gray)', border: '1px solid var(--color-gray-mid)' }}>{HUB_CATEGORY_MAP[featuredPost.category] || featuredPost.category}</span>
                </div>
                <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>{featuredPost.title}</h2>
                <p style={{ color: 'var(--color-gray-dark)', marginBottom: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {featuredPost.description}
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--color-gray)' }}>
                  <span>{featuredPost.author}</span>
                  <span>|</span>
                  <time dateTime={featuredPost.date}>
                    {new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
                <span style={{ display: 'inline-block', marginTop: '1.5rem', fontWeight: 600, color: 'var(--color-red)' }}>Read Full Article →</span>
              </div>
            </Link>
          )}

          {/* Hub Category Sections */}
          {HUB_SECTIONS.map(section => {
            const sectionPosts = groupedPosts[section.hub];
            if (!sectionPosts || sectionPosts.length === 0) return null;

            return (
              <div key={section.hub} style={{ marginBottom: '3rem' }}>
                {/* Hub Section Header */}
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '3px solid var(--color-red)' }}>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{section.heading}</h2>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '800px' }}>
                    {section.description}
                  </p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-3">
                  {sectionPosts.map(post => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>{HUB_CATEGORY_MAP[post.category] || post.category}</span>
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
              </div>
            );
          })}

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
