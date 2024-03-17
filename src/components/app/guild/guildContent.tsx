import {
  Box,
  Divider,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddIcon,
  // AddIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import React, { ReactNode, useEffect, useState } from "react";
import {
  useCollapsedChannels,
  useReadyStore,
} from "@/utils/stores";
import { sortChannels } from "@/utils/sortChannels";
import GuildSettings from "@/components/app/guild/settings";
import GuildInvites from "@/components/app/guild/invites";
import GuildMembers from "@/components/app/guild/members.tsx";
import { IoPeople } from "react-icons/io5";
import CreateChannel from "@/components/app/guild/createChannel.tsx";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import Channel from "./channels/index.tsx";
import ChannelIcon from "./channels/channelIcon.tsx";
import constants from "$/utils/constants.ts";
import Link from "next/link";
import { useChannelStore, useGuildStore, useMemberStore, useRoleStore, useSettingsStore, useUserStore } from "$/utils/Stores.ts";
import PermissionHandler from "$/Client/Structures/BitFields/PermissionHandler.ts";

const GuildContent = ({ children, noMemberBar, noChannelTopic, ignoreLimits }: { children?: ReactNode, noMemberBar?: boolean; noChannelTopic?: boolean; ignoreLimits?: boolean; }) => {
  const ready = useReadyStore();
  const { getCurrentChannel, getCurrentChannels } = useChannelStore();
  const { getCurrentGuild } = useGuildStore();
  const { getCurrentMember } = useMemberStore();
  const { getCurrentRoles } = useRoleStore();
  const currentChannel = getCurrentChannel();
  const currentGuild = getCurrentGuild();
  const channels = getCurrentChannels();
  const currentMember = getCurrentMember();
  const currentRoles = getCurrentRoles();
  const [permissions, setPermissionHandler] = useState<PermissionHandler>();
  const { settings } = useSettingsStore();
  const { collapsedChannels, setCollapsedChannels } = useCollapsedChannels();
  const [sortedChannelGroups, setSortedChannelGroups] = useState<BaseChannel[]>(
    [],
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const background = useColorModeValue("#e6e9ef", "#101319");
  const {
    isOpen: settingsIsOpen,
    onOpen: settingsOnOpen,
    onClose: settingsOnClose,
  } = useDisclosure();
  const {
    isOpen: invitesIsOpen,
    onOpen: invitesOnOpen,
    onClose: invitesOnClose,
  } = useDisclosure();
  const {
    isOpen: createChannelIsOpen,
    onOpen: createChannelOnOpen,
    onClose: createChannelOnClose,
  } = useDisclosure();

  const { users } = useUserStore();

  useEffect(() => {
    if (!currentMember || !currentGuild || currentRoles.length === 0) return;
    const newPermHandler = new PermissionHandler(
      currentMember.userId,
      currentMember.owner ?? currentMember.coOwner,
      currentMember.roleIds.map((id) => currentRoles.find((role) => role.id === id)!),
      channels
    );

    setPermissionHandler(newPermHandler);
  }, [currentGuild, currentMember]);

  useEffect(() => {
    if (currentGuild) {
      const clientUser = users.find((u) => u.isClient)!;
      const roles = currentRoles.filter((role) => currentMember?.roleIds.includes(role.id));
      const permissionHandler = new PermissionHandler(clientUser.id, currentMember?.owner ?? false, roles, channels);
      const channelsWeHaveReadAccessTo = channels.filter((channel) => permissionHandler.hasChannelPermission(channel.id, ["ViewMessageHistory"]));

      setSortedChannelGroups(sortChannels(channelsWeHaveReadAccessTo));
    }
  }, [currentGuild]);

  return ready ? (
    <>
      <GuildSettings isOpen={settingsIsOpen} onClose={settingsOnClose} />
      <GuildInvites isOpen={invitesIsOpen} onClose={invitesOnClose} />
      <CreateChannel
        isOpen={createChannelIsOpen}
        onClose={createChannelOnClose}
      />
      <Flex height="100vh" ml={settings.navBarLocation === "left" ? "60px" : ""}>
        <Box
          bg={background}
          pb="10"
          overflowX="hidden"
          color="inherit"
          w={"200px"}
        >
          <Flex px="4" py="5" align="center">
            <Menu matchWidth>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    fontSize="2xl"
                    fontWeight="semibold"
                    overflow="hidden"
                    borderBottomColor={borderColor}
                    borderBottomWidth="1px"
                    w="full"
                  >
                    <HStack>
                      <Text fontSize="small" isTruncated>
                        {currentGuild?.name ?? "Loading"}
                      </Text>
                      <Spacer />
                      {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </HStack>
                  </MenuButton>

                  <MenuList>
                    {permissions?.hasAnyRole(
                      [
                        "ServerName",
                        "ServerDescription",
                        "ServerIcon",
                        "MaintenanceToggle",
                        "AddBots",
                        "ViewAuditLog",
                        "ManageVanity",
                      ]
                    ) && (
                        <MenuItem
                          onClick={settingsOnOpen}
                          icon={<SettingsIcon />}
                        >
                          Guild Settings
                        </MenuItem>
                      )}

                    {permissions?.hasAnyRole(["CreateChannel"]) && (
                      <MenuItem
                        onClick={createChannelOnOpen}
                        icon={<AddIcon />}
                      >
                        Create Channel
                      </MenuItem>
                    )}

                    <MenuItem onClick={invitesOnOpen} icon={<IoPeople />}>
                      Invite Friends
                    </MenuItem>
                    <MenuItem icon={<BellIcon />}>Notifications</MenuItem>
                    {!currentMember?.owner && (
                      <>
                        <MenuDivider />
                        <MenuItem icon={<DeleteIcon color={"red.500"} />}>
                          <Text color={"red.500"}>Leave Server</Text>
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>

          <Flex
            direction="column"
            as="nav"
            fontSize="sm"
            color="gray.600"
            aria-label="Main Navigation"
          >
            {sortedChannelGroups.map((channel, index) => {
              if (collapsedChannels.includes(channel.parentId ?? "")) return null;
              return (
                <Box key={index}>
                  {channel.type !== constants.channelTypes.GuildCategory ? (
                    <Link
                      href={`/app/guilds/${channel.guildId}/channels/${channel.id}`}
                    >
                      <Channel channel={channel} key={channel.id} />
                    </Link>
                  ) : (
                    <Channel channel={channel} onClick={() => {
                      const shouldAddOrRemove = !collapsedChannels.includes(channel.id);

                      setCollapsedChannels(
                        shouldAddOrRemove
                          ? [...collapsedChannels, channel.id]
                          : collapsedChannels.filter((id) => id !== channel.id),
                      );


                    }} key={channel.id} />
                  )}
                </Box>
              );
            })}
          </Flex>
        </Box>

        {/* Main content */}

        <Box flex="1" justifyContent="center" userSelect={"none"}>
          {!noChannelTopic && (
            <Box pos="sticky" top={0} zIndex={10} bg={background} p={2} display="flex" alignItems="center">
              <ChannelIcon channel={currentChannel!} />
              <Text>{currentChannel?.name}</Text>
              {currentChannel?.description && (
                <>
                  <Divider orientation="vertical" h="20px" ml={3} />
                  <Text ml={3} fontSize={"small"} color={"gray.400"} cursor={"pointer"}>{currentChannel?.description}</Text>
                </>
              )}

            </Box>
          )}

          {/* todo: let users configure this */}
          {!ignoreLimits ? (
            <Box maxHeight={settings.navBarLocation === "bottom" ? "calc(100vh - 170px)" : ""} px={2} id="scrollable-div">
              {children}
            </Box>
          ) : (
            <Box px={2} id="scrollable-div">
              {children}
            </Box>
          )}
        </Box>

        {/* Right side */}
        {!noMemberBar && (
          <Box
            bg={background}
            pb="10"
            color="inherit"
            w={"200px"}
          >
            <GuildMembers />
          </Box>
        )}
      </Flex>
    </>
  ) : null;
};

export default GuildContent;
