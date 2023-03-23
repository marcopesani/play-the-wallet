import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { VT323 } from "next/font/google";
const vt323 = VT323({ weight: "400", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${vt323.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
