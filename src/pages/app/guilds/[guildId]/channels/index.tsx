import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  clientStore,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
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
      foundGuild.channels.find((channel) => channel.id === channelId) ??
      foundGuild.channels.find((channel) => channel.isTextBased());

    if (channel) {
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
            <GuildSideBar noMemberBar noTextBox noChannelTopic>
              <Center height="50vh">
                <Box>
                  {/* No Text Channels header */}
                  <Heading textAlign={"center"} as="h1">
                    No Text Channels
                  </Heading>
                  <br />
                  <Text align={"center"} fontSize="lg" mb={4}>It seems that there are no channels in this guild, or you do not have access to any.</Text>
                </Box>
              </Center>
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
