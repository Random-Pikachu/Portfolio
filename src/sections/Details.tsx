import { useCallback, useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent } from 'react';
import { ARCHIVE, PLATES, type Project } from '../data/site';
import { WORK } from '../data/content.generated';
import { reducedMotion, syncHash } from '../sheet/scroll';
import { sheetStore, useSheetState } from '../sheet/store';

const N = PLATES.length;

/**
 * One plate: the print — a screenshot lying on the sheet with its hard,
 * offset shadow — and beside it the annotation: detail number, title, one
 * line, the fields that exist, the stack and the links. Only fields that
 * exist are rendered; nothing is invented.
 */
function Plate({ p, i }: { p: Project; i: number }) {
  const meta = WORK[p.slug];
  return (
    <li id={`project-${p.slug}`} className="plate" aria-label={`Detail ${i + 1} of ${N}, ${p.title}`}>
      <figure className="plate__print">
        {p.image ? (
          <img
            className="plate__img"
            src={`/work/${p.image}-1600.webp`}
            srcSet={`/work/${p.image}-960.webp 960w, /work/${p.image}-1600.webp 1600w`}
            sizes="(max-width: 47.99rem) 100vw, 50vw"
            width={1600}
            height={1200}
            alt={`${p.title} screenshot`}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        ) : (
          <div className="plate__type" aria-hidden="true">
            <span>{p.title}</span>
          </div>
        )}
      </figure>
      <div className="plate__caption">
        <p className="t-label plate__num" aria-hidden="true">
          Detail {i + 1} / {N}
        </p>
        <h3 id={`project-${p.slug}-title`} tabIndex={-1} data-plate-heading className="t-display-2 plate__title">
          {p.title}
        </h3>
        <p className="t-body plate__line">{p.summary}</p>
        <p className="sr-only">{p.description}</p>
        {meta?.role || meta?.hardest ? (
          <dl className="plate__spec t-data">
            {meta.role ? (
              <div>
                <dt>Role</dt>
                <dd>{meta.role}</dd>
              </div>
            ) : null}
            {meta.hardest ? (
              <div>
                <dt>Hardest</dt>
                <dd>{meta.hardest}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <p className="t-label plate__stack">{p.stack.join(' · ')}</p>
        <p className="plate__links">
          {p.live ? (
            <a href={p.live} target="_blank" rel="noopener" className="plate__link plate__link--pri" aria-label={`${p.title}, live site`}>
              Live <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <a href={p.github} target="_blank" rel="noopener" className="plate__link" aria-label={`${p.title}, source on GitHub`}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
          {p.youtube ? (
            <a href={p.youtube} target="_blank" rel="noopener" className="plate__link" aria-label={`${p.title}, video walkthrough`}>
              Demo <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {meta?.published ? (
            <a href={`/work/${p.slug}`} className="plate__link">
              Case study <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </p>
      </div>
    </li>
  );
}

/**
 * Sheet 03. The six details lie side by side on one strip the reader slides
 * sideways — a real horizontal scroll, with drag, arrow keys and the two
 * buttons in the head row. Snapping is proximity only: the strip settles on
 * a plate when the reader stops near one and never drags them anywhere.
 * The ruler under the strip reads off progress; the rail names the plate
 * crossing the frame.
 */
export function Details() {
  const stripRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const { sheet } = useSheetState();

  /** Slide to plate i inside the strip. */
  const show = useCallback((i: number, instant = false) => {
    const strip = stripRef.current;
    const plate = strip?.children[i] as HTMLElement | undefined;
    if (!strip || !plate) return;
    strip.scrollTo({ left: plate.offsetLeft - strip.offsetLeft, behavior: instant || reducedMotion() ? 'auto' : 'smooth' });
  }, []);

  // Scroll position drives the counter, the ruler marker and the store —
  // read on every scroll event, no render per frame except the index.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const max = strip.scrollWidth - strip.clientWidth;
      const p = max <= 0 ? 0 : strip.scrollLeft / max;
      if (markerRef.current) markerRef.current.style.left = `${(p * 100).toFixed(3)}%`;
      const step = max / (N - 1) || 1;
      const i = Math.min(N - 1, Math.max(0, Math.round(strip.scrollLeft / step)));
      setCurrent((prev) => (prev === i ? prev : i));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    strip.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      strip.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal: each plate comes to ink once, when it first enters the viewport.
  useEffect(() => {
    const root = stripRef.current;
    if (!root) return;
    const plates = Array.from(root.querySelectorAll<HTMLElement>('.plate'));
    if (typeof IntersectionObserver === 'undefined' || reducedMotion()) {
      plates.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { root: root, rootMargin: '0px -8% 0px 0px', threshold: 0 }
    );
    plates.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The store carries the active plate only while this sheet is the active
  // one, and the hash names the plate in view.
  useEffect(() => {
    const inSheet = sheet === 'projects';
    sheetStore.set({ plate: inSheet ? current : null });
    if (inSheet) syncHash(`#project-${PLATES[current].slug}`);
  }, [sheet, current]);

  // Arrow keys, Home and End, while this sheet is in view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sheetStore.get().sheet !== 'projects') return;
      const t = e.target as HTMLElement | null;
      if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      let i: number | null = null;
      if (e.key === 'ArrowRight') i = Math.min(N - 1, current + 1);
      else if (e.key === 'ArrowLeft') i = Math.max(0, current - 1);
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = N - 1;
      if (i === null) return;
      e.preventDefault();
      show(i);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, show]);

  // Drag: pointer travel moves the strip one-to-one. A drag suppresses the
  // click that would otherwise follow it.
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const onPointerDown = (e: PointerEvent<HTMLOListElement>) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLOListElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) {
      drag.current.moved = true;
      e.currentTarget.classList.add('is-dragging');
    }
    e.currentTarget.scrollLeft = drag.current.left - dx;
  };
  const onPointerUp = (e: PointerEvent<HTMLOListElement>) => {
    if (!drag.current) return;
    e.currentTarget.classList.remove('is-dragging');
    if (drag.current.moved) {
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
    drag.current = null;
  };
  const onClickCapture = (e: MouseEvent<HTMLOListElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Tabbing into a plate off the frame brings it in.
  const onFocus = (e: FocusEvent<HTMLOListElement>) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.plate');
    if (!li) return;
    const i = PLATES.findIndex((p) => `project-${p.slug}` === li.id);
    if (i >= 0 && i !== current) show(i);
  };

  return (
    <div className="sheet">
      <div className="details">
        <div className="details__head">
          <p className="t-label details__counter" aria-live="polite">
            Detail <b>{current + 1}</b> of {N}
          </p>
          <div className="details__nav">
            <p className="t-label details__hint" aria-hidden="true">
              drag · scroll · ← →
            </p>
            <button
              type="button"
              className="details__step"
              onClick={() => show(Math.max(0, current - 1))}
              disabled={current === 0}
              aria-label="Previous detail"
            >
              ←
            </button>
            <button
              type="button"
              className="details__step"
              onClick={() => show(Math.min(N - 1, current + 1))}
              disabled={current === N - 1}
              aria-label="Next detail"
            >
              →
            </button>
          </div>
        </div>

        <ol
          ref={stripRef}
          className="details__strip"
          data-hscroll
          aria-label="Project details"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          onFocus={onFocus}
        >
          {PLATES.map((p, i) => (
            <Plate key={p.slug} p={p} i={i} />
          ))}
        </ol>

        <div className="ruler" aria-hidden="true">
          <span className="ruler__line" />
          {PLATES.map((p, i) => (
            <span key={p.slug} className="ruler__tick" style={{ left: `${(i / (N - 1)) * 100}%` }}>
              <i>{i + 1}</i>
            </span>
          ))}
          <span ref={markerRef} className="ruler__marker" />
          <span className="ruler__label t-label">{N} details</span>
          <span className="ruler__depth t-label">Depth 0 mm</span>
        </div>
      </div>

      <ol className="archive t-data" aria-label="Not issued">
        {ARCHIVE.map((p, i) => (
          <li key={p.slug} className="archive__row">
            <span className="archive__num">{N + i + 1}</span>
            <a href={p.github} target="_blank" rel="noopener" className="underline-draw">
              {p.title}
            </a>
            <span className="archive__line">{p.summary}</span>
            <span className="archive__status t-label">Not issued</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
