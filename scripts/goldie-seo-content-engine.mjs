import fs from 'fs';
import path from 'path';

/**
 * 🚀 JULIAN GOLDIE CLAUDE/GEMINI AI SEO CONTENT ENGINE 🚀
 * 
 * Based on the "Claude AI SEO Skill" Framework (Julian Goldie):
 * 1. Source of Truth Grounding (CMI credentials, Georgia housing red flags, 2-inspector model).
 * 2. 5-Article Keyword Cluster Mesh Generation.
 * 3. BLUF (Bottom Line Up Front) AI Overview Optimization.
 * 4. Internal Link Mesh & Schema Injection.
 * 5. Self-Correction & Auto-Publishing.
 */

const SOURCE_OF_TRUTH = {
  brand: "Foresight Home Inspections, LLC",
  author: "Christopher Boykin, CMI",
  credentials: "Certified Master Inspector® (Top 3% Credential in North America)",
  uniqueAdvantage: "Two Certified Inspectors on every job (cuts on-site time in half)",
  warranties: "$10,000 Elite Master Protection Warranty ($0 deductible)",
  technologies: "FLIR Thermal Imaging & Aerial Drone Roof Scans included standard",
  serviceRegion: "163+ Metro Atlanta Cities (Fulton, DeKalb, Cobb, Gwinnett, Cherokee, Forsyth)",
  phone: "678-480-2110",
  bookingUrl: "https://www.fhinspectionsatl.com/quote"
};

const GEORGIA_HOUSING_CASE_STUDIES = [
  {
    topic: "Polybutylene Pipe Hazards",
    location: "Sandy Springs & Alpharetta 1980s-1990s Subdivisions",
    finding: "Found degraded polybutylene gray plastic plumbing behind master bath vanity using FLIR thermal leak detection.",
    impact: "Saved buyer from an imminent $18,000 whole-house re-pipe disaster prior to closing."
  },
  {
    topic: "Federal Pacific Stab-Lok Electrical Panels",
    location: "Decatur & East Lake Mid-Century Homes",
    finding: "Identified un-bonded neutral bus and double-tapped FPC breakers with active scorch marks.",
    impact: "Negotiated a 100% seller credit for a main panel upgrade before closing."
  },
  {
    topic: "Crawlspace Mold & Subfloor Rot",
    location: "Marietta & Smyrna Clay Soil Foundations",
    finding: "FLIR thermal camera revealed 85% wood moisture saturation and active fungal growth due to missing vapor barrier.",
    impact: "Buyer used Foresight's HomeGauge CRL addendum to secure a $9,500 crawlspace encapsulation credit."
  }
];

export function createGoldieSeoPrompt(targetKeyword, clusterTopic) {
  return `
Role: World-Class Local SEO & E-E-A-T Content Architect for ${SOURCE_OF_TRUTH.brand}.

Source of Truth Grounding:
- Author: ${SOURCE_OF_TRUTH.author} (${SOURCE_OF_TRUTH.credentials})
- Differentiators: ${SOURCE_OF_TRUTH.uniqueAdvantage}, ${SOURCE_OF_TRUTH.warranties}, ${SOURCE_OF_TRUTH.technologies}.
- Region: ${SOURCE_OF_TRUTH.serviceRegion}.

Task:
Generate 1 high-ranking, 1,200+ word article targeting the keyword: "${targetKeyword}" under the topic cluster "${clusterTopic}".

Structure Requirements:
1. Catchy Title with 2026/Georgia focus.
2. BLUF (Bottom Line Up Front) 2-sentence summary for Google AI Overviews / ChatGPT.
3. Case Study Inclusion: Ground the article in one of these real Georgia inspection findings: ${JSON.stringify(GEORGIA_HOUSING_CASE_STUDIES)}.
4. H2 & H3 hierarchy with action-oriented headings.
5. Internal Link Mesh: Link to /quote (Instant Quote Calculator), /realtors (Realtor VIP Program), /ask-twin (Foresight AI), and /services.
6. FAQ Section with 3 Q&As designed for Speakable & FAQ Schema.
`;
}

console.log("🚀 Julian Goldie SEO Content Engine initialized for Foresight Home Inspections.");
