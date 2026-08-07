import fs from 'fs';
import path from 'path';

/**
 * 🚀 SME-GROUNDED AI SEO CONTENT ENGINE 🚀
 * 
 * Implements "Do This Before Creating Any SEO Content" (Video 4 Framework):
 * 1. Pre-Inject SME (Subject Matter Expert) field knowledge & brand intelligence dossier.
 * 2. Reverse-engineer high-intent search SERP patterns (BLUF, checklists, GAR addendums).
 * 3. 5-Article Keyword Cluster Mesh Generation.
 */

const smeDataPath = path.join(process.cwd(), 'data', 'sme_brand_intelligence.json');
let SME_DOSSIER = {};

try {
  SME_DOSSIER = JSON.parse(fs.readFileSync(smeDataPath, 'utf8'));
} catch (e) {
  SME_DOSSIER = {
    brandName: "Foresight Home Inspections, LLC",
    founder: "Christopher Boykin, CMI",
    primaryAdvantage: "Two Certified Inspectors on Every Inspection"
  };
}

export function createSmeGroundingPrompt(targetKeyword, clusterTopic) {
  return `
Role: Senior E-E-A-T Content Architect for ${SME_DOSSIER.brandName}.

SME Brand Intelligence Dossier:
- Founder & SME: ${SME_DOSSIER.founder} (${SME_DOSSIER.credentials})
- Primary Advantage: ${SME_DOSSIER.primaryAdvantage}
- Warranty Protection: ${SME_DOSSIER.warrantyProtection}
- Technology Standard: ${SME_DOSSIER.technologyStandard}
- Realtor Utility: ${SME_DOSSIER.realtorsTools}

SME Field Insights Grounding:
${JSON.stringify(SME_DOSSIER.smeFieldKnowledge, null, 2)}

Task:
Generate 1 high-ranking, 1,200+ word article targeting the keyword: "${targetKeyword}" under the topic cluster "${clusterTopic}".

Mandatory Requirements:
1. Catchy H1 Title with 2026/Georgia focus.
2. BLUF (Bottom Line Up Front) 2-sentence summary block for Position Zero AI Overviews.
3. SME Real-World Inspection Grounding: Weave in authentic field observations from the dossier.
4. Actionable Advice & SERP Layout: Include bulleted inspection checklists and GAR amendment repair advice.
5. Internal Link Mesh: Link to /quote, /realtors, /ask-twin, and /services.
6. FAQ Section: 3 Q&As structured for Speakable & FAQ Schema.
`;
}

console.log("🚀 SME-Grounded SEO Content Engine initialized with Brand Intelligence Dossier.");
