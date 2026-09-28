'use strict';

const { isAdminAuth } = require('../_lib/auth');
const { disconnect }  = require('../_lib/blob');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' });
    return res.end();
  }

  if (!isAdminAuth(req)) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/' });
    return res.end();
  }

  try {
    await disconnect();
  } catch {
    // Disconnect failed — redirect back; UI will still show connected state
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=disconnect_failed' });
    return res.end();
  }

  res.writeHead(302, { Location: '/admin/pinterest/connect/' });
  res.end();
};
