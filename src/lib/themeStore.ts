import type { Theme } from './sunset';

/**
 * The theme lives on <html data-theme>, set by an inline script before first
 * paint so there is no flash of the wrong sheet. React is therefore a reader
 * of external state here, not its owner — which is exactly what
 * useSyncExternalStore is for, and why this is not component state.
 */
const listeners = new Set<() => void>();
let snapshot: Theme = 'lastlight';

export function subscribeTheme(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** Must return a cached value, or React re-renders forever. */
export function getTheme(): Theme {
  return snapshot;
}

/** The server has no DOM and renders the default sheet. */
export function getServerTheme(): Theme {
  return 'lastlight';
}

/** Writes the attribute and notifies readers. The single place both happen. */
export function setTheme(next: Theme) {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = next;
  if (snapshot === next) return;
  snapshot = next;
  for (const fn of listeners) fn();
}
