import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { modalTheme } from "./modal.tsx";
import { menuTheme } from "./menu.tsx";
import { popoverTheme } from "./popover.tsx";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  styles: {
    global: (props: Record<string, unknown>) => ({
      body: {
        bg: mode("#dde0e9", "#161922")(props),
        color: mode("#000b2e", "#d1dcff")(props),
      },
    }),
  },
  components: { Modal: modalTheme, Menu: menuTheme, Popover: popoverTheme },
});

export default theme;
