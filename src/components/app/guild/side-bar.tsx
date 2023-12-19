import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
import { sortChannels } from "@/utils/sortChannels";
import GuildSettings from "@/components/app/guild/settings";
import GuildInvites from "@/components/app/guild/invites";
import { BaseChannel } from "@kastelll/wrapper";

const GuildSideBar = () => {
  const [guild] = useRecoilState(currentGuild);
  const [ready] = useRecoilState(readyStore);
  const [collapsedChannelsList] = useRecoilState(collapsedChannels);
  const [sortedChannelGroups, setSortedChannelGroups] = useState<BaseChannel[]>([]);
  const [currentChannelStore] = useRecoilState(currentChannel);
  const [canAccessSettings, setAccessSettings] = useState(false);
  const borderColor = useColorModeValue("gray.200", "gray.700");
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

  const getGuildName = (name: string) => {
    if (name.length > 12) {
      return name.slice(0, 12);
    } else {
      return name;
    }
  };

  const getChannelName = (name: string) => {
    if (name.length > 18) {
      return name.slice(0, 18) + "...";
    } else {
      return name;
    }
  };

  useEffect(() => {
    if (guild) {
      setSortedChannelGroups(sortChannels(guild.channels));

      const canAccess = guild.permissions.hasAnyRole("ManageGuild");

      setAccessSettings(canAccess);
    }
  }, [currentGuild, guild]);

  return ready ? (
    <>
      <GuildSettings isOpen={settingsIsOpen} onClose={settingsOnClose} />
      <GuildInvites isOpen={invitesIsOpen} onClose={invitesOnClose} />
      <Flex height="100vh">
        <Box
          pb="10"
          overflowX="hidden"
          overflowY="scroll"
          color="inherit"
          borderRightWidth="1px"
          borderRightColor={borderColor}
          w={"200px"}
        >
          <Flex px="4" py="5" align="center">
            <Menu matchWidth>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    fontSize="2xl"
                    color="brand.500"
                    _dark={{ color: "white" }}
                    fontWeight="semibold"
                    justifyContent="space-between"
                    overflow="hidden"
                  >
                    <HStack>
                      <Text isTruncated>
                        {getGuildName(guild?.name || "Loading")}
                      </Text>
                      {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    {canAccessSettings && (
                      <MenuItem
                        onClick={settingsOnOpen}
                        icon={<SettingsIcon />}
                      >
                        Guild Settings
                      </MenuItem>
                    )}

                    <MenuItem onClick={invitesOnOpen} icon={<AddIcon />}>
                      Invite Friends
                    </MenuItem>
                    <MenuItem icon={<BellIcon />}>Notifications</MenuItem>
                    {!guild?.owner && (
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
            <div>
              {sortedChannelGroups ? sortedChannelGroups.map((channel) => {
                if (collapsedChannelsList.includes(channel.parentId ?? ""))
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
                    <div
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
                  </Flex>
                );
              })
                : null}
            </div>
          </Flex>
        </Box>
      </Flex>
    </>
  ) : null;
};

export default GuildSideBar;