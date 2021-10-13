import FractalInfo from "../info";

const content = {
  title: "Mandelbrot Set",
  links: [
    "https://en.wikipedia.org/wiki/Mandelbrot_set",
    "https://csl.name/post/mandelbrot-rendering/",
    "https://github.com/cslarsen/mandelbrot-js",
  ],
};

const MandelbrotInfo = () => {
  return <FractalInfo title={content.title} links={content.links} />;
};

export default MandelbrotInfo;
