'use strict';

const { parseCookies } = require('../_lib/auth');
const { storeTokens }  = require('../_lib/blob');

module.exports = async (req, res) => {
  const url    = new URL(req.url, `https://${req.headers.host}`);
  const code   = url.searchParams.get('code');
  const state  = url.searchParams.get('state');
  const pError = url.searchParams.get('error');

  // Pinterest returned an error (e.g. user denied access)
  if (pError) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=access_denied' });
    return res.end();
  }

  if (!code || !state) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=missing_params' });
    return res.end();
  }

  // Validate CSRF state
  const cookies     = parseCookies(req);
  const storedState = cookies['oauth_state'];

  if (!storedState || storedState !== state) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=invalid_state' });
    return res.end();
  }

  // Consume the state cookie immediately
  res.setHeader(
    'Set-Cookie',
    'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
  );

  // Exchange authorization code for tokens
  const credentials = Buffer.from(
    `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`,
  ).toString('base64');

  let tokenData;
  try {
    const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        Authorization:  `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type:   'authorization_code',
        code,
        redirect_uri: process.env.PINTEREST_REDIRECT_URI,
      }).toString(),
    });

    if (!tokenRes.ok) {
      // Read and discard body — do NOT log it (may contain sensitive data)
      await tokenRes.text();
      res.writeHead(302, { Location: '/admin/pinterest/connect/?error=token_exchange_failed' });
      return res.end();
    }

    tokenData = await tokenRes.json();
  } catch {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=network_error' });
    return res.end();
  }

  const { refresh_token, scope } = tokenData;

  if (!refresh_token) {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=no_refresh_token' });
    return res.end();
  }

  // Persist refresh token in private Blob — value never logged
  try {
    await storeTokens({ refreshToken: refresh_token, scope });
  } catch {
    res.writeHead(302, { Location: '/admin/pinterest/connect/?error=storage_failed' });
    return res.end();
  }

  res.writeHead(302, { Location: '/admin/pinterest/connect/?connected=1' });
  res.end();
};
