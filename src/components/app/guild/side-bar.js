import {
  Box,
  Text,
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import {
  BellIcon,
  ChevronDownIcon,
  DeleteIcon,
  SettingsIcon,
} from "@chakra-ui/icons";

export default function GuildSideBar({ guild }) {
  function getGuildName(name) {
    if (name.length > 12) {
      return name.slice(0, 12) + "...";
    } else {
      return name;
    }
  }

  function getChannelName(name) {
    if (name.length > 18) {
      return name.slice(0, 18) + "...";
    } else {
      return name;
    }
  }

  console.log("side", guild);

  return (
    <>
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex={-1}
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        color="inherit"
        borderRightWidth="1px"
        w="60"
      >
        <Flex px="4" py="5" align="center">
          <Menu as={Button}>
            <MenuButton>
              <Text
                fontSize="2xl"
                ml="2"
                color="brand.500"
                _dark={{
                  color: "white",
                }}
                fontWeight="semibold"
              >
                {getGuildName(guild?.name || "Loading")}
                <ChevronDownIcon ml={5} />
              </Text>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
              <MenuItem icon={<SettingsIcon />}>Invite</MenuItem>
              <MenuItem icon={<BellIcon />}>Notifications</MenuItem>
              <MenuItem icon={<DeleteIcon />}>Leave</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          {guild?.Channels &&
            guild.Channels.map((channel) => {
              return (
                <Button
                  key={channel.id}
                  as="a"
                  href={`/app/guilds/${guild?.id}/channels/${channel.id}`}
                  variant="ghost"
                  color="current"
                  fontWeight="normal"
                  borderRadius="none"
                  _hover={{ bg: "gray.700" }}
                  _activeLink={{
                    bg: "gray.700",
                    color: "white",
                    fontWeight: "semibold",
                  }}
                  px="4"
                  py="3"
                  mb="1"
                  ml="2"
                  fontSize="sm"
                  justifyContent="flex-start"
                  w="full"
                >
                  <Text
                    as="span"
                    ml="2"
                    color="brand.500"
                    _dark={{
                      color: "white",
                    }}
                    fontWeight="semibold"
                  >
                    {getChannelName(channel.name)}
                  </Text>
                </Button>
              );
            })}
        </Flex>
      </Box>
    </>
  );
}
