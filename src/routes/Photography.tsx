import Reveal from '../components/Reveal';
import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';

  return (
    <>
      <Reveal as="section" className="intro">
        <h1>Photography</h1>
        <p className="role">
          All of it on a Nothing Phone (1). Mostly the hour before the light goes.
        </p>
        <p className="meta">
          {PHOTOS.length} frames{span && ` · ${span}`} · hover for colour · click to open
        </p>
      </Reveal>
      <section className="section">
        <h2 className="sr-only">Gallery</h2>
        <PhotoGrid />
      </section>
    </>
  );
}
