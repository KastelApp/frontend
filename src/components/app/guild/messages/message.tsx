import {
    Avatar,
    Badge,
    Box,
    Flex,
    Icon,
    IconButton,
    Image,
    Text,
    Tooltip,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ModelData, clickHandler } from "../../markdown/components/mentions/mentionData.tsx";
import Member from "$/Client/Structures/Guild/Member.ts";
import UserStruct from "$/Client/Structures/User/User.ts";
import MessageType from "$/Client/Structures/Message.ts";
import getMessageColor from "@/utils/messageColor.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import { Markdown } from "@/components/app/markdown/index.tsx";
import { ChatIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea.tsx";
import { useMessageStateStore } from "$/utils/Stores.ts";
import { HiOutlineReply } from "react-icons/hi";

const Message = ({
    message,
    modelData,
    setData,
    chunked,
    member,
    user,
    topRole,
    replyMessage,
    clientUser,
    clientMember,
}: {
    message: MessageType;
    chunked: boolean;
    hasMore: boolean;
    member?: Member;
    user: UserStruct<boolean>;
    modelData: ModelData;
    topRole?: Role;
    setData: (data: { type: "user"; user: UserStruct<boolean>; member?: Member; }) => void;
    replyMessage: {
        message: MessageType | null;
        user: UserStruct<boolean> | null;
        member: Member | null;
        topRole: Role | null;
    } | null;
    clientUser: UserStruct<true>;
    clientMember: Member;
}) => {
    const [hovered, setHovered] = useState(false);
    const { setPos, onToggle, setPlacement } = modelData;
    const bg = useColorModeValue("gray.400", "gray.700");
    const { messageId, setMessageId, state, setState } = useMessageStateStore();
    const inputBg = useColorModeValue("gray.200", "gray.800");
    const inputColor = useColorModeValue("gray.900", "gray.100");
    const placeholderColor = useColorModeValue("gray.400", "gray.400");
    const shouldBeMentioned = message.mentions.users.includes(clientUser.id) || clientMember.roleIds.some((id) => message.mentions.roles.includes(id));

    return (
        <Box
            key={message.id}
            bg={shouldBeMentioned ? "hsl( 40 86.4% 56.9% / 0.1)" : "unset"}
            _hover={{
                bg: shouldBeMentioned ? "hsl(40, 86%, 57%, 0.05)" : "rgba(0, 0, 0, 0.1)",
            }}
            mt={chunked ? 0 : 2}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            position="relative"
        >
            {message.replyingTo && (
                <Flex align="center" justifyContent="flex-start" ml={8} p={1} borderRadius="md" w={"full"} maxW={"calc(100vw - 500px)"} cursor={"pointer"}>
                    <Icon as={HiOutlineReply} w={4} h={4} color="gray.500" transform="scaleX(-1)" aria-label="Reply to message" />
                    {replyMessage ? (
                        <Avatar height={4} width={4} ml={2} src={replyMessage.user?.getAvatarUrl({ size: 128 })} />
                    ) : (
                        <Box height={4} width={4} ml={2} bg="gray.500" borderRadius="full" />
                    )}
                    {replyMessage && <Text ml={2} fontSize="xs" color={topRole?.hexColor ?? ""}>{replyMessage.member?.displayUsername}</Text>}
                    <Text fontSize="xs" ml={2} color={getMessageColor(replyMessage?.message?.state ?? "sent")} maxW={"calc(100vw - 500px)"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
                        {replyMessage?.message?.content ?? "Original message was deleted"}
                    </Text>
                </Flex>
            )}
            <Flex ml={5} mt={chunked ? 0 : 1.5} maxW={"100%"}>
                {!chunked && (
                    <Image
                        draggable={"false"}
                        borderRadius={"full"}
                        src={user.getAvatarUrl({ size: 128 })}
                        alt={user?.username || "loading"}
                        fit="cover"
                        boxSize={"32px"}
                        cursor={"pointer"}
                        mt={1.5}
                        userSelect={"none"}
                        onClick={(e) => {
                            setData({ type: "user", member, user });

                            clickHandler({ setPos, onToggle, setPlacement })(e);
                        }}
                    />
                )}
                <Box ml="3" position={"relative"}>
                    {!chunked && (
                        <Text
                            cursor={"default"}
                        >
                            <Text
                                cursor={"pointer"}
                                display="inline"
                                as={"span"}
                                onClick={(e) => {
                                    setData({ type: "user", member, user });

                                    clickHandler({ setPos, onToggle, setPlacement })(e);
                                }}
                                color={topRole ? topRole.hexColor : ""}
                            >{user!.username}</Text>
                            <Tooltip label={message.creationDate.toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })} placement="top" bg={bg} color={"white"} rounded={"md"}>
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
                            </Tooltip>
                        </Text>
                    )}
                    {chunked && hovered && (
                        <Box position="absolute" left="-5" top="0">
                            <Tooltip label={message.creationDate.toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })} placement="top" bg={bg} color={"white"} rounded={"md"}>
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
                                    {message.creationDate.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </Badge>
                            </Tooltip>
                        </Box>
                    )}
                    <Box
                        fontSize="sm"
                        color={getMessageColor(message.state)}
                        transition={"color 0.2s"}
                        ml={chunked ? 8 : 0}
                        display={"inline-block"}
                        cursor={"auto"}
                        wordBreak={"break-word"}
                        userSelect={"text"}
                        whiteSpace={"pre-line"}
                        overflow={"hidden"}
                        mr={4}
                    >
                        {messageId === message.id && state === "editing" ? (
                            <>
                                <VStack spacing={2} align="start">
                                    <AutoResizeTextarea
                                        data-gramm_editor="false"
                                        resize="none"
                                        bg={inputBg}
                                        border={0}
                                        color={inputColor}
                                        _placeholder={{
                                            color: placeholderColor,
                                        }}
                                        overflowY="auto"
                                        defaultValue={message.content}
                                        maxW={"calc(100vw - 480px)"}
                                        w="calc(100vw - 480px)"
                                        maxRows={10}
                                        mt={2}
                                        _focus={{ boxShadow: "none" }}
                                        rounded={"md"}
                                        fontSize={"sm"}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                            // if its escape, exit
                                            if (e.key === "Escape") {
                                                setMessageId(null);
                                                setState("idle");
                                            }
                                        }}
                                    />
                                    <Text
                                        fontSize={"xx-small"}
                                        color={"gray.400"}
                                        transition={"color 0.2s"}
                                        display={"inline"}
                                        as={"span"}
                                        cursor={"default"}
                                        userSelect={"none"}
                                    >
                                        Editing message, press enter to save
                                    </Text>
                                </VStack>
                            </>
                        ) : (<>
                            <Markdown>{message.content}</Markdown>
                            {message.edited && (
                                <>
                                    <Tooltip
                                        label={message.editedDate!.toLocaleString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        })} placement="top" bg={bg} color={"white"} rounded={"md"}>
                                        <Text
                                            fontSize="x-small"
                                            color={"gray.500"}
                                            transition={"color 0.2s"}
                                            display={"inline"}
                                            as={"span"}
                                            cursor={"default"}
                                            userSelect={"none"}
                                        >{" (edited)"}</Text>
                                    </Tooltip>
                                </>
                            )}
                        </>)}
                    </Box>
                </Box>
            </Flex>
            {hovered && !(messageId === message.id && state === "editing") && (
                <Box position="absolute" top="-25" right="0" zIndex={10} bg={bg}>
                    <Tooltip label="Reply to this message" placement="top" bg="gray.700" color="white">
                        <IconButton
                            aria-label="Reply"
                            icon={<ChatIcon />}
                            onClick={() => {
                                setMessageId(message.id);
                                setState("replying");
                            }}
                            mr={2}
                            size="xs"
                        />
                    </Tooltip>
                    {user.isClient && (
                        <Tooltip label="Edit this message" placement="top" bg="gray.700" color="white">
                            <IconButton
                                aria-label="Edit"
                                icon={<EditIcon />}
                                onClick={() => {
                                    setMessageId(message.id);
                                    setState("editing");
                                }}
                                mr={2}
                                size="xs"
                            />
                        </Tooltip>
                    )}
                    <Tooltip label="Delete this message" placement="top" bg="gray.700" color="white">
                        <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            onClick={async () => {

                            }}
                            size="xs"
                        />
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};

export default Message;