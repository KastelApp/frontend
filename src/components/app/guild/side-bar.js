import {
  Box,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";

import {
  BellIcon,
  ChevronDownIcon,
  DeleteIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import {
  collapsedChannels,
  currentChannel,
  currentGuild,
  readyStore,
} from "@/utils/stores";
import { useRecoilState } from "recoil";
import NextLink from "next/link";
import { SortChannels } from "@/utils/sortChannels";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import GuildSettings from "@/components/app/guild/settings";
import GuildInvites from "@/components/app/guild/invites";

export default function GuildSideBar() {
  const [guild] = useRecoilState(currentGuild);
  const [ready] = useRecoilState(readyStore);
  const [collapsedChannelsList] = useRecoilState(collapsedChannels);
  const [sortedChannelGroups, setSortedChannelGroups] = useState(null);
  const [currentChannelStore] = useRecoilState(currentChannel);
  const [canAccessSettings, setAccessSettings] = useState(false);

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

  function getGuildName(name) {
    if (name.length > 10) {
      return name.slice(0, 10);
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

  useEffect(() => {
    if (guild) {
      setSortedChannelGroups(SortChannels(guild.channels));

      const canAccess = guild.permissions.hasAnyRole("ManageGuild");

      console.log(canAccess);

      setAccessSettings(canAccess);
    }
  }, [currentGuild, guild]);

  return ready ? (
    <>
      <GuildSettings isOpen={settingsIsOpen} onClose={settingsOnClose} />
      <GuildInvites isOpen={invitesIsOpen} onClose={invitesOnClose} />
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex={-1}
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="scroll"
        color="inherit"
        borderRightWidth="1px"
        borderRightColor="gray.700"
        w={"191px"}
      >
        <Flex px="4" py="5" align="center">
          <Menu>
            <MenuButton
              as={HStack}
              fontSize="2xl"
              color="brand.500"
              _dark={{ color: "white" }}
              fontWeight="semibold"
              justifyContent="space-between"
              overflow="hidden"
            >
              <Text isTruncated>{getGuildName(guild?.name || "Loading")}</Text>
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              {canAccessSettings && (
                <MenuItem onClick={settingsOnOpen} icon={<SettingsIcon />}>
                  Settings
                </MenuItem>
              )}
              <MenuItem onClick={invitesOnOpen} icon={<SettingsIcon />}>
                Invite
              </MenuItem>
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
          <DragDropContext>
            <Droppable droppableId="list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sortedChannelGroups
                    ? sortedChannelGroups.map((channel, index) => {
                      if (collapsedChannelsList.includes(channel.parentId))
                        return null;
                      return (
                        <Flex
                          py={1}
                          ml={5}
                          key={channel?.id}
                          bg={
                            channel?.id === currentChannelStore?.id
                              ? "brand.500"
                              : ""
                          }
                        >
                          <Draggable
                            draggableId={channel?.id}
                            key={channel?.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Flex>
                                  {channel?.type === "GuildText" && (
                                    <svg
                                      width="20px"
                                      height="20px"
                                      viewBox="0 0 0.72 0.72"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="m0.21 0.57 0.12 -0.42m0.06 0.42 0.12 -0.42m0.06 0.12H0.195m0.33 0.18H0.15"
                                        stroke="#ffff"
                                        strokeWidth="0.06"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}

                                  {channel?.type === "GuildVoice" && (
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M12 2c-4.4 0-8 3.6-8 8v4c0 4.4 3.6 8 8 8s8-3.6 8-8v-4c0-4.4-3.6-8-8-8zm6 12c0 3.3-2.7 6-6 6s-6-2.7-6-6v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4zm-4-4h-2v-4h2v4zm-4 0h-2v-4h2v4zm-3 4h-2v-4h2v4zm-1-6h-2v-4h2v4z"
                                      />
                                    </svg>
                                  )}

                                  {channel?.type === "GuildCategory" && (
                                    <Flex>
                                      <Text color={"white"}>
                                        {getChannelName(channel.name)}
                                      </Text>
                                      <svg
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 0.72 0.72"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                          transform:
                                            collapsedChannelsList.includes(
                                              channel.id,
                                            )
                                              ? "rotate(270deg);"
                                              : "",
                                        }}
                                        className="transform rotate-270 transition-transform duration-250"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0.381 0.441a0.03 0.03 0 0 1 -0.042 0l-0.15 -0.15a0.03 0.03 0 0 1 0.042 -0.042L0.36 0.378l0.129 -0.129a0.03 0.03 0 1 1 0.042 0.042l-0.15 0.15Z"
                                          fill="#fff"
                                        />
                                      </svg>
                                    </Flex>
                                  )}

                                  {channel?.type === "GuildNews" && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#fff"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M3 11l18-5v12L3 14v-3z" />
                                      <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
                                    </svg>
                                  )}

                                  {channel?.type !== "GuildCategory" && (
                                    <NextLink
                                      href={`/app/guilds/${channel?.guildId}/channels/${channel?.id}`}
                                    >
                                      <Text color={"white"}>
                                        {getChannelName(channel?.name)}
                                      </Text>
                                    </NextLink>
                                  )}
                                </Flex>
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}
                        </Flex>
                      );
                    })
                    : null}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Flex>
      </Box>
    </>
  ) : null;
}