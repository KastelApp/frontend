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
