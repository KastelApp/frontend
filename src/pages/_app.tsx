import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import "@/styles/globals.css";
import SEO from "@/components/seo";
import theme from "@/utils/theme/index.tsx";
import Init from "@/components/init.tsx";
import { AppProps } from "next/app.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ErrorBoundary from "@/components/ErrorBoundary.tsx";
import useIsDevToolsOpen from "@/components/isDevToolsOpen.tsx";
import { useTokenStore } from "@/utils/stores.ts";
import { useSettingsStore } from "$/utils/Stores.ts";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const devtoolsOpen = useIsDevToolsOpen();
  const hydrated = useTokenStore((state) => state._hasHydrated);
  const { settings } = useSettingsStore();
  const [colorTheme, setColorTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (settings.theme === "system") {
      setColorTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    } else {
      setColorTheme(settings.theme);
    }
  }, [settings]);

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
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }

    setTimeout(() => setReady(true), 500); // 500ms delay to prevent flickering & so that we can well connect to the gateway in time (sometimes it fails to connect if we don't add an delay)
  }, [router]);

  useEffect(() => {
    const start = async () => {
      if (devtoolsOpen) {
        if (process.env.NODE_ENV === "development") return;

        for (let i = 0; i < 5; i++) {
          console.log(
            "%cStop! Before you continue!",
            "color: red; font-size: 50px; -webkit-text-stroke: 1px black; font-weight: bold"
          );
          console.log(
            "%cThis is a feature of the browser intended for Developers. If someone told you to paste something in here to enable a \"feature\" or to \"verify\" something, it's a scam! It'll give them access to your account.",
            "color: white; font-size: 20px;"
          );
          console.log(
            "%cIf you know what you are doing, come contribute to the project! %chttps://github.com/KastelApp",
            "color: white; font-size: 16px;",
            "color: blue; font-size: 16px;"
          );

          await new Promise((resolve) => setTimeout(resolve, 1250));
        }
      }
    };

    void start();
  }, [devtoolsOpen]);

  if (!hydrated) {
    return null;
  }


  return (
    <>
      <DefaultSeo {...SEO} />
      <ChakraProvider theme={theme}>
        <div className={colorTheme === "dark" ? "dark-scrollbar" : "light-scrollbar"}>
          <ErrorBoundary>
            {/* Fast forward the loading of the component, we only need to check anything else besides these (which shouldn't be much) */}
            {/* As long as the PUBLIC_DESKTOP_APP is set correctly, there should no longer be a flicker */}
            {/* TODO: Fix this */}
            {(!process.env.PUBLIC_DESKTOP_APP ||
              process.env.PUBLIC_DESKTOP_APP === "false" ||
              ["/login", "/register"].includes(router.pathname) ||
              router.pathname.startsWith("/app") ||
              ready) && (
                <>
                  {hydrated && (
                    <>
                      <Init />
                      <Component {...pageProps} />
                    </>
                  )}
                </>
              )}
          </ErrorBoundary>
        </div>
      </ChakraProvider>
    </>
  );
};

export default App;
