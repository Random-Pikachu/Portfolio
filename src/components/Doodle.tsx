/**
 * The marker. Every path here was placed by hand rather than traced from an
 * icon set, and each takes the roughen filter so no two instances sit on
 * exactly the same line.
 */

type Props = { className?: string; color?: string; filter?: string };

const C = 'var(--coral)';

/** A swipe under a word. */
export function Underline({ className = '', color = C, filter = 'rough' }: Props) {
  return (
    <svg className={className} viewBox="0 0 320 22" preserveAspectRatio="none" aria-hidden="true">
      <path d="M5 15 C72 6, 148 20, 228 9 S300 15, 315 11" fill="none"
            stroke={color} strokeWidth="3.2" strokeLinecap="round" filter={`url(#${filter})`} />
    </svg>
  );
}

/** A lasso around something that matters. */
export function Circled({ className = '', color = C, filter = 'rough-b' }: Props) {
  return (
    <svg className={className} viewBox="0 0 240 92" preserveAspectRatio="none" aria-hidden="true">
      {/* Deliberately not a closed ellipse — the overshoot past the start is
          what a real pen does when it comes round. */}
      <path d="M120 7 C44 7, 10 28, 10 47 C10 70, 58 85, 122 85 C190 85, 231 67, 230 45 C229 24, 190 8, 118 9"
            fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" filter={`url(#${filter})`} />
    </svg>
  );
}

/** A curved arrow pointing right-down. */
export function Arrow({ className = '', color = C, filter = 'rough' }: Props) {
  return (
    <svg className={className} viewBox="0 0 150 70" aria-hidden="true">
      <path d="M8 12 C52 10, 96 22, 120 50" fill="none" stroke={color}
            strokeWidth="2.8" strokeLinecap="round" filter={`url(#${filter})`} />
      <path d="M103 44 L122 53 L111 35" fill="none" stroke={color} strokeWidth="2.8"
            strokeLinecap="round" strokeLinejoin="round" filter={`url(#${filter})`} />
    </svg>
  );
}

/** A five-point star, drawn slightly off-true on purpose. */
export function Star({ className = '', color = 'var(--yellow)', filter = 'rough-c' }: Props) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <path d="M22 4 l6 13 l14 2 l-10 10 l3 14 l-13 -7 l-12 7 l2 -14 l-10 -10 l14 -2 z"
            fill={color} stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round"
            filter={`url(#${filter})`} />
    </svg>
  );
}

/** Highlighter behind a word. Sits under the text, never over it. */
export function Highlight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 44" preserveAspectRatio="none" aria-hidden="true">
      <path d="M6 30 C60 20, 140 26, 214 16 L212 32 C140 42, 58 36, 8 40 Z"
            fill="var(--yellow)" opacity="0.72" filter="url(#rough-b)" />
    </svg>
  );
}

/** Washi tape, for pinning a scrap to the board. */
export function Tape({ className = '', rotate = -4 }: { className?: string; rotate?: number }) {
  return (
    <svg className={className} viewBox="0 0 120 34" aria-hidden="true"
         style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M4 7 L116 3 L114 30 L6 28 Z" fill="var(--yellow)" opacity="0.62"
            stroke="none" filter="url(#rough-c)" />
    </svg>
  );
}
