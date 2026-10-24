#!/usr/bin/env node
/**
 * Cloud-Native Autonomous Realtor Nurture Pulse (GitHub Actions 24/7 Cloud Runner)
 * Foresight Home Inspections (https://www.fhinspectionsatl.com)
 *
 * Runs 100% in GitHub's cloud without needing the local PC or chat session to be on:
 * - Strict 9:00 AM - 6:00 PM Eastern (America/New_York) daytime window guard
 * - 0% @ansleyre.com / @ansleyatlanta.com & unsubscribed_contacts.json suppression
 * - Automatic DeKalb County $100 Low-Flow Certificate + $365 Pre-Listing Seller Bridge
 * - Git-persisted state in `data/cloud-realtor-nurture-state.json` (14-day cooldown)
 */

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const ROOT = process.cwd();
const QUEUE_FILE = path.join(ROOT, 'data', 'cloud-realtor-nurture-queue.json');
const STATE_FILE = path.join(ROOT, 'data', 'cloud-realtor-nurture-state.json');
const UNSUB_FILE = path.join(ROOT, 'data', 'unsubscribed_contacts.json');
const DD_LOG_FILE = path.join(ROOT, 'data', 'due-diligence-outreach-log.json');
const ENV_LOCAL = path.join(ROOT, '.env.local');

const DEKALB_REGEX = /\b(lithonia|stone mountain|tucker|decatur|redan|stonecrest|chamblee|dunwoody|brookhaven|avondale estates|clarkston|doraville|pine lake|ellenwood|scottdale|conley|dekalb)\b/i;
const EXCLUDED_DOMAINS = /@(ansleyre|ansleyatlanta|metrobrokers|cbcmetrobrokers|peachtreetc|drhorton|pulte|lennar|ashtonwoods|stanleymartin|centurycommunities|beazer|adamshomes|rocklynhomes|meritagehomes|tollbrothers|kbhome|taylormorrison|smithdouglas|chafincommunities|chafinrealtyinc|paranhomes|dwhomes|theprovidencegroup|relianthomes|odwyerhomes|cstonega)\.com$/i;

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

function isWithinEasternDaytime() {
  const etHour = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(new Date())
  );
  return etHour >= 9 && etHour < 18;
}

function buildCloudEmail(contact) {
  const firstName = (contact.first_name || 'there').trim();
  const city = (contact.city || 'Metro Atlanta').trim();
  const addr = (contact.listing_address || '').trim();
  const isDeKalb = DEKALB_REGEX.test(city) || DEKALB_REGEX.test(addr);

  const subject = addr
    ? (isDeKalb ? `Quick congrats on ${addr} in ${city}` : `Congrats on ${addr} in ${city}`)
    : (isDeKalb ? `Quick intro — DeKalb Low-Flow certs & 2-inspector team in ${city}` : `Quick intro — 2-inspector due diligence team in ${city}`);

  const opener = addr
    ? `Congrats on your recent activity at ${addr} in ${city}. I wanted to reach out personally in case your buyers or the co-op agent need a fast 24-hour inspection slot during due diligence.`
    : `I work closely with agents across ${city} and wanted to introduce myself in case you ever need a fast, level-headed two-inspector team during a tight due diligence window.`;

  const dekalbPara = isDeKalb
    ? `Since you work in the DeKalb area, if you ever have a closing on a pre-1993 home in unincorporated DeKalb County, we also sign the official DeKalb Watershed Low-Flow Plumbing Certificate ($100 flat fee) on the spot so your buyer's water turn-on is never held up. We also handle main sewer line camera scopes ($450 flat rate), pre-drywall and 11-month builder warranty inspections ($335+), and pre-listing seller inspections ($365+).`
    : `Alongside buyer inspections, we also handle main sewer line camera scopes ($450 flat rate), pre-drywall and 11-month builder warranty inspections ($335+), pre-listing seller inspections ($365+), and signed DeKalb County Low-Flow Plumbing Certificates ($100 flat fee).`;

  const text = [
    `Hi ${firstName},`,
    ``,
    opener,
    ``,
    `My partner and I inspect every home together as a two-inspector Certified Master Inspector team with active SUPRA eKEY access, starting at $345 ($295 for condos). Having both of us on site cuts the inspection time in half, includes infrared thermal imaging and a 4K drone roof check, and gets the report back the same evening with a calm walk-through that separates real structural or mechanical issues from minor cosmetic wear.`,
    ``,
    dekalbPara,
    ``,
    `Every full inspection includes $35,000 in buyer protection warranties. Keep my cell handy and text or call me anytime at (678) 480-2110 if you need a quick slot.`,
    ``,
    `Best regards,`,
    `Christopher Boykin, CMI`,
    `Foresight Home Inspections`,
    `(678) 480-2110 | www.fhinspectionsatl.com`,
    `1816 South Deshon Road, Lithonia, GA 30058`,
    `Just reply stop if you prefer I don't reach out.`
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;max-width:600px;">
<p style="margin:0 0 14px 0;">Hi ${firstName},</p>
<p style="margin:0 0 14px 0;">${opener}</p>
<p style="margin:0 0 14px 0;">My partner and I inspect every home together as a two-inspector Certified Master Inspector team with active SUPRA eKEY access, starting at $345 ($295 for condos). Having both of us on site cuts the inspection time in half, includes infrared thermal imaging and a 4K drone roof check, and gets the report back the same evening with a calm walk-through that separates real structural or mechanical issues from minor cosmetic wear.</p>
<p style="margin:0 0 14px 0;">${dekalbPara}</p>
<p style="margin:0 0 14px 0;">Every full inspection includes $35,000 in buyer protection warranties. Keep my cell handy and text or call me anytime at <strong>(678) 480-2110</strong> if you need a quick slot.</p>
<p style="margin:18px 0 0 0;">Best regards,<br><strong>Christopher Boykin, CMI</strong><br>Foresight Home Inspections<br>(678) 480-2110 | <a href="https://www.fhinspectionsatl.com" style="color:#0f52ba;text-decoration:none;">www.fhinspectionsatl.com</a><br><span style="font-size:12px;color:#6b7280;">1816 South Deshon Road, Lithonia, GA 30058 &bull; Just reply stop if you prefer I don't reach out.</span></p>
</div>`;

  return { subject, text, html };
}

async function main() {
  console.log('☁️ [CLOUD REALTOR NURTURE PULSE] Initializing GitHub Cloud Nurture Engine...');
  if (!isWithinEasternDaytime() && !process.argv.includes('--force')) {
    console.log('⏸️ Outside 9:00 AM - 6:00 PM Eastern daytime window. Skipping live send.');
    return;
  }

  const queue = fs.existsSync(QUEUE_FILE) ? JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')) : [];
  const unsubArr = fs.existsSync(UNSUB_FILE) ? JSON.parse(fs.readFileSync(UNSUB_FILE, 'utf8')) : [];
  const unsubSet = new Set((Array.isArray(unsubArr) ? unsubArr : []).map((e) => (typeof e === 'string' ? e : e?.email || '').toLowerCase().trim()).filter(Boolean));
  const ddLog = fs.existsSync(DD_LOG_FILE) ? JSON.parse(fs.readFileSync(DD_LOG_FILE, 'utf8')) : {};
  const ddSent = new Set((ddLog.sentEmails || []).map((e) => String(e).toLowerCase()));
  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : { lastSentByEmail: {}, totalCloudSent: 0 };

  const now = Date.now();
  const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
  const eligible = queue.filter((c) => {
    const email = String(c.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return false;
    if (unsubSet.has(email) || ddSent.has(email)) return false;
    if (EXCLUDED_DOMAINS.test(email) || /ansley|chapman group/i.test(c.brokerage || '') || /amy fuchs|joe chapman/i.test(c.full_name || '')) return false;
    const lastTs = state.lastSentByEmail?.[email] ? new Date(state.lastSentByEmail[email]).getTime() : 0;
    return now - lastTs > COOLDOWN_MS;
  });

  console.log(`  📋 Eligible Realtors in Cloud Queue: ${eligible.length}`);
  if (process.argv.includes('--dry-run')) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    console.log('  ✅ Dry-run verified. State file initialized.');
    return;
  }

  const { user, pass } = getCredentials();
  if (!pass) {
    console.log('  ℹ️ EMAIL_PASSWORD not set in environment; skipping live SMTP send.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass }
  });

  const batchLimit = Number(process.env.CLOUD_NURTURE_LIMIT || 18);
  let sent = 0;
  for (const contact of eligible.slice(0, batchLimit)) {
    const email = String(contact.email).trim().toLowerCase();
    const msg = buildCloudEmail(contact);
    try {
      await transporter.sendMail({
        from: `"Christopher Boykin | Foresight Home Inspections" <${user}>`,
        to: email,
        subject: msg.subject,
        text: msg.text,
        html: msg.html
      });
      state.lastSentByEmail[email] = new Date().toISOString();
      state.totalCloudSent = (state.totalCloudSent || 0) + 1;
      sent++;
      console.log(`  ✓ Cloud-sent (${sent}/${batchLimit}) -> ${email}`);
      await new Promise((r) => setTimeout(r, 15000));
    } catch (err) {
      console.warn(`  ⚠️ SMTP stop on ${email}: ${err.message}`);
      if (/550|454|Daily user sending limit/i.test(err.message)) break;
    }
  }

  state.lastRunAt = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  console.log(`✅ [CLOUD REALTOR NURTURE PULSE] Sent ${sent} emails. Total Cloud Sent: ${state.totalCloudSent}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
