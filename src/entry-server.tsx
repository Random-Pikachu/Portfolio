import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { buildStructuredData } from './data/structuredData';
import { SITE, SECTIONS, PROJECTS, EXPERIENCES } from './data/site';

/** Full static markup for #root. Consumed by scripts/prerender.mjs. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export function structuredData(lastModified: string) {
  return buildStructuredData(lastModified);
}

export const site = SITE;
export const sections = SECTIONS.map((s) => ({ ...s }));
export const projects = PROJECTS;
export const experiences = EXPERIENCES;
