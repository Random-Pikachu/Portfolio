import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent, type PointerEvent } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ARCHIVE, PLATES, type Project } from '../data/site';
import { WORK } from '../data/content.generated';
import { registerPlateResolver, scrollByPixels, scrollToY, setPlateSnaps, syncHash } from '../sheet/scroll';
import { sheetStore, useSheetState } from '../sheet/store';

const N = PLATES.length;
const STACK_QUERY = '(max-width: 47.99rem)';

/**
 * One plate: a print lying on the sheet (hence the hard shadow), the banner
 * covering it, a dark gradient rising from the bottom, and at the bottom the
 * detail number, title, one line, the fields that exist, the stack and the
 * links. Only fields that exist are rendered; nothing is invented.
 */
function Plate({ p, i, active }: { p: Project; i: number; active: boolean }) {
  const meta = WORK[p.slug];
  return (
    <li
      id={`project-${p.slug}`}
      className="plate"
      data-active={active}
      aria-roledescription="sheet"
      aria-label={`Detail ${i + 1} of ${N}, ${p.title}`}
    >
      <div className="plate__print">
        {p.image ? (
          <img
            className="plate__img"
            src={`/work/${p.image}-1600.webp`}
            srcSet={`/work/${p.image}-960.webp 960w, /work/${p.image}-1600.webp 1600w`}
            sizes="(max-width: 47.99rem) 100vw, calc(100vw - 168px)"
            width={1600}
            height={1200}
            alt={`${p.title} screenshot`}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="plate__type" aria-hidden="true">
            <span>{p.title}</span>
          </div>
        )}
        <div className="plate__shade" aria-hidden="true" />
        <div className="plate__caption">
          <div className="plate__text">
            <p className="t-label plate__num" aria-hidden="true">
              Detail {i + 1} of {N}
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
          </div>
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
      </div>
    </li>
  );
}

/**
 * Sheet 03. The six plates travel through one frame the width of the sheet.
 * The section is six viewports tall; a sticky frame one viewport tall holds
 * the track, and vertical progress maps linearly onto the track's travel, so
 * native scroll is never hijacked and Lenis, the hash, the rail and the
 * keyboard all agree. Snap points sit on every plate. Dragging the frame,
 * arrow keys and a sideways trackpad swipe all move the same page scroll.
 * Under 48rem, with reduced motion or without scripting the plates stack.
 */
export function Details() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stacked, setStacked] = useState(false);
  const [frameW, setFrameW] = useState(0);
  const [current, setCurrent] = useState(0);
  const { sheet } = useSheetState();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => (stacked ? 0 : -p * (N - 1) * frameW));
  const markerLeft = useTransform(scrollYProgress, (p) => `${Math.min(1, Math.max(0, p)) * 100}%`);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (stacked) return;
    const i = Math.min(N - 1, Math.max(0, Math.round(p * (N - 1))));
    setCurrent((prev) => (prev === i ? prev : i));
  });

  // The store carries the active plate only while this sheet is the active
  // one, and the hash names the plate in the frame.
  useEffect(() => {
    const inStrip = sheet === 'projects' && !stacked;
    sheetStore.set({ plate: inStrip ? current : null });
    if (inStrip) syncHash(`#project-${PLATES[current].slug}`);
  }, [sheet, current, stacked]);

  const sectionTop = () => (sectionRef.current ? sectionRef.current.getBoundingClientRect().top + window.scrollY : 0);

  const measure = useCallback(() => {
    const stackedNow = window.matchMedia(STACK_QUERY).matches || !!reduce;
    setStacked(stackedNow);
    setFrameW(frameRef.current?.clientWidth ?? 0);
    if (stackedNow) {
      setPlateSnaps([]);
      registerPlateResolver(null);
      return;
    }
    const top = sectionTop();
    const vh = window.innerHeight;
    setPlateSnaps(Array.from({ length: N }, (_, i) => top + i * vh));
    registerPlateResolver((slug) => {
      const i = PLATES.findIndex((p) => p.slug === slug);
      return i < 0 ? null : top + i * vh;
    });
  }, [reduce]);

  useEffect(() => {
    // Observing the document catches every layout change above the strip,
    // and fires once on observe, which is the initial measure.
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => {
      ro.disconnect();
      registerPlateResolver(null);
      setPlateSnaps([]);
    };
  }, [measure]);

  // Arrow keys, Home and End, while this sheet is in view.
  useEffect(() => {
    if (stacked) return;
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
      scrollToY(sectionTop() + i * window.innerHeight);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, stacked]);

  // A sideways trackpad swipe over the frame moves the strip.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || stacked) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) + 2) return;
      e.preventDefault();
      scrollByPixels(e.deltaX * (window.innerHeight / (frameW || 1)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [stacked, frameW]);

  // Drag: horizontal pointer travel becomes vertical page scroll, one-to-one
  // with the track, so everything else stays in sync. A drag suppresses the
  // click that would otherwise follow it.
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (stacked || e.button !== 0) return;
    drag.current = { x: e.clientX, scroll: window.scrollY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add('is-dragging');
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    scrollToY(drag.current.scroll - dx * (window.innerHeight / (frameW || 1)), { instant: true });
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    e.currentTarget.classList.remove('is-dragging');
    const moved = drag.current.moved;
    drag.current = null;
    if (moved) {
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
  };
  const suppressClick = useRef(false);
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Tabbing into a plate brings it into the frame.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (stacked) return;
    const li = (e.target as HTMLElement).closest<HTMLElement>('.plate');
    if (!li) return;
    const i = PLATES.findIndex((p) => `project-${p.slug}` === li.id);
    if (i >= 0 && i !== current) scrollToY(sectionTop() + i * window.innerHeight);
  };

  return (
    <div className="sheet">
      <div ref={sectionRef} className={`details ${stacked ? 'details--stack' : ''}`} style={{ '--n': N } as CSSProperties}>
        <div className="details__pin">
          <div className="details__head">
            <p className="t-label details__counter" aria-live="polite">
              {stacked ? (
                <>
                  <b>{N}</b> details
                </>
              ) : (
                <>
                  Detail <b>{current + 1}</b> of {N}
                </>
              )}
            </p>
            {stacked ? null : (
              <p className="t-label details__hint" aria-hidden="true">
                scroll · drag · ← →
              </p>
            )}
          </div>
          <div
            ref={frameRef}
            className="details__frame"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onClickCapture}
            onFocus={onFocus}
          >
            <motion.ol className="details__track" style={{ x }} aria-label="Plates">
              {PLATES.map((p, i) => (
                <Plate key={p.slug} p={p} i={i} active={stacked || i === current} />
              ))}
            </motion.ol>
          </div>
          <div className="ruler" aria-hidden="true">
            <span className="ruler__line" />
            {PLATES.map((p, i) => (
              <span key={p.slug} className="ruler__tick" style={{ left: `${(i / (N - 1)) * 100}%` }}>
                <i>{i + 1}</i>
              </span>
            ))}
            <motion.span className="ruler__marker" style={{ left: markerLeft }} />
            <span className="ruler__label t-label">{N} sheets</span>
            <span className="ruler__depth t-label">Depth 0 mm</span>
          </div>
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
