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
const EXCLUDED_DOMAINS = /@(ansleyre|ansleyatlanta|drhorton|pulte|lennar|ashtonwoods|stanleymartin|centurycommunities|beazer|adamshomes|rocklynhomes|meritagehomes|tollbrothers|kbhome|taylormorrison|smithdouglas|chafincommunities|chafinrealtyinc|paranhomes)\.com$/i;

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
    ? `https://fhinspectionsatl.com/quote?prop=${encodeURIComponent(addr)}`
    : `https://fhinspectionsatl.com/quote`;

  const subject = addr
    ? (isDeKalb ? `Congrats on ${addr} (${city}) — 24-hr due diligence + $100 DeKalb Low-Flow Cert` : `Congrats on ${addr} (${city}) — 2-inspector due diligence slot ($345+)`)
    : (isDeKalb ? `${firstName} — $100 DeKalb Low-Flow Certificates & 2-inspector due diligence in ${city}` : `${firstName} — keeping your ${city} deals together during due diligence`);

  const opener = addr
    ? `Congrats on your recent activity at ${addr} in ${city}! Wanted to reach out in case your buyers or the co-op agent need a rapid 24-hour due diligence inspection.`
    : `I work closely with agents across ${city} and wanted to introduce myself in case you need a fast, level-headed two-inspector team during due diligence.`;

  const text = [
    `Hi ${firstName},`,
    ``,
    opener,
    ``,
    `My partner and I inspect every property as a two-inspector Certified Master Inspector (CMI) team with active SUPRA eKEY access:`,
    `• 2-Inspector Team Starting at $345 ($295 Condos): Half the inspection time, same-day digital reports, and a calm walk-through separating real defects from normal wear.`,
    `• Mandatory DeKalb County Low-Flow Plumbing Certificate ($100 Flat Fee): Same-day signed Certificate of Compliance for DeKalb Watershed water turn-on.`,
    `• Sewer Camera Scope ($450 Flat Rate), Pre-Drywall ($275+) & 11-Month Builder Warranty ($335+): Calibrated infrared thermal imaging & 4K aerial drone roof scans included.`,
    `• Pre-Listing Seller Inspections (From $365) & Free Due Diligence Calculator: https://fhinspectionsatl.com/due-diligence`,
    `• $35,000 Combined Buyer Protection Warranties ($10,000 Elite Warranty + $25,000 Honor Guarantee).`,
    ``,
    `Grab an instant quote at ${quoteUrl} or text/call me directly at (678) 480-2110.`,
    ``,
    `Best regards,`,
    `Christopher Boykin, CMI`,
    `Foresight Home Inspections`,
    `(678) 480-2110 | https://fhinspectionsatl.com`,
    `1816 South Deshon Road, Lithonia, GA 30058`,
    `Reply stop anytime to opt out.`
  ].join('\n');

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;max-width:600px;">
<p>Hi ${firstName},</p>
<p>${opener}</p>
<p>My partner and I inspect every property as a <strong>two-inspector Certified Master Inspector (CMI) team</strong> with active SUPRA eKEY access:</p>
<ul style="padding-left:20px;margin:14px 0;">
<li style="margin-bottom:8px;"><strong>2-Inspector Team Starting at $345 ($295 Condos):</strong> Half the inspection time, same-day digital reports, and a calm walk-through.</li>
<li style="margin-bottom:8px;"><strong>${isDeKalb ? 'Mandatory DeKalb County Low-Flow Certificate ($100 Flat Fee):' : 'DeKalb County Low-Flow Plumbing Certificate ($100 Flat Fee):'}</strong> Same-day signed Certificate of Compliance for DeKalb Watershed water turn-on.</li>
<li style="margin-bottom:8px;"><strong>Sewer Camera Scope ($450 Flat Rate), New Build &amp; 11-Month Warranty ($335+):</strong> Pre-Drywall ($275+), Final ($400+), calibrated infrared thermal imaging, and 4K drone roof scans.</li>
<li style="margin-bottom:8px;"><strong>Pre-Listing Seller Inspections ($365+) &amp; Free Tool:</strong> <a href="https://fhinspectionsatl.com/due-diligence" style="color:#0f52ba;text-decoration:underline;">Georgia Due Diligence &amp; Repair Addendum Builder</a> + $35,000 warranty protection.</li>
</ul>
<p>Check availability or grab an instant quote at <a href="${quoteUrl}" style="color:#0f52ba;text-decoration:underline;">fhinspectionsatl.com/quote</a> or text/call me at <strong>(678) 480-2110</strong>.</p>
<p style="margin-top:20px;">Best regards,<br><strong>Christopher Boykin, CMI</strong><br>Foresight Home Inspections<br>(678) 480-2110 | <a href="https://fhinspectionsatl.com" style="color:#0f52ba;">fhinspectionsatl.com</a><br><span style="font-size:12px;color:#6b7280;">1816 South Deshon Road, Lithonia, GA 30058 &bull; Reply stop anytime to opt out.</span></p>
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
  const unsubSet = new Set((Array.isArray(unsubArr) ? unsubArr : []).map((e) => String(e).toLowerCase()));
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
