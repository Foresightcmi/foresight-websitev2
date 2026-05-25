#!/usr/bin/env node
/**
 * Autonomous Blog Post Generator for Foresight Home Inspections
 * 
 * Uses Google Gemini API to generate SEO-optimized blog posts about
 * home inspections, real estate trends, and maintenance tips.
 * 
 * Usage: GEMINI_API_KEY=your_key node scripts/generate-blog-post.mjs
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
        process.env[key] = val.replace(/^["']|["']$/g, ''); // strip optional surrounding quotes
      }
    }
  }
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY environment variable is not defined. Local fallback generator will be used.');
}

// Topic rotation — cycles weekly so content stays varied
const TOPIC_CATEGORIES = [
  {
    category: "Market Trends",
    prompt: "Write about a current real estate market trend in the Metro Atlanta / Georgia area and how it specifically impacts home inspections. Examples: rising interest rates leading to more thorough inspections, new construction boom in suburbs, investor flips requiring careful inspection, aging housing stock concerns. Use real Georgia cities and counties."
  },
  {
    category: "Maintenance Tips",
    prompt: "Write seasonal home maintenance tips for Georgia homeowners. Focus on practical, actionable advice that a first-time homebuyer would find valuable. Cover things like HVAC maintenance, gutter cleaning, crawlspace moisture, roof care, plumbing winterization, or pest prevention based on the current season."
  },
  {
    category: "Inspection Insights",
    prompt: "Write about a common home inspection finding and explain what it means in simple terms for a first-time homebuyer. Examples: water heater issues, electrical panel problems, roof ventilation, foundation cracks, grading and drainage, HVAC efficiency, plumbing concerns. Use the 3-step format: Observation, What This Could Mean, Recommendation."
  },
  {
    category: "Buyer Education",
    prompt: "Write an educational guide for first-time homebuyers in Metro Atlanta. Topics could include: what to expect during a home inspection, how to read an inspection report, negotiating repairs after an inspection, the difference between home inspection and appraisal, why you shouldn't skip an inspection on a new build, understanding your home warranty."
  },
  {
    category: "Technology & Innovation",
    prompt: "Write about technology used in modern home inspections and how it benefits homebuyers. Topics: thermal imaging for hidden moisture, drone roof inspections, digital reporting with photos and video, radon monitoring technology, moisture meters, sewer scope cameras. Explain how Foresight Home Inspections uses these tools."
  },
  {
    category: "Health & Safety",
    prompt: "Write about a home health or safety topic relevant to Georgia homeowners. Topics: radon gas risks, mold prevention in humid climates, carbon monoxide dangers, lead paint in older homes, asbestos awareness, electrical fire prevention, water quality concerns. Provide actionable advice."
  },
  {
    category: "Local Spotlight",
    prompt: "Write about home inspection considerations specific to a Metro Atlanta community. Discuss the local housing stock, common building styles, typical issues found in that area's homes, and how local climate or soil conditions affect home maintenance. Pick a specific city or county in the Metro Atlanta area."
  }
];

async function generateWithGemini(topicPrompt, category) {
  const systemPrompt = `You are writing a blog post for Foresight Home Inspections, LLC — a premium home inspection company in Metro Atlanta, Georgia.

AUTHOR: Christopher Boykin, Certified Master Inspector (CMI) through InterNACHI
COMPANY FACTS:
- Two certified inspectors on every job
- $10,000 Elite Master Inspection Warranty included free
- Thermal imaging included at no extra cost
- Phone: 678-480-2110
- Serves 163+ cities across Metro Atlanta

WRITING STYLE:
- Write for a first-time homebuyer with a high school reading level
- Be warm, professional, and genuinely helpful — not salesy
- Use specific examples and real numbers when possible
- Keep paragraphs short (2-3 sentences max)
- Include practical, actionable advice
- Naturally mention services/pricing only 1-2 times (not every paragraph)
- Use "What this could mean" (NOT "What this means") for any educational explanations
- Recommendations must ONLY say "Have a licensed [trade] contractor evaluate further and repair as needed" (InterNACHI compliance)

OUTPUT FORMAT (return ONLY valid JSON, no markdown):
{
  "title": "SEO-optimized title (50-65 characters ideal)",
  "description": "Meta description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "content": "<p>HTML content here</p><h2>Subheading</h2><p>More content</p>"
}

REQUIREMENTS:
- Title must be compelling and include a location keyword (Georgia, Atlanta, Metro Atlanta)
- Content should be 600-900 words
- Use <h2> for subheadings (3-4 subheadings)
- Use <ul>/<li> for lists
- Use <strong> for key terms
- Include 1 internal link to /quote and 1 to /ask-twin using <a href="/quote"> format
- Do NOT include any images, the system will handle that
- Content must be original, factual, and helpful`;

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nTOPIC: ${topicPrompt}\n\nWrite the blog post now. Return ONLY the JSON object, no other text.` }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error('No content returned from Gemini API');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = rawText.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    return JSON.parse(jsonStr);
  } catch (apiError) {
    console.warn('\n⚠️ Gemini API failed or key is missing. Activating Local Fallback Generator...');
    
    // Select fallback template based on current week or random rotation
    const fallbackTemplates = [
      {
        category: "Inspection Insights",
        title: "Metro Atlanta Short-Term Rental (STR) Compliance Assist Guide",
        description: "Foresight provides professional third-party safety audits to help Airbnb and Vrbo operators meet Metro Atlanta Short-Term Rental (STR) compliance rules.",
        keywords: ["Short-Term Rental Compliance Atlanta", "STR inspection Georgia", "Airbnb inspection Cobb County", "Vrbo safety audit Atlanta"],
        content: "<p>If you operate an Airbnb or Vrbo in Metro Atlanta, you've likely noticed a significant shift in local regulations. Surrounding counties and cities across the Metro Atlanta area (including DeKalb, Fulton, Gwinnett, Cobb, and more) are requiring active compliance inspections for short-term rental (STR) operators to obtain or renew their business licenses. Since every municipality features unique local ordinances, zoning requirements, and safety checklists, staying compliant can feel like a moving target.</p><p>At Foresight Home Inspections, LLC, we understand that your rental property is a business that relies on being active and bookable. That is why we offer dedicated <strong>Short-Term Rental (STR) Compliance Assist</strong> services. We send a dual-inspector team to perform standardized, third-party safety audits starting at our highly competitive base rates, ensuring your listing remains fully compliant and online without interruptions.</p><h2>The Rising Wave of STR Regulations in Metro Atlanta</h2><p>Municipalities across Georgia are cracking down on unregistered short-term rentals. For instance, cities like Atlanta, Sandy Springs, Decatur, and Marietta, as well as counties like Cobb and DeKalb, have established strict safety inspection protocols. To qualify for an STR license, hosts must submit proof of a certified third-party safety inspection.</p><p>These local ordinances are designed to protect guests, but a single failed item can delay your permit for weeks, costing you valuable booking revenue. <strong>What this could mean</strong> is that you could face heavy local fines, listing suspension on Airbnb and Vrbo, or outright denial of your business license. Our recommendation is: have a licensed third-party inspector perform a pre-compliance safety audit and repair any noted defects as needed.</p><h2>What a Short-Term Rental Safety Audit Covers</h2><p>During an STR compliance inspection, our inspectors check a comprehensive list of health and safety items required by most Georgia local governments. Some of the most critical checklist items include:</p><ul><li><strong>Smoke and Carbon Monoxide Detectors</strong> — Must be installed in every bedroom, on every level of the home, and tested to ensure they are fully operational and not expired.</li><li><strong>Emergency Egress</strong> — Every sleeping room must feature a primary window or door that opens easily from the inside without keys or special tools, providing a safe escape route.</li><li><strong>Electrical Panel and Outlet Safety</strong> — All outlets in kitchens, bathrooms, and wet bars must be GFCI-protected, and the main breaker panel must be clear of any fire hazards or double-taps.</li><li><strong>Fire Extinguishers</strong> — A fully charged, multi-purpose fire extinguisher (typically 2A:10BC rated) must be mounted in a highly visible location, such as the kitchen, with active certification tags.</li><li><strong>Structural & Deck Safety</strong> — Railings on stairs and balconies must be secure, and spindles must be spaced close enough to prevent falls, meeting local structural building codes.</li></ul><h2>The Foresight STR Advantage</h2><p>Why choose Foresight for your STR compliance audit? We don't just mark pass or fail—we help you get it right. By sending <strong>two certified inspectors</strong>, we can perform a highly efficient walkthrough of your property. We provide a detailed digital report with high-resolution photos and video within 24 hours that you can submit directly to county licensing portals.</p><p>Our STR safety audits start at our standard flat base rate of <strong>$355+</strong> based on the size of your property. Additionally, because Christopher Boykin is a Certified Master Inspector, every safety audit includes our standard elite InterNACHI-backed standards. We cover your major mechanicals (HVAC, plumbing, electrical) and structural framing, giving you and your guests absolute peace of mind.</p><h2>Schedule Your Compliance Audit Today</h2><p>Don't wait until your listing gets flagged or suspended by Vrbo or Airbnb. Safeguard your short-term rental business, protect your guests, and satisfy your county's safety requirements in one simple step. Use our <a href=\"/quote\">Instant Quote Calculator</a> to calculate your exact flat-rate fee and book your appointment, or click to <a href=\"/ask-twin\">chat with Foresight AI</a> to ask any specific compliance questions about your local Georgia county's STR ordinances 24/7!</p>"
      },
      {
        category: "Maintenance Tips",
        title: "Crawlspace Moisture: The Silent Threat to Georgia Foundations",
        description: "Crawlspace moisture is a major risk in Metro Atlanta. Learn the signs of wood rot and foundation damage from Certified Master Inspector Christopher Boykin.",
        keywords: ["crawlspace moisture", "foundation issues Georgia", "home inspection Atlanta", "wood rot crawlspace"],
        content: "<p>In Metro Atlanta and across Georgia, many homes are built over a crawlspace rather than a basement or slab. Crawlspaces are incredibly common, but they also host one of the most frequent findings we uncover during home inspections: <strong>crawlspace moisture</strong>. Because of our highly humid summers and clay soils, moisture in crawlspaces is a silent threat that can damage structural integrity and diminish indoor air quality.</p><p>At Foresight Home Inspections, we send <strong>two certified inspectors</strong> on every single property audit. One of our primary tasks is to crawl directly into these tight spaces, equipped with FLIR thermal imaging cameras and digital moisture meters, to see what is happening beneath your feet. We don't just stand at the access door—we scan every corner of the floor framing to make sure your home is fully protected.</p><h2>Why Crawlspace Moisture is a Major Risk in Georgia</h2><p>Crawlspaces naturally accumulate humidity because they are situated directly over the bare soil. In North Georgia, heavy summer rains soak the clay around foundations, and this moisture slowly evaporates into the crawlspace air. When that warm, damp air contacts cooler floor joists or AC ducts, it condenses into water droplets.</p><p>If wood joists are exposed to this water for long periods, they begin to decay. Over time, this leads to structural sagging, spongy floors, and the growth of active mold spores. <strong>What this could mean</strong> is that your subfloor is rotting, your family is breathing mold spores through floor vents, or your foundation structure is losing its load-bearing capacity. Our recommendation in these situations is: have a licensed structural or moisture mitigation contractor evaluate further and repair as needed.</p><h2>Common Signs of a Wet Crawlspace You Can Spot</h2><p>While you might not want to crawl under your house yourself, there are several warning signs you can easily spot from inside your living spaces:</p><ul><li><strong>Musty Odors</strong> — A persistent, damp smell in the home, particularly near baseboards and closets, is a classic sign of crawlspace mold.</li><li><strong>Cupping Wood Floors</strong> — When crawlspace humidity is high, the bottom of hardwood flooring absorbs moisture and expands, causing the edges of the boards to cup or warp upward.</li><li><strong>Sagging or Soft Spots</strong> — If walking across your living room feels slightly bouncy or uneven, the floor framing below may have lost strength due to rot.</li><li><strong>High Indoor Humidity</strong> — Up to 50% of the air on the first floor of a home originates in the crawlspace due to the \"stack effect.\" A wet crawlspace directly raises humidity throughout the house.</li></ul><h2>How to Solve Crawlspace Moisture Concerns</h2><p>Fixing crawlspace moisture depends on how severe the water intrusion is. For minor humidity, installing a thick 6-mil or 10-mil <strong>vapor barrier</strong> over the bare soil is highly effective. The plastic barrier blocks ground moisture from rising into the air and keeps floor joists dry.</p><p>For more active leaks, a combination of a sump pump, perimeter french drains, or a crawlspace dehumidifier might be required. In extreme cases, full crawlspace encapsulation—where the space is completely sealed, insulated, and conditioned—is the gold standard. If we find excessive standing water or falling insulation under your house, our recommendation is: have a licensed crawlspace encapsulation contractor evaluate further and repair as needed.</p><h2>Get Professional Peace of Mind Today</h2><p>At Foresight Home Inspections, we believe in giving buyers and homeowners clear, photographic evidence of their home's condition. That is why we include high-definition photos of crawlspaces and full thermal camera scans at no extra charge. Every inspection we perform is also backed by our elite <strong>$10,000 Peace of Mind Protection Warranty</strong> at no additional cost, covering your structural wood framing and major systems for 90 days after closing.</p><p>Whether you're buying a cozy bungalow in Decatur or a spacious home in Alpharetta, don't let crawlspace issues surprise you after closing. You can calculate your transparent dual-inspector quote using our <a href=\"/quote\">Instant Quote Calculator</a>, or click to <a href=\"/ask-twin\">chat with Foresight AI</a> to ask any home maintenance questions 24/7!</p>"
      },
      {
        category: "Inspection Insights",
        title: "Understanding Your Georgia Home Inspection Report: Red Flags vs. Maintenance",
        description: "Received your home inspection report and not sure what is a major issue? Certified Master Inspector Christopher Boykin explains how to read and negotiate findings.",
        keywords: ["home inspection report Atlanta", "home inspection red flags", "negotiate home inspection Georgia"],
        content: "<p>Receiving a 50-page home inspection report can be overwhelming. As a first-time homebuyer in Georgia, it is easy to panic when you see dozens of items marked as defects. However, it is essential to distinguish between safety hazards, major structural failures, and routine maintenance items.</p><p>At Foresight Home Inspections, we send <strong>two certified inspectors</strong> on every single property audit. Our digital reports highlight safety concerns and major defects clearly, so you know exactly what needs attention and what is just a recommendation for the future.</p><h2>Major Red Flags to Focus On</h2><p>When reviewing your report, prioritize major systems and safety hazards. These are the items that have significant repair costs or pose immediate safety threats:</p><ul><li><strong>Active Water Leaks</strong> — Water running behind tiles or under slabs.</li><li><strong>Federal Pacific or Zinsco Panels</strong> — Outdated electrical panels known for safety failures.</li><li><strong>Structural Foundation Settlement</strong> — Major cracks or bowing basement walls.</li><li><strong>HVAC heat exchanger cracks</strong> — Hazardous carbon monoxide leaks.</li></ul><p><strong>What this could mean</strong> is that the home has underlying safety risks or requires immediate, expensive contractor repairs. Our standard recommendation is: have a licensed trade contractor evaluate further and repair as needed.</p><h2>Standard Maintenance Items</h2><p>Minor findings like dirty filters, loose door handles, missing caulking around tubs, or small drywall cracks are normal maintenance. They are not structural failures or reasons to walk away from a transaction. Our goal is to equip you with the knowledge to maintain your home for years to come. You can check pricing and get a transparent price quote using our <a href=\"/quote\">Instant Quote Calculator</a>, or <a href=\"/ask-twin\">chat with Foresight AI</a> to get detailed maintenance timelines 24/7!</p>"
      }
    ];

    const weekNumber = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));
    const selectedTemplate = fallbackTemplates[weekNumber % fallbackTemplates.length];
    
    console.log(`✨ Activated Local Fallback: "${selectedTemplate.title}"`);
    return selectedTemplate;
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

async function main() {
  console.log('🤖 Foresight Blog Generator — Starting...\n');

  // Load existing posts
  let posts = [];
  if (fs.existsSync(POSTS_FILE)) {
    posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
  }

  // Check for keyword brief from the discovery agent
  const KEYWORD_BRIEF_FILE = path.join(__dirname, '..', 'data', 'keyword-brief.json');
  let keywordBrief = null;
  if (fs.existsSync(KEYWORD_BRIEF_FILE)) {
    try {
      keywordBrief = JSON.parse(fs.readFileSync(KEYWORD_BRIEF_FILE, 'utf8'));
      console.log(`🔍 Keyword brief found: "${keywordBrief.targetKeyword}" (score: ${keywordBrief.score})`);
      console.log(`   Related: ${keywordBrief.relatedKeywords?.join(', ')}\n`);
    } catch {
      console.log('⚠️ Could not parse keyword brief, using topic rotation.\n');
    }
  }

  let topicPrompt;
  let category;

  if (keywordBrief && keywordBrief.targetKeyword) {
    // Use keyword-driven content generation
    category = "Trending Topic";
    const relatedStr = keywordBrief.relatedKeywords?.length
      ? `\n\nAlso try to naturally address these related search queries:\n- ${keywordBrief.relatedKeywords.join('\n- ')}`
      : '';

    topicPrompt = `Write a blog post specifically targeting this search query that people are actively searching for on Google right now: "${keywordBrief.targetKeyword}"

The post MUST:
1. Use the exact phrase "${keywordBrief.targetKeyword}" in the title and first paragraph
2. Answer the searcher's intent directly and thoroughly
3. Provide unique, expert-level value that no competitor would offer
4. Mention specific Georgia/Atlanta context where relevant
5. Include practical takeaways the reader can act on immediately${relatedStr}

Write this as if you're the #1 expert answering this exact question. The goal is to rank #1 on Google for "${keywordBrief.targetKeyword}".`;

    console.log(`🎯 Mode: KEYWORD-DRIVEN (targeting real search demand)`);
  } else {
    // Fallback to topic rotation
    const weekNumber = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000));
    const topicIndex = weekNumber % TOPIC_CATEGORIES.length;
    const topic = TOPIC_CATEGORIES[topicIndex];
    topicPrompt = topic.prompt;
    category = topic.category;
    console.log(`📝 Mode: TOPIC ROTATION — ${category}`);
  }

  console.log(`📌 Category: ${category}\n`);

  // Generate the blog post
  console.log('⏳ Generating blog post with Gemini...');
  const generated = await generateWithGemini(topicPrompt, category);

  console.log(`✅ Generated: "${generated.title}"\n`);

  // Create the post object
  const today = new Date().toISOString().split('T')[0];
  const slug = generateSlug(generated.title);

  // Check for duplicate slugs
  if (posts.some(p => p.slug === slug)) {
    console.log(`⚠️ Slug "${slug}" already exists. Appending date.`);
  }

  const finalSlug = posts.some(p => p.slug === slug) ? `${slug}-${today}` : slug;

  const newPost = {
    slug: finalSlug,
    title: generated.title,
    description: generated.description,
    date: today,
    author: "Christopher Boykin, CMI",
    category,
    keywords: [
      ...(generated.keywords || []),
      ...(keywordBrief?.targetKeyword ? [keywordBrief.targetKeyword] : []),
      ...(keywordBrief?.relatedKeywords?.slice(0, 3) || []),
    ],
    content: generated.content,
    targetKeyword: keywordBrief?.targetKeyword || null,
  };

  // Add to posts array (newest first)
  posts.unshift(newPost);

  // Save
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`💾 Saved to ${POSTS_FILE}`);
  console.log(`📊 Total posts: ${posts.length}`);
  console.log(`🔗 URL: /blog/${finalSlug}`);

  // Clean up keyword brief after use
  if (fs.existsSync(KEYWORD_BRIEF_FILE)) {
    fs.unlinkSync(KEYWORD_BRIEF_FILE);
    console.log('🧹 Keyword brief consumed and removed');
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
