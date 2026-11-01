import { API_DISCOVERY_HEADERS, apiProblemResponse } from '../../../lib/apiProblem.js';

function notFound(req) {
  const url = new URL(req.url);
  return apiProblemResponse({
    status: 404,
    code: 'api_route_not_found',
    title: 'API Route Not Found',
    detail: `No API endpoint exists at ${url.pathname}.`,
    resolution: 'Use GET /api/v1/quote, GET /api/v1/coverage, GET /api/v1/services, or POST JSON-RPC 2.0 requests to /api/mcp. Full OpenAPI 3.1 schema: https://www.fhinspectionsatl.com/openapi.json.',
    instance: url.pathname,
  });
}

export async function GET(req) { return notFound(req); }
export async function POST(req) { return notFound(req); }
export async function PUT(req) { return notFound(req); }
export async function PATCH(req) { return notFound(req); }
export async function DELETE(req) { return notFound(req); }
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: API_DISCOVERY_HEADERS });
}
