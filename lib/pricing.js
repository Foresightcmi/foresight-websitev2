// Foresight Official Mathematical Pricing Engine
// Synchronized with data/truth.json, QuoteClient.js, /api/v1/quote, and /api/mcp

export function calculateQuoteDetails({
  propertyType = 'single-family',
  serviceType = 'buyer',
  sqft = 2000,
  foundation = 'slab',
  ageTier = 'under-50',
  addons = {}
}) {
  const parsedSqft = Number(sqft) || 2000;

  if (serviceType === 'str') {
    return {
      isCustomQuote: true,
      base: 'Call (678) 480-2110 for Quote',
      extra: 0,
      total: 'Call (678) 480-2110 for Quote',
      deposit: 'Call for Quote',
      balanceDue: 'Call for Quote',
      addonBreakdown: [],
      sqft: parsedSqft,
      propertyType,
      serviceType,
      foundation,
      ageTier
    };
  }

  let base = 345;
  if (serviceType === 'drywall') {
    base = parsedSqft <= 2500 ? 275 : 300;
  } else if (propertyType === 'condo' || propertyType === 'townhome' || serviceType === 'condo') {
    base = parsedSqft <= 1000 ? 295 : 325;
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
  } else {
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
  if (ageTier === 'over-50') extra += 75;
  if (propertyType === 'single-family' && (foundation === 'crawlspace' || foundation === 'basement')) {
    extra += 75;
  }

  const addonBreakdown = [];
  const auxMap = [
    ['radon', '48-Hr Continuous Radon Gas'],
    ['termite', 'Official Georgia Termite / WDO Report'],
    ['wdo', 'Official Georgia Termite / WDO Report'],
    ['pool', 'Pool & Spa Inspection'],
    ['sewer', 'HD Fiber-Optic Sewer Scope Camera'],
    ['lowFlow', 'DeKalb Low-Flow Compliance Certificate'],
    ['airQuality', 'Mold & Indoor Air Quality Lab Testing'],
    ['repairEstimates', 'Contractor Repair Cost Estimates'],
    ['buildfax', 'BuildFax Permit History Report']
  ];
  for (const [key, name] of auxMap) {
    if (addons[key]) addonBreakdown.push({ name, price: 'Call for Quote' });
  }

  const total = base + extra;
  const deposit = Math.round(total / 2);
  return {
    isCustomQuote: false,
    base,
    extra,
    total,
    deposit,
    balanceDue: total - deposit,
    addonBreakdown,
    sqft: parsedSqft,
    propertyType,
    serviceType,
    foundation,
    ageTier
  };
}
