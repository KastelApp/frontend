import { Box, Flex, Heading, HStack, Tooltip, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import { FaHome, FaRegCompass, FaRegPaperPlane } from "react-icons/fa";

export default function AppNavbar({ userInfo, guilds, children }) {

    return (
        <>
            <Flex
                w="full"
                h="14"
                alignItems="center"
                pos="fixed"
                bottom="2"
                px="3"
            >
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
                                    <FaHome size="1.25em"/>
                                </Box>
                            </Link>

                            <Box
                                id="directMessage_toolbar"
                                className="group hidden sm:flex justify-center"
                                cursor="pointer"
                            >
                                {/* direct message button */}
                                <FaRegPaperPlane size="1.25em"/>
                            </Box>

                            <Box
                                id="explore_toolbar"
                                className="group hidden sm:flex justify-center"
                                cursor="pointer"
                            >
                                {/* explore button */}
                                <FaRegCompass size="1.25em"/>
                            </Box>
                        </HStack>

                        <Box
                            height={"full"}
                            width={"0.5"}
                            marginLeft={"5"}
                            py={3}
                        >
                            <Box
                                width={"full"}
                                height={"full"}
                                bg={"gray.900"}
                                rounded="xl"
                            />
                        </Box>

                        <Box id="guilds"
                             height={"full"}
                             py={2}
                             marginLeft={"5"}
                        >
                            <Box
                                height={"full"}
                                width={"fit"}
                                justifyContent={"center"}
                                className="group flex">
                                <Tooltip
                                    label="Home"
                                    placement="right"
                                    bg="gray.700"
                                    color="white"
                                    borderRadius="md"
                                    px="2"
                                    py="1">
                                    <Box
                                        height={"full"}
                                        width={"full"}
                                        borderRadius={"full"}
                                        bg={"gray.900"}
                                        cursor="pointer"
                                    >
                                        Guild
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Flex>

                    <Flex id="rightSideBar" alignItems="center"
                          height={"full"}
                          marginLeft={"auto"}
                          >
                        <Flex id="profileData" alignItems="center" py="1.5">
                            <Box

                                py={1}
                                className=" flex ">
                                <Image
                                    boxSize='30px'
                                    objectFit='cover'
                                    borderRadius='full'
                                    src={userInfo?.avatarURL}
                                    fallbackSrc={"/icon-1.png"}
                                    alt={userInfo?.username || "Loading"}/>
                                <Box
                                    position={"absolute"}
                                    bg={"green.400"}
                                    shadow={"xl"}
                                    w={"2"}
                                    h={"2"}
                                    rounded={"full"}
                                    />
                            </Box>
                            <Box
                                marginLeft={"2"}
                                className="hidden sm:block">
                                <Heading
                                    fontSize={"sm"}
                                    color={"gray.200"}
                                    className=" font-black ">
                                    {userInfo?.username || "Loading"}
                                </Heading>
                                <Text
                                    fontSize={"xs"}
                                    color={"gray.400"}
                                    className="font-medium">
                                    {userInfo?.activityMessage || ""}
                                </Text>
                            </Box>
                        </Flex>
                        
                    </Flex>

                </Flex>
            </Flex>

        </>
    );
}