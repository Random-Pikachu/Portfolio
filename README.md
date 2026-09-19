# random-pikachu.dev

The portfolio of Sangam Pratap Singh, built as an astronomer's atlas: every
page is a chart with a title block, ruled by the same ten faint columns as a
graticule, dimensioned in the sky's own units, drawn over a star field and
under a moon at its real phase. Ink on paper by day, paper on the night by
dark. The illustrated plates are made from my own photographs until hand-made
or generated art replaces them. React 19, Vite 7, Tailwind v4, Lenis, one
WebGL2 shader, prerendered to static HTML and deployed on Vercel.

Live: https://random-pikachu.dev

## The charts

| Chart | URL | What it is |
| --- | --- | --- |
| 00 Frontispiece | `/` | Name, one line, the call button, the plate a whale swims out of, one dimension |
| 01 Observer | `/#about` | The pull line, currently, instruments, Fig. 1, where the moon lands |
| 02 Transits | `/#experience` | Roles as orbits about the now tick, where the moon parks |
| 03 Constellations | `/#projects` | Six plates in one frame over the firmament; `#project-<slug>` deep-links a plate |
| 04 Transmission | `/#contact` | The call, the lighthouse whose beam rests on it, the seal, three link cells, the year's activity |
| Plate | `/work/<slug>` | A plate's case study, built when `content/work/<slug>.md` is published |
| Notes | `/blog`, `/blog/<slug>` | Markdown notes, docs-style |
| Survey | `/photography` | 27 frames from a Nothing Phone (1) |

## The sky

`src/sky/` is the sky under every page and the moon above it.

- **The chart** (`SkyLayer.tsx`, `stars.ts`, `figures.ts`): a seeded star
  field and the constellations as prerendered SVG, so the sky is there at
  first paint and without JavaScript. Cetus is the real Whale from J2000
  positions; the figures on the plates and 025 are invented.
- **The scene** (`scene.ts`, `shaders/`): one WebGL2 canvas, one program,
  mounted after hydration through a dynamic import. Faint stars at three
  depths, the haze, the mist, the orbits and the beam, composited over a
  clear ground so the page's paper stays the ground and the same program
  serves both modes. Phones, reduced motion, saved data, two cores or no
  WebGL2 keep the chart alone (`quality.ts`); `?sky=static|low|high` forces a
  tier and `?debug` shows the frame.
- **The journey** (`journey.ts`): what the sky does at every scroll
  position, as keyframes on the page's own pixels, measured once per layout.
  It pans the chart and moves the moon (`Moon.tsx`): from the glyph on the
  plate, through the transit at sixty vmin, into the opening of Fig. 1, to
  the now tick, then set, then low on the horizon. Nothing here smooths
  anything; Lenis already does.

## Working on it

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # design checks: no radius, every text token ≥ 4.5:1
npm run lint
npm run build      # content → checks → typecheck → client → prerender
npm run preview    # serve dist/
```

`npm run build` runs, in order: `scripts/build-content.mjs` (Markdown →
`src/data/content.generated.ts`), `scripts/check-design.mjs`, `tsc -b`,
`vite build`, `vite build --ssr`, `scripts/prerender.mjs`.
`node scripts/shot.mjs <url> <out.png> [--dark] [--reduce] [--scroll N|#id]
[--width W --height H]` screenshots a running page through the local Chrome,
WebGL included, for review. The prerender
bakes every page into static HTML with its JSON-LD, then writes
`sitemap.xml` and `llms.txt`. Do not add those two to `public/`.

Verify a change cheaply with `npm run check`, `npx tsc -b` and `npm run lint`;
run the full build at the end of a piece of work.

## Adding a project

1. Add the entry to `PROJECTS` in `src/data/site.ts` with a `slug`. Projects
   without `archived: true` become plates in order; archived ones are listed
   after the strip as "not issued".
2. Put a 4:3 composed screenshot at `design/shots/<image>.png` (or `.webp`)
   and run `npm run work`; it writes `public/work/<image>-1600.webp` and
   `-960.webp`. Set `image: '<image>'` on the entry.
3. Optionally write `content/work/<slug>.md`. Its front matter (`role`,
   `hardest`, `outcomes`) shows on the plate when present; its body is the
   detail sheet at `/work/<slug>`, built only when `published: true`. See
   `content/README.md`.
4. Commit the generated files with the source.

## Writing a note

Create `content/blog/<slug>.md` with `title`, `date`, `summary` and
`draft: false`; the body is GitHub-flavoured Markdown, code fences are
highlighted at build in the site's monochrome theme, and every `##`/`###`
becomes the outline. `content/blog/_example.md` shows the shape; underscore
files and drafts are ignored unless `CONTENT_DRAFTS=1`, which is how the
templates are reviewed.

Then `npm run og` to render the note's social card (needs Chrome locally)
and commit `public/og/note-<slug>.png` with the note.

## The art

`npm run art` builds the plates listed in `src/data/art.ts` into
`public/art`. A source dropped into `design/art/<id>.png` is resized; with no
source, `scripts/build-art.mjs` synthesizes a placeholder from the site's own
photographs through the same density maps as the wash (`scripts/lib/wash.mjs`).
The prompt briefs, in the register of the Ephemeris plate, are in
`design/art/`. Anchors on a plate (the moon's corner, the lamp) are in
`art.ts`; keep them with the art. Needs ImageMagick 7; the output is committed.

`npm run wash` rebuilds the ink wash and the grain tile the sky and the cards
share, from three frames in `public/photos`. The moon on the plate, in the
title block, in the rail, in the seal and above the page is computed from the
date (`src/sheet/astro.ts`), never drawn by hand; so is the zenith in the
title block.

`npm run photos` rebuilds the survey from `photos-raw/` (gitignored) into
`public/photos` and `src/data/photos.ts`; only `alt`, `location` and the
order in that file are hand-edited and survive a re-run.

`npm run og` renders the social cards; `public/og.png` is the cover's.

## Structure

```
content/            work/<slug>.md and blog/<slug>.md, compiled at build
design/shots/       composed project screenshots (sources for public/work)
design/art/         plate sources and briefs  public/art/    the plates
public/wash/        the wash and the grain    public/work/   plate banners
public/og/          social cards              public/photos/ survey frames
scripts/            build-content, check-design, build-wash, build-art,
                    build-og, build-work, build-photos, prerender, shot
src/tokens.css      both ramps, the sky's marks, type roles, space, grid,
                    motion, radius 0
src/index.css       tokens into Tailwind, type classes, the sheet grid, cards
src/sky/            the chart, the scene, the journey, the moon, the whale,
                    the figures, the seal
src/sheet/          the shell: GridLayer, SheetRule, Sheet, Rail, TitleBlock,
                    TileIndex, DimensionLine, MoonGlyph, scroll.ts (Lenis,
                    anchors, hash, tracking), store.ts, astro.ts
src/sections/       Cover, About, Experience, Details, Contact (charts 00–04)
src/pages/          Notes, Note, Detail, Photography, Outline, prose.css
src/data/site.ts    the single source of truth for identity, roles, projects
src/data/art.ts     the plates: outputs, anchors, placeholders
src/data/content.generated.ts   written by the content build; committed
```

## Conventions

- No radius anywhere; `npm run check` fails the build on one.
- Every text token clears 4.5:1 on both grounds, the paper and the card, in
  both modes; the same check measures it.
- The accent appears only as the active state, the one button, the feature
  mark on the transits and the full stop on the last chart. Never inside a
  plate, never in the sky.
- Motion: two curves, four durations, all in `tokens.css`. Everything moves
  once on entry or is scroll-linked, never both. `prefers-reduced-motion`
  renders every final state, stacks the strip and keeps the chart still.
- The scene reads the scroll and never writes it. The canvas is transparent:
  the token is the ground. `--paper-card` is the only ground a block may
  carry, and never under a backdrop-filter.
- The scene is imported only by `SkyLayer.tsx`, dynamically; the check
  enforces it, and the prerender fails if the home page carries a canvas.
- The theme toggle's circular view transition in `Navigation.tsx` stays as it
  is; the scene redraws synchronously when the class flips so the wipe
  reveals the new sky.

## Routing note

`vercel.json` rewrites every unknown path to `/` on purpose: arbitrary URLs
like `/some-company` are used as open-tracking tokens for outreach emails.
Those paths serve the home page with an `X-Robots-Tag: noindex, follow`
header and a canonical of `/`. Real pages (`/photography`, `/blog`,
`/blog/<slug>`, `/work/<slug>`) are rewritten to their files first and are
excluded from the noindex rule.
