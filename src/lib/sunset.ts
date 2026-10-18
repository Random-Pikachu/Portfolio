export type Theme = 'lastlight' | 'dusk';

/* ─── Which theme a first-time visitor gets ────────────────────────────────
   Their local clock, not ours. Arriving at 9pm in Berlin opens the site at
   dusk and explains itself without a word. A stored choice always wins.
   ────────────────────────────────────────────────────────────────────────── */

const STORE_KEY = 'll:theme';

export function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORE_KEY);
    return v === 'dusk' || v === 'lastlight' ? v : null;
  } catch {
    // Private windows and blocked storage both throw. Not an error here.
    return null;
  }
}

export function storeTheme(t: Theme) {
  try {
    localStorage.setItem(STORE_KEY, t);
  } catch { /* nothing to do, and nothing worth telling the visitor */ }
}

export function themeFromClock(now = new Date()): Theme {
  const h = now.getHours();
  return h >= 18 || h < 7 ? 'dusk' : 'lastlight';
}

export function initialTheme(): Theme {
  // The inline script in index.html already resolved this before first paint.
  // Read what it decided so the app cannot disagree with what is on screen.
  if (typeof document !== 'undefined') {
    const painted = document.documentElement.dataset.theme;
    if (painted === 'dusk' || painted === 'lastlight') return painted;
  }
  return readStoredTheme() ?? themeFromClock();
}
