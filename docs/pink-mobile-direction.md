# Pink Web Studio — mobile direction

A consolidated summary of the new mobile design direction, inspired by buttersoft.studio but built from Pink's own identity, content, and voice. Nothing here has been implemented yet — this is the agreed direction to build from.

## Core principles

1. **One accent color, used sparingly.** Pink (#D4537E-ish) is reserved for primary CTAs, borders on featured cards, and small accents (quote marks, links). It is never a background flood — the base stays neutral (white/off-white), the same disciplined way the reference uses its buttery yellow.
2. **Two typefaces, two jobs.** The existing condensed industrial sans stays for nav, labels, and UI. A serif (`--font-voice`) is introduced for editorial moments only — hero lines, storytelling copy, the odd pull quote. This contrast is what reads as "designed" rather than "documented."
3. **Rounded, not boxed.** Cards move from hard 1px-bordered rectangles to soft 12px-radius cards. Buttons move from plain text links to pill-shaped CTAs.
4. **Air over density.** More vertical space between sections; nothing stacks tight.
5. **Keep what already works.** Several things on the current site are already strong and are preserved as-is: the cursive "Pink" wordmark, the overlapping-screenshot photo stacks, the "see it in motion" video embeds, the ghost oversized footer wordmark, and the pink-accented testimonial quote marks.

## Page-by-page direction

### Homepage
- Sticky-ish header: wordmark + hamburger, no competing CTA in the header itself.
- Hero: serif editorial headline (2–3 lines) + sans subhead + one filled pink pill CTA + one ghost secondary CTA.
- Full-bleed rounded case-study preview beneath the hero, "View live site" as a muted link.
- Marquee strip (Pink's own tagline, repeating, serif italic) as a personality beat before Services.
- Services preview cards, softened per the Services treatment below.
- Numbered process section (kept from the reference's rhythm, filled with Pink's real process).
- Work preview, footer.

### Services page
- Section label + bold headline stay as-is ("What do you need?").
- Each package becomes a rounded card (not a bordered box): headline, one-liner, hairline divider, INVESTMENT/TIMELINE row, and a real pill CTA ("View details") instead of a text link.
- One package (currently proposed: Signature Website) gets a pink border to read as the flagship offer — open to confirming which package that should be.

### Work page ("Selected projects")
- Cards move from hard-edged grey/black blocks to white cards with a pink border and rounded corners — same content and links (Case study →, Visit site ↗), cleaner presentation.

### Case study pages (e.g. Forma)
- Hero, stacked-screenshot treatment, and "See it in motion" video panel are all kept structurally — just corners softened to 10–12px radius, and one card in the stack gets a thin pink border as an accent.
- "Next project" footer nav becomes a full pink-bordered tappable card instead of a plain text link, so it reads clearly as an action.
- Page-level links simplified: just "View live" and "Back to work" — the third "Start a new project" link is removed since that action now lives permanently in the nav.

### Studio / About page
- Cursive "Pink" wordmark, serif storytelling copy, and candid photo stack are all kept as-is.
- Photo stack gets the same rounded-corner + pink-accent-border treatment as the case study screenshots, for consistency.
- The flat black "Founder · Designer · Developer" block is pulled into a soft card with a pink label, so it stops feeling like a disconnected leftover section.

### Start a project page
- Full-bleed textured photo hero stays as-is.
- Testimonials keep their existing pink quote marks and attribution styling — already consistent with the new accent rule.
- FAQ list (currently a plain running block of text) becomes individual soft cards, one per question, so each is scannable on its own.
- Ends on a single clear pink CTA rather than competing links.

### Navigation
Current issues found: the "Studio" nav label is inconsistent ("Studio" vs. "About Studio" depending on page), and "Start a project" appears redundantly as a nav item, a page headline, and an inline link — sometimes all at once.

Fix:
- One consistent label per section, everywhere.
- "Start a project" removed from the plain link list and given its own pink pill button at the bottom of the open menu, visually separated from the "browse" links (Work / Services / Products / Studio) — so it's clearly the one primary action, not a fifth link of equal weight.
- Closed header stays minimal: wordmark + hamburger only.

## Motion & transitions

Modeled on the reference site's pacing — calm and soft, never abrupt:

- **Scroll reveals**: each section (and each card within a section) fades in + slides up slightly (~16–24px) as it enters the viewport. Ease-out, ~400–600ms. Cards in a group (e.g. Services list) stagger by ~80–120ms each rather than all appearing at once.
- **Marquee**: continuous linear scroll, independent of page scroll position — the one element that's always moving.
- **Interactive states**: buttons and links get a gentle hover/tap scale or color shift, not a hard instant swap.
- **Page-to-page navigation**: simple crossfade between pages rather than a hard cut or a slide-in — keeps the same unhurried feel across the whole site, not just within a page.
- This can't be shown in a static mockup — it needs to be built directly, ideally with `IntersectionObserver`-driven fade/slide-in classes and CSS transitions/`framer-motion` if the stack already uses it.

## Full page mockups
Six full top-to-bottom mobile mockups have been built and approved as the visual source of truth: Homepage, Services, Work, Forma case study, Studio/About, Start a Project. All use Pink's real content and copy where it currently exists — **no new copy has been written**; placeholder/summarized text stands in wherever real copy wasn't available from the current site, and should be replaced with the actual final copy before or during implementation.

## Mockup file naming
Some full-page mockups are too tall to capture in a single screenshot, so they're split across multiple numbered files (e.g. `services.png`, `services2.png`, `services3.png`, or `start-a-project.png`, `start-a-project2.png`). **These are not separate versions or alternate designs — they are sequential sections of the same single page, in order, top to bottom.** Treat all numbered files for a given page name as one continuous mockup and reference them together.

## Still open / needs real input
- Real hero copy (placeholder used throughout: "Digital work with a point of view.")
- Actual project screenshots to replace flat color blocks on Work cards
- Confirmation on which Services package (if any) should be visually featured
- How far to push pink elsewhere — current mocks keep it restrained to accents/CTAs only


