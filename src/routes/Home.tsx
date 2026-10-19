import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Tile from '../components/Tile';
import { EXPERIENCES, SITE } from '../data/site';
import { PROJECTS } from '../data/work';
import { PHOTOS } from '../data/photos';

const FACTS = [
  { k: 'Right now', v: 'Founding engineer at Retsguide, Copenhagen' },
  { k: 'Before that', v: 'KDE Plasma. OpenSphere, San Francisco.' },
  { k: 'I write', v: 'TypeScript, Go, C++, Python' },
  { k: 'Looking for', v: 'Founding and AI engineering roles' },
];

/** Where the work actually landed. Set as text; inventing logos would be dress-up. */
const MARKS = ['Retsguide', 'KDE Plasma', 'OpenSphere', 'This Week in Plasma', 'ABV-IIITM Gwalior'];

const SHOWN = PROJECTS.slice(0, 6);

/**
 * The strip runs small and Sangam shoots almost everything after sunset, so
 * these are the frames that still read at 300px tall — picked by measured mean
 * luminance, not by taste. The full set is on /photography, where each one
 * gets the room to be dark.
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
      <section className="sec hero" aria-labelledby="who">
        <div className="wrap">
          <Reveal>
            <p className="tag">Sangam Pratap Singh, Gwalior</p>
            <h1 className="display" id="who">
              I build AI for legal work, so it has to be <span className="em">right</span>.
            </h1>
            <p className="lead">
              The hard part was never the AI. It’s that a model which makes
              things up is worse than no model at all. I’m the founding engineer
              at Retsguide in Copenhagen: three customer-facing flows shipped
              end to end, and the knowledge graph their reports sit on. Nothing
              generated writes to that graph, so every claim points back at the
              law it came from.
            </p>
            <div className="hero-cta">
              <Link className="btn" to="/work">
                See the work <span className="arr" aria-hidden="true">→</span>
              </Link>
              <a className="btn btn--ghost" href={`mailto:${SITE.email}`}>Email me</a>
            </div>
            <dl className="facts">
              {FACTS.map((f) => (
                <div className="fact" key={f.k}>
                  <dt>{f.k}</dt>
                  <span className="fact-dots" aria-hidden="true" />
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Where it landed ──────────────────────────────────────────── */}
      <div className="wrap">
        <ul className="marks">
          {MARKS.map((m) => <li key={m}>{m}</li>)}
        </ul>
      </div>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="exp">
        <div className="wrap">
          <Reveal as="header" className="shead">
            <div className="shead-row">
              <p className="tag">Where I’ve worked</p>
              <span className="mono" style={{ color: 'var(--fg-3)' }}>2025 to now</span>
            </div>
            <h2 className="h2" id="exp">Three places so far.</h2>
          </Reveal>

          <ul className="jobs">
            {EXPERIENCES.map((job, i) => (
              <Reveal as="li" className="job" key={job.company} delay={i * 70}>
                <div className="job-aside">
                  <p className="job-when">{job.period}</p>
                  <p className="job-where">
                    <a className="h3" href={job.companyUrl} target="_blank" rel="noopener">
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
      <section className="sec" aria-labelledby="work" data-sun="noon">
        <div className="wrap">
          <Reveal as="header" className="shead">
            <div className="shead-row">
              <p className="tag">Projects</p>
              <Link className="mono lnk" to="/work">All {PROJECTS.length} →</Link>
            </div>
            <h2 className="h2" id="work">Stuff I’ve built.</h2>
          </Reveal>

          <ul className="tiles">
            {SHOWN.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={Math.min(i, 3) * 60}>
                <Tile p={p} n={i + 1} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Photography ──────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="photos">
        <div className="wrap">
          <Reveal as="header" className="shead">
            <div className="shead-row">
              <p className="tag">Photos</p>
              <Link className="mono lnk" to="/photography">All of them →</Link>
            </div>
            <h2 className="h2" id="photos">Shot on a phone, mostly after five.</h2>
          </Reveal>
          <Reveal>
            <ul className="strip">
              {STRIP.map((ph) => (
                <li key={ph.slug}>
                  <img
                    src={`/photos/${ph.slug}-400.webp`}
                    alt={ph.alt || 'Photograph by Sangam Pratap Singh'}
                    width={ph.width} height={ph.height} loading="lazy" decoding="async"
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
