import { ChakraProvider } from '@chakra-ui/react'
import { appWithTranslation } from 'next-i18next'
import {DefaultSeo} from "next-seo";
import '@/styles/globals.css'
import SEO from "@/components/seo";
import theme from "@/utils/theme";

function App({ Component, pageProps }) {
  return (
      <>
          <DefaultSeo {...SEO}/>
          <ChakraProvider theme={theme}>
              <Component {...pageProps} />
          </ChakraProvider>
      </>
  )
}

export default appWithTranslation(App)