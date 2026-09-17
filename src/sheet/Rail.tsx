import { useEffect, useState } from 'react';
import { PAGES, PLACE, PLATES, SHEETS } from '../data/site';
import { clock } from './astro';
import { MoonGlyph } from './MoonGlyph';
import { useMoon } from './useMoon';
import { goTo } from './scroll';
import { sheetStore, useSheetState } from './store';

/** HH:MM in the drawing's time zone, client only. */
function useMinute() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setT(clock(new Date(), PLACE.timeZone).slice(0, 5));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * The persistent index down the left edge: every sheet, the plates while the
 * Details sheet is in view, the two pages, the moon and the time, and the
 * button that opens the tile index. A hairline of progress runs down its
 * left edge. Numbers only at rest; labels appear when the rail is hovered or
 * holds focus. Hidden under 48rem, where the tile index does its job.
 */
export function Rail({ variant = 'home' }: { variant?: 'home' | 'sub' }) {
  const { sheet, plate, progress, menu } = useSheetState();
  const moon = useMoon();
  const minute = useMinute();
  const isHome = variant === 'home';
  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const jump = (id: string) => (e: React.MouseEvent) => {
    if (!isHome) return;
    e.preventDefault();
    goTo(id);
  };

  return (
    <nav className="rail" aria-label="Sheet index">
      <span className="rail__progress" aria-hidden="true" style={{ transform: `scaleY(${progress})` }} />
      <ol className="rail__list">
        {SHEETS.map((s) => {
          const active = isHome && sheet === s.id;
          return (
            <li key={s.id} className={active ? 'is-active' : undefined}>
              <a href={href(s.id)} onClick={jump(s.id)} aria-current={active ? 'true' : undefined}>
                <span className="rail__num">{s.num}</span>
                <span className="rail__label">{s.block}</span>
              </a>
              {s.id === 'projects' && active && plate !== null ? (
                <ol className="rail__plates" aria-label="Plates">
                  {PLATES.map((p, i) => (
                    <li key={p.slug} className={i === plate ? 'is-active' : undefined}>
                      <a href={`#project-${p.slug}`} onClick={jump(`project-${p.slug}`)} aria-current={i === plate ? 'true' : undefined}>
                        <span className="rail__num">{i + 1}</span>
                        <span className="rail__label">{p.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
      <ol className="rail__list rail__pages">
        {PAGES.map((p) => {
          const here = !isHome && location_is(p.href);
          return (
            <li key={p.id} className={here ? 'is-active' : undefined}>
              <a href={p.href} aria-current={here ? 'page' : undefined}>
                <span className="rail__num">{p.label.slice(0, 1).toUpperCase()}</span>
                <span className="rail__label">{p.block}</span>
              </a>
            </li>
          );
        })}
      </ol>
      <div className="rail__live" aria-label={`${PLACE.city}, ${minute ?? ''} ${PLACE.zoneLabel}`}>
        <MoonGlyph phase={moon} size={14} />
        <span className="rail__time" suppressHydrationWarning>
          {minute ?? '--:--'}
        </span>
      </div>
      <button
        type="button"
        className="rail__menu"
        onClick={() => sheetStore.set({ menu: true })}
        aria-label="Open the sheet index"
        aria-expanded={menu}
        aria-controls="tile-index"
      >
        <span aria-hidden="true" />
      </button>
    </nav>
  );
}

/** True when the current page is the one the rail entry links to. Safe on the server. */
function location_is(href: string) {
  if (typeof location === 'undefined') return false;
  return location.pathname === href || location.pathname === `${href}.html` || location.pathname.startsWith(`${href}/`);
}
