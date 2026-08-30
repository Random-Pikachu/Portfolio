import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import App from './App';

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);

// The build prerenders the full page into #root (scripts/prerender.mjs), so the
// normal path is hydration. createRoot is only the fallback for a dev server or
// a build that somehow shipped an empty shell.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
