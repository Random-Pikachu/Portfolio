import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Sun, Moon } from 'lucide-react';
import { PAGES, SITE } from '../data/site';
import { goTo } from '../sheet/scroll';
import { sheetStore, useSheetState } from '../sheet/store';

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * The top bar of every sheet: the wordmark, the two pages, the résumé, the
 * call, the theme toggle and, on phones, the index button. Transparent over
 * the cover; a hairline arrives with the first scroll. `sub` is for pages
 * outside the home set, where the wordmark goes home.
 */
export default function Navigation({
  variant = 'home',
}: {
  variant?: 'home' | 'sub';
}) {
  const [scrolled, setScrolled] = useState(false);
  const { menu } = useSheetState();
  const isHome = variant === 'home';
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * The current theme is never held in React state. Both icons are rendered and
   * CSS picks one off the `.dark` class that the inline script in index.html sets
   * before first paint — so the prerendered HTML and the hydrated tree always
   * match, and there is no wrong-icon flash on load.
   */
  const toggleTheme = (e: React.MouseEvent) => {
    const isDarkTarget = !document.documentElement.classList.contains('dark');
    const { clientX: x, clientY: y } = e;

    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      applyTheme(isDarkTarget);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => applyTheme(isDarkTarget));
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        { clipPath: isDarkTarget ? [...clipPath].reverse() : clipPath },
        {
          duration: 700,
          easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
          fill: 'both',
          pseudoElement: isDarkTarget
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });
  };

  const themeIcons = (
    <>
      <Sun size={16} className="hidden dark:block" aria-hidden="true" />
      <Moon size={16} className="block dark:hidden" aria-hidden="true" />
    </>
  );

  const here = (href: string) =>
    typeof location !== 'undefined' && (location.pathname === href || location.pathname === `${href}.html` || location.pathname.startsWith(`${href}/`));

  return (
    <header className={`topbar ${scrolled || !isHome ? 'is-scrolled' : ''}`}>
      <div className="sheet topbar__inner">
        <a
          href={isHome ? '#cover' : '/'}
          onClick={
            isHome
              ? (e) => {
                  e.preventDefault();
                  goTo('cover');
                }
              : undefined
          }
          className="topbar__mark mono"
          aria-label="Back to the cover"
        >
          /sangam<span className="caret" aria-hidden="true" />
        </a>
        <nav className="topbar__links" aria-label="Pages">
          {PAGES.map((p) => (
            <a key={p.id} href={p.href} aria-current={here(p.href) ? 'page' : undefined} className="topbar__page">
              {p.block}
            </a>
          ))}
          <span className="topbar__sep" aria-hidden="true" />
          <a href={SITE.resume} target="_blank" rel="noopener" className="topbar__page">
            Résumé <span aria-hidden="true">↗</span>
          </a>
          <a href={SITE.calendar} target="_blank" rel="noopener" className="topbar__page">
            Call <span aria-hidden="true">↗</span>
          </a>
          <span className="topbar__sep topbar__sep--wide" aria-hidden="true" />
          <button type="button" onClick={toggleTheme} aria-label="Toggle colour theme" className="topbar__theme">
            {themeIcons}
          </button>
          <button
            type="button"
            className="topbar__index"
            onClick={() => sheetStore.set({ menu: true })}
            aria-label="Open the sheet index"
            aria-expanded={menu}
            aria-controls="tile-index"
          >
            Index
          </button>
        </nav>
      </div>
    </header>
  );
}
