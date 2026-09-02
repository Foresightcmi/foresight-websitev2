'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function DashboardClient({ 
  initialKeywords = [], 
  inventory = {}, 
  citationsData = null, 
  realtorData = null 
}) {
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
  const [copiedKey, setCopiedKey] = useState(null);
  const [reviewClientName, setReviewClientName] = useState('Marcus');
  const [reviewClientCity, setReviewClientCity] = useState('Alpharetta');
  const [reviewServiceType, setReviewServiceType] = useState('Home Inspection + Radon');


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

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

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
            This dashboard is private to the owner. Enter your PIN to view keyword rankings, local authority citations, brokerage campaigns, and autonomous loops.
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
              Unlock Command Center →
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

  const profile = citationsData?.entity_profile || {};
  const activeCount = citationsData?.active_verified_count || 7;
  const totalCount = citationsData?.directories_count || 16;
  const scorePercent = Math.round((activeCount / totalCount) * 100);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #334155', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '50px', color: '#4ade80', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              FLOW Multi-Agent Engine: Active (710 Static Routes)
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: '#ffffff', margin: 0, fontWeight: 800 }}>
              Foresight SEO &amp; Operations Command Center
            </h1>
            <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
              Tracking All {initialKeywords.length} Search Targets across {inventory.totalCounties || 20} Counties &bull; {totalCount} Authority Citations &bull; {realtorData?.total_target_brokerages || 6} Brokerage Campaigns
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <a 
              href="https://pagespeed.web.dev/analysis/https-www-fhinspectionsatl-com/dcomz1s5sg?hl=en&form_factor=mobile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ borderColor: '#38bdf8', color: '#38bdf8', padding: '0.55rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
              ⚡ PageSpeed Insights ↗
            </a>
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ borderColor: '#64748b', color: '#f1f5f9', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              Open GSC ↗
            </a>
            <button
              onClick={handleLogout}
              style={{
                background: '#334155',
                color: '#cbd5e1',
                border: 'none',
                padding: '0.55rem 0.9rem',
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #3b82f6', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Live Routes</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalStaticPages || 710}</div>
            <p style={{ color: '#38bdf8', fontSize: '0.8rem', margin: 0 }}>Static pre-rendered HTML</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #8b5cf6', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tracked Keywords</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{initialKeywords.length}</div>
            <p style={{ color: '#a78bfa', fontSize: '0.8rem', margin: 0 }}>All Cities, Counties &amp; Silos</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #10b981', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Local Authority Score</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', margin: '0.25rem 0' }}>{activeCount} / {totalCount}</div>
            <p style={{ color: '#4ade80', fontSize: '0.8rem', margin: 0 }}>{scorePercent}% Active &bull; {citationsData?.opportunity_count || 9} Pending</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #f59e0b', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Brokerage Campaigns</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{realtorData?.total_target_brokerages || 6} Luxury</div>
            <p style={{ color: '#fbbf24', fontSize: '0.8rem', margin: 0 }}>Tailored VIP Pitch Modules</p>
          </div>

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderTop: '4px solid #ec4899', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Desktop PageSpeed</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', margin: '0.25rem 0' }}>100 / 100</div>
            <p style={{ color: '#f472b6', fontSize: '0.8rem', margin: 0 }}>Perf, A11y, BP, SEO (4x 100)</p>
          </div>

        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'rankings', label: `🎯 Search Targets (${initialKeywords.length})` },
            { id: 'citations', label: `🏛️ Authority Citations (${activeCount}/${totalCount})` },
            { id: 'reviews', label: '⭐ Review Velocity Engine' },
            { id: 'gbp', label: '📍 GBP Power Matrix' },
            { id: 'realtors', label: `🤝 Brokerage Outreach (${realtorData?.total_target_brokerages || 6})` },
            { id: 'loops', label: '🔄 Autonomous Daemons (4 Crons)' },
            { id: 'inventory', label: `📦 713-Page Matrix` },
            { id: 'gsc', label: '⚡ Performance & Telemetry' },
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
                <span>🔍</span> Live Google Search Query &amp; Intent Explorer (Zero-Cost Public API)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Test any search phrase in real time to see live autocomplete demand and verify search intent without third-party paid credits.
              </p>

              <form onSubmit={handleCheckKeyword} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g. home inspector sandy springs ga, radon testing decatur, new construction inspection..."
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

        {/* TAB 2: LOCAL CITATIONS & AUTHORITY ENGINE */}
        {activeTab === 'citations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Progress / Elevation Header */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.25rem', fontWeight: 800 }}>
                    🏛️ Local Authority &amp; Tier-1 Citation Ecosystem ({activeCount} of {totalCount} Active)
                  </h3>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
                    Elevate your domain authority and Google 3-Pack rankings by claiming the {citationsData?.opportunity_count || 9} pending high-DA citations below.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>{scorePercent}%</span>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Authority Completion</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '10px', background: '#0f172a', borderRadius: '5px', overflow: 'hidden', border: '1px solid #334155', marginBottom: '1.5rem' }}>
                <div style={{ width: `${scorePercent}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: '5px', transition: 'width 0.5s ease-in-out' }}></div>
              </div>

              {/* Quick NAP Copy Kit */}
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ color: '#38bdf8', fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>
                    📋 1-Click Copy-Paste NAP Data Kit (Use for all directory submissions)
                  </h4>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Click any card to copy</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  
                  <div 
                    onClick={() => handleCopyText(profile.business_name || 'Foresight Home Inspections, LLC', 'nap_name')}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>BUSINESS NAME</span>
                      <span style={{ color: copiedKey === 'nap_name' ? '#4ade80' : '#38bdf8' }}>{copiedKey === 'nap_name' ? '✓ Copied' : 'Copy'}</span>
                    </div>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem' }}>{profile.business_name || 'Foresight Home Inspections, LLC'}</div>
                  </div>

                  <div 
                    onClick={() => handleCopyText(profile.phone || '678-480-2110', 'nap_phone')}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>VERIFIED PHONE</span>
                      <span style={{ color: copiedKey === 'nap_phone' ? '#4ade80' : '#38bdf8' }}>{copiedKey === 'nap_phone' ? '✓ Copied' : 'Copy'}</span>
                    </div>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem' }}>{profile.phone || '678-480-2110'}</div>
                  </div>

                  <div 
                    onClick={() => handleCopyText('1816 South Deshon Road, Lithonia, GA 30058', 'nap_address')}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>VERIFIED ADDRESS</span>
                      <span style={{ color: copiedKey === 'nap_address' ? '#4ade80' : '#38bdf8' }}>{copiedKey === 'nap_address' ? '✓ Copied' : 'Copy'}</span>
                    </div>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem' }}>1816 South Deshon Road, Lithonia, GA 30058</div>
                  </div>

                  <div 
                    onClick={() => handleCopyText(profile.website || 'https://www.fhinspectionsatl.com', 'nap_web')}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>WEBSITE URL</span>
                      <span style={{ color: copiedKey === 'nap_web' ? '#4ade80' : '#38bdf8' }}>{copiedKey === 'nap_web' ? '✓ Copied' : 'Copy'}</span>
                    </div>
                    <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem' }}>{profile.website || 'https://www.fhinspectionsatl.com'}</div>
                  </div>

                  <div 
                    onClick={() => handleCopyText(profile.short_description || '', 'nap_short_bio')}
                    style={{ gridColumn: 'span 2', background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>SHORT BIO (FOR DIRECTORIES WITH CHARACTER LIMITS)</span>
                      <span style={{ color: copiedKey === 'nap_short_bio' ? '#4ade80' : '#38bdf8' }}>{copiedKey === 'nap_short_bio' ? '✓ Copied' : 'Copy'}</span>
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: 1.4 }}>{profile.short_description}</div>
                  </div>

                  <div 
                    onClick={() => handleCopyText(profile.long_description || '', 'nap_long_bio')}
                    style={{ gridColumn: 'span 2', background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-sm)', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem' }}>
                      <span>COMPREHENSIVE BIO (FULL SUBMISSION)</span>
                      <span style={{ color: copiedKey === 'nap_long_bio' ? '#4ade80' : '#38bdf8' }}>{copiedKey === 'nap_long_bio' ? '✓ Copied' : 'Copy'}</span>
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: 1.4 }}>{profile.long_description}</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Directory Authority Grid / Matrix */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                📡 All {totalCount} Tier-1 Authority Citation Profiles &amp; Action Portal
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Below is the full breakdown of verified active listings and direct submission portals for pending high-impact directories.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {(citationsData?.directories || []).map((d, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      background: '#0f172a', 
                      border: d.status === 'ACTIVE_VERIFIED' ? '1px solid #334155' : '1px solid rgba(245, 158, 11, 0.4)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {d.impact === 'CRITICAL' && (
                      <div style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.65rem', borderRadius: '0 0 0 6px', letterSpacing: '0.05em' }}>
                        CRITICAL SIGNAL
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', paddingRight: d.impact === 'CRITICAL' ? '4rem' : 0 }}>
                      <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                        {d.name}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        DA {d.domain_authority}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>• {d.category}</span>
                      <span style={{
                        marginLeft: 'auto',
                        background: d.status === 'ACTIVE_VERIFIED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: d.status === 'ACTIVE_VERIFIED' ? '#4ade80' : '#fbbf24',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {d.status === 'ACTIVE_VERIFIED' ? '✓ Active Verified' : '⚡ Opportunity (Click to Claim)'}
                      </span>
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '0 0 1.25rem', lineHeight: 1.5, flexGrow: 1 }}>
                      {d.notes}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      {d.status === 'ACTIVE_VERIFIED' ? (
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ borderColor: '#475569', color: '#f1f5f9', padding: '0.45rem 0.85rem', fontSize: '0.8rem', width: '100%', textAlign: 'center' }}
                        >
                          View Live Profile ↗
                        </a>
                      ) : (
                        <a
                          href={d.claim_url || d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', width: '100%', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                        >
                          <span>Claim / Register Listing</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: BROKERAGE & REALTOR OUTREACH ENGINE */}
        {activeTab === 'realtors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🤝</span> Metro Atlanta Luxury Brokerage VIP Outreach Modules
                </h3>
                <Link
                  href="/realtors"
                  target="_blank"
                  className="btn btn-outline"
                  style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                >
                  Open Live Agent Portal ↗
                </Link>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Click below to instantly copy customized, high-converting partnership pitches tailored to each major Metro Atlanta real estate brokerage:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
                {(realtorData?.campaigns || []).map((c, idx) => (
                  <div key={idx} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ color: '#ffffff', fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{c.brokerage}</h4>
                        <span style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>{c.office}</span>
                      </div>
                      <span style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {c.specialty}
                      </span>
                    </div>

                    <div style={{ flexGrow: 1, background: '#1e293b', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5, maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {c.outreach_template}
                    </div>

                    <button
                      onClick={() => handleCopyText(c.outreach_template, `broker_${idx}`)}
                      className="btn btn-primary"
                      style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <span>{copiedKey === `broker_${idx}` ? '✓ Copied to Clipboard!' : '📋 Copy Outreach Email'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: LOOP ENGINEERING CENTER */}
        {activeTab === 'loops' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                🔄 Autonomous Closed-Loop Engineering Engine
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '850px', marginBottom: '1.5rem' }}>
                Closed-loop self-healing architecture: continuous autonomous daemons that <strong>Measure</strong> rankings &amp; Core Web Vitals, <strong>Diagnose</strong> anomalies, <strong>Act</strong> autonomously without manual intervention, and <strong>Verify</strong> in production builds.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                
                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>DAEMON 1</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Weekly Technical SEO Daemon</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs every Monday at 9:00 AM. Scans all 710 pages, validates schemas, verifies links, and fixes code issues directly.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 9 * * 1</code>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem' }}>DAEMON 2</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Biweekly Search Action</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs 1st &amp; 15th at 10:00 AM. Searches for trending Georgia home inspection queries and enriches existing content.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 10 1,15 * *</code>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>DAEMON 3</span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Active</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: '0 0 0.5rem' }}>Monthly Overhaul &amp; Synthesis</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>Runs 1st of month at 11:00 AM. Conducts deep competitive audits and generates 1-2 new high-intent pillar guides.</p>
                  <code style={{ fontSize: '0.75rem', color: '#a78bfa', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>Cron: 0 11 1 * *</code>
                </div>

                <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#f472b6', fontWeight: 700, fontSize: '0.85rem' }}>DAEMON 4</span>
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

        {/* TAB 5: INVENTORY MATRIX */}
        {activeTab === 'inventory' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              📦 Complete Programmatic Footprint ({inventory.totalStaticPages || 710} Live Pre-Rendered Pages)
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
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Radon, Sewer, Pool, Termite, STR</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>Pillar Blog Articles</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{inventory.totalPosts || 28}</div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>1,500+ word guides</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <span style={{ color: '#f472b6', fontSize: '0.85rem', fontWeight: 600 }}>Defects &amp; Comparisons</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{(inventory.totalDefects || 7) + (inventory.totalComparisons || 5)}</div>
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

        {/* TAB 6: CORE WEB VITALS & TECHNICAL HEALTH */}
        {activeTab === 'gsc' && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                  ⚡ Core Web Vitals &amp; PageSpeed Telemetry
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
                  Lighthouse 13.4.1 verified production benchmarks on Next.js 16 (Turbopack)
                </p>
              </div>
              <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700 }}>
                Quadruple 100 Desktop Benchmark
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>First Contentful Paint (FCP)</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', margin: '0.25rem 0' }}>1.1s</div>
                <p style={{ color: '#4ade80', fontSize: '0.75rem', margin: 0 }}>✓ Google Fast Zone</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Blocking Time (TBT)</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', margin: '0.25rem 0' }}>48ms</div>
                <p style={{ color: '#4ade80', fontSize: '0.75rem', margin: 0 }}>✓ Non-blocking scripts</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Cumulative Layout Shift (CLS)</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4ade80', margin: '0.25rem 0' }}>0.000</div>
                <p style={{ color: '#4ade80', fontSize: '0.75rem', margin: 0 }}>✓ Zero visual jump</p>
              </div>

              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155', textAlign: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Agentic Browsing Readiness</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', margin: '0.25rem 0' }}>3 / 3</div>
                <p style={{ color: '#38bdf8', fontSize: '0.75rem', margin: 0 }}>✓ llms.txt &amp; JSON-LD</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#0f172a', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#4ade80', fontSize: '1rem', margin: '0 0 0.5rem' }}>✓ XML Sitemaps</h4>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: 0 }}>
                  <Link href="/sitemap.xml" target="_blank" style={{ color: '#38bdf8', textDecoration: 'underline' }}>/sitemap.xml</Link> dynamically lists all 710 pre-rendered routes with proper priority and change frequency tags.
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
