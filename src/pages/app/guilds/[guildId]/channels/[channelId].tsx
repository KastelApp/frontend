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
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
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
  const [channel, setChannel] = useRecoilState(currentChannel);
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

  const messages = [
    {
      user: {
        name: "Tea Cup",
        avatar: "/icon-3.png",
      },
      content: "Hello world!",
      time: "Yesterday at 1:52 AM",
    },
    {
      user: {
        name: "Darkerink",
        avatar: "/icon-4.png",
      },
      content: "Hello",
      time: "12/12/2020 1:52 AM",
    },
    {
      user: {
        name: "Test",
        avatar: "/icon-2.png",
      },
      content: "Whats up?",
      time: "Today at 1:52 AM",
    },
  ];

  const background = useColorModeValue("#e6e9ef", "#101319");

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
              <Box
                pos={"fixed"}
                zIndex={10}
                h={10}
                top={0}
                w={"full"}
                bg={background}
              >
                <Text mt={2} ml={2}>
                  #{channel?.name}
                </Text>
              </Box>

              {/* messages */}
              <Box mt={20}>
                {messages.map((message) => (
                  <Box
                    key={message.user.name}
                    _hover={{
                      bg: "gray.700",
                    }}
                    mt={2}
                  >
                    <Flex ml={5} py="1.5">
                      <Avatar
                        draggable={"false"}
                        size="sm"
                        src={message.user.avatar || "/icon-1.png"}
                        name={message?.user.name || "Loading"}
                        mb={4}
                        cursor="pointer"
                      ></Avatar>
                      <Box ml="3">
                        <Text>
                          {message.user.name}
                          <Badge
                            bg={"unset"}
                            color={"inherit"}
                            textTransform={"unset"}
                            fontWeight={"unset"}
                            ml="1"
                          >
                            {message.time}
                          </Badge>
                        </Text>
                        <Text fontSize="sm">{message.content}</Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
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
