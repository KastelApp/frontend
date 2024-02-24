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
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  // AddIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import React, { ReactNode, useEffect, useState } from "react";
import {
  clientStore,
  collapsedChannels,
  readyStore,
} from "@/utils/stores";
import { useRecoilState } from "recoil";
import { sortChannels } from "@/utils/sortChannels";
import GuildSettings from "@/components/app/guild/settings";
import GuildInvites from "@/components/app/guild/invites";
import GuildMembers from "@/components/app/guild/members.tsx";
import GuildMessageContainer from "@/components/app/guild/messageContainer.tsx";
import { IoPeople } from "react-icons/io5";
import CreateChannel from "@/components/app/guild/createChannel.tsx";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import getGuildName from "@/utils/getGuildName.ts";
import Channel from "./channels/index.tsx";
import ChannelIcon from "./channels/channelIcon.tsx";
import constants from "$/utils/constants.ts";
import Link from "next/link";

const GuildSideBar = ({ children, noMemberBar, noTextBox, noChannelTopic }: { children?: ReactNode, noMemberBar?: boolean; noTextBox?: boolean; noChannelTopic?: boolean; }) => {
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [collapsedChannelsList, setCollapsedChannelsList] = useRecoilState(collapsedChannels);
  const [sortedChannelGroups, setSortedChannelGroups] = useState<BaseChannel[]>(
    [],
  );
  const [canAccessSettings, setAccessSettings] = useState(false);
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
    // onOpen: createChannelOnOpen,
    onClose: createChannelOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (client.currentGuild) {
      setSortedChannelGroups(sortChannels(client.currentGuild.channels));

      // const canAccess = guild.permissions.hasAnyRole("ManageGuild");

      setAccessSettings(false);
    }
  }, [client.currentGuild]);

  return ready ? (
    <>
      <GuildSettings isOpen={settingsIsOpen} onClose={settingsOnClose} />
      <GuildInvites isOpen={invitesIsOpen} onClose={invitesOnClose} />
      <CreateChannel
        isOpen={createChannelIsOpen}
        onClose={createChannelOnClose}
      />
      <Flex height="100vh">
        <Box
          bg={background}
          pb="10"
          overflowX="hidden"
          overflowY="scroll"
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
                  >
                    <HStack>
                      <Text fontSize={"medium"}>
                        {getGuildName(client.currentGuild?.name ?? "Loading")}
                      </Text>
                      {/* todo: make this on the left */}
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

                    {/* {guild.permissions.hasAnyRole("ManageChannels") && (
                      <MenuItem
                        onClick={createChannelOnOpen}
                        icon={<AddIcon />}
                      >
                        Create Channel
                      </MenuItem>
                    )} */}

                    <MenuItem onClick={invitesOnOpen} icon={<IoPeople />}>
                      Invite Friends
                    </MenuItem>
                    <MenuItem icon={<BellIcon />}>Notifications</MenuItem>
                    {!client.currentGuild?.owner && (
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
              if (collapsedChannelsList.includes(channel.parentId ?? "")) return null;
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
                      setCollapsedChannelsList((old) => {
                        if (old.includes(channel.id)) {
                          return old.filter((id) => id !== channel.id);
                        }

                        return [...old, channel.id];
                      });
                    }} key={channel.id} />
                  )}
                </Box>
              );
            })}
          </Flex>
        </Box>

        {/* Main content */}

        <Box flex="1" justifyContent="center" maxWidth="calc(100% - 400px)" userSelect={"none"}>
          {!noChannelTopic && (
            <Box pos="sticky" top={0} zIndex={10} bg={background} p={2} display="flex" alignItems="center">
              <ChannelIcon channel={client.currentChannel!} />
              <Text>{client.currentChannel?.name}</Text>
              {client.currentChannel?.description && (
                <>
                  <Divider orientation="vertical" h="20px" ml={3} />
                  <Text ml={3} fontSize={"small"} color={"gray.400"} cursor={"pointer"}>{client.currentChannel?.description}</Text>
                </>
              )}

            </Box>
          )}

          <Box maxHeight="calc(100vh - 150px)" overflowY="auto" px={2}>
            {children}
          </Box>

          {!noTextBox && (
            <GuildMessageContainer />
          )}
        </Box>

        {/* Right side */}
        {!noMemberBar && (
          <Box
            bg={background}
            pb="10"
            overflowX="hidden"
            overflowY="scroll"
            color="inherit"
            w={"200px"}
            zIndex={20}
          >
            <GuildMembers />
          </Box>
        )}
      </Flex>
    </>
  ) : null;
};

export default GuildSideBar;
