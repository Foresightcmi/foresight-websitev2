import citiesData from '../data/cities.json' with { type: 'json' };
import { calculateQuoteDetails } from './pricing.js';
import { recordLead } from './leads.js';

export const OCGA_ESTIMATE_NOTICE =
  'Per O.C.G.A. § 8-3-331, automated chat estimates are non-binding fee quotes; appointments solidify on our master calendar after office confirmation, 50% deposit, and signed pre-inspection agreement.';

export const CONCIERGE_TOOL_DECLARATIONS = [
  {
    name: 'calculate_inspection_quote',
    description: 'Compute exact deterministic Metro Atlanta residential inspection fee, 50% post-confirmation deposit, and Call-for-Quote auxiliary add-ons.',
    parameters: {
      type: 'OBJECT',
      properties: {
        sqft: { type: 'NUMBER', description: 'Heated/cooled square footage (e.g. 2400)' },
        propertyType: { type: 'STRING', enum: ['single-family', 'condo', 'townhome'] },
        serviceType: { type: 'STRING', enum: ['buyer', 'seller', 'new-construction', 'warranty', 'str', 'drywall'] },
        foundation: { type: 'STRING', enum: ['slab', 'crawlspace', 'basement'] },
        ageTier: { type: 'STRING', enum: ['under-50', 'over-50'] },
        radon: { type: 'BOOLEAN' },
        termite: { type: 'BOOLEAN' },
        pool: { type: 'BOOLEAN' },
        sewer: { type: 'BOOLEAN' },
        airQuality: { type: 'BOOLEAN' },
        lowFlow: { type: 'BOOLEAN' },
      },
      required: ['sqft'],
    },
  },
  {
    name: 'check_metro_atlanta_coverage',
    description: 'Verify whether a Georgia city or 5-digit ZIP code is inside Foresight Home Inspections 20-county, 87-city, 50-mile service radius.',
    parameters: {
      type: 'OBJECT',
      properties: { query: { type: 'STRING', description: 'City name or 5-digit Georgia ZIP code' } },
      required: ['query'],
    },
  },
  {
    name: 'get_service_scope_and_pricing',
    description: 'Retrieve official starting pricing and scope for primary or auxiliary inspection services.',
    parameters: {
      type: 'OBJECT',
      properties: {
        serviceKey: {
          type: 'STRING',
          enum: ['buyer', 'condo', 'pre-listing', 'pre-drywall', 'new-construction', 'warranty', 'sewer-scope', 'radon', 'pool', 'termite', 'mold', 'str', 'low-flow'],
        },
      },
      required: ['serviceKey'],
    },
  },
  {
    name: 'request_priority_inspection_slot',
    description: 'Log a friction-free Priority Inspection Slot hold for 20-minute office dispatch confirmation (no upfront card required).',
    parameters: {
      type: 'OBJECT',
      properties: {
        clientName: { type: 'STRING', description: 'Buyer, seller, or Realtor full name' },
        clientPhone: { type: 'STRING', description: '10-digit callback number' },
        clientEmail: { type: 'STRING', description: 'Email for confirmation and agreement' },
        propertyAddress: { type: 'STRING', description: 'Property street address or city' },
        sqft: { type: 'NUMBER', description: 'Approximate square footage' },
        preferredDate: { type: 'STRING', description: 'Requested due diligence date/window' },
        serviceType: { type: 'STRING', description: 'Inspection type (buyer, pre-drywall, new-construction, condo, warranty)' },
        notes: { type: 'STRING', description: 'Realtor GREC license, lockbox, or auxiliary requests' },
      },
      required: ['clientName', 'clientPhone'],
    },
  },
];

export async function executeConciergeTool(name, args = {}) {
  if (name === 'calculate_inspection_quote') {
    const addons = {
      ...(args.addons || {}),
      radon: Boolean(args.radon || args.addons?.radon),
      termite: Boolean(args.termite || args.wdo || args.addons?.termite),
      pool: Boolean(args.pool || args.addons?.pool),
      sewer: Boolean(args.sewer || args.addons?.sewer),
      airQuality: Boolean(args.airQuality || args.mold || args.addons?.airQuality),
      lowFlow: Boolean(args.lowFlow || args.addons?.lowFlow),
    };
    const quote = calculateQuoteDetails({
      sqft: Number(args.sqft) || 2000,
      propertyType: String(args.propertyType || 'single-family').toLowerCase(),
      serviceType: String(args.serviceType || 'buyer').toLowerCase(),
      foundation: String(args.foundation || 'slab').toLowerCase(),
      ageTier: String(args.ageTier || 'under-50').toLowerCase(),
      addons,
    });
    return {
      quote,
      inclusions: ['Two Certified Inspectors led by CMI #MICB-1082', 'Free calibrated infrared thermal imaging', 'Free 4K aerial drone roof scan', '$35,000 combined protection ($0 deductible)'],
      auxiliaryPolicy: 'All auxiliary & STR services (Sewer Scope, Radon, Termite/WDO, Pool & Spa, Mold/Air Quality, Unincorporated DeKalb Low-Flow): Call (678) 480-2110 for Quote.',
      legalNotice: OCGA_ESTIMATE_NOTICE,
    };
  }
  if (name === 'check_metro_atlanta_coverage') {
    const q = String(args.query || '').trim().toLowerCase();
    const match = citiesData.find(
      (c) => String(c['City Name'] || '').toLowerCase() === q || String(c.Slug || '').toLowerCase() === q || String(c.Zip || '') === q
    );
    if (match) {
      return {
        covered: true,
        city: match['City Name'],
        county: match.County,
        zip: match.Zip,
        turnaround: 'Same-day interactive digital report with Two Certified Inspectors',
      };
    }
    return { covered: true, city: args.query, county: 'Metro Atlanta (50-mile radius)', note: 'Confirm exact address when holding your slot at (678) 480-2110.' };
  }
  if (name === 'get_service_scope_and_pricing') {
    const k = String(args.serviceKey || '').toLowerCase();
    const map = {
      buyer: { name: 'Full Buyer Home Inspection', base: 'From $345', note: '2 Certified Inspectors, free infrared thermal & 4K drone scans, $35,000 combined protection.' },
      condo: { name: 'Condo & Townhome Inspection', base: 'From $295', note: '<=1,000 sq ft = $295; >1,000 sq ft = $325.' },
      'pre-listing': { name: 'Pre-Listing Seller Inspection', base: 'From $345', note: 'Same square-footage schedule as Buyer Inspection.' },
      'pre-drywall': { name: 'Phase 1 Pre-Drywall Framing Inspection', base: 'From $275', note: 'Open framing, trusses, plumbing & electrical rough-ins before sheetrock.' },
      'new-construction': { name: 'Final New Construction Inspection', base: 'From $400', note: 'Full two-inspector pre-closing diagnostic.' },
      warranty: { name: '11-Month Builder Warranty Inspection', base: 'From $345', note: 'Builder punch-list before 1-year builder warranty expires.' },
    };
    return map[k] || { name: k, base: 'Call (678) 480-2110 for Quote', note: 'Custom-quoted directly by our office for your property and municipality.' };
  }
  if (name === 'request_priority_inspection_slot') {
    const lead = await recordLead({
      name: args.clientName || 'Valued Client',
      phone: args.clientPhone || '',
      email: args.clientEmail || '',
      address: args.propertyAddress || '',
      sqft: args.sqft ? String(args.sqft) : '',
      serviceType: args.serviceType || 'buyer',
      preferredDate: args.preferredDate || 'Earliest Due Diligence Window',
      message: args.notes || 'Priority Slot requested via Foresight AI Chat Concierge',
      source: 'Website Chat Concierge (Tool-Verified)',
    });
    return {
      status: 'tentative_pending_office_confirmation',
      leadId: lead.leadId,
      nextSteps: 'Our dispatch desk has been alerted and will call/text within 20 minutes with your confirmation and pre-inspection agreement. Sunday is strictly by appointment only.',
      legalNotice: OCGA_ESTIMATE_NOTICE,
    };
  }
  return { error: `Unsupported concierge tool: ${name}` };
}
