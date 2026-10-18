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
 * carry noindex. An unknown person slug falls back to the company page so a
 * mistyped or forwarded link still lands somewhere sensible.
 */
export default function Pitch() {
  const { company, person } = useParams();
  const pitch = company ? PITCH_BY_SLUG[company] : undefined;
  if (!pitch) return <NotFound />;

  const who = person ? pitch.people?.find((x) => x.slug === person) : undefined;
  const greeting = who?.greeting ?? (who ? `Hi ${who.name}` : `For the team at ${pitch.company}`);
  const note = who?.note ?? pitch.note;
  const slugs = who?.highlights ?? pitch.highlights;

  return (
    <article>
      <Reveal as="section" className="intro">
        <h1>{greeting}</h1>
        {pitch.role && <p className="role">{pitch.role} · {SITE.name}</p>}
        <div className="prose"><p>{note}</p></div>
      </Reveal>

      <section className="section">
        <div className="section-head"><h2>Worth your time</h2></div>
        <ul className="list">
          {slugs.map((s, i) => {
            const p = PROJECT_BY_SLUG[s];
            if (!p) return null;
            const href = p.featured ? `/work/${p.slug}` : (p.live || p.github || '#');
            return (
              <Reveal as="li" key={s} delay={i * 30}>
                <a className="item" href={href}>
                  <div className="item-row">
                    <span className="item-title">{p.title}<span className="arrow" aria-hidden="true">&rarr;</span></span>
                    <span className="meta item-year">{p.year}</span>
                  </div>
                  <p className="item-desc">{p.blurb}</p>
                  <ul className="item-tags">{p.stack.slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul>
                </a>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <footer className="foot">
        <a href={`mailto:${SITE.email}`}>email</a>
        <a href={SITE.calendar} target="_blank" rel="noopener">book 15 minutes</a>
        <a href={SITE.resume}>resume</a>
        <a href={SITE.profiles.github} target="_blank" rel="noopener" className="foot-end">github</a>
      </footer>
    </article>
  );
}
