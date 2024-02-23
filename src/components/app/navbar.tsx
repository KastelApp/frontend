import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  SimpleGrid,
  Stack,
  useBreakpointValue,
  useColorModeValue,
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
import { useEffect, useState } from "react";
import Guild from "./guild/guild.tsx";
import NewGuild from "./new-guild.tsx";
import { guildStore } from "@/wrapper/utils/Stores.ts";

const AppNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [client] = useRecoilState(clientStore);
  const [guilds] = useRecoilState(guildStore);
  const [, setToken] = useRecoilState(tokenStore);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const [status, setStatus] = useState<"green" | "orange" | "red" | "gray">("green");

  const handleLogout = () => {
    if (!client) {
      setToken("");
      router.push("/");

      return;
    }

    client.logout();

    setToken("");

    router.push("/");
  };

  

  useEffect(() => {
    /*
     * online - 0 - green
     * idle - 1 - orange
     * dnd - 2 - red
     * offline -  3 - gray
     */

    const isInvisable = client.user.presence.some((p) => p.status === "invisible");

    if (isInvisable) {
      setStatus("gray");

      return;
    }

    const current = client.user.presence.find((p) => p.current);

    switch (current?.status) {
      case "dnd": {
        setStatus("red");

        break;
      }
      case "idle": {
        setStatus("orange");

        break;
      }
      case "online": {
        setStatus("green");

        break;
      }
      default: {
        setStatus("gray");

        break;
      }
    }

  }, [client.user.presence]);

  const handleStatusChange = (status: string) => {
    console.log("new status has not been saved. " + status);
  };

  return (
    <>
      <Settings isOpen={isOpen} onClose={onClose} />

      <Flex
        zIndex={100}
        w="full"
        h="14"
        alignItems="center"
        pos="fixed"
        bottom="2"
        px="3"
      >
        <Flex
          bg={useColorModeValue("gray.100", "gray.800")}
          color={useColorModeValue("gray.700", "gray.200")}
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

              <Link href="/app/@me/messages">
                <Box
                  id="directMessage_toolbar"
                  className="group hidden sm:flex justify-center"
                  cursor="pointer"
                  display={isSmallScreen ? "none" : "flex"}
                >
                  {/* direct message button */}
                  <FaRegPaperPlane size="1.25em" />
                </Box>
              </Link>

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
                bg={"gray.500"}
                rounded="xl"
              />
            </Box>

            <Flex id="guilds" height="full" py={2} marginLeft={5}>
              <>
                <Flex
                  overflowX="auto" // Enable horizontal scrolling
                  maxWidth="calc(100vw - 260px)" // Set a maximum width to prevent overflowing the screen
                >
                  {guilds &&
                    guilds.map((guild) => {
                      if (!guild?.id) return;
                      return (
                        <div
                          key={guild.id}
                          // index={index}
                        >
                          <>
                            <Guild key={guild.id} guild={guild} />
                          </>
                        </div>
                      );
                    })}
                  <NewGuild />
                </Flex>
              </>
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
                        draggable={"false"}
                        borderRadius={"full"}
                        src={client?.user.getAvatarUrl({ size: 128 }) ?? ""}
                        alt={client?.user.displayUsername ?? "Loading"}
                        fit="cover"
                        userSelect={"none"}
                      />
                      <Badge
                        boxSize="3"
                        borderRadius="full"
                        bg={status}
                        position="absolute"
                        bottom="-0.5"
                        right="-0.5"
                      />
                    </Box>
                  </Box>
                </PopoverTrigger>

                <PopoverContent
                  w="fit-content"
                  _focus={{ boxShadow: "none" }}
                  marginRight={5}
                >
                  <PopoverArrow />
                  <PopoverBody>
                    <Stack>
                      <Accordion allowToggle>
                        <AccordionItem>
                          <AccordionButton>
                            Status
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel>
                            <center>
                              <SimpleGrid columns={2} spacing={1}>
                                <Badge
                                  onClick={() => handleStatusChange("online")}
                                  variant={
                                    client?.user.currentPresence === "online"
                                      ? "solid"
                                      : "subtle"
                                  }
                                  cursor={"pointer"}
                                  colorScheme={"green"}
                                >
                                  Online
                                </Badge>
                                <Badge
                                  onClick={() => handleStatusChange("idle")}
                                  variant={
                                    client?.user.currentPresence === "idle"
                                      ? "solid"
                                      : "subtle"
                                  }
                                  cursor={"pointer"}
                                  colorScheme={"orange"}
                                >
                                  Idle
                                </Badge>
                                <Badge
                                  onClick={() => handleStatusChange("dnd")}
                                  variant={
                                    client?.user.currentPresence === "dnd"
                                      ? "solid"
                                      : "subtle"
                                  }
                                  cursor={"pointer"}
                                  colorScheme={"red"}
                                >
                                  DND
                                </Badge>
                                <Badge
                                  onClick={() => handleStatusChange("offline")}
                                  variant={
                                    client?.user.currentPresence === "offline"
                                      ? "solid"
                                      : "subtle"
                                  }
                                  cursor={"pointer"}
                                >
                                  Offline
                                </Badge>
                              </SimpleGrid>
                            </center>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>

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
};

export default AppNavbar;
