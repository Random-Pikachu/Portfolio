import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Reticle from './Reticle';
import Sundown from './Sundown';
import Clock from './Clock';
import Ending from './Ending';

/**
 * The frame every page shares: the crosshair field behind, the palette ramp
 * driving it, a nav that scrolls away, and the sunset the page ends on.
 */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Sundown />
      <Reticle />
      <a className="sr-only" href="#main">Skip to content</a>

      <div className="page">
        <div className="wrap">
          <nav className="nav" aria-label="Main">
            <Link to="/" className="nav-brand">
              <span className="nav-dot" aria-hidden="true" />
              Sangam—Singh
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
      </div>
    </>
  );
}
