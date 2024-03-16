import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useReadyStore, useTokenStore } from "@/utils/stores";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import { Avatar, Badge, Box, Button, Divider, Flex, Icon, List, ListItem, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useSettingsStore } from "$/utils/Stores.ts";

const App = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const { ready } = useReadyStore();
  const background = useColorModeValue("#e6e9ef", "#101319");
  const [selected, setSelected] = useState<"home" | "friends" | "gameLibrary">("home");
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!token) router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
  }, [ready]);

  return (
    <>
      <SEO
        title={"App"}
        description={
          "Kastel is a fresh take on chat apps. With a unique look and feel, it's the perfect way to connect with friends, family, and communities."
        }
      />
      {ready ? (
        <>
          <Flex h="100vh" ml={settings.navBarLocation === "left" ? "60px" : ""}>
            <Box
              bg={background}
              pb="10"
              overflowX="hidden"
              overflowY="scroll"
              color="inherit"
              w={"200px"}
            >
              <Flex px="4" py="5" align="center">
                <List spacing={3} w="100%">
                  <ListItem
                    cursor="pointer"
                    onClick={() => setSelected("home")}
                    bg={selected === "home" ? "gray.700" : "inherit"}
                    borderRadius="md"
                    p={2}
                    _hover={{ bg: "gray.600" }}
                    userSelect={"none"}
                  >
                    Home
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    onClick={() => setSelected("friends")}
                    bg={selected === "friends" ? "gray.700" : "inherit"}
                    borderRadius="md"
                    p={2}
                    _hover={{ bg: "gray.600" }}
                    userSelect={"none"}
                  >
                    Friends
                  </ListItem>
                  <ListItem
                    cursor="pointer"
                    bg={selected === "gameLibrary" ? "gray.700" : "inherit"}
                    borderRadius="md"
                    p={2}
                    position="relative"
                    _hover={{ bg: "gray.600" }}
                    _disabled={{ cursor: "not-allowed", _hover: { bg: "inherit" }, color: "gray.400" }}
                    aria-disabled
                    userSelect={"none"}
                  >
                    <Box as="span">Game Library</Box>
                    <Badge
                      position="absolute"
                      right="2"
                      top="50%"
                      transform="translateY(-50%)"
                      bg="#4F2D7C"
                      color="white"
                      textTransform="none"
                    >
                      Soon
                    </Badge>
                  </ListItem>
                </List>
              </Flex>
              <Divider w={"90%"} ml={2.5} />
              <Flex
                direction="column"
                as="nav"
                fontSize="sm"
                color="gray.600"
                aria-label="Main Navigation"
              >
                <Flex
                  align="center"
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.700" }}
                  position="relative"
                  mt={2}
                  maxW="calc(100% - 20px)"
                  ml={2}
                  borderRadius="md"
                >
                  <Box
                    boxSize="28px"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="visible"
                    lineHeight="none"
                    borderRadius="full"
                    position="relative"
                  >
                    <Avatar
                      draggable={"false"}
                      src={"/icon-1.png"}
                      style={{ borderRadius: "50%" }}
                      width="28px"
                      height="28px"
                    />
                  </Box>
                  <Box ml="2" position={"relative"}>
                    <Flex align="center">
                      <Box as="span" color="white" fontSize="md" userSelect={"none"}>
                        Username
                      </Box>
                    </Flex>
                  </Box>
                  <Box
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                    mr={4}
                  >
                    <Icon as={CloseIcon} color="gray.400" />
                  </Box>
                </Flex>
              </Flex>
            </Box>

            <Flex flex="1" p={4} direction="column">
              {
                selected === "friends" ? (
                  <Tabs variant="enclosed" isLazy>
                    <TabList>
                      <Tab>Online (15)</Tab>
                      <Tab>All (30)</Tab>
                      <Tab>Blocked</Tab>
                      <Tab>Pending (3)</Tab>
                      <Button
                        bg="green.600"
                        _hover={{
                          bg: "green.700",
                        }}
                        size={"sm"}
                        mt={1}
                        as={Tab}
                      >Add Friend</Button>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <Box>Online Friends</Box>
                      </TabPanel>
                      <TabPanel>
                        <Box>All Friends</Box>
                      </TabPanel>
                      <TabPanel>
                        <Box>Blocked Users</Box>
                      </TabPanel>
                      <TabPanel>
                        <Box>Pending Requests</Box>
                      </TabPanel>
                      <TabPanel>
                        <Box>Add Friend</Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                ) : (
                  <>
                    Idk what to put
                  </>
                )
              }
            </Flex>

          </Flex>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
