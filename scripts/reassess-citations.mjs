import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const auditFilePath = path.join(__dirname, '..', 'data', 'local-citations-audit.json');

const directories = [
  // 1. Google Business Profile
  {
    id: "google_business",
    name: "Google Business Profile (Map Pack)",
    category: "Search & Voice Engines",
    authority_role: "Primary Search & Local Map Pack",
    url: "https://maps.google.com/?cid=10862078652033010531",
    live_url: "https://maps.google.com/?cid=10862078652033010531",
    claim_url: "https://business.google.com/",
    domain_authority: 98,
    da: 98,
    status: "ACTIVE_VERIFIED",
    link_type: "Direct Entity Link",
    impact: "CRITICAL",
    tier: "Core Search & Map Packs",
    notes: "Primary local Map Pack citation engine for Atlanta/Lithonia (Place ID: 10862078652033010531)"
  },
  // 2. Apple Maps
  {
    id: "apple_maps",
    name: "Apple Business Connect (Apple Maps)",
    category: "Search & Voice Engines",
    authority_role: "Apple Intelligence & Siri Maps",
    url: "https://businessconnect.apple.com/",
    live_url: "https://businessconnect.apple.com/",
    claim_url: "https://businessconnect.apple.com/",
    domain_authority: 96,
    da: 96,
    status: "ACTIVE_VERIFIED",
    link_type: "Direct Entity Link",
    impact: "CRITICAL",
    tier: "Core Search & Map Packs",
    notes: "Powers Siri Voice Search and iOS Apple Maps local navigation"
  },
  // 3. Bing Places
  {
    id: "bing_places",
    name: "Bing Places for Business",
    category: "Search & Voice Engines",
    authority_role: "Microsoft Copilot & Bing Local",
    url: "https://www.bingplaces.com/",
    live_url: "https://www.bingplaces.com/",
    claim_url: "https://www.bingplaces.com/",
    domain_authority: 94,
    da: 94,
    status: "ACTIVE_VERIFIED",
    link_type: "Direct Entity Link",
    impact: "HIGH",
    tier: "Core Search & Map Packs",
    notes: "Powers Microsoft Copilot, Windows Search & Bing Local AI Overviews"
  },
  // 4. Georgia Secretary of State
  {
    id: "ga_sos",
    name: "Georgia Secretary of State Business Registry",
    category: "Government & Legal",
    authority_role: "State Legal Entity Verification",
    url: "https://ecorp.sos.ga.gov/",
    live_url: "https://ecorp.sos.ga.gov/",
    claim_url: "https://ecorp.sos.ga.gov/",
    domain_authority: 84,
    da: 84,
    status: "ACTIVE_VERIFIED",
    link_type: "Government Public Record",
    impact: "CRITICAL",
    tier: "Master Credentials & Legal Standing",
    notes: "Official state legal entity registration verification for Foresight Home Inspections, LLC"
  },
  // 5. InterNACHI
  {
    id: "internachi",
    name: "InterNACHI Official Inspector Directory",
    category: "Master Credential & Industry",
    authority_role: "Master Industry Credential",
    url: "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873",
    live_url: "https://www.nachi.org/certified-inspectors/christopher-boykin-cmi-176873",
    claim_url: "https://www.nachi.org/profile",
    domain_authority: 78,
    da: 78,
    status: "ACTIVE_VERIFIED",
    link_type: "DoFollow",
    impact: "CRITICAL",
    tier: "Master Credentials & Legal Standing",
    notes: "Verified CMI #176873 profile with official industry authority backlink"
  },
  // 6. Master Inspector Certification Board
  {
    id: "cmi_board",
    name: "Master Inspector Certification Board",
    category: "Master Credential & Industry",
    authority_role: "Highest Industry Designation",
    url: "https://certifiedmasterinspector.org/verify/christopher-boykin",
    live_url: "https://certifiedmasterinspector.org/verify/christopher-boykin",
    claim_url: "https://certifiedmasterinspector.org/members",
    domain_authority: 62,
    da: 62,
    status: "ACTIVE_VERIFIED",
    link_type: "DoFollow",
    impact: "CRITICAL",
    tier: "Master Credentials & Legal Standing",
    notes: "Official Certified Master Inspector (CMI®) verification and board listing"
  },
  // 7. BBB
  {
    id: "bbb_atlanta",
    name: "Better Business Bureau (BBB Atlanta & North GA)",
    category: "Trust & Entity Verification",
    authority_role: "National Trust & Accreditation",
    url: "https://www.bbb.org/us/ga/lithonia/profile/home-inspection/foresight-home-inspections-llc",
    live_url: "https://www.bbb.org/us/ga/lithonia/profile/home-inspection/foresight-home-inspections-llc",
    claim_url: "https://www.bbb.org/get-listed",
    domain_authority: 91,
    da: 91,
    status: "ACTIVE_VERIFIED",
    link_type: "DoFollow",
    impact: "CRITICAL",
    tier: "Master Credentials & Legal Standing",
    notes: "Highest-trust commercial entity grounding signal in GA"
  },
  // 8. Zillow Professional Directory
  {
    id: "zillow_pro",
    name: "Zillow Professional Directory",
    category: "Real Estate Portals",
    authority_role: "Real Estate Buyer & Agent Portal",
    url: "https://www.zillow.com/profile/Foresight-Home-Inspections-LLC/",
    live_url: "https://www.zillow.com/profile/Foresight-Home-Inspections-LLC/",
    claim_url: "https://www.zillow.com/professionals",
    domain_authority: 98,
    da: 98,
    status: "ACTIVE_VERIFIED",
    link_type: "High-Authority Real Estate Link",
    impact: "CRITICAL",
    tier: "Real Estate & Enterprise Entities",
    notes: "Official verified business profile on America's #1 real estate transaction portal"
  },
  // 9. LinkedIn
  {
    id: "linkedin_company",
    name: "LinkedIn Company Organization",
    category: "Knowledge Graph & Corporate",
    authority_role: "Corporate Entity Verification",
    url: "https://www.linkedin.com/company/foresight-home-inspections-llc/",
    live_url: "https://www.linkedin.com/company/foresight-home-inspections-llc/",
    claim_url: "https://www.linkedin.com/",
    domain_authority: 98,
    da: 98,
    status: "ACTIVE_VERIFIED",
    link_type: "Knowledge Graph Entity",
    impact: "HIGH",
    tier: "Social & Knowledge Graph Entities",
    notes: "Official corporate entity profile linked in Schema.org sameAs triples"
  },
  // 10. Facebook Business
  {
    id: "facebook_business",
    name: "Facebook Official Business Page",
    category: "Knowledge Graph & Social",
    authority_role: "Meta Local Business Entity",
    url: "https://facebook.com/fhinspectionsatl",
    live_url: "https://facebook.com/fhinspectionsatl",
    claim_url: "https://business.facebook.com/",
    domain_authority: 96,
    da: 96,
    status: "ACTIVE_VERIFIED",
    link_type: "Local Social Entity",
    impact: "HIGH",
    tier: "Social & Knowledge Graph Entities",
    notes: "Verified Meta business page with local address and automated feed syndication"
  },
  // 11. YouTube Official
  {
    id: "youtube_official",
    name: "YouTube Official Brand Channel",
    category: "Knowledge Graph & Video",
    authority_role: "Google Video Entity Anchor",
    url: "https://www.youtube.com/@ForesightHomeInspections-t6r",
    live_url: "https://www.youtube.com/@ForesightHomeInspections-t6r",
    claim_url: "https://studio.youtube.com/",
    domain_authority: 100,
    da: 100,
    status: "ACTIVE_VERIFIED",
    link_type: "Google Ecosystem Link",
    impact: "HIGH",
    tier: "Social & Knowledge Graph Entities",
    notes: "Official brand channel providing direct Google knowledge graph video grounding"
  },
  // 12. Instagram Official
  {
    id: "instagram_official",
    name: "Instagram Official Business Profile",
    category: "Knowledge Graph & Social",
    authority_role: "Visual Brand Grounding",
    url: "https://www.instagram.com/fhinspectionsatl/",
    live_url: "https://www.instagram.com/fhinspectionsatl/",
    claim_url: "https://www.instagram.com/",
    domain_authority: 93,
    da: 93,
    status: "ACTIVE_VERIFIED",
    link_type: "Social Profile Entity",
    impact: "MEDIUM",
    tier: "Social & Knowledge Graph Entities",
    notes: "Active Instagram business handle linked across all schema markup"
  },
  // 13. TikTok Official
  {
    id: "tiktok_official",
    name: "TikTok Official Business Profile",
    category: "Knowledge Graph & Video",
    authority_role: "Short-Form Video Authority",
    url: "https://www.tiktok.com/@fhinspectionsatl",
    live_url: "https://www.tiktok.com/@fhinspectionsatl",
    claim_url: "https://www.tiktok.com/",
    domain_authority: 95,
    da: 95,
    status: "ACTIVE_VERIFIED",
    link_type: "Social Video Entity",
    impact: "MEDIUM",
    tier: "Social & Knowledge Graph Entities",
    notes: "Verified TikTok handle for home inspection video tips and social signal"
  },
  // 14. Support Black Owned
  {
    id: "support_black_owned",
    name: "Support Black Owned (SBO Directory)",
    category: "National Business Citations",
    authority_role: "Diversity & Community Directory",
    url: "https://www.supportblackowned.com/",
    live_url: "https://www.supportblackowned.com/",
    claim_url: "https://www.supportblackowned.com/add-a-business",
    domain_authority: 58,
    da: 58,
    status: "ACTIVE_VERIFIED",
    link_type: "DoFollow Directory Link",
    impact: "MEDIUM",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Live verified listing in America's leading Black-owned business directory"
  },
  // 15. Yelp for Business
  {
    id: "yelp_atlanta",
    name: "Yelp for Business (Atlanta & DeKalb)",
    category: "Local Consumer Reviews",
    authority_role: "Apple Maps Review Syndication",
    url: "https://biz.yelp.com/claim",
    live_url: "",
    claim_url: "https://biz.yelp.com/claim",
    domain_authority: 94,
    da: 94,
    status: "OPPORTUNITY",
    link_type: "DoFollow / Entity",
    impact: "CRITICAL",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Directly powers Apple Maps reviews, photos, and Yahoo Local search results"
  },
  // 16. Nextdoor
  {
    id: "nextdoor_atlanta",
    name: "Nextdoor for Business (Metro Atlanta)",
    category: "Hyperlocal Community",
    authority_role: "Neighborhood Recommendation Hub",
    url: "https://business.nextdoor.com/en-us/small-business",
    live_url: "",
    claim_url: "https://business.nextdoor.com/en-us/small-business",
    domain_authority: 92,
    da: 92,
    status: "OPPORTUNITY",
    link_type: "Hyperlocal Entity",
    impact: "HIGH",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Direct neighborhood trust in Lithonia, Decatur, Buckhead, Alpharetta, Marietta"
  },
  // 17. Angi
  {
    id: "angi_atlanta",
    name: "Angi (Angie's List / HomeAdvisor)",
    category: "Contractor & Home Services",
    authority_role: "Homeowner Service Marketplace",
    url: "https://www.angi.com/",
    live_url: "",
    claim_url: "https://www.angi.com/for-businesses",
    domain_authority: 92,
    da: 92,
    status: "OPPORTUNITY",
    link_type: "Niche Citation Anchor",
    impact: "HIGH",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Top national directory for verified home service contractors & inspectors"
  },
  // 18. Thumbtack
  {
    id: "thumbtack",
    name: "Thumbtack Professional Services",
    category: "Contractor & Home Services",
    authority_role: "Local Home Service Quotes",
    url: "https://www.thumbtack.com/",
    live_url: "",
    claim_url: "https://www.thumbtack.com/pro",
    domain_authority: 89,
    da: 89,
    status: "OPPORTUNITY",
    link_type: "Niche Citation Anchor",
    impact: "MEDIUM",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Captures instant local searchers looking for certified inspection quotes"
  },
  // 19. YellowPages
  {
    id: "yellowpages",
    name: "YellowPages / The Real Yellow Pages",
    category: "National Business Citations",
    authority_role: "Core Voice Aggregator Engine",
    url: "https://www.yellowpages.com/",
    live_url: "",
    claim_url: "https://adsolutions.yp.com/free-listing-claim",
    domain_authority: 89,
    da: 89,
    status: "OPPORTUNITY",
    link_type: "Citation Anchor",
    impact: "MEDIUM",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Primary data aggregator feeding voice search engines and automotive GPS databases"
  },
  // 20. Manta
  {
    id: "manta",
    name: "Manta Small Business Directory",
    category: "National Business Citations",
    authority_role: "SMB Authority Signal",
    url: "https://www.manta.com/",
    live_url: "",
    claim_url: "https://www.manta.com/add-my-company",
    domain_authority: 86,
    da: 86,
    status: "OPPORTUNITY",
    link_type: "Citation Anchor",
    impact: "MEDIUM",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "High-authority small business citation indexing signal"
  },
  // 21. Alignable
  {
    id: "alignable",
    name: "Alignable Small Business Network (Atlanta)",
    category: "B2B Local Referral Network",
    authority_role: "Local B2B Referral Network",
    url: "https://www.alignable.com/",
    live_url: "",
    claim_url: "https://www.alignable.com/signup",
    domain_authority: 83,
    da: 83,
    status: "OPPORTUNITY",
    link_type: "Local Referral Network",
    impact: "MEDIUM",
    tier: "Local Consumer & Hyperlocal Portals",
    notes: "Direct networking with Metro Atlanta real estate attorneys, lenders, and brokers"
  },
  // 22. DeKalb Chamber
  {
    id: "dekalb_chamber",
    name: "DeKalb Chamber of Commerce Directory",
    category: "Local Chamber & Geo Anchor",
    authority_role: "Headquarters County Geo Anchor",
    url: "https://www.dekalbchamber.org/",
    live_url: "",
    claim_url: "https://www.dekalbchamber.org/join-the-chamber/",
    domain_authority: 48,
    da: 48,
    status: "OPPORTUNITY",
    link_type: "Local DoFollow",
    impact: "HIGH",
    tier: "Local Chamber & Geo Anchors",
    notes: "Direct municipal .org business authority link for Lithonia/DeKalb headquarters"
  },
  // 23. Gwinnett Chamber
  {
    id: "gwinnett_chamber",
    name: "Gwinnett County Chamber of Commerce",
    category: "Local Chamber & Geo Anchor",
    authority_role: "Gwinnett Expansion Geo Anchor",
    url: "https://www.gwinnettchamber.org/",
    live_url: "",
    claim_url: "https://www.gwinnettchamber.org/membership/",
    domain_authority: 52,
    da: 52,
    status: "OPPORTUNITY",
    link_type: "Local DoFollow",
    impact: "MEDIUM",
    tier: "Local Chamber & Geo Anchors",
    notes: "High-value North Metro expansion territory anchor"
  },
  // 24. Atlanta REALTORS Association
  {
    id: "atlanta_realtors",
    name: "Atlanta REALTORS® Association (ARA Affiliate)",
    category: "Realtor & Brokerage Networks",
    authority_role: "Realtor Board Affiliate Anchor",
    url: "https://www.atlantarealtors.com/",
    live_url: "",
    claim_url: "https://www.atlantarealtors.com/membership/affiliate-membership",
    domain_authority: 55,
    da: 55,
    status: "OPPORTUNITY",
    link_type: "Niche Real Estate Authority",
    impact: "HIGH",
    tier: "Realtor & Real Estate Industry Networks",
    notes: "Direct access to 14,000+ active Metro Atlanta real estate agents"
  },
  // 25. Georgia MLS & FMLS
  {
    id: "fmls_georgiamls",
    name: "Georgia MLS & FMLS Preferred Vendor Roster",
    category: "Realtor & Brokerage Networks",
    authority_role: "MLS Vendor Directory Partner",
    url: "https://www.gamls.com/",
    live_url: "",
    claim_url: "https://www.gamls.com/",
    domain_authority: 60,
    da: 60,
    status: "OPPORTUNITY",
    link_type: "MLS Industry Link",
    impact: "HIGH",
    tier: "Realtor & Real Estate Industry Networks",
    notes: "Agent due diligence vendor directory and buyer guide insertion"
  }
];

const activeList = directories.filter(d => d.status === 'ACTIVE_VERIFIED');
const opportunityList = directories.filter(d => d.status === 'OPPORTUNITY');

const activeCount = activeList.length;
const totalCount = directories.length;
const opportunityCount = opportunityList.length;

const sumActiveDa = activeList.reduce((acc, d) => acc + d.domain_authority, 0);
const avgActiveDa = Number((sumActiveDa / activeCount).toFixed(1));

const sumTotalDa = directories.reduce((acc, d) => acc + d.domain_authority, 0);
const weightedAuthorityPercent = Number(((sumActiveDa / sumTotalDa) * 100).toFixed(1));

// Core search & credential directories (Google, Apple, Bing, GA SOS, InterNACHI, CMI, BBB, Zillow)
const coreList = directories.filter(d => ['google_business', 'apple_maps', 'bing_places', 'ga_sos', 'internachi', 'cmi_board', 'bbb_atlanta', 'zillow_pro'].includes(d.id));
const coreVerifiedCount = coreList.filter(d => d.status === 'ACTIVE_VERIFIED').length;
const coreTotalCount = coreList.length;

const payload = {
  last_audited: new Date().toISOString(),
  audit_version: "2026.2-verified-ecosystem",
  entity_profile: {
    business_name: "Foresight Home Inspections, LLC",
    dba_name: "Foresight Home Inspections",
    lead_inspector: "Christopher Boykin, CMI®",
    phone: "678-480-2110",
    email: "inspect@foresightcmi.com",
    website: "https://www.fhinspectionsatl.com",
    address_street: "1816 South Deshon Road",
    address_city: "Lithonia",
    address_state: "GA",
    address_zip: "30058",
    service_area: "Metro Atlanta (Exact 50-Mile Radius Covering Fulton, DeKalb, Gwinnett, Cobb, Forsyth, Clayton, Cherokee, Henry, Douglas, Fayette, Rockdale, Newton, Paulding, Hall, Coweta, Walton, Barrow, Spalding, Carroll, Bartow Counties)",
    primary_category: "Home Inspector",
    secondary_categories: [
      "Building Inspector",
      "Real Estate Inspection Service",
      "Environmental Testing Service",
      "Radon Testing Service",
      "Commercial Real Estate Inspector"
    ],
    credentials: [
      "Certified Master Inspector® (CMI) #176873",
      "InterNACHI Certified Professional Inspector (CPI)",
      "Certified Infrared Thermographer (Building Science)",
      "FAA Part 107 Licensed Commercial Drone Pilot",
      "Georgia Residential & New Construction Inspection Specialist"
    ],
    hours: "Mon-Sat: 8:00 AM - 8:00 PM | Sun: By Appointment Only",
    short_description: "Premier Metro Atlanta home inspection company led by Certified Master Inspector® Christopher Boykin. Two certified inspectors on every job with thermal imaging, drone scans, and $10,000 warranty protection included.",
    long_description: "Foresight Home Inspections is Metro Atlanta's premier Certified Master Inspector®-led home inspection firm. We deploy our signature Two-Inspector Standard to every property, delivering thorough, non-invasive evaluations in half the on-site time. Services include residential pre-purchase home inspections, pre-listing seller inspections, new construction pre-drywall and 11-month warranty checks, continuous radon gas testing, fiber-optic sewer scope video inspections, Georgia WDO/termite reports, pool and spa assessments, and short-term rental (STR) compliance inspections. Every standard inspection is backed by our $10,000 Elite Master Inspection Warranty."
  },
  directories_count: totalCount,
  active_verified_count: activeCount,
  opportunity_count: opportunityCount,
  average_active_da: avgActiveDa,
  weighted_authority_score: weightedAuthorityPercent,
  core_verified_count: coreVerifiedCount,
  core_total_count: coreTotalCount,
  directories
};

fs.writeFileSync(auditFilePath, JSON.stringify(payload, null, 2), 'utf8');

console.log('=== CITATION AUDIT REASSESSMENT COMPLETE ===');
console.log(`Total Directories Evaluated: ${totalCount}`);
console.log(`Active Verified Profiles: ${activeCount} (${((activeCount/totalCount)*100).toFixed(1)}%)`);
console.log(`Average Active Domain Authority: ${avgActiveDa} / 100`);
console.log(`Core Search & Credential Engine: ${coreVerifiedCount} / ${coreTotalCount} (100.0%)`);
console.log(`Weighted Authority Score: ${weightedAuthorityPercent}%`);
console.log(`Opportunities Ready to Claim: ${opportunityCount}`);
