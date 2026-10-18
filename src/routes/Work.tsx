import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { PROJECTS } from '../data/work';

export default function Work() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <>
      <section className="page-head">
        <Reveal as="header">
          <h1 className="h1">Work</h1>
          <p className="lede">
            Three of these have a case study behind them. The rest are things I
            built, shipped and learned from.
          </p>
        </Reveal>
      </section>

      <section className="band" aria-labelledby="f-h">
        <Reveal><h2 id="f-h" className="eyebrow">Case studies</h2></Reveal>
        <ol className="worklist">
          {featured.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 70}>
              <Link to={`/work/${p.slug}`} className="workrow">
                <span className="workrow-i">{String(i + 1).padStart(2, '0')}</span>
                <span className="workrow-body">
                  <h3>{p.title}</h3>
                  <p>{p.blurb}</p>
                  <ul className="chips">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                </span>
                <span className="workrow-go" aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="band" aria-labelledby="r-h">
        <Reveal><h2 id="r-h" className="eyebrow">Also built</h2></Reveal>
        <ul className="cards">
          {rest.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 50} className="card">
              <h3>{p.title}</h3>
              <p className="card-year">{p.year}</p>
              <p>{p.blurb}</p>
              <ul className="chips">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="card-links">
                {p.github && <a href={p.github} target="_blank" rel="noopener">source</a>}
                {p.live && <a href={p.live} target="_blank" rel="noopener">live</a>}
                {p.video && <a href={p.video} target="_blank" rel="noopener">demo</a>}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
