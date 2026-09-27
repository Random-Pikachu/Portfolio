import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';
import { PageHead } from '../shell/PageHead';

/**
 * /photography: every frame, the packer unchanged, the print in the lightbox
 * unchanged. Monochrome until hovered where hover exists, in colour where it
 * does not.
 */
export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)}-${Math.max(...years)}` : '';

  return (
    <main id="main" className="min-h-screen">
      <PageHead label="Photos" title="Photography" caption={`${PHOTOS.length} frames${span ? ` · ${span}` : ''} · Nothing Phone (1)`} />
      <div className="frame survey">
        <p className="t-lead survey__line">All of it shot on a Nothing Phone (1), mostly while walking somewhere else.</p>
        <p className="t-micro survey__hint">Tap a frame for the print and what the camera recorded.</p>
        <h2 className="sr-only">Photo gallery</h2>
        <PhotoGrid />
      </div>
    </main>
  );
}
