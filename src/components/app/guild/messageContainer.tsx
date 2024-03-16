import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, ChatIcon, CloseIcon, } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import constants from "$/utils/constants.ts";
import Typing from "./messages/typing.tsx";
import { useChannelStore, useMemberStore, useMessageStateStore, useMessageStore, useRoleStore, useSettingsStore, useTypingStore, useUserStore } from "$/utils/Stores.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import TextBoxBanner from "./messageBanner.tsx";
import User from "$/Client/Structures/User/User.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import ChannelIcon from "./channels/channelIcon.tsx";
import Emoji from "../markdown/components/emoji.tsx";
import { usePresistantSettings } from "@/utils/stores.ts";
import NewChatBox from "../chatbox/newChatBox.tsx";
import ChatBox from "../chatbox/chatbox.tsx";
import { useRouter } from "next/router";
import PermissionHandler from "../../../wrapper/Client/Structures/BitFields/PermissionHandler.ts";

const GuildMessageContainer = ({ children }: { children?: React.ReactNode; }) => {
  const currentChannel = useChannelStore((s) => s.getCurrentChannel());
  const router = useRouter();
  const { guildId, channelId } = router.query as {
    guildId: string;
    channelId: string;
  };
  const { version, setVersion } = useMessageStore();
  const [length, setLength] = useState(0);
  const [shake, setShake] = useState(false);
  const channels = useChannelStore((s) => s.getCurrentChannels());
  const [mentioning, setMentioning] = useState<{
    isMenioning: boolean;
    searchingFor: string;
    members: {
      member: Member;
      user: User<boolean>;
    }[];
    roles: Role[];
    channels: BaseChannel[];
    emojis: {
      emoji: string;
      unicode: string;
    }[];
  }>({
    isMenioning: false,
    searchingFor: "",
    members: [],
    roles: [],
    channels: [],
    emojis: []
  });
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const { settings } = useSettingsStore();
  const [value, setValue] = useState("");
  const { typing } = useTypingStore();
  const { users } = useUserStore();
  const [usersTyping, setUsersTyping] = useState<{ user: User<boolean>, since: number; }[]>([]);
  const { state, messageId, setState, setMessageId } = useMessageStateStore();
  const { experiments: presSettings } = usePresistantSettings();
  const { messages } = useMessageStore();
  const { roles } = useRoleStore();
  const { members } = useMemberStore();
  // todo: check the permissions
  const [canSendMessages, setCanSendMessages] = useState(true);

  useEffect(() => {
    const ourChannel = typing[currentChannel?.id ?? ""];

    if (!ourChannel) {
      setUsersTyping([]);

      return;
    }

    if (ourChannel.length === 0) {
      setUsersTyping([]);

      return;
    }

    for (const user of ourChannel) {
      if (!users.find((u) => u.id === user.userId)) continue;

      if (usersTyping.find((u) => u.user.id === user.userId)) continue;

      if (users.find((u) => u.id === user.userId && u.isClient)) continue; // ? don't show that *we* are typing

      setUsersTyping((tpUsers) => {
        return [...tpUsers, { user: users.find((u) => u.id === user.userId)!, since: user.since }];
      });
    }

  }, [typing, router]);

  useEffect(() => {
    const clientUser = users.find((u) => u.isClient)!;
    const member = clientUser ? members.find((member) => member.userId === clientUser.id && member.guildId === guildId) : null;
    const memberRoles = member ? roles.filter((r) => member.roleIds.includes(r.id)) : [];
    const permissionHandler = new PermissionHandler(clientUser.id, member?.owner ?? false, memberRoles, channels);

    setCanSendMessages(permissionHandler.hasChannelPermission(channelId, ["SendMessages"]))
  }, [channelId])

  const sendMessage = async (message: string) => {
    setLength(0);

    if (!currentChannel?.isTextBased()) return;

    const chat = document.getElementById("bottom-chat");

    if (chat) {
      setTimeout(() => chat.scrollIntoView({ behavior: "instant" }), 50);
    }

    await currentChannel.sendMessage({ content: message, replyingTo: messageId ?? undefined });

    setVersion(version + 1);

    setMessageId(null);
    setState("idle");
  };

  const handleKeyDown = (event?: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!event) {
      const message = value ?? "";

      if (message.trim() === "") return;

      if (message.length > constants.settings.maxMessageSize) {
        setShake(true);

        setTimeout(() => setShake(false), 500);
        return;

      }

      sendMessage(message);

      setValue("");

      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const message = value ?? "";

      if (message.trim() === "") return;

      if (message.length > constants.settings.maxMessageSize) {
        setShake(true);

        setTimeout(() => setShake(false), 500);
        return;
      }

      sendMessage(message);

      setValue("");
    } else if (event.key === "b" && event.ctrlKey) {
      event.preventDefault();

      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);

      if (selected.startsWith("**") && selected.endsWith("**")) {
        setValue(textarea.value.substring(0, start) + selected.substring(2, selected.length - 2) + textarea.value.substring(end));
        textarea.setSelectionRange(start, end - 4);
      } else {
        setValue(textarea.value.substring(0, start) + `**${selected}**` + textarea.value.substring(end));
        textarea.setSelectionRange(start, end + 4);
      }
    }
  };

  const onUserRoleClick = (type: "user" | "role" | "channel" | "emoji", item: Role | User<boolean> | BaseChannel | { emoji: string; unicode: string; }) => {
    if (!textRef.current) return;

    const words = value;
    const splitWords = words.split(" ");
    const caretPosition = textRef.current.selectionStart;

    for (const word of splitWords) {
      const wordStart = words.indexOf(word);
      const wordend = wordStart + word.length;

      if (word.includes("@") && caretPosition > wordStart && caretPosition <= wordend) {
        const beforeCaret = words.substring(0, caretPosition);

        if (type === "role" && item instanceof Role) {
          if (item.id === item.guildId) {
            setValue(beforeCaret.substring(0, beforeCaret.lastIndexOf("@")) + "@everyone" + words.substring(caretPosition));

            textRef.current.setSelectionRange(caretPosition + 9, caretPosition + 9);
          } else {
            setValue(beforeCaret.substring(0, beforeCaret.lastIndexOf("@")) + `<&${item.id}>` + words.substring(caretPosition));

            textRef.current.setSelectionRange(caretPosition + 3 + item.id.length, caretPosition + 3 + item.id.length);
          }
        } else if (type === "user" && item instanceof User) {
          setValue(beforeCaret.substring(0, beforeCaret.lastIndexOf("@")) + `<@${item.id}>` + words.substring(caretPosition));

          textRef.current.setSelectionRange(caretPosition + 3 + item.id.length, caretPosition + 3 + item.id.length);
        }

      } else if (word.includes("#") && caretPosition > wordStart && caretPosition <= wordend) {
        const beforeCaret = words.substring(0, caretPosition);

        if (type === "channel" && item instanceof BaseChannel) {
          setValue(beforeCaret.substring(0, beforeCaret.lastIndexOf("#")) + `<#${item.id}>` + words.substring(caretPosition));

          textRef.current.setSelectionRange(caretPosition + 3 + item.id.length, caretPosition + 3 + item.id.length);
        }
      } else if (word.includes(":") && caretPosition > wordStart && caretPosition <= wordend) {
        const beforeCaret = words.substring(0, caretPosition);

        if (type === "emoji" && ("emoji" in item) && ("unicode" in item)) {
          setValue(beforeCaret.substring(0, beforeCaret.lastIndexOf(":")) + `:${item.emoji}:` + words.substring(caretPosition));

          textRef.current.setSelectionRange(caretPosition + 2 + item.emoji.length, caretPosition + 2 + item.emoji.length);
        }
      }

      textRef.current.focus();
    }

    setMentioning({
      isMenioning: false,
      searchingFor: "",
      members: [],
      roles: [],
      channels: [],
      emojis: []
    });
  };

  const replyTextBanner = useCallback((() => {
    const user = users.find((u) => u.id === messages.find((m) => m.id === messageId)?.authorId);
    const member = user ? members.find((member) => member.userId === user.id && member.guildId === guildId) : null;
    const memberRoles = member ? roles.filter((r) => member.roleIds.includes(r.id)) : [];
    const topRole = memberRoles.sort((a, b) => b.position - a.position).find((r) => r.color !== 0);

    return (
      <TextBoxBanner
        bg={"gray.800"}
        p={1}
        borderRadius="md"
        mb={2}
        cursor="pointer"
      >
        <Box>
          <Flex align={"center"}>
            <Text ml={2}>Replying to</Text>
            <Text ml={1} color={topRole?.hexColor ?? ""}>
              {member?.displayUsername ?? user?.displayUsername}
            </Text>
            <CloseIcon ml="auto" cursor={"pointer"} onClick={() => {
              setState("idle");
              setMessageId(null);
            }} />
          </Flex>
        </Box>

      </TextBoxBanner>
    );

  }), [state, messageId]);

  return (
    <Flex
      w={"full"}
      alignItems="center"
      pos="fixed"
      bottom={settings.navBarLocation === "left" ? "25" : "85"}
      px="3"
      maxW={settings.navBarLocation === "left" ? "calc(100% - 450px)" : "calc(100% - 400px)"}
      left={settings.navBarLocation === "left" ? "51.5%" : "50%"}
      transform="translateX(-50%)"
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setTimeout(() => {
          if (document.activeElement !== textRef.current) {
            setFocused(false);
          }
        }, 140);
      }}
    >
      <VStack spacing={0} align="stretch" width={"full"}>
        {mentioning.isMenioning && focused && (
          <TextBoxBanner
            bg={"gray.800"}
            p={1}
            borderRadius="md"
            mb={2}
            cursor="pointer"
          >
            {mentioning.members.map((member, i) => (
              <Flex
                key={i}
                justifyContent="space-between"
                alignItems="center"
                px={2}
                py={1}
                _hover={{ bg: "gray.700" }}
                _focus={{
                  bg: "gray.700",
                  boxShadow: "none",
                  outline: "none"
                }}
                tabIndex={i}
                onClick={() => {
                  onUserRoleClick("user", member.user);
                }}
              >
                <Flex alignItems="center">
                  <Avatar size="sm" src={member.user.getAvatarUrl({ size: 128 })} />
                  <Text ml={2}>{member.member.displayUsername}</Text>
                </Flex>
              </Flex>
            ))}
            {mentioning.roles.length > 0 && (
              <>
                <Divider />
                {mentioning.roles.map((role, i) => (
                  <Flex
                    key={i}
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1}
                    _hover={{ bg: "gray.700" }}
                    tabIndex={mentioning.members.length + i}
                    _focus={{
                      bg: "gray.700",
                      boxShadow: "none",
                      outline: "none"
                    }}
                    onClick={() => {
                      onUserRoleClick("role", role);
                    }}
                  >
                    <Flex alignItems="center">
                      <Text fontWeight={"600"} color={role.hexColor} fontSize={"md"}>@{role.name}</Text>
                    </Flex>
                  </Flex>
                ))}
              </>
            )}

            {mentioning.channels.length > 0 && (
              <>
                {mentioning.channels.map((channel, i) => (
                  <Flex
                    key={i}
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1}
                    _hover={{ bg: "gray.700" }}
                    tabIndex={mentioning.members.length + mentioning.roles.length + i}
                    _focus={{
                      bg: "gray.700",
                      boxShadow: "none",
                      outline: "none"
                    }}
                    onClick={() => {
                      onUserRoleClick("channel", channel);
                    }}
                  >
                    <Flex alignItems="center">
                      <ChannelIcon channel={channel} />
                      <Text ml={2}>{channel.name}</Text>
                    </Flex>
                    {channel.parentId && (
                      <Flex alignItems="center" justifyContent="flex-end">
                        <Text fontSize={"sm"}>{channels.find((c) => c.id === channel.parentId)?.name}</Text>
                      </Flex>
                    )}
                  </Flex>
                ))}
              </>
            )}
            {mentioning.emojis.length > 0 && (
              <>
                {mentioning.emojis.map((emoji, i) => (
                  <Flex
                    key={i}
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1}
                    _hover={{ bg: "gray.700" }}
                    tabIndex={mentioning.members.length + mentioning.roles.length + mentioning.channels.length + i}
                    _focus={{
                      bg: "gray.700",
                      boxShadow: "none",
                      outline: "none"
                    }}
                    onClick={() => {
                      onUserRoleClick("emoji", emoji);
                    }}
                  >
                    <Flex alignItems="center">
                      <Emoji emoji={emoji.emoji} />
                      <Text ml={2}>:{emoji.emoji}:</Text>
                    </Flex>
                  </Flex>
                ))}
              </>
            )}
          </TextBoxBanner>
        )}

        {state === "replying" && (
          <>{replyTextBanner()}</>
        )}

        {children}

        <InputGroup id="message-box" bg={useColorModeValue("gray.200", "gray.800")} rounded={10} style={shake ? {
          animation: "shake 0.5s",
          animationIterationCount: 0.5
        } : {}} mb={2}>
          {/* Add File Button*/}
          {canSendMessages && (
            <InputLeftAddon bg="transparent" border={0}>
              <Button w={"1rem"} h={"1.75rem"}>
                <AddIcon />
              </Button>
            </InputLeftAddon>
          )}

          {presSettings.newChatBox
            ? <NewChatBox setLength={setLength} setMentioning={setMentioning} handleKeyDown={handleKeyDown} setValue={setValue} value={value} />
            : <ChatBox setLength={setLength} setMentioning={setMentioning} handleKeyDown={handleKeyDown} setValue={setValue} value={value} disabled={!canSendMessages} />}

          {canSendMessages && (
            <InputRightAddon width="4rem" bg={"transparent"} border={0}>
              <Button h={"1.75rem"} w={"1.5rem"} onClick={() => handleKeyDown()}>
                <ChatIcon />
              </Button>
            </InputRightAddon>
          )}

          {length >= constants.settings.maxMessageSize * 0.65 && (
            <Box
              pos="absolute"
              bottom="0"
              right="0"
              fontSize="xs"
              color={length >= constants.settings.maxMessageSize * 0.9 ? "red.500" : length >= constants.settings.maxMessageSize * 0.85 ? "yellow.500" : "green.500"}
              pr="1"
            >
              {constants.settings.maxMessageSize - length}
            </Box>
          )}
        </InputGroup>
        <Box
          pos="absolute"
          bottom={-4}
          p={1}
          fontSize="xs"
          textAlign={"center"}
          fontWeight={"bold"}
        >
          {usersTyping.length > 0 && (
            <Flex alignItems="center">
              <Typing mr={2} />

              <Text>
                {usersTyping.map((user, i) => (
                  <Text key={i} as="span">
                    {user.user.displayUsername}
                    {i !== usersTyping.length - 1 ? ", " : ""}
                  </Text>
                ))}
                {usersTyping.length === 1 ? " is typing..." : " are typing..."}
              </Text>
            </Flex>
          )}
        </Box>
      </VStack>
    </Flex>
  );
};

export default GuildMessageContainer;
