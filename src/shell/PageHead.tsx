/**
 * The head of a page outside the home page: a mono label, the title in
 * Fraunces when the page has no title of its own further down, and a caption.
 * No frame and no rule; the type is the head.
 */
export function PageHead({ label, title, caption }: { label: string; title?: string; caption?: string }) {
  return (
    <header className="frame page-head">
      <p className="t-label page-head__label">{label}</p>
      {title ? <h1 className="t-title page-head__title">{title}</h1> : null}
      {caption ? <p className="t-label page-head__caption">{caption}</p> : null}
    </header>
  );
}
