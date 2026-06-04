import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_FILE = path.join(__dirname, '..', 'data', 'cities.json');

const newCities = [
  {
    "City Name": "Lawrenceville",
    "Slug": "lawrenceville",
    "County": "Gwinnett",
    "Zip": "30043",
    "Intro": "As the historic county seat of Gwinnett County, Lawrenceville blends a vibrant downtown district with sprawling residential subdivisions. Home inspections in Lawrenceville require extensive expertise across diverse architectural styles, ranging from century-old historic properties near the square to modern executive estates.",
    "Local Risks HTML": "<p>Lawrenceville properties often face foundation settling and clay soil expansion. Basement moisture and attic ventilation challenges are also common in older multi-level suburban homes.</p>",
    "Services HTML": "<ul><li>Thorough buyer inspections for mature and new properties</li><li>Crawlspace moisture and structural evaluations</li><li>Radon and WDO/termite testing coordination</li></ul>",
    "Benefits HTML": "<ul><li>Deep familiarity with Gwinnett County's building patterns</li><li>Two certified inspectors on every single property visit</li><li>FLIR infrared cameras and aerial drone technology included</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-snellville'>Snellville</a>, <a href='/home-inspector-loganville'>Loganville</a>, <a href='/home-inspector-duluth'>Duluth</a></p>",
    "Meta Title": "Lawrenceville GA Home Inspections | Certified Master Inspector",
    "Meta Description": "Expert home inspections in Lawrenceville, GA. Comprehensive structural, electrical, and mechanical assessments by Certified Master Inspectors. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Lawrenceville\",\"addressRegion\":\"GA\",\"postalCode\":\"30043\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Stockbridge",
    "Slug": "stockbridge",
    "County": "Henry",
    "Zip": "30281",
    "Intro": "Located in northern Henry County, Stockbridge offers beautiful master-planned neighborhoods and excellent connectivity to Atlanta. Our home inspections in Stockbridge focus on helping young families and professionals protect their home investments.",
    "Local Risks HTML": "<p>High summer humidity in Stockbridge can trigger attic moisture and crawlspace mold issues. Rapidly built suburban structures benefit from structural framing audits.</p>",
    "Services HTML": "<ul><li>Structural inspections and foundation evaluations</li><li>Pre-listing checks and commercial assessments</li><li>11-month builder warranty audits</li></ul>",
    "Benefits HTML": "<ul><li>Specialized experience with Henry County suburban builds</li><li>Advanced diagnostic suite including thermal scanners</li><li>Detailed, same-day digital reports with photos and videos</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-mcdonough'>McDonough</a>, <a href='/home-inspector-jonesboro'>Jonesboro</a>, <a href='/home-inspector-lithonia'>Lithonia</a></p>",
    "Meta Title": "Stockbridge GA Home Inspections | Certified Home Inspector",
    "Meta Description": "Professional home inspections in Stockbridge, GA. Specializing in resales, new builds, and builder warranty checks. Schedule today: 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Stockbridge\",\"addressRegion\":\"GA\",\"postalCode\":\"30281\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "McDonough",
    "Slug": "mcdonough",
    "County": "Henry",
    "Zip": "30253",
    "Intro": "McDonough serves as the scenic heart of Henry County, featuring a historic town square and rapidly growing residential subdivisions. Home inspections in McDonough are highly requested due to the area's massive expansion and custom luxury builds.",
    "Local Risks HTML": "<p>Rushed construction in newer McDonough subdivisions can lead to roofing installation errors and grading/drainage concerns that cause basement leaks.</p>",
    "Services HTML": "<ul><li>New construction phase checks and final inspections</li><li>Luxury home inspections with smart automation testing</li><li>Termite/WDO certifications and sewer scopes</li></ul>",
    "Benefits HTML": "<ul><li>Dual-inspector thoroughness with CMI-level designation</li><li>High-definition drone roof scans included standard</li><li>Standard gas and moisture sniffing tools utilized</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-stockbridge'>Stockbridge</a>, <a href='/home-inspector-conyers'>Conyers</a>, <a href='/home-inspector-covington'>Covington</a></p>",
    "Meta Title": "McDonough Home Inspections | Certified Master Inspector",
    "Meta Description": "Premium home inspections in McDonough, GA. Dual-inspector model, thermal imaging, and drones included. Protect your investment: 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"McDonough\",\"addressRegion\":\"GA\",\"postalCode\":\"30253\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Duluth",
    "Slug": "duluth",
    "County": "Gwinnett",
    "Zip": "30096",
    "Intro": "Duluth stands as a premier Gwinnett County suburb known for its parks, cultural diversity, and high-end residential communities. We provide meticulously detailed home inspections in Duluth to support both buyers and listing agents.",
    "Local Risks HTML": "<p>Established Duluth homes often feature aging mechanical systems (HVAC, water heaters) and roofing wear that requires professional diagnostic testing.</p>",
    "Services HTML": "<ul><li>Full buyer inspections with attic and roof drone audits</li><li>Sewer scope imaging and plumbing pipeline checks</li><li>Electrical panel thermal audits for overheating breakers</li></ul>",
    "Benefits HTML": "<ul><li>Certified Master Inspector (CMI) credentialed oversight</li><li>Same-day digital reporting with interactive dashboard</li><li>$10,000 warranty protection for total peace of mind</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-johns-creek'>Johns Creek</a>, <a href='/home-inspector-alpharetta'>Alpharetta</a>, <a href='/home-inspector-norcross'>Norcross</a></p>",
    "Meta Title": "Duluth GA Home Inspections | Premium Dual-Inspector Team",
    "Meta Description": "Expert home inspections in Duluth, GA. Meticulous structural, roofing, and mechanical systems checks by certified experts. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Duluth\",\"addressRegion\":\"GA\",\"postalCode\":\"30096\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Norcross",
    "Slug": "norcross",
    "County": "Gwinnett",
    "Zip": "30071",
    "Intro": "Combining historic charm with massive tech-industry neighborhoods, Norcross features everything from historic craftsman cottages to modern luxury developments. Home inspections in Norcross require adaptive, highly trained experts.",
    "Local Risks HTML": "<p>Older Norcross bungalows frequently face electrical wiring challenges (including outdated aluminum wiring or double-tapped panels) and sewer line root intrusions.</p>",
    "Services HTML": "<ul><li>Historic preservation inspections and restoration checks</li><li>Plumbing and sewer line scoping audits</li><li>Mold assessments and moisture investigations</li></ul>",
    "Benefits HTML": "<ul><li>Extensive local Gwinnett County residential construction expertise</li><li>Dual-inspector diligence with two certified experts on site</li><li>Advanced FLIR infrared leak and hot spot detection</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-duluth'>Duluth</a>, <a href='/home-inspector-tucker'>Tucker</a>, <a href='/home-inspector-lilburn'>Lilburn</a></p>",
    "Meta Title": "Norcross GA Home Inspections | Historic & Modern Homes",
    "Meta Description": "Professional home inspections in Norcross, GA. Historic bungalow and new build specialists. Dual-certified inspector team. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Norcross\",\"addressRegion\":\"GA\",\"postalCode\":\"30071\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Chamblee",
    "Slug": "chamblee",
    "County": "DeKalb",
    "Zip": "30341",
    "Intro": "Chamblee is a vibrant, fast-growing city in northern DeKalb County known for its mid-century ranches, loft conversions, and luxury modern builds. Our home inspections in Chamblee provide the thorough, precise data required in this fast-moving real estate market.",
    "Local Risks HTML": "<p>Extensive remodeling in Chamblee properties means unpermitted DIY renovations, structural wall alterations, and plumbing re-routing are key inspection targets.</p>",
    "Services HTML": "<ul><li>Mid-century modern audits and structural framing reviews</li><li>Renovation safety and standards checks for modified layouts</li><li>Radon gas monitoring and indoor air inspections</li></ul>",
    "Benefits HTML": "<ul><li>High-tech moisture scanners and thermal diagnostics</li><li>Certified Master Inspector (CMI) level review</li><li>Same-day report delivery with digital summaries</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-brookhaven'>Brookhaven</a>, <a href='/home-inspector-dunwoody'>Dunwoody</a>, <a href='/home-inspector-doraville'>Doraville</a></p>",
    "Meta Title": "Chamblee Home Inspections | Mid-Century & Luxury Builds",
    "Meta Description": "Expert home inspections in Chamblee, GA. Specializing in mid-century renovations and new builds. Call 678-480-2110 for a professional quote.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Chamblee\",\"addressRegion\":\"GA\",\"postalCode\":\"30341\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Doraville",
    "Slug": "doraville",
    "County": "DeKalb",
    "Zip": "30340",
    "Intro": "Doraville offers exceptional transit links and established mid-century residential neighborhoods in northern DeKalb County. We deliver standard, reliable, and high-tech home inspections in Doraville to help families buy with total peace of mind.",
    "Local Risks HTML": "<p>Mature trees in Doraville often impact roofing shingles, gutters, and foundation perimeters. Outdated mechanical components are also common.</p>",
    "Services HTML": "<ul><li>Attic and roof drone audits using high-res imagery</li><li>Foundation drainage and perimeter grading assessments</li><li>Buyer structural reviews and heating system audits</li></ul>",
    "Benefits HTML": "<ul><li>Two certified inspectors on every site for maximum coverage</li><li>Advanced FLIR thermal imaging standard with no extra fee</li><li>Elite $10,000 warranty protection with $0 deductible</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-chamblee'>Chamblee</a>, <a href='/home-inspector-tucker'>Tucker</a>, <a href='/home-inspector-lilburn'>Lilburn</a></p>",
    "Meta Title": "Doraville GA Home Inspections | Certified Master Inspector",
    "Meta Description": "Top-rated home inspections in Doraville, GA. Structural, roofing, and mechanical systems checks by certified experts. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Doraville\",\"addressRegion\":\"GA\",\"postalCode\":\"30340\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Jonesboro",
    "Slug": "jonesboro",
    "County": "Clayton",
    "Zip": "30236",
    "Intro": "Serving as the historic seat of Clayton County, Jonesboro features beautifully established ranches and contemporary subdivisions. Our certified home inspectors provide detailed, comprehensive audits to protect your family and investment.",
    "Local Risks HTML": "<p>Soil composition in Clayton County can lead to foundation cracking and shifting. High humidity levels also make crawlspace moisture barriers essential.</p>",
    "Services HTML": "<ul><li>Crawlspace encapsulation reviews and moisture checks</li><li>Foundation structural integrity assessments</li><li>WDO termite evaluations with official GA reports</li></ul>",
    "Benefits HTML": "<ul><li>Meticulous dual-inspector process for ultimate accuracy</li><li>Detailed recommendation narratives for negotiation support</li><li>Robust warranty protection coverage included standard</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-stockbridge'>Stockbridge</a>, <a href='/home-inspector-fayetteville'>Fayetteville</a>, <a href='/home-inspector-morrow'>Morrow</a></p>",
    "Meta Title": "Jonesboro GA Home Inspections | Clayton County Specialists",
    "Meta Description": "Professional home inspections in Jonesboro, GA. Expert assessments of structure, foundation, and systems. Call 678-480-2110 to schedule today.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Jonesboro\",\"addressRegion\":\"GA\",\"postalCode\":\"30236\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Morrow",
    "Slug": "morrow",
    "County": "Clayton",
    "Zip": "30260",
    "Intro": "Morrow combines university life with peaceful, established residential neighborhoods. We provide thorough, affordable home inspections in Morrow for first-time buyers and seasoned real estate investors alike.",
    "Local Risks HTML": "<p>Older Morrow homes often exhibit aging electrical panels, plumbing leaks, and roof wear that our infrared cameras spot before they become expensive problems.</p>",
    "Services HTML": "<ul><li>Buyer and pre-listing inspections for residential resales</li><li>Thermal heat-profile scans for panels and wiring</li><li>HVAC health checks and mechanical performance diagnostics</li></ul>",
    "Benefits HTML": "<ul><li>Same-day scheduling capability for urgent transactions</li><li>CMI-grade detailed reporting with direct photo references</li><li>Full $10,000 warranty protection with $0 deductible</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-jonesboro'>Jonesboro</a>, <a href='/home-inspector-stockbridge'>Stockbridge</a>, <a href='/home-inspector-forest-park'>Forest Park</a></p>",
    "Meta Title": "Morrow GA Home Inspections | Certified Home Inspector",
    "Meta Description": "Reliable home inspections in Morrow, GA. Comprehensive buyer and pre-listing inspections with two inspectors. Schedule today: 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Morrow\",\"addressRegion\":\"GA\",\"postalCode\":\"30260\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Forest Park",
    "Slug": "forest-park",
    "County": "Clayton",
    "Zip": "30297",
    "Intro": "Forest Park stands as a major logistics and residential hub in Clayton County. We deliver thorough, safety-oriented home inspections in Forest Park to ensure every property meets rigorous safety and structural standards.",
    "Local Risks HTML": "<p>Established properties in Forest Park often show challenges with outdated plumbing systems (such as polybutylene pipes) and ungrounded electrical outlets.</p>",
    "Services HTML": "<ul><li>Multi-system home inspections with comprehensive coverage</li><li>Electrical outlet grounding and safety panel checks</li><li>Utility and plumbing line leak audits</li></ul>",
    "Benefits HTML": "<ul><li>High-tech diagnostic suite utilized at no extra cost</li><li>$0 deductible Master CMI level warranty included</li><li>Dual-inspector safety coverage for buyer confidence</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-morrow'>Morrow</a>, <a href='/home-inspector-atlanta'>Atlanta</a>, <a href='/home-inspector-jonesboro'>Jonesboro</a></p>",
    "Meta Title": "Forest Park Home Inspections | Clayton County Experts",
    "Meta Description": "Professional home inspections in Forest Park, GA. Serving Clayton County with thorough, professional service. Call 678-480-2110 for a quote.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Forest Park\",\"addressRegion\":\"GA\",\"postalCode\":\"30297\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Redan",
    "Slug": "redan",
    "County": "DeKalb",
    "Zip": "30058",
    "Intro": "Redan is a highly populated residential community in eastern DeKalb County, located just minutes from Lithonia. We provide meticulous home inspections in Redan to help buyers navigate mature subdivisions and modern construction projects.",
    "Local Risks HTML": "<p>Foundation settling in DeKalb's clay soil is highly common. Inadequate attic insulation and outdated ventilation systems can also strain HVAC systems.</p>",
    "Services HTML": "<ul><li>Attic insulation audits and ventilation reviews</li><li>Foundation structural evaluations and drainage checks</li><li>Dual-inspector standard walkthrough reviews</li></ul>",
    "Benefits HTML": "<ul><li>Exceptional local knowledge of DeKalb County home styles</li><li>Advanced thermal imaging and drone diagnostics included</li><li>Full $10,000 warranty protection standard</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-lithonia'>Lithonia</a>, <a href='/home-inspector-stonecrest'>Stonecrest</a>, <a href='/home-inspector-stone-mountain'>Stone Mountain</a></p>",
    "Meta Title": "Redan GA Home Inspections | Certified Master Inspector",
    "Meta Description": "Professional home inspections in Redan, GA. Expert assessments of structure, foundation, and systems. Call 678-480-2110 to schedule today.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Redan\",\"addressRegion\":\"GA\",\"postalCode\":\"30058\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Monroe",
    "Slug": "monroe",
    "County": "Walton",
    "Zip": "30655",
    "Intro": "Monroe is a historic town in Walton County featuring classic Southern architecture and expanding residential neighborhoods. Our home inspections in Monroe provide historic home care alongside new build evaluations.",
    "Local Risks HTML": "<p>Outdated knob-and-tube or legacy wiring in historic Monroe estates is a major concern. Soil erosion and grading issues also affect rural properties.</p>",
    "Services HTML": "<ul><li>Historic structural audits and safety restorations evaluations</li><li>Acreage and surrounding outbuildings structural checks</li><li>Radon and water quality diagnostic testing</li></ul>",
    "Benefits HTML": "<ul><li>Extensive experience with historic Southern residential assets</li><li>High-definition drone roof imaging and FLIR scans standard</li><li>Absolute Master Inspector level detail on every site</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-loganville'>Loganville</a>, <a href='/home-inspector-covington'>Covington</a>, <a href='/home-inspector-conyers'>Conyers</a></p>",
    "Meta Title": "Monroe GA Home Inspections | Certified Home Inspector",
    "Meta Description": "Expert home inspections in Monroe, GA. Historic and modern home specialists. Two certified inspectors per job. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Monroe\",\"addressRegion\":\"GA\",\"postalCode\":\"30655\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Oxford",
    "Slug": "oxford",
    "County": "Newton",
    "Zip": "30054",
    "Intro": "Home to Oxford College of Emory University, Oxford is a serene town rich in history and historic residential properties. We offer meticulous, professional home inspections in Oxford to preserve the town's architectural integrity and guarantee structural safety.",
    "Local Risks HTML": "<p>Crawlspace moisture and wood rot are highly active in mature Oxford homes. Outdated sewer lateral connections can also require scoping.</p>",
    "Services HTML": "<ul><li>Historic preservation inspections with specialized guidelines</li><li>Crawlspace moisture and ventilation audits</li><li>Sewer scope and plumbing pipeline inspections</li></ul>",
    "Benefits HTML": "<ul><li>Multi-inspector accuracy with CMI-level designation</li><li>Advanced thermal camera leak and hot spot detection</li><li>Full $10,000 warranty protection with $0 deductible</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-covington'>Covington</a>, <a href='/home-inspector-conyers'>Conyers</a>, <a href='/home-inspector-lithonia'>Lithonia</a></p>",
    "Meta Title": "Oxford GA Home Inspections | Certified Master Inspector",
    "Meta Description": "Expert home inspections in Oxford, GA. Historic home and renovation specialists. Dual-certified inspector team. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Oxford\",\"addressRegion\":\"GA\",\"postalCode\":\"30054\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Porterdale",
    "Slug": "porterdale",
    "County": "Newton",
    "Zip": "30070",
    "Intro": "Porterdale is a historic mill town on the Yellow River in Newton County, featuring charming cottages and loft conversions. We provide thorough, professional home inspections in Porterdale to support the town's vibrant revitalization.",
    "Local Risks HTML": "<p>Riverside humidity can cause framing wood rot and subfloor moisture issues. Historical construction elements require specialized, experienced assessment.</p>",
    "Services HTML": "<ul><li>River-adjacent moisture and drainage audits</li><li>Historic mill cottage structural assessments</li><li>Electrical update safety and grounding checks</li></ul>",
    "Benefits HTML": "<ul><li>Specialized historic structural restoration expertise</li><li>High-tech moisture scanners and thermal diagnostics standard</li><li>Dual-inspector precision for reliable buying decisions</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-covington'>Covington</a>, <a href='/home-inspector-conyers'>Conyers</a>, <a href='/home-inspector-lithonia'>Lithonia</a></p>",
    "Meta Title": "Porterdale GA Home Inspections | Certified Home Inspector",
    "Meta Description": "Professional home inspections in Porterdale, GA. Historic cottage and renovation specialists. Two certified inspectors. Call 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Porterdale\",\"addressRegion\":\"GA\",\"postalCode\":\"30070\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  },
  {
    "City Name": "Dacula",
    "Slug": "dacula",
    "County": "Gwinnett",
    "Zip": "30019",
    "Intro": "Dacula is a highly desirable, rapidly growing suburb in eastern Gwinnett County. Our certified home inspectors specialize in new construction checks and residential resales to protect your Gwinnett investments.",
    "Local Risks HTML": "<p>Rushed builder construction in Dacula's new subdivisions can lead to improper roof flashing, unsealed window frames, and incomplete attic insulation.</p>",
    "Services HTML": "<ul><li>Pre-drywall structural and mechanical system audits</li><li>Final walkthrough inspections with builder correction logs</li><li>11-month builder warranty evaluations before expiration</li></ul>",
    "Benefits HTML": "<ul><li>Specialized expertise with Gwinnett luxury homes</li><li>FLIR infrared cameras and aerial drone technology included standard</li><li>Comprehensive same-day digital reports with direct recommendations</li></ul>",
    "Nearby Cities HTML": "<p>Nearby cities: <a href='/home-inspector-lawrenceville'>Lawrenceville</a>, <a href='/home-inspector-grayson'>Grayson</a>, <a href='/home-inspector-loganville'>Loganville</a></p>",
    "Meta Title": "Dacula GA Home Inspections | New Build Specialists",
    "Meta Description": "Expert home inspections in Dacula, GA. Specializing in new builds, warranty checks, and residential resales. Schedule today: 678-480-2110.",
    "JSON-LD Schema": "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Foresight Home Inspections, LLC\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Dacula\",\"addressRegion\":\"GA\",\"postalCode\":\"30019\",\"addressCountry\":\"US\"},\"telephone\":\"678-480-2110\"}"
  }
];

const cities = JSON.parse(fs.readFileSync(CITIES_FILE, 'utf8'));

// Filter out duplicates and push
let count = 0;
for (const newCity of newCities) {
  if (!cities.some(c => c['City Name'].toLowerCase() === newCity['City Name'].toLowerCase())) {
    cities.push(newCity);
    count++;
  }
}

fs.writeFileSync(CITIES_FILE, JSON.stringify(cities, null, 2), 'utf8');
console.log(`Successfully added ${count} new cities to ${CITIES_FILE}!`);
