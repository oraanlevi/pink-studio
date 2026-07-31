# Pink OS

Version 1.0

This document is the source of truth for Pink Web Studio.

Every design decision, feature, component,
animation, page, and workflow must align with this document.

If existing code conflicts with Pink OS,
identify the conflict before implementing changes.

If multiple solutions exist,
choose the one that best supports
clarity, simplicity, and the customer journey.# Pink OS
### Business Architecture

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

This table is the master logic for Pink OS — it drives decisions across the website, sales process, and operations, not just page content.

| Stage | Customer is Thinking | Pink Responds With |
|---|---|---|
| **Discover** | "Who are they?" | Home, Journal, SEO |
| **Consider** | "Can they help me?" | Services, Work, "So What?" |
| **Decide** | "Are they worth it?" | Investment, FAQ, Process |
| **Buy** | "Let's do this." | Discovery Call, Proposal, Square |
| **Experience** | "Was this easy?" | Client Portal, Updates |
| **Grow** | "What's next?" | Website Care, Templates, Future Work |

Every page and touchpoint in Sections III and IV should be traceable to a row in this table. If a page doesn't clearly serve one lifecycle stage, that's a signal to cut it or fold it into another.

### The Five Journeys

**Journey 1 — Build a new website** *(Discover → Consider → Decide → Buy → Experience → Grow)*
`Home (select "Build a New Website") → Signature Website → Investment → Discovery Call → Proposal → Square Deposit → Design → Development → Launch → Website Care`

**Journey 2 — Improve an existing website** *(Consider → Decide → Buy)*
`Home (select "Improve My Website") → Website Audit → Audit delivered → Recommendations → branch to Website Refresh, Signature Website, or Website Care`

**Journey 3 — Need support** *(Decide → Buy → Grow)*
`Home (select "Website Support") → Website Care → plan comparison → Choose Plan → Onboarding`

**Journey 4 — Shop templates** *(Discover → Buy → Experience)*
`Home (select "Shop Templates") → Store → choose industry → bundled kit → Purchase → Download → optional Website Care upsell`

**Journey 5 — Not sure where to start** *(Discover → Consider)*
`Home (no path selected) → Journal or About for context → Contact ("Tell us where you're at") → routed manually into Journey 1, 2, or 3`

### The Answers-Then-Asks Pattern

Every page answers its core question, then immediately poses the next one:

- Services answers *"How can we help?"* → asks *"Which solution fits you?"*
- Store answers *"What can I buy today?"* → asks *"Which industry is yours?"*
- Work answers *"Can I trust you?"* → asks *"Ready to build yours?"*
- Journal answers *"What do we know?"* → asks *"Want us to apply this to your business?"*

---

# III. Website Architecture

### Full Sitemap

```
Home  (/)
│   └── Dynamic "Choose Your Path" selector (in-page, not a separate URL)
│
├── Services  (/services)                     ← includes Process content
│   ├── Signature Website  (/services/signature)
│   ├── Landing Page  (/services/landing)
│   ├── Website Audit  (/services/audit)
│   ├── Website Refresh  (/services/refresh)
│   └── Website Care  (/services/care)
│
├── Investment  (/investment)                  ← pricing, timelines, payment, FAQ, comparison
│
├── Store  (/store)
│   ├── Shop by Industry  (/store/[industry])
│   │   ├── Interior Designers
│   │   ├── Med Spas
│   │   ├── Real Estate
│   │   ├── Architecture
│   │   ├── Hospitality
│   │   └── Founders
│   └── Individual product pages  (/store/[industry]/[product])
│       (each bundles: Website Template, Proposal, Brand Kit, Instagram Pack)
│
├── Work  (/work)
│   └── Individual case studies  (/work/[project-name])
│
├── Journal  (/journal)
│   └── Individual posts  (/journal/[post-name])
│
├── About  (/about)
│
└── Contact  (/contact)
```

**Nav:** Home · Services · Store · Work · Journal · About · Contact
**Investment** is linked prominently from Home, Services, and every product page, but stays out of primary nav — it's a decision-support page, not a browsing destination.

### Naming Convention (revised)

No trademark-style product names. Brand carries the prestige; the offering names stay plain and functional:

- Website Audit
- Website Refresh
- Signature Website
- Landing Page
- Website Care

Each product page/card carries a small line underneath the name:
**"A Pink Web Studio Service"**

This replaces the earlier ™-naming approach — it reads as more timeless and fits the quiet-luxury positioning better than treating each offering as its own branded product line.

### The Homepage — Dynamic, Not a Quiz Page

1. **Hero** — Brand Promise: *"Websites designed with intention. Built for growth."*
2. **Choose Your Path** (in-page, interactive, no page reload):
   - Build a New Website
   - Improve My Website
   - Shop Templates
   - Website Support
3. **On selection, the page morphs below the fold** — copy, featured service, testimonial, and CTA update in place. No new URL, no page load; state change only.
4. **"So What?"** — signature differentiator section (below). Stays constant regardless of path selected.
5. Work preview, matched to selected path where possible
6. Journal preview
7. Closing CTA → path-relevant service or Investment page

**Build note:** requires the homepage to hold real state (selected path → conditional rendering), not just anchor links. Content team writes four short variants (hero sub-headline, featured service card, testimonial) per path; everything else stays fixed.

### The "So What?" Section (Homepage Signature Block)

Pink's differentiator — sacred, constant across all paths.

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

Format as a scroll-triggered reveal or stepped animation — the one place on the site allowed to feel slightly more theatrical than the rest of the "quiet showroom" tone, because it's proof, not pitch.

### Service Pages — Fixed Structure

Every service page (Website Audit, Website Refresh, Signature Website, Landing Page, Website Care) follows the same seven-part order. Consistency is what builds trust here — don't let individual pages drift.

1. Problem
2. Solution
3. **Investment** (starting price, stated plainly up front)
4. Timeline
5. Deliverables
6. FAQ
7. Book Now

**Starting prices** (shown on card + page):

| Service | Starting price |
|---|---|
| Website Audit | $199 |
| Website Refresh | $2,000 |
| Signature Website | $4,000 |
| Landing Page | *(not yet set)* |
| Website Care | $250/mo |

### Investment Page

A trust and filtering page, not a marketing page — for anyone weighing a $4,000+ decision who needs more room than a product page section gives them.

- Why websites cost what they do
- What's included at each price point
- Timelines by service
- Payment schedule (deposit → milestones, via Square)
- FAQ (cost/value objections)
- Comparison table across Signature / Refresh / Audit / Care

Framed as "Investment," never "Pricing" — luxury is confident, not mysterious.

### Store — By Industry

**Industries (initial set):** Interior Designers · Med Spas · Real Estate · Architecture · Hospitality · Founders

Each industry page bundles: Website Template, Proposal Template, Brand Kit, Instagram Pack — not four flat categories.

**Build implication:** needs real bundling logic per industry. If full bundles aren't ready for launch, ship with whichever industries have complete kits rather than launching partial kits inside a finished industry.

### Work, Journal, About, Contact

- **Work** — case studies matched to industries/services where possible, echoing Store and homepage path logic.
- **Journal** — closes each post with *"Want us to apply this to your business?"* → CTA into Services or Contact. Carries the "not sure where to start" audience organically.
- **About** — founder/team story tied to Core Belief and Brand Promise.
- **Contact** — short, low-friction form; explicitly welcomes undecided visitors ("Not sure which service fits? Tell us where you're at.") since there's no dedicated qualifier page.

---

# IV. Operations

The systems behind the site — where the "Buy" and "Experience" stages of the Customer Lifecycle actually get executed.

### Buy Stage
- **Discovery Call** — booked from any service page or Investment page
- **Proposal** — delivered after the call, tied to the specific service and price discussed
- **Square Deposit** — payment collected to formally begin the engagement

### Experience Stage
- **Onboarding** — what happens immediately after deposit (needs definition: welcome sequence, information gathering, kickoff call?)
- **Client Portal** — where clients track progress, see updates, and communicate during Strategy → Design → Development → Launch
- **Updates** — the cadence and format of progress communication during build (weekly check-in? async portal notes?)

### Grow Stage
- **Website Care** — ongoing monthly plan post-launch
- **Templates** — cross-sell into Store for clients who want to move faster elsewhere (e.g., a second brand, side project)
- **Future Work** — re-engagement path for refreshes, expansions, or new products down the line

*This section is currently the least defined part of Pink OS and is the natural next place to build out — specifically the Client Portal (what it is, what clients see, whether it's a real product or a shared folder/dashboard) and the Onboarding sequence.*

---

## Open Questions

- Landing Page pricing isn't set yet — needed before that service can show a starting price.
- Are all six industry kits (template + proposal + brand kit + Instagram pack) ready at launch, or does Store launch with a partial set?
- Should the homepage path selection persist (via URL param or session) as the visitor moves to Services/Store, so those pages can echo the chosen path? Recommended for continuity, adds build complexity.
- What is the Client Portal, concretely — a built product, a white-labeled tool, or a shared folder/dashboard? This determines a meaningful chunk of the Experience stage.
- What does Onboarding actually consist of, step by step, between deposit and Strategy?
