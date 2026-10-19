import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Reticle from './Reticle';
import Clock from './Clock';
import Ending from './Ending';

/**
 * Nav, reticle, and the closing golden-hour section every page ends on.
 *
 * The nav scrolls away rather than sticking. A fixed bar would have to invert
 * itself every time one of the dark slabs passed beneath it, and the page is
 * short enough that losing it costs nothing.
 */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Reticle />
      <a className="sr-only" href="#main">Skip to content</a>

      <div className="wrap">
        <nav className="nav" aria-label="Main">
          <Link to="/" className="nav-brand">
            <span className="nav-dot" aria-hidden="true" />
            Sangam Pratap Singh
          </Link>
          <Clock />
          <span className="nav-links">
            <NavLink to="/work">Work</NavLink>
            <NavLink to="/photography">Photos</NavLink>
            <a href="/resume.pdf">Résumé</a>
          </span>
        </nav>
      </div>

      <main id="main">{children}</main>

      <Ending />
    </>
  );
}
