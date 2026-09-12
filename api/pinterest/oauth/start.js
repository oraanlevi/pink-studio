'use strict';

const crypto = require('crypto');
const { isAdminAuth } = require('../_lib/auth');

module.exports = (req, res) => {
  if (!isAdminAuth(req)) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=unauthorized' });
    return res.end();
  }

  const state = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();

  const params = new URLSearchParams({
    client_id:     process.env.PINTEREST_CLIENT_ID,
    redirect_uri:  process.env.PINTEREST_REDIRECT_URI,
    response_type: 'code',
    scope:         'boards:read,boards:write,pins:read,pins:write',
    state,
  });

  res.setHeader(
    'Set-Cookie',
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=${expires}`,
  );
  res.writeHead(302, { Location: `https://www.pinterest.com/oauth/?${params}` });
  res.end();
};
