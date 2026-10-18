import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PROJECTS, PROJECT_BY_SLUG } from '../data/work';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const p = slug ? PROJECT_BY_SLUG[slug] : undefined;
  if (!p || !p.featured) return <NotFound />;

  const featured = PROJECTS.filter((x) => x.featured);
  const i = featured.findIndex((x) => x.slug === p.slug);
  const next = featured[(i + 1) % featured.length];

  return (
    <article className="case">
      <section className="page-head">
        <Reveal as="header">
          <p className="eyebrow">
            <Link to="/work">work</Link> <span aria-hidden="true">/</span> {p.year}
          </p>
          <h1 className="h1">{p.title}</h1>
        </Reveal>

        <Reveal delay={60}>
          <dl className="fields">
            {p.role && <><dt>role</dt><dd>{p.role}</dd></>}
            <dt>stack</dt><dd>{p.stack.join(' · ')}</dd>
            {(p.github || p.live || p.video) && (
              <>
                <dt>links</dt>
                <dd className="card-links">
                  {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
                </dd>
              </>
            )}
          </dl>
        </Reveal>
      </section>

      {p.problem && (
        <section className="band" aria-labelledby="p-h">
          <Reveal><h2 id="p-h" className="eyebrow">The problem</h2></Reveal>
          <Reveal delay={60}><div className="prose"><p>{p.problem}</p></div></Reveal>
        </section>
      )}

      {p.built && (
        <section className="band" aria-labelledby="b-h">
          <Reveal><h2 id="b-h" className="eyebrow">What I built</h2></Reveal>
          <Reveal delay={60}><div className="prose"><p>{p.built}</p></div></Reveal>
        </section>
      )}

      {p.decisions?.length ? (
        <section className="band" aria-labelledby="d-h">
          <Reveal><h2 id="d-h" className="eyebrow">Decisions</h2></Reveal>
          <ol className="decisions">
            {p.decisions.map((d, j) => (
              <Reveal as="li" key={d.claim} delay={j * 60}>
                <h3>{d.claim}</h3>
                <p>{d.why}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}

      {p.stats?.length ? (
        <section className="band" aria-labelledby="s-h">
          <Reveal><h2 id="s-h" className="eyebrow">Results</h2></Reveal>
          <ul className="stats">
            {p.stats.map((s, j) => (
              <Reveal as="li" key={s.value} delay={j * 60}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="case-next" aria-label="More work">
        <Reveal>
          <Link to={`/work/${next.slug}`}>
            <span className="eyebrow">Next</span>
            <span className="case-next-t">{next.title}</span>
          </Link>
        </Reveal>
      </nav>
    </article>
  );
}
