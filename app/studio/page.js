'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UnifiedForesightStudioPage() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('generator');
  const [topic, setTopic] = useState('Phase 1 Pre-Drywall ($275) & New Construction Inspections');
  const [city, setCity] = useState('Decatur');
  const [generatedPacket, setGeneratedPacket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    fetch('/api/studio')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  async function handleGenerate(e) {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, city })
      });
      const json = await res.json();
      if (json.ok) setGeneratedPacket(json.packet);
    } finally {
      setLoading(false);
    }
  }

  function copyText(key, text) {
    navigator.clipboard.writeText(text || '');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  }

  const m = data?.metrics || {};
  const pricing = data?.truth?.pricing || {};

  return (
    <main style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', padding: '2rem 1.25rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              VERCEL PRO UNIFIED COMMAND HUB • SINGLE SOURCE OF TRUTH (v{data?.truth?.version || '2026.10.20'})
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Foresight Unified Email, Social &amp; Video Marketing Studio
            </h1>
            <p style={{ color: '#94a3b8', margin: '0.35rem 0 0', fontSize: '0.92rem' }}>
              One harmonized brain governing Email Campaigns, 48h VIP Due Diligence OpenSMS, 7-Platform Social/GBP Posts, and @plsinspectnow Video Studio.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <a href="/vip-dispatch.html" style={{ background: '#10b981', color: '#06281e', fontWeight: 800, padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
              📲 Open 48h VIP SMS Dispatcher ({m.activeDueDiligence48h ?? '...'})
            </a>
            <a href="/warranty-dispatch.html" style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', fontWeight: 700, padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
              🛡️ 11-Month Warranty Dispatch
            </a>
            <Link href="/dashboard" style={{ background: '#1e293b', color: '#d4af37', border: '1px solid rgba(212,175,55,0.4)', fontWeight: 700, padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
              📊 SEO &amp; Rankings Dashboard
            </Link>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {[
            { label: '48h Active Due Diligence', val: m.activeDueDiligence48h ?? '434', sub: 'Strict 0–48h FMLS Window' },
            { label: 'Cloud Realtor Email Queue', val: m.cloudRealtorQueueCount ?? '311', sub: `${m.cloudEmailsSentTotal ?? 0} Dispatched + ${m.suppressedOptOuts ?? 414} Opt-Outs Guarded` },
            { label: 'Video & Carousel Packets', val: m.videoStudioPacketsReady ?? '22', sub: '9:16 Master + 30s GBP + 5-Slide PDF' },
            { label: 'LinkedIn & GBP Authority', val: m.linkedInStoriesReady ?? '30', sub: '100% Locked to data/truth.json' }
          ].map((stat, idx) => (
            <div key={idx} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.1rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d4af37', margin: '0.25rem 0' }}>{stat.val}</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{stat.sub}</div>
            </div>
          ))}
        </section>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'generator', label: '🎬 1-Click Unified Campaign Generator (Video + Social + Email)' },
            { id: 'packets', label: `📦 Ready Video & Carousel Studio Packets (${m.videoStudioPacketsReady ?? 22})` },
            { id: 'email', label: `📧 Email & 48h Due Diligence Queue (${m.activeDueDiligence48h ?? 434})` },
            { id: 'truth', label: '⚖️ Master Canonical Truth & Pricing Lock' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? '#d4af37' : '#111827',
                color: activeTab === t.id ? '#090d16' : '#cbd5e1',
                border: '1px solid ' + (activeTab === t.id ? '#d4af37' : '#1f2937'),
                padding: '0.65rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.86rem'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'generator' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#f8fafc' }}>
              Synchronized Multi-Channel Generator (Video Script + 5-Slide Carousel + GBP/LinkedIn/Reels + Realtor Email)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Enter any inspection topic and Metro Atlanta city below to generate a 100% harmonized campaign across Video, Social, GBP, and Email using your canonical pricing ($345 Homes, $295 Condos, $275 Pre-Drywall, $100 DeKalb Low-Flow, $35,000 Protection).
            </p>
            <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Topic (e.g., Phase 1 Pre-Drywall ($275), DeKalb Low-Flow Certificate ($100), Polybutylene Pipe)"
                style={{ background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}
              />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City (e.g., Decatur, Alpharetta, Buckhead)"
                style={{ background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem' }}
              />
              <button type="submit" disabled={loading} style={{ background: '#d4af37', color: '#090d16', fontWeight: 800, border: 'none', borderRadius: '8px', padding: '0 1.35rem', cursor: 'pointer' }}>
                {loading ? 'Generating...' : '⚡ Generate Unified Packet'}
              </button>
            </form>

            {generatedPacket && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37' }}>🎥 @plsinspectnow 30s Video Script</strong>
                    <button onClick={() => copyText('video', `${generatedPacket.videoStudioScript.hook0to3s}\n\n${generatedPacket.videoStudioScript.body3to22s}\n\n${generatedPacket.videoStudioScript.cta22to29s}`)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'video' ? '✓ Copied' : 'Copy Script'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.5rem' }}><strong>Scene:</strong> {generatedPacket.videoStudioScript.avatarPrompt}</p>
                  <p style={{ fontSize: '0.86rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{generatedPacket.videoStudioScript.hook0to3s}{'\n\n'}{generatedPacket.videoStudioScript.body3to22s}{'\n\n'}{generatedPacket.videoStudioScript.cta22to29s}</p>
                </div>

                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37' }}>📍 Google Business Profile &amp; LinkedIn Post</strong>
                    <button onClick={() => copyText('linkedin', generatedPacket.socialPosts.linkedin)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'linkedin' ? '✓ Copied' : 'Copy LinkedIn'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.84rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{generatedPacket.socialPosts.linkedin}</p>
                </div>

                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#d4af37' }}>📧 1-to-1 Realtor Email Campaign Snippet</strong>
                    <button onClick={() => copyText('email', `Subject: ${generatedPacket.emailCampaignSnippet.subject}\n\n${generatedPacket.emailCampaignSnippet.body}`)} style={{ background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.25rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                      {copiedKey === 'email' ? '✓ Copied' : 'Copy Email'}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 0.4rem' }}>Subject: {generatedPacket.emailCampaignSnippet.subject}</p>
                  <p style={{ fontSize: '0.83rem', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{generatedPacket.emailCampaignSnippet.body}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'packets' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Ready Foresight Video &amp; Carousel Packets (Synced from @plsinspectnow Studio)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {(data?.studioPackets || []).map(pkt => (
                <div key={pkt.jobId} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>{pkt.date} • {pkt.jobId}</div>
                  <div style={{ fontWeight: 700, margin: '0.35rem 0', fontSize: '0.95rem' }}>{pkt.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {pkt.hasMasterVideo ? '✅ 9:16 Video ' : ''}
                    {pkt.hasGbp30sVideo ? '• ✅ 30s GBP Video ' : ''}
                    {pkt.hasCarouselPdf ? `• ✅ ${pkt.slideCount}-Slide Carousel PDF` : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'email' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Active 48-Hour Under-Contract Due Diligence Feed &amp; Email Nurture</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {(data?.recentUnderContract || []).map(deal => (
                <div key={deal.id} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{deal.role} • {deal.date} • {deal.price}</div>
                  <div style={{ fontWeight: 700, margin: '0.25rem 0' }}>{deal.name} ({deal.brokerage})</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{deal.address}, {deal.city}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'truth' && (
          <section style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>Canonical Pricing &amp; Legal Guardrails (data/truth.json)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(pricing).map(([k, v]) => (
                <div key={k} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{k}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d4af37' }}>{v}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
