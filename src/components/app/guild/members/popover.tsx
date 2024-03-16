import Member from "$/Client/Structures/Guild/Member.ts";
import User from "$/Client/Structures/User/User";
import { Badge, Box, Divider, Flex, Image, PopoverBody, PopoverContent, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import ActivityItem from "./activityItem.tsx";
import { useRoleStore } from "$/utils/Stores.ts";

const messages = [
    "Copied",
    "Copied!",
    "Copied!!!!",
    "Ultra copy",
    "Copied once again..",
    "Do you need to copy again?",
    "Its copied, we made sure of it!",
    "Stop Copying!",
    "Please, Stop copying!",
];

const UserPopOver = ({ user, member }: { user: User<boolean>, member?: Member; }) => {
    const hoverBg = useColorModeValue("gray.300", "gray.700");
    const [messageCount, setMessageCount] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [intervals, setIntervals] = useState<{
        isOpen: NodeJS.Timeout | null,
        reset: NodeJS.Timeout | null;
    }>({
        isOpen: null,
        reset: null
    });
    const roles = useRoleStore((s) => s.roles.filter((role) => member?.roleIds.includes(role.id)));

    return (
        <PopoverContent _focus={{ boxShadow: "none" }} zIndex={20}>
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
                        mt={2}
                    >
                        <Image
                            draggable={"false"}
                            borderRadius={"full"}
                            src={user.getAvatarUrl({ size: 128 }) ?? ""}
                            alt={`${user.username}'s avatar`}
                            fit="cover"
                        />
                        <Badge
                            boxSize="3.5"
                            borderRadius="full"
                            bg={
                                user.currentPresence === "online"
                                    ? "green.500"
                                    : user.currentPresence === "idle"
                                        ? "yellow.500"
                                        : user.currentPresence === "dnd"
                                            ? "red.500"
                                            : "gray.500"
                            }
                            _dark={{
                                border: "1px solid",
                                borderColor: "gray.700"
                            }}
                            position="absolute"
                            bottom="1"
                            right="-0.5"
                        />
                    </Box>
                </Flex>
                <Flex
                    direction="column"
                    ml={1}
                    mt={4}
                    _dark={{
                        bg: "gray.800"
                    }}
                    p={2}
                    borderRadius="10px"
                    cursor={"default"}
                >
                    <Text
                        fontSize={"lg"}
                        fontWeight={"600"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                        whiteSpace={"nowrap"}
                    >
                        <Tooltip label={messages[messageCount]} hasArrow bg={"green.600"} isOpen={isOpen} placement={"top"} color={"grey.300"}>
                            <Text cursor={"pointer"} as={"span"} onClick={(e) => {
                                if (e.ctrlKey) {
                                    navigator.clipboard.writeText(user.id);
                                } else {
                                    navigator.clipboard.writeText(user.displayUsername);
                                }

                                if (!isOpen && messageCount < messages.length - 1) setMessageCount(messageCount + 1);

                                setIsOpen(true);

                                if (intervals.isOpen) clearInterval(intervals.isOpen);
                                if (intervals.reset) clearInterval(intervals.reset);

                                setIntervals({
                                    isOpen: setTimeout(() => setIsOpen(false), 500),
                                    reset: setTimeout(() => setMessageCount(-1), 1000)
                                });
                            }}
                            >
                                {user.displayUsername}
                            </Text>
                        </Tooltip>
                    </Text>
                    <Text
                        fontSize="smaller"
                        fontWeight={"450"}
                        cursor={"auto"}
                        userSelect={"text"}
                    >{user.fullUsername}</Text>
                    {user.customStatus && (
                        <Text
                            fontSize="sm"
                            mt={2}
                            color={"gray.400"}
                            ml={2}
                            cursor={"auto"}
                            userSelect={"text"}
                        >{user.customStatus}</Text>
                    )}
                    {user.bio && (
                        <>
                            <Divider mt={2} />
                            <Text
                                mt={2}
                                fontWeight={"bold"}
                                fontSize={"medium"}
                                userSelect={"none"}
                            >About me</Text>
                            <Text
                                fontSize={"sm"}
                                color={"gray.400"}
                                mt={2}
                                ml={2}
                                cursor={"auto"}
                                userSelect={"text"}
                            >{user.bio}</Text>
                        </>
                    )}
                    {user.activities.length > 0 && (
                        <>
                            <Divider mt={2} />
                            <Text
                                mt={2}
                                fontWeight={"bold"}
                                fontSize={"medium"}
                                userSelect={"none"}
                            >Activitiy</Text>
                            <Flex
                                mt={2}
                                ml={2}
                                direction={"column"}
                            > {/* Since currently, nobody will have activities, just show them all, In the future we should let users configure how many they can see, but default to 1*/}
                                {user.activities.map((activity, index) => (
                                    <ActivityItem key={index} activity={activity} index={index} />
                                ))}
                            </Flex>
                        </>
                    )}

                    {member && (<>
                        <Divider mt={2} />
                        <Text
                            mt={2}
                            fontWeight={"bold"}
                            fontSize={"medium"}
                            userSelect={"none"}
                        >{roles.length === 1 ? "No Roles" : roles.length === 2 ? "Role" : "Roles"}</Text>
                        <Flex
                            mt={2}
                            ml={2}
                            direction={"row"}
                            wrap={"wrap"}
                        >
                            {roles.map((role, index) => (
                                role.id === role.guildId ? null : (
                                    <Flex key={index} alignItems={"center"} mt={1} mr={2}>
                                        <Box
                                            outline={"1px solid"}
                                            outlineColor={"gray.500"}
                                            borderRadius={"5px"}
                                            p={0.5}
                                            display={"flex"}
                                            alignItems={"center"}
                                            _hover={{ bg: hoverBg }}
                                        >
                                            <Box
                                                boxSize={3}
                                                borderRadius={"full"}
                                                bg={role.hexColor}
                                                ml={1}
                                            />
                                            <Text
                                                ml={1}
                                                mr={1}
                                                fontSize={"xs"}
                                                color={"gray.300"}
                                            >
                                                {role.name}
                                            </Text>
                                        </Box>
                                    </Flex>
                                )
                            ))}
                        </Flex>
                    </>)}

                </Flex>
            </PopoverBody>
        </PopoverContent>
    );
};

export default UserPopOver;