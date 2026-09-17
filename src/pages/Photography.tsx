import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';
import { SITE } from '../data/site';
import { Sheet } from '../sheet/Sheet';

/**
 * /photography, the survey sheet: every frame on one sheet, the packer
 * unchanged, the print in the lightbox unchanged. Monochrome until hovered,
 * as a contact sheet is until the print is made.
 */
export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean);
  const span = years.length ? `${Math.min(...years.map(Number))}–${Math.max(...years.map(Number))}` : '';

  return (
    <main id="main" className="min-h-screen">
      <Sheet
        id="survey"
        kind="Survey"
        num=""
        block="Photography"
        heading={`Photography by ${SITE.name}`}
        caption={`${PHOTOS.length} frames${span ? ` · ${span}` : ''} · Nothing Phone (1)`}
      >
        <div className="sheet survey">
          <p className="t-pull survey__line">
            All of it shot on a Nothing Phone (1), mostly while walking somewhere else.
          </p>
          <p className="t-label survey__hint" aria-hidden="true">
            hover for colour · click to open
          </p>
          <h2 className="sr-only">Photo gallery</h2>
          <PhotoGrid />
        </div>
      </Sheet>
    </main>
  );
}
