/**
 * Which sky a visitor gets. The chart (the SVG) is always there; the scene
 * (the canvas) is for screens that can carry it: not phones, not reduced
 * motion, not a saved-data connection, not a machine with two cores, and
 * only with WebGL2. `?sky=off|static|low|high` forces a tier for review.
 */
export type Tier = 'off' | 'static' | 'low' | 'high';

export interface Quality {
  dpr: number;
  scale: number;
  /** Frame interval in ms; 0 renders every frame. */
  interval: number;
  octaves: number;
}

export const QUALITY: Record<'low' | 'high', Quality> = {
  high: { dpr: 1.5, scale: 1, interval: 0, octaves: 5 },
  low: { dpr: 1, scale: 0.75, interval: 1000 / 30, octaves: 3 },
};

export function decideTier(force?: string | null): Tier {
  if (force === 'off' || force === 'static' || force === 'low' || force === 'high') return force;
  if (typeof window === 'undefined') return 'static';
  const mq = (q: string) => window.matchMedia(q).matches;
  if (mq('(prefers-reduced-motion: reduce)') || mq('(max-width: 47.99rem)') || mq('(update: slow)')) return 'static';
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return 'static';
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  if (cores <= 2 || mem <= 2) return 'static';
  const probe = document.createElement('canvas').getContext('webgl2');
  if (!probe) return 'static';
  probe.getExtension('WEBGL_lose_context')?.loseContext();
  return cores <= 4 || mem <= 4 || (devicePixelRatio >= 2 && innerWidth < 1280) ? 'low' : 'high';
}

/**
 * Steps the quality down when frames run long, and never back up, so it
 * cannot oscillate. Two consecutive windows of sixty frames over 22 ms each
 * take one step: scale, then octaves, then rendering only when dirty.
 */
export class FpsGuard {
  private sum = 0;
  private n = 0;
  private slow = 0;
  step = 0;
  private q: Quality;
  private onStep: (q: Quality, step: number) => void;
  constructor(q: Quality, onStep: (q: Quality, step: number) => void) {
    this.q = q;
    this.onStep = onStep;
  }
  frame(dt: number) {
    this.sum += dt;
    this.n++;
    if (this.n < 60) return;
    const mean = this.sum / this.n;
    this.sum = 0;
    this.n = 0;
    if (mean > 22) this.slow++;
    else this.slow = 0;
    if (this.slow < 2) return;
    this.slow = 0;
    this.step++;
    if (this.step === 1) this.q = { ...this.q, scale: Math.min(this.q.scale, 0.75) };
    else if (this.step === 2) this.q = { ...this.q, scale: 0.5 };
    else if (this.step === 3) this.q = { ...this.q, octaves: Math.min(this.q.octaves, 3) };
    else if (this.step === 4) this.q = { ...this.q, octaves: 2 };
    else this.q = { ...this.q, interval: -1 };
    this.onStep(this.q, this.step);
  }
}
