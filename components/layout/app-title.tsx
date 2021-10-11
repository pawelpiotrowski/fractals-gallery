import Link from "next/link";
import styles from "./AppLayout.module.css";

export const AppTitle = () => {
  return (
    <>
      <h1 className={styles.header__title}>JS Fractals Gallery</h1>
      <nav className={styles.header__nav}>
        <Link href="/">
          <a>Mandelbrot</a>
        </Link>
        <Link href="/julia">
          <a>Julia</a>
        </Link>
      </nav>
    </>
  );
};

export default AppTitle;
