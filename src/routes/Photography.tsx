import Reveal from '../components/Reveal';
import PhotoGrid from '../components/PhotoGrid';
import { PHOTOS } from '../data/photos';

export default function Photography() {
  const years = PHOTOS.map((p) => p.date.slice(0, 4)).filter(Boolean).map(Number);
  const span = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '';
  return (
    <section className="sec" style={{ paddingTop: 'clamp(110px, 18vh, 200px)' }}>
      <Reveal as="header" className="sec-head">
        <h2>Plates</h2>
        <span className="mono">{PHOTOS.length} frames{span && ` / ${span}`}</span>
      </Reveal>
      <Reveal>
        <p style={{ color: 'var(--muted)', maxWidth: '52ch', margin: '0 0 clamp(28px,5vh,56px)' }}>
          All of it on a Nothing Phone&nbsp;(1), mostly the hour before the light
          goes. Hover for colour, click to open.
        </p>
      </Reveal>
      <h3 className="sr-only">Gallery</h3>
      <PhotoGrid />
    </section>
  );
}
