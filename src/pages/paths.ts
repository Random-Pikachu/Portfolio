/** The slug in /blog/<slug>, or null for the index. A trailing .html is tolerated. */
export function noteSlug(path: string) {
  const m = path.replace(/\.html$/, '').match(/^\/blog\/([^/]+)\/?$/);
  return m ? m[1] : null;
}

/** The slug in /work/<slug>, or an empty string. A trailing .html is tolerated. */
export function workSlug(path: string) {
  const m = path.replace(/\.html$/, '').match(/^\/work\/([^/]+)\/?$/);
  return m ? m[1] : '';
}
