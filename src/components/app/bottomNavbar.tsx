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
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FaCog,
  FaHome,
  FaRegCompass,
  FaSignOutAlt,
} from "react-icons/fa";
import { useClientStore, useTokenStore } from "@/utils/stores";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Guild from "./guild/guild.tsx";
import NewGuild from "./new-guild.tsx";
import { useGuildStore, useUserStore } from "@/wrapper/utils/Stores.ts";

const AppNavbar = ({ onCustomStatusOpen, onOpen }: { onOpen: () => void, onCustomStatusOpen: () => void; }) => {
  const currentUser = useUserStore((state) => state.getCurrentUser());
  const client = useClientStore((state) => state.client);
  const guilds = useGuildStore((state) => state.guilds);
  const setToken = useTokenStore((state) => state.setToken);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const [status, setStatus] = useState<"green.500" | "orange.400" | "red.600" | "gray.500">("green.500");

  const handleLogout = () => {
    if (!client) {
      setToken(null);
      router.push("/");

      return;
    }

    client.logout();

    setToken(null);

    router.push("/");
  };

  useEffect(() => {
    /*
     * online - 0 - green
     * idle - 1 - orange
     * dnd - 2 - red
     * offline -  3 - gray
     */

    const isInvisable = currentUser?.presence.some((p) => p.status === "invisible");

    if (isInvisable) {
      setStatus("gray.500");

      return;
    }

    const current = currentUser?.presence.find((p) => p.current);

    switch (current?.status) {
      case "dnd": {
        setStatus("red.600");

        break;
      }

      case "idle": {
        setStatus("orange.400");

        break;
      }

      case "online": {
        setStatus("green.500");

        break;
      }

      default: {
        setStatus("gray.500");

        break;
      }
    }

  }, [currentUser?.presence]);

  const handleStatusChange = (status: string) => {
    console.log("new status has not been saved. " + status);
  };

  return (
    <>
      <Flex
        zIndex={2}
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
            <HStack id="toolbar" spacing="5">
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
              <Flex
                overflowX="auto" // Enable horizontal scrolling
                overflowY="hidden"
                maxWidth="calc(100vw - 260px)" // Set a maximum width to prevent overflowing the screen
              >
                {guilds.map((guild) => <Guild type="bottom" key={guild.id} guild={guild} />)}
                <NewGuild />
              </Flex>
            </Flex>
          </Flex>

          <Flex
            id="rightSideBar"
            alignItems="center"
            height={"full"}
            marginLeft={"auto"}
          >
            <Flex id="profileData" alignItems="center" py="1.5">
              <Popover placement="top" isLazy>
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
                        src={currentUser?.getAvatarUrl({ size: 128 }) ?? ""}
                        alt={currentUser?.displayUsername ?? "Loading"}
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
                                    currentUser?.currentPresence === "online"
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
                                    currentUser?.currentPresence === "idle"
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
                                    currentUser?.currentPresence === "dnd"
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
                                    currentUser?.currentPresence === "offline"
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
                      <Box cursor={"pointer"}>
                        <Button
                          w="194px"
                          variant="ghost"
                          justifyContent="flex-start"
                          fontWeight="normal"
                          fontSize="sm"
                          onClick={onCustomStatusOpen}
                        >
                          <Flex direction="column" align="start">
                            <Box mb={1} mt={1}>Custom Status</Box>
                            {currentUser?.customStatus && (
                              <Text fontSize="xs" color="gray.500">
                                {currentUser?.customStatus ?? "No custom status"}
                              </Text>
                            )}
                          </Flex>
                        </Button>
                      </Box>

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
