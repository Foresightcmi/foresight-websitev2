// Unified Foresight Home Inspections Persona & Website-First Attribution Engine
// Priority #1: All outbound channels (Email, Social, GBP, Video, SMS) exist strictly to drive
// high-intent home buyers, sellers, and Georgia Realtors to https://fhinspectionsatl.com

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TRUTH_PATH = path.resolve(__dirname, '../data/truth.json');

export function loadCanonicalTruth() {
  return JSON.parse(fs.readFileSync(TRUTH_PATH, 'utf8'));
}

export const FORESIGHT_UNIFIED_PERSONA = {
  priorityOneHub: 'https://www.fhinspectionsatl.com',
  conversionEndpoints: {
    instantQuote: 'https://www.fhinspectionsatl.com/quote',
    directSchedule: 'https://www.fhinspectionsatl.com/quote',
    preDrywall: 'https://www.fhinspectionsatl.com/services/pre-drywall-inspection',
    builderWarranty: 'https://www.fhinspectionsatl.com/services/11-month-warranty-inspection',
    dekalbLowFlow: 'https://www.fhinspectionsatl.com/service-areas/dekalb-county-compliance',
    radonTesting: 'https://www.fhinspectionsatl.com/services/radon-testing',
    sewerScope: 'https://www.fhinspectionsatl.com/services/sewer-scope-inspection',
    moldTesting: 'https://www.fhinspectionsatl.com/services/mold-testing',
    strCompliance: 'https://www.fhinspectionsatl.com/blog/metro-atlanta-short-term-rental-str-compliance-guide',
    realtorVip: 'https://www.fhinspectionsatl.com/realtors'
  },
  leadInspector: {
    name: 'Christopher Boykin, CMI®',
    credential: 'Certified Master Inspector® (#MICB-1082)',
    phone: '(678) 480-2110',
    email: 'inspect@foresightcmi.com',
    socialHandle: '@plsinspectnow'
  },
  voicePillars: [
    'Warm, consultative, neighborly yet authoritative plain-English building science educator',
    'Never robotic, cold, or academic; never pushy; always accepts No graciously',
    '3-Step Diagnostic Format: 🔍 What We Spotted -> 💡 What This Could Mean -> 🛠️ How We Protect You',
    'Every social post, video, email, and SMS links directly back to https://www.fhinspectionsatl.com',
    'Zero Southern slang clichés and zero raw markdown asterisks (*)',
    'Strictly use authentic home inspector terminology (inspection, evaluate, evaluation, check, walkthrough) — never corporate accounting words like "audit"'
  ],
  bannedAcademicJargon: [
    'psychrometric moisture loads',
    'parallel return paths on grounding conductors',
    'hygroscopic equilibrium',
    'thermodynamic enthalpy',
    'audit',
    'audits',
    'audited',
    'auditing',
    'delve',
    'tapestry',
    'game-changer',
    'pivotal',
    'testament',
    'seamless'
  ],
  coreValueStack: {
    inspectorTeam: '2 Certified Inspectors on Every Job (Finished in 1.5–2.5 Hours)',
    ratingSummary: '4.8★ Across 53 Verified Google Reviews',
    warrantyTotal: '$35,000 in Combined Warranty & Guarantee Protection ($10,000 Elite 90-Day Warranty + $25,000 InterNACHI Honor Guarantee)',
    includedTech: 'Free Calibrated Infrared Thermal Imaging & Free 4K Aerial Drone Roof Scans',
    turnaround: 'Same-Day / 24-Hour Interactive Digital Reports with One-Click Repair Request Builder',
    pricing: {
      singleFamilyStart: '$345',
      condoStart: '$295',
      preDrywallStart: '$275 ($275 up to 1,500 sq ft | $300 for 1,501–2,500 sq ft | $350 for 2,501–3,500 sq ft | $400 for 3,501+ sq ft)',
      newConstructionStart: '$400',
      preListingStart: '$365 ($295 Condos)',
      elevenMonthStart: '$335',
      moldStart: '$450',
      sewerScopeFlat: '$450',
      radonFlat: '$250',
      termiteStart: '$125 ($165 crawlspace)',
      poolFlat: '$300',
      strStart: '$395',
      dekalbLowFlow: '$100 flat rate across all 4 fixtures (1.6 GPF toilets, 2.5 GPM showerheads, 2.0 GPM bathroom faucets, 2.2 GPM kitchen faucets)'
    }
  }
};
