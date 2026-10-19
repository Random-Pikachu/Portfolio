import { useEffect, useRef } from 'react';
import Stars from './Stars';

/**
 * Everything behind the page: the sun, the horizon it sits on, the crosshair
 * grid, and the pointer lamp.
 *
 * The lamp has two expressions. The one in here lights the paper, which is
 * where it works by day. `.lamp-fg` sits above the content and is driven by
 * --night, so after dark it is a real light source over the thing you are
 * pointing at — the old single layer sat behind `.page`, which meant the only
 * pointer motion on the site was visible exclusively where you were not
 * pointing.
 */
export default function Field() {
  const lamp = useRef<HTMLDivElement>(null);

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
      }
    };
    const leave = () => { seen = false; lamp.current?.classList.remove('lit'); };

    const tick = () => {
      // The lag is what makes the field read as something being lit rather
      // than as a cursor decoration.
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
      <div className="field" aria-hidden="true">
        <div className="sun" />
        <Stars />
        <div className="horizon" />
        <div className="reticle" />
        <div className="lamp" ref={lamp} />
      </div>
      <div className="lamp-fg" aria-hidden="true" />
    </>
  );
}
