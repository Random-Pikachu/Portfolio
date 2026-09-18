import { useCallback, useRef } from 'react';
import { SITE } from '../data/site';
import { DimensionLine } from '../sheet/DimensionLine';
import { MoonGlyph } from '../sheet/MoonGlyph';
import { useMoon } from '../sheet/useMoon';
import { useScrollProgress } from '../sheet/useScrollProgress';
import { reducedMotion } from '../sheet/scroll';

/**
 * Sheet 00. The name and one line on the left five columns, the call
 * button with its quantity, and on the right five columns the wash, with
 * the moon at its real phase and one dimension that measures the
 * distance from the moon to the ridge. Scale: not to scale.
 */
export function Cover() {
  const moon = useMoon();
  // The wash hangs a little loose in its frame: it drifts a few percent
  // against the scroll, the one slow motion on the cover.
  const washRef = useRef<HTMLElement>(null);
  const onDrift = useCallback((p: number) => {
    const img = washRef.current?.querySelector<HTMLElement>('img');
    if (img) img.style.translate = `0 ${((p - 0.5) * -7).toFixed(2)}%`;
  }, []);
  useScrollProgress(washRef, reducedMotion() ? () => {} : onDrift, 'enter');
  return (
    <div className="sheet cover">
      <div className="grid-8 cover__grid">
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

        <figure ref={washRef} className="cover__wash wash">
          <picture>
            <source media="(max-width: 47.99rem)" srcSet="/wash/cover-phone.webp" width={720} height={900} />
            <img
              src="/wash/cover-1600.webp"
              srcSet="/wash/cover-960.webp 960w, /wash/cover-1600.webp 1600w"
              sizes="(max-width: 47.99rem) 100vw, 46vw"
              width={1600}
              height={1200}
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <span className="wash__moon" aria-hidden="true">
            <MoonGlyph phase={moon} size={44} />
          </span>
          <DimensionLine label="384 400 km" vertical className="wash__dim" draw />
          <figcaption className="sr-only">
            An ink wash made from three of my photographs: bare branches, a cloud, and a treeline dissolving into mist. The moon is
            drawn at tonight&apos;s phase.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
