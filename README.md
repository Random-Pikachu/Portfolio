# random-pikachu.dev

The portfolio of Sangam Pratap Singh, built as a drawing set: every page is a
sheet with a title block, ruled by the same ten faint columns, dimensioned,
and the only hand-made thing on any sheet is an ink wash made from my own
photographs. React 19, Vite 7, Tailwind v4, Lenis, framer-motion, prerendered
to static HTML and deployed on Vercel.

Live: https://random-pikachu.dev

## The sheets

| Sheet | URL | What it is |
| --- | --- | --- |
| 00 Cover | `/` | Name, one line, the call button, the wash, one dimension |
| 01 General | `/#about` | The pull line, currently, instruments, Fig. 1 |
| 02 Schedule | `/#experience` | Roles as dimensions on a time axis |
| 03 Details | `/#projects` | Six plates in one frame; `#project-<slug>` deep-links a plate |
| 04 Issue | `/#contact` | The call, three link cells, the year's activity |
| Detail | `/work/<slug>` | A plate's case study, built when `content/work/<slug>.md` is published |
| Notes | `/blog`, `/blog/<slug>` | Markdown notes, docs-style |
| Survey | `/photography` | 27 frames from a Nothing Phone (1) |

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
`vite build`, `vite build --ssr`, `scripts/prerender.mjs`. The prerender
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

`npm run wash` rebuilds `public/wash/cover-*.webp` from three frames in
`public/photos` (see `scripts/build-wash.mjs` for which and how). It needs
ImageMagick 7. Change the frames or the keys there; the output is committed.
The moon on the wash, in the title block and in the rail is computed from
the date (`src/sheet/astro.ts`), never drawn by hand.

`npm run photos` rebuilds the survey from `photos-raw/` (gitignored) into
`public/photos` and `src/data/photos.ts`; only `alt`, `location` and the
order in that file are hand-edited and survive a re-run.

`npm run og` renders the social cards; `public/og.png` is the cover's.

## Structure

```
content/            work/<slug>.md and blog/<slug>.md, compiled at build
design/shots/       composed project screenshots (sources for public/work)
public/wash/        the cover wash            public/work/   plate banners
public/og/          social cards              public/photos/ survey frames
scripts/            build-content, check-design, build-wash, build-og,
                    build-work, build-photos, prerender
src/tokens.css      both ramps, type roles, space, grid, motion, radius 0
src/index.css       tokens into Tailwind, type classes, the sheet grid
src/sheet/          the shell: GridLayer, SheetRule, Sheet, Rail, TitleBlock,
                    TileIndex, DimensionLine, MoonGlyph, scroll.ts (Lenis,
                    snap, anchors, hash, tracking), store.ts, astro.ts
src/sections/       Cover, About, Experience, Details, Contact (sheets 00–04)
src/pages/          Notes, Note, Detail, Photography, Outline, prose.css
src/data/site.ts    the single source of truth for identity, roles, projects
src/data/content.generated.ts   written by the content build; committed
```

## Conventions

- No radius anywhere; `npm run check` fails the build on one.
- Every text token clears 4.5:1 in both modes; the same check measures it.
- The accent appears only as the active state, the one button, the feature
  mark on the schedule and the full stop on the last sheet. Never inside a
  plate.
- Motion: two curves, four durations, all in `tokens.css`. Everything moves
  once on entry or is scroll-linked, never both. `prefers-reduced-motion`
  renders every final state, stacks the strip and makes snaps instant.
- The theme toggle's circular view transition in `Navigation.tsx` stays as it
  is.

## Routing note

`vercel.json` rewrites every unknown path to `/` on purpose: arbitrary URLs
like `/some-company` are used as open-tracking tokens for outreach emails.
Those paths serve the home page with an `X-Robots-Tag: noindex, follow`
header and a canonical of `/`. Real pages (`/photography`, `/blog`,
`/blog/<slug>`, `/work/<slug>`) are rewritten to their files first and are
excluded from the noindex rule.
