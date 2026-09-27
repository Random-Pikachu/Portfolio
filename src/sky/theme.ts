/**
 * The scene follows the tokens. Colours are read from the computed style of
 * the root, so the shader is painted in the same ink and paper as the page;
 * the class on <html> says which mode. A MutationObserver reports the flip,
 * synchronously enough that the view transition's new snapshot already
 * holds the new sky.
 */
export interface ThemeUniforms {
  /** 0 by day, 1 by night. */
  night: number;
  paper: [number, number, number];
  ink: [number, number, number];
  ink3: [number, number, number];
  line: [number, number, number];
  star: [number, number, number];
  accent: [number, number, number];
}

function hex(v: string): [number, number, number] {
  const s = v.trim().replace('#', '');
  const n = parseInt(s.length === 3 ? s.replace(/(.)/g, '$1$1') : s, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function readTheme(): ThemeUniforms {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => hex(cs.getPropertyValue(name) || '#000000');
  return {
    night: document.documentElement.classList.contains('dark') ? 1 : 0,
    paper: v('--paper'),
    ink: v('--ink'),
    ink3: v('--ink-3'),
    line: v('--line-2'),
    star: v('--star'),
    accent: v('--accent'),
  };
}

export function watchTheme(cb: (t: ThemeUniforms) => void) {
  const mo = new MutationObserver(() => cb(readTheme()));
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
}
