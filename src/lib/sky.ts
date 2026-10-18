/**
 * The sky. One fragment shader on a fixed full-viewport canvas, driven by a
 * single `dusk` value in 0..1 that the sunset sequence animates.
 *
 * Deliberately framework-free so the same module serves the React site and the
 * standalone lab page. Nothing here imports React.
 *
 * Everything atmospheric on the site comes from this file: there are no images
 * in the design. Generated illustration is the single clearest tell of an
 * AI-built site, and procedural light is cheaper anyway — this is ~4KB and one
 * draw call against a few hundred KB of JPEG that still would not move.
 */

const VERT = `#version 300 es
// A single oversized triangle rather than a quad: no index buffer, no shared
// vertices along a diagonal seam, one fewer primitive to raster.
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uDusk;    // 0 = last light, 1 = night
uniform float uGrain;
uniform vec2  uSun;
uniform float uStars;
uniform float uInk;     // overall plate strength, 0..1

out vec4 outColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash21(i), b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1)), d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    sum += amp * noise(p);
    p = p * 2.03 + vec2(13.7, 7.1);
    amp *= 0.5;
  }
  return sum;
}

mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

/*
  One halftone separation.

  Each ink gets its own screen angle so the two dot grids never line up — that
  is what stops a two-colour print turning into a moiré mess, and it is why
  real separations sit 30 degrees apart. The reg offset is registration slop: a
  press never lands two plates perfectly, and that half-pixel of slop is most
  of why a riso looks handmade rather than rendered.
*/
float screen(vec2 frag, float density, float angleDeg, float cellPx, vec2 reg) {
  density = clamp(density, 0.0, 1.0);
  if (density <= 0.002) return 0.0;
  vec2 p = rot(radians(angleDeg)) * ((frag + reg) / cellPx);
  float d = length(fract(p) - 0.5);
  // sqrt so coverage grows with dot AREA rather than radius, which is how
  // density actually reads on paper. 0.80 fully floods the cell at density 1.
  float r = sqrt(density) * 0.80;
  return smoothstep(r + 0.055, r - 0.055, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 ar = vec2(uRes.x / uRes.y, 1.0);
  int oct = uRes.x < 768.0 ? 3 : 4;

  // Domain-warped cloud field. It modulates ink DENSITY rather than colour,
  // so the structure shows up as dots clustering and thinning.
  vec2 q = vec2(fbm(uv * 2.2 + uTime * 0.005, oct),
                fbm(uv * 2.2 + vec2(5.2, 1.3) - uTime * 0.0035, oct));
  float clouds = fbm(uv * 2.8 + q * 1.5, oct);

  /*
    Glow radius measured in units of the SHORT viewport edge, not in
    aspect-corrected uv. With aspect correction the x term is divided by W/H, so on a
    portrait phone (about 0.46) the falloff stretched to the full width and
    the sun swallowed the top half of the screen. This keeps its size a fixed
    fraction of the short edge at every aspect ratio.
  */
  float r = length((uv - uSun) * uRes) / min(uRes.x, uRes.y);
  float sunD = exp(-r * mix(3.1, 8.2, uDusk));

  /*
    Ink is the minority. In daylight the plates print only at the top and the
    bottom edge and the middle of the sheet stays bare paper, which is both the
    classic image-plate-and-text-well arrangement and the only way type on top
    of this stays readable. An earlier pass flooded both separations across the
    whole frame and buried the content.
  */
  /*
    The plate edge. Cloud displacement used to be strong enough to tilt the
    boundary into a diagonal across the frame, which read as an arbitrary
    slash rather than a horizon. Softened, and the smoothstep widened, so the
    edge stays broadly horizontal and the cloud field only ruffles it.
  */
  float top    = smoothstep(0.40, 1.14, uv.y + (clouds - 0.5) * 0.16);
  float bottom = 1.0 - smoothstep(0.0, 0.16, uv.y - (clouds - 0.5) * 0.06);

  // The text well. Both plates back off through the middle of the sheet so the
  // type sits on near-bare paper. Edges keep their ink; the content does not
  // have to fight a dot field for contrast.
  float well = smoothstep(0.10, 0.28, uv.y) * (1.0 - smoothstep(0.60, 0.84, uv.y));

  // ── Separation 1: blue. Sky at the top; floods the sheet at dusk. ──
  float sky = smoothstep(-0.05, 1.05, uv.y * 0.92 + (clouds - 0.5) * 0.55);
  /*
    Dusk runs the blue plate near solid. Mid coverage — around 0.5 — is peak
    dottiness, and an earlier pass sat there across the whole frame and read as
    mud. Real ink at 80%+ merges into a flood, which is what makes the dot
    texture meaningful where it does survive: the transition band and the
    halo around the lamp, and nowhere else.
  */
  float dBlue = mix(top * 0.30, 0.88 + sky * 0.11, uDusk);
  dBlue -= sunD * mix(0.30, 0.62, uDusk);          // the lamp burns through the plate

  // ── Separation 2: orange. A warm edge, then only the lamp. ──
  /*
    At dusk the lamp used to float in open sky in the lower right, which read
    as a smudge rather than a light: a glow needs either a source or an edge to
    come from. Its centre now sits below the trim, so only the upper falloff
    enters the frame and it reads as light from off the sheet.
  */
  /*
    The vermilion stripe along the bottom edge was a second band competing with
    the sky for attention and left the sheet bottom-heavy. It is now barely a
    tint; the warmth in daylight comes from the sun bleeding into the top plate
    instead, which is where a late sun actually is.
  */
  float dOrange = mix(bottom * 0.05 + sunD * 0.34, sunD * 0.62, uDusk);

  // The well exists to keep dark type legible on pale paper. At dusk the type
  // is cream and the sheet is overprinted, so a pale band through the middle
  // is exactly backwards — the well has to close as night falls.
  float keep = 1.0 - well * mix(0.94, 0.0, uDusk);
  dBlue *= keep;
  dOrange *= keep;

  /*
    Paper margins, top and bottom, in daylight only.

    The rail sits over the plate, and a halftone at partial coverage is a
    mid-tone: too dark for ink type, too light for reversed-out type. Nothing
    was going to make that strip legible. A press solves it by not printing
    there — so the plate gets a visible edge and the chrome sits on bare stock.
    At dusk the flood runs to the trim and the chrome reverses out instead.
  */
  float sheet = mix((1.0 - smoothstep(0.885, 0.945, uv.y)) * smoothstep(0.055, 0.115, uv.y),
                    1.0, uDusk);
  dBlue *= sheet;
  dOrange *= sheet;

  /*
    Plate strength. The full sky belongs to the home hero, which is sized to
    the viewport and has a text well carved for it. An inner page starts its
    heading at the top of the sheet, right where the plate is densest, and the
    heading loses. Inner routes print a whisper instead.
  */
  /*
    Only daylight thins out. Dusk depends on the blue plate running near solid
    for cream type to have anything to sit on, and scaling it to 0.3 lands it
    back at the mid coverage that reads as mud and takes the text with it. The
    lamp dims on inner pages either way.
  */
  dBlue *= mix(uInk, 1.0, uDusk);
  dOrange *= uInk;

  // Stars are unprinted paper — holes in the blue plate, not added light.
  if (uStars > 0.001) {
    vec2 g = uv * ar * 46.0;
    vec2 cell = floor(g);
    float h = hash21(cell);
    if (h > 0.905) {
      vec2 off = vec2(hash21(cell + 3.1), hash21(cell + 7.7));
      float sd = length(fract(g) - off);
      float tw = 0.6 + 0.4 * sin(uTime * (0.6 + h * 2.2) + h * 31.4);
      dBlue -= smoothstep(0.1, 0.0, sd) * tw * uStars * 0.85 * smoothstep(0.1, 0.5, uv.y);
    }
  }

  // ── Print ──
  const vec3 PAPER  = vec3(0.949, 0.922, 0.863);   // #F2EBDC warm stock
  const vec3 INK_B  = vec3(0.157, 0.251, 0.459);   // #284075 dusty cobalt
  const vec3 INK_O  = vec3(0.788, 0.286, 0.090);   // #C94917 vermilion

  // A riso double-hit: the same plate run twice for density. One pass of this
  // blue over cream tops out at a medium navy, which is a dim afternoon, not a
  // night — no amount of coverage alone gets there, and cream type on it was
  // failing AA. The second hit is what makes dusk actually dark.
  vec3 inkB = mix(INK_B, vec3(0.067, 0.106, 0.224), uDusk);

  // Half a pixel of misregistration, in opposite directions. Barely nameable,
  // but its absence is exactly what makes a print look digital.
  /*
    Cell size. This was 4.5 device pixels at desktop width — about 3 CSS px,
    fine enough that the grid shimmers and is genuinely tiring to read against.
    Fewer, larger dots carry the same density and sit still.
  */
  float cell = max(6.5, uRes.x / 190.0);
  float cB = screen(gl_FragCoord.xy, dBlue,   15.0, cell, vec2(-0.6,  0.35));
  float cO = screen(gl_FragCoord.xy, dOrange, 45.0, cell, vec2( 0.55, -0.4));

  // Multiply, so overlapping inks darken the way wet ink actually does.
  vec3 col = PAPER;
  col *= mix(vec3(1.0), inkB, cB);
  col *= mix(vec3(1.0), INK_O, cO);

  // Paper tooth. Applied to the sheet, not the image.
  col += (hash21(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * uGrain;

  outColor = vec4(col, 1.0);
}
`;

export interface SkyOptions {
  /** Starting dusk value, 0..1. */
  dusk?: number;
  /** Frames per second ceiling. The motion is slow; 60 buys nothing. */
  fps?: number;
}

export interface Sky {
  /** Drive the sunset. 0 = last light, 1 = night. */
  setDusk(v: number): void;
  /** Star opacity, animated on its own curve by the sunset sequence. */
  setStars(v: number): void;
  /** Overall plate strength. 1 on the home hero, lower on reading pages. */
  setInk(v: number): void;
  setGrain(v: number): void;
  /** Warm source position as viewport fractions. */
  setSun(x: number, y: number): void;
  destroy(): void;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`sky: shader compile failed — ${log}`);
  }
  return sh;
}

/**
 * Returns null when WebGL2 is unavailable or the context is lost on creation.
 * Callers must treat that as normal and fall back to the CSS gradient: the
 * design has to be complete with this canvas removed entirely.
 */
export function createSky(canvas: HTMLCanvasElement, opts: SkyOptions = {}): Sky | null {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`sky: link failed — ${gl.getProgramInfoLog(program)}`);
    }
  } catch (err) {
    console.warn(err);
    return null;
  }

  gl.useProgram(program);
  const vao = gl.createVertexArray();   // core profile requires one bound
  gl.bindVertexArray(vao);

  const u = {
    res:   gl.getUniformLocation(program, 'uRes'),
    time:  gl.getUniformLocation(program, 'uTime'),
    dusk:  gl.getUniformLocation(program, 'uDusk'),
    grain: gl.getUniformLocation(program, 'uGrain'),
    sun:   gl.getUniformLocation(program, 'uSun'),
    stars: gl.getUniformLocation(program, 'uStars'),
    ink:   gl.getUniformLocation(program, 'uInk'),
  };

  let dusk = opts.dusk ?? 0;
  let stars = dusk > 0.5 ? 1 : 0;
  let grain = 0.035;
  let sunX = 0.7;
  let sunY = 0.25;
  let ink = 1;

  const frameMs = 1000 / (opts.fps ?? 30);
  let raf = 0;
  let last = -Infinity;
  let start = performance.now();
  let disposed = false;

  function resize() {
    // Capping DPR at 1.5 is the single biggest win here. The content is soft
    // gradients and grain: nobody can tell 3x from 1.5x, and 3x is four times
    // the fragments.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
  }

  function draw(now: number) {
    raf = requestAnimationFrame(draw);
    if (now - last < frameMs) return;
    last = now;
    resize();
    gl!.uniform2f(u.res, canvas.width, canvas.height);
    gl!.uniform1f(u.time, (now - start) / 1000);
    gl!.uniform1f(u.dusk, dusk);
    gl!.uniform1f(u.grain, grain);
    gl!.uniform1f(u.stars, stars);
    gl!.uniform1f(u.ink, ink);
    gl!.uniform2f(u.sun, sunX, sunY);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  // A hidden tab must not burn battery drawing a sky nobody is looking at.
  function onVisibility() {
    if (document.visibilityState === 'hidden') {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf && !disposed) {
      // Rebase so the clouds do not jump forward by the time spent hidden.
      start = performance.now() - (last - start);
      last = -Infinity;
      raf = requestAnimationFrame(draw);
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  raf = requestAnimationFrame(draw);

  return {
    setDusk(v) { dusk = Math.min(1, Math.max(0, v)); },
    setStars(v) { stars = Math.min(1, Math.max(0, v)); },
    setInk(v) { ink = Math.min(1, Math.max(0, v)); },
    setGrain(v) { grain = v; },
    setSun(x, y) { sunX = x; sunY = y; },
    destroy() {
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(program);
      gl.deleteVertexArray(vao);
      /*
        Deliberately NOT calling WEBGL_lose_context.loseContext(). It kills the
        context for the canvas element permanently, and React re-runs effects on
        the same element — StrictMode does it on every mount in development —
        so the next createSky got a dead canvas, returned null, and the whole
        sky silently fell back to the CSS gradient. Dropping the canvas from
        the DOM releases the context on its own.
      */
    },
  };
}
