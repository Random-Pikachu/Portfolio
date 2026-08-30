import { useEffect, useRef } from 'react';

/**
 * Adds `is-in` to elements once they scroll into view, driving the `.ph-reveal`
 * transition in index.css.
 *
 * This exists instead of Framer Motion's useInView because the photography page
 * is a separate bundle and its whole job is delivering image bytes — pulling in
 * an animation library to fade 27 tiles would be the wrong trade. The easing
 * matches FadeUp on the home page so both pages feel the same.
 *
 * Returns a ref for the container; every descendant with `.ph-reveal` is watched.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>('.ph-reveal');
    if (!targets.length) return;

    // No IntersectionObserver (or reduced motion): show everything immediately
    // rather than leaving the page blank.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
