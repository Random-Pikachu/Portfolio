import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { ARCHIVE, PLATES, type Project } from '../data/site';
import { WORK } from '../data/content.generated';
import { goTo, syncHash } from '../sheet/scroll';
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
    <li id={`project-${p.slug}`} className="plate" aria-label={`Plate ${i + 1} of ${N}, ${p.title}`}>
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
      <div className="plate__caption sheet-card">
        <p className="t-label plate__num" aria-hidden="true">
          Plate {i + 1} / {N}
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

export function Details() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const { sheet } = useSheetState();

  const show = useCallback((i: number) => {
    void goTo(`project-${PLATES[i].slug}`);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;
    const plates = Array.from(track.querySelectorAll<HTMLElement>('.plate'));
    const narrow = window.matchMedia('(max-width: 47.99rem)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let offsets: number[] = [];
    let distance = 0;
    let inset = 0;
    let raf = 0;

    const read = () => {
      raf = 0;
      let i = 0;
      if (section.dataset.pinned === 'true') {
        const x = Math.min(distance, Math.max(0, inset - section.getBoundingClientRect().top));
        track.style.transform = `translate3d(${-x}px, 0, 0)`;
        if (markerRef.current) markerRef.current.style.left = `${distance ? x / distance * 100 : 0}%`;
        i = offsets.reduce((nearest, offset, index) => (
          Math.abs(offset - x) < Math.abs(offsets[nearest] - x) ? index : nearest
        ), 0);
      } else {
        const line = window.innerHeight * 0.45;
        plates.forEach((plate, index) => {
          if (plate.getBoundingClientRect().top <= line) i = index;
        });
      }
      setCurrent((prev) => (prev === i ? prev : i));
    };

    const measure = () => {
      section.dataset.pinned = String(!narrow.matches && !motion.matches && N > 1);
      section.style.height = '';
      track.style.transform = '';
      inset = parseFloat(getComputedStyle(pin).top) || 0;
      if (section.dataset.pinned === 'true' && pin.offsetHeight + inset + 24 > window.innerHeight) {
        section.dataset.pinned = 'false';
      }
      if (section.dataset.pinned === 'true') {
        offsets = plates.map((plate) => plate.offsetLeft);
        distance = offsets.at(-1) ?? 0;
        section.style.height = `${pin.offsetHeight + distance}px`;
      }
      read();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pin);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    narrow.addEventListener('change', measure);
    motion.addEventListener('change', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      narrow.removeEventListener('change', measure);
      motion.removeEventListener('change', measure);
      if (raf) cancelAnimationFrame(raf);
      delete section.dataset.pinned;
      section.style.height = '';
      track.style.transform = '';
    };
  }, []);

  useEffect(() => {
    const inSheet = sheet === 'projects';
    sheetStore.set({ plate: inSheet ? current : null });
    if (inSheet) syncHash(`#project-${PLATES[current].slug}`);
  }, [sheet, current]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (sectionRef.current?.dataset.pinned !== 'true' || e.altKey || e.ctrlKey || e.metaKey) return;
    let i: number | null = null;
    if (e.key === 'ArrowRight') i = Math.min(N - 1, current + 1);
    else if (e.key === 'ArrowLeft') i = Math.max(0, current - 1);
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = N - 1;
    if (i === null) return;
    e.preventDefault();
    show(i);
  };

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (sectionRef.current?.dataset.pinned !== 'true') return;
    const plate = (e.target as HTMLElement).closest<HTMLElement>('.plate');
    const frame = e.currentTarget.getBoundingClientRect();
    const target = e.target.getBoundingClientRect();
    if (plate && (target.left < frame.left || target.right > frame.right)) {
      void goTo(plate.id, { instant: true, focus: false });
    }
  };

  return (
    <div className="sheet">
      <div ref={sectionRef} className="details" data-scroll-scene>
        <div ref={pinRef} className="details__pin" data-scroll-pin onKeyDown={onKeyDown}>
          <div className="details__head">
            <p className="t-label details__counter">
              Selected work
              <span className="details__position"> / <b>{String(current + 1).padStart(2, '0')}</b></span>
              {' / '}{String(N).padStart(2, '0')}
            </p>
            <div className="details__nav">
              <p className="t-label details__hint" aria-hidden="true">
                Scroll down to explore <span aria-hidden="true">↓</span>
              </p>
              <button
                type="button"
                className="details__step"
                onClick={() => show(Math.max(0, current - 1))}
                disabled={current === 0}
                aria-label="Previous plate"
              >
                ←
              </button>
              <button
                type="button"
                className="details__step"
                onClick={() => show(Math.min(N - 1, current + 1))}
                disabled={current === N - 1}
                aria-label="Next plate"
              >
                →
              </button>
            </div>
          </div>

          <div
            className="details__frame"
            onFocus={onFocus}
            onScroll={(e) => {
              if (e.currentTarget.scrollLeft) e.currentTarget.scrollLeft = 0;
            }}
          >
            <ol ref={trackRef} className="details__track" aria-label="Project plates">
              {PLATES.map((p, i) => (
                <Plate key={p.slug} p={p} i={i} />
              ))}
            </ol>
          </div>

          <div className="ruler" aria-hidden="true">
            <span className="ruler__line" />
            {PLATES.map((p, i) => (
              <span key={p.slug} className="ruler__tick" style={{ left: `${(i / (N - 1)) * 100}%` }}>
                <i>{i + 1}</i>
              </span>
            ))}
            <span ref={markerRef} className="ruler__marker" />
          </div>
        </div>
      </div>

      <ol className="archive t-data" aria-label="Not charted">
        {ARCHIVE.map((p, i) => (
          <li key={p.slug} className="archive__row">
            <span className="archive__num">{N + i + 1}</span>
            <a href={p.github} target="_blank" rel="noopener" className="underline-draw">
              {p.title}
            </a>
            <span className="archive__line">{p.summary}</span>
            <span className="archive__status t-label">Not charted</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
