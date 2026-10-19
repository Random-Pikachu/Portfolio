import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PROJECTS } from '../data/work';

export default function Work() {
  return (
    <section className="sec" style={{ paddingTop: 'clamp(110px, 18vh, 200px)' }}>
      <Reveal as="header" className="sec-head">
        <h2>Index</h2>
        <span className="mono">{PROJECTS.length} projects</span>
      </Reveal>
      <ul className="work">
        {PROJECTS.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 40}>
            <div className="work-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <span style={{ minWidth: 0, flex: '1 1 320px' }}>
                <span className="ttl" style={{ display: 'block' }}>
                  {p.featured ? <Link to={`/work/${p.slug}`}>{p.title}</Link> : p.title}
                </span>
                <span style={{ display: 'block', color: 'var(--muted)', marginTop: 8, maxWidth: '62ch' }}>
                  {p.blurb}
                </span>
                <span className="mono" style={{ display: 'block', color: 'var(--faint)', marginTop: 10 }}>
                  {p.stack.join(' / ')}
                </span>
                <span className="mono" style={{ display: 'flex', gap: 18, marginTop: 10 }}>
                  {p.featured && <Link to={`/work/${p.slug}`}>Case study</Link>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener">Source</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener">Live</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noopener">Demo</a>}
                </span>
              </span>
              <span className="yr">{p.year}</span>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
