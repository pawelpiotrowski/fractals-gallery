import FractalCanvas from "../canvas";
import { CanvasWebGLRef } from "../canvas.interface";
import { setCanvasWebGL, setCanvasDimensions } from "../shared";

const CANVAS_ID = "juliacanvas";
let canvasRef = {} as CanvasWebGLRef;

function makeShader(type: any, source: any) {
  const gl = canvasRef.context as WebGL2RenderingContext;
  const shader = gl.createShader(type) as WebGLShader;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  return shader;
}

let animateRef = 0;
let playAnimation = false;

function render() {
  const gl = canvasRef.context as WebGL2RenderingContext;
  const program = gl.createProgram() as WebGLProgram;
  gl.attachShader(
    program,
    makeShader(
      gl.VERTEX_SHADER,
      `precision mediump float;
attribute vec2 aPosition;
varying vec2 vPosition;
void main() {
  vPosition = aPosition * 2.0;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`
    )
  );
  gl.attachShader(
    program,
    makeShader(
      gl.FRAGMENT_SHADER,
      `precision mediump float;
uniform vec2 c;
varying vec2 vPosition;
void main() {
  vec2 p = vPosition;
  float s = 1.0;
  for (int i = 0; i < 25; ++i) {
    p = vec2(p.x * p.x - p.y * p.y + c.x, 2.0 * p.x * p.y + c.y);
    s = min(s, 1.0 - step(4.0, dot(p, p)) + (float(i) + 2.0 - min(3.0,log(log(dot(p, p))) / log(2.0))) / 25.0);
  }
  gl_FragColor = mix(vec4(0.0, 0.0, 0.1, 0.9), vec4(0.0, 0.0, 1.0, 0.9), s);
}`
    )
  );
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  const loc = gl.getUniformLocation(program, "c");
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
  function animate(t = 0) {
    gl.viewport(0, 0, canvasRef.width, canvasRef.height);
    gl.uniform2f(
      loc,
      -0.8 + 0.6 * Math.sin(t / 5000),
      0.156 + 0.4 * Math.cos(t / 2000)
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (playAnimation) {
      animateRef = requestAnimationFrame(animate);
    }
  }
  playAnimation = true;
  animateRef = requestAnimationFrame(animate);
}

function resetCanvas() {
  playAnimation = false;
  cancelAnimationFrame(animateRef);
  window.removeEventListener("resize", canvasOnResize);
  canvasRef = {} as CanvasWebGLRef;
}

function canvasOnResize(): void {
  setCanvasDimensions(canvasRef);
}

function setCanvas(): void {
  if (
    !setCanvasWebGL(canvasRef, CANVAS_ID) ||
    !setCanvasDimensions(canvasRef)
  ) {
    return;
  }
  render();
  window.addEventListener("resize", canvasOnResize);
}

const JuliaCanvas = () => {
  return (
    <FractalCanvas
      canvasId={CANVAS_ID}
      onInit={setCanvas}
      onDestroy={resetCanvas}
    />
  );
};

export default JuliaCanvas;
