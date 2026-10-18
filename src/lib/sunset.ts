/**
 * The sunset. Not a theme flip — a scripted sequence in which several channels
 * animate over different, overlapping sub-ranges of one timeline.
 *
 * Forward (light → dusk) runs 1600ms. Reverse runs 1100ms, because dawn is
 * quicker than dusk and matching the two makes the return feel sluggish.
 *
 * Each channel's window is stored as a fraction of the whole, so the reverse
 * pass gets the same choreography compressed rather than a separate script.
 */

export type Theme = 'lastlight' | 'dusk';

/** Channel windows as fractions of the full sequence. See docs/REDESIGN.md §4. */
const WINDOW = {
  // The colour passage is the reason this sequence exists, so it gets most of
  // the runway. An earlier cut gave it 600ms of 1600 and it was over before
  // the eye had settled on it.
  sky:    [0.0,    0.6875],  //    0 – 1100ms — the colour passage
  text:   [0.1562, 0.625 ],  //  250 – 1000ms — staggered top to bottom
  grain:  [0.375,  0.375 ],  //  600ms        — a step, not a ramp
  stars:  [0.5,    0.9375],  //  800 – 1500ms
  accent: [0.5625, 1.0   ],  //  900ms on, overshooting before it settles
} as const;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Progress within one channel's window, given progress through the whole. */
function windowed(p: number, [a, b]: readonly [number, number]) {
  return b <= a ? (p >= a ? 1 : 0) : clamp01((p - a) / (b - a));
}

const easeGlide = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Overshoot and settle. Passes its target by ~6% before returning, so the
 * accent lands with weight. The anime principle, as a number.
 */
function easeSettle(t: number) {
  const c = 1.70158 * 0.62;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

export interface SunsetChannels {
  /** Drives the shader's dusk uniform. */
  sky: number;
  /** Text colour crossfade. */
  text: number;
  grain: number;
  stars: number;
  /** Overshoots past 1 before settling — do not clamp when interpolating. */
  accent: number;
}

export interface SunsetOptions {
  onFrame(ch: SunsetChannels, theme: Theme): void;
  onDone?(theme: Theme): void;
  /** Skip the choreography entirely. */
  reducedMotion?: boolean;
}

export class Sunset {
  private raf = 0;
  private theme: Theme;
  private opts: SunsetOptions;

  constructor(initial: Theme, opts: SunsetOptions) {
    this.theme = initial;
    this.opts = opts;
  }

  get current(): Theme {
    return this.theme;
  }

  /** Channel values at rest for a theme. */
  static settled(theme: Theme): SunsetChannels {
    const v = theme === 'dusk' ? 1 : 0;
    return { sky: v, text: v, grain: v, stars: v, accent: v };
  }

  toggle() {
    this.to(this.theme === 'dusk' ? 'lastlight' : 'dusk');
  }

  to(next: Theme) {
    if (next === this.theme) return;
    cancelAnimationFrame(this.raf);

    const forward = next === 'dusk';
    this.theme = next;

    if (this.opts.reducedMotion) {
      this.opts.onFrame(Sunset.settled(next), next);
      this.opts.onDone?.(next);
      return;
    }

    const duration = forward ? 1600 : 1100;
    const t0 = performance.now();

    const step = (now: number) => {
      // p always runs 0→1 through the choreography; on the reverse pass each
      // channel value is mirrored at the end, so one script serves both.
      const p = clamp01((now - t0) / duration);

      const ch: SunsetChannels = {
        sky:    easeGlide(windowed(p, WINDOW.sky)),
        text:   easeGlide(windowed(p, WINDOW.text)),
        grain:  windowed(p, WINDOW.grain),
        stars:  easeGlide(windowed(p, WINDOW.stars)),
        accent: easeSettle(windowed(p, WINDOW.accent)),
      };

      if (!forward) {
        ch.sky = 1 - ch.sky;
        ch.text = 1 - ch.text;
        ch.grain = 1 - ch.grain;
        ch.stars = 1 - ch.stars;
        ch.accent = 1 - ch.accent;
      }

      this.opts.onFrame(ch, next);

      if (p < 1) {
        this.raf = requestAnimationFrame(step);
      } else {
        this.opts.onFrame(Sunset.settled(next), next);
        this.opts.onDone?.(next);
      }
    };

    this.raf = requestAnimationFrame(step);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

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
