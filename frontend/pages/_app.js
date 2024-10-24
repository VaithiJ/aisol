import "@/styles/globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-quad",
      duration: 1000,
    });
  }, []);
  return <Component {...pageProps} />;
}
