/**
 * The moon, computed rather than typed. Low-precision solar and lunar
 * longitudes (Meeus, truncated series, good to about a tenth of a degree),
 * which is far more than a title block needs. Everything here is pure so the
 * prerender and the client agree once they are given the same date.
 */
const D2R = Math.PI / 180;
const norm = (a: number) => ((a % 360) + 360) % 360;
const sin = (deg: number) => Math.sin(deg * D2R);

export function julianDay(date: Date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Local sidereal time in hours (0 to 24) at longitude `lon` (degrees east):
 * the right ascension of the zenith. Greenwich mean sidereal time from the
 * usual polynomial in Julian centuries, then the longitude in hours.
 */
export function siderealTime(date: Date, lon: number) {
  const T = (julianDay(date) - 2451545.0) / 36525;
  const gmst = norm(280.46061837 + 360.98564736629 * (julianDay(date) - 2451545.0) + 0.000387933 * T * T);
  return (norm(gmst + lon) / 15 + 24) % 24;
}

/** "22h 07m" from hours. */
export function hoursMinutes(h: number) {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m`;
}

/** "+26°13′" from degrees. */
export function degMin(d: number) {
  const sign = d < 0 ? '−' : '+';
  const a = Math.abs(d);
  const dd = Math.floor(a);
  const mm = Math.round((a - dd) * 60);
  return `${sign}${dd}°${String(mm).padStart(2, '0')}′`;
}

/** The epoch as astronomers write it: J2026.7, the year and its decimal. */
export function julianEpoch(date: Date) {
  return `J${(2000 + (julianDay(date) - 2451545.0) / 365.25).toFixed(1)}`;
}

/** Apparent ecliptic longitude of the sun, degrees. */
function sunLongitude(jd: number) {
  const n = jd - 2451545.0;
  const L = norm(280.46 + 0.9856474 * n);
  const g = norm(357.528 + 0.9856003 * n);
  return norm(L + 1.915 * sin(g) + 0.02 * sin(2 * g));
}

/** Ecliptic longitude of the moon, degrees. */
function moonLongitude(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm(218.3164477 + 481267.88123421 * T);
  const D = norm(297.8501921 + 445267.1114034 * T);
  const M = norm(357.5291092 + 35999.0502909 * T);
  const Mp = norm(134.9633964 + 477198.8675055 * T);
  const F = norm(93.272095 + 483202.0175233 * T);
  return norm(
    Lp +
      6.288774 * sin(Mp) +
      1.274027 * sin(2 * D - Mp) +
      0.658314 * sin(2 * D) +
      0.213618 * sin(2 * Mp) -
      0.185116 * sin(M) -
      0.114332 * sin(2 * F) +
      0.058793 * sin(2 * D - 2 * Mp) +
      0.057066 * sin(2 * D - M - Mp) +
      0.053322 * sin(2 * D + Mp) +
      0.045758 * sin(2 * D - M) -
      0.040923 * sin(M - Mp) -
      0.03472 * sin(D) -
      0.030383 * sin(M + Mp)
  );
}

export interface MoonPhase {
  /** Illuminated fraction, 0 (new) to 1 (full). */
  fraction: number;
  /** True between new and full. */
  waxing: boolean;
  /** Elongation from the sun in degrees, 0 to 360. */
  elongation: number;
  name: string;
}

export function moonPhase(date: Date): MoonPhase {
  const jd = julianDay(date);
  const elongation = norm(moonLongitude(jd) - sunLongitude(jd));
  const fraction = (1 - Math.cos(elongation * D2R)) / 2;
  const f = elongation / 360;
  const name =
    f < 0.03 || f > 0.97 ? 'new moon'
    : f < 0.22 ? 'waxing crescent'
    : f < 0.28 ? 'first quarter'
    : f < 0.47 ? 'waxing gibbous'
    : f < 0.53 ? 'full moon'
    : f < 0.72 ? 'waning gibbous'
    : f < 0.78 ? 'last quarter'
    : 'waning crescent';
  return { fraction, waxing: elongation < 180, elongation, name };
}

/**
 * SVG path of the lit part of a disc of radius r centred on the origin. The
 * terminator is an ellipse; the lit limb faces right while waxing and left
 * while waning, as seen from the northern hemisphere.
 */
export function moonPath(phase: Pick<MoonPhase, 'fraction' | 'waxing'>, r: number) {
  const k = phase.fraction;
  const rx = (r * Math.abs(2 * k - 1)).toFixed(3);
  const sweep = k > 0.5 ? 1 : 0;
  const right = `M0,-${r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 ${sweep} 0,-${r} Z`;
  return phase.waxing ? right : right.replace('0 0 1 0', '0 0 0 0').replace(`0 0 ${sweep} 0`, `0 0 ${1 - sweep} 0`);
}

/** HH:MM:SS in the drawing's time zone. */
export function clock(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/** dd.mm.yy, the revision date of a drawing. */
export function revisionDate(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, day: '2-digit', month: '2-digit', year: '2-digit' }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('day')}.${get('month')}.${get('year')}`;
}
