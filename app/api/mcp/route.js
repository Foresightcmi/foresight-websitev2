import { NextResponse } from 'next/server';
import { recordLead } from '../../../lib/leads';
import citiesData from '../../../data/cities.json';

// Foresight Official HomeGauge Fee Schedule Calculation Logic
function calculateQuoteDetails(input = {}) {
  const sqft = input.sqft || input.square_feet || input.squareFeet || input.size || 2000;
  const propertyType = (input.propertyType || input.property_type || 'single-family').toLowerCase();
  const serviceType = (input.serviceType || input.service_type || 'buyer').toLowerCase();
  const foundation = (input.foundation || input.foundation_type || input.foundationType || 'slab').toLowerCase();
  const ageTier = input.ageTier || input.age_tier || (input.year_built && (new Date().getFullYear() - Number(input.year_built) >= 50) ? 'over-50' : 'under-50');

  const rawAddons = input.addons || {};
  const addons = {
    radon: Boolean(rawAddons.radon || input.radon || input.has_radon),
    termite: Boolean(rawAddons.termite || input.termite || input.has_termite || input.wdo),
    pool: Boolean(rawAddons.pool || input.pool || input.has_pool),
    sewer: Boolean(rawAddons.sewer || input.sewer || input.has_sewer_scope || input.sewerScope),
    lowFlow: Boolean(rawAddons.lowFlow || rawAddons.low_flow || input.lowFlow || input.low_flow || input.dekalb_low_flow),
    buildfax: Boolean(rawAddons.buildfax || input.buildfax),
    airQuality: Boolean(rawAddons.airQuality || input.airQuality || input.mold),
    detachedBuilding: Boolean(rawAddons.detachedBuilding || input.detachedBuilding)
  };

  let base = 345;
  const parsedSqft = Number(sqft) || 2000;

  if (serviceType === 'str') {
    base = 595;
  } else if (serviceType === 'drywall') {
    base = parsedSqft <= 2500 ? 275 : 300;
  } else if (propertyType === 'condo' || serviceType === 'condo') {
    if (serviceType === 'seller') {
      base = parsedSqft <= 1000 ? 295 : 315;
    } else {
      base = parsedSqft <= 1000 ? 295 : 325;
    }
  } else if (serviceType === 'new-construction') {
    if (parsedSqft <= 1800) base = 400;
    else if (parsedSqft <= 2500) base = 455;
    else if (parsedSqft <= 3000) base = 485;
    else if (parsedSqft <= 3500) base = 515;
    else if (parsedSqft <= 4000) base = 545;
    else if (parsedSqft <= 4500) base = 585;
    else if (parsedSqft <= 5000) base = 625;
    else if (parsedSqft <= 7000) base = 935;
    else base = 985;
  } else if (serviceType === 'seller') {
    if (parsedSqft <= 2000) base = 365;
    else if (parsedSqft <= 2500) base = 385;
    else if (parsedSqft <= 3000) base = 415;
    else if (parsedSqft <= 3500) base = 425;
    else if (parsedSqft <= 4000) base = 465;
    else if (parsedSqft <= 4500) base = 485;
    else if (parsedSqft <= 5000) base = 515;
    else base = 575;
  } else if (serviceType === 'warranty') {
    if (parsedSqft <= 2000) base = 335;
    else if (parsedSqft <= 2500) base = 365;
    else if (parsedSqft <= 3000) base = 395;
    else if (parsedSqft <= 3500) base = 425;
    else if (parsedSqft <= 4000) base = 455;
    else if (parsedSqft <= 4500) base = 485;
    else if (parsedSqft <= 5000) base = 515;
    else base = 575;
  } else {
    // Buyer Single-Family Inspection
    if (parsedSqft <= 1000) base = 345;
    else if (parsedSqft <= 1500) base = 375;
    else if (parsedSqft <= 2000) base = 425;
    else if (parsedSqft <= 2500) base = 475;
    else if (parsedSqft <= 3000) base = 525;
    else if (parsedSqft <= 3500) base = 575;
    else if (parsedSqft <= 4000) base = 625;
    else if (parsedSqft <= 4500) base = 675;
    else if (parsedSqft <= 5000) base = 775;
    else if (parsedSqft <= 5500) base = 875;
    else base = 985;
  }

  let extra = 0;
  if (serviceType !== 'str' && ageTier === 'over-50') extra += 75;
  if (propertyType === 'single-family' && serviceType !== 'str') {
    if (foundation === 'crawlspace') extra += 75;
    if (foundation === 'basement') extra += 250;
  }

  const addonBreakdown = [];
  if (addons.radon) { extra += 250; addonBreakdown.push({ name: 'Radon Gas Testing', price: 250 }); }
  if (addons.termite) {
    const termitePrice = foundation === 'crawlspace' ? 165 : 125;
    extra += termitePrice;
    addonBreakdown.push({ name: 'Termite / WDO Inspection', price: termitePrice });
  }
  if (addons.pool) { extra += 275; addonBreakdown.push({ name: 'Pool & Spa Inspection', price: 275 }); }
  if (addons.sewer) { extra += 450; addonBreakdown.push({ name: 'Sewer Scope Camera', price: 450 }); }
  if (addons.lowFlow) { extra += 100; addonBreakdown.push({ name: 'DeKalb Low Flow Certification', price: 100 }); }
  if (addons.buildfax) { extra += 15; addonBreakdown.push({ name: 'Permit History Report', price: 15 }); }
  if (addons.airQuality) { extra += 450; addonBreakdown.push({ name: 'Indoor Air Quality & Mold Lab Testing', price: 450 }); }
  if (addons.detachedBuilding) { extra += 100; addonBreakdown.push({ name: 'Detached Building Inspection', price: 100 }); }

  const total = base + extra;
  return {
    base,
    extra,
    total,
    depositRequired: Math.round(total / 2),
    balanceDue: total - Math.round(total / 2),
    addonBreakdown,
    sqft: parsedSqft,
    propertyType,
    foundation,
    ageTier,
    inclusions: [
      'Two Certified Master Inspectors on every property',
      'High-resolution aerial drone roof scan',
      'FLIR infrared thermal imaging scan',
      '$10,000 Elite Master Inspection Warranty ($0 deductible)',
      'Same-day digital report turnaround with video'
    ]
  };
}

// Available MCP Tools Definition (Complies with Model Context Protocol specification)
const MCP_TOOLS = [
  {
    name: 'calculate_quote',
    description: 'Calculate real-time, deterministic pricing for a home inspection in Metro Atlanta based on square footage, foundation, age, and service add-ons.',
    inputSchema: {
      type: 'object',
      properties: {
        propertyType: { type: 'string', enum: ['single-family', 'condo', 'townhome'], description: 'Type of residential structure' },
        serviceType: { type: 'string', enum: ['buyer', 'seller', 'new-construction', 'warranty', 'str', 'drywall'], default: 'buyer', description: 'Inspection category' },
        sqft: { type: 'number', description: 'Square footage of the home' },
        foundation: { type: 'string', enum: ['slab', 'crawlspace', 'basement'], default: 'slab', description: 'Foundation type' },
        ageTier: { type: 'string', enum: ['under-50', 'over-50'], default: 'under-50', description: 'Whether the home was built 50+ years ago' },
        addons: {
          type: 'object',
          properties: {
            radon: { type: 'boolean', description: 'Continuous Radon Monitor testing ($250)' },
            termite: { type: 'boolean', description: 'Official Georgia WDO/Termite clearance ($125 slab/basement, $165 crawlspace)' },
            pool: { type: 'boolean', description: 'Pool and spa mechanical and barrier safety audit ($275)' },
            sewer: { type: 'boolean', description: 'High-definition underground lateral sewer scope camera inspection ($450 flat rate)' },
            lowFlow: { type: 'boolean', description: 'DeKalb County Mandatory Low-Flow Plumbing Certificate ($100)' },
            buildfax: { type: 'boolean', description: 'Historical municipal permit and renovation record audit ($15)' },
            airQuality: { type: 'boolean', description: 'Indoor Air Quality & Mold Lab Testing ($450)' },
            detachedBuilding: { type: 'boolean', description: 'Detached Building or Workshop Inspection ($100)' }
          }
        }
      },
      required: ['sqft']
    }
  },
  {
    name: 'check_city_coverage',
    description: 'Verify if a city or zip code in Metro Atlanta is within Foresight Home Inspections 50-mile service radius, and get local soil/risk advisories.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'City name (e.g. Decatur, Alpharetta, Sandy Springs) or 5-digit Georgia Zip Code' }
      },
      required: ['query']
    }
  },
  {
    name: 'get_service_pricing',
    description: 'Retrieve standard pricing and service scope breakdown for primary and auxiliary inspection services.',
    inputSchema: {
      type: 'object',
      properties: {
        serviceKey: { 
          type: 'string', 
          enum: ['buyer', 'condo', 'pre-listing', 'new-construction', 'warranty', 'sewer-scope', 'radon', 'pool', 'termite', 'str', 'low-flow'],
          description: 'The inspection service key'
        }
      },
      required: ['serviceKey']
    }
  },
  {
    name: 'get_sample_report_summary',
    description: 'Retrieve details about the authentic 220-photo redacted HomeGauge inspection report delivered by Foresight Home Inspections.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'book_inspection_slot',
    description: 'Submit a tentative inspection booking or consultation request on behalf of a client. Enters queue for office confirmation within 20 minutes.',
    inputSchema: {
      type: 'object',
      properties: {
        clientName: { type: 'string', description: 'Full name of the homebuyer, seller, or agent' },
        clientPhone: { type: 'string', description: 'Best callback telephone number' },
        clientEmail: { type: 'string', description: 'Email address for confirmation and sample reports' },
        propertyAddress: { type: 'string', description: 'Full property address including city and zip' },
        sqft: { type: 'number', description: 'Approximate square footage' },
        preferredDate: { type: 'string', description: 'Requested inspection date or timeframe (e.g. 2026-09-15 Morning)' },
        addons: { type: 'array', items: { type: 'string' }, description: 'List of requested add-ons (radon, sewer, termite, pool)' },
        estimatedTotal: { type: 'string', description: 'Estimated dollar amount calculated via calculate_quote' },
        notes: { type: 'string', description: 'Special instructions, lockbox code, or agent contact details' }
      },
      required: ['clientName', 'clientPhone']
    }
  }
];

// Execute Tool Calls
async function handleToolCall(name, args) {
  switch (name) {
    case 'calculate_quote': {
      const quote = calculateQuoteDetails(args);
      return {
        quote,
        summary: `Total estimated fee is $${quote.total}. Includes two-inspector team, aerial drone scan, FLIR thermal scan, and $10,000 warranty. 50% deposit ($${quote.depositRequired}) to solidify booking. Balance ($${quote.balanceDue}) due upon report delivery.`
      };
    }
    case 'check_city_coverage': {
      const q = (args.query || '').trim().toLowerCase();
      const match = citiesData.find(c => 
        (c['City Name'] && c['City Name'].toLowerCase() === q) ||
        (c.Slug && c.Slug.toLowerCase() === q) ||
        (c.Zip && c.Zip === q)
      );
      if (match) {
        return {
          covered: true,
          cityName: match['City Name'],
          county: match.County,
          coordinates: { lat: match.Latitude, lng: match.Longitude },
          localAdvisory: match['Local Risks HTML'] ? match['Local Risks HTML'].replace(/<[^>]+>/g, ' ').trim() : 'Standard Piedmont red clay foundation settlement and moisture advisories apply.',
          turnaround: 'Same-day report delivery with 2-inspector deployment'
        };
      }
      return {
        covered: true,
        cityName: args.query,
        note: 'Foresight serves all locations within a 50-mile radius of Lithonia, GA covering 20 Metro Atlanta counties. Please confirm exact address during booking.'
      };
    }
    case 'get_service_pricing': {
      const serviceMap = {
        'buyer': { name: 'Full Buyer Home Inspection', base: 'From $345 ($295 for condos)', details: 'Complete structural, mechanical, electrical, plumbing, roof, attic, and foundation audit. 2 certified inspectors on site.' },
        'condo': { name: 'Condominium & Townhome Inspection', base: 'From $295', details: 'Interior systems, HVAC, plumbing, electrical, balconies, and accessible common areas.' },
        'new-construction': { name: 'New Construction Final Phase Inspection', base: 'From $400', details: 'Comprehensive pre-closing quality control audit covering all major home components.' },
        'warranty': { name: '11-Month Builder Warranty Inspection', base: 'From $335', details: 'Comprehensive audit before builder 1-year warranty expires to ensure warranty items are addressed.' },
        'sewer-scope': { name: 'Sewer Scope Camera Inspection', base: '$450 flat rate', details: 'High-definition camera scan through main cleanout to municipal lateral or septic tank.' },
        'radon': { name: 'Continuous Radon Gas Monitoring', base: '$250', details: '48-hour continuous calibrated CRM monitoring for EPA 4.0 pCi/L threshold.' },
        'pool': { name: 'Pool & Spa Safety & Equipment Audit', base: '$275', details: 'Pumps, heaters, filters, liners, plaster, bonding, and safety barrier gates.' },
        'termite': { name: 'Official Termite / WDO Clearance Letter', base: '$125 ($165 crawlspace)', details: 'Official Georgia Wood-Destroying Organism report conducted with licensed pest control partners.' },
        'str': { name: 'Short-Term Rental (STR) Compliance Safety Audit', base: '$595 flat rate', details: 'Municipal compliance safety, egress, smoke/CO, fire extinguisher, and liability inspection.' },
        'low-flow': { name: 'DeKalb County Low-Flow Plumbing Certificate', base: '$100', details: 'Mandatory toilet, shower, and faucet flow rate verification for pre-1993 property transfers.' }
      };
      return serviceMap[args.serviceKey] || { error: `Service key '${args.serviceKey}' not found.` };
    }
    case 'get_sample_report_summary': {
      return {
        title: 'Foresight Home Inspections Official Sample Report',
        url: 'https://www.fhinspectionsatl.com/sample-report/index.html',
        features: [
          '220+ annotated high-resolution photographs',
          'FLIR infrared thermal scans revealing hidden moisture and insulation voids',
          'Detailed crawlspace and structural framing evaluations',
          'Prioritized repair list categorized into Safety Hazards, Major Defects, and Maintenance Items',
          'HomeGauge Create Request List (CRL) integration for rapid real estate repair amendments',
          'Backing by the $10,000 Elite Master Inspection Warranty ($0 deductible)'
        ],
        privacy: 'Client names and physical address redacted for homeowner privacy.'
      };
    }
    case 'book_inspection_slot': {
      const leadResult = await recordLead({
        name: args.clientName,
        phone: args.clientPhone,
        email: args.clientEmail || '',
        address: args.propertyAddress || '',
        sqft: args.sqft ? String(args.sqft) : '',
        preferredDate: args.preferredDate || 'Earliest available window',
        addons: args.addons || [],
        estimatedTotal: args.estimatedTotal || '',
        message: args.notes || 'Automated reservation via Web MCP Endpoint',
        source: 'Model Context Protocol (Web MCP)'
      });
      return {
        status: 'tentative_pending_office_confirmation',
        leadId: leadResult.leadId,
        message: 'Your inspection request has been logged. Our dispatch team will call to confirm arrival window and access instructions within 20 minutes. Note: Sunday is strictly by appointment only.'
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// JSON-RPC 2.0 Handler
export async function POST(req) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    if (jsonrpc !== '2.0') {
      return NextResponse.json({ jsonrpc: '2.0', id: id || null, error: { code: -32600, message: 'Invalid Request: jsonrpc version must be 2.0' } }, { status: 400 });
    }

    // Handshake / Initialize
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
            resources: {}
          },
          serverInfo: {
            name: 'foresight-home-inspections-mcp',
            version: '1.0.0',
            description: 'Certified Master Inspector (CMI) real-time pricing, coverage, and booking engine for Metro Atlanta, GA.'
          }
        }
      });
    }

    // List Tools
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS
        }
      });
    }

    // Call Tool
    if (method === 'tools/call') {
      const { name, arguments: toolArgs } = params || {};
      const toolOutput = await handleToolCall(name, toolArgs || {});
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(toolOutput, null, 2)
            }
          ],
          isError: false
        }
      });
    }

    return NextResponse.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method '${method}' not found` } }, { status: 404 });
  } catch (err) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: 'Internal error', data: err.message }
    }, { status: 500 });
  }
}

// Support GET for Discovery and Direct Testing
export async function GET(req) {
  const host = req.headers.get('host') || 'www.fhinspectionsatl.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  return NextResponse.json({
    name: 'Foresight Home Inspections Model Context Protocol (Web MCP) Endpoint',
    version: '1.0.0',
    protocol: 'Model Context Protocol / JSON-RPC 2.0',
    endpoint: `${protocol}://${host}/api/mcp`,
    documentation: `${protocol}://${host}/llms.txt`,
    leadInspector: 'Christopher Boykin, CMI (InterNACHI #176873)',
    operatingRadius: '50 miles across 20 Metro Atlanta counties',
    supportedMethods: ['initialize', 'tools/list', 'tools/call'],
    availableTools: MCP_TOOLS.map(t => ({ name: t.name, description: t.description }))
  });
}
