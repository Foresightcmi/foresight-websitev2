// Foresight Official Mathematical Pricing Engine
// Shared across Web App, API routes, and Voice Concierge

export function calculateQuoteDetails({
  propertyType = 'single-family',
  serviceType = 'buyer',
  sqft = 2000,
  foundation = 'slab',
  ageTier = 'under-25',
  addons = {}
}) {
  let base = 345;
  const parsedSqft = Number(sqft) || 2000;

  if (serviceType === 'str') {
    base = 595;
  } else if (propertyType === 'condo' || serviceType === 'condo') {
    if (parsedSqft <= 1000) base = 295;
    else base = 325;
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
  if (serviceType !== 'str') {
    if (ageTier === 'over-50') extra += 75;
  }

  if (propertyType === 'single-family' && serviceType !== 'str') {
    if (foundation === 'crawlspace') extra += 75;
    if (foundation === 'basement') extra += 250;
  }

  const addonBreakdown = [];
  if (addons.radon) {
    extra += 250;
    addonBreakdown.push({ name: '48-Hr Continuous Radon Gas', price: 250 });
  }
  if (addons.termite || addons.wdo) {
    const termitePrice = foundation === 'crawlspace' ? 165 : 125;
    extra += termitePrice;
    addonBreakdown.push({ name: 'Official Georgia Termite / WDO Report', price: termitePrice });
  }
  if (addons.pool) {
    extra += 275;
    addonBreakdown.push({ name: 'Pool & Spa Inspection', price: 275 });
  }
  if (addons.sewer) {
    extra += 450;
    addonBreakdown.push({ name: 'HD Fiber-Optic Sewer Scope Camera', price: 450 });
  }
  if (addons.lowFlow) {
    extra += 100;
    addonBreakdown.push({ name: 'DeKalb Low-Flow Compliance Certificate', price: 100 });
  }
  if (addons.buildfax) {
    extra += 15;
    addonBreakdown.push({ name: 'Permit History Report', price: 15 });
  }

  const total = base + extra;
  const deposit = Math.round(total / 2);
  const balanceDue = total - deposit;

  return {
    base,
    extra,
    total,
    deposit,
    balanceDue,
    addonBreakdown,
    sqft: parsedSqft,
    propertyType,
    foundation,
    ageTier
  };
}
