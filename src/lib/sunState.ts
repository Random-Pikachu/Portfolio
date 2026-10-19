/**
 * How far into the night the page is, shared between the palette ramp that
 * computes it and the star field that reads it.
 *
 * A plain mutable object rather than context or state: both sides touch this
 * once per animation frame, and a re-render per frame would be absurd.
 */
export const sun = { night: 0 };
