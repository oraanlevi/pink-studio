'use strict';

const { isAdminAuth }                          = require('../_lib/auth');
const { getDrafts, saveDrafts, appendHistory } = require('../_lib/blob');
const { createPin }                            = require('../_lib/pinterest-api');
const { validateDestinationUrl }               = require('../_lib/validate');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'method_not_allowed' }));
  }

  if (!isAdminAuth(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  let body = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => { body += chunk; });
    req.on('end', resolve);
    req.on('error', reject);
  });

  let id;
  try { ({ id } = JSON.parse(body || '{}')); } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'invalid_json' }));
  }

  const drafts = await getDrafts();

  // If id provided, publish that specific pin; otherwise pick the oldest approved
  let idx;
  if (id) {
    idx = drafts.findIndex(d => d.id === id);
    if (idx === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'not_found' }));
    }
  } else {
    // Find oldest approved pin (by approvedAt)
    const approved = drafts
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => d.status === 'approved')
      .sort((a, b) => new Date(a.d.approvedAt) - new Date(b.d.approvedAt));

    if (approved.length === 0) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'no_approved_pins' }));
    }
    idx = approved[0].i;
  }

  const pin = drafts[idx];

  // Safety gate — only approved pins may be published
  if (pin.status !== 'approved') {
    res.writeHead(409, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'not_approved', status: pin.status }));
  }

  // Fail closed: validate destinationUrl before calling Pinterest API
  const urlCheck = validateDestinationUrl(pin.destinationUrl);
  if (!urlCheck.valid) {
    res.writeHead(422, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'invalid_destination_url', reason: urlCheck.reason }));
  }

  // Publish to Pinterest
  let pinterestPinId;
  try {
    pinterestPinId = await createPin({
      title:          pin.title,
      description:    pin.description,
      imageUrl:       pin.imageUrl,
      destinationUrl: pin.destinationUrl,
      boardName:      pin.board,
    });
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'pinterest_api_error', message: err.message }));
  }

  const publishedAt = new Date().toISOString();

  // Update draft record
  drafts[idx] = { ...pin, status: 'published', publishedAt, pinterestPinId };
  await saveDrafts(drafts);

  // Append to permanent history
  await appendHistory({
    id:             pin.id,
    pinterestPinId,
    title:          pin.title,
    description:    pin.description,
    imageUrl:       pin.imageUrl,
    destinationUrl: pin.destinationUrl,
    board:          pin.board,
    publishedAt,
  });

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, id: pin.id, pinterestPinId, publishedAt }));
};
