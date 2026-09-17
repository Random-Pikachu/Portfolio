/**
 * A drafting dimension: a hairline with 45-degree ticks at both ends and a
 * label in the data face. Horizontal by default; vertical dimensions read
 * upward, as on a drawing. Whether the label is true (`5 col`) or impossible
 * (`384 400 km`) is the copy's business; the line is drawn the same way.
 */
export function DimensionLine({
  label,
  vertical = false,
  className = '',
  draw = false,
}: {
  label: string;
  vertical?: boolean;
  className?: string;
  /** Draws itself in once when it enters (CSS); the prerendered state is fully drawn. */
  draw?: boolean;
}) {
  return (
    <span className={`dim ${vertical ? 'dim--v' : ''} ${draw ? 'dim--draw' : ''} ${className}`} role="img" aria-label={`Dimension: ${label}`}>
      <span className="dim__line" aria-hidden="true" />
      <span className="dim__tick dim__tick--a" aria-hidden="true" />
      <span className="dim__tick dim__tick--b" aria-hidden="true" />
      <span className="dim__label t-label" aria-hidden="true">
        {label}
      </span>
    </span>
  );
}
