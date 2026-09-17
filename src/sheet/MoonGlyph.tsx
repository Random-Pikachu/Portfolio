import { moonPath, type MoonPhase } from './astro';

/**
 * A moon drawn at its real phase: a hairline disc with the lit part filled in
 * ink. Before the client computes the phase it is an empty disc, which is
 * what the prerendered HTML carries.
 */
export function MoonGlyph({ phase, size = 12, className = '' }: { phase: MoonPhase | null; size?: number; className?: string }) {
  const r = 10;
  return (
    <svg
      className={`moon ${className}`}
      width={size}
      height={size}
      viewBox="-11 -11 22 22"
      role="img"
      aria-label={phase ? `${phase.name}, ${Math.round(phase.fraction * 100)} percent lit` : 'moon'}
    >
      <circle r={r} fill="none" stroke="currentColor" strokeWidth="1.2" />
      {phase ? <path d={moonPath(phase, r)} fill="currentColor" /> : null}
    </svg>
  );
}
