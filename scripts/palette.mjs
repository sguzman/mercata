// OKLCH and OKLab palette for stable marketplace specimen identities.
// Each new color maximizes the minimum perceptual distance to assigned colors.
// Past assignments never change. Finite palettes necessarily have finite capacity.
export function toLab(color) {
  const angle = color.h * Math.PI / 180;
  return [color.l, color.c * Math.cos(angle), color.c * Math.sin(angle)];
}
export function deltaE(a, b) {
  const x = toLab(a), y = toLab(b);
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}
function gamma(channel) {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}
export function toHex(color) {
  const [l, a, b] = toLab(color);
  const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sp = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  const linear = [
    +4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
    -1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
    -0.0041960863 * lp - 0.7034186147 * mp + 1.7076147010 * sp
  ];
  if (linear.some(x => x < -0.000001 || x > 1.000001)) return null;
  return '#' + linear.map(x => Math.max(0, Math.min(255, Math.round(gamma(Math.max(0, x)) * 255))).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function scoreHash(text) {
  let h = 2166136261;
  for (const char of text) {
    h ^= char.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const candidates = [];
for (const l of [0.48, 0.55, 0.62, 0.69, 0.76, 0.82]) {
  for (const c of [0.07, 0.10, 0.13, 0.16, 0.19]) {
    for (let h = 0; h < 360; h += 6) {
      const color = {l, c, h};
      const hex = toHex(color);
      if (hex) candidates.push({hex, oklch: color});
    }
  }
}
export function pickColor(slug, alreadyAssigned = []) {
  const used = new Set(alreadyAssigned.map(entry => entry.hex.toUpperCase()));
  const existing = alreadyAssigned.map(entry => entry.oklch);
  let best = null, bestScore = -Infinity;
  const hash = scoreHash(slug);
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (used.has(candidate.hex)) continue;
    const separation = existing.length ? Math.min(...existing.map(x => deltaE(x, candidate.oklch))) : 1;
    // Slug hash makes first choices stable and breaks nearly equal distances.
    const jitter = ((scoreHash(slug + ':' + i) ^ hash) >>> 0) / 4294967296;
    const score = separation + jitter * 0.00001;
    if (score > bestScore) { bestScore = score; best = candidate; }
  }
  if (!best) throw new Error('The configured distinct-color palette is exhausted.');
  return structuredClone(best);
}
export function verifyPalette(entries) {
  const hex = new Set();
  for (const entry of entries) {
    const code = entry.color.hex.toUpperCase();
    if (hex.has(code)) throw new Error('Duplicate color: ' + code);
    if (toHex(entry.color.oklch) !== code) throw new Error('Invalid OKLCH/hex pairing: ' + entry.id);
    hex.add(code);
  }
  return true;
}
