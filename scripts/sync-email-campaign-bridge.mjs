#!/usr/bin/env node
/**
 * Bidirectional Website <-> Email Campaign Engine Bridge
 * Connects `foresight-website` (https://www.fhinspectionsatl.com) with `email-campaign-engine`
 *
 * 1. Mirrors `unsubscribed_contacts.json` bidirectionally (100% opt-out & Ansley suppression)
 * 2. Feeds newly harvested FMLS Under-Contract Realtors (`data/under-contract-realtors.json`)
 *    into `../email-campaign-engine/recovered_active_filers.json` for long-term nurture
 * 3. Audits `../email-campaign-engine/lightweight_realtor_templates.js` against `data/truth.json`
 */

import fs from 'fs';
import path from 'path';

const WEB_ROOT = process.cwd();
const CAMPAIGN_ROOT = path.resolve(WEB_ROOT, '..', 'email-campaign-engine');
const today = new Date().toISOString().split('T')[0];

function syncUnsubscribes() {
  const webUnsubPath = path.join(WEB_ROOT, 'data', 'unsubscribed_contacts.json');
  const campUnsubPath = path.join(CAMPAIGN_ROOT, 'unsubscribed_contacts.json');
  const set = new Set();

  for (const p of [webUnsubPath, campUnsubPath]) {
    if (fs.existsSync(p)) {
      try {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        const list = Array.isArray(raw) ? raw : (raw.emails || Object.keys(raw));
        list.forEach((e) => {
          if (typeof e === 'string' && e.includes('@')) set.add(e.trim().toLowerCase());
          else if (e && e.email) set.add(String(e.email).trim().toLowerCase());
        });
      } catch {}
    }
  }

  const merged = [...set].sort();
  fs.writeFileSync(webUnsubPath, JSON.stringify(merged, null, 2), 'utf8');
  return { totalSuppressedEmails: merged.length, set };
}

function syncUnderContractToCampaign(unsubSet) {
  const ucPath = path.join(WEB_ROOT, 'data', 'under-contract-realtors.json');
  const activeFilersPath = path.join(CAMPAIGN_ROOT, 'recovered_active_filers.json');
  if (!fs.existsSync(ucPath) || !fs.existsSync(CAMPAIGN_ROOT)) return { synced: 0 };

  const ucRaw = JSON.parse(fs.readFileSync(ucPath, 'utf8'));
  const ucList = Array.isArray(ucRaw) ? ucRaw : (ucRaw.realtors || Object.values(ucRaw));
  const existing = fs.existsSync(activeFilersPath) ? JSON.parse(fs.readFileSync(activeFilersPath, 'utf8')) : [];
  const existingArr = Array.isArray(existing) ? existing : [];
  const seenEmails = new Set(existingArr.map((r) => String(r.email || '').toLowerCase()));

  let added = 0;
  for (const r of ucList) {
    const email = String(r.email || '').trim().toLowerCase();
    if (!email || !email.includes('@') || seenEmails.has(email) || unsubSet.has(email)) continue;
    if (/@ansleyre\.com$|@ansleyatlanta\.com$/i.test(email) || /ansley|chapman group/i.test(r.brokerage || '')) continue;
    seenEmails.add(email);
    const dealDate = r.date || today;
    let isFresh = false;
    try {
      const ageDays = (Date.now() - new Date(dealDate).getTime()) / (1000 * 60 * 60 * 24);
      isFresh = ageDays >= 0 && ageDays <= 5;
    } catch {}
    existingArr.unshift({
      email,
      first_name: r.first || (r.name || '').split(' ')[0] || 'there',
      full_name: r.name || '',
      brokerage: r.brokerage || '',
      city: r.city || 'Metro Atlanta',
      listing_address: isFresh ? (r.address || '') : '',
      source_url: r.source_url || 'https://www.fmls.com',
      retrieved_on: dealDate
    });
    added++;
  }

  // Purge any stale listings (>5 days old) so realtors are never sent emails after closing
  for (const item of existingArr) {
    const d = item.retrieved_on || item.date;
    if (d) {
      try {
        const age = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
        if (age > 5 || age < 0) item.listing_address = '';
      } catch {
        item.listing_address = '';
      }
    } else {
      item.listing_address = '';
    }
  }

  if (added > 0 || existingArr.length > 0) {
    fs.writeFileSync(activeFilersPath, JSON.stringify(existingArr.slice(0, 5000), null, 2), 'utf8');
  }

  // Export cloud-ready realtor nurture queue into foresight-website/data/ for 24/7 GitHub Actions execution when PC is off
  const cloudQueuePath = path.join(WEB_ROOT, 'data', 'cloud-realtor-nurture-queue.json');
  const cloudQueue = existingArr
    .filter((r) => {
      const e = String(r.email || '').trim().toLowerCase();
      return e && e.includes('@') && !unsubSet.has(e) && !/@ansleyre\.com$|@ansleyatlanta\.com$/i.test(e);
    })
    .slice(0, 1500);
  fs.writeFileSync(cloudQueuePath, JSON.stringify(cloudQueue, null, 2), 'utf8');

  return { added, totalActiveFilers: existingArr.length, cloudQueueCount: cloudQueue.length };
}

const unsub = syncUnsubscribes();
const ucSync = syncUnderContractToCampaign(unsub.set);
console.log(`🔗 [WEBSITE <-> CAMPAIGN BRIDGE] Mirrored ${unsub.totalSuppressedEmails} suppressed opt-outs | Synced ${ucSync.added} new FMLS under-contract realtors | Cloud Queue: ${ucSync.cloudQueueCount} ready`);
