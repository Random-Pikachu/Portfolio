import { useEffect, useRef } from 'react';

/**
 * The custom cursor: a dot that trails the pointer and swells over anything
 * interactive.
 *
 * Driven entirely through refs. A pointer that updates React state sixty times
 * a second re-renders the tree sixty times a second for a transform, so the
 * element is always rendered and the effect writes to it directly. CSS hides
 * it wherever there is no fine pointer, so a touch device never gets a dot
 * stranded in a corner.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.body.classList.add('has-cursor');

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y, scale = 1, ts = 1, raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      const live = !!(e.target as Element | null)?.closest?.('a, button, [data-cursor]');
      ts = live ? 3.4 : 1;
      if (dot.current) dot.current.dataset.state = live ? 'link' : 'idle';
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      // Lerp rather than snap: the lag is what makes it feel physical.
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      scale += (ts - scale) * 0.14;
      if (dot.current) {
        dot.current.style.transform =
          `translate3d(${x - 4.5}px, ${y - 4.5}px, 0) scale(${scale.toFixed(3)})`;
      }
    };

    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return <div className="cursor" ref={dot} data-state="idle" aria-hidden="true" />;
}
