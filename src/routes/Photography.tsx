import Reveal from '../components/Reveal';
import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)} — ${Math.max(...years)}` : '';

  return (
    <section className="slab" aria-labelledby="ph">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <div className="shead-row">
            <p className="tag">Plates</p>
            <span className="mono" style={{ color: 'var(--fg-3)' }}>
              {PHOTOS.length} frames{span && ` · ${span}`}
            </span>
          </div>
          <h1 className="h1" id="ph">The hour before the light goes.</h1>
          <p className="lead">
            All of it on a Nothing Phone&nbsp;(1), mostly late October, mostly
            walking back across campus. Hover for colour, click to open.
          </p>
        </Reveal>
        <h2 className="sr-only">Gallery</h2>
        <PhotoGrid />
      </div>
    </section>
  );
}
