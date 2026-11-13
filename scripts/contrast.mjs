// WCAG 2.1 contrast helpers (step 4 of the colour system: check every pair).
export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
/** Blend a foreground with alpha over an opaque background. */
export function over(fg, alpha, bg) {
  const a = hexToRgb(fg), b = hexToRgb(bg);
  return "#" + a.map((v, i) => Math.round(v * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
}
export function contrast(fg, bg) {
  const a = lum(hexToRgb(fg)), b = lum(hexToRgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
