import isEmpty from "lodash-es/isEmpty";
import { Canvas2DRef, CanvasWebGLRef } from "./canvas.interface";

type CanvasRefArg = Canvas2DRef | CanvasWebGLRef;

export const isCanvasSet = (canvasRef: CanvasRefArg): boolean =>
  !isEmpty(canvasRef);

export function setCanvasDimensions(canvasRef: CanvasRefArg): boolean {
  if (!isCanvasSet(canvasRef)) {
    return false;
  }
  canvasRef.width = window.innerWidth;
  canvasRef.height = window.innerHeight;
  canvasRef.element.width = canvasRef.width;
  canvasRef.element.height = canvasRef.height;

  console.log("SHARED @ setting up canvas dimensions");

  return true;
}

export function setCanvas2D(
  canvasRef: CanvasRefArg,
  canvasId: string
): boolean {
  if (isCanvasSet(canvasRef)) {
    return false;
  }
  canvasRef.element = document.getElementById(canvasId) as HTMLCanvasElement;
  canvasRef.context = canvasRef.element.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  console.log("SHARED @ setting up the 2D canvas, canvas ID: ", canvasId);

  return true;
}

export function setCanvasWebGL(
  canvasRef: CanvasRefArg,
  canvasId: string
): boolean {
  if (isCanvasSet(canvasRef)) {
    return false;
  }
  canvasRef.element = document.getElementById(canvasId) as HTMLCanvasElement;
  canvasRef.context = canvasRef.element.getContext(
    "webgl"
  ) as WebGL2RenderingContext;

  console.log("SHARED @ setting up the WebGL canvas, canvas ID: ", canvasId);

  return true;
}
