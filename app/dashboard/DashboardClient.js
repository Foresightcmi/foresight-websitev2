'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardClient({ initialKeywords = [], inventory = {} }) {
  const [activeTab, setActiveTab] = useState('rankings');
  const [searchTerm, setSearchTerm] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);

  const filteredKeywords = initialKeywords.filter(k => 
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleCheckKeyword(e) {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setLoadingQuery(true);
    setQueryResults(null);
    try {
      const res = await fetch(`/api/keyword-check?q=${encodeURIComponent(customQuery)}`);
      const data = await res.json();
      setQueryResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuery(false);
    }
  }

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '50px', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Loop Engineering Engine: Active
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: '#ffffff', margin: 0, fontWeight: 800 }}>
              Foresight SEO &amp; Rankings Command Center
            </h1>
            <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
              Autonomous Loop Engineering • Objective Metric Tracking • Live SERP Intelligence
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ borderColor: '#64748b', color: '#f1f5f9', padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
            >
              Open Google Search Console ↗
            </a>
            <Link 
              href="/" 
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
            >
              View Live Website
            </Link>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #3b82f6', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Ranked Footprint</span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0' }}>{inventory.totalStaticPages || 611}</div>
            <p style={{ color: '#38bdf8', fontSize: '0.85rem', margin: 0 }}>Pre-rendered static HTML routes</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #10b981', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>pSEO Sub-Niche Silos</span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0' }}>{inventory.totalSilos || 462}</div>
            <p style={{ color: '#4ade80', fontSize: '0.85rem', margin: 0 }}>77 Cities × 6 Core Services</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #f59e0b', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Verified Review Score</span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0' }}>4.9 ★</div>
            <p style={{ color: '#fbbf24', fontSize: '0.85rem', margin: 0 }}>43 Verified Google Reviews</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #ec4899', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active Loop Daemons</span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0' }}>4 Loops</div>
            <p style={{ color: '#f472b6', fontSize: '0.85rem', margin: 0 }}>Weekly, Biweekly, Monthly, Friday</p>
          </div>

        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'rankings', label: '🎯 Keyword Rankings & Targets' },
            { id: 'loops', label: '🔄 Loop Engineering Center' },
            { id: 'inventory', label: '📦 611-Page Sitemaps Matrix' },
            { id: 'gsc', label: '📈 GSC & Technical Health' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#334155' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #ef4444' : '2px solid transparent',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: RANKINGS & SERP MONITOR */}
        {activeTab === 'rankings' && (
          <div>
            
            {/* Live Custom Query Tester */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔍</span> Live Google Search Query &amp; Intent Explorer (Zero-Cost API)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Test any search phrase in real time to see live autocomplete demand and verify search intent without paid API credits.
              </p>

              <form onSubmit={handleCheckKeyword} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g. home inspector sandy springs ga, radon testing decatur..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  style={{
                    flex: '1 1 300px',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #475569',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.95rem'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={loadingQuery}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
                >
                  {loadingQuery ? 'Scanning Google...' : 'Scan Google SERP'}
                </button>
              </form>

              {queryResults && (
                <div style={{ marginTop: '1.5rem', background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h4 style={{ color: '#38bdf8', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                    Top Real-Time Google Autocomplete Queries for &ldquo;{queryResults.query}&rdquo;:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {queryResults.topSuggestions.map((s, i) => (
                      <a
                        key={i}
                        href={`https://www.google.com/search?q=${encodeURIComponent(s)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#1e293b',
                          border: '1px solid #475569',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '50px',
                          color: '#f1f5f9',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span>{s}</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyword Table with Filter */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                  Core High-Intent Atlanta Search Target Matrix ({filteredKeywords.length})
                </h3>
                <input
                  type="text"
                  placeholder="Filter keywords, cities, silos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #475569',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    width: '260px'
                  }}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Target Search Query</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Target Ranking Landing Page</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Intent Strength</th>
                      <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Live Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeywords.map((k, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '0.85rem 1.25rem', color: '#ffffff', fontWeight: 600 }}>
                          {k.keyword}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{
                            background: k.category.includes('pSEO') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: k.category.includes('pSEO') ? '#4ade80' : '#60a5fa',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {k.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <Link href={k.url} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                            {k.url}
                          </Link>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{k.intent}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#334155',
                              color: '#f8fafc',
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              textDecoration: 'none',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                          >
                            Check SERP ↗
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOOP ENGINEERING ARCHITECTURE */}
        {activeTab === 'loops' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                🔄 What is Loop Engineering? (The Greg Isenberg &amp; Elie Steinbock Method)
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Instead of manual one-time prompt engineering or paying monthly retainers to traditional marketing agencies, <strong>Loop Engineering</strong> hands repeatable business systems over to autonomous AI agent loops tied directly to an <strong>objective metric</strong>.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                  <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.25rem' }}>1. Measure</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Scrapes Google Suggest &amp; Search Console performance metrics on a recurring cron schedule.</p>
                </div>
                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                  <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '0.25rem' }}>2. Diagnose</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Identifies keyword gaps, missing internal links, or newly emerging competitor topics.</p>
                </div>
                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '0.25rem' }}>3. Act &amp; Deploy</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Enriches schemas, drafts 1,500+ word guides, updates pSEO silos, and verifies clean Next.js builds.</p>
                </div>
                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                  <div style={{ color: '#ec4899', fontWeight: 700, marginBottom: '0.25rem' }}>4. Verify &amp; Repeat</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Runs 0-error SSG Turbopack compilation and reports progress with $0 in API costs.</p>
                </div>
              </div>
            </div>

            {/* Active Loops Table */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem' }}>
                Active Daemon Execution Schedules
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem', fontSize: '1rem' }}>Loop 1: Weekly SEO Maintenance</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Scans all 611 routes for broken links, stale schemas, and build integrity.</p>
                  </div>
                  <span style={{ background: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '4px', color: '#93c5fd', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    Cron: 0 9 * * 1 (Mondays 9 AM)
                  </span>
                </div>

                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem', fontSize: '1rem' }}>Loop 2: Biweekly Keyword Action</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Queries live Google Suggest endpoints and cross-links underperforming posts.</p>
                  </div>
                  <span style={{ background: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '4px', color: '#86efac', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    Cron: 0 10 1,15 * * (1st &amp; 15th 10 AM)
                  </span>
                </div>

                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem', fontSize: '1rem' }}>Loop 3: Monthly Full SEO Overhaul</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Full competitor gap scan, publishes 1-2 pillar guides, updates llms.txt.</p>
                  </div>
                  <span style={{ background: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '4px', color: '#fde68a', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    Cron: 0 11 1 * * (1st of Month 11 AM)
                  </span>
                </div>

                <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #ec4899', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem', fontSize: '1rem' }}>Loop 4: Open-Source Strategy &amp; Method Hunter</h4>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Researches emerging open-source repos, tests zero-cost ranking tools &amp; GEO methods.</p>
                  </div>
                  <span style={{ background: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '4px', color: '#fbcfe8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    Cron: 0 10 * * 5 (Fridays 10 AM)
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INVENTORY EXPLORER */}
        {activeTab === 'inventory' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Indexed Architecture &amp; Page Inventory (611 Routes)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem' }}>🌆 77 City Landing Pages</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Localized landing pages covering all 10 Metro Atlanta counties.</p>
                <Link href="/service-areas" style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600 }}>Explore Service Areas Directory →</Link>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#4ade80', margin: '0 0 0.5rem' }}>🛠️ 462 Service Silo Pages</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Radon, Sewer Scope, Pool, Pre-Listing, New Construction across 77 cities.</p>
                <Link href="/services" style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600 }}>Explore Service Catalog →</Link>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#fbbf24', margin: '0 0 0.5rem' }}>🧱 8 Defect &amp; 4 Comparison Hubs</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>High-intent technical decision guides (EIFS Stucco, Polybutylene, 2-Inspector vs Solo).</p>
                <Link href="/defects/stucco-eifs-moisture-inspection" style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600 }}>View Stucco Defect Guide →</Link>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#f472b6', margin: '0 0 0.5rem' }}>📰 26 Authority Pillar Guides</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>In-depth 1,500+ word guides with schema, FAQPage, and Preferred Source buttons.</p>
                <Link href="/blog" style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 600 }}>Browse Blog Knowledgebase →</Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GSC & TECHNICAL HEALTH */}
        {activeTab === 'gsc' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1rem' }}>
              Google Search Console &amp; Technical Telemetry
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#4ade80', display: 'block', marginBottom: '0.25rem' }}>✓ Discovered - Not Indexed: PASSED</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Google cleared and validated newly submitted programmatic routes.</span>
                </div>
                <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  CLEARED
                </span>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '0.25rem' }}>🔄 Crawled - Currently Not Indexed: 28 Pages (Started)</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Down from 30 to 28. Googlebot is actively re-indexing enriched content.</span>
                </div>
                <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  IN PROGRESS
                </span>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.25rem' }}>🛡️ 301 Permanent Redirect Safety Net: Active</strong>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>All legacy 2025 URLs (/post/*, /category/*, /tag/*) forward PageRank to active routes.</span>
                </div>
                <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                  LIVE IN PROD
                </span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
