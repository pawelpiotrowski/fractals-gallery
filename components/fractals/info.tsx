import { FractalInfoProps } from "./canvas.interface";
import styles from "./Fractal.module.css";

const isLink = (str: string): boolean => str.startsWith("http");

const FractalInfo = (props: FractalInfoProps) => {
  const linkLables = ["Wiki", "Found here", "Source"];
  const links = (props.links || []).map((link: string, index: number) => {
    return (
      <li key={link}>
        {isLink(link) ? (
          <a href={link}>{linkLables[index] || link}</a>
        ) : (
          <span>{link}</span>
        )}
      </li>
    );
  });
  return (
    <article className={styles.info}>
      <h1 className={styles.info__title}>{props.title}</h1>
      {links.length > 0 && <ul className={styles.info__list}>{links}</ul>}
    </article>
  );
};

export default FractalInfo;
