import type Lenis from 'lenis';
import { sheetStore } from './store';

/**
 * The scroll layer. One Lenis instance (from SmoothScroll) and one
 * IntersectionObserver. Everything that moves the page goes through here so
 * the hash, the rail, the title block and keyboard focus always agree.
 *
 * There is no snapping: the reader owns the scroll position, always. Sheets
 * flow in normal document order and every stop is the reader's own.
 */
let lenis: Lenis | null = null;
let observer: IntersectionObserver | null = null;
const sheets = new Map<HTMLElement, string>();
const visible = new Set<string>();
const order: string[] = [];

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The site's in-out curve, as a function for Lenis. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function attachLenis(instance: Lenis) {
  lenis = instance;
  instance.on('scroll', ({ progress }: { progress: number }) => sheetStore.set({ progress }));
}

export function detachLenis() {
  lenis = null;
}

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const id = sheets.get(e.target as HTMLElement);
        if (!id) continue;
        if (e.isIntersecting) visible.add(id);
        else visible.delete(id);
      }
      // The deepest sheet in the band wins, which matches reading order. If
      // nothing crosses the band for a frame, the last answer stands.
      if (visible.size === 0) return;
      let next = order[0] ?? 'cover';
      for (let i = order.length - 1; i >= 0; i--) {
        if (visible.has(order[i])) {
          next = order[i];
          break;
        }
      }
      if (sheetStore.get().sheet !== next) {
        sheetStore.set({ sheet: next });
        // The hash follows the reader, without a history entry per sheet.
        syncHash(next === order[0] ? '' : `#${next}`);
      }
    },
    { rootMargin: '-45% 0px -55% 0px', threshold: 0 }
  );
}

/** Sections call this once mounted; returns the cleanup. */
export function registerSheet(el: HTMLElement, id: string) {
  sheets.set(el, id);
  if (!order.includes(id)) order.push(id);
  ensureObserver();
  observer?.observe(el);
  return () => {
    sheets.delete(el);
    visible.delete(id);
    observer?.unobserve(el);
  };
}

export function scrollToY(y: number, { instant = false } = {}) {
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
 * Scroll to a sheet or plate by id, then set the hash without a history
 * entry and move keyboard focus to the sheet's heading.
 */
export async function goTo(id: string, { instant = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  // A plate lives on the horizontal strip: bring its sheet into frame, then
  // slide the strip to the plate.
  const strip = el.closest<HTMLElement>('[data-hscroll]');
  const target = strip?.closest('section') ?? el;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - margin;
  await scrollToY(top, { instant });
  if (strip) {
    strip.scrollTo({
      left: (el as HTMLElement).offsetLeft - strip.offsetLeft,
      behavior: instant || reducedMotion() ? 'auto' : 'smooth',
    });
  }
  syncHash(`#${id}`);
  focusHeading(el);
}

export function syncHash(hash: string) {
  if (typeof history === 'undefined') return;
  const current = location.hash;
  if (current === hash) return;
  history.replaceState(null, '', hash || location.pathname + location.search);
}

export function focusHeading(el: HTMLElement) {
  const heading =
    el.querySelector<HTMLElement>('[data-sheet-heading], [data-plate-heading]') ?? el.querySelector<HTMLElement>('h1, h2, h3');
  heading?.focus({ preventScroll: true });
}

/** Lenis must stop while a dialog is open. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}
