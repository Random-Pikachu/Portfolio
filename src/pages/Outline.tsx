import { useEffect, useState } from 'react';
import type { Heading } from '../data/content.generated';

/**
 * "On this sheet": the article's h2 and h3 headings, with the one currently
 * under the top of the viewport marked. Tracks with an IntersectionObserver
 * over the headings themselves; renders the same list on the server.
 */
export function Outline({ headings, articleId }: { headings: Heading[]; articleId: string }) {
  const [active, setActive] = useState<string>('');
  useEffect(() => {
    const root = document.getElementById(articleId);
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = els.find((el) => seen.get(el.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings, articleId]);

  if (!headings.length) return null;
  return (
    <nav className="on-sheet" aria-label="On this sheet">
      <p className="t-label on-sheet__title">On this sheet</p>
      <ol className="on-sheet__list">
        {headings.map((h) => (
          <li key={h.id} className={`on-sheet__item on-sheet__item--${h.depth} ${active === h.id ? 'is-active' : ''}`}>
            <a href={`#${h.id}`} className="t-data">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
