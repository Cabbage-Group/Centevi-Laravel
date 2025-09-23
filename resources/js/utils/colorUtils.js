// colorUtils.js
// Helpers: hex <-> rgb <-> hsl, darken y lighten + generadores de paleta

export function normalizeHex(hex) {
  if (!hex) return '#8884D8';
  hex = hex.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(ch => ch + ch).join('');
  }
  return `#${hex.toUpperCase()}`;
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return { r, g, b };
}

export function rgbToHex({ r, g, b }) {
  const toHex = n => {
    const h = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return h.length === 1 ? '0' + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }) {
  h = h / 360; s = s / 100; l = l / 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/* ------------------------ darken  ------------------------ */
export function darkenHex(hex, stepIndex = 0, options = {}) {
  const { stepAmount = 6, maxSteps = 6 } = options;
  const safeHex = normalizeHex(hex);
  const rgb = hexToRgb(safeHex);
  const hsl = rgbToHsl(rgb);
  const steps = Math.max(0, Math.min(maxSteps, stepIndex));
  const newL = Math.max(0, hsl.l - steps * stepAmount);
  const newHsl = { h: hsl.h, s: hsl.s, l: newL };
  const newRgb = hslToRgb(newHsl);
  return rgbToHex(newRgb);
}

/* ------------------------ lighten ------------------------ */
/**
 * lightenHex(hex, stepIndex, options)
 * - hex: color base (más "intenso" / oscuro)
 * - stepIndex: 0 -> base (intenso), 1 -> 1er paso más claro, ...
 * options:
 *  - stepAmount: % de L a sumar por paso (ej 6 => +6% L por paso)
 *  - maxSteps: máximo de pasos
 */
export function lightenHex(hex, stepIndex = 0, options = {}) {
  const { stepAmount = 6, maxSteps = 6 } = options;
  const safeHex = normalizeHex(hex);
  const rgb = hexToRgb(safeHex);
  const hsl = rgbToHsl(rgb);
  const steps = Math.max(0, Math.min(maxSteps, stepIndex));
  const newL = Math.min(100, hsl.l + steps * stepAmount);
  const newHsl = { h: hsl.h, s: hsl.s, l: newL };
  const newRgb = hslToRgb(newHsl);
  return rgbToHex(newRgb);
}

/* ------------------------ helpers de paleta ------------------------ */

/**
 * generateLighterPalette(items, baseColor, options)
 * - items: array (se usa su length)
 * - baseColor: color intenso (ej: '#3456A1')
 * - options:
 *    - stepAmount: % L por paso
 *    - maxSteps: max pasos
 *    - strategy: 'clamp' | 'cycle'  (clamp: pasos > maxSteps => color más claro final; cycle: repite)
 */
export function generateLighterPalette(items = [], baseColor = '#3456A1', options = {}) {
  const { stepAmount = 6, maxSteps = 6, strategy = 'clamp' } = options;
  const length = (items && items.length) || 0;
  const palette = [];
  const cycle = maxSteps + 1;

  for (let i = 0; i < length; i++) {
    let step;
    if (strategy === 'cycle') {
      step = i % cycle;
    } else { // clamp por defecto
      step = Math.min(i, maxSteps);
    }
    // step 0 => base color (mas intenso); step 1 => 1° más claro ...
    palette.push(lightenHex(baseColor, step, { stepAmount, maxSteps }));
  }
  return palette;
}

/* ------------------------ helpers por index/id ------------------------ */

export function getColorByIndex(index, baseColor = '#3456A1', options = {}) {
  const { stepAmount = 6, maxSteps = 6, strategy = 'clamp' } = options;
  const step = strategy === 'cycle' ? index % (maxSteps + 1) : Math.min(index, maxSteps);
  return lightenHex(baseColor, step, { stepAmount, maxSteps });
}

// Hash simple para obtener color estable por id
export function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // to 32bit int
  }
  return Math.abs(hash);
}

export function getColorByIdWithHash(id, baseColor = '#3456A1', options = {}) {
  const { stepAmount = 6, maxSteps = 6 } = options;
  const hash = hashStringToInt(String(id));
  const step = hash % (maxSteps + 1); // 0..maxSteps
  return lightenHex(baseColor, step, { stepAmount, maxSteps });
}