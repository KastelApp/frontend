import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import Draggables from "../DraggableComponent.tsx";
import { Avatar, Divider } from "@nextui-org/react";
import { NavBarIcon } from "./NavBarIcon.tsx";
import { Compass, Home, TriangleAlert } from "lucide-react";
import AddGuildButton from "../AddGuildButton.tsx";
import UserOptions from "../Dropdowns/UserOptions.tsx";
import { snowflake } from "@/utils/Constants.ts";

const BottomNavBar = () => {
    const { guilds } = useGuildStore();
    const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();
    const router = useRouter();

    const { guildId } = router.query as { guildId: string; };

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current!;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                scrollContainer.scrollLeft += e.deltaY;
            }
        };

        scrollContainer.addEventListener("wheel", onWheel);
        return () => {
            scrollContainer.removeEventListener("wheel", onWheel);
        };
    }, []);

    const mappedGuilds = useCallback(() => {
        return <Draggables
            disableGhostElement
            items={guilds.filter((guild) => !guild.unavailable && !guild.partial)}
            onDrop={console.log}
            orientation="horizontal"
            className="horizontal-scroll-content flex gap-3"
            render={(item, index) => {
                let hasUnread = false;

                const gotChannels = getChannelsWithValidPermissions(item.id);

                for (const channel of gotChannels) {
                    const foundChannel = item.channelProperties.find((channelProperty) => channelProperty.channelId === channel.id);
                    if (foundChannel?.lastMessageAckId !== channel.lastMessageId) {
                        if (foundChannel?.lastMessageAckId && channel.lastMessageId && snowflake.timeStamp(foundChannel.lastMessageAckId) > snowflake.timeStamp(channel.lastMessageId)) {
                            continue;
                        }

                        hasUnread = true;

                        break;
                    }
                }

                const topChannel = getTopChannel(item.id);

                return (
                    <NavBarIcon
                        href={`/app/guilds/${item.id}${topChannel ? `/channels/${topChannel.id}` : ""}`}
                        badgePosition="bottom-right"
                        badgeColor="danger"
                        // badgeContent={item.mentionCount === "0" ? undefined : item.mentionCount}
                        key={index}
                        icon={
                            <Avatar
                                name={item.name}
                                src={item.icon ?? undefined}
                                className="mt-1.5 w-10 h-10 rounded-3xl transition-all group-hover:rounded-xl duration-300 ease-in-out transform"
                                imgProps={{ className: "transition-none" }}
                            />
                        }
                        description={item.name}
                        contextMenuItemsProps={[
                            {
                                label: "Test",
                            },
                            {
                                label: "Test 2",
                            },
                            {
                                label: "Test 3",
                            },
                            {
                                label: "Test 4",
                                endContent: <>HI</>,
                                startContent: <>BYE</>,
                                subValues: [
                                    {
                                        label: "Cats"
                                    }
                                ]
                            }
                        ]}
                        hasUnReadMessages={hasUnread}
                        isActive={item.id === guildId}
                        orientation="horizontal"
                        contextMenuClassName="mb-16"
                    />
                );
            }} />;
    }, [guilds, guildId]);

    return (
        <div className="fixed w-full z-20 h-14 items-center bottom-2 px-3">
            <div className="flex bg-charcoal-700 rounded-lg shadow-xl w-full h-full px-5 items-center">
                <div className="flex gap-2">
                    <NavBarIcon
                        icon={<Home size={24} className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
                        isBackgroundDisabled
                        isNormalIcon
                        description="Home"
                        orientation="horizontal"
                        href="/app"
                    />
                    <NavBarIcon
                        icon={<Compass className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
                        description="Discover a Guild"
                        isDisabled
                        isNormalIcon
                        orientation="horizontal"
                    />
                </div>
                <Divider orientation="vertical" className="ml-2 h-10 w-0.5" />
                <div className="h-full py-2 ml-3 overflow-x-auto overflow-y-hidden horizontal-scroll-container gap-3" ref={scrollContainerRef}>
                    {mappedGuilds()}
                    <div className="horizontal-scroll-content flex gap-2">
                        <AddGuildButton orientation="horizontal" />
                        {guilds.filter((guild) => guild.unavailable).length > 0 &&
                            <NavBarIcon orientation="horizontal" isNormalIcon icon={
                                <TriangleAlert className="text-danger-500" strokeWidth={2.5} />
                            } description={`${guilds.filter((guild) => guild.unavailable).length} unavailable guilds`} />}
                    </div>
                </div>
                <div className="min-w-12" />
                <div className="flex gap-2 ml-auto">
                    <NavBarIcon
                        icon={
                            <div className="min-w-9 min-h-9 max-h-9 max-w-9">
                                <Avatar
                                    src="/icon-1.png"
                                    className="min-w-9 min-h-9 max-h-9 max-w-9 hover:scale-95 transition-all duration-300 ease-in-out transform"
                                    imgProps={{ className: "transition-none" }}
                                />
                            </div>
                        }
                        isBackgroundDisabled
                        badgeContent="9+"
                        badgePosition="bottom-right"
                        badgeColor="danger"
                        InContent={UserOptions as React.FC}
                        delay={1000}
                        isNormalIcon
                        orientation="horizontal"
                        type="normal"
                    />
                </div>
            </div>
        </div>
    );
};

export default BottomNavBar;
