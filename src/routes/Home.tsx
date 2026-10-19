import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Plate from '../components/Plate';
import { EXPERIENCES, SITE } from '../data/site';
import { DRAWN, PROJECTS } from '../data/work';
import { PHOTOS } from '../data/photos';

const PROOF = [
  'Five patches merged into KDE Plasma',
  'Featured in This Week in Plasma',
  'SSR path, 2s → 150ms',
  'B.Tech IT + MBA, ABV-IIITM Gwalior',
];

const FACTS = [
  { k: 'Now', v: 'Founding engineer at Retsguide, Copenhagen' },
  { k: 'Before', v: 'KDE Plasma · OpenSphere, San Francisco' },
  { k: 'Works in', v: 'TypeScript · Go · C++ · Python' },
  { k: 'Open to', v: 'Founding and AI engineering roles' },
];

/** The first six, in the order they deserve to be read. */
const SHOWN = PROJECTS.slice(0, 6);

/**
 * The strip runs small, and Sangam shoots almost everything after sunset, so
 * the frames here are the ones that still read at 300px tall — picked by
 * measured mean luminance, not by taste. The full set is on /photography,
 * where each one gets the room to be dark.
 */
const STRIP_SLUGS = [
  'img-20240903-160828459', 'img-20251223-163648962', 'img-20250208-162232949',
  'img-20240902-182059705', 'img-20241031-222139440', 'img-20250208-175800220-1',
  '1740158674579-2', 'img-20260721-182117987', '1742934048623',
];
const STRIP = STRIP_SLUGS
  .map((slug) => PHOTOS.find((p) => p.slug === slug))
  .filter((p): p is (typeof PHOTOS)[number] => Boolean(p));

export default function Home() {
  return (
    <>
      {/* ── Who ──────────────────────────────────────────────────────── */}
      <section className="slab hero" aria-labelledby="who">
        <div className="wrap">
          <Reveal>
            <p className="tag">Software engineer · AI systems · Gwalior, India</p>
            <h1 className="display" id="who">
              I build AI systems that aren’t allowed to be <span className="em">wrong</span>.
            </h1>
            <p className="lead">
              Legal technology, where a confident hallucination is a liability
              rather than a bug report. I am the founding engineer at Retsguide
              in Copenhagen: three customer-facing flows shipped end to end, and
              the knowledge graph underneath the product’s reports — which no
              model is permitted to write to, so every claim traces back to the
              provision it rests on.
            </p>
            <div className="hero-cta">
              <Link className="btn" to="/work">
                Read the work <span className="arr" aria-hidden="true">→</span>
              </Link>
              <a className="btn btn--ghost" href={`mailto:${SITE.email}`}>Email me</a>
            </div>
            <dl className="facts">
              {FACTS.map((f) => (
                <div className="fact" key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Proof ────────────────────────────────────────────────────── */}
      <div className="proof">
        <div className="wrap">
          <ul>
            {PROOF.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section className="slab slab--ink" aria-labelledby="exp">
        <div className="wrap">
          <Reveal as="header" className="shead">
            <div className="shead-row">
              <p className="tag">01 — Where I have worked</p>
              <span className="mono" style={{ color: 'var(--fg-3)' }}>2025 — now</span>
            </div>
            <h2 className="h2" id="exp">Three jobs, one habit: own it end to end.</h2>
          </Reveal>

          <ul className="jobs">
            {EXPERIENCES.map((job, i) => (
              <Reveal as="li" className="job" key={job.company} delay={i * 70}>
                <div className="job-aside">
                  <p className="job-when">{job.period}</p>
                  <p className="job-where">
                    <a className="h3 lnk" href={job.companyUrl} target="_blank" rel="noopener"
                       style={{ color: 'var(--fg)' }}>
                      {job.company}
                    </a>
                    <span className="job-role">
                      {job.role}{job.location ? ` · ${job.location}` : ''}
                    </span>
                  </p>
                </div>
                <div>
                  <ul className="job-points">
                    {job.points.map((pt) => (
                      <li key={pt.text}>
                        {pt.href
                          ? <><a className="lnk" href={pt.href} target="_blank" rel="noopener">{pt.label}</a> — {pt.text}</>
                          : pt.text}
                      </li>
                    ))}
                  </ul>
                  <ul className="chips">
                    {job.stack.map((s) => <li className="chip" key={s}>{s}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────────────────────────── */}
      <section className="slab" aria-labelledby="work">
        <div className="wrap">
          <Reveal as="header" className="shead">
            <div className="shead-row">
              <p className="tag">02 — Selected work</p>
              <Link className="mono lnk" to="/work">All {PROJECTS.length} →</Link>
            </div>
            <h2 className="h2" id="work">Things I built, and still run.</h2>
          </Reveal>

          <ul className="work">
            {SHOWN.map((p, i) => {
              const to = p.featured ? `/work/${p.slug}` : (p.live || p.github || '/work');
              const external = !p.featured;
              const Row = (
                <>
                  <span className="row-n">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="row-title">{p.title}</span>
                    <span className="row-blurb">{p.blurb}</span>
                    <span className="row-stack">{p.stack.join(' · ')}</span>
                  </span>
                  {(p.shot || DRAWN.has(p.slug)) && (
                    <span className="peek">
                      <span className="peek-frame brk">
                        {p.shot
                          ? <img src={p.shot} alt="" loading="lazy" width="700" height="440" />
                          : <Plate slug={p.slug} />}
                      </span>
                      <span className="peek-cap">{p.year}</span>
                    </span>
                  )}
                  <span className="row-right">
                    {p.featured && <span className="row-case">Case study</span>}
                    <span className="row-year">{p.year}</span>
                    <span className="row-go" aria-hidden="true">↗</span>
                  </span>
                </>
              );
              return (
                <Reveal as="li" key={p.slug} delay={Math.min(i, 5) * 50}>
                  {external
                    ? <a className="row" href={to} target="_blank" rel="noopener">{Row}</a>
                    : <Link className="row" to={to}>{Row}</Link>}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Photography ──────────────────────────────────────────────── */}
      <section className="slab slab--raise" aria-labelledby="photos">
        <div className="wrap">
          <Reveal>
            <div className="plates-head">
              <div>
                <p className="tag">03 — Away from the editor</p>
                <h2 className="h2" id="photos" style={{ marginTop: 16, maxWidth: '16ch' }}>
                  The hour before the light goes.
                </h2>
              </div>
              <Link className="btn btn--ghost" to="/photography">
                All frames <span className="arr" aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <ul className="strip">
              {STRIP.map((ph) => (
                <li key={ph.slug}>
                  <img
                    src={`/photos/${ph.slug}-400.webp`}
                    alt={ph.alt || 'Photograph by Sangam Pratap Singh'}
                    width={ph.width} height={ph.height} loading="lazy" decoding="async"
                    style={{ aspectRatio: `${ph.width} / ${ph.height}` }}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
