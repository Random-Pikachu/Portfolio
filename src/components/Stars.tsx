import { useEffect, useRef } from 'react';
import { sun } from '../lib/sunState';

/**
 * The night sky, brought back from the original riso sky shader — the same
 * hashed cell grid and per-star twinkle, with the two-ink printing dropped
 * because the page now has a real sunset to sit under.
 *
 * Stars arrive as the page gets darker rather than all at once: the hash
 * threshold moves with the reveal, so the rarest few show up first and the
 * sky fills in behind them the further you scroll. Additively blended, so at
 * reveal 0 the canvas contributes nothing at all and the daytime page is
 * untouched.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uReveal;
uniform vec2  uMouse;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec2 g = vec2(uv.x * ar, uv.y) * 38.0;
  vec2 cell = floor(g);
  float h = hash21(cell);

  // The threshold walks down as the page darkens, so the sky fills in. The
  // extra term thins the field toward the bottom of the frame: a real sky is
  // emptier at the horizon, and it is what makes the horizon rule read as a
  // horizon rather than as a stray line.
  float thresh = mix(0.995, 0.918, uReveal) + (1.0 - uv.y) * 0.020;
  float a = 0.0;

  if (h > thresh) {
    vec2 off = vec2(hash21(cell + 3.1), hash21(cell + 7.7));
    float d = length(fract(g) - off);
    float h2 = hash21(cell + 17.3);
    float size = mix(0.030, 0.075, h2);
    float core = 1.0 - smoothstep(0.0, size, d);
    float halo = (1.0 - smoothstep(0.0, size * 5.0, d)) * 0.18;
    float tw = 0.55 + 0.45 * sin(uTime * (0.35 + h2 * 1.6) + h * 31.4);
    // Stars near the pointer twinkle harder. Costs nothing, and it makes the
    // night half feel inhabited rather than printed.
    float near = 1.0 - smoothstep(0.0, 0.18,
      length(vec2((uv.x - uMouse.x) * ar, uv.y - uMouse.y)));
    tw *= 1.0 + 0.25 * near;
    // Each star has its own moment of arrival inside the reveal.
    float born = smoothstep(0.0, 0.45, uReveal - (h - thresh) * 2.0);
    a = (core + halo) * tw * born;
  }

  a *= uReveal;
  a *= 0.88;
  gl_FragColor = vec4(vec3(1.0, 0.94, 0.86) * a, a);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

export default function Stars() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: false, premultipliedAlpha: true, depth: false,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uReveal = gl.getUniformLocation(prog, 'uReveal');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;

    const size = () => {
      // Half resolution: this is a field of soft points, and nobody can tell.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.round(window.innerWidth * dpr * 0.6);
      h = Math.round(window.innerHeight * dpr * 0.6);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    size();

    const start = performance.now();
    let raf = 0;
    let painted = -1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const reveal = sun.night;
      // Nothing to draw during the day, and no reason to keep clearing a
      // canvas that is already empty.
      if (reveal < 0.002) {
        if (painted !== 0) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          painted = 0;
        }
        return;
      }
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, still ? 12.5 : (now - start) / 1000);
      gl.uniform1f(uReveal, reveal);
      // Read from the same lerped pointer position the field already writes,
      // so there is no second listener.
      const cs = document.documentElement.style;
      const mx = parseFloat(cs.getPropertyValue('--mx')) || -9999;
      const my = parseFloat(cs.getPropertyValue('--my')) || -9999;
      gl.uniform2f(uMouse, mx / window.innerWidth, 1 - my / window.innerHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      painted = 1;
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('resize', size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      // Deliberately no loseContext(): React re-runs effects against the same
      // element, and a killed context never comes back.
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas className="stars" ref={ref} aria-hidden="true" />;
}
