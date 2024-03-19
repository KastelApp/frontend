import { Box, BoxProps } from "@chakra-ui/react";

const Typing = (props: BoxProps) => (
  <Box {...props}>
    <Box className="typingDot" />
    <Box className="typingDot" />
    <Box className="typingDot" />
  </Box>
);

export default Typing;
