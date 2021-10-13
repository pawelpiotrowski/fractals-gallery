import { useEffect } from "react";
import { FractalCanvasProps } from "./canvas.interface";
import styles from "./Fractal.module.css";

const FractalCanvas = (props: FractalCanvasProps) => {
  useEffect(() => {
    // on init
    props.onInit();
    // on destroy
    return props.onDestroy;
  });
  return (
    <div
      className={`${styles.canvasFullScreen} ${
        props.canvasClass &&
        props.canvasClass.length &&
        props.canvasClass.length > 0 &&
        styles[props.canvasClass]
      }`}
    >
      <canvas id={props.canvasId}></canvas>
    </div>
  );
};

export default FractalCanvas;
