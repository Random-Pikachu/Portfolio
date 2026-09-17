import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import WorkApp from './WorkApp';

const container = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <WorkApp path={location.pathname} />
    <Analytics />
  </StrictMode>
);

// Prerendered by scripts/prerender.mjs, so hydration is the normal path.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
