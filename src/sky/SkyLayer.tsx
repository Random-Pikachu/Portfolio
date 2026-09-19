import { FIELD, FIGURES, figurePath, figureStars } from './figures';
import { asteriskPath, starPaths } from './stars';

const STAR_PATHS = starPaths();
const ASTERISKS = asteriskPath();

/**
 * The sky, under everything. A fixed layer at z-index -2, below the grid's
 * ten columns, which read as the chart's graticule over it.
 *
 * Three things stack here. The chart: an SVG of the seeded star field and
 * the constellations, prerendered, so the sky is there at first paint and
 * without JavaScript; the journey pans it with one transform. The scene: a
 * canvas the WebGL module creates after hydration for the haze, the moon and
 * the marks that need shading; absent on phones, under reduced motion and
 * without WebGL2, and the chart stands alone. The grain: the same seeded
 * paper the cover wash is grained with, tiled over both.
 *
 * Nothing here differs between the server and the client's first render.
 */
export function SkyLayer() {
  return (
    <div className="sky" aria-hidden="true">
      <svg className="sky__chart" viewBox={`0 0 ${FIELD} ${FIELD}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <g className="sky__stars">
          {STAR_PATHS.map((d, m) => (
            <path key={m} className={`sky__m${m}`} d={d} />
          ))}
          <path className="sky__asterisks" d={ASTERISKS} />
        </g>
        <g className="sky__figures">
          {FIGURES.map((f) => (
            <g key={f.id} className="sky__figure" data-figure={f.id}>
              <path className="sky__figure-stars" d={figureStars(f)} />
              <path className="sky__figure-lines" d={figurePath(f)} pathLength={1} />
            </g>
          ))}
        </g>
      </svg>
      <div className="sky__grain" />
    </div>
  );
}
