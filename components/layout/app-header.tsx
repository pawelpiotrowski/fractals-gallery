import Link from "next/link";
import styles from "./AppLayout.module.css";

export const AppHeader = () => {
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
        <Link href="/sierpinski">
          <a>Sierpinski</a>
        </Link>
      </nav>
    </>
  );
};

export default AppHeader;
