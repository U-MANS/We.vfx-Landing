export const SHADER_LOGO_RGB = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;

    float t = time * 1.5;
    float glitchCycle = fract(time * 0.4);
    float glitch = smoothstep(0.85, 0.9, glitchCycle) * (1.0 - smoothstep(0.95, 1.0, glitchCycle));
    float shift = (sin(t) * 0.012 + cos(t * 0.7) * 0.008 + 0.005) * (1.0 + glitch * 6.0);

    vec4 origR = texture(src, uv + vec2(shift, shift * 0.4));
    vec4 origG = texture(src, uv);
    vec4 origB = texture(src, uv - vec2(shift, shift * 0.4));

    float r = max(origR.r, origR.a);
    float g = max(origG.g, origG.a);
    float b = max(origB.b, origB.a);

    float alpha = max(r, max(g, b));

    float scanline = sin(gl_FragCoord.y * 3.0 + time * 5.0) * 0.06 + 0.94;
    r *= scanline;
    g *= scanline;
    b *= scanline;

    float breathe = sin(time * 2.0) * 0.08 + 0.92;

    outColor = vec4(r * breathe, g * breathe, b * breathe, alpha);
}
`;

export const SHADER_HERO = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.08;

    float n1 = fbm(uv * 3.0 + vec2(t, t * 0.7));
    float n2 = fbm(uv * 4.0 + vec2(-t * 0.6, t * 0.4) + n1 * 0.5);
    float n3 = fbm(uv * 5.0 + vec2(t * 0.3, -t * 0.5) + n2 * 0.3);

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 purple = vec3(0.45, 0.2, 0.85);
    vec3 dark = vec3(0.02, 0.02, 0.028);

    vec3 c1 = mix(pink, purple, smoothstep(0.3, 0.7, n1));
    vec3 c2 = mix(blue, pink, smoothstep(0.4, 0.6, n2));
    vec3 accent = mix(c1, c2, smoothstep(0.3, 0.7, n3));

    float intensity = smoothstep(0.35, 0.75, n2) * 0.1;
    intensity += smoothstep(0.5, 0.8, n3) * 0.04;
    vec3 color = mix(dark, accent, intensity);

    vec2 center = uv - vec2(0.5);
    float vig = 1.0 - dot(center, center) * 1.0;
    color *= clamp(vig, 0.0, 1.0);

    float scanline = sin(gl_FragCoord.y * 1.5) * 0.015 + 1.0;
    color *= scanline;

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_PLASMA = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.25;

    float v1 = sin(uv.x * 10.0 + t);
    float v2 = sin(uv.y * 8.0 - t * 0.7);
    float v3 = sin((uv.x + uv.y) * 6.0 + t * 0.5);
    float v4 = sin(length(uv - 0.5) * 12.0 - t);
    float v = (v1 + v2 + v3 + v4) * 0.25;

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 dark = vec3(0.03, 0.03, 0.05);

    vec3 accent = mix(pink, blue, v * 0.5 + 0.5);
    float intensity = smoothstep(0.2, 0.8, abs(v)) * 0.18;
    vec3 color = mix(dark, accent, intensity);

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_GRID = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.2;

    vec2 grid = fract(uv * 12.0);
    float dx = min(grid.x, 1.0 - grid.x);
    float dy = min(grid.y, 1.0 - grid.y);
    float dist = min(dx, dy);
    float line = smoothstep(0.02, 0.0, dist);

    float pulse = sin(t + uv.x * 4.0 - uv.y * 3.0) * 0.5 + 0.5;
    float glow = line * pulse;

    vec2 cell = floor(uv * 12.0);
    float cellPulse = sin(t * 2.0 + cell.x * 1.7 + cell.y * 2.3) * 0.5 + 0.5;
    float cellGlow = smoothstep(0.6, 1.0, cellPulse) * 0.08;

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 dark = vec3(0.03, 0.03, 0.05);

    vec3 lineColor = mix(blue, pink, pulse);
    vec3 color = dark;
    color += lineColor * glow * 0.25;
    color += pink * cellGlow;

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_WAVES = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.15;

    float wave = 0.0;
    for (float i = 1.0; i < 8.0; i += 1.0) {
        float freq = i * 2.5;
        float amp = 1.0 / i;
        wave += sin(uv.x * freq + t * i * 0.4 + sin(uv.y * freq * 0.5 + t)) * amp;
    }
    wave = wave * 0.25 + 0.5;

    float line = smoothstep(0.48, 0.5, wave) - smoothstep(0.5, 0.52, wave);
    line += smoothstep(0.23, 0.25, wave) - smoothstep(0.25, 0.27, wave);
    line += smoothstep(0.73, 0.75, wave) - smoothstep(0.75, 0.77, wave);

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 dark = vec3(0.03, 0.03, 0.05);

    vec3 accent = mix(blue, pink, uv.y);
    float glow = smoothstep(0.3, 0.7, wave) * 0.06;
    vec3 color = dark + accent * line * 0.35 + accent * glow;

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_CIRCUITS = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.15;

    float scale = 8.0;
    vec2 cell = floor(uv * scale);
    vec2 local = fract(uv * scale);

    float h = hash(cell);
    float dir = step(0.5, h);

    float lineX = smoothstep(0.48, 0.5, local.y) - smoothstep(0.5, 0.52, local.y);
    float lineY = smoothstep(0.48, 0.5, local.x) - smoothstep(0.5, 0.52, local.x);
    float line = mix(lineX, lineY, dir);

    float nodeSize = 0.08;
    float node = smoothstep(nodeSize, nodeSize * 0.5, length(local - 0.5));

    float flow = fract(
        mix(uv.x, uv.y, dir) * scale + t * (hash(cell + 42.0) * 2.0 - 1.0) * 2.0
    );
    float pulse = smoothstep(0.0, 0.1, flow) * smoothstep(0.3, 0.1, flow);

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 dark = vec3(0.03, 0.03, 0.05);

    vec3 accent = mix(blue, pink, h);
    vec3 color = dark;
    color += accent * line * 0.2;
    color += pink * node * 0.4;
    color += accent * pulse * line * 0.3;

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_DATASTREAM = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.3;

    float cols = 20.0;
    float col = floor(uv.x * cols);
    float speed = hash(vec2(col, 0.0)) * 2.0 + 0.5;
    float colOffset = hash(vec2(col, 1.0)) * 100.0;

    float rows = 30.0;
    float shifted = uv.y + t * speed + colOffset;
    float row = floor(shifted * rows);

    float charHash = hash(vec2(col, row));
    float isOn = step(0.55, charHash);
    float brightness = hash(vec2(col, row + 100.0));

    float trail = fract(shifted * rows);
    float fade = pow(1.0 - trail, 3.0);

    float headY = fract(t * speed + colOffset);
    float distToHead = abs(fract(uv.y + t * speed + colOffset) - headY);
    float headGlow = smoothstep(0.15, 0.0, distToHead);

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 dark = vec3(0.02, 0.02, 0.03);

    vec3 streamColor = mix(blue, pink, hash(vec2(col, 42.0)));
    vec3 color = dark;
    color += streamColor * isOn * brightness * 0.12 * fade;
    color += pink * headGlow * 0.2;

    float colEdge = fract(uv.x * cols);
    float colLine = smoothstep(0.02, 0.0, colEdge) + smoothstep(0.98, 1.0, colEdge);
    color += vec3(0.02) * colLine;

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_ENERGY = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform sampler2D src;
out vec4 outColor;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
    );
}

void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float t = time * 0.2;

    vec2 center = uv - 0.5;
    float angle = atan(center.y, center.x);
    float radius = length(center);

    float spiral = sin(angle * 3.0 - radius * 15.0 + t * 3.0) * 0.5 + 0.5;
    float ring = sin(radius * 25.0 - t * 4.0) * 0.5 + 0.5;

    float n = noise(vec2(angle * 2.0, radius * 5.0) + t);
    float energy = spiral * 0.5 + ring * 0.3 + n * 0.2;
    energy *= smoothstep(0.5, 0.1, radius);

    vec3 pink = vec3(1.0, 0.31, 0.48);
    vec3 blue = vec3(0.29, 0.42, 0.97);
    vec3 purple = vec3(0.6, 0.2, 0.9);
    vec3 dark = vec3(0.02, 0.02, 0.03);

    vec3 accent = mix(blue, pink, spiral);
    accent = mix(accent, purple, ring * 0.3);

    float coreGlow = smoothstep(0.15, 0.0, radius) * 0.25;
    vec3 color = dark;
    color += accent * energy * 0.2;
    color += pink * coreGlow;

    outColor = vec4(color, 1.0);
}
`;

export const SHADER_MAP = {
    plasma: SHADER_PLASMA,
    grid: SHADER_GRID,
    waves: SHADER_WAVES,
    circuits: SHADER_CIRCUITS,
    datastream: SHADER_DATASTREAM,
    energy: SHADER_ENERGY,
};
