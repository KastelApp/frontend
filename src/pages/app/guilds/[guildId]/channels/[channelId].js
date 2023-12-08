import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  clientStore,
  guildStore,
  readyStore,
  currentGuild,
  currentChannel,
} from "@/utils/stores";
import { Box, Text } from "@chakra-ui/react";
import AppNavbar from "@/components/app/navbar";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import GuildSideBar from "@/components/app/guild/side-bar";

const GuildChannelPage = () => {
  const router = useRouter();
  const { guildId, channelId } = router.query;
  // const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [user, setUser] = useState(null);
  const [guilds] = useRecoilState(guildStore);
  // const [token, setToken] = useRecoilState(tokenStore);
  const [guild, setGuild] = useRecoilState(currentGuild);
  const [channel, setChannel] = useRecoilState(currentChannel);

  useEffect(() => {
    if (ready) {
      setUser(client?.users?.getCurrentUser());
    }
  }, [ready, guildId, channelId]);

  useEffect(() => {
    if (ready) {
      const foundGuild = client.guilds.get(guildId);
      console.log(foundGuild);

      if (!foundGuild) {
        router.push("/app");
      }

      const channel = foundGuild.channels.find(
        (channel) => channel.id === channelId,
      );
      if (!channel) {
        // todo: handle this
      }

      setGuild(foundGuild);
      setChannel(channel);
    }
  }, [ready, guildId, channelId]);

  return (
    <>
      <SEO title={"App"} />
      {ready ? (
        <>
          <Box>
            <AppNavbar userInfo={user} guilds={guilds} />
            <SEO title={guild?.name || "Loading"} />
            <GuildSideBar userInfo={user}>
              <Text>
                Name: {guild?.name || "Loading"} <br />
                ID: {guildId} <br />
                Channel ID: {channelId}
                Channel Name: {channel?.name || "Loading"}
              </Text>
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
