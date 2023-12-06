import { Head, Html, Main, NextScript } from "next/document";
import i18nextConfig from "../../next-i18next.config.js";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/utils/theme";

export default function Document(props) {
  const currentLocale =
    props.__NEXT_DATA__.query.locale || i18nextConfig.i18n.defaultLocale;

  return (
    <Html lang={currentLocale}>
      <Head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
