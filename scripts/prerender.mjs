/**
 * Post-build step: renders each page to static HTML and bakes it into its
 * dist/*.html shell, then emits the sitemap and llms.txt.
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

const {
  render,
  renderPhotography,
  structuredData,
  photographyStructuredData,
  site,
  sections,
  photos,
} = await import(pathToFileURL(ssrEntry).href);

const lastModified = new Date().toISOString();
const lastModifiedDate = lastModified.slice(0, 10);

/** Each page: which shell to fill, what to render into it, what schema to inject. */
const PAGES = [
  { file: 'index.html', render, schema: structuredData, minBytes: 2000, label: '/' },
  {
    file: 'photography.html',
    render: renderPhotography,
    schema: photographyStructuredData,
    minBytes: 1500,
    label: '/photography',
  },
];

for (const page of PAGES) {
  const appHtml = page.render();
  if (!appHtml || appHtml.length < page.minBytes) {
    throw new Error(
      `Prerender of ${page.label} produced suspiciously little markup ` +
      `(${appHtml.length} bytes, expected >= ${page.minBytes}) — aborting.`
    );
  }

  const filePath = path.join(distDir, page.file);
  let html = await readFile(filePath, 'utf8');

  if (!html.includes('<div id="root"></div>')) {
    throw new Error(`Could not find the empty #root container in dist/${page.file}.`);
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (!html.includes('<!--structured-data-->')) {
    throw new Error(`Could not find the <!--structured-data--> placeholder in dist/${page.file}.`);
  }
  const jsonLd = JSON.stringify(page.schema(lastModified));
  html = html.replace(
    '<!--structured-data-->',
    `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>`
  );

  await writeFile(filePath, html);
  console.log(`✓ prerendered ${(appHtml.length / 1024).toFixed(1)} KB into dist/${page.file}`);
}

// ── Sitemap ──────────────────────────────────────────────────────────────────
// Section anchors are advertised through the JSON-LD `hasPart` list rather than
// as separate sitemap entries, because fragments are not distinct URLs. The
// photography page carries an <image:image> per photo — image sitemaps are the
// main lever for getting a gallery into Google Images.
const urls = [
  {
    loc: `${site.origin}/`,
    lastmod: lastModifiedDate,
    changefreq: 'weekly',
    priority: '1.0',
    images: [{ loc: site.ogImage, title: `${site.name} — ${site.jobTitle}` }],
  },
  {
    loc: `${site.origin}/photography`,
    lastmod: lastModifiedDate,
    changefreq: 'monthly',
    priority: '0.8',
    images: photos.map((p, i) => ({
      loc: `${site.origin}/photos/${p.slug}-800.webp`,
      title: p.alt || `Photograph ${i + 1} by ${site.name}`,
    })),
  },
  {
    loc: `${site.origin}/resume.pdf`,
    lastmod: lastModifiedDate,
    changefreq: 'monthly',
    priority: '0.8',
  },
];

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
    <priority>${u.priority}</priority>${(u.images ?? [])
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
const llms = `# ${site.name}

> ${site.shortDescription}

${site.bio}

## Links
- Portfolio: ${site.origin}/
- Photography: ${site.origin}/photography (${photos.length} photos)
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

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });

const imageCount = urls.reduce((n, u) => n + (u.images?.length ?? 0), 0);
console.log(
  `✓ wrote sitemap.xml (${urls.length} urls, ${imageCount} images) and llms.txt`
);
