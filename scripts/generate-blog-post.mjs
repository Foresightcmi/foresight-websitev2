/**
 * Wednesday Automated Blog Writer — Foresight Home Inspections
 * Generates high-authority Georgia building-science educational articles
 * rotating across all 7 Metro Atlanta corridors via Gemini API
 * (dynamic model auto-discovery via lib/gemini-model-resolver.mjs)
 * with 12 corridor fallback templates, deterministic truth sanitization,
 * and automatic public/llms.txt + public/llms-full.txt synchronization.
 *
 * Flags:
 *   --dry-run   Validate and preview the generated/fallback post without writing files
 *   --no-alert  Suppress ntfy.sh push notifications
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveGeminiTextModels } from '../lib/gemini-model-resolver.mjs';
import { loadGovernorBrief, appendExperimentLedger } from './lib/seo-ledger-and-gate.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const NO_ALERT = process.argv.includes('--no-alert') || DRY_RUN;

// Load .env.local fallback when running locally
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'fores-antigravity-alerts-77';

async function sendNtfyAlert(title, message, priority = 'default', tags = 'memo') {
  if (NO_ALERT) {
    console.log(`🔕 [--no-alert] Suppressed ntfy notification: ${title}`);
    return;
  }
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: { Title: title, Priority: priority, Tags: tags },
      body: message
    });
  } catch (err) {
    console.warn(`⚠️ Failed to send ntfy alert: ${err.message}`);
  }
}

const SEVEN_CORRIDORS = [
  'Northwest Corridor (Cobb & Cherokee: Marietta, Smyrna, Kennesaw, Acworth, Woodstock, Canton)',
  'North Fulton Corridor (Alpharetta, Roswell, Milton, Johns Creek, Sandy Springs)',
  'Northeast Corridor (Gwinnett, Forsyth & Hall: Suwanee, Buford, Cumming, Lawrenceville, Duluth, Gainesville)',
  'Intown Atlanta & BeltLine Corridor (Buckhead, Midtown, Virginia-Highland, Inman Park, Grant Park, Brookhaven)',
  'East Metro Corridor (DeKalb, Rockdale & Newton: Decatur, Tucker, Stone Mountain, Lithonia, Conyers, Covington)',
  'South Metro Corridor (Henry, Fayette & Coweta: McDonough, Stockbridge, Peachtree City, Fayetteville, Newnan)',
  'West Metro Corridor (Douglas, Carroll & South Cobb: Douglasville, Villa Rica, Powder Springs, Austell, Mableton)'
];

export const DIVERSE_FALLBACK_TEMPLATES = [
  {
    slug: 'marietta-smyrna-woodstock-engineered-i-joist-crawlspace-subfloor-inspection',
    title: 'Engineered I-Joist Floor Framing & Crawlspace Moisture in Marietta, Smyrna & Woodstock Homes',
    description: 'Inspecting OSB web engineered wood I-joists, rim-board ventilation, and plumbing subfloor penetrations across Cobb and Cherokee county homes.',
    category: 'Structural Framing & Crawlspace Diagnostics',
    keywords: ['Marietta home inspection', 'Smyrna home inspection', 'Woodstock home inspection', 'engineered I-joist inspection Georgia'],
    content: `<p>Buyers evaluating 1990s-to-2026 homes in <a href="/service-areas/marietta">Marietta</a>, <a href="/service-areas/smyrna">Smyrna</a>, and <a href="/service-areas/woodstock">Woodstock</a> frequently encounter engineered wood I-joists supporting main-level hardwood and tile floors across Cobb and Cherokee counties. While engineered I-joists resist warping across long spans, unapproved plumber web knockouts and elevated crawlspace humidity can reduce flange capacity rapidly. Every Single-Family Inspection (From $345) performed by our 2-Inspector team includes crawlspace structural checks and calibrated infrared thermal scans, backed by $35,000 in combined protection ($10,000 Elite Master Inspection Warranty plus $25,000 InterNACHI Honor Guarantee).</p>
<h2>OSB Web Cutouts, Flange Notches &amp; Bearing Stiffeners</h2>
<p>Unlike solid 2x10 dimensional lumber, an engineered I-joist relies on continuous top and bottom tension/compression flanges bonded to an oriented strand board (OSB) vertical web. Cutting or notching the top or bottom flange, or boring oversized drain holes outside manufacturer pre-stamped knockout zones without steel web stiffeners, disrupts shear transfer across the floor span.</p>
<p><strong>What this could mean:</strong> Improperly cut I-joist webs or notched flanges can cause floor bounce, cracked kitchen floor tile, or localized structural sagging beneath heavy islands and bathrooms. Have a licensed structural framing contractor evaluate further and repair as needed.</p>
<h2>Crawlspace Humidity &amp; OSB Resin Swelling</h2>
<p>When crawlspace relative humidity stays above 70 percent in Cobb and Cherokee homes, OSB joist webs absorb moisture faster than solid sawn pine. Our 2-Inspector team checks wood moisture levels, vapor barriers, and <a href="/repair-credit-calculator">Repair Credit Calculator</a> items, while clients of partner agents save -$25 via our <a href="/realtors">Realtor Partner Hub</a> and arrange move-in services at <a href="/free-utility-setup">Free Utility Setup</a>. Book online at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Can a plumber cut through the top or bottom flange of an engineered wood I-joist?</h3>
<p>No. Manufacturer structural specifications prohibit cutting, notching, or drilling the top or bottom flanges of an engineered wood I-joist; holes may only be placed in the OSB web following strict diameter and spacing charts.</p>
<h3>How do inspectors check I-joists under finished ceilings?</h3>
<p>We inspect exposed joists inside crawlspaces and unfinished basements, and use calibrated infrared thermal cameras and laser levels on finished ceilings to spot deflection or hidden plumbing moisture.</p>
<h3>What happens if a toilet wax ring leaks onto an OSB subfloor and I-joist flange?</h3>
<p>Chronic moisture causes OSB strands to swell and delaminate; a licensed framing contractor and plumber should repair the leak and sister or reinforce damaged framing per manufacturer engineering guidelines.</p>`
  },
  {
    slug: 'kennesaw-acworth-canton-radon-granite-bedrock-basement-inspection-guide',
    title: 'Granite Bedrock & Sub-Slab Soil Gases: Radon & Basement Checks in Kennesaw, Acworth & Canton',
    description: 'How fractured Piedmont granite geology affects below-grade basements, sump pits, and indoor radon pathways across Kennesaw, Acworth, and Canton homes.',
    category: 'Environmental & Basement Diagnostics',
    keywords: ['Kennesaw home inspection', 'Acworth home inspection', 'Canton home inspection', 'North Georgia granite radon'],
    content: `<p>Homebuyers purchasing basement properties in <a href="/service-areas/kennesaw">Kennesaw</a>, <a href="/service-areas/acworth">Acworth</a>, and <a href="/service-areas/canton">Canton</a> sit directly above the fractured granitic and gneissic bedrock formations of the Northwest Georgia Piedmont. Natural decay of trace uranium within granite rock releases colorless, odorless radon gas that migrates upward through foundation expansion joints and unsealed sump basins. Every Single-Family Inspection (From $345) by our 2-Inspector team checks sub-grade foundation sealing, and continuous electronic Radon Testing is available—Call (678) 480-2110 for Quote.</p>
<h2>Stack Effect Pressure Differentials in Basement Homes</h2>
<p>Warm air rising to upper bedrooms creates slight negative pressure in the basement, drawing soil gases through slab perimeter gaps, plumbing blockouts, and open sump pits. Sealing the sump lid and testing indoor air during your due diligence window provides clear empirical documentation.</p>
<p><strong>What this could mean:</strong> Unsealed basement slab penetrations and open sump basins allow soil gas and moisture vapor to enter indoor living areas. Have a licensed radon mitigation specialist or waterproofing contractor evaluate further and repair as needed.</p>
<h2>Coordinating Northwest Corridor Due Diligence</h2>
<p>Pair your inspection with our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, access agent tools and a -$25 client discount via our <a href="/realtors">Realtor Partner Hub</a>, and simplify closing move-in logistics with <a href="/free-utility-setup">Free Utility Setup</a>. Schedule at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>At what radon level does the EPA recommend mitigation in Georgia homes?</h3>
<p>The U.S. Environmental Protection Agency recommends installing an active sub-slab depressurization system when indoor radon measurements reach or exceed 4.0 picocuries per liter (pCi/L).</p>
<h3>Can a home built on a concrete slab without a basement still have elevated radon?</h3>
<p>Yes. Any foundation in contact with North Georgia granite-derived soil—whether basement, slab-on-grade, or crawlspace—can experience soil-gas entry.</p>
<h3>How long does a continuous radon test take during a real estate transaction?</h3>
<p>Continuous electronic radon monitors record hourly concentrations over a minimum 48-hour closed-building test period—Call (678) 480-2110 for Quote.</p>`
  },
  {
    slug: 'buckhead-sandy-springs-brookhaven-flat-roof-parapet-scupper-inspection',
    title: 'Low-Slope Roofs, Parapet Walls & Scuppers in Buckhead, Sandy Springs & Brookhaven Homes',
    description: 'Inspecting TPO membranes, parapet cap flashing, through-wall scuppers, and roof decks on contemporary homes and townhomes across North Atlanta.',
    category: 'Roofing & Exterior Envelope Diagnostics',
    keywords: ['Buckhead home inspection', 'Sandy Springs home inspection', 'Brookhaven home inspection', 'flat roof parapet inspection Atlanta'],
    content: `<p>Contemporary custom residences and rooftop-terrace townhomes in <a href="/service-areas/atlanta">Atlanta</a> (Buckhead), <a href="/service-areas/sandy-springs">Sandy Springs</a>, and <a href="/service-areas/brookhaven">Brookhaven</a> increasingly feature low-slope TPO or modified-bitumen roof membranes enclosed by stucco or masonry parapet walls. Unlike steep-slope shingle roofs that shed rainwater by gravity, low-slope roofs rely on positive tapered insulation, unobstructed through-wall scuppers, and watertight metal coping caps. Our 2-Inspector team inspects accessible low-slope roof assemblies on Condo &amp; Townhome Inspections (From $295) and Single-Family Inspections (From $345) using 4K aerial drones and calibrated infrared thermal cameras.</p>
<h2>Ponding Water, Scupper Blockages &amp; Parapet Coping Joints</h2>
<p>When leaves block primary scupper boxes or overflow drains sit too high, stormwater ponds on the membrane for more than 48 hours. Unsealed sheet-metal coping joints along the top of parapet walls also allow rainwater to enter the hollow parapet chase and leak behind top-floor ceilings.</p>
<p><strong>What this could mean:</strong> Blocked scuppers and open parapet coping seams cause membrane blistering, hidden roof-deck decay, and ceiling moisture intrusion in upper living spaces. Have a licensed low-slope roofing contractor evaluate further and repair as needed.</p>
<h2>Thermal Moisture Scanning &amp; Buyer Resources</h2>
<p>We map trapped roof moisture with calibrated infrared thermal imaging, provide local repair estimates through our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, offer a -$25 discount to clients of partner agents via our <a href="/realtors">Realtor Partner Hub</a>, and include <a href="/free-utility-setup">Free Utility Setup</a>. Book at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Why do flat roofs need an emergency overflow scupper next to the main drain?</h3>
<p>If debris clogs the primary roof drain during a heavy downpour, the secondary overflow scupper prevents water weight from overloading the structural roof joists.</p>
<h3>How does thermal imaging detect leaks under a white TPO roof membrane?</h3>
<p>Wet insulation beneath a roof membrane retains daytime solar heat longer than dry insulation, creating a distinct thermal signature during infrared inspection scans.</p>
<h3>Should parapet wall metal coping caps be fastened through the top horizontal surface?</h3>
<p>No. Exposed fasteners driven through the top horizontal face of parapet coping eventually leak as rubber washers weather; coping should clip onto continuous cleats with cleats fastened on the vertical sides.</p>`
  },
  {
    slug: 'johns-creek-duluth-lawrenceville-cast-iron-pvc-drain-stack-sewer-inspection',
    title: 'Aging Drain Stacks, Cleanouts & Root Intrusion in Johns Creek, Duluth & Lawrenceville Homes',
    description: 'Evaluating DWV plumbing stacks, thermal expansion tanks, and mature tree-root lateral drain risks across Gwinnett and North Fulton neighborhoods.',
    category: 'Plumbing & Underground Drain Diagnostics',
    keywords: ['Johns Creek home inspection', 'Duluth home inspection', 'Lawrenceville home inspection', 'plumbing drain inspection Gwinnett'],
    content: `<p>Established swim-tennis communities in <a href="/service-areas/johns-creek">Johns Creek</a>, <a href="/service-areas/duluth">Duluth</a>, and <a href="/service-areas/lawrenceville">Lawrenceville</a> feature mature oak, maple, and pine canopies planted thirty to forty years ago directly above underground water service and building sewer lines. During every Single-Family Inspection (From $345), our 2-Inspector team tests interior drain-waste-vent (DWV) flow under simultaneous fixture loads, scans beneath tiled bathrooms with calibrated infrared thermal cameras, and offers high-definition Sewer Scope camera inspections—Call (678) 480-2110 for Quote.</p>
<h2>Simultaneous Flow Stress Testing &amp; Hidden Drain Leaks</h2>
<p>A brief faucet turn-on rarely reveals a partially obstructed main drain or a weeping shower pan trap. Running bathtubs, showers, and lavatories concurrently while scanning ceilings below with calibrated infrared cameras exposes slow-draining traps and concealed waste-line seepage.</p>
<p><strong>What this could mean:</strong> Offset underground pipe joints, tree-root intrusion, or leaking shower drain traps can cause backup flooding in lower-level bathrooms and subfloor rot. Have a licensed plumbing contractor evaluate further and repair as needed.</p>
<h2>Negotiating Plumbing Repairs with Confidence</h2>
<p>Use our <a href="/repair-credit-calculator">Repair Credit Calculator</a> to estimate plumbing repairs, claim a -$25 partner client discount via our <a href="/realtors">Realtor Partner Hub</a>, and connect utilities with <a href="/free-utility-setup">Free Utility Setup</a>. Get your instant quote at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Why can a house pass an interior plumbing drain check and still have tree roots in the yard sewer line?</h3>
<p>A 4-inch main sewer line can hold dozens of gallons of water before backing up inside the house if a root mass sits 60 feet out near the street curb; a lateral Sewer Scope camera inspection visually checks the entire pipe to the tap—Call (678) 480-2110 for Quote.</p>
<h3>Where is the main sewer cleanout typically located in Gwinnett and North Fulton homes?</h3>
<p>Most homes built after 1980 have a 3-inch or 4-inch threaded PVC cap in the front flowerbed near the foundation wall or in the basement along the front foundation wall.</p>
<h3>What causes gurgling sounds in a downstairs toilet when an upstairs shower drains?</h3>
<p>Gurgling indicates either a blocked roof plumbing vent stack or a partial downstream blockage in the main building drain that traps air inside the pipe.</p>`
  },
  {
    slug: 'stone-mountain-lithonia-covington-septic-well-crawlspace-electrical-inspection',
    title: 'Acreage & Suburban Homes in Stone Mountain, Lithonia & Covington: Subpanels & Crawlspace Checks',
    description: 'Inspecting detached garage electrical subpanels, bonding jumpers, and crawlspace moisture barriers across DeKalb, Rockdale, and Newton counties.',
    category: 'Electrical & Structural Diagnostics',
    keywords: ['Stone Mountain home inspection', 'Lithonia home inspection', 'Covington home inspection', 'detached subpanel wiring Georgia'],
    content: `<p>Wooded suburban and semi-rural properties across <a href="/service-areas/stone-mountain">Stone Mountain</a>, <a href="/service-areas/lithonia">Lithonia</a>, and <a href="/service-areas/covington">Covington</a> frequently include workshops, basement accessory suites, and detached garages served by secondary electrical subpanels. During every Single-Family Inspection (From $345), our 2-Inspector team removes accessible panel dead-fronts to inspect neutral-to-ground isolation, feeder lug sizing, and crawlspace structural framing, backed by $35,000 in combined protection ($10,000 Elite Master Inspection Warranty plus $25,000 InterNACHI Honor Guarantee).</p>
<h2>Improper Neutral-Ground Bonding in Secondary Electrical Subpanels</h2>
<p>In the main service disconnect panel, neutral conductors and equipment grounding conductors bond together to the grounding electrode system. In any downstream subpanel, however, neutrals must land on an isolated floating neutral bar while grounds land on a separate chassis-bonded ground bar so normal return current cannot energize metal enclosures.</p>
<p><strong>What this could mean:</strong> Bonded neutrals and grounds inside a secondary subpanel place objectionable return current onto metal appliance frames and grounding paths, creating shock and arcing hazards. Have a licensed electrical contractor evaluate further and repair as needed.</p>
<h2>East Corridor Buyer &amp; Agent Resources</h2>
<p>Calculate electrical repair estimates on our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, access a -$25 client discount through our <a href="/realtors">Realtor Partner Hub</a>, and activate utilities at <a href="/free-utility-setup">Free Utility Setup</a>. Book online at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Why must neutral and ground wires be separated in a subpanel if they are connected in the main panel?</h3>
<p>Keeping neutral and ground isolated downstream ensures normal 120-volt return current travels only on the insulated neutral conductor rather than energizing metal conduit, panel boxes, and ground paths.</p>
<h3>Do detached workshops in Covington or Lithonia need their own grounding rods?</h3>
<p>Yes. Detached buildings supplied by a four-wire feeder from the main house also require a local grounding electrode system (such as ground rods) at the outbuilding.</p>
<h3>Can double-tapped circuit breakers in an electrical panel be repaired without replacing the whole panel?</h3>
<p>Usually yes; a licensed electrician can install approved pigtail splices or add a dedicated circuit breaker in an open panel slot so each terminal holds a single conductor.</p>`
  },
  {
    slug: 'fayetteville-stockbridge-hampton-post-tension-slab-attic-truss-inspection',
    title: 'Engineered Roof Trusses & Post-Tension Slabs in Fayetteville, Stockbridge & Hampton Homes',
    description: 'Inspecting metal-plate-connected wood roof trusses, attic pull-down stairs, and slab perimeters in Fayette, Henry, and Clayton county homes.',
    category: 'Roof Framing & Structural Diagnostics',
    keywords: ['Fayetteville home inspection', 'Stockbridge home inspection', 'Hampton home inspection', 'engineered roof truss inspection Georgia'],
    content: `<p>Production and custom homes across <a href="/service-areas/fayetteville">Fayetteville</a>, <a href="/service-areas/stockbridge">Stockbridge</a>, and <a href="/service-areas/hampton">Hampton</a> rely on prefabricated metal-plate-connected wood roof trusses engineered to span wide open-concept floor plans across Fayette and Henry counties. When homeowners or mechanical installers cut truss webs to fit attic storage flooring or oversized air handlers, structural load paths are compromised. Every Single-Family Inspection (From $345), Pre-Drywall Inspection (From $275), and 11-Month Warranty Inspection (From $345) by our 2-Inspector team inspects every accessible attic truss bay.</p>
<h2>Altered Roof Truss Webs, Dislodged Gusset Plates &amp; Attic Stairs</h2>
<p>Each wood member and galvanized tooth connector plate in an engineered roof truss forms part of a triangulated web. Cutting a single diagonal web member to make room for a pull-down attic ladder or furnace plenum invalidates the truss engineering stamp unless a site-specific repair detail from a licensed structural engineer is installed.</p>
<p><strong>What this could mean:</strong> Cut truss chords, Field-notched rafters, or backing-out metal gusset plates can cause roof ridge deflection, interior ceiling drywall cracks, and reduced wind and roof-load capacity. Have a licensed structural engineer or framing contractor evaluate further and repair as needed.</p>
<h2>South Corridor Inspection Tools</h2>
<p>Estimate framing and roof repairs with our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, save -$25 as the client of a partner agent via our <a href="/realtors">Realtor Partner Hub</a>, and book utilities with <a href="/free-utility-setup">Free Utility Setup</a>. Get your instant quote at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Can a carpenter sister a 2x4 next to a cut engineered roof truss web without an engineer?</h3>
<p>Building codes require that any field modification or repair to a manufactured wood truss follow a written repair drawing sealed by a registered professional engineer or the truss manufacturer.</p>
<h3>What is truss uplift and why does it cause cracks where upstairs ceilings meet interior walls?</h3>
<p>During winter, the bottom truss chord buried in warm attic insulation dries and shrinks while top chords exposed to cold roof air expand slightly, causing the bottom chord to bow upward if interior partition tops are nailed rigidly.</p>
<h3>How should attic pull-down stairs be fastened into ceiling framing?</h3>
<p>Attic stair frames must be installed parallel to joists or inside a properly headed-out framing opening using structural lag screws or framing nails specified by the stair manufacturer—never dry-wall screws.</p>`
  },
  {
    slug: 'powder-springs-austell-smyrna-crawlspace-vapor-barrier-beam-pier-inspection',
    title: 'Masonry Piers, Girder Beams & Vapor Barriers in Powder Springs, Austell & Smyrna Homes',
    description: 'Inspecting dry-stacked and mortared crawlspace piers, wood-to-earth contact, and subfloor moisture across Cobb County homes.',
    category: 'Foundation & Crawlspace Diagnostics',
    keywords: ['Powder Springs home inspection', 'Austell home inspection', 'Smyrna home inspection', 'crawlspace pier girder inspection'],
    content: `<p>Ranch and two-story homes across <a href="/service-areas/powder-springs">Powder Springs</a>, <a href="/service-areas/austell">Austell</a>, and <a href="/service-areas/smyrna">Smyrna</a> built over raised crawlspaces rely on interior masonry block piers and main wood or steel girder beams to carry interior floor loads to the earth. Over decades of red-clay moisture variation, un-mortared hardwood shims compress and ground vapor saturates exposed floor framing. Every Single-Family Inspection (From $345) performed by our 2-Inspector team includes full crawlspace entry and calibrated infrared thermal scanning, backed by $35,000 in combined protection ($10,000 Elite Master Inspection Warranty plus $25,000 InterNACHI Honor Guarantee).</p>
<h2>Crushed Wood Shims, Leaning Block Piers &amp; Girder Bearing</h2>
<p>Main girders require at least three to four inches of full bearing atop masonry piers, with solid cap blocks and steel shims where minor leveling is needed. When soft pine wedges or stacked composite scraps are wedged between a block pier and a heavily loaded girder, high humidity causes the shims to crush, creating sloping hallways and sticking bedroom doors above.</p>
<p><strong>What this could mean:</strong> Leaning crawlspace piers, crushed wood shims, or inadequate girder bearing can lead to progressive floor sagging, cracked drywall over door headers, and compromised structural support. Have a licensed structural engineer or foundation contractor evaluate further and repair as needed.</p>
<h2>Cobb Corridor Due Diligence Resources</h2>
<p>Review local repair allowances with our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, unlock a -$25 discount for clients of partner agents via our <a href="/realtors">Realtor Partner Hub</a>, and arrange home utilities with <a href="/free-utility-setup">Free Utility Setup</a>. Book at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Are wooden shims allowed on top of crawlspace masonry piers?</h3>
<p>Thin cedar or pine wedges frequently compress and rot under heavy point loads in damp crawlspaces; steel shims or solid masonry grouting provide permanent structural bearing.</p>
<h3>Why is a polyethylene vapor barrier needed over bare crawlspace dirt?</h3>
<p>Bare earth releases gallons of water vapor daily into the crawlspace air; a continuous 6-mil or thicker polyethylene ground cover blocks soil evaporation from wetting the wood floor joists above.</p>
<h3>Can a Termite Inspection be added to a crawlspace home inspection?</h3>
<p>Yes, Termite Inspection, Radon Testing, Mold Testing, and Sewer Scope services can be scheduled alongside your home inspection—Call (678) 480-2110 for Quote.</p>`
  },
  {
    slug: 'gainesville-flowery-branch-buford-lake-lanier-dock-retaining-wall-deck-inspection',
    title: 'Lake Lanier Shoreline Homes in Gainesville, Flowery Branch & Buford: Decks & Slope Drainage',
    description: 'Inspecting multi-level lakeside decks, hillside drainage, and walkout terrace foundations in Gainesville, Flowery Branch, and Buford.',
    category: 'Decks, Structural & Hillside Diagnostics',
    keywords: ['Gainesville home inspection', 'Flowery Branch home inspection', 'Buford home inspection', 'Lake Lanier home inspection'],
    content: `<p>Steep wooded lots overlooking Lake Lanier in <a href="/service-areas/gainesville">Gainesville</a>, <a href="/service-areas/flowery-branch">Flowery Branch</a>, and <a href="/service-areas/buford">Buford</a> frequently feature elevated multi-tier rear decks, tall support posts, and walkout basement foundations anchored into sloped Hall and Gwinnett county terrain. Because lakeside decks sit twelve to twenty-five feet above grade, ledger attachment and post-to-footing hardware are critical life-safety priorities. Every Single-Family Inspection (From $345) by our 2-Inspector team examines deck framing, ledger flashing, and slope drainage.</p>
<h2>Elevated Deck Support Posts, Lateral Bracing &amp; Ledger Bolting</h2>
<p>Elevated decks require 6x6 pressure-treated posts anchored to poured concrete piers with galvanized standoff brackets that keep end-grain wood out of wet dirt, along with structural lag bolts or through-bolts securing the ledger board to the house rim joist.</p>
<p><strong>What this could mean:</strong> Rotting deck posts buried in soil, missing ledger flashing, or nail-only ledger attachments create a risk of sudden structural deck separation under occupant loads. Have a licensed deck or structural framing contractor evaluate further and repair as needed.</p>
<h2>Northeast Corridor Buyer Tools</h2>
<p>Estimate deck and structural repairs with our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, save -$25 as a partner agent client via our <a href="/realtors">Realtor Partner Hub</a>, and set up utilities at <a href="/free-utility-setup">Free Utility Setup</a>. Schedule at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Why is 4x4 lumber inadequate for tall lakeside deck support posts?</h3>
<p>Modern residential building guidelines call for minimum 6x6 nominal posts when deck height exceeds modest elevation limits because 4x4 posts are prone to warping and lateral buckling.</p>
<h3>What prevents rainwater from rotting the house rim joist behind a deck ledger board?</h3>
<p>Continuous metal Z-flashing or self-adhering membrane tucked under the house siding and draped over the top of the ledger board prevents water from getting trapped against the wood band joist.</p>
<h3>Should deck guardrails resist outward push force?</h3>
<p>Yes; guards on elevated decks must be bolted or blocked into the outer rim framing to withstand concentrated outward loads without flexing and must keep baluster spacing under four inches.</p>`
  },
  {
    slug: 'midtown-old-fourth-ward-chamblee-condo-high-rise-water-source-heat-pump-inspection',
    title: 'High-Rise Condos & Lofts in Midtown, Old Fourth Ward & Chamblee: HVAC & Plumbing Checks',
    description: 'Inspecting water-source heat pumps, fan-coil condensate pans, balcony waterproofing, and electrical panels in Intown Atlanta and Chamblee condos.',
    category: 'Condo, Loft & Mechanical Diagnostics',
    keywords: ['Midtown condo inspection', 'Chamblee home inspection', 'Atlanta condo inspection', 'water source heat pump inspection'],
    content: `<p>Buyers purchasing high-rise condominiums and adaptive-reuse lofts in <a href="/service-areas/atlanta">Atlanta</a> (Midtown and Old Fourth Ward), <a href="/service-areas/chamblee">Chamblee</a>, and <a href="/service-areas/doraville">Doraville</a> rely on building-wide chilled-water or condenser-water loops paired with in-unit water-source heat pumps and compact utility closets. Even when a condo HOA covers exterior walls, you are financially responsible for everything inside your unit boundaries—and a single overflowing condensate pan or braided supply hose burst can damage three units below you. Our Condo &amp; Townhome Inspection (From $295) deploys a 2-Inspector team with calibrated infrared thermal cameras and moisture meters, backed by $35,000 in combined protection.</p>
<h2>Water-Source Heat Pumps, Flexible Water Hoses &amp; Condensate Float Switches</h2>
<p>High-rise condo heat pumps connect to pressurized building water risers via braided stainless-steel or rubber flex hoses. Over ten to fifteen years, internal rubber liners embrittle, and primary condensate drain traps clog with bio-slime inside tight hallway utility closets.</p>
<p><strong>What this could mean:</strong> Degraded condenser-water hoses, missing condensate overflow float switches, or failed temperature differentials can cause sudden unit flooding or complete cooling loss. Have a licensed commercial/high-rise HVAC contractor evaluate further and repair as needed.</p>
<h2>Intown Condo Buyer Resources</h2>
<p>Calculate in-unit repair allowances on our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, claim a -$25 partner agent client discount via our <a href="/realtors">Realtor Partner Hub</a>, and connect fiber internet and electric at <a href="/free-utility-setup">Free Utility Setup</a>. Book your Condo Inspection (From $295) at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>Why do I need a Condo Inspection if the HOA maintains the roof and exterior?</h3>
<p>Your unit's HVAC heat pump, water heater, electrical subpanel, kitchen appliances, plumbing fixtures, shower pan waterproofing, and balcony doors are your direct financial responsibility after closing.</p>
<h3>How do inspectors check for shower pan leaks in a multi-story condo without seeing the ceiling below?</h3>
<p>We flood-test the shower receptor while scanning the surrounding bathroom floor, threshold, and adjacent bedroom/closet baseboards using calibrated infrared thermal imaging and pinless moisture meters.</p>
<h3>What is the typical service life of a high-rise condo water-source heat pump?</h3>
<p>Most residential water-source heat pump units have a design service life of 12 to 18 years depending on building water loop chemistry and filter maintenance.</p>`
  },
  {
    slug: 'peachtree-corners-norcross-dunwoody-1970s-contemporary-cedar-siding-chimney-inspection',
    title: '1970s-1980s Homes in Dunwoody, Peachtree Corners & Norcross: Chimneys, Siding & Electrical',
    description: 'Inspecting wood chimney chases, cedar and masonite siding, skylight flashing, and electrical panels in Dunwoody, Peachtree Corners, and Norcross.',
    category: 'Exterior, Chimney & Electrical Diagnostics',
    keywords: ['Dunwoody home inspection', 'Peachtree Corners home inspection', 'Norcross home inspection', 'chimney chase cover inspection Atlanta'],
    content: `<p>Wooded contemporary and traditional two-story homes built during the 1970s and 1980s across <a href="/service-areas/dunwoody">Dunwoody</a>, <a href="/service-areas/peachtree-corners">Peachtree Corners</a>, and <a href="/service-areas/norcross">Norcross</a> are prized for large lots and mature shade trees, yet they share distinct architectural vulnerabilities—including rusted galvanized chimney chase covers, aging cedar or composite hardboard siding, leaking curb-mounted skylights, and crowded electrical panels. Every Single-Family Inspection (From $345) by our 2-Inspector team includes 4K aerial drone roof/chimney imaging and calibrated infrared thermal scans.</p>
<h2>Rusted Prefabricated Chimney Chase Covers &amp; Rotten Wood Framing</h2>
<p>Unlike solid brick masonry chimneys with poured concrete crowns, wood-framed chimney chases housing factory-built fireplaces are topped with a sheet-metal chase cover pan. Original unpainted galvanized steel pans flat-topped without cross-break drainage slopes rust through after twenty years, funneling rainwater directly down the inside of the wood chimney chase.</p>
<p><strong>What this could mean:</strong> A rusted or ponding chimney chase cover saturates the wood framing around the fireplace box, leading to decayed exterior chimney siding, rusted firebox dampers, and hidden mold inside the chase. Have a licensed chimney specialist or roofing contractor evaluate further and repair as needed.</p>
<h2>North DeKalb &amp; West Gwinnett Buyer Tools</h2>
<p>Price out chimney and electrical repairs with our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, save -$25 as a client of a partner agent via our <a href="/realtors">Realtor Partner Hub</a>, and transfer utilities with <a href="/free-utility-setup">Free Utility Setup</a>. Get an instant quote at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>How do inspectors check the top of a tall two-story chimney chase in Dunwoody?</h3>
<p>When roof pitch or height makes ladder access unsafe, our 2-Inspector team deploys a high-resolution 4K camera drone to inspect the chimney chase pan, spark arrestor, storm collar, and roof flashing closely.</p>
<h3>Why do galvanized steel chimney chase covers fail so frequently?</h3>
<p>Flat galvanized metal holds standing puddles of acidic rainwater and leaf tannins that corrode the zinc coating; replacement pans fabricated from stainless steel or copper with diagonal cross-breaks shed water permanently.</p>
<h3>Should a wood-burning fireplace converted to gas logs have a damper clamp?</h3>
<p>Yes; vented gas logs require a permanent damper stop clamp that prevents the flue damper from being closed completely while gas burners are operating.</p>`
  },
  {
    slug: 'snellville-loganville-monroe-crawlspace-slab-plumbing-polybutylene-pex-inspection',
    title: 'Plumbing Supply Lines & Roof Flashing in Snellville, Loganville & Monroe Homes',
    description: 'Identifying 1980s-1990s gray polybutylene water lines, pressure-reducing valves, and roof valley flashing across Gwinnett and Walton counties.',
    category: 'Plumbing & Roofing Diagnostics',
    keywords: ['Snellville home inspection', 'Loganville home inspection', 'Monroe home inspection', 'polybutylene pipe inspection Gwinnett Walton'],
    content: `<p>Homebuyers touring properties along the US-78 corridor in <a href="/service-areas/snellville">Snellville</a>, <a href="/service-areas/loganville">Loganville</a>, and <a href="/service-areas/monroe">Monroe</a> encounter a broad range of 1980s-to-2026 homes across East Gwinnett and Walton counties. Two high-impact systems we check on every Single-Family Inspection (From $345) are main water service pressure-reducing valves (PRVs) and legacy gray polybutylene water supply piping installed between 1978 and 1995, backed by $35,000 in combined protection ($10,000 Elite Master Inspection Warranty plus $25,000 InterNACHI Honor Guarantee).</p>
<h2>High Municipal Water Pressure, Failed PRVs &amp; Supply Piping Stress</h2>
<p>Municipal water main pressure along undulating Gwinnett and Walton county terrain frequently exceeds 90 to 110 PSI in the street. Inside the home, a brass pressure-reducing valve (PRV) near the main shutoff should regulate domestic water pressure between 40 and 80 PSI. When the internal rubber diaphragm inside an older PRV fails, street pressure surges above 80 PSI, straining toilet fill valves, washing machine hoses, water heater tanks, and plastic pipe fittings.</p>
<p><strong>What this could mean:</strong> Water pressure exceeding 80 PSI or unreplaced gray polybutylene supply piping increases the likelihood of sudden fitting ruptures, running toilets, and weeping water heater relief valves. Have a licensed master plumber evaluate further and repair as needed.</p>
<h2>US-78 Corridor Inspection &amp; Closing Tools</h2>
<p>Estimate plumbing repipe or PRV costs with our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, save -$25 through our <a href="/realtors">Realtor Partner Hub</a> when working with a partner agent, and set up utilities at <a href="/free-utility-setup">Free Utility Setup</a>. Book online at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>What is the safe residential water pressure range in Georgia homes?</h3>
<p>Residential plumbing codes specify static water pressure between 40 PSI and 80 PSI; whenever pressure exceeds 80 PSI, a functioning pressure-reducing valve (PRV) is required.</p>
<h3>Where does polybutylene pipe sometimes remain even after a house has been repiped inside?</h3>
<p>Sometimes homeowners repipe the interior walls with PEX or copper but leave the original buried blue or gray polybutylene main water service line running from the street water meter to the foundation wall.</p>
<h3>How can I check if my home's thermal expansion tank on the water heater is waterlogged?</h3>
<p>A healthy thermal expansion tank sounds hollow on the air-bladder half when tapped and matches the house water pressure at its Schrader air valve; a waterlogged tank feels heavy, sounds dull, and drips water from the air valve.</p>`
  },
  {
    slug: 'carrollton-fairburn-union-city-new-construction-11-month-warranty-inspection-guide',
    title: 'New Builds & 11-Month Warranty Checks in Carrollton, Fairburn & Union City Homes',
    description: 'Catching attic insulation gaps, grading washouts, and GFCI/AFCI electrical defects before your 1-year builder warranty expires in West and South Fulton.',
    category: 'New Construction & Builder Warranty Diagnostics',
    keywords: ['Carrollton home inspection', 'Fairburn home inspection', 'Union City home inspection', '11 month warranty inspection Georgia'],
    content: `<p>Homeowners and buyers in fast-growing <a href="/service-areas/carrollton">Carrollton</a>, <a href="/service-areas/fairburn">Fairburn</a>, and <a href="/service-areas/union-city">Union City</a> subdivisions often assume a newly built house has zero mechanical or structural flaws because it passed county code checks. Yet municipal code officials spend only minutes per trade phase, and houses experience their most pronounced soil settlement, lumber shrinkage, and seasonal HVAC load cycles during the first eleven months of occupancy. Foresight provides Pre-Drywall Inspections (From $275), New Construction Inspections (From $400), and 11-Month Warranty Inspections (From $345) with a 2-Inspector team and calibrated infrared thermal cameras.</p>
<h2>Displaced Blown-In Attic Insulation, Truss Settlement &amp; Grading Washouts</h2>
<p>After closing on a new home in South Fulton or Carroll County, the first four seasons reveal low spots in backyard clay backfill where rain gutters discharge, nail pops and drywall tape separations along upstairs truss ceilings, and large uninsulated ceiling voids where contractors stepped through blown fiberglass insulation without raking it back to R-38 depth.</p>
<p><strong>What this could mean:</strong> Missing attic insulation voids, settled backfill trenches, and unsealed roof flashing discovered after the 12-month builder warranty expires become out-of-pocket homeowner expenses unless documented before month twelve. Have a licensed general contractor or builder warranty team evaluate further and repair as needed.</p>
<h2>Organizing Your Builder Warranty Claim List</h2>
<p>Generate a clean item-by-item warranty repair list, check contractor repair benchmarks on our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, save -$25 as a partner agent client via our <a href="/realtors">Realtor Partner Hub</a>, and manage home services with <a href="/free-utility-setup">Free Utility Setup</a>. Schedule at <a href="/quote">fhinspectionsatl.com/quote</a> or call (678) 480-2110.</p>
<h2>Frequently Asked Questions</h2>
<h3>When is the best month to schedule an 11-Month Builder Warranty Inspection?</h3>
<p>Schedule during month 10 or early in month 11 after your closing date so you have plenty of time to submit the documented inspection report to your builder's warranty portal before the 365-day deadline expires.</p>
<h3>Does an 11-Month Warranty Inspection include thermal imaging and drone roof checks?</h3>
<p>Yes; every 11-Month Warranty Inspection (From $345) includes calibrated infrared thermal scanning of ceilings, walls, and HVAC registers plus 4K aerial drone roof imagery where needed.</p>
<h3>Can a buyer also order a Sewer Scope on a brand-new construction home?</h3>
<p>Yes; construction trucks and backfill equipment frequently crush or offset newly laid PVC sewer laterals in the front yard—Call (678) 480-2110 for Quote on a Sewer Scope.</p>`
  }
];

const SANITIZE_REPLACEMENTS = [
  { pattern: /\*/g, replacement: '' },
  { pattern: /\/concierge/gi, replacement: '/free-utility-setup' },
  { pattern: /\bwhat this means\b/gi, replacement: 'What this could mean' },
  { pattern: /\bGAR Form F404\b|\bGAR F404\b|\bForm F404\b|\bF404\b/gi, replacement: 'Georgia Repair Amendment' },
  { pattern: /\bF201\b/gi, replacement: 'Purchase Agreement' },
  { pattern: /\bRSMeans\b/gi, replacement: 'regional contractor cost data' },
  { pattern: /\bHomeGauge\s*CRL(?:™)?\b|\bCRL(?:™)?\b|\bHomeGauge\b/gi, replacement: 'Digital Repair Request List Builder' },
  { pattern: /\bFLIR\b/gi, replacement: 'calibrated infrared' },
  { pattern: /\b(?:cut(?:s|ting)?\s+(?:inspection\s+)?time\s+in\s+half|half\s+the\s+time)\b/gi, replacement: 'dedicated parallel coverage' },
  { pattern: /\baudit(?:s|ed|ing)?\b/gi, replacement: 'evaluation' },
  { pattern: /\b(?:delve|tapestry|game-changer|pivotal|testament|seamlessly|seamless|beacon|leverage|unpack)\b/gi, replacement: 'essential' },
  { pattern: /\bin today's fast-paced world\b/gi, replacement: 'Across Metro Atlanta' },
  { pattern: /\bmajor advantage\b/gi, replacement: 'key benefit' },
  { pattern: /\bstandard\b/gi, replacement: 'typical' },
  { pattern: /\bimportant\b/gi, replacement: 'critical' },
  { pattern: /\bproof\b/gi, replacement: 'evidence' },
  { pattern: /\bdig\b/gi, replacement: 'examine' },
  { pattern: /\bmix\b/gi, replacement: 'combination' }
];

export function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  let out = str;
  for (const rule of SANITIZE_REPLACEMENTS) {
    out = out.replace(rule.pattern, rule.replacement);
  }
  return out.trim();
}

export function sanitizeAndValidatePost(rawPost, existingSlugs = new Set()) {
  const title = sanitizeText(rawPost.title);
  const slug = sanitizeText(rawPost.slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 88);
  let description = sanitizeText(rawPost.description || '');
  if (description.length < 85) {
    description = `${description} Certified Master Inspector field guide for Metro Atlanta homebuyers and real estate agents.`.trim();
  }
  const category = sanitizeText(rawPost.category || 'Building Science & Diagnostics');
  const keywords = Array.isArray(rawPost.keywords) && rawPost.keywords.length > 0
    ? rawPost.keywords.map((k) => sanitizeText(String(k))).filter(Boolean)
    : ['Atlanta home inspection', 'Georgia building science', 'Certified Master Inspector'];
  let content = sanitizeText(rawPost.content || '');

  // Enforce <= 20 links ceiling
  const links = content.match(/<a\s+[^>]*href=/gi) || [];
  if (links.length === 0) {
    content += `\n<p>Lock in your inspection price at <a href="/quote">fhinspectionsatl.com/quote</a>, explore agent tools at <a href="/realtors">Realtor Partner Hub</a>, estimate repairs on our <a href="/repair-credit-calculator">Repair Credit Calculator</a>, and set up utilities at <a href="/free-utility-setup">Free Utility Setup</a>.</p>`;
  }

  if (!title || title.length < 20 || !slug || existingSlugs.has(slug) || !content || content.length < 400) {
    return { valid: false, post: null };
  }

  return {
    valid: true,
    post: {
      slug,
      title,
      description,
      date: rawPost.date || new Date().toISOString().split('T')[0],
      author: 'Christopher Boykin, CMI',
      category,
      keywords,
      content
    }
  };
}

export function syncLlmsFiles(newPost, totalPostsCount) {
  const llmsPath = path.join(ROOT, 'public', 'llms.txt');
  const llmsFullPath = path.join(ROOT, 'public', 'llms-full.txt');
  const cleanSummary = (newPost.description || '').replace(/\*/g, '').trim();

  if (fs.existsSync(llmsPath)) {
    let llms = fs.readFileSync(llmsPath, 'utf8');
    llms = llms.replace(
      /## Core Educational Guides & Analysis Articles \(\d+ Total\)/,
      `## Core Educational Guides & Analysis Articles (${totalPostsCount} Total)`
    );
    if (!llms.includes(`/blog/${newPost.slug}`)) {
      const entryLine = `- [${newPost.title}](https://www.fhinspectionsatl.com/blog/${newPost.slug}): ${cleanSummary}`;
      const headerMatch = llms.match(/## Core Educational Guides & Analysis Articles \(\d+ Total\)\r?\n/);
      if (headerMatch) {
        llms = llms.replace(headerMatch[0], `${headerMatch[0]}${entryLine}\n`);
      } else {
        llms = llms.replace(
          '## Inspection Comparison & Decision Guides',
          `${entryLine}\n## Inspection Comparison & Decision Guides`
        );
      }
    }
    fs.writeFileSync(llmsPath, llms, 'utf8');
  }

  if (fs.existsSync(llmsFullPath)) {
    let llmsFull = fs.readFileSync(llmsFullPath, 'utf8');
    if (!llmsFull.includes(`/blog/${newPost.slug}`)) {
      const fullBlock = `\n### ${newPost.title}\nURL: https://www.fhinspectionsatl.com/blog/${newPost.slug}\n${cleanSummary}\n`;
      const sectionHeader = '## Educational Resources and Blog Articles';
      if (llmsFull.includes(sectionHeader)) {
        llmsFull = llmsFull.replace(sectionHeader, `${sectionHeader}\n${fullBlock}`);
      } else {
        llmsFull += `\n${sectionHeader}\n${fullBlock}`;
      }
      fs.writeFileSync(llmsFullPath, llmsFull, 'utf8');
    }
  }
}

async function generatePostWithGemini(existingTitles, targetCorridor, keywordBrief = null, moneyTargets = []) {
  if (!GEMINI_API_KEY) return null;

  const kwDirective = keywordBrief?.targetKeyword
    ? `\nPrimary Buyer Search Topic (from live GSC + Keyword Discovery): "${keywordBrief.targetKeyword}"\nSupporting Questions/Terms: ${(keywordBrief.relatedKeywords || []).slice(0, 4).join(', ')}`
    : '';
  const moneyLinkDirective = moneyTargets.length > 0
    ? `\nPriority High-Converting Service Pages (weave 1-2 natural descriptive links if topically aligned): ${moneyTargets.slice(0, 4).join(', ')}`
    : '';

  const prompt = `You are Christopher Boykin, Certified Master Inspector (CMI) and founder of Foresight Home Inspections in Metro Atlanta, GA (https://www.fhinspectionsatl.com, phone: (678) 480-2110).
Write ONE net-new, deeply technical, homeowner-friendly educational blog post (850-1,150 words) focused on this Metro Atlanta corridor:
${targetCorridor}${kwDirective}${moneyLinkDirective}

Already published titles (DO NOT repeat these topics):
${existingTitles.slice(0, 25).map((t) => `- ${t}`).join('\n')}

STRICT CANONICAL TRUTH & STYLE RULES:
1. Open with a 2-3 sentence BLUF summary in the first paragraph answering the homeowner's core question and linking 2-3 corridor city pages (/service-areas/[city-slug]) plus 1 relevant /services/[service]/[city-slug] page.
2. Include 1 verified external non-competing .gov authority link (e.g. https://www.epa.gov/mold/mold-course-chapter-2, https://www.epa.gov/radon/radon-zone-map, or https://www.hud.gov/topics/buying_a_home) AND internal HTML links to /quote, /realtors, /free-utility-setup, and /repair-credit-calculator (<= 14 total internal links; NEVER link to /concierge; NEVER use generic "click here"/"learn more" anchors).
3. Pricing truth: Single-Family/Pre-Listing/11-Month Warranty From $345, Condo & Townhome From $295, Pre-Drywall From $275, New Construction From $400, Re-Inspection $200, -$25 Realtor-only partner client discount, $35,000 combined protection ($10,000 Elite Master Inspection Warranty + $25,000 InterNACHI Honor Guarantee). For Radon, Mold, Sewer Scope, Pool, Termite, DeKalb Low-Flow, or Commercial, ALWAYS write "Call (678) 480-2110 for Quote" with zero dollar figures near them.
4. Observational inspector voice: use "What this could mean:" (NEVER "What this means") and "Have a licensed [trade] contractor evaluate further and repair as needed."
5. End with <h2>Frequently Asked Questions</h2> containing 3 <h3> question-and-answer pairs.
6. ZERO asterisks (*) anywhere. ZERO banned tokens: never use audit/audits/audited/auditing, F404, F201, RSMeans, HomeGauge, CRL, FLIR, "half the time", "time in half", delve, tapestry, game-changer, pivotal, testament, seamless, seamlessly, dig, mix, important, proof, standard, beacon, leverage, unpack.

Respond ONLY in valid JSON:
{
  "title": "Compelling SEO Title (50-68 chars, no asterisks)",
  "slug": "url-friendly-slug",
  "description": "130-158 char meta description with no asterisks",
  "category": "Category Name",
  "keywords": ["kw1", "kw2", "kw3", "kw4"],
  "content": "<p>HTML content using <p>, <h2>, <h3>, <ul><li>...</p>"
}`;

  const geminiModels = await resolveGeminiTextModels(GEMINI_API_KEY);
  for (const model of geminiModels) {
    try {
      console.log(`🤖 Calling Gemini model ${model}...`);
      const genConfig = /^gemini-4/i.test(model)
        ? { responseMimeType: 'application/json' }
        : { temperature: 0.65, responseMimeType: 'application/json' };
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: genConfig
          })
        }
      );
      if (!res.ok) {
        console.warn(`⚠️ ${model} returned HTTP ${res.status} — trying next model...`);
        continue;
      }
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn(`⚠️ ${model} error: ${err.message}`);
    }
  }
  return null;
}

async function run() {
  console.log(`✍️ Starting Wednesday Blog Writer${DRY_RUN ? ' [DRY-RUN MODE]' : ''}...`);
  const postsPath = path.join(ROOT, 'data', 'posts.json');
  const posts = fs.existsSync(postsPath) ? JSON.parse(fs.readFileSync(postsPath, 'utf8')) : [];
  const existingTitles = posts.map((p) => p.title);
  const existingSlugs = new Set(posts.map((p) => p.slug));

  const kwBriefPath = path.join(ROOT, 'data', 'keyword-brief.json');
  const keywordBrief = fs.existsSync(kwBriefPath) ? JSON.parse(fs.readFileSync(kwBriefPath, 'utf8')) : null;
  const govBrief = loadGovernorBrief(ROOT);
  const moneyTargets = [
    ...(govBrief?.priority_internal_link_targets || []).map((t) => t.url),
    ...(keywordBrief?.priorityInternalLinkTargets || []).map((t) => t.url),
  ].filter((u, idx, arr) => u && (u.startsWith('/services/') || u.startsWith('/defects/') || u === '/due-diligence') && arr.indexOf(u) === idx);

  const targetCorridor = SEVEN_CORRIDORS[posts.length % SEVEN_CORRIDORS.length];
  let candidateRaw = await generatePostWithGemini(existingTitles, targetCorridor, keywordBrief, moneyTargets);
  let candidateResult = candidateRaw ? sanitizeAndValidatePost(candidateRaw, existingSlugs) : { valid: false };

  if (!candidateResult.valid) {
    console.log('📋 Using curated 7-corridor Georgia building-science fallback queue...');
    const availableFallback = DIVERSE_FALLBACK_TEMPLATES.find(
      (t) => !existingSlugs.has(t.slug) && !existingTitles.includes(t.title)
    );
    if (!availableFallback) {
      const msg = 'Wednesday Blog Writer failed: Gemini API unavailable and 0 unposted fallback templates remain.';
      console.error(`❌ ${msg}`);
      await sendNtfyAlert('Blog Writer Failure — Action Needed', msg, 'high', 'warning');
      process.exit(1);
    }
    candidateResult = sanitizeAndValidatePost(availableFallback, existingSlugs);
  }

  const finalPost = candidateResult.post;
  const remainingFallbacks = DIVERSE_FALLBACK_TEMPLATES.filter((t) => !existingSlugs.has(t.slug)).length;

  if (DRY_RUN) {
    console.log(`🧪 [DRY-RUN] Validated post ready: "${finalPost.title}" (/blog/${finalPost.slug})`);
    console.log(`🧪 [DRY-RUN] Unposted fallback queue remaining: ${remainingFallbacks}/12`);
    console.log(`🧪 [DRY-RUN] Would update data/posts.json (${posts.length} -> ${posts.length + 1}) + public/llms.txt + public/llms-full.txt`);
    process.exit(0);
  }

  posts.unshift(finalPost);
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2) + '\n', 'utf8');
  syncLlmsFiles(finalPost, posts.length);
  appendExperimentLedger(ROOT, {
    url: `/blog/${finalPost.slug}`,
    template: '/blog/*',
    deployedAt: finalPost.date,
    hypothesis: `New SEO Governor targeted article (${keywordBrief?.targetKeyword || 'corridor rotation'}): ${finalPost.title}`,
  });

  console.log(`🎉 Published "${finalPost.title}" (/blog/${finalPost.slug}) — Total posts: ${posts.length}`);
  await sendNtfyAlert(
    'New Wednesday Blog Published',
    `Published: ${finalPost.title} (https://www.fhinspectionsatl.com/blog/${finalPost.slug}). Total articles: ${posts.length}.`,
    'default',
    'newspaper'
  );
}

run();
