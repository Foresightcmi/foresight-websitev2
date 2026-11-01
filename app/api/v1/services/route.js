import servicesData from '../../../../data/services-pseo.json';
import truthData from '../../../../data/truth.json';
import { API_DISCOVERY_HEADERS, apiJsonResponse, methodNotAllowed } from '../../../../lib/apiProblem.js';

export async function GET() {
  return apiJsonResponse({
    business: {
      name: truthData.business.legalName,
      leadInspector: truthData.business.leadInspector,
      credentials: truthData.business.credentials,
      phone: '+1-678-480-2110',
      email: truthData.business.email,
      sundayHours: 'By Appointment Only',
    },
    baseStartingRates: {
      singleFamilyBuyerSellerWarranty: 'From $345',
      condoAndTownhome: 'From $295',
      phase1PreDrywall: 'From $275',
      finalNewConstruction: 'From $400',
      complexityAdjustment: '+$75 each for unfinished crawlspace, unfinished basement, or 50+ year vintage home',
      auxiliaryAndCommercialServices: 'Call (678) 480-2110 for Quote',
    },
    services: servicesData.map((s) => ({
      slug: s.slug,
      name: s.name,
      pricing: s.price,
      url: `https://www.fhinspectionsatl.com/services/${s.slug}`,
    })),
    mcpEndpoint: 'https://www.fhinspectionsatl.com/api/mcp',
    openApiSpec: 'https://www.fhinspectionsatl.com/openapi.json',
    docsUrl: 'https://www.fhinspectionsatl.com/developers',
  });
}

export async function POST(req) { return methodNotAllowed(req); }
export async function PUT(req) { return methodNotAllowed(req); }
export async function DELETE(req) { return methodNotAllowed(req); }
export async function OPTIONS() { return new Response(null, { status: 204, headers: API_DISCOVERY_HEADERS }); }
