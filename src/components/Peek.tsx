import { useEffect, useRef } from 'react';

/**
 * The floating project preview.
 *
 * Follows the pointer with a lag, so the image feels dragged along rather than
 * pinned to it. This is the interaction the whole list is built around: rows
 * stay scannable as type, and the work still gets shown.
 */
export default function Peek({ src, alt }: { src: string | null; alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, s = 0, raf = 0;

    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.11;
      y += (ty - y) * 0.11;
      s += ((shown.current ? 1 : 0) - s) * 0.16;
      const el = box.current;
      if (!el) return;
      const w = el.offsetWidth, h = el.offsetHeight;
      el.style.transform =
        `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) scale(${s.toFixed(3)})`;
      el.style.opacity = s.toFixed(3);
    };

    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  // Written in an effect, not during render: a concurrent render that never
  // commits would otherwise leave the ref describing a row nobody hovered.
  useEffect(() => { shown.current = !!src; }, [src]);

  return (
    <div className="peek" ref={box} aria-hidden="true" style={{ opacity: 0 }}>
      {src && <img src={src} alt={alt} />}
    </div>
  );
}
