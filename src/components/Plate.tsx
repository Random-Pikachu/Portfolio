/**
 * Hover plates for the two featured projects with no screenshot, because
 * neither of them has an interface worth photographing — one is a model, the
 * other is a workflow file. Both are drawn by hand so each says something
 * specific about its project rather than being texture.
 *
 * The viewBox is 4:3 to match the tile frame exactly: object-fit does not
 * apply to an inline SVG, so the aspect ratio has to be right at the source.
 */

const ACTUAL =
  'M10.0 133.9 L16.0 124.7 L21.9 132.4 L27.9 133.7 L33.8 115.8 L39.8 103.6 L45.7 102.5 L51.7 86.1 ' +
  'L57.7 57.7 L63.6 46.1 L69.6 45.4 L75.5 33.2 L81.5 28.5 L87.4 44.2 L93.4 44.4 L99.4 33.1 ' +
  'L105.3 43.2 L111.3 77.3 L117.2 101.6 L123.2 107.8 L129.1 121.1 L135.1 138.3 L141.1 135.8 ' +
  'L147.0 126.4 L153.0 133.9 L158.9 124.7 L164.9 132.4 L170.9 133.7 L176.8 115.8 L182.8 103.6 ' +
  'L188.7 102.5 L194.7 86.1 L200.6 57.7 L206.6 46.1 L212.6 45.4 L218.5 33.2 L224.5 28.5 ' +
  'L230.4 44.2 L236.4 44.4 L242.3 33.1 L248.3 43.2 L254.3 77.3 L260.2 101.6 L266.2 107.8 ' +
  'L272.1 121.1 L278.1 138.3 L284.0 135.8 L290.0 126.4';

const PRED =
  'M153.0 132.8 L158.9 125.5 L164.9 133.9 L170.9 133.9 L176.8 112.9 L182.8 97.8 L188.7 95.7 ' +
  'L194.7 80.4 L200.6 53.7 L206.6 42.9 L212.6 40.8 L218.5 25.5 L224.5 18.0 L230.4 32.8 ' +
  'L236.4 34.0 L242.3 24.5 L248.3 35.3 L254.3 67.9 L260.2 89.2 L266.2 92.7 L272.1 104.9 ' +
  'L278.1 123.2 L284.0 122.5 L290.0 113.8';

const MONO = 'Geist Mono, ui-monospace, monospace';

/** Forty-eight hours of building load, with the forecast origin marked. */
function Forecast() {
  return (
    <svg viewBox="0 0 300 225" role="img"
         aria-label="Forty-eight hours of building load with the forecast horizon marked">
      <g transform="translate(0 22.5)">
        {[45, 80, 115].map((y) => (
          <line key={y} x1="10" y1={y} x2="290" y2={y} stroke="var(--hair)" strokeWidth="1" />
        ))}
        <line x1="153" y1="10" x2="153" y2="170" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
        <path d={ACTUAL} fill="none" stroke="var(--fg-2)" strokeWidth="1.5"
              strokeLinejoin="round" strokeLinecap="round" />
        <path d={PRED} fill="none" stroke="var(--accent)" strokeWidth="2.2"
              strokeLinejoin="round" strokeLinecap="round" />
        <text x="159" y="22" fontFamily={MONO} fontSize="9" letterSpacing="1" fill="var(--accent)">
          FORECAST →
        </text>
        <text x="12" y="166" fontFamily={MONO} fontSize="9" letterSpacing="1" fill="var(--fg-3)">
          48 H
        </text>
      </g>
    </svg>
  );
}

const CHAIN = [
  'openrouter · free', 'openrouter · free', 'openrouter · free', 'openrouter · free',
  'openrouter · free', 'groq · free', 'groq · free', 'azure openai · paid',
];

/** The fallback chain, with the only paid link at the bottom. */
function Chain() {
  return (
    <svg viewBox="0 0 300 225" role="img"
         aria-label="Eight model providers tried in order, the paid one last">
      {CHAIN.map((label, i) => {
        const y = 20 + i * 24;
        const last = i === CHAIN.length - 1;
        return (
          <g key={i}>
            <rect x="48" y={y} width="206" height="16"
                  fill={last ? 'var(--accent)' : 'none'}
                  stroke={last ? 'var(--accent)' : 'var(--hair-2)'} strokeWidth="1" />
            <text x="57" y={y + 11.5} fontFamily={MONO} fontSize="8.5" letterSpacing="0.8"
                  fill={last ? 'var(--on-accent)' : 'var(--fg-3)'}>
              {label.toUpperCase()}
            </text>
            <text x="26" y={y + 11.5} fontFamily={MONO} fontSize="8.5"
                  fill={last ? 'var(--accent)' : 'var(--hair-2)'}>
              {`0${i + 1}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Plate({ slug }: { slug: string }) {
  if (slug === 'load-forecasting') return <Forecast />;
  if (slug === 'review-agent') return <Chain />;
  return null;
}
