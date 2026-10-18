import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useSunset } from '../lib/useSunset';

/**
 * The page frame: a rail that scrolls away with the content, and one column.
 *
 * The rail is deliberately not fixed. Over a 680px column a sticky bar spends
 * a tenth of a phone screen repeating four links the reader can already see.
 */
export default function Shell({ children }: { children: ReactNode }) {
  const { theme, toggle } = useSunset();
  const { pathname } = useLocation();
  const on = (p: string) => (pathname === p || pathname.startsWith(p + '/') ? 'page' : undefined);

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>

      <header className="rail">
        <Link to="/" className="rail-home">Sangam</Link>
        <nav className="rail-nav" aria-label="Main">
          <Link to="/work" aria-current={on('/work')}>work</Link>
          <Link to="/photography" aria-current={on('/photography')}>photos</Link>
          <a href="/resume.pdf">resume</a>
        </nav>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main id="main">{children}</main>
    </>
  );
}
