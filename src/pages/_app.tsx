import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import "@/styles/globals.css";
import SEO from "@/components/seo";
import theme from "@/utils/theme/index.tsx";
import Init from "@/components/init.tsx";
import { AppProps } from "next/app.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RecoilNexus from "recoil-nexus";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // @ts-expect-error -- this is fine.
    if (!window.__TAURI__) {
      // not desktop
      setReady(true);
      return;
    }

    const token = localStorage.getItem("token");

    if (
      ["/login", "/register"].includes(router.pathname) ||
      router.pathname.startsWith("/app")
    ) {
      // already bypassed
      return;
    }

    if (token) {
      router.push("/app");
    } else {
      router.push("/login");
    }

    setTimeout(() => setReady(true), 500); // 500ms delay to prevent flickering & so that we can well connect to the gateway in time (sometimes it fails to connect if we don't add an delay)
  }, [router]);

  return (
    <>
      <RecoilRoot>
        <RecoilNexus />
        <DefaultSeo {...SEO} />
        <ChakraProvider theme={theme}>
          {/* Fast forward the loading of the component, we only need to check anything else besides these (which shouldn't be much) */}
          {/* As long as the PUBLIC_DESKTOP_APP is set correctly, there should no longer be a flicker */}
          {(!process.env.PUBLIC_DESKTOP_APP ||
            process.env.PUBLIC_DESKTOP_APP === "false" ||
            ["/login", "/register"].includes(router.pathname) ||
            router.pathname.startsWith("/app") ||
            ready) && (
              <>
                <Init />
                <Component {...pageProps} />
              </>
            )}
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
};

export default App;
