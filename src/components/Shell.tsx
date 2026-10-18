import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sky from './Sky';
import ThemeToggle from './ThemeToggle';
import { useSunset } from '../lib/useSunset';

/**
 * The printed sheet and its margins: the hairline frame, the top rail, and the
 * sky behind everything. Every page sits inside this, so the frame is what all
 * page content aligns its edges to.
 */
export default function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // The full sky is the home hero's. Reading pages get a whisper, so a heading
  // that starts at the top of the sheet is not competing with the plate.
  const isHome = pathname === '/';
  const { theme, toggle, canvasRef } = useSunset(isHome ? 1 : 0.3);
  const [clock, setClock] = useState('');

  // The visitor's own clock, not a decorative one. Arriving at 19:20 opens the
  // site at dusk and the rail says so, which explains the choice without copy.
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const phase = theme === 'dusk' ? 'dusk' : 'last light';

  return (
    <>
      <Sky canvasRef={canvasRef} />
      <div className="frame" aria-hidden="true" />

      <a className="skip" href="#main">Skip to content</a>

      <header className="rail">
        <Link to="/" className="rail-home">random-pikachu.dev</Link>

        <nav className="rail-nav" aria-label="Sections">
          <Link to="/work" aria-current={pathname.startsWith('/work') ? 'page' : undefined}>work</Link>
          <Link to="/photography" aria-current={pathname.startsWith('/photography') ? 'page' : undefined}>photography</Link>
          <a href="/resume.pdf">resume</a>
        </nav>

        <span className="rail-clock">
          {phase}{clock && <> &mdash; <time dateTime={clock}>{clock}</time></>}
        </span>

        <ThemeToggle theme={theme} onToggle={toggle} />
      </header>

      <main id="main" data-home={isHome ? '' : undefined}>{children}</main>

      <p className="hint" aria-hidden="true">
        <kbd>t</kbd> for {theme === 'dusk' ? 'daylight' : 'dusk'}
      </p>
    </>
  );
}
