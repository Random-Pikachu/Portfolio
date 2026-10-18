import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { createSky, type Sky } from './sky';
import {
  Sunset, initialTheme, storeTheme, type SunsetChannels,
} from './sunset';
import { getServerTheme, getTheme, setTheme, subscribeTheme } from './themeStore';

/** Where the warm source sits at each end of the day, in viewport fractions. */
const SUN = { dayY: 0.74, nightY: -0.06, dayX: 0.78, nightX: 0.88 };

/**
 * Owns the theme, the canvas and the sunset choreography.
 *
 * The sky and sunset modules underneath are framework-free on purpose — this
 * hook is the only React in the whole pipeline, so the same shader serves the
 * site, the prerender (where it simply never mounts) and anything later.
 */
export function useSunset(ink = 1) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const skyRef = useRef<Sky | null>(null);
  const sunsetRef = useRef<Sunset | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const inkRef = useRef(ink);

  const paint = useCallback((ch: SunsetChannels) => {
    skyRef.current?.setDusk(ch.sky);
    skyRef.current?.setStars(ch.stars);
    skyRef.current?.setGrain(0.035 + ch.grain * 0.02);
    skyRef.current?.setInk(inkRef.current);
    skyRef.current?.setSun(
      SUN.dayX + (SUN.nightX - SUN.dayX) * ch.sky,
      SUN.dayY + (SUN.nightY - SUN.dayY) * ch.sky,
    );
    const root = document.documentElement;
    root.style.setProperty('--p-sky', String(ch.sky));
    root.style.setProperty('--p-accent', String(ch.accent));

    // Flip the attribute at the midpoint of the text crossfade rather than at
    // either end, so the swap hides inside the busiest part of the move.
    setTheme(ch.text >= 0.5 ? 'dusk' : 'lastlight');
  }, []);

  // Route changes only alter plate strength, so repaint rather than rebuild.
  // The ref is written here, not during render, so a concurrent render that
  // never commits cannot leave it describing a route that was abandoned.
  useEffect(() => {
    inkRef.current = ink;
    skyRef.current?.setInk(ink);
  }, [ink]);

  useEffect(() => {
    const start = initialTheme();
    setTheme(start);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sunset = new Sunset(start, {
      reducedMotion: reduced,
      onFrame: paint,
      onDone: (t) => {
        setTheme(t);
        storeTheme(t);
      },
    });
    sunsetRef.current = sunset;

    if (canvasRef.current) {
      skyRef.current = createSky(canvasRef.current, {
        dusk: start === 'dusk' ? 1 : 0,
        fps: 30,
      });
      // No WebGL is not an error: the CSS fallback under the canvas is the
      // design's floor, and the canvas is only ever an upgrade.
      if (!skyRef.current) canvasRef.current.dataset.fallback = 'true';
    }
    paint(Sunset.settled(start));

    return () => {
      sunset.destroy();
      skyRef.current?.destroy();
      skyRef.current = null;
    };
  }, [paint]);

  const toggle = useCallback(() => sunsetRef.current?.toggle(), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (e.key === 't' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        sunsetRef.current?.toggle();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { theme, toggle, canvasRef };
}
