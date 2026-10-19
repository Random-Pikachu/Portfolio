import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Plate from '../components/Plate';
import { DRAWN, PROJECTS, PROJECT_BY_SLUG } from '../data/work';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const p = slug ? PROJECT_BY_SLUG[slug] : undefined;
  if (!p || !p.featured) return <NotFound />;

  const featured = PROJECTS.filter((x) => x.featured);
  const next = featured[(featured.findIndex((x) => x.slug === p.slug) + 1) % featured.length];

  return (
    <article>
      <section className="sec" aria-labelledby="cs">
        <div className="wrap">
          <Reveal>
            <p className="tag"><Link className="lnk" to="/work">Index</Link>&nbsp; / &nbsp;{p.year}</p>
            <h1 className="h1" id="cs" style={{ marginTop: 20, maxWidth: '18ch' }}>{p.title}</h1>
            <p className="lead" style={{ marginTop: 24 }}>{p.blurb}</p>

            <dl className="kv" style={{ marginTop: 'clamp(34px,5vh,56px)' }}>
              <div><dt>Role</dt><dd>{p.role}</dd></div>
              <div><dt>Built with</dt><dd>{p.stack.join(' · ')}</dd></div>
              <div>
                <dt>Links</dt>
                <dd style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
                  {p.github && <a className="lnk" href={p.github} target="_blank" rel="noopener">Source</a>}
                  {p.live && <a className="lnk" href={p.live} target="_blank" rel="noopener">Live</a>}
                  {p.video && <a className="lnk" href={p.video} target="_blank" rel="noopener">Demo</a>}
                  {!p.github && !p.live && !p.video && <span style={{ color: 'var(--fg-3)' }}>Private</span>}
                </dd>
              </div>
            </dl>

            {(p.shot || DRAWN.has(p.slug)) && (
              <figure className={`figure brk${p.shot ? '' : ' figure--plate'}`}>
                {p.shot
                  ? <img src={p.shot.replace('-700', '-1400')} alt={p.title} />
                  : <Plate slug={p.slug} />}
              </figure>
            )}
          </Reveal>
        </div>
      </section>

      <section className="sec sec--tight" data-sun="noon">
        <div className="wrap">
          <div className="prose">
            {([['The problem', p.problem], ['What I built', p.built]] as const).map(([h, body], i) =>
              body ? (
                <Reveal key={h} delay={i * 60}>
                  <p className="tag" style={{ marginTop: i ? 'clamp(40px,6vh,70px)' : 0 }}>{h}</p>
                  <p className="body" style={{ marginTop: 16, fontSize: 'var(--t-lead)', lineHeight: 1.55 }}>{body}</p>
                </Reveal>
              ) : null)}
          </div>
        </div>
      </section>

      {p.decisions?.length ? (
        <section className="sec" aria-labelledby="dec">
          <div className="wrap">
            <Reveal as="header" className="shead">
              <div className="shead-row"><p className="tag">Decisions</p></div>
              <h2 className="h2" id="dec">What I chose, and why.</h2>
            </Reveal>
            <ol className="decisions">
              {p.decisions.map((d, i) => (
                <Reveal as="li" key={d.claim} delay={i * 50}>
                  <div>
                    <p className="dec-claim">{d.claim}</p>
                    <p className="dec-why">{d.why}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {p.stats?.length ? (
        <section className="sec" aria-labelledby="res">
          <div className="wrap">
            <Reveal as="header" className="shead">
              <div className="shead-row"><p className="tag">Results</p></div>
              <h2 className="h2" id="res">Measured, not claimed.</h2>
            </Reveal>
            <ul className="stats">
              {p.stats.map((s, i) => (
                <Reveal as="li" key={s.value} delay={i * 60}>
                  <span className="stat-v">{s.value}</span>
                  <span className="stat-l">{s.label}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="sec sec--tight">
        <div className="wrap">
          <Reveal>
            <div className="shead-row"><p className="tag">Next</p></div>
            <Link className="row" to={`/work/${next.slug}`}>
              <span className="row-n" aria-hidden="true">→</span>
              <span>
                <span className="row-title">{next.title}</span>
                <span className="row-blurb">{next.blurb}</span>
              </span>
              <span className="row-right"><span className="row-year">{next.year}</span></span>
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
