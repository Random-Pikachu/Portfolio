import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/work';

export default function Work() {
  return (
    <section>
      <h2 className="sec-label"><i>§</i>Artifacts</h2>
      <h1 className="page-title">Everything built, in order</h1>
      <p>Three carry a case study. The rest shipped and taught me something.</p>
      <ol className="artifacts" style={{ marginTop: 'var(--s5)' }}>
        {PROJECTS.map((p, i) => (
          <li key={p.slug}>
            <span className="art-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="art-body">
              <span className="art-title">
                {p.featured ? <Link to={`/work/${p.slug}`}>{p.title}</Link> : p.title}
              </span>
              <span className="art-desc">{p.blurb}</span>
              <span className="art-stack">{p.stack.join(' · ')}</span>
              <span className="art-links">
                {p.featured && <Link to={`/work/${p.slug}`}>case study</Link>}
                {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
              </span>
            </span>
            <span className="art-year">{p.year}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
