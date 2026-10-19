import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Field from './Field';
import Sundown from './Sundown';
import Motion from './Motion';
import Clock from './Clock';
import Ending from './Ending';

/**
 * The frame every page shares.
 *
 * The band — the sunset and its crossover — runs on the home page only.
 * Appending it to every route made 37% of a case study the home page's
 * finale, and a dramatic gesture that happens five times is furniture.
 */
export default function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <Sundown />
      <Field />
      <Motion />
      <a className="sr-only" href="#main">Skip to content</a>

      <div className="page">
        <div className="grid">
          <nav className="nav" aria-label="Main" style={{ gridColumn: '1 / -1' }}>
            <Link to="/" className="nav-brand">Sangam Pratap Singh</Link>
            <Clock />
            <span className="nav-links">
              <NavLink to="/work">Work</NavLink>
              <NavLink to="/photography">Photographs</NavLink>
              <a href="/resume.pdf">Résumé</a>
            </span>
          </nav>
        </div>

        <main id="main">{children}</main>

        <Ending band={isHome} />
      </div>
    </>
  );
}
