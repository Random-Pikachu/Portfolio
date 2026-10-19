/**
 * How far into the night the page is, shared between the palette ramp that
 * computes it, the star field that reads it, and the GSAP setup that has to
 * tell the ramp to re-measure after a ScrollTrigger refresh.
 *
 * A plain mutable object rather than context or state: these are touched once
 * per animation frame, and a re-render per frame would be absurd.
 */
export const sun: { night: number; remeasure: () => void } = {
  night: 0,
  remeasure: () => {},
};
