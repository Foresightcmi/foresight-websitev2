import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const B2B_PATH = path.join(ROOT_DIR, 'data', 'b2b-referral-partners.json');
const LO_PATH = path.join(ROOT_DIR, 'data', 'loan-officers.json');
const UNSUB_PRIMARY = path.join(ROOT_DIR, 'data', 'unsubscribed_contacts.json');
const UNSUB_ENGINE = path.resolve(ROOT_DIR, '..', 'email-campaign-engine', 'unsubscribed_contacts.json');
const RETRIEVED_ON = '2026-11-14';

const EXCLUDED_DOMAINS = new Set([
  'ansleyre.com', 'ansleyatlanta.com', 'metrobrokers.com', 'cbcmetrobrokers.com',
  'peachtreetc.com', 'cgrealtyinc.com', 'drhorton.com', 'pulte.com', 'lennar.com',
  'ashtonwoods.com', 'stanleymartin.com', 'centurycommunities.com', 'beazer.com',
  'adamshomes.com', 'rocklynhomes.com', 'meritagehomes.com', 'tollbrothers.com',
  'kbhome.com', 'taylormorrison.com', 'smithdouglas.com', 'chafincommunities.com',
  'chafinrealtyinc.com', 'paranhomes.com', 'dwhomes.com', 'theprovidencegroup.com',
  'relianthomes.com', 'odwyerhomes.com', 'cstonega.com'
]);

const EXCLUDED_NAME_TOKENS = ['amy fuchs', 'joe chapman', 'chapman group realty', 'ansley'];

const METRO_COUNTIES = new Set([
  'fulton', 'cobb', 'dekalb', 'gwinnett', 'forsyth', 'cherokee', 'clayton',
  'henry', 'fayette', 'douglas', 'coweta', 'paulding', 'rockdale', 'newton',
  'bartow', 'walton', 'hall', 'spalding', 'barrow', 'carroll', 'pickens'
]);

function loadSuppressedSet() {
  const suppressed = new Set();
  for (const file of [UNSUB_PRIMARY, UNSUB_ENGINE]) {
    if (!fs.existsSync(file)) continue;
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(raw)) continue;
    for (const item of raw) {
      if (typeof item === 'string') {
        const ps = item.match(/email=([^;\s}]+)/i);
        const val = (ps ? ps[1] : item).trim().toLowerCase();
        if (val.includes('@')) suppressed.add(val);
      } else if (item && typeof item === 'object' && item.email) {
        suppressed.add(String(item.email).trim().toLowerCase());
      }
    }
  }
  return suppressed;
}

function isSuppressed(email, name, company, suppressedSet) {
  const e = String(email || '').trim().toLowerCase();
  if (!e || !e.includes('@')) return true;
  if (suppressedSet.has(e)) return true;
  const domain = e.split('@')[1] || '';
  for (const ex of EXCLUDED_DOMAINS) {
    if (domain === ex || domain.endsWith(`.${ex}`)) return true;
  }
  const combo = `${name || ''} ${company || ''}`.toLowerCase();
  return EXCLUDED_NAME_TOKENS.some((tok) => combo.includes(tok));
}

function decodeCfEmail(hex) {
  if (!hex || hex.length < 4) return '';
  const key = parseInt(hex.slice(0, 2), 16);
  let out = '';
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return out.trim();
}

const mxCache = new Map();
async function resolveMxCached(email) {
  const domain = String(email || '').split('@')[1]?.toLowerCase() || '';
  if (!domain) return false;
  if (mxCache.has(domain)) return mxCache.get(domain);
  let ok = false;
  try {
    const records = await dns.promises.resolveMx(domain);
    ok = Array.isArray(records) && records.some((r) => r && r.exchange);
  } catch {
    ok = false;
  }
  mxCache.set(domain, ok);
  return ok;
}
function formatPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  if (digits.length !== 10) return '';
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function classifyCorridor(cityRaw) {
  const c = String(cityRaw || '').toLowerCase();
  if (/alpharetta|roswell|milton|johns creek|sandy springs|dunwoody/.test(c)) return 'NORTH_FULTON';
  if (/suwanee|duluth|sugar hill|buford|lawrenceville|norcross|peachtree corners|cumming|gainesville/.test(c)) return 'NORTHEAST';
  if (/marietta|smyrna|kennesaw|acworth|woodstock|canton|cartersville|powder springs|vinings|cumberland/.test(c)) return 'NORTHWEST';
  if (/decatur|tucker|stone mountain|lithonia|conyers|covington|loganville|snellville|lilburn|grayson|monroe/.test(c)) return 'EAST';
  if (/peachtree city|newnan|fayetteville|mcdonough|stockbridge|jonesboro|griffin|college park|east point|union city|hampton/.test(c)) return 'SOUTH';
  if (/douglasville|austell|mableton|villa rica|carrollton|hiram|dallas/.test(c)) return 'WEST';
  return 'INTOWN';
}

function slugId(prefix, val) {
  return `${prefix}-${String(val || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

async function fetchHtmlVerified(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' },
      signal: AbortSignal.timeout(20000)
    });
    const html = await res.text();
    return { ok: res.ok && html.length > 200, status: res.status, finalUrl: res.url || url, html };
  } catch (err) {
    return { ok: false, status: 0, finalUrl: url, html: '', error: err.message };
  }
}

function extractLiveContacts(html) {
  const emails = new Set();
  const cfMatches = html.matchAll(/data-cfemail=["']([a-f0-9]+)["']/gi);
  for (const m of cfMatches) {
    const dec = decodeCfEmail(m[1]).toLowerCase();
    if (dec.includes('@')) emails.add(dec);
  }
  const mailMatches = html.matchAll(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi);
  for (const m of mailMatches) emails.add(m[1].toLowerCase());
  const textMatches = html.matchAll(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g);
  for (const m of textMatches) {
    const e = m[1].toLowerCase();
    if (!/\.(png|jpg|jpeg|webp|svg|gif|css|js)$/.test(e) && !/wixpress|sentry|example\.com|wordpress|moxiworks|leadrouter/.test(e)) {
      emails.add(e);
    }
  }
  const phones = [];
  const phoneMatches = html.matchAll(/(?:tel:|>|\s|\(|^)(?:\+?1[-.\s]?)?\(?([2-9]\d{2})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})(?:<|\s|"|'|$)/g);
  for (const m of phoneMatches) {
    const formatted = formatPhone(`${m[1]}${m[2]}${m[3]}`);
    if (formatted && !phones.includes(formatted)) phones.push(formatted);
  }
  return { emails: [...emails], phones };
}

const TC_SOURCES = [
  { url: 'https://atlcontracts.com/lets-meet/', company: 'ATL Contracts', name: 'Stephanie Williams', title: 'Founder & Lead Transaction Coordinator', city: 'Decatur', emailPrefer: 'stephanie@atlcontracts.com', phonePrefer: '6789231595', notes: 'Metro Atlanta independent GA contract-to-close TC firm (101 W Ponce de Leon Ave Ste 200, Decatur GA)' },
  { url: 'https://premiertransactionco.com/contact.html', company: 'Premier Transaction Co.', name: 'Tamika Price', title: 'Founder & Transaction Coordinator', city: 'Atlanta', emailPrefer: 'support@premiertransactionco.com', phonePrefer: '6782499144', notes: 'Independent Georgia contract-to-close transaction management serving Metro Atlanta agents' },
  { url: 'https://theclosingco.com/contact-us/', company: 'The Closing Co.', name: 'Kim Smith', title: 'Principal Transaction Coordinator', city: 'Atlanta', emailPrefer: 'kim@theclosingco.com', phonePrefer: '7708746208', notes: 'Cumberland / Metro Atlanta GA transaction coordination specialists' },
  { url: 'https://www.classiccoordinators.com/contact-us', company: 'Classic Coordinators', name: 'Classic Coordinators Team', title: 'Contract-to-Close Coordinators', city: 'Atlanta', emailPrefer: 'info@classiccoordinators.com', phonePrefer: '7708423089', notes: 'GAR Contract & FMLS/GAMLS compliance coordination across Metro Atlanta' },
  { url: 'https://www.righthandreservices.com/contact', company: 'Right Hand Real Estate Services, LLC', name: 'Melissa', title: 'Lead Transaction Coordinator', city: 'Marietta', emailPrefer: 'melissa@righthandreservices.com', phonePrefer: '7706374985', notes: 'Cobb County / Metro Atlanta independent transaction & listing coordination' },
  { url: 'https://top-tiertransactions.com/', company: 'Top-Tier Transactions', name: 'Ashley Williams', title: 'Managing Transaction Coordinator', city: 'Atlanta', emailPrefer: 'info@top-tiertransactions.com', phonePrefer: '4708248055', notes: 'Independent Georgia real estate transaction coordination' },
  { url: 'https://www.harmonyts.com/founder', company: 'Harmony Transaction Solutions, LLC', name: 'Nikeisha Jakes', title: 'Founder & Transaction Coordinator', city: 'Atlanta', emailPrefer: 'nikeisha@harmonyts.com', phonePrefer: '', notes: 'Independent Atlanta GA transaction coordinator serving Metro Atlanta brokerages' }
];
async function harvestTransactionCoordinators(suppressedSet, stats) {
  const results = [];
  for (const src of TC_SOURCES) {
    const page = await fetchHtmlVerified(src.url);
    if (!page.ok) { stats.tcHttpFail++; continue; }
    stats.tcHttpOk++;
    const contacts = extractLiveContacts(page.html);
    const liveEmail = contacts.emails.includes(src.emailPrefer.toLowerCase())
      ? src.emailPrefer.toLowerCase()
      : (contacts.emails[0] || '');
    if (!liveEmail || isSuppressed(liveEmail, src.name, src.company, suppressedSet)) continue;
    const mxOk = await resolveMxCached(liveEmail);
    if (!mxOk) { stats.tcMxFail++; continue; }
    stats.tcMxOk++;
    const livePhone = formatPhone(src.phonePrefer) && page.html.replace(/\D/g, '').includes(src.phonePrefer)
      ? formatPhone(src.phonePrefer)
      : (contacts.phones[0] || '');
    results.push({
      id: slugId('tc', `${src.company}-${liveEmail.split('@')[0]}`),
      category: 'transaction_coordinator',
      name: src.name,
      first: src.name.split(/\s+/)[0] || src.name,
      company: src.company,
      title: src.title,
      city: src.city,
      email: liveEmail,
      phone: livePhone,
      source_url: page.finalUrl,
      retrieved_on: RETRIEVED_ON,
      status: 'ready',
      verified: true,
      http_ok: true,
      dns_mx_ok: true,
      corridor: classifyCorridor(src.city),
      notes: src.notes
    });
  }

  const dwUrl = 'https://joindaltonwade.com/transaction-coordinators/georgia-transaction-coordinators/';
  const dwPage = await fetchHtmlVerified(dwUrl);
  if (dwPage.ok) {
    stats.tcHttpOk++;
    const dwText = dwPage.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const knownGaTcs = [
      { company: 'RoJo Homes TC', name: 'Josette Nedohon', email: 'tc.rojohomes@gmail.com', phone: '4707507656', city: 'Atlanta' },
      { company: 'Clear 2 Close TC', name: 'Shekia Renea', email: 'myclear2close@gmail.com', phone: '4705007598', city: 'Atlanta' },
      { company: 'Tei Wyatt Realty TC', name: 'Tei Wyatt', email: 'teiwyattrealty@gmail.com', phone: '4702570215', city: 'Atlanta' },
      { company: 'Santanna Realty TC', name: 'Santanna Cole', email: 'santannarealtytc@gmail.com', phone: '7705895113', city: 'Atlanta' },
      { company: 'Anita Williams Transaction Coordination', name: 'Anita Williams', email: 'anitatherealtor1@gmail.com', phone: '4044090746', city: 'Atlanta' }
    ];
    for (const tc of knownGaTcs) {
      if (!dwText.toLowerCase().includes(tc.email)) continue;
      if (isSuppressed(tc.email, tc.name, tc.company, suppressedSet)) continue;
      const mxOk = await resolveMxCached(tc.email);
      if (!mxOk) { stats.tcMxFail++; continue; }
      stats.tcMxOk++;
      results.push({
        id: slugId('tc', tc.name),
        category: 'transaction_coordinator',
        name: tc.name,
        first: tc.name.split(/\s+/)[0],
        company: tc.company,
        title: 'Georgia Transaction Coordinator (FMLS/GAMLS)',
        city: tc.city,
        email: tc.email,
        phone: dwPage.html.replace(/\D/g, '').includes(tc.phone) ? formatPhone(tc.phone) : '',
        source_url: dwPage.finalUrl,
        retrieved_on: RETRIEVED_ON,
        status: 'ready',
        verified: true,
        http_ok: true,
        dns_mx_ok: true,
        corridor: 'INTOWN',
        notes: 'Verified independent Georgia FMLS/GAMLS transaction coordinator listed on Georgia TC directory'
      });
    }
  } else {
    stats.tcHttpFail++;
  }
  return results;
}
async function fetchMlsClosedVolume(stats) {
  const byEmail = new Map();
  for (let from = 0; from <= 1600; from += 200) {
    const url = `https://mls.virtusmart.com/api/search/p?From=${from}&Size=200&StandardStatus=Closed&feed=FMLS`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!res.ok) { stats.mlsHttpFail++; continue; }
      stats.mlsHttpOk++;
      const json = await res.json();
      const rows = Array.isArray(json) ? json : (Array.isArray(json?.value) ? json.value : []);
      if (!rows.length) break;
      for (const row of rows) {
        const s = row._source || row;
        const price = Number(s.ClosePrice || 0);
        if (price < 80000) continue;
        const county = String(s.CountyOrParish || '').toLowerCase().trim();
        if (county && !METRO_COUNTIES.has(county)) continue;
        const email = String(s.BuyerAgentEmail || '').trim().toLowerCase();
        if (!email.includes('@')) continue;
        const cur = byEmail.get(email) || {
          name: String(s.BuyerAgentFullName || '').trim(),
          email,
          phone: formatPhone(s.BuyerAgentDirectPhone || ''),
          office: String(s.BuyerOfficeName || '').trim(),
          city: String(s.City || 'Atlanta').trim(),
          deals: 0,
          volume: 0
        };
        cur.deals += 1;
        cur.volume += price;
        byEmail.set(email, cur);
      }
    } catch {
      stats.mlsHttpFail++;
    }
  }
  try {
    const gmUrl = 'https://mls.virtusmart.com/api/search/p?From=0&Size=200&StandardStatus=Closed&feed=GeorgiaMLS';
    const gmRes = await fetch(gmUrl, { signal: AbortSignal.timeout(15000) });
    if (gmRes.ok) { stats.mlsHttpOk++; await gmRes.json(); } else { stats.mlsHttpFail++; }
  } catch { stats.mlsHttpFail++; }
  return byEmail;
}

const BUYER_TEAM_SOURCES = [
  { url: 'https://www.sngroupre.com/', company: 'S&N Team (Keller Williams North Atlanta)', name: 'Surabhi Arora', emailPrefer: 'surabhiarora@kw.com', phonePrefer: '7608285215', city: 'Milton', allowMlsEmail: true },
  { url: 'https://www.thechavarriateam.com/contact', company: 'The Chavarria Team (KW North Atlanta)', name: 'Fernando Chavarria', emailPrefer: 'fernando@thechavarriateam.com', phonePrefer: '6788206933', city: 'Alpharetta' },
  { url: 'https://www.timothycox.com/', company: 'Timothy Cox & Co. Realtors', name: 'Danielle Adams', emailPrefer: 'dani@timothycox.com', phonePrefer: '4045645560', city: 'Decatur' },
  { url: 'https://abbieagent.com/', company: 'Abbie Shepherd Real Estate Group', name: 'Abbie Shepherd', emailPrefer: 'offers@abbieagent.com', phonePrefer: '4046043800', city: 'Atlanta' },
  { url: 'https://atlantaturtlegroup.com/', company: 'Atlanta Turtle Group', name: 'Chuck Smith', emailPrefer: 'info@atlantaturtlegroup.com', phonePrefer: '4045512607', city: 'Atlanta' },
  { url: 'https://ellencookatlanta.com/contact', company: 'Ellen Cook Real Estate (Bolst)', name: 'Ellen Cook', emailPrefer: 'ellen@ellencookatlanta.com', phonePrefer: '4049694670', city: 'Atlanta' },
  { url: 'https://demeekacobb.com/', company: 'Demeeka Cobb Real Estate (eXp Realty)', name: 'Demeeka Cobb', emailPrefer: 'hello@demeekacobb.com', phonePrefer: '3214149500', city: 'Locust Grove' },
  { url: 'https://sure-realty.com/', company: 'Sure Realty Inc.', name: 'Michelle Layne', emailPrefer: 'michelle@sure-realty.com', phonePrefer: '4044280695', city: 'Stockbridge', allowMlsEmail: true },
  { url: 'https://iamjasminecox.com/', company: 'Jasmine Cox Real Estate Group', name: 'Jasmine Cox', emailPrefer: 'info@iamjasminecox.com', phonePrefer: '4702137198', city: 'Smyrna', allowMlsEmail: true },
  { url: 'https://www.ennisantoine.realtor/', company: 'EA Realty of Georgia', name: 'Ennis Antoine', emailPrefer: 'ennis@ennisantoine.com', phonePrefer: '4044457305', city: 'Atlanta' },
  { url: 'https://www.zacsellsatlanta.com/contact-us', company: 'The Zac Team (RE/MAX Metro Atlanta)', name: 'Zac Pasmanick', emailPrefer: 'zac@zac.biz', phonePrefer: '4045647200', city: 'Atlanta' },
  { url: 'https://suitsteam.com/team', company: 'The Suits Team (KW Peachtree Road)', name: 'Nina Harris', emailPrefer: 'nina@suitsteam.com', phonePrefer: '4044193550', city: 'Atlanta' },
  { url: 'https://barnesyoung.com/team', company: 'Barnes Young Realty Team', name: 'Jennifer Barnes', emailPrefer: 'info@barnesyoung.com', phonePrefer: '4044193535', city: 'Atlanta' }
];

async function harvestBuyerLeadTeams(mlsByEmail, suppressedSet, stats) {
  const results = [];
  for (const src of BUYER_TEAM_SOURCES) {
    const page = await fetchHtmlVerified(src.url);
    if (!page.ok) { stats.teamHttpFail++; continue; }
    stats.teamHttpOk++;
    const contacts = extractLiveContacts(page.html);
    const pref = src.emailPrefer.toLowerCase();
    const mlsStatPref = mlsByEmail.get(pref);
    const liveEmail = contacts.emails.includes(pref)
      ? pref
      : (src.allowMlsEmail && mlsStatPref ? pref : (contacts.emails[0] || ''));
    if (!liveEmail || isSuppressed(liveEmail, src.name, src.company, suppressedSet)) continue;
    const mxOk = await resolveMxCached(liveEmail);
    if (!mxOk) { stats.teamMxFail++; continue; }
    stats.teamMxOk++;
    const mlsStat = mlsByEmail.get(liveEmail) || mlsStatPref;
    const livePhone = formatPhone(src.phonePrefer) && page.html.replace(/\D/g, '').includes(src.phonePrefer)
      ? formatPhone(src.phonePrefer)
      : (mlsStat?.phone || contacts.phones[0] || '');
    const mlsNote = mlsStat
      ? `FMLS Closed Buyer Agent Volume: ${mlsStat.deals} closed ${mlsStat.deals === 1 ? 'deal' : 'deals'} ($${Math.round(mlsStat.volume / 1000).toLocaleString()}k).`
      : 'Metro Atlanta high-volume buyer representation team.';
    results.push({
      id: slugId('team', `${src.company.split('(')[0]}-${src.name}`),
      category: 'buyer_lead_team',
      name: src.name,
      first: src.name.split(/\s+/)[0],
      company: src.company,
      title: 'Team Lead / Buyer Representation',
      city: mlsStat?.city || src.city,
      email: liveEmail,
      phone: livePhone,
      source_url: page.finalUrl,
      retrieved_on: RETRIEVED_ON,
      status: 'ready',
      verified: true,
      http_ok: true,
      dns_mx_ok: true,
      corridor: classifyCorridor(mlsStat?.city || src.city),
      notes: mlsNote
    });
  }
  return results;
}
const LO_SOURCES = [
  { url: 'https://crosscountrymortgage.com/lo/julia-head/', name: 'Julia Head', company: 'CrossCountry Mortgage', city: 'Alpharetta', fallbackTitle: 'Loan Officer' },
  { url: 'https://crosscountrymortgage.com/suwanee-ga-4738/jeffrey-zulauf/', name: 'Jeffrey Zulauf', company: 'CrossCountry Mortgage', city: 'Suwanee', fallbackTitle: 'Loan Officer' },
  { url: 'https://crosscountrymortgage.com/peachtree-city-ga-4735/john-crain-jr/', name: 'John Crain Jr.', company: 'CrossCountry Mortgage', city: 'Peachtree City', fallbackTitle: 'Loan Officer' },
  { url: 'https://crosscountrymortgage.com/peachtree-city-ga-4735/laura-jolin/', name: 'Laura Jolin', company: 'CrossCountry Mortgage', city: 'Peachtree City', fallbackTitle: 'Loan Officer' },
  { url: 'https://crosscountrymortgage.com/loganville-ga-3183/denise-walters-alcorn/', name: 'Denise Walters Alcorn', company: 'CrossCountry Mortgage', city: 'Loganville', fallbackTitle: 'Loan Officer' },
  { url: 'https://crosscountrymortgage.com/loganville-ga-3183/andie-freeman/', name: 'Andie Freeman', company: 'CrossCountry Mortgage', city: 'Loganville', fallbackTitle: 'Loan Officer' },
  { url: 'https://branches.guildmortgage.com/ga/alpharetta/austin-hoffer-884-hpah.html', name: 'Austin Hoffer', company: 'Guild Mortgage', city: 'Alpharetta', fallbackTitle: 'Loan Officer' },
  { url: 'https://branches.guildmortgage.com/ga/alpharetta/scott-mcqueen-884-hpsmc.html', name: 'Scott McQueen', company: 'Guild Mortgage', city: 'Alpharetta', fallbackTitle: 'Loan Officer' },
  { url: 'https://branches.guildmortgage.com/ga/atlanta/nedra-white-shaw-496-nwnw.html', name: 'Nedra White Shaw', company: 'Guild Mortgage', city: 'Atlanta', fallbackTitle: 'Loan Officer' },
  { url: 'https://branches.guildmortgage.com/ga/atlanta/rachanta-wallace-496-mmrwa.html', name: 'Rachanta Wallace', company: 'Guild Mortgage', city: 'Atlanta', fallbackTitle: 'Mortgage Consultant' },
  { url: 'https://branches.guildmortgage.com/ga/marietta/lane-cohen-378-hplco.html', name: 'Lane Cohen', company: 'Guild Mortgage', city: 'Marietta', fallbackTitle: 'Loan Officer' },
  { url: 'https://branches.guildmortgage.com/ga/marietta/nichole-allison-378-hpna.html', name: 'Nichole Allison', company: 'Guild Mortgage', city: 'Marietta', fallbackTitle: 'Area Manager' },
  { url: 'https://branches.guildmortgage.com/ga/marietta/sherina-pate-781-hpspat.html', name: 'Sherina Pate', company: 'Guild Mortgage', city: 'Marietta', fallbackTitle: 'Sales Manager' },
  { url: 'https://branches.guildmortgage.com/ga/mcdonough/belinda-dumas-280-hpbd.html', name: 'BeLinda Dumas', company: 'Guild Mortgage', city: 'McDonough', fallbackTitle: 'Branch Manager' },
  { url: 'https://branches.guildmortgage.com/ga/mcdonough/karla-hinton-280-hpkhin.html', name: 'Karla Hinton', company: 'Guild Mortgage', city: 'McDonough', fallbackTitle: 'Loan Officer' },
  { url: 'https://branches.guildmortgage.com/ga/newnan/chris-calhoun-189-hpccal.html', name: 'Chris Calhoun', company: 'Guild Mortgage', city: 'Newnan', fallbackTitle: 'Loan Officer' },
  { url: 'https://loristanjevich.supremelendinglo.com/', name: 'Lori Stanjevich', company: 'Supreme Lending', city: 'Loganville', fallbackTitle: 'Loan Officer' },
  { url: 'https://lukehale.supremelendinglo.com/', name: 'Luke Hale', company: 'Supreme Lending', city: 'Alpharetta', fallbackTitle: 'Producing Branch Manager' },
  { url: 'https://homelendingwithjen.com/', name: 'Jen Broome', company: 'NorthStar Lending', city: 'Douglasville', fallbackTitle: 'Loan Officer' }
];

function extractLoMetadata(html, src) {
  const cleanText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ');
  const contacts = extractLiveContacts(html);
  const personalEmail = contacts.emails.find((e) => !/^(info|support|contact|compliance|licensing|marketing|customerservice|consumer|privacy|noreply)@/.test(e)) || contacts.emails[0] || '';
  let nmls = '';
  const nmlsMatch = cleanText.match(/(?:Personal|Individual|LO)?\s*NMLS\s*(?:ID|Number|#|:)?\s*#?\s*(\d{5,8})/i);
  if (nmlsMatch) nmls = nmlsMatch[1];

  let title = src.fallbackTitle;
  const ldMatches = html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  let branchAddress = '';
  for (const m of ldMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      const items = Array.isArray(parsed) ? parsed : (Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed]);
      for (const obj of items) {
        if (obj?.jobTitle && typeof obj.jobTitle === 'string') title = obj.jobTitle.trim();
        const addr = obj?.address || obj?.location?.address;
        if (addr && typeof addr === 'object' && addr.streetAddress && addr.addressRegion === 'GA') {
          branchAddress = `${addr.streetAddress}, ${addr.addressLocality || src.city}, ${addr.addressRegion} ${addr.postalCode || ''}`.trim();
        }
      }
    } catch {}
  }

  if (!branchAddress) {
    const addrText = cleanText.replace(/NMLS\s*(?:ID|Number|#|:)?\s*#?\s*\d+/gi, ' ').replace(/\s+/g, ' ');
    const addrMatch = addrText.match(/(\d{2,5}\s+[A-Za-z0-9.\-#\s]{3,55}(?:Blvd\.?|Pkwy\.?|Parkway|Court|Ct\.?|Place|Pl\.?|Dr\.?|Drive|Street|St\.?|Rd\.?|Road|Exchange\s+West|Way|Ave\.?)(?:\s*,?\s*(?:Suite|Ste\.?|Office|#)\s*[A-Za-z0-9\-]+){0,2}\s*,?\s+[A-Za-z\s]{2,25}\s*,?\s*GA\s*\d{5})/i);
    if (addrMatch) branchAddress = addrMatch[1].replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
  }

  const localPhone = contacts.phones.find((p) => !/^\((800|888|877|866|855|844)\)/.test(p)) || contacts.phones[0] || '';
  return { email: personalEmail, nmls, title, branchAddress, phone: localPhone };
}
async function harvestLoanOfficers(suppressedSet, stats) {
  const results = [];
  for (const src of LO_SOURCES) {
    const page = await fetchHtmlVerified(src.url);
    if (!page.ok) { stats.loHttpFail++; continue; }
    stats.loHttpOk++;
    const meta = extractLoMetadata(page.html, src);
    if (!meta.email || isSuppressed(meta.email, src.name, src.company, suppressedSet)) continue;
    const mxOk = await resolveMxCached(meta.email);
    if (!mxOk) { stats.loMxFail++; continue; }
    stats.loMxOk++;
    results.push({
      id: slugId('lo', src.name),
      name: src.name,
      first: src.name.split(/\s+/)[0],
      company: src.company,
      title: meta.title,
      nmls: meta.nmls,
      city: src.city,
      email: meta.email,
      phone: meta.phone,
      branchAddress: meta.branchAddress || `${src.city}, GA`,
      source_url: page.finalUrl,
      retrieved_on: RETRIEVED_ON,
      status: 'ready',
      verified: true,
      http_ok: true,
      dns_mx_ok: true,
      corridor: classifyCorridor(src.city)
    });
  }
  return results;
}

function mergeDeduped(existing, incoming) {
  const out = existing.map((r) => ({ ...r }));
  const idxById = new Map(out.map((r, i) => [String(r.id || '').toLowerCase(), i]));
  const seenEmails = new Set(out.map((r) => String(r.email || '').toLowerCase()).filter(Boolean));
  const seenPhones = new Set(
    out.map((r) => String(r.phone || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '')).filter((d) => d.length === 10)
  );
  const added = [];
  let updated = 0;
  for (const row of incoming) {
    const idKey = String(row.id || '').toLowerCase();
    const emailKey = String(row.email || '').toLowerCase();
    const phoneKey = String(row.phone || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    const hitIdx = idxById.get(idKey);
    if (hitIdx !== undefined && out[hitIdx].source_url === row.source_url && out[hitIdx].retrieved_on === RETRIEVED_ON) {
      out[hitIdx] = row;
      updated += 1;
      continue;
    }
    if (idxById.has(idKey) || seenEmails.has(emailKey) || (phoneKey.length === 10 && seenPhones.has(phoneKey))) {
      continue;
    }
    idxById.set(idKey, out.length);
    seenEmails.add(emailKey);
    if (phoneKey.length === 10) seenPhones.add(phoneKey);
    out.push(row);
    added.push(row);
  }
  return { merged: out, added, updated };
}

async function main() {
  const suppressedSet = loadSuppressedSet();
  const stats = { tcHttpOk: 0, tcHttpFail: 0, tcMxOk: 0, tcMxFail: 0, mlsHttpOk: 0, mlsHttpFail: 0, teamHttpOk: 0, teamHttpFail: 0, teamMxOk: 0, teamMxFail: 0, loHttpOk: 0, loHttpFail: 0, loMxOk: 0, loMxFail: 0 };
  console.log(`Loaded ${suppressedSet.size} suppressed emails.`);
  const [mlsByEmail, tcRows, loRows] = await Promise.all([
    fetchMlsClosedVolume(stats),
    harvestTransactionCoordinators(suppressedSet, stats),
    harvestLoanOfficers(suppressedSet, stats)
  ]);
  const teamRows = await harvestBuyerLeadTeams(mlsByEmail, suppressedSet, stats);

  const existingB2b = JSON.parse(fs.readFileSync(B2B_PATH, 'utf8'));
  const existingLo = JSON.parse(fs.readFileSync(LO_PATH, 'utf8'));
  const b2bMerge = mergeDeduped(existingB2b, [...tcRows, ...teamRows]);
  const loMerge = mergeDeduped(existingLo, loRows);

  fs.writeFileSync(B2B_PATH, `${JSON.stringify(b2bMerge.merged, null, 2)}\n`, 'utf8');
  fs.writeFileSync(LO_PATH, `${JSON.stringify(loMerge.merged, null, 2)}\n`, 'utf8');

  console.log('HARVEST_SUMMARY', JSON.stringify({
    mlsUniqueBuyerAgents: mlsByEmail.size,
    tcAdded: b2bMerge.added.filter((r) => r.category === 'transaction_coordinator').length,
    buyerTeamsAdded: b2bMerge.added.filter((r) => r.category === 'buyer_lead_team').length,
    loAdded: loMerge.added.length,
    b2bTotal: b2bMerge.merged.length,
    loTotal: loMerge.merged.length,
    stats
  }, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
