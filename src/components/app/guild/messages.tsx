import {
  Avatar,
  Badge,
  Box,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

const GuildMessages = () => {
  const messages = [
    {
      user: {
        name: "Tea Cup",
        avatar: "/icon-3.png",
        presence: "online",
        username: "Tea Cup",
        discriminator: "0001",
      },
      content: "Hello world!",
      time: "Yesterday at 1:52 AM",
    },
    {
      user: {
        name: "Darkerink",
        avatar: "/icon-4.png",
        presence: "idle",
        username: "Darkerink",
        discriminator: "2927",
      },
      content: "Hello",
      time: "12/12/2020 1:52 AM",
    },
    {
      user: {
        name: "Test",
        avatar: "/icon-2.png",
        presence: "dnd",
        username: "Test",
        discriminator: "2340",
      },
      content: "Whats up?",
      time: "Today at 1:52 AM",
    },
    {
      user: {
        name: "Someone",
        avatar: "/icon-3.png",
        presence: "offline",
        username: "Someone",
        discriminator: "3428",
      },
      content: "Howdy",
      time: "Yesterday at 4:51 PM",
    },
    {
      user: {
        name: "goop",
        avatar: "/icon-4.png",
        presence: "online",
        username: "goop",
        discriminator: "8923",
      },
      content: "true",
      time: "12/12/2020 1:52 AM",
    },
    {
      user: {
        name: "Taco",
        avatar: "/icon-2.png",
        presence: "idle",
        username: "Taco",
        discriminator: "6940",
      },
      content: "false",
      time: "Today at 1:52 AM",
    },
    {
      user: {
        name: "Apple",
        avatar: "/icon-2.png",
        presence: "dnd",
        username: "Apple",
        discriminator: "4200",
      },
      content: "Oh my...",
      time: "Today at 8:15 AM",
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
            <Popover placement={"right"}>
              <Flex ml={5} py="1.5">
                <PopoverTrigger>
                  <Avatar
                    draggable={"false"}
                    size="sm"
                    src={message.user.avatar || "/icon-1.png"}
                    name={message?.user.name || "Loading"}
                    mb={4}
                    cursor="pointer"
                  ></Avatar>
                </PopoverTrigger>
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
              <PopoverContent _focus={{ boxShadow: "none" }}>
                <PopoverBody>
                  <Flex>
                    <Box
                      boxSize="50px"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="visible"
                      lineHeight="none"
                      borderRadius="full"
                      position="relative"
                    >
                      <Image
                        draggable={"false"}
                        borderRadius={"full"}
                        src={""}
                        fallbackSrc={"/icon-1.png"}
                        alt={message?.user?.username || "loading"}
                        fit="cover"
                      />
                      <Badge
                        boxSize="5"
                        borderRadius="full"
                        bg={
                          message?.user?.presence === "online"
                            ? "green.500"
                            : message?.user?.presence === "idle"
                              ? "yellow.500"
                              : message?.user?.presence === "dnd"
                                ? "red.500"
                                : "gray.500"
                        }
                        position="absolute"
                        bottom="-0.5"
                        right="-0.5"
                      />
                    </Box>

                    <Text ml={2} mt={3}>
                      {message?.user?.username}#{message?.user?.discriminator}
                    </Text>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default GuildMessages;
