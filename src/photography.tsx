import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import PhotographyApp from './PhotographyApp';

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <PhotographyApp />
    <Analytics />
  </StrictMode>
);

// Prerendered by scripts/prerender.mjs, so hydration is the normal path.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
