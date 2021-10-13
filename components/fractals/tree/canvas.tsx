import FractalCanvas from "../canvas";
import { Canvas2DRef } from "../canvas.interface";
import { setCanvas2D, setCanvasDimensions } from "../shared";

const CANVAS_ID = "treecanvas";
let canvasRef = {} as Canvas2DRef;

function draw(
  startX: number,
  startY: number,
  len: number,
  angle: number,
  branchWidth: number
) {
  const { context: ctx } = canvasRef;

  ctx.lineWidth = branchWidth;

  ctx.beginPath();
  ctx.save();

  ctx.strokeStyle = "green";
  ctx.fillStyle = "green";

  ctx.translate(startX, startY);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -len);
  ctx.stroke();

  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(0,0,0,0.8)";

  if (len < 10) {
    ctx.restore();
    return;
  }

  draw(0, -len, len * 0.8, angle - 15, branchWidth * 0.8);
  draw(0, -len, len * 0.8, angle + 15, branchWidth * 0.8);

  ctx.restore();
}

function render(): void {
  const windowInnerWidth = window.innerWidth;
  const windowInnerHeight = window.innerHeight;
  const limit = 700;
  const superSizeMe = windowInnerWidth > limit && windowInnerHeight > limit;

  window.requestAnimationFrame(() => {
    draw(
      windowInnerWidth / 2,
      windowInnerHeight * 0.8,
      superSizeMe ? 120 : 80,
      0,
      superSizeMe ? 10 : 8
    );
  });
}

function resetCanvasOnResize() {
  canvasRef.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  setCanvasDimensions(canvasRef);
  render();
}

function resetCanvas(): void {
  window.removeEventListener("resize", resetCanvasOnResize);
  canvasRef = {} as Canvas2DRef;
}

function setCanvas(): void {
  if (!setCanvas2D(canvasRef, CANVAS_ID) || !setCanvasDimensions(canvasRef)) {
    return;
  }
  render();
  window.addEventListener("resize", resetCanvasOnResize);
}

const TreeCanvas = () => {
  return (
    <FractalCanvas
      canvasClass="canvas--bckgd-navy-blue"
      canvasId={CANVAS_ID}
      onInit={setCanvas}
      onDestroy={resetCanvas}
    />
  );
};

export default TreeCanvas;
