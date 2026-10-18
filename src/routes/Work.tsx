import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PROJECTS } from '../data/work';

export default function Work() {
  return (
    <>
      <Reveal as="section" className="intro">
        <h1>Work</h1>
        <p className="role">
          Three of these have a case study. The rest shipped and taught me something.
        </p>
      </Reveal>

      <section className="section">
        <ul className="list">
          {PROJECTS.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 6) * 28}>
              <div className="item">
                <div className="item-row">
                  <span className="item-title">{p.title}</span>
                  <span className="meta item-year">{p.year}</span>
                </div>
                <p className="item-desc">{p.blurb}</p>
                <ul className="item-tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                <p className="item-links">
                  {p.featured && <Link to={`/work/${p.slug}`}>case study &rarr;</Link>}
                  {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                  {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
