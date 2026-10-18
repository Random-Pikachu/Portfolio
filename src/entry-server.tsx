import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { buildStructuredData, buildPhotographyStructuredData } from './data/structuredData';
import { SITE } from './data/site';
import { PHOTOS } from './data/photos';
import { PROJECTS } from './data/work';
import { PITCHES } from './data/pitches';

/** Static markup for #root at one route. */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

export function structuredData(lastModified: string) {
  return buildStructuredData(lastModified);
}

export function photographyStructuredData(lastModified: string) {
  return buildPhotographyStructuredData(lastModified);
}

/**
 * Every route the build emits as static HTML.
 *
 * `index` controls whether a route reaches robots and the sitemap. The hiring
 * pages are unlisted by design: reachable with the link, invisible to crawlers.
 */
export const ROUTES: { url: string; file: string; index: boolean; schema?: 'home' | 'photography' }[] = [
  { url: '/', file: 'index.html', index: true, schema: 'home' },
  { url: '/work', file: 'work.html', index: true },
  { url: '/photography', file: 'photography.html', index: true, schema: 'photography' },
  ...PROJECTS.filter((p) => p.featured).map((p) => ({
    url: `/work/${p.slug}`,
    file: `work/${p.slug}.html`,
    index: true,
  })),
  ...PITCHES.flatMap((p) => [
    { url: `/for/${p.slug}`, file: `for/${p.slug}.html`, index: false },
    ...(p.people ?? []).map((person) => ({
      url: `/for/${p.slug}/${person.slug}`,
      file: `for/${p.slug}/${person.slug}.html`,
      index: false,
    })),
  ]),
  { url: '/404', file: '404.html', index: false },
];

export const site = SITE;
export const photos = PHOTOS;
