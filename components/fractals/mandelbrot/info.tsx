import FractalInfo from "../info";

const content = {
  title: "Mandelbrot Set",
  links: ["hello", "there", "credits"],
};

const MandelbrotInfo = () => {
  return <FractalInfo title={content.title} links={content.links} />;
};

export default MandelbrotInfo;
