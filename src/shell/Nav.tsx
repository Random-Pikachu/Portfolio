import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV, SITE, type NavItem } from '../data/site';
import { NOTE_COUNT } from '../data/content.generated';
import { WindowMark } from '../night/WindowMark';
import { goTo, lockScroll } from './scroll';

export type PageKind = 'home' | 'page';

const ITEMS = NAV.filter((n) => !('needsNotes' in n) || NOTE_COUNT > 0);

/**
 * The top bar: the lit-window mark and the name at left, the pages, and the
 * one call. Transparent over the hero, night with a hairline once the page
 * moves. Below 64rem the links fold into a menu behind a toggle, leaving the
 * mark, the call and the toggle: room for all three at 360px.
 *
 * The call is rationed like every ember: on the home page it stays a quiet
 * outline while the page's own call (the hero's or contact's, marked
 * `data-cta`) is on screen, and lights in between. On a phone it steps aside
 * for the call bar at the foot of the screen instead. On every other page it
 * is lit from the start.
 *
 * `current` is the route this page is, from its app, so the prerendered
 * HTML and the hydrated tree agree on aria-current.
 */
export function Nav({ kind, current }: { kind: PageKind; current?: string }) {
  const home = kind === 'home';
  const [scrolled, setScrolled] = useState(!home);
  const [lit, setLit] = useState(!home);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!home) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [home]);

  useEffect(() => {
    if (!home) return;
    // Without a page call to watch the call stays an outline: still there, still a link.
    const ctas = document.querySelectorAll('[data-cta]');
    if (!ctas.length || typeof IntersectionObserver === 'undefined') return;
    const nav = headerRef.current?.offsetHeight ?? 64;
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) onScreen.add(e.target);
          else onScreen.delete(e.target);
        }
        setLit(onScreen.size === 0);
      },
      { rootMargin: `-${nav}px 0px 0px 0px` }
    );
    ctas.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [home]);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    lockScroll(false);
    document.documentElement.classList.remove('menu-open');
    if (refocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    document.documentElement.classList.add('menu-open');
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    // A menu left open on a phone turned sideways would sit over a desktop bar.
    const wide = window.matchMedia('(min-width: 64rem)');
    const onWide = () => wide.matches && close(false);
    wide.addEventListener('change', onWide);
    return () => wide.removeEventListener('change', onWide);
  }, [open, close]);

  /** Escape closes; Tab and Shift+Tab stay inside the bar and the menu. */
  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key !== 'Tab') return;
    const f = headerRef.current?.querySelectorAll<HTMLElement>('.nav__bar a, .nav__bar button, .nav__panel a');
    const list = f ? [...f].filter((el) => el.offsetParent !== null) : [];
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const href = (n: NavItem) => ('section' in n ? (home ? `#${n.section}` : `/#${n.section}`) : n.href);
  const isCurrent = (n: NavItem) => 'href' in n && !!current && (current === n.href || current.startsWith(`${n.href}/`));

  /** On the home page a section link scrolls; with no such section yet it falls back to the plain hash. */
  const onItem = (n: NavItem) => (e: MouseEvent) => {
    if (open) close(false);
    if (home && 'section' in n && goTo(n.section)) e.preventDefault();
  };

  const onMark = (e: MouseEvent) => {
    if (open) close(false);
    if (home && goTo('top')) e.preventDefault();
  };

  const links = (where: 'bar' | 'panel') =>
    ITEMS.map((n) => (
      <li key={n.label}>
        <a href={href(n)} onClick={onItem(n)} aria-current={isCurrent(n) ? 'page' : undefined} className={where === 'bar' ? 'nav__link' : 'nav__panel-link'}>
          {n.label}
        </a>
      </li>
    ));

  return (
    <header
      ref={headerRef}
      className="nav"
      data-home={home ? '' : undefined}
      data-scrolled={scrolled || open ? '' : undefined}
      data-open={open ? '' : undefined}
      onKeyDown={onKeyDown}
    >
      <div className="frame nav__bar">
        <a href={home ? '#top' : '/'} onClick={onMark} className="nav__home" aria-label={`${SITE.name}, home`}>
          <WindowMark size={28} />
          <span className="nav__name" aria-hidden="true">
            {SITE.name}
          </span>
        </a>

        <nav className="nav__links" aria-label="Main">
          <ul>{links('bar')}</ul>
        </nav>

        <a
          href={SITE.calendar}
          target="_blank"
          rel="noopener"
          className="nav__cta"
          data-lit={lit ? '' : undefined}
          data-umami-event="book-call-nav"
        >
          Book a call
          <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => (open ? close(false) : setOpen(true))}
        >
          {open ? <X size={22} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      </div>

      <div ref={panelRef} id="nav-panel" className="nav__panel" inert={!open}>
        <nav className="frame" aria-label="Menu">
          <ul>{links('panel')}</ul>
        </nav>
      </div>
    </header>
  );
}
