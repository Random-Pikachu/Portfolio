/**
 * Screenshots of a running page through the local Chrome, for review.
 *
 *   node scripts/shot.mjs <url> <out.png> [--width 1280] [--height 800] [--dark]
 *        [--reduce] [--scroll <px>|<#hash>] [--wait <ms>] [--dpr 1] [--full]
 *        [--no-gl] [--eval <js>] [--after <ms>]
 *
 * --eval runs a script in the page after the load wait, and --after is how
 * long to wait after it before the capture (default 400 ms).
 *
 * Runs on a machine with Chrome, never on Vercel. WebGL is rendered in
 * software (SwiftShader) so the sky's scene appears in the capture.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const url = args[0];
const out = args[1];
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);
if (!url || !out) {
  console.error('usage: node scripts/shot.mjs <url> <out.png> [--width W] [--height H] [--dark] [--reduce] [--scroll N|#id] [--wait ms] [--dpr N] [--full] [--no-gl]');
  process.exit(1);
}
const width = Number(opt('width', 1280));
const height = Number(opt('height', 800));
const dpr = Number(opt('dpr', 1));
const wait = Number(opt('wait', 1500));
const scroll = opt('scroll', null);

const tmp = mkdtempSync(join(tmpdir(), 'shot-'));
const port = 9400 + Math.floor(Math.random() * 400);
const chromeArgs = [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--remote-allow-origins=*',
  `--user-data-dir=${join(tmp, 'profile')}`,
  '--no-first-run',
  '--hide-scrollbars',
  `--window-size=${width},${height}`,
  ...(flag('no-gl') ? ['--disable-gpu'] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']),
  'about:blank',
];
const chrome = spawn('google-chrome', chromeArgs, { stdio: 'ignore' });
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
const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
const logs = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  } else if (d.method === 'Runtime.consoleAPICalled') {
    logs.push(`${d.params.type}: ${d.params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
  } else if (d.method === 'Runtime.exceptionThrown') {
    logs.push(`exception: ${d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text}`);
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
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: dpr, mobile: width < 768 });
if (flag('reduce')) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `try { localStorage.theme = ${JSON.stringify(flag('dark') ? 'dark' : 'light')}; } catch (_) {}`,
});
await send('Page.navigate', { url });
await sleep(wait);
if (scroll) {
  const expr = scroll.startsWith('#')
    ? `(() => { const el = document.querySelector(${JSON.stringify(scroll)}); if (el) { location.hash = ${JSON.stringify(scroll)}; } })()`
    : `window.scrollTo({ top: ${Number(scroll)}, behavior: 'instant' })`;
  await send('Runtime.evaluate', { expression: expr });
  await sleep(Math.max(900, wait / 2));
}
const js = opt('eval', null);
if (js) {
  await send('Runtime.evaluate', { expression: js, awaitPromise: true });
  await sleep(Number(opt('after', 400)));
}
const shot = flag('full') ? { format: 'png', captureBeyondViewport: true } : { format: 'png' };
if (flag('full')) {
  const { result } = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true });
  await send('Emulation.setDeviceMetricsOverride', { width, height: result.value, deviceScaleFactor: dpr, mobile: false });
  await sleep(300);
}
const { data } = await send('Page.captureScreenshot', shot);
writeFileSync(out, Buffer.from(data, 'base64'));
console.log(`wrote ${out}`);
if (logs.length) console.log(logs.join('\n'));
ws.close();
chrome.kill();
rmSync(tmp, { recursive: true, force: true });
