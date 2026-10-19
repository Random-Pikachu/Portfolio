import { Link } from 'react-router-dom';
import { Arrow } from '../components/Icon';
import Plate from '../components/Plate';
import { DRAWN, PROJECTS } from '../data/work';

export default function Work() {
  const [a, b, ...rest] = PROJECTS;

  return (
    <section className="grid" id="work" data-sun="noon"
             style={{ paddingBlock: 'var(--s-5)' }} aria-labelledby="work-h">
      <header className="room-head">
        <div className="room-head-row">
          <span className="fine">Work</span>
          <span className="fine">2024 — 2026</span>
        </div>
        <h1 className="h1" id="work-h" data-rv="head" style={{ marginTop: 'var(--s-3)' }}>
          <span className="w"><span className="g">Everything,</span></span>
          <span className="w"><span className="g">newest first.</span></span>
        </h1>
        <p className="lead" data-rv="text" style={{ marginTop: 'var(--s-3)' }}>
          The three with write-ups are first. The rest are a link to the source
          and a link to the thing running.
        </p>
      </header>

      <ul className="tiles" style={{ gridTemplateColumns: 'subgrid' }}>
        {[a, b].map((p, i) => (
          <li className={i === 0 ? 'tile-a' : 'tile-b'} key={p.slug} data-rv="text">
            <Link className="tile" to={`/work/${p.slug}`}>
              <span className="tile-top">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="fine">{p.year}</span>
              </span>
              <span className="tile-media">
                {p.shot
                  ? <img src={p.shot} alt="" loading="lazy" width="700" height="440" decoding="async" />
                  : DRAWN.has(p.slug) ? <Plate slug={p.slug} /> : null}
              </span>
              <h2 className="h3">{p.title}</h2>
              <span className="tile-blurb">{p.blurb}</span>
              <span className="fine tile-stack">{p.stack.slice(0, 4).join(' · ')}</span>
              <span className="act act--sm tile-go">Case study <Arrow /></span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="rows" style={{ gridTemplateColumns: 'subgrid' }}>
        {rest.map((p, i) => {
          const featured = Boolean(p.featured);
          const to = featured ? `/work/${p.slug}` : (p.live || p.github || '/work');
          const inner = (
            <>
              <span className="mono row-n">{String(i + 3).padStart(2, '0')}</span>
              <span className="row-main">
                <span className="h3">{p.title}</span>
                <span className="row-blurb">{p.blurb}</span>
              </span>
              <span className="fine row-stack">{p.stack.slice(0, 3).join(' · ')}</span>
              <span className="fine row-end">{p.year}</span>
            </>
          );
          return (
            <li key={p.slug} data-rv="row">
              {featured
                ? <Link className="row" to={to}>{inner}</Link>
                : <a className="row" href={to} target="_blank" rel="noopener">{inner}</a>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
