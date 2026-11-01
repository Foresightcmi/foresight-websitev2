import citiesData from '../../../../data/cities.json';
import { API_DISCOVERY_HEADERS, apiJsonResponse, apiProblemResponse, methodNotAllowed } from '../../../../lib/apiProblem.js';

export async function GET(req) {
  const url = new URL(req.url);
  const query = (url.searchParams.get('query') || '').trim();
  if (!query || query.length > 100) {
    return apiProblemResponse({
      status: 400,
      code: 'invalid_parameter',
      title: 'Missing City or ZIP Query',
      detail: 'Query parameter "query" is required (e.g. ?query=Alpharetta or ?query=30009).',
      resolution: 'Pass a Metro Atlanta city name or 5-digit Georgia ZIP code in ?query=.',
      instance: url.pathname + url.search,
    });
  }

  const normalized = query.toLowerCase();
  const match = citiesData.find((c) => {
    const city = String(c['City Name'] || '').toLowerCase();
    const slug = String(c.Slug || '').toLowerCase();
    const zips = String(c.Zip || '').toLowerCase();
    return city === normalized || slug === normalized || city.includes(normalized) || zips.includes(normalized);
  });

  if (!match) {
    return apiJsonResponse({
      query,
      inStandardCoverage: false,
      radiusMiles: 50,
      message: 'Not matched in the 87 primary Metro Atlanta city profiles. Call (678) 480-2110 to confirm custom dispatch within 50 miles of Metro Atlanta.',
      directoryUrl: 'https://www.fhinspectionsatl.com/service-areas',
    });
  }

  return apiJsonResponse({
    query,
    inStandardCoverage: true,
    city: match['City Name'],
    county: match.County,
    postalCode: match.Zip,
    url: `https://www.fhinspectionsatl.com/service-areas/${match.Slug}`,
    quoteUrl: 'https://www.fhinspectionsatl.com/quote',
  });
}

export async function POST(req) { return methodNotAllowed(req); }
export async function PUT(req) { return methodNotAllowed(req); }
export async function DELETE(req) { return methodNotAllowed(req); }
export async function OPTIONS() { return new Response(null, { status: 204, headers: API_DISCOVERY_HEADERS }); }
