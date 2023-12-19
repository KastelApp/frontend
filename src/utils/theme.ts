import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const dark = definePartsStyle({
  overlay: {
    bg: "#161922", //change the background
  },
  dialog: {
    bg: "#161922",
  },
});

export const modalTheme = defineMultiStyleConfig({
  variants: { dark },
});

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  styles: {
    global: (props: Record<string, unknown>) => ({
      body: {
        bg: mode("gray.50", "#161922")(props),
      },
    }),
  },
  components: { Modal: modalTheme },
});

export default theme;
