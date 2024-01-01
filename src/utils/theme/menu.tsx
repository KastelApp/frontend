import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  list: {
    border: "none",
    bg: "#e6e9ef",
    _dark: {
      bg: "#101319",
    },
  },
  item: {
    bg: "#e6e9ef",
    _dark: {
      bg: "#101319",
    },
    _hover: {
      bg: "#dde0e9",
      _dark: {
        bg: "#161922",
      },
    },
  },
});

export const menuTheme = defineMultiStyleConfig({ baseStyle });
