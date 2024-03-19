import {
  Box,
  Flex,
  Popover,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import UserPopOver from "@/components/app/guild/members/popover.tsx";
import GuildMessageContainer from "@/components/app/guild/messageContainer.tsx";
import TextBoxBanner from "@/components/app/guild/messageBanner.tsx";
import GuildMessages from "@/components/app/guild/messages/index.tsx";
import {
  useChannelStore,
  useChannelStoreWithNoMessages,
  useGuildStore,
  useMemberStore,
  useMessageStore,
  useRoleStore,
  useUserStore,
} from "$/utils/Stores.ts";
import { useEffect, useState } from "react";
import Member from "$/Client/Structures/Guild/Member.ts";
import UserStruct from "$/Client/Structures/User/User.ts";
import { useRouter } from "next/router";
import messageChunker, { Chunk } from "@/utils/chunker.ts";
import {
  useClientStore,
  useReadyStore,
  useTokenStore,
} from "@/utils/stores.ts";
import { useModelData } from "@/components/app/markdown/components/mentions/mentionData.tsx";
import PermissionHandler from "$/Client/Structures/BitFields/PermissionHandler.ts";

const TextChannel = () => {
  const router = useRouter();
  const { guildId, channelId } = router.query as {
    guildId: string;
    channelId: string;
  };
  const token = useTokenStore((s) => s.token);
  const client = useClientStore((s) => s.client);
  const ready = useReadyStore((s) => s.ready);
  const [areWeReady, setAreWeReady] = useState(false);
  const { getCurrentGuild } = useGuildStore();
  const currentGuild = getCurrentGuild();
  const { getCurrentChannels, getCurrentChannel } = useChannelStore();
  const channels = getCurrentChannels();
  const currentChannel = getCurrentChannel();
  const messageStore = useMessageStore();
  const model = useModelData();
  const { isOpen, height, onClose, width, x, y, placement } = model;
  const [hasMore, setHasMore] = useState(true);
  const [errorFetchingMessages, setErrorFetchingMessages] = useState(false);
  const { channels: noMoreChannels, addChannel } =
    useChannelStoreWithNoMessages();
  const [data, setData] = useState<{
    type: "user";
    user: UserStruct<boolean>;
    member?: Member;
  }>();

  const [messages, setMessages] = useState<Chunk[]>([]);

  const { users } = useUserStore();
  const { getCurrentMember } = useMemberStore();
  const { getCurrentRoles } = useRoleStore();
  const currentMember = getCurrentMember();
  const currentRoles = getCurrentRoles();

  const fetchMessages = async (
    limit: number,
    before?: string,
    after?: string,
  ) => {
    const currentChannel = useChannelStore.getState().getCurrentChannel();

    if (!currentChannel) return;

    if (!currentChannel.isTextBased()) return;

    const messages = await currentChannel.fetchMessages({
      limit,
      before,
      after,
    });

    if (!messages) return;

    if (messages.length < limit) setHasMore(false);
    else setHasMore(true);

    return messages;
  };

  useEffect(() => {
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);

      return;
    }

    if (!ready) {
      setAreWeReady(false);

      return;
    }

    if (!client) return;

    if (!currentGuild) {
      router.push("/app");

      return;
    }

    const clientUser = users.find((u) => u.isClient)!;
    const roles = currentRoles.filter((role) =>
      currentMember?.roleIds.includes(role.id),
    );
    const permissionHandler = new PermissionHandler(
      clientUser.id,
      currentMember?.owner ?? false,
      roles,
      channels,
    );
    const channelsWeHaveReadAccessTo = channels.filter((channel) =>
      permissionHandler.hasChannelPermission(channel.id, [
        "ViewMessageHistory",
      ]),
    );

    const channel =
      channelsWeHaveReadAccessTo.find(
        (channel) => channel.id === channelId && !channel.isCategory(),
      ) ?? channelsWeHaveReadAccessTo.find((channel) => channel.isTextBased());

    if (currentChannel && currentChannel.isCategory() && channel) {
      router.push(`/app/guilds/${guildId}/channels/${channel.id}`);

      return;
    }

    if (!channel || !channel.isTextBased()) {
      router.push(`/app/guilds/${guildId}/channels`);
      return;
    }

    if (channel.id !== channelId) {
      router.push(`/app/guilds/${guildId}/channels/${channel.id}`);
    }

    if (noMoreChannels.includes(channel.id)) {
      setHasMore(false);
      setAreWeReady(true); // we create our custom "ready" thing, since the "ready" for the client is well for when its ready, not when we are ready (fetching messages and such)

      return;
    }

    const messages = messageStore.getCurrentMessages();

    if (messages.length >= 45) {
      setMessages(messageChunker(messages));

      setAreWeReady(true);

      return;
    }

    setAreWeReady(false);

    fetchMessages(50).then((messages) => {
      if (!messages) {
        setErrorFetchingMessages(true);

        return;
      }

      setErrorFetchingMessages(false);

      const flipped = messages.reverse();

      for (const message of flipped) {
        messageStore.addMessage(message);
      }

      if (messages.length < 50) {
        setHasMore(false);
        addChannel(channel.id);
      }

      setAreWeReady(true);
    });
  }, [ready, guildId, channelId]);

  useEffect(() => {
    const messages = messageStore.getCurrentMessages();

    const chunked = messageChunker(messages);

    setMessages(chunked);
  }, [channelId, messageStore.messages]);

  const populateMessages = async (override = false) => {
    if (!hasMore && !override) return;

    const messages = messageChunker(messageStore.getCurrentMessages());

    const lastMessage = messages[messages.length - 1]?.messages?.[0];

    if (!lastMessage && !override) return;

    const newMessages = await fetchMessages(
      50,
      !override ? lastMessage.id : undefined,
    );

    if (!newMessages) {
      setErrorFetchingMessages(true);

      return;
    }

    setErrorFetchingMessages(false);

    const updatedMessages = newMessages.reverse();

    for (const message of updatedMessages) {
      messageStore.addMessage(message);
    }

    if (newMessages.length < 50) {
      setHasMore(false);
      addChannel(channelId);
    }

    if (override) {
      setAreWeReady(true);
    }
  };
  return (
    <>
      <Box maxHeight="calc(100vh - 100px)" ml={-2} mr={-2} id="scrollable-div">
        <GuildMessages
          ready={areWeReady}
          chunks={messages}
          modelData={model}
          hasMore={hasMore}
          setData={setData}
          next={populateMessages}
          fullMessages={messageStore.messages}
        />
        <div id="bottom-chat" />
      </Box>
      <Popover isOpen={isOpen} onClose={onClose} placement={placement} isLazy>
        <PopoverTrigger>
          <Box
            position="absolute"
            top={y + height}
            left={placement === "right" ? x + width : x}
          />
        </PopoverTrigger>
        <Portal>
          {data && data.type === "user" ? (
            <UserPopOver user={data.user} member={data.member} />
          ) : null}
        </Portal>
      </Popover>
      <GuildMessageContainer>
        {errorFetchingMessages && (
          <TextBoxBanner
            onClick={() => {
              populateMessages(true);
            }}
            bg={"red.900"}
            p={1}
            borderRadius="md"
            mb={2}
            cursor="pointer"
            _hover={{ bg: "red.800" }}
          >
            <Flex justifyContent="space-between">
              <Text ml={2}>Failed to load messages</Text>
              <Text mr={2}>Click to retry</Text>
            </Flex>
          </TextBoxBanner>
        )}
      </GuildMessageContainer>
    </>
  );
};

export default TextChannel;
