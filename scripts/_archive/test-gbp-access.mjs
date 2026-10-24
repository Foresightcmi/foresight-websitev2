import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const KEY_PATH = path.resolve(process.cwd(), 'secrets', 'ga4-key.json');
const keyData = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

function createJwt(saEmail, privateKey, scopes) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: saEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Claim = Buffer.from(JSON.stringify(claim)).toString('base64url');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(b64Header + '.' + b64Claim);
  const signature = sign.sign(privateKey, 'base64url');
  return b64Header + '.' + b64Claim + '.' + signature;
}

async function getAccessToken(jwt) {
  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
}

async function checkGbp() {
  const jwt = createJwt(keyData.client_email, keyData.private_key, [
    'https://www.googleapis.com/auth/business.manage'
  ]);
  const token = await getAccessToken(jwt);
  console.log('Access token generated successfully.');

  // Test 1: Account Management API
  console.log('Testing My Business Account Management API...');
  const accRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const accData = await accRes.json();
  console.log('Account Management status:', accRes.status);
  console.log('Account Management full response:', JSON.stringify(accData, null, 2));

  // Test 2: Business Profile Performance API
  console.log('Testing Business Profile Performance API...');
  const perfRes = await fetch('https://businessprofileperformance.googleapis.com/v1/locations/test:getDailyMetricsTimeSeries', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const perfData = await perfRes.json();
  console.log('Performance API status:', perfRes.status, perfData.error ? perfData.error.message : 'OK');

  // Test 3: Business Information API
  console.log('Testing Business Information API...');
  const infoRes = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/categories?regionCode=US&languageCode=en', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const infoData = await infoRes.json();
  console.log('Business Information status:', infoRes.status, infoData.error ? infoData.error.message : 'OK');
}

checkGbp().catch(err => console.error('Fatal Error:', err));
