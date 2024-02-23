import { useRecoilState } from "recoil";
import {
  Badge,
  Box,
  Flex,
  Image,
  Popover,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { clientStore } from "@/utils/stores.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import { memberStore } from "$/utils/Stores.ts";
import PopOver from "./members/popover.tsx";

const GuildMembers = () => {
  const [client] = useRecoilState(clientStore);
  const [rawMembers] = useRecoilState(memberStore);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    setMembers(client.currentGuild!.members);
  }, [rawMembers]);

  return client.currentGuild ? (
    <Box mt={5}>
      <Text ml={3}>
        {members?.length === 1 ? "Member" : "Members"} - {members?.length}
      </Text>
      {members?.map((member, index) => {
        return (
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
                        src={member.user.getAvatarUrl({ size: 128 }) ?? ""}
                        alt={`${member.user.displayUsername}'s avatar`}
                        fit="cover"
                        userSelect={"none"}
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
                        _dark={{
                          border: "1px solid",
                          borderColor: "gray.700"
                        }}
                      />
                    </Box>
                  </Box>
                  <Text ml={2} mt={1}>
                    {member?.user?.username}
                  </Text>
                </Flex>
              </PopoverTrigger>
              <PopOver user={member.user} member={member} />
            </Popover>
          </Box>
        );
      })}
    </Box>
  ) : null;
};

export default GuildMembers;
