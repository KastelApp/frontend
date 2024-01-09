import { Avatar, Badge, Box, Flex, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { currentChannel } from "@/utils/stores.ts";

const GuildMessages = () => {
  const [currentChannelInfo] = useRecoilState(currentChannel);

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
    {
      user: {
        name: "Test",
        avatar: "/icon-2.png",
      },
      content: "Whats up?",
      time: "Today at 1:52 AM",
    },
  ];

  return (
    <>
      <Box mb={2} maxHeight="calc(100vh - 100px)" overflowY="auto">
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
    </>
  );
};

export default GuildMessages;
