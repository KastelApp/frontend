import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tooltip,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FaCog,
  FaHome,
  FaRegCompass,
  FaRegPaperPlane,
  FaSignOutAlt,
} from "react-icons/fa";
import Settings from "@/components/app/settings";
import { useRecoilState } from "recoil";
import { clientStore, tokenStore } from "@/utils/stores";
import { useRouter } from "next/router";
import NewGuild from "@/components/app/new-guild";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import NextLink from "next/link";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function AppNavbar({ userInfo, guilds }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [client] = useRecoilState(clientStore);
  // eslint-disable-next-line no-unused-vars
  const [_, setToken] = useRecoilState(tokenStore);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const [guildList, setGuildList] = useState(guilds);

  useEffect(() => {
    // Check if the guilds you want to add isn't already in the guildList
    if (!guildList.some((guild) => guild.id === guilds.id)) {
      // Use the spread operator to create a new array with the existing guildList and the new guilds
      setGuildList((prevGuildList) => [...prevGuildList, guilds]);
    }
  }, []);

  useEffect(() => {
    // on guild list update check for dupes
    if (!guildList.some((guild) => guild.id === guilds.id)) {
      // Use the spread operator to create a new array with the existing guildList and the new guilds
      setGuildList((prevGuildList) => [...prevGuildList, guilds]);
    }
  }, [guilds]);

  function handleLogout() {
    client.logout();
    client.setToken(null);
    setToken(null);
    router.push("/");
  }

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      guildList,
      result.source.index,
      result.destination.index,
    );

    setGuildList(items);

    // todo - save new positioned guilds
  }

  return (
    <>
      <Settings userInfo={userInfo} isOpen={isOpen} onClose={onClose} />

      <Flex w="full" h="14" alignItems="center" pos="fixed" bottom="2" px="3">
        <Flex
          bg={"gray.700"}
          boxShadow="xl"
          px="5"
          w="full"
          h="full"
          rounded="xl"
          alignItems="center"
        >
          <Flex id="leftSideBar" alignItems="center" h="full">
            <HStack id="toolbar" spacing="7">
              <Link href="/app">
                <Box
                  id="home_toolbar"
                  as="div"
                  className="group flex justify-center"
                  cursor="pointer"
                >
                  {/* home button */}
                  <FaHome size="1.25em" />
                </Box>
              </Link>

              <Box
                id="directMessage_toolbar"
                className="group hidden sm:flex justify-center"
                cursor="pointer"
                display={isSmallScreen ? "none" : "flex"}
              >
                {/* direct message button */}
                <FaRegPaperPlane size="1.25em" />
              </Box>

              <Box
                id="explore_toolbar"
                className="group hidden sm:flex justify-center"
                cursor="pointer"
                display={isSmallScreen ? "none" : "flex"}
              >
                {/* explore button */}
                <FaRegCompass size="1.25em" />
              </Box>
            </HStack>

            <Box height={"full"} width={"0.5"} marginLeft={"5"} py={3}>
              <Box
                width={"full"}
                height={"full"}
                bg={"gray.900"}
                rounded="xl"
              />
            </Box>

            <Flex id="guilds" height="full" py={2} marginLeft={5}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                  {(provided) => (
                    <Flex ref={provided.innerRef} {...provided.droppableProps}>
                      {provided.placeholder}
                      {guildList &&
                        guildList.map((guild, index) => {
                          if (!guild?.id) return;
                          return (
                            <Draggable
                              draggableId={guild.id}
                              key={guild.id}
                              index={index}
                            >
                              {(provided) => (
                                <Guild
                                  key={guild.id}
                                  provided={provided}
                                  guild={guild}
                                />
                              )}
                            </Draggable>
                          );
                        })}
                    </Flex>
                  )}
                </Droppable>
              </DragDropContext>

              <NewGuild marginRight={2} userInfo />
            </Flex>
          </Flex>

          <Flex
            id="rightSideBar"
            alignItems="center"
            height={"full"}
            marginLeft={"auto"}
          >
            <Flex id="profileData" alignItems="center" py="1.5">
              <Popover placement="top">
                <PopoverTrigger>
                  <Box py={1} className=" flex ">
                    <Box
                      boxSize="30px"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="visible"
                      lineHeight="none"
                      borderRadius="full"
                      position="relative"
                    >
                      <Image
                        borderRadius={"full"}
                        src={userInfo?.avatarURL}
                        fallbackSrc={"/icon-1.png"}
                        alt={userInfo?.username || "Loading"}
                        fit="cover"
                      />
                      <Badge
                        boxSize="3"
                        borderRadius="full"
                        bg="green.500"
                        position="absolute"
                        bottom="-0.5"
                        right="-0.5"
                      />
                    </Box>
                  </Box>

                  {/*<Box marginLeft={"2"} className="hidden sm:block">
                    <Heading
                      fontSize={"sm"}
                      color={"gray.200"}
                      className=" font-black "
                    >
                      {userInfo?.username || "Loading"}
                    </Heading>
                    <Text
                      fontSize={"xs"}
                      color={"gray.400"}
                      className="font-medium"
                    >
                      {userInfo?.activityMessage || ""}
                    </Text>
                  </Box>*/}
                </PopoverTrigger>

                <PopoverContent
                  w="fit-content"
                  _focus={{ boxShadow: "none" }}
                  marginRight={5}
                >
                  <PopoverArrow />
                  <PopoverBody>
                    <Stack>
                      <Button
                        w="194px"
                        variant="ghost"
                        rightIcon={<FaCog />}
                        justifyContent="space-between"
                        fontWeight="normal"
                        fontSize="sm"
                        onClick={onOpen}
                      >
                        Settings
                      </Button>

                      <Button
                        w="194px"
                        variant="ghost"
                        rightIcon={<FaSignOutAlt />}
                        justifyContent="space-between"
                        fontWeight="normal"
                        colorScheme="red"
                        fontSize="sm"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

function Guild({ provided, guild }) {
  const FirstChannel = guild.channels.find(
    (channel) =>
      channel.type === "GuildText" ||
      channel.type === "GuildNews" ||
      channel.type === "GuildNewMember" ||
      channel.type === "GuildRules",
  );

  return (
    <NextLink href={`/app/guilds/${guild?.id}/channels/${FirstChannel.id}`}>
      <Box
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Tooltip label={`${guild?.name || "Loading..."}`} placement="top">
          <Box display="inline-block" marginRight={2}>
            <Flex
              overflow={"hidden"}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bg={"red.500"}
              rounded={"50px"}
              w={"40px"}
              h={"40px"}
              textAlign="center"
            >
              {guild.name}
            </Flex>
          </Box>
        </Tooltip>
      </Box>
    </NextLink>
  );
}
