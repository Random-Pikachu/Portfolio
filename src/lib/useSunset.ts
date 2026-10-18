import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { initialTheme, storeTheme, type Theme } from './sunset';
import { getServerTheme, getTheme, setTheme, subscribeTheme } from './themeStore';

/**
 * Theme, read from where it actually lives.
 *
 * An inline script in index.html resolves the theme and writes it to
 * <html data-theme> before first paint, so there is no flash of the wrong
 * sheet. React is a reader of that, not its owner, which is what
 * useSyncExternalStore is for.
 */
export function useSunset() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  useEffect(() => { setTheme(initialTheme()); }, []);

  const toggle = useCallback(() => {
    const next: Theme = getTheme() === 'dusk' ? 'lastlight' : 'dusk';
    setTheme(next);
    storeTheme(next);
  }, []);

  // `t` toggles. Ignored while typing into a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (e.key === 't' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  return { theme, toggle };
}
