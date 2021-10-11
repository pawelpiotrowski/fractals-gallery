/*
 * Main renderer equation.
 *
 * Returns number of iterations and values of Z_{n}^2 = Tr + Ti at the time
 * we either converged (n == iterations) or diverged.  We use these to
 * determined the color at the current pixel.
 *
 * The Mandelbrot set is rendered taking
 *
 *     Z_{n+1} = Z_{n}^2 + C
 *
 * with C = x + iy, based on the "look at" coordinates.
 *
 * The Julia set can be rendered by taking
 *
 *     Z_{0} = C = x + iy
 *     Z_{n+1} = Z_{n} + K
 *
 * for some arbitrary constant K.  The point C for Z_{0} must be the
 * current pixel we're rendering, but K could be based on the "look at"
 * coordinate, or by letting the user select a point on the screen.
 */
export function iterateEquation(
  Cr: number,
  Ci: number,
  escapeRadius: number,
  iterations: number
): number[] {
  let Zr = 0;
  let Zi = 0;
  let Tr = 0;
  let Ti = 0;
  let n = 0;

  for (; n < iterations && Tr + Ti <= escapeRadius; ++n) {
    Zi = 2 * Zr * Zi + Ci;
    Zr = Tr - Ti + Cr;
    Tr = Zr * Zr;
    Ti = Zi * Zi;
  }

  /*
   * Four more iterations to decrease error term;
   * see http://linas.org/art-gallery/escape/escape.html
   */
  for (let e = 0; e < 4; ++e) {
    Zi = 2 * Zr * Zi + Ci;
    Zr = Tr - Ti + Cr;
    Tr = Zr * Zr;
    Ti = Zi * Zi;
  }

  return [n, Tr, Ti];
}

/*
 * Return number with metric units
 */
export function metric_units(number: number): string {
  const unit = ["", "k", "M", "G", "T", "P", "E"];
  const mag = Math.ceil((1 + Math.log(number) / Math.log(10)) / 3);

  return "" + (number / Math.pow(10, 3 * (mag - 1))).toFixed(2) + unit[mag];
}

/*
 * Convert hue-saturation-value/luminosity to RGB.
 *
 * Input ranges:
 *   H =   [0, 360] (integer degrees)
 *   S = [0.0, 1.0] (float)
 *   V = [0.0, 1.0] (float)
 */
export function hsv_to_rgb(h: number, s: number, v: number): number[] {
  if (v > 1.0) {
    v = 1.0;
  }
  const hp = h / 60.0;
  const c = v * s;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let rgb = [0, 0, 0];

  if (0 <= hp && hp < 1) rgb = [c, x, 0];
  if (1 <= hp && hp < 2) rgb = [x, c, 0];
  if (2 <= hp && hp < 3) rgb = [0, c, x];
  if (3 <= hp && hp < 4) rgb = [0, x, c];
  if (4 <= hp && hp < 5) rgb = [x, 0, c];
  if (5 <= hp && hp < 6) rgb = [c, 0, x];

  const m = v - c;

  rgb[0] += m;
  rgb[1] += m;
  rgb[2] += m;

  rgb[0] *= 255;
  rgb[1] *= 255;
  rgb[2] *= 255;

  return rgb;
}

/*
 * Adjust aspect ratio based on plot ranges and canvas dimensions.
 */
export function adjustAspectRatio(
  xRange: number[],
  yRange: number[],
  width: number,
  height: number,
  zoom: number[]
): number[] {
  const ratio =
    Math.abs(xRange[1] - xRange[0]) / Math.abs(yRange[1] - yRange[0]);
  const sratio = width / height;

  if (sratio > ratio) {
    const xf = sratio / ratio;

    xRange[0] *= xf;
    xRange[1] *= xf;
    zoom[0] *= xf;

    return zoom;
  }
  const yf = ratio / sratio;

  yRange[0] *= yf;
  yRange[1] *= yf;
  zoom[1] *= yf;

  return zoom;
}

export function addRGB(v: number[], w: number[]): number[] {
  v[0] += w[0];
  v[1] += w[1];
  v[2] += w[2];
  v[3] += w[3];

  return v;
}

export function divRGB(v: number[], div: number): number[] {
  v[0] /= div;
  v[1] /= div;
  v[2] /= div;
  v[3] /= div;

  return v;
}

// Some constants used with smoothColor
const logBase = 1.0 / Math.log(2.0);
const logHalfBase = Math.log(0.5) * logBase;

export function smoothColor(n: number, Tr: number, Ti: number): number {
  /*
   * Original smoothing equation is
   *
   * var v = 1 + n - Math.log(Math.log(Math.sqrt(Zr*Zr+Zi*Zi)))/Math.log(2.0);
   *
   * but can be simplified using some elementary logarithm rules to
   */
  return 5 + n - logHalfBase - Math.log(Math.log(Tr + Ti)) * logBase;
}

const interiorColor = [0, 0, 0, 255];

export function pickColorHSV1(
  steps: number,
  n: number,
  Tr: number,
  Ti: number
): number[] {
  if (n === steps) {
    // converged?
    return interiorColor;
  }
  const v = smoothColor(n, Tr, Ti);
  const c = hsv_to_rgb((360.0 * v) / steps, 1.0, 1.0);

  c.push(255); // alpha

  return c;
}

export function pickColorHSV2(
  steps: number,
  n: number,
  Tr: number,
  Ti: number
): number[] {
  if (n === steps) {
    // converged?
    return interiorColor;
  }
  const v = smoothColor(n, Tr, Ti);
  const c = hsv_to_rgb((360.0 * v) / steps, 1.0, (10.0 * v) / steps);

  c.push(255); // alpha

  return c;
}

export function pickColorHSV3(
  steps: number,
  n: number,
  Tr: number,
  Ti: number
): number[] {
  if (n === steps) {
    // converged?
    return interiorColor;
  }

  const v = smoothColor(n, Tr, Ti);
  const c = hsv_to_rgb((360.0 * v) / steps, 1.0, (10.0 * v) / steps);
  // swap red and blue
  const t = c[0];

  c[0] = c[2];
  c[2] = t;
  c.push(255); // alpha

  return c;
}

export function pickColorGrayscale(
  steps: number,
  n: number,
  Tr: number,
  Ti: number
): number[] {
  if (n === steps) {
    // converged?
    return interiorColor;
  }
  let v = smoothColor(n, Tr, Ti);

  v = Math.floor((512.0 * v) / steps);
  if (v > 255) {
    v = 255;
  }

  return [v, v, v, 255];
}

export function pickColorGrayscale2(
  steps: number,
  n: number,
  Tr: number,
  Ti: number
): number[] {
  if (n === steps) {
    // converged?
    let c = 255 - (Math.floor(255.0 * Math.sqrt(Tr + Ti)) % 255);

    if (c < 0) {
      c = 0;
    }
    if (c > 255) {
      c = 255;
    }

    return [c, c, c, 255];
  }

  return pickColorGrayscale(steps, n, Tr, Ti);
}

export function getColorPicker(p = "pickColorHSV3") {
  if (p === "pickColorHSV1") {
    return pickColorHSV1;
  }
  if (p === "pickColorHSV2") {
    return pickColorHSV2;
  }
  if (p === "pickColorHSV3") {
    return pickColorHSV3;
  }
  if (p === "pickColorGrayscale2") {
    return pickColorGrayscale2;
  }
  return pickColorGrayscale;
}

export function getSamples() {
  return 1;
}
