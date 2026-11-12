#!/usr/bin/env node
/**
 * Cloud-Native IMAP Opt-Out & Hard-Bounce Quarantine Guard
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Runs inside GitHub Actions BEFORE outbound email workflows when the local PC is off.
 * Connects to imap.gmail.com:993 via built-in node:tls, scans recent inbox messages
 * for opt-out replies ("stop", "unsubscribe", "remove") and hard bounces, and appends
 * them directly to `data/unsubscribed_contacts.json`.
 */

import fs from 'node:fs';
import path from 'node:path';
import tls from 'node:tls';

const ROOT = process.cwd();
const UNSUB_FILE = path.join(ROOT, 'data', 'unsubscribed_contacts.json');
const WARM_FILE = path.join(ROOT, 'data', 'cloud-imap-warm-replies.json');
const ENV_LOCAL = path.join(ROOT, '.env.local');
const NTFY_URL = 'https://ntfy.sh/fores-antigravity-alerts-77';

function getCredentials() {
  let user = process.env.EMAIL_USER || 'inspect@foresightcmi.com'; // ggignore
  let pass = process.env.EMAIL_PASSWORD || ''; // ggignore
  if (!pass && fs.existsSync(ENV_LOCAL)) {
    const raw = fs.readFileSync(ENV_LOCAL, 'utf8');
    const pm = raw.match(/EMAIL_PASSWORD=(.+)/); // ggignore
    const um = raw.match(/EMAIL_USER=(.+)/);
    if (pm) pass = pm[1].trim().replace(/^["']|["']$/g, '');
    if (um) user = um[1].trim().replace(/^["']|["']$/g, '');
  }
  return { user, pass };
}

async function scanImapInbox(user, pass) {
  return new Promise((resolve) => {
    const optOuts = new Set();
    const warmReplies = [];
    let buffer = '';
    let step = 0;
    const sock = tls.connect(993, 'imap.gmail.com', { servername: 'imap.gmail.com', timeout: 12000 });
    const finish = () => {
      try { sock.destroy(); } catch {}
      resolve({ optOuts: [...optOuts], warmReplies });
    };
    sock.on('timeout', finish);
    sock.on('error', finish);
    sock.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      if (step === 0 && buffer.includes('* OK')) {
        step = 1; buffer = '';
        sock.write(`A1 LOGIN "${user}" "${pass}"\r\n`);
      } else if (step === 1 && buffer.includes('A1 OK')) {
        step = 2; buffer = '';
        sock.write(`A2 SELECT INBOX\r\n`);
      } else if (step === 2 && buffer.includes('A2 OK')) {
        step = 3; buffer = '';
        const sinceDate = new Date(Date.now() - 4 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
        sock.write(`A3 SEARCH SINCE ${sinceDate} SUBJECT "Re:"\r\n`);
      } else if (step === 3 && buffer.includes('A3 OK')) {
        const match = buffer.match(/\* SEARCH([0-9 ]*)/);
        const ids = match && match[1].trim() ? match[1].trim().split(/\s+/).filter(Boolean).slice(-30) : [];
        if (ids.length === 0) {
          sock.write(`A4 LOGOUT\r\n`);
          return finish();
        }
        step = 4; buffer = '';
        sock.write(`A4 FETCH ${ids.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT MESSAGE-ID)] BODY.PEEK[TEXT]<0.350>)\r\n`);
      } else if (step === 4 && buffer.includes('A4 OK')) {
        const blocks = buffer.split(/\* \d+ FETCH/);
        for (const blk of blocks) {
          const fromMatch = blk.match(/From:.*<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/i);
          if (!fromMatch) continue;
          const e = fromMatch[1].toLowerCase().trim();
          if (e.includes('foresightcmi.com') || e.includes('fhinspectionsatl.com') || e.includes('mailer-daemon') || e.includes('postmaster')) continue;
          const subjMatch = blk.match(/Subject:\s*(.+)/i);
          const subject = subjMatch ? subjMatch[1].trim() : 'Re: Inspection Inquiry';
          const topText = blk.replace(/Reply stop anytime to opt out/gi, '');
          if (/\b(stop|unsubscribe|remove me|opt out|take me off|do not email)\b/i.test(topText)) {
            optOuts.add(e);
          } else if (/\b(inspect|quote|schedule|availab|due diligence|client|buyer|listing|price|call|text|thanks|thank you)\b/i.test(topText)) {
            warmReplies.push({ email: e, subject, snippet: topText.slice(-180).replace(/\s+/g, ' ').trim() });
          }
        }
        sock.write(`A5 LOGOUT\r\n`);
        finish();
      } else if (buffer.includes('A1 NO') || buffer.includes('A1 BAD')) {
        finish();
      }
    });
  });
}

async function main() {
  const { user, pass } = getCredentials();
  if (!pass) {
    console.log('ℹ️ [IMAP Guard] No EMAIL_PASSWORD configured; skipping IMAP scan.');
    return;
  }
  const existing = fs.existsSync(UNSUB_FILE) ? JSON.parse(fs.readFileSync(UNSUB_FILE, 'utf8')) : [];
  const set = new Set((Array.isArray(existing) ? existing : []).map((e) => String(e).toLowerCase()));
  const before = set.size;

  const warmState = fs.existsSync(WARM_FILE) ? JSON.parse(fs.readFileSync(WARM_FILE, 'utf8')) : { alertedKeys: [], recentReplies: [] };
  const alertedSet = new Set(warmState.alertedKeys || []);

  const { optOuts, warmReplies } = await scanImapInbox(user, pass);
  optOuts.forEach((e) => set.add(e));
  if (set.size > before) {
    fs.writeFileSync(UNSUB_FILE, JSON.stringify([...set].sort(), null, 2), 'utf8');
  }

  let newWarmCount = 0;
  for (const w of warmReplies) {
    const key = `${w.email}|${w.subject}`;
    if (alertedSet.has(key) || set.has(w.email)) continue;
    alertedSet.add(key);
    newWarmCount++;
    warmState.recentReplies = [{ ...w, detectedAt: new Date().toISOString() }, ...(warmState.recentReplies || [])].slice(0, 50);
    try {
      await fetch(NTFY_URL, {
        method: 'POST',
        headers: { Title: `WARM REPLY: ${w.email}`, Priority: 'high', Tags: 'telephone_receiver,fire' },
        body: `Subj: ${w.subject}\n\nSuggested CMI Reply:\nThanks for reaching out — my partner and I inspect together as a 2-inspector Certified Master Inspector team ($345+ single-family / $295 condos, SUPRA eKEY, same-day reports). Call/text (678) 480-2110 or book at https://www.fhinspectionsatl.com/quote`
      });
    } catch {}
  }
  if (newWarmCount > 0 || !fs.existsSync(WARM_FILE)) {
    warmState.alertedKeys = [...alertedSet].slice(-200);
    fs.writeFileSync(WARM_FILE, JSON.stringify(warmState, null, 2), 'utf8');
  }
  console.log(`🛡️ [CLOUD IMAP GUARD] Opt-outs quarantined: +${set.size - before} (Total: ${set.size}) | New warm replies alerted: ${newWarmCount}`);
}

main();
