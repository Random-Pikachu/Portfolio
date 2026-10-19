import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import Tile from '../components/Tile';
import { PROJECTS } from '../data/work';

export default function Work() {
  return (
    <section className="sec" aria-labelledby="idx" data-sun="noon">
      <div className="wrap">
        <Reveal as="header" className="shead">
          <div className="shead-row">
            <p className="tag">All projects</p>
            <span className="mono" style={{ color: 'var(--fg-3)' }}>
              {PROJECTS.length} of them, 2024 to 2026
            </span>
          </div>
          <h1 className="h1" id="idx">Ten projects.</h1>
          <p className="lead">
            Three have a write-up behind them. The rest are a link to the source
            and a link to the thing running.
          </p>
        </Reveal>

        <ul className="tiles">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 3) * 60}>
              <Tile p={p} n={i + 1} />
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="mono" style={{ marginTop: 'clamp(34px,5vh,56px)', color: 'var(--fg-3)' }}>
            Source for most of it is on{' '}
            <a className="lnk" href="https://github.com/Random-Pikachu" target="_blank" rel="noopener">GitHub</a>.{' '}
            <Link className="lnk" to="/">Back to the start</Link>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
