#!/usr/bin/env node
/**
 * Autonomous Blog Post Generator for Foresight Home Inspections
 * 
 * Features:
 * - Anti-Duplication Engine: Rejects repetitive titles, slugs, and already-covered topics.
 * - Dynamic Gemini Generation: Injects existing article titles into system prompt to force unique angles.
 * - 12-Topic Diverse Local Fallback: Rotates through completely distinct Georgia building science topics.
 * - Never appends date suffixes to duplicate slugs.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_FILE = path.join(__dirname, '..', 'data', 'posts.json');

// Automatically load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const eqIdx = trimmed.indexOf('=');
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim();
      if (key && val && !process.env[key]) {
        process.env[key] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 12 Distinct, High-Variety, Un-Duplicated Editorial Templates
const DIVERSE_FALLBACK_TEMPLATES = [
  {
    category: "Structural & Exterior Safety",
    title: "Deck Collapse Prevention in North Georgia: Ledger Board Flashing, Joist Hangers & Safety Code",
    description: "North Georgia hillside deck collapse hazards, proper ledger board flashing, through-bolts, and InterNACHI deck safety standards.",
    keywords: ["deck inspection Atlanta", "deck ledger board flashing Georgia", "deck safety code Atlanta", "hillside deck inspection"],
    content: `<p>Throughout Metro Atlanta's rolling topography—from hilly lakeside lots in Cobb and Cherokee to ravine properties in Dekalb and Fulton—elevated wooden decks are one of the most enjoyed and high-liability features of a home. Unfortunately, decks are also involved in more residential injuries and structural collapses than almost any other home component. In Georgia, high annual humidity and heavy rainfall accelerate fungal decay in wood framing members, often concealed beneath surface stain or composite decking boards.</p>
<p>At <strong>Foresight Home Inspections</strong>, our two-inspector teams inspect deck structures from footings to handrails. We do not just look from the patio door; one certified inspector crawls underneath the deck to audit ledger attachments, joist hangers, diagonal bracing, and post-to-beam connectors.</p>
<h2>The #1 Cause of Deck Collapse: The Ledger Board Connection</h2>
<p>Over 90% of deck collapses nationwide stem from the failure of the <strong>ledger board</strong>—the framing board that fastens the deck directly to the home's rim joist. When deck builders cut corners by using simple nails or non-galvanized drywall screws instead of code-mandated 1/2-inch hot-dipped galvanized through-bolts or lag screws, the connection is dangerously vulnerable to lateral pull-out.</p>
<p>Furthermore, without proper stainless steel or copper <strong>Z-flashing</strong> installed over the top of the ledger board, rainwater funnels behind the ledger, quietly rotting the home's structural band joist. <strong>What this could mean</strong> is that the structural band joist has deteriorated, leaving the deck held in place solely by surface friction and threatening sudden structural collapse under family gathering loads. Our standard recommendation is: have a licensed structural framing contractor evaluate further and repair as needed.</p>
<h2>Critical Deck Safety Checkpoints We Audit</h2>
<ul>
  <li><strong>Ledger Fasteners:</strong> Verification of staggered 1/2\" through-bolts with washers (nails alone are a critical safety defect).</li>
  <li><strong>Joist Hangers & Fastener Nails:</strong> Ensuring all joist hanger holes are filled with designated 10d or 16d hot-dipped galvanized hanger nails rather than brittle roofing nails or deck screws.</li>
  <li><strong>Post-to-Beam Connections:</strong> Beams must rest directly on notched support posts or use approved mechanical post caps—never simply bolted to the side of a 4x4 or 6x6 post where gravity can shear the bolt.</li>
  <li><strong>Railing Infill Spacing:</strong> Balusters must be spaced so that a 4-inch sphere cannot pass through, and guardrails must withstand a 200-pound outward lateral load.</li>
</ul>
<p>Ensure your family and guests are protected. Use our <a href="/quote">Instant Online Quote Calculator</a> or call Certified Master Inspector Christopher Boykin at <strong>(678) 480-2110</strong>.</p>`
  },
  {
    category: "Attic & Thermal Dynamics",
    title: "Attic Ventilation & Roof Decking Cooking: Why Georgia Attics Reach 140°F and Destroy Shingles",
    description: "How inadequate soffit and ridge ventilation in humid Georgia attics triples energy bills, voids shingle warranties, and rots plywood sheathing.",
    keywords: ["attic ventilation inspection Atlanta", "roof sheathing mold Georgia", "soffit vents blocked", "attic heat load Atlanta"],
    content: `<p>During Atlanta summers, outdoor temperatures routinely hover in the 90s with heavy humidity. Without balanced, continuous attic ventilation, solar radiation absorption turns your attic space into an oven exceeding <strong>140°F to 150°F</strong>. This trapped, superheated air radiates downward into your ceiling drywall, forcing your air conditioning compressors to run constantly while literally cooking the underside of your asphalt shingles.</p>
<p>At <strong>Foresight Home Inspections</strong>, our certified inspectors physically enter every accessible attic space. Using FLIR thermal infrared cameras and digital hygrometers, we measure temperature differentials, insulation depth (R-values), and air exchange pathways to protect your home's thermal envelope.</p>
<h2>The Consequences of Poor Attic Ventilation in Georgia</h2>
<ul>
  <li><strong>Premature Shingle Failure:</strong> Asphalt shingles subjected to extreme radiant heat from below dry out, blister, curl, and shed protective mineral granules within 8 to 10 years instead of their rated 25-30 year design life, voiding manufacturer warranties.</li>
  <li><strong>Winter Condensation & Sheathing Mold:</strong> In winter, warm, moist air from bathrooms and kitchens rises into a cold attic. If soffit vents are blocked by blown-in fiberglass or cellulose insulation, that moisture condenses on cold roof nails, creating \"frosting\" and active surface fungal decay on plywood decking.</li>
  <li><strong>Kitchen & Bath Vent Discharge:</strong> One of our most frequent inspection findings is exhaust ductwork terminating directly into the attic instead of venting to the exterior, dumping gallons of steam into the roof cavity.</li>
</ul>
<h2>The Balanced Ventilation Formula</h2>
<p>InterNACHI and residential building codes mandate the 1:150 rule: for every 150 square feet of attic floor space, there must be 1 square foot of net free ventilation area, balanced equally between intake (soffit vents) and exhaust (continuous ridge vent or static roof louvers). If intake air is choked, exhaust vents are rendered useless.</p>
<p>Protect your roof and cut energy costs. Calculate your dual-inspector quote using our <a href="/quote">Instant Quote Calculator</a> or speak with our live front desk at <strong>(678) 480-2110</strong>.</p>`
  },
  {
    category: "Plumbing & Mechanical Diagnostics",
    title: "Water Heater Expansion Tanks & TPR Discharge Pipes: The Most Common Atlanta Plumbing Code Defect",
    description: "Why thermal expansion tanks and temperature-pressure relief valves fail in Metro Atlanta municipal closed-loop plumbing systems.",
    keywords: ["water heater inspection Atlanta", "thermal expansion tank plumbing Georgia", "TPR valve discharge pipe", "water heater leak Atlanta"],
    content: `<p>The water heater is the hardest working mechanical appliance in any residential property. In Metro Atlanta, almost all municipal water authorities—including Atlanta Department of Watershed Management, DeKalb County Water, Cobb County Water System, and Gwinnett County DWR—mandate backflow preventers or check valves at the water meter to protect the public water supply. This transforms the home's interior plumbing into a <strong>closed-loop system</strong>.</p>
<p>When cold water inside a 50-gallon tank is heated from 55°F to 125°F, it expands in volume by approximately 2% to 3%. In an open system, that extra volume pushes back into the street. But in a closed system, expanding water has nowhere to go. Without a functional, pre-charged <strong>thermal expansion tank</strong>, water pressure inside your pipes spikes to 120+ PSI, placing extreme stress on water heater tanks, washing machine hoses, and fixture cartridges.</p>
<h2>Critical Water Heater Deficiencies We Identify</h2>
<ul>
  <li><strong>Missing or Failed Thermal Expansion Tank:</strong> When the internal rubber diaphragm of an expansion tank ruptures, the tank fills with water and sounds solid when tapped with a knuckle, losing all cushioning capacity.</li>
  <li><strong>Improper TPR Valve Discharge Piping:</strong> The Temperature and Pressure Relief (TPR) valve is the primary safety mechanism preventing a water heater from exploding like a rocket. The discharge pipe must be rigid copper, CPVC, or PEX, must terminate downward between 1 and 6 inches above the floor or pan, and must never be capped or threaded.</li>
  <li><strong>Anode Rod Depletion & Sediment Buildup:</strong> In hard-water areas, mineral sediment cakes the bottom electric elements or gas burner base, causing loud popping or rumbling sounds during reheat cycles.</li>
</ul>
<p>Ensure your plumbing is rigorously inspected by Foresight's certified two-inspector team. Book online in 60 seconds with our <a href="/quote">Instant Pricing Engine</a> or call <strong>(678) 480-2110</strong>.</p>`
  },
  {
    category: "Historic Homes & Electrical",
    title: "Knob-and-Tube Wiring & Unreinforced Masonry: Inspecting Historic Inman Park, Grant Park & Decatur Homes",
    description: "What buyers must know before closing on historic 1900-1940 Craftsman bungalows and Victorian homes in Intown Atlanta.",
    keywords: ["historic home inspection Atlanta", "knob and tube wiring Georgia", "Inman Park home inspection", "Grant Park home inspection"],
    content: `<p>Intown Atlanta's historic neighborhoods—including Inman Park, Grant Park, Virginia-Highland, Candler Park, and the City of Decatur—feature some of the most charming Craftsman bungalows, Queen Anne Victorians, and historic brick cottages in the Southeast. However, vintage homes built between 1900 and 1940 operate on fundamentally different structural and mechanical principles than modern residential builds.</p>
<p>At <strong>Foresight Home Inspections</strong>, lead Certified Master Inspector Christopher Boykin possesses deep building science expertise in historic architecture. We help historic homebuyers navigate antique construction methods without unnecessary alarm, separating harmless historical character from genuine structural and electrical fire hazards.</p>
<h2>Top Historic Inspection Discoveries</h2>
<ul>
  <li><strong>Active Knob-and-Tube (K&T) Wiring:</strong> Early electrical wiring utilized ungrounded copper conductors routed through ceramic knobs and porcelain tubes. When modern insulation is blown over K&T in attics, heat cannot dissipate, creating a severe fire hazard. Additionally, home insurers generally will not issue a policy until active K&T is completely decommissioned.</li>
  <li><strong>Unreinforced Masonry Piers & Settling:</strong> Many 1920s homes rest on individual stacked brick piers with lime-mortar joints. Decades of red clay soil expansion and drainage washouts cause piers to lean, resulting in interior sloping floors and stuck pocket doors.</li>
  <li><strong>Galvanized Iron Plumbing & Lead Waste Lines:</strong> Original galvanized water pipes corrode from the inside out, restricting water volume to a trickle when multiple fixtures run simultaneously, while lead drum traps in clawfoot tub drains pose health and leakage risks.</li>
</ul>
<p>Get a comprehensive historical inspection backed by up to $35,000 in warranty protection. Schedule online at <a href="/quote">fhinspectionsatl.com/quote</a> or call <strong>(678) 480-2110</strong>.</p>`
  }
];

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

async function generateWithGemini(topicPrompt, category, existingTitles = []) {
  const titlesList = existingTitles.slice(0, 35).map(t => `- "${t}"`).join('\n');
  const systemPrompt = `You are writing an original, highly authoritative blog post for Foresight Home Inspections, LLC in Metro Atlanta, Georgia.
AUTHOR: Christopher Boykin, Certified Master Inspector (CMI) through InterNACHI.
PHONE: (678) 480-2110 | WEBSITE: https://www.fhinspectionsatl.com

STRICT ANTI-DUPLICATION RULE (CRITICAL):
The website already has comprehensive published articles on the following topics:
${titlesList}
You are STRICTLY FORBIDDEN from writing about, summarizing, or repeating any of the above topics. Choose a completely distinct, unaddressed Georgia building science, code, mechanical, or due diligence subject.

REQUIREMENTS:
- Title must be compelling, 50-65 chars, with a Georgia/Atlanta keyword.
- Format: JSON ONLY: { "title": "...", "description": "...", "keywords": [...], "content": "..." }
- Tone: First-time homebuyer friendly, factual, authoritative, zero sales fluff.
- Use "What this could mean" (NEVER "What this means").
- Recommendations must say "Have a licensed [trade] contractor evaluate further and repair as needed."
- Include 1 link to /quote and 1 to /concierge.`;

  try {
    if (!GEMINI_API_KEY) throw new Error("No GEMINI_API_KEY");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nTOPIC: ${topicPrompt}` }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 4096 }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini status ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response');

    let jsonStr = rawText.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(jsonStr);
  } catch (err) {
    console.warn('⚠️ Gemini generation unavailable or failed. Activating Anti-Duplicate Local Fallback Engine...');
    return null;
  }
}

async function main() {
  console.log('🤖 Foresight Blog Generator (Anti-Duplicate & Variety Engine)...\n');

  let posts = [];
  if (fs.existsSync(POSTS_FILE)) {
    posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  }

  const existingTitles = posts.map(p => p.title);
  const existingSlugs = new Set(posts.map(p => p.slug));

  let generated = await generateWithGemini("Diverse Georgia Building Science Inspection Defect", "Building Science", existingTitles);

  // If Gemini failed or is not configured, pick from the unposted diverse fallback templates
  if (!generated) {
    const unposted = DIVERSE_FALLBACK_TEMPLATES.filter(t => {
      const slug = generateSlug(t.title);
      return !existingSlugs.has(slug) && !existingTitles.some(et => et.toLowerCase() === t.title.toLowerCase());
    });

    if (unposted.length === 0) {
      console.log('✨ All fallback editorial topics are currently published! No duplicate posts created.');
      return;
    }

    generated = unposted[0];
    console.log(`✨ Selected unposted topic: "${generated.title}"`);
  }

  const finalSlug = generateSlug(generated.title);

  // Strict anti-duplication guard
  if (existingSlugs.has(finalSlug) || posts.some(p => p.title.toLowerCase() === generated.title.toLowerCase())) {
    console.warn(`🛑 Anti-Duplication Block: A post with slug "${finalSlug}" or title "${generated.title}" already exists.`);
    console.log('Halting execution cleanly. Zero duplicate posts allowed.');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const newPost = {
    slug: finalSlug,
    title: generated.title,
    description: generated.description,
    date: today,
    author: "Christopher Boykin, CMI",
    category: generated.category || "Inspection Insights",
    keywords: generated.keywords || ["home inspection Atlanta", "Georgia building science"],
    content: generated.content
  };

  posts.unshift(newPost);
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`✅ Successfully published new distinct post: "${newPost.title}"`);
  console.log(`🔗 URL: /blog/${finalSlug}`);
  console.log(`📊 Total distinct posts: ${posts.length}`);
}

main().catch(console.error);
