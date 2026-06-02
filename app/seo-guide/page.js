'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SeoGuide() {
  const [projectType, setProjectType] = useState('local');

  // Interactive Checklist State for Weekly Maintenance Drill
  const [checklist, setChecklist] = useState({
    suggestedEdits: false,
    respondReviews: false,
    uploadPhotos: false,
    clickToCall: false
  });

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Interactive Checklist State for AEO Content Template
  const [aeoChecklist, setAeoChecklist] = useState({
    headingQuestion: false,
    firstParagraphAnswer: false,
    visualAidTable: false,
    supportingContextStats: false,
    codeLayerSchema: false
  });

  const toggleAeoCheck = (key) => {
    setAeoChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Interactive Checklist State for Weekly GEO Maintenance Checklist
  const [geoChecklist, setGeoChecklist] = useState({
    rewriteHeadings: false,
    addStatQuote: false,
    checkSchemaErrors: false,
    monitorBrandSummary: false
  });

  const toggleGeoCheck = (key) => {
    setGeoChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Strategic priorities data (percent weightings)
  const priorities = {
    local: {
      title: 'Local Business / Service Provider',
      description: 'Focus heavily on capturing nearby searches, optimizing Google Maps, and keeping NAP data identical across online citations.',
      weights: { technical: 15, onpage: 20, offpage: 15, local: 50 },
      focusChecklist: [
        'Set up & claim Google Business Profile, Apple Business Connect, and Bing Places (sync profile).',
        'Maintain character-for-character NAP (Name, Address, Phone) consistency across all citations.',
        'Build neighborhood-level landing pages and inject LocalBusiness / AreaServed schema markup.',
        'Accelerate review velocity (minimum 10 reviews) and respond to all reviews within 48 hours.'
      ],
      example: {
        title: 'Local Bakery',
        technical: 'Ensures their online menu page loads instantly on a customer\'s phone outside the shop.',
        onpage: 'Publishes "How to Choose the Perfect Wedding Cake Flavor" with H2/H3 checklists.',
        offpage: 'A local food blogger reviews their pastries and links back to the bakery website.',
        local: 'Optimizes their Google Business Profile to show up in local maps when nearby residents search "fresh croissants near me".'
      }
    },
    ecommerce: {
      title: 'E-commerce / Online Store',
      description: 'Prioritize structural technical health, speed, and product schema data so search engine bots can index hundreds of product pages efficiently.',
      weights: { technical: 35, onpage: 30, offpage: 25, local: 10 },
      focusChecklist: [
        'Optimize page speeds (under 2 seconds) by compressing large catalog images and cleaning code.',
        'Resolve duplicate content issues across similar size/color pages using canonical tags.',
        'Implement structured product schema markup (pricing, reviews, availability in search snippets).',
        'Write unique, high-quality descriptions for every single product category to avoid thin content.'
      ],
      example: {
        title: 'Online Apparel Shop',
        technical: 'Fixes duplicate URL filters (e.g. /product?color=red) using a single canonical tag to the main item.',
        onpage: 'Optimizes product page Title tags to include keywords like "organic cotton crewneck t-shirt".',
        offpage: 'Earns product recommendations and backlinks from fashion influencers and style blogs.',
        local: 'Adds store location data to rank for local searches when customers look for physical retail pickup options.'
      }
    },
    content: {
      title: 'Blog / Content Hub',
      description: 'Focus extensively on deep, comprehensive keyword research, internal article clusters, and earning high-quality backlinks from trusted domains.',
      weights: { technical: 15, onpage: 45, offpage: 35, local: 5 },
      focusChecklist: [
        'Produce thorough, "people-first" articles that answer search intent better than competitors.',
        'Construct topic clusters using internal links to help bots discover related articles easily.',
        'Write click-worthy Meta Titles (under 60 characters) and descriptions matching high-volume keywords.',
        'Outreach to authoritative publications to earn organic, natural backlinks.'
      ],
      example: {
        title: 'Tech Review Blog',
        technical: 'Maintains a clean site architecture with an automated XML sitemap submitted to Google Search Console.',
        onpage: 'Conducts keyword research to target low-competition, long-tail terms like "best budget mechanical keyboards 2026".',
        offpage: 'Guest blogs on trusted hardware forums to build domain authority and acquire backlinks.',
        local: 'Creates a Google Business profile as a digital publisher to secure brand citation trust.'
      }
    },
    saas: {
      title: 'SaaS / Tech Startup',
      description: 'Balance technical site structure with high-domain authority reputation building. Focus on organic link acquisition, PR, and landing page conversions.',
      weights: { technical: 25, onpage: 30, offpage: 40, local: 5 },
      focusChecklist: [
        'Earn high-authority backlinks from major tech blogs, directories, and software comparison engines.',
        'Optimize the pricing and main landing pages for conversion (speed, accessibility, semantic H1-H3).',
        'Build targeted landing pages mapping to specific customer pain points and search queries.',
        'Audit site crawlability to ensure gated product sections do not block search engines.'
      ],
      example: {
        title: 'CRM Software SaaS',
        technical: 'Optimizes the interactive platform dashboard mockups to render lazily, speeding up first contentful paint.',
        onpage: 'Designs landing pages optimized for keywords like "simple CRM for real estate agents".',
        offpage: 'Gets listed on major software directories (G2, Capterra) earning highly authoritative backlinks.',
        local: 'Optimizes local profiles for their headquarters to secure brand authority signals.'
      }
    }
  };

  const current = priorities[projectType];

  return (
    <>
      {/* Hero Header */}
      <section className="section bg-dark text-white text-center" style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="badge" style={{ marginBottom: '1.5rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-light)', fontSize: '0.9rem', padding: '0.5rem 1.25rem' }}>
            Educational Marketing Resources
          </span>
          <h1 style={{ color: 'var(--color-white)', fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            The Complete Local SEO & 4-Pillar Planner
          </h1>
          <p style={{ color: 'var(--color-gray-mid)', maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', lineHeight: 1.6 }}>
            SEO (Search Engine Optimization) is about making a website easy for search engines to understand and incredibly valuable for real people. Use this comprehensive framework to audit your technical foundation, content footprint, and local mapping authority.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/realtors" className="btn btn-primary">
              🤝 Partner with Foresight
            </Link>
            <a href="#planner-tool" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              🧮 Use Priority Planner
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(211,47,47,0.05) 0%, transparent 60%)', zIndex: 1, pointerEvents: 'none' }} />
      </section>

      {/* 4 Pillars Guide Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The 4-Pillar SEO Framework</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              All successful search engine strategies map directly into this 4-Pillar Framework. Here is what they cover under the hood:
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {/* Pillar 1 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTopColor: 'var(--color-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.25rem' }}>🧱</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Pillar 1: Technical SEO</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Before writing any content, your site must run smoothly under the hood. Technical SEO ensures search engine crawlers can find, read, and index your pages without error.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.975rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Site Speed Optimization:</strong> Compressing images & code to load pages under two seconds.</li>
                <li><strong>Mobile Responsiveness:</strong> Ensuring layouts scale perfectly on smartphones (Rauva).</li>
                <li><strong>Secure Connection (HTTPS):</strong> Using SSL to encrypt and secure user data.</li>
                <li><strong>Duplicate Content Resolution:</strong> Using canonical tags to specify primary URLs (U.S. Chamber of Commerce).</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTopColor: 'var(--color-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.25rem' }}>📝</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Pillar 2: On-Page SEO</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Everything you control directly on an individual page to signal its relevance to specific search queries (CloudMellow).
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.975rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Keyword & Intent Research:</strong> Finding key phrases and matching user search goals (Rauva).</li>
                <li><strong>People-First Content:</strong> Producing high-quality, uniquely helpful articles (CROBenchmark).</li>
                <li><strong>HTML Element Optimization:</strong> Placing keywords in Titles (&lt; 60 chars), Headings, and Meta tags.</li>
                <li><strong>Internal Linking:</strong> Linking related articles to build structured content clusters (Search Engine Land).</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTopColor: 'var(--color-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.25rem' }}>📣</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Pillar 3: Off-Page SEO</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Strategies happening outside your site to prove to search engines that your brand is authoritative and trusted.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.975rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Organic Link Building:</strong> Earning high-quality backlinks from trusted domains (Rauva).</li>
                <li><strong>Brand Mentions:</strong> Citations on reputable industry websites and news outlets (Search Engine Land).</li>
                <li><strong>Social Engagement:</strong> Sharing content across platforms to drive active visibility (Rauva).</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="card card-premium" style={{ background: 'var(--color-gray-light)', borderTopColor: 'var(--color-red)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2.25rem' }}>📍</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Pillar 4: Local SEO</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.025rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Critical for businesses serving specific local territories. Ensures you appear prominently to nearby customers in map packs.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.975rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Google Business Profile (GBP):</strong> Maintaining optimized Maps info and active update posts (Rauva).</li>
                <li><strong>Consistent Citations:</strong> Keeping Name, Address, Phone (NAP) character-for-character identical everywhere.</li>
                <li><strong>Review Management:</strong> Gathering and responding to positive feedback to build local prominence.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tool Section */}
      <section id="planner-tool" className="section bg-gray-light" style={{ borderTop: '1px solid var(--color-gray-mid)', borderBottom: '1px solid var(--color-gray-mid)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Interactive Planner</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>SEO Priority Planner</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              Select your business model type to see how you should distribute your resources across the 4 pillars to maximize your search rankings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            {/* Input choices card */}
            <div className="card" style={{ padding: '2.5rem', background: 'var(--color-white)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Select Project Type</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'local', title: 'Local Business', icon: '📍' },
                  { id: 'ecommerce', title: 'E-commerce Shop', icon: '🛒' },
                  { id: 'content', title: 'Content Blog / Portal', icon: '📰' },
                  { id: 'saas', title: 'SaaS Startup', icon: '💻' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setProjectType(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      width: '100%',
                      padding: '1.25rem',
                      background: projectType === item.id ? 'var(--color-red-light)' : 'var(--color-gray-light)',
                      border: projectType === item.id ? '2px solid var(--color-red)' : '1px solid var(--color-gray-mid)',
                      borderRadius: 'var(--radius-md)',
                      color: projectType === item.id ? 'var(--color-red-dark)' : 'var(--color-dark)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Results Card */}
            <div className="card card-premium" style={{ padding: '2.5rem', background: 'var(--color-white)', borderTopColor: 'var(--color-red)' }}>
              <span className="badge" style={{ marginBottom: '1rem' }}>Recommended Strategy Allocation</span>
              <h3 style={{ marginBottom: '0.75rem', fontWeight: 800, fontSize: '1.75rem' }}>{current.title}</h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {current.description}
              </p>

              {/* Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                  { name: 'Technical SEO', weight: current.weights.technical, color: '#4b5563' },
                  { name: 'On-Page SEO', weight: current.weights.onpage, color: '#d32f2f' },
                  { name: 'Off-Page SEO', weight: current.weights.offpage, color: '#1f2937' },
                  { name: 'Local SEO', weight: current.weights.local, color: '#b71c1c' }
                ].map(bar => (
                  <div key={bar.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
                      <span>{bar.name}</span>
                      <span>{bar.weight}% focus</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--color-gray-light)', borderRadius: '999px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                      <div style={{ width: `${bar.weight}%`, height: '100%', background: bar.color, transition: 'width 0.4s ease-out' }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checklist */}
              <div style={{ background: 'var(--color-gray-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-mid)' }}>
                <h4 style={{ marginBottom: '1rem', fontWeight: 700, color: 'var(--color-dark)' }}>Strategic Action Items:</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.975rem', color: 'var(--color-gray-dark)' }}>
                  {current.focusChecklist.map((item, index) => (
                    <li key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed local SEO Framework Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>In-Depth Playbook</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The Complete Local SEO Action Framework</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              Ensure your business claims its digital real estate and dominates geographical maps.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h3 style={{ borderBottom: '2px solid var(--color-red)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                Step 1: Establish Your Verified Entity Profiles
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Claim your digital real estate across the entire mapping ecosystem so you don't miss out on multi-platform searches:
              </p>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <div>
                  <strong>📍 Google Business Profile (GBP)</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Select the single most specific primary category for your core offering. Fill out every field, including exact service areas and payment attributes.
                  </p>
                </div>
                <div>
                  <strong>🍎 Apple Business Connect</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Set up your profile to ensure you surface accurately for the millions of users searching directly inside Apple Maps.
                  </p>
                </div>
                <div>
                  <strong>🔍 Bing Places for Business</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Sync your verified Google profile directly to Bing to secure coverage across Microsoft search and partner AI engines.
                  </p>
                </div>
                <div>
                  <strong>🛡️ Strict NAP Alignment</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Ensure your business Name, Address, and Phone (NAP) number match character-for-character across every platform (e.g., using "Suite 100" everywhere instead of mixing it with "Ste. 100").
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h3 style={{ borderBottom: '2px solid var(--color-red)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                Step 2: Build Local Authority On-Page
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Your website needs to speak the language of your specific geography so search engines can match you to hyper-local search intent:
              </p>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <div>
                  <strong>🗺️ Neighborhood-Level Landing Pages</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    If you serve multiple areas, build dedicated pages for each distinct city or neighborhood. Include local landmarks, streets you service, and customer stories from that specific zip code.
                  </p>
                </div>
                <div>
                  <strong>📊 Advanced Local Schema Markup</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Inject structured data into your website code. Use LocalBusiness and AreaServed tags to outline the exact ZIP codes your team covers, creating a machine-readable map for search engines.
                  </p>
                </div>
                <div>
                  <strong>⚡ Frictionless Mobile UX</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Over half of all local searches happen on the move. Implement sub-second page loading speeds and highly prominent click-to-call booking buttons.
                  </p>
                </div>
                <div>
                  <strong>💬 Geo-Targeted FAQs</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Create FAQ blocks using structured schema that address local concerns (e.g., "Where do I park for your downtown Atlanta location?").
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h3 style={{ borderBottom: '2px solid var(--color-red)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontWeight: 800 }}>
                Step 3: Drive Reputation & Community Proof
              </h3>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Search engines rank local prominence based on how the surrounding community interacts with your business online:
              </p>
              <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                <div>
                  <strong>📈 Review Velocity Tracking</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Establish a systematic process to ask for feedback immediately after a service is completed. Reaching a minimum baseline of 10 verified reviews hits a critical trust threshold in search algorithms.
                  </p>
                </div>
                <div>
                  <strong>💬 Active Review Engagement</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Respond to every single review—both positive and negative—within 48 hours. Search engines reward businesses that are highly responsive to their user base.
                  </p>
                </div>
                <div>
                  <strong>📸 Geotagged Visual Strategy</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Upload authentic photos of your team, your physical building, or completed projects weekly. AI search engines actively look for real-world visual proof over generic stock photography.
                  </p>
                </div>
                <div>
                  <strong>🔗 Hyper-Local Link Building</strong>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    Earn links from trusted websites physically close to you. Partner with local charities, join your city\'s Chamber of Commerce, or sponsor a neighborhood youth sports team to build geographic authority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Case Study Section */}
      <section className="section bg-white" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>Putting it Into Practice</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Real-World Application Example</h2>
            <p style={{ color: 'var(--color-gray-dark)', margin: '0.5rem 0 0' }}>
              How the 4 pillars coordinate to drive client bookings for a **{current.title}** profile:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {[
              { id: 't', title: 'Technical Execution', desc: current.example.technical, emoji: '🧱' },
              { id: 'o', title: 'On-Page Optimization', desc: current.example.onpage, emoji: '📝' },
              { id: 'f', title: 'Off-Page Authority', desc: current.example.offpage, emoji: '📣' },
              { id: 'l', title: 'Local Target Reach', desc: current.example.local, emoji: '📍' }
            ].map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
                <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{item.emoji}</span>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.25rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--color-gray-dark)', margin: 0, fontSize: '1.025rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚡ NEW SECTION: AI ENGINE OPTIMIZATION (AIO) METHOD FRAMEWORK ⚡ */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-gray-mid)', background: 'var(--color-gray-light)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem' }}>The Future of Search</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The 4-Step AIO Method Framework</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '700px', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              AI models (ChatGPT, Google Gemini Search, Perplexity) do not just look at keywords—they parse structured entities, summarize summaries, and verify consensus.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem' }}>
            {/* AIO Step 1 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-dark)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🤖</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 1: Build a Clear Digital Entity</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI models do not just look at keywords; they look at "entities" (real-world people, places, businesses, and concepts) and how they connect across a broader knowledge graph.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Authoritative Database Listings:</strong> Secure your brand's presence on open data repositories like Wikidata, Crunchbase, or highly trusted industry-specific registries. AI models reference these to verify foundational facts.</li>
                <li><strong>Advanced Entity Schema:</strong> Injected structured JSON-LD data (like Organization or Product schema) into your code so AI bots can instantly map out exactly who you are, what you offer, and your credentials.</li>
                <li><strong>Consistent Digital Footprint:</strong> Ensure your brand's name, core mission, and founders are described identically across the web, making it easy for an AI to build a definitive profile of your business.</li>
              </ul>
            </div>

            {/* AIO Step 2 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-dark)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📊</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 2: Format Content for Machine Parsing</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI engines prefer content that can be scanned, digested, and summarized in milliseconds. If your answers are buried deep in storytelling paragraphs, the AI will bypass them.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>The "Inverted Pyramid" Layout:</strong> Place the absolute, direct answer to a question in the first two sentences of a section. Give the solution first, then expand into the background details.</li>
                <li><strong>TL;DR Summary Blocks:</strong> Include a brief 3-to-5 bulleted list of key takeaways or an 80-word summary at the very top of long-form educational guides.</li>
                <li><strong>Data Collections & Clean Tables:</strong> Presenting specifications, pricing, or product comparisons in clear tables makes it incredibly simple for AI models to extract and display your numbers.</li>
                <li><strong>Direct FAQ Blocks:</strong> Anticipate follow-up questions and answer them cleanly using an FAQ structure with exact, 40-to-60-word complete answers.</li>
              </ul>
            </div>

            {/* AIO Step 3 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-dark)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🤝</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 3: Establish Cross-Web Consensus</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI models rarely rely entirely on what you say about yourself on your own website. They look for external validation across the web to corroborate information.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Community & Forum Visibility:</strong> Ensure your brand or solutions are naturally mentioned in active, genuine discussions on platforms like Reddit, Quora, and industry-specific forums. AI models heavily crawl human conversations to find real consensus.</li>
                <li><strong>Authoritative Digital Citations:</strong> Earning mentions and context-rich backlinks from trusted news outlets or recognized industry experts signals to an AI that your site is a reliable source of truth.</li>
                <li><strong>Clear E-E-A-T Signaling:</strong> Showcase robust author bios, professional credentials, and hands-on experience. AI engines look for genuine human expertise over thin, generic information.</li>
              </ul>
            </div>

            {/* AIO Step 4 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-dark)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 4: Optimize Technical LLM Access</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Ensure your website architecture allows AI crawlers to cleanly navigate your infrastructure without hitting technical barriers.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>LLM Crawler Management:</strong> Configure your robots.txt file properly or deploy a structured llms.txt file (a standardized text file used to give direct, clean markdown instructions to AI bots crawling your site).</li>
                <li><strong>Rapid Server Responses:</strong> Keep your server response time exceptionally fast (ideally under 300 milliseconds). AI web crawlers need to scrape information quickly and efficiently.</li>
                <li>
                  <span style={{ color: 'var(--color-red)', fontWeight: 600 }}>Foresight Action:</span> Foresight has deployed a clean 
                  crawling guide at <Link href="/llms.txt" style={{ textDecoration: 'underline', color: 'var(--color-red)' }}>/llms.txt</Link>!
                </li>
              </ul>
            </div>
          </div>

          {/* Real-World AIO transition example */}
          <div className="card" style={{ marginTop: '3rem', padding: '2.5rem', background: 'var(--color-white)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800, textAlign: 'center', fontSize: '1.75rem' }}>
              Real-World Comparison: Transitioning Content for AI
            </h3>
            <p style={{ color: 'var(--color-gray-dark)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Imagine an Eco-Friendly Packaging Company trying to capture visibility for the user query: <strong>"What is the best alternative to plastic bubble wrap?"</strong> See how traditional narrative search engine marketing compares to modern AI Engine Optimization:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {/* Old SEO Approach */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-mid)', borderTop: '4px solid #ef4444' }}>
                <h4 style={{ color: '#dc2626', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                  <span>❌</span> The Old SEO Approach (Narrative Padding)
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  They write a long, 2,000-word blog post detailing the history of plastic pollution, hiding the actual alternatives deep down in the fifth paragraph under a catchy but vague heading.
                </p>
                <div style={{ background: '#f3f4f6', border: '1px dashed var(--color-gray-mid)', borderRadius: 'var(--radius-sm)', padding: '1rem', flexGrow: 1, position: 'relative' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)', opacity: 0.6, userSelect: 'none' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>Blog Post Excerpt (Paragraph 1-4)</div>
                    <p style={{ marginBottom: '0.5rem' }}>Since the dawn of the industrial revolution, logistics and packaging have been the quiet backbones of trade. The invention of polyethylene in 1898 paved the way for modern packaging...</p>
                    <p style={{ marginBottom: '0.5rem' }}>...However, plastic waste has now reached critical mass. Standard bubble wrap takes over 500 years to decompose. The search for a sustainable shipping shield is more urgent than ever...</p>
                    <div style={{ color: 'var(--color-dark)', opacity: 1, fontWeight: 600, borderLeft: '3px solid #ef4444', paddingLeft: '0.75rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', color: '#dc2626' }}>[BURIED DEEP IN PARAGRAPH 5]</span>
                      "For eco-friendly shippers, corrugated wrap or starch-based peanuts offer a biodegradable alternative to plastics..."
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
                  ⚠️ AI Engines skip this because it takes too much computing power to extract the point.
                </div>
              </div>

              {/* Modern AIO Approach */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-mid)', borderTop: '4px solid #10b981' }}>
                <h4 style={{ color: '#059669', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                  <span>✅</span> The Modern AIO Approach (Structured Parsing)
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  They lead the page with a clean Markdown comparison table comparing paper padding, cornstarch peanuts, and corrugated wrap side-by-side. Right below the table, they add a clear bulleted summary.
                </p>
                
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Rendered Table */}
                  <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-sm)', background: 'var(--color-white)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Alternative</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Cost / Sq Ft</th>
                          <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Durability</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Paper Padding</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>Low ($0.05)</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>Medium</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Cornstarch Peanuts</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>Medium ($0.12)</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>Low</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Corrugated Wrap</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>High ($0.18)</td>
                          <td style={{ padding: '0.5rem 0.75rem' }}>High</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Rendered Bulleted Summary */}
                  <div style={{ background: 'var(--color-white)', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-sm)', padding: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--color-gray-dark)' }}>TL;DR Summary</div>
                    <ul style={{ paddingLeft: '1.20rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0, color: 'var(--color-gray-dark)' }}>
                      <li><strong>Paper Padding:</strong> Low-cost, highly recyclable cushion material.</li>
                      <li><strong>Cornstarch Peanuts:</strong> Starch-based loose fill that dissolves completely in water.</li>
                      <li><strong>Corrugated Wrap:</strong> Thick, corrugated cardboard offering heavy-duty protection.</li>
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#d1fae5', color: '#065f46', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
                  🏆 AI engines effortlessly extract this structured table, display it, and credit your site.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ NEW SECTION: ANSWER ENGINE OPTIMIZATION (AEO) STRATEGY FRAMEWORK ⚡ */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-gray-mid)', background: 'var(--color-gray-light)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-dark)' }}>Voice & Conversational Search</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The 4-Step AEO Strategy Framework</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '750px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Answer Engine Optimization (AEO) focuses on optimizing your site structure and data to serve as the single, authoritative, spoken-aloud answer for voice assistants (Google, Siri, Alexa) and LLMs.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem', marginBottom: '4rem' }}>
            {/* AEO Step 1 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🗣️</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 1: Deploy "Answer-First" Structure</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Answer engines scan pages by individual sections, not whole articles. If an AI cannot find a direct answer within milliseconds of crawling a section, it will move to a competitor.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>The 40-to-60 Word Rule:</strong> Start every major sub-heading (H2/H3) with a direct, concise 1-to-2 sentence answer to the implied question. Conclusion first, then use the rest for context.</li>
                <li><strong>Question-Based Headings:</strong> Phrase your headings exactly how humans speak or type questions (e.g., "How much does a commercial roof replacement cost?" instead of "Commercial Roofing Pricing Guide").</li>
                <li><strong>Semantic Chunking:</strong> Keep paragraphs tight and distinct. Dedicate one paragraph purely to a definition, the next to a step-by-step process, and the next to a data point. Do not blend them.</li>
              </ul>
            </div>

            {/* AEO Step 2 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🔌</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 2: Feed Engines Machine-Readable Evidence</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI engines prioritize structural data because it removes any ambiguity about what your content means.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>FAQ and HowTo Schema:</strong> Inject explicit Schema.org markup. This creates direct, machine-readable question-and-answer pairs that AI assistants can instantly pull.</li>
                <li><strong>Speakable Schema:</strong> Apply Speakable markup to highly concise, factual text. This signals to voice assistants (Siri, Alexa, Google Assistant) that the text is perfect to read aloud.</li>
                <li><strong>Unambiguous Data Formatting:</strong> Use explicit figures, absolute units, and specific dates. Engines distrust vague statements like "significant growth recently" and prefer "a 34% increase in production from 2024 to 2026."</li>
              </ul>
            </div>

            {/* AEO Step 3 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🌐</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 3: Build Off-Site "Consensus" Signals</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                An answer engine determines accuracy by checking if multiple trusted websites say the exact same thing about your brand. You cannot win AEO by only optimizing your own website.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Third-Party Database Enrollment:</strong> Keep your data completely updated on foundational knowledge repositories like Wikidata, Crunchbase, and major industry-specific indexes.</li>
                <li><strong>Active Digital PR:</strong> Target media outreach to specific niche publications that AI search engines frequently cite as reference material.</li>
                <li><strong>Platform Diversification:</strong> Publish authentic, authoritative information on external platforms where real discussions happen daily—such as LinkedIn, YouTube, and industry forums.</li>
              </ul>
            </div>

            {/* AEO Step 4 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🎯</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Step 4: Track AI Share of Voice</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Traditional tracking tools only tell you what keyword rank you hold. AEO requires tracking how often you are selected as the final answer.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Audit Conversational Prompts:</strong> Manually input your core target questions into major LLMs quarterly to see if your brand is being suggested, ignored, or mischaracterized.</li>
                <li><strong>Monitor Impression-to-Click Ratios:</strong> Monitor search console data for pages that have high impressions but low click-through rates. This indicates you are winning direct answers or snippet spaces.</li>
              </ul>
            </div>
          </div>

          {/* Interactive Checklist Widget: AEO Content Template */}
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem', background: 'var(--color-white)' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 800, textAlign: 'center', fontSize: '1.75rem' }}>
              🎛️ Interactive Tool: AEO Content Template Sandbox
            </h3>
            <p style={{ color: 'var(--color-gray-dark)', textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.5 }}>
              Drafting a service page or blog post? Run through this verification checklist to ensure your text matches AEO ranking protocols:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                {
                  id: 'headingQuestion',
                  title: 'Heading: Question-Based Structure',
                  desc: 'The heading is phrased exactly as a direct, natural-language question (e.g., using "How much does a commercial roof replacement cost?" instead of "Pricing").'
                },
                {
                  id: 'firstParagraphAnswer',
                  title: 'First Paragraph: 40-to-60 Word Definitive Answer',
                  desc: 'Starts with a direct, definitive answer to the question in 40 to 60 words, giving the conclusion first and context later.'
                },
                {
                  id: 'visualAidTable',
                  title: 'Visual Aid: Machine-Parsed Grid',
                  desc: 'Includes a clean comparison table (Markdown data format) or a structured bulleted list directly supporting the answer.'
                },
                {
                  id: 'supportingContextStats',
                  title: 'Supporting Context: Factual & Source-Backed',
                  desc: 'Provides 200–300 words of deeper context, containing at least one verified statistic or primary source link.'
                },
                {
                  id: 'codeLayerSchema',
                  title: 'Code Layer: Injected Structured Data',
                  desc: 'Injects FAQ page schema, HowTo schema, or Speakable structured schema directly to the text layers.'
                }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleAeoCheck(item.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1.25rem', 
                    cursor: 'pointer',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: aeoChecklist[item.id] ? 'var(--color-red-light)' : 'var(--color-gray-light)',
                    border: `1px solid ${aeoChecklist[item.id] ? 'var(--color-red)' : 'var(--color-gray-mid)'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={aeoChecklist[item.id]}
                    onChange={() => {}} // Handled by parent div click
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-red)', cursor: 'pointer', marginTop: '0.2rem' }}
                  />
                  <div>
                    <h4 style={{ 
                      color: 'var(--color-dark)', 
                      textDecoration: aeoChecklist[item.id] ? 'line-through' : 'none', 
                      opacity: aeoChecklist[item.id] ? 0.7 : 1,
                      fontSize: '1.05rem',
                      fontWeight: 700
                    }}>
                      {item.title}
                    </h4>
                    <p style={{ color: 'var(--color-gray-dark)', margin: '0.25rem 0 0', fontSize: '0.925rem', lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* AEO template complete rewards banner */}
            {Object.values(aeoChecklist).every(Boolean) && (
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#d1fae5', border: '1px solid #10b981', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#065f46', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
                🎉 Verification Passed! This content layout matches all Answer Engine Optimization (AEO) protocols and is ready for voice search & LLM ingestion.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ⚡ NEW SECTION: GENERATIVE ENGINE OPTIMIZATION (GEO) BLUEPRINT ⚡ */}
      <section className="section bg-white" style={{ borderTop: '1px solid var(--color-gray-mid)', background: 'var(--color-white)' }}>
        <div className="container">
          <div className="section-title text-center" style={{ marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', background: 'rgba(211,47,47,0.15)', color: 'var(--color-red-dark)' }}>Generative AI Search</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>The 4-Part GEO Optimization Blueprint</h2>
            <p style={{ color: 'var(--color-gray-dark)', maxWidth: '750px', margin: '1rem auto 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Generative Engine Optimization (GEO) focuses on structuring website content and metadata specifically to be processed, cited, and displayed by LLM summaries (such as Google Overviews, ChatGPT Search, and Perplexity).
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '2.5rem', marginBottom: '4rem' }}>
            {/* GEO Strategy 1 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🌐</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Strategy 1: Transition from Keywords to "Entities"</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI models do not see words as isolated strings; they map out relationships between real-world entities (people, unique concepts, locations, and brands).
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Establish Machine-Readable Identity:</strong> Deploy explicit JSON-LD schema markup (Organization or LocalBusiness) in your website code. This gives AI engines an error-free map of exactly who you are and what you specialize in.</li>
                <li><strong>Claim Core Database Registries:</strong> Ensure your brand details are verified on foundational databases like Wikidata, Crunchbase, or highly respected, niche industry-specific registries where AI platforms pull their baseline knowledge.</li>
                <li><strong>Write Definitive Sentences:</strong> Craft simple, clear sentences on your about pages that leave zero room for ambiguity (e.g., "Our company manufactures industrial-grade bio-plastics in Austin, Texas").</li>
              </ul>
            </div>

            {/* GEO Strategy 2 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Strategy 2: Optimize for Machine "Extractability"</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI models operate on strict data-processing limits. If your answers are buried deep in conversational filler, the model will skip your page entirely to save computational power.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Lead with an Answer-First Summary:</strong> Start your main sections with a definitive 30-to-50 word summary. State the clear conclusion first, then elaborate with supporting context below.</li>
                <li><strong>Inject Hard Data and Direct Quotes:</strong> Studies tracking thousands of real-world AI engine queries show that content featuring verified statistics and explicit expert quotes receives a 30% to 40% increase in visibility and citations.</li>
                <li><strong>Ensure Server-Side Rendering:</strong> If your website relies entirely on complex client-side JavaScript to load text, AI web crawlers might miss the content. Keep pages structurally light and server-side rendered so text is immediately accessible.</li>
              </ul>
            </div>

            {/* GEO Strategy 3 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🤝</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Strategy 3: Build Web-Wide Consensus</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Generative engines determine the reliability of a fact by scanning multiple external sources to see if they back up what your website says.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Engage on Human-Driven Platforms:</strong> Build an active presence on community hubs like Reddit, Quora, and YouTube. Modern AI models frequently scan real human discussions to gauge authentic community sentiment around a brand.</li>
                <li><strong>Secure Unlinked Brand Mentions:</strong> Unlike traditional SEO which requires an active hyperlink, AI models recognize and value simple, plain-text mentions of your brand across respected industry news blogs and digital outlets.</li>
                <li><strong>Create Non-Commodity Content:</strong> Avoid thin summaries that an AI could easily generate on its own. Focus on original research, data-driven whitepapers, and proprietary frameworks that cannot be found anywhere else online.</li>
              </ul>
            </div>

            {/* GEO Strategy 4 */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-red)', display: 'flex', flexDirection: 'column', background: 'var(--color-gray-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>📊</span>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Strategy 4: Structure an Intent-Driven FAQ System</h3>
              </div>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                AI searches are rarely single keywords; they are conversational, multi-step prompts.
              </p>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--color-gray-dark)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <li><strong>Phrase Headings as Real Questions:</strong> Format your H2 and H3 tags exactly like the natural phrasing a human would speak out loud to their smart device or type into a chat prompt.</li>
                <li><strong>Build Interlinked Topic Clusters:</strong> Connect a broad pillar page directly to highly specific sub-pages that address logical follow-up questions, proving your complete topical authority to the AI crawler.</li>
              </ul>
            </div>
          </div>

          {/* Real-World Case Study: SEO to GEO */}
          <div className="card" style={{ padding: '2.5rem', background: 'var(--color-gray-light)', marginBottom: '4rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 800, textAlign: 'center', fontSize: '1.75rem' }}>
              Real-World Case Study: Shifting Content from SEO to GEO
            </h3>
            <p style={{ color: 'var(--color-gray-dark)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Let's look at how a Project Management Software company adapts its content structure to secure a citation inside AI search overviews:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
              {/* Traditional SEO Layout */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-white)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-mid)', borderTop: '4px solid #ef4444' }}>
                <h4 style={{ color: '#dc2626', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                  <span>❌</span> Traditional SEO Layout
                </h4>
                <strong style={{ display: 'block', color: 'var(--color-dark)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                  Heading: "Improving Team Velocity and Agile Output"
                </strong>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: 1.6, flexGrow: 1 }}>
                  Followed by long, dense paragraphs of marketing jargon. The AI engine skips this because it is too difficult to scan for an immediate answer, leading to lost visibility on LLM search results.
                </p>
                <div style={{ background: '#fef2f2', border: '1px dashed #ef4444', borderRadius: 'var(--radius-sm)', padding: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: '#991b1b', textAlign: 'center', fontWeight: 600 }}>
                  ⚠️ Bypassed by Generative Engines due to high extraction cost
                </div>
              </div>

              {/* Modern GEO Layout */}
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-white)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-mid)', borderTop: '4px solid #10b981' }}>
                <h4 style={{ color: '#059669', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
                  <span>✅</span> Modern GEO Layout
                </h4>
                <strong style={{ display: 'block', color: 'var(--color-dark)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
                  Heading: "How much time does the Agile framework save software development teams?"
                </strong>
                
                <div style={{ background: '#f0fdf4', borderLeft: '4px solid #10b981', padding: '1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#065f46', display: 'block', marginBottom: '0.25rem' }}>Direct Answer (40 Words)</span>
                  <p style={{ fontSize: '0.925rem', color: '#065f46', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                    "Implementing the Agile project management framework reduces overall software time-to-market by 24% and increases team development productivity by 16% on average."
                  </p>
                </div>

                {/* Rendered table */}
                <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-sm)', background: 'var(--color-white)', marginBottom: '1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Key Metric</th>
                        <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Traditional Waterfall</th>
                        <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Agile Framework</th>
                        <th style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>Shift</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Time-to-Market</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>12 to 18 Months</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>3 to 6 Months</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#059669', fontWeight: 600 }}>24% Reduction</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 600 }}>Defect Rate</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>Baseline Industry Std</td>
                        <td style={{ padding: '0.5rem 0.75rem' }}>30% Lower Defects</td>
                        <td style={{ padding: '0.5rem 0.75rem', color: '#059669', fontWeight: 600 }}>Higher Quality</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 'auto', padding: '0.75rem 1rem', background: '#d1fae5', color: '#065f46', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                  🏆 AI Overview engines extract this structured table and direct answer, citing the site.
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Weekly GEO Maintenance Checklist */}
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto 4rem', padding: '2.5rem', background: 'var(--color-white)', borderTopColor: 'var(--color-red)' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 800, textAlign: 'center', fontSize: '1.75rem' }}>
              🛠️ Interactive Tool: Weekly GEO Maintenance Checklist
            </h3>
            <p style={{ color: 'var(--color-gray-dark)', textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.5 }}>
              Maintain steady visibility on ChatGPT Search, Google Gemini, and Perplexity by running these drills weekly:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                {
                  id: 'rewriteHeadings',
                  title: 'Conversational Heading Audit',
                  desc: 'Rewrite at least two legacy article headings into conversational, question-based formats matching spoken intents.'
                },
                {
                  id: 'addStatQuote',
                  title: 'Inject Statistics & Quotes',
                  desc: 'Add one highly specific verified statistic or expert quote to your top-performing service pages to build machine trust.'
                },
                {
                  id: 'checkSchemaErrors',
                  title: 'Organization Schema Validation',
                  desc: 'Check your organization and local business schema markup using a structured data testing tool to guarantee zero errors.'
                },
                {
                  id: 'monitorBrandSummary',
                  title: 'LLM Brand Inquiries Monitor',
                  desc: 'Manually type your core brand name into ChatGPT or Gemini to monitor exactly how the AI summarizes your business.'
                }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleGeoCheck(item.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1.25rem', 
                    cursor: 'pointer',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: geoChecklist[item.id] ? 'var(--color-red-light)' : 'var(--color-gray-light)',
                    border: `1px solid ${geoChecklist[item.id] ? 'var(--color-red)' : 'var(--color-gray-mid)'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={geoChecklist[item.id]}
                    onChange={() => {}} // Handled by parent div click
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-red)', cursor: 'pointer', marginTop: '0.2rem' }}
                  />
                  <div>
                    <h4 style={{ 
                      color: 'var(--color-dark)', 
                      textDecoration: geoChecklist[item.id] ? 'line-through' : 'none', 
                      opacity: geoChecklist[item.id] ? 0.7 : 1,
                      fontSize: '1.05rem',
                      fontWeight: 700
                    }}>
                      {item.title}
                    </h4>
                    <p style={{ color: 'var(--color-gray-dark)', margin: '0.25rem 0 0', fontSize: '0.925rem', lineHeight: 1.5 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* GEO checklist complete rewards banner */}
            {Object.values(geoChecklist).every(Boolean) && (
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#d1fae5', border: '1px solid #10b981', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#065f46', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
                🎉 Weekly GEO Checklist Complete! Your content properties are fully aligned and indexed for Generative Search engines.
              </div>
            )}
          </div>

          {/* Search Engine Breakdown Video Reference */}
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', background: 'var(--color-dark)', color: 'var(--color-white)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '2.5rem' }}>📹</span>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--color-white)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Google's Official AI SEO & GEO Breakdown
              </h4>
              <p style={{ color: 'var(--color-gray-mid)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                For a complete walkthrough of the latest guidelines directly from search engine engineers, watch this breakdown video explaining how to adjust your content architecture so it surfaces inside modern AI search summaries and conversational modes.
              </p>
              <a 
                href="https://www.youtube.com/results?search_query=Google+Official+AI+SEO+and+GEO+Breakdown" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ background: 'var(--color-red)', padding: '0.75rem 2rem' }}
              >
                Watch Breakdown Video
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tool: Weekly Maintenance Checklist */}
      <section className="section bg-dark text-white">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="section-title text-center" style={{ marginBottom: '3.5rem' }}>
            <span className="badge" style={{ marginBottom: '1rem', background: 'rgba(211,47,47,0.25)', color: 'var(--color-red-light)' }}>
              Actionable Checklist
            </span>
            <h2 style={{ color: 'var(--color-white)', fontSize: '2.5rem', fontWeight: 800 }}>
              The Weekly Local SEO Maintenance Drill
            </h2>
            <p style={{ color: 'var(--color-gray-mid)', margin: '1rem auto 0', fontSize: '1.1rem' }}>
              Run through this quick baseline checklist on a routine weekly cadence to keep your map rankings stable against competitors. Click items to check them off!
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', padding: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Check 1 */}
              <div 
                onClick={() => toggleCheck('suggestedEdits')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1.25rem', 
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: checklist.suggestedEdits ? 'rgba(0,255,135,0.05)' : 'transparent',
                  border: `1px solid ${checklist.suggestedEdits ? 'rgba(0,255,135,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'all 0.2s'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={checklist.suggestedEdits}
                  onChange={() => {}} // handled by parent div click
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: '#00ff87', cursor: 'pointer', marginTop: '0.2rem' }}
                />
                <div>
                  <h4 style={{ 
                    color: 'var(--color-white)', 
                    textDecoration: checklist.suggestedEdits ? 'line-through' : 'none', 
                    opacity: checklist.suggestedEdits ? 0.7 : 1,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>
                    Check for Unauthorized Suggested Edits
                  </h4>
                  <p style={{ color: 'var(--color-gray-mid)', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
                    Audit your core Google Business, Apple Maps, and Bing Places profiles for any community-suggested edits to your operating hours, phone number, or address.
                  </p>
                </div>
              </div>

              {/* Check 2 */}
              <div 
                onClick={() => toggleCheck('respondReviews')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1.25rem', 
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: checklist.respondReviews ? 'rgba(0,255,135,0.05)' : 'transparent',
                  border: `1px solid ${checklist.respondReviews ? 'rgba(0,255,135,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'all 0.2s'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={checklist.respondReviews}
                  onChange={() => {}}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: '#00ff87', cursor: 'pointer', marginTop: '0.2rem' }}
                />
                <div>
                  <h4 style={{ 
                    color: 'var(--color-white)', 
                    textDecoration: checklist.respondReviews ? 'line-through' : 'none', 
                    opacity: checklist.respondReviews ? 0.7 : 1,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>
                    Respond to Newly Posted Reviews
                  </h4>
                  <p style={{ color: 'var(--color-gray-mid)', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
                    Verify your notification dashboard and reply to all new feedback posted by the community within 48 hours, keeping your responsiveness score high.
                  </p>
                </div>
              </div>

              {/* Check 3 */}
              <div 
                onClick={() => toggleCheck('uploadPhotos')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1.25rem', 
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: checklist.uploadPhotos ? 'rgba(0,255,135,0.05)' : 'transparent',
                  border: `1px solid ${checklist.uploadPhotos ? 'rgba(0,255,135,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'all 0.2s'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={checklist.uploadPhotos}
                  onChange={() => {}}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: '#00ff87', cursor: 'pointer', marginTop: '0.2rem' }}
                />
                <div>
                  <h4 style={{ 
                    color: 'var(--color-white)', 
                    textDecoration: checklist.uploadPhotos ? 'line-through' : 'none', 
                    opacity: checklist.uploadPhotos ? 0.7 : 1,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>
                    Upload 1 to 2 Fresh Smartphone Photos
                  </h4>
                  <p style={{ color: 'var(--color-gray-mid)', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
                    Upload unedited, real-life pictures of your team, office building, or completed jobs directly from your smartphone to your Google and Apple Maps profiles to signal activity.
                  </p>
                </div>
              </div>

              {/* Check 4 */}
              <div 
                onClick={() => toggleCheck('clickToCall')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1.25rem', 
                  cursor: 'pointer',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: checklist.clickToCall ? 'rgba(0,255,135,0.05)' : 'transparent',
                  border: `1px solid ${checklist.clickToCall ? 'rgba(0,255,135,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'all 0.2s'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={checklist.clickToCall}
                  onChange={() => {}}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: '#00ff87', cursor: 'pointer', marginTop: '0.2rem' }}
                />
                <div>
                  <h4 style={{ 
                    color: 'var(--color-white)', 
                    textDecoration: checklist.clickToCall ? 'line-through' : 'none', 
                    opacity: checklist.clickToCall ? 0.7 : 1,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>
                    Verify Mobile site "Click to Call" button
                  </h4>
                  <p style={{ color: 'var(--color-gray-mid)', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
                    Open your web app on a physical smartphone and test the main booking button to confirm the tel link is functioning and triggers dialing without error.
                  </p>
                </div>
              </div>
            </div>

            {/* Completion reward message */}
            {Object.values(checklist).every(Boolean) && (
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: '#00ff87', fontWeight: 600, animation: 'fadeIn 0.3s' }}>
                🎉 Weekly Maintenance Complete! Your local SEO map signals are fully active and refreshed for the week.
              </div>
            )}
          </div>

          <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-gray-mid)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
              Want assistance deploying advanced Local Business schema markup or setting up neighborhood landing pages?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/realtors" className="btn btn-primary">Join Realtor Partner Program</Link>
              <Link href="/services" className="btn btn-outline" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>View Services & Rates</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
