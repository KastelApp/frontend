import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import "@/styles/globals.css";
import SEO from "@/components/seo";
import theme from "@/utils/theme/index.tsx";
import Init from "@/components/init.tsx";
import { AppProps } from "next/app.js";

const App = ({ Component, pageProps }: AppProps) => {
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
};

export default App;
