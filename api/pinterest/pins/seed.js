'use strict';

const { isAdminAuth }            = require('../_lib/auth');
const { getDrafts, saveDrafts }  = require('../_lib/blob');
const { validateDestinationUrl } = require('../_lib/validate');
// Copy rules are stored in _lib/copy-rules.js and must be followed for all future batches.

/**
 * Initial content library.
 * Images must live in /assets/pinterest/ — never reference arbitrary project folders.
 * destinationUrl must point to a real pinkwebstudio.com page.
 * Copy must follow the rules in _lib/copy-rules.js.
 */
const INITIAL_DRAFTS = [
  {
    id:             'pin_001',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/celeste-medspa-website-design.png',
    title:          'Celeste Med Spa Website',
    description:    'Calm, trusted, quietly elegant. Built for a luxury medical aesthetics brand in LA.',
    destinationUrl: 'https://pinkwebstudio.com/celeste/',
    board:          'Web Design Inspiration',
  },
  {
    id:             'pin_002',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/june-house-interior-design-website.png',
    title:          'June House Website Design',
    description:    'Timeless, collected, unhurried. A site built to feel exactly like the studio behind it.',
    destinationUrl: 'https://pinkwebstudio.com/june-house/',
    board:          'Web Design Inspiration',
  },
  {
    id:             'pin_003',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/west-and-stone-home-goods-website.png',
    title:          'West and Stone Website Design',
    description:    'A home goods brand built around atmosphere. Just the objects and the story.',
    destinationUrl: 'https://pinkwebstudio.com/west-and-stone/',
    board:          'Luxury Brand Design',
  },
  {
    id:             'pin_004',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/le-loup-members-club-website.png',
    title:          'Le Loup Website Design',
    description:    'Quiet exclusivity for a private members club. Knowing what to leave out is the whole design.',
    destinationUrl: 'https://pinkwebstudio.com/le-loup/',
    board:          'Luxury Brand Design',
  },
  {
    id:             'pin_005',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/forma-interior-design-software.png',
    title:          'Forma, Interior Design Software',
    description:    'A full product for interior designers. Designed, built, and shipped by Pink Web Studio.',
    destinationUrl: 'https://pinkwebstudio.com/forma/',
    board:          'Web Design Inspiration',
  },
  {
    id:             'pin_006',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/celeste-medspa-mobile-design.png',
    title:          'Celeste on Mobile',
    description:    'Designed for the scroll. No compromise on atmosphere.',
    destinationUrl: 'https://pinkwebstudio.com/celeste/',
    board:          'Luxury Brand Design',
  },
  {
    id:             'pin_007',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/verde-skincare-editorial-website.png',
    title:          'Verde, a Skincare Concept',
    description:    'An editorial commerce site that feels more like a magazine than a store.',
    destinationUrl: 'https://pinkwebstudio.com/verde/',
    board:          'Web Design Inspiration',
  },
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'method_not_allowed' }));
  }

  if (!isAdminAuth(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  // Validate all destination URLs before writing anything
  for (const draft of INITIAL_DRAFTS) {
    const check = validateDestinationUrl(draft.destinationUrl);
    if (!check.valid) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        error:   'invalid_draft_data',
        id:      draft.id,
        reason:  check.reason,
      }));
    }
  }

  // Only seed if no drafts exist yet — never overwrite existing data
  const existing = await getDrafts();
  if (existing.length > 0) {
    res.writeHead(409, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'already_seeded', count: existing.length }));
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
  res.end(JSON.stringify({ seeded: drafts.length }));
};
