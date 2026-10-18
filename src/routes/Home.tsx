import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import ContributionHeatmap from '../components/ContributionHeatmap';
import { PROJECTS } from '../data/work';
import { EXPERIENCES, SITE, SKILLS } from '../data/site';
import { PHOTOS } from '../data/photos';

/**
 * Bento spans, carried over from the old site. A grid where every tile is the
 * same size reads as a spreadsheet; varying the spans gives the eye somewhere
 * to go and lets the bigger pieces take the room they deserve.
 */
const SPAN: Record<string, 2 | 3 | 5> = {
  'load-forecasting': 3,
  'review-agent': 2,
  astra: 2,
  ephemeris: 3,
  coderivals: 3,
  devtrackr: 2,
  gitstory: 2,
  securepdf: 3,
  'code-sync': 2,
  'sorting-visualizer': 3,
};

export default function Home() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Introduction">
        <Reveal as="header">
          <h1 className="display">
            Founding engineer<br />
            <em>&amp;</em> AI systems
          </h1>
        </Reveal>

        <div className="rule" aria-hidden="true" />

        <div className="hero-cols">
          <Reveal delay={60}>
            <dl className="fields">
              <dt>name</dt><dd>{SITE.name}</dd>
              <dt>at</dt><dd>Retsguide, Copenhagen</dd>
              <dt>since</dt><dd>Jun 2026</dd>
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <p className="lede">
              I built the product end to end and am now building its{' '}
              <em>legal brain</em>. I build AI systems that can be checked:
              the model reads and ranks, the code decides.
            </p>
            <p className="hero-links">
              <Link to="/work">selected work</Link>
              <a href={SITE.resume}>resume</a>
              <a href={`mailto:${SITE.email}`}>email</a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── About ────────────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="about-h">
        <Reveal><h2 id="about-h">About</h2></Reveal>
        <div className="about">
          <Reveal>
            <div className="prose">
              <p>
                I am Sangam, a third-year Integrated Dual Degree student
                (B.Tech IT + MBA) at ABV-IIITM Gwalior, currently the founding
                engineer at a legal-tech startup in Copenhagen.
              </p>
              <p>
                A language model is very good at reading a document and very bad
                at being accountable for what it concluded. So I use it for the
                first job and never the second. Anything a model decides on its
                own, you cannot defend to a customer, a regulator, or yourself at
                two in the morning.
              </p>
              <p>
                Outside that I contribute to KDE Plasma, shoot{' '}
                <Link to="/photography">photography</Link> on a phone, and solve
                the occasional LC/CF problem to keep the brain warm. When I am
                doing none of it, I am probably asleep.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h3 className="sr-only">Skills</h3>
            <ul className="chips chips-lg">
              {SKILLS.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ─── Work ─────────────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="work-h">
        <Reveal>
          <div className="band-head">
            <h2 id="work-h">Work</h2>
            <Link className="more" to="/work">all projects &rarr;</Link>
          </div>
        </Reveal>

        <ul className="bento">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 5) * 50} className={`bento-${SPAN[p.slug] ?? 2}`}>
              <article className="tile">
                <p className="tile-top">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span>{p.year}</span>
                </p>
                <h3>
                  {p.featured
                    ? <Link to={`/work/${p.slug}`}>{p.title}</Link>
                    : p.title}
                </h3>
                <p className="tile-blurb">{p.blurb}</p>
                <ul className="chips">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                <p className="tile-links">
                  {p.featured && <Link to={`/work/${p.slug}`}>case study</Link>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ─── Experience ───────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="exp-h">
        <Reveal><h2 id="exp-h">Experience</h2></Reveal>
        <div className="exps">
          {EXPERIENCES.map((e, i) => (
            <Reveal as="article" key={e.company} delay={i * 60} className="exp">
              <div className="exp-when">
                <time dateTime={e.startDate}>{e.period.split('—')[0].trim()}</time>
                <span aria-hidden="true"> — </span>
                {e.endDate ? <time dateTime={e.endDate}>{e.period.split('—')[1].trim()}</time> : 'Present'}
              </div>
              <div className="exp-what">
                <h3>
                  {e.role}
                  <span className="exp-at">
                    {' at '}
                    <a href={e.companyUrl} target="_blank" rel="noopener">{e.company}</a>
                  </span>
                </h3>
                <ul className="bullets">
                  {e.points.map((pt, j) => (
                    <li key={j}>
                      {pt.href && pt.label ? (
                        <><a href={pt.href} target="_blank" rel="noopener">{pt.label}</a> — {pt.text}</>
                      ) : pt.text}
                    </li>
                  ))}
                </ul>
                <ul className="chips">{e.stack.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Activity ─────────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="act-h">
        <Reveal><h2 id="act-h">Activity</h2></Reveal>
        <Reveal delay={60}><ContributionHeatmap /></Reveal>
      </section>

      {/* ─── Photography ──────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="photo-h">
        <Reveal>
          <div className="band-head">
            <h2 id="photo-h">Photography</h2>
            <Link className="more" to="/photography">see all &rarr;</Link>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <ul className="strip">
            {PHOTOS.slice(0, 8).map((ph) => (
              <li key={ph.slug}>
                <img
                  src={`/photos/${ph.slug}-800.webp`}
                  width={ph.width} height={ph.height}
                  alt={ph.alt} loading="lazy" decoding="async"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ─── Contact ──────────────────────────────────────────────────── */}
      <section className="band contact" aria-labelledby="contact-h">
        <Reveal><h2 id="contact-h" className="pull">Say hello.</h2></Reveal>
        <Reveal delay={60}>
          <address className="links">
            <a href={`mailto:${SITE.email}`}>email</a>
            <a href={SITE.profiles.github} target="_blank" rel="me noopener">github</a>
            <a href={SITE.profiles.linkedin} target="_blank" rel="me noopener">linkedin</a>
            <a href={SITE.profiles.kde} target="_blank" rel="noopener">kde invent</a>
            <a href={SITE.calendar} target="_blank" rel="noopener">book 15 minutes</a>
          </address>
        </Reveal>
        <Reveal delay={110}>
          <div className="colophon-row">
            {/* Kept, but quiet — it lives down here rather than in the hero. */}
            <pre className="pika" aria-hidden="true">{` (\\__/)
(•ω•)ノ
/ > ⚡`}</pre>
            <p className="colophon">
              Set in Faustina and Krub. The sky is a two-colour halftone drawn in
              a fragment shader — there are no images in this design.
              <br />
              &copy; {new Date().getFullYear()} {SITE.handle.toLowerCase()}
              {' · '}pokedex entry #025
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
