import { moonPath, type MoonPhase } from '../sheet/astro';

/**
 * The moon that travels: a fixed element above the page, sized and placed
 * by the journey, drawn at the real phase like the glyph it takes over from
 * on the plate. An engraving rather than a photograph: the disc in the
 * moon's own cream, the maria as hatched shapes inside the lit part, the
 * dark part hatched by day and left as the void by night, a hairline limb.
 * Hidden until the journey takes it; the prerender carries only the disc.
 */
export function Moon({ phase }: { phase: MoonPhase | null }) {
  const r = 10;
  return (
    <div className="sky-moon" aria-hidden="true">
      <svg className="sky-moon__svg" viewBox="-11 -11 22 22" focusable="false">
        <defs>
          {/* Hatch in viewBox units: three pixels apart on a moon 480 wide, a plain tint on a small one. */}
          <pattern id="moon-hatch" patternUnits="userSpaceOnUse" width="0.14" height="0.14" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="0.14" stroke="currentColor" strokeWidth="0.05" />
          </pattern>
          <pattern id="moon-hatch-2" patternUnits="userSpaceOnUse" width="0.17" height="0.17" patternTransform="rotate(-38)">
            <line x1="0" y1="0" x2="0" y2="0.17" stroke="currentColor" strokeWidth="0.045" />
          </pattern>
          <radialGradient id="moon-limb" cx="0.42" cy="0.4" r="0.62">
            <stop offset="0.7" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.16" />
          </radialGradient>
          {phase ? (
            <clipPath id="moon-lit">
              <path d={moonPath(phase, r)} />
            </clipPath>
          ) : null}
        </defs>
        {/* the dark part: the void by night, hatched paper by day */}
        <circle className="sky-moon__dark" r={r} />
        <circle className="sky-moon__dark-hatch" r={r} fill="url(#moon-hatch)" />
        {/* the lit part */}
        {phase ? (
          <g clipPath="url(#moon-lit)">
            <circle className="sky-moon__lit" r={r} />
            <g className="sky-moon__maria">
              <path fill="url(#moon-hatch)" d="M-4.6 -5.2 C-2.4 -6.6 0.6 -6 1.2 -4.2 C1.8 -2.6 -0.2 -1.4 -2.2 -1.6 C-4.4 -1.8 -6.2 -3.6 -4.6 -5.2 Z" />
              <path fill="url(#moon-hatch-2)" d="M2 -3.4 C4.2 -4.2 6.4 -2.6 6 -0.8 C5.6 0.8 3.4 1.2 2.2 0.2 C1 -0.8 0.4 -2.6 2 -3.4 Z" />
              <path fill="url(#moon-hatch)" d="M1.4 1 C3.6 0.4 6 1.8 5.4 3.6 C4.8 5.2 2.2 5.4 1 4.2 C-0.2 3 -0.6 1.6 1.4 1 Z" />
              <path fill="url(#moon-hatch-2)" d="M-3.2 0.6 C-1.6 -0.2 0 1.2 -0.6 2.6 C-1.2 3.8 -3.4 3.8 -4.2 2.6 C-5 1.6 -4.6 1.2 -3.2 0.6 Z" />
              <path fill="url(#moon-hatch)" d="M-5.4 3.6 C-4.2 3 -2.6 4.2 -3.2 5.6 C-3.8 6.8 -6 6.6 -6.4 5.4 C-6.8 4.4 -6.2 4 -5.4 3.6 Z" />
            </g>
            <circle r={r} fill="url(#moon-limb)" />
          </g>
        ) : null}
        <circle className="sky-moon__rim" r={r} fill="none" />
      </svg>
    </div>
  );
}
