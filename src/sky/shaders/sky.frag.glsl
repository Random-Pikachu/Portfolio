#version 300 es
precision highp float;

/*
  The scene, under the page: the dust of faint stars at three depths, the
  haze of the Milky Way, the mist toward the horizon, the orbits of the
  transits and the lighthouse's beam. Everything is a mark composited over
  a clear ground, in premultiplied alpha, so the page's own paper stays the
  ground and the same program serves both modes: by night the marks are
  cream and soft, by day they are ink, hard, and hatched.

  Coordinates are CSS pixels, y down, so anchors measured from the DOM land
  where they were measured.
*/

out vec4 o;

uniform vec2 uRes;      // canvas size, device pixels
uniform float uDpr;     // device pixels per CSS pixel
uniform float uTime;
uniform float uNight;   // 0 day, 1 night
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uInk3;
uniform vec3 uLine;
uniform vec3 uStar;
uniform vec2 uPan;      // the chart's own translation, CSS px
uniform float uZoom;
uniform float uDust;
uniform float uHaze;
uniform float uFog;
uniform vec4 uRings;    // cx, cy, base radius, progress
uniform vec4 uBeam;     // ox, oy, angle, intensity
uniform float uTwinkle;
uniform int uOctaves;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= uOctaves) break;
    v += a * vnoise(p);
    p = p * 2.03 + 17.0;
    a *= 0.5;
  }
  return v;
}

/* A mark of colour c and coverage k, over what is there. */
void mark(inout vec4 acc, vec3 c, float k) {
  acc = vec4(c * k, k) + acc * (1.0 - k);
}

/* Faint stars on a lattice of cells `cell` CSS px wide, moving at `par` of the chart. */
float dust(vec2 p, float cell, float par, float density, float seed, out float halo) {
  vec2 q = (p - uPan * par) / cell;
  vec2 i = floor(q);
  vec2 f = fract(q);
  float best = 0.0;
  halo = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 c = i + g;
      float present = step(1.0 - density, hash12(c + seed * 3.1));
      if (present < 0.5) continue;
      vec2 pos = g + hash22(c + seed);
      float d = length(f - pos) * cell;
      float b = hash12(c + seed * 7.7);
      float r = 0.45 + b * b * 1.1;
      float tw = 1.0 - uTwinkle * 0.6 * (0.5 + 0.5 * sin(uTime * (1.5 + 3.0 * b) + b * 40.0));
      float s = smoothstep(r + 0.8, r - 0.4, d) * (0.25 + 0.75 * b) * tw;
      best = max(best, s);
      halo = max(halo, smoothstep(r * 5.0, 0.0, d) * b * b * tw);
    }
  }
  return best;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  vec2 size = uRes / uDpr;
  p.y = size.y - p.y;
  float vmin = min(size.x, size.y);
  vec4 acc = vec4(0.0);
  vec3 starInk = mix(uInk, uStar, uNight);

  /* The mist toward the horizon: lighter than the void by night, a darker wash by day. */
  float fog = uFog * smoothstep(0.3, 1.0, p.y / size.y);
  vec3 mist = mix(uInk3, mix(uPaper, uLine, 0.75), uNight);
  mark(acc, mist, fog * mix(0.14, 0.55, uNight));

  /* The haze: a band across the sky, textured. */
  vec2 hp = (p - uPan * 0.25) / (0.55 * vmin);
  float n = fbm(hp * 1.6 + 3.0);
  vec2 dir = normalize(vec2(0.86, 0.5));
  float band = exp(-pow(dot(p - size * 0.5 - uPan * 0.25, vec2(-dir.y, dir.x)) / (0.3 * vmin), 2.0));
  float haze = uHaze * band * smoothstep(0.38, 0.72, n);
  float hatch1 = step(0.5, fract((p.x + p.y) / 3.0));
  float hatch2 = step(0.5, fract((p.x - p.y) / 3.0));
  float dayHaze = (hatch1 * smoothstep(0.1, 0.2, haze) + hatch2 * smoothstep(0.24, 0.34, haze)) * 0.065;
  mark(acc, mix(uInk, uStar, uNight), mix(dayHaze, haze * 0.09, uNight));

  /* The dust, three depths. */
  float h0, h1, h2;
  float d0 = dust(p, 34.0, 0.3, 0.55, 1.0, h0);
  float d1 = dust(p, 58.0, 0.55, 0.5, 2.0, h1);
  float d2 = dust(p, 96.0, 0.85, 0.5, 3.0, h2);
  float dots = max(max(d0 * 0.55, d1 * 0.75), d2);
  float halo = max(max(h0 * 0.4, h1 * 0.6), h2) * uNight * 0.09;
  mark(acc, starInk, halo * uDust);
  mark(acc, starInk, dots * uDust * mix(0.5, 0.9, uNight));

  /* The orbits: three ellipses about the tick, drawn to `progress`. */
  if (uRings.w > 0.001) {
    vec2 v = p - uRings.xy;
    float ang = atan(v.y, v.x) / 6.2831853 + 0.5;
    for (int i = 0; i < 3; i++) {
      float rx = uRings.z * (1.0 + 0.72 * float(i));
      float ry = rx * 0.36;
      float e = length(v / vec2(rx, ry));
      float dist = (e - 1.0) * ry;
      float line = smoothstep(1.3, 0.0, abs(dist));
      float drawn = step(ang, uRings.w);
      float dash = mix(step(0.45, fract(ang * rx / 9.0)), 1.0, uNight);
      mark(acc, mix(uInk3, uStar, uNight), line * drawn * dash * mix(0.42, 0.26, uNight));
    }
  }

  /* The beam: a wedge from the lamp, soft by night, a fan of lines by day. */
  if (uBeam.w > 0.001) {
    vec2 v = p - uBeam.xy;
    float dist = length(v);
    float da = atan(v.y, v.x) - uBeam.z;
    da = abs(mod(da + 3.14159265, 6.2831853) - 3.14159265);
    float wedge = smoothstep(0.2, 0.02, da);
    float fall = exp(-dist / (0.8 * vmin)) * smoothstep(0.0, 40.0, dist);
    float fan = step(0.5, fract(da / 0.03)) * step(0.02, da);
    mark(acc, mix(uInk, uStar, uNight), wedge * fall * uBeam.w * mix(0.11 * fan, 0.16, uNight));
  }

  o = acc;
}
