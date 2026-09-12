'use strict';

const crypto = require('crypto');

/**
 * Parse Cookie header into a key→value map.
 */
function parseCookies(req) {
  const cookies = {};
  const header = req.headers.cookie || '';
  header.split(';').forEach(part => {
    const eqIdx = part.indexOf('=');
    if (eqIdx < 0) return;
    const key = part.slice(0, eqIdx).trim();
    const val = part.slice(eqIdx + 1).trim();
    try { cookies[key] = decodeURIComponent(val); } catch { cookies[key] = val; }
  });
  return cookies;
}

/**
 * Derive the expected admin session cookie value from ADMIN_DASHBOARD_PASSWORD.
 * Returns null if the env var is missing.
 */
function adminSessionValue() {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) return null;
  return crypto
    .createHash('sha256')
    .update(password + 'pws-admin-v1')
    .digest('hex');
}

/**
 * Return true if the request carries a valid admin session cookie.
 */
function isAdminAuth(req) {
  const expected = adminSessionValue();
  if (!expected) return false;
  const cookies = parseCookies(req);
  const provided = cookies['pws_admin_session'] || '';
  if (!provided || provided.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

module.exports = { parseCookies, adminSessionValue, isAdminAuth };
