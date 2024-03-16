import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  useLastChannelCache,
  useReadyStore,
  useTokenStore
} from "@/utils/stores";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import GuildContent from "@/components/app/guild/guildContent";
import { useChannelStore, useGuildStore, useMemberStore, useRoleStore, useUserStore } from "$/utils/Stores.ts";
import PermissionHandler from "$/Client/Structures/BitFields/PermissionHandler.ts";

const GuildChannelPage = () => {
  const router = useRouter();
  const { guildId } = router.query as {
    guildId: string;
  };
  const token = useTokenStore((s) => s.token);
  const ready = useReadyStore((s) => s.ready);
  const currentGuild = useGuildStore((s) => s.getCurrentGuild());
  const channels = useChannelStore((s) => s.getCurrentChannels());
  const { users } = useUserStore();
  const currentRoles = useRoleStore((r) => r.getCurrentRoles());
  const currentMember = useMemberStore((s) => s.getCurrentMember());
  const { lastChannelCache, setLastChannelCache, removeChannelFromCache } = useLastChannelCache();
  
  useEffect(() => {
    if (!token) router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);


    if (!ready) return;

    if (!currentGuild) {
      router.push("/app");

      return;
    }

    if (!currentMember) {
      return;
    }

    const clientUser = users.find((u) => u.isClient)!;

    console.log(currentMember)

    const roles = currentRoles.filter((role) => currentMember?.roleIds.includes(role.id));
    const permissionHandler = new PermissionHandler(clientUser.id, currentMember?.owner ?? false, roles, channels);
    const channelsWeHaveReadAccessTo = channels.filter((channel) => permissionHandler.hasChannelPermission(channel.id, ["ViewMessageHistory"]));

    if (lastChannelCache[guildId]) {
      if (channelsWeHaveReadAccessTo.find((channel) => channel.id === lastChannelCache[guildId])) {
        router.push(`/app/guilds/${guildId}/channels/${lastChannelCache[guildId]}`);
        
        return;
      }
    }

    const channel = channelsWeHaveReadAccessTo.find((channel) => channel.isTextBased() && !channel.isCategory())

    if (channel) {
      setLastChannelCache({ ...lastChannelCache, [guildId]: channel.id });

      router.push(`/app/guilds/${guildId}/channels/${channel.id}`);
    } else {
      removeChannelFromCache(guildId);
    }
  }, [ready, guildId, currentMember, currentRoles]);

  return (
    <>
      <SEO
        title={"App"}
        description={
          "Kastel is a fresh take on chat apps. With a unique look and feel, it's the perfect way to connect with friends, family, and communities."
        }
      />
      {ready ? (
        <>
          <Box>
            <GuildContent noMemberBar noChannelTopic>
              <Center height="50vh">
                <Box>
                  <Heading textAlign={"center"} as="h1">
                    No Text Channels
                  </Heading>
                  <br />
                  <Text align={"center"} fontSize="lg" mb={4}>It seems that there are no channels in this guild, or you do not have access to any.</Text>
                </Box>
              </Center>
            </GuildContent>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default GuildChannelPage;
