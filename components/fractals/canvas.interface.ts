type CanvasRef = {
  canvasId: string;
  element: HTMLCanvasElement;
  width: number;
  height: number;
  image?: ImageData;
};

export type Canvas2DRef = CanvasRef & {
  context: CanvasRenderingContext2D;
};

export type CanvasWebGLRef = CanvasRef & {
  context: WebGL2RenderingContext;
};

export type FractalCanvasProps = {
  canvasClass?: string;
  canvasId: string;
  onInit: () => void;
  onDestroy: () => void;
};

export type FractalInfoProps = {
  title: string;
  links?: string[];
};
