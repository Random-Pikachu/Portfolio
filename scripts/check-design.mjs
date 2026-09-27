/**
 * Design checks that run before every build.
 *
 *   1. No radius anywhere in the sources: no `rounded-*` utility except
 *      rounded-none, no `border-radius` other than the global reset.
 *   2. Every text token in src/tokens.css clears WCAG 2 AA (4.5:1) against
 *      both grounds, the paper and the card, in both modes.
 *   3. Every plate in src/data/art.ts has its outputs in public/art, so a
 *      slot never ships empty.
 *   4. The scene (src/sky/scene.ts) is imported only by the sky layer, and
 *      dynamically, so it stays out of the prerender and the first script.
 *
 * Exit code 1 on any failure, so `npm run build` stops.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
let failures = 0;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(css|tsx?|html)$/.test(name)) out.push(p);
  }
  return out;
}

// ── 1. radius ──────────────────────────────────────────────────────────────
const radiusUtility = /\brounded(?:-(?!none\b)[a-z0-9\[\]\.\/]+\b|\b(?!-))/g;
const radiusProp = /border-radius\s*:(?!\s*0\s*(?:!important)?\s*;)/g;
for (const file of walk(src)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('no radius')) return;
    const hits = [...line.matchAll(radiusUtility), ...line.matchAll(radiusProp)];
    if (hits.length) {
      failures++;
      console.error(`radius: ${relative(root, file)}:${i + 1}: ${line.trim()}`);
    }
  });
}

// ── 2. contrast ────────────────────────────────────────────────────────────
const tokens = readFileSync(join(src, 'tokens.css'), 'utf8');
const block = (selector) => {
  const start = tokens.indexOf(`${selector} {`);
  const end = tokens.indexOf('}', start);
  const vars = {};
  for (const m of tokens.slice(start, end).matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) vars[m[1]] = m[2].toLowerCase();
  return vars;
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const TEXT = ['ink', 'ink-2', 'ink-3', 'accent'];
for (const [mode, vars] of [['paper', block(':root')], ['night', block(':root.dark')]]) {
  const rows = TEXT.map((t) => [t, vars[t], ratio(vars[t], vars.paper)])
    .concat(TEXT.map((t) => [`${t} on paper-card`, vars[t], ratio(vars[t], vars['paper-card'])]))
    .concat([['accent-ink on accent', vars['accent-ink'], ratio(vars['accent-ink'], vars.accent)]]);
  for (const [name, hex, r] of rows) {
    const ok = r >= 4.5;
    if (!ok) failures++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${mode.padEnd(6)} ${name.padEnd(22)} ${hex}  ${r.toFixed(2)}:1`);
  }
}

// ── 3. plates ──────────────────────────────────────────────────────────────
const { ART } = await import(pathToFileURL(join(src, 'data', 'art.ts')).href);
for (const slot of Object.values(ART)) {
  const files = [...slot.widths.map((w) => `${slot.id}-${w}.webp`), ...(slot.phone ? [`${slot.id}-phone.webp`] : [])];
  for (const f of files) {
    if (!existsSync(join(root, 'public', 'art', f))) {
      failures++;
      console.error(`plate: public/art/${f} is missing; run npm run art`);
    }
  }
}

// ── 4. the scene stays lazy ────────────────────────────────────────────────
for (const file of walk(src)) {
  const text = readFileSync(file, 'utf8');
  const rel = relative(root, file);
  if (rel === 'src/sky/scene.ts' || rel === 'src/sky/SkyLayer.tsx') continue;
  if (/from\s+['"][^'"]*\/scene['"]/.test(text) || /import\(['"][^'"]*\/scene['"]\)/.test(text)) {
    failures++;
    console.error(`scene: ${rel} imports the scene; only src/sky/SkyLayer.tsx may, dynamically`);
  }
}
{
  const layer = readFileSync(join(src, 'sky', 'SkyLayer.tsx'), 'utf8');
  if (/^import[^;]*from\s+['"]\.\/scene['"]/m.test(layer.replace(/import type[^;]*;/g, ''))) {
    failures++;
    console.error('scene: src/sky/SkyLayer.tsx must import ./scene dynamically, not statically');
  }
}

if (failures) {
  console.error(`\n${failures} design check failure(s).`);
  process.exit(1);
}
console.log('\ndesign checks passed');
