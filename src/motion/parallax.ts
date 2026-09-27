import { useEffect, type RefObject } from 'react';

/** How much of the scroll each depth lags behind the page: the sky most, the near ridge least. */
const LAG = [0.34, 0.26, 0.18, 0.1, 0.03];

/**
 * The hero's drift: as the page scrolls, each depth of the Nightscape
 * (`data-depth` 0 to 4) is held back by its own fraction of the travel, so
 * the far sky slides under the near ridge. Transform only, one frame per
 * scroll event, and only while the hero is on screen. Off on narrow
 * screens and under reduced motion, where the art stands still.
 */
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const layers = [...root.querySelectorAll<HTMLElement>('[data-depth]')];
    if (!layers.length) return;
    const wide = window.matchMedia('(min-width: 48rem)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let moving = false;

    const still = () => {
      moving = false;
      layers.forEach((l) => {
        l.style.transform = '';
        l.style.willChange = '';
      });
    };
    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      if (y > root.offsetHeight) return;
      for (const l of layers) {
        const k = LAG[Number(l.dataset.depth)] ?? 0;
        l.style.transform = `translate3d(0, ${(y * k).toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!moving || raf) return;
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      if (!wide.matches || reduce.matches) {
        still();
        return;
      }
      moving = true;
      layers.forEach((l) => (l.style.willChange = 'transform'));
      frame();
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    wide.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    return () => {
      window.removeEventListener('scroll', onScroll);
      wide.removeEventListener('change', sync);
      reduce.removeEventListener('change', sync);
      if (raf) cancelAnimationFrame(raf);
      still();
    };
  }, [ref]);
}
