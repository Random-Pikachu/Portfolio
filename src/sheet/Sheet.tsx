import { useEffect, useRef, type ReactNode } from 'react';
import { registerSheet } from './scroll';
import { SheetRule } from './SheetRule';

/**
 * One chart of the atlas: a section one viewport tall (at least), a rule with
 * crosshairs at the top, a head row that names the chart, and the content.
 * The head's text is the section heading, focusable so anchor navigation can
 * land keyboard and screen-reader users on it.
 */
export function Sheet({
  id,
  num,
  kind = 'Chart',
  headless = false,
  block,
  heading,
  caption,
  children,
  className = '',
}: {
  id: string;
  num: string;
  /** What the number counts: a chart of the atlas, a note, a plate. */
  kind?: string;
  /** The head is the section's h2, except on the cover, whose heading is the h1 in its content. */
  headless?: boolean;
  block: string;
  heading: string;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return registerSheet(ref.current, id);
  }, [id]);

  return (
    <section ref={ref} id={id} className={`sheet-section ${className}`} aria-labelledby={headless ? `${id}-h1` : `${id}-title`} data-sheet={num}>
      <div className="sheet">
        <SheetRule />
        <div className="sheet-head">
          {headless ? (
            <p id={`${id}-title`} className="t-label sheet-head__title" aria-hidden="true">
              <b>
                {kind} {num}
              </b>{' '}
              · {block}
            </p>
          ) : (
            <h2 id={`${id}-title`} tabIndex={-1} data-sheet-heading className="t-label sheet-head__title">
              <span aria-hidden="true">
                <b>
                  {kind} {num}
                </b>{' '}
                · {block}
              </span>
              <span className="sr-only">{heading}</span>
            </h2>
          )}
          {caption ? <p className="t-label sheet-head__caption">{caption}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
