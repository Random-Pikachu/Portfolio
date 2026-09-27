import type { ReactNode } from 'react';
import SmoothScroll from './SmoothScroll';
import { Nav, type PageKind } from './Nav';
import { Footer } from './Footer';

/**
 * The frame of every page: the skip link, the bar, the page's own <main>, the
 * footer, and the grain over all of it. Shared by the home page and every
 * route, so the prerender and the browser build the same tree.
 */
export function Shell({ kind, current, children }: { kind: PageKind; current?: string; children: ReactNode }) {
  return (
    <SmoothScroll>
      <a href="#main" className="skip-link t-label">
        Skip to content
      </a>
      <Nav kind={kind} current={current} />
      {children}
      <Footer />
      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  );
}
