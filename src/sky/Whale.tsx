/**
 * Cetus, drawn: a humpback in profile, swimming left, as an engraver would
 * draw one — an outline, the throat grooves hatched, the eye a dot. Fills
 * with the card's paper and strokes with the ink, so by day it is ink on
 * paper and by night paper on the void. Scaled by its box; 320 × 120 units.
 */
export function Whale({ className = '' }: { className?: string }) {
  return (
    <svg className={`whale ${className}`} viewBox="0 0 320 120" aria-hidden="true" focusable="false">
      {/* flukes, behind the body */}
      <path
        className="whale__ink"
        d="M278 58 C288 48 296 36 302 24 C310 18 318 22 314 32 L296 60 L316 84 C320 94 310 100 302 92 C294 82 286 70 278 62 Z"
      />
      {/* body */}
      <path
        className="whale__ink"
        d="M10 62 C28 40 70 26 122 28 C172 30 218 38 252 54 C262 58 272 62 282 58 C284 64 282 70 276 72 C248 86 198 96 148 94 C98 92 58 84 30 74 C18 70 10 66 10 62 Z"
      />
      {/* dorsal hump and fin */}
      <path className="whale__ink" d="M198 36 C204 26 214 26 220 36 Z" />
      {/* pectoral fin */}
      <path className="whale__ink" d="M108 86 C118 110 150 118 168 110 C152 104 130 96 116 84 Z" />
      {/* mouth */}
      <path className="whale__line" d="M14 62 C40 64 70 67 96 70" />
      {/* throat grooves */}
      <path
        className="whale__line whale__hatch"
        d="M34 68 L58 80 M42 66 L68 79 M50 64 L78 78 M58 62 L88 77 M66 60 L98 76 M74 58 L108 75 M82 57 L118 74"
      />
      {/* back hatching, the shadow of the hump */}
      <path className="whale__line whale__hatch" d="M150 40 L146 52 M162 40 L158 54 M174 41 L170 56 M186 43 L182 58 M232 50 L228 62 M244 54 L240 66" />
      {/* eye */}
      <circle className="whale__eye" cx="40" cy="54" r="2.2" />
    </svg>
  );
}
