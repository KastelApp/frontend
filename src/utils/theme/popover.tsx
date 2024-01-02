import { popoverAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);
const baseStyle = definePartsStyle({
  body: {
    bg: "#e6e9ef",
    _dark: {
      bg: "#101319",
    },
  },
  content: {
    borderColor: "#e6e9ef",
    _dark: {
      borderColor: "#101319",
    },
  },
});
export const popoverTheme = defineMultiStyleConfig({ baseStyle });
