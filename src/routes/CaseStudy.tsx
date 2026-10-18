import { Link, useParams } from 'react-router-dom';
import { PROJECTS, PROJECT_BY_SLUG } from '../data/work';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const p = slug ? PROJECT_BY_SLUG[slug] : undefined;
  if (!p || !p.featured) return <NotFound />;

  const featured = PROJECTS.filter((x) => x.featured);
  const next = featured[(featured.findIndex((x) => x.slug === p.slug) + 1) % featured.length];

  return (
    <>
      <section>
        <h2 className="sec-label"><i>§</i><Link to="/work" style={{ color: 'inherit' }}>Artifacts</Link> / {p.year}</h2>
        <h1 className="page-title" data-line-probe>{p.title}</h1>
        <dl className="fields">
          {p.role && <><dt>role</dt><dd>{p.role}</dd></>}
          <dt>stack</dt><dd>{p.stack.join(' · ')}</dd>
          {(p.github || p.live || p.video) && (
            <>
              <dt>links</dt>
              <dd>
                {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
              </dd>
            </>
          )}
        </dl>
      </section>

      {p.problem && (
        <section><h2 className="sec-label"><i>1</i>The problem</h2><p>{p.problem}</p></section>
      )}
      {p.built && (
        <section><h2 className="sec-label"><i>2</i>What I built</h2><p>{p.built}</p></section>
      )}
      {p.decisions?.length ? (
        <section>
          <h2 className="sec-label"><i>3</i>Decisions</h2>
          <ol className="decisions">
            {p.decisions.map((d) => (
              <li key={d.claim}><h3>{d.claim}</h3><p>{d.why}</p></li>
            ))}
          </ol>
        </section>
      ) : null}
      {p.stats?.length ? (
        <section>
          <h2 className="sec-label"><i>4</i>Results</h2>
          <ul className="stats">
            {p.stats.map((s) => <li key={s.value}><b>{s.value}</b><span>{s.label}</span></li>)}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="sec-label"><i>—</i>Next</h2>
        <p className="refs"><Link to={`/work/${next.slug}`}>{next.title} &rarr;</Link></p>
      </section>
    </>
  );
}
