# Portfolio redesign — direction & structure

Working document. Decisions are settled here before any code is written.

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

`src/data/site.ts` is significantly behind the resume, and the missing material is the
strongest material.

Wrong on the site:

| Field | Site says | Resume says |
|---|---|---|
| Retsguide role | Software Engineer Intern (Full Stack) | **Founding Engineer** |
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

Work where correctness is externally verifiable — and he verified it.

- Retsguide — a legal citation must resolve to the provision in force on the case date
- Retrieval — a 150-question gold set, three embedders and three rerankers benchmarked
- Forecasting — a controlled ablation: same data, same loss, same training budget, 18 settings
- KDE — reviewed by maintainers who owe him nothing, merged, shipping to millions
- The circuit breaker — the system holds when the model provider does not

The ML/AI lead strengthens this rather than competing with it. What separates this ML
work from every other student who built a RAG chatbot is not novelty — it is
**measurement**. That is the lead.

## 4. Decisions locked

| Decision | Choice |
|---|---|
| Direction | Native desktop / systems software, with tactile texture |
| Lane | Unified, **ML/AI first** |
| Audience | Mixed — readable by a recruiter in 30s, depth underneath for engineers |
| Palette | **Light primary, with a dark toggle.** Both hold WCAG AA |
| Retsguide title | **Founding Engineer** |
| Photography | Stays at `/photography` |
| Motion | Substantial — GSAP ScrollTrigger, micro-interactions, Torph text morphing |
| Assets | KDE (public) + own projects + original diagrams. Retsguide UI assumed NDA until confirmed |
| Architecture | Data-driven from commit one, to support `/for/<company>/<person>` |

Note on the title: "Founding Engineer" is supported by the resume, which reads
"Software Engineer Intern (Founding Engineer)". Keep the full phrasing on LinkedIn so a
reference check lines up.

## 5. Structure

Evidence before projects. Strongest first, not chronological.

```
0  IDENTITY                     Status readout. Who, where, current state.
                                Credibility inside three seconds.

1  LAW AS DATA                  Retsguide: the temporal knowledge graph and the
                                retrieval pipeline. The showpiece.
                                958 provisions · 1,292 cross-references ·
                                41 typed edits · MRR 0.54→0.84 · recall@10 0.79→0.92
                                "Code, not the model, decides what counts as law."

2  MODELS, MEASURED             Energy forecasting and the controlled ablation.
                                15 of 18 settings · MAE −10.4% · R² 0.88–0.97
                                Amazon ML Challenge: top 50 of 32,000+.

3  THE ENGINEERING UNDERNEATH   KDE upstream — 5 MRs, 3 projects, millions of users,
                                featured in This Week in Plasma.
                                Production hardening — circuit breaker 124s→6s,
                                document pipeline, AI review agent across 4 repos.
                                Proof this is not a notebook-only engineer.

4  SELECTED WORK                Tiered, not eight equal cards.
                                · Astra, Ephemeris, CodeRivals in depth
                                · the remaining five as a compact index
                                · OpenSphere (SF) folded in as prior work

5  CONTACT                      cal.com as the real CTA. Email, resume, GitHub,
                                LinkedIn. Education, HackByte and the photography
                                link fold in here.
```

Two deliberate calls:

- **No numbered section markers.** These sections are not a sequence. Numbering them
  is decoration wearing the costume of information.
- **Current work separated from prior work.** A uniform reverse-chronological list
  flattens the Retsguide role into the same weight as a 2025 internship. It is not the
  same weight.

## 6. Visual direction

Native desktop and systems software — *real application design*, not terminal cosplay —
rendered with the tactile, slightly surreal register seen on vibrant.design (halftone,
paper grain, pixel and ASCII letterforms used as type specimens, isometric architecture
diagrams).

Three things from that reference are directly load-bearing here:

1. **ASCII and pixel letterforms as fine art, not hacker costume.** This rescues the one
   genuinely characterful element of the current site by changing its job: a type
   specimen rather than a terminal.
2. **Isometric architecture layers.** The way to render the knowledge graph, the
   retrieval pipeline and the CNN-Transformer. Better than screenshots for backend and
   ML work, and it animates well.
3. **Tactile material texture.** Halftone and paper grain are how this gets strange
   without adding decoration — and they argue *for* the light palette, since on light
   they read as print and on dark they read as noise.

### Palette

Light primary. Deliberate and contrarian: nearly every developer portfolio is dark, the
current site is dark, and real application chrome and technical documentation are
predominantly light.

| Token | Light | Role |
|---|---|---|
| `surface` | `#F2F3F5` | desktop backdrop, cool light grey |
| `panel` | `#FFFFFF` | raised panel and window surfaces |
| `ink` | `#16181D` | primary text |
| `ink-dim` | `#5A6069` | secondary text, metadata |
| `rule` | `#D8DBE0` | hairlines and panel borders |
| `accent` | `#2D5BD1` | interactive affordances |
| `merged` | `#4A7C59` | semantic only — merged MR status |

`accent` is a real UI blue, chosen because desktop software signals interactivity in
blue and the subject is desktop software. It also deliberately avoids the three accents
that currently mark generated design: terracotta, acid green, vermilion.

`merged` appears only on merged-MR status. In real version-control interfaces merged
has a colour; here it carries meaning rather than decorating.

Dark theme is a derived second theme, not an afterthought — both must pass AA.

### Type — open

Two candidates, to be decided from the reference items (see §9):

- **A. Technical.** IBM Plex Sans Condensed for display, IBM Plex Sans for body, IBM
  Plex Mono for data. One family, three widths. Condensed grotesques read as
  instrumentation and equipment labelling.
- **B. Contrast.** A high-contrast display face against monospace data, closer to the
  "minimal serif portfolio hero" and "pixel letterform specimen" register on the
  reference site. More artistic, more risk.

Either way: monospace is restricted to actual data — hashes, MR numbers, latency,
metrics. Never body text. Tabular numerals wherever numbers align, because this site is
mostly numbers and the numbers are the point. Body line length under 80 characters.

### Layout

Left-aligned, flush left, ragged right. Centred hero text is the generic default and is
what the current site does. Numeric columns right-align with tabular figures.

The structural device is the **panel with a status header**, carrying information rather
than decorating:

```
┌─ upstream ─────────────────── 5 merged · 3 repositories ─┐
│  plasma-workspace   !6280   SHA-256 content-hash caching  │
│                             for the Wallpaper Gallery     │
│                             · merged                      │
│  plasma-workspace   !6208   KConfig wallpaper directory   │
│                             persistence across sessions   │
│                             · merged                      │
│  marknote           !172    todo checkbox inheritance fix │
│                             · merged                      │
└───────────────────────────────────────────────────────────┘
```

No fake traffic lights or simulated title bars — that is kitsch. A real container with a
real edge and a header reporting real state. Border radii 2–3px. Elevation differences
small and carrying hierarchy, not applied uniformly to every card.

### Hero

The most characteristic thing in this subject's world is a system reporting its state
truthfully. The hero is a status readout, not a name with a scramble effect.

```
Sangam Pratap Singh
Founding engineer at Retsguide — Copenhagen
Third year, B.Tech IT + MBA — IIITM Gwalior

in production   Danish rental law as a queryable temporal graph
retrieval       MRR 0.54 → 0.84 on a 150-question gold set
upstream        5 MRs merged across KDE Plasma, Marknote, Drawy
recent          Amazon ML Challenge 2026 — top 50 of 32,000+
```

Left-aligned, tabular. No scramble, no "keep scrolling," no ASCII mascot. A recruiter has
the full picture before scrolling once.

## 7. Motion

Substantial motion is wanted, so motion is where the boldness is spent — everything
around it stays quiet and disciplined to pay for it.

**The governing rule: every animation shows a real quantity or a real transformation
from the work.** Nothing animates merely because it entered the viewport. This is what
makes the result strange rather than busy, and it is the opposite of the current site's
fade-up-everything behaviour.

| Moment | Treatment |
|---|---|
| Load | Identity readout values resolve in via Torph. Once, ~600ms, never repeated |
| Metrics | Torph morphs values in place as they are scrubbed: `0.54 → 0.84`. The number animating *is* the result |
| **Showpiece** | The knowledge graph assembling under scroll: provisions as nodes, cross-references drawing, then 8 amending acts applying as 41 typed edits along a time axis. One big moment, isometric, scrubbed |
| Retrieval | The same query's results reordering as BM25 → dense → reranked. Shows the reranker doing its job |
| Forecasting | Predicted curve drawing against actual across horizons |
| Micro | MR rows expanding, copy-to-clipboard confirmation, panel hover states, theme toggle |

Banned: fade-up on every section; parallax as decoration; scroll-jacking; progress bars
that track nothing; "keep scrolling."

`prefers-reduced-motion` disables scrubbing and the load sequence, and renders every
final state statically. The showpiece must be legible as a still image.

### Libraries

- **GSAP + ScrollTrigger** — scroll-driven sequences
- **Torph** (`torph@0.1.3`, MIT, zero deps, 11.4 kB gz) — text morphing. Pre-1.0 and a
  solo project, so there is abandonment risk; zero deps and MIT make it vendorable if
  that happens
- **Lenis** — already in the project, pairs with ScrollTrigger
- **Drop `framer-motion`** — carrying two animation libraries is not worth the bundle or
  the inconsistency

## 8. Personalized pitch routes

`/for/<company>/<person>` — a variant of the same site addressed to one reader.
`/for/<company>` when no individual is named.

### What changes per visitor

Not a different site. The same design system, re-pointed:

| Element | Behaviour |
|---|---|
| Address line | One line above the identity block, written to that reader |
| Claim | Re-angled to what that company actually builds |
| Section 1 | Leads with the work closest to their domain |
| Work ordering | Re-ranked; irrelevant projects drop to the index |
| CTA | Specific to them rather than a generic "get in touch" |

Everything factual stays identical. Personalization changes emphasis and order, never
claims.

### Architecture consequence — decide before building

This only stays cheap if the redesign is **data-driven from the first commit**. Every
section component takes content and ordering from a config object rather than hardcoding
it. The main site becomes the default config; a pitch page is another config.
Retrofitting this later means rewriting every component, which is roughly how the last
two attempts accumulated cost.

```
src/data/site.ts        facts — single source of truth
src/data/pitches.ts     keyed variants
src/pages/Portfolio.tsx one component tree, takes a config
```

```ts
export const PITCHES = {
  'rippling': {
    company: 'Rippling',
    person: { vatsal: 'Vatsal' },
    angle: 'ml',
    lead: 'retsguide-graph',
    order: ['retsguide', 'forecasting', 'kde', 'astra'],
    note: '…one or two honest sentences…',
  },
} satisfies Record<string, Pitch>;
```

### Hard requirements

1. **Whitelist only.** A slug not in `PITCHES` redirects to `/`. No echoing arbitrary URL
   segments into the page — `/for/Urgent/ClickHere` must not render those words. This is
   both an injection concern and an embarrassment concern.
2. **Prerendered, not runtime.** Known slugs join the `PAGES` list in
   `scripts/prerender.mjs` and are emitted as static HTML at build time.
3. **Never indexed.** The existing `X-Robots-Tag: noindex, follow` rule already covers
   `/for/*`. Keep it out of `sitemap.xml` and add an explicit `robots.txt` disallow.
4. **No false claims.** The copy may say why the work is relevant to them. It may not
   invent enthusiasm, a referral, or a conversation that did not happen.
5. **Graceful without JS.** Prerendering gives this for free.

Recommendation on tone: tell the reader plainly, in one sentence, that the page was put
together for them. Warmer and more honest than pretending the whole site happens to be
aimed at them.

## 9. Still open

1. **Reference items.** Pick 5–8 specific vibrant.design items that you actually like and
   send the links. This is the highest-value input available — it pins down taste
   concretely instead of by adjective, which is where attempts 1 and 2 went wrong.
2. **Typeface** — candidate A or B in §6, decided from those references.
3. **Retsguide UI** — shareable, or under NDA?
4. **Quality floor**, non-negotiable: responsive to mobile, visible keyboard focus,
   WCAG AA in both themes, `prefers-reduced-motion` honoured, existing SSR prerender and
   JSON-LD pipeline preserved. Worth holding honestly given there is a merged KDE
   accessibility MR on this résumé.
