'use strict';

const { isAdminAuth } = require('../_lib/auth');
const { isConnected, getMeta } = require('../_lib/blob');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405, { Allow: 'GET' });
    return res.end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (!isAdminAuth(req)) {
    res.writeHead(200);
    return res.end(JSON.stringify({ authenticated: false, connected: false }));
  }

  try {
    const connected = await isConnected();
    const meta = connected ? await getMeta() : null;
    res.writeHead(200);
    res.end(JSON.stringify({
      authenticated: true,
      connected,
      connectedAt: meta?.connectedAt ?? null,
      scope:        meta?.scope        ?? null,
    }));
  } catch (err) {
    // Do not expose internal error details
    res.writeHead(500);
    res.end(JSON.stringify({ authenticated: true, connected: false, error: 'status_check_failed' }));
  }
};
