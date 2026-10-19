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
    <>
      <header className="sec" style={{ paddingTop: 'clamp(110px, 18vh, 200px)' }}>
        <Reveal>
          <p className="mono" style={{ color: 'var(--faint)', margin: '0 0 18px' }}>
            <Link to="/work">Index</Link> / {p.year}
          </p>
          <h1 className="statement-h" style={{
            margin: 0, fontWeight: 800, fontVariationSettings: "'wdth' 88",
            fontSize: 'var(--t-big)', lineHeight: 0.92, letterSpacing: '-0.035em',
            textTransform: 'uppercase', maxWidth: '18ch',
          }}>{p.title}</h1>
          <p className="mono" style={{ color: 'var(--faint)', marginTop: 20 }}>
            {p.stack.join(' / ')}
          </p>
          <p className="mono" style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {p.github && <a href={p.github} target="_blank" rel="noopener">Source</a>}
            {p.live && <a href={p.live} target="_blank" rel="noopener">Live</a>}
            {p.video && <a href={p.video} target="_blank" rel="noopener">Demo</a>}
          </p>
        </Reveal>
      </header>

      {p.shot && (
        <Reveal>
          <img src={p.shot.replace('-700', '-1400')} alt={p.title}
               style={{ display: 'block', width: '100%', height: 'auto',
                        margin: 'clamp(36px,7vh,80px) 0' }} />
        </Reveal>
      )}

      {([['The problem', p.problem], ['What I built', p.built]] as const).map(([h, body]) =>
        body ? (
          <Reveal as="section" className="sec" key={h}>
            <header className="sec-head"><h2>{h}</h2></header>
            <p style={{ color: 'var(--muted)', maxWidth: '64ch', margin: '0 0 clamp(40px,7vh,80px)' }}>{body}</p>
          </Reveal>
        ) : null)}

      {p.decisions?.length ? (
        <section className="sec">
          <Reveal as="header" className="sec-head"><h2>Decisions</h2></Reveal>
          <ul className="work" style={{ marginBottom: 'clamp(40px,7vh,80px)' }}>
            {p.decisions.map((d, i) => (
              <Reveal as="li" key={d.claim} delay={i * 50}>
                <div style={{ padding: 'clamp(16px,2.4vw,28px) 0' }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--t-mid)',
                              lineHeight: 1.2, letterSpacing: '-0.02em' }}>{d.claim}</p>
                  <p style={{ margin: '10px 0 0', color: 'var(--muted)', maxWidth: '64ch' }}>{d.why}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      {p.stats?.length ? (
        <section className="sec">
          <Reveal as="header" className="sec-head"><h2>Results</h2></Reveal>
          <ul className="work" style={{ marginBottom: 'clamp(40px,7vh,80px)' }}>
            {p.stats.map((s, i) => (
              <Reveal as="li" key={s.value} delay={i * 50}>
                <div className="work-row" style={{ alignItems: 'baseline' }}>
                  <span className="ttl" style={{ color: 'var(--accent)', flex: 'none' }}>{s.value}</span>
                  <span style={{ color: 'var(--muted)', maxWidth: '48ch' }}>{s.label}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="contact">
        <Reveal>
          <Link className="contact-cta" to={`/work/${next.slug}`}>
            Next<br />{next.title.split(' ').slice(0, 3).join(' ')} &rarr;
          </Link>
        </Reveal>
      </section>
    </>
  );
}
