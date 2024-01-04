import { useRecoilState } from "recoil";
import { currentGuild } from "@/utils/stores.ts";
import {
  Badge,
  Box,
  Center,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GuildMember } from "@kastelll/wrapper";

const GuildMembers = () => {
  const [guild] = useRecoilState(currentGuild);
  const [members, setMembers] = useState<GuildMember[]>([]);

  useEffect(() => {
    if (!guild?.members) return;

    setMembers(guild?.members.toArray());
  }, [guild?.members]);

  const avatars = [
    "/icon.png",
    "/icon-1.png",
    "/icon-2.png",
    "/icon-3.png",
    "/icon-4.png",
  ];

  return guild ? (
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
                        member?.user?.presence === "online"
                          ? "green.500"
                          : member?.user?.presence === "idle"
                            ? "yellow.500"
                            : member?.user?.presence === "dnd"
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
            <PopoverContent>
              <PopoverBody>
                <Center>
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
                        member?.user?.presence === "online"
                          ? "green.500"
                          : member?.user?.presence === "idle"
                            ? "yellow.500"
                            : member?.user?.presence === "dnd"
                              ? "red.500"
                              : "gray.500"
                      }
                      position="absolute"
                      bottom="-0.5"
                      right="-0.5"
                    />
                  </Box>

                  <Text ml={2} mt={1}>
                    {member?.user?.username}#{member?.user?.discriminator}
                  </Text>
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      ))}
    </Box>
  ) : null;
};

export default GuildMembers;
