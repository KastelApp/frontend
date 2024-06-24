import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import Draggables from "../DraggableComponent.tsx";
import { Avatar } from "@nextui-org/react";
import { NavBarIcon } from "./NavBarIcon.tsx";

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
        return <Draggables items={guilds} onDrop={console.log} orientation="horizontal"
        className="horizontal-scroll-content flex gap-3 w-screen"
            render={(item, index) => {
                let hasUnread = false;

                const gotChannels = getChannelsWithValidPermissions(item.id);

                for (const channel of gotChannels) {
                    if (item.channelProperties.find((channelProperty) => channelProperty.channelId === channel.id)?.lastMessageAckId !== channel.lastMessageId) {
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
                        contextMenuItemsProps={{
                            values: [
                                {
                                    label: "Test",
                                },
                            ],
                            placement: "right",
                        }}
                        hasUnReadMessages={hasUnread}
                        isActive={item.id === guildId}
                        orientation="horizontal"
                    />
                );
            }} />;
    }, [guilds, guildId]);

    return (
        <div className="fixed w-full z-20 h-14 items-center bottom-2 px-3">
            <div className="flex bg-charcoal-700 rounded-lg shadow-xl w-full h-full px-5 items-center">
                <div className="h-full py-2 ml-5 overflow-x-auto overflow-y-hidden horizontal-scroll-container scrollbar-hide" ref={scrollContainerRef}>
                    {mappedGuilds()}
                </div>
            </div>
        </div>
    );
};

export default BottomNavBar;