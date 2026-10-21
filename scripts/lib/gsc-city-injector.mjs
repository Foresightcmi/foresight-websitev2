/**
 * GSC City Injector — natural, deduplicated striking-distance enrichment for city hubs.
 * Replaces the legacy "Certified <strong>exact phrase</strong> and full residential..." bullets.
 * Rules: one sentence per city per service intent, max 2 managed sentences per city,
 * correct per-service pricing (data/truth.json), never touch Meta Title / Description.
 */

export const LEGACY_BULLET_RE = /<li>Certified <strong>[^<]+<\/strong> and full residential property diagnostics[^<]*<\/li>/g;
export const MANAGED_RE = /<li data-gsc="([a-z-]+)">[\s\S]*?<\/li>/g;
export const MAX_MANAGED_PER_CITY = 2;

// Order matters: first match wins.
export const INTENTS = [
  { id: 'sewer', re: /sewer|lateral|camera/, label: 'sewer scope inspection', price: 'a $450 flat rate', path: '/services/sewer-scope-inspection' },
  { id: 'radon', re: /radon/, label: 'radon testing', price: 'a $250 flat rate', path: '/services/radon-testing' },
  { id: 'mold', re: /mold|air quality|iaq/, label: 'mold and air quality testing', price: 'from $450', path: '/services/mold-testing' },
  { id: 'termite', re: /termite|wdo|wood destroying/, label: 'termite and WDO inspection', price: 'from $125', path: '/services/termite-inspection' },
  { id: 'pool', re: /pool|spa/, label: 'pool and spa inspection', price: 'a $300 flat rate', path: '/services/pool-inspection' },
  { id: 'warranty', re: /11 month|11-month|warranty/, label: '11-month builder warranty inspection', price: 'from $335', path: '/services/11-month-warranty-inspection' },
  { id: 'predrywall', re: /pre[\s-]?drywall|framing/, label: 'pre-drywall inspection', price: 'from $275', path: '/services/pre-drywall-inspection' },
  { id: 'newbuild', re: /new construction|new build/, label: 'new construction inspection', price: 'from $400', path: '/services/new-construction-inspection' },
  { id: 'prelisting', re: /pre[\s-]?listing|seller/, label: 'pre-listing inspection', price: 'from $365', path: '/services/pre-listing-inspection' },
  { id: 'commercial', re: /commercial/, label: 'commercial property inspection', price: 'from $750', path: '/services/commercial-property-inspection' },
  { id: 'home', re: /.*/, label: 'home inspection', price: 'from $345 ($295 condos)', path: '/quote' }
];

export function detectIntent(query) {
  const q = String(query || '').toLowerCase();
  return INTENTS.find((i) => i.re.test(q));
}

function hash(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Three phrasings so 15 city pages never share identical boilerplate.
const TEMPLATES = [
  (c, i) => `Booking a ${i.label} in ${c}, GA? Our two-inspector team led by a Certified Master Inspector handles it ${i.price}, with a same-day digital report.`,
  (c, i) => `${cap(i.label)} in ${c}, GA is available ${i.price}. Two certified inspectors on site, infrared thermal imaging included, and a report in under 24 hours.`,
  (c, i) => `${c} buyers and agents use our ${i.label} (${i.price}) to clear due diligence on time, backed by up to $35,000 in warranty and guarantee protection.`
];

export function buildSentence(cityName, intent, slug) {
  const tpl = TEMPLATES[hash(`${cityName}:${intent.id}`) % TEMPLATES.length];
  // City-specific link; "home" intent -> /services/buyer-inspection/<city>, the URL Google already ranks
  // for "home inspection <city>" (GSC query x page, Oct 2026). City hubs must not compete for that query.
  const href = slug ? `/services/${intent.id === 'home' ? 'buyer-inspection' : intent.path.split('/').pop()}/${slug}` : intent.path;
  const text = tpl(cityName, intent).replace(new RegExp(intent.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), (m) => `<a href="${href}">${m}</a>`);
  return `<li data-gsc="${intent.id}">${text}</li>`;
}

export function managedIntents(html) {
  return [...String(html || '').matchAll(MANAGED_RE)].map((m) => m[1]);
}

export function stripLegacy(html) {
  return String(html || '').replace(LEGACY_BULLET_RE, '');
}

/**
 * Apply one striking-distance query to a city record. Returns true if changed.
 * Skips cities flagged "Manual Override" (hand-written home-ring hubs).
 */
export function applyQueryToCity(city, query) {
  if (city['Manual Override']) return false;
  const intent = detectIntent(query);
  const html = stripLegacy(city['Services HTML'] || '<ul></ul>');
  const existing = managedIntents(html);
  if (existing.includes(intent.id) || existing.length >= MAX_MANAGED_PER_CITY) {
    if (html !== city['Services HTML']) { city['Services HTML'] = html; return true; }
    return false;
  }
  city['Services HTML'] = html.replace('</ul>', `${buildSentence(city['City Name'], intent, city.Slug)}</ul>`);
  return true;
}

/** Whole-word city match; longest city name wins (Peachtree Corners beats Peachtree). */
export function matchCity(query, cities) {
  const q = ` ${String(query || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ')} `;
  return cities
    .filter((c) => q.includes(` ${String(c['City Name']).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `))
    .sort((a, b) => b['City Name'].length - a['City Name'].length)[0];
}
