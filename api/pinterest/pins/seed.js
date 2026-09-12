'use strict';

const { isAdminAuth }         = require('../_lib/auth');
const { getDrafts, saveDrafts } = require('../_lib/blob');
const { validateDestinationUrl } = require('../_lib/validate');

/**
 * Initial content library.
 * Images must live in /assets/pinterest/ — never reference arbitrary project folders.
 * destinationUrl must point to a real pinkwebstudio.com page.
 */
const INITIAL_DRAFTS = [
  {
    id:             'pin_001',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/celeste-medspa-website-design.png',
    title:          'A Medical Spa Website That Feels Like the Treatment',
    description:    'Calm, trusted, quietly elegant. We built Céleste\'s online presence to carry the same energy as walking through the door — no noise, no clutter, just reassurance. Full website design for a luxury medical aesthetics brand.',
    destinationUrl: 'https://pinkwebstudio.com/celeste/',
    board:          'Web Design Inspiration',
  },
  {
    id:             'pin_002',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/june-house-interior-design-website.png',
    title:          'Interior Design Website for June House',
    description:    'Timeless, collected, quietly considered. June House needed a site that felt like their work — curated, unhurried, editorial. Built by Pink Web Studio.',
    destinationUrl: 'https://pinkwebstudio.com/june-house/',
    board:          'Web Design Inspiration',
  },
  {
    id:             'pin_003',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/west-and-stone-home-goods-website.png',
    title:          'Private & Architectural: West & Stone Web Design',
    description:    'A home goods brand that leads with atmosphere. No popups, no announcements — just the objects and the story behind them. Web design by Pink Web Studio.',
    destinationUrl: 'https://pinkwebstudio.com/west-and-stone/',
    board:          'Luxury Brand Design',
  },
  {
    id:             'pin_004',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/le-loup-members-club-website.png',
    title:          'Le Loup: Website Design for a Private Members Club',
    description:    'Mystery, atmosphere, quiet exclusivity. Designing for a private members club means knowing what to leave out. This is the site we built for Le Loup.',
    destinationUrl: 'https://pinkwebstudio.com/le-loup/',
    board:          'Luxury Brand Design',
  },
  {
    id:             'pin_005',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/forma-interior-design-software.png',
    title:          'Interior Design Operations Software — Built from Scratch',
    description:    'Forma is a full-stack SaaS product for interior designers. We designed and built the entire product — from dashboard to client-facing portal.',
    destinationUrl: 'https://pinkwebstudio.com/forma/',
    board:          'Web Design Inspiration',
  },
  {
    id:             'pin_006',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/celeste-medspa-mobile-design.png',
    title:          'What Luxury Looks Like on Mobile',
    description:    'Céleste Med Spa — designed for the scroll. Every detail optimized for mobile. No compromise on atmosphere. Pink Web Studio.',
    destinationUrl: 'https://pinkwebstudio.com/celeste/',
    board:          'Luxury Brand Design',
  },
  {
    id:             'pin_007',
    status:         'draft',
    imageUrl:       'https://pinkwebstudio.com/assets/pinterest/verde-skincare-editorial-website.png',
    title:          'A Skincare Brand Website Built Around One Formula',
    description:    'Slow, considered, campaign-led from the first scroll. Verde is an editorial commerce concept — designed to feel like a magazine, not a store.',
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
