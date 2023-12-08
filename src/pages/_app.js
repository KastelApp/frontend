import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import "@/styles/globals.css";
import SEO from "@/components/seo";
import theme from "@/utils/theme";
import Init from "../components/init.js";

function App({ Component, pageProps }) {
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

export default App;
