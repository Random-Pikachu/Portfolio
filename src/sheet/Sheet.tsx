import { useEffect, useRef, type ReactNode } from 'react';
import { registerSheet } from './scroll';
import { SheetRule } from './SheetRule';

/**
 * One sheet of the set: a section one viewport tall (at least), a rule with
 * crosshairs at the top, a head row that names the sheet, and the content.
 * The head's text is the section heading, focusable so anchor navigation can
 * land keyboard and screen-reader users on it.
 */
export function Sheet({
  id,
  num,
  block,
  heading,
  caption,
  children,
  className = '',
}: {
  id: string;
  num: string;
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
    <section ref={ref} id={id} className={`sheet-section ${className}`} aria-labelledby={`${id}-title`} data-sheet={num}>
      <div className="sheet">
        <SheetRule />
        <div className="sheet-head">
          <h2 id={`${id}-title`} tabIndex={-1} data-sheet-heading className="t-label sheet-head__title">
            <span aria-hidden="true">
              <b>Sheet {num}</b> · {block}
            </span>
            <span className="sr-only">{heading}</span>
          </h2>
          {caption ? <p className="t-label sheet-head__caption">{caption}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
