import { SITE } from '../data/site';

/**
 * Last light.
 *
 * Every page ends here: the gradient walks from the same paper the site opens
 * on down into an October evening, the sun sits on a hairline horizon, and the
 * name is cropped by the bottom of the screen. It is the one part of the site
 * that is not trying to prove anything.
 */
export default function Ending() {
  return (
    <div className="dusk">
      <section className="slab slab--dusk contact" aria-labelledby="say-hi">
        <div className="wrap">
          <p className="tag">Last light — say hello</p>
          <h2 className="display" id="say-hi" style={{ marginTop: 20 }}>
            Let’s build the <span className="em">good</span> version.
          </h2>
          <p className="lead" style={{ marginTop: 26 }}>
            Email is the fastest way to reach me and I answer the same day. If
            you are hiring a founding or AI engineer, bring the hardest part of
            the problem. If you just want to argue about retrieval, or show me
            something you shot at golden hour, that works too.
          </p>

          <a className="contact-mail" href={`mailto:${SITE.email}`}>{SITE.email}</a>

          <dl className="contact-grid">
            <div className="fact">
              <dt>Calendar</dt>
              <dd><a className="lnk" href={SITE.calendar} target="_blank" rel="noopener">Fifteen minutes</a></dd>
            </div>
            <div className="fact">
              <dt>GitHub</dt>
              <dd><a className="lnk" href={SITE.profiles.github} target="_blank" rel="noopener">Random-Pikachu</a></dd>
            </div>
            <div className="fact">
              <dt>LinkedIn</dt>
              <dd><a className="lnk" href={SITE.profiles.linkedin} target="_blank" rel="noopener">sangam21</a></dd>
            </div>
            <div className="fact">
              <dt>KDE</dt>
              <dd><a className="lnk" href={SITE.profiles.kde} target="_blank" rel="noopener">invent.kde.org</a></dd>
            </div>
          </dl>

          <p className="sendoff">
            Thanks for coming this far — hope the light was good where you are.
          </p>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-meta">
            <span>© {new Date().getFullYear()} Sangam Pratap Singh</span>
            <span>Gwalior, India · Built in the open</span>
          </div>
        </div>
        <p className="wordmark" aria-hidden="true">Sangam</p>
      </footer>
    </div>
  );
}
