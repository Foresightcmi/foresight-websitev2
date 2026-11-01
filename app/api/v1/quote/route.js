import { API_DISCOVERY_HEADERS, apiJsonResponse, apiProblemResponse, methodNotAllowed } from '../../../../lib/apiProblem.js';

const VALID_PROPERTY = ['single-family', 'condo', 'townhome'];
const VALID_SERVICE = ['buyer', 'seller', 'new-construction', 'warranty', 'str', 'drywall'];
const VALID_FOUNDATION = ['slab', 'crawlspace', 'basement'];
const VALID_AGE = ['under-50', 'over-50'];

export async function GET(req) {
  const url = new URL(req.url);
  const rawSqft = url.searchParams.get('sqft');
  const sqft = Number(rawSqft);
  if (!rawSqft || !Number.isFinite(sqft) || sqft < 100 || sqft > 25000) {
    return apiProblemResponse({
      status: 400,
      code: 'invalid_parameter',
      title: 'Invalid or Missing Square Footage',
      detail: 'Query parameter "sqft" must be an integer between 100 and 25000.',
      resolution: 'Pass ?sqft=2200 (between 100 and 25000) to GET /api/v1/quote.',
      instance: url.pathname + url.search,
    });
  }

  const propertyType = (url.searchParams.get('propertyType') || 'single-family').toLowerCase();
  const serviceType = (url.searchParams.get('serviceType') || 'buyer').toLowerCase();
  const foundation = (url.searchParams.get('foundation') || 'slab').toLowerCase();
  const ageTier = (url.searchParams.get('ageTier') || 'under-50').toLowerCase();

  if (!VALID_PROPERTY.includes(propertyType) || !VALID_SERVICE.includes(serviceType) || !VALID_FOUNDATION.includes(foundation) || !VALID_AGE.includes(ageTier)) {
    return apiProblemResponse({
      status: 400,
      code: 'invalid_enum_value',
      title: 'Unsupported Quote Parameter Value',
      detail: 'One or more enum parameters (propertyType, serviceType, foundation, ageTier) contained an unsupported value.',
      resolution: 'Check allowed enum values in https://www.fhinspectionsatl.com/openapi.json.',
      instance: url.pathname + url.search,
    });
  }

  if (serviceType === 'str') {
    return apiJsonResponse({
      isCustomQuote: true,
      currency: 'USD',
      base: 'Call (678) 480-2110 for Quote',
      extra: 0,
      total: 'Call (678) 480-2110 for Quote',
      sqft: Math.round(sqft),
      propertyType,
      serviceType,
      foundation,
      ageTier,
      bookingUrl: 'https://www.fhinspectionsatl.com/quote',
      phone: '+1-678-480-2110',
    });
  }

  let base = 345;
  if (serviceType === 'drywall') base = sqft <= 2500 ? 275 : 300;
  else if (propertyType === 'condo' || propertyType === 'townhome') base = sqft <= 1000 ? 295 : 325;
  else if (serviceType === 'new-construction') {
    if (sqft <= 1800) base = 400; else if (sqft <= 2500) base = 455; else if (sqft <= 3000) base = 485;
    else if (sqft <= 3500) base = 515; else if (sqft <= 4000) base = 545; else if (sqft <= 4500) base = 585;
    else if (sqft <= 5000) base = 625; else if (sqft <= 7000) base = 935; else base = 985;
  } else {
    if (sqft <= 1000) base = 345; else if (sqft <= 1500) base = 375; else if (sqft <= 2000) base = 425;
    else if (sqft <= 2500) base = 475; else if (sqft <= 3000) base = 525; else if (sqft <= 3500) base = 575;
    else if (sqft <= 4000) base = 625; else if (sqft <= 4500) base = 675; else if (sqft <= 5000) base = 775;
    else if (sqft <= 5500) base = 875; else base = 985;
  }

  let extra = 0;
  if (ageTier === 'over-50') extra += 75;
  if (propertyType === 'single-family' && (foundation === 'crawlspace' || foundation === 'basement')) extra += 75;
  const total = base + extra;

  return apiJsonResponse({
    isCustomQuote: false,
    currency: 'USD',
    base,
    extra,
    total,
    depositRequired: Math.round(total / 2),
    balanceDue: total - Math.round(total / 2),
    sqft: Math.round(sqft),
    propertyType,
    serviceType,
    foundation,
    ageTier,
    auxiliaryServicesNote: 'All auxiliary services (Sewer Scope, Radon, Pool & Spa, Termite/WDO, Mold & Air Quality, STR Compliance, DeKalb Low-Flow Certificate): Call (678) 480-2110 for Quote.',
    bookingUrl: 'https://www.fhinspectionsatl.com/quote',
  });
}

export async function POST(req) { return methodNotAllowed(req); }
export async function PUT(req) { return methodNotAllowed(req); }
export async function DELETE(req) { return methodNotAllowed(req); }
export async function OPTIONS() { return new Response(null, { status: 204, headers: API_DISCOVERY_HEADERS }); }
