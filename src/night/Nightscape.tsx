import { H, HOUSE, W, ridge, stars, type RidgeSpec } from './terrain';

/**
 * Four ridges, far to near. The far range is bare, peaked and hazy; the
 * nearer ones carry conifers, taller as they come closer; the nearest is the
 * page's own ground, so the land runs straight on into the page. Computed
 * once per module, not per render.
 */
const R1: RidgeSpec = { seed: 11, base: 600, amp: 130, rough: 0.55, peaks: [[1120, 820, 250], [430, 640, 150], [1560, 300, 70]] };
const R2: RidgeSpec = { seed: 29, base: 690, amp: 110, rough: 0.52, peaks: [[760, 620, 80], [120, 360, 40]] };
const R3: RidgeSpec = {
  seed: 47,
  base: 770,
  amp: 80,
  rough: 0.5,
  shelf: { x: HOUSE.x, w: 130, y: HOUSE.y, feather: 170 },
  trees: { min: 10, max: 30, spacing: 12, clear: [HOUSE.x - 78, HOUSE.x + 66] },
};
const R4: RidgeSpec = { seed: 83, base: 935, amp: 60, rough: 0.5, peaks: [[40, 420, 90], [1600, 360, 70]], trees: { min: 30, max: 92, spacing: 22 } };
const [P1, P2, P3, P4] = [R1, R2, R3, R4].map(ridge);

/**
 * Stars stay out of the left half of the sky, where the hero's type sits on a
 * wide screen. On a phone or an upright tablet the crop is the right-hand part
 * and the type sits in its upper two thirds, so stars there are wide-screen
 * only. The top of the sky, under the bar, is faded out in CSS, so no star
 * sits behind the nav either.
 */
const STARS = stars(7, 64, { x0: 40, y0: 150, x1: 820, y1: 640 }, { x0: 800, y0: 100, x1: 1600, y1: 640 });

/** The house: walls and a gable roof with a chimney, as one silhouette. */
const { x: hx, y: hy } = HOUSE;
const HOUSE_PATH = [
  `M${hx - 27} ${hy + 3}`,
  `L${hx - 27} ${hy - 32}L${hx - 32} ${hy - 32}L${hx} ${hy - 58}`,
  `L${hx + 12} ${hy - 48}L${hx + 12} ${hy - 56}L${hx + 19} ${hy - 56}L${hx + 19} ${hy - 43}`,
  `L${hx + 32} ${hy - 32}L${hx + 27} ${hy - 32}L${hx + 27} ${hy + 3}Z`,
].join('');
/** The one window: left of centre, four panes, the only warm thing in the land. */
const WIN = { x: hx - 17, y: hy - 25, w: 10, h: 12 };
const WIN_C = { x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2 };
const MULLIONS = `M${WIN_C.x} ${WIN.y}V${WIN.y + WIN.h}M${WIN.x} ${WIN_C.y}H${WIN.x + WIN.w}`;

const VIEW = `0 0 ${W} ${H}`;

/** One depth of the scene: its own SVG, so the scroll drift can move it on the compositor. */
function Layer({ depth, children }: { depth: number; children: React.ReactNode }) {
  return (
    <svg className="ns-layer" data-depth={depth} viewBox={VIEW} preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Valley fog lying at the foot of a ridge: a soft band, brightest low in the middle. */
function Mist({ id, y, h, alpha }: { id: string; y: number; h: number; alpha: number }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="ns-stop-mist" stopOpacity="0" />
          <stop offset="0.6" className="ns-stop-mist" stopOpacity={alpha} />
          <stop offset="1" className="ns-stop-mist" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y={y} width={W} height={h} fill={`url(#${id})`} />
    </>
  );
}

/**
 * The Night Shift's one image: layered green mountains, a lone house, one lit
 * window, a sparse sky. Pure SVG, prerendered with the page, so it is there at
 * first paint and without JavaScript; grain and vignette are CSS on the frame.
 *
 * Each depth is a separate SVG with `data-depth` (0 the sky, 4 the nearest
 * ridge), stacked in the frame and anchored bottom right, so the house stays
 * in view on a phone's narrow crop. `id` keeps gradient ids unique on a page.
 */
export function Nightscape({ id, className = '' }: { id: string; className?: string }) {
  const g = (name: string) => `${id}-${name}`;
  return (
    <div className={`nightscape ${className}`} data-nightscape="full">
      <Layer depth={0}>
        <defs>
          <linearGradient id={g('sky')} x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0.08" className="ns-stop-sky-top" />
            <stop offset="0.66" className="ns-stop-sky-horizon" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={`url(#${g('sky')})`} />
        <g className="ns-stars">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.a} className={s.wide ? 'ns-star ns-star--wide' : 'ns-star'} />
          ))}
        </g>
      </Layer>

      <Layer depth={1}>
        <path d={P1} className="ns-ridge ns-ridge--1" />
      </Layer>

      <Layer depth={2}>
        <Mist id={g('mist-2')} y={540} h={190} alpha={0.1} />
        <path d={P2} className="ns-ridge ns-ridge--2" />
      </Layer>

      <Layer depth={3}>
        <defs>
          {/* Each fills its own shape: the bloom and the halation circles, the spill a flat ellipse. */}
          <radialGradient id={g('bloom')}>
            <stop offset="0" className="ns-stop-ember" stopOpacity="0.2" />
            <stop offset="1" className="ns-stop-ember" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('halo')}>
            <stop offset="0" className="ns-stop-window" stopOpacity="0.55" />
            <stop offset="1" className="ns-stop-window" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('spill')}>
            <stop offset="0" className="ns-stop-ember" stopOpacity="0.2" />
            <stop offset="1" className="ns-stop-ember" stopOpacity="0" />
          </radialGradient>
        </defs>
        <Mist id={g('mist-3')} y={650} h={150} alpha={0.08} />
        <circle cx={WIN_C.x} cy={WIN_C.y} r="110" fill={`url(#${g('bloom')})`} />
        <path d={P3} className="ns-ridge ns-ridge--3" />
        <path d={HOUSE_PATH} className="ns-house" />
        <ellipse cx={WIN_C.x + 4} cy={hy + 5} rx="70" ry="8" fill={`url(#${g('spill')})`} />
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} className="ns-window" />
        <path d={MULLIONS} className="ns-mullion" />
        <circle cx={WIN_C.x} cy={WIN_C.y} r="17" fill={`url(#${g('halo')})`} />
      </Layer>

      <Layer depth={4}>
        <path d={P4} className="ns-ridge ns-ridge--4" />
      </Layer>
    </div>
  );
}
