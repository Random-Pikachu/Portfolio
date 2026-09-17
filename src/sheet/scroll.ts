import type Lenis from 'lenis';
import Snap from 'lenis/snap';
import { sheetStore } from './store';

/**
 * The scroll layer. One Lenis instance (from SmoothScroll), one Snap, one
 * IntersectionObserver. Everything that moves the page goes through here so
 * the hash, the rail, the title block and keyboard focus always agree.
 *
 * Snapping is proximity in both modes, with a threshold of 45% of the
 * viewport on pointer devices and 25% on touch. With sheets one viewport
 * tall that settles every stop onto a sheet, and on a sheet taller than the
 * viewport it never drags the reader away from what they stopped on. That is
 * the guard rail from the plan: no scroll trap, ever.
 */
let lenis: Lenis | null = null;
let snap: Snap | null = null;
let observer: IntersectionObserver | null = null;
const sheets = new Map<HTMLElement, string>();
const visible = new Set<string>();
const order: string[] = [];
let plateRemovers: (() => void)[] = [];

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The site's in-out curve, as a function for Lenis. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function attachLenis(instance: Lenis) {
  lenis = instance;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  snap?.destroy();
  snap = new Snap(instance, {
    type: 'proximity',
    distanceThreshold: coarse ? '25%' : '45%',
    debounce: 400,
    duration: 0.9,
    easing: easeInOut,
  });
  sheets.forEach((_, el) => snap?.addElement(el, { align: 'start' }));
  instance.on('scroll', ({ progress }: { progress: number }) => sheetStore.set({ progress }));
}

export function detachLenis() {
  snap?.destroy();
  snap = null;
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
      // The deepest sheet in the band wins, which matches reading order.
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
  const remove = snap?.addElement(el, { align: 'start' });
  return () => {
    sheets.delete(el);
    visible.delete(id);
    observer?.unobserve(el);
    remove?.();
  };
}

/** Details registers one snap point per plate, in page pixels. */
export function setPlateSnaps(points: number[]) {
  plateRemovers.forEach((r) => r());
  plateRemovers = snap ? points.map((y) => snap!.add(y)) : [];
}

/**
 * A plate lives inside a transformed track, so its own position on the page
 * says nothing about where to scroll. Details registers the function that
 * knows; goTo asks it for ids that start with "project-".
 */
let plateResolver: ((slug: string) => number | null) | null = null;
export function registerPlateResolver(fn: ((slug: string) => number | null) | null) {
  plateResolver = fn;
}

/** Sideways trackpad input inside the strip becomes page scroll, at once. */
export function scrollByPixels(delta: number) {
  if (!lenis) {
    window.scrollBy(0, delta);
    return;
  }
  lenis.scrollTo(lenis.scroll + delta, { immediate: true });
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
  const resolved = id.startsWith('project-') ? plateResolver?.(id.slice('project-'.length)) : null;
  const top = resolved ?? el.getBoundingClientRect().top + window.scrollY;
  await scrollToY(top, { instant });
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
