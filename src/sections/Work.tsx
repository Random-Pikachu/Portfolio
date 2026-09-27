import { FEATURED } from '../data/site';
import { SectionHead } from './SectionHead';

/**
 * The work, for now as a plain index of the six projects: name, one line,
 * the stack and the links, all from src/data/site.ts. The covers and the
 * sixty-second stories replace the rows in their own phase.
 */
export function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="frame">
        <SectionHead id="work" label="Work" title="Selected work" />
        <ol className="work-list">
          {FEATURED.map((p) => (
            <li key={p.slug} id={`work-${p.slug}`} className="work-row">
              <span className="t-label work-row__no">{p.index}</span>
              <div className="work-row__main">
                <h3 className="t-h3 work-row__title">{p.title}</h3>
                <p className="t-body work-row__summary">{p.summary}</p>
                <p className="t-micro work-row__stack">{p.stack.join(' · ')}</p>
              </div>
              <ul className="work-row__links">
                {p.live ? (
                  <li>
                    <a href={p.live} target="_blank" rel="noopener" className="work-row__link">
                      Live <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ) : null}
                <li>
                  <a href={p.github} target="_blank" rel="noopener" className="work-row__link">
                    Code <span aria-hidden="true">↗</span>
                  </a>
                </li>
                {p.youtube ? (
                  <li>
                    <a href={p.youtube} target="_blank" rel="noopener" className="work-row__link">
                      Demo <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
