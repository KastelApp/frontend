import {
  useChannelStore,
  useMemberStore,
  useRoleStore,
  useSettingsStore,
  useUserStore,
} from "$/utils/Stores.ts";
import { Box, Flex, Text } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import { ModelData } from "../../markdown/components/mentions/mentionData.tsx";
import Member from "$/Client/Structures/Guild/Member.ts";
import UserStruct from "$/Client/Structures/User/User.ts";
import { Chunk } from "@/utils/chunker.ts";
import Message from "./message.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageType from "$/Client/Structures/Message.ts";
import ChannelIcon from "../channels/channelIcon.tsx";
import SkeletonMessage from "./fakeMessages.tsx";

const generateSkeleton = (length = 50) => {
  const messages: {
    chunked: boolean;
    usernameWidth: number;
    messageWidth: number;
    noOfLines: number;
  }[] = [];

  for (let i = 0; i < length; i++) {
    let chunked = false;

    const lastFourChunked = messages
      .slice(Math.max(0, i - 4), i)
      .filter((msg) => msg.chunked).length;

    if (lastFourChunked < 3) {
      if (i !== 0) {
        const lastMessage = messages[i - 1];
        chunked = lastMessage.chunked
          ? Math.random() > 0.15
          : Math.random() > 0.35;
      }
    }

    const usernameWidth = Math.floor(Math.random() * 200) - 250;
    const messageWidth = chunked
      ? Math.floor(Math.random() * 800) + 600
      : Math.floor(Math.random() * 700) + 600;

    messages.push({
      chunked,
      usernameWidth,
      messageWidth,
      noOfLines: 1,
    });
  }

  return messages;
};

const GuildMessages = ({
  chunks,
  modelData,
  ready,
  setData,
  next,
  hasMore,
  fullMessages,
}: {
  chunks: Chunk[];
  ready: boolean;
  modelData: ModelData;
  setData: (data: {
    type: "user";
    user: UserStruct<boolean>;
    member?: Member;
  }) => void;
  next: () => void;
  hasMore: boolean;
  fullMessages: MessageType[];
}) => {
  const { getCurrentMembers } = useMemberStore();
  const members = getCurrentMembers();
  const { users, getCurrentUser } = useUserStore();
  const { getCurrentRoles } = useRoleStore();
  const roles = getCurrentRoles();
  const { getCurrentChannel } = useChannelStore();
  const { settings } = useSettingsStore();
  const fakeMessages = useMemo(() => generateSkeleton(50), []);
  const currentUser = getCurrentUser();

  const msg = useCallback(
    (message: MessageType, index: number, idx: number) => {
      const member = members.find((m) => m.userId === message.authorId);
      const memberRoles = roles.filter((r) => member?.roleIds.includes(r.id));
      const topRole = memberRoles
        .sort((a, b) => b.position - a.position)
        .find((r) => r.color !== 0);
      const replyMessage = message.replyingTo
        ? fullMessages.find((msg) => msg.id === message.replyingTo) ?? null
        : null;
      const clientMember = members.find((m) => m.userId === currentUser?.id)!;

      return (
        <Message
          message={message}
          chunked={idx !== 0}
          hasMore={chunks.length !== index + 1}
          key={message.id}
          modelData={modelData}
          setData={setData}
          member={member}
          user={users.find((u) => u.id === message.authorId)!}
          topRole={topRole}
          replyMessage={
            replyMessage
              ? {
                  message: replyMessage,
                  user:
                    users.find((u) => u.id === replyMessage?.authorId) ?? null,
                  member:
                    members.find((m) => m.userId === replyMessage?.authorId) ??
                    null,
                  topRole:
                    roles.find((r) => r.id === replyMessage?.authorId) ?? null,
                }
              : null
          }
          clientUser={currentUser!}
          clientMember={clientMember}
        />
      );
    },
    [members, users, roles, fullMessages],
  );

  const msgChunks = useCallback(
    (message: Chunk, index: number) => (
      <Box key={index}>
        {message.messages.map((m, idx) => msg(m, index, idx))}
      </Box>
    ),
    [fullMessages],
  );

  const Skeleton = memo(() => {
    return (
      <Box>
        {fakeMessages.map((message, index) => (
          <SkeletonMessage
            chunked={message.chunked}
            usernameWidth={message.usernameWidth}
            messageWidth={message.messageWidth}
            noOfLines={message.noOfLines}
            key={index}
          />
        ))}
      </Box>
    );
  });

  return (
    <Box
      id="scrollableDiv"
      overflow={"auto"}
      display={"flex"}
      flexDir={"column-reverse"}
      h={
        settings.navBarLocation === "left"
          ? "calc(100vh - 125px)"
          : "calc(100vh - 185px)"
      }
    >
      <InfiniteScroll
        dataLength={chunks.reduce((acc, curr) => acc + curr.messages.length, 0)}
        next={next}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        inverse={true}
        hasMore={hasMore}
        endMessage={
          <Box mb={4} mr={16} ml={4}>
            <Flex>
              <Box
                display={"flex"}
                alignItems={"center"}
                bg={"gray.600"}
                p={2}
                borderRadius={9999}
              >
                <ChannelIcon
                  channel={getCurrentChannel()!}
                  svg={{
                    width: 32,
                    height: 32,
                  }}
                />
              </Box>
            </Flex>
            <Text fontSize="xl" fontWeight="bold">
              Welcome to the #{getCurrentChannel()?.name} channel
            </Text>
            <Text fontSize="md">This is the beginning of the channel.</Text>
          </Box>
        }
        loader={<></>}
        scrollableTarget="scrollableDiv"
      >
        {ready ? (
          chunks.map((message, index) => msgChunks(message, index))
        ) : (
          <Skeleton />
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default GuildMessages;
