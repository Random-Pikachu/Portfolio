/**
 * The land and the sky of the Night Shift, as numbers. Everything is drawn
 * from fixed seeds, so the prerendered HTML and the hydrated page draw the
 * same night, and nothing here touches the DOM.
 *
 * The scene lives in a 1600 by 1000 box. The horizon sits a little above
 * y 600; the house stands on the third ridge at HOUSE.x, on a shelf the
 * ridge is levelled to. Ridges are filled down to the bottom of the box, so
 * each nearer ridge covers the one behind it.
 */

export const W = 1600;
export const H = 1000;

/** Where the house stands: the middle of its wall, on the ground. */
export const HOUSE = { x: 1262, y: 748 } as const;

/** Mulberry32: small, fast and the same everywhere. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export interface RidgeSpec {
  seed: number;
  /** The ridge's mean height, in scene units from the top. */
  base: number;
  /** How far the first displacement may swing; each level halves it by `rough`. */
  amp: number;
  /** 0.4 is rolling, 0.6 is broken. */
  rough: number;
  /** A broad lift, for a peak that should be there on every seed: x, width, height. */
  peaks?: readonly (readonly [number, number, number])[];
  /** Level the ridge to y across x ± w/2, feathered over `feather` either side. */
  shelf?: { x: number; w: number; y: number; feather: number };
  /** A line of conifers along the crest. */
  trees?: { min: number; max: number; spacing: number; clear?: readonly [number, number] };
}

/** Heights at 129 evenly spaced samples across the box, by midpoint displacement. */
function heights(spec: RidgeSpec) {
  const N = 128;
  const rand = rng(spec.seed);
  const h = new Array<number>(N + 1).fill(spec.base);
  h[0] = spec.base + (rand() - 0.5) * spec.amp;
  h[N] = spec.base + (rand() - 0.5) * spec.amp;
  let step = N;
  let amp = spec.amp;
  while (step > 1) {
    const half = step / 2;
    for (let i = half; i < N; i += step) {
      h[i] = (h[i - half] + h[i + half]) / 2 + (rand() - 0.5) * amp;
    }
    amp *= spec.rough;
    step = half;
  }
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * W;
    for (const [px, pw, ph] of spec.peaks ?? []) {
      const d = (x - px) / (pw / 2);
      if (Math.abs(d) < 1) h[i] -= ph * (0.5 + 0.5 * Math.cos(Math.PI * d));
    }
    if (spec.shelf) {
      const { x: sx, w, y, feather } = spec.shelf;
      const d = Math.abs(x - sx) - w / 2;
      const t = d <= 0 ? 1 : d >= feather ? 0 : 0.5 + 0.5 * Math.cos((Math.PI * d) / feather);
      h[i] = h[i] * (1 - t) + y * t;
    }
  }
  return h;
}

/** The crest's height at any x, by linear interpolation between samples. */
function sampler(h: number[]) {
  const N = h.length - 1;
  return (x: number) => {
    const f = Math.min(N, Math.max(0, (x / W) * N));
    const i = Math.min(N - 1, Math.floor(f));
    return h[i] + (h[i + 1] - h[i]) * (f - i);
  };
}

/**
 * One ridge as a closed SVG path: the crest left to right, then down to the
 * bottom of the box and back. With trees, the crest carries a conifer line,
 * each tree a narrow spire, cleared where the house needs open ground.
 */
export function ridge(spec: RidgeSpec) {
  const h = heights(spec);
  const at = sampler(h);
  const pts: [number, number][] = [];
  if (!spec.trees) {
    h.forEach((y, i) => pts.push([(i / (h.length - 1)) * W, y]));
  } else {
    const rand = rng(spec.seed * 7 + 3);
    const { min, max, spacing, clear } = spec.trees;
    let x = -spacing;
    pts.push([0, at(0)]);
    while (x < W + spacing) {
      x += spacing * (0.55 + rand() * 0.9);
      const ground = at(Math.min(W, Math.max(0, x)));
      if (clear && x > clear[0] && x < clear[1]) {
        pts.push([x, ground]);
        continue;
      }
      // Some gaps, so the line reads as a forest edge and not a comb.
      if (rand() < 0.12) {
        pts.push([x, ground]);
        continue;
      }
      const tall = min + (max - min) * Math.pow(rand(), 1.6);
      const hw = tall * (0.16 + rand() * 0.08);
      pts.push([x - hw, ground + 1], [x - hw * 0.35, ground - tall * 0.55], [x, ground - tall], [x + hw * 0.35, ground - tall * 0.55], [x + hw, ground + 1]);
    }
    pts.push([W, at(W)]);
  }
  const crest = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${Math.round(x)} ${Math.round(y)}`).join('');
  return `${crest}L${W} ${H}L0 ${H}Z`;
}

export interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  /** Shown on wide screens only: phones get at most half the stars, and none behind their type. */
  wide: boolean;
}

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const inside = (b: Box | undefined, x: number, y: number) => !!b && x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1;

/**
 * A sparse field: low count, small, dim, thickest near the top of the sky
 * and thinning to nothing at the horizon. Nothing inside `clear`, the box
 * where the type sits on a wide screen; stars inside `phoneClear`, where the
 * type sits on a phone's crop, are kept for wide screens only. So no star
 * ever lands behind a letter.
 */
export function stars(seed: number, count: number, clear?: Box, phoneClear?: Box) {
  const rand = rng(seed);
  const out: Star[] = [];
  let tries = 0;
  while (out.length < count && tries++ < count * 20) {
    const x = rand() * W;
    const y = 24 + Math.pow(rand(), 1.5) * 500;
    const bright = rand() < 0.06;
    const r = bright ? 1.3 + rand() * 0.4 : 0.5 + rand() * 0.6;
    const a = bright ? 0.55 + rand() * 0.2 : 0.14 + rand() * 0.3;
    if (inside(clear, x, y)) continue;
    const wide = out.length % 2 === 1 || inside(phoneClear, x, y);
    out.push({ x: r1(x), y: r1(y), r: r1(r), a: Math.round(a * 100) / 100, wide });
  }
  return out;
}
