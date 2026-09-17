/**
 * Post-build step: renders every page to static HTML and bakes it into its
 * shell, then emits the sitemap and llms.txt.
 *
 * Why this exists: the site is a client-rendered SPA, so without this the HTML
 * that leaves the server is an empty <div id="root">. Googlebot renders JS and
 * would eventually see the content, but Bing, DuckDuckGo, LinkedIn, Slack and
 * every LLM crawler read the raw HTML only. Prerendering puts the real text in
 * front of all of them, and gives Google a first-pass index without waiting on
 * its render queue.
 *
 * Pages: / and /photography have their own shells with static heads. /blog,
 * /blog/<slug> and /work/<slug> share the blog.html and work.html shells and
 * get their title, description, canonical and social tags injected here.
 *
 * Run by `npm run build` after `vite build` and `vite build --ssr`.
 */
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const {
  render,
  renderPhotography,
  renderBlog,
  renderWork,
  structuredData,
  photographyStructuredData,
  notesStructuredData,
  noteStructuredData,
  workStructuredData,
  site,
  sections,
  photos,
  notes,
  publishedWork,
} = await import(pathToFileURL(ssrEntry).href);

const lastModified = new Date().toISOString();
const lastModifiedDate = lastModified.slice(0, 10);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The head block for pages that share a shell. */
const head = ({ title, description, canonical, type = 'website', image = site.ogImage, published }) => `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="${esc(site.name)}" />
  <meta property="og:locale" content="${site.locale}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  ${published ? `<meta property="article:published_time" content="${published}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image}" />`;

/** Each page: which shell to fill, what to render into it, what schema to inject. */
const PAGES = [
  { shell: 'index.html', out: 'index.html', render, schema: structuredData, minBytes: 2000, label: '/' },
  {
    shell: 'photography.html',
    out: 'photography.html',
    render: renderPhotography,
    schema: photographyStructuredData,
    minBytes: 1500,
    label: '/photography',
  },
  {
    shell: 'blog.html',
    out: 'blog.html',
    render: () => renderBlog('/blog'),
    schema: notesStructuredData,
    minBytes: 1000,
    label: '/blog',
    head: head({
      title: `Notes — ${site.name}`,
      description: `Notes by ${site.name} on software, systems and the things built along the way.`,
      canonical: `${site.origin}/blog`,
    }),
  },
  ...notes.map((n) => ({
    shell: 'blog.html',
    out: path.join('blog', `${n.slug}.html`),
    render: () => renderBlog(`/blog/${n.slug}`),
    schema: (lm) => noteStructuredData(n.slug, lm),
    minBytes: 1000,
    label: `/blog/${n.slug}`,
    head: head({
      title: `${n.title} — Notes — ${site.name}`,
      description: n.summary || `A note by ${site.name}.`,
      canonical: `${site.origin}/blog/${n.slug}`,
      type: 'article',
      published: n.date,
    }),
  })),
  ...publishedWork.map((w) => ({
    shell: 'work.html',
    out: path.join('work', `${w.slug}.html`),
    render: () => renderWork(`/work/${w.slug}`),
    schema: (lm) => workStructuredData(w.slug, lm),
    minBytes: 1000,
    label: `/work/${w.slug}`,
    head: head({
      title: `${w.title} — Detail sheet — ${site.name}`,
      description: w.summary,
      canonical: `${site.origin}/work/${w.slug}`,
      type: 'article',
      image: w.image ? `${site.origin}/work/${w.image}-1600.webp` : site.ogImage,
    }),
  })),
];

const shells = new Map();
for (const page of PAGES) {
  if (!shells.has(page.shell)) shells.set(page.shell, await readFile(path.join(distDir, page.shell), 'utf8'));
  const appHtml = page.render();
  if (!appHtml || appHtml.length < page.minBytes) {
    throw new Error(`Prerender of ${page.label} produced suspiciously little markup (${appHtml.length} bytes, expected >= ${page.minBytes}) — aborting.`);
  }
  let html = shells.get(page.shell);
  if (!html.includes('<div id="root"></div>')) throw new Error(`Could not find the empty #root container in dist/${page.shell}.`);
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  if (!html.includes('<!--structured-data-->')) throw new Error(`Could not find the <!--structured-data--> placeholder in dist/${page.shell}.`);
  const jsonLd = JSON.stringify(page.schema(lastModified));
  html = html.replace('<!--structured-data-->', `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>`);
  if (page.head) {
    if (!html.includes('<!--page-head-->')) throw new Error(`Could not find the <!--page-head--> placeholder in dist/${page.shell}.`);
    html = html.replace('<!--page-head-->', page.head);
  }
  const outPath = path.join(distDir, page.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log(`✓ prerendered ${(appHtml.length / 1024).toFixed(1)} KB into dist/${page.out}`);
}
// work.html is only a shell; no page lives at /work.
await rm(path.join(distDir, 'work.html'), { force: true });

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
  ...(notes.length ? [{ loc: `${site.origin}/blog`, lastmod: lastModifiedDate, changefreq: 'weekly', priority: '0.7' }] : []),
  ...notes.map((n) => ({ loc: `${site.origin}/blog/${n.slug}`, lastmod: n.date, changefreq: 'monthly', priority: '0.6' })),
  ...publishedWork.map((w) => ({ loc: `${site.origin}/work/${w.slug}`, lastmod: lastModifiedDate, changefreq: 'monthly', priority: '0.7' })),
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
${publishedWork.length ? `\n## Detail sheets\n${publishedWork.map((w) => `- [${w.title}](${site.origin}/work/${w.slug}): ${w.summary}`).join('\n')}\n` : ''}${
  notes.length ? `\n## Notes\n${notes.map((n) => `- [${n.title}](${site.origin}/blog/${n.slug}) (${n.date})${n.summary ? `: ${n.summary}` : ''}`).join('\n')}\n` : ''
}
Last updated: ${lastModifiedDate}
`;
await writeFile(path.join(distDir, 'llms.txt'), llms);

await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true });

const imageCount = urls.reduce((n, u) => n + (u.images?.length ?? 0), 0);
console.log(`✓ wrote sitemap.xml (${urls.length} urls, ${imageCount} images) and llms.txt`);
