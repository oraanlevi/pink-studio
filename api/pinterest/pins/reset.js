'use strict';

/**
 * Admin-only endpoint to clear and re-seed drafts from the current INITIAL_DRAFTS.
 * Safety gate: refuses to run if any pin has been published.
 * Use this only when copy or image data in seed.js has changed before publishing begins.
 */

const { isAdminAuth }            = require('../_lib/auth');
const { getDrafts, saveDrafts, getHistory } = require('../_lib/blob');
const { validateDestinationUrl } = require('../_lib/validate');

const INITIAL_DRAFTS = require('./_drafts');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'method_not_allowed' }));
  }

  if (!isAdminAuth(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  // Refuse if anything has been published
  const [existing, history] = await Promise.all([getDrafts(), getHistory()]);
  const published = existing.filter(d => d.status === 'published');

  if (published.length > 0 || history.length > 0) {
    res.writeHead(409, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      error:   'published_pins_exist',
      message: 'Cannot reset after pins have been published.',
    }));
  }

  // Validate all destination URLs before writing
  for (const draft of INITIAL_DRAFTS) {
    const check = validateDestinationUrl(draft.destinationUrl);
    if (!check.valid) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'invalid_draft_data', id: draft.id, reason: check.reason }));
    }
  }

  const now = new Date().toISOString();
  const drafts = INITIAL_DRAFTS.map(d => ({
    ...d,
    createdAt:      now,
    approvedAt:     null,
    publishedAt:    null,
    pinterestPinId: null,
  }));

  await saveDrafts(drafts);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ reset: drafts.length }));
};
