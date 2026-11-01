export const API_DISCOVERY_HEADERS = {
  'RateLimit-Policy': '"public-api";q=120;w=60',
  'RateLimit': '"public-api";r=119;t=60',
  'RateLimit-Limit': '120',
  'RateLimit-Remaining': '119',
  'RateLimit-Reset': '60',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Link': '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", </developers>; rel="service-doc"; type="text/html", </.well-known/mcp.json>; rel="mcp-manifest", </llms.txt>; rel="llms-txt"',
};

export function apiProblemResponse({
  status = 400,
  code = 'invalid_request',
  title = 'Invalid API Request',
  detail = 'The request could not be processed.',
  resolution = 'Review https://www.fhinspectionsatl.com/openapi.json or https://www.fhinspectionsatl.com/developers for valid parameters.',
  instance = 'https://www.fhinspectionsatl.com/api',
  extraHeaders = {},
}) {
  const payload = {
    type: `https://www.fhinspectionsatl.com/developers#${code}`,
    title,
    status,
    detail,
    message: detail,
    instance,
    code,
    resolution,
    documentation_url: 'https://www.fhinspectionsatl.com/developers',
    error: { code, message: detail, resolution },
  };
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/problem+json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...API_DISCOVERY_HEADERS,
      ...extraHeaders,
    },
  });
}

export function apiJsonResponse(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      ...API_DISCOVERY_HEADERS,
    },
  });
}

export function methodNotAllowed(req, allowed = 'GET, OPTIONS') {
  const url = new URL(req.url);
  return apiProblemResponse({
    status: 405,
    code: 'method_not_allowed',
    title: 'Method Not Allowed',
    detail: `HTTP ${req.method} is not supported on ${url.pathname}. Allowed methods: ${allowed}.`,
    resolution: `Send one of [${allowed}] to ${url.pathname}, or inspect https://www.fhinspectionsatl.com/openapi.json.`,
    instance: url.pathname,
    extraHeaders: { Allow: allowed },
  });
}
