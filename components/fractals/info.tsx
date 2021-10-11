import styles from "./Fractal.module.css";

const FractalInfo = (props: any) => {
  const linkLables = ["Found here", "Source"];
  const links = (props.links || []).map((link: string, index: number) => {
    return (
      <li>
        <a href={link}>{linkLables[index] || link}</a>
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
