import type Lenis from 'lenis';

/**
 * The scroll layer: one Lenis instance, handed over by SmoothScroll. Anything
 * that moves the page goes through here, so the hash and keyboard focus
 * always agree with where the reader lands.
 */
let lenis: Lenis | null = null;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The site's in-out curve, as a function for Lenis. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function attachLenis(instance: Lenis) {
  lenis = instance;
}

export function detachLenis() {
  lenis = null;
}

function scrollToY(y: number, { instant = false } = {}) {
  if (!lenis) {
    window.scrollTo({ top: y, behavior: instant || reducedMotion() ? 'auto' : 'smooth' });
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    lenis!.scrollTo(y, {
      immediate: instant || reducedMotion(),
      duration: 0.9,
      easing: easeInOut,
      lock: true,
      onComplete: () => resolve(),
    });
  });
}

/**
 * Scroll to a section by id, set the hash without a history entry, and move
 * keyboard focus to the section's heading. Returns false when there is no
 * such section, so a link can fall back to its plain behaviour.
 */
export function goTo(id: string, { instant = false, focus = true } = {}) {
  const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
  if (!el) return false;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const top = el.getBoundingClientRect().top + window.scrollY - margin;
  scrollToY(top, { instant }).then(() => {
    syncHash(id === 'top' ? '' : `#${id}`);
    if (focus) focusHeading(el);
  });
  return true;
}

function syncHash(hash: string) {
  if (location.hash === hash) return;
  history.replaceState(null, '', hash || location.pathname + location.search);
}

function focusHeading(el: HTMLElement) {
  const heading = el.querySelector<HTMLElement>('h1, h2, h3');
  if (!heading) return;
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

/** Lenis must stop while a dialog or the menu is open. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}
