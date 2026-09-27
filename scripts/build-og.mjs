/**
 * Social cards, 1200 by 630, one per page, rendered from the site's own
 * build: the OgCard in src/og is prerendered through the SSR bundle, served
 * with the built stylesheet (so the Nightscape, the fonts and the grain are
 * the real ones), and captured with the local Chrome as JPEG, since grain
 * and PNG make a megabyte. Runs on a machine that has Chrome, not on
 * Vercel; the files are committed like the photos.
 *
 *   public/og.jpg                 the home page (referenced by index.html)
 *   public/og/survey.jpg          /photography
 *   public/og/notes.jpg           /blog, once a note exists
 *   public/og/note-<slug>.jpg     each note in content/blog
 *   public/og/work-<slug>.jpg     each published case study
 *
 * Run `npm run build` first, then `npm run og`, then commit the cards; the
 * next build ships them. The prerender uses a page's card when it exists
 * and the home card otherwise.
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SSR = join(ROOT, 'dist-ssr');
const OUT = join(ROOT, 'public', 'og');
mkdirSync(OUT, { recursive: true });

if (!existsSync(join(DIST, 'assets'))) {
  console.error('dist/assets is missing; run `npm run build` first.');
  process.exit(1);
}
execFileSync('npx', ['vite', 'build', '--ssr', 'src/entry-server.tsx', '--outDir', 'dist-ssr'], { cwd: ROOT, stdio: 'ignore' });
const { renderOg, ogCards } = await import(pathToFileURL(join(SSR, 'entry-server.js')).href);

// ── the cards as pages, served beside the built assets ─────────────────────
const sheets = readdirSync(join(DIST, 'assets'))
  .filter((f) => f.endsWith('.css'))
  .map((f) => `<link rel="stylesheet" href="/assets/${f}">`)
  .join('');
const page = (card) =>
  `<!doctype html><html lang="en" class="js"><head><meta charset="utf-8">${sheets}<style>html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#0a0e0c}</style></head><body>${renderOg(card)}</body></html>`;
const pages = new Map(ogCards.map((c) => [`/__og/${c.key}.html`, page(c)]));
const TYPES = { '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.html': 'text/html' };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (pages.has(url)) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(pages.get(url));
    return;
  }
  const file = join(DIST, url);
  if (file.startsWith(DIST) && existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
    return;
  }
  res.writeHead(404);
  res.end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

// ── Chrome ─────────────────────────────────────────────────────────────────
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(
  'google-chrome',
  ['--headless=new', `--remote-debugging-port=${port}`, '--remote-allow-origins=*', `--user-data-dir=${join(tmp, 'profile')}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', '--window-size=1200,630', 'about:blank'],
  { stdio: 'ignore' }
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = false;
for (let i = 0; i < 60 && !ok; i++) {
  try {
    await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    ok = true;
  } catch {
    await sleep(200);
  }
}
if (!ok) {
  chrome.kill();
  throw new Error('Chrome did not start');
}
const target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

for (const c of ogCards) {
  const out = c.key === 'cover' ? join(ROOT, 'public', 'og.jpg') : join(OUT, `${c.key}.jpg`);
  await send('Page.navigate', { url: `${origin}/__og/${c.key}.html` });
  await sleep(400);
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
  await sleep(200);
  const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log(`wrote ${out.replace(ROOT + '/', '')}`);
}

ws.close();
chrome.kill();
server.close();
rmSync(tmp, { recursive: true, force: true });
rmSync(SSR, { recursive: true, force: true });
