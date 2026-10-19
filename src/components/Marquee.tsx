import { useEffect, useRef } from 'react';

/**
 * An endless band of text.
 *
 * The track holds the items twice and translates by exactly half its width, so
 * the loop point is a seam between two identical copies and never visibly
 * jumps. Driven by rAF rather than a CSS animation so the speed stays constant
 * regardless of how wide the content ends up.
 */
export default function Marquee({ items, speed = 42 }: { items: string[]; speed?: number }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = 0, last = performance.now(), raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      x -= speed * dt;
      const half = el.scrollWidth / 2;
      if (half > 0 && -x >= half) x += half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const doubled = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={track}>
        {doubled.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}
