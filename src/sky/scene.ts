import frag from './shaders/sky.frag.glsl?raw';
import vert from './shaders/sky.vert.glsl?raw';
import { CH, Journey, type Marks, type State } from './journey';
import { FpsGuard, QUALITY, type Quality, type Tier } from './quality';
import { readTheme, watchTheme, type ThemeUniforms } from './theme';

/**
 * The scene: one WebGL2 canvas under the page, one program, one triangle.
 * Reads the scroll through the journey, the colours through the theme,
 * writes uniforms, draws. Renders when something changed, and while the
 * dust is still twinkling after a scroll; otherwise the loop sleeps.
 *
 * Loaded after hydration through a dynamic import, so none of this is in
 * the prerender or the page's first script.
 */
export interface SceneController {
  renderNow(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
}

export interface MountOptions {
  tier: Exclude<Tier, 'off' | 'static'>;
  moon: HTMLElement | null;
  onFallback: () => void;
  debug?: boolean;
}

const U = ['uRes', 'uDpr', 'uTime', 'uNight', 'uPaper', 'uInk', 'uInk3', 'uLine', 'uStar', 'uPan', 'uZoom', 'uDust', 'uHaze', 'uFog', 'uRings', 'uBeam', 'uTwinkle', 'uOctaves'] as const;
type Uniform = (typeof U)[number];

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`shader: ${log}`);
  }
  return sh;
}

export function mount(host: HTMLElement, opts: MountOptions): SceneController {
  let quality: Quality = { ...QUALITY[opts.tier] };
  const canvas = document.createElement('canvas');
  canvas.className = 'sky__scene';
  host.insertBefore(canvas, host.querySelector('.sky__grain'));
  const context = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!context) {
    canvas.remove();
    opts.onFallback();
    return { renderNow() {}, pause() {}, resume() {}, dispose() {} };
  }
  const gl: WebGL2RenderingContext = context;

  let program: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  const loc = {} as Record<Uniform, WebGLUniformLocation | null>;
  const build = () => {
    const vs = compile(gl, gl.VERTEX_SHADER, vert);
    const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`program: ${gl.getProgramInfoLog(program)}`);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);
    for (const name of U) loc[name] = gl.getUniformLocation(program, name);
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
  };
  try {
    build();
  } catch (e) {
    console.warn('[sky]', e);
    canvas.remove();
    opts.onFallback();
    return { renderNow() {}, pause() {}, resume() {}, dispose() {} };
  }

  // ── State ──────────────────────────────────────────────────────────────
  let theme: ThemeUniforms = readTheme();
  let dirty = true;
  let paused = false;
  let raf = 0;
  let lastFrame = performance.now();
  let lastY = window.scrollY;
  let twinkle = 0;
  // The beam leans toward the pointer, a little, and settles back.
  let lean = 0;
  let leanTarget = 0;
  const pointer = { x: -1, y: -1 };
  let width = 0;
  let height = 0;
  let disposed = false;
  const t0 = performance.now();
  const moon = opts.moon;
  let moonShown = false;

  const placeMoon = (s: State) => {
    if (!moon) return;
    const r = s[CH.moonR];
    if (r < 0.5) {
      if (moonShown) {
        moon.classList.remove('is-on');
        moonShown = false;
      }
      return;
    }
    const x = s[CH.moonX] - window.scrollX;
    const y = s[CH.moonY] - window.scrollY;
    moon.style.width = `${(2 * r).toFixed(1)}px`;
    moon.style.height = `${(2 * r).toFixed(1)}px`;
    moon.style.transform = `translate3d(${(x - r).toFixed(1)}px, ${(y - r).toFixed(1)}px, 0)`;
    if (!moonShown) {
      moon.classList.add('is-on');
      moonShown = true;
    }
  };

  const journey = new Journey(host, (s) => {
    placeMoon(s);
    dirty = true;
  });

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const k = Math.min(devicePixelRatio, quality.dpr) * quality.scale;
    width = Math.max(1, Math.round(rect.width * k));
    height = Math.max(1, Math.round(rect.height * k));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    dirty = true;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const guard = new FpsGuard(quality, (q, step) => {
    quality = q;
    resize();
    if (opts.debug) console.info(`[sky] quality step ${step}`, q);
  });

  const upload = (s: State, m: Marks | null) => {
    gl.uniform2f(loc.uRes, width, height);
    gl.uniform1f(loc.uDpr, width / (m?.vw ?? (host.clientWidth || 1)));
    gl.uniform1f(loc.uTime, (performance.now() - t0) / 1000);
    gl.uniform1f(loc.uNight, theme.night);
    gl.uniform3fv(loc.uPaper, theme.paper);
    gl.uniform3fv(loc.uInk, theme.ink);
    gl.uniform3fv(loc.uInk3, theme.ink3);
    gl.uniform3fv(loc.uLine, theme.line);
    gl.uniform3fv(loc.uStar, theme.star);
    const vw = m?.vw ?? 1;
    const vh = m?.vh ?? 1;
    gl.uniform2f(loc.uPan, s[CH.camX] * vw, s[CH.camY] * vh);
    gl.uniform1f(loc.uZoom, s[CH.zoom]);
    gl.uniform1f(loc.uDust, s[CH.dust]);
    gl.uniform1f(loc.uHaze, s[CH.haze]);
    gl.uniform1f(loc.uFog, s[CH.fog]);
    gl.uniform4f(loc.uRings, rings[0] - window.scrollX, rings[1] - window.scrollY, rings[2], s[CH.rings]);
    gl.uniform4f(loc.uBeam, beam[0] - window.scrollX, beam[1] - window.scrollY, beam[2] + lean, s[CH.beam]);
    gl.uniform1f(loc.uTwinkle, twinkle);
    gl.uniform1i(loc.uOctaves, quality.octaves);
  };

  // Page-space anchors the shader draws from; set from the marks when measured.
  const rings = [0, 0, 0];
  const beam = [0, 0, 0];
  const anchorsFrom = (m: Marks) => {
    const now = m.anchors['now'];
    const bar = m.anchors['orbit-2'] ?? m.anchors['orbit-1'] ?? m.anchors['orbit-0'];
    if (now) {
      rings[0] = now.x + now.w / 2;
      rings[1] = now.y + now.h / 2;
      rings[2] = bar ? Math.max(120, rings[0] - bar.x) / (1 + 0.72 * 2) : 160;
    }
    const lamp = m.anchors['lamp'];
    const call = m.anchors['call'];
    if (lamp) {
      beam[0] = lamp.x + lamp.w / 2;
      beam[1] = lamp.y + lamp.h / 2;
      const target = call ? { x: call.x + call.w / 2, y: call.y + call.h / 2 } : { x: beam[0] - 400, y: beam[1] + 200 };
      beam[2] = Math.atan2(target.y - beam[1], target.x - beam[0]);
    }
  };
  if (journey.marks) anchorsFrom(journey.marks);
  const origMeasure = journey.measure.bind(journey);
  journey.measure = () => {
    origMeasure();
    if (journey.marks) anchorsFrom(journey.marks);
  };

  const draw = () => {
    if (!program) return;
    upload(journey.state, journey.marks);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    dirty = false;
  };

  let fpsEl: HTMLElement | null = null;
  if (opts.debug) {
    fpsEl = document.createElement('pre');
    fpsEl.className = 'sky__debug';
    document.body.appendChild(fpsEl);
  }

  const loop = (now: number) => {
    raf = 0;
    if (disposed || paused) return;
    const dt = now - lastFrame;
    lastFrame = now;
    const y = window.scrollY;
    const velocity = Math.abs(y - lastY) / Math.max(1, dt);
    lastY = y;
    // Twinkle follows the scroll's speed and dies down in about a second.
    twinkle = Math.min(1, Math.max(twinkle * Math.exp(-dt / 320), velocity * 1.4));
    if (twinkle < 0.01) twinkle = 0;
    journey.tick();
    if (journey.state[CH.beam] > 0.01 && pointer.x >= 0) {
      const dx = pointer.x - (beam[0] - window.scrollX);
      const dy = pointer.y - (beam[1] - window.scrollY);
      let d = Math.atan2(dy, dx) - beam[2];
      d = Math.atan2(Math.sin(d), Math.cos(d));
      leanTarget = Math.max(-0.35, Math.min(0.35, d));
    } else leanTarget = 0;
    const leaning = Math.abs(leanTarget - lean) > 0.002;
    if (leaning) {
      lean += (leanTarget - lean) * (1 - Math.exp(-dt / 240));
      dirty = true;
    }
    const live = (theme.night > 0.5 && twinkle > 0 && quality.interval >= 0) || leaning;
    if (dirty || live) {
      if (quality.interval <= 0 || now - lastDraw >= quality.interval) {
        draw();
        lastDraw = now;
        guard.frame(dt);
      }
    }
    if (fpsEl) fpsEl.textContent = `tier ${opts.tier}  dpr ${(width / (journey.marks?.vw ?? 1)).toFixed(2)}  ${dt.toFixed(1)} ms  step ${guard.step}\nkey ${journey.at.toFixed(2)}  y ${y}  twinkle ${twinkle.toFixed(2)}`;
    raf = requestAnimationFrame(loop);
  };
  let lastDraw = 0;
  const start = () => {
    if (!raf && !paused && !disposed) raf = requestAnimationFrame(loop);
  };
  const onScroll = () => {
    dirty = true;
    start();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  const onPointer = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (journey.state[CH.beam] > 0.01) start();
  };
  if (matchMedia('(hover: hover)').matches) window.addEventListener('pointermove', onPointer, { passive: true });

  // The theme: flip the uniforms and draw at once, inside the same task as
  // the class change, so the view transition's new snapshot has the new sky.
  const unwatch = watchTheme((t) => {
    theme = t;
    draw();
  });

  const onVisibility = () => {
    if (document.hidden) pause();
    else resume();
  };
  document.addEventListener('visibilitychange', onVisibility);

  let losses = 0;
  const onLost = (e: Event) => {
    e.preventDefault();
    losses++;
    pause();
    if (losses > 1) fallback();
    else setTimeout(() => losses > 0 && !program && fallback(), 2000);
  };
  const onRestored = () => {
    try {
      build();
      resize();
      resume();
    } catch {
      fallback();
    }
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  function pause() {
    paused = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  function resume() {
    if (disposed) return;
    paused = false;
    lastFrame = performance.now();
    dirty = true;
    start();
  }
  function fallback() {
    dispose();
    opts.onFallback();
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    pause();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    unwatch();
    ro.disconnect();
    journey.dispose();
    fpsEl?.remove();
    if (program) gl.deleteProgram(program);
    if (vao) gl.deleteVertexArray(vao);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
    moon?.classList.remove('is-on');
  }

  draw();
  start();
  return { renderNow: draw, pause, resume, dispose };
}
