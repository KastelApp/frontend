import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  clientStore,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import { Box } from "@chakra-ui/react";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import GuildSideBar from "@/components/app/guild/side-bar";
import GuildMessages from "@/components/app/guild/messages";

const GuildChannelPage = () => {
  const router = useRouter();
  const { guildId, channelId } = router.query as {
    guildId: string;
    channelId: string;
  };
  const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [areWeReady, setAreWeReady] = useState(false);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [ready]);

  useEffect(() => {
    if (!client) return;
    if (!ready) return;

    const foundGuild = client.guilds.find((guild) => guild.id === guildId);

    if (!foundGuild) {
      router.push("/app");

      return;
    }

    const channel =
      foundGuild.channels.find((channel) => channel.id === channelId && !channel.isCategory()) ??
      foundGuild.channels.find((channel) => channel.isTextBased());

    if (client.currentChannel && client.currentChannel.isCategory() && channel) {
      router.push(`/app/guilds/${guildId}/channels/${channel.id}`);

      return;
    }

    if (!channel) {
      router.push(`/app/guilds/${guildId}/channels`);
      return;
    }

    if (channel.id !== channelId) {
      router.push(`/app/guilds/${guildId}/channels/${channel.id}`);
    }

    setAreWeReady(true); // we create our custom "ready" thing, since the "ready" for the client is well for when its ready, not when we are ready
  }, [ready, guildId, channelId]);

  return (
    <>
      <SEO
        title={"App"}
        description={
          "Kastel is a fresh take on chat apps. With a unique look and feel, it's the perfect way to connect with friends, family, and communities."
        }
      />
      {areWeReady ? (
        <>
          <Box>
            <GuildSideBar>
              {/* messages */}
              <GuildMessages />
            </GuildSideBar>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default GuildChannelPage;
