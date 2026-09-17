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
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PHOTOS = join(ROOT, 'public', 'photos');
const OUT = join(ROOT, 'public', 'wash');
const W = 1600;
const H = 1200;
const PAPER = '#f3f0e8';
const INK = '#161616';
const SEED = '25';

const src = (slug) => join(PHOTOS, `${slug}-1600.webp`);
const BRANCHES = src('pxl-20240427-193502936-night');
const CLOUD = src('img-20240903-160828459');
const RIDGE = src('img-20260721-182117987');

const tmp = mkdtempSync(join(tmpdir(), 'wash-'));
const t = (name) => join(tmp, name);
const magick = (...args) => execFileSync('magick', args, { stdio: ['ignore', 'inherit', 'inherit'] });
const size = `${W}x${H}`;

mkdirSync(OUT, { recursive: true });

// The ridge: forest only, below its own horizon, fading into mist.
// The ridge: the treeline keyed from daylight foliage, blurred and posterised
// into wash rather than canopy, fading into mist below and toward the
// branches on the left, so it sits under the cloud on the right two thirds.
magick(RIDGE, '-resize', `${W}x`, '-colorspace', 'gray', '-level', '12%,58%', '-negate', '-blur', '0x5', '-posterize', '3', t('ridge-raw.png'));
magick('-size', size, 'xc:', '-sparse-color', 'barycentric', '0,600 white 0,900 black', '-colorspace', 'gray', t('ridge-fade.png'));
magick('-size', size, 'xc:', '-sparse-color', 'barycentric', '150,0 black 820,0 white', '-colorspace', 'gray', t('ridge-side.png'));
magick('-size', size, 'xc:black', t('ridge-raw.png'), '-geometry', '+0+300', '-compose', 'Over', '-composite',
  t('ridge-fade.png'), '-compose', 'Multiply', '-composite', t('ridge-side.png'), '-compose', 'Multiply', '-composite',
  '-evaluate', 'multiply', '0.55', t('ridge.png'));

// The branches: sky to paper, wood to ink, fading from the top-left corner.
magick(BRANCHES, '-resize', '1150x', '-colorspace', 'gray', '-level', '6%,30%', '-negate', '-posterize', '3', '-blur', '0x0.7',
  '(', '+clone', '-fill', 'black', '-colorize', '100', '-fill', 'white', '-draw', 'circle 200,80 200,640', '-blur', '0x120', ')',
  '-compose', 'Multiply', '-composite', t('branches.png'));

// The cloud: ink = (1 − luminance) where the pixel is not sky; the sky itself is paper.
// That sky is nearly neutral: blue minus red is 0.04 in the open sky and negative in the cloud.
magick(CLOUD, '-resize', '900x', '-fx', 'u.b-u.r', '-level', '0.5%,3.5%', t('sky.png'));
magick(CLOUD, '-resize', '900x', '-colorspace', 'gray', '-negate', t('lum.png'));
// Padded with black before masking so the mask reaches zero inside the element's own bounds.
magick(t('lum.png'), t('sky.png'), '-fx', 'u[0]*(1-u[1])*0.85', '-posterize', '6', '-blur', '0x1.5',
  '-bordercolor', 'black', '-border', '220',
  '(', '+clone', '-fill', 'black', '-colorize', '100', '-fill', 'white', '-draw', 'ellipse 670,600 330,260 0,360', '-blur', '0x70', ')',
  '-compose', 'Multiply', '-composite', t('cloud.png'));

// Screen the densities together, bleed, grain, tint.
magick('-size', size, 'xc:black', t('ridge.png'), '-compose', 'Screen', '-composite',
  '(', t('cloud.png'), ')', '-geometry', '+440-160', '-compose', 'Screen', '-composite',
  '(', t('branches.png'), ')', '-geometry', '-80-60', '-compose', 'Screen', '-composite', t('density.png'));
magick(t('density.png'), '(', '+clone', '-morphology', 'Dilate', 'Disk:1.0', '-blur', '0x2.2', '-evaluate', 'multiply', '0.5', ')',
  '-compose', 'Screen', '-composite', '-negate', t('paper-neg.png'));
magick('-size', size, 'xc:gray50', '-seed', SEED, '-attenuate', '0.9', '+noise', 'Gaussian', '-colorspace', 'gray', '-blur', '0x0.5', '-level', '30%,70%', t('grain.png'));
magick(t('paper-neg.png'), t('grain.png'), '-compose', 'Overlay', '-define', 'compose:args=11', '-composite', '+level-colors', `${INK},${PAPER}`, t('cover.png'));

// Outputs: the sheet at two widths, and a portrait crop of the right half for phones.
magick(t('cover.png'), '-strip', '-define', 'webp:method=6', '-quality', '64', join(OUT, 'cover-1600.webp'));
magick(t('cover.png'), '-resize', '960x', '-strip', '-define', 'webp:method=6', '-quality', '66', join(OUT, 'cover-960.webp'));
magick(t('cover.png'), '-crop', '1000x1250+560+0', '+repage', '-resize', '720x', '-strip', '-define', 'webp:method=6', '-quality', '66', join(OUT, 'cover-phone.webp'));
magick(t('cover.png'), '-resize', '800x', join(tmp, 'preview.png'));
console.log(`wrote public/wash/cover-1600.webp, cover-960.webp, cover-phone.webp (preview at ${join(tmp, 'preview.png')})`);
if (process.env.KEEP_TMP !== '1') rmSync(tmp, { recursive: true, force: true });
else console.log(`kept ${tmp}`);
