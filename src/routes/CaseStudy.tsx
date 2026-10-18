import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PROJECTS, PROJECT_BY_SLUG } from '../data/work';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const p = slug ? PROJECT_BY_SLUG[slug] : undefined;
  if (!p || !p.featured) return <NotFound />;

  const featured = PROJECTS.filter((x) => x.featured);
  const next = featured[(featured.findIndex((x) => x.slug === p.slug) + 1) % featured.length];

  return (
    <article>
      <Reveal as="section" className="intro">
        <p className="meta" style={{ marginBottom: 'var(--s3)' }}>
          <Link to="/work" style={{ color: 'inherit' }}>work</Link> / {p.year}
        </p>
        <h1>{p.title}</h1>
        <dl className="case-fields">
          {p.role && <><dt>role</dt><dd>{p.role}</dd></>}
          <dt>stack</dt><dd>{p.stack.join(', ')}</dd>
          {(p.github || p.live || p.video) && (
            <>
              <dt>links</dt>
              <dd className="item-links" style={{ marginTop: 0 }}>
                {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
              </dd>
            </>
          )}
        </dl>
      </Reveal>

      {p.problem && (
        <section className="section">
          <div className="section-head"><h2>The problem</h2></div>
          <Reveal><div className="prose"><p>{p.problem}</p></div></Reveal>
        </section>
      )}

      {p.built && (
        <section className="section">
          <div className="section-head"><h2>What I built</h2></div>
          <Reveal><div className="prose"><p>{p.built}</p></div></Reveal>
        </section>
      )}

      {p.decisions?.length ? (
        <section className="section">
          <div className="section-head"><h2>Decisions</h2></div>
          <ol className="decisions">
            {p.decisions.map((d, j) => (
              <Reveal as="li" key={d.claim} delay={j * 40}>
                <h3>{d.claim}</h3>
                <p>{d.why}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}

      {p.stats?.length ? (
        <section className="section">
          <div className="section-head"><h2>Results</h2></div>
          <ul className="stats">
            {p.stats.map((s, j) => (
              <Reveal as="li" key={s.value} delay={j * 40}>
                <b>{s.value}</b><span>{s.label}</span>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="foot">
        <Link to={`/work/${next.slug}`}>next: {next.title} &rarr;</Link>
        <Link to="/work" className="foot-end">all work</Link>
      </footer>
    </article>
  );
}
