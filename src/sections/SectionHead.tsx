/**
 * The head of a home-page section: a mono label, and the title in Fraunces
 * when the section has one. Without a title the label is the heading.
 */
export function SectionHead({ id, label, title }: { id: string; label: string; title?: string }) {
  if (!title) {
    return (
      <h2 id={`${id}-title`} className="t-label section-head__label" data-reveal>
        {label}
      </h2>
    );
  }
  return (
    <header className="section-head" data-reveal>
      <p className="t-label section-head__label">{label}</p>
      <h2 id={`${id}-title`} className="t-title section-head__title">
        {title}
      </h2>
    </header>
  );
}
