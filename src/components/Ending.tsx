import Arrow from './Arrow';
import { SITE } from '../data/site';

/**
 * The end of the day.
 *
 * The band is the crossover: it is sized and spaced so that it is the only
 * thing on screen while the palette steps from day to night, and its contents
 * fade with `--dim` as that happens. Everything after it is lit by what is
 * left of the sun, low behind the name.
 */
export default function Ending() {
  return (
    <>
      <section className="band" data-sun="band" aria-hidden="true">
        <div className="band-inner">
          <p className="band-line">It gets dark around six.</p>
          <p className="band-sub">Gwalior, late October</p>
        </div>
        <Arrow className="band-arrow" />
      </section>

      <section className="sec contact" aria-labelledby="say-hi">
        <div className="wrap">
          <p className="tag">Contact</p>
          <h2 className="display" id="say-hi" style={{ marginTop: 20 }}>
            Email me.
          </h2>
          <p className="lead" style={{ marginTop: 26 }}>
            I reply the same day, usually sooner. If you’re hiring a founding
            or AI engineer, send me the worst part of the problem rather than
            the job description. If you just want to argue about retrieval, or
            show me something you shot, that’s fine too.
          </p>

          <a className="contact-mail" href={`mailto:${SITE.email}`}>{SITE.email}</a>

          <dl className="facts">
            <div className="fact">
              <dt>Calendar</dt><span className="fact-dots" aria-hidden="true" />
              <dd><a className="lnk" href={SITE.calendar} target="_blank" rel="noopener">Fifteen minutes</a></dd>
            </div>
            <div className="fact">
              <dt>GitHub</dt><span className="fact-dots" aria-hidden="true" />
              <dd><a className="lnk" href={SITE.profiles.github} target="_blank" rel="noopener">Random-Pikachu</a></dd>
            </div>
            <div className="fact">
              <dt>LinkedIn</dt><span className="fact-dots" aria-hidden="true" />
              <dd><a className="lnk" href={SITE.profiles.linkedin} target="_blank" rel="noopener">sangam21</a></dd>
            </div>
            <div className="fact">
              <dt>KDE</dt><span className="fact-dots" aria-hidden="true" />
              <dd><a className="lnk" href={SITE.profiles.kde} target="_blank" rel="noopener">invent.kde.org</a></dd>
            </div>
          </dl>

          <p className="sendoff">
            That’s the whole site. Thanks for scrolling.
          </p>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-meta">
            <span>© {new Date().getFullYear()} Sangam Pratap Singh</span>
            <span>Gwalior, India. Source on GitHub.</span>
          </div>
        </div>
        <p className="wordmark" aria-hidden="true">Sangam</p>
      </footer>
    </>
  );
}
