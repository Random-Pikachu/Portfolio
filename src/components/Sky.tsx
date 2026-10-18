import type { RefObject } from 'react';

/**
 * The printed sheet. A WebGL canvas with a CSS fallback beneath it and the
 * paper grain above, so the texture covers both paths.
 *
 * Everything here is decorative and hidden from assistive tech. The canvas
 * mounts only after hydration, so it can never be the LCP element.
 */
export default function Sky({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement | null> }) {
  return (
    <>
      <canvas id="sky" ref={canvasRef} aria-hidden="true" />
      <svg
        id="grain"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <filter id="grainFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainFilter)" />
      </svg>
    </>
  );
}
