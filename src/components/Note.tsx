import { createContext, useContext, useId, useRef, type ReactNode } from 'react';

/**
 * A citation in the prose and its note in the margin, as one component.
 *
 * The number is allocated by a counter on the surrounding document, so
 * citations stay in reading order without anyone numbering them by hand —
 * which is the whole reason a paper's apparatus survives editing.
 */
const Counter = createContext<{ next: () => number } | null>(null);

export function NoteProvider({ children }: { children: ReactNode }) {
  const n = useRef(0);
  return <Counter.Provider value={{ next: () => (n.current += 1) }}>{children}</Counter.Provider>;
}

export function Note({ children, source }: { children: ReactNode; source?: string }) {
  const ctx = useContext(Counter);
  const id = useId();
  const num = useRef<number | null>(null);
  num.current ??= ctx ? ctx.next() : 0;

  return (
    <span className="cite-wrap">
      <sup className="cite" aria-describedby={id}>{num.current}</sup>
      <span className="note" id={id} role="note">
        <span className="note-n">{num.current}</span>
        {source && <b className="note-src">{source}</b>}
        <span className="note-body">{children}</span>
      </span>
    </span>
  );
}
