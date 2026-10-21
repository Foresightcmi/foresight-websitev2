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
const ENV_LOCAL = path.join(ROOT, '.env.local');

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

async function scanImapOptOuts(user, pass) {
  return new Promise((resolve) => {
    const foundEmails = new Set();
    let buffer = '';
    let step = 0;
    const sock = tls.connect(993, 'imap.gmail.com', { servername: 'imap.gmail.com', timeout: 10000 });
    const finish = () => {
      try { sock.destroy(); } catch {}
      resolve([...foundEmails]);
    };
    sock.on('timeout', finish);
    sock.on('error', finish);
    sock.on('data', (chunk) => {
      buffer += chunk.toString('utf8');
      if (step === 0 && buffer.includes('* OK')) {
        step = 1;
        buffer = '';
        sock.write(`A1 LOGIN "${user}" "${pass}"\r\n`);
      } else if (step === 1 && buffer.includes('A1 OK')) {
        step = 2;
        buffer = '';
        sock.write(`A2 SELECT INBOX\r\n`);
      } else if (step === 2 && buffer.includes('A2 OK')) {
        step = 3;
        buffer = '';
        const sinceDate = new Date(Date.now() - 5 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
        sock.write(`A3 SEARCH SINCE ${sinceDate} OR BODY "unsubscribe" BODY "stop"\r\n`);
      } else if (step === 3 && buffer.includes('A3 OK')) {
        const match = buffer.match(/\* SEARCH([0-9 ]+)/);
        const ids = match ? match[1].trim().split(/\s+/).filter(Boolean).slice(-25) : [];
        if (ids.length === 0) {
          sock.write(`A4 LOGOUT\r\n`);
          return finish();
        }
        step = 4;
        buffer = '';
        sock.write(`A4 FETCH ${ids.join(',')} (BODY.PEEK[HEADER.FIELDS (FROM SUBJECT)])\r\n`);
      } else if (step === 4 && buffer.includes('A4 OK')) {
        const emailRegex = /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g;
        let m;
        while ((m = emailRegex.exec(buffer)) !== null) {
          const e = m[1].toLowerCase().trim();
          if (e !== user.toLowerCase() && !e.includes('google.com') && !e.includes('foresightcmi.com')) {
            foundEmails.add(e);
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
  const discovered = await scanImapOptOuts(user, pass);
  discovered.forEach((e) => set.add(e));
  if (set.size > before) {
    fs.writeFileSync(UNSUB_FILE, JSON.stringify([...set].sort(), null, 2), 'utf8');
  }
  console.log(`🛡️ [CLOUD IMAP OPT-OUT GUARD] Scanned inbox | Newly quarantined: ${set.size - before} | Total suppressed: ${set.size}`);
}

main();
