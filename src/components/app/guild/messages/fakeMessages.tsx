import React from "react";
import { Box, Flex, SkeletonCircle, SkeletonText, Text } from "@chakra-ui/react";

const SkeletonMessage = ({ chunked, messageWidth, noOfLines, usernameWidth }: { chunked: boolean, usernameWidth: number, noOfLines: number, messageWidth: number; }) => {
    return (
            <Box
                mt={chunked ? 0 : 2}
                position="relative"
            >
                <Flex ml={5} mt={chunked ? 0 : 1.5}>
                    {!chunked && (
                        <SkeletonCircle size="32px" />
                    )}
                    <Box ml={3} position={"relative"}>
                        {!chunked && (
                            <Text as="span">
                                <SkeletonText noOfLines={1} spacing={90} skeletonHeight={4} width={`calc(100vw - ${1600 - usernameWidth}px)`} />
                            </Text>
                        )}
                        <Text
                            fontSize="sm"
                            color="gray.500"
                            transition="color 0.2s"
                            ml={chunked ? 8 : 0}
                            display="inline-block"
                            cursor="auto"
                            wordBreak="break-word"
                            userSelect="text"
                            whiteSpace="normal"
                            overflow="hidden"
                            as="span"
                            mr={4}
                            mt={chunked ? 0 : 4}
                        >
                            <SkeletonText noOfLines={noOfLines} spacing={3} skeletonHeight={3} width={`calc(100vw - ${495 + messageWidth}px)`} />
                        </Text>
                    </Box>
                </Flex>
            </Box>
    );
};

export default SkeletonMessage;
