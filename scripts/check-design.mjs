/**
 * Design checks that run before every build.
 *
 *   1. No radius anywhere in the sources: no `rounded-*` utility except
 *      rounded-none, no `border-radius` other than the global reset.
 *   2. Every text token in src/tokens.css clears WCAG 2 AA (4.5:1) on the
 *      night ground and on both pine surfaces, and ember ink clears it on
 *      ember. The site is dark only, so there is one ramp to measure.
 *   3. No em dash (U+2014) in any copy, comment or content: sources, content,
 *      the HTML shells, the public text files and the README.
 *   4. No lorem ipsum. Missing content is left visibly empty, never filled.
 *
 * Exit code 1 on any failure, so `npm run build` stops.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
let failures = 0;

function walk(dir, test, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, test, out);
    else if (test.test(name)) out.push(p);
  }
  return out;
}

const code = walk(src, /\.(css|tsx?|html)$/);

// ── 1. radius ──────────────────────────────────────────────────────────────
const radiusUtility = /\brounded(?:-(?!none\b)[a-z0-9\[\]\.\/]+\b|\b(?!-))/g;
const radiusProp = /border-radius\s*:(?!\s*0\s*(?:!important)?\s*;)/g;
for (const file of code) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (line.includes('no radius')) return;
      if ([...line.matchAll(radiusUtility), ...line.matchAll(radiusProp)].length) {
        failures++;
        console.error(`radius: ${relative(root, file)}:${i + 1}: ${line.trim()}`);
      }
    });
}

// ── 2. contrast ────────────────────────────────────────────────────────────
const tokens = readFileSync(join(src, 'tokens.css'), 'utf8');
const start = tokens.indexOf(':root {');
const vars = {};
for (const m of tokens.slice(start, tokens.indexOf('}', start)).matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) vars[m[1]] = m[2].toLowerCase();
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const TEXT = ['starlight', 'sage', 'sage-2', 'ember'];
const GROUNDS = ['night', 'pine', 'pine-2'];
const rows = GROUNDS.flatMap((g) => TEXT.map((t) => [`${t} on ${g}`, vars[t], vars[g]])).concat([['ember-ink on ember', vars['ember-ink'], vars.ember]]);
for (const [name, fg, bg] of rows) {
  if (!fg || !bg) {
    failures++;
    console.error(`contrast: ${name}: token missing from :root in src/tokens.css`);
    continue;
  }
  const r = ratio(fg, bg);
  const ok = r >= 4.5;
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(22)} ${fg} on ${bg}  ${r.toFixed(2)}:1`);
}

// ── 3 and 4. em dashes and lorem ipsum ─────────────────────────────────────
const text = [
  ...code,
  ...walk(join(root, 'scripts'), /\.(mjs|js)$/),
  ...walk(join(root, 'content'), /\.md$/),
  ...['index.html', 'photography.html', 'blog.html', 'work.html', 'README.md', 'vercel.json'].map((f) => join(root, f)),
  ...['robots.txt', 'site.webmanifest'].map((f) => join(root, 'public', f)),
].filter((f) => existsSync(f));
const EM_DASH = String.fromCharCode(0x2014);
for (const file of text) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (line.includes(EM_DASH)) {
        failures++;
        console.error(`em dash: ${relative(root, file)}:${i + 1}: ${line.trim()}`);
      }
      if (/lorem ipsum/i.test(line) && !file.endsWith('check-design.mjs')) {
        failures++;
        console.error(`lorem ipsum: ${relative(root, file)}:${i + 1}: ${line.trim()}`);
      }
    });
}

if (failures) {
  console.error(`\n${failures} design check failure(s).`);
  process.exit(1);
}
console.log('\ndesign checks passed');
