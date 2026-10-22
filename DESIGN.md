# Portfolio redesign — direction & structure

Working document. Not committed yet. Decisions locked here before any code is written.

---

## 1. Diagnosis: why the last two attempts failed

The previous versions were not badly executed. They were the same *genre* re-skinned.
The current site is assembled almost entirely from the standard developer-portfolio kit:

- `[ 00 ] [ 01 ] [ 02 ]` numbered section markers
- lowercase section labels, letter-spaced tracking on every small label
- monospace typeface used for body text, not just data
- near-black background with a single bright accent
- scramble-text hero, "keep scrolling" prompt, ASCII mascot
- fade-up-on-scroll applied to every section
- `developer ✦ open source ✦ cultured`

Each of those is a default rather than a decision, and they appear in thousands of
other portfolios regardless of subject. Moving pixels inside this template will keep
producing the same reaction. The fix is to leave the genre.

## 2. The content gap

`src/data/site.ts` is significantly behind the resume. The missing material is the
strongest material.

Wrong on the site:

| Field | Site says | Resume says |
|---|---|---|
| Retsguide role | Software Engineer Intern (Full Stack) | Software Engineer Intern (**Founding Engineer**) |
| Retsguide location | — | Copenhagen, Denmark |
| Headline metric | 2s → 150ms SSR data path | **124s → 6s** triage latency under Azure OpenAI outage |
| OpenSphere location | — | San Francisco, CA |
| Education | 3rd year | 2023–2028, CGPA 7.52/10 |

Absent from the site entirely:

- **Temporal legal knowledge graph** (Retsguide): Danish rental law parsed from
  legislation XML into 958 provisions and 1,292 cross-references; 8 amending acts
  decoded into 41 typed edits, so every citation resolves to the text in force on the
  case date. Code, not the model, decides what counts as law.
- **Retrieval pipeline**: hybrid BM25 + dense, reranked by Qwen3-Reranker-4B, selected
  by benchmarking 3 embedders and 3 rerankers against a 150-question gold set.
  MRR 0.54 → 0.84, recall@10 0.79 → 0.92. LoRA fine-tune of Qwen3-Embedding-4B on
  3,630 generated queries with mined hard negatives: standalone MRR 0.76 → 0.83.
  LLM query rewrite for low-confidence searches: recall@10 0.92 → 0.94.
- **Document pipeline**: Azure Document Intelligence OCR over tax and insurance PDFs,
  LLM classification and income extraction, tax-authority formula applied in code.
- **AI review agent**: replaced paid PR review tooling across 4 repos, triggered by a
  `/review` comment, routed OpenRouter → Groq → Azure OpenAI as last resort.
- **Building Energy Load Forecasting**: hybrid CNN-Transformer, 2–48h ahead. Multi-scale
  convolutional front end, FFT branch for daily/weekly cycle, cross-attention fusion.
  Controlled ablation on CU-BEMS (11,486 hourly readings): beat a standalone
  Transformer on 15 of 18 lookback/horizon settings, MAE −10.4% average (−12.2% at
  10h+ horizons), test R² 0.88–0.97.
- **Achievements**: Amazon ML Challenge 2026 — top 50 of 32,000+ teams. HackByte
  national finalist.
- **Astra detail**: OSV.dev vulnerability matching, patches auto-open as PRs, runs on
  500+ file repositories.
- **KDE framing**: five MRs merged across three projects, now shipping to millions of
  Plasma users.

## 3. The spine

> **Systems that have to be right.**

The thread through all of it: work where correctness is externally verifiable, and
he verified it.

- KDE — reviewed by maintainers who owe him nothing, merged, shipping to millions
- Retsguide — a legal citation must resolve to the provision in force on the case date
- The circuit breaker — the system holds when the model provider does not
- The ablation — same data, same loss, same training budget, 18 settings

This is the identity a recruiter should leave with. Not "developer ✦ open source ✦
cultured," which describes several million people.

## 4. Structure

Evidence before projects. Third-party proof outranks self-directed work.
Strongest first, not chronological.

```
0  IDENTITY          Status readout: who, where, current state.
                     Credibility in the first three seconds.

1  NOW               Retsguide, founding engineer, Copenhagen.
                     The legal knowledge graph is the best story on the site.
                     Numbers carry it: 958 provisions, 41 typed edits,
                     MRR 0.54→0.84, 124s→6s.

2  UPSTREAM          KDE. Five merged MRs, each linked, each with what it did
                     and why it mattered. Featured in This Week in Plasma.
                     Externally verifiable — this is the rarest asset here.

3  SELECTED WORK     Tiered, not eight equal cards.
                     · Research   Energy forecasting (the ablation)
                     · Tools      Astra
                     · Products   Ephemeris, CodeRivals
                     · Index      the remaining five, compact

4  BEFORE THIS       OpenSphere, San Francisco. Short. Two facts.

5  SIGNALS           Amazon ML top 50/32,000. HackByte finalist. Education.
                     Photography as one line linking to /photography.

6  CONTACT           cal.com as the real CTA. Email, resume, GitHub, LinkedIn.
```

Two deliberate calls:

- **No numbered section markers.** These sections are not a sequence. Numbering them
  is decoration wearing the costume of information.
- **"Now" separated from "Before this."** A uniform reverse-chronological list flattens
  the current role into the same weight as a 2025 internship. It is not the same weight.

## 5. Direction: native desktop / systems software

Not terminal cosplay. The reference is *real application design* — the visual language
of professional desktop software and technical documentation. Precision, state,
information density, honest chrome.

### Palette

Light-primary. Deliberate and contrarian: nearly every developer portfolio is dark, the
current site is dark, and real application chrome and technical documentation are
predominantly light. This is the most visible break from the failed genre.

| Token | Hex | Role |
|---|---|---|
| `surface` | `#F2F3F5` | desktop backdrop, cool light grey |
| `panel` | `#FFFFFF` | raised panel and window surfaces |
| `ink` | `#16181D` | primary text, cool near-black |
| `ink-dim` | `#5A6069` | secondary text, metadata |
| `rule` | `#D8DBE0` | hairlines and panel borders |
| `accent` | `#2D5BD1` | interactive affordances |
| `merged` | `#4A7C59` | semantic only — merged MR status |

`accent` is a real UI blue, chosen because desktop software signals interactivity in
blue and the subject is desktop software. It also deliberately avoids the three accents
that mark generated design right now: terracotta, acid green, vermilion.

`merged` appears only on merged-MR status. In real version-control interfaces merged
has a color; here it carries meaning rather than decorating.

### Type

One family, two widths. Coherent, and the width contrast does real work.

- **Display** — IBM Plex Sans Condensed, heavy weights, tight tracking.
  Condensed grotesques read as instrumentation and equipment labeling, which is the
  subject matter. Not Inter.
- **Body** — IBM Plex Sans, regular. Line length under 80 characters.
- **Data** — IBM Plex Mono, restricted to actual data: hashes, latency figures, MR
  numbers, versions, metrics. Never body text.

Tabular numerals everywhere numbers align. There are a lot of numbers on this site and
they are the point.

### Layout

Left-aligned, flush left, ragged right. The current hero is centered; centered hero text
is the generic default. Numeric columns right-align on the decimal with tabular figures.

The structural device is the **panel with a status header** — used to carry information,
not as decoration. A panel header states the state of what is inside it:

```
┌─ upstream ─────────────────── 5 merged · 3 repositories ─┐
│                                                           │
│  plasma-workspace   !6280   SHA-256 content-hash caching  │
│                             for the Wallpaper Gallery     │
│                             · merged                      │
│                                                           │
│  plasma-workspace   !6208   KConfig wallpaper directory   │
│                             persistence across sessions   │
│                             · merged                      │
│                                                           │
│  marknote           !172    todo checkbox inheritance fix │
│                             · merged                      │
└───────────────────────────────────────────────────────────┘
```

No fake traffic lights, no simulated title bars. That is kitsch. The panel is a real
container with a real edge and a header that reports real state.

Border radii stay at 2–3px. Elevation differences are small and carry hierarchy rather
than being applied uniformly to every card.

### Hero

The most characteristic thing in this subject's world is a system reporting its state
truthfully. So the hero is a status readout, not a name with a scramble effect.

```
Sangam Pratap Singh
Founding engineer at Retsguide — Copenhagen
Third year, B.Tech IT + MBA — IIITM Gwalior

upstream        5 MRs merged across KDE Plasma, Marknote, Drawy
in production   Danish rental-law deposit-dispute reports
recent          Amazon ML Challenge 2026 — top 50 of 32,000+
```

Left-aligned. Tabular. No scramble, no "keep scrolling," no ASCII mascot.
A recruiter has the full picture before scrolling once.

### Motion

One orchestrated moment, then stillness.

On load, the status readout fills row by row the way a system reports readiness —
roughly 600ms total, once, never repeated on scroll. Everything else is static unless
the user acts on it: hovers, expands a project, opens a panel. Motion that answers an
action is welcome because it shows what changed.

Scattered fade-up-on-scroll across every section is the current site's behavior and is
one of the clearest generated-design tells. It goes.

`prefers-reduced-motion` disables the load sequence entirely.

### Quality floor

Responsive to mobile. Visible keyboard focus rings. WCAG AA contrast throughout — worth
holding honestly, given there is a merged KDE accessibility MR on this very site.
Existing SSR prerender and JSON-LD pipeline preserved.

## 6. Open questions

1. **Which lane?** The two resume variants are differently slanted — one general
   software engineering, one ML/AI. The site can pick a lane or unify. This changes
   hero ordering and what leads section 1.
2. **Light palette** — confirm the swing away from dark.
3. **Screenshots.** This direction is strongest with real software imagery. KDE
   Wallpaper Gallery and Astra are public. Is any Retsguide UI shareable, or is it
   under NDA?
4. **Title.** The resume says "Software Engineer Intern (Founding Engineer)." How
   should the site phrase it?

---

## 7. Personalized pitch routes

`/for/<company>/<person>` — a variant of the same site addressed to one reader.
`/for/<company>` when no individual is named.

### What changes per visitor

Not a different site. The same design system, re-pointed:

| Element | Behaviour |
|---|---|
| Address line | One line above the identity block: written to that reader |
| Claim | Re-angled to what that company actually builds |
| Section 1 | Leads with the work closest to their domain |
| Work ordering | Re-ranked; irrelevant projects drop to the index |
| CTA | Specific to them rather than a generic "get in touch" |

Everything factual stays identical. The personalization changes emphasis and order,
never claims. Nothing on a pitch page may assert something not true on the main site.

### Architecture consequence — decide this before building

This only works cheaply if the redesign is **data-driven from the first commit**.
Every section component takes its content and ordering from a config object rather
than hardcoding it. The main site becomes the default config; a pitch page is another
config. Retrofitting this later means rewriting every component, which is roughly how
the last two attempts accumulated cost.

```
src/data/site.ts        facts — single source of truth, unchanged
src/data/pitches.ts     keyed variants
src/pages/Portfolio.tsx one component tree, takes a config
```

```ts
// src/data/pitches.ts
export const PITCHES = {
  'rippling': {
    company: 'Rippling',
    person: { vatsal: 'Vatsal' },
    angle: 'systems',
    lead: 'retsguide-graph',
    order: ['retsguide', 'kde', 'astra', 'devtrackr'],
    note: '…one or two honest sentences…',
  },
} satisfies Record<string, Pitch>;
```

### Hard requirements

1. **Whitelist only.** A slug not in `PITCHES` redirects to `/`. No echoing arbitrary
   URL segments into the page — `/for/Urgent/ClickHere` must not render those words.
   This is both an injection concern and an embarrassment concern.
2. **Prerendered, not runtime.** Known slugs are added to the `PAGES` list in
   `scripts/prerender.mjs` and emitted as static HTML at build time. Fast, and no
   client-side string handling.
3. **Never indexed.** The existing `X-Robots-Tag: noindex, follow` rule already covers
   `/for/*`. Keep `/for/*` out of `sitemap.xml` and add an explicit `robots.txt`
   disallow.
4. **No false claims.** The copy may say why the work is relevant to them. It may not
   invent enthusiasm, a referral, or a conversation that did not happen.
5. **Graceful without JS.** Prerendering gives this for free.

### Open question

Is a reader told the page was made for them, or does it read as if the whole site is
simply well aimed? Being explicit is warmer and more honest, and most people find it
flattering. Staying implicit avoids any feeling of a mail-merge. Recommendation:
explicit, in one plain sentence, no gimmick.
