/**
 * The ink-density maps the cover wash and the night plates are built from:
 * three of the site's own photographs, each keyed into a map where white is
 * ink. Shared by build-wash.mjs (ink on paper) and build-art.mjs (paper on
 * the night). Needs ImageMagick 7 (`magick`).
 */
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PHOTOS = join(ROOT, 'public', 'photos');
export const W = 1600;
export const H = 1200;
export const SIZE = `${W}x${H}`;
export const PAPER = '#f3f0e8';
export const INK = '#161616';
export const SEED = '25';

export const magick = (...args) => execFileSync('magick', args, { stdio: ['ignore', 'inherit', 'inherit'] });

const src = (slug) => join(PHOTOS, `${slug}-1600.webp`);
export const BRANCHES = src('pxl-20240427-193502936-night');
export const CLOUD = src('img-20240903-160828459');
export const RIDGE = src('img-20260721-182117987');

/**
 * Writes ridge.png, branches.png and cloud.png into `tmp` and returns their
 * paths with the offsets they are composed at on the 1600×1200 sheet.
 */
export function densities(tmp) {
  const t = (name) => join(tmp, name);

  // The ridge: the treeline keyed from daylight foliage, blurred and posterised
  // into wash rather than canopy, fading into mist below and toward the
  // branches on the left, so it sits under the cloud on the right two thirds.
  magick(RIDGE, '-resize', `${W}x`, '-colorspace', 'gray', '-level', '12%,58%', '-negate', '-blur', '0x5', '-posterize', '3', t('ridge-raw.png'));
  magick('-size', SIZE, 'xc:', '-sparse-color', 'barycentric', '0,600 white 0,900 black', '-colorspace', 'gray', t('ridge-fade.png'));
  magick('-size', SIZE, 'xc:', '-sparse-color', 'barycentric', '150,0 black 820,0 white', '-colorspace', 'gray', t('ridge-side.png'));
  magick('-size', SIZE, 'xc:black', t('ridge-raw.png'), '-geometry', '+0+300', '-compose', 'Over', '-composite',
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

  return {
    ridge: { file: t('ridge.png'), offset: '+0+0' },
    cloud: { file: t('cloud.png'), offset: '+440-160' },
    branches: { file: t('branches.png'), offset: '-80-60' },
  };
}

/** The seeded grain at the sheet's size, mid-grey on average. */
export function grain(tmp, size = SIZE) {
  const out = join(tmp, `grain-${size}.png`);
  magick('-size', size, 'xc:gray50', '-seed', SEED, '-attenuate', '0.9', '+noise', 'Gaussian', '-colorspace', 'gray', '-blur', '0x0.5', '-level', '30%,70%', out);
  return out;
}
