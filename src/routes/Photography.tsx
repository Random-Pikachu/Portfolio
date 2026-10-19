import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)} — ${Math.max(...years)}` : '';

  return (
    <section className="grid" id="photos" data-sun="noon"
             style={{ paddingBlock: 'var(--s-5)' }} aria-labelledby="ph-h">
      <header className="room-head">
        <div className="room-head-row">
          <span className="fine">Photographs</span>
          <span className="fine">{PHOTOS.length} frames{span && `, ${span}`}</span>
        </div>
        <h1 className="h1" id="ph-h" data-rv="head" style={{ marginTop: 'var(--s-3)' }}>
          <span className="w"><span className="g">Mostly at night,</span></span>
          <span className="w"><span className="g">mostly on my phone.</span></span>
        </h1>
        <p className="lead" data-rv="text" style={{ marginTop: 'var(--s-3)' }}>
          All of it on a Nothing Phone (1), a lot of it on the walk back across
          campus. Click any frame for the full size and what it was shot on.
        </p>
      </header>
      <div style={{ gridColumn: '1 / -1', marginTop: 'var(--s-5)' }}>
        <h2 className="sr-only">Gallery</h2>
        <PhotoGrid />
      </div>
    </section>
  );
}
