import { messageStore } from "$/utils/Stores.ts";
import {
    Badge,
    Box,
    Flex,
    Image,
    Popover,
    PopoverTrigger,
    Text,
    List,
    ListItem
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import PopOver from "../members/popover.tsx";
import { clientStore } from "@/utils/stores.ts";
import { useEffect, useState } from "react";

const getMessageColor = (state: "sending" | "sent" | "failed") => {
    if (state === "sending") return "gray";
    if (state === "sent") return "white";
    if (state === "failed") return "red";
};

interface User {
    globalNickname: string;
    avatar: string;
    presence: string;
    username: string;
    discriminator: string;
}

interface Message {
    user: User;
    content: string;
    time: Date;
    id: string;
    state: "sent" | "sending" | "failed";
    edited: boolean;
}

interface Chunk {
    user: User;
    time: Date;
    messages: Message[];
}

const messageChunker = (msgs: {
    user: {
        globalNickname: string;
        avatar: string;
        presence: string;
        username: string;
        discriminator: string;
    };
    content: string;
    time: Date;
    id: string;
    state: "sent" | "sending" | "failed";
    edited: boolean;
}[]): Chunk[] => {
    /*
     Messages go from a top to bottom, i.e top being oldest message and bottom being the newest
     we need to chunk messages. How this works is for example:
    
    * 8:00 AM User1: Hello
    * 8:02 AM User1: Hello 2
    * 8:04 AM User1: Hello 3
    
    These messages should be chunked into one message, the reason for this is simple, its the same user in a row, and the previous message was sent within 15 minutes of the next message

    heres an example of messages that should not be chunked:

    * 8:00 AM User1: Hello
    * 8:02 AM User2: Hello 2
    * 8:04 AM User1: Hello 3

    This is because the user changed, so we should not chunk these messages together

    this is another example of messages that should not be chunked:

    * 8:00 AM User1: Hello
    * 9:00 AM User1: Hello 2
     
    This is because the previous message was sent over 15 minutes ago, so we should not chunk these messages together

    */

    const chunkedMessages: Chunk[] = [];
    let currentChunk: Chunk | null = null;

    for (const msg of msgs) {
        if (!currentChunk ||
            currentChunk.user.username !== msg.user.username ||
            Math.abs(msg.time.getTime()! - currentChunk.time.getTime()) > 15 * 60 * 1000
        ) {
            currentChunk = {
                user: msg.user,
                time: msg.time,
                messages: [{
                    ...msg
                }]
            };
            chunkedMessages.push(currentChunk);
        } else {
            currentChunk.messages.push({
                ...msg
            });
        }
    }

    return chunkedMessages;
};

const Message = ({
    message
}: {
    message: {
        user: {
            globalNickname: string;
            avatar: string;
            presence: string;
            username: string;
            discriminator: string;
        };
        time: string;
        content: string;
        id: string;
        state: "sent" | "sending" | "failed";
        edited: boolean;
        chunked: boolean;
        hasMore: boolean;
    };
}) => {
    const [client] = useRecoilState(clientStore);
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            key={message.id}
            _hover={{
                bg: "rgba(0, 0, 0, 0.1)",
            }}
            mt={message.chunked ? 0 : 2}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Popover placement={"right"} >
                <Flex ml={5}
                    mt={message.chunked ? 0 : 1.5}
                >
                    {!message.chunked && (
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
                    )}
                    <Box ml="3" position={"relative"}>
                        {!message.chunked && (
                            <Text
                                cursor={"default"}
                            >
                                <PopoverTrigger>
                                    <Text
                                        cursor={"pointer"}
                                        display="inline"
                                        as={"span"}
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
                        )}
                        {message.chunked && hovered && (
                            <Box position="absolute" left="-5" top="0">
                                <Badge
                                    bg={"unset"}
                                    color={"inherit"}
                                    textTransform={"unset"}
                                    fontWeight={"unset"}
                                    ml="1"
                                    fontSize={"xx-small"}
                                    display={"inline"}
                                    userSelect={"none"}
                                >
                                    4:43 AM
                                </Badge>
                            </Box>
                        )}
                        <Text
                            fontSize="sm"
                            color={getMessageColor(message.state)}
                            transition={"color 0.2s"}
                            ml={message.chunked ? 8 : 0}
                            display={"inline"}
                            cursor={"text"}
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
                {!message.chunked && (
                    <PopOver user={client.members[0].user} member={client.members[0]} />
                )}
            </Popover>
        </Box>
    );
};

const GuildMessages = () => {
    const [rawMessages] = useRecoilState(messageStore);

    const [messages, setMessages] = useState<Chunk[]>([]);

    useEffect(() => {
        setMessages(messageChunker(rawMessages));
    }, [rawMessages]);

    return (
        <>
            <Box mb={2} maxHeight="calc(100vh - 100px)" overflowY="auto" ml={-2} mr={-2}>
                <List spacing={3}>
                    {messages.map((message, index) => {
                        return (
                            <ListItem key={index}>
                                {message.messages.map((msg, index) => {
                                    return (
                                        <Message
                                            message={{
                                                ...msg,
                                                user: message.user,
                                                time: `Today at ${msg.time.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                })}`,
                                                chunked: index !== 0,
                                                hasMore: index === 0 && message.messages.length > 1
                                            }}
                                            key={msg.id}
                                        />
                                    );
                                })}
                            </ListItem>
                        );
                    })}
                </List>
                <div id="bottom-chat" />
            </Box>
        </>
    );
};

export default GuildMessages;
