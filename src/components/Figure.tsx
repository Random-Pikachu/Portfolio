import type { ReactNode } from 'react';

/** A numbered figure with its caption, set like a paper's. */
export default function Figure({
  n, caption, children,
}: { n: number; caption: string; children: ReactNode }) {
  return (
    <figure className="figure">
      <div className="figure-art">{children}</div>
      <figcaption>
        <b>Figure {n}</b> {caption}
      </figcaption>
    </figure>
  );
}
