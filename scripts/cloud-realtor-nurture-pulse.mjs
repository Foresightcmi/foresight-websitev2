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
  const quoteUrl = addr
    ? `https://www.fhinspectionsatl.com/quote?prop=${encodeURIComponent(addr)}`
    : `https://www.fhinspectionsatl.com/quote`;

  const subject = addr
    ? (isDeKalb ? `Congrats on ${addr} (${city}) — 24-Hr Priority Due Diligence + $100 DeKalb Low-Flow` : `Congrats on ${addr} (${city}) — 24-Hr Priority Due Diligence Slot`)
    : (isDeKalb ? `Keeping your ${city} contracts together + $100 DeKalb Low-Flow Certificates` : `Keeping your ${city} contracts together during due diligence`);

  const opener = addr
    ? `Congratulations on your recent activity at <strong>${addr}</strong> in <strong>${city}</strong>. I wanted to reach out personally in case your buyers or the co-op agent need a fast 24-hour inspection slot during due diligence.`
    : `I work closely with top-producing agents across <strong>${city}</strong> and wanted to introduce myself in case you ever need a fast, level-headed two-inspector team during a tight due diligence window.`;

  const text = [
    `Hi ${firstName},`,
    ``,
    opener.replace(/<\/?strong>/g, ''),
    ``,
    `My partner and I inspect every home together as a two-inspector Certified Master Inspector team with active SUPRA eKEY access, starting at $345 ($295 for condos). Having both of us on site cuts the inspection time in half, includes calibrated infrared thermal imaging and a 4K drone roof check, and gets the report back the same evening.`,
    ``,
    `We also handle signed DeKalb County Low-Flow Plumbing Certificates ($100 flat fee), main sewer line camera scopes ($450 flat rate), pre-drywall ($275+) and 11-month builder warranty inspections ($335+), and pre-listing seller inspections ($365+).`,
    ``,
    `Reserve a slot at ${quoteUrl} or text/call me directly at (678) 480-2110.`,
    ``,
    `Best regards,`,
    `Christopher Boykin, CMI`,
    `Foresight Home Inspections | Serving Metro Atlanta • `
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0;background-color:#ffffff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;">
  <div style="background-color:#0f172a;border-bottom:3px solid #d4af37;padding:18px 24px;">
    <div style="font-size:17px;font-weight:700;color:#ffffff;letter-spacing:0.6px;">FORESIGHT HOME INSPECTIONS</div>
    <div style="font-size:12px;font-weight:600;color:#d4af37;letter-spacing:0.5px;margin-top:4px;">CERTIFIED MASTER INSPECTOR (#MICB-1082) &bull; TWO-INSPECTOR TEAM &bull; ${city.toUpperCase()}</div>
  </div>
  <div style="padding:24px 24px 20px 24px;">
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.62;color:#1e293b;">Hi ${firstName},</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.62;color:#1e293b;">${opener}</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.62;color:#1e293b;">My partner and I inspect every home together as a two-inspector Certified Master Inspector team with active SUPRA eKEY access. Having two of us on site cuts the appointment time in half and gives your buyers a calm, practical walkthrough separating real defects from normal maintenance.</p>
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #d4af37;border-radius:6px;padding:14px 18px;margin:18px 0;">
      <div style="font-size:12px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:10px;">How We Help Protect Your Closings</div>
      <div style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#1e293b;"><strong style="color:#0f172a;">&#9642; Two Certified Master Inspectors ($345+ / $295 Condos):</strong> Half the inspection time, active SUPRA eKEY access, and same-day digital reports.</div>
      <div style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:#1e293b;"><strong style="color:#0f172a;">&#9642; DeKalb County $100 Low-Flow Certificate:</strong> Same-day signed Certificate of Compliance for pre-1993 homes in unincorporated DeKalb County.</div>
      <div style="margin:0;font-size:14px;line-height:1.5;color:#1e293b;"><strong style="color:#0f172a;">&#9642; Sewer Scope ($450), New Build ($275+) &amp; $35,000 Warranties:</strong> Includes 4K drone roof photography, calibrated infrared thermal scans, and $35,000 in buyer warranty protection.</div>
    </div>
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.62;color:#1e293b;">Next time you're in a tight due diligence window, just text or call my cell at <strong>(678) 480-2110</strong> and we'll get your client taken care of within 24 to 48 hours.</p>
    <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:16px;">
      <div style="font-size:15px;font-weight:700;color:#0f172a;">Christopher Boykin, CMI</div>
      <div style="font-size:13px;color:#475569;margin-top:2px;">Founder &amp; Lead Inspector &bull; Foresight Home Inspections</div>
      <div style="font-size:13px;color:#0f172a;margin-top:6px;"><strong>Direct / Text:</strong> (678) 480-2110 &nbsp;|&nbsp; <a href="https://www.fhinspectionsatl.com" style="color:#0f52ba;text-decoration:none;font-weight:600;">www.fhinspectionsatl.com</a></div>
      <div style="font-size:11px;color:#64748b;margin-top:8px;">Serving Metro Atlanta • Reply stop anytime to opt out.</div>
    </div>
  </div>
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
