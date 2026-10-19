/**
 * The filters every hand-drawn mark on the site runs through.
 *
 * A clean SVG path reads as clip art. Displacing it with fractal noise gives
 * the line a wobble and a varying weight, which is what the eye recognises as
 * drawn rather than generated. Three seeds so repeated marks are not identical
 * — nothing betrays a fake hand faster than two circles matching exactly.
 *
 * Mounted once, near the top of the tree, and referenced by id everywhere.
 */
export default function Rough() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        {[
          ['rough', 0.018, 3.2, 7],
          ['rough-b', 0.024, 2.4, 19],
          ['rough-c', 0.013, 4.0, 41],
        ].map(([id, freq, scale, seed]) => (
          <filter key={id as string} id={id as string}>
            <feTurbulence
              type="fractalNoise" baseFrequency={freq as number}
              numOctaves="3" seed={seed as number} result="n"
            />
            <feDisplacementMap
              in="SourceGraphic" in2="n" scale={scale as number}
              xChannelSelector="R" yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
