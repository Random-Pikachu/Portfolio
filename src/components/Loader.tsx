import { useEffect, useRef } from 'react';

/**
 * The count-in.
 *
 * No state: counting to a hundred through setState would re-render the tree a
 * hundred times to change one string. The effect writes the number and the
 * bar directly, and the whole thing is removed from the DOM once it has lifted.
 *
 * Runs once per session rather than once per visit — a loader a returning
 * visitor sits through twice is a toll, not an entrance.
 */
export default function Loader() {
  const box = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    let seen = false;
    try { seen = sessionStorage.getItem('seen') === '1'; } catch { /* private window */ }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reduced) {
      el.remove();
      return;
    }
    try { sessionStorage.setItem('seen', '1'); } catch { /* nothing to do */ }

    const t0 = performance.now();
    const DUR = 1400;
    let raf = 0, timer = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR);
      // Ease-out, so it sprints and then settles the way a real load feels.
      const v = (1 - Math.pow(1 - p, 3));
      if (num.current) num.current.textContent = String(Math.round(v * 100)).padStart(3, '0');
      if (bar.current) bar.current.style.transform = `scaleX(${v})`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        timer = window.setTimeout(() => {
          el.dataset.done = 'true';
          // Take it out of the tree once it has travelled, so it can never
          // sit invisibly over the page swallowing pointer events.
          timer = window.setTimeout(() => el.remove(), 1000);
        }, 220);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, []);

  return (
    <div className="loader" ref={box} data-done="false" aria-hidden="true">
      <span className="loader-n" ref={num}>000</span>
      <span className="loader-bar"><i ref={bar} style={{ transform: 'scaleX(0)' }} /></span>
    </div>
  );
}
