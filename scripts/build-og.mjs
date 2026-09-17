/**
 * Social cards, 1200×630, one per page: the sheet's title block over the
 * paper with the ten faint columns, the page's title in Zodiak, and on the
 * cover the wash. Rendered with the local Chrome through the DevTools
 * protocol, so this runs on a machine that has Chrome, not on Vercel; the
 * PNGs are committed like the banners.
 *
 *   public/og.png                 the cover (referenced by index.html)
 *   public/og/survey.png          /photography
 *   public/og/notes.png           /blog
 *   public/og/note-<slug>.png     each note in content/blog
 *   public/og/work-<slug>.png     each published detail sheet
 *
 * Run: npm run og. The prerender uses a page's card when it exists and the
 * cover card otherwise.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import matter from 'gray-matter';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og');
mkdirSync(OUT, { recursive: true });

const NAME = 'Sangam Pratap Singh';
const NO = '025';
const PLACE = 'Gwalior 26°13′ N 78°10′ E';

// ── the moon, the same low-precision series the site uses ─────────────────
const D2R = Math.PI / 180;
const norm = (a) => ((a % 360) + 360) % 360;
const sin = (d) => Math.sin(d * D2R);
function moon(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  const T = n / 36525;
  const sunL = norm(norm(280.46 + 0.9856474 * n) + 1.915 * sin(norm(357.528 + 0.9856003 * n)) + 0.02 * sin(2 * norm(357.528 + 0.9856003 * n)));
  const Lp = norm(218.3164477 + 481267.88123421 * T), D = norm(297.8501921 + 445267.1114034 * T), M = norm(357.5291092 + 35999.0502909 * T), Mp = norm(134.9633964 + 477198.8675055 * T), F = norm(93.272095 + 483202.0175233 * T);
  const moonL = norm(Lp + 6.288774 * sin(Mp) + 1.274027 * sin(2 * D - Mp) + 0.658314 * sin(2 * D) + 0.213618 * sin(2 * Mp) - 0.185116 * sin(M) - 0.114332 * sin(2 * F));
  const e = norm(moonL - sunL);
  const k = (1 - Math.cos(e * D2R)) / 2;
  const waxing = e < 180;
  const r = 10, rx = (r * Math.abs(2 * k - 1)).toFixed(3), sweep = k > 0.5 ? 1 : 0;
  const right = `M0,-${r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${sweep} 0,-${r} Z`;
  return waxing ? right : right.replace('0 0 1 0', '0 0 0 0').replace(`0 0 ${sweep} 0`, `0 0 ${1 - sweep} 0`);
}
const now = new Date();
const rev = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: '2-digit' }).format(now).replace(/\//g, '.');
const moonPath = moon(now);

// ── cards ──────────────────────────────────────────────────────────────────
const read = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith('_')).map((f) => ({ slug: basename(f, '.md'), ...matter(readFileSync(join(dir, f), 'utf8')) })) : []);
const notes = read(join(ROOT, 'content', 'blog')).filter((n) => n.data.draft !== true);
const work = read(join(ROOT, 'content', 'work')).filter((w) => w.data.published === true);
const site = readFileSync(join(ROOT, 'src', 'data', 'site.ts'), 'utf8');
const titleOf = (slug) => (site.match(new RegExp(`slug: '${slug}',\\s*title: '([^']+)'`)) || [])[1] ?? slug;
const summaryOf = (slug) => (site.match(new RegExp(`slug: '${slug}',\\s*title: '[^']+',\\s*summary: '([^']+)'`)) || [])[1] ?? '';

const cards = [
  { out: join(ROOT, 'public', 'og.png'), sheet: 'Sheet 00/04', block: 'Cover', title: NAME, sub: 'I build full-stack and systems software. Legal tech at Retsguide by day, KDE Plasma patches by night.', wash: true },
  { out: join(OUT, 'survey.png'), sheet: 'Survey', block: 'Photography', title: 'Photography', sub: 'Twenty-seven frames from a Nothing Phone (1), mostly while walking somewhere else.' },
  { out: join(OUT, 'notes.png'), sheet: 'Notes', block: `${notes.length} issued`, title: 'Notes', sub: 'Writing, in Markdown, with code.' },
  ...notes.map((n) => ({ out: join(OUT, `note-${n.slug}.png`), sheet: 'Note', block: 'Notes', title: String(n.data.title ?? n.slug), sub: String(n.data.summary ?? '') })),
  ...work.map((w) => ({ out: join(OUT, `work-${w.slug}.png`), sheet: 'Detail', block: 'Details', title: titleOf(w.slug), sub: summaryOf(w.slug) })),
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const font = (p) => pathToFileURL(p).href;
const fonts = {
  zodiak: font(join(ROOT, 'src', 'fonts', 'zodiak', 'zodiak-400.woff2')),
  sans: font(join(ROOT, 'node_modules', '@fontsource-variable', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-wght-normal.woff2')),
  mono: font(join(ROOT, 'node_modules', '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-400-normal.woff2')),
};
const wash = font(join(ROOT, 'public', 'wash', 'cover-960.webp'));

const html = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Zodiak;src:url("${fonts.zodiak}") format("woff2")}
@font-face{font-family:Plex;src:url("${fonts.sans}") format("woff2");font-weight:100 900}
@font-face{font-family:PlexMono;src:url("${fonts.mono}") format("woff2")}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f3f0e8;color:#161616;font-family:Plex,sans-serif}
.grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(10,1fr);padding:0 64px}
.grid i{border-left:1px solid #d6d2c8;opacity:.45}
.rule{position:absolute;left:64px;right:64px;top:56px;height:1px;background:#d6d2c8}
.head{position:absolute;left:64px;right:64px;top:70px;display:flex;justify-content:space-between;font-family:PlexMono;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#6b6963}
.head b{color:#161616;font-weight:400}
.title{position:absolute;left:64px;top:150px;width:${c.wash ? 560 : 1000}px;font-family:Zodiak;font-size:${c.title.length > 26 ? 64 : 92}px;line-height:.98;letter-spacing:-.015em}
.sub{position:absolute;left:64px;top:${c.title.length > 26 ? 380 : 360}px;width:${c.wash ? 520 : 760}px;font-size:24px;line-height:1.45;color:#4a4844}
.wash{position:absolute;right:64px;top:110px;width:480px;height:360px;object-fit:cover;object-position:60% 40%;border:1px solid #c4bfb3}
.tb{position:absolute;right:64px;bottom:48px;display:grid;grid-template-columns:auto auto auto;border:1px solid #c4bfb3;background:#f3f0e8;font-family:PlexMono;font-size:13px;line-height:1.5;letter-spacing:.06em;color:#6b6963}
.tb div{padding:10px 14px;border-right:1px solid #c4bfb3;white-space:nowrap}
.tb div:nth-child(3){border-right:0}
.tb b{display:flex;align-items:center;gap:8px;color:#161616;font-weight:400;text-transform:uppercase;letter-spacing:.1em}
.tb .foot{grid-column:1/-1;border-top:1px solid #c4bfb3;border-right:0;display:flex;gap:18px}
</style></head><body>
<div class="grid">${'<i></i>'.repeat(10)}</div>
<div class="rule"></div>
<div class="head"><span><b>${esc(c.sheet)}</b> · ${esc(c.block)}</span><span>${esc(PLACE)}</span></div>
<div class="title">${esc(c.title)}</div>
<div class="sub">${esc(c.sub)}</div>
${c.wash ? `<img class="wash" src="${wash}">` : ''}
<div class="tb"><div><b>${esc(NAME)}</b><span>Drawing No. ${NO}</span></div><div><b>${esc(c.sheet)}</b><span>${esc(c.block)}</span></div><div><b>Rev <svg width="13" height="13" viewBox="-11 -11 22 22"><circle r="10" fill="none" stroke="#161616" stroke-width="1.2"/><path d="${moonPath}" fill="#161616"/></svg></b><span>${rev}</span></div><div class="foot"><span>${esc(PLACE)}</span><span>Scale ${c.wash ? 'NTS' : '1:1'}</span></div></div>
</body></html>`;

// ── Chrome ─────────────────────────────────────────────────────────────────
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn('google-chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--remote-allow-origins=*', `--user-data-dir=${join(tmp, 'profile')}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', '--window-size=1200,630', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = false;
for (let i = 0; i < 60 && !ok; i++) { try { await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); ok = true; } catch { await sleep(200); } }
if (!ok) { chrome.kill(); throw new Error('Chrome did not start'); }
const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
for (const c of cards) {
  const file = join(tmp, `${basename(c.out, '.png')}.html`);
  writeFileSync(file, html(c));
  await send('Page.navigate', { url: pathToFileURL(file).href });
  await sleep(900);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(c.out, Buffer.from(data, 'base64'));
  console.log(`wrote ${c.out.replace(ROOT + '/', '')}`);
}
ws.close();
chrome.kill();
rmSync(tmp, { recursive: true, force: true });
