/**
 * Encodes the photography originals into web derivatives and generates the
 * manifest the gallery renders from.
 *
 *   photos-raw/*.jpg   ->  public/photos/<slug>-{400,800}.webp
 *                      ->  src/data/photos.ts
 *
 * The originals are gitignored and never reach `public/`, because Vite copies
 * public/ verbatim into dist/ — leaving 96 MB of raws there would ship them.
 *
 * Nothing is cropped. Each photo keeps its native aspect ratio; the manifest
 * carries pre-computed grid spans for the 4-, 3- and 2-column layouts so the
 * bento packs correctly in the prerendered HTML with no client-side measuring.
 *
 * ImageMagick here has WebP but no working AVIF (it silently writes a JPEG),
 * so do not add an AVIF branch without installing sharp first.
 *
 * Run: npm run photos
 */
import { execFileSync } from 'node:child_process';
import { readdir, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR = path.join(root, 'photos-raw');
const OUT_DIR = path.join(root, 'public', 'photos');
const MANIFEST = path.join(root, 'src', 'data', 'photos.ts');

const GRID_WIDTHS = [400, 800];   // what the bento serves
const MODAL_WIDTH = 1600;          // fetched only when a lightbox opens
const WIDTHS = [...GRID_WIDTHS, MODAL_WIDTH];
const QUALITY = 76;

// Layout constants — these MUST stay in sync with .photo-grid in src/index.css.
// Everything is expressed in cqw (percent of the grid container's width) so the
// spans below are exact at every viewport, not just at one design width.
const GAP = 1.2;        // column-gap, in cqw
const ROW_UNIT = 0.4;   // grid-auto-rows, in cqw (row-gap is 0; tiles pad instead)
const LAYOUTS = [4, 3, 2];

const magick = (args, quiet = false) =>
  execFileSync('magick', args, {
    maxBuffer: 1024 * 1024 * 64,
    stdio: quiet ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'pipe', 'inherit'],
  });

function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Rows a tile must span so its frame matches the photo's true aspect ratio.
 * Row-gap is 0 and each tile pads its own bottom by GAP, so quantisation error
 * is one ROW_UNIT (~0.4% of tile height) rather than a whole gap.
 */
function rowSpan(ratio, cols, colSpan) {
  const colW = (100 - GAP * (cols - 1)) / cols;
  const tileW = colW * colSpan + GAP * (colSpan - 1);
  const frameH = tileW / ratio;
  return Math.max(1, Math.round((frameH + GAP) / ROW_UNIT));
}

/**
 * Only true panoramas take two columns. Every two-column tile forces its pair of
 * columns to level up, and any height difference between them becomes a visible
 * hole — with 7 wide tiles the grid was full of them. Height variation between
 * portraits and landscapes already supplies the bento rhythm.
 */
function colSpanFor(ratio, cols) {
  if (cols === 2) return 1;
  return ratio >= 1.9 ? 2 : 1;
}

/**
 * Skyline packing: place each tile in the column (or adjacent pair) that is
 * currently shortest. Produces explicit grid-column-start / grid-row-start, so
 * the layout has no internal gaps and needs no `grid-auto-flow: dense` — the
 * dense algorithm could only backfill a hole if a later tile happened to fit it
 * exactly, which with ~100-row tiles essentially never happened.
 */
function packColumns(items, cols) {
  const colY = new Array(cols).fill(0);
  return items.map((it) => {
    const span = it.spans[cols].col;
    let best = 0;
    let bestY = Infinity;
    for (let c = 0; c + span <= cols; c++) {
      const y = Math.max(...colY.slice(c, c + span));
      if (y < bestY) { bestY = y; best = c; }
    }
    for (let c = best; c < best + span; c++) colY[c] = bestY + it.spans[cols].row;
    return { x: best + 1, y: bestY + 1 };   // CSS grid lines are 1-based
  });
}

const DEVICES = {
  'nothing a063': 'Nothing Phone (1)',
  'nothing a063 (spacewar)': 'Nothing Phone (1)',
};

// Every photo in this gallery was shot on the same phone. Three files lost their
// EXIF when they were exported, so fall back to the device rather than leaving
// the camera bar blank.
const DEFAULT_DEVICE = 'Nothing Phone (1)';

/** Reads every EXIF tag in one call and normalises the few we display. */
function readExif(file) {
  let raw = '';
  try {
    raw = magick(['identify', '-format', '%[EXIF:*]', file], true).toString();
  } catch { return {}; }

  const tag = {};
  for (const line of raw.split('\n')) {
    const i = line.indexOf('=');
    if (i > 0) tag[line.slice(0, i).replace(/^exif:/, '')] = line.slice(i + 1).trim();
  }

  const frac = (v) => {
    if (!v) return null;
    const [a, b] = v.split('/').map(Number);
    return b ? a / b : a;
  };

  const make = tag.Make?.trim() ?? '';
  const model = tag.Model?.trim() ?? '';
  const key = `${make} ${model}`.toLowerCase().trim();
  const device = DEVICES[key] || (make && model ? `${make} ${model}` : DEFAULT_DEVICE);

  const f = frac(tag.FNumber);
  const exp = tag.ExposureTime;
  let shutter = '';
  if (exp) {
    const v = frac(exp);
    shutter = v >= 1 ? `${Math.round(v)}s` : `${exp.includes('/') ? exp : `1/${Math.round(1 / v)}`}s`;
  }

  return {
    device,
    // DateTimeOriginal only. EXIF `DateTime` is the file-modification time, not
    // the capture time — on these files it ran months late — and a date guessed
    // from the filename is not evidence either. Better to show nothing.
    shotAt: (tag.DateTimeOriginal || '').replace(
      /^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'
    ),
    aperture: f ? `f/${f.toFixed(1)}` : '',
    iso: tag.ISOSpeedRatings ? `ISO ${tag.ISOSpeedRatings}` : '',
    shutter,
    focal: tag.FocalLengthIn35mmFilm ? `${tag.FocalLengthIn35mmFilm}mm` : '',
  };
}

/** Reads back alt text and ordering a human curated, so re-runs don't clobber them. */
async function readExisting() {
  if (!existsSync(MANIFEST)) return { alts: new Map(), locations: new Map(), order: [] };
  const src = await readFile(MANIFEST, 'utf8');
  const alts = new Map();
  const locations = new Map();
  const order = [];
  const re = /slug:\s*'([^']+)'[\s\S]*?alt:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?location:\s*'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(src))) {
    order.push(m[1]);
    if (m[2]) alts.set(m[1], m[2]);
    if (m[3]) locations.set(m[1], m[3]);
  }
  return { alts, locations, order };
}

function exifDate(file) {
  try {
    const out = magick(['identify', '-format', '%[EXIF:DateTimeOriginal]', file], true).toString().trim();
    if (out) return out.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
  } catch { /* no EXIF date — fall through */ }
  const m = path.basename(file).match(/(20\d{2})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
}

// ── Run ──────────────────────────────────────────────────────────────────────
if (!existsSync(RAW_DIR)) {
  console.error(`No photos-raw/ directory at ${RAW_DIR}. Nothing to do.`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
const { alts, locations, order } = await readExisting();

const files = (await readdir(RAW_DIR))
  .filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
  .sort();

if (!files.length) {
  console.error('photos-raw/ contains no images.');
  process.exit(1);
}

const photos = [];
let bytes = 0;

for (const file of files) {
  const abs = path.join(RAW_DIR, file);
  const slug = slugify(file);

  const [w, h] = magick(['identify', '-format', '%w %h', abs]).toString().trim().split(' ').map(Number);
  if (!w || !h) {
    console.warn(`  ! skipped ${file} — could not read dimensions`);
    continue;
  }
  const ratio = +(w / h).toFixed(4);

  for (const target of WIDTHS) {
    const out = path.join(OUT_DIR, `${slug}-${target}.webp`);
    magick([
      abs,
      '-auto-orient',
      '-strip',
      '-resize', `${target}x>`,
      '-quality', String(QUALITY),
      '-define', 'webp:method=6',
      out,
    ]);
    bytes += (await stat(out)).size;
  }

  // Tiny blurred placeholder, inlined as a data URI so tiles never flash empty.
  const lqip = magick([
    abs, '-auto-orient', '-strip', '-resize', '20x20>', '-blur', '0x1.5',
    '-quality', '35', 'webp:-',
  ]).toString('base64');

  const spans = {};
  for (const cols of LAYOUTS) {
    const cs = colSpanFor(ratio, cols);
    spans[cols] = { col: cs, row: rowSpan(ratio, cols, cs) };
  }

  const exif = readExif(abs);

  photos.push({
    slug,
    width: w,
    height: h,
    ratio,
    // Blank unless the capture timestamp is real; only sorting falls back below.
    date: exif.shotAt ? exif.shotAt.slice(0, 10) : '',
    shotAt: exif.shotAt || '',
    sortDate: exif.shotAt ? exif.shotAt.slice(0, 10) : exifDate(abs),
    device: exif.device || '',
    aperture: exif.aperture || '',
    iso: exif.iso || '',
    shutter: exif.shutter || '',
    focal: exif.focal || '',
    location: locations.get(slug) ?? '',
    alt: alts.get(slug) ?? '',
    spans,
    lqip: `data:image/webp;base64,${lqip}`,
  });

  process.stdout.write(`  ✓ ${slug} ${w}×${h} (${ratio})\n`);
}

// Keep any manual ordering from a previous run; new photos go to the front,
// newest first.
const rank = new Map(order.map((s, i) => [s, i]));
photos.sort((a, b) => {
  const ra = rank.has(a.slug) ? rank.get(a.slug) : -1;
  const rb = rank.has(b.slug) ? rank.get(b.slug) : -1;
  if (ra !== rb) return ra - rb;
  return (b.sortDate || '').localeCompare(a.sortDate || '');
});

// Placement must be computed after the final ordering.
const placements = Object.fromEntries(LAYOUTS.map((c) => [c, packColumns(photos, c)]));

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const manifest = `// GENERATED by scripts/build-photos.mjs — do not edit by hand,
// EXCEPT the \`alt\` and \`location\` strings and the order of the array. All three
// are preserved across re-runs.
//
//   alt      - what puts these photos in Google Images. Worth writing properly.
//   location - shown in the lightbox's camera bar. Only 2 of these files carry
//              GPS EXIF, so type a human place name ("Gwalior Fort"); the line
//              is omitted entirely when left blank. Nothing publishes coordinates.
//
// Spans are pre-computed for the 4/3/2-column layouts and assume the cqw
// constants in .photo-grid (src/index.css). If you change the gap or row unit
// there, re-run this script.

export interface PhotoSpan {
  /** Columns the tile occupies. */
  col: number;
  /** Rows the tile occupies (grid-auto-rows units). */
  row: number;
  /** 1-based grid-column-start from the skyline packer. */
  x: number;
  /** 1-based grid-row-start from the skyline packer. */
  y: number;
}

export interface Photo {
  slug: string;
  width: number;
  height: number;
  ratio: number;
  /** YYYY-MM-DD, from EXIF DateTimeOriginal only. Empty when unverified. */
  date: string;
  /** Full capture timestamp from EXIF DateTimeOriginal. Empty when unverified. */
  shotAt: string;
  device: string;
  aperture: string;
  iso: string;
  shutter: string;
  focal: string;
  /** Typed by hand — see the note at the top of this file. */
  location: string;
  alt: string;
  spans: Record<'4' | '3' | '2', PhotoSpan>;
  lqip: string;
}

export const PHOTOS: Photo[] = [
${photos
  .map(
    (p, i) => `  {
    slug: '${p.slug}',
    width: ${p.width},
    height: ${p.height},
    ratio: ${p.ratio},
    date: '${p.date}',
    shotAt: '${p.shotAt}',
    device: '${esc(p.device)}',
    aperture: '${p.aperture}',
    iso: '${p.iso}',
    shutter: '${p.shutter}',
    focal: '${p.focal}',
    location: '${esc(p.location)}',
    alt: '${esc(p.alt)}',
    spans: {${LAYOUTS.map(
      (c) => ` '${c}': { col: ${p.spans[c].col}, row: ${p.spans[c].row}, x: ${placements[c][i].x}, y: ${placements[c][i].y} },`
    ).join('')} },
    lqip: '${p.lqip}',
  },`
  )
  .join('\n')}
];
`;

await writeFile(MANIFEST, manifest);

const missingAlt = photos.filter((p) => !p.alt).length;
console.log(
  `\n✓ ${photos.length} photos → ${photos.length * WIDTHS.length} WebP files, ` +
  `${(bytes / 1024 / 1024).toFixed(2)} MB total\n` +
  `✓ wrote src/data/photos.ts`
);
if (missingAlt) {
  console.log(`\n⚠ ${missingAlt} photos have empty alt text. Fill them in src/data/photos.ts.`);
}
