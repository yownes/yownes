import relativeLuminance from "relative-luminance";

type RGBColor = [number, number, number, number?];

function hexRgb(hx: string): RGBColor {
  hx = hx.replace(/^#/, "");
  let alpha = 255;

  if (hx.length === 8) {
    alpha = parseInt(hx.slice(6, 8), 16);
    hx = hx.substring(0, 6);
  }

  if (hx.length === 4) {
    alpha = parseInt(hx.slice(3, 4).repeat(2), 16);
    hx = hx.substring(0, 3);
  }

  if (hx.length === 3) {
    hx = hx[0] + hx[0] + hx[1] + hx[1] + hx[2] + hx[2];
  }

  const num = parseInt(hx, 16);
  const red = num >> 16;
  const green = (num >> 8) & 255;
  const blue = num & 255;

  return [red, green, blue, alpha];
}

// http://www.w3.org/TR/WCAG20/#contrast-ratiodef

/**
 * Get the contrast ratio between two relative luminance values
 * @param {number} a luminance value
 * @param {number} b luminance value
 * @returns {number} contrast ratio
 * @example
 * luminance(1, 1); // = 1
 */
export function luminance(a: number, b: number) {
  const l1 = Math.max(a, b);
  const l2 = Math.min(a, b);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Get a score for the contrast between two colors as rgb triplets
 * @param {array} a
 * @param {array} b
 * @returns {number} contrast ratio
 * @example
 * rgb([0, 0, 0], [255, 255, 255]); // = 21
 */
function rgb(a: RGBColor, b: RGBColor) {
  return luminance(relativeLuminance(a), relativeLuminance(b));
}

/**
 * Get a score for the contrast between two colors as hex strings
 * @param {string} a hex value
 * @param {string} b hex value
 * @returns {number} contrast ratio
 * @example
 * hex('#000', '#fff'); // = 21
 */
function hex(a: string, b: string) {
  return rgb(hexRgb(a), hexRgb(b));
}

export function getContrastColor(color?: string | null) {
  if (!color) return;
  const c1 = hex(color, "#fff");
  const c2 = hex(color, "#000");
  return c1 > c2 ? "#fff" : "#000";
}
