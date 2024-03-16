import { Box, BoxProps } from "@chakra-ui/react";

const TextBoxBanner = ({ children, onClick, ...props }: { children: React.ReactNode, onClick?: () => void; } & BoxProps) => (
    <Box
        onClick={onClick}
        {...props}
    >
        {children}
    </Box>
);

export default TextBoxBanner;