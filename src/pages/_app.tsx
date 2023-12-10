import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "next-seo";
import "@/styles/globals.css";
import SEO from "@/components/seo";
import theme from "@/utils/theme";
import Init from "../components/init.js";
import {AppProps} from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
      <>
        <RecoilRoot>
          <DefaultSeo {...SEO} />
          <ChakraProvider theme={theme}>
            <Init />
            <Component {...pageProps} />
          </ChakraProvider>
        </RecoilRoot>
      </>
  );
}

export default appWithTranslation(App);
