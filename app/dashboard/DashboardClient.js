'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function DashboardClient({ initialKeywords = [], inventory = {} }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [activeTab, setActiveTab] = useState('rankings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCounty, setSelectedCounty] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [customQuery, setCustomQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [loadingQuery, setLoadingQuery] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const auth = sessionStorage.getItem('foresight_dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (pinInput.trim() === '2110' || pinInput.trim() === 'foresight2026') {
      sessionStorage.setItem('foresight_dashboard_auth', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('foresight_dashboard_auth');
    setIsAuthenticated(false);
  }

  // Extract unique categories and counties
  const categories = useMemo(() => {
    const cats = new Set(initialKeywords.map(k => k.category));
    return ['ALL', ...Array.from(cats).sort()];
  }, [initialKeywords]);

  const counties = useMemo(() => {
    const counts = new Set(initialKeywords.map(k => k.county).filter(c => c && c !== 'All' && c !== 'Metro Atlanta'));
    return ['ALL', ...Array.from(counts).sort()];
  }, [initialKeywords]);

  // Filter keywords
  const filteredKeywords = useMemo(() => {
    return initialKeywords.filter(k => {
      const matchesSearch = 
        !searchTerm ||
        k.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (k.county && k.county.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'ALL' || k.category === selectedCategory;
      const matchesCounty = selectedCounty === 'ALL' || k.county === selectedCounty;

      return matchesSearch && matchesCategory && matchesCounty;
    });
  }, [initialKeywords, searchTerm, selectedCategory, selectedCounty]);

  // Reset pagination on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedCounty, pageSize]);

  const totalPages = Math.ceil(filteredKeywords.length / pageSize) || 1;
  const paginatedKeywords = useMemo(() => {
    if (pageSize === 0) return filteredKeywords; // Show all
    const start = (page - 1) * pageSize;
    return filteredKeywords.slice(start, start + pageSize);
  }, [filteredKeywords, page, pageSize]);

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

  if (!isClient) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading Command Center...
      </div>
    );
  }

  // 🔒 PIN Protection Gate Screen
  if (!isAuthenticated) {
    return (
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '2.5rem', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔐</div>
          <h1 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 800 }}>
            Private SEO Command Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            This dashboard is private to the owner. Enter your PIN to view keyword rankings, inventory telemetry, and autonomous loops.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="password"
              placeholder="Enter Owner PIN (e.g. 2110)"
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              autoFocus
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: pinError ? '1px solid #ef4444' : '1px solid #475569',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '1rem',
                textAlign: 'center',
                letterSpacing: '0.2em'
              }}
            />
            {pinError && (
              <p style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}>
                Incorrect PIN. Please try again.
              </p>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            >
              Unlock Dashboard →
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <Link href="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '50px', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Loop Engineering Engine: Active (Private Session)
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: '#ffffff', margin: 0, fontWeight: 800 }}>
              Foresight SEO &amp; Rankings Command Center
            </h1>
            <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
              Tracking All {inventory.totalTrackedKeywords || initialKeywords.length} Targeted Search Terms across {inventory.totalCounties || 20} Counties &amp; {inventory.totalCities || 87} Cities
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ borderColor: '#64748b', color: '#f1f5f9', padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
            >
              Open GSC ↗
            </a>
            <button
              onClick={handleLogout}
              style={{
                background: '#334155',
                color: '#cbd5e1',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🔒 Lock Dashboard
            </button>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #3b82f6', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Ranked Routes</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalStaticPages || 703}</div>
            <p style={{ color: '#38bdf8', fontSize: '0.8rem', margin: 0 }}>Pre-rendered static HTML routes</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #8b5cf6', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tracked Keywords</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{initialKeywords.length}</div>
            <p style={{ color: '#a78bfa', fontSize: '0.8rem', margin: 0 }}>All Cities, Counties &amp; Silos</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #10b981', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>pSEO Sub-Niche Silos</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalSilos || 522}</div>
            <p style={{ color: '#4ade80', fontSize: '0.8rem', margin: 0 }}>87 Cities × 6 Core Services</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #f59e0b', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>County Regional Hubs</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalCounties || 20}</div>
            <p style={{ color: '#fbbf24', fontSize: '0.8rem', margin: 0 }}>50-Mile Operating Radius</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #ec4899', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Verified Review Score</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>4.9 ★</div>
            <p style={{ color: '#f472b6', fontSize: '0.8rem', margin: 0 }}>43 Verified Google Reviews</p>
          </div>

        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'rankings', label: `🎯 All Tracked Targets (${initialKeywords.length})` },
            { id: 'loops', label: '🔄 Loop Engineering Center' },
            { id: 'inventory', label: `📦 703-Page Sitemaps Matrix` },
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

            {/* Keyword Table Controls & Filter Bar */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              
              {/* Filter Toolbar */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                    Target Keywords &amp; Ranking Matrix ({filteredKeywords.length} matching)
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* County Filter */}
                    <select
                      value={selectedCounty}
                      onChange={(e) => setSelectedCounty(e.target.value)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #475569',
                        background: '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="ALL">All Counties ({counties.length - 1})</option>
                      {counties.filter(c => c !== 'ALL').map(c => (
                        <option key={c} value={c}>{c} County</option>
                      ))}
                    </select>

                    {/* Search Filter */}
                    <input
                      type="text"
                      placeholder="Search city, county, keyword, URL..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #475569',
                        background: '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        width: '240px'
                      }}
                    />
                  </div>
                </div>

                {/* Category Filter Chips */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {categories.map(cat => {
                    const count = cat === 'ALL' 
                      ? initialKeywords.length 
                      : initialKeywords.filter(k => k.category === cat).length;
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          background: isSelected ? '#ef4444' : '#0f172a',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          border: isSelected ? '1px solid #ef4444' : '1px solid #334155',
                          borderRadius: '50px',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 700 : 500,
                          transition: 'all 0.15s'
                        }}
                      >
                        {cat === 'ALL' ? 'All Matrix' : cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>#</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Target Search Query</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>County</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Target Ranking Landing Page</th>
                      <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Live Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedKeywords.map((k, idx) => {
                      const rowNum = pageSize === 0 ? idx + 1 : (page - 1) * pageSize + idx + 1;
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #334155', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '0.75rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                            {rowNum}
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', color: '#ffffff', fontWeight: 600 }}>
                            {k.keyword}
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <span style={{
                              background: k.category.includes('pSEO') || k.category.includes('Hub') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: k.category.includes('pSEO') || k.category.includes('Hub') ? '#4ade80' : '#60a5fa',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {k.category}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                            {k.county || 'All'}
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem' }}>
                            <Link href={k.url} style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem' }}>
                              {k.url}
                            </Link>
                          </td>
                          <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: '#334155',
                                color: '#f8fafc',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <span>Check SERP</span>
                              <span>↗</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedKeywords.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#94a3b8' }}>
                          No search terms match your current filter. Try selecting &ldquo;All Matrix&rdquo; or clearing the search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>Showing {paginatedKeywords.length} of {filteredKeywords.length} terms</span>
                  <span>•</span>
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: '1px solid #475569',
                      borderRadius: '4px',
                      padding: '0.2rem 0.4rem',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={0}>Show All ({filteredKeywords.length})</option>
                  </select>
                </div>

                {pageSize > 0 && totalPages > 1 && (
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        background: '#0f172a',
                        color: page === 1 ? '#475569' : '#cbd5e1',
                        border: '1px solid #334155',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      ← Previous
                    </button>
                    
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0 0.5rem' }}>
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{
                        background: '#0f172a',
                        color: page === totalPages ? '#475569' : '#cbd5e1',
                        border: '1px solid #334155',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LOOP ENGINEERING CENTER */}
        {activeTab === 'loops' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                🔄 Autonomous Loop Engineering System
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '850px', marginBottom: '1.5rem' }}>
                Based on Elie Steinbock &amp; Greg Isenberg&rsquo;s closed-loop engineering architecture: continuous autonomous cycles that <strong>Measure</strong> telemetry, <strong>Diagnose</strong> anomalies, <strong>Act</strong> autonomously without manual intervention, and <strong>Verify</strong> in production builds.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>SCHEDULE 1</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Weekly Maintenance Daemon</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs every Monday at 9:00 AM. Scans all pages, validates schemas, verifies links, and fixes code issues directly.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 9 * * 1</code>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>SCHEDULE 2</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Biweekly Keyword Action</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs 1st &amp; 15th at 10:00 AM. Searches for trending home inspection queries and enriches existing content.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 10 1,15 * *</code>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>SCHEDULE 3</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Monthly Overhaul &amp; Synthesis</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs 1st of month at 11:00 AM. Conducts deep competitive audits and generates 1-2 new high-intent pillar guides.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 11 1 * *</code>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#f472b6', fontWeight: 700, fontSize: '0.85rem' }}>SCHEDULE 4</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Open-Source Strategy Hunter</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs every Friday at 10:00 AM. Scours GitHub for zero-cost open-source tools and implements ranking methods.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 10 * * 5</code>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: INVENTORY MATRIX */}
        {activeTab === 'inventory' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              📦 Complete Programmatic SEO &amp; Content Footprint ({inventory.totalStaticPages || 703} Pages)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your static pre-rendered inventory across all Metro Atlanta regional and municipal tiers:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>County Landing Hubs</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalCounties || 20}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>50-mile operating radius</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>City Landing Pages</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalCities || 87}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>High-intent municipal hubs</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 600 }}>Sub-Niche Service Silos</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalSilos || 522}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Radon, Sewer, Pool, Termite</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>Pillar Blog Articles</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalPosts || 26}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>1,500+ word guides</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#f472b6', fontSize: '0.85rem', fontWeight: 600 }}>Defects &amp; Comparisons</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{(inventory.totalDefects || 6) + (inventory.totalComparisons || 4)}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>AEO defect diagnostics &amp; closers</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}>Luxury Neighborhoods</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalNeighborhoods || 10}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Buckhead, Inman Park, etc.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GSC & TECHNICAL HEALTH */}
        {activeTab === 'gsc' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              📈 Google Search Console (GSC) Health Diagnostics
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              All technical crawl parameters, XML sitemaps, and robots directives are configured for rapid Google indexing:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#4ade80', fontSize: '1rem', margin: '0 0 0.5rem' }}>✓ XML Sitemaps</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
                  <Link href="/sitemap.xml" target="_blank" style={{ color: '#38bdf8', textDecoration: 'underline' }}>/sitemap.xml</Link> dynamically lists all 703 pre-rendered routes with proper priority and change frequency tags.
                </p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#4ade80', fontSize: '1rem', margin: '0 0 0.5rem' }}>✓ Private Gate / Robots.txt</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
                  <Link href="/robots.txt" target="_blank" style={{ color: '#38bdf8', textDecoration: 'underline' }}>/robots.txt</Link> disallows <code>/dashboard</code> to keep telemetry private while granting search bots access to all public pSEO silos.
                </p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#4ade80', fontSize: '1rem', margin: '0 0 0.5rem' }}>✓ AI Search Grounding</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
                  <Link href="/llms.txt" target="_blank" style={{ color: '#38bdf8', textDecoration: 'underline' }}>/llms.txt</Link> &amp; <Link href="/llms-full.txt" target="_blank" style={{ color: '#38bdf8', textDecoration: 'underline' }}>/llms-full.txt</Link> feed ChatGPT, Perplexity, and Gemini the 50-mile radius CMI authority dataset.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
