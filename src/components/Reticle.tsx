import { useEffect, useRef } from 'react';

/**
 * The pointer lamp: the page's crosshair field, repainted in ember inside a
 * disc that follows the cursor, over a soft pool of warm light.
 *
 * The field itself is painted by each slab with background-attachment:fixed,
 * so it sits behind the text. This layer is fixed and uses the same pitch,
 * which is what keeps the lit crosshairs on top of the unlit ones. The pointer position is lerped on a single rAF loop and written
 * straight to two CSS custom properties — no React state is involved, because
 * a state update per pointermove would re-render the entire page tree.
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
      // read as something being lit, instead of a cursor decoration.
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
    <>
      <div className="glow" ref={glow} aria-hidden="true" />
      <div className="lamp" ref={lamp} aria-hidden="true" />
    </>
  );
}
