import { useCallback, useRef } from 'react';
import { Art } from '../components/Art';
import { ART } from '../data/art';
import { SITE } from '../data/site';
import { DimensionLine } from '../sheet/DimensionLine';
import { MoonGlyph } from '../sheet/MoonGlyph';
import { useMoon } from '../sheet/useMoon';
import { useScrollProgress } from '../sheet/useScrollProgress';
import { reducedMotion } from '../sheet/scroll';
import { Whale } from '../sky/Whale';

const MOON = ART.frontispiece.anchors.moon;

/**
 * Chart 00, the frontispiece. The name and one line on the left five
 * columns, the call button with its quantity, and on the right five columns
 * the plate: a night sky made from three of my photographs, with the moon at
 * its real phase and one dimension that measures the distance from the moon
 * to the ridge. A whale starts inside the plate and, as the chart scrolls
 * away, swims out of its frame and behind the name. Scale: not to scale.
 */
export function Cover() {
  const moon = useMoon();
  const gridRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLElement>(null);
  // The plate hangs a little loose in its frame: it drifts a few percent
  // against the scroll, the one slow motion on the cover besides the whale.
  const onDrift = useCallback((p: number) => {
    const img = plateRef.current?.querySelector<HTMLElement>('img');
    if (img) img.style.translate = `0 ${((p - 0.5) * -7).toFixed(2)}%`;
  }, []);
  useScrollProgress(plateRef, reducedMotion() ? () => {} : onDrift, 'enter');
  // The whale's crossing: from the first scroll, done within half a viewport
  // of travel while the name is still on the page, easing out as it goes.
  // The chart sits at the top of the page, so the page's own scroll is its
  // progress. CSS turns --wp into the translation.
  const onCross = useCallback(() => {
    const p = Math.min(1, window.scrollY / (window.innerHeight * 0.5));
    const q = 1 - Math.pow(1 - p, 3);
    gridRef.current?.style.setProperty('--wp', q.toFixed(3));
  }, []);
  useScrollProgress(gridRef, reducedMotion() ? () => {} : onCross, 'leave');
  return (
    <div className="sheet cover">
      <div ref={gridRef} className="grid-8 cover__grid">
        <div className="cover__text">
          <DimensionLine label="5 col" className="cover__dim-cols" draw />
          <h1 id="cover-h1" tabIndex={-1} data-sheet-heading className="t-display-1 cover__name">
            <span className="sr-only">
              {SITE.name} — {SITE.jobTitle}
            </span>
            <span aria-hidden="true" className="block">
              Sangam
            </span>
            <span aria-hidden="true" className="block">
              Pratap Singh
            </span>
          </h1>
          <p className="t-body cover__lede">
            I build full-stack and systems software. Legal tech at Retsguide by day, KDE Plasma patches by night.
          </p>
          <p className="cover__cta">
            <a href={SITE.calendar} target="_blank" rel="noopener" className="btn-accent arrow-link">
              Book a 15-minute call
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <span className="t-label cover__qty" aria-label="Quantity one">
              Qty 1
            </span>
          </p>
        </div>

        <figure ref={plateRef} className="cover__wash wash">
          <Art name="frontispiece" eager sizes="(max-width: 47.99rem) 100vw, 46vw" alt="" />
          <span className="wash__moon" data-anchor="moon" aria-hidden="true" style={{ left: `${MOON[0] * 100}%`, top: `${MOON[1] * 100}%` }}>
            <MoonGlyph phase={moon} size={44} />
          </span>
          <DimensionLine label="384 400 km" vertical className="wash__dim" draw />
          <figcaption className="sr-only">
            A night sky made from three of my photographs: bare branches, a cloud lit from behind, and a treeline dissolving into
            mist. The moon is drawn at tonight&apos;s phase.
          </figcaption>
        </figure>

        <div className="cover__whale" aria-hidden="true">
          <Whale />
        </div>
      </div>
    </div>
  );
}
