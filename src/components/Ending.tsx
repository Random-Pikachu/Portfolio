import { Arrow, Star } from './Icon';
import { SITE } from '../data/site';
import { BENCH_SLUG, PHOTO_BY_SLUG } from '../data/photos';

/**
 * The end of the day: the crossover, the address, and the horizon.
 *
 * The band is where the palette steps from day to night. It happens over a
 * photograph that emerges out of the golden ground, is clearest at the exact
 * scroll position where the switch lands, then recedes into the night as the
 * stars come out above it. No text is ever inside the luminance band where
 * neither black nor white holds 4.5:1 — which is a better answer than fading
 * text across it, because the contrast dip becomes an exposure.
 */
export default function Ending({ band = true }: { band?: boolean }) {
  const photo = PHOTO_BY_SLUG[BENCH_SLUG];

  return (
    <>
      {band && (
        <section className="band" data-sun="band">
          <div className="band-head">
            <h2 className="plate-t" data-rv="head">
              <span className="w"><span className="g">It gets dark</span></span>
              <span className="w"><span className="g">around six.</span></span>
            </h2>
          </div>

          <div className="band-body">
            <div className="band-sticky">
              {photo && (
                <img
                  className="band-photo"
                  src={`/photos/${BENCH_SLUG}-1600.webp`}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="band-veil" />
              <div className="band-cap grid">
                <p className="mono" style={{ color: 'inherit' }}>
                  Gwalior · 12 September · 01:20
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="room grid" id="say-hi" aria-labelledby="contact-h">
        <div className="contact-main">
          <h2 id="contact-h" className="sr-only">Contact</h2>
          <a className="mail" href={`mailto:${SITE.email}`} data-rv="text">
            <span>sangampratapsingh</span><wbr /><span>21012006</span><wbr /><span>@gmail.com</span>
          </a>
          <p className="lead" data-rv="text">
            I reply the same day. If you’re hiring a founding engineer or an AI
            engineer, skip the job description and send me the part of the
            problem you’re stuck on.
          </p>
        </div>

        <dl className="kv contact-side" data-rv="row">
          <div><dt>Calendar</dt><dd><a className="lnk" href={SITE.calendar} target="_blank" rel="noopener">Fifteen minutes</a></dd></div>
          <div><dt>GitHub</dt><dd><a className="lnk" href={SITE.profiles.github} target="_blank" rel="noopener">Random-Pikachu</a></dd></div>
          <div><dt>LinkedIn</dt><dd><a className="lnk" href={SITE.profiles.linkedin} target="_blank" rel="noopener">sangam21</a></dd></div>
          <div><dt>KDE</dt><dd><a className="lnk" href={SITE.profiles.kde} target="_blank" rel="noopener">invent.kde.org</a></dd></div>
        </dl>

        <p className="tagline">
          developer <Star /> open source <Star /> cultured
        </p>
      </section>

      <footer className="foot">
        <div className="foot-glow" aria-hidden="true" />
        <div className="foot-meta grid">
          <span className="fine">© {new Date().getFullYear()} Sangam Pratap Singh</span>
          <span className="fine">
            Gwalior, India. This site’s source is{' '}
            <a className="lnk" href="https://github.com/Random-Pikachu/Portfolio" target="_blank" rel="noopener">
              on GitHub <Arrow />
            </a>
          </span>
        </div>
        <p className="wordmark" aria-hidden="true">Sangam Pratap Singh</p>
      </footer>
    </>
  );
}
