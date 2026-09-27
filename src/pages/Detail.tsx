import { PLATES } from '../data/site';
import { WORK } from '../data/content.generated';
import { Sheet } from '../sheet/Sheet';
import { Outline } from './Outline';

/**
 * /work/<slug>, the detail sheet of one plate. The same fields the plate
 * shows, then the body compiled from content/work/<slug>.md, with the
 * outline beside it. Built only when the file says published: true.
 */
export function Detail({ slug }: { slug: string }) {
  const i = PLATES.findIndex((p) => p.slug === slug);
  const p = PLATES[i];
  const meta = WORK[slug];
  if (!p || !meta?.published) {
    return (
      <main id="main" className="min-h-screen">
        <div className="sheet detail">
          <p className="t-body">This plate is not charted.</p>
        </div>
      </main>
    );
  }
  const prev = PLATES[i - 1];
  const next = PLATES[i + 1];
  const link = (q: typeof p) => (WORK[q.slug]?.published ? `/work/${q.slug}` : `/#project-${q.slug}`);

  return (
    <main id="main" className="min-h-screen">
      <Sheet id={`detail-${p.slug}`} num={`${i + 1} of ${PLATES.length}`} kind="Detail" block="Details" heading={p.title} caption={p.stack.join(' · ')}>
        <div className="sheet detail">
          <div className="grid-8 detail__grid">
            <header className="detail__head">
              <h1 className="t-display-1 detail__title">{p.title}</h1>
              <p className="t-pull detail__line">{p.summary}</p>
            </header>

            <figure className="detail__print">
              {p.image ? (
                <img
                  src={`/work/${p.image}-1600.webp`}
                  srcSet={`/work/${p.image}-960.webp 960w, /work/${p.image}-1600.webp 1600w`}
                  sizes="(max-width: 47.99rem) 100vw, 60vw"
                  width={1600}
                  height={1200}
                  alt={`${p.title} screenshot`}
                  decoding="async"
                />
              ) : null}
            </figure>

            <dl className="detail__spec">
              {meta.role ? (
                <div>
                  <dt className="t-label">Role</dt>
                  <dd className="t-body">{meta.role}</dd>
                </div>
              ) : null}
              {meta.hardest ? (
                <div>
                  <dt className="t-label">Hardest problem</dt>
                  <dd className="t-body">{meta.hardest}</dd>
                </div>
              ) : null}
              {meta.outcomes.length ? (
                <div>
                  <dt className="t-label">Outcomes</dt>
                  <dd className="t-body">
                    <ul className="detail__outcomes">
                      {meta.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="t-label">Stack</dt>
                <dd className="t-data">{p.stack.join(' · ')}</dd>
              </div>
              <div>
                <dt className="t-label">Links</dt>
                <dd className="t-data detail__links">
                  {p.live ? (
                    <a href={p.live} target="_blank" rel="noopener" className="underline-draw">
                      Live ↗
                    </a>
                  ) : null}
                  <a href={p.github} target="_blank" rel="noopener" className="underline-draw">
                    GitHub ↗
                  </a>
                  {p.youtube ? (
                    <a href={p.youtube} target="_blank" rel="noopener" className="underline-draw">
                      Demo ↗
                    </a>
                  ) : null}
                </dd>
              </div>
            </dl>

            <article className="detail__body" id="detail-article" aria-label="Case study">
              <div className="prose" dangerouslySetInnerHTML={{ __html: meta.html }} />
              <nav className="note__pager t-data" aria-label="Other details">
                {prev ? (
                  <a href={link(prev)} className="note__pager-link">
                    <span className="t-label">← Detail {i}</span>
                    <span>{prev.title}</span>
                  </a>
                ) : (
                  <span />
                )}
                {next ? (
                  <a href={link(next)} className="note__pager-link note__pager-link--next">
                    <span className="t-label">Detail {i + 2} →</span>
                    <span>{next.title}</span>
                  </a>
                ) : null}
              </nav>
            </article>

            <div className="detail__outline">
              <Outline headings={meta.headings} articleId="detail-article" />
            </div>
          </div>
        </div>
      </Sheet>
    </main>
  );
}
