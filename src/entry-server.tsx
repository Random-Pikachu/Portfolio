import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import PhotographyApp from './PhotographyApp';
import { buildStructuredData, buildPhotographyStructuredData } from './data/structuredData';
import { SITE, SECTIONS, PROJECTS, EXPERIENCES } from './data/site';
import { PHOTOS } from './data/photos';

/** Full static markup for #root on the home page. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

/** Full static markup for #root on /photography. */
export function renderPhotography(): string {
  return renderToString(
    <StrictMode>
      <PhotographyApp />
    </StrictMode>
  );
}

export function structuredData(lastModified: string) {
  return buildStructuredData(lastModified);
}

export function photographyStructuredData(lastModified: string) {
  return buildPhotographyStructuredData(lastModified);
}

export const site = SITE;
export const sections = SECTIONS.map((s) => ({ ...s }));
export const projects = PROJECTS;
export const experiences = EXPERIENCES;
export const photos = PHOTOS;
