import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X, CalendarDays, Sun, Moon } from 'lucide-react';
import { SECTIONS, SITE } from '../data/site';

const NAV_IDS = SECTIONS.map((s) => s.id);

/** The active link shows its index, so the nav and the section rail agree. */
function Index({ num, on }: { num: string; on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mono mr-1.5 text-[10px] text-accent transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`}
    >
      {num}
    </span>
  );
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * `home` wires the section links as in-page anchors with smooth scrolling.
 * `sub` is for standalone pages like /photography, where those same links have
 * to point back at the home page (`/#about`) instead of at nothing.
 */
export default function Navigation({
  variant = 'home',
}: {
  variant?: 'home' | 'sub';
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const isHome = variant === 'home';

  // Transparent over the hero; the hairline and blur arrive with the first
  // scroll. The progress line under the bar is the page's position.
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /**
   * Active-section tracking via IntersectionObserver rather than a scroll
   * listener. The old version called getBoundingClientRect() on every section on
   * every scroll event, which forces a synchronous layout each time and shows up
   * as interaction latency; the observer costs nothing between transitions.
   *
   * rootMargin carves out a band just under the navbar — a section counts as
   * active once it reaches the top of the viewport.
   */
  useEffect(() => {
    if (!isHome) return;
    const els = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!els.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Deepest section currently in the band wins, matching reading order.
        let next = '';
        for (let i = NAV_IDS.length - 1; i >= 0; i--) {
          if (visible.has(NAV_IDS[i])) {
            next = NAV_IDS[i];
            break;
          }
        }
        setActive(next);
      },
      { rootMargin: '-120px 0px -80% 0px', threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // Real anchors keep the links crawlable and keyboard-operable; this only takes
  // over to add smooth scrolling and to close the mobile sheet.
  const handleAnchor = (id: string) => (e: React.MouseEvent) => {
    if (!isHome) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
    setOpen(false);
  };

  const linkClass = (id: string) =>
    `mono inline-flex items-center text-[13px] tracking-[0.08em] transition-colors duration-200 ${
      active === id ? 'text-text-base' : 'text-text-faint hover:text-text-base'
    }`;


  const themeIcons = (
    <>
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} className="block dark:hidden" aria-hidden="true" />
    </>
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between px-5 sm:px-8 transition-[background-color,border-color] duration-500 ${
          scrolled || open || !isHome
            ? 'border-b border-border-main bg-bg-base/80 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a
          href={isHome ? '#hero' : '/'}
          onClick={handleAnchor('hero')}
          className="mono text-sm text-text-base tracking-[0.04em] transition-colors"
          aria-label="Back to the top"
        >
          /sangam<span className="caret" aria-hidden="true" />
        </a>
        {isHome ? (
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-accent"
            style={{ scaleX: scrollYProgress }}
          />
        ) : null}

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {SECTIONS.map(({ id, label, num }) => (
            <a
              key={id}
              href={sectionHref(id)}
              onClick={handleAnchor(id)}
              aria-current={active === id ? 'true' : undefined}
              className={linkClass(id)}
            >
              <Index num={num} on={active === id} />
              {label}
            </a>
          ))}
          <a
            href="/photography"
            aria-current={!isHome ? 'page' : undefined}
            className={`mono text-[13px] tracking-[0.08em] transition-colors duration-200 ${
              !isHome ? 'text-text-base' : 'text-text-faint hover:text-text-base'
            }`}
          >
            <Index num="05" on={!isHome} />
            photography
          </a>
          <div className="w-px h-3 bg-border-inner" aria-hidden="true" />
          <a
            href={SITE.resume}
            target="_blank"
            rel="noopener"
            className="mono text-[13px] text-text-faint hover:text-text-base transition-colors"
          >
            resume ↗
          </a>
          <a
            href={SITE.calendar}
            target="_blank"
            rel="noopener"
            className="mono text-[13px] text-text-faint hover:text-text-base transition-colors flex items-center gap-1"
          >
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
            schedule ↗
          </a>
          <div className="w-px h-3 bg-border-inner" aria-hidden="true" />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
            className="text-text-faint hover:text-text-base p-1 transition-colors"
          >
            {themeIcons}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="text-text-faint hover:text-text-base p-2 transition-colors"
            aria-label="Toggle colour theme"
          >
            {themeIcons}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-text-faint hover:text-text-base p-2 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        aria-label="Primary"
        className={`fixed inset-x-0 top-14 bottom-0 z-40 border-b border-border-main bg-bg-base/95 backdrop-blur-md md:hidden transition-all duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 py-8">
          <div className="flex flex-col gap-6">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={sectionHref(id)}
                onClick={handleAnchor(id)}
                tabIndex={open ? 0 : -1}
                className={`mono text-left text-xl tracking-[0.08em] transition-colors ${
                  active === id ? 'text-text-base' : 'text-text-faint hover:text-text-base'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-border-main pt-6">
            <a
              href="/photography"
              tabIndex={open ? 0 : -1}
              className={`mono text-sm transition-colors ${
                !isHome ? 'text-text-base' : 'text-text-faint hover:text-text-base'
              }`}
            >
              photography
            </a>
            <a
              href={SITE.resume}
              target="_blank"
              rel="noopener"
              tabIndex={open ? 0 : -1}
              className="mono text-[13px] text-text-faint hover:text-text-base transition-colors"
            >
              resume ↗
            </a>
            <a
              href={SITE.calendar}
              target="_blank"
              rel="noopener"
              tabIndex={open ? 0 : -1}
              className="mono text-[13px] text-text-faint hover:text-text-base transition-colors"
            >
              schedule ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
