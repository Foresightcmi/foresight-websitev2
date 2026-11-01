import Link from 'next/link';

export const metadata = {
  title: 'Foresight Home Inspections API & MCP Documentation',
  description: 'Public OpenAPI 3.1 REST endpoints, Streamable HTTP MCP server (/api/mcp), authentication, rate limits, and example requests for AI agents and developers.',
  alternates: {
    canonical: 'https://www.fhinspectionsatl.com/developers',
  },
  openGraph: {
    title: 'Foresight Home Inspections API & MCP Documentation',
    description: 'Public read-only OpenAPI 3.1 REST endpoints and Streamable HTTP Model Context Protocol (MCP) server for Metro Atlanta home inspection quotes and coverage.',
    url: 'https://www.fhinspectionsatl.com/developers',
    siteName: 'Foresight Home Inspections',
    locale: 'en_US',
    type: 'website',
  },
};

export default function DevelopersPage() {
  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.72)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    borderRadius: '14px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  };
  const preStyle = {
    background: '#090D16',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '1rem',
    overflowX: 'auto',
    fontSize: '0.86rem',
    color: '#E2E8F0',
    lineHeight: 1.55,
  };

  return (
    <section style={{ maxWidth: '980px', margin: '0 auto', padding: '4rem 1.25rem 5rem', color: '#F8FAFC' }}>
      <p style={{ color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
        AI Agent, MCP &amp; OpenAPI 3.1 Reference
      </p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', lineHeight: 1.18, marginBottom: '1rem' }}>
        Foresight Home Inspections API &amp; MCP Server Documentation
      </h1>
      <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        Foresight Home Inspections provides a free, public OpenAPI 3.1 REST API and a Streamable HTTP Model Context Protocol (MCP) server so AI assistants, real estate platforms, and buyer agents can calculate deterministic Metro Atlanta home inspection quotes, verify 20-county municipal coverage, and request booking slots.
      </p>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Authentication, Discovery &amp; Rate Limits</h2>
        <ul style={{ color: '#CBD5E1', lineHeight: 1.75, paddingLeft: '1.25rem' }}>
          <li><strong>Authentication:</strong> Public read-only endpoints require <code>no authentication</code> and no API key.</li>
          <li><strong>OpenAPI 3.1 Specification:</strong> <a href="/openapi.json" style={{ color: 'var(--color-gold)' }}>https://www.fhinspectionsatl.com/openapi.json</a></li>
          <li><strong>RFC 9727 API Catalog:</strong> <a href="/.well-known/api-catalog" style={{ color: 'var(--color-gold)' }}>https://www.fhinspectionsatl.com/.well-known/api-catalog</a></li>
          <li><strong>MCP Manifest &amp; Endpoint:</strong> <a href="/.well-known/mcp.json" style={{ color: 'var(--color-gold)' }}>/.well-known/mcp.json</a> &rarr; <code>POST https://www.fhinspectionsatl.com/api/mcp</code> (<Link href="/mcp" style={{ color: 'var(--color-gold)' }}>MCP Server Guide</Link>)</li>
          <li><strong>LLM Instructions:</strong> <a href="/llms.txt" style={{ color: 'var(--color-gold)' }}>/llms.txt</a> and <a href="/llms-full.txt" style={{ color: 'var(--color-gold)' }}>/llms-full.txt</a> (all content pages also honor <code>Accept: text/markdown</code>).</li>
          <li><strong>Rate Limit &amp; Versioning:</strong> 120 requests per 60 seconds per client IP (IETF <code>RateLimit</code> headers). Stable major path <code>/api/v1</code> (<span id="versioning">12-month deprecation notice via RFC 9745 headers</span>).</li>
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>REST OpenAPI v1 Endpoints &amp; Example Requests</h2>
        <p style={{ color: '#CBD5E1', marginBottom: '0.75rem' }}>
          <strong>1. Calculate Deterministic Quote</strong> — <code>GET /api/v1/quote?sqft=2200&amp;propertyType=single-family&amp;serviceType=buyer</code> (<code>operationId: calculateInspectionQuoteV1</code>)
        </p>
        <pre style={preStyle}>{`curl -s "https://www.fhinspectionsatl.com/api/v1/quote?sqft=2200&propertyType=single-family&foundation=basement"`}</pre>
        <p style={{ color: '#CBD5E1', margin: '1rem 0 0.75rem' }}>
          <strong>2. Check Metro Atlanta City or Georgia ZIP Coverage</strong> — <code>GET /api/v1/coverage?query=Alpharetta</code> (<code>operationId: checkMetroAtlantaCoverageV1</code>)
        </p>
        <pre style={preStyle}>{`curl -s "https://www.fhinspectionsatl.com/api/v1/coverage?query=Alpharetta"`}</pre>
        <p style={{ color: '#CBD5E1', margin: '1rem 0 0.75rem' }}>
          <strong>3. List Official Services &amp; Starting Base Tiers</strong> — <code>GET /api/v1/services</code> (<code>operationId: listInspectionServicesV1</code>)
        </p>
        <pre style={preStyle}>{`curl -s "https://www.fhinspectionsatl.com/api/v1/services"`}</pre>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Streamable HTTP MCP Example</h2>
        <pre style={preStyle}>{`curl -s -X POST "https://www.fhinspectionsatl.com/api/mcp" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"calculate_quote","arguments":{"sqft":2400,"propertyType":"single-family"}}}'`}</pre>
      </div>

      <div style={cardStyle} id="errors">
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Structured JSON Errors (RFC 9457 Problem Details)</h2>
        <p style={{ color: '#CBD5E1', lineHeight: 1.7 }}>
          Every <code>/api/*</code> error returns <code>Content-Type: application/problem+json</code> with machine-readable <code>code</code> (<code>invalid_parameter</code>, <code>invalid_enum_value</code>, <code>method_not_allowed</code>, <code>api_route_not_found</code>), <code>status</code>, <code>detail</code>, and a <code>resolution</code> hint — never an HTML error page. Interactive human booking remains available 24/7 at <Link href="/quote" style={{ color: 'var(--color-gold)' }}>/quote</Link> or by calling <a href="tel:678-480-2110" style={{ color: 'var(--color-gold)' }}>(678) 480-2110</a>.
        </p>
      </div>
    </section>
  );
}
