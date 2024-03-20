import {
  useChannelStore,
  useGuildStore,
  useMemberStore,
  useRoleStore,
  useUserStore,
} from "$/utils/Stores.ts";
import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  useLastChannelCache,
  useReadyStore,
  useTokenStore,
} from "@/utils/stores.ts";
import SEO from "@/components/seo.tsx";
import GuildContent from "@/components/app/guild/guildContent.tsx";
import Loading from "@/components/app/loading.tsx";
import constants from "$/utils/constants.ts";
import TextChannel from "@/components/app/guild/channels/types/TextChannel.tsx";
import MarkdownChannel from "@/components/app/guild/channels/types/MarkdownbasedChannel.tsx";
import PermissionHandler from "$/Client/Structures/BitFields/PermissionHandler.ts";

const GuildChannelPage = () => {
  const router = useRouter();
  const { guildId, channelId } = router.query as {
    guildId: string;
    channelId: string;
  };

  const token = useTokenStore((s) => s.token);
  const { getCurrentChannels, getCurrentChannel } = useChannelStore();
  const { getCurrentGuild } = useGuildStore();
  const channels = getCurrentChannels();
  const currentGuild = getCurrentGuild();
  const currentChannel = getCurrentChannel();

  const ready = useReadyStore((s) => s.ready);
  const [flags, setFlags] = useState<{
    ignoreLimits: boolean;
    noMemberBar: boolean;
    noChannelTopic: boolean;
  }>({
    ignoreLimits: false,
    noMemberBar: false,
    noChannelTopic: false,
  });

  const { users } = useUserStore();
  const { getCurrentMember } = useMemberStore();
  const currentMember = getCurrentMember();
  const { getCurrentRoles } = useRoleStore();
  const currentRoles = getCurrentRoles();
  const { lastChannelCache, setLastChannelCache } = useLastChannelCache();

  useEffect(() => {
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);

      return;
    }

    if (!ready) {
      return;
    }

    if (!currentGuild) {
      router.push("/app");

      return;
    }

    if (!currentMember) {
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

    const channel = channelsWeHaveReadAccessTo.find(
      (channel) => channel.id === channelId && !channel.isCategory(),
    );

    if (!channel) {
      router.push(`/app/guilds/${guildId}/channels`);

      return;
    }
  }, [ready, guildId, channels, currentMember, currentRoles]);

  useEffect(() => {
    setLastChannelCache({ ...lastChannelCache, [guildId]: channelId });
  }, [channelId]);

  const getChannelComponent = () => {
    if (!currentChannel) return null;

    switch (currentChannel.type) {
      case constants.channelTypes.GuildText: {
        setFlags({
          ignoreLimits: false,
          noMemberBar: false,
          noChannelTopic: false,
        });

        return <TextChannel />;
      }

      case constants.channelTypes.GuildMarkdown: {
        setFlags({
          ignoreLimits: true,
          noMemberBar: false,
          noChannelTopic: false,
        });

        return <MarkdownChannel />;
      }

      default: {
        return null;
      }
    }
  };

  const channelComponent = useMemo(
    () => getChannelComponent(),
    [currentChannel],
  );

  return (
    <>
      <SEO
        title={"App"}
        description={
          "Kastel is a fresh take on chat apps. With a unique look and feel, it's the perfect way to connect with friends, family, and communities."
        }
      />
      {ready ? (
        <Box>
          <GuildContent
            ignoreLimits={flags.ignoreLimits}
            noMemberBar={flags.noMemberBar}
            noChannelTopic={flags.noChannelTopic}
          >
            {channelComponent}
          </GuildContent>
        </Box>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default GuildChannelPage;
