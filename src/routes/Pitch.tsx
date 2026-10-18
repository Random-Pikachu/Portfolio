import { useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PITCH_BY_SLUG } from '../data/pitches';
import { PROJECT_BY_SLUG } from '../data/work';
import { SITE } from '../data/site';
import NotFound from './NotFound';

/**
 * /for/<company> and /for/<company>/<person>.
 *
 * Unlisted rather than private: anyone with the link can open it, and these
 * carry noindex. An unknown person slug falls back to the company page, so a
 * mistyped or forwarded link still lands somewhere sensible.
 */
export default function Pitch() {
  const { company, person } = useParams();
  const pitch = company ? PITCH_BY_SLUG[company] : undefined;
  if (!pitch) return <NotFound />;

  const who = person ? pitch.people?.find((x) => x.slug === person) : undefined;
  const greeting = who?.greeting ?? (who ? `Hi ${who.name}.` : `For the team at ${pitch.company}.`);
  const note = who?.note ?? pitch.note;
  const slugs = who?.highlights ?? pitch.highlights;

  return (
    <article className="pitch">
      <section className="page-head">
        <Reveal as="header">
          <h1 className="display">{greeting}</h1>
        </Reveal>
      </section>

      <section className="band">
        <Reveal><div className="prose prose-lede"><p>{note}</p></div></Reveal>

        <Reveal delay={80}>
          <dl className="fields">
            <dt>name</dt><dd>{SITE.name}</dd>
            {pitch.role && <><dt>for</dt><dd>{pitch.role}</dd></>}
            <dt>now</dt><dd>Founding engineer, Retsguide, Copenhagen</dd>
          </dl>
        </Reveal>
      </section>

      <section className="band" aria-labelledby="pw-h">
        <Reveal><h2 id="pw-h" className="eyebrow">Worth your time</h2></Reveal>
        <ol className="worklist">
          {slugs.map((s, i) => {
            const p = PROJECT_BY_SLUG[s];
            if (!p) return null;
            return (
              <Reveal as="li" key={s} delay={i * 70}>
                <a className="workrow" href={p.featured ? `/work/${p.slug}` : (p.github ?? '#')}>
                  <span className="workrow-i">{String(i + 1).padStart(2, '0')}</span>
                  <span className="workrow-body">
                    <h3>{p.title}</h3>
                    <p>{p.blurb}</p>
                    <ul className="chips">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                  </span>
                  <span className="workrow-go" aria-hidden="true">&rarr;</span>
                </a>
              </Reveal>
            );
          })}
        </ol>
      </section>

      <section className="band contact">
        <Reveal><h2 className="pull">Whenever suits.</h2></Reveal>
        <Reveal delay={80}>
          <address className="links">
            <a href={`mailto:${SITE.email}`}>email</a>
            <a href={SITE.calendar} target="_blank" rel="noopener">book 15 minutes</a>
            <a href={SITE.resume}>resume</a>
            <a href={SITE.profiles.github} target="_blank" rel="noopener">github</a>
          </address>
        </Reveal>
      </section>
    </article>
  );
}
