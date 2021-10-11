import Head from "next/head";
import styles from "./Layout.module.css";

export default function Layout({ children }: any) {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>pawelpiotrowski.dev</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div>HEADER</div>
          <div>{children}</div>
          <div>FOOTER</div>
        </main>
      </div>
    </>
  );
}
