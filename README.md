# random-pikachu.dev

The portfolio of Sangam Pratap Singh, built as the Night Shift: a lone house
with one lit window in green mountains under a grainy night sky. One person
awake and building while everyone else sleeps. Dark only. React 19, Vite 7,
Tailwind v4, Lenis, prerendered to static HTML and deployed on Vercel.

Live: https://random-pikachu.dev

## The pages

| Page | URL | What it is |
| --- | --- | --- |
| Home | `/` | The hero over the Nightscape; the six covers with their sixty-second stories (`#work`, `#work-<slug>` opens one); the logbook (`#logbook`); about (`#about`); the after-hours doors; contact (`#contact`); on phones a call bar after the hero |
| Case study | `/work/<slug>` | Built when `content/work/<slug>.md` is published |
| Photos | `/photography` | 27 frames from a Nothing Phone (1), with EXIF captions and a lightbox |
| Blog | `/blog`, `/blog/<slug>` | Markdown notes. The route is built only once a real note exists |

## The art

`src/night/` is the one image the site is built on.

- **The Nightscape** (`Nightscape.tsx`, `terrain.ts`): the sky, a sparse star
  field, four ridges far to near with conifers on the nearer ones, valley mist,
  and the house with its one lit window. Pure SVG, drawn from fixed seeds, so
  the prerendered HTML and the hydrated page draw the same night and it is
  there at first paint without JavaScript. Each depth is its own SVG with
  `data-depth` (0 the sky, 4 the nearest ridge), so a scroll drift can move
  it on the compositor. The nearest ridge is the page's own ground.
- **The mark** (`WindowMark.tsx`): the same house as a line, window lit. It
  sits in the nav and closes the footer.
- **Grain**: one static SVG noise tile (`--noise` in `src/index.css`), over the
  whole page at `--grain-alpha` and heavier over the art. It never animates.

## Working on it

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # design checks: contrast, no radius, no em dash, no placeholder text
npm run lint
npm run build      # content, checks, typecheck, client, prerender
npm run preview    # serve dist/
npm run og         # the social cards, from the build, through Chrome; commit them
```

`npm run build` runs, in order: `scripts/build-content.mjs` (Markdown to
`src/data/content.generated.ts`), `scripts/check-design.mjs`, `tsc -b`,
`vite build`, `vite build --ssr`, `scripts/prerender.mjs`.
`node scripts/shot.mjs <url> <out.png> [--reduce] [--scroll N|#id]
[--width W --height H] [--dpr N] [--full]` screenshots a running page through
the local Chrome and prints its console and browser errors, for review. The
prerender bakes every page into static HTML with its JSON-LD, then writes
`sitemap.xml` and `llms.txt`. Do not add those two to `public/`.

Verify a change cheaply with `npm run check`, `npx tsc -b` and `npm run lint`;
run the full build at the end of a piece of work.

## Adding a project

1. Add the entry to `PROJECTS` in `src/data/site.ts` with a `slug`. Projects
   without `archived: true` are the six on the home page, in order.
2. Put a composed screenshot at `design/shots/<image>.png` (or `.webp`) and
   run `npm run work`; it writes `public/work/<image>-1600.webp` and
   `-960.webp`. Set `image: '<image>'` on the entry.
3. Optionally write `content/work/<slug>.md`; its body is the case study at
   `/work/<slug>`, built only when `published: true`. See `content/README.md`.
4. Commit the generated files with the source.

## Writing a note

Create `content/blog/<slug>.md` with `title`, `date`, `summary` and
`draft: false`; the body is GitHub-flavoured Markdown, code fences are
highlighted at build, and every `##`/`###` becomes the outline.
`content/blog/_example.md` shows the shape; underscore files and drafts are
ignored unless `CONTENT_DRAFTS=1`. The first published note also turns on the
Blog link in the nav and the `/blog` route.

## Photos

`npm run photos` rebuilds the gallery from `photos-raw/` (gitignored) into
`public/photos` and `src/data/photos.ts`; only `alt`, `location` and the order
in that file are hand-edited and survive a re-run.

## Structure

```
content/            work/<slug>.md and blog/<slug>.md, compiled at build
design/shots/       composed project screenshots (sources for public/work)
public/work/        project images        public/photos/  gallery frames
public/og/          social cards
scripts/            build-content, check-design, build-og, build-work,
                    build-photos, prerender, shot
src/tokens.css      the palette, the art's colours, type, space, motion,
                    radius 0
src/index.css       fonts, tokens into Tailwind, grain, type roles, the frame
src/night/          the Nightscape, the terrain, the mark
src/shell/          Shell, Nav, Footer, PageHead, SmoothScroll, scroll.ts
src/sections/       Hero, Work, Logbook, About, AfterHours (and the egg),
                    Contact, CallBar (the phone call bar)
src/motion/         Motion (the reveals), parallax (the hero's drift)
src/og/             OgCard: the social card, rendered by scripts/build-og
src/data/stories.ts the sixty-second stories, by slug, rendered exactly
src/pages/          Home, Photography, Notes, Note, Detail, Outline
src/data/site.ts    the single source of truth for identity, nav, roles,
                    projects
src/data/content.generated.ts   written by the content build; committed
```

## Conventions

- Dark only. `night` is the ground, `pine` the surfaces, `starlight` the text
  (never pure white), `sage` the secondary text.
- `ember` is rationed: the lit window, the primary call, one accent per
  viewport. The nav's call stays an outline while the hero's or contact's call
  is on screen and lights in between; on phones the call bar takes over.
- Three families, one job each: Fraunces for display, Space Grotesk for
  everything readable, JetBrains Mono for labels, dates and captions. Never
  display for body, never mono for a sentence.
- Every text token clears 4.5:1 on night and on both pine surfaces; `npm run
  check` measures it. No radius anywhere.
- No em dashes in copy, comments or content, and no placeholder text; the
  check fails the build on either. Missing content is left visibly empty.
- Motion: transform and opacity only, two curves and four durations in
  `tokens.css`. Reveals (`data-reveal`) rise once, into place; the hero's
  layers drift on scroll on wide screens only; pages cross-fade. All of it
  is off under `prefers-reduced-motion`, which renders every final state,
  and none of it hides anything without JavaScript. Grain never moves.
  Every hover has a tap and focus equivalent.
- Stories: `src/data/stories.ts` is rendered word for word. A project with
  no honest number has no number line; nothing is filled in to look
  complete, and the build fails on any placeholder marker left in.

## Routing note

`vercel.json` rewrites every unknown path to `/` on purpose: arbitrary URLs
like `/some-company` are used as open-tracking tokens for outreach emails.
Those paths serve the home page with an `X-Robots-Tag: noindex, follow`
header and a canonical of `/`. Real pages (`/photography`, `/blog`,
`/blog/<slug>`, `/work/<slug>`) are rewritten to their files first and are
excluded from the noindex rule. On the home page the nav's section links are
bare hashes, so they work on a tracking path without leaving it.
