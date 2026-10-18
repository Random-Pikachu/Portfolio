import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PROJECTS } from '../data/work';
import { EXPERIENCES, SITE } from '../data/site';
import { PHOTOS } from '../data/photos';

/**
 * No hero. The page opens on the sentence that says who he is and what he
 * does, and the work starts about one screen down. A full-viewport opener
 * pushes everything that proves the point below the fold.
 */
export default function Home() {
  return (
    <>
      <Reveal as="section" className="intro">
        <h1>Sangam Pratap Singh</h1>
        <p className="role">Founding engineer &amp; AI systems · Copenhagen</p>
        <div className="prose">
          <p>
            I build AI systems that can be checked. A language model is very good
            at reading a document and very bad at being accountable for what it
            concluded, so I use it for the first job and never the second — the
            model reads and ranks, the code decides.
          </p>
          <p>
            Right now I&apos;m the founding engineer at{' '}
            <a href="https://retsguide.dk/" target="_blank" rel="noopener">Retsguide</a>,
            a legal-tech startup in Copenhagen, where I built the product end to
            end and am now building its legal brain. Before that: real-time
            systems at a San Francisco startup, and five patches merged into{' '}
            <a href={SITE.profiles.kde} target="_blank" rel="noopener">KDE Plasma</a>.
          </p>
        </div>
        <p className="status" style={{ marginTop: 'var(--s5)' }}>
          <span className="dot" aria-hidden="true" />
          Open to founding engineer and AI roles
        </p>
      </Reveal>

      {/* ─── Work ─────────────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="work-h">
        <div className="section-head">
          <h2 id="work-h">Work</h2>
          <Link to="/work">all projects &rarr;</Link>
        </div>
        <ul className="list">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 28}>
              {p.featured ? (
                <Link className="item" to={`/work/${p.slug}`}>
                  <Row p={p} caseStudy />
                </Link>
              ) : (
                <a className="item" href={p.live || p.github} target="_blank" rel="noopener">
                  <Row p={p} />
                </a>
              )}
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ─── Experience ───────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="exp-h">
        <div className="section-head"><h2 id="exp-h">Experience</h2></div>
        <ul className="list">
          {EXPERIENCES.map((e) => (
            <Reveal as="li" key={e.company}>
              <div className="item">
                <div className="item-row">
                  <span className="item-title">
                    <span className="exp-role">{e.role}</span>{' '}
                    <span className="exp-co">at {e.company}</span>
                  </span>
                  <span className="meta item-year">{e.period}</span>
                </div>
                <ul className="exp-points">
                  {e.points.slice(0, 3).map((pt, j) => (
                    <li key={j}>
                      {pt.href && pt.label ? (
                        <>
                          <a className="inline-link" href={pt.href} target="_blank" rel="noopener">{pt.label}</a>
                          {' — '}{pt.text}
                        </>
                      ) : pt.text}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ─── Photography ──────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="ph-h">
        <div className="section-head">
          <h2 id="ph-h">Photography</h2>
          <Link to="/photography">see all &rarr;</Link>
        </div>
        <Reveal>
          <ul className="photo-row">
            {PHOTOS.slice(0, 4).map((ph) => (
              <li key={ph.slug}>
                <img src={`/photos/${ph.slug}-400.webp`} alt={ph.alt}
                     width={ph.width} height={ph.height} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <footer className="foot">
        <a href={`mailto:${SITE.email}`}>email</a>
        <a href={SITE.profiles.github} target="_blank" rel="me noopener">github</a>
        <a href={SITE.profiles.linkedin} target="_blank" rel="me noopener">linkedin</a>
        <a href={SITE.calendar} target="_blank" rel="noopener">book a call</a>
        <span className="meta foot-end">press t for {' '}theme</span>
      </footer>
    </>
  );
}

function Row({ p, caseStudy = false }: { p: (typeof PROJECTS)[number]; caseStudy?: boolean }) {
  return (
    <>
      <div className="item-row">
        <span className="item-title">
          {p.title}
          {caseStudy && <span className="arrow" aria-hidden="true">&rarr;</span>}
        </span>
        <span className="meta item-year">{p.year}</span>
      </div>
      <p className="item-desc">{p.blurb}</p>
      <ul className="item-tags">{p.stack.slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul>
    </>
  );
}
