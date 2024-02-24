import Member from "$/Client/Structures/Guild/Member.ts";
import User from "$/Client/Structures/User.ts";
import { Badge, Box, Divider, Flex, Image, PopoverBody, PopoverContent, Text } from "@chakra-ui/react";
import { useState } from "react";

const PopOver = ({ user, member }: { user: User<boolean>, member?: Member; }) => {
    const [copied, setCopied] = useState(false);

    return (
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
                    >
                        <Text cursor={"pointer"} as={"span"} onClick={() => {
                            navigator.clipboard.writeText(user.displayUsername);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1000);
                        }}
                        >
                            {user.displayUsername}
                        </Text>
                        <Text
                            display={"inline"}
                            ml={1}
                            color={"green.500"}
                            fontSize={"sm"}
                            as={"span"}
                        >
                            {copied ? "Copied!" : ""}
                        </Text>
                    </Text>
                    <Text
                        fontSize="smaller"
                        fontWeight={"450"}
                        cursor={"auto"}
                        userSelect={"text"}
                    >{user.fullUsername}</Text>
                    <Text
                        fontSize="sm"
                        mt={2}
                        color={"gray.400"}
                        ml={2}
                        cursor={"auto"}
                        userSelect={"text"}
                    >This is my custom status</Text>
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
                    {member && (<>
                        <Divider mt={2} />
                        <Text
                            mt={2}
                            fontWeight={"bold"}
                            fontSize={"medium"}
                            userSelect={"none"}
                        >{member.roles.length === 1 ? "No Roles" : member.roles.length === 2 ? "Role" : "Roles"}</Text>
                    </>)}
                </Flex>
            </PopoverBody>
        </PopoverContent>
    );
};

export default PopOver;