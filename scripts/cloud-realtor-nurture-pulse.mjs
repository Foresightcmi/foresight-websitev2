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
    `Foresight Home Inspections | 1816 South Deshon Road, Lithonia, GA 30058`
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #1e293b;box-shadow:0 20px 40px rgba(0,0,0,0.35);">
    <tr><td height="5" style="background:linear-gradient(90deg,#1e3a8a 0%,#2563eb 35%,#f59e0b 70%,#d97706 100%);"></td></tr>
    <tr>
      <td style="background-color:#050811;padding:28px 32px 22px 32px;text-align:center;border-bottom:1px solid #1e293b;">
        <a href="https://www.fhinspectionsatl.com"><img src="https://www.fhinspectionsatl.com/images/Logopng.png" alt="Foresight Home Inspections" width="205" style="display:block;margin:0 auto;max-width:100%;border:0;" /></a>
        <div style="display:inline-block;margin-top:12px;padding:5px 15px;background:#0f172a;border-radius:20px;border:1px solid #334155;color:#fbbf24;font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">★ Executive Due Diligence Advisory &bull; ${city}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <table role="presentation" align="right" cellspacing="0" cellpadding="0" style="margin-left:14px;margin-bottom:10px;">
          <tr>
            <td style="padding-right:8px;"><img src="https://www.fhinspectionsatl.com/images/cmi_logo.png" alt="CMI" height="58" style="display:block;height:58px;width:auto;" /></td>
            <td><img src="https://www.fhinspectionsatl.com/images/cpi_logo.png" alt="CPI" height="58" style="display:block;height:58px;width:auto;" /></td>
          </tr>
        </table>
        <p style="font-size:16px;font-weight:700;color:#0f172a;margin:0 0 14px 0;">Hi ${firstName},</p>
        <p style="font-size:15px;line-height:1.65;color:#334155;margin:0 0 16px 0;">${opener}</p>
        <div style="background-color:#f8fafc;border-left:4px solid #1e3a8a;border-top:1px solid #e2e8f0;border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:18px 20px;border-radius:6px;margin:18px 0;">
          <div style="font-size:12px;font-weight:800;text-transform:uppercase;color:#1e3a8a;letter-spacing:0.8px;margin-bottom:8px;">The Foresight Two-Inspector Executive Standard</div>
          <p style="margin:0 0 8px 0;font-size:14px;line-height:1.55;color:#1e293b;"><strong>✓ Two Certified Master Inspectors on Every Home ($345+ / $295 Condos):</strong> Half the inspection time, active SUPRA eKEY access, and same-day digital reports with a calm walk-through separating real issues from normal maintenance.</p>
          <p style="margin:0 0 8px 0;font-size:14px;line-height:1.55;color:#1e293b;"><strong>✓ DeKalb County Low-Flow Plumbing Certificate ($100 Flat Fee):</strong> On-site verification &amp; signed Certificate of Compliance for pre-1993 homes in unincorporated DeKalb County.</p>
          <p style="margin:0 0 8px 0;font-size:14px;line-height:1.55;color:#1e293b;"><strong>✓ Sewer Scope ($450 Flat), New Build ($275+) &amp; Pre-Listing ($365+):</strong> Includes 4K aerial drone roof checks, calibrated infrared thermal imaging, and free VIP Utility Plus™ concierge.</p>
          <p style="margin:0;font-size:14px;line-height:1.55;color:#1e293b;"><strong>✓ $35,000 Combined Buyer Protection Warranties:</strong> $10,000 Zero-Deductible 90-Day Warranty + $25,000 Honor Guarantee.</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${quoteUrl}" style="display:inline-block;background-color:#0f172a;color:#ffffff;font-weight:800;font-size:14.5px;padding:14px 28px;border-radius:7px;text-decoration:none;border:2px solid #0f172a;margin:4px;">📅 Schedule Online 24/7 &rarr;</a>
          <a href="tel:6784802110" style="display:inline-block;background-color:#ffffff;color:#1e3a8a;font-weight:800;font-size:14.5px;padding:14px 24px;border-radius:7px;text-decoration:none;border:2px solid #1e3a8a;margin:4px;">📞 Direct Cell: (678) 480-2110</a>
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e2e8f0;padding-top:20px;margin-top:16px;">
          <tr>
            <td width="72" valign="middle" style="padding-right:16px;"><img src="https://www.fhinspectionsatl.com/images/Christopher_Boykin.webp" alt="Christopher Boykin" width="68" height="68" style="border-radius:50%;width:68px;height:68px;object-fit:cover;border:2px solid #1e3a8a;display:block;" /></td>
            <td valign="middle">
              <div style="font-size:15.5px;font-weight:800;color:#0f172a;">Christopher Boykin, CMI®</div>
              <div style="font-size:12.5px;color:#64748b;line-height:1.45;">Certified Master Inspector® #MICB-1082 &bull; InterNACHI Certified<br>Founder &amp; Lead Inspector &bull; <strong>Foresight Home Inspections, LLC</strong></div>
              <div style="font-size:12.5px;margin-top:4px;font-weight:700;"><a href="tel:6784802110" style="color:#2563eb;text-decoration:none;">(678) 480-2110</a> | <a href="https://www.fhinspectionsatl.com" style="color:#2563eb;text-decoration:none;">www.fhinspectionsatl.com</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color:#050811;padding:20px 32px;text-align:center;color:#94a3b8;font-size:11.5px;line-height:1.5;border-top:1px solid #1e293b;">
        Foresight Home Inspections, LLC &bull; 1816 South Deshon Road, Lithonia, GA 30058<br>
        Serving 87 Cities Across Metro Atlanta &bull; Reply stop anytime to opt out.
      </td>
    </tr>
  </table>
</body>
</html>`;

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
