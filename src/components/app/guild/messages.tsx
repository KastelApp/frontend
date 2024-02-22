import { messageStore } from "$/utils/Stores.ts";
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
import { useRecoilState } from "recoil";

const GuildMessages = () => {
  const [messages] = useRecoilState(messageStore);

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
