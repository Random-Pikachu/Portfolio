import { useEffect, useRef } from 'react';

/**
 * The crosshair field, and the pointer lamp that relights it.
 *
 * Both layers are fixed and share one mask pitch, so they cannot drift out of
 * phase. The pointer position is lerped on a single rAF loop and written
 * straight to two custom properties — a state update per pointermove would
 * re-render the whole page.
 */
export default function Reticle() {
  const lamp = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = { x: -999, y: -999 };
    const at = { x: -999, y: -999 };
    let raf = 0;
    let seen = false;

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) {
        seen = true;
        at.x = target.x;
        at.y = target.y;
        lamp.current?.classList.add('lit');
        glow.current?.classList.add('lit');
      }
    };
    const leave = () => {
      seen = false;
      lamp.current?.classList.remove('lit');
      glow.current?.classList.remove('lit');
    };

    const tick = () => {
      // A light trail rather than a hard lock: the lag is what makes the field
      // read as something being lit instead of a cursor decoration.
      at.x += (target.x - at.x) * 0.16;
      at.y += (target.y - at.y) * 0.16;
      const s = document.documentElement.style;
      s.setProperty('--mx', `${at.x.toFixed(1)}px`);
      s.setProperty('--my', `${at.y.toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className="field" aria-hidden="true">
      <div className="reticle" />
      <div className="glow" ref={glow} />
      <div className="lamp" ref={lamp} />
    </div>
  );
}
