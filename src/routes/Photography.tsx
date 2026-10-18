import Reveal from '../components/Reveal';
import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)}—${Math.max(...years)}` : '';

  return (
    <>
      <section className="page-head">
        <Reveal as="header">
          <h1 className="h1">Photography</h1>
          <p className="lede">
            All of it shot on a Nothing Phone (1). Mostly the hour before the
            light goes.
          </p>
          <p className="eyebrow">
            {PHOTOS.length} frames{span && ` · ${span}`} · hover for colour · click to open
          </p>
        </Reveal>
      </section>

      <section className="band band-wide">
        <h2 className="sr-only">Photo gallery</h2>
        <PhotoGrid />
      </section>
    </>
  );
}
