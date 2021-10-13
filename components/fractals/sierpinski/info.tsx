import FractalInfo from "../info";

const content = {
  title: "Sierpinski Triangle",
  links: [
    "https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle",
    "https://xtrp.io/blog/2020/11/20/generating-the-sierpinski-triangle-in-vanilla-javascript-with-html5-canvas/",
    "https://github.com/xtrp/sierpinski",
  ],
};

const SierpinskiInfo = () => {
  return <FractalInfo title={content.title} links={content.links} />;
};

export default SierpinskiInfo;
