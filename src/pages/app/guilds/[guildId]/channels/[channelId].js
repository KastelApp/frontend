import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  clientStore,
  guildStore,
  readyStore,
  currentGuild,
  currentChannel, tokenStore,
} from "@/utils/stores";
import { Box, Text } from "@chakra-ui/react";
import AppNavbar from "@/components/app/navbar";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import GuildSideBar from "@/components/app/guild/side-bar";

const GuildChannelPage = () => {
  const router = useRouter();
  const { guildId, channelId } = router.query;
  const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [guilds] = useRecoilState(guildStore);
  // const [token, setToken] = useRecoilState(tokenStore);
  const [guild, setGuild] = useRecoilState(currentGuild);
  const [channel, setChannel] = useRecoilState(currentChannel);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [ready]);

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
            <AppNavbar userInfo={client?.users?.getCurrentUser()} guilds={guilds} />
            <SEO title={guild?.name || "Loading"} />
            <GuildSideBar userInfo={client?.users?.getCurrentUser()}>
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
