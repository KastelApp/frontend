import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  clientStore,
  currentChannel,
  currentGuild,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import { Box } from "@chakra-ui/react";
import AppNavbar from "@/components/app/navbar";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import GuildSideBar from "@/components/app/guild/side-bar";

const GuildChannelPage = () => {
  const router = useRouter();
  const { guildId, channelId } = router.query as {
    guildId: string;
    channelId: string;
  };
  const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [, setGuild] = useRecoilState(currentGuild);
  const [, setChannel] = useRecoilState(currentChannel);
  const [areWeReady, setAreWeReady] = useState(false);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [ready]);

  useEffect(() => {
    if (!client) return;
    if (!ready) return;

    const foundGuild = client.guilds.get(guildId);

    if (!foundGuild) {
      router.push("/app");

      return;
    }

    const channel =
      foundGuild.channels.find((channel) => channel.id === channelId) ??
      foundGuild.channels.find((channel) =>
        ["GuildText", "GuildNews", "GuildRules", "GuildNewMember"].includes(
          channel.type,
        ),
      );

    if (!channel) {
      console.log("no channel found");

      return;
    }

    if (channel.id !== channelId) {
      router.push(`/app/guilds/${guildId}/channels/${channel.id}`);
    }

    setGuild(foundGuild);
    setChannel(channel);
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
            <AppNavbar />

            <GuildSideBar />
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default GuildChannelPage;
