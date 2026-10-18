import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LineGutter from './LineGutter';
import ThemeToggle from './ThemeToggle';
import { useSunset } from '../lib/useSunset';
import { SITE } from '../data/site';

/**
 * The page as a printed document: a running head, a numbered gutter, one
 * measure of prose, and a margin that carries the apparatus.
 *
 * The three-column grid is declared here rather than per route, so a citation
 * dropped anywhere in the body lands in the same margin every time.
 */
export default function Shell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useSunset();
  const { pathname } = useLocation();
  const on = (p: string) => (pathname === p || pathname.startsWith(p + '/') ? 'page' : undefined);

  return (
    <>
      <a className="skip" href="#doc">Skip to document</a>

      <header className="head">
        <Link to="/" className="head-title">
          <span className="head-mark" aria-hidden="true">§</span>
          {SITE.name}
        </Link>
        <span className="head-sub">Founding Engineer &amp; AI Systems</span>
        <nav className="head-nav" aria-label="Main">
          <Link to="/work" aria-current={on('/work')}>work</Link>
          <Link to="/photography" aria-current={on('/photography')}>plates</Link>
          <a href={SITE.resume}>résumé</a>
        </nav>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <div className="sheet">
        <LineGutter targetId="doc" />
        <article id="doc" className="doc">{children}</article>
      </div>
    </>
  );
}
