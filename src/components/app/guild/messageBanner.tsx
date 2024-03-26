import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

const TextBoxBanner = ({
  children,
  onClick,
  ...props
}: { children: ReactNode; onClick?: () => void } & BoxProps) => (
  <Box onClick={onClick} {...props}>
    {children}
  </Box>
);

export default TextBoxBanner;
