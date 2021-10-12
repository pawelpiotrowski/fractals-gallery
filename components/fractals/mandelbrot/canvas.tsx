import {
  addRGB,
  adjustAspectRatio,
  divRGB,
  getColorPicker,
  getSamples,
  iterateEquation,
} from "./plot";
import FractalCanvas from "../canvas";
import { Canvas2DRef } from "../canvas.interface";
import { setCanvas2D, setCanvasDimensions } from "../shared";

const CANVAS_ID = "sierpinskicanvas";
let canvasRef = {} as Canvas2DRef;
let zoomStart = 4;
let zoom = [zoomStart, zoomStart];
let lookAtDefault = [-1.3, -0.3];
let lookAt = lookAtDefault;
let xRange = [0, 0];
let yRange = [0, 0];
let escapeRadius = 10.0;
let reInitCanvas = true; // Whether to reload canvas size, etc
let dragToZoom = true;
let colors = [[0, 0, 0, 0]];
let renderId = 0; // To zoom before current render is finished/
let steps = 10;

/**
 * Render Helpers
 */
function drawLine(
  Ci: number,
  off: number,
  Cr_init: number,
  Cr_step: number,
  pickColor: any
) {
  let Cr = Cr_init;

  for (let x = 0; x < canvasRef.width; ++x, Cr += Cr_step) {
    const p = iterateEquation(Cr, Ci, escapeRadius, steps);
    const color = pickColor(steps, p[0], p[1], p[2]);

    (canvasRef.image as ImageData).data[off++] = color[0];
    (canvasRef.image as ImageData).data[off++] = color[1];
    (canvasRef.image as ImageData).data[off++] = color[2];
    (canvasRef.image as ImageData).data[off++] = 255;
  }
}

function drawLineSuperSampled(
  Ci: number,
  off: number,
  Cr_init: number,
  Cr_step: number,
  pickColor: any,
  superSamples: number,
  Ci_step: number
) {
  let Cr = Cr_init;

  for (let x = 0; x < canvasRef.width; ++x, Cr += Cr_step) {
    let color = [0, 0, 0, 255];

    for (let s = 0; s < superSamples; ++s) {
      const rx = Math.random() * Cr_step;
      const ry = Math.random() * Ci_step;
      const p = iterateEquation(Cr - rx / 2, Ci - ry / 2, escapeRadius, steps);

      color = addRGB(color, pickColor(steps, p[0], p[1], p[2]));
    }

    color = divRGB(color, superSamples);

    (canvasRef.image as ImageData).data[off++] = color[0];
    (canvasRef.image as ImageData).data[off++] = color[1];
    (canvasRef.image as ImageData).data[off++] = color[2];
    (canvasRef.image as ImageData).data[off++] = 255;
  }
}
/**
 * Render
 */
function render(
  pickColor: any,
  superSamples: number,
  Ci_step: number,
  dx: number
) {
  const start = new Date().getTime();
  const startHeight = canvasRef.height;
  const startWidth = canvasRef.width;
  const updateTimeout = 200;
  const drawLineFunc = superSamples > 1 ? drawLineSuperSampled : drawLine;
  const ourRenderId = renderId;
  let lastUpdate = start;
  let pixels = 0;
  let Ci = yRange[0];
  let sy = 0;

  const scanline = () => {
    if (
      renderId !== ourRenderId ||
      startHeight !== canvasRef.height ||
      startWidth !== canvasRef.width
    ) {
      // Stop drawing
      return;
    }

    drawLineFunc(Ci, 0, xRange[0], dx, pickColor, superSamples, Ci_step);
    Ci += Ci_step;
    pixels += canvasRef.width;
    (canvasRef.context as CanvasRenderingContext2D).putImageData(
      canvasRef.image as ImageData,
      0,
      sy
    );

    const now = new Date().getTime();

    /*
     * Javascript is inherently single-threaded, and the way
     * you yield thread control back to the browser is MYSTERIOUS.
     *
     * People seem to use setTimeout() to yield, which lets us
     * make sure the canvas is updated, so that we can do animations.
     *
     * But if we do that for every scanline, it will take 100x longer
     * to render everything, because of overhead.  So therefore, we'll
     * do something in between.
     */
    if (sy++ < canvasRef.height) {
      if (now - lastUpdate >= updateTimeout) {
        (canvasRef.context as CanvasRenderingContext2D).putImageData(
          canvasRef.image as ImageData,
          0,
          sy
        );

        // yield control back to browser, so that canvas is updated
        lastUpdate = now;
        window.requestAnimationFrame(scanline);
      } else {
        scanline();
      }
    }
  };

  // Disallow redrawing while rendering
  scanline();
}

/*
 * Draw the Mandelbrot set
 */
function draw(pickColor: any, superSamples: any) {
  if (lookAt === null) {
    lookAt = [-0.6, 0];
  }
  if (zoom === null) {
    zoom = [zoomStart, zoomStart];
  }

  xRange = [lookAt[0] - zoom[0] / 2, lookAt[0] + zoom[0] / 2];
  yRange = [lookAt[1] - zoom[1] / 2, lookAt[1] + zoom[1] / 2];

  setCanvasDimensions(canvasRef);
  setCanvasImage();

  const { width, height } = canvasRef;

  zoom = adjustAspectRatio(
    xRange,
    yRange,
    canvasRef.width,
    canvasRef.height,
    zoom
  );

  const f = Math.sqrt(
    0.001 +
      2.0 *
        Math.min(
          Math.abs(xRange[0] - xRange[1]),
          Math.abs(yRange[0] - yRange[1])
        )
  );

  steps = Math.floor(223.0 / f);

  const dx = (xRange[1] - xRange[0]) / (0.5 + (width - 1));
  const dy = (yRange[1] - yRange[0]) / (0.5 + (height - 1));
  const Ci_step = (yRange[1] - yRange[0]) / (0.5 + (height - 1));

  // Only enable one render at a time
  renderId += 1;

  render(pickColor, superSamples, Ci_step, dx);
  console.log("Mandelbrot @ draw canvas");
}

function setCanvasImage(): void {
  const { context, width } = canvasRef;

  canvasRef.image = (context as CanvasRenderingContext2D).createImageData(
    width,
    1
  );
}

function resetCanvasOnResize() {
  (canvasRef.context as CanvasRenderingContext2D).clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );
  lookAt = lookAtDefault;
  zoom = [zoomStart, zoomStart];

  draw(getColorPicker(), getSamples());
}

function resetCanvas() {
  canvasRef = {} as Canvas2DRef;
  lookAt = lookAtDefault;
  zoom = [zoomStart, zoomStart];
}

function setCanvas(): void {
  if (!setCanvas2D(canvasRef, CANVAS_ID) || !setCanvasDimensions(canvasRef)) {
    return;
  }

  draw(getColorPicker(), getSamples());
  window.onresize = resetCanvasOnResize;
}

const MandelbrotCanvas = () => {
  return (
    <FractalCanvas
      canvasId={CANVAS_ID}
      onInit={setCanvas}
      onDestroy={resetCanvas}
    />
  );
};

export default MandelbrotCanvas;
