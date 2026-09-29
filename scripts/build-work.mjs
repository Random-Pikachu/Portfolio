/**
 * Cuts the project banners from the composed screenshots in design/shots and
 * writes WebP at two widths into public/work. Run with `npm run work`; the
 * output is committed. Needs ImageMagick 7 (`magick`) on the PATH.
 *
 * Every banner is emitted at 1600 and 960 wide, both lightly sharpened after
 * the resize, so the card's <img srcset> can pick the smaller file on a laptop
 * and the larger on a wide desktop. The sources are 4:3; the card crops them
 * to its own ratio with object-fit, so nothing is cropped here.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'design/shots');
const OUT = resolve(ROOT, 'public/work');
const WIDTHS = [1600, 960];
const QUALITY = 74;

mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(SRC).sort()) {
  if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
  const id = basename(file, extname(file));
  for (const width of WIDTHS) {
    const out = resolve(OUT, `${id}-${width}.webp`);
    execFileSync('magick', [
      resolve(SRC, file),
      '-resize', `${width}x>`,
      '-unsharp', '0x0.6+0.5+0.02',
      '-strip',
      '-quality', String(QUALITY),
      out,
    ]);
    console.log(`wrote ${id}-${width}.webp`);
  }
}
