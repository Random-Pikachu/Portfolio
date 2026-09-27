import { useEffect } from 'react';

/**
 * The reveals: every element marked `data-reveal` rises 24px into place
 * once, when it first comes into view. The shells add the `js` class before
 * first paint, and only then does the CSS hide anything, so without
 * JavaScript nothing is ever hidden. Reduced motion, or no observer, shows
 * every final state at once. Renders nothing.
 */
export function Motion() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!els.length) return;
    const all = () => els.forEach((el) => el.classList.add('is-in'));
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      all();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
