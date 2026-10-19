import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Rough from './Rough';
import { Underline } from './Doodle';

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Rough />
      <a className="sr-only" href="#main">Skip to content</a>

      <nav className="nav" aria-label="Main">
        <Link to="/" className="nav-brand">
          Sangam
          <Underline className="nav-u" />
        </Link>
        <span className="nav-links">
          <Link to="/work">work</Link>
          <Link to="/photography">photos</Link>
          <a href="/resume.pdf">résumé</a>
        </span>
      </nav>

      <main id="main">{children}</main>
    </>
  );
}
