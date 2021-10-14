import Head from "next/head";
import AppFooter from "./app-footer";
import AppTitle from "./app-header";
import styles from "./AppLayout.module.css";

export default function AppLayout({ children }: any) {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>pawelpiotrowski.dev</title>
          <meta name="description" content="Generated by create next app" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.header}>
            <AppTitle />
          </div>
          {children}
          <div className={styles.footer}>
            <AppFooter />
          </div>
        </main>
      </div>
    </>
  );
}
