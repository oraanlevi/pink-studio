'use strict';

const { isAdminAuth } = require('../_lib/auth');
const { getDrafts, getHistory } = require('../_lib/blob');

module.exports = async (req, res) => {
  if (!isAdminAuth(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  const [drafts, history] = await Promise.all([getDrafts(), getHistory()]);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ drafts, history }));
};
