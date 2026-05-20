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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required.');
  process.exit(1);
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
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
