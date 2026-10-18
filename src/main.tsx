import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import App from './App';

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>
);

// Every route is prerendered to its own HTML file (scripts/prerender.mjs), so
// the normal path is hydration. createRoot is the fallback for the dev server
// or a build that somehow shipped an empty shell.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
