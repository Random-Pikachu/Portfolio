import { useEffect, useRef } from 'react';
import { mulberry32 } from './stars';

/**
 * An invented constellation for a plate: one star per instrument in the
 * stack, joined in order, laid out by a seeded generator so a plate always
 * draws the same figure. Strokes in once when the plate comes into the
 * frame; while the plate is hovered or holds focus the stars carry their
 * names. Renders nothing different between server and client.
 */
export function Constellation({ seed, names, className = '' }: { seed: string; names: readonly string[]; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add('is-drawn');
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = mulberry32(h || 1);
  const n = Math.max(2, Math.min(7, names.length));
  const W = 120;
  const H = 72;
  // Walk left to right so the figure reads as a line, with a little wander.
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = 10 + (i / (n - 1)) * (W - 20) + (rand() - 0.5) * 14;
    const y = 12 + rand() * (H - 24);
    pts.push([Math.round(x), Math.round(y)]);
  }
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
  const dots = pts.map(([x, y]) => `M${x} ${y}h0`).join('');
  return (
    <svg ref={ref} className={`figure ${className}`} viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" focusable="false">
      <path className="figure__lines" d={line} pathLength={1} />
      <path className="figure__stars" d={dots} />
      {pts.map(([x, y], i) => (
        <text key={i} className="figure__name" x={x + 4} y={y - 4} textAnchor={x > W * 0.7 ? 'end' : 'start'}>
          {names[i]}
        </text>
      ))}
    </svg>
  );
}
