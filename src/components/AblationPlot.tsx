/**
 * Figure 1 — the ablation, drawn from the real numbers rather than shown as a
 * screenshot of someone else's plot. Eighteen lookback/horizon settings, the
 * hybrid against a plain Transformer, same data and training budget for both.
 *
 * Drawn as SVG because it is a dozen marks: a plotting library would be two
 * hundred kilobytes to place eighteen dots.
 */

/** R² per horizon (h), hybrid vs. standalone Transformer. From the thesis. */
const H = [2, 4, 6, 8, 10, 12, 18, 24, 48];
const HYBRID = [0.971, 0.963, 0.952, 0.941, 0.933, 0.921, 0.906, 0.897, 0.882];
const PLAIN  = [0.964, 0.951, 0.934, 0.918, 0.902, 0.884, 0.861, 0.848, 0.831];

const W = 560, HT = 190, PAD_L = 34, PAD_B = 24, PAD_T = 10, PAD_R = 6;
const Y0 = 0.80, Y1 = 1.0;

const x = (i: number) => PAD_L + (i / (H.length - 1)) * (W - PAD_L - PAD_R);
const y = (v: number) => PAD_T + (1 - (v - Y0) / (Y1 - Y0)) * (HT - PAD_T - PAD_B);
const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');

export default function AblationPlot() {
  return (
    <svg viewBox={`0 0 ${W} ${HT}`} className="plot" role="img"
         aria-label="Test R² by forecast horizon: the hybrid CNN-Transformer stays above 0.88 across every horizon, the standalone Transformer falls to 0.83.">
      {[0.85, 0.90, 0.95, 1.0].map((g) => (
        <g key={g}>
          <line x1={PAD_L} x2={W - PAD_R} y1={y(g)} y2={y(g)} className="plot-grid" />
          <text x={PAD_L - 7} y={y(g) + 3} className="plot-tick" textAnchor="end">{g.toFixed(2)}</text>
        </g>
      ))}
      <path d={path(PLAIN)} className="plot-line plot-b" />
      <path d={path(HYBRID)} className="plot-line plot-a" />
      {HYBRID.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" className="plot-dot-a" />)}
      {PLAIN.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2" className="plot-dot-b" />)}
      {H.map((h, i) => (
        <text key={h} x={x(i)} y={HT - 8} className="plot-tick" textAnchor="middle">{h}</text>
      ))}
      <text x={W - PAD_R} y={y(HYBRID[0]) - 8} className="plot-key plot-key-a" textAnchor="end">hybrid</text>
      <text x={W - PAD_R} y={y(PLAIN[PLAIN.length - 1]) + 14} className="plot-key plot-key-b" textAnchor="end">transformer</text>
    </svg>
  );
}
