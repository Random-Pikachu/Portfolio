import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { FEATURED, type Project } from '../data/site';
import { STORIES } from '../data/stories';
import { WORK } from '../data/content.generated';
import { SectionHead } from './SectionHead';

/** The slug in a #work-<slug> hash, or null. */
const slugInHash = () => (typeof location === 'undefined' ? null : (location.hash.match(/^#work-([\w-]+)$/) ?? [])[1] ?? null);

/**
 * One project: the cover, the name, the one line, the one number, and the
 * sixty-second story that opens beneath them. The cover and the "story"
 * control both toggle it; the panel is in the prerendered HTML either way,
 * so a crawler reads every story. Opening one sets the hash, so a story can
 * be linked; a page that loads on #work-<slug> opens that one.
 */
function WorkItem({ p, index, open, onToggle }: { p: Project; index: number; open: boolean; onToggle: (slug: string) => void }) {
  const story = STORIES[p.slug];
  const panelId = `story-${p.slug}`;
  const links = [
    p.live ? { label: 'Live', href: p.live } : null,
    { label: 'Code', href: p.github },
    p.youtube ? { label: 'Demo', href: p.youtube } : null,
    WORK[p.slug]?.published ? { label: 'Case study', href: `/work/${p.slug}`, internal: true } : null,
  ].filter((l): l is { label: string; href: string; internal?: boolean } => l !== null);

  return (
    <li id={`work-${p.slug}`} className="work-item" data-open={open ? '' : undefined} data-reveal>
      <button
        type="button"
        className="work-cover"
        onClick={() => onToggle(p.slug)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${open ? 'Close' : 'Open'} the story of ${p.title}`}
        tabIndex={-1}
      >
        {p.image ? (
          <img
            src={`/work/${p.image}-960.webp`}
            srcSet={`/work/${p.image}-960.webp 960w, /work/${p.image}-1600.webp 1600w`}
            sizes="(max-width: 63.99rem) calc(100vw - 40px), 58vw"
            width={1600}
            height={1200}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <span className="work-cover__empty t-micro">No cover yet</span>
        )}
      </button>

      <div className="work-item__text">
        <p className="t-label work-item__no">{p.index}</p>
        <h3 className="t-h3 work-item__title">{p.title}</h3>
        <p className="t-body work-item__summary">{p.summary}</p>
        {story?.number ? <p className="t-label work-item__number">{story.number}</p> : null}
        <button type="button" className="work-item__toggle" onClick={() => onToggle(p.slug)} aria-expanded={open} aria-controls={panelId}>
          {open ? <Minus size={16} strokeWidth={1.75} aria-hidden="true" /> : <Plus size={16} strokeWidth={1.75} aria-hidden="true" />}
          {open ? 'Close the story' : 'The 60-second story'}
        </button>
      </div>

      <div id={panelId} className="work-story" hidden={!open}>
        {story ? (
          <dl className="work-story__parts">
            <div>
              <dt className="t-label">The problem</dt>
              <dd className="t-body">{story.problem}</dd>
            </div>
            <div>
              <dt className="t-label">The call</dt>
              <dd className="t-body">{story.call}</dd>
            </div>
            <div>
              <dt className="t-label">The outcome</dt>
              <dd className="t-body">{story.outcome}</dd>
            </div>
            {story.number ? (
              <div>
                <dt className="t-label">One number</dt>
                <dd className="t-body">{story.number}</dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="t-body work-story__missing">The story of {p.title} is not written yet.</p>
        )}
        <p className="t-micro work-story__stack">{p.stack.join(' · ')}</p>
        <ul className="work-story__links">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} {...(l.internal ? {} : { target: '_blank', rel: 'noopener' })} className="work-story__link">
                {l.label}
                <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/**
 * The work: six covers in a vertical rhythm, alternating sides so it never
 * reads as a grid of cards, each with its sixty-second story folded under
 * it. Every cover is one of the project's own screenshots, graded by the
 * page's grain and an edge that falls into the night.
 */
export function Work() {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const slug = slugInHash();
      if (slug && FEATURED.some((p) => p.slug === slug)) setOpen(slug);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const onToggle = useCallback((slug: string) => {
    setOpen((cur) => {
      const next = cur === slug ? null : slug;
      history.replaceState(null, '', next ? `#work-${next}` : '#work');
      return next;
    });
  }, []);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="frame">
        <SectionHead id="work" label="Work" title="Selected work" />
        <ol className="work-list">
          {FEATURED.map((p, i) => (
            <WorkItem key={p.slug} p={p} index={i} open={open === p.slug} onToggle={onToggle} />
          ))}
        </ol>
      </div>
    </section>
  );
}
