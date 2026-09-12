'use strict';

/**
 * Validate that a destination URL is a real Pink Web Studio page.
 *
 * Rules:
 *  - Must be parseable as a URL (no malformed strings)
 *  - Protocol must be exactly "https:"
 *  - Hostname must be exactly "pinkwebstudio.com" or "www.pinkwebstudio.com"
 *    (URL parsing is used — a string like "https://pinkwebstudio.com.evil.com"
 *    has hostname "pinkwebstudio.com.evil.com" and is rejected)
 *  - Blank / null / undefined values are rejected
 *
 * Returns { valid: true } or { valid: false, reason: string }.
 */
function validateDestinationUrl(value) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return { valid: false, reason: 'destinationUrl is required' };
  }

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return { valid: false, reason: 'destinationUrl is not a valid URL' };
  }

  if (parsed.protocol !== 'https:') {
    return { valid: false, reason: 'destinationUrl must use HTTPS' };
  }

  const allowed = ['pinkwebstudio.com', 'www.pinkwebstudio.com'];
  if (!allowed.includes(parsed.hostname)) {
    return { valid: false, reason: `destinationUrl hostname must be pinkwebstudio.com (got "${parsed.hostname}")` };
  }

  return { valid: true };
}

module.exports = { validateDestinationUrl };
