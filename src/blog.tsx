import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import BlogApp from './BlogApp';

const container = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <BlogApp path={location.pathname} />
    <Analytics />
  </StrictMode>
);

// Prerendered by scripts/prerender.mjs, so hydration is the normal path.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
