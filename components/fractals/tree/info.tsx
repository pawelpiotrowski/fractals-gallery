import FractalInfo from "../info";

const content = {
  title: "Tree (Canopy)",
  links: [
    "https://en.wikipedia.org/wiki/Fractal_canopy",
    "https://lautarolobo.xyz/blog/use-javascript-and-html5-to-code-a-fractal-tree/",
  ],
};

const TreeInfo = () => {
  return <FractalInfo title={content.title} links={content.links} />;
};

export default TreeInfo;
