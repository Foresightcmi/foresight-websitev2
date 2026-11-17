import Link from 'next/link';

export const metadata = {
  title: 'Foresight Home Inspections MCP Server | Model Context Protocol',
  description: 'Connect Claude, ChatGPT, Gemini, Grok, Cursor, or custom AI agents to the Foresight Home Inspections Streamable HTTP MCP server at /api/mcp.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/mcp',
  },
  openGraph: {
    title: 'Foresight Home Inspections MCP Server',
    description: 'Streamable HTTP Model Context Protocol (MCP) tools and resources for Metro Atlanta home inspection quotes, 20-county coverage, and slot booking.',
    url: 'https://www.fhinspectionsatl.com/mcp',
    siteName: 'Foresight Home Inspections',
    locale: 'en_US',
    type: 'website',
  },
};

export default function McpPage() {
  return (
    <section style={{ maxWidth: '940px', margin: '0 auto', padding: '4rem 1.25rem 5rem', color: '#F8FAFC' }}>
      <p style={{ color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
        Model Context Protocol (Streamable HTTP)
      </p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', lineHeight: 1.2, marginBottom: '1rem' }}>
        Foresight Home Inspections MCP Server
      </h1>
      <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        Connect any MCP-compatible AI assistant directly to <code>https://www.fhinspectionsatl.com/api/mcp</code> (manifest at <a href="/.well-known/mcp.json" style={{ color: 'var(--color-gold)' }}>/.well-known/mcp.json</a>). No API key is required. For REST OpenAPI 3.1 endpoints, visit our <Link href="/developers" style={{ color: 'var(--color-gold)' }}>Foresight Home Inspections API Documentation</Link>.
      </p>
      <div style={{ background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Available MCP Tools &amp; Resources</h2>
        <ul style={{ color: '#CBD5E1', lineHeight: 1.75, paddingLeft: '1.25rem' }}>
          <li><code>calculate_quote</code> — Deterministic residential inspection fee calculator (Single-Family from $345, Condos/Townhomes from $295, Pre-Drywall from $275, New Construction from $400; auxiliary &amp; STR services return Call (678) 480-2110 for Quote).</li>
          <li><code>check_city_coverage</code> — Verify 87+ Metro Atlanta municipalities and 5-digit Georgia ZIP codes across 20 counties.</li>
          <li><code>get_service_pricing</code> — Retrieve official scope, warranty coverage, and fee schedule tiers.</li>
          <li><code>get_sample_report_summary</code> — Inspect interactive digital report deliverables with infrared thermal and 4K drone roof documentation.</li>
          <li><code>book_inspection_slot</code> — Submit a tentative booking or callback request for office confirmation.</li>
          <li><code>resources/list</code> &amp; <code>resources/read</code> — Read <code>llms.txt</code>, <code>#pricing-truth</code>, and <code>#service-coverage</code> directly over JSON-RPC 2.0.</li>
        </ul>
      </div>

      <div style={{ background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Quick Configuration &amp; JSON-RPC 2.0 Protocol</h2>
        <p style={{ color: '#CBD5E1', lineHeight: 1.7, marginBottom: '1rem' }}>
          The Foresight MCP endpoint implements stateless Streamable HTTP over standard JSON-RPC 2.0, allowing AI assistants in Claude Desktop, Cursor, Google Antigravity, ChatGPT Actions, and custom real estate due diligence workflows to query verified pricing, municipal service-area boundaries, and inspection availability without scraping HTML.
        </p>
        <pre style={{ background: '#020617', color: '#E2E8F0', padding: '1rem', borderRadius: '10px', overflowX: 'auto', fontSize: '0.86rem', lineHeight: 1.5, border: '1px solid rgba(148, 163, 184, 0.2)', marginBottom: '1rem' }}>{`{
  "mcpServers": {
    "foresight-home-inspections": {
      "url": "https://www.fhinspectionsatl.com/api/mcp"
    }
  }
}`}</pre>
        <p style={{ color: '#CBD5E1', lineHeight: 1.7, margin: 0 }}>
          Every response reflects our authoritative operational standards led by Certified Master Inspector Christopher Boykin (CMI #MICB-1082, InterNACHI #NACHI18051119): two certified inspectors on every full residential evaluation, complimentary calibrated infrared thermal camera imaging, 4K aerial drone roof scans, same-day interactive digital report delivery, and $35,000 in combined protection ($10,000 Elite Master Warranty with $0 deductible plus the $25,000 InterNACHI Honor Guarantee). Verified Licensed Georgia Realtors with an active GREC license number qualify for a $25 courtesy Realtor adjustment.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
        <Link href="/developers" className="btn btn-outline" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>
          REST OpenAPI Documentation &rarr;
        </Link>
        <Link href="/ai-fact-sheet" className="btn btn-outline" style={{ borderColor: '#CBD5E1', color: '#CBD5E1' }}>
          Official AI Fact Sheet &rarr;
        </Link>
        <Link href="/quote" className="btn btn-primary">
          Interactive Quote Calculator &rarr;
        </Link>
      </div>
    </section>
  );
}
