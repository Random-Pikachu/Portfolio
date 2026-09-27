/**
 * The brand mark: the house from the hero drawn as a line, with its one
 * window lit. Left of centre, as it is on the ridge. Decorative; the link
 * around it carries the name.
 */
export function WindowMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} className={`mark ${className}`} aria-hidden="true" focusable="false">
      <path d="M3.5 13.5 14 4.5l10.5 9" className="mark__line" />
      <path d="M6.5 11.5V24h15V11.5" className="mark__line" />
      <rect x="9.5" y="14" width="4.5" height="5.5" className="mark__window" />
    </svg>
  );
}
