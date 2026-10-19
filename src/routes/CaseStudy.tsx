import { Link, useParams } from 'react-router-dom';
import { Arrow } from '../components/Icon';
import Plate from '../components/Plate';
import { DRAWN, PROJECTS, PROJECT_BY_SLUG } from '../data/work';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const p = slug ? PROJECT_BY_SLUG[slug] : undefined;
  if (!p || !p.featured) return <NotFound />;

  const featured = PROJECTS.filter((x) => x.featured);
  const next = featured[(featured.findIndex((x) => x.slug === p.slug) + 1) % featured.length];
  const hasMedia = Boolean(p.shot) || DRAWN.has(p.slug);

  return (
    <article>
      <section className="grid" style={{ paddingBlock: 'var(--s-5)' }} aria-labelledby="cs-h">
        <header className="room-head">
          <div className="room-head-row">
            <Link className="fine lnk" to="/work" style={{ color: 'var(--accent)' }}>Work</Link>
            <span className="fine">{p.year}</span>
          </div>
          <h1 className="h1" id="cs-h" data-rv="head" style={{ marginTop: 'var(--s-3)', maxWidth: '16em' }}>
            <span className="w"><span className="g">{p.title}</span></span>
          </h1>
        </header>

        <div style={{ gridColumn: '1 / -1' }}>
          <p className="lead" data-rv="text" style={{ marginTop: 'var(--s-3)' }}>{p.blurb}</p>

          <dl className="kv" data-rv="row" style={{ marginTop: 'var(--s-4)', maxWidth: '34em' }}>
            <div><dt>Role</dt><dd style={{ color: 'var(--fg)' }}>{p.role}</dd></div>
            <div><dt>Built with</dt><dd style={{ color: 'var(--fg)' }}>{p.stack.join(' · ')}</dd></div>
            <div>
              <dt>Links</dt>
              <dd style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
                {p.github && <a className="lnk" href={p.github} target="_blank" rel="noopener">Source</a>}
                {p.live && <a className="lnk" href={p.live} target="_blank" rel="noopener">Live</a>}
                {p.video && <a className="lnk" href={p.video} target="_blank" rel="noopener">Demo</a>}
                {!p.github && !p.live && !p.video && <span style={{ color: 'var(--fg-3)' }}>Private</span>}
              </dd>
            </div>
          </dl>

          {hasMedia && (
            <figure className={`figure${p.shot ? '' : ' figure--plate'}`} data-rv="plate">
              {p.shot
                ? <img src={p.shot.replace('-700', '-1400')} alt={p.title} />
                : <Plate slug={p.slug} />}
            </figure>
          )}
        </div>
      </section>

      <section className="grid" data-sun="noon" style={{ paddingBlock: 'var(--s-4) var(--s-5)' }}>
        <div className="prose" style={{ gridColumn: '1 / span min(8, var(--cols))' }}>
          {([['The problem', p.problem], ['What I built', p.built]] as const).map(([h, body], i) =>
            body ? (
              <div key={h} data-rv="text" style={{ marginTop: i ? 'var(--s-5)' : 0 }}>
                <p className="fine">{h}</p>
                <p className="lead" style={{ marginTop: 'var(--s-2)', maxWidth: '27.4em' }}>{body}</p>
              </div>
            ) : null)}
        </div>
      </section>

      {p.decisions?.length ? (
        <section className="grid" style={{ paddingBlock: 'var(--s-5)' }} aria-labelledby="dec-h">
          <header className="room-head">
            <div className="room-head-row"><span className="fine">Decisions</span></div>
            <h2 className="h2" id="dec-h" data-rv="head">
              <span className="w"><span className="g">What I chose.</span></span>
            </h2>
          </header>
          <ol className="decisions" style={{ gridTemplateColumns: 'subgrid' }}>
            {p.decisions.map((d) => (
              <li key={d.claim} data-rv="row">
                <div className="dec-body">
                  <p className="h3">{d.claim}</p>
                  <p className="dec-why">{d.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {p.stats?.length ? (
        <section className="proof bleed" aria-labelledby="res-h">
          <div className="grid">
            <h2 className="sr-only" id="res-h">Results</h2>
            <ul className="stats" style={{ gridTemplateColumns: 'subgrid', marginTop: 0 }}>
              {p.stats.map((s) => (
                <li key={s.value} data-rv="text">
                  <span className="proof-v">{s.value}</span>
                  <span className="proof-l">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="grid" style={{ paddingBlock: 'var(--s-5)' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <span className="fine">Next</span>
          <Link className="act" to={`/work/${next.slug}`}
                style={{ display: 'flex', marginTop: 'var(--s-3)' }}>
            {next.title} <Arrow />
          </Link>
        </div>
      </section>
    </article>
  );
}
