/**
 * Post-build step: renders every route to static HTML and writes each one into
 * its own file, then emits the sitemap and llms.txt.
 *
 * Why this exists: the site is a client-rendered SPA, so without this the HTML
 * that leaves the server is an empty <div id="root">. Googlebot renders JS and
 * would eventually see the content, but Bing, DuckDuckGo, LinkedIn, Slack and
 * every LLM crawler read raw HTML only. Prerendering puts the real text in
 * front of all of them, and gives Google a first-pass index without waiting on
 * its render queue.
 *
 * Run by `npm run build` after `vite build` and `vite build --ssr`.
 */
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, structuredData, photographyStructuredData, ROUTES, site, photos } =
  await import(pathToFileURL(ssrEntry).href);

const lastModified = new Date().toISOString();
const lastModifiedDate = lastModified.slice(0, 10);

/** The built index.html is the shell every route is poured into. */
const shell = await readFile(path.join(distDir, 'index.html'), 'utf8');

if (!shell.includes('<div id="root"></div>')) {
  throw new Error('Could not find the empty #root container in dist/index.html.');
}
if (!shell.includes('<!--structured-data-->')) {
  throw new Error('Could not find the <!--structured-data--> placeholder in dist/index.html.');
}

const SCHEMA = { home: structuredData, photography: photographyStructuredData };

for (const route of ROUTES) {
  const appHtml = render(route.url);

  // A route that renders almost nothing means the router fell through to the
  // 404 — catching it here is the difference between shipping a broken page
  // and failing the build.
  const MIN = route.url === '/404' ? 150 : 900;
  if (!appHtml || appHtml.length < MIN) {
    throw new Error(
      `Prerender of ${route.url} produced suspiciously little markup ` +
      `(${appHtml?.length ?? 0} bytes, expected >= ${MIN}) — aborting.`
    );
  }

  let html = shell.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const schema = route.schema ? SCHEMA[route.schema] : null;
  html = html.replace(
    '<!--structured-data-->',
    schema
      ? `<script type="application/ld+json">${JSON.stringify(schema(lastModified)).replace(/</g, '\\u003c')}</script>`
      : ''
  );

  // Canonical must name this route, not the shell's.
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${site.origin}${route.url === '/' ? '/' : route.url}" />`
  );

  // The hiring pages are unlisted by design: reachable with the link, never
  // crawled. Belt and braces alongside robots.txt.
  if (!route.index) {
    html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n</head>');
  }

  const outPath = path.join(distDir, route.file);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log(`✓ ${route.url.padEnd(28)} → dist/${route.file} (${(appHtml.length / 1024).toFixed(1)} KB)`);
}

// ── Sitemap ──────────────────────────────────────────────────────────────────
// Only routes marked `index` appear. The photography page carries an
// <image:image> per photo — image sitemaps are the main lever for getting a
// gallery into Google Images.
const urls = ROUTES.filter((r) => r.index).map((r) => ({
  loc: `${site.origin}${r.url === '/' ? '/' : r.url}`,
  lastmod: lastModifiedDate,
  changefreq: r.url === '/' ? 'weekly' : 'monthly',
  priority: r.url === '/' ? '1.0' : r.url === '/work' ? '0.9' : '0.8',
  images:
    r.schema === 'photography'
      ? photos.map((p, i) => ({
          loc: `${site.origin}/photos/${p.slug}-800.webp`,
          title: p.alt || `Photograph ${i + 1} by ${site.name}`,
        }))
      : r.url === '/'
        ? [{ loc: site.ogImage, title: `${site.name} — ${site.jobTitle}` }]
        : [],
}));
urls.push({
  loc: `${site.origin}/resume.pdf`,
  lastmod: lastModifiedDate,
  changefreq: 'monthly',
  priority: '0.8',
  images: [],
});

const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.images
      .map(
        (img) => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${xmlEscape(img.title)}</image:title>
    </image:image>`
      )
      .join('')}
  </url>`
  )
  .join('\n')}
</urlset>
`;
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);

// ── llms.txt ─────────────────────────────────────────────────────────────────
const indexed = ROUTES.filter((r) => r.index && r.url !== '/');
const llms = `# ${site.name}

> ${site.shortDescription}

${site.bio}

## Links
- Portfolio: ${site.origin}/
${indexed.map((r) => `- ${r.url}: ${site.origin}${r.url}`).join('\n')}
- Resume (PDF): ${site.origin}/resume.pdf
- GitHub: ${site.profiles.github}
- LinkedIn: ${site.profiles.linkedin}
- KDE Invent: ${site.profiles.kde}
- Book a call: ${site.calendar}

Last updated: ${lastModifiedDate}
`;
await writeFile(path.join(distDir, 'llms.txt'), llms);

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });

const imageCount = urls.reduce((n, u) => n + u.images.length, 0);
console.log(`✓ sitemap.xml (${urls.length} urls, ${imageCount} images) and llms.txt`);
