# For AI Contributors

Pink OS is the source of truth for Pink Web Studio.

When making decisions:

1. Never contradict Pink OS.

2. If the existing code conflicts with Pink OS,
identify the conflict before implementing changes.

3. Prefer removing complexity over adding features.

4. Every page should satisfy one user question.

5. Every interaction should reduce friction.

6. Preserve the quiet luxury aesthetic in all UI decisions.

7. Build systems, not pages.

## Design Language

Pink should feel calm before it feels impressive.

White space is a feature.

Typography carries hierarchy.

Motion should guide, never distract.

Photography should feel editorial.

Interactions should feel inevitable.

Luxury comes from restraint.

Nothing should feel trendy.

Nothing should feel busy.

Everything should feel intentional.

## Component Philosophy

Every component should have one purpose.

Cards should communicate.

Buttons should invite.

Sections should answer one question.

Animations should reinforce understanding.

Never decorate for decoration's sake.

Components should be reusable across the entire system.

The UI should feel consistent enough that users instinctively know how to interact with new pages.

---

# Pink OS — Business Architecture

This document is no longer just a website plan — it's the operating system Pink Web Studio runs on. The website is one implementation of it. As Pink grows into templates, a client portal, or new products, those become new implementations of the same four sections below, not a reason to rewrite this document.

**I. Foundation** — brand, principles, the Four Actions
**II. Customer Systems** — discovery, qualification, purchase, delivery, retention
**III. Website Architecture** — the site itself
**IV. Operations** — proposals, payment, onboarding, portal, care

---

# I. Foundation

### Core Belief
A website is not the final product. It's the foundation a business grows from. Pink's work doesn't end at launch — it begins there.

### Brand Promise
Websites designed with intention. Built for growth.

### The Pink Way
Listen before designing. Think before building. Choose the right solution, not the most expensive one. Make every interaction calm. Luxury isn't loud — it removes friction. Pink's job is to make every decision easier for the client.

### What Pink Sells
Not websites. Confidence — that the business is represented well, that the site performs, and that it can grow with the business. Every service exists to strengthen that foundation.

### The Four Actions
The strategic frame everything else maps back to. A new page, feature, or product should be justifiable as strengthening one of these — or it doesn't belong yet.

- **Explore** — Home, Work, Journal, About
- **Buy** — Services, Store, Investment
- **Trust** — Work, Investment, "So What?" section, testimonials
- **Grow** — Website Care, Journal, future retainer/product expansion

### The Seven Rules of Pink

1. Every page has one job.
2. Every page ends with one next step.
3. Every service solves one problem.
4. Every interaction reduces friction.
5. Every design decision earns its place.
6. Every visitor should know what to do within 10 seconds.
7. Luxury is clarity, not complexity.

---

# II. Customer Systems

### The Customer Lifecycle

| Stage | Customer is Thinking | Pink Responds With |
|---|---|---|
| **Discover** | "Who are they?" | Home, Journal, SEO |
| **Consider** | "Can they help me?" | Services, Work, "So What?" |
| **Decide** | "Are they worth it?" | Investment, FAQ, Process |
| **Buy** | "Let's do this." | Discovery Call, Proposal, Square |
| **Experience** | "Was this easy?" | Client Portal, Updates |
| **Grow** | "What's next?" | Website Care, Templates, Future Work |

### The Five Journeys

**Journey 1 — Build a new website**
`Home → Signature Website → Investment → Discovery Call → Proposal → Square Deposit → Design → Development → Launch → Website Care`

**Journey 2 — Improve an existing website**
`Home → Website Audit → Audit delivered → Recommendations → branch to Refresh, Signature, or Care`

**Journey 3 — Need support**
`Home → Website Care → plan comparison → Choose Plan → Onboarding`

**Journey 4 — Shop templates**
`Home → Store → choose industry → bundled kit → Purchase → Download → optional Care upsell`

**Journey 5 — Not sure where to start**
`Home → Journal or About → Contact ("Tell us where you're at") → routed manually`

### The Answers-Then-Asks Pattern

Every page answers its core question, then immediately poses the next one:

- Services → *"How can we help?"* → *"Which solution fits you?"*
- Store → *"What can I buy today?"* → *"Which industry is yours?"*
- Work → *"Can I trust you?"* → *"Ready to build yours?"*
- Journal → *"What do we know?"* → *"Want us to apply this to your business?"*

---

# III. Website Architecture

### Full Sitemap

```
Home  (/)
│   └── Dynamic "Choose Your Path" selector (in-page, not a separate URL)
│
├── Services  (/services)
│   ├── Signature Website  (/services/signature)   $4,000
│   ├── Landing Page       (/services/landing)     TBD
│   ├── Website Audit      (/services/audit)       $199
│   ├── Website Refresh    (/services/refresh)     $2,000
│   └── Website Care       (/services/care)        $250/mo
│
├── Investment  (/investment)     ← pricing, timelines, payment, FAQ, comparison
│
├── Store  (/store)
│   └── /store/[industry]  →  Interior Designers, Med Spas, Real Estate,
│                              Architecture, Hospitality, Founders
│       └── /store/[industry]/[product]
│           (bundles: Website Template + Proposal + Brand Kit + Instagram Pack)
│
├── Work  (/work)
│   └── /work/[project-name]
│
├── Journal  (/journal)
│   └── /journal/[post-name]
│
├── About  (/about)
│
└── Contact  (/contact)
```

**Nav:** Home · Services · Store · Work · Journal · About · Contact

Investment is linked from Home, Services, and every service page — not in primary nav.

### Service Page Fixed Structure

Every service page follows this exact seven-part order:

1. Problem
2. Solution
3. Investment (starting price, stated plainly)
4. Timeline
5. Deliverables
6. FAQ
7. Book Now

### The Homepage

1. Hero — Brand Promise: *"Websites designed with intention. Built for growth."*
2. Choose Your Path (in-page, interactive, no page reload)
3. Content morphs per path — copy, featured service, testimonial, CTA
4. "So What?" section (constant across all paths)
5. Work preview (path-matched where possible)
6. Journal preview
7. Closing CTA → path-relevant service or Investment

### The "So What?" Section

Sacred. Constant. The site's signature differentiator block.

```
We build with custom code.
So what? → Your website loads faster.
So what? → Visitors stay longer.
So what? → More inquiries.
So what? → Your business grows.

We don't just design.
So what? → Your brand becomes memorable.
So what? → Clients trust you faster.
So what? → You charge more.
```

---

# IV. Operations

### Buy Stage
- Discovery Call — booked from any service page or Investment page
- Proposal — delivered after the call
- Square Deposit — payment collected to formally begin

### Experience Stage
- Onboarding — *(needs definition: welcome sequence, info gathering, kickoff)*
- Client Portal — *(needs definition: built product vs. shared tool vs. folder)*
- Updates — *(needs definition: weekly check-in? async portal notes?)*

### Grow Stage
- Website Care — ongoing monthly plan post-launch
- Templates — cross-sell into Store
- Future Work — re-engagement for refreshes and expansions

---

## Open Questions

- Landing Page pricing is not set — defer `/services/landing` until price is confirmed.
- Which industry kits are complete and ready for Store launch?
- Should homepage path selection persist via URL param to downstream pages?
- What is the Client Portal concretely — built product, white-labeled tool, or shared folder?
- What does Onboarding consist of step by step between deposit and Strategy?

