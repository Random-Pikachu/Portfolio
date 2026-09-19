import { useEffect, useRef } from 'react';
import { sheetStore } from '../sheet/store';
import { useMoon } from '../sheet/useMoon';
import { FIELD, FIGURES, figurePath, figureStars } from './figures';
import { Moon } from './Moon';
import { decideTier } from './quality';
import { asteriskPath, starPaths } from './stars';
import type { SceneController } from './scene';

const STAR_PATHS = starPaths();
const ASTERISKS = asteriskPath();

/**
 * The sky, under everything. A fixed layer at z-index -2, below the grid's
 * ten columns, which read as the chart's graticule over it.
 *
 * Three things stack here. The chart: an SVG of the seeded star field and
 * the constellations, prerendered, so the sky is there at first paint and
 * without JavaScript; the journey pans it with one transform. The scene: a
 * canvas the WebGL module creates after hydration for the haze, the dust
 * and the marks that need shading; absent on phones, under reduced motion
 * and without WebGL2, and the chart stands alone. The grain: the same
 * seeded paper the cover wash is grained with, tiled over both.
 *
 * And above the page, the moon that travels, which the journey moves.
 *
 * Nothing here differs between the server and the client's first render;
 * the scene is created imperatively, in an effect, after an idle moment.
 */
export function SkyLayer() {
  const host = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const phase = useMoon();

  // Which chart is being read, for the marks that only speak on one of them.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const sync = () => {
      el.dataset.chart = sheetStore.get().sheet;
    };
    sync();
    return sheetStore.subscribe(sync);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const params = new URLSearchParams(location.search);
    const tier = decideTier(params.get('sky'));
    el.dataset.mode = tier === 'off' ? 'off' : 'static';
    if (tier === 'off' || tier === 'static') return;
    let ctl: SceneController | null = null;
    let cancelled = false;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(async () => {
      const { mount } = await import('./scene');
      if (cancelled) return;
      ctl = mount(el, {
        tier,
        moon: moonRef.current?.firstElementChild as HTMLElement | null,
        debug: params.has('debug'),
        onFallback: () => {
          el.dataset.mode = 'static';
        },
      });
      el.dataset.mode = 'gl';
    });
    return () => {
      cancelled = true;
      cancelIdle(id);
      ctl?.dispose();
      delete el.dataset.mode;
    };
  }, []);

  return (
    <>
      <div ref={host} className="sky" aria-hidden="true">
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
                {f.label ? (
                  <text className="sky__figure-label" x={f.stars[0][0] + 12} y={f.stars[0][1] - 12}>
                    {f.label}
                  </text>
                ) : null}
              </g>
            ))}
          </g>
        </svg>
        <div className="sky__grain" />
      </div>
      <div ref={moonRef}>
        <Moon phase={phase} />
      </div>
    </>
  );
}
