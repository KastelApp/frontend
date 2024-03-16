import { useMemo } from "react";
import { getEmojiBySlug } from "../defaultEmojis.ts";
import { Box, Flex, Image, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useSettingsStore } from "$/utils/Stores.ts";
import parse from "@/utils/emojiParser.ts";

const Emoji = (props: { emoji: string; }) => {
    const { isOpen, onClose, onToggle } = useDisclosure();
    const emojiFromProp = useMemo(() => getEmojiBySlug(props.emoji), [[props.emoji]]);
    const { settings } = useSettingsStore();

    if (!emojiFromProp) return <>:{props.emoji}:</>;


    // @ts-expect-error --- this is fine
    const parsed = parse(emojiFromProp.unicode, { style: settings.emojiPack });

    if (settings.emojiPack === "native" || !parsed) return <Text as="span" fontSize="24px">
        {emojiFromProp?.unicode}
    </Text>

    return (
        <Tooltip label={
            <Flex direction="row" align="center" justify="space-between">
                <Box
                    as="span"
                    display={"inline-block"}
                    verticalAlign={"middle"}
                    w={"32px"}
                    h={"32px"}
                    mr={2}
                    userSelect={"text"}
                >
                    <Image
                        alt={props.emoji}
                        src={parsed}
                        fallback={<>{emojiFromProp?.unicode}</>}
                    />
                </Box>
                <Box>
                    <Text fontSize="sm">:{emojiFromProp.emoji.slug}:</Text>
                    <Text fontSize="xs">This is a default emoji.<br /> You can use it anywhere!</Text>
                </Box>
            </Flex>
        } placement="top" bg={"gray.700"} color={"white"} rounded={"md"} isOpen={isOpen} onClose={onClose}>
            <Box
                as="span"
                display={"inline-block"}
                verticalAlign={"bottom"}
                w={"24px"}
                h={"24px"}
                cursor={"pointer"}
                onClick={onToggle}
                userSelect={"text"}
            >
                <Image
                    alt={props.emoji}
                    src={parsed}
                    userSelect={"text"}
                    objectFit={"contain"}
                    w={"full"}
                    h={"full"}
                    draggable={false}
                />
            </Box>
        </Tooltip>
    );

};

export default Emoji;
