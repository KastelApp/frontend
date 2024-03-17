import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import User from "$/Client/Structures/User/User.ts";
import { useChannelStore, useMemberStore, useRoleStore, useUserStore } from "$/utils/Stores.ts";
import constants from "$/utils/constants.ts";
import { useState } from "react";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea.tsx";
import { getEmojiByUnicode, getEmojisThatMatchKeyword } from "../markdown/defaultEmojis.ts";
import { useColorModeValue } from "@chakra-ui/react";

const ChatBox = ({ setLength, setMentioning, handleKeyDown, setValue, value, disabled }: { setLength: (length: number) => void, setMentioning: (data: {
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
  }) => void, handleKeyDown: (event?: React.KeyboardEvent<HTMLTextAreaElement>) => void, value: string, setValue: (value: string) => void, disabled: boolean }) => {
  
    const { getCurrentChannel } = useChannelStore();
    const currentChannel = getCurrentChannel();
    const { getCurrentMembers } = useMemberStore();
    const members = getCurrentMembers();
    const { getCurrentRoles } = useRoleStore();
    const roles = getCurrentRoles();
    const { getCurrentChannels } = useChannelStore();
    const channels = getCurrentChannels();
    const { users } = useUserStore();
    const [typing, setTyping] = useState<{
      lastTypedSent: number;
      startedTyping: number;
    }>({
      lastTypedSent: 0,
      startedTyping: 0
    });
  
    return <AutoResizeTextarea
        value={value}
        data-gramm_editor="false"
        resize="none"
        bg={useColorModeValue("gray.200", "gray.800")}
        border={0}
        color={useColorModeValue("gray.900", "gray.100")}
        _placeholder={{
            color: useColorModeValue("gray.400", "gray.400"),
        }}
        placeholder={disabled ? "You can't send messages in this channel" : "Message #" + currentChannel?.name ?? ""}
        onKeyDown={handleKeyDown}
        _focus={{ boxShadow: "none" }}
        maxRows={8} // todo: this should be configurable by the user
        maxLength={constants.settings.maxMessageSize + 6000}
        overflowY="auto"
        isDisabled={disabled}
        disabled={disabled}
        onSelect={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const words = event.target.value;
            const splitWords = words.split(" ");
            const caretPosition = event.target.selectionStart;

            for (let i = 0; i < splitWords.length; i++) {
                const word = splitWords[i];
                const wordStart = words.split(" ", i).join(" ").length + 1;
                const wordEnd = wordStart + word.length;

                if (word.includes("@") && caretPosition >= wordStart && caretPosition <= wordEnd) {
                    const beforeCaret = words.substring(0, caretPosition);

                    const mappedMembers = members.map((member) => ({
                        member,
                        user: users.find((u) => u.id === member.userId)!
                    }));

                    setMentioning({
                        isMenioning: true,
                        searchingFor: beforeCaret.substring(beforeCaret.lastIndexOf("@") + 1),
                        members: mappedMembers.filter((member) => member.user.username.toLowerCase().includes(beforeCaret.substring(beforeCaret.lastIndexOf("@") + 1).toLowerCase())),
                        roles: roles.filter((role) => role.name.toLowerCase().includes(beforeCaret.substring(beforeCaret.lastIndexOf("@") + 1).toLowerCase())),
                        channels: [],
                        emojis: []
                    });

                    break;
                } else if (word.includes("#") && caretPosition >= wordStart && caretPosition <= wordEnd) {
                    const beforeCaret = words.substring(0, caretPosition);

                    setMentioning({
                        isMenioning: true,
                        searchingFor: beforeCaret.substring(beforeCaret.lastIndexOf("#") + 1),
                        members: [],
                        roles: [],
                        channels: channels.filter((channel) => channel.name.toLowerCase().includes(beforeCaret.substring(beforeCaret.lastIndexOf("#") + 1).toLowerCase()) && !channel.isCategory()),
                        emojis: []
                    });

                    break;
                } else if (word.includes(":") && caretPosition >= wordStart && caretPosition <= wordEnd) {
                    const beforeCaret = words.substring(0, caretPosition);

                    const emojis = getEmojisThatMatchKeyword(beforeCaret.substring(beforeCaret.lastIndexOf(":") + 1), 1, 10);

                    setMentioning({
                        isMenioning: true,
                        searchingFor: beforeCaret.substring(beforeCaret.lastIndexOf(":") + 1),
                        members: [],
                        roles: [],
                        channels: [],
                        emojis: emojis.map((emoji) => ({
                            emoji: getEmojiByUnicode(emoji.emoji)?.emoji.slug ?? "",
                            unicode: emoji.emoji
                        }))
                    });

                    break;
                }

                else {
                    setMentioning({
                        isMenioning: false,
                        searchingFor: "",
                        members: [],
                        roles: [],
                        channels: [],
                        emojis: []
                    });
                }
            }
        }}
        onInput={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLength(event.currentTarget.value.length);
            setValue(event.currentTarget.value);

            if (event.currentTarget.value.length > 0) {
                if (Date.now() - typing.lastTypedSent > 10000 && typing.startedTyping > 0 && Date.now() - typing.startedTyping > 3000) {
                    setTyping({
                        lastTypedSent: Date.now(),
                        startedTyping: 0
                    });

                    if (currentChannel?.isTextBased()) currentChannel.sendTyping();

                    return;
                }

                if (typing.startedTyping === 0) {
                    setTyping((old) => {
                        return {
                            ...old,
                            startedTyping: Date.now()
                        };
                    });
                }
            }
        }}
    />
};

export default ChatBox;