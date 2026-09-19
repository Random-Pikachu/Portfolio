import { useEffect, useRef } from 'react';
import { PAGES, SHEETS, SITE } from '../data/site';
import { goTo, lockScroll } from './scroll';
import { sheetStore, useSheetState } from './store';

const LINES: Record<string, string> = {
  cover: 'Who this is, and the sky over the station.',
  about: 'The observer, currently, and the instruments.',
  experience: 'Three transits on a time axis; one still rising.',
  projects: 'Six plates, one in the frame at a time.',
  contact: 'A signal, issued for remote work. Quantity one.',
  notes: 'Writing, in Markdown, with code.',
  survey: 'Twenty-seven frames from a Nothing Phone (1).',
};

/**
 * The full-screen index: every chart and page as a tile. A modal dialog:
 * focus is trapped, Escape closes, focus returns to the button that opened
 * it, and Lenis is stopped while it is open. Rendered only when open, so the
 * prerendered HTML carries none of it.
 */
export function TileIndex({ variant = 'home' }: { variant?: 'home' | 'sub' }) {
  const { menu } = useSheetState();
  const ref = useRef<HTMLDivElement>(null);
  const isHome = variant === 'home';

  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const first = ref.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sheetStore.set({ menu: false });
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>('a, button');
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
      previous?.focus?.();
    };
  }, [menu]);

  if (!menu) return null;

  const close = () => sheetStore.set({ menu: false });
  const jump = (id: string) => (e: React.MouseEvent) => {
    if (!isHome) return;
    e.preventDefault();
    close();
    goTo(id);
  };

  return (
    <div id="tile-index" className="tile-index" role="dialog" aria-modal="true" aria-label="Chart index" ref={ref}>
      <div className="sheet tile-index__inner">
        <div className="tile-index__head">
          <p className="t-label">Index of charts</p>
          <button type="button" className="tile-index__close t-label" onClick={close}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <ol className="tiles">
          {SHEETS.map((s) => (
            <li key={s.id} className="tile">
              <a href={isHome ? `#${s.id}` : `/#${s.id}`} onClick={jump(s.id)}>
                <span className="t-label">Chart {s.num}</span>
                <span className="tile__title t-display-2">{s.block}</span>
                <span className="t-data tile__line">{LINES[s.id]}</span>
              </a>
            </li>
          ))}
          {PAGES.map((p) => (
            <li key={p.id} className="tile">
              <a href={p.href}>
                <span className="t-label">Page</span>
                <span className="tile__title t-display-2">{p.block}</span>
                <span className="t-data tile__line">{LINES[p.id]}</span>
              </a>
            </li>
          ))}
          <li className="tile tile--small">
            <a href={SITE.resume} target="_blank" rel="noopener">
              <span className="t-label">PDF</span>
              <span className="tile__title t-h3">Résumé ↗</span>
            </a>
          </li>
          <li className="tile tile--small">
            <a href={SITE.calendar} target="_blank" rel="noopener">
              <span className="t-label">15 min</span>
              <span className="tile__title t-h3">Book a call ↗</span>
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
}
