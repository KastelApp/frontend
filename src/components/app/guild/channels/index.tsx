import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";
import getChannelName from "@/utils/getChannelName.ts";
import { clientStore, collapsedChannels } from "@/utils/stores.ts";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRecoilState } from "recoil";

const RawChannel = ({ channel }: { channel: BaseChannel; }) => {
    const [collapsedChannelsList, setCollapsedChannelsList] = useRecoilState(collapsedChannels);

    return (
        <>
            <Flex>
                {channel.type === constants.channelTypes.GuildText && (
                    <svg
                        width="18px"
                        height="18px"
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

                {channel.isVoiceBased() && (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12 2c-4.4 0-8 3.6-8 8v4c0 4.4 3.6 8 8 8s8-3.6 8-8v-4c0-4.4-3.6-8-8-8zm6 12c0 3.3-2.7 6-6 6s-6-2.7-6-6v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4zm-4-4h-2v-4h2v4zm-4 0h-2v-4h2v4zm-3 4h-2v-4h2v4zm-1-6h-2v-4h2v4z"
                        />
                    </svg>
                )}

                {channel.type === constants.channelTypes.GuildCategory && (
                    <Flex cursor={"pointer"} onClick={() => {
                        setCollapsedChannelsList((old) => {
                            if (old.includes(channel.id)) {
                                return old.filter((id) => id !== channel.id);
                            }

                            return [...old, channel.id];
                        });
                    }}>
                        <Text color={"white"}>
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

                {channel.type === constants.channelTypes.GuildNews && (
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

                {channel.type !== constants.channelTypes.GuildCategory && (
                    <Text color={"white"}>
                        {getChannelName(channel?.name)}
                    </Text>
                )}
            </Flex>
        </>
    );
};

const Channel = ({ channel }: { channel: BaseChannel; }) => {
    const [client] = useRecoilState(clientStore);

    return (
        <Flex
            py={1}
            ml={5}
            key={channel?.id}
            bg={
                channel?.id === client.currentChannel?.id
                    ? "brand.500"
                    : ""
            }
            userSelect={"none"}
        >
            <div>
                <Flex>
                    {channel.type !== constants.channelTypes.GuildCategory ? (
                        <Link
                            href={`/app/guilds/${channel?.guildId}/channels/${channel?.id}`}
                        >
                            <RawChannel channel={channel} />
                        </Link>
                    ) : (
                        <RawChannel channel={channel} />
                    )}
                </Flex>
            </div>
        </Flex>
    );
};

export default Channel;