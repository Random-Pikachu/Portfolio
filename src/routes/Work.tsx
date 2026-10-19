import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Plate from '../components/Plate';
import { DRAWN, PROJECTS } from '../data/work';

export default function Work() {
  return (
    <section className="slab" aria-labelledby="idx">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <div className="shead-row">
            <p className="tag">Index</p>
            <span className="mono" style={{ color: 'var(--fg-3)' }}>
              {PROJECTS.length} projects · 2024 — 2026
            </span>
          </div>
          <h1 className="h1" id="idx">Everything, newest first.</h1>
          <p className="lead">
            Three of these have a case study behind them. The rest are a link to
            the source and a link to the thing running.
          </p>
        </Reveal>

        <ul className="work">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 40}>
              <div className="row">
                <span className="row-n">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="row-title">
                    {p.featured ? <Link className="lnk" to={`/work/${p.slug}`} style={{ color: 'inherit' }}>{p.title}</Link> : p.title}
                  </span>
                  <span className="row-blurb">{p.blurb}</span>
                  <span className="row-stack">{p.stack.join(' · ')}</span>
                  <span className="mono" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px', marginTop: 14 }}>
                    {p.featured && <Link className="lnk" to={`/work/${p.slug}`}>Case study →</Link>}
                    {p.github && <a className="lnk" href={p.github} target="_blank" rel="noopener">Source</a>}
                    {p.live && <a className="lnk" href={p.live} target="_blank" rel="noopener">Live</a>}
                    {p.video && <a className="lnk" href={p.video} target="_blank" rel="noopener">Demo</a>}
                  </span>
                </span>
                {(p.shot || DRAWN.has(p.slug)) && (
                  <span className="peek">
                    <span className="peek-frame brk">
                      {p.shot
                        ? <img src={p.shot} alt="" loading="lazy" width="700" height="440" />
                        : <Plate slug={p.slug} />}
                    </span>
                  </span>
                )}
                <span className="row-right">
                  <span className="row-year">{p.year}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
