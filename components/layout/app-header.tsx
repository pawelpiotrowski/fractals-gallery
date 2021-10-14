import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./AppLayout.module.css";

export const AppHeader = () => {
  const router = useRouter();
  const routes = ["/", "/julia", "/sierpinski", "/tree"];
  const lastRoute = routes[routes.length - 1];
  const firstRoute = routes[0];
  const [nextUrl, setNextUrl] = useState(firstRoute);

  useEffect(() => {
    const currentRoute = router.asPath;
    const currentRouteIndex = routes.indexOf(currentRoute);
    const nextRoute =
      currentRoute === lastRoute || currentRouteIndex === -1
        ? firstRoute
        : routes[currentRouteIndex + 1];

    setNextUrl(nextRoute);
  }, [router.asPath]);

  return (
    <>
      <h1 className={styles.header__title}>JS Fractals Gallery</h1>
      <nav className={styles.header__nav}>
        <Link href={nextUrl}>
          <a>
            Next <i>➜</i>
          </a>
        </Link>
      </nav>
    </>
  );
};

export default AppHeader;
