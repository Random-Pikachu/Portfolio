/**
 * Phase 1 lab. Exists to answer one question before anything is built on top
 * of it: does the sunset toggle feel extraordinary? Everything here is real
 * code that ports into the site — the sky and sunset modules are already
 * framework-free, and this file is the throwaway part.
 */
import '../styles/tokens.css';
import './lab.css';
import { createSky } from './sky';
import { Sunset, initialTheme, storeTheme, type Theme, type SunsetChannels } from './sunset';

const root = document.documentElement;
const canvas = document.querySelector<HTMLCanvasElement>('#sky')!;
const toggle = document.querySelector<HTMLButtonElement>('#toggle')!;
const stage = document.querySelector<HTMLElement>('#stage')!;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
  The rail shows the visitor's own clock, not a decorative one. This is the
  cheap half of the memory layer: arriving at 19:20 in Copenhagen opens the
  site at dusk, and the rail says so, which explains the choice without a
  word of copy.
*/
const phaseEl = document.querySelector<HTMLElement>('#phase')!;
const clockEl = document.querySelector<HTMLTimeElement>('#clock')!;
const hintEl = document.querySelector<HTMLElement>('#hintTarget')!;

function tickClock() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}`;
  clockEl.dateTime = `${hh}:${mm}`;
}
tickClock();
setInterval(tickClock, 30_000);

const theme: Theme = initialTheme();
root.dataset.theme = theme;

const sky = createSky(canvas, { dusk: theme === 'dusk' ? 1 : 0, fps: 30 });
if (!sky) {
  // The design must be complete with the canvas gone. The CSS gradient under
  // it already is; all that is left is to stop pretending there is a canvas.
  canvas.remove();
  document.body.classList.add('no-webgl');
}

/** Sun travels down the frame as dusk arrives, and the lamp sits lower. */
// At dusk the lamp drops into the corner, clear of the index row.
const SUN_Y = { day: 0.74, night: -0.06 };
const SUN_X = 0.78;
const SUN_X_NIGHT = 0.88;

function apply(ch: SunsetChannels, next: Theme) {
  sky?.setDusk(ch.sky);
  sky?.setStars(ch.stars);
  sky?.setGrain(0.035 + ch.grain * 0.025);
  sky?.setSun(SUN_X + (SUN_X_NIGHT - SUN_X) * ch.sky,
              SUN_Y.day + (SUN_Y.night - SUN_Y.day) * ch.sky);

  // Channels the CSS reads. Text colour and the accent are interpolated in
  // CSS rather than here so the cascade still owns the final values.
  root.style.setProperty('--p-text', String(ch.text));
  root.style.setProperty('--p-accent', String(ch.accent));
  root.style.setProperty('--p-sky', String(ch.sky));

  // Flip the theme attribute at the midpoint of the text crossfade rather than
  // at either end, so the swap is hidden inside the busiest part of the move.
  const flipped = ch.text >= 0.5 ? 'dusk' : 'lastlight';
  if (root.dataset.theme !== flipped) {
    root.dataset.theme = flipped;
    phaseEl.textContent = flipped === 'dusk' ? 'dusk' : 'last light';
    // The hint names where you are going, not where you are.
    hintEl.textContent = flipped === 'dusk' ? 'daylight' : 'dusk';
  }
  void next;
}

const sunset = new Sunset(theme, {
  reducedMotion: reduced,
  onFrame: apply,
  onDone: (t) => {
    root.dataset.theme = t;
    storeTheme(t);
    label(t);
  },
});

function label(t: Theme) {
  phaseEl.textContent = t === 'dusk' ? 'dusk' : 'last light';
  hintEl.textContent = t === 'dusk' ? 'daylight' : 'dusk';
  toggle.setAttribute('aria-pressed', String(t === 'dusk'));
  toggle.setAttribute('aria-label', t === 'dusk' ? 'Switch to daylight' : 'Switch to dusk');
}

apply(Sunset.settled(theme), theme);
label(theme);

toggle.addEventListener('click', () => {
  // Anticipation: the dot pulls back before it travels. Driven by a class so
  // the easing stays in CSS with every other motion token.
  toggle.classList.remove('anticipate');
  void toggle.offsetWidth;   // restart the animation
  toggle.classList.add('anticipate');
  sunset.toggle();
});

// `t` toggles the theme. Engineers find this within seconds and it costs
// nothing. Ignored while typing into a field.
addEventListener('keydown', (e) => {
  const el = document.activeElement;
  const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
  if (e.key === 't' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    toggle.click();
  }
});

// Stagger the text crossfade by vertical position: the top of the viewport
// changes first and it cascades down, like light leaving a room.
const lines = stage.querySelectorAll<HTMLElement>('[data-stagger]');
lines.forEach((el) => {
  const y = el.getBoundingClientRect().top / Math.max(1, window.innerHeight);
  el.style.setProperty('--stagger', `${Math.round(Math.min(1, Math.max(0, y)) * 300)}ms`);
});
