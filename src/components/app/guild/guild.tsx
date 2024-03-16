import { Box, Flex, Image, Tooltip, useColorModeValue } from "@chakra-ui/react";
import getInitials from "../../../utils/getGuildInitals.ts";
import NextLink from "next/link";
import GuildClass from "$/Client/Structures/Guild/Guild.ts";
import { useChannelStore, useMemberStore, useRoleStore, useUserStore } from "$/utils/Stores.ts";
import { useLastChannelCache } from "@/utils/stores.ts";
import { useEffect, useState } from "react";
import PermissionHandler from "$/Client/Structures/BitFields/PermissionHandler.ts";
import { useRouter } from "next/router";

const Guild = ({ guild, type }: { guild: GuildClass; type: "left" | "bottom"; }) => {
  const router = useRouter();
  const { guildId } = router.query as {
    guildId: string;
    channelId: string;
  };
  const { lastChannelCache, setLastChannelCache } = useLastChannelCache();
  const [channelId, setChannelId] = useState<string | null>(null);
  const { users } = useUserStore();
  const { roles } = useRoleStore();
  const { members } = useMemberStore();
  const { channels } = useChannelStore();

  useEffect(() => {
    const clientUser = users.find((u) => u.isClient)!;
    const currentMember = members.find((m) => m.userId === clientUser.id && m.guildId === guild.id)!;

    if (!currentMember || !clientUser) {
      return;
    }

    const memberRoles = roles.filter((role) => currentMember?.roleIds.includes(role.id));

    console.log(memberRoles)

    const permissionHandler = new PermissionHandler(clientUser.id, currentMember.owner || currentMember.coOwner, memberRoles, channels.filter((channel) => channel.guildId === guild.id));
    const channelsWeHaveReadAccessTo = channels.filter((channel) => channel.guildId === guild.id && permissionHandler.hasChannelPermission(channel.id, ["ViewMessageHistory"]));

    if (lastChannelCache[guild.id] && channelsWeHaveReadAccessTo.find((channel) => channel.id === lastChannelCache[guild.id])) {
      setChannelId(lastChannelCache[guild.id]);
    } else {
      const channel = channelsWeHaveReadAccessTo.find((channel) => !channel.isCategory());
      if (channel) {
        setLastChannelCache({ ...lastChannelCache, [guild.id]: channel.id });
        setChannelId(channel.id);
      }
    }
  }, [roles, members, channels, roles]);

  const color = useColorModeValue("gray.700", "gray.200");
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip label={guild.name} aria-label={guild.name} placement="auto">
      <NextLink href={`/app/guilds/${guild.id}/channels${channelId ? `/${channelId}` : ""}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Box position="relative">
          <Box display="inline-block" marginRight={2}>
            <Flex
              overflow={"hidden"}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bg={useColorModeValue("gray.200", "gray.700")}
              rounded={"50px"}
              w={"40px"}
              h={"40px"}
              textAlign="center"
              _hover={{
                bg: useColorModeValue("gray.300", "gray.600"),
              }}
            >
              {guild.icon ? (
                <Image
                  color={color}
                  src={"/icon-1.png"}
                  alt={getInitials(guild.name)}
                  userSelect={"none"}
                  borderRadius={"full"}
                  fit="cover"
                  draggable={"false"}
                />
              ) : (
                <Box userSelect={"none"} color={color} fontSize="xl" fontWeight="bold">
                  {getInitials(guild.name)}
                </Box>
              )}
            </Flex>
          </Box>
          {type === "bottom" ? (<Box
            position="absolute"
            bottom="0"
            left={guildId === guild.id ? "11px" : "15px"}
            right="0"
            w={guildId === guild.id ? "16px" : "8px"}
            bg="white"
            h="4px"
            rounded="4px"
          />) : <Box
            position="absolute"
            bottom="18px"
            // left={guildId === guild.id ? "11px" : "15px"}
            left={guildId === guild.id ? "-5" : hovered ? "-4" : "-3"}
            right="0"
            w={guildId === guild.id ? "24px" : hovered ? "16px" : "8px"}
            bg="white"
            h="4px"
            rounded="4px"
            // rotate it 90 degrees
            transform={"rotate(90deg)"}
          />}
        </Box>
      </NextLink>
    </Tooltip>

  );
};

export default Guild;
