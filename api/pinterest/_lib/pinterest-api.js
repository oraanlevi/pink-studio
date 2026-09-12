'use strict';

const { getRefreshToken } = require('./blob');

/**
 * Exchange the stored refresh token for a short-lived access token.
 * Returns the access token string, or throws on failure.
 * The token value is NEVER logged.
 */
async function refreshAccessToken() {
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

/**
 * Resolve a board name to its Pinterest board ID.
 * Returns the board ID string, or throws if not found.
 */
async function getBoardId(accessToken, boardName) {
  const res = await fetch('https://api.pinterest.com/v5/boards?page_size=100', {
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
  if (!match) throw new Error(`Board not found: "${boardName}"`);
  return match.id;
}

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

  const res = await fetch('https://api.pinterest.com/v5/pins', {
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
