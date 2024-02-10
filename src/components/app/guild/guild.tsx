import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import getInitials from "../../../utils/getGuildInitals.ts";
import Image from "next/image";
import NextLink from "next/link";
import GuildClass from "$/Client/Structures/Guild/Guild.ts";

const Guild = ({ guild }: { guild: GuildClass }) => {
  const firstChannel = guild.channels.find((channel) => channel.isTextBased());

  const color = useColorModeValue("gray.700", "gray.200");

  return (
    <NextLink href={`/app/guilds/${guild.id}/channels/${firstChannel?.id}`}>
      <Box>
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
              rounded: "10px",
            }}
          >
            {guild.icon ? (
              <Image
                color={color}
                src={"/icon-1.png"}
                alt={getInitials(guild.name)}
                width={128}
                height={128}
              />
            ) : (
              <Box color={color} fontSize="xl" fontWeight="bold">
                {getInitials(guild.name)}
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    </NextLink>
  );
};

export default Guild;
