import { messageStore } from "$/utils/Stores.ts";
import {
    Badge,
    Box,
    Flex,
    Image,
    Popover,
    PopoverTrigger,
    Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import PopOver from "../members/popover.tsx";
import { clientStore } from "@/utils/stores.ts";

const getMessageColor = (state: "sending" | "sent" | "failed") => {
    if (state === "sending") return "gray";
    if (state === "sent") return "white";
    if (state === "failed") return "red";
};

const GuildMessages = () => {
    const [messages] = useRecoilState(messageStore);
    const [client] = useRecoilState(clientStore);

    return (
        <>
            <Box mb={2} maxHeight="calc(100vh - 100px)" overflowY="auto" ml={-2} mr={-2}>
                {messages.map((message) => (
                    <Box
                        key={message.id}
                        _hover={{
                            bg: "rgba(0, 0, 0, 0.1)",
                        }}
                        mt={2}
                    >
                        <Popover placement={"right"} >
                            <Flex ml={5} py="1.5">
                                <PopoverTrigger>
                                    <Image
                                        draggable={"false"}
                                        borderRadius={"full"}
                                        src={"/icon-1.png"}
                                        alt={message?.user?.username || "loading"}
                                        fit="cover"
                                        boxSize={"32px"}
                                        cursor={"pointer"}
                                        mt={1.5}
                                        userSelect={"none"}
                                    />
                                </PopoverTrigger>
                                <Box ml="3">
                                    <Text
                                        cursor={"default"}
                                    >
                                        <PopoverTrigger>
                                            <Text
                                                cursor={"pointer"}
                                                display="inline"
                                            >{message.user.username}</Text>
                                        </PopoverTrigger>
                                        <Badge
                                            bg={"unset"}
                                            color={"inherit"}
                                            textTransform={"unset"}
                                            fontWeight={"unset"}
                                            ml="1"
                                            fontSize={"xx-small"}
                                        >
                                            {message.time}
                                        </Badge>
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        color={getMessageColor(message.state)}
                                        transition={"color 0.2s"}
                                    >{message.content} <Text
                                        fontSize="x-small"
                                        color={"gray.500"}
                                        transition={"color 0.2s"}
                                        display={"inline"}
                                        as={"span"}
                                        cursor={"default"}
                                        userSelect={"none"}
                                    >{message.edited ? "(edited)" : ""}</Text></Text>
                                </Box>
                            </Flex>
                            <PopOver user={client.members[0].user} member={client.members[0]} />
                        </Popover>
                    </Box>
                ))}
                <div id="bottom-chat" />
            </Box>
        </>
    );
};

export default GuildMessages;
