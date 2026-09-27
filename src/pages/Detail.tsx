import { FEATURED } from '../data/site';
import { WORK } from '../data/content.generated';
import { PageHead } from '../shell/PageHead';
import { Outline } from './Outline';

/**
 * /work/<slug>, the case study of one project: the same fields the home page
 * shows, then the body compiled from content/work/<slug>.md, with the outline
 * beside it. Built only when the file says published: true.
 */
export function Detail({ slug }: { slug: string }) {
  const i = FEATURED.findIndex((p) => p.slug === slug);
  const p = FEATURED[i];
  const meta = WORK[slug];
  if (!p || !meta?.published) {
    return (
      <main id="main" className="min-h-screen">
        <PageHead label="Work" title="This case study does not exist." />
      </main>
    );
  }
  const prev = FEATURED[i - 1];
  const next = FEATURED[i + 1];
  const link = (q: typeof p) => (WORK[q.slug]?.published ? `/work/${q.slug}` : `/#work-${q.slug}`);

  return (
    <main id="main" className="min-h-screen">
      <PageHead label={`Work · ${i + 1} of ${FEATURED.length}`} caption={p.stack.join(' · ')} />
      <div className="frame detail">
        <div className="grid detail__grid">
          <header className="detail__head">
            <h1 className="t-title detail__title">{p.title}</h1>
            <p className="t-lead detail__line">{p.summary}</p>
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
              <dd className="t-small">{p.stack.join(' · ')}</dd>
            </div>
            <div>
              <dt className="t-label">Links</dt>
              <dd className="t-small detail__links">
                {p.live ? (
                  <a href={p.live} target="_blank" rel="noopener" className="link">
                    Live ↗
                  </a>
                ) : null}
                <a href={p.github} target="_blank" rel="noopener" className="link">
                  GitHub ↗
                </a>
                {p.youtube ? (
                  <a href={p.youtube} target="_blank" rel="noopener" className="link">
                    Demo ↗
                  </a>
                ) : null}
              </dd>
            </div>
          </dl>

          <article className="detail__body" id="detail-article" aria-label="Case study">
            <div className="prose" dangerouslySetInnerHTML={{ __html: meta.html }} />
            <nav className="note__pager t-small" aria-label="Other details">
              {prev ? (
                <a href={link(prev)} className="note__pager-link">
                  <span className="t-label">← Work {i}</span>
                  <span>{prev.title}</span>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a href={link(next)} className="note__pager-link note__pager-link--next">
                  <span className="t-label">Work {i + 2} →</span>
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
    </main>
  );
}
