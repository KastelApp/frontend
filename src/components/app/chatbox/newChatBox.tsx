import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import User from "$/Client/Structures/User/User.ts";
import { useChannelStore, useMemberStore, useRoleStore, useUserStore } from "$/utils/Stores.ts";
import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { PreviewMarkdown } from "../markdown/index.tsx";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea.tsx";
import { getEmojiByUnicode, getEmojisThatMatchKeyword } from "../markdown/defaultEmojis.ts";

const NewChatBox = ({ setLength, setMentioning, handleKeyDown, setValue, value }: { setLength: (length: number) => void, setMentioning: (data: {
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
}) => void, handleKeyDown: (event?: React.KeyboardEvent<HTMLTextAreaElement>) => void, value: string, setValue: (value: string) => void }) => {
  const currentChannel = useChannelStore((s) => s.getCurrentChannel());
  const members = useMemberStore((s) => s.getCurrentMembers());
  const roles = useRoleStore((s) => s.getCurrentRoles());
  const channels = useChannelStore((s) => s.getCurrentChannels());
  const { users } = useUserStore();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [typing, setTyping] = useState<{
    lastTypedSent: number;
    startedTyping: number;
  }>({
    lastTypedSent: 0,
    startedTyping: 0
  });

  return (
    <Box pos="relative" w="full" h="unset">
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        pointerEvents="none"
        whiteSpace="pre-line"
        outline="none"
        fontSize="small"
      ><PreviewMarkdown>{value}</PreviewMarkdown></Box>
      <AutoResizeTextarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        placeholder={"Message #" + currentChannel?.name ?? ""}
        style={{
          width: "100%",
          background: "transparent",
          color: "transparent",
          zIndex: 1,
          caretColor: "blue",
          outline: "none",
          fontSize: "small",
          resize: "none",
          overflowY: "auto",
        }}
        maxRows={8}
        ref={textRef}
        onSelect={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          const words = value;
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
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
};

export default NewChatBox;