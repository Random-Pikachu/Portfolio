import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';

  return (
    <section>
      <h2 className="sec-label"><i>§</i>Plates</h2>
      <h1 className="page-title" data-line-probe>Photography</h1>
      <p>All of it on a Nothing Phone&nbsp;(1), mostly the hour before the light goes.</p>
      <dl className="fields">
        <dt>frames</dt><dd>{PHOTOS.length}</dd>
        {span && <><dt>span</dt><dd>{span}</dd></>}
        <dt>device</dt><dd>Nothing Phone (1)</dd>
      </dl>
      <div style={{ marginTop: 'var(--s5)' }}>
        <h2 className="sr-only">Gallery</h2>
        <PhotoGrid />
      </div>
    </section>
  );
}
