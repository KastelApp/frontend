import {
  Badge,
  Box,
  Flex,
  Image,
  Popover,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useGuildStore,
  useMemberStore,
  useRoleStore,
  useUserStore,
} from "$/utils/Stores.ts";
import UserPopOver from "./members/popover.tsx";

const GuildMembers = () => {
  const { getCurrentGuild } = useGuildStore();
  const currentGuild = getCurrentGuild();
  const { getCurrentMembers } = useMemberStore();
  const members = getCurrentMembers();
  const { users } = useUserStore();
  const { getCurrentRoles } = useRoleStore();
  const roles = getCurrentRoles();
  const hoverBg = useColorModeValue("gray.300", "gray.700");

  return currentGuild ? (
    <Box mt={5}>
      <Text ml={3}>
        {members?.length === 1 ? "Member" : "Members"} - {members?.length}
      </Text>
      {members?.map((member, index) => {
        const user = users.find((u) => u.id === member.userId);
        const memberRoles = roles.filter((r) => member.roleIds.includes(r.id));
        const topRole = memberRoles
          .sort((a, b) => b.position - a.position)
          .find((r) => r.color !== 0);

        return (
          <Box key={index}>
            <Popover placement={"left"} isLazy>
              <PopoverTrigger>
                <Flex
                  _hover={{
                    bg: hoverBg,
                    rounded: "10px",
                    cursor: "pointer",
                  }}
                  mt={2}
                  ml={2}
                  mr={2}
                  alignItems={"flex-start"}
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
                        src={user?.getAvatarUrl({ size: 128 }) ?? ""}
                        alt={`${user?.displayUsername}'s avatar`}
                        fit="cover"
                        userSelect={"none"}
                      />
                      <Badge
                        boxSize="3"
                        borderRadius="full"
                        bg={
                          user?.currentPresence === "online"
                            ? "green.500"
                            : user?.currentPresence === "idle"
                              ? "yellow.500"
                              : user?.currentPresence === "dnd"
                                ? "red.500"
                                : "gray.500"
                        }
                        position="absolute"
                        bottom="-0.5"
                        right="-0.5"
                        border="1px solid"
                        borderColor={hoverBg}
                      />
                    </Box>
                  </Box>
                  <Flex direction="column" align="start">
                    <Box>
                      <Text
                        ml={2}
                        userSelect={"none"}
                        color={topRole ? topRole.hexColor : ""}
                        fontWeight={"400"}
                      >
                        {user?.username}
                      </Text>
                    </Box>
                    {user?.customStatus && (
                      <Text
                        ml={2}
                        fontSize="xs"
                        color="gray.500"
                        userSelect={"none"}
                      >
                        {user?.customStatus ?? "No custom status"}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </PopoverTrigger>
              <UserPopOver user={user!} member={member} />
            </Popover>
          </Box>
        );
      })}
    </Box>
  ) : null;
};

export default GuildMembers;
