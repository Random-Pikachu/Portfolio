import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import PhotographyApp from './PhotographyApp';
import BlogApp from './BlogApp';
import WorkApp from './WorkApp';
import {
  buildStructuredData,
  buildPhotographyStructuredData,
  buildNoteStructuredData,
  buildNotesStructuredData,
  buildWorkStructuredData,
} from './data/structuredData';
import { SITE, SECTIONS, PROJECTS, FEATURED, EXPERIENCES } from './data/site';
import { PHOTOS } from './data/photos';
import { NOTES, WORK } from './data/content.generated';
import { OgCard, type OgSpec } from './og/OgCard';

const wrap = (node: React.ReactNode) => renderToString(<StrictMode>{node}</StrictMode>);

/** One social card, for scripts/build-og.mjs. */
export function renderOg(spec: OgSpec): string {
  return wrap(<OgCard label={spec.label} title={spec.title} sub={spec.sub} />);
}

/** Every card the site needs, home first. */
export const ogCards: OgSpec[] = [
  { key: 'cover', label: `${SITE.name} · ${SITE.jobTitle}`, title: 'I build software after dark.', sub: 'Legal tech at Retsguide by day, KDE Plasma patches by night.' },
  { key: 'survey', label: 'Photos', title: 'Photography', sub: `${PHOTOS.length} frames from a Nothing Phone (1), mostly while walking somewhere else.` },
  ...(NOTES.length ? [{ key: 'notes', label: 'Blog', title: 'Notes', sub: `Notes by ${SITE.name} on software, systems and the things built along the way.` }] : []),
  ...NOTES.map((n) => ({ key: `note-${n.slug}`, label: `Blog · ${n.date}`, title: n.title, sub: n.summary })),
  ...FEATURED.filter((p) => WORK[p.slug]?.published).map((p) => ({ key: `work-${p.slug}`, label: 'Work · Case study', title: p.title, sub: p.summary })),
];

/** Full static markup for #root on the home page. */
export function render(): string {
  return wrap(<App />);
}

/** Full static markup for #root on /photography. */
export function renderPhotography(): string {
  return wrap(<PhotographyApp />);
}

/** /blog or /blog/<slug>. */
export function renderBlog(path: string): string {
  return wrap(<BlogApp path={path} />);
}

/** /work/<slug>. */
export function renderWork(path: string): string {
  return wrap(<WorkApp path={path} />);
}

export function structuredData(lastModified: string) {
  return buildStructuredData(lastModified);
}

export function photographyStructuredData(lastModified: string) {
  return buildPhotographyStructuredData(lastModified);
}

export function notesStructuredData(lastModified: string) {
  return buildNotesStructuredData(NOTES, lastModified);
}

export function noteStructuredData(slug: string, lastModified: string) {
  const note = NOTES.find((n) => n.slug === slug)!;
  return buildNoteStructuredData(note, lastModified);
}

export function workStructuredData(slug: string, lastModified: string) {
  return buildWorkStructuredData(slug, WORK[slug], lastModified);
}

export const site = SITE;
export const sections = SECTIONS.map((s) => ({ ...s }));
export const projects = PROJECTS;
export const experiences = EXPERIENCES;
export const photos = PHOTOS;
export const notes = NOTES.map((n) => ({ slug: n.slug, title: n.title, date: n.date, summary: n.summary, number: n.number }));
/** Projects whose case study is published, in home-page order. */
export const publishedWork = FEATURED.filter((p) => WORK[p.slug]?.published).map((p) => ({ slug: p.slug, title: p.title, summary: p.summary, image: p.image }));
