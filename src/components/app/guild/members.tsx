import { useRecoilState } from "recoil";
import {
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
import { useEffect, useState } from "react";
import { clientStore } from "@/utils/stores.ts";
import Member from "$/Client/Structures/Guild/Member.ts";

const GuildMembers = () => {
  const [client] = useRecoilState(clientStore);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!client.currentGuild?.members) return;

    setMembers(client.currentGuild.members);
  }, [client.currentGuild?.members]);

  const avatars = [
    "/icon.png",
    "/icon-1.png",
    "/icon-2.png",
    "/icon-3.png",
    "/icon-4.png",
  ];

  return client.currentGuild ? (
    <Box mt={5}>
      <Text ml={3}>
        {members?.length === 1 ? "Member" : "Members"} - {members?.length}
      </Text>
      {members?.map((member, index) => (
        <Box key={index}>
          <Popover placement={"left"}>
            <PopoverTrigger>
              <Flex
                _hover={{
                  bg: "gray.700",
                  rounded: "10px",
                  cursor: "pointer",
                }}
                mt={2}
                ml={2}
                mr={2}
              >
                <Box ml={2} display="flex" alignItems="center" py={1}>
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
                      src={member?.user?.getAvatarUrl({ size: 128 }) ?? ""}
                      fallbackSrc={
                        avatars[
                          Number(
                            BigInt(member?.user?.id || 1) %
                              BigInt(avatars.length),
                          )
                        ] || "/icon-1.png"
                      }
                      alt={member?.user?.username || "loading"}
                      fit="cover"
                    />
                    <Badge
                      boxSize="3"
                      borderRadius="full"
                      bg={
                        member?.user?.currentPresence === "online"
                          ? "green.500"
                          : member?.user?.currentPresence === "idle"
                            ? "yellow.500"
                            : member?.user?.currentPresence === "dnd"
                              ? "red.500"
                              : "gray.500"
                      }
                      position="absolute"
                      bottom="-0.5"
                      right="-0.5"
                    />
                  </Box>
                </Box>
                <Text ml={2} mt={1}>
                  {member?.user?.username}
                </Text>
              </Flex>
            </PopoverTrigger>
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
                      src={member?.user?.getAvatarUrl({ size: 128 }) ?? ""}
                      fallbackSrc={
                        avatars[
                          Number(
                            BigInt(member?.user?.id || 1) %
                              BigInt(avatars.length),
                          )
                        ] || "/icon-1.png"
                      }
                      alt={member?.user?.username || "loading"}
                      fit="cover"
                    />
                    <Badge
                      boxSize="5"
                      borderRadius="full"
                      bg={
                        member?.user?.currentPresence === "online"
                          ? "green.500"
                          : member?.user?.currentPresence === "idle"
                            ? "yellow.500"
                            : member?.user?.currentPresence === "dnd"
                              ? "red.500"
                              : "gray.500"
                      }
                      position="absolute"
                      bottom="-0.5"
                      right="-0.5"
                    />
                  </Box>

                  <Text ml={2} mt={3}>
                    {member?.user?.fullUsername}
                  </Text>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      ))}
    </Box>
  ) : null;
};

export default GuildMembers;
