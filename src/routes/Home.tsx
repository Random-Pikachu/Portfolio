import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { FEATURED } from '../data/work';
import { EXPERIENCES, SITE } from '../data/site';
import { PHOTOS } from '../data/photos';

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
          </Reveal>
        </div>
      </section>

      {/* ─── The position ─────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="position-h">
        <Reveal>
          <h2 id="position-h" className="pull">The model extracts.<br />The code decides.</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="prose">
            <p>
              A language model is very good at reading a document and very bad at
              being accountable for what it concluded. So I use it for the first
              job and never the second.
            </p>
            <p>
              At Retsguide that means the legal knowledge graph behind our reports
              has no model writing into it, so every claim in a report traces back
              to the provision version it rests on. In the eligibility pipeline,
              OCR reads the PDF and a model classifies and extracts — then code
              applies the statutory formula and makes the decision.
            </p>
            <p>
              It is a boring principle and it is the whole job. Anything a model
              decides on its own, you cannot defend to a customer, a regulator, or
              yourself at two in the morning.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ─── Selected work ────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="work-h">
        <Reveal>
          <div className="band-head">
            <h2 id="work-h">Selected work</h2>
            <Link className="more" to="/work">all projects &rarr;</Link>
          </div>
        </Reveal>

        <ol className="worklist">
          {FEATURED.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 70}>
              <Link to={`/work/${p.slug}`} className="workrow">
                <span className="workrow-i">{String(i + 1).padStart(2, '0')}</span>
                <span className="workrow-body">
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                  <ul className="chips">
                    {p.stack.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </span>
                <span className="workrow-go" aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ─── Experience ───────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="exp-h">
        <Reveal><h2 id="exp-h">Experience</h2></Reveal>
        <div className="exps">
          {EXPERIENCES.map((e, i) => (
            <Reveal as="article" key={e.company} delay={i * 70} className="exp">
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

      {/* ─── Photography ──────────────────────────────────────────────── */}
      <section className="band" aria-labelledby="photo-h">
        <Reveal>
          <div className="band-head">
            <h2 id="photo-h">Photography</h2>
            <Link className="more" to="/photography">see all &rarr;</Link>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <ul className="strip">
            {PHOTOS.slice(0, 6).map((ph) => (
              <li key={ph.slug}>
                <img
                  src={`/photos/${ph.slug}-800.webp`}
                  width={ph.width}
                  height={ph.height}
                  alt={ph.alt}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ─── Contact ──────────────────────────────────────────────────── */}
      <section className="band contact" aria-labelledby="contact-h">
        <Reveal><h2 id="contact-h" className="pull">Say hello.</h2></Reveal>
        <Reveal delay={80}>
          <address className="links">
            <a href={`mailto:${SITE.email}`}>email</a>
            <a href={SITE.profiles.github} target="_blank" rel="me noopener">github</a>
            <a href={SITE.profiles.linkedin} target="_blank" rel="me noopener">linkedin</a>
            <a href={SITE.calendar} target="_blank" rel="noopener">book 15 minutes</a>
          </address>
        </Reveal>
        <Reveal delay={140}>
          <p className="colophon">
            Set in Faustina and Krub. The sky is a two-colour halftone, drawn in a
            fragment shader — there are no images in this design.
            {' '}&copy; {new Date().getFullYear()} {SITE.handle.toLowerCase()}
          </p>
        </Reveal>
      </section>
    </>
  );
}
