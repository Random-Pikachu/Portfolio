import { useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
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
      <section className="slab" aria-labelledby="pitch">
        <div className="wrap">
          <Reveal>
            <p className="pitch-seal">Written for {pitch.company}</p>
            <h1 className="display" id="pitch" style={{ marginTop: 22, maxWidth: '14ch' }}>
              {greeting}
            </h1>
            <p className="lead" style={{ marginTop: 26 }}>{note}</p>

            <dl className="kv" style={{ marginTop: 'clamp(34px,5vh,58px)' }}>
              <div><dt>From</dt><dd>{SITE.name}</dd></div>
              {pitch.role && <div><dt>For</dt><dd>{pitch.role}</dd></div>}
              <div><dt>Now</dt><dd>Founding engineer, Retsguide, Copenhagen</dd></div>
              {who?.title && <div><dt>To</dt><dd>{who.name} — {who.title}</dd></div>}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="slab slab--ink" aria-labelledby="worth">
        <div className="wrap">
          <Reveal as="header" className="shead">
            <div className="shead-row"><p className="tag">Worth your time</p></div>
            <h2 className="h2" id="worth">Three things, if you only read three.</h2>
          </Reveal>
          <ul className="work">
            {slugs.map((s, i) => {
              const p = PROJECT_BY_SLUG[s];
              if (!p) return null;
              const href = p.featured ? `/work/${p.slug}` : (p.live || p.github || '/work');
              return (
                <Reveal as="li" key={s} delay={i * 60}>
                  <a className="row" href={href}>
                    <span className="row-n">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="row-title">{p.title}</span>
                      <span className="row-blurb">{p.blurb}</span>
                      <span className="row-stack">{p.stack.join(' · ')}</span>
                    </span>
                    <span className="row-right">
                      <span className="row-year">{p.year}</span>
                      <span className="row-go" aria-hidden="true">↗</span>
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="slab slab--tight" aria-labelledby="refs">
        <div className="wrap">
          <Reveal>
            <div className="shead-row"><p className="tag" id="refs">Where to find the rest</p></div>
            <dl className="kv" style={{ borderTop: 0 }}>
              <div><dt>Email</dt><dd><a className="lnk" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
              <div><dt>Calendar</dt><dd><a className="lnk" href={SITE.calendar} target="_blank" rel="noopener">Fifteen minutes, any time</a></dd></div>
              <div><dt>Résumé</dt><dd><a className="lnk" href={SITE.resume}>resume.pdf</a></dd></div>
              <div><dt>GitHub</dt><dd><a className="lnk" href={SITE.profiles.github} target="_blank" rel="noopener">github.com/Random-Pikachu</a></dd></div>
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
