# Claude Instructions

Before every session:

1. Read PINK_OS.md.

2. Treat it as the project's constitution.

3. Never invent new navigation.

4. Never add pages without justification.

5. Prefer editing existing systems over creating new ones.

6. Build reusable components.

7. Keep UI calm.

8. Always explain architectural changes before implementing them.

9. Build for scalability.

10. Think like a product designer,
not only a developer.

## Preserve Existing Strengths

The purpose of this redesign is to improve clarity,
not remove personality.

Preserve whenever possible:

- Editorial typography
- Quiet luxury spacing
- Cinematic transitions
- Slow, intentional animations
- Horizontal storytelling
- Minimal color palette
- Emotional copywriting

When rebuilding a page,
reuse visual language before inventing new UI.

---

## Technology Stack

Plain HTML/CSS/JS. Apache hosting. No build tools, no frameworks, no package managers.

- **Forms:** Formspree — `https://formspree.io/f/mbdejokw`
- **Calendar:** Calendly — `https://calendly.com/oraanlevi1/30min`
- **Assets:** flat `/assets/` directory at root
- **Do not introduce** npm, 11ty, Astro, webpack, or any build tooling during this migration.

---

## Design System Tokens

All tokens live in `styles.css` as CSS custom properties. Never hardcode these values.

```css
--bg:    #F6F0F1
--ink:   #1a1917
--ink-2: rgba(26,25,23,.5)
--ink-3: rgba(26,25,23,.26)
--rule:  rgba(26,25,23,.1)
--nav-h: 60px  (mobile: 56px)
```

**Forbidden variables (retired design system — never use):**
`var(--cream)`, `var(--dark)`, `var(--bg-dark)`, `var(--gold)`, `var(--border)`, `var(--muted)`, `var(--max)`

---

## Typography

Two fonts only: **Cormorant Garamond** (display) and **Poppins** (UI/body sans).
Never use Playfair Display — that is the retired design system font.

Google Fonts link for every new page `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" />
```

---

## URL Rules

Always use root-relative paths. Never use `.html` extensions or `../` relative paths in `href` or `src`.

```
/work        not  work.html  or  ../work
/about       not  about.html
/contact     not  contact.html
/assets/x    not  assets/x   or  ../assets/x (important when files are in subdirectories)
/styles.css  not  styles.css or  ../styles.css
```

CSS `url()` values in `<style>` blocks and inline `style=""` attributes resolve relative to the **page URL** — use root-relative: `url('/assets/marble.png')`.
CSS `url()` in `styles.css` resolves relative to the stylesheet (root) — those are already correct.

---

## CSS Architecture

1. `styles.css` — shared components only (nav, footer, reveal, mobile nav, scroll bar).
2. Each page has a `<style>` block in `<head>` for page-specific styles.
3. Never add page-specific styles to `styles.css`.

---

## Contacts

| | |
|---|---|
| Studio email | `studio@pinkwebstudio.com` |
| **Never use publicly** | `oraanlevi1@gmail.com` |
| Instagram | `https://instagram.com/oraanlevi` |
| LinkedIn | `https://www.linkedin.com/in/oraan-levi-898a89200/` |
| Threads | `https://www.threads.com/@pinkwebstudio` |

---

## Pink OS Service Names

Use these exact names. No alternatives.

| Use | Never use |
|---|---|
| Website Audit ($199) | Site Audit, Audit Package |
| Website Refresh ($2,000) | Redesign, Update |
| Signature Website ($4,000) | Custom Website, Full Build |
| Landing Page (price TBD) | Single Page, One-Pager |
| Website Care ($250/mo) | Maintenance, Support Plan |

---

## Retired URLs

These are retired and redirect via `.htaccess`. Never link to them in new or updated pages.

```
/enter-the-studio  →  /connect  (Phase 0)
/connect           →  /contact  (Phase 1, after contact.html is built)
```

---

## Standard Page Footer HTML

Use this exact footer block on every page. Keep it identical across all pages.

```html
<footer class="site-footer">
  <div class="footer-brand-wrap">
    <span class="footer-brand">Pink Web Studio</span>
    <span class="footer-brand-sub">Los Angeles &middot; Currently Booking</span>
  </div>
  <div class="footer-social">
    <div class="footer-social-icons">
      <a href="https://instagram.com/oraanlevi" target="_blank" rel="noopener" aria-label="Instagram">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/></svg>
      </a>
      <a href="https://www.linkedin.com/in/oraan-levi-898a89200/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
      </a>
    </div>
    <a href="mailto:studio@pinkwebstudio.com" class="footer-email">studio@pinkwebstudio.com</a>
  </div>
</footer>
```