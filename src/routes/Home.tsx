import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Board, { type Scrap } from '../components/Board';
import { Underline, Circled, Arrow, Star, Highlight, Tape } from '../components/Doodle';
import { PROJECTS } from '../data/work';
import { SITE } from '../data/site';
import { PHOTOS } from '../data/photos';

/** Clipped screenshots and polaroids, scattered across the cutting board. */
function boardScraps(): Scrap[] {
  const shots = PROJECTS.filter((p) => p.shot).slice(0, 4);
  const photos = PHOTOS.slice(0, 3);
  return [
    ...shots.map((p, i) => ({
      id: p.slug,
      x: [4, 38, 13, 52][i] ?? 20,
      y: [8, 4, 46, 44][i] ?? 30,
      rotate: [-3.5, 2.4, 1.8, -2.2][i] ?? 0,
      node: (
        <figure className="cut">
          <Tape className="cut-tape" rotate={[-6, 5, -3, 7][i] ?? 0} />
          <img src={p.shot!} alt={p.title} draggable={false} />
          <figcaption>{p.title}</figcaption>
        </figure>
      ),
    })),
    ...photos.map((ph, i) => ({
      id: `pl-${ph.slug}`,
      x: [74, 66, 82][i] ?? 70,
      y: [10, 52, 32][i] ?? 40,
      rotate: [4.2, -5, 2][i] ?? 0,
      node: (
        <figure className="polaroid">
          <img src={`/photos/${ph.slug}-400.webp`} alt={ph.alt} draggable={false} />
          <figcaption>Nothing Phone (1)</figcaption>
        </figure>
      ),
    })),
  ];
}

export default function Home() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <header className="hero">
        <Reveal>
          <p className="kicker">
            <Star className="kicker-star" />
            Hi, I&rsquo;m Sangam &mdash; from Gwalior, building for Copenhagen
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="mega">
            I build AI systems<br />
            you can actually{' '}
            <span className="mark">
              check
              <Underline className="mark-u" />
            </span>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <div className="hero-note">
            <Arrow className="hero-arrow" />
            <p>
              The model reads and ranks. <strong>The code decides.</strong> Anything
              a model decides on its own, you can&rsquo;t defend to a customer, a
              regulator, or yourself at two in the morning.
            </p>
          </div>
        </Reveal>
      </header>

      {/* ─── The board ────────────────────────────────────────────────── */}
      <section className="sec board-sec" aria-labelledby="board-h">
        <Reveal>
          <h2 id="board-h" className="sec-h">
            Stuff I&rsquo;ve made
            <span className="sec-sub">(go on, move them)</span>
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <Board scraps={boardScraps()} label="Draggable screenshots and photographs" />
        </Reveal>
      </section>

      {/* ─── The void ─────────────────────────────────────────────────── */}
      <section className="void" aria-labelledby="void-h">
        <Reveal>
          <h2 id="void-h" className="void-h">
            Right now I&rsquo;m the{' '}
            <span className="mark">
              founding engineer
              <Circled className="mark-c" color="var(--coral-lt)" />
            </span>{' '}
            at Retsguide, Copenhagen.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="void-p">
            I built the product end to end and I&rsquo;m building its legal brain &mdash;
            a knowledge graph no model writes into, so every claim in a report traces
            back to the law it rests on. Before that: real-time systems at a San
            Francisco startup, and five patches merged into KDE Plasma that now ship
            to millions of desktops.
          </p>
        </Reveal>
      </section>

      {/* ─── Work ─────────────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="work-h">
        <Reveal>
          <h2 id="work-h" className="sec-h">
            Everything else
            <Link className="sec-link" to="/work">the full list &rarr;</Link>
          </h2>
        </Reveal>
        <ul className="notes">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 45}>
              <article className="note" style={{
                '--tilt': `${[-1.4, 1.1, -0.7, 1.6, -1.2, 0.8, -1.6, 1.3, -0.9, 1.5][i] ?? 0}deg`,
              } as React.CSSProperties}>
                <p className="note-top">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span>{p.year}</span>
                </p>
                <h3>
                  {p.featured ? <Link to={`/work/${p.slug}`}>{p.title}</Link> : p.title}
                </h3>
                <p className="note-body">{p.blurb}</p>
                <p className="note-stack">{p.stack.join(' · ')}</p>
                <p className="note-links">
                  {p.featured && <Link to={`/work/${p.slug}`}>case study</Link>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ─── Plates ───────────────────────────────────────────────────── */}
      <section className="sec" aria-labelledby="ph-h">
        <Reveal>
          <h2 id="ph-h" className="sec-h">
            <span className="mark">
              Photographs
              <Highlight className="mark-h" />
            </span>
            <Link className="sec-link" to="/photography">all {PHOTOS.length} &rarr;</Link>
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <p className="lede">
            All of it on a Nothing Phone&nbsp;(1), mostly the hour before the light goes.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <ul className="strip">
            {PHOTOS.slice(0, 10).map((ph, i) => (
              <li key={ph.slug} style={{ '--tilt': `${(i % 2 ? 1.6 : -1.8)}deg` } as React.CSSProperties}>
                <img src={`/photos/${ph.slug}-400.webp`} alt={ph.alt}
                     width={ph.width} height={ph.height} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ─── Contact ──────────────────────────────────────────────────── */}
      <section className="contact" aria-labelledby="c-h">
        <Reveal>
          <h2 id="c-h" className="contact-h">
            Say hi
            <Star className="contact-star" />
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <p className="contact-mail">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </Reveal>
        <Reveal delay={110}>
          <nav className="contact-links" aria-label="Elsewhere">
            <a href={SITE.profiles.github} target="_blank" rel="me noopener">GitHub</a>
            <a href={SITE.profiles.linkedin} target="_blank" rel="me noopener">LinkedIn</a>
            <a href={SITE.profiles.kde} target="_blank" rel="noopener">KDE</a>
            <a href={SITE.resume}>Résumé</a>
            <a href={SITE.calendar} target="_blank" rel="noopener">Book a call</a>
          </nav>
        </Reveal>
        <Reveal delay={160}>
          <p className="colophon">
            Every mark on this page is SVG, drawn by hand and roughened with a
            turbulence filter &mdash; no stock illustration anywhere.
            &copy; {new Date().getFullYear()} {SITE.handle} &middot; #025
          </p>
        </Reveal>
      </section>
    </>
  );
}
