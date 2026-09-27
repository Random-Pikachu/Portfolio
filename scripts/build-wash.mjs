/**
 * The cover's ink wash, made from three of the site's own photographs.
 *
 *   frame 11  pxl-20240427-193502936-night  bare branches, 16 s   → foreground ink
 *   frame 9   img-20240903-160828459        a cloud                → left as paper in a light wash
 *   frame 15  img-20260721-182117987        a treeline over hills  → the ridge, dissolving into mist
 *
 * Each element becomes an ink-density map (white = ink): luminance keyed for
 * the branches and the ridge, blue-minus-red keyed for the cloud so the sky
 * becomes paper. The maps are screened together on a 1600×1200 canvas,
 * bled by a one-pixel dilation and a soft blur, grained with fine Gaussian
 * noise (seeded, so the output is reproducible), then tinted to the ramp:
 * ink #161616 on paper #f3f0e8. In night mode the same image is shown as a
 * paper sheet on the night ground, so one image serves both modes.
 *
 * Run: npm run wash. Needs ImageMagick 7 (`magick`). Output is committed.
 * The density maps themselves live in scripts/lib/wash.mjs, shared with the
 * night plates of scripts/build-art.mjs.
 */
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { densities, grain, INK, magick, PAPER, ROOT, SEED, SIZE } from './lib/wash.mjs';

const OUT = join(ROOT, 'public', 'wash');
const tmp = mkdtempSync(join(tmpdir(), 'wash-'));
const t = (name) => join(tmp, name);
const size = SIZE;

mkdirSync(OUT, { recursive: true });

const maps = densities(tmp);

// Screen the densities together, bleed, grain, tint.
magick('-size', size, 'xc:black', maps.ridge.file, '-compose', 'Screen', '-composite',
  '(', maps.cloud.file, ')', '-geometry', maps.cloud.offset, '-compose', 'Screen', '-composite',
  '(', maps.branches.file, ')', '-geometry', maps.branches.offset, '-compose', 'Screen', '-composite', t('density.png'));
magick(t('density.png'), '(', '+clone', '-morphology', 'Dilate', 'Disk:1.0', '-blur', '0x2.2', '-evaluate', 'multiply', '0.5', ')',
  '-compose', 'Screen', '-composite', '-negate', t('paper-neg.png'));
magick(t('paper-neg.png'), grain(tmp), '-compose', 'Overlay', '-define', 'compose:args=11', '-composite', '+level-colors', `${INK},${PAPER}`, t('cover.png'));

// Outputs: the sheet at two widths, and a portrait crop of the right half for phones.
magick(t('cover.png'), '-strip', '-define', 'webp:method=6', '-quality', '64', join(OUT, 'cover-1600.webp'));
magick(t('cover.png'), '-resize', '960x', '-strip', '-define', 'webp:method=6', '-quality', '66', join(OUT, 'cover-960.webp'));
magick(t('cover.png'), '-crop', '1000x1250+560+0', '+repage', '-resize', '720x', '-strip', '-define', 'webp:method=6', '-quality', '66', join(OUT, 'cover-phone.webp'));
magick(t('cover.png'), '-resize', '800x', join(tmp, 'preview.png'));
console.log(`wrote public/wash/cover-1600.webp, cover-960.webp, cover-phone.webp (preview at ${join(tmp, 'preview.png')})`);

// The grain alone, as a tile: the same seeded noise the wash is grained with,
// so the sky layer and the paper cards carry the same paper as the cover.
// Mid-grey on average, so it is neutral under multiply/screen at low opacity.
magick('-size', '256x256', 'xc:gray50', '-seed', SEED, '-attenuate', '0.9', '+noise', 'Gaussian', '-colorspace', 'gray', '-blur', '0x0.5',
  '-level', '30%,70%', '-strip', '-define', 'webp:method=6', '-quality', '40', join(OUT, 'grain-256.webp'));
console.log('wrote public/wash/grain-256.webp');
if (process.env.KEEP_TMP !== '1') rmSync(tmp, { recursive: true, force: true });
else console.log(`kept ${tmp}`);
