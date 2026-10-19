import { useEffect } from 'react';

/**
 * The time of day, driven by scroll position.
 *
 * Five measured stops, from a bright late-October afternoon down to after
 * dark. Each one was checked against WCAG before it went in: body copy holds
 * at least 6.6:1 and labels at least 4.9:1 on every stop.
 *
 * The one hard problem is the crossover. Between the golden stop and the dusk
 * stop the ground passes through a band of mid lightness — roughly 0.13 to
 * 0.22 relative luminance — where neither black nor white reaches 4.5:1 against
 * it, and interpolating the text colour across that band takes it through grey,
 * where contrast collapses to about 1.2:1. So the text tones do not interpolate
 * across that segment at all: they switch in one step at the point where
 * dark-on-ground and light-on-ground are exactly equal (t = 0.503, both 3.96:1),
 * which is the best worst case available. The `band` section is sized so it is
 * the only thing on screen while that happens, and it fades with `--dim` as the
 * switch passes, which is what turns an unavoidable dip into the point of the
 * section.
 */

type Tone = {
  bg: string; fg: string; fg2: string; fg3: string; accent: string; onAccent: string;
};

const STOPS: Tone[] = [
  // DAY
  { bg: '#F4F1EA', fg: '#131210', fg2: '#4A443A', fg3: '#6E6659', accent: '#B5390F', onAccent: '#F4F1EA' },
  // AFTERNOON
  { bg: '#F1E7D4', fg: '#16130E', fg2: '#4B4234', fg3: '#6B6051', accent: '#A93410', onAccent: '#F8F1E4' },
  // GOLDEN
  { bg: '#E7BC84', fg: '#1A130B', fg2: '#473524', fg3: '#59442E', accent: '#862C07', onAccent: '#F6E6D2' },
  // DUSK
  { bg: '#3E2017', fg: '#F7EBDD', fg2: '#D6BFA9', fg3: '#B29880', accent: '#FF9456', onAccent: '#2A140D' },
  // NIGHT
  { bg: '#15120F', fg: '#F2EDE4', fg2: '#A89E8F', fg3: '#8C8273', accent: '#F2763C', onAccent: '#15120F' },
];

/** Index of the segment the palette switches across instead of blending. */
const FLIP_SEGMENT = 2;
/** Where in that segment dark-on-ground and light-on-ground are equal. */
const FLIP_AT = 0.503;

const KEYS = ['bg', 'fg', 'fg2', 'fg3', 'accent', 'onAccent'] as const;
const VAR: Record<(typeof KEYS)[number], string> = {
  bg: '--bg', fg: '--fg', fg2: '--fg-2', fg3: '--fg-3',
  accent: '--accent', onAccent: '--on-accent',
};

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const RGB = STOPS.map((s) => Object.fromEntries(
  KEYS.map((k) => [k, hex(s[k])]),
) as Record<(typeof KEYS)[number], number[]>);

const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)} ${Math.round(a[1] + (b[1] - a[1]) * t)} ${Math.round(a[2] + (b[2] - a[2]) * t)})`;

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const smooth = (x: number) => x * x * (3 - 2 * x);

export default function Sundown() {
  useEffect(() => {
    const root = document.documentElement;
    let anchors: number[] = [];
    let raf = 0;

    /**
     * Where each stop is fully reached, in document pixels. The sunset is
     * pinned to the band element rather than to a fraction of the page, so a
     * long case study and a short 404 both cross over in the same place —
     * inside the one section built to be empty while it happens.
     */
    const measure = () => {
      const vh = window.innerHeight;
      const band = document.querySelector<HTMLElement>('[data-sun="band"]');
      const noon = document.querySelector<HTMLElement>('[data-sun="noon"]');
      const docH = document.documentElement.scrollHeight;

      if (!band) {
        // No band on the page: spread the ramp over what there is.
        anchors = [0, docH * 0.3, docH * 0.55, docH * 0.72, Math.max(docH - vh, 1)];
        return;
      }
      const bandTop = band.getBoundingClientRect().top + window.scrollY;
      const noonTop = noon
        ? noon.getBoundingClientRect().top + window.scrollY
        : bandTop * 0.45;

      anchors = [
        0,
        Math.max(noonTop, 1),
        bandTop + vh * 0.26,
        bandTop + vh * 0.94,
        bandTop + vh * 1.5,
      ];
    };

    const paint = () => {
      raf = 0;
      // The sun is read at the middle of the viewport, not its top, so the
      // palette matches what is actually being looked at.
      const y = window.scrollY + window.innerHeight * 0.5;

      let i = 0;
      while (i < anchors.length - 2 && y >= anchors[i + 1]) i += 1;
      const span = anchors[i + 1] - anchors[i] || 1;
      const t = clamp((y - anchors[i]) / span, 0, 1);
      const e = smooth(t);

      const a = RGB[i];
      const b = RGB[i + 1];
      // Text tones step across the crossover segment; the ground never does.
      const flip = i === FLIP_SEGMENT;
      const textT = flip ? (t < FLIP_AT ? 0 : 1) : e;

      for (const k of KEYS) {
        root.style.setProperty(VAR[k], mix(a[k], b[k], k === 'bg' ? e : textT));
      }
      root.style.setProperty(
        '--dim',
        flip ? String(smooth(1 - Math.min(Math.abs(t - FLIP_AT) / 0.26, 1))) : '0',
      );
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const onResize = () => { measure(); onScroll(); };

    measure();
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Images and fonts settle after mount and move the anchors with them. The
    // height guard keeps this from re-entering: an observer that re-measures
    // on every notification is one layout read away from a feedback loop.
    let lastH = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastH) < 2) return;
      lastH = h;
      onResize();
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      for (const k of KEYS) root.style.removeProperty(VAR[k]);
      root.style.removeProperty('--dim');
    };
  }, []);

  return null;
}
