import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";

function FractalGalleryApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
export default FractalGalleryApp;
