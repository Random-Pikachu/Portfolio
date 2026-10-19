import { useParams } from 'react-router-dom';
import { Arrow } from '../components/Icon';
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
  const greeting = who?.greeting ?? (who ? `Hi ${who.name}.` : `For the team at ${pitch.company}.`);
  const note = who?.note ?? pitch.note;
  const slugs = who?.highlights ?? pitch.highlights;

  return (
    <>
      <section className="grid" style={{ paddingBlock: 'var(--s-5)' }} aria-labelledby="pitch-h">
        <header className="room-head">
          <div className="room-head-row">
            <span className="fine">Written for {pitch.company}</span>
            {pitch.role && <span className="fine">{pitch.role}</span>}
          </div>
          <h1 className="h1" id="pitch-h" data-rv="head" style={{ marginTop: 'var(--s-3)' }}>
            <span className="w"><span className="g">{greeting}</span></span>
          </h1>
        </header>
        <div style={{ gridColumn: '1 / span min(8, var(--cols))' }}>
          <p className="lead" data-rv="text" style={{ marginTop: 'var(--s-3)', maxWidth: '27.4em' }}>
            {note}
          </p>
          <dl className="kv" data-rv="row" style={{ marginTop: 'var(--s-4)' }}>
            <div><dt>From</dt><dd style={{ color: 'var(--fg)' }}>{SITE.name}</dd></div>
            <div><dt>Now</dt><dd style={{ color: 'var(--fg)' }}>Founding engineer, Retsguide, Copenhagen</dd></div>
            {who?.title && <div><dt>To</dt><dd style={{ color: 'var(--fg)' }}>{who.name}, {who.title}</dd></div>}
          </dl>
        </div>
      </section>

      <section className="grid" data-sun="noon"
               style={{ paddingBlock: 'var(--s-5)' }} aria-labelledby="worth-h">
        <header className="room-head">
          <div className="room-head-row"><span className="fine">Worth your time</span></div>
          <h2 className="h2" id="worth-h" data-rv="head">
            <span className="w"><span className="g">Start with these three.</span></span>
          </h2>
        </header>
        <ul className="rows" style={{ gridTemplateColumns: 'subgrid' }}>
          {slugs.map((s, i) => {
            const p = PROJECT_BY_SLUG[s];
            if (!p) return null;
            const href = p.featured ? `/work/${p.slug}` : (p.live || p.github || '/work');
            return (
              <li key={s} data-rv="row">
                <a className="row" href={href}>
                  <span className="mono row-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="row-main">
                    <span className="h3">{p.title}</span>
                    <span className="row-blurb">{p.blurb}</span>
                  </span>
                  <span className="fine row-stack">{p.stack.slice(0, 3).join(' · ')}</span>
                  <span className="fine row-end">{p.year}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid" style={{ paddingBlock: 'var(--s-4) var(--s-5)' }}>
        <div style={{ gridColumn: '1 / span min(8, var(--cols))' }}>
          <span className="fine">Everything else</span>
          <dl className="kv" data-rv="row" style={{ marginTop: 'var(--s-3)' }}>
            <div><dt>Email</dt><dd><a className="lnk" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
            <div><dt>Calendar</dt><dd><a className="lnk" href={SITE.calendar} target="_blank" rel="noopener">Fifteen minutes</a></dd></div>
            <div><dt>Résumé</dt><dd><a className="lnk" href={SITE.resume}>resume.pdf</a></dd></div>
            <div><dt>GitHub</dt><dd><a className="lnk" href={SITE.profiles.github} target="_blank" rel="noopener">Random-Pikachu <Arrow /></a></dd></div>
          </dl>
        </div>
      </section>
    </>
  );
}
