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
  priorityOneHub: 'https://fhinspectionsatl.com',
  conversionEndpoints: {
    instantQuote: 'https://fhinspectionsatl.com/quote',
    directSchedule: 'https://fhinspectionsatl.com/schedule',
    preDrywall: 'https://fhinspectionsatl.com/services/pre-drywall-inspection',
    builderWarranty: 'https://fhinspectionsatl.com/services/11-month-warranty-inspection',
    dekalbLowFlow: 'https://fhinspectionsatl.com/services/dekalb-low-flow-water-certificate',
    radonTesting: 'https://fhinspectionsatl.com/services/radon-testing',
    sewerScope: 'https://fhinspectionsatl.com/services/sewer-scope-inspection',
    moldTesting: 'https://fhinspectionsatl.com/services/mold-air-quality-testing',
    strCompliance: 'https://fhinspectionsatl.com/services/str-compliance-inspection',
    realtorVip: 'https://fhinspectionsatl.com/realtors'
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
    'Every social post, video, email, and SMS links directly back to https://fhinspectionsatl.com',
    'Zero Southern slang clichés and zero raw markdown asterisks (*)'
  ],
  bannedAcademicJargon: [
    'psychrometric moisture loads',
    'parallel return paths on grounding conductors',
    'hygroscopic equilibrium',
    'thermodynamic enthalpy'
  ],
  coreValueStack: {
    inspectorTeam: '2 Certified Inspectors on Every Job (Finished in 1.5–2.5 Hours)',
    warrantyTotal: '$35,000 in Combined Warranty & Guarantee Protection ($10,000 Elite 90-Day Warranty + $25,000 InterNACHI Honor Guarantee)',
    includedTech: 'Free Calibrated Infrared Thermal Imaging & Free 4K Aerial Drone Roof Scans',
    turnaround: 'Same-Day / 24-Hour Interactive Digital Reports with One-Click Repair Request Builder',
    pricing: {
      singleFamilyStart: '$345',
      condoStart: '$295',
      preDrywallStart: '$275',
      elevenMonthStart: '$335',
      moldFlat: '$450',
      sewerScopeFlat: '$450',
      radonFlat: '$250',
      termiteStart: '$125',
      poolFlat: '$300',
      strStart: '$395',
      dekalbLowFlow: '$100 standalone ($75 bundled across all 4 fixtures: 1.6 GPF toilets, 2.5 GPM showerheads, 2.0 GPM bathroom faucets, 2.2 GPM kitchen faucets)'
    }
  }
};
