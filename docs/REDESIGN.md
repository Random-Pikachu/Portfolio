# Portfolio Redesign — "Last Light"

Branch: `claude/portfolio-redesign-d004h7`
Status: plan, awaiting sign-off before implementation.

---

## 1. The idea

Every developer portfolio is loud. Dark background, neon accent, text that types
itself, a cursor that chases you. They all read as the same template because
they are all trying to grab you.

This one is at rest.

The governing image is a late-October afternoon on campus: the sun has gone
orange rather than sharp, most people have gone home, and there is no hurry
anywhere. The site should feel like sitting down. Warm paper, low contrast,
soft light, a lot of air. Nothing jumps.

The tension that keeps it from being wallpaper: **the atmosphere is soft and the
information is hard.** Big warm empty spaces, then a number like `15 of 18` set
in mono with no decoration around it. Calm frame, sharp content. That contrast
is the whole design.

**Name of the system: Last Light.** Light mode is 4:40pm in late October. Dark
mode is 7:20pm the same day. The site ships with both and the toggle between
them is the centrepiece.

---

## 2. What the site is selling

From the Oct 2026 resumes, one idea runs through every piece of AI work:

> **The model extracts. The code decides.**

- The legal knowledge graph at Retsguide has **no LLM writing to it**, so every
  claim in a report traces back to the provision version it rests on.
- The eligibility pipeline lets OCR read the PDF and an LLM classify and extract
  — then **code** applies the statutory formula.
- The AI review agent falls through an **eight-deep** chain of free providers
  before it will spend a paid token, and never trusts one vendor.
- The CNN-Transformer result is defended by a controlled ablation rather than a
  leaderboard screenshot.

That is a point of view, not a skill list, and it is what separates a founding
engineer from someone who wires up an API. It becomes the headline of the site
and the organising thesis of every case study.

Title on the page: **Founding Engineer · AI Systems.** It is the literal job
title at Retsguide, so it is defensible rather than aspirational.

### 2.1 Retsguide — the confidentiality line

You can describe the work but not the architecture. I have split the material
accordingly. **Nothing in the second list goes near the site until you say so.**

**Cleared — role, capability and philosophy:**

- Software Engineer Intern (Founding Engineer), Retsguide, Copenhagen.
- Designed and shipped three customer-facing flows end to end, from research and
  schema design to production.
- Building the legal knowledge graph behind their legal reports, with no LLM
  writing to it, so every claim traces to the provision version it rests on.
- Built the document pipeline behind eligibility checks: OCR reads uploaded
  PDFs, an LLM classifies and extracts, and code applies the statutory formula.
- Replaced paid PR review tooling with an AI review agent in GitHub Actions
  across four repositories. *(You published this code yourself — it is in this
  repo at `.github/workflows/ai-review.yml`.)*
- Root-caused an SSR bottleneck and cut server response from 2s+ to 150ms.
  *(Already live on the current site, so already public. You said keep it.)*

**Held back — anything describing how the system is built or how well it
performs.** That means the shape of the graph, the retrieval pipeline, the model
choices, the benchmark setup, and every evaluation figure. The specifics are
deliberately not written down in this file, because **this repository is
public** — enumerating them here in order to avoid publishing them would publish
them. They are in your resume, which is where they should stay for now. I keep a
copy in `docs/PRIVATE-NOTES.md`, which is gitignored and never pushed.

Worth saying plainly: that held-back material is your strongest AI-engineering
evidence, and the site is weaker without it. Retrieval metrics can often be
published without naming the corpus or the client, and startups frequently say
yes when asked directly. If you want it on the site, ask Retsguide for clearance
on the evaluation numbers alone. If the answer is no, the site still works — see
§9, where every featured project is one you own outright.

### Proof points to surface large

Chosen so every number is yours, publishable, and verifiable by a visitor.

| Number | What it is |
|---|---|
| `Top 50` | of 32,000+ teams, Amazon ML Challenge 2026 |
| `15 of 18` | settings where the hybrid beat a plain Transformer, controlled ablation |
| `2×` | editor adoption after the WebSocket service shipped |
| `millions` | Plasma users running merged KDE code |

Four different domains: competition, research, product impact, open source.
`−10.4%` MAE and the eight-deep fallback chain live inside their case studies
rather than competing for space here.

## 3. Design system

### 3.1 Colour

Two themes, both built from one formula taken from the mood board: **a blue
field with a single warm point source.** Never more than one accent lit at a
time.

**Last Light (default, light)**

| Token | Hex | On paper |
|---|---|---|
| `--paper` | `#F4EFE6` | — |
| `--paper-raised` | `#FAF6EE` | — |
| `--paper-sunk` | `#EBE4D8` | — |
| `--ink` | `#17150F` | 15.94:1 |
| `--ink-muted` | `#5E564A` | 6.31:1 |
| `--ink-faint` | `#776E60` | 4.38:1 |
| `--ember` (sun / accent) | `#A63D16` | 5.56:1 |
| `--dusk-blue` (cool) | `#35497A` | 7.69:1 |
| `--line` | `#DDD4C4` | 1.28:1 (hairlines only) |

**Dusk (dark)**

| Token | Hex | On night |
|---|---|---|
| `--night` | `#0C1222` | — |
| `--night-raised` | `#131B2F` | — |
| `--night-sunk` | `#080D1A` | — |
| `--cream` | `#EBE4D6` | 14.75:1 |
| `--cream-muted` | `#A2A9BD` | 7.95:1 |
| `--cream-faint` | `#6E7894` | 4.25:1 |
| `--lamp` (accent) | `#F0A258` | 8.90:1 |
| `--sky` (cool) | `#7392CF` | 5.99:1 |
| `--line` | `#1E2840` | 1.27:1 (hairlines only) |

Ratios computed, not guessed. Everything carrying text clears AA; the two
hairline values are for 1px rules only and never sit under type.

Note the dark base is **indigo, not black**. The mood images are blue. A black
background would lose the whole thing.

### 3.2 Type

Three faces, all free on Google Fonts.

- **Display — Instrument Serif.** The hero, section titles, pull quotes. High
  contrast, slightly romantic, nothing like the Inter that every other portfolio
  uses. It ships regular + italic only with no bold, which is a useful
  constraint: at 96px you do not need bold, and the italic is good enough to
  carry a single emphasised word.
- **Prose — Newsreader.** Variable, optical sizing, warm. For the about text and
  case-study bodies. A serif body is the strongest single signal that a human
  laid this out.
- **Interface — JetBrains Mono.** Already loaded. Metadata, nav, labels, tech
  chips, and every number. All figures tabular.

Rule: **numbers are always mono, always tabular, never in the serif.** That is
what makes `15 of 18` land against the soft background.

Scale (fluid, `clamp()`): 96/64/40/28/20/17/15/13.
Prose measure capped at 68 characters. Line height 1.75 for prose, 1.1 for display.

### 3.3 Space, shape, texture

- 8px base scale. Section rhythm is generous — `clamp(96px, 14vh, 180px)`
  vertical. Empty space is the point.
- Radius: 2px on photos, 4px on cards, 999px on chips. Nothing heavily rounded;
  soft colour is doing the softening already.
- No drop shadows in light mode. Depth comes from the paper tones.
  Dark mode gets one long, very soft shadow to suggest lamplight.
- **Grain over everything** at 3.5% in light, 6% in dark. This is the single
  cheapest anti-AI-slop move available: it breaks up flat gradients the way film
  and cel animation do, and the eye reads it as physical.

---

## 4. The sunset toggle (the centrepiece)

Not a flip. A 1.6-second scripted sunset. This is where the craft budget goes
and it is the thing people will toggle five times.

**The control** is not an icon button. It is a thin horizon rule in the nav with
a dot on it. The dot sits high-left in Last Light and low-right in Dusk.

**Light → Dusk, 1600ms**

| Time | What happens |
|---|---|
| 0ms | The dot pulls back 4px before it moves. Anticipation. |
| 0–600ms | Shader `uDusk` animates 0→1. The sky passes cream → peach → rose → violet → indigo. It moves **through colours neither theme contains**, which is why it reads as a sunset instead of a crossfade. |
| 200–900ms | Text colour crossfades, staggered by viewport position — top of screen first, cascading down over 300ms. Light leaving a room. |
| 500ms | Grain steps up 3.5% → 6%. Night is grainier; this is a real animation convention. |
| 700–1400ms | Stars fade in, procedurally scattered, each with its own twinkle phase. Top 40% of the viewport only. |
| 800ms | Accent travels `#A63D16` → `#F0A258`, **overshooting past the target** before settling. |
| 1600ms | Rest. |

**Dusk → Light runs the same sequence reversed in 1100ms.** Dawn is faster than
dusk; matching the durations makes the return feel sluggish.

`prefers-reduced-motion`: instant swap, no shader transition, no stars. Fully
functional, just not cinematic.

---

## 5. The sky (WebGL, no images)

Per your note: no illustration, no photography-as-decoration, no generated
imagery. All atmosphere is procedural. One fragment shader on a fixed
full-viewport canvas behind the content.

What it draws:
1. Vertical gradient field driven by `uDusk` and `uTime`.
2. Domain-warped fbm noise for soft cloud banding. Very slow — a band should
   take ~40s to visibly travel. This is the "dreamy" quality, with no image file.
3. One soft radial warm source at roughly 70% x / 25% y. It descends and dims as
   `uDusk` → 1 and becomes the lamp.
4. Animated grain.
5. Stars (hash-positioned, per-star twinkle) above `uDusk > 0.5`.
6. Light vignette.

**Performance rules, non-negotiable:**

- Render at `min(devicePixelRatio, 1.5)`.
- Cap 30fps via a time accumulator. The motion is slow; 60fps buys nothing and
  doubles battery drain.
- Pause on `document.visibilityState === 'hidden'` and when scrolled past the hero.
- fbm octaves 5 → 3 below 768px.
- Mount **after** hydration and fade in over 800ms, so it can never touch LCP.
- Static CSS-gradient fallback for: no WebGL, `prefers-reduced-motion`,
  `Save-Data`, and the prerendered HTML. The site must be complete and beautiful
  with the canvas removed entirely.
- Below the hero the canvas opacity ramps to ~25% so reading sections stay calm.

---

## 6. Sakuga motion system

Your answer was "anime timing, not anime pictures." That is a real discipline
and it needs tokens, not vibes.

```css
--ease-anticipate: cubic-bezier(0.34, -0.25, 0.20, 1.00); /* undershoot first  */
--ease-settle:     cubic-bezier(0.22,  1.40, 0.36, 1.00); /* overshoot, settle */
--ease-glide:      cubic-bezier(0.16,  1.00, 0.30, 1.00); /* already in use    */
--ease-snap:       cubic-bezier(0.70,  0.00, 0.30, 1.00);

--dur-instant: 120ms;  --dur-quick: 220ms;  --dur-base: 420ms;
--dur-slow:    900ms;  --dur-sunset: 1600ms;
--ma:          400ms;  /* the held beat */
```

The six principles, and where each is actually used:

1. **Anticipation** — a small counter-move before any forward move. Toggle dot,
   nav indicator, card lift.
2. **Overshoot and settle** — arrivals pass the target by ~6% and come back.
   Accent colour change, modal open, chip highlight.
3. **Stepped timing (on 2s / 3s)** — some elements animate at ~8–12fps while
   everything around them is smooth. Number counters, the heatmap fill, the
   ASCII pikachu, the cursor trail. **This is the single clearest anime tell**
   and almost nobody does it on the web.
4. **Smear frames** — one frame of directional blur + `scaleX` at the peak of a
   fast transition. Route changes, lightbox open. Cheap, startlingly effective.
5. **Ma (間)** — the held pause. After a section finishes animating in, nothing
   is *allowed* to happen for 400ms. Encoded as a floor on stagger delays. This
   is what makes it feel unhurried rather than merely slow.
6. **Secondary action** — when a card lifts, its shadow lags 40ms behind its
   content. Gives things mass.

---

## 7. Microinteractions

1. **Sunset toggle** — §4.
2. **Nav indicator** — a dot that travels between sections rather than appearing,
   with anticipation and settle.
3. **Project card hover** — lifts 3px, shadow lags 40ms, index number counts up
   on 3s stepping, tech chips stagger-brighten left to right at 30ms intervals.
4. **Links** — an SVG underline that draws left to right along a path with two
   or three small deviations, so it reads as ink rather than a CSS border.
5. **Photo tiles** — the existing greyscale→colour hover, upgraded to pass
   **through warm sepia at the midpoint** instead of lerping straight to colour.
   One extra keyframe, completely different feeling.
6. **Copy email** — click copies, text smear-swaps to `copied ✓`, reverts after
   one `--ma`.
7. **Scroll progress** — not a bar. A hairline in the left margin that fills,
   with a tick at each section boundary.
8. **Contribution heatmap** — fills in a diagonal wave on first view, 8ms per
   cell, on 2s stepping.
9. **Keyboard** — `t` toggles theme, `g` then `h/w/p/c` jumps to sections, `?`
   opens the shortcut sheet. Engineers notice this immediately and it costs
   nothing.
10. **Cursor** — keep the existing custom cursor, soften it: a warm dot lagging
    the real pointer on a spring, scaling over interactive elements. Off on touch.
11. **Section reveals** — reveal by line with a `clip-path` wipe rather than an
    opacity fade. Reads as writing appearing rather than content loading.

---

## 8. Memory layer

All `localStorage`, no backend, no tracking, no cookie banner.

- **First visit**: theme picked from the visitor's local clock. Arriving at 9pm
  in Berlin opens the site at dusk. Explains itself without a word.
- **After any manual toggle**: their choice is stored and always wins.
- **Return visit**: the hero's second line changes. First time it is the pitch;
  after that it acknowledges them quietly.
- **Third visit**: the Pikachu easter egg becomes discoverable.

Keys live under one namespace (`ll:*`) and the site is fully correct when
storage throws or returns nothing — private windows, cleared data, prerender.

---

## 9. Structure

```
/                      home — one scroll, everything in summary
  hero                 sky, name, "Founding Engineer · AI Systems", two sentences
  position             "The model extracts. The code decides." + 3 sentences
  proof                four numbers, large, mono
  work                 3 featured case studies, then a compact list
  experience           Retsguide / OpenSphere / KDE, numbers pulled out
  photography          5-photo strip → /photography
  contact              the night scene, the bench, the egg

/work                  all projects
/work/<slug>           case study: problem → build → decisions → numbers → stack
/photography           full gallery (existing grid, restyled)
/for/<company>         personalised hiring page (noindex)
/for/<company>/<person> same page, addressed to one person (noindex)
```

The `/now` section is cut, per your answer.

Featured three. All of these are yours outright, all have public code or public
results, and all three argue the same thesis from different angles:

1. **`load-forecasting`** — the CNN-Transformer. Multi-scale conv front end, FFT
   branch for daily and weekly cycles, cross-attention fusion into a Transformer
   encoder. Beat a plain Transformer in 15 of 18 lookback/horizon settings on
   CU-BEMS (11,486 hourly records), MAE down 10.4% on average and 12.2% at
   horizons past 10h, test R² 0.88–0.97. The ablation held data, loss and
   training budget fixed. **This is your research credibility, uncompromised by
   any NDA.**

2. **`review-agent`** — the AI code reviewer in GitHub Actions. An eight-deep
   fallback chain through free OpenRouter models, then Groq, reaching paid Azure
   only when everything above it has failed. Member-gated so only the repo's own
   people can trigger it, action pinned to a SHA, token budget raised so large
   diffs are not silently truncated. **It is the thesis as working code, and you
   can link a visitor straight to the file.**

3. **`astra`** — Tree-sitter parses the repository, dependencies are matched
   against OSV.dev, Gemini generates remediation patches, and those patches open
   as pull requests with no manual step in between. Runs on 500+ file repos.

Retsguide appears in **Experience**, described per §2.1, and does not get a case
study page. That is the right call even setting the NDA aside: featured work a
visitor can open the source of is worth more than work they have to take on
faith.

The rest (Ephemeris, CodeRivals, DevTrackr, GitStory, SecurePDF, Code-Sync,
Sorting Visualizer) stay as cards on `/work`, showing range — shipped products,
real-time systems, a Go service.

## 10. `/for/<company>/<person>` — the hiring page

Two levels, as you asked. `/for/stripe` is the company page;
`/for/stripe/priya` is the same page addressed to one person.

```ts
export interface Person {
  slug:        string;    // 'priya'  →  /for/stripe/priya
  name:        string;    // 'Priya'  — used in the greeting
  title?:      string;    // 'Engineering Manager'
  greeting?:   string;    // overrides the default greeting
  note?:       string;    // overrides the company note
  highlights?: string[];  // overrides the company project order
}

export interface Pitch {
  slug:        string;    // 'stripe'  →  /for/stripe
  company:     string;    // 'Stripe'
  role?:       string;    // 'Founding Engineer'
  note:        string;    // 2–3 sentences you write, why this company
  highlights:  string[];  // project slugs, in display order
  proofPoints: string[];  // which numbers to blow up for this reader
  theme?:      'lastlight' | 'dusk';
  people?:     Person[];
  expiresOn?:  string;
}
```

Every person field falls back to the company value when absent, so a new person
is usually two lines. An unrecognised person slug renders the company page
rather than 404ing — a mistyped or forwarded link should still land somewhere
good.

The page, top to bottom:

1. One line over the dusk sky, in Instrument Serif, and nothing else above the
   fold. *"For the team at Stripe."* — or, with a person, *"Hi Priya."*
2. Your note. Three sentences, prose serif.
3. Three proof points as large mono numbers, chosen per company.
4. The two or three projects that matter to them, as full case-study cards.
5. Resume, calendar and email, all reachable one scroll in on a laptop.

`noindex, nofollow` on every one of these, and they are excluded from the
sitemap. The prerender script already walks routes; it gets extended to
enumerate company slugs and their people so each is static HTML.

One thing to be deliberate about: these URLs are unlisted, not private. Anyone
with the link can open it, and a real person's name sits in the path. Use first
names only (`/for/stripe/priya`, not a full name), and do not write anything in
a note you would mind that person forwarding.

## 11. Copy

Hero:

```
Sangam Pratap Singh                         ← Instrument Serif, ~96px
founding engineer · ai systems              ← JetBrains Mono, 13px, tracked
```

Then two sentences in Newsreader, ~20px, max 68ch. The hero grounds you; the
position section below sharpens it to six words. Three options:

> **A.** Founding engineer at a Danish legal-tech startup, building the
> retrieval layer behind their legal reports. I build AI systems that can be
> checked: the model reads and ranks, the code decides.

> **B.** Founding engineer at a Danish legal-tech startup. I build the parts of
> an AI product that have to be right, and I keep the model out of the parts
> that do.

> **C.** I build AI systems that can be checked — the model reads, extracts and
> ranks, and the code decides. Currently the retrieval layer behind legal
> reports at a startup in Copenhagen.

**A** is my pick. It grounds you in a real role before making a claim, and the
claim is specific enough to be argued with. **B** is the best single sentence of
the three but floats free of any evidence; it would work if the proof row sat
directly beneath it. Neither names Retsguide in the hero, which keeps the
strongest claim on the site clear of the NDA question entirely — the company is
named lower down, in Experience.

The position section then states the thesis as a pull quote and gives it three
sentences of support. Everything below it is evidence.

## 12. Budgets and accessibility

- LCP < 1.5s on a mid-range Android over 4G. The canvas mounts after hydration
  and cannot affect it.
- JS on the home route < 120KB gzipped, excluding the shader (~4KB).
- CLS 0. Every photo already carries intrinsic dimensions.
- Lighthouse ≥ 95 across the board, which the current site roughly holds and the
  redesign must not regress.
- Full keyboard reachability with a visible focus ring in both themes.
- `prefers-reduced-motion` removes the shader animation, the stepped timing, the
  smears and the sunset, and keeps everything legible and complete.
- **This repository is public.** Nothing describing Retsguide's internals goes
  into a committed file, a commit message, a code comment or a branch name —
  not even as an example of what to avoid. `docs/PRIVATE-NOTES.md` is gitignored.
- Prerendering, JSON-LD, sitemap and canonical handling all stay exactly as they
  are. They work; the redesign does not touch them except to add routes.

---

## 13. Phases

| Phase | Work |
|---|---|
| 0 | Tokens, fonts, grain, theme plumbing. No layout yet. |
| 1 | The shader, fallback, and the sunset toggle. Built and tuned alone, because it is the hardest and most valuable part. |
| 2 | Motion tokens and the reveal primitives. |
| 3 | Home page, section by section. |
| 4 | `/work` and the three featured case studies. |
| 5 | `/photography` restyle onto the new palette. |
| 6 | `/for/<company>` and the prerender extension. |
| 7 | Microinteraction pass, memory layer, easter egg, keyboard. |
| 8 | Budgets, a11y audit, cross-browser, mobile. |

Phases 0–2 are the risk. If the sunset toggle does not feel extraordinary by the
end of phase 1, we change direction before anything is built on top of it.

---

## 14. Answered, and what is left

Settled:

1. **Retsguide** — architecture stays private, the work gets described. §2.1
   draws the line and lists exactly what goes on the page.
2. **`2s → 150ms`** — kept. It is already public on the current site.
3. **`/now`** — cut.
4. **Photography** — greyscale until hover, everywhere, home strip and gallery
   both.
5. **Hiring pages** — `/for/<company>/<person>`, spec in §10.

Still open:

1. **The first real company and person** for `/for/`. Give me one and I will
   write that page properly instead of building a template against a guess.
2. **Which hero sentence** — A, B or C in §11.
3. **Retsguide clearance on the evaluation numbers** (§2.1). Worth asking them.
   It is the difference between "builds AI systems" and being able to put a
   before-and-after retrieval benchmark on the page and defend it.
