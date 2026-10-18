import { useParams } from 'react-router-dom';
import { PITCH_BY_SLUG } from '../data/pitches';
import { PROJECT_BY_SLUG } from '../data/work';
import { SITE } from '../data/site';
import NotFound from './NotFound';

/**
 * /for/<company> and /for/<company>/<person> — the same document, addressed.
 *
 * Unlisted rather than private: anyone with the link can open it, and these
 * carry noindex. An unknown person slug falls back to the company page so a
 * forwarded or mistyped link still lands somewhere sensible.
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
    <>
      <section>
        <h2 className="sec-label"><i>—</i>Addressed to {pitch.company}</h2>
        <h1 className="page-title" data-line-probe>{greeting}</h1>
        <p className="lead">{note}</p>
        <dl className="fields">
          <dt>from</dt><dd>{SITE.name}</dd>
          {pitch.role && <><dt>for</dt><dd>{pitch.role}</dd></>}
          <dt>now</dt><dd>Founding engineer, Retsguide, Copenhagen</dd>
        </dl>
      </section>

      <section>
        <h2 className="sec-label"><i>1</i>Worth your time</h2>
        <ol className="artifacts">
          {slugs.map((s, i) => {
            const p = PROJECT_BY_SLUG[s];
            if (!p) return null;
            return (
              <li key={s}>
                <span className="art-n">1.{i + 1}</span>
                <span className="art-body">
                  <span className="art-title">
                    <a href={p.featured ? `/work/${p.slug}` : (p.live || p.github || '#')}>{p.title}</a>
                  </span>
                  <span className="art-desc">{p.blurb}</span>
                  <span className="art-stack">{p.stack.join(' · ')}</span>
                </span>
                <span className="art-year">{p.year}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2 className="sec-label"><i>—</i>References</h2>
        <ol className="reflist">
          <li><span>Email</span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          <li><span>Calendar</span><a href={SITE.calendar} target="_blank" rel="noopener">15 minutes, any time</a></li>
          <li><span>Résumé</span><a href={SITE.resume}>resume.pdf</a></li>
          <li><span>GitHub</span><a href={SITE.profiles.github} target="_blank" rel="noopener">github.com/Random-Pikachu</a></li>
        </ol>
      </section>
    </>
  );
}
