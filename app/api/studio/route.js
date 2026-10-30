import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { FORESIGHT_UNIFIED_PERSONA } from '../../../lib/foresight-persona.mjs';

// Vercel Pro Extended Serverless Execution (up to 300s / 800s)
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

function readJsonSafe(relPath, fallback = []) {
  try {
    const full = path.join(process.cwd(), relPath);
    if (fs.existsSync(full)) {
      return JSON.parse(fs.readFileSync(full, 'utf8'));
    }
  } catch {}
  return fallback;
}

export async function GET() {
  const truth = readJsonSafe('data/truth.json', {});
  const underContract = readJsonSafe('data/under-contract-realtors.json', []);
  const cloudQueue = readJsonSafe('data/cloud-realtor-nurture-queue.json', []);
  const cloudState = readJsonSafe('data/cloud-realtor-nurture-state.json', {});
  const warrantyCrm = readJsonSafe('data/warranty-tracker-crm.json', []);
  const unsubscribed = readJsonSafe('data/unsubscribed_contacts.json', []);
  const linkedInPosts = readJsonSafe('data/linkedin-tobi-engine.json', []);
  const studioPackets = readJsonSafe('data/unified-studio-packets.json', []);
  const outreachLog = readJsonSafe('data/due-diligence-outreach-log.json', []);
  const socialQueue = readJsonSafe('data/social-queue.json', []);

  return NextResponse.json({
    ok: true,
    priorityOneHub: FORESIGHT_UNIFIED_PERSONA.priorityOneHub,
    persona: FORESIGHT_UNIFIED_PERSONA,
    plan: 'Vercel Pro Unified Command Hub',
    maxDurationSeconds: 300,
    truth,
    metrics: {
      activeDueDiligence48h: underContract.length,
      cloudRealtorQueueCount: Array.isArray(cloudQueue) ? cloudQueue.length : (cloudQueue.contacts?.length || 0),
      cloudEmailsSentTotal: cloudState.totalSent || 0,
      warrantyClientsTracked: Array.isArray(warrantyCrm) ? warrantyCrm.length : (warrantyCrm.clients?.length || 0),
      suppressedOptOuts: Array.isArray(unsubscribed) ? unsubscribed.length : 0,
      linkedInStoriesReady: Array.isArray(linkedInPosts) ? linkedInPosts.length : (linkedInPosts.posts?.length || 0),
      videoStudioPacketsReady: Array.isArray(studioPackets) ? studioPackets.length : 0,
      dueDiligenceDispatchedTotal: Array.isArray(outreachLog) ? outreachLog.length : 0,
      socialQueueOmnichannelCount: Array.isArray(socialQueue) ? socialQueue.length : 0
    },
    socialQueue: Array.isArray(socialQueue) ? socialQueue : [],
    recentUnderContract: underContract.slice(0, 12),
    studioPackets: Array.isArray(studioPackets) ? studioPackets.slice(0, 12) : [],
    linkedInPosts: (Array.isArray(linkedInPosts) ? linkedInPosts : (linkedInPosts.posts || [])).slice(0, 8)
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const topic = String(body.topic || 'Phase 1 Pre-Drywall & New Construction Inspections').trim().slice(0, 140);
    const city = String(body.city || 'Atlanta').trim().slice(0, 60);
    const audience = String(body.audience || 'Both Buyers & Realtors').trim();
    const truth = readJsonSafe('data/truth.json', {});
    const p = truth.pricing || {};

    const isDeKalb = /dekalb|decatur|lithonia|stone mountain|dunwoody|brookhaven|tucker|chamblee|clarkston|doraville|avondale|stonecrest|redan/i.test(city) || /dekalb|low-flow/i.test(topic);
    const dekalbPrice = p.dekalbLowFlow || 'Call for Quote';
    const dekalbNote = isDeKalb
      ? ` Plus, for pre-1993 unincorporated DeKalb homes, we provide same-day signed DeKalb Low-Flow Plumbing Certificates (${dekalbPrice}: 1.6 GPF toilets, 2.5 GPM showers, 2.0 GPM bath faucets, 2.2 GPM kitchen faucets).`
      : '';

    const packet = {
      generatedAt: new Date().toISOString(),
      topic,
      city,
      audience,
      canonicalPricingLock: {
        singleFamily: `From ${p.singleFamily || '$345'}`,
        condoTownhome: `From ${p.condoTownhome || '$295'}`,
        preDrywall: `From ${p.preDrywall || '$275'}`,
        newConstruction: `From ${p.newConstruction || '$400'}`,
        elevenMonthWarranty: `From ${p.elevenMonthWarranty || '$345'}`,
        dekalbLowFlow: dekalbPrice,
        combinedWarranty: truth.business?.warranties?.combinedProtection || '$35,000'
      },
      videoStudioScript: {
        avatarPrompt: `@plsinspectnow standing on-site in ${city}, Georgia wearing a crisp Foresight Home Inspections polo, warm natural daylight, 9:16 vertical 4K.`,
        hook0to3s: `Buying or building a home in ${city}? Here is what most people miss about ${topic} before closing—and how catching it early saves thousands in seller credits.`,
        body3to22s: `I'm Christopher Boykin, Certified Master Inspector with Foresight Home Inspections. Under InterNACHI Standards of Practice, we send two certified inspectors to every property—evaluating structural framing, roofing, electrical, plumbing, and HVAC with free calibrated infrared thermal imaging and free 4K aerial drone roof scans.${dekalbNote}`,
        cta22to29s: `Single-family homes start from ${p.singleFamily || '$345'}, condos from ${p.condoTownhome || '$295'}, Phase 1 Pre-Drywall from ${p.preDrywall || '$275'}, and New Construction from ${p.newConstruction || '$400'}—all backed by up to $35,000 in warranty protection. Book in 30 seconds at fhinspectionsatl.com/quote or call (678) 480-2110.`
      },
      carouselSlides: [
        `Slide 1 (Hook): ${topic} in ${city}, GA — What Every Buyer & Realtor Needs to Check Before Closing`,
        `Slide 2 (The Hidden Risk & Negotiation Leverage): Georgia does not require a state license for home inspectors. Catching concealed moisture, roof flashing leaks, and electrical hazards inside due diligence saves buyers $1,500–$12,000+ in seller repair credits.`,
        `Slide 3 (The 2-Inspector CMI Standard): Foresight sends 2 Certified Inspectors to every home (1.5–2.5 hrs on-site) + Free Calibrated Infrared Thermal Imaging + Free 4K Drone Roof Scan.`,
        `Slide 4 (Transparent Starting Pricing): Homes from ${p.singleFamily || '$345'} • Condos from ${p.condoTownhome || '$295'} • Pre-Drywall from ${p.preDrywall || '$275'} / New Construction from ${p.newConstruction || '$400'} • 11-Month Warranty from ${p.elevenMonthWarranty || '$345'}.`,
        `Slide 5 (Action): Backed by $35,000 in Combined Warranty & Guarantee Protection. Instant quote at fhinspectionsatl.com/quote | (678) 480-2110`
      ],
      socialPosts: {
        gbp: `🏡 ${topic} in ${city}, GA\n\nAt Foresight Home Inspections, LLC, we send two certified inspectors to every job—including free calibrated infrared thermal imaging, free 4K drone roof scans, and same-day interactive digital reports that give buyers and Realtors documented negotiation leverage.${dekalbNote}\n\n✅ Homes from ${p.singleFamily || '$345'} | Condos from ${p.condoTownhome || '$295'} | Pre-Drywall from ${p.preDrywall || '$275'} / New Construction from ${p.newConstruction || '$400'}\n🛡️ Backed by $35,000 in Combined Warranty & Guarantee Protection\n👉 Instant Quote: https://www.fhinspectionsatl.com/quote | (678) 480-2110`,
        linkedin: `Most buyers and agents in ${city} assume a 1-inspector walkthrough catches everything on ${topic}.\n\nHere is what our 2-inspector Certified Master Inspector (CMI) team actually sees in the field across Metro Atlanta—and how documented findings protect thousands of dollars in Georgia Repair Amendment credits:\n\n1. Two pairs of certified eyes on every property (complete in 1.5–2.5 hours with zero inspector fatigue).\n2. Free calibrated infrared thermal imaging & 4K aerial drone roof scans on every full inspection.\n3. Transparent starting rates: Single-Family Homes (From ${p.singleFamily || '$345'}), Condos/Townhomes (From ${p.condoTownhome || '$295'}), Phase 1 Pre-Drywall (From ${p.preDrywall || '$275'}), New Construction Final (From ${p.newConstruction || '$400'}), and 11-Month Builder Warranty (From ${p.elevenMonthWarranty || '$345'}).${dekalbNote}\n4. Up to $35,000 in combined warranty & guarantee protection ($0 deductible).\n\nNeed a rapid 24-hour due diligence slot in ${city}? Grab an instant quote at https://www.fhinspectionsatl.com/quote or text/call (678) 480-2110.`,
        instagramReels: `${topic} in ${city}, GA 🔍🏡 Two Certified Inspectors on every home + Free Infrared Thermal Imaging + Free 4K Drone Roof Scan! Homes from ${p.singleFamily || '$345'}, Condos from ${p.condoTownhome || '$295'}, Pre-Drywall from ${p.preDrywall || '$275'} / New Construction from ${p.newConstruction || '$400'}. Backed by $35,000 in protection. Link in bio or visit https://www.fhinspectionsatl.com/quote #AtlantaRealEstate #AtlantaRealtor #HomeInspection #${city.replace(/\s+/g, '')}GA`
      },
      emailCampaignSnippet: {
        subject: `Quick note on ${topic} for your ${city} buyers (2-Inspector CMI Team)`,
        body: `Hi {{FirstName}},\n\nI work closely with agents in ${city} on ${topic} and wanted to share our current 24-hour due diligence availability.\n\nMy partner and I inspect every home as a two-inspector Certified Master Inspector (CMI) team with active SUPRA eKEY access and same-day digital reports built to maximize your buyer's repair negotiation leverage:\n• Single-Family Homes (From ${p.singleFamily || '$345'}) & Condos/Townhomes (From ${p.condoTownhome || '$295'})\n• Phase 1 Pre-Drywall (From ${p.preDrywall || '$275'}), New Construction Final (From ${p.newConstruction || '$400'}) & 11-Month Warranty (From ${p.elevenMonthWarranty || '$345'})\n• Free Calibrated Infrared Thermal Imaging, Free 4K Drone Roof Scans & $35,000 Combined Protection${dekalbNote ? '\n• ' + dekalbNote.trim() : ''}\n\nInstant Quote: https://www.fhinspectionsatl.com/quote\nDirect Priority Desk: (678) 480-2110\n\nBest regards,\nChristopher Boykin, CMI`
      }
    };

    return NextResponse.json({ ok: true, packet });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
