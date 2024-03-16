import { Box } from "@chakra-ui/react";

const Mention = ({
    children,
    mentionBg = "hsl(260, 64%, 45%, 0.3)", // #422973
    hoverBg = "#6741B4",
    noUnderline = false,
    ...props
}: {
    children: React.ReactNode;
    mentionBg?: string;
    hoverBg?: string;
    noUnderline?: boolean;
} & React.ComponentProps<typeof Box>) => {
    return (
        <Box
            display="inline-block"
            {...props}
        >
            <Box
                bg={mentionBg} 
                borderRadius={4}
                padding={"0 2px"}
                opacity={0.9}
                userSelect={"none"}
                cursor={"pointer"}
                _hover={{
                    bg: hoverBg,
                    textDecoration: !noUnderline ? "underline" : "none",
                    transition: "background-color 50ms ease-out",
                }}
                fontSize={"sm"}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Mention;