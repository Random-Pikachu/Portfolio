import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';
import { SITE } from '../data/site';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean);
  const span = years.length
    ? `${Math.min(...years.map(Number))}—${Math.max(...years.map(Number))}`
    : '';

  return (
    <main id="main" className="bg-bg-base text-text-base font-mono min-h-screen">
      <section className="px-6 pt-32 pb-16" aria-labelledby="photography-heading">
        <div className="max-w-[1200px] mx-auto">
          <p className="mono text-accent text-sm tracking-[0.2em] mb-2" aria-hidden="true">
            [ 05 ]
          </p>
          <h1
            id="photography-heading"
            className="text-text-base text-2xl font-semibold tracking-tight mb-4"
          >
            <span aria-hidden="true">photography</span>
            <span className="sr-only">Photography by {SITE.name}</span>
          </h1>

          <p className="text-text-light text-base leading-[1.9] max-w-[580px]">
            All of it shot on a <span className="text-text-muted font-medium">Nothing Phone (1)</span>.
          </p>

          <p className="mono text-text-faint text-xs tracking-[0.15em] mt-6">
            {PHOTOS.length} frames{span && ` · ${span}`} · hover for colour · click to open
          </p>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="sr-only">Photo gallery</h2>
          <PhotoGrid />
        </div>
      </section>
    </main>
  );
}
