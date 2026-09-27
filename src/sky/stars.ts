/**
 * The star field, computed rather than drawn. A seeded generator (mulberry32,
 * seed 25) places every star, so the prerendered SVG and the hydrated tree
 * carry the same sky, and so the field never changes between builds.
 *
 * Coordinates are in the chart's viewBox units, 0..2000 on both axes. The
 * chart is a square sliced to a box 140% of the viewport, so at rest a
 * 16:10 window sees roughly x 290..1710 and y 550..1450; the margin around
 * that is what the journey pans into.
 */
export const SKY_SEED = 25;
export const FIELD = 2000;
export const STAR_COUNT = 720;

export interface Star {
  x: number;
  y: number;
  /** Magnitude class, 0 faint to 3 bright. */
  m: 0 | 1 | 2 | 3;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function field(seed: number, count: number): Star[] {
  const rand = mulberry32(seed);
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(rand() * FIELD);
    const y = Math.round(rand() * FIELD);
    // Most stars are faint: the cube keeps four in five in the two lowest classes.
    const b = rand() ** 3;
    const m = (b < 0.5 ? 0 : b < 0.8 ? 1 : b < 0.95 ? 2 : 3) as Star['m'];
    out.push({ x, y, m });
  }
  return out;
}

export const STARS: Star[] = field(SKY_SEED, STAR_COUNT);

/** One path per magnitude class: dots as zero-length strokes with round caps. */
export function starPaths() {
  const d: string[] = ['', '', '', ''];
  for (const s of STARS) d[s.m] += `M${s.x} ${s.y}h0`;
  return d;
}

/** The brightest stars again, as four-ray asterisks. */
export function asteriskPath(r = 7) {
  let d = '';
  for (const s of STARS) if (s.m === 3) d += `M${s.x - r} ${s.y}h${2 * r}M${s.x} ${s.y - r}v${2 * r}`;
  return d;
}
