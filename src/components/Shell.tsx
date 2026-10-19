import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Cursor from './Cursor';
import Loader from './Loader';

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Loader />
      <Cursor />
      <a className="sr-only" href="#main">Skip to content</a>

      <nav className="nav mono" aria-label="Main">
        <Link to="/" className="nav-brand">Sangam</Link>
        <span className="nav-links">
          <Link to="/work">Work</Link>
          <Link to="/photography">Plates</Link>
          <a href="/resume.pdf">Résumé</a>
        </span>
      </nav>

      <main id="main">{children}</main>
    </>
  );
}
