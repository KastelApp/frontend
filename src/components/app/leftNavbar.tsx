import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Portal,
    SimpleGrid,
    Stack,
    Text,
    VStack,
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

const LeftAppNavbar =  ({ onCustomStatusOpen, onOpen }: { onOpen: () => void, onCustomStatusOpen: () => void }) => {
    const { getCurrentUser } = useUserStore();
    const currentUser = getCurrentUser();
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

        const current = currentUser?.currentPresence;

        switch (current) {
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
    
          case "invisible":
          case "offline": {
            setStatus("gray.500");
    
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

    const bg = useColorModeValue("white", "gray.900");

    return (
        <>
            <Box
                bg={bg}
                pb="10"
                color="inherit"
                w={"60px"}
                mt={4}
                pos={"fixed"}
                zIndex={15}
                h={"full"}
            >
                <Flex id="leftSideBar" alignItems="center" h="full" flexDirection="column">
                    <VStack id="user" spacing="4" align="center" mb={2}>
                        <Flex
                            id="rightSideBar"
                            alignItems="center"
                            height={"full"}
                            marginLeft={"auto"}
                            flexDirection="column"
                        >
                            <Flex id="profileData" alignItems="center" flexDirection="column">
                                <Popover placement="right" isLazy>
                                    <PopoverTrigger>
                                        <Box className="flex flex-col">
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
                                    <Portal>
                                        <PopoverContent
                                            w="fit-content"
                                            _focus={{ boxShadow: "none" }}
                                            marginRight={5}
                                        >
                                            <PopoverArrow />
                                            <PopoverBody>
                                                <Stack spacing={4}>
                                                    <Accordion allowToggle>
                                                        <AccordionItem>
                                                            <AccordionButton>
                                                                Status
                                                                <AccordionIcon />
                                                            </AccordionButton>
                                                            <AccordionPanel>
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
                                    </Portal>

                                </Popover>
                            </Flex>
                        </Flex>
                    </VStack>
                    <VStack id="toolbar" spacing="5" align="start">
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
                    </VStack>

                    <Divider orientation="horizontal" w="80%" mt={4} borderWidth={1.5} />

                    <VStack id="guilds" height="full" py={2} ml={2} spacing={4} align="start">
                        {guilds.map((guild) => <Guild key={guild.id} guild={guild} type="left" />)}
                        <NewGuild />
                    </VStack>
                </Flex>

            </Box>
        </>
    );
};

export default LeftAppNavbar;
