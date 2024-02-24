import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";
import getChannelName from "@/utils/getChannelName.ts";
import { clientStore, collapsedChannels } from "@/utils/stores.ts";
import { Flex, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import ChannelIcon from "./channelIcon.tsx";

const RawChannel = ({ channel }: { channel: BaseChannel; }) => {
    const [collapsedChannelsList] = useRecoilState(collapsedChannels);

    return (
        <>
            <Flex ml={channel.parentId ? 1 : 0}>
                <ChannelIcon channel={channel} />

                {channel.isCategory() && (
                    <Flex cursor={"pointer"}>
                        <Text color={"gray.300"}>
                            {getChannelName(channel?.name)}
                        </Text>
                        <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 0.72 0.72"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                transform: collapsedChannelsList.includes(
                                    channel.id,
                                )
                                    ? "rotate(270deg)"
                                    : "rotate(360deg)",
                                marginTop: "4px",
                                transition: "transform 0.3s ease-in-out",
                            }}
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

                {channel.type !== constants.channelTypes.GuildCategory && (
                    <Text color={"gray.300"} ml={1}>
                        {getChannelName(channel?.name)}
                    </Text>
                )}
            </Flex>
        </>
    );
};

const Channel = ({ channel, onClick }: { channel: BaseChannel; onClick?: () => void; }) => {
    const [client] = useRecoilState(clientStore);

    return (
        <Flex
            py={1}
            ml={5}
            key={channel?.id}
            bg={
                channel?.id === client.currentChannel?.id
                    ? "gray.800"
                    : ""
            }
            rounded="10px"
            userSelect={"none"}
            cursor={"pointer"}
            _hover={channel.isCategory() ? {} : {
                bg: "gray.700",
            }}
            onClick={onClick}
            maxW={"85%"}
        >
            <div>
                <Flex>
                    <RawChannel channel={channel} />
                </Flex>
            </div>
        </Flex>
    );
};

export default Channel;