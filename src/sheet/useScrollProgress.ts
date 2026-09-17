import { useEffect, type RefObject } from 'react';

/**
 * Progress of a tall element through the viewport: 0 when its top reaches
 * the top of the viewport, 1 when its bottom reaches the bottom. Reported
 * on every scroll and resize, throttled to a frame, to a callback that
 * writes styles directly, so nothing re-renders per frame. Lenis scrolls the
 * window natively, so the window's own scroll event is the right source.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onChange: (p: number) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / range));
      onChange(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, onChange]);
}

/** True once the element has come within `margin` pixels of the viewport; stays true. */
export function useNear(ref: RefObject<HTMLElement | null>, margin: number, onNear: () => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      onNear();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onNear();
          io.disconnect();
        }
      },
      { rootMargin: `${margin}px 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, onNear]);
}
