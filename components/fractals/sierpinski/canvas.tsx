import FractalCanvas from "../canvas";
import { Canvas2DRef } from "../canvas.interface";
import { setCanvas2D, setCanvasDimensions } from "../shared";

const CANVAS_ID = "sierpinskicanvas";
let canvasRef = {} as Canvas2DRef;

const createTriangle = (pos: any[], sidelen: any) => {
  const ctx = canvasRef.context as CanvasRenderingContext2D;
  const posTuplet = [...pos] as [number, number];
  ctx.beginPath();
  ctx.moveTo(...posTuplet); // go to the left vertex

  // note that (0,0) in canvas is the top left, so 'up' on the vertical component would use substraction.
  ctx.lineTo(pos[0] + sidelen / 2, pos[1] - sidelen * Math.sin(Math.PI / 3)); // draw line from left vertex to top vertex
  ctx.lineTo(pos[0] + sidelen, pos[1]); // draw line from top vertex to right vertex
  ctx.lineTo(...posTuplet); // draw line from right vertex back to left vertex
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill(); // fill triangle
};

const createSierpinskiTriangle = (pos: any, sidelen: any, depth: any) => {
  const innerTriangleSidelen = sidelen / 2; // side length of inner triangles is half the side length of the outer triangle
  const innerTrianglesPositions = [
    pos,
    [pos[0] + innerTriangleSidelen, pos[1]],
    [
      pos[0] + innerTriangleSidelen / 2,
      pos[1] - Math.sin(Math.PI / 3) * innerTriangleSidelen,
    ],
  ]; // these positions are the same as what was used in the createTriangle function
  if (depth == 0) {
    innerTrianglesPositions.forEach((trianglePosition) => {
      createTriangle(trianglePosition, innerTriangleSidelen);
    });
  } else {
    innerTrianglesPositions.forEach((trianglePosition) => {
      createSierpinskiTriangle(
        trianglePosition,
        innerTriangleSidelen,
        depth - 1
      );
    });
  }
};

function render(): void {
  // To call the function, draw the Sierpinski triangle at the bottom left of the canvas ((0, 1000))
  // with a side length of 1000px (the width of the canvas) and a depth of 5.
  const { width, height } = canvasRef;
  const sideBase = width < height ? width : height;
  const centerX = width / 2;
  const centerY = height / 2;
  const side = sideBase * 0.8;
  const startX = centerX - side / 2;
  const startY = (centerY + side / 2) * 0.94;
  const depth = 5;

  createSierpinskiTriangle([startX, startY], side, depth);
}

function onResize(): void {
  setCanvasDimensions(canvasRef);
  render();
}

function resetCanvas() {
  canvasRef = {} as Canvas2DRef;
}

function setCanvas(): void {
  if (!setCanvas2D(canvasRef, CANVAS_ID) || !setCanvasDimensions(canvasRef)) {
    return;
  }
  render();
  window.onresize = onResize;
}

const SierpinskiCanvas = () => {
  return (
    <FractalCanvas
      canvasClass="canvas--bckgd-dark-blue"
      canvasId={CANVAS_ID}
      onInit={setCanvas}
      onDestroy={resetCanvas}
    />
  );
};

export default SierpinskiCanvas;
