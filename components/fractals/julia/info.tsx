import FractalInfo from "../info";

const content = {
  title: "Julia Set",
  links: [
    "https://en.wikipedia.org/wiki/Julia_set",
    "https://www.reddit.com/r/javascript/comments/cbdjnd/coding_the_animated_julia_set_fractal_in_32_lines/",
    "https://jsfiddle.net/xrqd5fLe/",
  ],
};

const JuliaInfo = () => {
  return <FractalInfo title={content.title} links={content.links} />;
};

export default JuliaInfo;
