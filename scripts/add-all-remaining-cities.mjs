import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');

const remainingCities = [
  // --- FULTON COUNTY ---
  {
    "City Name": "Milton",
    "Slug": "milton",
    "County": "Fulton",
    "Zip": "30004",
    "Type": "luxury",
    "Desc": "renowned for its rural equestrian character and high-end executive estates",
    "Risks": "complex modern smart-home automation systems, luxury custom finishes requiring detailed quality checks, and septic/drainage perimeters for large acreage lots",
    "Services": "Luxury estate inspections, smart home feature checks, equestrian property assessments"
  },
  {
    "City Name": "Mountain Park",
    "Slug": "mountain-park",
    "County": "Fulton",
    "Zip": "30075",
    "Type": "rural",
    "Desc": "a serene, wooded lakeside enclave characterized by rustic cottages and custom cabin-style architecture",
    "Risks": "topography challenges causing active foundation drainage strain, structural shifting, and elevated wood rot due to dense tree cover",
    "Services": "Lakeside home structural audits, slope-stability assessments, chimney and wood-stove safety checks"
  },
  {
    "City Name": "East Point",
    "Slug": "east-point",
    "County": "Fulton",
    "Zip": "30344",
    "Type": "historic",
    "Desc": "a historic community featuring a rich collection of craftsman bungalows and mid-century cottages near downtown Atlanta",
    "Risks": "aging knob-and-tube or legacy wiring, outdated galvanized piping, and crawlspace moisture problems leading to active wood decay",
    "Services": "Craftsman bungalow preservation audits, comprehensive plumbing line scopes, legacy wiring safety reviews"
  },
  {
    "City Name": "College Park",
    "Slug": "college-park",
    "County": "Fulton",
    "Zip": "30337",
    "Type": "historic",
    "Desc": "a historic city boasting one of Georgia's largest historic residential districts with beautiful craftsman and Victorian homes",
    "Risks": "settling foundation piers, structural sagging, outdated electrical panels, and aged sewer lines prone to tree root intrusions",
    "Services": "Historic district structural audits, full sewer lateral scoping, legacy mechanical systems testing"
  },
  {
    "City Name": "Hapeville",
    "Slug": "hapeville",
    "County": "Fulton",
    "Zip": "30354",
    "Type": "suburban",
    "Desc": "a historic and artistic hub experiencing rapid residential revitalization with a mix of bungalows and new townhome builds",
    "Risks": "unpermitted remodeling projects, ungrounded branch outlets, and attic heat retention due to inadequate historic ventilation",
    "Services": "Bungalow safety inspections, townhome new construction reviews, thermal imaging checks for insulation"
  },
  {
    "City Name": "Union City",
    "Slug": "union-city",
    "County": "Fulton",
    "Zip": "30291",
    "Type": "suburban",
    "Desc": "a rapidly growing Gwinnett suburb with beautiful planned developments and commercial hubs",
    "Risks": "rushed suburban construction issues, improper roof flashing, and grading slopes causing foundation moisture buildup",
    "Services": "Subdivision home inspections, new construction walkthroughs, HVAC performance diagnostic reviews"
  },
  {
    "City Name": "Fairburn",
    "Slug": "fairburn",
    "County": "Fulton",
    "Zip": "30213",
    "Type": "suburban",
    "Desc": "a historic yet expanding suburb characterized by stable neighborhoods and master-planned residential growth",
    "Risks": "soil settling affecting foundation block walls, roof shingle weather damage, and attic moisture from poor soffit ventilation",
    "Services": "Foundation stability audits, roof and attic ventilation checks, 11-month builder warranty inspections"
  },
  {
    "City Name": "Palmetto",
    "Slug": "palmetto",
    "County": "Fulton",
    "Zip": "30268",
    "Type": "rural",
    "Desc": "a peaceful rural-suburban enclave with acreage lots, older ranch homes, and agricultural properties",
    "Risks": "aging well-water pump systems, wood rot along deck supports, and crawlspace framing insects wood-destroying infestations",
    "Services": "Crawlspace structural audits, acreage property reviews, termite WDO inspection reports"
  },
  {
    "City Name": "South Fulton",
    "Slug": "south-fulton",
    "County": "Fulton",
    "Zip": "30331",
    "Type": "suburban",
    "Desc": "a major newly incorporated suburban city with extensive master-planned communities and modern developments",
    "Risks": "builder oversights on newer residential models, incomplete attic insulation coverage, and localized erosion affecting lot grading",
    "Services": "Pre-drywall inspections, final warranty reviews, extensive master-planned residential audits"
  },
  {
    "City Name": "Chattahoochee Hills",
    "Slug": "chattahoochee-hills",
    "County": "Fulton",
    "Zip": "30268",
    "Type": "luxury",
    "Desc": "a unique eco-conscious luxury and equestrian community bordered by the Chattahoochee River",
    "Risks": "custom green-building mechanical systems, river-proximity high humidity, and structural grading issues on varied topography",
    "Services": "Eco-home systems audits, green-building insulation inspections, equestrian structure checks"
  },

  // --- DEKALB COUNTY ---
  {
    "City Name": "Clarkston",
    "Slug": "clarkston",
    "County": "DeKalb",
    "Zip": "30021",
    "Type": "suburban",
    "Desc": "a vibrant walking community with a diverse selection of mid-century cottages and family homes",
    "Risks": "outdated electrical panel configurations, copper/galvanized water line corrosion, and attic insulation settling",
    "Services": "Mid-century home checks, mechanical upgrades safety assessments, attic efficiency reviews"
  },
  {
    "City Name": "Pine Lake",
    "Slug": "pine-lake",
    "County": "DeKalb",
    "Zip": "30072",
    "Type": "rural",
    "Desc": "a charming, artistic lakeside enclave known for its ecological focus and historic cottage architecture",
    "Risks": "elevated moisture profiles near foundation piers, sloping site runoff erosion, and legacy plumbing updates challenges",
    "Services": "Lakeside structural audits, crawlspace moisture reviews, legacy cottage plumbing checks"
  },

  // --- COBB COUNTY ---
  {
    "City Name": "Powder Springs",
    "Slug": "powder-springs",
    "County": "Cobb",
    "Zip": "30127",
    "Type": "suburban",
    "Desc": "an established Cobb County suburb showing rapid residential growth and beautiful parks",
    "Risks": "rushed roof framing in newer subdivisions, foundation settling in shifting clay, and aging HVAC components",
    "Services": "Subdivision structural inspections, roof framing checks, 11-month builder warranty audits"
  },
  {
    "City Name": "Austell",
    "Slug": "austell",
    "County": "Cobb",
    "Zip": "30106",
    "Type": "historic",
    "Desc": "a historic rail town featuring classic craftsman bungalows and mature residential neighborhoods",
    "Risks": "crawlspace wood decay from moisture pooling, outdated wiring infrastructure, and active soil erosion around foundation walls",
    "Services": "Historic rail home structural checks, crawlspace encapsulation audits, legacy wiring updates assessments"
  },

  // --- GWINNETT COUNTY ---
  {
    "City Name": "Suwanee",
    "Slug": "suwanee",
    "County": "Gwinnett",
    "Zip": "30024",
    "Type": "luxury",
    "Desc": "an award-winning planned suburb renowned for its executive properties and luxury developments",
    "Risks": "high-end dual mechanical systems complex configurations, attic ventilation imbalances, and retaining wall structural shifts",
    "Services": "Executive planned home inspections, luxury mechanicals audits, landscape retaining walls reviews"
  },
  {
    "City Name": "Buford",
    "Slug": "buford",
    "County": "Gwinnett",
    "Zip": "30518",
    "Type": "luxury",
    "Desc": "a major historic city on Lake Lanier featuring custom lake homes and rapid modern residential builds",
    "Risks": "lake-humidity driven structural wood rot, custom boat dock electrical safety, and foundation settling near water perimeters",
    "Services": "Waterfront property inspections, dock electrical safety tests, lake home moisture mapping"
  },
  {
    "City Name": "Sugar Hill",
    "Slug": "sugar-hill",
    "County": "Gwinnett",
    "Zip": "30518",
    "Type": "suburban",
    "Desc": "a rapidly developing suburb with massive new subdivision projects and a growing family community",
    "Risks": "new build construction defects, incomplete structural flashing around windows, and attic insulation gaps",
    "Services": "New subdivision inspections, window/envelope flashing reviews, attic thermal performance audits"
  },
  {
    "City Name": "Peachtree Corners",
    "Slug": "peachtree-corners",
    "County": "Gwinnett",
    "Zip": "30092",
    "Type": "luxury",
    "Desc": "a premier, master-planned technology city showcasing custom upscale homes and sleek smart-home layouts",
    "Risks": "smart HVAC automation systems configuration, custom luxury finish durability, and crawlspace humidity control issues",
    "Services": "Smart-home mechanical inspections, crawlspace humidity diagnostics, luxury structural audits"
  },
  {
    "City Name": "Berkeley Lake",
    "Slug": "berkeley-lake",
    "County": "Gwinnett",
    "Zip": "30096",
    "Type": "luxury",
    "Desc": "a peaceful, highly affluent lakeside retreat featuring custom-designed luxury estates around Lake Berkeley",
    "Risks": "lakeside high-moisture framing wood decay, retaining walls structural degradation, and complex custom foundation engineering reviews",
    "Services": "Lakeside custom estate audits, landscape structural reviews, moisture thermal-scanning mappings"
  },

  // --- HENRY COUNTY ---
  {
    "City Name": "Hampton",
    "Slug": "hampton",
    "County": "Henry",
    "Zip": "30228",
    "Type": "historic",
    "Desc": "a historic city anchored by agricultural history and the famous Atlanta Motor Speedway",
    "Risks": "older historic masonry structural decay, ungrounded legacy electrical branch lines, and crawlspace dampness",
    "Services": "Historic masonry structural audits, legacy mechanicals safety checks, crawlspace evaluations"
  },
  {
    "City Name": "Locust Grove",
    "Slug": "locust-grove",
    "County": "Henry",
    "Zip": "30248",
    "Type": "suburban",
    "Desc": "a fast-growing family suburb featuring extensive new subdivisions and shopping complexes",
    "Risks": "improper roof truss bracing in fast-track builds, poor exterior landscape grading causing foundation pooling, and HVAC system undersizing",
    "Services": "Fast-track build structural checks, exterior landscape grading audits, HVAC performance testing"
  },

  // --- FAYETTE COUNTY ---
  {
    "City Name": "Tyrone",
    "Slug": "tyrone",
    "County": "Fayette",
    "Zip": "30290",
    "Type": "suburban",
    "Desc": "a cozy Fayette County community connected by beautiful parks and standard golf cart path links",
    "Risks": "garage golf-cart charging electrical load, driveway concrete cracking, and aging mechanical components in mid-80s properties",
    "Services": "Garage and cart-charger electrical audits, concrete driveway evaluations, home systems diagnostics"
  },
  {
    "City Name": "Brooks",
    "Slug": "brooks",
    "County": "Fayette",
    "Zip": "30205",
    "Type": "rural",
    "Desc": "a quiet rural farming enclave with beautiful sprawling acreage and historic farmsteads",
    "Risks": "aging private well/septic infrastructure, crawlspace framing pests wood-destroying infestations, and structural shifts in older farmhouses",
    "Services": "Rural property inspections, well/septic infrastructure visual reviews, termite WDO certifications"
  },
  {
    "City Name": "Woolsey",
    "Slug": "woolsey",
    "County": "Fayette",
    "Zip": "30294",
    "Type": "rural",
    "Desc": "a serene, rural agricultural town featuring spacious acreage and peaceful estates",
    "Risks": "outbuilding structural stability, crawlspace humidity problems, and aging residential well-pumps",
    "Services": "Acreage outbuildings assessments, well-pump performance evaluations, crawlspace structural checks"
  },

  // --- COWETA COUNTY ---
  {
    "City Name": "Senoia",
    "Slug": "senoia",
    "County": "Coweta",
    "Zip": "30276",
    "Type": "historic",
    "Desc": "a famous historic community known for its beautifully preserved town center and movie-set charm",
    "Risks": "aging brick-pier crawlspace structural settling, knob-and-tube or legacy wiring elements, and aging metal roof structures",
    "Services": "Preservation structure checks, historic brick-pier crawlspace audits, legacy utilities safety checks"
  },
  {
    "City Name": "Sharpsburg",
    "Slug": "sharpsburg",
    "County": "Coweta",
    "Zip": "30277",
    "Type": "suburban",
    "Desc": "a growing Coweta suburb with quiet neighborhoods and expanding custom residential builds",
    "Risks": "new build framing imperfections, attic ventilation airflow restrictions, and grading slopes causing foundation water retention",
    "Services": "Subdivision structural reviews, attic airflow performance checks, 11-month builder warranty audits"
  },
  {
    "City Name": "Haralson",
    "Slug": "haralson",
    "County": "Coweta",
    "Zip": "30229",
    "Type": "rural",
    "Desc": "a peaceful, historic rural town surrounded by active farms and classic historic homesteads",
    "Risks": "settling older timber framing, outdated private plumbing infrastructure, and crawlspace dampness issues",
    "Services": "Historic timber structural checks, crawlspace wood moisture maps, well and septic visual assessments"
  },
  {
    "City Name": "Turin",
    "Slug": "turin",
    "County": "Coweta",
    "Zip": "30289",
    "Type": "rural",
    "Desc": "a serene rural-suburban crossroads featuring spacious acreage and classic ranch designs",
    "Risks": "wood-destroying insect decay in crawlspaces, outdated mechanical systems, and foundation shifting in sandy clay",
    "Services": "Walton clay soil foundation checks, termite insect decay audits, full home systems reviews"
  },
  {
    "City Name": "Moreland",
    "Slug": "moreland",
    "County": "Coweta",
    "Zip": "30259",
    "Type": "historic",
    "Desc": "a historic rural town celebrating its literary history and historic residential bungalows",
    "Risks": "aging legacy wiring configurations, historic wood-siding structural rot, and settled crawlspaces",
    "Services": "Historic bungalow inspections, legacy wood siding assessments, crawlspace foundation checks"
  },
  {
    "City Name": "Grantville",
    "Slug": "grantville",
    "County": "Coweta",
    "Zip": "30220",
    "Type": "historic",
    "Desc": "a historic mill city with elegant Victorian estates and classic industrial character",
    "Risks": "sagging historic ceiling joists, active crawlspace moisture, and ungrounded electrical branch circuits",
    "Services": "Victorian estate structural checks, crawlspace dampness diagnostics, electrical safety reviews"
  },

  // --- NEWTON COUNTY ---
  {
    "City Name": "Mansfield",
    "Slug": "mansfield",
    "County": "Newton",
    "Zip": "30055",
    "Type": "rural",
    "Desc": "a peaceful rural community situated in southeastern Newton County, surrounded by woodlands and farms",
    "Risks": "older structural framing shifts, private well-water systems decay, and crawlspace structural wood damage",
    "Services": "Spacious rural structural audits, well-pump diagnostics, crawlspace wood rot checks"
  },
  {
    "City Name": "Newborn",
    "Slug": "newborn",
    "County": "Newton",
    "Zip": "30056",
    "Type": "historic",
    "Desc": "a quiet historic enclave with well-preserved historic homes and a peaceful rural landscape",
    "Risks": "legacy brick masonry settling, obsolete electrical panel assemblies, and damp crawlspaces causing framing decay",
    "Services": "Historic residential brick audits, crawlspace moisture reviews, legacy electrical panel checks"
  },

  // --- WALTON COUNTY ---
  {
    "City Name": "Walnut Grove",
    "Slug": "walnut-grove",
    "County": "Walton",
    "Zip": "30052",
    "Type": "suburban",
    "Desc": "a growing rural suburb featuring spacious family properties and excellent local schools",
    "Risks": "grading slope foundation water pooling, attic thermal insulation gaps, and roof shingles weathering",
    "Services": "Suburban property inspections, attic insulation audits, 11-month builder warranty checks"
  },
  {
    "City Name": "Between",
    "Slug": "between",
    "County": "Walton",
    "Zip": "30052",
    "Type": "rural",
    "Desc": "a historic, famously named rural crossroads with established single-family acreage lots",
    "Risks": "outbuilding framing safety, aging private water delivery components, and crawlspace ventilation problems",
    "Services": "Acreage home structural reviews, well-water components visual checks, crawlspace ventilation audits"
  },
  {
    "City Name": "Good Hope",
    "Slug": "good-hope",
    "County": "Walton",
    "Zip": "30641",
    "Type": "rural",
    "Desc": "a scenic rural agricultural community featuring established family ranches and historic properties",
    "Risks": "structural decay in legacy timber framing, private septic absorption field issues, and crawlspace wood rot",
    "Services": "Rural structural safety checks, crawlspace timber mapping, outbuildings assessments"
  },
  {
    "City Name": "Jersey",
    "Slug": "jersey",
    "County": "Walton",
    "Zip": "30055",
    "Type": "historic",
    "Desc": "a quiet, historic Walton crossroads celebrating its classic rural heritage and historic properties",
    "Risks": "legacy brick-pier foundation settling, outdated knob-and-tube or legacy wiring elements, and active framing dampness",
    "Services": "Legacy brick-pier inspections, outdated wiring safety assessments, crawlspace moisture audits"
  }
];

const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));

let addedCount = 0;

for (const city of remainingCities) {
  if (cities.some(c => c['City Name'].toLowerCase() === city['City Name'].toLowerCase())) {
    continue;
  }

  // Compile a premium, Local SEO rich entry dynamically
  const name = city['City Name'];
  const county = city.County;
  const zip = city.Zip;
  const desc = city.Desc;
  const risks = city.Risks;
  const services = city.Services;

  const entry = {
    "City Name": name,
    "Slug": city.Slug,
    "County": county,
    "Zip": zip,
    "Intro": `${name} is ${desc}. Our dual-inspector home inspection teams deliver highly advanced, thermal-assisted audits to protect your significant residential investments in this beautiful community.`,
    "Local Risks HTML": `<p>Properties in ${name} commonly face specialized local conditions. ${risks.charAt(0).toUpperCase() + risks.slice(1)}. We trace these defects using high-tech thermal and moisture diagnostic tools before they become expensive problems.</p>`,
    "Services HTML": `<ul><li>${services.split(', ')[0]}</li><li>${services.split(', ')[1]}</li><li>${services.split(', ')[2] || 'Pre-listing and new construction checks'}</li></ul>`,
    "Benefits HTML": `<ul><li>Two certified home inspectors on every single ${name} site visit</li><li>FLIR thermal cameras and aerial drone scans included at no extra cost</li><li>$10,000 Elite Master warranty protection withexactly $0 deductible</li></ul>`,
    "Nearby Cities HTML": `<p>Nearby cities: <a href='/home-inspector-lithonia'>Lithonia</a>, <a href='/home-inspector-decatur'>Decatur</a>, <a href='/home-inspector-conyers'>Conyers</a></p>`,
    "Meta Title": `${name} GA Home Inspections | Certified Master Inspector`,
    "Meta Description": `Premium home inspections in ${name}, GA by Certified Master Inspectors. Thermal imaging, drone scans, and $10,000 warranty included. Call 678-480-2110.`,
    "JSON-LD Schema": `{"@context":"https://schema.org","@type":"LocalBusiness","name":"Foresight Home Inspections, LLC","address":{"@type":"PostalAddress","addressLocality":"${name}","addressRegion":"GA","postalCode":"${zip}","addressCountry":"US"},"telephone":"678-480-2110"}`
  };

  cities.push(entry);
  addedCount++;
}

fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');
console.log(`Successfully compiled and appended ${addedCount} missing cities to cities.json database!`);
