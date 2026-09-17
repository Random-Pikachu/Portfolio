import { Words } from '../motion/primitives';
import { NOW, SITE, TOOLBOX } from '../data/site';
import { DimensionLine } from '../sheet/DimensionLine';

/**
 * Fig. 1: frame 8 of the survey, a thirteen-second exposure of the sky
 * through a circular opening. The caption states only what the file's EXIF
 * states; the photo is served uncut and unfiltered.
 */
const FIG = {
  slug: 'img-20241018-033337741',
  width: 1600,
  height: 2000,
  alt: 'The night sky seen through a circular opening in a dark structure, a thirteen-second exposure.',
  caption: 'Fig. 1 · 13 s · f/1.9 · 24 mm · 18 Oct 2024 · 03:33 IST · Nothing Phone (1)',
};

/**
 * Sheet 01, General. The pull line comes to ink word by word as the sheet
 * scrolls in; under it the measure it was set to, the paragraph, and the two
 * small tables. Fig. 1 on the right with its impossible diameter.
 */
export function About() {
  return (
    <div className="sheet general">
      <div className="grid-8 general__grid">
        <div className="general__text">
          <Words
            className="t-pull general__pull"
            text={`I am ${SITE.name}, a third-year Integrated Dual Degree student, B.Tech IT and MBA, at ABV-IIITM Gwalior. I like building interesting projects and occasionally contributing to open source.`}
          />
          <DimensionLine label="52 ch" className="general__dim" />
          <p className="t-body general__para">
            Besides this, I like doing{' '}
            <a href="/photography" className="underline-draw general__link">
              photography
            </a>{' '}
            and sometimes solve LeetCode and Codeforces problems to keep the brain warm. When I&apos;m not doing any of that,
            I&apos;m probably sleeping.
          </p>

          <div className="general__tables">
            <div className="spec">
              <h3 className="t-label spec__title">Currently</h3>
              <dl className="spec__rows">
                {NOW.map((n) => (
                  <div key={n.label} className="spec__row">
                    <dt className="t-data">{n.label}</dt>
                    <dd className="t-data">
                      {'href' in n ? (
                        <a href={n.href} className="underline-draw">
                          {n.text}
                        </a>
                      ) : (
                        n.text
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="spec">
              <h3 className="t-label spec__title">Instruments</h3>
              <dl className="spec__rows">
                {TOOLBOX.map((g) => (
                  <div key={g.group} className="spec__row">
                    <dt className="t-data">{g.group}</dt>
                    <dd className="t-data">{g.items.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <figure className="general__fig fig">
          <div className="fig__frame">
            <img
              src={`/photos/${FIG.slug}-800.webp`}
              srcSet={`/photos/${FIG.slug}-800.webp 800w, /photos/${FIG.slug}-1600.webp 1600w`}
              sizes="(max-width: 47.99rem) 100vw, 28vw"
              width={FIG.width}
              height={FIG.height}
              alt={FIG.alt}
              loading="lazy"
              decoding="async"
            />
            <DimensionLine label="Ø 1 night" vertical className="fig__dim" />
          </div>
          <figcaption className="t-label fig__cap">{FIG.caption}</figcaption>
        </figure>
      </div>
    </div>
  );
}
