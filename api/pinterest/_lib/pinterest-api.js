'use strict';

const { getRefreshToken } = require('./blob');

// ── Sandbox mode ──────────────────────────────────────────────────────────────
// Active when PINTEREST_SANDBOX_ACCESS_TOKEN is set in the environment.
// To return to production: remove / unset that env var — no code changes needed.

function isSandbox() {
  return Boolean(process.env.PINTEREST_SANDBOX_ACCESS_TOKEN);
}

function baseUrl() {
  return isSandbox()
    ? 'https://api-sandbox.pinterest.com/v5'
    : 'https://api.pinterest.com/v5';
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Return a valid access token for API calls.
 * - Sandbox: returns the static sandbox token directly (no OAuth exchange).
 * - Production: exchanges the stored refresh token for a short-lived access token.
 * The token value is NEVER logged.
 */
async function refreshAccessToken() {
  if (isSandbox()) {
    const token = process.env.PINTEREST_SANDBOX_ACCESS_TOKEN;
    if (!token) throw new Error('PINTEREST_SANDBOX_ACCESS_TOKEN is not set');
    return token;
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token stored');

  const credentials = Buffer.from(
    `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`,
  ).toString('base64');

  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization:  `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!res.ok) {
    await res.text(); // consume body — do NOT log (may contain token data)
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.access_token) throw new Error('No access_token in refresh response');
  return data.access_token;
}

// ── Boards ────────────────────────────────────────────────────────────────────

/**
 * Resolve a board name to its board ID, creating the board if it doesn't exist.
 * In sandbox mode the board list is independent of production — if the named
 * board isn't found it is created automatically so publishing can proceed.
 * In production mode the board must already exist (original behaviour).
 */
async function getBoardId(accessToken, boardName) {
  const res = await fetch(`${baseUrl()}/boards?page_size=100`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    await res.text();
    throw new Error(`Board list failed: ${res.status}`);
  }

  const data = await res.json();
  const boards = data.items || [];
  const match = boards.find(
    b => b.name.toLowerCase() === boardName.toLowerCase(),
  );
  if (match) return match.id;

  // Production: board must exist — preserve original behaviour
  if (!isSandbox()) throw new Error(`Board not found: "${boardName}"`);

  // Sandbox: create the board so publishing can proceed without manual setup
  const createRes = await fetch(`${baseUrl()}/boards`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: boardName, privacy: 'PUBLIC' }),
  });

  if (!createRes.ok) {
    await createRes.text();
    throw new Error(`Sandbox board creation failed: ${createRes.status}`);
  }

  const created = await createRes.json();
  return created.id;
}

// ── Pins ──────────────────────────────────────────────────────────────────────

/**
 * Publish a single Pin to Pinterest.
 *
 * @param {object} opts
 * @param {string} opts.title           - Pin title (≤100 chars)
 * @param {string} opts.description     - Pin description (≤500 chars)
 * @param {string} opts.imageUrl        - Absolute URL to the image (must be publicly reachable)
 * @param {string} opts.destinationUrl  - Link the Pin points to
 * @param {string} opts.boardName       - Board name (must already exist in connected account)
 * @returns {Promise<string>}           - The created Pin's ID
 */
async function createPin({ title, description, imageUrl, destinationUrl, boardName }) {
  const accessToken = await refreshAccessToken();
  const boardId     = await getBoardId(accessToken, boardName);

  const body = {
    title,
    description,
    link:      destinationUrl,
    board_id:  boardId,
    media_source: {
      source_type: 'image_url',
      url:         imageUrl,
    },
  };

  const res = await fetch(`${baseUrl()}/pins`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Pin creation failed (${res.status}): ${errText}`);
  }

  const pin = await res.json();
  return pin.id;
}

module.exports = { refreshAccessToken, getBoardId, createPin };
