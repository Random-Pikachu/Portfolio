/**
 * The constellations drawn on the chart. Cetus is the real Whale: its stars
 * are J2000 positions projected onto a box of the chart, right ascension
 * increasing to the left as on any star chart, the declination squashed so
 * the figure lies along the top of the frontispiece rather than across it.
 * The others are invented, and say so.
 */
import { FIELD } from './stars';

export interface Figure {
  id: string;
  name: string;
  /** Points in chart units. */
  stars: [number, number][];
  /** Index pairs into `stars`. */
  lines: [number, number][];
  /** Hover label; undefined for the unlabelled one. */
  label?: string;
}

type Equatorial = [raHours: number, decDegrees: number];

/** Projects equatorial coordinates onto a box: x0..x1 across, top at y0, `squash` on the declination. */
function project(stars: Equatorial[], box: { x0: number; x1: number; y0: number; squash: number }): [number, number][] {
  const ras = stars.map((s) => s[0]);
  const decs = stars.map((s) => s[1]);
  const ra1 = Math.max(...ras);
  const d1 = Math.max(...decs);
  const width = (ra1 - Math.min(...ras)) * 15;
  const k = (box.x1 - box.x0) / width;
  return stars.map(([ra, dec]) => [Math.round(box.x0 + (ra1 - ra) * 15 * k), Math.round(box.y0 + (d1 - dec) * k * box.squash)]);
}

const h = (hh: number, mm: number) => hh + mm / 60;
const d = (dd: number, mm: number) => Math.sign(dd) * (Math.abs(dd) + mm / 60);

// α Menkar, λ, μ, ξ², ν, γ Kaffaljidhma, δ, ο Mira, ζ Baten Kaitos, τ, β Diphda, ι, η, θ.
const CETUS: Equatorial[] = [
  [h(3, 2.3), d(4, 5)],
  [h(2, 59.7), d(8, 54)],
  [h(2, 44.9), d(10, 7)],
  [h(2, 28.2), d(8, 28)],
  [h(2, 35.9), d(5, 35)],
  [h(2, 43.3), d(3, 14)],
  [h(2, 39.5), d(0, 20)],
  [h(2, 19.3), d(-2, 59)],
  [h(1, 51.5), d(-10, 20)],
  [h(1, 44.1), d(-15, 56)],
  [h(0, 43.6), d(-17, 59)],
  [h(0, 19.4), d(-8, 49)],
  [h(1, 8.6), d(-10, 11)],
  [h(1, 24.0), d(-8, 11)],
];

export const CETUS_FIGURE: Figure = {
  id: 'cetus',
  name: 'Cetus',
  label: 'Cet',
  stars: project(CETUS, { x0: 380, x1: 980, y0: 690, squash: 0.6 }),
  // The head is a loop; the body runs from the head to the tail and closes on ζ.
  lines: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 8],
  ],
};

/**
 * Not in the IAU's eighty-eight. Nine stars over the transmission: two ears,
 * a face, a tail like lightning. Unlabelled on the chart; its catalogue entry
 * is in the footer of the last chart, and its label appears while that
 * chart is the one being read.
 */
const P = (x: number, y: number): [number, number] => [1180 + Math.round(x * 0.95), 640 + Math.round(y * 0.95)];
export const FIGURE_025: Figure = {
  id: '025',
  name: 'Constellation 025',
  label: '025',
  stars: [P(6, 0), P(46, 44), P(110, 44), P(150, 2), P(148, 96), P(80, 124), P(28, 92), P(196, 118), P(176, 150)],
  lines: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
    [4, 7], [7, 8],
  ],
};

export const FIGURES: Figure[] = [CETUS_FIGURE, FIGURE_025];

/** SVG path data for a figure's lines. */
export function figurePath(f: Figure) {
  return f.lines.map(([a, b]) => `M${f.stars[a][0]} ${f.stars[a][1]}L${f.stars[b][0]} ${f.stars[b][1]}`).join('');
}

/** SVG path data for a figure's stars as dots. */
export function figureStars(f: Figure) {
  return f.stars.map(([x, y]) => `M${x} ${y}h0`).join('');
}

export { FIELD };
