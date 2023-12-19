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
  useBreakpointValue,
  useColorMode,
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
import { clientStore, guildStore, tokenStore } from "@/utils/stores";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Guild from "./guild/guild.tsx";
import NewGuild from "./new-guild.tsx";

const AppNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [client] = useRecoilState(clientStore);
  const [guilds] = useRecoilState(guildStore);
  const [, setToken] = useRecoilState(tokenStore);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const { toggleColorMode } = useColorMode();

  const handleLogout = () => {
    if (!client) {
      setToken("");
      router.push("/");

      return;
    }

    client.logout();
    client.setToken(null);

    setToken("");

    router.push("/");
  };

  useEffect(() => {
    const mode = localStorage.getItem("chakra-ui-color-mode");

    const theme = client?.user.theme;

    if (!theme) return;

    if (mode !== theme) {
      toggleColorMode();
    }
  }, [client?.user.theme]);

  return (
    <>
      <Settings isOpen={isOpen} onClose={onClose} />

      <Flex w="full" h="14" alignItems="center" pos="fixed" bottom="2" px="3">
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
                        borderRadius={"full"}
                        src={client?.user.getAvatarUrl({ size: 128 }) ?? ""}
                        fallbackSrc={"/icon-1.png"}
                        alt={client?.user.username || "Loading"}
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
                        {client?.user.username || "Loading"}
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
};

export default AppNavbar;
