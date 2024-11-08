import ChannelIcon from "@/components/ChannelIcon.tsx";
import LiveDate from "@/components/LiveDate.tsx";
import { ChannelType } from "@/components/NavBars/ChannelNavBar.tsx";
import cn from "@/utils/cn.ts";
import { channelTypes, snowflake } from "@/utils/Constants.ts";
import { Routes } from "@/utils/Routes.ts";
import { useChannelStore, usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import { Button, Checkbox, Divider, Input } from "@nextui-org/react";
import { ChevronDown, GripVertical, Search } from "lucide-react";
import { useEffect, useState } from "react";

const HubChannels = ({
    hubId
}: {
    hubId: string;
}) => {
    const getSortedChannels = useChannelStore((state) => state.getSortedChannels);
    const [signal, setSignal] = useState(0);
    const foundHub = useHubStore((state) => state.getHub(hubId))!;
    const [normalChannels, setNormalChannels] = useState<ChannelType[]>([]);

    useEffect(() => {
        const unSubscribe = usePerChannelStore.subscribe(() => {
            setSignal((prev) => prev + 1);
        });

        return () => unSubscribe();
    }, []);

    useEffect(() => {
        const handledChannels: ChannelType[] = [];
        const gotChannels = getSortedChannels(hubId ?? "", true);

        for (const channel of gotChannels) {
            switch (channel.type) {
                case channelTypes.HubCategory: {
                    handledChannels.push({
                        name: channel.name,
                        id: channel.id,
                        type: channel.type,
                    });

                    break;
                }

                case channelTypes.HubText:
                case channelTypes.HubMarkdown:
                case channelTypes.HubNewMember:
                case channelTypes.HubNews:
                case channelTypes.HubRules: {
                    const foundChannel = foundHub.channelProperties.find((p) => p.channelId === channel.id);

                    let hasUnread = false;

                    if (
                        foundChannel?.lastMessageAckId !== channel.lastMessageId &&
                        snowflake.timeStamp(foundChannel?.lastMessageAckId ?? "0") <
                        snowflake.timeStamp(channel.lastMessageId ?? "0")
                    ) {
                        hasUnread = true;
                    }

                    handledChannels.push({
                        name: channel.name,
                        id: channel.id,
                        link: Routes.hubChannel(hubId, channel.id),
                        icon: <ChannelIcon type={channel.type} />,
                        description: channel.description,
                        hasUnread,
                        type: channel.type,
                        lastMessageId: channel.lastMessageId
                    });
                }
            }
        }

        console.log(handledChannels);

        setNormalChannels(handledChannels);
    }, [hubId, signal]);

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex h-screen flex-col overflow-x-hidden">
            <div className="h-full flex flex-col">
                <div className="p-4 flex">
                    <Input
                        placeholder="Search channels"
                        radius="sm"
                        startContent={<Search size={20} />}
                    />
                    <Button className="ml-2" variant="flat" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Edit Mode" : "Normal Mode"}
                    </Button>

                </div>
                <Divider />
                <div className="flex overflow-auto flex-col bg-darkAccent p-4 ml-2 mr-2 rounded-md mt-2">
                    {normalChannels.length === 0 && (
							<div className="flex items-center justify-center min-h-screen -mt-32">
								<div className="space-y-2 text-center">
									<h1 className="text-lg font-semibold text-white">No Text Channels</h1>
									<p className="w-96 text-gray-500">
										There's seems to be no text channels in this hub, or you do not have access to any
									</p>
								</div>
							</div>
						)}
                    {normalChannels.map((channel) => (
                        <div key={channel.id} className="flex w-full items-center justify-between hover:bg-charcoal-700 rounded-md active:scale-[0.996] transition-transform duration-200 ease-in-out">
                            <div className="flex-shrink-0 flex items-center justify-center">
                                <GripVertical className={cn("text-zinc-400 mm-hw-5", !isEditing && "invisible")} />
                            </div>
                            <div className="flex px-2 py-2 w-full cursor-pointer">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {channel.icon}
                                    <div className="truncate">
                                        <div className="font-medium truncate">
                                            {channel.name}
                                        </div>
                                        {(channel.type === channelTypes.HubText && (channel.lastMessageId || channel.description)) && (
                                            <div className="text-xs text-zinc-400 truncate">
                                                {channel.lastMessageId && (
                                                    <LiveDate date={new Date(snowflake.timeStamp(channel.lastMessageId))} format="detailed" />
                                                )}
                                                {channel.description && channel.lastMessageId && " · "}
                                                {channel.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-4 flex items-center justify-center">
                                    {channel.type === channelTypes.HubCategory && (
                                        <ChevronDown size={18} className="mr-2" />
                                    )}
                                    <Checkbox />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>

    );
};

export default HubChannels;