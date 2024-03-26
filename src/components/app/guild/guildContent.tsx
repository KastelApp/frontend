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
import React, { ReactNode, useEffect, useState } from "react";
import { useCollapsedChannels, useReadyStore } from "@/utils/stores";
import { sortChannels } from "@/utils/sortChannels";
import GuildSettings from "@/components/app/guild/settings";
import GuildInvites from "@/components/app/guild/invites";
import GuildMembers from "@/components/app/guild/members.tsx";
import CreateChannel from "@/components/app/guild/createChannel.tsx";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import Channel from "./channels/index.tsx";
import ChannelIcon from "./channels/channelIcon.tsx";
import constants from "$/utils/constants.ts";
import Link from "next/link";
import {
  useChannelStore,
  useGuildStore,
  useMemberStore,
  useRoleStore,
  useSettingsStore,
  useUserStore,
} from "$/utils/Stores.ts";
import PermissionHandler from "$/Client/Structures/BitFields/PermissionHandler.ts";
import { Bell, ChevronDown, ChevronUp, LogOut, Plus, Settings, Users } from "lucide-react";

const GuildContent = ({
  children,
  noMemberBar,
  noChannelTopic,
  ignoreLimits,
}: {
  children?: ReactNode;
  noMemberBar?: boolean;
  noChannelTopic?: boolean;
  ignoreLimits?: boolean;
}) => {
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
      currentMember.roleIds.map(
        (id) => currentRoles.find((role) => role.id === id)!,
      ),
      channels,
    );

    setPermissionHandler(newPermHandler);
  }, [currentGuild, currentMember]);

  useEffect(() => {
    if (currentGuild) {
      const clientUser = users.find((u) => u.isClient)!;
      const roles = currentRoles.filter((role) =>
        currentMember?.roleIds.includes(role.id),
      );
      const permissionHandler = new PermissionHandler(
        clientUser.id,
        currentMember?.owner ?? false,
        roles,
        channels,
      );
      const channelsWeHaveReadAccessTo = channels.filter((channel) =>
        permissionHandler.hasChannelPermission(channel.id, [
          "ViewMessageHistory",
        ]),
      );

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
      <Flex
        height="100vh"
        ml={settings.navBarLocation === "left" ? "60px" : ""}
      >
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
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </HStack>
                  </MenuButton>

                  <MenuList>
                    {permissions?.hasAnyRole([
                      "ServerName",
                      "ServerDescription",
                      "ServerIcon",
                      "MaintenanceToggle",
                      "AddBots",
                      "ViewAuditLog",
                      "ManageVanity",
                    ]) && (
                      <MenuItem
                        onClick={settingsOnOpen}
                        icon={<Settings size={"1.25em"} />}
                      >
                        Guild Settings
                      </MenuItem>
                    )}

                    {permissions?.hasAnyRole(["CreateChannel"]) && (
                      <MenuItem
                        onClick={createChannelOnOpen}
                        icon={<Plus size={"1.25em"} />}
                      >
                        Create Channel
                      </MenuItem>
                    )}

                    <MenuItem onClick={invitesOnOpen} icon={<Users size={"1.25em"} />}>
                      Invite Friends
                    </MenuItem>
                    <MenuItem icon={<Bell size={"1.25em"} />}>Notifications</MenuItem>
                    {!currentMember?.owner && (
                      <>
                        <MenuDivider />
                        <MenuItem icon={<LogOut size={"1.25em"} color={"#E53E3E"} />}>
                          <Text mb={1} color={"red.500"}>Leave Server</Text>
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
              if (collapsedChannels.includes(channel.parentId ?? ""))
                return null;
              return (
                <Box key={index}>
                  {channel.type !== constants.channelTypes.GuildCategory ? (
                    <Link
                      href={`/app/guilds/${channel.guildId}/channels/${channel.id}`}
                    >
                      <Channel channel={channel} key={channel.id} />
                    </Link>
                  ) : (
                    <Channel
                      channel={channel}
                      onClick={() => {
                        const shouldAddOrRemove = !collapsedChannels.includes(
                          channel.id,
                        );

                        setCollapsedChannels(
                          shouldAddOrRemove
                            ? [...collapsedChannels, channel.id]
                            : collapsedChannels.filter(
                                (id) => id !== channel.id,
                              ),
                        );
                      }}
                      key={channel.id}
                    />
                  )}
                </Box>
              );
            })}
          </Flex>
        </Box>

        {/* Main content */}

        <Box flex="1" justifyContent="center" userSelect={"none"} flexDirection="column">
          {!noChannelTopic && (
            <Box
              pos="sticky"
              top={0}
              zIndex={10}
              bg={background}
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <ChannelIcon channel={currentChannel!} />
                <Text>{currentChannel?.name}</Text>
                {currentChannel?.description && (
                    <>
                      <Divider orientation="vertical" h="20px" ml={3} />
                      <Text
                          ml={3}
                          fontSize={"small"}
                          color={"gray.400"}
                          cursor={"pointer"}
                      >
                        {currentChannel?.description}
                      </Text>
                    </>
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <Users onClick={() => console.log("show members: " + noMemberBar)} />
              </Box>
            </Box>
          )}

          {/* todo: let users configure this */}
          {!ignoreLimits ? (
            <Box
              maxHeight={
                settings.navBarLocation === "bottom"
                  ? "calc(100vh - 170px)"
                  : ""
              }
              px={2}
              id="scrollable-div"
            >
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
          <Box bg={background} pb="10" color="inherit" w={"200px"}>
            <GuildMembers />
          </Box>
        )}
      </Flex>
    </>
  ) : null;
};

export default GuildContent;
