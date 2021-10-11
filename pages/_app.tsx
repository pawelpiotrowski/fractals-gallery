import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppLayout from "../components/layout/app-layout";

function FractalGalleryApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}
export default FractalGalleryApp;
