/**
 * Post-build step: renders the app to static HTML and bakes it into dist/index.html,
 * then emits the sitemap.
 *
 * Why this exists: the site is a client-rendered SPA, so without this the HTML
 * that leaves the server is an empty <div id="root">. Googlebot renders JS and
 * would eventually see the content, but Bing, DuckDuckGo, LinkedIn, Slack and
 * every LLM crawler read the raw HTML only. Prerendering puts the real text in
 * front of all of them, and gives Google a first-pass index without waiting on
 * its render queue.
 *
 * Run by `npm run build` after `vite build` and `vite build --ssr`.
 */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, structuredData, site, sections } = await import(pathToFileURL(ssrEntry).href);

const lastModified = new Date().toISOString();
const lastModifiedDate = lastModified.slice(0, 10);

// ── 1. Render the app ────────────────────────────────────────────────────────
const appHtml = render();
if (!appHtml || appHtml.length < 2000) {
  throw new Error(`Prerender produced suspiciously little markup (${appHtml.length} bytes) — aborting.`);
}

// ── 2. Inject into the built shell ───────────────────────────────────────────
const indexPath = path.join(distDir, 'index.html');
let html = await readFile(indexPath, 'utf8');

if (!html.includes('<div id="root"></div>')) {
  throw new Error('Could not find the empty #root container in dist/index.html.');
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

const jsonLd = JSON.stringify(structuredData(lastModified));
if (!html.includes('<!--structured-data-->')) {
  throw new Error('Could not find the <!--structured-data--> placeholder in dist/index.html.');
}
html = html.replace(
  '<!--structured-data-->',
  `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>`
);

await writeFile(indexPath, html);

// ── 3. Sitemap ───────────────────────────────────────────────────────────────
// One canonical URL plus the resume, which is a real indexable document and a
// common landing point for name searches. Section anchors are advertised through
// the JSON-LD `hasPart` list rather than as separate sitemap entries, because
// fragments are not distinct URLs.
const urls = [
  {
    loc: `${site.origin}/`,
    lastmod: lastModifiedDate,
    changefreq: 'weekly',
    priority: '1.0',
    image: { loc: site.ogImage, title: `${site.name} — ${site.jobTitle}` },
  },
  {
    loc: `${site.origin}/resume.pdf`,
    lastmod: lastModifiedDate,
    changefreq: 'monthly',
    priority: '0.8',
  },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.image
        ? `
    <image:image>
      <image:loc>${u.image.loc}</image:loc>
      <image:title>${u.image.title}</image:title>
    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>
`;
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);

// ── 4. llms.txt ──────────────────────────────────────────────────────────────
// Plain-text summary for LLM crawlers and answer engines, which increasingly
// drive "who is <name>" style discovery and do not execute JavaScript.
const llms = `# ${site.name}

> ${site.shortDescription}

${site.bio}

## Links
- Portfolio: ${site.origin}/
- Resume (PDF): ${site.origin}/resume.pdf
- GitHub: ${site.profiles.github}
- LinkedIn: ${site.profiles.linkedin}
- KDE Invent: ${site.profiles.kde}
- Book a call: ${site.calendar}

## Page sections
${sections.map((s) => `- [${s.heading}](${site.origin}/#${s.id})`).join('\n')}

Last updated: ${lastModifiedDate}
`;
await writeFile(path.join(distDir, 'llms.txt'), llms);

// ── 5. Clean up the SSR bundle so it never ships ─────────────────────────────
await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(
  `✓ prerendered ${(appHtml.length / 1024).toFixed(1)} KB of markup into dist/index.html\n` +
  `✓ wrote sitemap.xml (${urls.length} urls) and llms.txt`
);
