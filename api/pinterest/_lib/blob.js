'use strict';

const { put, get, head, del } = require('@vercel/blob');

const TOKEN_KEY = 'pinterest/refresh-token';
const META_KEY  = 'pinterest/meta.json';

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

/** Read a ReadableStream to a UTF-8 string. */
async function streamToText(stream) {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString('utf8');
}

/**
 * Store the Pinterest refresh token and metadata in private Vercel Blob.
 * Blobs are stored with access:'private' — never publicly reachable.
 * The token value is NEVER logged or returned to callers.
 */
async function storeTokens({ refreshToken, scope }) {
  await put(TOKEN_KEY, refreshToken, {
    access:           'private',
    allowOverwrite:   true,
    addRandomSuffix:  false,
    token:            blobToken(),
    contentType:      'text/plain',
  });

  await put(META_KEY, JSON.stringify({
    scope:       scope || '',
    connectedAt: new Date().toISOString(),
  }), {
    access:          'private',
    allowOverwrite:  true,
    addRandomSuffix: false,
    token:           blobToken(),
    contentType:     'application/json',
  });
}

/**
 * Retrieve the stored refresh token string, or null if not found.
 * Server-side only — never returned to any client.
 */
async function getRefreshToken() {
  try {
    const result = await get(TOKEN_KEY, { access: 'private', token: blobToken() });
    if (!result.stream) return null;
    return streamToText(result.stream);
  } catch {
    return null;
  }
}

/**
 * Retrieve connection metadata (connectedAt, scope).
 * Does NOT include the refresh token.
 */
async function getMeta() {
  try {
    const result = await get(META_KEY, { access: 'private', token: blobToken() });
    if (!result.stream) return null;
    const text = await streamToText(result.stream);
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Return true if a refresh token is currently stored.
 */
async function isConnected() {
  try {
    await head(TOKEN_KEY, { access: 'private', token: blobToken() });
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete all stored Pinterest blobs (disconnect).
 */
async function disconnect() {
  const toDelete = [];
  try {
    const t = await head(TOKEN_KEY, { access: 'private', token: blobToken() });
    if (t?.url) toDelete.push(t.url);
  } catch { /* not found */ }

  try {
    const m = await head(META_KEY, { access: 'private', token: blobToken() });
    if (m?.url) toDelete.push(m.url);
  } catch { /* not found */ }

  if (toDelete.length) await del(toDelete, { token: blobToken() });
}

// ── Drafts & History ─────────────────────────────────────────────────────────

const DRAFTS_KEY  = 'pinterest/drafts.json';
const HISTORY_KEY = 'pinterest/history.json';

/**
 * Return the current drafts array, or [] if none stored yet.
 */
async function getDrafts() {
  try {
    const result = await get(DRAFTS_KEY, { access: 'private', token: blobToken() });
    if (!result.stream) return [];
    const text = await streamToText(result.stream);
    return JSON.parse(text);
  } catch {
    return [];
  }
}

/**
 * Overwrite the drafts array in Blob.
 */
async function saveDrafts(drafts) {
  await put(DRAFTS_KEY, JSON.stringify(drafts), {
    access:          'private',
    allowOverwrite:  true,
    addRandomSuffix: false,
    token:           blobToken(),
    contentType:     'application/json',
  });
}

/**
 * Return the history array (append-only published log), or [] if empty.
 */
async function getHistory() {
  try {
    const result = await get(HISTORY_KEY, { access: 'private', token: blobToken() });
    if (!result.stream) return [];
    const text = await streamToText(result.stream);
    return JSON.parse(text);
  } catch {
    return [];
  }
}

/**
 * Append one entry to the permanent history log.
 */
async function appendHistory(entry) {
  const history = await getHistory();
  history.push(entry);
  await put(HISTORY_KEY, JSON.stringify(history), {
    access:          'private',
    allowOverwrite:  true,
    addRandomSuffix: false,
    token:           blobToken(),
    contentType:     'application/json',
  });
}

module.exports = {
  storeTokens, getRefreshToken, getMeta, isConnected, disconnect,
  getDrafts, saveDrafts, getHistory, appendHistory,
};
