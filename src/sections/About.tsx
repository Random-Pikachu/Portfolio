/**
 * About: who, where the day goes, what the night is for, in three short
 * paragraphs, then the day and night split in Fraunces. Frameless, so the
 * type has the room.
 */
export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="frame grid about__grid">
        <h2 id="about-title" className="t-label about__label">
          About
        </h2>
        <div className="about__text">
          <p className="t-lead">
            I&apos;m Sangam, a third-year Integrated Dual Degree student (B.Tech IT and MBA) at ABV-IIITM Gwalior. I build
            full-stack and systems software in TypeScript, Go and C++.
          </p>
          <p className="t-body">
            Right now I work on legal technology at Retsguide in Denmark. After hours I contribute to KDE Plasma.
          </p>
          <p className="t-body">
            Besides this, I like doing{' '}
            <a href="/photography" className="link">
              photography
            </a>{' '}
            and sometimes solve LeetCode and Codeforces problems to keep the brain warm. When I&apos;m not doing any of that,
            I&apos;m probably sleeping.
          </p>
        </div>
        <p className="t-title about__split">
          Legal tech by day.
          <br />
          KDE Plasma patches by night.
        </p>
      </div>
    </section>
  );
}
