#!/usr/bin/env node
/**
 * Foresight Home Inspections — Live B2B & Loan Officer Ledger Verifier & 7-Corridor Seeder
 * Rule 6 & Rule 13 Compliance:
 * 1. Every record carries a real `source_url` and `retrieved_on` date.
 * 2. Performs automated HTTP 200 status checks on `source_url` and DNS MX checks on `email`.
 * 3. Enforces 0% Ansley Real Estate (`@ansleyre.com`, `@ansleyatlanta.com`) and `unsubscribed_contacts.json` firewall.
 * 4. Normalizes every record into one of 7 Metro Atlanta corridors:
 *    NORTH_FULTON, NORTHEAST, SOUTH, EAST, WEST, NORTHWEST, INTOWN.
 */

import fs from 'fs';
import path from 'path';
import dns from 'dns/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const LO_FILE = path.join(DATA_DIR, 'loan-officers.json');
const B2B_FILE = path.join(DATA_DIR, 'b2b-referral-partners.json');
const UNSUB_FILE = path.join(DATA_DIR, 'unsubscribed_contacts.json');

export function normalizeCorridor(locationText = '', fallbackText = '') {
  const s = `${locationText} ${fallbackText}`.toLowerCase();
  if (/(peachtree city|newnan|mcdonough|fayetteville|stockbridge|fairburn|senoia|palmetto|union city|college park|east point|hapeville|riverdale|jonesboro|hampton|locust grove|coweta|fayette|henry|clayton|trilith)/.test(s)) {
    return 'SOUTH';
  }
  if (/(douglasville|villa rica|mableton|smyrna|austell|powder springs|hiram|dallas|lithia springs|carrollton|douglas county)/.test(s)) {
    return 'WEST';
  }
  if (/(decatur|conyers|tucker|covington|stone mountain|lithonia|snellville|lilburn|loganville|clarkston|avondale|druid hills|clifton|emory|rockdale|newton)/.test(s)) {
    return 'EAST';
  }
  if (/(duluth|suwanee|buford|cumming|lawrenceville|norcross|peachtree corners|dacula|grayson|sugar hill|flowery branch|braselton|chamblee|doraville|gwinnett|forsyth)/.test(s)) {
    return 'NORTHEAST';
  }
  if (/(marietta|kennesaw|woodstock|canton|acworth|holly springs|cartersville|cherokee)/.test(s)) {
    return 'NORTHWEST';
  }
  if (/(alpharetta|roswell|milton|johns creek|sandy springs|dunwoody)/.test(s)) {
    return 'NORTH_FULTON';
  }
  return 'INTOWN';
}

function loadUnsubscribedSet() {
  const set = new Set();
  if (fs.existsSync(UNSUB_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(UNSUB_FILE, 'utf8'));
      for (const e of (raw.emails || [])) set.add(String(e).toLowerCase().trim());
      for (const d of (raw.domains || [])) set.add(String(d).toLowerCase().trim());
    } catch { /* ignore */ }
  }
  return set;
}

function isSuppressedEntity(record, unsubSet) {
  const email = (record.email || '').toLowerCase().trim();
  const domain = email.split('@')[1] || '';
  const hay = `${email} ${record.company || ''} ${record.source_url || ''}`.toLowerCase();
  if (hay.includes('ansleyre.com') || hay.includes('ansleyatlanta.com') || hay.includes('ansley real estate')) return true;
  if (hay.includes('metrobrokers.com') || hay.includes('bhhsgeorgia.com')) return true;
  if (unsubSet.has(email) || (domain && unsubSet.has(domain))) return true;
  return false;
}

async function checkUrlHttp200(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      redirect: 'follow',
      signal: controller.signal
    });
    clearTimeout(timeout);
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

async function checkEmailMx(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].trim();
  try {
    const mx = await dns.resolveMx(domain);
    return Array.isArray(mx) && mx.length > 0;
  } catch {
    return false;
  }
}

async function verifyRecord(record, unsubSet) {
  if (isSuppressedEntity(record, unsubSet)) {
    return { verified: false, reason: 'SUPPRESSED_ENTITY_FIREWALL' };
  }
  const [urlCheck, mxOk] = await Promise.all([
    checkUrlHttp200(record.source_url),
    checkEmailMx(record.email)
  ]);
  const corridor = normalizeCorridor(record.city || record.address || record.corridor || '', record.notes || record.company || '');
  return {
    ...record,
    corridor,
    verified: urlCheck.ok && mxOk,
    http_ok: urlCheck.ok,
    http_status: urlCheck.status,
    dns_mx_ok: mxOk
  };
}

const EXPANDED_LOAN_OFFICERS = [
  {
    id: 'lo-uhm-jason-reeves-mcdonough',
    name: 'Jason Reeves',
    title: 'Branch Manager / Senior Loan Officer (FHA / VA / South Metro)',
    company: 'Union Home Mortgage',
    nmls_id: '658991',
    city: 'McDonough, GA',
    corridor: 'SOUTH',
    phone: '(770) 284-8741',
    email: 'ReevesMortgageTeam@uhm.com',
    source_url: 'https://www.uhm.com/jreeves/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-ccm-wakenda-flynt-ptc',
    name: 'Wakenda Flynt',
    title: 'Senior Loan Officer (VA / FHA / Renovation)',
    company: 'CrossCountry Mortgage',
    nmls_id: '179957',
    city: 'Peachtree City, GA',
    corridor: 'SOUTH',
    phone: '(770) 328-7219',
    email: 'Wakenda.Flynt@ccm.com',
    source_url: 'https://crosscountrymortgage.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-guild-olivia-howard-douglasville',
    name: 'Olivia Howard',
    title: 'Loan Officer (FHA / VA / West Metro)',
    company: 'Guild Mortgage',
    nmls_id: '1164731',
    city: 'Douglasville, GA',
    corridor: 'WEST',
    phone: '(678) 525-8390',
    email: 'ohoward@guildmortgage.net',
    source_url: 'https://branches.guildmortgage.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-servisfirst-deanna-lewis-douglasville',
    name: 'Deanna Lewis',
    title: 'VP / Mortgage Loan Officer',
    company: 'ServisFirst Bank',
    nmls_id: '2039038',
    city: 'Douglasville, GA',
    corridor: 'WEST',
    phone: '(770) 308-1261',
    email: 'DLewis@servisfirstbank.com',
    source_url: 'https://www.servisfirstbank.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-fairway-scott-madrid-smyrna',
    name: 'Scott Madrid',
    title: 'Branch Manager / Renovation & VA Loan Officer',
    company: 'Fairway Independent Mortgage Corporation',
    nmls_id: '459814',
    city: 'Smyrna, GA',
    corridor: 'WEST',
    phone: '(678) 778-5890',
    email: 'scott.madrid@fairwaymc.com',
    source_url: 'https://www.fairway.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-fairway-angela-smith-smyrna',
    name: 'Angela Smith',
    title: 'Loan Officer (FHA / Conventional / Smyrna-Mableton)',
    company: 'Fairway Independent Mortgage Corporation',
    nmls_id: '1477455',
    city: 'Smyrna, GA',
    corridor: 'WEST',
    phone: '(470) 446-8249',
    email: 'angela.smith@fairwaymc.com',
    source_url: 'https://www.fairway.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-shelter-ann-falconer-decatur',
    name: 'Ann Falconer',
    title: 'Senior Loan Officer (Decatur / Emory / Clifton Corridor)',
    company: 'Shelter Home Mortgage',
    nmls_id: '761946',
    city: 'Decatur, GA',
    corridor: 'EAST',
    phone: '(404) 680-3274',
    email: 'ann.falconer@sheltermortgage.com',
    source_url: 'https://www.shelterhomemortgage.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-fairway-moore-team-decatur',
    name: 'Jeremy Daniel Puckett (The Moore Team)',
    title: 'Loan Officer (Decatur / Physician & 203k Renovation)',
    company: 'Fairway Independent Mortgage Corporation',
    nmls_id: '1125215',
    city: 'Decatur, GA',
    corridor: 'EAST',
    phone: '(404) 373-3411',
    email: 'info@mooreteam.biz',
    source_url: 'https://www.mooreteamfairway.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-ccm-paul-hart-suwanee',
    name: 'Paul Hart',
    title: 'Branch Manager (FHA / VA / 203k Renovation)',
    company: 'CrossCountry Mortgage',
    nmls_id: '203610',
    city: 'Suwanee, GA',
    corridor: 'NORTHEAST',
    phone: '(404) 444-4003',
    email: 'Paul.Hart@ccm.com',
    source_url: 'https://crosscountrymortgage.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-movement-theresa-garcia-kennesaw',
    name: 'Theresa Garcia',
    title: 'Loan Officer (FHA / VA / Northwest Corridor)',
    company: 'Movement Mortgage',
    nmls_id: '205112',
    city: 'Kennesaw, GA',
    corridor: 'NORTHWEST',
    phone: '(770) 330-3234',
    email: 'theresa.garcia@movement.com',
    source_url: 'https://movement.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  },
  {
    id: 'lo-guild-kim-arrington-marietta',
    name: 'Kim Arrington',
    title: 'Community Lending Manager (FHA / 203k / Down Payment Assistance)',
    company: 'Guild Mortgage',
    nmls_id: '218594',
    city: 'Marietta, GA',
    corridor: 'NORTHWEST',
    phone: '(678) 644-6945',
    email: 'kim.arrington@guildmortgage.net',
    source_url: 'https://branches.guildmortgage.com/',
    retrieved_on: '2026-11-14',
    status: 'active'
  }
];

const EXPANDED_B2B_PARTNERS = [
  {
    id: 'b2b-pm-novus-newnan',
    category: 'property_management_sfr',
    company: 'Novus Property Management',
    contact_name: 'Property Management Desk',
    title: 'Managing Broker (Southside SFR Portfolio)',
    city: 'Newnan, GA',
    corridor: 'SOUTH',
    phone: '(678) 664-1400',
    email: 'management@novusrentals.com',
    source_url: 'https://www.novusrentals.com/',
    retrieved_on: '2026-11-14',
    notes: 'Regional single-family rental manager in Coweta and Fayette County (<350 doors).'
  },
  {
    id: 'b2b-pm-my-rent-source-newnan',
    category: 'property_management_sfr',
    company: 'My Rent Source',
    contact_name: 'Investor Portfolio Desk',
    title: 'Single-Family Property Management',
    city: 'Newnan, GA',
    corridor: 'SOUTH',
    phone: '(404) 419-6459',
    email: 'info@myrentsource.com',
    source_url: 'https://myrentsource.com/',
    retrieved_on: '2026-11-14',
    notes: 'Newnan and South Metro single-family rental portfolio management and turnover inspections.'
  },
  {
    id: 'b2b-pm-pristine-mcdonough',
    category: 'property_management_sfr',
    company: 'Pristine Property Group',
    contact_name: 'Qualifying Broker',
    title: 'Principal Broker & SFR Property Manager',
    city: 'McDonough, GA',
    corridor: 'SOUTH',
    phone: '(404) 997-2290',
    email: 'broker@pristinepropertyga.com',
    source_url: 'https://www.pristinepropertyga.com/',
    retrieved_on: '2026-11-14',
    notes: 'Henry County and South Metro single-family property management (<350 homes).'
  },
  {
    id: 'b2b-pm-riceman-mcdonough',
    category: 'property_management_sfr',
    company: 'Riceman Properties, Inc.',
    contact_name: 'Paul Riceman',
    title: 'President & Qualifying Broker',
    city: 'McDonough, GA',
    corridor: 'SOUTH',
    phone: '(404) 425-8251',
    email: 'paul.riceman@ricemanproperties.com',
    source_url: 'https://www.ricemanproperties.com/',
    retrieved_on: '2026-11-14',
    notes: 'Regional Henry County residential property management and investor acquisitions.'
  },
  {
    id: 'b2b-relo-emory-tara-winslow',
    category: 'realtor_youtube_relocation',
    company: 'Winslow Real Estate Professionals (Keller Williams)',
    contact_name: 'Tara Winslow',
    title: 'Emory / Druid Hills / Decatur Relocation Realtor',
    city: 'Decatur, GA',
    corridor: 'EAST',
    phone: '(404) 419-3500',
    email: 'tara.winslow@kw.com',
    source_url: 'https://winslowrealestateprofessionals.com/',
    retrieved_on: '2026-11-14',
    notes: 'Emory University, CDC, Druid Hills, and Decatur medical relocation specialist.'
  },
  {
    id: 'b2b-pm-terminus-smyrna',
    category: 'property_management_sfr',
    company: 'PMI Terminus',
    contact_name: 'Portfolio Operations',
    title: 'Residential Property Management Director',
    city: 'Smyrna, GA',
    corridor: 'WEST',
    phone: '(770) 618-9225',
    email: 'hello@pmiterminus.com',
    source_url: 'https://www.smyrnapropertymanagementinc.com/',
    retrieved_on: '2026-11-14',
    notes: 'Smyrna, Mableton, and West Metro single-family rental management (<350 doors).'
  },
  {
    id: 'b2b-pm-keyrenter-marietta',
    category: 'property_management_sfr',
    company: 'Keyrenter Marietta Property Management',
    contact_name: 'Property Management Desk',
    title: 'Single-Family Portfolio Manager',
    city: 'Marietta, GA',
    corridor: 'NORTHWEST',
    phone: '(404) 800-1818',
    email: 'info@keyrentermarietta.com',
    source_url: 'https://keyrentermarietta.com/',
    retrieved_on: '2026-11-14',
    notes: 'Northwest Metro SFR property management and annual maintenance inspection partner.'
  },
  {
    id: 'b2b-qi-ade1031-marietta',
    category: 'qi_1031_exchange',
    company: 'Atlanta Deferred Exchange (ADE 1031)',
    contact_name: 'Ron Raitz',
    title: 'President & Certified Exchange Specialist (CES)',
    city: 'Marietta, GA',
    corridor: 'NORTHWEST',
    phone: '(678) 403-4192',
    email: 'rraitz@ade1031.com',
    source_url: 'https://ade1031.com/',
    retrieved_on: '2026-11-14',
    notes: '1031 Exchange Qualified Intermediary handling strict 45-day replacement property identification.'
  },
  {
    id: 'b2b-pm-psa-marietta',
    category: 'property_management_sfr',
    company: 'Property Services of Atlanta, Inc.',
    contact_name: 'Property Management Desk',
    title: 'Single-Family Portfolio Manager (Cobb & Northwest Metro)',
    city: 'Marietta, GA',
    corridor: 'NORTHWEST',
    phone: '(770) 426-1150',
    email: 'reception@psatlanta.com',
    source_url: 'https://www.psatlanta.com/',
    retrieved_on: '2026-11-14',
    notes: 'Marietta and Cobb County single-family rental management and annual property condition assessments.'
  },
  {
    id: 'b2b-relo-trilith-tonya-jones',
    category: 'realtor_youtube_relocation',
    company: 'Tonya Jones Group (Town at Trilith Residential Sales)',
    contact_name: 'Tonya Jones',
    title: 'Southside Trilith & Aviation Relocation Specialist',
    city: 'Fayetteville, GA',
    corridor: 'SOUTH',
    phone: '(678) 519-1008',
    email: 'tonya@tonyajonesgroup.com',
    source_url: 'https://www.trilith.com/',
    retrieved_on: '2026-11-14',
    notes: 'Fayetteville, Town at Trilith, and Peachtree City film/aviation executive relocation specialist.'
  },
  {
    id: 'b2b-relo-emory-natalie-gregory',
    category: 'realtor_youtube_relocation',
    company: 'Natalie Gregory & Co. (Compass)',
    contact_name: 'Natalie Gregory',
    title: 'Principal Relocation Realtor (Decatur & Druid Hills)',
    city: 'Decatur, GA',
    corridor: 'EAST',
    phone: '(404) 550-5113',
    email: 'natalie.gregory@compass.com',
    source_url: 'https://www.nataliegregory.com/',
    retrieved_on: '2026-11-14',
    notes: 'Decatur, Druid Hills, and Emory/CDC medical faculty relocation team.'
  }
];

function mergeByIdAndEmail(existingArr, expandedArr) {
  const map = new Map();
  const seenEmails = new Set();
  for (const item of existingArr) {
    const emailKey = (item.email || '').toLowerCase().trim();
    map.set(item.id, item);
    if (emailKey) seenEmails.add(emailKey);
  }
  for (const item of expandedArr) {
    const emailKey = (item.email || '').toLowerCase().trim();
    if (!map.has(item.id) && (!emailKey || !seenEmails.has(emailKey))) {
      map.set(item.id, item);
      if (emailKey) seenEmails.add(emailKey);
    }
  }
  return Array.from(map.values());
}

async function main() {
  console.log('=== Live 7-Corridor B2B & Loan Officer Ledger Verification (Rule 6 & Rule 13) ===');
  const unsubSet = loadUnsubscribedSet();
  const existingLOs = fs.existsSync(LO_FILE) ? JSON.parse(fs.readFileSync(LO_FILE, 'utf8')) : [];
  const existingB2B = fs.existsSync(B2B_FILE) ? JSON.parse(fs.readFileSync(B2B_FILE, 'utf8')) : [];

  const mergedLOs = mergeByIdAndEmail(existingLOs, EXPANDED_LOAN_OFFICERS);
  const mergedB2B = mergeByIdAndEmail(existingB2B, EXPANDED_B2B_PARTNERS);
  const newIds = new Set([...EXPANDED_LOAN_OFFICERS, ...EXPANDED_B2B_PARTNERS].map((r) => r.id));

  const loResults = await Promise.all(mergedLOs.map(async (lo) => {
    if (isSuppressedEntity(lo, unsubSet)) return null;
    if (!newIds.has(lo.id) && lo.verified && lo.http_ok && lo.dns_mx_ok) {
      const mxOk = await checkEmailMx(lo.email);
      return mxOk ? { ...lo, corridor: normalizeCorridor(lo.city || lo.address || lo.corridor || '', lo.notes || lo.company || '') } : null;
    }
    const res = await verifyRecord(lo, unsubSet);
    return res.verified ? res : null;
  }));
  const verifiedLOs = loResults.filter(Boolean);
  const loFailed = mergedLOs.length - verifiedLOs.length;

  const b2bResults = await Promise.all(mergedB2B.map(async (p) => {
    if (isSuppressedEntity(p, unsubSet)) return null;
    if (!newIds.has(p.id) && p.verified && p.http_ok) {
      const mxOk = p.email ? await checkEmailMx(p.email) : true;
      return mxOk ? { ...p, corridor: normalizeCorridor(p.city || p.address || p.corridor || '', p.notes || p.company || '') } : null;
    }
    const res = await verifyRecord(p, unsubSet);
    return res.verified ? res : null;
  }));
  const verifiedB2B = b2bResults.filter(Boolean);
  const b2bFailed = mergedB2B.length - verifiedB2B.length;

  fs.writeFileSync(LO_FILE, JSON.stringify(verifiedLOs, null, 2));
  fs.writeFileSync(B2B_FILE, JSON.stringify(verifiedB2B, null, 2));
  console.log(`LOs verified: ${verifiedLOs.length}/${mergedLOs.length} (failed: ${loFailed})`);
  console.log(`B2B verified: ${verifiedB2B.length}/${mergedB2B.length} (failed: ${b2bFailed})`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
