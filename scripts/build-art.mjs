/**
 * The plates. For every slot in src/data/art.ts: if design/art/<id>.{png,webp,jpg}
 * exists it is resized to the slot's outputs; if not, a placeholder plate is
 * synthesized from the site's own photographs, paper on the night, through
 * the same density maps as the cover wash. Outputs go to public/art and are
 * committed. Run with `npm run art`. Needs ImageMagick 7 (`magick`).
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { densities, grain, magick, PHOTOS, ROOT } from './lib/wash.mjs';

const { ART } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'art.ts')).href);
const SRC = join(ROOT, 'design', 'art');
const OUT = join(ROOT, 'public', 'art');
const tmp = mkdtempSync(join(tmpdir(), 'art-'));
const t = (name) => join(tmp, name);

/* The night's palette: the plate's own void, a little lighter than the page's,
   so a plate reads as a plate lying on it; the cream of the day's paper. */
const VOID = '#0f1222';
const MIST = '#232840';
const CREAM = '#e9e3d3';

mkdirSync(OUT, { recursive: true });

/** Sparse stars as a screen layer: faint ones as pixels, a few brighter. */
function stars(size, seed, out) {
  magick('-size', size, 'xc:gray50', '-seed', String(seed), '+noise', 'Random', '-colorspace', 'gray', '-threshold', '99.88%', '-blur', '0x0.45', '-evaluate', 'multiply', '0.55', t('stars-a.png'));
  magick('-size', size, 'xc:gray50', '-seed', String(seed + 1), '+noise', 'Random', '-colorspace', 'gray', '-threshold', '99.985%', '-morphology', 'Dilate', 'Disk:1.2', '-blur', '0x0.7', t('stars-b.png'));
  magick(t('stars-a.png'), t('stars-b.png'), '-compose', 'Screen', '-composite', '+level-colors', `black,${CREAM}`, out);
}

/** A density map (white = matter) as a darkening layer: multiply by (1 − k·d). */
function shade(map, k, out) {
  magick(map, '-evaluate', 'multiply', String(k), '-negate', out);
}

/** The frontispiece: the cover wash's three photographs, at night. */
function frontispiece(out) {
  const maps = densities(tmp);
  const size = '1600x1200';
  // The ground: the void, lifting toward mist at the horizon.
  magick('-size', size, 'xc:', '-sparse-color', 'barycentric', `0,0 ${VOID} 0,1200 ${MIST}`, t('ground.png'));
  stars(size, 25, t('stars.png'));
  // The cloud, lit: its body screened in cream at three fifths.
  magick(maps.cloud.file, '-evaluate', 'multiply', '0.74', '+level-colors', `black,${CREAM}`, t('cloud-lit.png'));
  shade(maps.ridge.file, 1.0, t('ridge-shade.png'));
  shade(maps.branches.file, 1.0, t('branches-shade.png'));
  magick(t('ground.png'), t('stars.png'), '-compose', 'Screen', '-composite',
    '(', t('cloud-lit.png'), ')', '-geometry', maps.cloud.offset, '-compose', 'Screen', '-composite',
    '(', t('ridge-shade.png'), ')', '-geometry', maps.ridge.offset, '-compose', 'Multiply', '-composite',
    '(', t('branches-shade.png'), ')', '-geometry', maps.branches.offset, '-compose', 'Multiply', '-composite',
    grain(tmp, size), '-compose', 'Overlay', '-define', 'compose:args=9', '-composite', out);
}

/** The firmament: the cloud alone, mirrored across a wide night, for the strip. */
function firmament(out) {
  const maps = densities(tmp);
  const size = '4800x1200';
  magick('-size', size, 'xc:', '-sparse-color', 'barycentric', `0,0 ${VOID} 0,1200 ${MIST}`, t('f-ground.png'));
  stars(size, 31, t('f-stars.png'));
  magick(maps.cloud.file, '-evaluate', 'multiply', '0.5', '+level-colors', `black,${CREAM}`, t('f-cloud.png'));
  magick(t('f-cloud.png'), '-flop', t('f-cloud-flop.png'));
  magick(t('f-ground.png'), t('f-stars.png'), '-compose', 'Screen', '-composite',
    '(', t('f-cloud.png'), '-resize', '80%', ')', '-geometry', '+300-100', '-compose', 'Screen', '-composite',
    '(', t('f-cloud-flop.png'), '-resize', '120%', ')', '-geometry', '+1700-260', '-compose', 'Screen', '-composite',
    '(', t('f-cloud.png'), '-resize', '65%', ')', '-geometry', '+3400+80', '-compose', 'Screen', '-composite',
    '(', t('f-cloud-flop.png'), '-resize', '90%', ')', '-geometry', '+4100-200', '-compose', 'Screen', '-composite',
    grain(tmp, size), '-compose', 'Overlay', '-define', 'compose:args=9', '-composite', out);
}

/** The lighthouse: a lamp over foliage, one of the survey's frames, as a duotone night plate. */
function lighthouse(out) {
  const src = join(PHOTOS, 'img-20240815-203837346-1600.webp');
  const size = '1600x2000';
  magick(src, '-resize', size + '^', '-gravity', 'center', '-extent', size, '-colorspace', 'gray', '-level', '4%,70%,1.1', '-posterize', '7', '-blur', '0x0.6', t('l-lum.png'));
  stars(size, 41, t('l-stars.png'));
  magick(t('l-lum.png'), '+level-colors', `${VOID},${CREAM}`, t('l-tone.png'));
  magick(t('l-tone.png'), t('l-stars.png'), '-compose', 'Screen', '-composite',
    grain(tmp, size), '-compose', 'Overlay', '-define', 'compose:args=9', '-composite', out);
}

const synth = { frontispiece, firmament, lighthouse };

for (const slot of Object.values(ART)) {
  const source = ['png', 'webp', 'jpg', 'jpeg'].map((ext) => join(SRC, `${slot.id}.${ext}`)).find((f) => existsSync(f));
  let plate = source;
  if (!plate) {
    plate = t(`${slot.id}.png`);
    synth[slot.placeholder](plate);
    console.log(`${slot.id}: no source in design/art, synthesized a placeholder`);
  }
  for (const width of slot.widths) {
    const out = join(OUT, `${slot.id}-${width}.webp`);
    magick(plate, '-resize', `${width}x>`, '-strip', '-define', 'webp:method=6', '-quality', width >= 2400 ? '58' : '64', out);
    console.log(`wrote public/art/${slot.id}-${width}.webp`);
  }
  if (slot.phone) {
    const out = join(OUT, `${slot.id}-phone.webp`);
    magick(plate, '-resize', '1600x>', '-crop', slot.phone.crop, '+repage', '-resize', `${slot.phone.width}x`, '-strip', '-define', 'webp:method=6', '-quality', '66', out);
    console.log(`wrote public/art/${slot.id}-phone.webp`);
  }
}

if (process.env.KEEP_TMP !== '1') rmSync(tmp, { recursive: true, force: true });
else console.log(`kept ${tmp}`);
