import { easeInOut } from '../sheet/scroll';

/**
 * The journey: what the sky does at every scroll position, as keyframes on
 * the page's own pixels. Nothing here smooths anything; Lenis already does.
 *
 * Positions are measured once per layout (fonts, resize, the strip setting
 * its height), never per frame. Each frame reads scrollY, finds the segment,
 * eases between its two keys, writes one transform on the chart and hands
 * the state to the scene. The moon lives in page space, so while it is
 * attached to something on the page it scrolls with it, and between two
 * anchors it travels.
 */
export const CH = {
  camX: 0,
  camY: 1,
  zoom: 2,
  dust: 3,
  haze: 4,
  fog: 5,
  moonX: 6,
  moonY: 7,
  moonR: 8,
  rings: 9,
  beam: 10,
  N: 11,
} as const;

type Channel = Exclude<keyof typeof CH, 'N'>;
export type State = Float32Array;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Marks {
  vw: number;
  vh: number;
  vmin: number;
  maxScroll: number;
  sheets: Record<string, Rect>;
  transit: Rect | null;
  anchors: Record<string, Rect>;
}

export interface Key {
  y: number;
  v: State;
}

const IDS = ['cover', 'about', 'experience', 'projects', 'contact'];

function pageRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

export function measure(): Marks {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const sheets: Record<string, Rect> = {};
  for (const id of IDS) {
    const el = document.getElementById(id);
    if (el) sheets[id] = pageRect(el);
  }
  const anchors: Record<string, Rect> = {};
  for (const el of document.querySelectorAll<HTMLElement>('[data-anchor]')) anchors[el.dataset.anchor!] = pageRect(el);
  const transitEl = document.querySelector('.transit');
  return {
    vw,
    vh,
    vmin: Math.min(vw, vh),
    maxScroll: Math.max(0, document.documentElement.scrollHeight - vh),
    sheets,
    transit: transitEl ? pageRect(transitEl) : null,
    anchors,
  };
}

const centre = (r: Rect | undefined) => (r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : null);

/**
 * The keys, in order. A key names only the channels that change; the rest
 * hold from the key before. The first key is complete.
 */
export function buildKeys(m: Marks): Key[] {
  const { vw, vh, vmin } = m;
  const s = (id: string): Rect => m.sheets[id] ?? { x: 0, y: 0, w: vw, h: vh };
  const cover = s('cover');
  const about = s('about');
  const experience = s('experience');
  const projects = s('projects');
  const contact = s('contact');
  const keys: Key[] = [];
  let last: State | null = null;
  const key = (y: number, patch: Partial<Record<Channel, number>>) => {
    const v = new Float32Array(CH.N);
    if (last) v.set(last);
    for (const k of Object.keys(patch) as Channel[]) v[CH[k]] = patch[k]!;
    // Keys must not go backwards; a layout that folds two together keeps the later state.
    const prev = keys[keys.length - 1];
    if (prev && y <= prev.y) y = prev.y + 1;
    keys.push({ y, v });
    last = v;
  };

  // The frontispiece: the moon is the glyph on the plate, twenty pixels across.
  const coverMoon = centre(m.anchors['cover-moon']) ?? { x: vw * 0.8, y: vh * 0.35 };
  const coverMoonR = m.anchors['cover-moon'] ? (m.anchors['cover-moon'].w / 2) * (10 / 11) : 20;
  key(0, {
    camX: 0,
    camY: 0,
    zoom: 1,
    dust: 0.9,
    haze: 0.35,
    fog: 0,
    moonX: coverMoon.x,
    moonY: coverMoon.y,
    moonR: coverMoonR,
    rings: 0,
    beam: 0,
  });
  key(vh * 0.1, {});

  // The transit: empty sky, the moon at the centre of the viewport, sixty vmin across.
  const transitMid = m.transit ? m.transit.y + m.transit.h / 2 : cover.y + cover.h + vh * 0.3;
  const kTransit = transitMid - vh / 2;
  key(kTransit, { moonX: vw * 0.5, moonY: transitMid, moonR: vmin * 0.3, camY: 0.1, haze: 0.45 });

  // The observer: the moon lands in the opening of Fig. 1, at its diameter.
  const fig = m.anchors['fig-moon'];
  const figMoon = centre(fig) ?? { x: vw * 0.82, y: about.y + vh * 0.45 };
  const figR = fig ? fig.w / 2 : vmin * 0.14;
  key(about.y - vh * 0.3, { moonX: figMoon.x, moonY: figMoon.y, moonR: figR, camY: 0.14, haze: 0.5 });
  key(Math.max(about.y + about.h - vh, about.y - vh * 0.3 + 1), { camY: 0.16 });

  // The transits: the moon parks at the now tick; the orbits draw in.
  const now = centre(m.anchors['now']) ?? { x: vw - 80, y: experience.y + 160 };
  key(experience.y - vh * 0.6, { moonX: now.x, moonY: now.y, moonR: 22, rings: 0, camY: 0.18, haze: 0.55 });
  key(experience.y - vh * 0.1, { rings: 1 });
  key(Math.max(experience.y + experience.h - vh, experience.y), { camY: 0.2 });

  // The constellations: the moon sets; the sky pans with the strip.
  key(projects.y - vh * 0.5, { moonR: 0, rings: 0, camX: 0, haze: 0.6 });
  key(Math.max(projects.y + projects.h - vh, projects.y), { camX: -0.18, camY: 0.22 });

  // The transmission: looking back toward the horizon; the moon returns, low and left.
  const horizon = { x: m.sheets.contact ? contact.x + 64 : 88, y: contact.y + vh * 0.85 };
  key(contact.y - vh * 0.7, { camY: 0.12, zoom: 0.94, haze: 0.4, fog: 0.3, beam: 0, moonX: horizon.x, moonY: horizon.y, moonR: 0 });
  key(contact.y - vh * 0.2, { camY: 0.04, zoom: 0.9, haze: 0.28, fog: 0.55, beam: 1, moonR: 18 });
  key(Math.max(m.maxScroll, contact.y), { camY: 0, fog: 0.65 });
  return keys;
}

/** Eased interpolation between the two keys around `y`, into `out`. */
export function sample(keys: Key[], y: number, out: State) {
  if (keys.length === 0) return 0;
  if (y <= keys[0].y) {
    out.set(keys[0].v);
    return 0;
  }
  const lastKey = keys[keys.length - 1];
  if (y >= lastKey.y) {
    out.set(lastKey.v);
    return keys.length - 1;
  }
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].y <= y) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const u = easeInOut(Math.min(1, Math.max(0, (y - a.y) / (b.y - a.y))));
  for (let c = 0; c < CH.N; c++) out[c] = a.v[c] + (b.v[c] - a.v[c]) * u;
  return i + u;
}

/**
 * Runs the journey: measures, samples per frame, pans the chart, hands the
 * state to `onState`. Owns no rAF of its own; the scene calls `tick` from
 * its loop, or, with no scene, the chart alone is driven from a scroll
 * listener at one frame per event.
 */
export class Journey {
  marks: Marks | null = null;
  keys: Key[] = [];
  state: State = new Float32Array(CH.N);
  /** Segment index plus its eased position, for the debug overlay. */
  at = 0;
  private lastY = -1;
  private lastTransform = '';
  private ro: ResizeObserver | null = null;
  private chart: HTMLElement | null;
  private coverMoon: HTMLElement | null;
  private disposers: (() => void)[] = [];
  private onState: (s: State, m: Marks) => void;

  constructor(root: HTMLElement, onState: (s: State, m: Marks) => void) {
    this.onState = onState;
    this.chart = root.querySelector('.sky__chart');
    this.coverMoon = document.querySelector('[data-anchor="cover-moon"]');
    const remeasure = () => this.measure();
    this.ro = new ResizeObserver(remeasure);
    const main = document.getElementById('main');
    if (main) this.ro.observe(main);
    window.addEventListener('resize', remeasure);
    window.addEventListener('orientationchange', remeasure);
    this.disposers.push(() => {
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('orientationchange', remeasure);
      this.ro?.disconnect();
    });
    document.fonts?.ready.then(remeasure);
    this.measure();
  }

  measure() {
    this.marks = measure();
    this.keys = buildKeys(this.marks);
    this.lastY = -1;
    this.tick(true);
  }

  /** Samples the current scroll; returns true when anything changed. */
  tick(force = false): boolean {
    if (!this.marks) return false;
    const y = window.scrollY;
    if (!force && y === this.lastY) return false;
    this.lastY = y;
    this.at = sample(this.keys, y, this.state);
    const s = this.state;
    const m = this.marks;
    const transform = `translate3d(${(s[CH.camX] * m.vw).toFixed(1)}px, ${(s[CH.camY] * m.vh).toFixed(1)}px, 0) scale(${s[CH.zoom].toFixed(3)})`;
    if (this.chart && transform !== this.lastTransform) {
      this.chart.style.transform = transform;
      this.lastTransform = transform;
    }
    // Once the moon leaves the plate, the glyph there gives way to it.
    this.coverMoon?.classList.toggle('is-taken', y > m.vh * 0.1);
    this.onState(s, m);
    return true;
  }

  dispose() {
    this.disposers.forEach((d) => d());
    this.coverMoon?.classList.remove('is-taken');
    if (this.chart) this.chart.style.transform = '';
  }
}
