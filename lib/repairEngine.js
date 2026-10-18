// Foresight Home Inspections - Autonomous Repair Cost & Concession Engine
// Regional construction cost indexing calibrated for Georgia municipalities

export const ZIP_PREFIX_MULTIPLIERS = {
  '300': { region: 'North Metro Atlanta (Alpharetta / Roswell / Marietta)', multiplier: 1.04 },
  '301': { region: 'West / Northwest Metro Atlanta (Cobb / Cherokee / Paulding)', multiplier: 0.98 },
  '302': { region: 'South Metro Atlanta (Fayette / Coweta / Henry)', multiplier: 0.95 },
  '303': { region: 'Intown Atlanta / Buckhead / Midtown / Decatur', multiplier: 1.09 },
  '305': { region: 'Northeast Georgia / Gainesville / Hall County', multiplier: 0.94 },
  '306': { region: 'Athens / Clarke / Oconee', multiplier: 0.93 },
  '310': { region: 'Central Georgia / Macon / Warner Robins', multiplier: 0.89 },
  '314': { region: 'Coastal Georgia / Savannah', multiplier: 1.01 },
  '100': { region: 'New York Metro', multiplier: 1.38 },
  '900': { region: 'Los Angeles Metro', multiplier: 1.29 },
  '606': { region: 'Chicago Metro', multiplier: 1.18 },
  '752': { region: 'Dallas / Fort Worth Metro', multiplier: 0.97 },
  '331': { region: 'Miami / South Florida', multiplier: 1.06 },
};

export function getRegionalMultiplier(zipCode) {
  if (!zipCode || String(zipCode).trim().length < 3) {
    return { region: 'Metro Atlanta Baseline Index', multiplier: 1.04 };
  }
  const prefix = String(zipCode).trim().substring(0, 3);
  return (
    ZIP_PREFIX_MULTIPLIERS[prefix] || {
      region: `Georgia Regional Index (${prefix}xx)`,
      multiplier: 1.0,
    }
  );
}

export function getLenderConcessionCapPercent(loanType = 'conventional', downPaymentPercent = 10) {
  const lt = String(loanType).toLowerCase();
  const dp = Number(downPaymentPercent) || 0;

  if (lt === 'cash') {
    return { capPercent: 1.0, ruleLabel: 'Cash Transaction (No Lender Concession Cap)' };
  }
  if (lt === 'fha') {
    return { capPercent: 0.06, ruleLabel: 'FHA: Seller concessions up to 6% of sales price' };
  }
  if (lt === 'va') {
    return { capPercent: 0.04, ruleLabel: 'VA: Seller concessions up to 4% of loan amount (normal closing costs excluded)' };
  }
  // Conventional Fannie Mae Selling Guide B3-4.1-02
  if (dp < 10) {
    return {
      capPercent: 0.03,
      ruleLabel: 'Fannie Mae Selling Guide B3-4.1-02 (<10% Down: 3% Max Concession Cap)',
    };
  }
  if (dp < 25) {
    return {
      capPercent: 0.06,
      ruleLabel: 'Fannie Mae Selling Guide B3-4.1-02 (10%–24.9% Down: 6% Max Concession Cap)',
    };
  }
  return {
    capPercent: 0.09,
    ruleLabel: 'Fannie Mae Selling Guide B3-4.1-02 (25%+ Down: 9% Max Concession Cap)',
  };
}

const SATISFACTORY_PATTERNS = [
  /\b(?:in\s+)?good\s+condition\b/i,
  /\bsatisfactory\b/i,
  /\bno\s+(?:apparent\s+)?(?:defects?|issues?|problems?|concerns?)\s+(?:observed|found|noted)\b/i,
  /\bfunctional(?:\s+at\s+time\s+of\s+inspection)?\b/i,
  /\boperating\s+(?:normally|as\s+intended|properly)\b/i,
  /\bwithin\s+normal\s+(?:limits|parameters)\b/i,
  /\bperforming\s+intended\s+function\b/i,
  /\bno\s+action\s+required\b/i,
  /\bmaintenance\s+acceptable\b/i,
];

const TRADE_ASSEMBLIES = [
  {
    id: 'roof_replacement',
    keywords: ['roof shingle', 'granule loss', 'hail bruise', 'hail damage', 'roof past service life', 'shingle replacement', 'architectural shingle depletion', 'roofing tear-off'],
    minorKeywords: ['pipe boot', 'roof boot', 'flashing leak', 'missing shingle', 'roof sealant'],
    category: 'Roofing',
    severity: 'Major Defect',
    tradeType: 'Licensed Roofing Contractor',
    codeRef: 'IRC R905.2 (Roof Assemblies)',
    laborHours: 44,
    laborRate: 100,
    materialCost: 7120,
    permitCost: 350,
    minorAssembly: {
      category: 'Roofing',
      severity: 'Deferred Maintenance',
      tradeType: 'Licensed Roofing Contractor',
      codeRef: 'IRC R905.2 (Roof Assemblies)',
      laborHours: 4,
      laborRate: 100,
      materialCost: 280,
      permitCost: 0,
      justification: 'Localized roof flashing / penetration seal maintenance to prevent active moisture intrusion into attic decking.',
    },
    justification: 'Building envelope deficiency. Insurance underwriters routinely require watertight roof assemblies or certified replacement within 30 days of closing.',
  },
  {
    id: 'hvac_replacement',
    keywords: ['heat pump compressor', 'hvac inoperable', 'r-22', 'freon', 'cracked heat exchanger', 'hvac past service life', 'compressor seized', 'cooling inoperable', 'condenser leak'],
    minorKeywords: ['filter dirty', 'condensate drain', 'thermostat', 'float switch'],
    category: 'HVAC',
    severity: 'Functional Failure',
    tradeType: 'Licensed HVAC Contractor (EPA Certified)',
    codeRef: 'GA Minimum Standard Mechanical Code / IRC M1401',
    laborHours: 16,
    laborRate: 140,
    materialCost: 5350,
    permitCost: 250,
    minorAssembly: {
      category: 'HVAC',
      severity: 'Deferred Maintenance',
      tradeType: 'Licensed HVAC Contractor',
      codeRef: 'IRC M1401',
      laborHours: 3,
      laborRate: 140,
      materialCost: 150,
      permitCost: 0,
      justification: 'Routine HVAC servicing, condensate drain clearing, and float switch addition.',
    },
    justification: 'Primary heating/cooling mechanical failure affecting habitability and home thermal performance.',
  },
  {
    id: 'electrical_panel',
    keywords: ['federal pacific', 'fpe', 'stab-lok', 'zinsco', 'challenger panel', 'panel replacement', 'service upgrade', 'aluminum branch wiring'],
    minorKeywords: ['double tapped', 'double-tapped neutral', 'missing afci', 'open ground', 'gfci missing', 'reversed polarity'],
    category: 'Electrical',
    severity: 'Safety Hazard',
    tradeType: 'Licensed Master Electrician',
    codeRef: 'NEC 110.3(B) & NEC 408',
    laborHours: 14,
    laborRate: 140,
    materialCost: 1000,
    permitCost: 250,
    minorAssembly: {
      category: 'Electrical',
      severity: 'Safety Hazard',
      tradeType: 'Licensed Master Electrician',
      codeRef: 'NEC 408.41 & NEC 210.12',
      laborHours: 6,
      laborRate: 140,
      materialCost: 350,
      permitCost: 100,
      justification: 'Breaker box branch wiring correction, neutral separation, or AFCI/GFCI breaker retrofitting.',
    },
    justification: 'Critical electrical fire hazard and major underwriting uninsurability concern requiring licensed electrician remediation.',
  },
  {
    id: 'polybutylene_plumbing',
    keywords: ['polybutylene', 'quest pipe', 'whole-home repipe', 'lead pipe', 'galvanized supply'],
    minorKeywords: ['dripping faucet', 'running toilet', 'hose bibb leak', 'drain trap leak'],
    category: 'Plumbing',
    severity: 'Major Defect',
    tradeType: 'Licensed Master Plumber',
    codeRef: 'GA State Plumbing Code / IRC P2605',
    laborHours: 36,
    laborRate: 130,
    materialCost: 3800,
    permitCost: 250,
    minorAssembly: {
      category: 'Plumbing',
      severity: 'Minor Defect',
      tradeType: 'Licensed Master Plumber',
      codeRef: 'IRC P2605',
      laborHours: 3,
      laborRate: 130,
      materialCost: 120,
      permitCost: 0,
      justification: 'Localized fixture / trap leak repair.',
    },
    justification: 'Defective piping material prone to sudden catastrophic burst leaks, resulting in insurer denials and costly water damage.',
  },
  {
    id: 'water_heater',
    keywords: ['water heater dripping', 't&p valve', 'water heater past service life', 'water heater replacement', 'tank corrosion', 'water heater leak'],
    minorKeywords: ['discharge pipe missing', 'temperature setting', 'anode rod'],
    category: 'Plumbing',
    severity: 'Functional Failure',
    tradeType: 'Licensed Master Plumber',
    codeRef: 'IRC P2804 & GA Plumbing Code',
    laborHours: 6,
    laborRate: 130,
    materialCost: 1350,
    permitCost: 150,
    minorAssembly: {
      category: 'Plumbing',
      severity: 'Minor Defect',
      tradeType: 'Licensed Master Plumber',
      codeRef: 'IRC P2804',
      laborHours: 2,
      laborRate: 130,
      materialCost: 80,
      permitCost: 0,
      justification: 'Extension of T&P relief valve discharge line to safe exterior/pan drainage point.',
    },
    justification: 'Water heater approaching end of manufacturer design life; active valve leaking signals internal pressure or tank sediment stress.',
  },
  {
    id: 'structural_foundation',
    keywords: ['foundation crack', 'differential settling', 'horizontal crack', 'step crack in block', 'helical pier', 'bowing foundation', 'structural deflection', 'subfloor rot'],
    minorKeywords: ['hairline settlement crack', 'efflorescence'],
    category: 'Structural',
    severity: 'Major Defect',
    tradeType: 'Licensed Structural Contractor / PE',
    codeRef: 'IRC R403 / Foundation Design',
    laborHours: 32,
    laborRate: 135,
    materialCost: 4500,
    permitCost: 350,
    minorAssembly: {
      category: 'Structural',
      severity: 'Minor Defect',
      tradeType: 'Licensed Masonry Specialist',
      codeRef: 'IRC R403',
      laborHours: 4,
      laborRate: 110,
      materialCost: 150,
      permitCost: 0,
      justification: 'Surface tuckpointing and hairline masonry mortar sealing against surface moisture.',
    },
    justification: 'Differential movement in load-bearing foundation components requires structural stabilization and professional engineer evaluation.',
  },
  {
    id: 'deck_ledger',
    keywords: ['deck ledger', 'missing lag bolts', 'deck connection', 'deck collapse', 'deck railing loose', 'unbolted ledger'],
    minorKeywords: ['baluster spacing', 'loose step tread'],
    category: 'Exterior',
    severity: 'Safety Hazard',
    tradeType: 'Licensed Structural Carpenter',
    codeRef: 'IRC R507.9 (Deck Ledger Connection)',
    laborHours: 12,
    laborRate: 105,
    materialCost: 550,
    permitCost: 200,
    minorAssembly: {
      category: 'Exterior',
      severity: 'Minor Defect',
      tradeType: 'Licensed Carpenter',
      codeRef: 'IRC R507.8',
      laborHours: 3,
      laborRate: 105,
      materialCost: 120,
      permitCost: 0,
      justification: 'Railing reinforcement and baluster attachment securing.',
    },
    justification: 'Life-safety structural hazard. Elevated deck ledger separation is the leading cause of catastrophic residential deck failures.',
  },
  {
    id: 'crawlspace_encapsulation',
    keywords: ['crawlspace standing water', 'microbial growth', 'crawlspace moisture', 'mold in crawlspace', 'high relative humidity', 'encapsulation', 'wood decay fungus'],
    minorKeywords: ['torn vapor barrier', 'downspout discharge near foundation'],
    category: 'Structural',
    severity: 'Major Defect',
    tradeType: 'Licensed Environmental / Encapsulation Specialist',
    codeRef: 'IRC R408.3 (Unvented Crawlspaces)',
    laborHours: 24,
    laborRate: 110,
    materialCost: 3200,
    permitCost: 150,
    minorAssembly: {
      category: 'Structural',
      severity: 'Deferred Maintenance',
      tradeType: 'Licensed Waterproofing Specialist',
      codeRef: 'IRC R408',
      laborHours: 4,
      laborRate: 105,
      materialCost: 300,
      permitCost: 0,
      justification: '6-mil poly vapor barrier repair and downspout extension routing.',
    },
    justification: 'Excessive crawlspace moisture promotes subfloor wood rot, structural framing decay, and indoor air quality degradation.',
  },
];

export function extractTextFromPdfBuffer(buffer) {
  const raw = buffer.toString('latin1');
  const extractedChunks = [];
  const parenRegex = /\(([^()\\]{3,200})\)/g;
  let match;
  while ((match = parenRegex.exec(raw)) !== null) {
    const clean = match[1]
      .replace(/\\([()\\])/g, '$1')
      .replace(/\\r|\\n/g, ' ')
      .trim();
    if (clean.length > 3 && /[a-zA-Z]{3,}/.test(clean)) {
      extractedChunks.push(clean);
    }
  }

  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let sMatch;
  while ((sMatch = streamRegex.exec(raw)) !== null) {
    const textPortion = sMatch[1];
    const asciiStrings = textPortion.match(/[a-zA-Z0-9.,;:!?'"()\s-]{12,}/g);
    if (asciiStrings) {
      extractedChunks.push(...asciiStrings);
    }
  }

  return extractedChunks.join('\n').trim();
}

export function parseInspectionText(rawText, zipCode = '30005') {
  if (!rawText || !rawText.trim()) return [];

  const regional = getRegionalMultiplier(zipCode);
  const lines = rawText
    .split(/[\r\n]+|\d+\.\s+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 12);

  const defects = [];
  const matchedRules = new Set();

  for (const line of lines) {
    if (SATISFACTORY_PATTERNS.some((p) => p.test(line))) {
      continue;
    }

    const lineLower = line.toLowerCase();
    let matched = false;

    for (const rule of TRADE_ASSEMBLIES) {
      if (rule.minorKeywords && rule.minorKeywords.some((k) => lineLower.includes(k))) {
        const sub = rule.minorAssembly;
        const labor = Math.round(sub.laborHours * (sub.laborRate * regional.multiplier));
        const mat = Math.round(sub.materialCost * regional.multiplier);
        const median = labor + mat + sub.permitCost;
        defects.push({
          id: `parsed-${Date.now()}-${defects.length + 1}`,
          category: sub.category,
          severity: sub.severity,
          title: line.length > 90 ? line.substring(0, 87) + '...' : line,
          description: line,
          tradeType: sub.tradeType,
          codeRef: sub.codeRef,
          laborHours: sub.laborHours,
          laborRate: Math.round(sub.laborRate * regional.multiplier),
          materialCost: mat,
          permitCost: sub.permitCost,
          costLow: Math.round(median * 0.78),
          costMedian: median,
          costHigh: Math.round(median * 1.28),
          included: true,
          justification: sub.justification,
        });
        matched = true;
        break;
      }

      if (rule.keywords.some((k) => lineLower.includes(k))) {
        const labor = Math.round(rule.laborHours * (rule.laborRate * regional.multiplier));
        const mat = Math.round(rule.materialCost * regional.multiplier);
        const median = labor + mat + rule.permitCost;
        defects.push({
          id: `parsed-${Date.now()}-${defects.length + 1}`,
          category: rule.category,
          severity: rule.severity,
          title: line.length > 90 ? line.substring(0, 87) + '...' : line,
          description: line,
          tradeType: rule.tradeType,
          codeRef: rule.codeRef,
          laborHours: rule.laborHours,
          laborRate: Math.round(rule.laborRate * regional.multiplier),
          materialCost: mat,
          permitCost: rule.permitCost,
          costLow: Math.round(median * 0.78),
          costMedian: median,
          costHigh: Math.round(median * 1.28),
          included: true,
          justification: rule.justification,
        });
        matchedRules.add(rule.id);
        matched = true;
        break;
      }
    }

    if (!matched && /(?:leak|damage|broken|corrosion|failed|safety|hazard|cracked|rot|decay|inoperable|deteriorated)/i.test(line)) {
      const laborHours = 6;
      const baseRate = 125;
      const labor = Math.round(laborHours * (baseRate * regional.multiplier));
      const mat = Math.round(650 * regional.multiplier);
      const median = labor + mat + 100;
      defects.push({
        id: `parsed-${Date.now()}-${defects.length + 1}`,
        category: 'General Repairs',
        severity: 'Defect Identified',
        title: line.length > 90 ? line.substring(0, 87) + '...' : line,
        description: line,
        tradeType: 'Licensed Trade Specialist',
        codeRef: 'Georgia Minimum Standard Construction Code',
        laborHours,
        laborRate: Math.round(baseRate * regional.multiplier),
        materialCost: mat,
        permitCost: 100,
        costLow: Math.round(median * 0.75),
        costMedian: median,
        costHigh: Math.round(median * 1.3),
        included: true,
        justification: 'Deficiency noted during property inspection requiring trade evaluation and remediation.',
      });
    }
  }

  return defects;
}

export function computeConcession(defects = [], strategy = 'balanced', propertyInfo = {}) {
  const active = defects.filter((d) => d.included);
  const sum = (fn) => active.reduce((acc, d) => acc + (Number(fn(d)) || 0), 0);

  const totalLow = sum((d) => d.costLow);
  const totalMedian = sum((d) => d.costMedian);
  const totalHigh = sum((d) => d.costHigh);

  const price = Number(propertyInfo.purchasePrice) || 450000;
  const loanType = propertyInfo.loanType || 'conventional';
  const downPayment = Number(propertyInfo.downPaymentPercent) || 10;

  const { capPercent, ruleLabel } = getLenderConcessionCapPercent(loanType, downPayment);

  let baseline = totalMedian;
  if (strategy === 'conservative') baseline = totalLow;
  if (strategy === 'aggressive') baseline = totalHigh;

  const baseForCap = loanType === 'va' ? price * (1 - downPayment / 100) : price;
  const maxLenderConcession = Math.round(baseForCap * capPercent);

  let closingCredit = baseline;
  let priceReduction = 0;

  if (baseline > maxLenderConcession) {
    closingCredit = maxLenderConcession;
    priceReduction = baseline - maxLenderConcession;
  }

  const fmt = (n) => `$${Math.round(n).toLocaleString()}`;

  // Formatted GAR Form F404 Amendment Special Stipulation
  const garF404Stipulation = priceReduction > 0
    ? `Seller agrees at closing to: (1) contribute the sum of ${fmt(closingCredit)} toward Buyer's closing costs, prepaid items, and/or loan rate buydown, subject to Buyer's lender approval, and (2) reduce the Purchase Price by ${fmt(priceReduction)} from ${fmt(price)} to ${fmt(price - priceReduction)}, in lieu of performing physical repairs for items noted on the attached Repair Cost Worksheet.`
    : `Seller agrees at closing to contribute the sum of ${fmt(closingCredit)} toward Buyer's closing costs, prepaid items, and/or loan rate buydown, subject to Buyer's lender approval, in lieu of performing physical repairs for items noted on the attached Repair Cost Worksheet.`;

  // Plain-Language Closing Attorney Request
  const closingAttorneyDraft = `REQUEST FOR CLOSING CREDIT IN LIEU OF REPAIRS — DRAFT FOR ATTORNEY REVIEW
Property: ${propertyInfo.address || '[Property Address]'}
Buyer(s): ${propertyInfo.buyerName || '[Buyer Name]'}
Seller(s): ${propertyInfo.sellerName || '[Seller Name]'}
Closing Attorney / Firm: ${propertyInfo.closingAttorney || '[Closing Attorney Firm]'}

During the contractual Due Diligence Period, Buyer's property inspection identified ${active.length} itemized repair deficiencies (estimated at ${fmt(totalLow)} to ${fmt(totalHigh)}).

In lieu of Seller performing physical repairs prior to closing, Buyer proposes that Seller credit Buyer ${fmt(closingCredit)} at closing on the ALTA Settlement Statement toward Buyer's allowable closing costs, prepaids, and/or discount points (with any excess of ${fmt(priceReduction)} applied as a purchase price reduction), subject to lender approval. In consideration, Buyer accepts the noted items in present condition.

This proposed amendment must be formally documented on standard contract forms reviewed by the closing attorney or licensed agent prior to Due Diligence expiration.`;

  return {
    totalDefectsCount: active.length,
    totalLow,
    totalMedian,
    totalHigh,
    recommendedCredit: closingCredit,
    maxLenderConcession,
    excessPriceReduction: priceReduction,
    ruleLabel,
    garF404Stipulation,
    closingAttorneyDraft,
  };
}
