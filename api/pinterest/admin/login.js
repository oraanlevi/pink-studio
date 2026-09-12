'use strict';

const crypto = require('crypto');
const { adminSessionValue } = require('../_lib/auth');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += String(chunk); });
    req.on('end', () => {
      try { resolve(new URLSearchParams(data)); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    return res.end();
  }

  let body;
  try { body = await readBody(req); }
  catch {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=invalid' });
    return res.end();
  }

  const provided = body.get('password') || '';
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD || '';

  if (!provided || !expected) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=invalid' });
    return res.end();
  }

  // Constant-time comparison to resist timing attacks
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  const match =
    providedBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(providedBuf, expectedBuf);

  if (!match) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=invalid' });
    return res.end();
  }

  const sessionVal = adminSessionValue();
  // 24-hour session
  res.setHeader(
    'Set-Cookie',
    `pws_admin_session=${sessionVal}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
  );
  res.writeHead(302, { Location: '/admin/pinterest/connect/' });
  res.end();
};
