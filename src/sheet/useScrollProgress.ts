import { useEffect, type RefObject } from 'react';

/**
 * Progress of an element through the viewport, 0 to 1, reported on every
 * scroll and resize, throttled to a frame, to a callback that writes styles
 * directly, so nothing re-renders per frame. Lenis scrolls the window
 * natively, so the window's own scroll event is the right source.
 *
 *   'section'  a tall element: 0 when its top reaches the top of the
 *              viewport, 1 when its bottom reaches the bottom.
 *   'enter'    a short element: 0 when its top enters at 90% of the
 *              viewport, 1 when its bottom passes 45%, about where a
 *              reader's eye rests.
 *   'leave'    an element that starts at the top of the page: 0 while its
 *              top is at or below the top of the viewport, 1 once its bottom
 *              has left.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onChange: (p: number) => void, mode: 'section' | 'enter' | 'leave' = 'section') {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === 'enter') {
        p = (vh * 0.9 - rect.top) / (vh * 0.45 + rect.height);
      } else if (mode === 'leave') {
        p = -rect.top / rect.height;
      } else {
        const range = rect.height - vh;
        p = range <= 0 ? 0 : -rect.top / range;
      }
      onChange(Math.min(1, Math.max(0, p)));
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
  }, [ref, onChange, mode]);
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
