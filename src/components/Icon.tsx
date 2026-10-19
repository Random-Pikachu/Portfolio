/**
 * Arrows and the tagline star, as SVG.
 *
 * Google's Latin subsets carry neither → nor ✦ in Fraunces, Archivo or DM
 * Mono, so a text arrow would silently fall back to a system font and render
 * at a different weight on every platform. Drawn, they match the type and can
 * move on hover.
 */
export function Arrow({ size = '0.72em' }: { size?: string }) {
  return (
    <svg className="arr" width={size} height={size} viewBox="0 0 16 16" fill="none"
         stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
    </svg>
  );
}

export function Star({ size = '0.7em' }: { size?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0c.5 4.2 3.3 7 7.5 7.5C11.3 8 8.5 10.8 8 15c-.5-4.2-3.3-7-7.5-7.5C4.7 7 7.5 4.2 8 0Z" />
    </svg>
  );
}
