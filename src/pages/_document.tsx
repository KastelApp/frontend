import { ColorModeScript, theme } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";

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
