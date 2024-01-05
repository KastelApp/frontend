import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";
import theme from "@/utils/theme";

const Document = () => {
  return (
    <Html lang={"en"}>
      <Head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
